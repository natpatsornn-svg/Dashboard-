import React, { useState } from 'react';
import {
  STANDALONE_SURVEY_HTML,
  STANDALONE_DASHBOARD_HTML,
} from '../data/standaloneTemplates';
import {
  Copy,
  Check,
  Download,
  FileCode,
  Flame,
  Globe,
  ShieldAlert,
  Server,
  FileSpreadsheet,
  CheckCircle,
  ExternalLink,
  HelpCircle,
  FolderDown,
  Layers,
} from 'lucide-react';

export const FirebaseGuideView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'survey' | 'dashboard' | 'guide'>('guide');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const copyCode = (code: string, fileName: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(null), 2500);
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadBothFiles = () => {
    downloadFile('index.html', STANDALONE_SURVEY_HTML);
    setTimeout(() => {
      downloadFile('dashboard.html', STANDALONE_DASHBOARD_HTML);
    }, 500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 animate-fadeIn">
      
      {/* Title & Overview Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 md:p-8 mb-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-semibold border border-amber-500/30 mb-3">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>HTML + Vanilla JS + Firebase Realtime Database (100% ฟรี)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              โค้ดแยก 2 ไฟล์ & วิธีติดตั้ง Firebase ทีละขั้นตอน
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
              ชุดโค้ด 2 ไฟล์แบบ Standalone เขียนด้วย Pure HTML5 + JavaScript เชื่อมต่อ Firebase Realtime Database โดยตรง
              นำไปรันได้ทุกที่ ไม่ต้องติดตั้ง Node.js หรือคอมไพล์ใดๆ ทั้งสิ้น พร้อมขึ้นจอโปรเจกเตอร์และตอบผ่านมือถือทันที
            </p>
          </div>

          {/* Quick Download All Button */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={downloadBothFiles}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition flex items-center justify-center gap-2"
            >
              <FolderDown className="w-4 h-4" />
              <span>ดาวน์โหลดทั้ง 2 ไฟล์ (HTML)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('guide')}
          className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition flex items-center gap-2 ${
            activeTab === 'guide'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>📖 วิธีตั้งค่า Firebase & Deploy ทีละขั้น</span>
        </button>

        <button
          onClick={() => setActiveTab('survey')}
          className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition flex items-center gap-2 ${
            activeTab === 'survey'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-4 h-4 text-emerald-400" />
          <span>📱 ไฟล์ที่ 1: index.html (หน้าตอบสำหรับมือถือ)</span>
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition flex items-center gap-2 ${
            activeTab === 'dashboard'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-4 h-4 text-indigo-400" />
          <span>🖥️ ไฟล์ที่ 2: dashboard.html (หน้าขึ้นจอโปรเจกเตอร์)</span>
        </button>
      </div>

      {/* TAB 1: STEP-BY-STEP SETUP & DEPLOYMENT GUIDE */}
      {activeTab === 'guide' && (
        <div className="space-y-6">
          
          {/* Step 1: Create Firebase Project */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-start gap-4">
              <span className="w-10 h-10 rounded-2xl bg-indigo-600/30 text-indigo-400 font-extrabold flex items-center justify-center text-lg border border-indigo-500/30 shrink-0">
                1
              </span>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>สร้าง Firebase Project ฟรี 100% (Spark Plan)</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">ฟรีตลอดชีพ</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Firebase Realtime Database ในแพ็กเกจฟรี (Spark Plan) สามารถรองรับคนเข้าพร้อมกันได้ถึง 100 การเชื่อมต่อพร้อมกัน (Simultaneous Connections) และพื้นที่จัดเก็บ 1 GB ซึ่งเพียงพอสำหรับการอบรมสัมมนาทั่วไปอย่างสบาย
                </p>

                <div className="mt-4 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>เข้าเว็บไซต์ <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline font-semibold">Firebase Console (console.firebase.google.com)</a> แล้วล็อกอินด้วยบัญชี Google</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>กดปุ่ม <b>"Add project"</b> หรือ <b>"Create a project"</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>ตั้งชื่อโปรเจกต์ เช่น <code className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300">training-survey-app</code> แล้วกด Continue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>ในหน้า Google Analytics สามารถเลือกปิด (Disable) เพื่อความรวดเร็ว แล้วกด <b>"Create project"</b></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Enable Realtime Database & Rules */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-start gap-4">
              <span className="w-10 h-10 rounded-2xl bg-indigo-600/30 text-indigo-400 font-extrabold flex items-center justify-center text-lg border border-indigo-500/30 shrink-0">
                2
              </span>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>เปิดใช้งาน Realtime Database และตั้งกฎสิทธิ์ (Security Rules)</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">ไม่ต้องล็อกอิน</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  เนื่องจากผู้เข้าอบรมต้องตอบผ่านมือถือโดยไม่ต้องล็อกอิน และจอโปรเจกเตอร์ต้องดึงข้อมูลมาแสดงผลได้ทันที จึงต้องตั้งกฎให้ Database อ่านและเขียนได้สาธารณะ
                </p>

                <div className="mt-4 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>ที่เมนูด้านซ้าย เลือกหมวด <b>Build</b> &gt; คลิก <b>Realtime Database</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>คลิกปุ่ม <b>"Create Database"</b> แล้วเลือกตำแหน่ง Server เช่น <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300">Singapore (asia-southeast1)</code> หรือ United States</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>เลือก <b>"Start in test mode"</b> หรือเข้าไปที่แท็บ <b>Rules</b> ด้านบน แล้วแทนที่โค้ดกฎด้วยข้อความด้านล่างนี้:</span>
                  </div>
                </div>

                {/* Rules Code Box */}
                <div className="mt-3 bg-slate-950 border border-slate-800 rounded-2xl p-4">
                  <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800/80 text-[11px] text-slate-400">
                    <span>Firebase Realtime Database Rules (JSON)</span>
                    <button
                      onClick={() => copyCode(`{\n  "rules": {\n    ".read": true,\n    ".write": true\n  }\n}`, 'rules')}
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      {copiedFile === 'rules' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedFile === 'rules' ? 'คัดลอกแล้ว' : 'คัดลอก Rules'}</span>
                    </button>
                  </div>
                  <pre className="font-mono text-xs text-emerald-400 overflow-x-auto">
{`{
  "rules": {
    ".read": true,
    ".write": true
  }
}`}
                  </pre>
                </div>
                <div className="mt-2 text-[11px] text-amber-400/90 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>อย่าลืมกดปุ่ม <b>"Publish"</b> เพื่อบันทึกการเปลี่ยนแปลงกฎ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Copy firebaseConfig */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-start gap-4">
              <span className="w-10 h-10 rounded-2xl bg-indigo-600/30 text-indigo-400 font-extrabold flex items-center justify-center text-lg border border-indigo-500/30 shrink-0">
                3
              </span>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">
                  คัดลอกค่า firebaseConfig มาใส่ในทั้ง 2 ไฟล์
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  นำค่า Config จาก Firebase Console มาใส่ในบรรทัด <code className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300">const firebaseConfig = &#123; ... &#125;;</code> ในไฟล์ <b>index.html</b> และ <b>dashboard.html</b>
                </p>

                <div className="mt-3 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>คลิกไอคอนฟันเฟือง ⚙️ ข้างคำว่า Project Overview &gt; เลือก <b>Project settings</b></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>เลื่อนลงมาที่หัวข้อ "Your apps" &gt; คลิกไอคอน Web (<b>&lt;/&gt;</b>)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>ตั้งชื่อแอป เช่น <code className="bg-slate-800 px-1 py-0.5 rounded text-indigo-300">SurveyApp</code> แล้วกด Register app</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>คัดลอกออบเจ็กต์ <code className="bg-slate-800 px-1 py-0.5 rounded text-emerald-300">firebaseConfig</code> ทั้งหมด นำไปวางแทนที่ในโค้ด</span>
                  </div>
                </div>

                <div className="mt-3 bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs font-mono text-slate-300">
                  <span className="text-slate-500">// ตัวอย่างค่า firebaseConfig</span><br/>
                  <span className="text-indigo-400">const</span> firebaseConfig = &#123;<br/>
                  &nbsp;&nbsp;apiKey: <span className="text-emerald-400">"AIzaSy..."</span>,<br/>
                  &nbsp;&nbsp;authDomain: <span className="text-emerald-400">"training-app.firebaseapp.com"</span>,<br/>
                  &nbsp;&nbsp;databaseURL: <span className="text-amber-400">"https://training-app-default-rtdb.firebaseio.com"</span>,<br/>
                  &nbsp;&nbsp;projectId: <span className="text-emerald-400">"training-app"</span>,<br/>
                  &nbsp;&nbsp;...<br/>
                  &#125;;
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Deploy for Free in 3 Minutes */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-start gap-4">
              <span className="w-10 h-10 rounded-2xl bg-indigo-600/30 text-indigo-400 font-extrabold flex items-center justify-center text-lg border border-indigo-500/30 shrink-0">
                4
              </span>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>วิธีนำเว็บขึ้นออนไลน์ฟรี (Deploy) ใน 3 นาที</span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] bg-blue-500/20 text-blue-400 border border-blue-500/30">เลือกได้ 3 แบบ</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  เนื่องจากเป็นไฟล์ HTML ธรรมดา 2 ไฟล์ จึงสามารถนำไปโฮสต์ที่ไหนก็ได้แบบฟรี 100%
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {/* Option 1: Netlify Drop */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm text-teal-400">
                      <Globe className="w-4 h-4" />
                      <span>วิธีที่ 1: Netlify Drop</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      ง่ายที่สุดในโลก ไม่ต้องพิมพ์คำสั่งใดๆ
                    </p>
                    <ol className="text-xs text-slate-300 space-y-1 list-decimal list-inside">
                      <li>สร้างโฟลเดอร์ นำไฟล์ <code className="text-indigo-300">index.html</code> และ <code className="text-indigo-300">dashboard.html</code> ใส่ไว้ด้วยกัน</li>
                      <li>เข้า <a href="https://app.netlify.com/drop" target="_blank" rel="noopener noreferrer" className="text-teal-400 underline">app.netlify.com/drop</a></li>
                      <li>ลากโฟลเดอร์ไปวาง จะได้ URL สาธารณะพร้อมใช้งานทันที!</li>
                    </ol>
                  </div>

                  {/* Option 2: GitHub Pages */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm text-purple-400">
                      <Server className="w-4 h-4" />
                      <span>วิธีที่ 2: GitHub Pages</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      ฟรีตลอดชีพ เสถียรสูง เหมาะกับคนใช้ GitHub
                    </p>
                    <ol className="text-xs text-slate-300 space-y-1 list-decimal list-inside">
                      <li>สร้าง GitHub Repository ใหม่</li>
                      <li>อัปโหลดไฟล์ทั้งสองขึ้นไปที่ Branch <code className="text-indigo-300">main</code></li>
                      <li>ไปที่ Settings &gt; Pages &gt; เลือก Source: <code className="text-purple-300">Deploy from branch</code> แล้วกด Save</li>
                    </ol>
                  </div>

                  {/* Option 3: Firebase Hosting */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm text-amber-400">
                      <Flame className="w-4 h-4" />
                      <span>วิธีที่ 3: Firebase Hosting</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      รวมอยู่ในโปรเจกต์เดียวกัน โหลดเร็วมาก
                    </p>
                    <ol className="text-xs text-slate-300 space-y-1 list-decimal list-inside">
                      <li>พิมพ์ <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">npm i -g firebase-tools</code></li>
                      <li>พิมพ์ <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">firebase login</code></li>
                      <li>พิมพ์ <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">firebase init hosting</code> และ <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">firebase deploy</code></li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5: Excel Thai Tips */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-start gap-4">
              <span className="w-10 h-10 rounded-2xl bg-emerald-600/30 text-emerald-400 font-extrabold flex items-center justify-center text-lg border border-emerald-500/30 shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </span>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">
                  เทคนิคเปิดไฟล์ CSV ใน Microsoft Excel โดยภาษาไทยไม่เพี้ยน
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  โค้ดนี้ได้ใส่ <b>UTF-8 BOM (\uFEFF)</b> ไว้ที่หัวไฟล์โดยอัตโนมัติแล้ว ดังนั้นเมื่อกดดาวน์โหลด CSV จากหน้า Dashboard สามารถดับเบิลคลิกเปิดบน Microsoft Excel ได้ทันที ภาษาไทยจะแสดงผลถูกต้อง 100% ไม่เป็นตัวอักษรต่างดาว
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: INDEX.HTML (SURVEY) */}
      {activeTab === 'survey' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileCode className="w-5 h-5 text-emerald-400" />
                <span>index.html (หน้าตอบแบบประเมินสำหรับผู้เข้าอบรม)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Responsive Mobile-first • ปุ่มขนาดใหญ่กดง่าย • ระบบป้องกันส่งซ้ำในเครื่องเดียวกัน
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyCode(STANDALONE_SURVEY_HTML, 'survey')}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
              >
                {copiedFile === 'survey' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedFile === 'survey' ? 'คัดลอกสำเร็จ' : 'คัดลอกโค้ดทั้งหมด'}</span>
              </button>
              <button
                onClick={() => downloadFile('index.html', STANDALONE_SURVEY_HTML)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
              >
                <Download className="w-4 h-4" />
                <span>ดาวน์โหลด index.html</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 overflow-hidden">
            <pre className="font-mono text-xs text-slate-300 overflow-x-auto max-h-[600px] leading-relaxed scrollbar-thin">
              {STANDALONE_SURVEY_HTML}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: DASHBOARD.HTML */}
      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-400" />
                <span>dashboard.html (หน้า Dashboard ขึ้นจอโปรเจกเตอร์)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Real-time Firebase Listener • กราฟแท่งค่าเฉลี่ยรายข้อ • กล่อง QR Code ในตัว • ปุ่ม Export CSV ภาษาไทย
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyCode(STANDALONE_DASHBOARD_HTML, 'dashboard')}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
              >
                {copiedFile === 'dashboard' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedFile === 'dashboard' ? 'คัดลอกสำเร็จ' : 'คัดลอกโค้ดทั้งหมด'}</span>
              </button>
              <button
                onClick={() => downloadFile('dashboard.html', STANDALONE_DASHBOARD_HTML)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
              >
                <Download className="w-4 h-4" />
                <span>ดาวน์โหลด dashboard.html</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 overflow-hidden">
            <pre className="font-mono text-xs text-slate-300 overflow-x-auto max-h-[600px] leading-relaxed scrollbar-thin">
              {STANDALONE_DASHBOARD_HTML}
            </pre>
          </div>
        </div>
      )}

    </div>
  );
};
