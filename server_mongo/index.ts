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
  if (!GMAIL_USER || !GMAIL_PASS) return;
  await transporter.sendMail({ from: `"Saarthi" <${GMAIL_USER}>`, to, subject, html });
}

// ─── Models ───────────────────────────────────────────────────────────────────
const UserSchema = new Schema({
  email:             { type: String, required: true, unique: true },
  name:              { type: String, required: true },
  role:              { type: String, required: true, enum: ['student','recruiter','mentor','institution'] },
  course:            { type: String, default: '' },
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
  // This field will store ALL their live data (skills, assessments, internships applied)
  profileData:       { type: Schema.Types.Mixed, default: {} },
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
  status:            { type: String, default: 'Active' },
  postedById:        { type: String, required: true },
  pipeline:          { type: Schema.Types.Mixed, default: [] },
  pipelinePublished: { type: Boolean, default: false },
  applicantsCount:   { type: Number, default: 0 },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const OTP  = mongoose.model('OTP', OTPSchema);
const Job  = mongoose.model('Job', JobSchema);

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

app.get('/api/health', (_req, res) => res.json({ status: 'ok', message: 'MongoDB backend running!' }));

// ─── Live Data Persistence Routes ─────────────────────────────────────────────
// Get user's live profile data
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById((req as any).user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// Update user's live profile data (skills, assessments, internships)
app.put('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const { profileData } = req.body;
    const user = await User.findByIdAndUpdate((req as any).user.id, { profileData }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile data' });
  }
});

// ─── Standard Auth (Email/OTP) ───────────────────────────────────────────────
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) return res.status(400).json({ error: 'No account found with this email' });
    if (user.get('passwordHash') !== hashPassword(password)) return res.status(400).json({ error: 'Incorrect password' });
    if (user.role !== role) return res.status(400).json({ error: `This account is registered as a ${user.role}, not a ${role}.` });

    await OTP.deleteMany({ email: email.toLowerCase(), type: 'login' });
    const code = generate6DigitCode();
    await OTP.create({ email: email.toLowerCase(), code, type: 'login', expiresAt: new Date(Date.now() + 10 * 60 * 1000) });

    await sendEmail(email, 'Saarthi — Your Login OTP',
      `<h2>Your One-Time Password</h2>
       <p>Use this code to complete your login. Expires in <b>10 minutes</b>.</p>
       <h1 style="letter-spacing:10px;color:#4F46E5;font-size:36px;">${code}</h1>`
    );
    res.json({ message: 'OTP sent' });
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, code } = req.body;
    const otpRecord = await OTP.findOne({ email: email.toLowerCase(), code, type: 'login', used: false, expiresAt: { $gt: new Date() } });
    if (!otpRecord) return res.status(400).json({ error: 'Invalid or expired OTP' });
    await OTP.findByIdAndUpdate(otpRecord._id, { used: true });
    
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const token = makeToken({ id: user._id, email: user.email, role: user.role, name: user.name });
    res.json({ token, user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role } });
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, name, password, role, course, college } = req.body;
    
    // Strict Backend Validation
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passRegex.test(password)) return res.status(400).json({ error: 'Password does not meet strict requirements' });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(400).json({ error: 'Email already exists' });

    await User.create({ 
      email: email.toLowerCase(), 
      name, role, course, college,
      passwordHash: hashPassword(password),
      profileData: {
        skills: [],
        applications: [],
        comprehensiveResults: {}
      } // Blank slate for new users!
    });
    res.json({ message: 'Account created' });
  } catch (err) { res.status(500).json({ error: 'Failed' }); }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  })
  .catch((err) => process.exit(1));
