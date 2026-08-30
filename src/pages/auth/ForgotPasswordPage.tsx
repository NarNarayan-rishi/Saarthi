import React, { useState } from 'react';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const inputClass = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 bg-white text-sm";

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true); setError('');
    try {
      await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setCode('');
      setError('');
    } catch {
      setError('Failed to resend code');
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

          {/* Step 1 — Enter email */}
          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Forgot Password?</h2>
                <p className="text-slate-500 text-sm mt-1">
                  Enter your registered email and we'll send you a 6-digit reset code.
                </p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@gmail.com" required className={`${inputClass} pl-10`} />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60">
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
              <button type="button" onClick={() => { window.location.hash = '#/login'; }}
                className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium">
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
              </button>
            </form>
          )}

          {/* Step 2 — Enter code + new password */}
          {step === 2 && (
            <form onSubmit={handleReset} className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Enter Reset Code</h2>
                <p className="text-slate-500 text-sm mt-1">
                  A 6-digit code was sent to <b>{email}</b>. Enter it below with your new password.
                </p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">6-Digit Reset Code</label>
                <input value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="1  2  3  4  5  6" required maxLength={6}
                  className={`${inputClass} text-center text-2xl font-bold tracking-widest`} />
                <p className="text-xs text-slate-400 text-center mt-1.5">Code expires in 10 minutes</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type={showPass ? 'text' : 'password'} value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters" required className={`${inputClass} pl-10 pr-10`} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type={showConfirm ? 'text' : 'password'} value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password" required className={`${inputClass} pl-10 pr-10`} />
                  <button type="button
