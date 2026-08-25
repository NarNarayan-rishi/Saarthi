import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  Clock,
  Star,
  Users,
  CheckCircle2,
  ExternalLink,
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import { AdaptiveJourneyNode, Course } from '../types';
import { useApp } from '../context/AppContext';
import { CuratedCourseModal } from './CuratedCourseModal';
import { DOMAIN_RESOURCES } from '../data/coursesCatalogData';

interface CourseCardProps {
  course: Course;
  isGapTargeted?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isGapTargeted = false,
}) => {
  const { updateCourseProgress, completeJourneyNode, startComprehensiveRoleTest, careerGoal } = useApp();
  const [showModal, setShowModal] = useState(false);

  const getDifficultyBadge = (level: Course['level']) => {
    switch (level) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Intermediate':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  const handleProgressIncrement = () => {
    const current = course.progress || 0;
    const next = Math.min(100, current + 25);
    updateCourseProgress(course.id, next);
  };

  // Convert course to a temporary AdaptiveJourneyNode for the 3-choice modal
  const skillKey = Object.keys(DOMAIN_RESOURCES).find((k) =>
    k.toLowerCase().includes(course.skillName.toLowerCase().replace(/[^a-z0-9]/g, '')) ||
    course.title.toLowerCase().includes(k.toLowerCase())
  ) || 'html_css_basics';

  const catalog = DOMAIN_RESOURCES[skillKey] || DOMAIN_RESOURCES['html_css_basics'];

  const adaptedNode: AdaptiveJourneyNode = {
    id: `course_node_${course.id}`,
    level: 1,
    category: 'Skill Building',
    domainName: course.skillName,
    title: course.title,
    subtitle: `Offered by ${course.provider} (${course.level})`,
    description: course.description,
    nodeType: 'core_concept',
    status: course.status === 'Completed' ? 'completed' : 'current',
    expReward: 250,
    estimatedHours: course.duration,
    tags: [course.skillName, course.provider, course.level],
    reasonForInclusion: isGapTargeted
      ? `Specifically targeted to bridge your ${course.skillName} skill gap.`
      : `High-value industry course for your career roadmap.`,
    resources: {
      paid: {
        ...catalog.paid,
        title: `${course.title} | ${course.provider} | Coursera/Udemy`,
        provider: course.provider,
        url: course.url,
      },
      youtube: catalog.youtube,
      university: catalog.university,
    },
  };

  return (
    <>
      <div
        id={`course-card-${course.id}`}
        className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-indigo-200/80 transition-all duration-200 flex flex-col justify-between"
      >
        <div>
          {/* Top badge */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getDifficultyBadge(
                  course.level
                )}`}
              >
                {course.level}
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {course.skillName}
              </span>
            </div>

            {course.hasCertification && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                <Award className="w-3.5 h-3.5 text-purple-600" />
                Certificate
              </span>
            )}
          </div>

          {/* Highlight if gap targeted */}
          {isGapTargeted && (
            <div className="mb-3 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200/80 text-[11px] font-bold text-rose-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
              Recommended for your {course.skillName} gap
            </div>
          )}

          {/* Title and Provider */}
          <h4 className="font-['Outfit'] font-bold text-base text-slate-900 line-clamp-2">
            {course.title}
          </h4>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Offered by <span className="text-indigo-600 font-bold">{course.provider}</span>
          </p>

          <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
            {course.description}
          </p>

          {/* Stats: Duration, Rating, Students */}
          <div className="flex items-center gap-4 text-xs text-slate-600 mt-4 pt-3.5 border-t border-slate-100 flex-wrap">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1 font-bold text-slate-800">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              {course.rating}
            </span>
            <span className="flex items-center gap-1 font-medium">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              {course.studentsEnrolled.toLocaleString()} learners
            </span>
          </div>

          {/* In Progress Bar if started */}
          {course.progress !== undefined && course.progress > 0 && (
            <div className="mt-3.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1.5">
                <span>Learning Progress</span>
                <span>{course.progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${course.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'} rounded-full transition-all duration-300`}
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-2">
          {course.status === 'Completed' ? (
            <div className="w-full py-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Completed & Verified</span>
            </div>
          ) : (
            <div className="w-full flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Start! (3 Paths)</span>
              </button>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                title="View 3 curated options (Paid, YouTube, University)"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <CuratedCourseModal
          node={adaptedNode}
          onClose={() => setShowModal(false)}
          onCompleteLevel={(nodeId, expReward) => {
            updateCourseProgress(course.id, 100, 'Completed');
            completeJourneyNode(nodeId, expReward);
            setShowModal(false);
          }}
          onTakeAssessment={() => {
            setShowModal(false);
            startComprehensiveRoleTest(careerGoal);
          }}
        />
      )}
    </>
  );
};
