import React from 'react';
import { LucideIcon, ArrowUpRight } from 'lucide-react';

interface StatCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  badgeText?: string;
  badgeType?: 'success' | 'warning' | 'info' | 'purple';
  icon: LucideIcon;
  iconBgColor?: string;
  iconTextColor?: string;
  progressValue?: number; // 0 to 100 for progress bar
  onClickAction?: () => void;
  actionLabel?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  subtitle,
  badgeText,
  badgeType = 'info',
  icon: Icon,
  iconBgColor = 'bg-indigo-50',
  iconTextColor = 'text-indigo-600',
  progressValue,
  onClickAction,
  actionLabel,
}) => {
  const badgeStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <div
      id={id}
      onClick={onClickAction}
      className={`bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-indigo-200/80 transition-all duration-200 flex flex-col justify-between ${
        onClickAction ? 'cursor-pointer group' : ''
      }`}
    >
      <div>
        {/* Header row with Icon and Badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className={`w-11 h-11 rounded-2xl ${iconBgColor} ${iconTextColor} flex items-center justify-center shadow-xs`}>
            <Icon className="w-5 h-5" />
          </div>
          {badgeText && (
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeStyles[badgeType]}`}>
              {badgeText}
            </span>
          )}
        </div>

        {/* Metric Value & Label */}
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <span className="font-['Outfit'] text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{value}</span>
        </div>

        {/* Optional Progress bar */}
        {typeof progressValue === 'number' && (
          <div className="mt-4">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, progressValue))}%` }}
              />
            </div>
          </div>
        )}

        {subtitle && <p className="text-xs text-slate-600 mt-3 font-medium leading-relaxed">{subtitle}</p>}
      </div>

      {/* Footer action */}
      {actionLabel && (
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
          <span>{actionLabel}</span>
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      )}
    </div>
  );
};
