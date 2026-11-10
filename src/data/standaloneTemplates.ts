/**
 * Template โค้ด 2 ไฟล์ standalone HTML + JavaScript + Firebase Realtime Database
 * สำหรับดาวน์โหลดหรือคัดลอกไปใช้งานได้ทันทีโดยไม่ต้องผ่าน build tool ใดๆ
 */

export const STANDALONE_SURVEY_HTML = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>แบบประเมินความพึงพอใจการอบรม</title>
  <!-- Google Fonts: Prompt -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Canvas Confetti CDN -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  
  <!-- Firebase App & Realtime Database SDK (v8 compat สำหรับรันง่ายไม่ต้องคอมไพล์) -->
  <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js"></script>

  <style>
    body { font-family: 'Prompt', sans-serif; }
    .rating-btn.active {
      background-color: #4f46e5 !important;
      color: #ffffff !important;
      border-color: #4338ca !important;
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
    }
  </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen py-8 px-4 flex flex-col items-center">

  <div class="w-full max-w-lg">
    <!-- Header -->
    <header class="text-center mb-6">
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 mb-3 shadow-lg">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <h1 class="text-2xl font-bold tracking-tight text-white">แบบประเมินความพึงพอใจการอบรม</h1>
      <p class="text-slate-400 text-sm mt-1">ความคิดเห็นของท่านมีคุณค่าอย่างยิ่งในการพัฒนาหลักสูตร</p>
      <div class="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300 border border-slate-700">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        ไม่ต้องระบุชื่อ • ใช้เวลาเพียง 1 นาที
      </div>
    </header>

    <!-- Already Submitted Card (ซ่อนเป็นค่าเริ่มต้น) -->
    <div id="alreadySubmittedCard" class="hidden bg-slate-800 border border-emerald-500/30 rounded-2xl p-6 text-center shadow-xl">
      <div class="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h2 class="text-xl font-bold text-white mb-2">ท่านได้ส่งแบบประเมินเรียบร้อยแล้ว</h2>
      <p class="text-slate-400 text-sm mb-6">ระบบได้บันทึกคะแนนของเครื่องนี้แล้ว ขอบพระคุณสำหรับข้อเสนอแนะอันมีค่าครับ</p>
      <button onclick="resetDeviceVote()" class="text-xs text-slate-400 hover:text-slate-200 underline">
        (สำหรับผู้ทดสอบ: ต้องการส่งใหม่อีกครั้ง คลิกที่นี่)
      </button>
    </div>

    <!-- Main Form -->
    <form id="surveyForm" class="space-y-5">
      
      <!-- คำแนะนำเกณฑ์คะแนน -->
      <div class="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 text-xs text-slate-300 flex justify-between items-center text-center">
        <span class="text-slate-400 font-medium">เกณฑ์คะแนน:</span>
        <span class="text-rose-400">1 = น้อยที่สุด</span>
        <span class="text-orange-400">2 = น้อย</span>
        <span class="text-amber-400">3 = ปานกลาง</span>
        <span class="text-blue-400">4 = มาก</span>
        <span class="text-emerald-400 font-semibold">5 = มากที่สุด</span>
      </div>

      <!-- ข้อ 1 -->
      <div class="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-sm" data-question="q1">
        <div class="flex items-start gap-2 mb-3">
          <span class="px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-400 text-xs font-bold border border-indigo-500/30">ข้อ 1</span>
          <div>
            <h3 class="text-sm font-semibold text-white">เนื้อหาหลักสูตรมีความสอดคล้อง ชัดเจน และเป็นประโยชน์</h3>
            <p class="text-xs text-slate-400 mt-0.5">เนื้อหาครอบคลุม เข้าใจง่าย และสามารถนำไปประยุกต์ใช้ได้จริง</p>
          </div>
        </div>
        <div class="grid grid-cols-5 gap-2">
          <button type="button" onclick="selectScore('q1', 1, this)" class="rating-btn py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-bold text-base transition">1</button>
          <button type="button" onclick="selectScore('q1', 2, this)" class="rating-btn py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-bold text-base transition">2</button>
          <button type="button" onclick="selectScore('q1', 3, this)" class="rating-btn py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-bold text-base transition">3</button>
          <button type="button" onclick="selectScore('q1', 4, this)" class="rating-btn py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-bold text-base transition">4</button>
          <button type="button" onclick="selectScore('q1', 5, this)" class="rating-btn py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-bold text-base transition">5</button>
        </div>
      </div>

      <!-- ข้อ 2 -->
      <div class="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-sm" data-question="q2">
        <div class="flex items-start gap-2 mb-3">
          <span class="px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-400 text-xs font-bold border border-indigo-500/30">ข้อ 2</span>
          <div>
            <h3 class="text-sm font-semibold text-white">วิทยากรมีความเชี่ยวชาญ เทคนิคการถ่ายทอด และตอบคำถามได้ดี</h3>
            <p class="text-xs text-slate-400 mt-0.5">การอธิบายเป็นขั้นตอน ยกตัวอย่างชัดเจน และมีความเป็นกันเอง</p>
          </div>
        </div>
        <div class="grid grid-cols-5 gap-2">
          <button type="button" onclick="selectScore('q2', 1, this)" class="rating-btn py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-bold text-base transition">1</button>
          <button type="button" onclick="selectScore('q2', 2, this)" class="rating-btn py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-bold text-base transition">2</button>
          <button type="button" onclick="selectScore('q2', 3, this)" class="rating-btn py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-bold text-base transition">3</button>
          <button type="button" onclick="selectScore('q2', 4, this)" class="rating-btn py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-bold text-base transition">4</button>
          <button type="button" onclick="selectScore('q2', 5, this)" class="rating-btn py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-bold text-base transition">5</button>
        </div>
      </div>

      <!-- ข้อ 3 -->
      <div class="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-sm" data-question="q3">
        <div class="flex items-start gap-2 mb-3">
          <span class="px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-400 text-xs font-bold border border-indigo-500/30">ข้อ 3</span>
          <div>
            <h3 class="text-sm font-semibold text-white">การจัดสรรเวลาและการดำเนินกิจกรรมมีความเหมาะสม</h3>
            <p class="text-xs text-slate-400 mt-0.5">จังหวะการบรรยาย การฝึกปฏิบัติ และเวลาในการถาม-ตอบ</p>
          </div>
        </div>
        <div class="grid grid-cols-5 gap-2">
          <button type="button" onclick="selectScore('q3', 1, this)" class="rating-btn py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-bold text-base transition">1</button>
          <button type="button" onclick="selectScore('q3', 2, this)" class="rating-btn py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-bold text-base transition">2</button>
          <button type="button" onclick="selectScore('q3', 3, this)" class="rating-btn py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-bold text-base transition">3</button>
          <button type="button" onclick="selectScore('q3', 4, this)" class="rating-btn py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-bold text-base transition">4</button>
          <button type="button" onclick="selectScore('q3', 5, this)" class="rating-btn py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-bold text-base transition">5</button>
        </div>
      </div>

      <!-- ข้อ 4 -->
      <div class="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-sm" data-question="q4">
        <div class="flex items-start gap-2 mb-3">
          <span class="px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-400 text-xs font-bold border border-indigo-500/30">ข้อ 4</span>
          <div>
            <h3 class="text-sm font-semibold text-white">การอำนวยความสะดวก อุปกรณ์ เอกสาร และสถานที่</h3>
            <p class="text-xs text-slate-400 mt-0.5">ความพร้อมของระบบภาพ เสียง อินเทอร์เน็ต และการประสานงาน</p>
          </div>
        </div>
        <div class="grid grid-cols-5 gap-2">
          <button type="button" onclick="selectScore('q4', 1, this)" class="rating-btn py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-bold text-base transition">1</button>
          <button type="button" onclick="selectScore('q4', 2, this)" class="rating-btn py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-bold text-base transition">2</button>
          <button type="button" onclick="selectScore('q4', 3, this)" class="rating-btn py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-bold text-base transition">3</button>
          <button type="button" onclick="selectScore('q4', 4, this)" class="rating-btn py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-bold text-base transition">4</button>
          <button type="button" onclick="selectScore('q4', 5, this)" class="rating-btn py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-bold text-base transition">5</button>
        </div>
      </div>

      <!-- ข้อ 5 -->
      <div class="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-sm" data-question="q5">
        <div class="flex items-start gap-2 mb-3">
          <span class="px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-400 text-xs font-bold border border-indigo-500/30">ข้อ 5</span>
          <div>
            <h3 class="text-sm font-semibold text-white">ความพึงพอใจในภาพรวมของการเข้าร่วมอบรม</h3>
            <p class="text-xs text-slate-400 mt-0.5">ความคุ้มค่าและความพร้อมในการนำความรู้ไปใช้ในงานจริง</p>
          </div>
        </div>
        <div class="grid grid-cols-5 gap-2">
          <button type="button" onclick="selectScore('q5', 1, this)" class="rating-btn py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-bold text-base transition">1</button>
          <button type="button" onclick="selectScore('q5', 2, this)" class="rating-btn py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-bold text-base transition">2</button>
          <button type="button" onclick="selectScore('q5', 3, this)" class="rating-btn py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-bold text-base transition">3</button>
          <button type="button" onclick="selectScore('q5', 4, this)" class="rating-btn py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-bold text-base transition">4</button>
          <button type="button" onclick="selectScore('q5', 5, this)" class="rating-btn py-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/60 text-slate-200 font-bold text-base transition">5</button>
        </div>
      </div>

      <!-- ช่องข้อเสนอแนะ -->
      <div class="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-sm">
        <label for="suggestion" class="block text-sm font-semibold text-white mb-1">
          ข้อเสนอแนะเพิ่มเติม / สิ่งที่ประทับใจ <span class="text-slate-400 font-normal text-xs">(ไม่บังคับ)</span>
        </label>
        <textarea id="suggestion" rows="3" class="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="ความคิดเห็น คำชม หรือข้อเสนอแนะสำหรับการจัดครั้งต่อไป..."></textarea>
      </div>

      <!-- Submit Button -->
      <button type="submit" id="submitBtn" class="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-600/30 transition transform active:scale-98 flex items-center justify-center gap-2">
        <span>ส่งแบบประเมิน</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
        </svg>
      </button>

      <div id="errorMsg" class="hidden text-center text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-xl p-3"></div>
    </form>
  </div>

  <script>
    // ==========================================
    // 1. ตั้งค่า FIREBASE CONFIG (นำค่าจาก Firebase Console มาวางที่นี่)
    // ==========================================
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.appspot.com",
      messagingSenderId: "YOUR_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    // ตรวจสอบและเริ่มต้น Firebase (หากยังไม่ได้ใส่ค่า config จะบันทึกลง LocalStorage ทดแทน)
    let isFirebaseReady = false;
    let database = null;
    try {
      if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
        firebase.initializeApp(firebaseConfig);
        database = firebase.database();
        isFirebaseReady = true;
        console.log("Firebase initialized successfully");
      }
    } catch (e) {
      console.warn("Firebase not configured, running in local mode", e);
    }

    // ==========================================
    // 2. สถานะการตอบแบบสอบถาม
    // ==========================================
    const userRatings = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 };
    const STORAGE_KEY = "training_survey_submitted_v1";

    // ตรวจสอบว่าเคยส่งไปแล้วหรือไม่ (ป้องกันการตอบซ้ำ)
    if (localStorage.getItem(STORAGE_KEY)) {
      document.getElementById("surveyForm").classList.add("hidden");
      document.getElementById("alreadySubmittedCard").classList.remove("hidden");
    }

    function selectScore(qKey, score, buttonEl) {
      userRatings[qKey] = score;
      // เอา active class ออกจากพี่น้องในข้อเดียวกัน
      const parent = buttonEl.parentElement;
      parent.querySelectorAll('.rating-btn').forEach(btn => btn.classList.remove('active'));
      buttonEl.classList.add('active');

      // ซ่อน error ถ้ามี
      document.getElementById("errorMsg").classList.add("hidden");
    }

    function resetDeviceVote() {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }

    // ==========================================
    // 3. จัดการการกดส่งแบบประเมิน
    // ==========================================
    document.getElementById("surveyForm").addEventListener("submit", function(e) {
      e.preventDefault();

      // ตรวจสอบว่าตอบครบทั้ง 5 ข้อหรือไม่
      const missing = [];
      if (!userRatings.q1) missing.push("ข้อ 1");
      if (!userRatings.q2) missing.push("ข้อ 2");
      if (!userRatings.q3) missing.push("ข้อ 3");
      if (!userRatings.q4) missing.push("ข้อ 4");
      if (!userRatings.q5) missing.push("ข้อ 5");

      if (missing.length > 0) {
        const errorEl = document.getElementById("errorMsg");
        errorEl.textContent = "กรุณาให้คะแนนให้ครบทุกข้อ (ยังไม่ได้ตอบ: " + missing.join(", ") + ")";
        errorEl.classList.remove("hidden");
        return;
      }

      const suggestionText = document.getElementById("suggestion").value.trim();
      const avgScore = Number(((userRatings.q1 + userRatings.q2 + userRatings.q3 + userRatings.q4 + userRatings.q5) / 5).toFixed(2));

      const payload = {
        timestamp: Date.now(),
        dateString: new Date().toLocaleString('th-TH'),
        ratings: userRatings,
        averageScore: avgScore,
        suggestion: suggestionText
      };

      const submitBtn = document.getElementById("submitBtn");
      submitBtn.disabled = true;
      submitBtn.innerHTML = "<span>กำลังบันทึก...</span>";

      // ส่งข้อมูลไปยัง Firebase Realtime Database
      if (isFirebaseReady && database) {
        database.ref("surveys").push(payload)
          .then(() => handleSuccess())
          .catch(err => {
            console.error("Firebase Error:", err);
            // บันทึกสำรองลง LocalStorage
            saveToLocal(payload);
            handleSuccess();
          });
      } else {
        // โหมด Local / Broadcast สำหรับทดสอบ
        saveToLocal(payload);
        handleSuccess();
      }
    });

    function saveToLocal(payload) {
      try {
        const current = JSON.parse(localStorage.getItem("training_survey_responses_v1") || "[]");
        current.unshift({ id: "local_" + Date.now(), ...payload });
        localStorage.setItem("training_survey_responses_v1", JSON.stringify(current));
        
        // Broadcast สำหรับเปิดแท็บคู่กัน
        if ('BroadcastChannel' in window) {
          const bc = new BroadcastChannel('training_survey_realtime_channel');
          bc.postMessage({ type: 'NEW_SUBMISSION', data: payload });
        }
      } catch (err) {
        console.error("Local save error:", err);
      }
    }

    function handleSuccess() {
      // ทำเครื่องหมายว่าเครื่องนี้ตอบแล้ว
      localStorage.setItem(STORAGE_KEY, "true");

      // จุดพลุเฉลิมฉลอง
      if (typeof confetti === 'function') {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }

      // แสดงการ์ดขอบคุณ
      document.getElementById("surveyForm").classList.add("hidden");
      document.getElementById("alreadySubmittedCard").classList.remove("hidden");
    }
  </script>
</body>
</html>`;

export const STANDALONE_DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live Dashboard - ผลการประเมินความพึงพอใจการอบรม</title>
  <!-- Google Fonts: Prompt -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Chart.js CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <!-- QRCode.js CDN -->
  <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
  
  <!-- Firebase App & Realtime Database SDK (v8 compat) -->
  <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js"></script>

  <style>
    body { font-family: 'Prompt', sans-serif; }
    .pulse-ring {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 md:p-8 flex flex-col">

  <!-- Top Bar สำหรับฉายจอโปรเจกเตอร์ -->
  <header class="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
    <div class="flex items-center gap-3">
      <div class="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center text-xl font-bold">
        📊
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl md:text-3xl font-bold tracking-tight text-white">Live Training Dashboard</h1>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            REAL-TIME
          </span>
        </div>
        <p class="text-slate-400 text-sm mt-0.5">ผลการประเมินความพึงพอใจของผู้เข้าอบรม (อัปเดตอัตโนมัติทันทีที่มีคนตอบ)</p>
      </div>
    </div>

    <!-- Actions Bar -->
    <div class="flex items-center gap-2">
      <button onclick="exportCSV()" class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition flex items-center gap-2">
        <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        ดาวน์โหลด CSV (Excel ภาษาไทย)
      </button>
      <button onclick="toggleFullScreen()" class="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-slate-700 transition" title="เปิดเต็มจอ">
        ⛶ เต็มจอ
      </button>
    </div>
  </header>

  <!-- Main Grid Layout -->
  <main class="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 flex-1">
    
    <!-- ฝั่งซ้าย (สถิติหลัก & กราฟ) : 8 คอลัมน์ -->
    <div class="lg:col-span-8 space-y-6">
      
      <!-- Top Score Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        
        <!-- การ์ด 1: จำนวนผู้ตอบ -->
        <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div class="text-slate-400 text-xs font-medium uppercase tracking-wider">ผู้ตอบแบบประเมินทั้งหมด</div>
          <div class="flex items-baseline gap-2 mt-2">
            <span id="totalCount" class="text-4xl md:text-5xl font-extrabold text-white tracking-tight">0</span>
            <span class="text-slate-400 text-sm">ท่าน</span>
          </div>
          <div class="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-indigo-400"></span> ไม่เปิดเผยตัวตน (Anonymous)
          </div>
        </div>

        <!-- การ์ด 2: คะแนนเฉลี่ยรวม -->
        <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div class="text-slate-400 text-xs font-medium uppercase tracking-wider">คะแนนเฉลี่ยรวม 5 ข้อ</div>
          <div class="flex items-baseline gap-2 mt-2">
            <span id="overallAvg" class="text-4xl md:text-5xl font-extrabold text-indigo-400 tracking-tight">0.00</span>
            <span class="text-slate-400 text-sm">/ 5.00</span>
          </div>
          <div class="mt-2">
            <span id="overallBadge" class="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
              รอข้อมูล
            </span>
          </div>
        </div>

        <!-- การ์ด 3: เกณฑ์การแปลผล 5 ระดับ -->
        <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg text-xs flex flex-col justify-between">
          <div class="font-semibold text-slate-300 mb-1">เกณฑ์การแปลผล (Likert Scale):</div>
          <div class="space-y-1 text-[11px]">
            <div class="flex justify-between items-center"><span class="text-emerald-400 font-medium">4.51 - 5.00</span> <span class="text-slate-300">มากที่สุด</span></div>
            <div class="flex justify-between items-center"><span class="text-blue-400 font-medium">3.51 - 4.50</span> <span class="text-slate-300">มาก</span></div>
            <div class="flex justify-between items-center"><span class="text-amber-400 font-medium">2.51 - 3.50</span> <span class="text-slate-300">ปานกลาง</span></div>
            <div class="flex justify-between items-center"><span class="text-orange-400 font-medium">1.51 - 2.50</span> <span class="text-slate-300">น้อย</span></div>
            <div class="flex justify-between items-center"><span class="text-rose-400 font-medium">1.00 - 1.50</span> <span class="text-slate-300">น้อยที่สุด</span></div>
          </div>
        </div>

      </div>

      <!-- Chart Panel: กราฟวงกลมค่าเฉลี่ยรายข้อ -->
      <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-lg font-bold text-white flex items-center gap-2">
              <span>⭕ กราฟวงกลมเปรียบเทียบคะแนน (สเกล 1-5)</span>
            </h2>
            <p class="text-xs text-slate-400">สัดส่วนคะแนนความพึงพอใจแต่ละด้านของการจัดอบรม</p>
          </div>
          <span class="text-xs text-emerald-400 font-medium">เป้าหมายมาตรฐาน ≥ 4.00</span>
        </div>
        <div class="relative h-64 md:h-72 w-full flex items-center justify-center">
          <canvas id="ratingsChart"></canvas>
        </div>
      </div>

      <!-- ข้อสรุปรายข้อแบบการ์ดละเอียด -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="questionsDetailGrid">
        <!-- JS จะสร้างการ์ดย่อยรายข้อตรงนี้ -->
      </div>

    </div>

    <!-- ฝั่งขวา (QR Code ให้สแกน & กล่องข้อเสนอแนะสด) : 4 คอลัมน์ -->
    <div class="lg:col-span-4 space-y-6">
      
      <!-- กล่อง QR Code สำหรับขึ้นจอให้ผู้เข้าอบรมสแกน -->
      <div class="bg-gradient-to-b from-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 text-center shadow-xl">
        <h3 class="text-base font-bold text-white mb-1">สแกนเพื่อตอบแบบประเมิน</h3>
        <p class="text-xs text-slate-300 mb-4">เปิดกล้องมือถือสแกน QR Code ด้านล่างนี้ได้ทันที</p>
        
        <div class="bg-white p-3 rounded-2xl inline-block shadow-2xl mx-auto border-4 border-indigo-500/20">
          <div id="qrcodeCanvas"></div>
        </div>

        <div class="mt-4">
          <input type="text" id="surveyUrlInput" readonly class="w-full bg-slate-950/90 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-indigo-300 text-center font-mono focus:outline-none" value="">
        </div>
      </div>

      <!-- กล่องรายการข้อเสนอแนะล่าสุด (Live Suggestions) -->
      <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col h-[400px]">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <span>💬 ข้อเสนอแนะล่าสุด</span>
            <span id="suggestionsCountBadge" class="px-2 py-0.5 rounded-full text-[11px] bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">0</span>
          </h3>
          <span class="text-xs text-slate-400">อัปเดตสด</span>
        </div>

        <div id="suggestionsList" class="flex-1 overflow-y-auto space-y-3 pt-3 pr-1">
          <div class="text-center text-slate-500 text-xs py-10">ยังไม่มีข้อเสนอแนะ</div>
        </div>
      </div>

    </div>

  </main>

  <script>
    // ==========================================
    // 1. ตั้งค่า FIREBASE CONFIG (เดียวกับหน้า survey)
    // ==========================================
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.appspot.com",
      messagingSenderId: "YOUR_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    let allSubmissions = [];
    let chartInstance = null;

    // คำถาม 5 ข้อ
    const questionsMeta = [
      { id: 1, key: 'q1', title: '1. เนื้อหาหลักสูตรชัดเจนและเป็นประโยชน์' },
      { id: 2, key: 'q2', title: '2. วิทยากรถ่ายทอดได้ดีและเชี่ยวชาญ' },
      { id: 3, key: 'q3', title: '3. เวลาและกิจกรรมมีความเหมาะสม' },
      { id: 4, key: 'q4', title: '4. อุปกรณ์ สถานที่ และการประสานงาน' },
      { id: 5, key: 'q5', title: '5. ความพึงพอใจในภาพรวมของการอบรม' },
    ];

    // เกณฑ์การแปลผล 5 ระดับ
    function getInterpretation(score) {
      if (score >= 4.51) return { label: 'มากที่สุด', bg: 'bg-emerald-500 text-white' };
      if (score >= 3.51) return { label: 'มาก', bg: 'bg-blue-500 text-white' };
      if (score >= 2.51) return { label: 'ปานกลาง', bg: 'bg-amber-500 text-slate-900' };
      if (score >= 1.51) return { label: 'น้อย', bg: 'bg-orange-500 text-white' };
      return { label: 'น้อยที่สุด', bg: 'bg-rose-500 text-white' };
    }

    // สร้าง QR Code ให้ชี้ไปที่หน้าตอบแบบสอบถาม (เช่น index.html)
    window.addEventListener('DOMContentLoaded', () => {
      let targetSurveyUrl = window.location.href.replace('dashboard.html', 'index.html');
      if (targetSurveyUrl === window.location.href) {
        targetSurveyUrl = window.location.origin + window.location.pathname.replace(/[^\\/]*$/, 'index.html');
      }
      document.getElementById('surveyUrlInput').value = targetSurveyUrl;

      new QRCode(document.getElementById("qrcodeCanvas"), {
        text: targetSurveyUrl,
        width: 160,
        height: 160,
        colorDark: "#0f172a",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
      });

      initChart();
      connectData();
    });

    function initChart() {
      const ctx = document.getElementById('ratingsChart').getContext('2d');
      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['ข้อ 1: เนื้อหา', 'ข้อ 2: วิทยากร', 'ข้อ 3: เวลา', 'ข้อ 4: สถานที่', 'ข้อ 5: ภาพรวม'],
          datasets: [{
            label: 'คะแนนเฉลี่ย',
            data: [0, 0, 0, 0, 0],
            backgroundColor: [
              '#10b981',
              '#3b82f6',
              '#6366f1',
              '#f59e0b',
              '#8b5cf6'
            ],
            borderColor: '#0f172a',
            borderWidth: 3,
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: '#cbd5e1', font: { family: 'Prompt', size: 12 }, padding: 15 }
            }
          },
          cutout: '65%'
        }
      });
    }

    // เชื่อมต่อ Firebase Realtime DB หรือดึงจาก LocalStorage/BroadcastChannel
    function connectData() {
      let isFirebase = false;
      try {
        if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
          firebase.initializeApp(firebaseConfig);
          const db = firebase.database();
          isFirebase = true;

          // Realtime listener
          db.ref("surveys").on("value", snapshot => {
            const data = snapshot.val();
            if (data) {
              allSubmissions = Object.keys(data).map(k => ({ id: k, ...data[k] })).reverse();
            } else {
              allSubmissions = [];
            }
            updateDashboard();
          });
        }
      } catch (e) {
        console.warn("Using local sync", e);
      }

      if (!isFirebase) {
        // ดึงจาก Local Storage และเปิด BroadcastChannel
        const loadLocal = () => {
          allSubmissions = JSON.parse(localStorage.getItem("training_survey_responses_v1") || "[]");
          updateDashboard();
        };
        loadLocal();

        if ('BroadcastChannel' in window) {
          const bc = new BroadcastChannel('training_survey_realtime_channel');
          bc.onmessage = () => loadLocal();
        }
        window.addEventListener('storage', () => loadLocal());
      }
    }

    function updateDashboard() {
      const total = allSubmissions.length;
      document.getElementById('totalCount').textContent = total;

      if (total === 0) {
        document.getElementById('overallAvg').textContent = "0.00";
        document.getElementById('overallBadge').textContent = "รอข้อมูล";
        document.getElementById('overallBadge').className = "inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300";
        if (chartInstance) {
          chartInstance.data.datasets[0].data = [0, 0, 0, 0, 0];
          chartInstance.update();
        }
        document.getElementById('suggestionsList').innerHTML = '<div class="text-center text-slate-500 text-xs py-10">ยังไม่มีข้อเสนอแนะ</div>';
        return;
      }

      // คำนวณรายข้อ
      const sums = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 };
      allSubmissions.forEach(sub => {
        sums.q1 += (sub.ratings?.q1 || 0);
        sums.q2 += (sub.ratings?.q2 || 0);
        sums.q3 += (sub.ratings?.q3 || 0);
        sums.q4 += (sub.ratings?.q4 || 0);
        sums.q5 += (sub.ratings?.q5 || 0);
      });

      const averages = [
        Number((sums.q1 / total).toFixed(2)),
        Number((sums.q2 / total).toFixed(2)),
        Number((sums.q3 / total).toFixed(2)),
        Number((sums.q4 / total).toFixed(2)),
        Number((sums.q5 / total).toFixed(2)),
      ];

      const overall = Number((averages.reduce((a, b) => a + b, 0) / 5).toFixed(2));
      document.getElementById('overallAvg').textContent = overall.toFixed(2);
      
      const interp = getInterpretation(overall);
      const badge = document.getElementById('overallBadge');
      badge.textContent = interp.label;
      badge.className = "inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold " + interp.bg;

      // Update Chart
      if (chartInstance) {
        chartInstance.data.datasets[0].data = averages;
        chartInstance.update();
      }

      // Update รายละเอียดการ์ดย่อย
      const detailGrid = document.getElementById('questionsDetailGrid');
      detailGrid.innerHTML = questionsMeta.map((q, idx) => {
        const qAvg = averages[idx];
        const qInterp = getInterpretation(qAvg);
        const percent = (qAvg / 5) * 100;
        return \`
          <div class="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5">
            <div class="flex items-center justify-between text-xs mb-1.5">
              <span class="font-medium text-slate-200">\${q.title}</span>
              <span class="font-bold text-white text-sm">\${qAvg.toFixed(2)}</span>
            </div>
            <div class="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
              <div class="bg-indigo-500 h-full rounded-full transition-all duration-500" style="width: \${percent}%"></div>
            </div>
            <div class="flex justify-between items-center text-[11px]">
              <span class="text-slate-400">ระดับความพึงพอใจ:</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-medium \${qInterp.bg}">\${qInterp.label}</span>
            </div>
          </div>
        \`;
      }).join('');

      // Update รายการข้อเสนอแนะ
      const suggestions = allSubmissions.filter(s => s.suggestion && s.suggestion.trim().length > 0);
      document.getElementById('suggestionsCountBadge').textContent = suggestions.length;
      const sugList = document.getElementById('suggestionsList');

      if (suggestions.length === 0) {
        sugList.innerHTML = '<div class="text-center text-slate-500 text-xs py-10">ยังไม่มีข้อเสนอแนะเพิ่มเติม</div>';
      } else {
        sugList.innerHTML = suggestions.slice(0, 15).map(s => \`
          <div class="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 shadow-sm">
            <p class="text-xs text-slate-100 leading-relaxed font-normal">"\${escapeHtml(s.suggestion)}"</p>
            <div class="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/40 text-[10px] text-slate-400">
              <span>คะแนนเฉลี่ย: ⭐ \${(s.averageScore || 5).toFixed(1)}/5</span>
              <span>\${s.dateString || 'เมื่อสักครู่'}</span>
            </div>
          </div>
        \`).join('');
      }
    }

    function escapeHtml(text) {
      if (!text) return '';
      return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function toggleFullScreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.log(err));
      } else {
        document.exitFullscreen().catch(err => console.log(err));
      }
    }

    // ดาวน์โหลดผลเป็นไฟล์ CSV รองรับภาษาไทย UTF-8 BOM ใน Microsoft Excel
    function exportCSV() {
      if (allSubmissions.length === 0) {
        alert("ยังไม่มีข้อมูลแบบประเมินสำหรับส่งออก");
        return;
      }

      const headers = ['ลำดับ', 'วันที่-เวลา', 'ข้อ1_เนื้อหา', 'ข้อ2_วิทยากร', 'ข้อ3_เวลา', 'ข้อ4_สถานที่', 'ข้อ5_ภาพรวม', 'คะแนนเฉลี่ย', 'ข้อเสนอแนะ'];
      const rows = allSubmissions.map((sub, i) => {
        const dateStr = sub.dateString || new Date(sub.timestamp || Date.now()).toLocaleString('th-TH');
        const cleanSug = (sub.suggestion || '').replace(/"/g, '""');
        return [
          i + 1,
          \`"\${dateStr}"\`,
          sub.ratings?.q1 || '',
          sub.ratings?.q2 || '',
          sub.ratings?.q3 || '',
          sub.ratings?.q4 || '',
          sub.ratings?.q5 || '',
          sub.averageScore || '',
          \`"\${cleanSug}"\`
        ].join(',');
      });

      const csvContent = "\\uFEFF" + [headers.join(','), ...rows].join('\\r\\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "Training_Survey_Results_" + new Date().toISOString().slice(0, 10) + ".csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  </script>
</body>
</html>`;
