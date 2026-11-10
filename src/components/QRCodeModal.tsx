import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, Download, Printer, X, ExternalLink, QrCode as QrIcon } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyUrl: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  surveyUrl,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current && surveyUrl) {
      QRCode.toCanvas(
        canvasRef.current,
        surveyUrl,
        {
          width: 260,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) console.error('Error generating QR Code', error);
        }
      );
    }
  }, [isOpen, surveyUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(surveyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'training_survey_qrcode.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-center text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="ปิด"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 mb-3">
          <QrIcon className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">QR Code สำหรับตอบแบบประเมิน</h2>
        <p className="text-xs text-slate-400 mt-1">
          เปิดกล้องบนสมาร์ตโฟนเพื่อสแกนและตอบแบบประเมินได้ทันที
        </p>

        {/* QR Code Canvas Frame */}
        <div className="my-5 p-4 bg-white rounded-2xl inline-block shadow-xl border-4 border-indigo-500/20">
          <canvas ref={canvasRef} className="rounded-lg mx-auto" />
          <div className="mt-2 text-[11px] font-bold text-slate-900 tracking-wide uppercase">
            สแกนประเมินความพึงพอใจ
          </div>
        </div>

        {/* URL Input Box */}
        <div className="relative mb-5">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs">
            <span className="truncate flex-1 text-left text-slate-300 font-mono">
              {surveyUrl}
            </span>
            <button
              onClick={handleCopy}
              className="ml-2 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 text-xs font-medium">
          <button
            onClick={handleDownload}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>บันทึกภาพ QR</span>
          </button>
          <a
            href={surveyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition"
          >
            <ExternalLink className="w-4 h-4 text-emerald-400" />
            <span>เปิดหน้าตอบ</span>
          </a>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
          💡 สามารถฉายภาพหน้านี้ขึ้นจอโปรเจกเตอร์ เพื่อให้ผู้เข้าอบรมทั้งห้องสแกนพร้อมกันได้สะดวก
        </div>
      </div>
    </div>
  );
};
