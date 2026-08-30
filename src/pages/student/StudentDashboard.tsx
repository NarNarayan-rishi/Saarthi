import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Briefcase,
  Target,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  FileText,
  Search
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StudentDashboard: React.FC = () => {
  const {
    profile,
    skillReadinessScore,
    profileCompletion,
    activeApplicationsCount,
    applications,
    opportunities,
    setActiveTab,
  } = useApp();

  // 1. GLANCEABLE METRIC CARDS (With Trend Indicators)
  const metrics = [
    { 
      label: 'Profile Completion', 
      value: `${profileCompletion}%`, 
      trend: '+5% this week', 
      isPositive: true, 
      icon: CheckCircle2,
      color: 'text-indigo-600',
      bg: 'bg-indigo-100'
    },
    { 
      label: 'Skill Readiness', 
      value: `${skillReadinessScore}%`, 
      trend: '+12% vs last month', 
      isPositive: true, 
      icon: Target,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100'
    },
    { 
      label: 'Active Applications', 
      value: activeApplicationsCount, 
      trend: 'On track', 
      isPositive: true, 
      icon: Briefcase,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    { 
      label: 'Pending Interviews', 
      value: 0, 
      trend: '-1 vs last month', 
      isPositive: false, 
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-100'
    },
  ];

  // Helper for Semantic Status Badges
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
      case 'hired':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending':
      case 'applied':
      case 'reviewing':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'rejected':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 font-sans animate-in fade-in duration-300">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {profile.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here is what's happening with your career journey today.
          </p>
        </div>
        
        {/* PRIMARY CTA */}
        <button 
          onClick={() => setActiveTab('jobs')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          Find Opportunities
        </button>
      </header>

      {/* GLANCEABLE METRIC CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  {metric.label}
                </p>
                <h3 className="text-2xl font-bold text-slate-900">{metric.value}</h3>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${metric.bg} ${metric.color}`}>
                <metric.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5">
              {metric.isPositive ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
              )}
              <span className={`text-xs font-medium ${metric.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {metric.trend}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* TWO-COLUMN LAYOUT FOR DATA DISPLAYS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Highly Scannable Applications List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Applications</h2>
            {/* SECONDARY CTA */}
            <button 
              onClick={() => setActiveTab('applications')}
              className="text-sm font-medium text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {applications.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {applications.slice(0, 4).map((app) => {
                  const job = opportunities.find(o => o.id === app.opportunityId);
                  if (!job) return null;
                  
                  return (
                    <div key={app.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 shrink-0">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{job.title}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">{job.company} • {job.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 shrink-0">
                        {/* PILL STATUS BADGE */}
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wide ${getStatusBadge(app.status)}`}>
                          {app.status}
                        </span>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* SYSTEM FEEDBACK: EMPTY STATE */
              <div className="p-10 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                  <FileText className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="font-bold text-slate-900">No applications yet</h3>
                <p className="text-sm text-slate-500 mt-1 mb-4 max-w-sm">
                  You haven't applied to any roles. Start exploring curated jobs that match your skills!
                </p>
                <button 
                  onClick={() => setActiveTab('jobs')}
                  className="bg-white border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Explore Roles
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: AI Recommendations / Next Best Action */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Recommended for You</h2>
          
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
            <Sparkles className="absolute top-4 right-4 w-24 h-24 text-white/10" />
            <div className="relative z-10">
              <span className="inline-block px-2.5 py-1 bg-white/20 rounded-md text-[11px] font-bold tracking-wider uppercase mb-3 border border-white/20">
                AI Suggestion
              </span>
              <h3 className="text-lg font-bold mb-2">Boost your Readiness</h3>
              <p className="text-indigo-100 text-sm mb-5 leading-relaxed">
                Taking the comprehensive assessment will instantly match you with 15+ curated roles.
              </p>
              <button 
                onClick={() => setActiveTab('assessment')}
                className="w-full bg-white text-indigo-700 hover:bg-indigo-50 font-bold py-2.5 rounded-lg text-sm transition-colors shadow-sm"
              >
                Take Assessment
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
