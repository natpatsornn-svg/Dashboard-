import {
  InterpretationResult,
  QuestionItem,
  QuestionStat,
  SurveySubmission,
  SurveySummary,
} from '../types/survey';

export const SURVEY_QUESTIONS: QuestionItem[] = [
  {
    id: 1,
    title: 'เนื้อหาหลักสูตรมีความสอดคล้อง ชัดเจน และเป็นประโยชน์',
    category: 'ด้านเนื้อหาหลักสูตร',
    description: 'ความครอบคลุม เข้าใจง่าย และสามารถนำไปต่อยอดได้จริง',
  },
  {
    id: 2,
    title: 'วิทยากรมีความเชี่ยวชาญ เทคนิคการถ่ายทอด และตอบคำถามได้ดี',
    category: 'ด้านวิทยากร',
    description: 'การอธิบายเป็นขั้นตอน ยกตัวอย่างชัดเจน และการมีส่วนร่วม',
  },
  {
    id: 3,
    title: 'การจัดสรรเวลาและการดำเนินกิจกรรมมีความเหมาะสม',
    category: 'ด้านการบริหารเวลา',
    description: 'จังหวะการบรรยาย การฝึกปฏิบัติ และเวลาในการถาม-ตอบ',
  },
  {
    id: 4,
    title: 'การอำนวยความสะดวก อุปกรณ์ เอกสาร และสถานที่จัดอบรม',
    category: 'ด้านการบริการและสถานที่',
    description: 'ความพร้อมของสัญญาณ/ระบบ ภาพ เสียง อาหารว่าง และทีมงาน',
  },
  {
    id: 5,
    title: 'ความพึงพอใจในภาพรวมและสามารถนำความรู้ไปประยุกต์ใช้ได้',
    category: 'ความพึงพอใจในภาพรวม',
    description: 'ความคุ้มค่าและความพร้อมในการนำไปใช้งานในชีวิตหรือการทำงาน',
  },
];

export const LIKERT_OPTIONS = [
  { score: 5, label: 'มากที่สุด', emoji: '🌟', color: 'emerald', shortLabel: 'มากที่สุด (5)' },
  { score: 4, label: 'มาก', emoji: '👍', color: 'blue', shortLabel: 'มาก (4)' },
  { score: 3, label: 'ปานกลาง', emoji: '👌', color: 'amber', shortLabel: 'ปานกลาง (3)' },
  { score: 2, label: 'น้อย', emoji: '👎', color: 'orange', shortLabel: 'น้อย (2)' },
  { score: 1, label: 'น้อยที่สุด', emoji: '⚠️', color: 'rose', shortLabel: 'น้อยที่สุด (1)' },
];

/**
 * แปลผลค่าเฉลี่ยตามเกณฑ์ 5 ระดับ (Best Practice for Likert Scale in Thailand)
 * 4.51 - 5.00 : มากที่สุด
 * 3.51 - 4.50 : มาก
 * 2.51 - 3.50 : ปานกลาง
 * 1.51 - 2.50 : น้อย
 * 1.00 - 1.50 : น้อยที่สุด
 */
export function interpretMeanScore(mean: number): InterpretationResult {
  if (mean >= 4.51) {
    return {
      label: 'มากที่สุด',
      level: 5,
      badgeColor: 'bg-emerald-500 text-white',
      textColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      description: 'ระดับความพึงพอใจยอดเยี่ยม เกินความคาดหวัง',
    };
  } else if (mean >= 3.51) {
    return {
      label: 'มาก',
      level: 4,
      badgeColor: 'bg-blue-500 text-white',
      textColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      description: 'ระดับความพึงพอใจอยู่ในเกณฑ์ดี มีมาตรฐานสูง',
    };
  } else if (mean >= 2.51) {
    return {
      label: 'ปานกลาง',
      level: 3,
      badgeColor: 'bg-amber-500 text-slate-900',
      textColor: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      description: 'ระดับความพึงพอใจพอใช้ ควรพิจารณาปรับปรุงบางส่วน',
    };
  } else if (mean >= 1.51) {
    return {
      label: 'น้อย',
      level: 2,
      badgeColor: 'bg-orange-500 text-white',
      textColor: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      description: 'ระดับความพึงพอใจต่ำกว่าเกณฑ์ ต้องปรับปรุงอย่างเร่งด่วน',
    };
  } else {
    return {
      label: 'น้อยที่สุด',
      level: 1,
      badgeColor: 'bg-rose-500 text-white',
      textColor: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      description: 'ระดับความพึงพอใจวิกฤต จำเป็นต้องทบทวนโครงสร้างทั้งระบบ',
    };
  }
}

/**
 * คำนวณสถิติและผลสรุปทั้งหมดจากรายการแบบสอบถาม
 */
export function calculateSurveySummary(submissions: SurveySubmission[]): SurveySummary {
  const total = submissions.length;

  if (total === 0) {
    const emptyStats: QuestionStat[] = SURVEY_QUESTIONS.map((q) => ({
      id: q.id,
      title: q.title,
      shortTitle: `ข้อ ${q.id}: ${q.category}`,
      category: q.category,
      average: 0,
      count: 0,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      interpretation: interpretMeanScore(0),
    }));

    return {
      totalResponses: 0,
      overallAverage: 0,
      overallInterpretation: {
        label: 'รอข้อมูล',
        level: 0,
        badgeColor: 'bg-slate-700 text-slate-300',
        textColor: 'text-slate-400',
        bgColor: 'bg-slate-800/50',
        borderColor: 'border-slate-700',
        description: 'ยังไม่มีผู้ส่งแบบประเมิน',
      },
      questionStats: emptyStats,
      recentSuggestions: [],
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  // คำนวณรายข้อ
  const qSums = [0, 0, 0, 0, 0];
  const qDistributions: { [rating: number]: number }[] = [
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  ];
  const overallDist: { [rating: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  submissions.forEach((sub) => {
    const scores = [
      sub.ratings.q1 || 5,
      sub.ratings.q2 || 5,
      sub.ratings.q3 || 5,
      sub.ratings.q4 || 5,
      sub.ratings.q5 || 5,
    ];

    scores.forEach((sc, idx) => {
      qSums[idx] += sc;
      qDistributions[idx][sc] = (qDistributions[idx][sc] || 0) + 1;
      overallDist[sc] = (overallDist[sc] || 0) + 1;
    });
  });

  const questionStats: QuestionStat[] = SURVEY_QUESTIONS.map((q, idx) => {
    const avg = Number((qSums[idx] / total).toFixed(2));
    return {
      id: q.id,
      title: q.title,
      shortTitle: `ข้อ ${q.id}: ${q.category}`,
      category: q.category,
      average: avg,
      count: total,
      distribution: qDistributions[idx],
      interpretation: interpretMeanScore(avg),
    };
  });

  // ค่าเฉลี่ยรวม 5 ข้อ
  const sumOfAverages = questionStats.reduce((acc, curr) => acc + curr.average, 0);
  const overallAverage = Number((sumOfAverages / questionStats.length).toFixed(2));
  const overallInterpretation = interpretMeanScore(overallAverage);

  // รายการข้อเสนอแนะล่าสุด (กรองเฉพาะที่มีข้อความ)
  const recentSuggestions = submissions
    .filter((s) => s.suggestion && s.suggestion.trim().length > 0)
    .sort((a, b) => b.timestamp - a.timestamp)
    .map((s) => ({
      id: s.id,
      text: s.suggestion!.trim(),
      timestamp: s.timestamp,
      timeAgo: formatTimeAgo(s.timestamp),
      ratingsAverage: s.averageScore,
    }));

  return {
    totalResponses: total,
    overallAverage,
    overallInterpretation,
    questionStats,
    recentSuggestions,
    ratingDistribution: overallDist,
  };
}

/**
 * Format relative time in Thai
 */
export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  if (diffInSeconds < 30) return 'เมื่อสักครู่';
  if (diffInSeconds < 60) return `${diffInSeconds} วินาทีที่แล้ว`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} นาทีที่แล้ว`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`;
  const date = new Date(timestamp);
  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * สร้างไฟล์ CSV พร้อม UTF-8 BOM สำหรับเปิดใน Microsoft Excel ได้ภาษาไทยถูกต้อง 100%
 */
export function exportSubmissionsToCSV(submissions: SurveySubmission[]): void {
  const headers = [
    'ลำดับ',
    'วันที่-เวลา',
    'ข้อ 1 (เนื้อหา)',
    'ข้อ 2 (วิทยากร)',
    'ข้อ 3 (เวลา)',
    'ข้อ 4 (สถานที่และอุปกรณ์)',
    'ข้อ 5 (ภาพรวม)',
    'คะแนนเฉลี่ย',
    'ระดับความพึงพอใจ',
    'ข้อเสนอแนะเพิ่มเติม',
  ];

  const rows = submissions.map((sub, index) => {
    const avg = sub.averageScore || 0;
    const interp = interpretMeanScore(avg);
    const dateStr = new Date(sub.timestamp).toLocaleString('th-TH', {
      timeZone: 'Asia/Bangkok',
    });

    const escapeCsv = (str: string | undefined) => {
      if (!str) return '""';
      const clean = str.replace(/"/g, '""');
      return `"${clean}"`;
    };

    return [
      index + 1,
      `"${dateStr}"`,
      sub.ratings.q1,
      sub.ratings.q2,
      sub.ratings.q3,
      sub.ratings.q4,
      sub.ratings.q5,
      avg.toFixed(2),
      `"${interp.label}"`,
      escapeCsv(sub.suggestion),
    ].join(',');
  });

  // Add summary rows at the bottom
  if (submissions.length > 0) {
    const summary = calculateSurveySummary(submissions);
    rows.push('');
    rows.push(
      [
        '"สรุปภาพรวม"',
        `"ผู้ตอบทั้งหมด ${summary.totalResponses} ท่าน"`,
        summary.questionStats[0].average.toFixed(2),
        summary.questionStats[1].average.toFixed(2),
        summary.questionStats[2].average.toFixed(2),
        summary.questionStats[3].average.toFixed(2),
        summary.questionStats[4].average.toFixed(2),
        summary.overallAverage.toFixed(2),
        `"${summary.overallInterpretation.label}"`,
        '""',
      ].join(',')
    );
  }

  // Prepend UTF-8 BOM (\uFEFF) to make Excel parse UTF-8 Thai correctly
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  link.setAttribute('href', url);
  link.setAttribute('download', `ผลประเมินการอบรม_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * ข้อมูลจำลองสำหรับการเริ่มต้นหรือทดสอบระบบ
 */
export const SAMPLE_SUBMISSIONS: SurveySubmission[] = [
  {
    id: 'demo-1',
    timestamp: Date.now() - 1000 * 60 * 12,
    dateFormatted: '12 นาทีที่แล้ว',
    ratings: { q1: 5, q2: 5, q3: 4, q4: 5, q5: 5 },
    averageScore: 4.8,
    suggestion: 'วิทยากรอธิบายเข้าใจง่ายมาก มีตัวอย่างจริงให้ลองทำ อยากให้มีคอร์สขั้นสูงต่อครับ',
    deviceId: 'demo-device-1',
  },
  {
    id: 'demo-2',
    timestamp: Date.now() - 1000 * 60 * 8,
    dateFormatted: '8 นาทีที่แล้ว',
    ratings: { q1: 5, q2: 4, q3: 5, q4: 4, q5: 5 },
    averageScore: 4.6,
    suggestion: 'กิจกรรมกลุ่มสนุกดี ได้แลกเปลี่ยนมุมมองกับเพื่อนร่วมคลาส เอกสารประกอบดีมาก',
    deviceId: 'demo-device-2',
  },
  {
    id: 'demo-3',
    timestamp: Date.now() - 1000 * 60 * 5,
    dateFormatted: '5 นาทีที่แล้ว',
    ratings: { q1: 4, q2: 5, q3: 4, q4: 4, q5: 4 },
    averageScore: 4.2,
    suggestion: 'เวลากระชับดีมาก ถ้าเพิ่มช่วงถาม-ตอบอีก 15 นาทีจะสมบูรณ์แบบยิ่งขึ้นค่ะ',
    deviceId: 'demo-device-3',
  },
  {
    id: 'demo-4',
    timestamp: Date.now() - 1000 * 60 * 2,
    dateFormatted: '2 นาทีที่แล้ว',
    ratings: { q1: 5, q2: 5, q3: 5, q4: 5, q5: 5 },
    averageScore: 5.0,
    suggestion: 'ประทับใจสุดๆ ครับ ได้ความรู้กลับไปพัฒนางานที่บริษัทได้ทันที ขอบคุณทีมงานทุกคนครับ',
    deviceId: 'demo-device-4',
  },
  {
    id: 'demo-5',
    timestamp: Date.now() - 1000 * 45,
    dateFormatted: 'เมื่อสักครู่',
    ratings: { q1: 4, q2: 5, q3: 4, q4: 5, q5: 5 },
    averageScore: 4.6,
    suggestion: 'ระบบจอและเสียงในห้องชัดเจน การประสานงานมืออาชีพมากค่ะ',
    deviceId: 'demo-device-5',
  },
];
