// Mock notifications for the doctor portal (prototype data).
// Each one points at the exact place in /doctor where the doctor acts on it.

export type DoctorNotifGroup = 'urgent' | 'approvals' | 'results' | 'today' | 'team';

export type DoctorPortalSection = 'inbox' | 'patients' | 'schedule' | 'insights' | 'settings' | 'audit';
export type DoctorPatientTab = 'brief' | 'timeline' | 'labs' | 'rules' | 'trials' | 'notesRx' | 'messages';

export interface DoctorNavTarget {
  section: DoctorPortalSection;
  tab?: DoctorPatientTab;
  inboxItemId?: string;
}

export interface DoctorNotification {
  id: string;
  group: DoctorNotifGroup;
  patientName: string;
  patientInitials: string;
  title: string;
  detail: string;
  /** Why Ritu raised this, so the doctor can judge it at a glance. */
  why: string;
  /** Where the signal came from — mirrors the "Doctor's rule" vs "Learned" tags on the patient side. */
  source: 'Guideline red flag' | 'Learned from patient' | 'Your rule' | 'Lab upload' | 'Patient message' | 'Care team' | 'Schedule';
  time: string;
  unread: boolean;
  primaryLabel: string;
  target: DoctorNavTarget;
}

export const DOCTOR_NOTIF_GROUPS: Record<DoctorNotifGroup, { label: string; hint: string }> = {
  urgent: { label: 'Needs you now', hint: 'Red-flag symptoms. Always delivered instantly.' },
  approvals: { label: 'Waiting for your sign-off', hint: 'Ritu never acts on these until you approve.' },
  results: { label: 'New results', hint: 'Lab values outside the targets you set.' },
  today: { label: 'Today’s consults', hint: 'Briefs are prepared 2 hours before each visit.' },
  team: { label: 'Messages & care team', hint: '' },
};

export const DOCTOR_NOTIFICATIONS: DoctorNotification[] = [
  {
    id: 'dn-1',
    group: 'urgent',
    patientName: 'Kavita Reddy, 31',
    patientInitials: 'KR',
    title: 'Heavy bleeding for 10+ days, Hb 9.4',
    detail: 'Pad change every 2 hours for 3 days. Known 1.8 cm fibroid.',
    why: 'Matches FOGSI abnormal uterine bleeding red-flag criteria',
    source: 'Guideline red flag',
    time: '25 min ago',
    unread: true,
    primaryLabel: 'Open case',
    target: { section: 'inbox', inboxItemId: 'inbox-2' },
  },
  {
    id: 'dn-2',
    group: 'approvals',
    patientName: 'Priya Sharma, 26',
    patientInitials: 'PS',
    title: 'Suggested: 21-day dairy elimination trial',
    detail: 'Bloating after dairy in 5 of 6 logged meals.',
    why: 'Pattern learned from 6 meals · medium confidence',
    source: 'Learned from patient',
    time: '1 h ago',
    unread: true,
    primaryLabel: 'Review trial',
    target: { section: 'patients', tab: 'trials' },
  },
  {
    id: 'dn-3',
    group: 'approvals',
    patientName: 'Priya Sharma, 26',
    patientInitials: 'PS',
    title: 'Low-GI diet trial finished: 91% likely helped',
    detail: '42 days complete. Sign off, and optionally keep it as a standing rule.',
    why: 'Before/after comparison on cycle length and energy',
    source: 'Your rule',
    time: '2 h ago',
    unread: true,
    primaryLabel: 'Sign off',
    target: { section: 'patients', tab: 'trials' },
  },
  {
    id: 'dn-4',
    group: 'approvals',
    patientName: 'Priya Sharma, 26',
    patientInitials: 'PS',
    title: 'Conflict: 16-hour fast vs Metformin with dinner',
    detail: 'Dietitian Sneha Nair’s fasting plan clashes with your prescription timing.',
    why: 'Ritu does not resolve conflicts between care-team rules',
    source: 'Care team',
    time: '3 h ago',
    unread: true,
    primaryLabel: 'Resolve',
    target: { section: 'patients', tab: 'rules' },
  },
  {
    id: 'dn-5',
    group: 'results',
    patientName: 'Ananya Iyer, 29',
    patientInitials: 'AI',
    title: 'Triglycerides 218 mg/dL (was 165)',
    detail: 'TG:HDL ratio 4.8. Already shared with her dietitian.',
    why: 'Above the < 150 mg/dL target in her care plan',
    source: 'Lab upload',
    time: '1 h ago',
    unread: true,
    primaryLabel: 'Review labs',
    target: { section: 'inbox', inboxItemId: 'inbox-3' },
  },
  {
    id: 'dn-6',
    group: 'results',
    patientName: 'Priya Sharma, 26',
    patientInitials: 'PS',
    title: 'TSH 3.8 µIU/mL (was 2.1 in March)',
    detail: 'Mother has hypothyroidism. Repeat TSH + anti-TPO may be worth discussing.',
    why: 'Rising trend across 2 reports',
    source: 'Lab upload',
    time: '5 h ago',
    unread: false,
    primaryLabel: 'See trend',
    target: { section: 'patients', tab: 'labs' },
  },
  {
    id: 'dn-7',
    group: 'today',
    patientName: 'Priya Sharma, 26',
    patientInitials: 'PS',
    title: '4:30 PM teleconsult: brief ready',
    detail: '60-second brief plus 3 questions she wants to ask.',
    why: 'Prepared from her logs since 14 Oct',
    source: 'Schedule',
    time: 'In 2 h',
    unread: true,
    primaryLabel: 'Open brief',
    target: { section: 'patients', tab: 'brief' },
  },
  {
    id: 'dn-8',
    group: 'today',
    patientName: 'Ananya Iyer, 29',
    patientInitials: 'AI',
    title: '6:00 PM teleconsult: brief not ready yet',
    detail: 'Waiting for her to confirm the lipid report values.',
    why: '',
    source: 'Schedule',
    time: 'In 3.5 h',
    unread: false,
    primaryLabel: 'View schedule',
    target: { section: 'schedule' },
  },
  {
    id: 'dn-9',
    group: 'team',
    patientName: 'Priya Sharma, 26',
    patientInitials: 'PS',
    title: 'New message: “Should I increase Metformin?”',
    detail: 'Reply drafted in Telugu with an English back-translation. Not sent.',
    why: '',
    source: 'Patient message',
    time: '10 min ago',
    unread: true,
    primaryLabel: 'Review reply',
    target: { section: 'patients', tab: 'messages' },
  },
  {
    id: 'dn-10',
    group: 'team',
    patientName: 'Meera Patel, 34',
    patientInitials: 'MP',
    title: 'Annual pelvic ultrasound overdue',
    detail: 'Last scan 14 months ago.',
    why: '',
    source: 'Schedule',
    time: 'Yesterday',
    unread: false,
    primaryLabel: 'Open',
    target: { section: 'inbox', inboxItemId: 'inbox-4' },
  },
];

/** Event the notification panel fires so the doctor page can jump to a section without reloading. */
export const DOCTOR_NAV_EVENT = 'ritu:doctor-nav';
