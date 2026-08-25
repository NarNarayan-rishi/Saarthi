import React, { useState } from 'react';
import {
  GraduationCap,
  Users2,
  Briefcase,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  Zap,
  BookOpen,
  LineChart,
  Compass,
  Building2,
  Award,
  Landmark,
} from 'lucide-react';
import { UserRole } from '../../types';
import { useApp } from '../../context/AppContext';

export const LoginPage: React.FC = () => {
  const { loginAsRole } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Set default demo emails when role changes
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (!isSignUp) {
      if (role === 'student') setEmail('rahul.sharma@sit.edu');
      else if (role === 'mentor') setEmail('vikram.rao@sit.edu');
      else if (role === 'recruiter') setEmail('s.jenkins@cloudscale-nextgen.tech');
      else if (role === 'institution') setEmail('dean.placements@sit.edu');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      loginAsRole(selectedRole, email || undefined);
      setIsLoading(false);
    }, 450);
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    setIsLoading(true);
    setSelectedRole(role);
    setTimeout(() => {
      loginAsRole(role);
      setIsLoading(false);
    }, 300);
  };

  const rolesConfig: {
    role: UserRole;
    title: string;
    icon: typeof GraduationCap;
    desc: string;
    badge: string;
    gradient: string;
    borderActive: string;
    bgActive: string;
    demoUser: string;
  }[] = [
    {
      role: 'student',
      title: 'Student',
      icon: GraduationCap,
      desc: 'Learn skills, follow career roadmaps, take tests, and prepare for internships and jobs.',
      badge: 'Learn & Get Hired',
      gradient: 'from-indigo-600 to-blue-600',
      borderActive: 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/40',
      bgActive: 'bg-indigo-600 text-white',
      demoUser: 'Rahul Sharma (Senior CS)',
    },
    {
      role: 'mentor',
      title: 'Mentor',
      icon: Users2,
      desc: 'Track student progress, assign tasks, conduct tests, answer doubts, and guide students.',
      badge: 'Track & Guide',
      gradient: 'from-emerald-600 to-teal-600',
      borderActive: 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/40',
      bgActive: 'bg-emerald-600 text-white',
      demoUser: 'Dr. Vikram Rao (Staff Architect & Prof)',
    },
    {
      role: 'recruiter',
      title: 'Recruiter',
      icon: Briefcase,
      desc: 'Discover talented students, review profiles, and connect with job-ready candidates.',
      badge: 'Discover Talent',
      gradient: 'from-amber-600 to-orange-600',
      borderActive: 'border-amber-600 ring-2 ring-amber-500/20 bg-amber-50/40',
      bgActive: 'bg-amber-600 text-white',
      demoUser: 'Sarah Jenkins (CloudScale Hiring Lead)',
    },
    {
      role: 'institution',
      title: 'Institution',
      icon: Landmark,
      desc: 'Monitor student development, internships, placements, industry demand and performance.',
      badge: 'Analytics & Placements',
      gradient: 'from-purple-600 to-indigo-600',
      borderActive: 'border-purple-600 ring-2 ring-purple-500/20 bg-purple-50/40',
      bgActive: 'bg-purple-600 text-white',
      demoUser: 'Dr. Aris Thorne (Dean of Placements)',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Background Decorative Lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-700 flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-indigo-400/30">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight text-white font-['Outfit']">
                Saar<span className="text-indigo-400">thi</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                Career Navigator
              </span>
            </div>
            <p className="text-xs text-slate-400">Career Guidance, Mentorship & Placement Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Role-Based Access Control</span>
          </div>
        </div>
      </header>

      {/* Main Authentication Section */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 my-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Intro & Feature Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/60 border border-indigo-700/50 text-indigo-300 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Next-Gen Academia-Industry Bridge</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight font-['Outfit']">
                Empowering Careers from Classroom to Industry
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                Connect students with structured learning roadmaps, mentors with real-time progress diagnostics, and recruiters with verified, job-ready candidates.
              </p>
            </div>

            {/* Role Capability Highlights */}
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-start gap-3 hover:border-slate-600 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Compass className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Personalized Career Roadmaps</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Step-by-step milestone progression tailored to specific roles like Full Stack, AI/ML, and Cloud.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-start gap-3 hover:border-slate-600 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <LineChart className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Live Mentor Diagnostics & Doubts</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Mentors assign tasks, launch live timed tests, and resolve student career doubts directly.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-start gap-3 hover:border-slate-600 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Building2 className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Recruiter Verified Talent Pool</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Filter candidates by job readiness score, review verified projects, and schedule interviews.</p>
                </div>
              </div>
            </div>

            {/* Quick 1-Click Demo Section */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant 1-Click Demo Login</span>
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleQuickDemoLogin('student')}
                  className="px-2.5 py-2 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/50 text-indigo-200 text-xs font-medium flex flex-col items-center justify-center gap-1 transition-all text-center"
                >
                  <span className="text-sm">🎓</span>
                  <span className="font-bold">Student</span>
                  <span className="text-[10px] text-indigo-400">Rahul Sharma</span>
                </button>
                <button
                  onClick={() => handleQuickDemoLogin('mentor')}
                  className="px-2.5 py-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-200 text-xs font-medium flex flex-col items-center justify-center gap-1 transition-all text-center"
                >
                  <span className="text-sm">👨‍🏫</span>
                  <span className="font-bold">Mentor</span>
                  <span className="text-[10px] text-emerald-400">Dr. Vikram Rao</span>
                </button>
                <button
                  onClick={() => handleQuickDemoLogin('recruiter')}
                  className="px-2.5 py-2 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-700/50 text-amber-200 text-xs font-medium flex flex-col items-center justify-center gap-1 transition-all text-center"
                >
                  <span className="text-sm">💼</span>
                  <span className="font-bold">Recruiter</span>
                  <span className="text-[10px] text-amber-400">Sarah Jenkins</span>
                </button>
                <button
                  onClick={() => handleQuickDemoLogin('institution')}
                  className="px-2.5 py-2 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-700/50 text-purple-200 text-xs font-medium flex flex-col items-center justify-center gap-1 transition-all text-center"
                >
                  <span className="text-sm">🏛️</span>
                  <span className="font-bold">Institution</span>
                  <span className="text-[10px] text-purple-400">Dr. Aris Thorne</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Role Selection & Login Form */}
          <div className="lg:col-span-7 bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/40 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
                  {isSignUp ? 'Create your account' : 'Welcome back'}
                </h2>
                <div className="flex items-center bg-slate-900/80 p-1 rounded-lg border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      !isSignUp ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      isSignUp ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                {isSignUp
                  ? 'Select your platform role and enter your details to get started.'
                  : 'Select your role below to access your dedicated workspace.'}
              </p>
            </div>

            {/* 4 Role Selection Cards */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {rolesConfig.map((item) => {
                  const isSelected = selectedRole === item.role;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => handleRoleSelect(item.role)}
                      className={`relative text-left p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? `bg-slate-700/80 ${
                              item.role === 'student'
                                ? 'border-indigo-500 ring-2 ring-indigo-500/30'
                                : item.role === 'mentor'
                                ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                                : item.role === 'recruiter'
                                ? 'border-amber-500 ring-2 ring-amber-500/30'
                                : 'border-purple-500 ring-2 ring-purple-500/30'
                            }`
                          : 'bg-slate-850 border-slate-700/80 hover:border-slate-600 hover:bg-slate-750'
                      }`}
                    >
                      {/* Active Checkmark Pill */}
                      {isSelected && (
                        <span
                          className={`absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-white ${
                            item.role === 'student'
                              ? 'bg-indigo-600'
                              : item.role === 'mentor'
                              ? 'bg-emerald-600'
                              : item.role === 'recruiter'
                              ? 'bg-amber-600'
                              : 'bg-purple-600'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                        </span>
                      )}

                      <div className="space-y-1.5">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isSelected
                              ? item.role === 'student'
                                ? 'bg-indigo-500 text-white'
                                : item.role === 'mentor'
                                ? 'bg-emerald-500 text-white'
                                : item.role === 'recruiter'
                                ? 'bg-amber-500 text-white'
                                : 'bg-purple-500 text-white'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-xs sm:text-sm text-white">{item.title}</span>
                          </div>
                          <p className="text-[10px] text-slate-300 mt-0.5 leading-tight line-clamp-2">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-slate-700/60 flex items-center justify-between text-[9px] font-medium text-slate-400">
                        <span className="truncate">{item.badge}</span>
                        <ArrowRight className="w-2.5 h-2.5 shrink-0" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Login / Sign-up Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={
                      selectedRole === 'student'
                        ? 'e.g. Rahul Sharma'
                        : selectedRole === 'mentor'
                        ? 'e.g. Dr. Vikram Rao'
                        : selectedRole === 'recruiter'
                        ? 'e.g. Sarah Jenkins'
                        : 'e.g. Dr. Aris Thorne'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={
                      email ||
                      (selectedRole === 'student'
                        ? 'rahul.sharma@sit.edu'
                        : selectedRole === 'mentor'
                        ? 'vikram.rao@sit.edu'
                        : selectedRole === 'recruiter'
                        ? 's.jenkins@cloudscale-nextgen.tech'
                        : 'dean.placements@sit.edu')
                    }
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@university.edu"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotModal(true);
                        setForgotSubmitted(false);
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password || 'password123'}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                  selectedRole === 'student'
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-600/30'
                    : selectedRole === 'mentor'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30'
                    : selectedRole === 'recruiter'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-600/30'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/30'
                } ${isLoading ? 'opacity-80' : ''}`}
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </span>
                ) : (
                  <>
                    <span>
                      {isSignUp
                        ? `Sign Up & Launch ${selectedRole.toUpperCase()} Dashboard`
                        : `Sign In as ${
                            selectedRole === 'student'
                              ? 'Student'
                              : selectedRole === 'mentor'
                              ? 'Mentor'
                              : selectedRole === 'recruiter'
                              ? 'Recruiter'
                              : 'Institution'
                          }`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-slate-400">
              <span>Selected Role Navigation: </span>
              <strong className="text-slate-200">
                {selectedRole === 'student' && 'Student → Student Dashboard & Career Roadmap'}
                {selectedRole === 'mentor' && 'Mentor → Mentor Dashboard & Student Progress'}
                {selectedRole === 'recruiter' && 'Recruiter → Recruiter Dashboard & Talent Pool'}
                {selectedRole === 'institution' && 'Institution → Performance, Internships, Placements & Gaps'}
              </strong>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 text-center text-xs text-slate-500 border-t border-slate-800 z-10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 AcademiaConnect Ecosystem. Built for Students, Mentors & Industry Recruiters.</p>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Enterprise SSO</span>
          <span>•</span>
          <span>Verified University Badges</span>
          <span>•</span>
          <span>FERPA Compliant</span>
        </div>
      </footer>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Reset Your Password</h3>
            {forgotSubmitted ? (
              <div className="p-4 bg-emerald-900/40 border border-emerald-700/50 rounded-xl space-y-2 text-emerald-200 text-sm">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Password Reset Link Dispatched</span>
                </div>
                <p className="text-xs text-emerald-300">
                  Instructions to reset your password have been sent to <strong>{forgotEmail || 'your registered email'}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setForgotSubmitted(true);
                }}
                className="space-y-3"
              >
                <p className="text-xs text-slate-400">
                  Enter your registered institutional or company email to receive password recovery instructions.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="e.g. rahul.sharma@sit.edu"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg shadow-md"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
