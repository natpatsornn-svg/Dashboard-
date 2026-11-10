import { SurveySubmission } from '../types/survey';
import { SAMPLE_SUBMISSIONS } from './evaluation';

const STORAGE_KEY = 'training_survey_responses_v1';
const SUBMITTED_FLAG_KEY = 'training_survey_device_submitted';
const CHANNEL_NAME = 'training_survey_realtime_channel';

// In-memory fallback and listeners
type Listener = (submissions: SurveySubmission[]) => void;
const listeners: Set<Listener> = new Set();

let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
    broadcastChannel.onmessage = (event) => {
      if (event.data && event.data.type === 'NEW_SUBMISSION') {
        notifyListeners();
      } else if (event.data && event.data.type === 'CLEAR_ALL') {
        notifyListeners();
      }
    };
  } catch (e) {
    console.warn('BroadcastChannel not supported or restricted:', e);
  }
}

// Window storage event for cross-tab compatibility
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      notifyListeners();
    }
  });
}

function notifyListeners() {
  const current = getStoredSubmissions();
  listeners.forEach((listener) => {
    try {
      listener(current);
    } catch (err) {
      console.error('Error in submission listener:', err);
    }
  });
}

export function getStoredSubmissions(): SurveySubmission[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Initialize with sample submissions for rich immediate demo
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_SUBMISSIONS));
      return SAMPLE_SUBMISSIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to read submissions from localStorage:', e);
    return [];
  }
}

export function saveSubmission(
  ratings: { q1: number; q2: number; q3: number; q4: number; q5: number },
  suggestion?: string
): { success: boolean; submission?: SurveySubmission; error?: string } {
  try {
    const current = getStoredSubmissions();
    const scores = [ratings.q1, ratings.q2, ratings.q3, ratings.q4, ratings.q5];
    const avg = Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2));

    const newSub: SurveySubmission = {
      id: 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      timestamp: Date.now(),
      dateFormatted: 'เมื่อสักครู่',
      ratings,
      averageScore: avg,
      suggestion: suggestion ? suggestion.trim() : '',
      deviceId: getOrCreateDeviceId(),
    };

    const updated = [newSub, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Mark current device as submitted to prevent duplicate responses
    localStorage.setItem(SUBMITTED_FLAG_KEY, JSON.stringify({
      submittedAt: Date.now(),
      submissionId: newSub.id,
      ratings: newSub.ratings,
    }));

    // Broadcast to other open tabs (e.g. Projector Dashboard)
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'NEW_SUBMISSION', data: newSub });
    }

    notifyListeners();
    return { success: true, submission: newSub };
  } catch (err: any) {
    return { success: false, error: err.message || 'บันทึกข้อมูลไม่สำเร็จ' };
  }
}

export function isDeviceAlreadySubmitted(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(SUBMITTED_FLAG_KEY);
}

export function getSubmittedDeviceRecord(): any | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(SUBMITTED_FLAG_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function resetDeviceLock(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SUBMITTED_FLAG_KEY);
}

export function clearAllSubmissions(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'CLEAR_ALL' });
  }
  notifyListeners();
}

export function reloadDemoData(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_SUBMISSIONS));
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'NEW_SUBMISSION' });
  }
  notifyListeners();
}

export function subscribeToSubmissions(callback: Listener): () => void {
  listeners.add(callback);
  // initial call
  callback(getStoredSubmissions());
  return () => {
    listeners.delete(callback);
  };
}

function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return 'device_unknown';
  let devId = localStorage.getItem('training_survey_device_id');
  if (!devId) {
    devId = 'dev_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    localStorage.setItem('training_survey_device_id', devId);
  }
  return devId;
}

/**
 * Generate simulated submission for instant projector testing
 */
export function simulateSingleResponse(): SurveySubmission {
  const sampleSuggestions = [
    'วิทยากรตอบคำถามได้กระจ่างมากครับ นำไปปรับใช้ได้จริงแน่นอน',
    'ห้องอบรมแอร์เย็นกำลังดี เอกสารประกอบชัดเจนมากค่ะ',
    'อยากให้เพิ่มเวลา Workshop และเพิ่มกรณีศึกษาทางธุรกิจเพิ่มเติมครับ',
    'จัดกิจกรรมได้กระชับ ตรงจุด และไม่ง่วงเลย เยี่ยมมากครับ',
    'เนื้อหาทันสมัย ตอบโจทย์เทรนด์การทำงานยุคนี้มาก',
    'อาหารว่างอร่อย ทีมงานต้อนรับและประสานงานดีเลิศค่ะ',
    'อยากให้มีตอนที่ 2 สำหรับเทคนิคขั้นสูงครับ',
  ];

  // Random ratings weighted towards 4 and 5 (realistic high satisfaction)
  const getRandomScore = () => {
    const r = Math.random();
    if (r < 0.60) return 5;
    if (r < 0.88) return 4;
    if (r < 0.96) return 3;
    return 2;
  };

  const ratings = {
    q1: getRandomScore(),
    q2: getRandomScore(),
    q3: getRandomScore(),
    q4: getRandomScore(),
    q5: getRandomScore(),
  };

  const shouldHaveSuggestion = Math.random() > 0.3;
  const suggestion = shouldHaveSuggestion
    ? sampleSuggestions[Math.floor(Math.random() * sampleSuggestions.length)]
    : '';

  const res = saveSubmission(ratings, suggestion);
  return res.submission!;
}
