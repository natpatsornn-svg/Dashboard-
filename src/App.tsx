/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { SurveyView } from './components/SurveyView';
import { FirebaseGuideView } from './components/FirebaseGuideView';
import { QRCodeModal } from './components/QRCodeModal';

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'survey' | 'guide'>('dashboard');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Sync with URL query parameter ?view=survey or ?view=dashboard
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      if (viewParam === 'survey') {
        setCurrentView('survey');
      } else if (viewParam === 'dashboard') {
        setCurrentView('dashboard');
      } else if (viewParam === 'guide') {
        setCurrentView('guide');
      }
    }
  }, []);

  const handleViewChange = (view: 'dashboard' | 'survey' | 'guide') => {
    setCurrentView(view);
    // Update URL query string without reloading page
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('view', view);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Direct respondent link for QR Code
  const surveyUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const base = window.location.origin + window.location.pathname;
    return `${base}?view=survey`;
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Prompt',sans-serif]">
      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        onViewChange={handleViewChange}
        onOpenQrModal={() => setIsQrModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {currentView === 'dashboard' && (
          <DashboardView
            onOpenQrModal={() => setIsQrModalOpen(true)}
            surveyUrl={surveyUrl}
          />
        )}

        {currentView === 'survey' && (
          <SurveyView
            onSubmissionSuccess={() => {
              // Option to stay or view dashboard
            }}
            onNavigateToDashboard={() => handleViewChange('dashboard')}
          />
        )}

        {currentView === 'guide' && <FirebaseGuideView />}
      </main>

      {/* QR Code Presentation Modal */}
      <QRCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        surveyUrl={surveyUrl}
      />

      {/* Bottom Minimal Footer */}
      <footer className="py-4 px-6 border-t border-slate-900 bg-slate-950 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            ระบบเก็บแบบประเมินความพึงพอใจการอบรม • ออกแบบสำหรับฉายขึ้นจอโปรเจกเตอร์และตอบผ่านมือถือ
          </div>
          <div className="flex items-center gap-3">
            <span>เกณฑ์การแปลผล Likert 5 ระดับ</span>
            <span>•</span>
            <button
              onClick={() => handleViewChange('guide')}
              className="text-indigo-400 hover:text-indigo-300 underline"
            >
              ดูโค้ด index.html & dashboard.html
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
