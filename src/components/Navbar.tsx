import React from 'react';
import {
  LayoutDashboard,
  Smartphone,
  Code2,
  QrCode,
  Share2,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentView: 'dashboard' | 'survey' | 'guide';
  onViewChange: (view: 'dashboard' | 'survey' | 'guide') => void;
  onOpenQrModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenQrModal,
}) => {
  return (
    <nav className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 font-bold">
            <Sparkles className="w-5 h-5 text-indigo-200" />
          </div>
          <div>
            <div className="text-sm md:text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>ระบบประเมินความพึงพอใจการอบรม</span>
              <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="ระบบ Live พร้อมทำงาน"></span>
            </div>
            <div className="text-[11px] text-slate-400 hidden sm:block">
              Real-time Live Training Evaluation & Projector Dashboard
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-slate-950/80 p-1 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => onViewChange('dashboard')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
              currentView === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>จอโปรเจกเตอร์</span>
          </button>

          <button
            onClick={() => onViewChange('survey')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
              currentView === 'survey'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>หน้าตอบมือถือ</span>
          </button>

          <button
            onClick={() => onViewChange('guide')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
              currentView === 'guide'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>โค้ด 2 ไฟล์ & ติดตั้ง</span>
          </button>
        </div>

        {/* Quick QR Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenQrModal}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5"
            title="เปิด QR Code สำหรับให้ผู้เข้าอบรมสแกน"
          >
            <QrCode className="w-4 h-4 text-indigo-400" />
            <span className="hidden md:inline">สแกน QR Code</span>
          </button>
        </div>

      </div>
    </nav>
  );
};
