import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose, { Schema } from 'mongoose';
import crypto from 'crypto';
import * as nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/academiaconnect';
const JWT_SECRET = process.env.JWT_SECRET || 'saarthi_dev_secret_change_in_production';
const GMAIL_USER = process.env.GMAIL_USER || '';
const GMAIL_PASS = process.env.GMAIL_PASS || '';

app.use(cors({ origin: '*' }));
app.use(express.json());

// ─── Email ────────────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GMAIL_USER, pass: GMAIL_PASS },
});

async function sendEmail(to: string, subject: string, html: string) {
  if (!GMAIL_USER || !GMAIL_PASS) {
    console.log(`[EMAIL SKIPPED] To: ${to} | Subject: ${subject}`);
    return;
  }
  await transporter.sendMail({ from: `"Saarthi" <${GMAIL_USER}>`, to, subject, html });
}

// ─── Models ───────────────────────────────────────────────────────────────────
const UserSchema = new Schema({
  email:             { type: String, required: true, unique: true },
  name:              { type: String, required: true },
  role:              { type: String, required: true, enum: ['student','recruiter','mentor','institution'] },
  college:           { type: String, default: '' },
  year:              { type: String, default: '' },
  location:          { type: String, default: '' },
  age:               { type: String, default: '' },
  passwordHash:      { type: String, required: true },
  googleId:          { type: String },
  linkedinToken:     { type: String, default: null },
  naukriToken:       { type: String, default: null },
  linkedinConnected: { type: Boolean, default: false },
  naukriConnected:   { type: Boolean, default: false },
  profile:           { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });

const OTPSchema = new Schema({
  email:     { type: String, required: true },
  code:      { type: String, required: true },
  type:      { type: String, required: true, enum: ['login','reset'] },
  expiresAt: { type: Date, required: true },
  used:      { type: Boolean, default: false },
});

const JobSchema = new Schema({
  title:             { type: String, required: true },
  company:           { type: String, required: true },
  location:          { type: String },
  description:       { type: String },
  requirements:      [String],
  stipendOrSalary:   { type: String },
  workMode:          { type: String },
  type:              { type: String },
  status:            { type: String, default: 'Active' },
  postedById:        { type: String, required: true },
  pipeline:          { type: Schema.Types.Mixed, default: [] },
  pipelinePublished: { type: Boolean, default: false },
  applicantsCount:   { type: Number, default: 0 },
}, { timestamps: true });

const ApplicationSchema = new Schema({
  opportunityId:           { type: String, required: true },
  opportunityTitle:        { type: String },
  company:                 { type: String },
  studentId:               { type: String, required: true },
  status:                  { type: String, default: 'Applied' },
  appliedDate:             { type: String },
  notes:                   { type: String },
  timeline:                [Schema.Types.Mixed],
  workMode:                { type: String },
  location:                { type: String },
  stipendOrSalary:         { type: String },
  matchScoreAtApplication: { type: Number, default: 75 },
  source:                  { type: String, default: 'Internal' },
}, { timestamps: true });

const MessageSchema = new Schema({
  senderName:  { type: String, required: true },
  senderId:    { type: String },
  recipientId: { type: String, required: true },
  subject:     { type: String },
  messages:    [{ sender: String, text: String, timestamp: String }],
}, { timestamps: true });

const User        = mongoose.model('User', UserSchema);
const OTP         = mongoose.model('OTP', OTPSchema);
const Job         = mongoose.model('Job', JobSchema);
const Application = mongoose.model('Application', ApplicationSchema);
const Message     = mongoose.model('Message', MessageSchema);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function generate6DigitCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function makeToken(payload: object) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body   = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig    = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
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

// ─── Health ───────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', message: 'MongoDB backend running!' }));

// ─── Sign Up ──────────────────────────────────────────────────────────────────
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, name, password, confirmPassword, role, college, year, location, age } = req.body;
    if (!email || !name || !password || !role)
      return res.status(400).json({ error: 'Email, name, password and role are required' });
    if (password !== confirmPassword)
      return res.status(400).json({ error: 'Passwords do not match' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ error: 'An account with this email already exists' });

    await User.create({
      email: email.toLowerCase(), name, role,
      college: college || '', year: year || '',
      location: location || '', age: age || '',
      passwordHash: hashPassword(password),
    });

    await sendEmail(email, 'Welcome to Saarthi! 🎉',
      `<h2>Welcome to Saarthi, ${name}!</h2>
       <p>Your account has been created successfully.</p>
       <p><b>Email:</b> ${email}<br/><b>Role:</b> ${role}</p>
       <p>Sign in at <a href="https://saarthihelp.netlify.app">saarthihelp.netlify.app</a></p>`
    );

    res.json({ message: 'Account created successfully! Please sign in.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Signup failed. Please try again.' });
  }
});

// ─── Step 1: Verify password → Send OTP ──────────────────────────────────────
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ error: 'No account found with this email' });
    if (user.get('passwordHash') !== hashPassword(password))
      return res.status(400).json({ error: 'Incorrect password' });

    await OTP.deleteMany({ email: email.toLowerCase(), type: 'login' });
    const code = generate6DigitCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await OTP.create({ email: email.toLowerCase(), code, type: 'login', expiresAt });

    await sendEmail(email, 'Saarthi — Your Login OTP',
      `<h2>Your One-Time Password</h2>
       <p>Use this code to complete your login. Expires in <b>10 minutes</b>.</p>
       <h1 style="letter-spacing:10px;color:#4F46E5;font-size:36px;">${code}</h1>
       <p>If you did not request this, please ignore this email.</p>`
    );

    res.json({ message: 'OTP sent to your registered email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
  }
});

// ─── Step 2: Verify OTP → Return JWT ─────────────────────────────────────────
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, code } = req.body;
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(), code, type: 'login',
      used: false, expiresAt: { $gt: new Date() },
    });
    if (!otpRecord)
      return res.status(400).json({ error: 'Invalid or expired OTP. Please try again.' });

    await OTP.findByIdAndUpdate(otpRecord._id, { used: true });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const token = makeToken({ id: user._id, email: user.email, role: user.get('role'), name: user.get('name') });
    res.json({
      token,
      user: {
        id:       user._id.toString(),
        email:    user.get('email'),
        name:     user.get('name'),
        role:     user.get('role'),
        college:  user.get('college'),
        year:     user.get('year'),
        location: user.get('location'),
        age:      user.get('age'),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OTP verification failed. Please try again.' });
  }
});

// ─── Forgot Password: Send reset code ────────────────────────────────────────
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ error: 'No account found with this email' });

    await OTP.deleteMany({ email: email.toLowerCase(), type: 'reset' });
    const code = generate6DigitCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await OTP.create({ email: email.toLowerCase(), code, type: 'reset', expiresAt });

    await sendEmail(email, 'Saarthi — Password Reset Code',
      `<h2>Password Reset Request</h2>
       <p>Use this code to reset your password. Expires in <b>10 minutes</b>.</p>
       <h1 style="letter-spacing:10px;color:#4F46E5;font-size:36px;">${code}</h1>
       <p>If you did not request this, please ignore this email.</p>`
    );

    res.json({ message: 'Reset code sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send reset code. Please try again.' });
  }
});

// ─── Reset Password ───────────────────────────────────────────────────────────
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword)
      return res.status(400).json({ error: 'Passwords do not match' });
    if (newPassword.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(), code, type: 'reset',
      used: false, expiresAt: { $gt: new Date() },
    });
    if (!otpRecord)
      return res.status(400).json({ error: 'Invalid or expired reset code. Please request a new one.' });

    await OTP.findByIdAndUpdate(otpRecord._id, { used: true });
    await User.findOneAndUpdate({ email: email.toLowerCase() }, { passwordHash: hashPassword(newPassword) });

    res.json({ message: 'Password reset successfully! You can now sign in.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Password reset failed. Please try again.' });
  }
});

// ─── Get current user ─────────────────────────────────────────────────────────
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById((req as any).user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ─── Unlink LinkedIn/Naukri ───────────────────────────────────────────────────
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

// ─── Jobs ─────────────────────────────────────────────────────────────────────
app.get('/api/jobs', async (_req, res) => {
  try {
    const jobs = await Job.find({ status: { $in: ['Active','Published'] } }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch jobs' }); }
});

app.post('/api/jobs', authMiddleware, async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, postedById: (req as any).user.id });
    res.json(job);
  } catch (err) { res.status(500).json({ error: 'Failed to create job' }); }
});

app.put('/api/jobs/:id/pipeline', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { pipeline: req.body.pipeline }, { new: true });
    res.json(job);
  } catch (err) { res.status(500).json({ error: 'Failed to update pipeline' }); }
});

app.put('/api/jobs/:id/publish', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { pipelinePublished: true }, { new: true });
    res.json(job);
  } catch (err) { res.status(500).json({ error: 'Failed to publish pipeline' }); }
});

// ─── Applications ─────────────────────────────────────────────────────────────
app.get('/api/applications', authMiddleware, async (req, res) => {
  try {
    const apps = await Application.find({ studentId: (req as any).user.id }).sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch applications' }); }
});

app.post('/api/applications', authMiddleware, async (req, res) => {
  try {
    const existing = await Application.findOne({ opportunityId: req.body.opportunityId, studentId: (req as any).user.id });
    if (existing) return res.status(400).json({ error: 'Already applied' });
    const appDoc = await Application.create({ ...req.body, studentId: (req as any).user.id });
    await Job.findByIdAndUpdate(req.body.opportunityId, { $inc: { applicantsCount: 1 } });
    res.json(appDoc);
  } catch (err) { res.status(500).json({ error: 'Failed to apply' }); }
});

// ─── Messages ─────────────────────────────────────────────────────────────────
app.get('/api/messages', authMiddleware, async (req, res) => {
  try {
    const msgs = await Message.find({ recipientId: (req as any).user.id }).sort({ createdAt: -1 });
    res.json(msgs);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch messages' }); }
});

app.post('/api/messages', authMiddleware, async (req, res) => {
  try {
    const msg = await Message.create(req.body);
    res.json(msg);
  } catch (err) { res.status(500).json({ error: 'Failed to send message' }); }
});

app.put('/api/messages/:id/reply', authMiddleware, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { $push: { messages: req.body } }, { new: true });
    res.json(msg);
  } catch (err) { res.status(500).json({ error: 'Failed to send reply' }); }
});

// ─── Start ────────────────────────────────────────────────────────────────────
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
