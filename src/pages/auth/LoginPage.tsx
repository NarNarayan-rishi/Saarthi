import React, { useState, useEffect } from 'react';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export const LoginPage: React.FC = () => {
  const { loginAsRole } = useApp();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 bg-white text-sm";

  useEffect(() => {
    let interval: any;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: selectedRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setStep(2);
      setResendTimer(120); // 2 minutes
    } catch (err: any) {
      setError(err.message);
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
      
      // Use the role from the backend verification to ensure accuracy
      await loginAsRole(data.user.role as UserRole, data.user.email);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Saarthi</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          {step === 1 && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 text-center mb-4">Select Your Role</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                  {(['student', 'recruiter', 'mentor', 'institution'] as UserRole[]).map(r => (
                    <button key={r} type="button" onClick={() => setSelectedRole(r)}
                      className={`py-2 px-1 text-xs font-bold rounded-lg capitalize transition-all ${
                        selectedRole === r ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'
                      }`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@gmail.com" required className={`${inputClass} pl-10`} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" required className={`${inputClass} pl-10 pr-10`} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                {loading ? 'Verifying...' : <><span>Continue Login</span><ArrowRight className="w-4 h-4" /></>}
              </button>

              <div className="pt-4 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-500">
                  New to Saarthi? <button type="button" onClick={() => window.location.hash = '#/signup'} className="text-indigo-600 font-bold hover:underline">Create a new account</button>
                </p>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center">
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Enter OTP</h2>
                <p className="text-slate-500 text-sm mt-1">A 6-digit code was sent to<br/><b className="text-slate-800">{email}</b></p>
              </div>
              <div>
                <input value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="• • • • • •" required maxLength={6} className={`${inputClass} text-center text-3xl font-bold tracking-widest`} />
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg text-center">{error}</p>}
              <button type="submit" disabled={loading || otp.length !== 6} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl disabled:opacity-60">
                {loading ? 'Verifying...' : 'Verify & Enter'}
              </button>
              <div className="flex justify-between text-sm">
                <button type="button" onClick={() => { setStep(1); setOtp(''); setError(''); }} className="text-slate-500 hover:text-slate-700 font-medium">← Back</button>
                <button type="button" onClick={handleLogin} disabled={resendTimer > 0 || loading} className={`font-medium ${resendTimer > 0 ? 'text-slate-400' : 'text-indigo-600 hover:underline'}`}>
                  {resendTimer > 0 ? `Resend in ${formatTime(resendTimer)}` : 'Resend OTP'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
