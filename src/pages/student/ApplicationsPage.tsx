import React, { useState } from 'react';
import {
  FileCheck,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  Layers,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ApplicationCard } from '../../components/ApplicationCard';
import { ApplicationStatus } from '../../types';

export const ApplicationsPage: React.FC = () => {
  const { applications, activeApplicationsCount } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const statuses = ['All', 'Shortlisted', 'Interview', 'Under Review', 'Applied', 'Selected', 'Rejected'];

  const filteredApps = applications.filter((app) => {
    if (statusFilter !== 'All' && app.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = app.opportunityTitle.toLowerCase().includes(q);
      const matchComp = app.company.toLowerCase().includes(q);
      if (!matchTitle && !matchComp) return false;
    }
    return true;
  });

  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;
  const interviewCount = applications.filter((a) => a.status === 'Interview').length;
  const reviewCount = applications.filter((a) => a.status === 'Under Review').length;

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-['Outfit'] text-2xl font-extrabold text-slate-900">
              Application Tracker
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {activeApplicationsCount} Active Applications
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Monitor stages, review recruiter feedback, and track upcoming technical interview schedules.
          </p>
        </div>
      </div>

      {/* Mini Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-purple-50/80 rounded-2xl border border-purple-200 text-purple-900">
          <p className="text-xs font-bold uppercase tracking-wider text-purple-700">Shortlisted</p>
          <p className="font-['Outfit'] text-2xl font-extrabold mt-1">{shortlistedCount}</p>
        </div>
        <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-200 text-blue-900">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Interviews</p>
          <p className="font-['Outfit'] text-2xl font-extrabold mt-1">{interviewCount}</p>
        </div>
        <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 text-amber-900">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Under Review</p>
          <p className="font-['Outfit'] text-2xl font-extrabold mt-1">{reviewCount}</p>
        </div>
        <div className="p-4 bg-indigo-50/80 rounded-2xl border border-indigo-200 text-indigo-900">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-700">Total Applied</p>
          <p className="font-['Outfit'] text-2xl font-extrabold mt-1">{applications.length}</p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company or role..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-600 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* List of Applications */}
      {filteredApps.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <FileCheck className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-bold text-base text-slate-900">No applications match your filter</h3>
          <p className="text-xs text-slate-600">Apply to matching internships to populate your tracking pipeline.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}

    </div>
  );
};
