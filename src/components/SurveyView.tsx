import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  SURVEY_QUESTIONS,
  LIKERT_OPTIONS,
  interpretMeanScore,
} from '../utils/evaluation';
import {
  saveSubmission,
  isDeviceAlreadySubmitted,
  getSubmittedDeviceRecord,
  resetDeviceLock,
} from '../utils/storage';
import {
  CheckCircle2,
  Sparkles,
  Send,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  Star,
  ShieldCheck,
} from 'lucide-react';

interface SurveyViewProps {
  onSubmissionSuccess?: () => void;
  onNavigateToDashboard?: () => void;
}

export const SurveyView: React.FC<SurveyViewProps> = ({
  onSubmissionSuccess,
  onNavigateToDashboard,
}) => {
  const [ratings, setRatings] = useState<{ [qId: string]: number }>({
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 0,
    q5: 0,
  });
  const [suggestion, setSuggestion] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if device has already submitted
    if (isDeviceAlreadySubmitted()) {
      setIsSubmitted(true);
      setSubmittedRecord(getSubmittedDeviceRecord());
    }
  }, []);

  const handleRatingSelect = (qId: number, score: number) => {
    setRatings((prev) => ({
      ...prev,
      [`q${qId}`]: score,
    }));
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all 5 questions are rated
    const uncompleted = SURVEY_QUESTIONS.filter((q) => !ratings[`q${q.id}`]);
    if (uncompleted.length > 0) {
      setErrorMessage(
        `กรุณาให้คะแนนให้ครบทุกข้อ (ยังไม่ได้ให้คะแนนข้อ: ${uncompleted.map((q) => q.id).join(', ')})`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const result = saveSubmission(
        {
          q1: ratings.q1,
          q2: ratings.q2,
          q3: ratings.q3,
          q4: ratings.q4,
          q5: ratings.q5,
        },
        suggestion
      );

      if (result.success) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'],
        });

        setIsSubmitted(true);
        setSubmittedRecord({
          submittedAt: Date.now(),
          ratings,
          averageScore: result.submission?.averageScore,
        });

        if (onSubmissionSuccess) {
          onSubmissionSuccess();
        }
      } else {
        setErrorMessage(result.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'บันทึกข้อมูลไม่สำเร็จ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestAgain = () => {
    resetDeviceLock();
    setIsSubmitted(false);
    setRatings({ q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 });
    setSuggestion('');
    setErrorMessage(null);
    setSubmittedRecord(null);
  };

  const currentAverage = Object.values(ratings).filter((v) => v > 0).length === 5
    ? Number((Object.values(ratings).reduce((a, b) => a + b, 0) / 5).toFixed(2))
    : 0;
  const currentInterp = currentAverage > 0 ? interpretMeanScore(currentAverage) : null;

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 md:py-10 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mb-3 shadow-lg">
          <Sparkles className="w-7 h-7" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
          แบบประเมินความพึงพอใจการอบรม
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">
          ความคิดเห็นของท่านมีคุณค่าอย่างยิ่งในการพัฒนาและปรับปรุงคุณภาพการจัดอบรมในครั้งต่อไป
        </p>

        {/* Live sync pill & privacy note */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            แสดงผลขึ้นจอสดทันที
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            ไม่ระบุตัวตน (Anonymous)
          </span>
        </div>
      </div>

      {/* Screen 1: Already Submitted View (Duplicate prevention) */}
      {isSubmitted ? (
        <div className="bg-slate-800/90 border border-emerald-500/30 rounded-3xl p-6 md:p-8 text-center shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            บันทึกแบบประเมินเรียบร้อยแล้ว!
          </h2>
          <p className="text-slate-300 text-sm mb-6 leading-relaxed">
            ขอบคุณสำหรับเวลาและความคิดเห็นอันมีค่ายิ่ง คะแนนของท่านถูกนำไปประมวลผลบนจอภาพแบบเรียลไทม์แล้ว
          </p>

          {submittedRecord && (
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-4 mb-6 text-left text-xs space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400 font-medium">สถานะการตอบ:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> บันทึกแล้วบนเครื่องนี้
                </span>
              </div>
              {submittedRecord.averageScore && (
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-400">คะแนนเฉลี่ยที่ท่านประเมิน:</span>
                  <span className="text-indigo-300 font-bold text-sm">
                    ⭐ {Number(submittedRecord.averageScore).toFixed(2)} / 5.00
                  </span>
                </div>
              )}
              <div className="text-[11px] text-slate-500 pt-1">
                🔒 ระบบเปิดระบบป้องกันการส่งซ้ำอัตโนมัติ เพื่อให้สถิติมีความแม่นยำ
              </div>
            </div>
          )}

          <div className="space-y-3">
            {onNavigateToDashboard && (
              <button
                onClick={onNavigateToDashboard}
                className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <span>ดูผลลัพธ์บน Dashboard ทันที</span>
              </button>
            )}

            <button
              onClick={handleTestAgain}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition py-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>(สำหรับผู้ทดสอบ: กดเพื่อรีเซ็ตเครื่องและตอบใหม่อีกครั้ง)</span>
            </button>
          </div>
        </div>
      ) : (
        /* Screen 2: Interactive Mobile Survey Form */
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Quick Guide to 1-5 Scale */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-3.5 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 font-medium text-slate-200 mb-2">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span>เกณฑ์ระดับคะแนน (1 - 5) :</span>
            </div>
            <div className="grid grid-cols-5 gap-1 text-center text-[11px]">
              <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300">
                <span className="block font-bold">1</span>
                <span>น้อยที่สุด</span>
              </div>
              <div className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-300">
                <span className="block font-bold">2</span>
                <span>น้อย</span>
              </div>
              <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
                <span className="block font-bold">3</span>
                <span>ปานกลาง</span>
              </div>
              <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300">
                <span className="block font-bold">4</span>
                <span>มาก</span>
              </div>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                <span className="block font-bold">5</span>
                <span>มากที่สุด</span>
              </div>
            </div>
          </div>

          {/* 5 Questions */}
          {SURVEY_QUESTIONS.map((question) => {
            const currentScore = ratings[`q${question.id}`] || 0;
            return (
              <div
                key={question.id}
                className={`bg-slate-800/90 border rounded-2xl p-4 md:p-5 transition shadow-sm ${
                  currentScore > 0
                    ? 'border-indigo-500/40 bg-slate-800'
                    : 'border-slate-700/80 hover:border-slate-600'
                }`}
              >
                {/* Question Header */}
                <div className="flex items-start gap-2.5 mb-3">
                  <span className="flex-shrink-0 px-2 py-0.5 rounded-lg bg-indigo-600/30 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                    ข้อ {question.id}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-sm md:text-base font-semibold text-white leading-snug">
                      {question.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {question.description}
                    </p>
                  </div>
                </div>

                {/* Rating Buttons - Touch friendly and prominent */}
                <div className="grid grid-cols-5 gap-2 mt-3">
                  {LIKERT_OPTIONS.map((opt) => {
                    const isSelected = currentScore === opt.score;
                    return (
                      <button
                        key={opt.score}
                        type="button"
                        onClick={() => handleRatingSelect(question.id, opt.score)}
                        className={`group relative flex flex-col items-center justify-center py-3.5 md:py-4 px-1 rounded-xl font-bold transition transform active:scale-95 border ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/40 scale-[1.02]'
                            : 'bg-slate-700/50 hover:bg-slate-700 border-slate-600/60 text-slate-200'
                        }`}
                        aria-label={`ให้คะแนน ${opt.score} คะแนน (${opt.label})`}
                      >
                        <span className="text-lg md:text-xl mb-0.5 group-hover:scale-110 transition-transform">
                          {opt.emoji}
                        </span>
                        <span className="text-base md:text-lg font-bold">
                          {opt.score}
                        </span>
                        <span className="text-[10px] font-normal opacity-80 mt-0.5 truncate max-w-full">
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Suggestions Box */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 md:p-5 shadow-sm">
            <label
              htmlFor="suggestion"
              className="block text-sm font-semibold text-white mb-1.5"
            >
              ข้อเสนอแนะเพิ่มเติม / สิ่งที่ประทับใจ{' '}
              <span className="text-slate-400 font-normal text-xs">(ไม่บังคับ)</span>
            </label>
            <textarea
              id="suggestion"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              rows={3}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              placeholder="เช่น ข้อคิดเห็นสำหรับการจัดอบรมครั้งต่อไป หัวข้อที่อยากให้เพิ่ม หรือคำชื่นชมวิทยากรและทีมงาน..."
            />
          </div>

          {/* Live Preview of Average Rating */}
          {currentAverage > 0 && currentInterp && (
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 flex items-center justify-between text-xs">
              <span className="text-slate-300">คะแนนเฉลี่ยที่เลือก:</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-indigo-400 text-sm">
                  {currentAverage.toFixed(2)} / 5.00
                </span>
                <span className={`px-2 py-0.5 rounded-full font-medium ${currentInterp.badgeColor}`}>
                  {currentInterp.label}
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition transform active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span>กำลังประมวลผล...</span>
            ) : (
              <>
                <span>ส่งผลการประเมิน</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
