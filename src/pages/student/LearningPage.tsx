import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Award,
  Filter,
  Layers,
  CheckCircle2,
  PlayCircle,
  TrendingDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CourseCard } from '../../components/CourseCard';

export const LearningPage: React.FC = () => {
  const { courses, topSkillGap, skillGaps, careerGoal } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredCourses = courses.filter((c) => {
    if (filterStatus === 'In Progress' && c.status !== 'In Progress') return false;
    if (filterStatus === 'Completed' && c.status !== 'Completed') return false;
    if (filterStatus === 'Not Started' && c.status && c.status !== 'Not Started') return false;
    return true;
  });

  const gapSkillsNames = skillGaps
    .filter((g) => g.status === 'Major Gap' || g.status === 'Improve')
    .map((g) => g.name.toLowerCase());

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-semibold text-indigo-200">
            <BookOpen className="w-3.5 h-3.5 text-indigo-300" />
            <span>Skill-Gap Driven Learning</span>
          </div>
          <h2 className="font-['Outfit'] text-2xl sm:text-3xl font-extrabold tracking-tight">
            Curated Career Courses
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Targeted courses specifically selected to resolve your identified skill gaps for <strong className="text-white">{careerGoal}</strong>.
          </p>
        </div>

        {topSkillGap && (
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shrink-0 max-w-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              Priority Gap
            </span>
            <p className="text-xs font-bold text-white mt-1">
              {topSkillGap.name} (-{topSkillGap.gap}%)
            </p>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Complete recommended courses to bridge this gap.
            </p>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', 'In Progress', 'Completed', 'Not Started'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              filterStatus === st
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {st} ({st === 'All' ? courses.length : courses.filter((c) => (c.status || 'Not Started') === st).length})
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const isGapTargeted = gapSkillsNames.includes(course.skillName.toLowerCase());
          return (
            <CourseCard
              key={course.id}
              course={course}
              isGapTargeted={isGapTargeted}
            />
          );
        })}
      </div>

    </div>
  );
};
