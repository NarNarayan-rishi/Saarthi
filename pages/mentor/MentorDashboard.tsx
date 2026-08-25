import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users2,
  LineChart,
  Trophy,
  PlayCircle,
  PlusCircle,
  HelpCircle,
  User,
  Settings as SettingsIcon,
  LogOut,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Calendar,
  Send,
  BookOpen,
  ArrowRight,
  TrendingUp,
  FileText,
  MessageSquare,
  Award,
  ExternalLink,
  ChevronRight,
  BarChart2,
  X,
  Target,
  Edit3,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MentorStudent, MentorTask, MentorTest, MentorDoubt } from '../../types';

export const MentorDashboard: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    mentorProfile,
    updateMentorProfile,
    mentorStudents,
    mentorTasks,
    mentorTests,
    mentorDoubts,
    selectedStudentForDetail,
    setSelectedStudentForDetail,
    assignMentorTask,
    updateMentorTaskStatus,
    createMentorTest,
    startMentorTest,
    replyToMentorDoubt,
    resolveMentorDoubt,
    updateStudentMentorNotes,
    logout,
    switchRole,
  } = useApp();

  // Local state for modals & forms
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
  const [showCreateTestModal, setShowCreateTestModal] = useState(false);
  const [selectedDoubtForReply, setSelectedDoubtForReply] = useState<MentorDoubt | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyResource, setReplyResource] = useState('');

  // Form states: Assign Task
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskType, setTaskType] = useState<MentorTask['type']>('Coding Problem');
  const [taskPriority, setTaskPriority] = useState<MentorTask['priority']>('High');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskAssignedStudents, setTaskAssignedStudents] = useState<string[]>(['all']);

  // Form states: Create Test
  const [testTopic, setTestTopic] = useState('');
  const [testCategory, setTestCategory] = useState('Frontend Development');
  const [testDifficulty, setTestDifficulty] = useState<MentorTest['difficulty']>('Intermediate');
  const [testDuration, setTestDuration] = useState(45);
  const [testQuestionsCount, setTestQuestionsCount] = useState(15);
  const [testScheduledDate, setTestScheduledDate] = useState('2026-03-02 at 04:00 PM');

  // Search and filter in students list
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilterDomain, setStudentFilterDomain] = useState('All');

  // Student mentor note editor in drawer
  const [editingNote, setEditingNote] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);

  // Statistics calculation
  const totalStudents = mentorStudents.length;
  const avgReadiness = Math.round(
    mentorStudents.reduce((acc, s) => acc + s.jobReadinessScore, 0) / (totalStudents || 1)
  );
  const activeTasksCount = mentorTasks.filter((t) => t.status === 'Pending').length;
  const pendingDoubtsCount = mentorDoubts.filter((d) => d.status === 'Pending').length;
  const liveOrScheduledTests = mentorTests.filter((t) => t.status === 'Live' || t.status === 'Scheduled').length;

  const filteredStudents = mentorStudents.filter((s) => {
    const matchesQuery =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.careerGoal.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.college.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesDomain =
      studentFilterDomain === 'All' || s.careerGoal.toLowerCase().includes(studentFilterDomain.toLowerCase());
    return matchesQuery && matchesDomain;
  });

  const topStudentsList = [...mentorStudents].sort((a, b) => b.jobReadinessScore - a.jobReadinessScore);

  // Handlers
  const handleAssignTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !taskDeadline) return;

    let targetIds = taskAssignedStudents;
    let targetNames = ['All Batch Students'];
    if (!taskAssignedStudents.includes('all')) {
      targetNames = mentorStudents
        .filter((s) => taskAssignedStudents.includes(s.id))
        .map((s) => s.name);
    }

    assignMentorTask({
      title: taskTitle,
      description: taskDesc,
      type: taskType,
      priority: taskPriority,
      deadline: taskDeadline,
      assignedToStudentIds: targetIds,
      assignedStudentNames: targetNames,
      status: 'Pending',
    });

    setTaskTitle('');
    setTaskDesc('');
    setTaskDeadline('');
    setShowAssignTaskModal(false);
  };

  const handleCreateTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTopic) return;

    createMentorTest({
      topic: testTopic,
      difficulty: testDifficulty,
      durationMinutes: testDuration,
      questionsCount: testQuestionsCount,
      scheduledDate: testScheduledDate,
      assignedStudentsCount: mentorStudents.length,
    });

    setTestTopic('');
    setShowCreateTestModal(false);
  };

  const handleReplyDoubtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoubtForReply || !replyText.trim()) return;

    replyToMentorDoubt(
      selectedDoubtForReply.id,
      replyText.trim(),
      replyResource.trim() ? [{ title: 'Mentor Resource', url: replyResource.trim(), type: 'doc' }] : undefined
    );

    setSelectedDoubtForReply(null);
    setReplyText('');
    setReplyResource('');
  };

  return (
    <div className="space-y-6">
      {/* Mentor Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-emerald-700/40 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mentor Command Center • Batch 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit']">
              Welcome back, {mentorProfile.name}
            </h1>
            <p className="text-sm text-emerald-100/80 leading-relaxed">
              {mentorProfile.title} • {mentorProfile.department} ({mentorProfile.institution})
            </p>
            <p className="text-xs text-slate-300">
              Specialization: <span className="text-emerald-300 font-medium">{mentorProfile.specializations?.join(' • ')}</span>
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-mentor-assign-task"
              onClick={() => setShowAssignTaskModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-700/40 flex items-center gap-2 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Assign New Task</span>
            </button>
            <button
              id="btn-mentor-start-test"
              onClick={() => setShowCreateTestModal(true)}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-700/40 flex items-center gap-2 transition-all cursor-pointer"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Launch / Schedule Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Students</span>
            <Users2 className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalStudents}</p>
          <p className="text-[11px] text-slate-500 mt-1">Under active mentorship</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Avg Batch Readiness</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">{avgReadiness}%</p>
          <p className="text-[11px] text-slate-500 mt-1">+8% from last month</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Active Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{activeTasksCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">In progress milestones</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Pending Doubts</span>
            <HelpCircle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-600">{pendingDoubtsCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">Awaiting mentor resolution</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Tests & Quizzes</span>
            <BarChart2 className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{mentorTests.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">{liveOrScheduledTests} active/scheduled</p>
        </div>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (8 cols): Recent Doubts & Active Tasks */}
            <div className="lg:col-span-8 space-y-6">
              {/* Unresolved Student Doubts Section */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    <h3 className="font-bold text-slate-900 text-base">Student Career & Technical Doubts</h3>
                    {pendingDoubtsCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                        {pendingDoubtsCount} Pending
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setActiveTab('doubts')}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {mentorDoubts.slice(0, 3).map((doubt) => (
                    <div
                      key={doubt.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img
                            src={doubt.studentAvatar}
                            alt={doubt.studentName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="font-bold text-slate-900">{doubt.studentName}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500">{doubt.careerGoal}</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            doubt.status === 'Resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {doubt.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-800 font-medium">{doubt.question}</p>

                      {doubt.reply ? (
                        <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200/80 text-xs text-emerald-900 space-y-1">
                          <p className="font-semibold text-[11px] text-emerald-800">
                            Your Guidance ({doubt.repliedAt || 'Recently'}):
                          </p>
                          <p>{doubt.reply}</p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-slate-400">Asked {doubt.timestamp}</span>
                          <button
                            onClick={() => {
                              setSelectedDoubtForReply(doubt);
                              setReplyText('');
                            }}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                          >
                            <Send className="w-3 h-3" />
                            <span>Reply to Student</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Mentor Tasks & Progress */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-slate-900 text-base">Assigned Milestone Tasks</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('assign_task')}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  >
                    <span>Manage Tasks</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {mentorTasks.map((task) => {
                    const completionRate = Math.round((task.completedCount / (task.totalAssigned || 1)) * 100);
                    return (
                      <div
                        key={task.id}
                        className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                task.priority === 'High'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {task.priority} Priority
                            </span>
                            <span className="text-xs font-semibold text-slate-500">{task.type}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Due {task.deadline}</span>
                          </div>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900">{task.title}</h4>
                        <p className="text-xs text-slate-600 line-clamp-2">{task.description}</p>

                        <div className="pt-2 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 flex-1 max-w-xs">
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-emerald-500 h-full rounded-full transition-all"
                                style={{ width: `${completionRate}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-bold text-slate-700">{completionRate}%</span>
                          </div>
                          <span className="text-[11px] text-slate-500">
                            {task.completedCount}/{task.totalAssigned} Students Completed
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column (4 cols): Live Tests & Top Performers */}
            <div className="lg:col-span-4 space-y-6">
              {/* Live & Scheduled Tests Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="w-5 h-5 text-teal-600" />
                    <h3 className="font-bold text-slate-900 text-sm">Tests & Assessments</h3>
                  </div>
                  <button
                    onClick={() => setShowCreateTestModal(true)}
                    className="text-xs text-teal-600 hover:text-teal-800 font-bold"
                  >
                    + New
                  </button>
                </div>

                <div className="space-y-3">
                  {mentorTests.map((test) => (
                    <div
                      key={test.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{test.topic}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            test.status === 'Live'
                              ? 'bg-rose-100 text-rose-700 animate-pulse'
                              : test.status === 'Completed'
                              ? 'bg-slate-200 text-slate-700'
                              : 'bg-teal-100 text-teal-800'
                          }`}
                        >
                          {test.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>{test.durationMinutes} mins • {test.questionsCount} questions</span>
                        <span className="font-semibold text-slate-700">{test.difficulty}</span>
                      </div>

                      {test.status === 'Scheduled' && (
                        <button
                          onClick={() => startMentorTest(test.id)}
                          className="w-full mt-2 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>Start Test Live Now</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Students Mini Leaderboard */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <h3 className="font-bold text-slate-900 text-sm">Top Ready Students</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('top_students')}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
                  >
                    Leaderboard
                  </button>
                </div>

                <div className="space-y-2.5">
                  {topStudentsList.slice(0, 4).map((st, idx) => (
                    <div
                      key={st.id}
                      onClick={() => setSelectedStudentForDetail(st)}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 bg-slate-50/50 hover:bg-indigo-50/30 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <img src={st.avatar} alt={st.name} className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{st.name}</p>
                          <p className="text-[10px] text-slate-500">{st.careerGoal}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-600">{st.jobReadinessScore}%</span>
                        <span className="block text-[9px] text-slate-400">{st.testHistory?.length || 0} tests</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* "My Students" Tab View */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Assigned Student Cohort</h2>
              <p className="text-xs text-slate-500">
                Track individualized skill profiles, milestones, and assessment history.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search by name, college..."
                  className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <select
                value={studentFilterDomain}
                onChange={(e) => setStudentFilterDomain(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Career Goals</option>
                <option value="Full Stack">Full Stack</option>
                <option value="Frontend">Frontend</option>
                <option value="Data">Data Science</option>
                <option value="Cloud">Cloud & DevOps</option>
              </select>
            </div>
          </div>

          {/* Students Cohort Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Student</th>
                  <th className="p-3.5">Target Goal</th>
                  <th className="p-3.5">Readiness</th>
                  <th className="p-3.5">Pending Tasks</th>
                  <th className="p-3.5">Attendance</th>
                  <th className="p-3.5">Last Active</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img src={st.avatar} alt={st.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-slate-900">{st.name}</p>
                          <p className="text-[10px] text-slate-400">{st.college} • {st.currentYear}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-medium text-slate-800">{st.careerGoal}</span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              st.jobReadinessScore >= 80
                                ? 'bg-emerald-500'
                                : st.jobReadinessScore >= 65
                                ? 'bg-blue-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${st.jobReadinessScore}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-900">{st.jobReadinessScore}%</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-medium">
                      {st.pendingTasksCount} pending
                    </td>
                    <td className="p-3.5 font-medium text-slate-600">{st.attendanceRate}%</td>
                    <td className="p-3.5 text-slate-500">{st.lastActive}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedStudentForDetail(st);
                          setEditingNote(st.mentorNotes || '');
                          setIsEditingNote(false);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 transition-colors"
                      >
                        View Profile & Notes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* "Top Students" Leaderboard Tab */}
      {activeTab === 'top_students' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div>
            <div className="flex items-center gap-2 text-amber-600 mb-1">
              <Trophy className="w-5 h-5" />
              <h2 className="text-xl font-bold text-slate-900">Student Placement Readiness Leaderboard</h2>
            </div>
            <p className="text-xs text-slate-500">
              Ranked by verified skills, assessment test scores, and project completion metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topStudentsList.slice(0, 3).map((st, idx) => (
              <div
                key={st.id}
                className={`p-5 rounded-2xl border relative overflow-hidden transition-all ${
                  idx === 0
                    ? 'bg-gradient-to-b from-amber-50/60 to-white border-amber-300 ring-2 ring-amber-400/20'
                    : idx === 1
                    ? 'bg-gradient-to-b from-slate-50 to-white border-slate-300'
                    : 'bg-gradient-to-b from-orange-50/40 to-white border-orange-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`w-7 h-7 rounded-full font-bold text-xs flex items-center justify-center shadow-xs ${
                      idx === 0
                        ? 'bg-amber-500 text-white'
                        : idx === 1
                        ? 'bg-slate-400 text-white'
                        : 'bg-orange-400 text-white'
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                    {st.jobReadinessScore}% Ready
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <img src={st.avatar} alt={st.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{st.name}</h3>
                    <p className="text-xs text-slate-500">{st.careerGoal}</p>
                    <p className="text-[10px] text-slate-400">{st.college}</p>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Tests Completed:</span>
                    <strong className="text-slate-900">{st.testHistory?.length || 0}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Courses Completed:</span>
                    <strong className="text-slate-900">{st.completedCoursesCount}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>CGPA:</span>
                    <strong className="text-slate-900">{st.cgpa}</strong>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStudentForDetail(st)}
                  className="w-full mt-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  View Verified Credentials
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* "Student Doubts" Tab */}
      {activeTab === 'doubts' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Student Doubts & Career Guidance Requests</h2>
              <p className="text-xs text-slate-500">
                Direct inquiries from students regarding project architectures, interview prep, and roadmaps.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {mentorDoubts.map((doubt) => (
              <div
                key={doubt.id}
                className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 space-y-3 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={doubt.studentAvatar} alt={doubt.studentName} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{doubt.studentName}</h4>
                      <p className="text-[11px] text-slate-400">{doubt.careerGoal} • {doubt.category}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      doubt.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {doubt.status}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-800 leading-relaxed font-medium">
                  "{doubt.question}"
                </div>

                {doubt.reply ? (
                  <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
                    <div className="flex items-center justify-between font-bold text-emerald-900">
                      <span>Guidance provided by {doubt.mentorName || mentorProfile.name}</span>
                      <span className="text-[10px] text-emerald-700">{doubt.repliedAt}</span>
                    </div>
                    <p className="leading-relaxed">{doubt.reply}</p>
                    {doubt.attachedResources && doubt.attachedResources.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-2">
                        {doubt.attachedResources.map((res, i) => (
                          <a
                            key={i}
                            href={res}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white rounded-md text-[11px] text-emerald-800 border border-emerald-300 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Recommended Learning Resource</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-400">Asked {doubt.timestamp}</span>
                    <button
                      onClick={() => {
                        setSelectedDoubtForReply(doubt);
                        setReplyText('');
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Answer Question</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* "Start a Test" / "Assign Task" Direct Tab Views */}
      {activeTab === 'start_test' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Launch or Schedule Student Assessment Tests</h2>
            <p className="text-xs text-slate-500">
              Create structured quizzes, coding challenges, and mock technical assessments for your cohort.
            </p>
          </div>

          <form onSubmit={handleCreateTestSubmit} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 max-w-2xl space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Assessment Topic</label>
              <input
                type="text"
                required
                value={testTopic}
                onChange={(e) => setTestTopic(e.target.value)}
                placeholder="e.g. System Design Fundamentals & Caching"
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={testCategory}
                  onChange={(e) => setTestCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs"
                >
                  <option value="Frontend Development">Frontend Development</option>
                  <option value="Backend Development">Backend Development</option>
                  <option value="System Design">System Design</option>
                  <option value="DSA & Problem Solving">DSA & Problem Solving</option>
                  <option value="Cloud Architecture">Cloud Architecture</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty Level</label>
                <select
                  value={testDifficulty}
                  onChange={(e) => setTestDifficulty(e.target.value as MentorTest['difficulty'])}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  value={testDuration}
                  onChange={(e) => setTestDuration(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Number of Questions</label>
                <input
                  type="number"
                  value={testQuestionsCount}
                  onChange={(e) => setTestQuestionsCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Scheduled Date & Time</label>
              <input
                type="text"
                value={testScheduledDate}
                onChange={(e) => setTestScheduledDate(e.target.value)}
                placeholder="e.g. 2026-03-02 at 04:00 PM"
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Schedule Assessment for Cohort
              </button>
            </div>
          </form>
        </div>
      )}

      {/* "Assign Task" Direct Tab */}
      {activeTab === 'assign_task' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Assign Milestone Tasks to Students</h2>
            <p className="text-xs text-slate-500">
              Assigned tasks will automatically populate in each selected student's Career Roadmap and Task Tracker.
            </p>
          </div>

          <form onSubmit={handleAssignTaskSubmit} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 max-w-2xl space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Task Title</label>
              <input
                type="text"
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Implement Optimistic UI with React Query & Cache Invalidation"
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description & Requirements</label>
              <textarea
                rows={3}
                required
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                placeholder="Provide instructions, expected code architecture, or submission link requirements..."
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Task Category</label>
                <select
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value as MentorTask['type'])}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs"
                >
                  <option value="Coding Problem">Coding Problem</option>
                  <option value="Project Milestone">Project Milestone</option>
                  <option value="Resume Review">Resume Review</option>
                  <option value="Mock Interview">Mock Interview</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as MentorTask['priority'])}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Deadline Date</label>
              <input
                type="text"
                required
                value={taskDeadline}
                onChange={(e) => setTaskDeadline(e.target.value)}
                placeholder="e.g. Mar 05, 2026"
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Dispatch Task to Student Cohort
              </button>
            </div>
          </form>
        </div>
      )}

      {/* "Mentor Profile & Settings" Tab */}
      {(activeTab === 'profile' || activeTab === 'settings') && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs max-w-3xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Mentor Profile & Office Hours</h2>
            <p className="text-xs text-slate-500">Manage your academic credentials, bio, and student consultation availability.</p>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200">
            <img src={mentorProfile.avatar} alt={mentorProfile.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-500" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">{mentorProfile.name}</h3>
              <p className="text-xs text-slate-600">{mentorProfile.title} • {mentorProfile.department}</p>
              <p className="text-xs text-emerald-700 font-semibold">{mentorProfile.institution}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bio / Mentorship Philosophy</label>
              <textarea
                rows={3}
                value={mentorProfile.bio}
                onChange={(e) => updateMentorProfile({ bio: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Office Hours / Availability</label>
                <input
                  type="text"
                  value={mentorProfile.officeHours}
                  onChange={(e) => updateMentorProfile({ officeHours: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={mentorProfile.email}
                  onChange={(e) => updateMentorProfile({ email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Answer Doubt Modal */}
      {selectedDoubtForReply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Provide Mentor Guidance</h3>
              <button onClick={() => setSelectedDoubtForReply(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-500">Student Question ({selectedDoubtForReply.studentName}):</span>
              <p className="text-xs text-slate-800 font-medium">{selectedDoubtForReply.question}</p>
            </div>

            <form onSubmit={handleReplyDoubtSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Solution / Advice</label>
                <textarea
                  rows={4}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Explain concepts clearly, share technical pointers, and guide next steps..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Attach Resource Link (Optional)</label>
                <input
                  type="url"
                  value={replyResource}
                  onChange={(e) => setReplyResource(e.target.value)}
                  placeholder="https://docs.react.dev/learn or tutorial link"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDoubtForReply(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Guidance & Resolve</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Detail Drawer Modal */}
      {selectedStudentForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudentForDetail.avatar}
                  alt={selectedStudentForDetail.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/20"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{selectedStudentForDetail.name}</h3>
                  <p className="text-xs text-slate-500">
                    {selectedStudentForDetail.careerGoal} • {selectedStudentForDetail.college} ({selectedStudentForDetail.currentYear})
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedStudentForDetail(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Readiness</span>
                <span className="text-base font-extrabold text-emerald-600">{selectedStudentForDetail.jobReadinessScore}%</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">CGPA</span>
                <span className="text-base font-extrabold text-slate-800">{selectedStudentForDetail.cgpa}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Tasks</span>
                <span className="text-base font-extrabold text-slate-800">{selectedStudentForDetail.pendingTasksCount} Pending</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Attendance</span>
                <span className="text-base font-extrabold text-slate-800">{selectedStudentForDetail.attendanceRate}%</span>
              </div>
            </div>

            {/* Skills Breakdown */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Verified Skill Proficiencies</h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedStudentForDetail.skills.map((sk) => (
                  <div key={sk.name} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{sk.name}</span>
                    <span className="font-bold text-indigo-600">{sk.level}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mentor Notes Section */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Mentor Evaluation & Private Notes</span>
                </span>
                {!isEditingNote && (
                  <button
                    onClick={() => setIsEditingNote(true)}
                    className="text-xs font-bold text-amber-800 hover:text-amber-950 underline"
                  >
                    Edit Note
                  </button>
                )}
              </div>

              {isEditingNote ? (
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={editingNote}
                    onChange={(e) => setEditingNote(e.target.value)}
                    className="w-full p-2.5 bg-white border border-amber-300 rounded-lg text-xs text-slate-800"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsEditingNote(false)}
                      className="px-3 py-1 text-xs text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        updateStudentMentorNotes(selectedStudentForDetail.id, editingNote);
                        setIsEditingNote(false);
                      }}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg"
                    >
                      Save Note
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-700 italic">
                  {selectedStudentForDetail.mentorNotes || 'No notes added yet for this student.'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
