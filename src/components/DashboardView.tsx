import React, { useState, useEffect, useMemo, useRef } from 'react';
import QRCode from 'qrcode';
import {
  SurveySubmission,
  SurveySummary,
} from '../types/survey';
import {
  calculateSurveySummary,
  exportSubmissionsToCSV,
} from '../utils/evaluation';
import {
  subscribeToSubmissions,
  simulateSingleResponse,
  clearAllSubmissions,
  reloadDemoData,
} from '../utils/storage';
import {
  BarChart3,
  Download,
  Users,
  Award,
  Maximize2,
  Minimize2,
  PlusCircle,
  Trash2,
  RotateCcw,
  QrCode as QrIcon,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Clock,
  Eye,
  EyeOff,
  Star,
  CheckCircle2,
  PieChart,
  CircleDot,
} from 'lucide-react';

interface DashboardViewProps {
  onOpenQrModal: () => void;
  surveyUrl: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenQrModal,
  surveyUrl,
}) => {
  const [submissions, setSubmissions] = useState<SurveySubmission[]>([]);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [showQrSideCard, setShowQrSideCard] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [chartType, setChartType] = useState<'donut' | 'bar'>('donut');
  const [latestSubmissionId, setLatestSubmissionId] = useState<string | null>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Subscribe to real-time updates (cross-tab via BroadcastChannel & localStorage)
  useEffect(() => {
    const unsubscribe = subscribeToSubmissions((data) => {
      setSubmissions(data);
      if (data.length > 0) {
        setLatestSubmissionId(data[0].id);
      }
    });
    return () => unsubscribe();
  }, []);

  // Generate QR code for the side banner
  useEffect(() => {
    if (qrCanvasRef.current && surveyUrl) {
      QRCode.toCanvas(
        qrCanvasRef.current,
        surveyUrl,
        {
          width: 140,
          margin: 1,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) console.error('Error drawing small QR', error);
        }
      );
    }
  }, [surveyUrl, showQrSideCard]);

  // Calculate statistics
  const summary: SurveySummary = useMemo(() => {
    return calculateSurveySummary(submissions);
  }, [submissions]);

  // Simulate responses
  const handleSimulate = (count: number = 1) => {
    setIsSimulating(true);
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        simulateSingleResponse();
        if (i === count - 1) {
          setIsSimulating(false);
        }
      }, i * 300);
    }
  };

  const handleClear = () => {
    if (window.confirm('คุณต้องการล้างข้อมูลแบบประเมินทั้งหมดเพื่อเริ่มรอบใหม่ใช่หรือไม่?')) {
      clearAllSubmissions();
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.log(err));
      setIsPresentationMode(true);
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
      setIsPresentationMode(false);
    }
  };

  return (
    <div
      className={`min-h-[calc(100vh-4rem)] flex flex-col p-4 md:p-6 lg:p-8 transition-colors ${
        isPresentationMode ? 'bg-slate-950' : 'bg-slate-900/60'
      }`}
    >
      {/* Top Projector Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center text-xl font-bold shadow-lg">
            📊
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                Live Training Dashboard
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                REAL-TIME LIVE
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-400 mt-0.5">
              ผลการประเมินความพึงพอใจการอบรม (อัปเดตอัตโนมัติทันทีที่มีคนส่งคำตอบ)
            </p>
          </div>
        </div>

        {/* Action Controls for Organizer */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Simulate Buttons */}
          <div className="hidden sm:flex items-center bg-slate-800/80 border border-slate-700/80 rounded-xl p-1 gap-1">
            <button
              onClick={() => handleSimulate(1)}
              disabled={isSimulating}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-medium border border-indigo-500/30 transition flex items-center gap-1"
              title="จำลองคนตอบ 1 ท่าน เพื่อทดสอบแอนิเมชัน"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>จำลอง +1 คน</span>
            </button>
            <button
              onClick={() => handleSimulate(5)}
              disabled={isSimulating}
              className="px-2.5 py-1.5 rounded-lg hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              title="จำลองคนตอบ 5 ท่าน"
            >
              <span>+5 คน</span>
            </button>
          </div>

          {/* QR Code Presentation Trigger */}
          <button
            onClick={onOpenQrModal}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition flex items-center gap-1.5"
          >
            <QrIcon className="w-4 h-4" />
            <span>ขยาย QR Code ขึ้นจอ</span>
          </button>

          {/* Export to CSV (Excel Thai UTF-8) */}
          <button
            onClick={() => exportSubmissionsToCSV(submissions)}
            disabled={submissions.length === 0}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 shadow-sm"
            title="ดาวน์โหลดไฟล์ CSV พร้อม UTF-8 BOM สำหรับเปิดใน Excel ภาษาไทย"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>ดาวน์โหลด CSV</span>
          </button>

          {/* Fullscreen Mode */}
          <button
            onClick={handleToggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title={isPresentationMode ? 'ออกจากโหมดเต็มจอ' : 'ฉายเต็มจอโปรเจกเตอร์'}
          >
            {isPresentationMode ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Main Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 flex-1">
        
        {/* Left Column (Main Stats & Charts): 8 or 9 columns */}
        <div className={`${showQrSideCard ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-6`}>
          
          {/* Top Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            
            {/* Card 1: Total Respondents */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden backdrop-blur-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
                <span>ผู้ตอบทั้งหมด</span>
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                  {summary.totalResponses}
                </span>
                <span className="text-slate-400 text-sm">ท่าน</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>ระบบกำลังเปิดรับคำตอบแบบสด</span>
              </div>
            </div>

            {/* Card 2: Overall Mean Score & 5-tier interpretation */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden backdrop-blur-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
                <span>คะแนนเฉลี่ยรวม (Overall)</span>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl md:text-5xl font-extrabold text-indigo-400 tracking-tight">
                  {summary.overallAverage > 0 ? summary.overallAverage.toFixed(2) : '0.00'}
                </span>
                <span className="text-slate-400 text-sm">/ 5.00</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${summary.overallInterpretation.badgeColor}`}>
                  {summary.overallInterpretation.label}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  (เกณฑ์ 5 ระดับ)
                </span>
              </div>
            </div>

            {/* Card 3: 5-Level Scale Criteria Legend */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-lg text-xs flex flex-col justify-between backdrop-blur-sm">
              <div className="font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                <span>เกณฑ์การแปลผล (Likert Scale)</span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-400 font-bold">4.51 – 5.00</span>
                  <span className="text-slate-200">มากที่สุด (ยอดเยี่ยม)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-400 font-bold">3.51 – 4.50</span>
                  <span className="text-slate-200">มาก (ดี)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-amber-400 font-bold">2.51 – 3.50</span>
                  <span className="text-slate-200">ปานกลาง (พอใช้)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-400 font-bold">1.51 – 2.50</span>
                  <span className="text-slate-200">น้อย (ต้องปรับปรุง)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-rose-400 font-bold">1.00 – 1.50</span>
                  <span className="text-slate-200">น้อยที่สุด (วิกฤต)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Chart Panel: Circular Gauges & Donut Charts */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                    {chartType === 'donut' ? (
                      <CircleDot className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <BarChart3 className="w-5 h-5 text-indigo-400" />
                    )}
                    <span>{chartType === 'donut' ? 'กราฟวงกลมค่าเฉลี่ยรายข้อ (สเกล 1.00 - 5.00)' : 'กราฟแท่งค่าเฉลี่ยรายข้อ (สเกล 1.00 - 5.00)'}</span>
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {chartType === 'donut' ? 'CIRCULAR DONUT' : 'BAR CHART'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  เปรียบเทียบคะแนนความพึงพอใจแต่ละด้านของการจัดอบรมแบบเรียลไทม์
                </p>
              </div>

              {/* View Switcher: Circular (Donut) vs Bar */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setChartType('donut')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                    chartType === 'donut'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <PieChart className="w-3.5 h-3.5" />
                  <span>กราฟวงกลม</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChartType('bar')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                    chartType === 'bar'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>กราฟแท่ง</span>
                </button>
              </div>
            </div>

            {/* Target Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs mb-5 pb-3 border-b border-slate-800/80">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                <span>ระดับคะแนนจริง (สเกล 1-5)</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30 inline-block"></span>
                <span>จุดมาร์กเกอร์เป้าหมาย ≥ 4.00 (80%)</span>
              </span>
            </div>

            {/* Circular Charts Mode (Default) */}
            {chartType === 'donut' ? (
              <div className="space-y-6">
                
                {/* 5 Questions Circular Gauges Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {summary.questionStats.map((q) => {
                    const maxScore = 5.0;
                    const percent = Math.min(100, Math.max(0, (q.average / maxScore) * 100));
                    const radius = 42;
                    const circumference = 2 * Math.PI * radius; // ~263.89
                    const strokeDashoffset = circumference - (percent / 100) * circumference;
                    
                    // Coordinates for the 4.0 (80%) target marker
                    const targetAngle = (0.80 * 360) - 90; // 80% around the circle
                    const targetRad = (targetAngle * Math.PI) / 180;
                    const cx = 55;
                    const cy = 55;
                    const markerX = cx + radius * Math.cos(targetRad);
                    const markerY = cy + radius * Math.sin(targetRad);

                    const gradientColors =
                      q.average >= 4.51
                        ? ['#10b981', '#14b8a6']
                        : q.average >= 3.51
                        ? ['#6366f1', '#3b82f6']
                        : q.average >= 2.51
                        ? ['#f59e0b', '#fbbf24']
                        : ['#f43f5e', '#fb7185'];

                    return (
                      <div
                        key={q.id}
                        className="bg-slate-950/70 border border-slate-800/90 hover:border-slate-700/80 rounded-2xl p-4 transition-all duration-300 shadow-md flex flex-col justify-between"
                      >
                        {/* Top: Header & Badge */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center text-xs border border-indigo-500/30 shrink-0">
                              {q.id}
                            </span>
                            <span className="text-[11px] font-medium text-slate-400">
                              {q.category}
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${q.interpretation.badgeColor}`}>
                            {q.interpretation.label}
                          </span>
                        </div>

                        {/* Center: Radial Donut Gauge & Title */}
                        <div className="flex items-center gap-4 my-1">
                          {/* Circular Radial Donut SVG */}
                          <div className="relative shrink-0 flex items-center justify-center w-[110px] h-[110px]">
                            <svg width="110" height="110" viewBox="0 0 110 110" className="transform -rotate-90">
                              <defs>
                                <linearGradient id={`grad-q-${q.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor={gradientColors[0]} />
                                  <stop offset="100%" stopColor={gradientColors[1]} />
                                </linearGradient>
                              </defs>
                              {/* Background track */}
                              <circle
                                cx={cx}
                                cy={cy}
                                r={radius}
                                stroke="rgba(255, 255, 255, 0.08)"
                                strokeWidth="8"
                                fill="none"
                              />
                              {/* Animated Progress Circle */}
                              <circle
                                cx={cx}
                                cy={cy}
                                r={radius}
                                stroke={`url(#grad-q-${q.id})`}
                                strokeWidth="8.5"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                fill="none"
                                className="transition-all duration-1000 ease-out"
                              />
                              {/* Standard Target 4.00 Dot Marker */}
                              <circle
                                cx={markerX}
                                cy={markerY}
                                r="3"
                                fill="#34d399"
                                stroke="#0f172a"
                                strokeWidth="1.5"
                              />
                            </svg>
                            {/* Inside Donut Center: Score */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                              <span className="text-xl font-black text-white tracking-tight leading-none">
                                {q.average > 0 ? q.average.toFixed(2) : '-'}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                                / 5.00
                              </span>
                              <span className="text-[9px] text-emerald-400 font-semibold">
                                {percent.toFixed(0)}%
                              </span>
                            </div>
                          </div>

                          {/* Question Title */}
                          <div className="flex-1">
                            <h3 className="text-xs md:text-sm font-semibold text-slate-100 leading-snug line-clamp-3">
                              {q.title}
                            </h3>
                            <div className="mt-2 text-[10px] text-slate-400">
                              {q.average >= 4.0 ? (
                                <span className="text-emerald-400 font-medium flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> ผ่านเกณฑ์มาตรฐาน
                                </span>
                              ) : (
                                <span className="text-amber-400">
                                  ต่ำกว่าเป้าหมาย 4.00
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Bottom: Stars distribution */}
                        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                          <span className="text-slate-400 font-medium">ดาวที่ได้รับ:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-300">⭐5: <b className="text-emerald-400">{q.distribution[5] || 0}</b></span>
                            <span className="text-slate-300">⭐4: <b className="text-indigo-400">{q.distribution[4] || 0}</b></span>
                            <span className="text-slate-300">⭐3: <b className="text-amber-400">{q.distribution[3] || 0}</b></span>
                            <span className="text-slate-300">⭐1-2: <b className="text-rose-400">{(q.distribution[1] || 0) + (q.distribution[2] || 0)}</b></span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Overall Rating Distribution Donut Chart */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <PieChart className="w-4 h-4 text-indigo-400" />
                        <span>สัดส่วนคะแนนความพึงพอใจทุกระดับ (Donut Distribution)</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        คำนวณจากทุกคะแนนโหวตในทั้ง 5 ข้อรวมกัน
                      </p>
                    </div>
                  </div>

                  {/* Multi-slice Donut Chart Visualizer */}
                  {(() => {
                    const dist = summary.ratingDistribution;
                    const totalVotes = (dist[5] || 0) + (dist[4] || 0) + (dist[3] || 0) + (dist[2] || 0) + (dist[1] || 0);

                    const slices = [
                      { star: 5, label: '5 ดาว (มากที่สุด)', count: dist[5] || 0, color: '#10b981', textColor: 'text-emerald-400' },
                      { star: 4, label: '4 ดาว (มาก)', count: dist[4] || 0, color: '#3b82f6', textColor: 'text-blue-400' },
                      { star: 3, label: '3 ดาว (ปานกลาง)', count: dist[3] || 0, color: '#f59e0b', textColor: 'text-amber-400' },
                      { star: 2, label: '2 ดาว (น้อย)', count: dist[2] || 0, color: '#f97316', textColor: 'text-orange-400' },
                      { star: 1, label: '1 ดาว (น้อยที่สุด)', count: dist[1] || 0, color: '#f43f5e', textColor: 'text-rose-400' },
                    ];

                    const cRadius = 50;
                    const cCircumference = 2 * Math.PI * cRadius; // ~314.159
                    let accumulatedPercent = 0;

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        {/* Donut Graphic */}
                        <div className="md:col-span-5 flex justify-center">
                          <div className="relative w-44 h-44 flex items-center justify-center">
                            <svg width="176" height="176" viewBox="0 0 176 176" className="transform -rotate-90">
                              {/* Background Circle */}
                              <circle
                                cx="88"
                                cy="88"
                                r={cRadius}
                                stroke="rgba(255, 255, 255, 0.06)"
                                strokeWidth="22"
                                fill="none"
                              />

                              {totalVotes > 0 &&
                                slices.map((s) => {
                                  if (s.count === 0) return null;
                                  const slicePercent = (s.count / totalVotes) * 100;
                                  const sliceLength = (slicePercent / 100) * cCircumference;
                                  const offset = (accumulatedPercent / 100) * cCircumference;
                                  accumulatedPercent += slicePercent;

                                  return (
                                    <circle
                                      key={s.star}
                                      cx="88"
                                      cy="88"
                                      r={cRadius}
                                      stroke={s.color}
                                      strokeWidth="20"
                                      strokeDasharray={`${sliceLength} ${cCircumference - sliceLength}`}
                                      strokeDashoffset={-offset}
                                      fill="none"
                                      className="transition-all duration-700 hover:opacity-90 cursor-pointer"
                                    />
                                  );
                                })}
                            </svg>
                            {/* Inside Center */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                              <span className="text-2xl font-black text-white">
                                {totalVotes}
                              </span>
                              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                                คะแนนทั้งหมด
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Legend Cards */}
                        <div className="md:col-span-7 space-y-2">
                          {slices.map((s) => {
                            const pct = totalVotes > 0 ? ((s.count / totalVotes) * 100).toFixed(1) : '0.0';
                            return (
                              <div
                                key={s.star}
                                className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs"
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className="w-3 h-3 rounded-full shrink-0"
                                    style={{ backgroundColor: s.color }}
                                  />
                                  <span className="font-semibold text-slate-200">
                                    {s.label}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="font-bold text-white text-sm">
                                    {s.count} ครั้ง
                                  </span>
                                  <span className={`w-12 text-right font-mono font-bold ${s.textColor}`}>
                                    {pct}%
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>

              </div>
            ) : (
              /* Bar Chart Mode (Alternative) */
              <div className="space-y-4">
                {summary.questionStats.map((q) => {
                  const percent = Math.min(100, Math.max(0, (q.average / 5) * 100));
                  return (
                    <div key={q.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs md:text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center text-xs border border-indigo-500/30">
                            {q.id}
                          </span>
                          <span className="font-semibold text-slate-200">{q.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-extrabold text-white">
                            {q.average > 0 ? q.average.toFixed(2) : '-'}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${q.interpretation.badgeColor}`}>
                            {q.interpretation.label}
                          </span>
                        </div>
                      </div>

                      <div className="relative h-4 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/50">
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-emerald-400/70 z-10"
                          style={{ left: '80%' }}
                          title="เกณฑ์มาตรฐาน 4.00"
                        />
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${
                            q.average >= 4.51
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                              : q.average >= 3.51
                              ? 'bg-gradient-to-r from-indigo-500 to-blue-500'
                              : q.average >= 2.51
                              ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                              : 'bg-gradient-to-r from-rose-500 to-orange-400'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-[11px] text-slate-400 pt-0.5 px-1">
                        <span className="text-slate-400">{q.category}</span>
                        <div className="flex items-center gap-3">
                          <span>⭐ 5: <b className="text-slate-200">{q.distribution[5] || 0}</b></span>
                          <span>⭐ 4: <b className="text-slate-200">{q.distribution[4] || 0}</b></span>
                          <span>⭐ 3: <b className="text-slate-200">{q.distribution[3] || 0}</b></span>
                          <span>⭐ 1-2: <b className="text-slate-200">{(q.distribution[1] || 0) + (q.distribution[2] || 0)}</b></span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Admin Reset / Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span>ข้อมูลจะรีเฟรชแบบอัตโนมัติ Realtime ตลอดการอบรม</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={reloadDemoData}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1"
                title="โหลดข้อมูลตัวอย่าง 5 รายการเพื่อทดสอบการแสดงผล"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>รีเซ็ตข้อมูลตัวอย่าง</span>
              </button>
              <button
                onClick={handleClear}
                className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition flex items-center gap-1"
                title="ล้างข้อมูลทั้งหมดเพื่อเริ่มการอบรมใหม่"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ล้างข้อมูลเริ่มรอบใหม่</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Projector QR Code Side Banner & Live Suggestions Wall */}
        {showQrSideCard && (
          <div className="lg:col-span-4 space-y-6">
            
            {/* Live QR Box for Projector Scan */}
            <div className="bg-gradient-to-b from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
                <QrIcon className="w-3.5 h-3.5" />
                <span>สแกนทำแบบประเมิน</span>
              </div>
              
              <h3 className="text-base md:text-lg font-bold text-white mb-1">
                สแกนผ่านมือถือได้ทันที
              </h3>
              <p className="text-xs text-slate-300 mb-4">
                ไม่ต้องล็อกอิน • ใช้เวลาเพียง 1 นาที
              </p>

              {/* QR Canvas */}
              <div
                onClick={onOpenQrModal}
                className="cursor-pointer group p-3 bg-white rounded-2xl inline-block shadow-2xl border-4 border-indigo-500/30 hover:scale-105 transition-transform"
                title="คลิกเพื่อขยายเต็มจอ"
              >
                <canvas ref={qrCanvasRef} className="rounded-lg mx-auto" />
                <div className="mt-1 text-[10px] font-bold text-slate-900">
                  คลิกเพื่อขยายใหญ่ 🔍
                </div>
              </div>

              {/* Short URL Box */}
              <div className="mt-4">
                <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-indigo-300 truncate">
                  {surveyUrl}
                </div>
              </div>
            </div>

            {/* Live Suggestions Wall */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col h-[460px] backdrop-blur-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span>ข้อเสนอแนะล่าสุด (Live Feed)</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                    {summary.recentSuggestions.length}
                  </span>
                </h3>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> สด
                </span>
              </div>

              {/* Suggestions List */}
              <div className="flex-1 overflow-y-auto space-y-3 pt-3 pr-1 scrollbar-thin">
                {summary.recentSuggestions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 text-xs py-12">
                    <MessageSquare className="w-8 h-8 mb-2 opacity-40" />
                    <span>ยังไม่มีข้อเสนอแนะเพิ่มเติม</span>
                    <span className="text-[11px] mt-1 text-slate-400">
                      เมื่อผู้เข้าอบรมพิมพ์ข้อเสนอแนะ จะแสดงที่นี่ทันที
                    </span>
                  </div>
                ) : (
                  summary.recentSuggestions.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-3.5 shadow-sm transition hover:border-slate-600 animate-fadeIn"
                    >
                      <p className="text-xs text-slate-100 leading-relaxed font-normal">
                        "{item.text}"
                      </p>
                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-700/50 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 text-amber-300 font-medium">
                          <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                          <span>{(item.ratingsAverage || 5).toFixed(1)}/5</span>
                        </span>
                        <span>{item.timeAgo}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
