import React, { useState } from 'react';
import {
  Bell,
  Lock,
  Eye,
  Sliders,
  CheckCircle2,
  Save,
  Globe,
  Shield,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { profile } = useApp();
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    emailAlertsOnMatch: true,
    emailAlertsOnApplicationUpdate: true,
    weeklyDigest: true,
    recruiterDiscoverability: true,
    sharePortfolioPublicly: true,
    twoFactorAuth: false,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="font-['Outfit'] text-2xl font-extrabold text-slate-900">
            Account & Preferences
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your alerts, discoverability preferences, and career privacy controls.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{saved ? 'Saved!' : 'Save Settings'}</span>
        </button>
      </div>

      {/* 1. Notifications */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-600" />
          <h3 className="font-['Outfit'] font-bold text-lg text-slate-900">
            Notification Preferences
          </h3>
        </div>

        <div className="space-y-3 pt-2 text-xs">
          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer">
            <div>
              <p className="font-bold text-slate-900">Opportunity Match Alerts</p>
              <p className="text-slate-600">Notify me when new internships matching &gt;75% of my skills are posted</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailAlertsOnMatch}
              onChange={() => toggle('emailAlertsOnMatch')}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer">
            <div>
              <p className="font-bold text-slate-900">Application Status Notifications</p>
              <p className="text-slate-600">Real-time alerts when recruiters shortlist, interview, or review your file</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailAlertsOnApplicationUpdate}
              onChange={() => toggle('emailAlertsOnApplicationUpdate')}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer">
            <div>
              <p className="font-bold text-slate-900">Weekly Skill Gap Digest</p>
              <p className="text-slate-600">Summary of curated courses and new assessment modules</p>
            </div>
            <input
              type="checkbox"
              checked={settings.weeklyDigest}
              onChange={() => toggle('weeklyDigest')}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
          </label>
        </div>
      </div>

      {/* 2. Privacy & Discoverability */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-indigo-600" />
          <h3 className="font-['Outfit'] font-bold text-lg text-slate-900">
            Recruiter Discoverability & Privacy
          </h3>
        </div>

        <div className="space-y-3 pt-2 text-xs">
          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer">
            <div>
              <p className="font-bold text-slate-900">Allow Partner Recruiters to Discover Profile</p>
              <p className="text-slate-600">Permit verified hiring managers to invite you directly to interview pipelines</p>
            </div>
            <input
              type="checkbox"
              checked={settings.recruiterDiscoverability}
              onChange={() => toggle('recruiterDiscoverability')}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 cursor-pointer">
            <div>
              <p className="font-bold text-slate-900">Public Digital Portfolio Link</p>
              <p className="text-slate-600">Anyone with your personal URL can view your verified student credentials</p>
            </div>
            <input
              type="checkbox"
              checked={settings.sharePortfolioPublicly}
              onChange={() => toggle('sharePortfolioPublicly')}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
          </label>
        </div>
      </div>

      {/* 3. Security */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-600" />
          <h3 className="font-['Outfit'] font-bold text-lg text-slate-900">
            Account Security
          </h3>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
          <div>
            <p className="font-bold text-slate-900">Two-Factor Authentication (2FA)</p>
            <p className="text-slate-600">Protect your academic portal credentials with authentication apps</p>
          </div>
          <button
            onClick={() => toggle('twoFactorAuth')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
              settings.twoFactorAuth ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {settings.twoFactorAuth ? 'Enabled' : 'Enable'}
          </button>
        </div>
      </div>

    </div>
  );
};
