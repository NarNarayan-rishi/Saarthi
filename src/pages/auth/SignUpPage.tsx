import React, { useState } from 'react';
import { GraduationCap, Mail, Lock, User, MapPin, BookOpen, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const ROLES = [
  { value: 'student', label: 'Student', icon: '🎓' },
  { value: 'recruiter', label: 'Recruiter', icon: '💼' },
  { value: 'mentor', label: 'Mentor', icon: '🧭' },
  { value: 'institution', label: 'Institution', icon: '🏛️' },
];

export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    email: '', name: '', role: 'student',
    course: '', college: '', 
    password: '', confirmPassword: '',
  });

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  // Strong password regex: 1 uppercase, 1 lowercase, 1 number, 1 special char, min 8
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.includes('@')) { setError('Enter a valid email address'); return; }
    setError(''); setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Name is required'); return; }
    setError(''); setStep(3);
  };

  const handleStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passRegex.test(form.password)) {
      setError('Password must be at least 8 characters, and contain at least one uppercase letter, one lowercase letter, one number, and one special symbol.');
      return;
    }
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

  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 bg-white text-sm";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Create an Account</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Select Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map(r => (
                    <button type="button" key={r.value} onClick={() => set('role', r.value)}
                      className={`p-3 rounded-xl border-2 text-left transition-all flex items-center gap-2 ${form.role === r.value ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
                      <span className="text-lg">{r.icon}</span>
                      <span className="font-bold text-xs text-slate-800">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@gmail.com" required className={`${inputClass} pl-10`} />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-center text-sm text-slate-500 mt-4">
                Already have an account? <button type="button" onClick={() => window.location.hash = '#/login'} className="text-indigo-600 font-bold hover:underline">Sign in</button>
              </p>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-4">
              <div><label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Your full name" className={inputClass} />
              </div>
              <div><label className="block text-xs font-bold text-slate-700 mb-1.5">Course Enrolled *</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={form.course} onChange={e => set('course', e.target.value)} required placeholder="e.g. B.Tech Computer Science" className={`${inputClass} pl-10`} />
                </div>
              </div>
              <div><label className="block text-xs font-bold text-slate-700 mb-1.5">College / Institution *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input value={form.college} onChange={e => set('college', e.target.value)} required placeholder="Your college name" className={`${inputClass} pl-10`} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)} className="flex-1 border border-slate-200 font-bold py-3 rounded-xl">Back</button>
                <button type="submit" className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl">Continue</button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleStep3} className="space-y-5">
              <div className="bg-blue-50 p-3 rounded-lg text-[10px] text-blue-800 font-medium">
                Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special symbol.
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} required className={`${inputClass} pl-10 pr-10`} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} required className={`${inputClass} pl-10 pr-10`} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(2)} className="flex-1 border border-slate-200 font-bold py-3 rounded-xl">Back</button>
                <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl">{loading ? 'Creating...' : 'Create Account'}</button>
              </div>
            </form>
          )}

          {step === 4 && (
            <div className="text-center space-y-5">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
              <h2 className="text-xl font-bold">Account Created! 🎉</h2>
              <p className="text-slate-500 text-sm">You can now sign in with your email and password.</p>
              <button onClick={() => window.location.hash = '#/login'} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl">Sign In Now</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
