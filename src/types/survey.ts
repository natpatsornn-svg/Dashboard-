export interface QuestionItem {
  id: number;
  title: string;
  category: string;
  description: string;
}

export interface SurveySubmission {
  id: string;
  timestamp: number;
  dateFormatted: string;
  ratings: {
    q1: number; // Course Content
    q2: number; // Speaker Delivery
    q3: number; // Time & Activities
    q4: number; // Facilities & Logistics
    q5: number; // Overall Satisfaction
  };
  averageScore: number;
  suggestion?: string;
  deviceId?: string;
}

export interface QuestionStat {
  id: number;
  title: string;
  shortTitle: string;
  category: string;
  average: number;
  count: number;
  distribution: { [rating: number]: number }; // count of 1s, 2s, 3s, 4s, 5s
  interpretation: InterpretationResult;
}

export interface InterpretationResult {
  label: string;
  level: number; // 1 to 5
  badgeColor: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export interface SurveySummary {
  totalResponses: number;
  overallAverage: number;
  overallInterpretation: InterpretationResult;
  questionStats: QuestionStat[];
  recentSuggestions: {
    id: string;
    text: string;
    timestamp: number;
    timeAgo: string;
    ratingsAverage: number;
  }[];
  ratingDistribution: { [star: number]: number }; // Total star counts across all questions
}

export interface FirebaseConfigState {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}
