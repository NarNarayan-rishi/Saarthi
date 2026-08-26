import React, { useRef } from 'react';
import {
  X,
  Download,
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building,
  FileText,
  ExternalLink,
  Printer,
  Sparkles,
} from 'lucide-react';
import { Skill, StudentProfile } from '../types';

interface CertificateModalProps {
  skill: Skill;
  profile: StudentProfile;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  skill,
  profile,
  onClose,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const issueDate =
    skill.certificateUploadDate ||
    skill.lastAssessed ||
    new Date().toISOString().split('T')[0];

  const credentialId =
    skill.courseId ? `CERT-${skill.courseId}-${skill.id.slice(-4).toUpperCase()}` : `CERT-${skill.id.slice(-6).toUpperCase()}-VERIFIED`;

  const handleDownloadPdf = () => {
    // If there's an uploaded PDF data URL, trigger download
    if (skill.certificateDataUrl && skill.certificateDataUrl.startsWith('data:application/pdf')) {
      const link = document.createElement('a');
      link.href = skill.certificateDataUrl;
      link.download = skill.certificateName || `${skill.name}_Certificate.pdf`;
      link.click();
      return;
    }

    // If there's an image data URL, trigger download
    if (skill.certificateDataUrl && skill.certificateDataUrl.startsWith('data:image')) {
      const link = document.createElement('a');
      link.href = skill.certificateDataUrl;
      link.download = skill.certificateName || `${skill.name}_Certificate.png`;
      link.click();
      return;
    }

    // Otherwise use browser print / save as PDF for the generated certificate view
    window.print();
  };

  const isUploadedPdf = skill.certificateDataUrl?.startsWith('data:application/pdf');
  const isUploadedImage = skill.certificateDataUrl?.startsWith('data:image');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-8 relative max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-['Outfit'] font-extrabold text-lg sm:text-xl text-slate-900">
                Verified Skill Credential
              </h2>
              <p className="text-xs text-slate-500">
                {skill.name} • {skill.courseId ? `Course ID: ${skill.courseId}` : 'Industry Verified'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shadow-indigo-200"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area: Custom Uploaded PDF/Image or System Certificate View */}
        {isUploadedPdf ? (
          <div className="space-y-4">
            <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-indigo-900 font-semibold">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Uploaded Document: {skill.certificateName || 'Skill_Certificate.pdf'}</span>
              </div>
              <span className="text-[11px] text-indigo-700 font-bold">
                Uploaded on {issueDate}
              </span>
            </div>
            <div className="w-full h-96 rounded-2xl border border-slate-200 overflow-hidden bg-slate-100">
              <iframe
                src={skill.certificateDataUrl}
                title="Certificate PDF Preview"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        ) : isUploadedImage ? (
          <div className="space-y-4">
            <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-indigo-900 font-semibold">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Uploaded Document: {skill.certificateName || 'Skill_Certificate.png'}</span>
              </div>
              <span className="text-[11px] text-indigo-700 font-bold">
                Uploaded on {issueDate}
              </span>
            </div>
            <div className="w-full rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center p-4">
              <img
                src={skill.certificateDataUrl}
                alt={`${skill.name} Certificate`}
                className="max-h-96 w-auto object-contain rounded-xl shadow-md"
              />
            </div>
          </div>
        ) : (
          /* High-Resolution Dynamic Certificate Template */
          <div
            ref={certificateRef}
            className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border-4 border-amber-400/40 relative overflow-hidden shadow-xl space-y-6"
          >
            {/* Background seal watermarks */}
            <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -top-16 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-300" />
                </div>
                <span className="font-['Outfit'] font-black tracking-wider text-sm text-amber-300 uppercase">
                  Saarthi Verified Credential
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Credential ID</span>
                <span className="text-xs font-mono font-bold text-amber-200">{credentialId}</span>
              </div>
            </div>

            <div className="relative z-10 text-center space-y-3 py-4">
              <span className="text-xs font-semibold text-indigo-200 tracking-widest uppercase block">
                Certificate of Skill Competence &amp; Mastery
              </span>
              <p className="text-xs text-slate-300">This officially certifies that</p>
              <h3 className="font-['Outfit'] font-black text-2xl sm:text-3xl text-white tracking-tight">
                {profile.name}
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                has successfully demonstrated verified technical proficiency in
              </p>
              <div className="inline-block px-5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-amber-400/30 text-amber-300 font-['Outfit'] font-extrabold text-xl">
                {skill.name} ({skill.proficiency}% Mastery)
              </div>
              {skill.courseId && (
                <p className="text-xs text-indigo-300 font-medium">
                  Course ID: <strong className="text-white">{skill.courseId}</strong>
                </p>
              )}
            </div>

            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Institution / Issuer</span>
                <span className="font-semibold text-slate-200">{skill.certificateIssuer || profile.institution || 'Saarthi Career Academy'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Issue Date</span>
                <span className="font-semibold text-slate-200">{issueDate}</span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-center justify-end sm:justify-center">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Digitally Signed</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Metadata Details Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div>
            <span className="text-slate-500 font-medium block">Category</span>
            <span className="font-bold text-slate-900">{skill.category}</span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">Assessment Status</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {skill.verified ? 'Verified Benchmark' : 'Self-Reported & Stored'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-medium block">Access Privilege</span>
            <span className="font-bold text-indigo-700">Permanent PDF Archive</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500">
            Stored securely in your Saarthi digital portfolio.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
