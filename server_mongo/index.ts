import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose, { Schema } from 'mongoose';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/academiaconnect';
const JWT_SECRET = process.env.JWT_SECRET || 'saarthi_dev_secret_change_in_production';

app.use(cors({ origin: '*' }));
app.use(express.json());

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name:  { type: String, required: true },
  role:  { type: String, required: true, enum: ['student', 'recruiter', 'mentor', 'institution'] },
  passwordHash: { type: String },
  googleId:  { type: String },
  linkedinToken: { type: String, default: null },
  naukriToken:   { type: String, default: null },
  linkedinConnected: { type: Boolean, default: false },
  naukriConnected:   { type: Boolean, default: false },
  profile: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });

const JobSchema = new Schema({
  title:       { type: String, required: true },
  company:     { type: String, required: true },
  location:    { type: String },
  description: { type: String },
  requirements: [String],
  stipendOrSalary: { type: String },
  workMode:    { type: String },
  type:        { type: String },
  status:      { type: String, default: 'Active' },
  postedById:  { type: String, required: true },
  pipeline:    { type: Schema.Types.Mixed, default: [] },
  pipelinePublished: { type: Boolean, default: false },
  applicantsCount:   { type: Number, default: 0 },
}, { timestamps: true });

const ApplicationSchema = new Schema({
  opportunityId:  { type: String, required: true },
  opportunityTitle: { type: String },
  company:        { type: String },
  studentId:      { type: String, required: true },
  status:         { type: String, default: 'Applied' },
  appliedDate:    { type: String },
  notes:          { type: String },
  timeline:       [Schema.Types.Mixed],
  workMode:       { type: String },
  location:       { type: String },
  stipendOrSalary: { type: String },
  matchScoreAtApplication: { type: Number, default: 75 },
  source:         { type: String, default: 'Internal' },
}, { timestamps: true });

const MessageSchema = new Schema({
  senderName:   { type: String, required: true },
  senderId:     { type: String },
  recipientId:  { type: String, required: true },
  subject:      { type: String },
  messages:     [{ sender: String, text: String, timestamp: String }],
}, { timestamps: true });

const User        = mongoose.model('User', UserSchema);
const Job         = mongoose.model('Job', JobSchema);
const Application = mongoose.model('Application', ApplicationSchema);
const Message     = mongoose.model('Message', MessageSchema);

function makeToken(payload: object) {
  const header  = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body    = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig     = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
}

function verifyToken(token: string): any {
  const [header, body, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  if (sig !== expected) throw new Error('Invalid token');
  return JSON.parse(Buffer.from(body, 'base64url').toString());
}

function authMiddleware(req: Request, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    (req as any).user = verifyToken(authHeader.slice(7));
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok', message: 'MongoDB backend running!' }));

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, name, role, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already registered' });
    const passwordHash = crypto.createHash('sha256').update(password || 'demo').digest('hex');
    const user = await User.create({ email, name, role, passwordHash });
    const token = makeToken({ id: user._id, email: user.email, role: user.role, name: user.name });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    let user = await User.findOne({ email: email || `demo_${role}@saarthi.app` });
    if (!user) {
      const passwordHash = crypto.createHash('sha256').update(password || 'demo').digest('hex');
      user = await User.create({
        email: email || `demo_${role}@saarthi.app`,
        name: role === 'student' ? 'Rahul Sharma' : role === 'recruiter' ? 'Sarah Jenkins' : role === 'mentor' ? 'Dr. Vikram Rao' : 'Dr. Aris Thorne',
        role,
        passwordHash,
      });
    }
    const token = makeToken({ id: user._id, email: user.email, role: user.role, name: user.name });
    res.json({ token, user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById((req as any).user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.post('/api/auth/unlink', authMiddleware, async (req, res) => {
  try {
    const { platform } = req.body;
    const update: any = {};
    if (platform === 'linkedin') { update.linkedinToken = null; update.linkedinConnected = false; }
    if (platform === 'naukri')   { update.naukriToken = null;   update.naukriConnected   = false; }
    await User.findByIdAndUpdate((req as any).user.id, update);
    res.json({ message: `${platform} account successfully unlinked.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unlink' });
  }
});

app.get('/api/jobs', async (_req, res) => {
  try {
    const jobs = await Job.find({ status: { $in: ['Active', 'Published'] } }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

app.post('/api/jobs', authMiddleware, async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, postedById: (req as any).user.id });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create job' });
  }
});

app.put('/api/jobs/:id/pipeline', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { pipeline: req.body.pipeline }, { new: true });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update pipeline' });
  }
});

app.put('/api/jobs/:id/publish', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { pipelinePublished: true }, { new: true });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: 'Failed to publish pipeline' });
  }
});

app.get('/api/applications', authMiddleware, async (req, res) => {
  try {
    const apps = await Application.find({ studentId: (req as any).user.id }).sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

app.post('/api/applications', authMiddleware, async (req, res) => {
  try {
    const existing = await Application.findOne({ opportunityId: req.body.opportunityId, studentId: (req as any).user.id });
    if (existing) return res.status(400).json({ error: 'Already applied' });
    const app = await Application.create({ ...req.body, studentId: (req as any).user.id });
    await Job.findByIdAndUpdate(req.body.opportunityId, { $inc: { applicantsCount: 1 } });
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: 'Failed to apply' });
  }
});

app.get('/api/messages', authMiddleware, async (req, res) => {
  try {
    const msgs = await Message.find({ recipientId: (req as any).user.id }).sort({ createdAt: -1 });
    res.json(msgs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/messages', authMiddleware, async (req, res) => {
  try {
    const msg = await Message.create(req.body);
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.put('/api/messages/:id/reply', authMiddleware, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { $push: { messages: req.body } },
      { new: true }
    );
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send reply' });
  }
});

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
