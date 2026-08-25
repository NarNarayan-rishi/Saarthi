import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  Trash2,
} from 'lucide-react';
import { Application, ApplicationStatus } from '../types';
import { useApp } from '../context/AppContext';

interface ApplicationCardProps {
  application: Application;
  onViewDetails?: (app: Application) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
}) => {
  const { withdrawApplication } = useApp();
  const [expanded, setExpanded] = useState(false);

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Selected':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Shortlisted':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Interview':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Under Review':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Applied':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Rejected':
        return 'bg-slate-100 text-slate-600 border-slate-300';
    }
  };

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case 'Selected':
      case 'Shortlisted':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Interview':
      case 'Under Review':
        return <Clock className="w-3.5 h-3.5 text-blue-600" />;
      case 'Rejected':
        return <XCircle className="w-3.5 h-3.5 text-slate-600" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-indigo-600" />;
    }
  };

  return (
    <div
      id={`application-card-${application.id}`}
      className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-indigo-200/80 transition-all duration-200"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left info */}
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {application.type}
            </span>
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(application.status)}`}>
              {getStatusIcon(application.status)}
              {application.status}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Applied on {application.appliedDate}
            </span>
          </div>

          <h4 className="font-['Outfit'] font-bold text-base text-slate-900">
            {application.opportunityTitle}
          </h4>

          <div className="flex items-center gap-4 text-xs text-slate-600 mt-1.5 flex-wrap">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              {application.company}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {application.location} ({application.workMode})
            </span>
            <span className="font-bold text-slate-900">
              {application.stipendOrSalary}
            </span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            id={`btn-expand-app-${application.id}`}
            onClick={() => setExpanded(!expanded)}
            className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 border border-slate-200 transition-colors"
          >
            <span>Timeline</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {application.status === 'Applied' && (
            <button
              id={`btn-withdraw-${application.id}`}
              onClick={() => {
                if (window.confirm(`Are you sure you want to withdraw your application for ${application.opportunityTitle}?`)) {
                  withdrawApplication(application.id);
                }
              }}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Withdraw application"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Timeline & Notes */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/70 p-4 rounded-2xl space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Application Progress Timeline
          </p>
          <div className="space-y-3 pl-2">
            {application.timeline.map((step, idx) => (
              <div key={idx} className="relative flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 mt-1.5 ring-4 ring-indigo-100" />
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{step.status}</span>
                    <span className="text-[11px] text-slate-500 font-medium">{step.date}</span>
                  </div>
                  {step.note && (
                    <p className="text-xs text-slate-600 mt-0.5">{step.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {application.notes && (
            <div className="mt-3 p-3 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900">
              <span className="font-bold">Recruiter Notes:</span> {application.notes}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
