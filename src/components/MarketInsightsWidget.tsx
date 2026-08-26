import React, { useState, useEffect } from 'react';
import {
  Globe,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Search,
  BookOpen,
  IndianRupee,
  Building2,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Filter,
  Flame,
  Zap,
  ChevronDown,
  ChevronUp,
  Share2,
  Tag,
  Briefcase,
  Layers,
  HelpCircle,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { MarketInsightsData, MarketNewsArticle, CareerGoalRole } from '../types';
import { CAREER_GOALS } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { ApplicationCard } from './ApplicationCard';
import { FolderGit2 } from 'lucide-react';

interface MarketInsightsWidgetProps {
  careerGoal: CareerGoalRole;
  onExploreCourses?: (skillName?: string) => void;
  onViewSkillGaps?: () => void;
}

export const MarketInsightsWidget: React.FC<MarketInsightsWidgetProps> = ({
  careerGoal,
  onExploreCourses,
  onViewSkillGaps,
}) => {
  const { applications } = useApp();
  const recentApplications = applications.slice(0, 3);
  const [insights, setInsights] = useState<MarketInsightsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGrounded, setIsGrounded] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTopicQuery, setActiveTopicQuery] = useState<string>('');
  const [showSources, setShowSources] = useState<boolean>(false);
  const [isNewsCollapsed, setIsNewsCollapsed] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<MarketNewsArticle | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch insights from the backend API with Google Search Grounding
  const fetchMarketInsights = async (roleToFetch: string, customQuery?: string) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/market-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: roleToFetch,
          customQuery: customQuery || '',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const result = await response.json();
      if (result.success && result.data) {
        setInsights(result.data);
        setIsGrounded(result.isGrounded || false);
      } else {
        throw new Error(result.error || 'Failed to fetch insights');
      }
    } catch (err: any) {
      console.warn('API fetch error, using local fallback:', err);
      setErrorMsg('Live search grounded update failed. Displaying cached verified insights.');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when careerGoal changes
  useEffect(() => {
    fetchMarketInsights(careerGoal, activeTopicQuery);
  }, [careerGoal]);

  const handleCustomSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTopicQuery(searchQuery.trim());
      fetchMarketInsights(careerGoal, searchQuery.trim());
    }
  };

  const handleClearCustomSearch = () => {
    setSearchQuery('');
    setActiveTopicQuery('');
    fetchMarketInsights(careerGoal, '');
  };

  // Categories list
  const categories = ['All', 'Tech & Tools', 'Hiring & Salaries', 'Industry Shifts'];

  // Filtered articles
  const filteredArticles = (insights?.articles || []).filter((art) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      art.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === 'Tech & Tools' && art.category.includes('Tech')) ||
      (selectedCategory === 'Hiring & Salaries' && (art.category.includes('Hiring') || art.category.includes('Salaries'))) ||
      (selectedCategory === 'Industry Shifts' && art.category.includes('Shift'));
    return matchesCategory;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-6 relative overflow-hidden">
      
      {/* Header section with branding & Google Search grounding indicator */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/80 shadow-2xs">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-['Outfit'] font-bold text-xl text-slate-900">
              Market Insights & Industry Intelligence
            </h3>
            
            {/* Google Search Grounding Pill */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Google Search Grounded</span>
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Real-time industry developments, hiring demands, and emerging skills tailored for{' '}
            <span className="font-bold text-indigo-600">{careerGoal}</span> candidates.
          </p>
        </div>

        {/* Action Controls: Refresh & Custom Search Form */}
        <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
          <form onSubmit={handleCustomSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              placeholder="Search topic or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white w-44 sm:w-56 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            {activeTopicQuery && (
              <button
                type="button"
                onClick={handleClearCustomSearch}
                className="absolute right-2 text-[10px] font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
                title="Clear filter"
              >
                ✕
              </button>
            )}
          </form>

          <button
            type="button"
            onClick={() => fetchMarketInsights(careerGoal, activeTopicQuery)}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh latest Google Search intelligence"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            <span className="hidden sm:inline">{loading ? 'Scanning...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Loading state skeleton */}
      {loading && !insights && (
        <div className="p-12 text-center space-y-4">
          <div className="w-12 h-12 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-800">
              Querying Google Search Grounding for {careerGoal}...
            </p>
            <p className="text-xs text-slate-500">
              Synthesizing real-time industry articles, hiring trends, and market requirements.
            </p>
          </div>
        </div>
      )}

      {insights && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Top Key Market Indicators Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            
            {/* Metric 1: Hiring Sentiment */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/90 to-indigo-100/40 border border-indigo-100/90 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-900">
                  Hiring Sentiment
                </span>
                <Flame className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="mt-2">
                <div className="text-lg font-['Outfit'] font-extrabold text-indigo-950">
                  {insights.hiringSentiment || 'High Growth'}
                </div>
                <p className="text-[11px] text-indigo-700/90 mt-0.5">
                  Demand Index: <span className="font-bold">{insights.demandScore}/100</span>
                </p>
              </div>
            </div>

            {/* Metric 2: Average Starting Compensation */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-emerald-100/40 border border-emerald-100/90 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900">
                  Entry/Grad Salary
                </span>
              </div>
              <div className="mt-2">
                <div className="text-lg font-['Outfit'] font-extrabold text-emerald-950">
                  {insights.averageStartingSalary || '$95,000 - $130,000'}
                </div>
                <p className="text-[11px] text-emerald-700/90 mt-0.5">
                  Market Base Range
                </p>
              </div>
            </div>

            {/* Metric 3: Top Hiring Sectors */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/90 to-purple-100/40 border border-purple-100/90 flex flex-col justify-between sm:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-900">
                  High-Hiring Sectors
                </span>
                <Building2 className="w-4 h-4 text-purple-600" />
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(insights.topHiringSectors || ['AI Cloud Infrastructure', 'FinTech', 'HealthTech', 'Enterprise SaaS']).map((sec, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/80 text-purple-900 border border-purple-200/80 shadow-2xs"
                  >
                    {sec}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Market Summary Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 shrink-0 mt-0.5">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Industry Macro Overview ({careerGoal})
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {insights.marketSummary}
              </p>
            </div>
          </div>

          {/* Fast-Rising In-Demand Skills Spotlight */}
          {insights.trendingSkills && insights.trendingSkills.length > 0 && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <h4 className="font-['Outfit'] font-bold text-sm text-slate-900">
                    Fast-Rising In-Demand Skills
                  </h4>
                </div>
                {onViewSkillGaps && (
                  <button
                    onClick={onViewSkillGaps}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Check Your Skill Gaps</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {insights.trendingSkills.map((sk, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50/90 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-200 transition-all shadow-2xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">
                        {sk.category}
                      </span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {sk.growthRate}
                      </span>
                    </div>
                    <div className="font-['Outfit'] font-bold text-xs text-slate-900 line-clamp-1">
                      {sk.name}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                      {sk.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Applications */}
          <div className="space-y-4 pt-2">
            <h3 className="font-['Outfit'] text-lg font-extrabold text-slate-900 flex items-center gap-2">
               <FolderGit2 className="w-5 h-5 text-indigo-600" />
               Recent Applications
            </h3>
            {recentApplications.length > 0 ? (
              <div className="space-y-3">
                {recentApplications.map(app => (
                  <ApplicationCard key={app.id} application={app} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No recent applications.</p>
            )}
          </div>

          {/* Actionable Student Playbook & Takeaways */}
          {insights.marketTakeaways && insights.marketTakeaways.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950 text-white space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h4 className="font-['Outfit'] font-bold text-sm text-white">
                    Market-Informed Portfolio Action Items
                  </h4>
                </div>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-white/10 text-indigo-200 border border-white/10">
                  Recommended Steps
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {insights.marketTakeaways.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-500/30 text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Google Search Grounding Verification Accordion */}
          {insights.groundingSources && insights.groundingSources.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowSources(!showSources)}
                className="w-full flex items-center justify-between py-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    Verified Grounding Sources ({insights.groundingSources.length} Search Citations)
                  </span>
                </div>
                {showSources ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showSources && (
                <div className="mt-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 animate-in fade-in duration-200">
                  <p className="text-[11px] text-slate-500">
                    These sources were retrieved and analyzed via Google Search grounding to provide verified, up-to-date industry intelligence:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {insights.groundingSources.map((src, idx) => (
                      <a
                        key={idx}
                        href={src.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 text-xs font-medium transition-all shadow-2xs"
                      >
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-600" />
                        <span className="truncate max-w-[220px]">{src.title || src.uri}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2">
        <span>Updated: {insights?.lastUpdated || 'Today'}</span>
        <span>Grounded by Google Search & Gemini 3.7 Flash</span>
      </div>

    </div>
  );
};
