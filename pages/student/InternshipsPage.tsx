import React, { useState } from 'react';
import {
  Building2,
  Search,
  Filter,
  Sparkles,
  MapPin,
  Clock,
  DollarSign,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OpportunityCard } from '../../components/OpportunityCard';
import { WorkMode } from '../../types';

export const InternshipsPage: React.FC = () => {
  const { opportunities, setSelectedOpportunity, setApplyingOpportunity, searchQuery, setSearchQuery } = useApp();
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [minMatch, setMinMatch] = useState<number>(0);

  const internships = opportunities.filter((o) => o.type === 'Internship');

  const filteredInternships = internships.filter((opp) => {
    // Mode filter
    if (selectedMode !== 'All' && opp.workMode !== selectedMode) return false;
    // Match score filter
    if ((opp.matchScore || 0) < minMatch) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = opp.title.toLowerCase().includes(q);
      const matchCompany = opp.company.toLowerCase().includes(q);
      const matchSkills = opp.requiredSkills.some((s) => s.skillName.toLowerCase().includes(q));
      if (!matchTitle && !matchCompany && !matchSkills) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-['Outfit'] text-2xl font-extrabold text-slate-900">
              Internship Opportunities
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {filteredInternships.length} Positions Available
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Discover verified corporate and academic research internships with real-time weighted skill compatibility.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, company, skill..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-600 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Filters: Mode and Minimum Match Score */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <span>Work Mode:</span>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden"
            >
              <option value="All">All Modes</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <span>Min Match:</span>
            <select
              value={minMatch}
              onChange={(e) => setMinMatch(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden"
            >
              <option value="0">Any Match</option>
              <option value="70">70%+ Match</option>
              <option value="80">80%+ Match</option>
            </select>
          </div>
        </div>
      </div>

      {/* Opportunities Grid */}
      {filteredInternships.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="font-bold text-base text-slate-900">No internships match your filters</h3>
          <p className="text-xs text-slate-600">Try resetting filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInternships.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onViewDetails={(selected) => setSelectedOpportunity(selected)}
              onApply={(selected) => setApplyingOpportunity(selected)}
            />
          ))}
        </div>
      )}

    </div>
  );
};
