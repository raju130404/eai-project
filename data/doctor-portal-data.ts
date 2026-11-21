export interface DoctorInboxItem {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  priority: 'red' | 'amber' | 'grey';
  category: 'urgent' | 'approvals' | 'labs' | 'messages' | 'overdue';
  reason: string;
  evidence: string[];
  primaryAction: string;
  time: string;
  messagePreview?: string;
  draftReply?: {
    patientLang: string;
    langName: string;
    englishBackTranslation: string;
  };
}

export interface DoctorScheduleItem {
  id: string;
  patientId: string;
  patientName: string;
  time: string;
  slotType: 'Teleconsult' | 'In-Clinic';
  phenotype: string;
  briefReady: boolean;
  chiefConcern: string;
}

export interface DoctorAuditItem {
  id: string;
  patientName: string;
  feature: string;
  timestamp: string;
  suggestion: string;
  model: string;
  sourcesCited: string;
  clinicianAction: 'Accepted' | 'Edited' | 'Rejected';
  notes?: string;
}

export const DOCTOR_INBOX_ITEMS: DoctorInboxItem[] = [
  {
    id: 'inbox-1',
    patientId: 'p1',
    patientName: 'Priya Sharma',
    age: 26,
    priority: 'amber',
    category: 'approvals',
    reason: 'Trial completion sign-off + TSH rising (3.8 vs 2.1)',
    evidence: [
      'Low-GI Indian Diet Trial completed (42 days): Bayesian posterior benefit = 91%',
      'TSH 3.8 µIU/mL (Baseline 2.1 in March): Maternal hypothyroidism family history',
      'Cycle prolongation: last 3 cycles averaged 41.3 days (38, 41, 45 days)',
    ],
    primaryAction: 'Review Brief',
    time: '10m ago',
    messagePreview: 'Namaste Dr. Sen, given my cycle is running 42 days, should I increase Metformin dose or wait?',
    draftReply: {
      langName: 'Telugu & English',
      patientLang: 'నమస్తే ప్రియా, మెట్‌ఫార్మిన్ మోతాదును ప్రస్తుతానికి 500mg వద్దే కొనసాగించండి. శుక్రవారం మన సంప్రదింపులో మీ TSH మరియు ఇన్సులిన్ స్థాయిలను పరిశీలించి తగిన నిర్ణయం తీసుకుందాం.',
      englishBackTranslation: 'Namaste Priya, please continue Metformin 500mg for now. In our Friday consult, we will review your TSH and insulin levels together before adjusting.',
    },
  },
  {
    id: 'inbox-2',
    patientId: 'p2',
    patientName: 'Kavita Reddy',
    age: 31,
    priority: 'red',
    category: 'urgent',
    reason: 'Heavy prolonged bleeding (>10 days) + Hb 9.4 g/dL',
    evidence: [
      'Menorrhagia logged: Pad saturation every 2 hours for 3 consecutive days',
      'Recent Hemoglobin: 9.4 g/dL (Moderate microcytic anaemia)',
      'Previous ultrasound noted small intramural fibroid (1.8 cm)',
    ],
    primaryAction: 'Call Patient',
    time: '25m ago',
  },
  {
    id: 'inbox-3',
    patientId: 'p3',
    patientName: 'Ananya Iyer',
    age: 29,
    priority: 'amber',
    category: 'labs',
    reason: 'New fasting lipid panel: Triglycerides 218 mg/dL',
    evidence: [
      'Triglycerides: 218 mg/dL (Elevated, up from 165 mg/dL)',
      'TG:HDL Ratio: 4.8 (High cardiovascular metabolic marker)',
      'Shared with Dietitian Sneha Nair for meal plan revision',
    ],
    primaryAction: 'Review Labs',
    time: '1h ago',
  },
  {
    id: 'inbox-4',
    patientId: 'p4',
    patientName: 'Meera Patel',
    age: 34,
    priority: 'grey',
    category: 'overdue',
    reason: 'Routine annual pelvic ultrasound due (Feb 2027)',
    evidence: [
      'Last transvaginal ultrasound: 14 months ago per Rotterdam protocol',
      'Metformin adherence 95% over last 6 months',
    ],
    primaryAction: 'Book Test',
    time: '3h ago',
  },
];

export const DOCTOR_SCHEDULE_TODAY: DoctorScheduleItem[] = [
  {
    id: 'sch-1',
    patientId: 'p1',
    patientName: 'Priya Sharma (26F)',
    time: '04:30 PM',
    slotType: 'Teleconsult',
    phenotype: 'PCOS Rotterdam B',
    briefReady: true,
    chiefConcern: '42-day cycle prolongation & A1 dairy elimination protocol review',
  },
  {
    id: 'sch-2',
    patientId: 'p2',
    patientName: 'Kavita Reddy (31F)',
    time: '05:15 PM',
    slotType: 'In-Clinic',
    phenotype: 'Endometriosis & Adenomyosis',
    briefReady: true,
    chiefConcern: 'Urgent evaluation for heavy bleeding and pelvic pain flare',
  },
  {
    id: 'sch-3',
    patientId: 'p3',
    patientName: 'Ananya Iyer (29F)',
    time: '06:00 PM',
    slotType: 'Teleconsult',
    phenotype: 'PCOS Rotterdam A',
    briefReady: false,
    chiefConcern: 'Review high triglycerides and low-carb sequencing progress',
  },
];

export const DOCTOR_AUDIT_TRAIL: DoctorAuditItem[] = [
  {
    id: 'aud-1',
    patientName: 'Priya Sharma',
    feature: 'Rule Builder',
    timestamp: '21 Nov 2026, 04:32 PM',
    suggestion: 'Dietary Ban: Avoid Gluten & Maida for 3 months; repeat Fasting Insulin at 12w',
    model: 'Gemini-1.5-Pro (v2026.11)',
    sourcesCited: 'International PCOS Guideline 2023 · Chapter 4 (Insulin Sensitization)',
    clinicianAction: 'Accepted',
    notes: 'Locked by Dr. Ananya Sen as active clinical constraint',
  },
  {
    id: 'aud-2',
    patientName: 'Priya Sharma',
    feature: 'Trial Designer',
    timestamp: '21 Nov 2026, 04:28 PM',
    suggestion: '21-day A1 Dairy Elimination Trial (Primary: Bloating visual analog score)',
    model: 'Empirical-Bayes N-of-1 Engine',
    sourcesCited: 'Bayesian MCID power computation (n=28 days, floor=70%)',
    clinicianAction: 'Accepted',
    notes: 'Approved with provision for ragi/sesame calcium swaps',
  },
  {
    id: 'aud-3',
    patientName: 'Priya Sharma',
    feature: 'Conflict Checker',
    timestamp: '21 Nov 2026, 02:15 PM',
    suggestion: 'Conflict flagged between Dietitian 16h fasting and Metformin dinner dose',
    model: 'Deterministic Rule Intersect',
    sourcesCited: 'Metformin SmPC: Gastrointestinal safety requires meal pairing',
    clinicianAction: 'Accepted',
    notes: 'Alert sent to Dietitian Sneha Nair to adjust fasting window',
  },
  {
    id: 'aud-4',
    patientName: 'Kavita Reddy',
    feature: 'Triage Classifier',
    timestamp: '21 Nov 2026, 01:45 PM',
    suggestion: 'Priority elevated to CODE RED: Menorrhagia > 10 days with Hb 9.4',
    model: 'FOGSI Emergency Risk Classifier',
    sourcesCited: 'FOGSI Abnormal Uterine Bleeding (AUB) Guidelines 2022',
    clinicianAction: 'Accepted',
    notes: 'Doctor prompted to call patient directly',
  },
];
