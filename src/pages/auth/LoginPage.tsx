import React, { useState } from 'react';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export const LoginPage: React.FC = () => {
  const { loginAsRole } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');

  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 bg-white text-sm";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setStep(2);
    } catch (err: any) {
      if (err.message === 'Failed to fetch' || err.message.includes('NetworkError')) {
        console.warn('Backend offline, using demo mode');
        await loginAsRole('student', email);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid OTP');
      localStorage.setItem('saarthi_jwt_token', data.token);
      localStorage.setItem('saarthi_user_id', data.user.id);
      localStorage.setItem('saarthi_user_name', data.user.name);
      setUserRole(data.user.role as UserRole);
      setUserName(data.user.name);
      setUserId(data.user.id);
      await loginAsRole(data.user.role as UserRole, data.user.email);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true); setError('');
    try {
      await fetch(`${BACKEND_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      setOtp('');
    } catch {
      setError('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

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

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          {step === 1 && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Welcome back!</h2>
                <p className="text-slate-500 text-sm mt-1">Sign in to your Saarthi account</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@gmail.com" required className={`${inputClass} pl-10`} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <button type="button" onClick={() => { window.location.hash = '#/forgot-password'; }}
                    className="text-xs text-indigo-600 font-medium hover:underline">Forgot Password?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type={showPass ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Your password" required className={`${inputClass} pl-10 pr-10`} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
                {loading ? 'Verifying...' : <><span>Continue</span><ArrowRight className="w-4 h-4" /></>}
              </button>
              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 font-medium">or</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
              <div>
                <p className="text-xs text-center text-slate-500 mb-3 font-medium">Quick Demo Access</p>
                <div className="grid grid-cols-2 gap-2">
                  {(['student','recruiter','mentor','institution'] as UserRole[]).map(role => (
                    <button key={role} type="button" onClick={() => loginAsRole(role)}
                      className="px-3 py-2 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-xs font-bold text-slate-700 capitalize transition-colors">
                      {role === 'institution' ? '🏛️ Institution' : role === 'student' ? '🎓 Student' : role === 'recruiter' ? '💼 Recruiter' : '🧭 Mentor'}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-center text-sm text-slate-500">
                Don't have an account?{' '}
                <button type="button" onClick={() => { window.location.hash = '#/signup'; }}
                  className="text-indigo-600 font-bold hover:underline">Sign up</button>
              </p>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center">
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Two-Factor Verification</h2>
                <p className="text-slate-500 text-sm mt-1">
                  A 6-digit code was sent to<br/>
                  <b className="text-slate-800">{email}</b>
                </p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">Enter 6-Digit OTP</label>
                <input value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="• • • • • •" required maxLength={6}
                  className={`${inputClass} text-center text-3xl font-bold tracking-widest`} />
                <p className="text-xs text-slate-400 text-center mt-1.5">Code expires in 10 minutes</p>
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg text-center">{error}</p>}
              <button type="submit" disabled={loading || otp.length !== 6}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60">
                {loading ? 'Verifying OTP...' : 'Verify & Sign In'}
              </button>
              <div className="flex justify-between text-sm">
                <button type="button" onClick={() => { setStep(1); setOtp(''); setError(''); }}
                  className="text-slate-500 hover:text-slate-700 font-medium">← Change email</button>
                <button type="button" onClick={resendOtp} disabled={loading}
                  className="text-indigo-600 font-medium hover:underline disabled:opacity-50">Resend OTP</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
