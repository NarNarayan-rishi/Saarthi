import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, TrendingUp, GitMerge, Settings, UploadCloud, Video, FileText, Settings2, ShieldCheck, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RecruiterMessageModal } from './RecruiterMessageModal';
import { PipelineAnalytics } from './PipelineAnalytics';
import { Send, CheckSquare, List } from 'lucide-react';
import { RecruiterJobPosting, PipelineStage, PipelineStageType, JobApplicant } from '../types';

interface JobWorkspaceProps {
  job: RecruiterJobPosting;
  onBack: () => void;
}

export const JobWorkspace: React.FC<JobWorkspaceProps> = ({ job, onBack }) => {
  const { 
    recruiterCandidates, 
    jobApplicants, 
    setJobApplicants, 
    updateJobPipeline, 
    publishJobPipeline, 
    closeJobAndFinalize, 
    toggleShortlistCandidate,
    createNewMessageThread,
    sendReplyMessage,
    messages,
    recruiterProfile
  } = useApp() as any; 
  const [activeTab, setActiveTab] = useState<'applicants' | 'pipeline' | 'close'>('applicants');

  // Load or generate mock applicants for this job
  const [localApplicants, setLocalApplicants] = useState<JobApplicant[]>([]);
  const [hiredIds, setHiredIds] = useState<string[]>([]);
  const [underProcessIds, setUnderProcessIds] = useState<string[]>([]);
  const [isClosing, setIsClosing] = useState(false);
  const [messagingCandidate, setMessagingCandidate] = useState<any>(null);
  const [selectedApplicantIds, setSelectedApplicantIds] = useState<string[]>([]);
  const [showBulkMessageModal, setShowBulkMessageModal] = useState(false);
  const [showBulkTestModal, setShowBulkTestModal] = useState(false);
  const [viewingAnalyticsStage, setViewingAnalyticsStage] = useState<PipelineStage | null>(null);

  useEffect(() => {
    // Check if we have applicants in context for this job
    const existing = jobApplicants.filter((a: JobApplicant) => a.jobId === job.id);
    if (existing.length > 0) {
      setLocalApplicants(existing);
    } else {
      // Generate some mock applicants for presentation purposes
      const mocks = recruiterCandidates.slice(0, job.applicantsCount || 5).map((cand: any, i: number) => ({
        id: `app_${job.id}_${cand.id}`,
        jobId: job.id,
        candidateId: cand.id,
        candidate: cand,
        appliedDate: new Date().toLocaleDateString(),
        status: job.status === 'Closed' ? 'Rejected' : 'Applied',
        score: cand.jobReadinessScore,
        resumeUrl: cand.resumeUrl
      }));
      setLocalApplicants(mocks);
      // We don't save to global immediately to avoid clutter, but we could.
    }
  }, [job.id, jobApplicants, recruiterCandidates, job.applicantsCount, job.status]);

  // Pipeline Builder State
  const [pipeline, setPipeline] = useState<PipelineStage[]>((job as any).pipeline || []);
  const [newStageType, setNewStageType] = useState<PipelineStageType>('Interview');
  const [newStageTitle, setNewStageTitle] = useState('');
  const [isSimulatingCBT, setIsSimulatingCBT] = useState(false);
  const [isPublished, setIsPublished] = useState((job as any).pipelinePublished || false);

  const handleAddStage = () => {
    if (!newStageTitle) return;
    const newStage: PipelineStage = {
      id: `stage_${Date.now()}`,
      levelNumber: pipeline.length + 1,
      type: newStageType,
      title: newStageTitle,
      config: {}
    };
    const updated = [...pipeline, newStage];
    setPipeline(updated);
    updateJobPipeline(job.id, updated);
    setNewStageTitle('');
  };

  const updateStageConfig = (id: string, updates: any) => {
    const updated = pipeline.map(p => {
      if (p.id === id) {
        return { ...p, config: { ...p.config, ...updates } };
      }
      return p;
    });
    setPipeline(updated);
    updateJobPipeline(job.id, updated);
  };

  const handleRemoveStage = (id: string) => {
    const updated = pipeline.filter(p => p.id !== id).map((p, i) => ({ ...p, levelNumber: i + 1 }));
    setPipeline(updated);
    updateJobPipeline(job.id, updated);
  };

  const simulateCbtUpload = (e: React.ChangeEvent<HTMLInputElement>, stageId: string) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    setIsSimulatingCBT(true);
    
    // Simulate AI parsing PDF to CBT
    setTimeout(() => {
      const updated = pipeline.map(p => {
        if (p.id === stageId) {
          return { ...p, config: { ...p.config, pdfUploaded: file.name, parsedQuestions: 25 } };
        }
        return p;
      });
      setPipeline(updated);
      updateJobPipeline(job.id, updated);
      setIsSimulatingCBT(false);
    }, 2500);
  };

  const handleCloseJob = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeJobAndFinalize(job.id, hiredIds, underProcessIds);
      onBack();
    }, 1000);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedApplicantIds(localApplicants.map(a => a.candidateId));
    } else {
      setSelectedApplicantIds([]);
    }
  };

  const handleSelectOne = (candidateId: string) => {
    setSelectedApplicantIds(prev => 
      prev.includes(candidateId) ? prev.filter(id => id !== candidateId) : [...prev, candidateId]
    );
  };

  const handleSendBulkTest = (stage: PipelineStage) => {
    let testLink = `http://localhost:3000/#/test/${stage.id}`;
    let text = `Hello! You have been invited to complete Round ${stage.levelNumber}: ${stage.title} for the ${job.title} role. Please click the link to start your assessment: ${testLink}`;
    
    if (stage.type === 'Interview') {
      testLink = stage.config?.meetLink || 'https://meet.google.com/new';
      text = `Hello! You have been invited to Round ${stage.levelNumber}: ${stage.title} for the ${job.title} role. Please join via this Google Meet link at the scheduled time: ${testLink}`;
    }
    
    selectedApplicantIds.forEach(candidateId => {
      const existingThread = messages.find((m: any) => m.senderName === recruiterProfile.companyName && m.id.includes(candidateId));
      if (existingThread) {
        sendReplyMessage(existingThread.id, text, 'other');
      } else {
        createNewMessageThread({
          id: `msg_thread_${candidateId}_${Date.now()}`,
          senderName: recruiterProfile.companyName || 'Recruiter',
          senderRole: 'Recruiter',
          senderAvatar: recruiterProfile.companyLogo || '',
          lastMessage: text,
          lastMessageTime: 'Just now',
          unread: false,
          messages: [{
            id: `m_${Date.now()}_${candidateId}`,
            sender: 'other',
            text: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]
        }, candidateId);
      }
    });
    
    setShowBulkTestModal(false);
    setSelectedApplicantIds([]);
    alert("Test links successfully sent to " + selectedApplicantIds.length + " candidates!");
  };

  const handleMessageCandidate = (candidate: any) => {
    // Add to talent pool (shortlist) if not already
    if (!candidate.shortlisted && toggleShortlistCandidate) {
      toggleShortlistCandidate(candidate.id);
    }
    setMessagingCandidate(candidate);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[85vh]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold">{job.title}</h2>
            <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
              <span>{job.type}</span> • <span>{job.workMode}</span> • <span>{job.status}</span>
            </div>
          </div>
        </div>
        
        <div className="flex bg-white/10 p-1 rounded-xl">
          <button onClick={() => setActiveTab('applicants')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${activeTab === 'applicants' ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:text-white'}`}>
            <Users className="w-4 h-4" /> Applicants
          </button>
          <button onClick={() => setActiveTab('pipeline')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${activeTab === 'pipeline' ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:text-white'}`}>
            <GitMerge className="w-4 h-4" /> Pipeline Builder
          </button>
          <button onClick={() => setActiveTab('close')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${activeTab === 'close' ? 'bg-red-500 text-white' : 'text-slate-300 hover:text-white'}`}>
            <Settings className="w-4 h-4" /> Finalize
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
        
        {/* APPLICANTS TAB */}
        {activeTab === 'applicants' && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-bold text-slate-900 text-lg">Candidate Funnel</h3>

            {/* Bulk Action Bar */}
            {selectedApplicantIds.length > 0 && (
              <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                    {selectedApplicantIds.length}
                  </span>
                  <span className="text-sm font-semibold text-indigo-900">Candidates Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowBulkTestModal(true)}
                    className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-100 transition-colors shadow-xs"
                  >
                    Send Test Link
                  </button>
                  <button 
                    onClick={() => setShowBulkMessageModal(true)}
                    className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
                  >
                    Custom Message
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
                  <tr>
                    <th className="px-4 py-3 w-10">
                      <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" 
                        checked={selectedApplicantIds.length === localApplicants.length && localApplicants.length > 0}
                        onChange={handleSelectAll} 
                      />
                    </th>
                    <th className="px-4 py-3">Candidate</th>
                    <th className="px-4 py-3">Match Score</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {localApplicants.map((app) => (
                    <tr key={app.id} className={`hover:bg-slate-50 transition-colors ${selectedApplicantIds.includes(app.candidateId) ? 'bg-indigo-50/30' : ''}`}>
                      <td className="px-4 py-3">
                        <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                          checked={selectedApplicantIds.includes(app.candidateId)}
                          onChange={() => handleSelectOne(app.candidateId)}
                        />
                      </td>
                      <td className="px-4 py-3 flex items-center gap-3">
                        <img src={app.candidate.avatar} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                        <div>
                          <div className="font-bold text-slate-900">{app.candidate.name}</div>
                          <div className="text-[10px] text-slate-500">{app.candidate.college}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${app.score >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {app.score}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-xs px-2 py-1 rounded bg-slate-100 text-slate-700">{app.status}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleMessageCandidate(app.candidate)} className="text-indigo-600 hover:text-indigo-800 text-xs font-bold bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                            Message
                          </button>
                          <button className="text-slate-600 hover:text-slate-800 text-xs font-bold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                            Resume
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {localApplicants.length === 0 && (
                    <tr><td colSpan={4} className="text-center py-8 text-slate-400">No applicants found for this job.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PIPELINE BUILDER TAB */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-600 text-white rounded-xl"><Settings2 className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-bold text-indigo-900">Curate Assessment Pipeline</h3>
                    <p className="text-xs text-indigo-700 mt-1">Design a multi-stage funnel to automatically evaluate applicants. Generate tests via AI, publish tasks, or schedule interviews.</p>
                  </div>
                </div>
                <div className="shrink-0 mt-2">
                  {isPublished ? (
                    <span className="px-4 py-2 bg-emerald-100 text-emerald-700 font-bold text-sm rounded-xl flex items-center gap-2 shadow-xs">
                      <CheckCircle2 className="w-5 h-5" /> Published & Active
                    </span>
                  ) : (
                    <button
                      onClick={() => { publishJobPipeline(job.id); setIsPublished(true); }}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg transition-colors flex items-center gap-2"
                    >
                      <UploadCloud className="w-4 h-4" />
                      Save & Publish Pipeline
                    </button>
                  )}
                </div>
              </div>

            {/* Stages List */}
            <div className="space-y-4">
              {pipeline.map((stage) => (
                <div key={stage.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-slate-900 text-white font-black flex items-center justify-center text-sm">{stage.levelNumber}</span>
                      <h4 className="font-bold text-slate-900 text-lg">{stage.title} <span className="text-xs font-medium text-slate-500 ml-2 px-2 py-1 bg-slate-100 rounded-lg">{stage.type}</span></h4>
                    </div>
                    <button onClick={() => handleRemoveStage(stage.id)} className="text-red-500 hover:text-red-700 text-xs font-bold">Remove Round</button>
                  </div>

                  {/* Stage Config UIs */}
                  <div className="pl-11">
                    {stage.type === 'PDF to CBT Test' && (
                      <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                        {stage.config?.pdfUploaded ? (
                          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                            <ShieldCheck className="w-5 h-5" />
                            Computer Based Test Generated: {stage.config.parsedQuestions} Questions
                          </div>
                        ) : isSimulatingCBT ? (
                          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            AI is analyzing PDF and building test interface...
                          </div>
                        ) : (
                          <div>
                            <label className="flex items-center gap-2 cursor-pointer text-indigo-600 hover:text-indigo-800 font-bold text-sm">
                              <UploadCloud className="w-5 h-5" /> Upload PDF Question Bank & Answer Key
                              <input type="file" className="hidden" onChange={(e) => simulateCbtUpload(e, stage.id)} accept=".pdf" />
                            </label>
                            <p className="text-[11px] text-slate-500 mt-1">Our AI will instantly parse the PDF and convert it into a live Computer Based Test (CBT) for applicants.</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {stage.type === 'Interview' && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700">Google Meet Link / Details</label>
                        <input type="text" placeholder="https://meet.google.com/..." 
                          value={stage.config?.meetLink || ''}
                          onChange={(e) => updateStageConfig(stage.id, { meetLink: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                      </div>
                    )}

                    {stage.type === 'Live Problem Solving' && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700">Time Box (Minutes)</label>
                        <input type="number" placeholder="45" 
                          value={stage.config?.timeLimit || ''}
                          onChange={(e) => updateStageConfig(stage.id, { timeLimit: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                      </div>
                    )}

                    {stage.type === 'Specific Task' && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700">Task Prompt</label>
                        <textarea placeholder="Describe the take-home task..." 
                          value={stage.config?.taskPrompt || ''}
                          onChange={(e) => updateStageConfig(stage.id, { taskPrompt: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm h-20" />
                      </div>
                    )}
                    
                    {isPublished && stage.type !== 'Interview' && (
                      <div className="pt-3 mt-3 border-t border-slate-100 flex justify-end">
                        <button 
                          onClick={() => setViewingAnalyticsStage(stage)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
                        >
                          <TrendingUp className="w-3.5 h-3.5" /> View Round Analytics
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Stage */}
            <div className="bg-white border-2 border-dashed border-slate-300 rounded-2xl p-5 flex flex-col gap-4">
              <h4 className="font-bold text-slate-900 text-sm">Add New Assessment Round</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Test Type</label>
                  <select value={newStageType} onChange={(e) => setNewStageType(e.target.value as PipelineStageType)} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm">
                    <option value="Interview">Interview</option>
                    <option value="Live Problem Solving">Live Problem Solving</option>
                    <option value="Specific Task">Specific Task</option>
                    <option value="PDF to CBT Test">Generate AI CBT from PDF</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Round Name</label>
                  <div className="flex gap-2">
                    <input type="text" value={newStageTitle} onChange={(e) => setNewStageTitle(e.target.value)} placeholder="e.g. Technical Round 1" className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm" />
                    <button onClick={handleAddStage} disabled={!newStageTitle} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-lg disabled:opacity-50">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* CLOSE JOB TAB */}
        {activeTab === 'close' && (
          <div className="space-y-6 animate-in fade-in max-w-3xl mx-auto">
            <div className="bg-red-50 border border-red-200 p-5 rounded-2xl">
              <h3 className="font-bold text-red-900 text-lg flex items-center gap-2"><XCircle className="w-5 h-5"/> Finalize & Close Job</h3>
              <p className="text-sm text-red-700 mt-2">Check the box for candidates who are <strong>Hired</strong> or <strong>Under Process</strong>. Once you submit, all unchecked candidates will automatically be marked as <strong>Rejected</strong> and notified.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
                  <tr>
                    <th className="px-4 py-3">Candidate</th>
                    <th className="px-4 py-3 text-center">Hired</th>
                    <th className="px-4 py-3 text-center">Under Process</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {localApplicants.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-900">{app.candidate.name}</td>
                      <td className="px-4 py-3 text-center">
                        <input 
                          type="checkbox" 
                          checked={hiredIds.includes(app.candidateId)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setHiredIds([...hiredIds, app.candidateId]);
                              setUnderProcessIds(underProcessIds.filter(id => id !== app.candidateId));
                            } else {
                              setHiredIds(hiredIds.filter(id => id !== app.candidateId));
                            }
                          }}
                          className="w-4 h-4 text-emerald-600 rounded"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input 
                          type="checkbox" 
                          checked={underProcessIds.includes(app.candidateId)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setUnderProcessIds([...underProcessIds, app.candidateId]);
                              setHiredIds(hiredIds.filter(id => id !== app.candidateId));
                            } else {
                              setUnderProcessIds(underProcessIds.filter(id => id !== app.candidateId));
                            }
                          }}
                          className="w-4 h-4 text-amber-600 rounded"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button 
              onClick={handleCloseJob}
              disabled={isClosing}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-xl shadow-lg transition-colors flex justify-center items-center gap-2"
            >
              {isClosing ? <Loader2 className="w-6 h-6 animate-spin" /> : <><CheckCircle2 className="w-6 h-6" /> Finalize & Close Job Listing</>}
            </button>

          </div>
        )}

      </div>
      {messagingCandidate && (
        <RecruiterMessageModal candidate={messagingCandidate} onClose={() => setMessagingCandidate(null)} />
      )}
      
      {viewingAnalyticsStage && (
        <PipelineAnalytics 
          stage={viewingAnalyticsStage} 
          applicants={localApplicants} 
          onBack={() => setViewingAnalyticsStage(null)} 
        />
      )}

      {/* Bulk Test Link Modal */}
      {showBulkTestModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 p-6">
            <h3 className="font-bold text-xl text-slate-900 mb-2">Send Pipeline Test Link</h3>
            <p className="text-sm text-slate-500 mb-6">Select which pipeline round you want to share with the {selectedApplicantIds.length} selected candidates.</p>
            
            <div className="space-y-3 mb-6">
              {pipeline.length === 0 && <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">No tests available. Please build your pipeline first.</p>}
              {pipeline.map(stage => (
                <button 
                  key={stage.id}
                  onClick={() => handleSendBulkTest(stage)}
                  className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors flex items-center justify-between group"
                >
                  <div>
                    <span className="text-xs font-bold text-indigo-600">Round {stage.levelNumber}</span>
                    <h4 className="font-bold text-slate-900">{stage.title}</h4>
                  </div>
                  <Send className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                </button>
              ))}
            </div>
            
            <div className="flex justify-end">
              <button onClick={() => setShowBulkTestModal(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
