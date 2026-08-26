import React from 'react';
import { ArrowLeft, BarChart3, Users, Clock, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';
import { PipelineStage, JobApplicant } from '../types';

interface PipelineAnalyticsProps {
  stage: PipelineStage;
  applicants: JobApplicant[];
  onBack: () => void;
}

export const PipelineAnalytics: React.FC<PipelineAnalyticsProps> = ({ stage, applicants, onBack }) => {
  // Generate mock analytics based on the applicants count
  const total = applicants.length || 10;
  const passed = Math.floor(total * 0.6);
  const failed = total - passed;
  const averageScore = stage.type === 'cbt_test' ? 78 : 85;
  
  // Mock individual scores
  const applicantResults = applicants.map((a, i) => ({
    ...a,
    score: Math.max(40, Math.floor(100 - (i * 5) + (Math.random() * 10))),
    status: i < passed ? 'Passed' : 'Failed'
  }));

  return (
    <div className="bg-white absolute inset-0 z-10 flex flex-col h-full rounded-3xl animate-in slide-in-from-right">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-3xl shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Level {stage.levelNumber}: {stage.title} Analytics
            </h2>
            <p className="text-sm text-slate-500">Performance distribution and candidate results</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Users className="w-5 h-5" /></div>
              <h3 className="font-semibold text-slate-600 text-sm">Total Attempted</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{total}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 className="w-5 h-5" /></div>
              <h3 className="font-semibold text-slate-600 text-sm">Passed Level</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{passed}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg"><XCircle className="w-5 h-5" /></div>
              <h3 className="font-semibold text-slate-600 text-sm">Failed Level</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{failed}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
              <h3 className="font-semibold text-slate-600 text-sm">Average Score</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{averageScore}%</p>
          </div>
        </div>

        {/* Mock Chart Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-slate-900 mb-6">Score Distribution (Mock Chart)</h3>
          <div className="h-48 flex items-end justify-between gap-2 px-4">
            {[45, 55, 65, 75, 85, 95].map((bin, i) => {
              const height = [10, 20, 40, 80, 100, 60][i]; // mock curve
              return (
                <div key={bin} className="flex flex-col items-center flex-1 gap-2">
                  <div 
                    className="w-full bg-indigo-200 rounded-t-md hover:bg-indigo-400 transition-colors relative group"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {Math.floor(height/10)} candidates
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{bin}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Individual Results</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider text-left">
                <tr>
                  <th className="px-5 py-3 font-medium">Candidate Name</th>
                  <th className="px-5 py-3 font-medium">Score</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {applicantResults.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-900">{res.candidate?.name || 'Unknown'}</td>
                    <td className="px-5 py-4 font-bold text-indigo-600">{res.score}%</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${res.status === 'Passed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs">View Report</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
