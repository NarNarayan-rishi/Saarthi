import React, { useState } from 'react';
import { GraduationCap, Mail, Lock, User, MapPin, Calendar, BookOpen, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const ROLES = [
  { value: 'student',     label: 'Student',     icon: '🎓', desc: 'Looking for jobs & internships' },
  { value: 'recruiter',   label: 'Recruiter',   icon: '💼', desc: 'Hiring talent for my company' },
  { value: 'mentor',      label: 'Mentor',      icon: '🧭', desc: 'Guiding students in their careers' },
  { value: 'institution', label: 'Institution', icon: '🏛️', desc: 'Managing campus placements' },
];

export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    email: '', name: '', role: 'student',
    college: '', year: '', location: '', age: '',
    password: '', confirmPassword: '',
  });

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.includes('@')) { setError('Enter a valid email address'); return; }
    setError('');
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Name is required'); return; }
    setError('');
    setStep(3);
  };

  const handleStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      setStep(4);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => { window.location.hash = '#/login'; };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 bg-white text-sm";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Saarthi</h1>
          <p className="text-slate-500 text-sm mt-1">Your Career Companion</p>
        </div>

        {step < 4 && (
          <div className="flex items-center gap-2 mb-6">
            {[1,2,3].map(s => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${step >= s ? 'bg-indigo-600' : 'bg-slate-200'}`} />
            ))}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">

          {/* Step 1 — Email + Role */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Create your account</h2>
                <p className="text-slate-500 text-sm mt-1">Step 1 of 3 — Enter your email</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Gmail Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                    placeholder="you@gmail.com" required className={`${inputClass} pl-10`} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">I am a...</label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map(r => (
                    <button type="button" key={r.value} onClick={() => set('role', r.value)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${form.role === r.value ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
                      <div className="text-lg">{r.icon}</div>
                      <div className="font-bold text-xs text-slate-800 mt-1">{r.label}</div>
                      <div className="text-xs text-slate-500">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              <button type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-center text-sm text-slate-500">
                Already have an account?{' '}
                <button type="button" onClick={goToLogin} className="text-indigo-600 font-bold hover:underline">Sign in</button>
              </p>
            </form>
          )}

          {/* Step 2 — Profile Details */}
          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Your profile details</h2>
                <p className="text-slate-500 text-sm mt-1">Step 2 of 3 — Tell us about yourself</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={form.name} onChange={e => set('name', e.target.value)}
                    placeholder="Your full name" required className={`${inputClass} pl-10`} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">College / University</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={form.college} onChange={e => set('college', e.target.value)}
                    placeholder="e.g. IIT Delhi" className={`${inputClass} pl-10`} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Year of Study</label>
                  <select value={form.year} onChange={e => set('year', e.target.value)} className={inputClass}>
                    <option value="">Select year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Alumni">Alumni</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Age</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="number" value={form.age} onChange={e => set('age', e.target.value)}
                      placeholder="e.g. 20" min="16" max="60" className={`${inputClass} pl-10`} />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={form.location} onChange={e => set('location', e.target.value)}
                    placeholder="e.g. Mumbai, Maharashtra" className={`${inputClass} pl-10`} />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors">
                  Back
                </button>
                <button type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Step 3 — Password */}
          {step === 3 && (
            <form onSubmit={handleStep3} className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Set your password</h2>
                <p className="text-slate-500 text-sm mt-1">Step 3 of 3 — Create a secure password</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type={showPass ? 'text' : 'password'} value={form.password}
                    onChange={e => set('password', e.target.value)}
                    placeholder="At least 6 characters" required className={`${inputClass} pl-10 pr-10`} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword}
                    onChange={e => set('confirmPassword', e.target.value)}
                    placeholder="Re-enter your password" required className={`${inputClass} pl-10 pr-10`} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                )}
                {form.confirmPassword && form.password === form.confirmPassword && form.password.length >= 6 && (
                  <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Passwords match!
                  </p>
                )}
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)}
                  className="flex-1 border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors">
                  Back
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          )}

          {/* Step 4 — Success */}
          {step === 4 && (
            <div className="text-center space-y-5">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Account Created! 🎉</h2>
                <p className="text-slate-500 text-sm mt-2">
                  Welcome to Saarthi, <b>{form.name}</b>!<br/>
                  A welcome email has been sent to <b>{form.email}</b>
                </p>
              </div>
              <button onClick={goToLogin}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors">
                Sign In Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
