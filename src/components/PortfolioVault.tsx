import React, { useState } from 'react';
import { Lock, Unlock, ShieldAlert, KeyRound, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';

const SECURITY_QUESTIONS = [
  "Favorite movie",
  "Best friend",
  "First School",
  "Favorite city"
];

export const PortfolioVault: React.FC = () => {
  const { vaultSettings, isVaultUnlocked, setupVault, unlockVault, resetVault } = useApp();
  
  const [view, setView] = useState<'unlock' | 'setup' | 'forgot'>('unlock');
  
  // Setup State
  const [setupPwd, setSetupPwd] = useState('');
  const [q1, setQ1] = useState(SECURITY_QUESTIONS[0]);
  const [a1, setA1] = useState('');
  const [q2, setQ2] = useState(SECURITY_QUESTIONS[1]);
  const [a2, setA2] = useState('');

  // Unlock State
  const [unlockPwd, setUnlockPwd] = useState('');
  const [unlockError, setUnlockError] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  // Reset State
  const [resetA1, setResetA1] = useState('');
  const [resetA2, setResetA2] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [resetError, setResetError] = useState(false);

  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (setupPwd && a1 && a2 && q1 !== q2) {
      setupVault(setupPwd, q1, a1, q2, a2);
    } else {
      alert("Please fill all fields and choose two different questions.");
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockVault(unlockPwd)) {
      setUnlockError(false);
    } else {
      setUnlockError(true);
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetVault(resetA1, resetA2, newPwd)) {
      setResetError(false);
    } else {
      setResetError(true);
    }
  };

  if (!vaultSettings?.isSetup) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-white rounded-3xl p-8 border border-indigo-100 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
            <ShieldAlert className="w-8 h-8" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900">Secure Your Digital Portfolio</h2>
          <p className="text-slate-600 mt-2 text-sm leading-relaxed mb-8">
            Since this is your first time accessing the portfolio section, you must create a Vault Password. This ensures your projects, certificates, and personal data remain private.
          </p>

          <form onSubmit={handleSetup} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Create Vault Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={setupPwd}
                  onChange={(e) => setSetupPwd(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter a strong password"
                />
                <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600">
                  {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 space-y-4">
              <h3 className="text-sm font-bold text-amber-900">Security Questions</h3>
              <p className="text-xs text-amber-700">These will be used to recover your vault if you forget your password.</p>
              
              <div className="space-y-3">
                <select value={q1} onChange={(e) => setQ1(e.target.value)} className="w-full p-2.5 bg-white border border-amber-200 rounded-lg text-sm text-slate-700">
                  {SECURITY_QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
                <input type="text" required placeholder="Answer" value={a1} onChange={(e) => setA1(e.target.value)} className="w-full p-2.5 bg-white border border-amber-200 rounded-lg text-sm" />
              </div>
              
              <div className="space-y-3 pt-2">
                <select value={q2} onChange={(e) => setQ2(e.target.value)} className="w-full p-2.5 bg-white border border-amber-200 rounded-lg text-sm text-slate-700">
                  {SECURITY_QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
                <input type="text" required placeholder="Answer" value={a2} onChange={(e) => setA2(e.target.value)} className="w-full p-2.5 bg-white border border-amber-200 rounded-lg text-sm" />
              </div>
            </div>

            <button type="submit" className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2">
              <Lock className="w-5 h-5" />
              Initialize Secure Vault
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (view === 'forgot' && vaultSettings) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl relative">
          <button onClick={() => setView('unlock')} className="absolute top-6 right-6 text-sm font-bold text-slate-400 hover:text-slate-700">Back</button>
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
            <KeyRound className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Reset Password</h2>
          <p className="text-sm text-slate-600 mb-6">Answer your security questions to reset your vault password.</p>
          
          <form onSubmit={handleReset} className="space-y-5">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-800">{vaultSettings.q1}</p>
              <input type="text" required value={resetA1} onChange={(e) => setResetA1(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Your Answer" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-800">{vaultSettings.q2}</p>
              <input type="text" required value={resetA2} onChange={(e) => setResetA2(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Your Answer" />
            </div>
            
            <div className="pt-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
              <input type="password" required value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Enter new password" />
            </div>

            {resetError && <p className="text-rose-600 text-sm font-semibold">Answers are incorrect.</p>}

            <button type="submit" className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg transition-all">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-slate-50 border-4 border-white shadow-xl flex items-center justify-center mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>
          <Lock className="w-8 h-8 text-indigo-600 relative z-10" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 text-center">Portfolio Vault</h2>
        <p className="text-slate-500 text-sm text-center mt-2 mb-8">Enter your vault password to access your digital portfolio.</p>

        <form onSubmit={handleUnlock} className="w-full space-y-4">
          <div className="relative">
            <input
              type={showPwd ? 'text' : 'password'}
              required
              value={unlockPwd}
              onChange={(e) => { setUnlockPwd(e.target.value); setUnlockError(false); }}
              className={`w-full pl-11 pr-11 py-3.5 bg-slate-50 border ${unlockError ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-indigo-500'} rounded-xl text-sm focus:ring-2`}
              placeholder="Vault Password"
            />
            <KeyRound className={`w-5 h-5 absolute left-4 top-3.5 ${unlockError ? 'text-rose-400' : 'text-slate-400'}`} />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600">
              {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {unlockError && <p className="text-rose-600 text-xs font-bold px-1">Incorrect password. Please try again.</p>}

          <button type="submit" className="w-full py-3.5 bg-indigo-900 hover:bg-indigo-800 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
            Unlock Vault
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>

        <button onClick={() => setView('forgot')} className="mt-6 text-sm font-semibold text-indigo-600 hover:text-indigo-800">
          Forgot Password?
        </button>
      </div>
    </div>
  );
};
