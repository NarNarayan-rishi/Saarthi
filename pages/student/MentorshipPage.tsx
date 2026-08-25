import React, { useState } from 'react';
import {
  Users2,
  HelpCircle,
  CheckCircle2,
  Clock,
  Send,
  Calendar,
  Sparkles,
  BookOpen,
  ExternalLink,
  MessageSquare,
  PlayCircle,
  ShieldCheck,
  CheckSquare,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MentorshipPage: React.FC = () => {
  const {
    mentorProfile,
    mentorDoubts,
    askStudentDoubt,
    studentTasks,
    toggleStudentTask,
    mentorTests,
    setActiveTestModal,
    assessmentTests,
    profile,
  } = useApp();

  const [doubtQuestion, setDoubtQuestion] = useState('');
  const [doubtCategory, setDoubtCategory] = useState('Career Roadmap & Milestones');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAskDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtQuestion.trim()) return;
    setIsSubmitting(true);
    askStudentDoubt(doubtQuestion, doubtCategory);
    setDoubtQuestion('');
    setTimeout(() => {
      setIsSubmitting(false);
    }, 400);
  };

  // Student specific doubts
  const myDoubts = mentorDoubts.filter((d) => d.studentId === profile.id || d.studentName.toLowerCase().includes('rahul'));

  return (
    <div className="space-y-6">
      {/* Mentor Profile Header Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white border border-emerald-700/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={mentorProfile.avatar}
              alt={mentorProfile.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-emerald-400 shadow-md"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Assigned Faculty & Industry Mentor</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-['Outfit']">{mentorProfile.name}</h1>
              <p className="text-xs sm:text-sm text-emerald-100/90">{mentorProfile.title} • {mentorProfile.department}</p>
              <p className="text-xs text-slate-300 mt-1">
                Office Hours: <strong className="text-emerald-300">{mentorProfile.officeHours}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/80 text-xs space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Mentorship Domain</span>
              <p className="text-slate-200 font-semibold">{mentorProfile.specializations?.join(' • ')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Ask Doubts & Doubt History */}
        <div className="lg:col-span-7 space-y-6">
          {/* Ask Mentor a Question Composer */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">Ask Your Mentor a Question</h2>
            </div>
            <p className="text-xs text-slate-500">
              Need architecture guidance, project code review feedback, or interview prep direction? Submit your question below.
            </p>

            <form onSubmit={handleAskDoubt} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={doubtCategory}
                  onChange={(e) => setDoubtCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Career Roadmap & Milestones">Career Roadmap & Milestones</option>
                  <option value="Project Architecture & System Design">Project Architecture & System Design</option>
                  <option value="Technical Interview & DSA Prep">Technical Interview & DSA Prep</option>
                  <option value="Resume & Portfolio Feedback">Resume & Portfolio Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Question or Inquiry</label>
                <textarea
                  rows={3}
                  required
                  value={doubtQuestion}
                  onChange={(e) => setDoubtQuestion(e.target.value)}
                  placeholder="e.g. When designing microservices with Redis caching, how do I prevent cache stampedes under high concurrency?"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Send to Mentor'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Doubt Conversation History */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Your Mentor Inquiries & Solutions</h3>

            <div className="space-y-3">
              {myDoubts.length === 0 ? (
                <p className="text-xs text-slate-500 p-4 text-center">No doubts submitted yet. Ask your mentor above!</p>
              ) : (
                myDoubts.map((doubt) => (
                  <div
                    key={doubt.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 space-y-3 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">{doubt.category}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          doubt.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {doubt.status}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-900">Q: {doubt.question}</p>

                    {doubt.reply ? (
                      <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
                        <div className="flex items-center justify-between font-bold text-emerald-900 text-[11px]">
                          <span>Advice from {doubt.mentorName || mentorProfile.name}</span>
                          <span className="text-emerald-700 font-normal">{doubt.repliedAt}</span>
                        </div>
                        <p className="leading-relaxed">{doubt.reply}</p>
                        {doubt.attachedResources && doubt.attachedResources.length > 0 && (
                          <div className="pt-1 flex flex-wrap gap-2">
                            {doubt.attachedResources.map((res, i) => (
                              <a
                                key={i}
                                href={typeof res === 'string' ? res : res.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded-md text-[10px] text-emerald-800 border border-emerald-300 font-semibold hover:underline"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>{typeof res === 'string' ? 'Resource Document' : res.title}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic">
                        Sent {doubt.timestamp} • Pending mentor review
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Assigned Tasks & Scheduled Tests */}
        <div className="lg:col-span-5 space-y-6">
          {/* Tasks Assigned by Mentor */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Tasks Assigned by Mentor</h3>
              </div>
              <span className="text-xs font-bold text-indigo-600">
                {studentTasks.filter((t) => t.status === 'Completed').length}/{studentTasks.length} Done
              </span>
            </div>

            <div className="space-y-2.5">
              {studentTasks.map((t) => {
                const isCompleted = t.status === 'Completed';
                return (
                  <div
                    key={t.id}
                    onClick={() => toggleStudentTask(t.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isCompleted
                        ? 'bg-slate-50 border-slate-200 opacity-75'
                        : 'bg-white border-slate-200 hover:border-indigo-300 shadow-2xs'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                        isCompleted ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300'
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold ${
                            isCompleted ? 'line-through text-slate-500' : 'text-slate-900'
                          }`}
                        >
                          {t.title}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            t.priority === 'High'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {t.priority}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{t.description}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                        <span>Due: {t.deadline}</span>
                        <span>Assigned by {t.mentorName}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tests Scheduled by Mentor */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-slate-900 text-base">Mentor Assessment Tests</h3>
            </div>

            <div className="space-y-3">
              {mentorTests.map((mt) => (
                <div
                  key={mt.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{mt.topic}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        mt.status === 'Live'
                          ? 'bg-rose-100 text-rose-800 animate-pulse'
                          : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      {mt.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 flex justify-between">
                    <span>{mt.questionsCount} Qs • {mt.durationMinutes} mins</span>
                    <span className="font-semibold text-slate-700">{mt.difficulty}</span>
                  </div>

                  <button
                    onClick={() => {
                      const matchAss = assessmentTests.find((a) =>
                        a.title.toLowerCase().includes('react') || a.title.toLowerCase().includes('full stack')
                      ) || assessmentTests[0];
                      setActiveTestModal(matchAss);
                    }}
                    className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>Take Assessment Now</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
