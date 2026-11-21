'use client';

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Locale } from '@/i18n';
import { getDictionary } from '@/lib/i18n-dictionary';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DOCTOR_INBOX_ITEMS,
  DOCTOR_SCHEDULE_TODAY,
  DOCTOR_AUDIT_TRAIL,
  DoctorInboxItem,
} from '@/data/doctor-portal-data';
import { DOCTOR_NAV_EVENT, DoctorNavTarget } from '@/data/doctor-notifications';
import {
  Stethoscope,
  Inbox as InboxIcon,
  Users,
  Calendar,
  BarChart3,
  Settings,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Volume2,
  Mic,
  MicOff,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Share2,
  FileText,
  Clock,
  ArrowRight,
  Send,
  Plus,
  Lock,
  Layers,
  Search,
  BookOpen,
  Download,
  Check,
  X,
  Upload,
  Activity,
  Heart,
  Globe,
  HelpCircle,
} from 'lucide-react';

export default function DoctorPortalPage() {
  const locale = useLocale() as Locale;
  const dict = getDictionary(locale);

  // Main navigation sidebar / bottom bar section
  const [activeSection, setActiveSection] = useState<'inbox' | 'patients' | 'schedule' | 'insights' | 'settings' | 'audit'>('patients');

  // Active patient chart sub-tab
  const [activePatientSubTab, setActivePatientSubTab] = useState<'brief' | 'timeline' | 'labs' | 'rules' | 'trials' | 'notesRx' | 'messages'>('brief');

  // Selected Inbox filter
  const [inboxFilter, setInboxFilter] = useState<'all' | 'urgent' | 'approvals' | 'labs' | 'messages' | 'overdue'>('all');
  const [expandedInboxItemId, setExpandedInboxItemId] = useState<string | null>('inbox-1');
  const [selectedMessageItem, setSelectedMessageItem] = useState<DoctorInboxItem | null>(DOCTOR_INBOX_ITEMS[0]);

  // D4. Pre-Consult Brief audio player state
  const [isPlayingBriefAudio, setIsPlayingBriefAudio] = useState<boolean>(false);

  // D7. Ambient Scribe state
  const [isScribing, setIsScribing] = useState<boolean>(false);
  const [scribeSeconds, setScribeSeconds] = useState<number>(258); // 04:18
  const [consultNoteGenerated, setConsultNoteGenerated] = useState<boolean>(true);
  const [acceptedActions, setAcceptedActions] = useState<Record<string, boolean>>({
    rule1: true,
    rx1: false,
    lab1: true,
  });

  // D8. Live Two-Way Translation state
  const [translationLangPair, setTranslationLangPair] = useState<'EN_TE' | 'EN_HI' | 'EN_TA'>('EN_TE');
  const [showLiveCaptions, setShowLiveCaptions] = useState<boolean>(true);

  // D9. Guideline Copilot Drawer state
  const [copilotOpen, setCopilotOpen] = useState<boolean>(false);
  const [copilotQuery, setCopilotQuery] = useState<string>('First-line options for hirsutism in a patient not trying to conceive?');

  // D10. Natural Language Rule Builder state
  const [newRuleText, setNewRuleText] = useState<string>('No gluten or maida for 3 months, recheck HbA1c and fasting insulin in 12 weeks');
  const [lockedRules, setLockedRules] = useState<string[]>([
    'Avoid Gluten & High Glycemic Carbs (Maida) for 12 weeks',
    'Keep Fasting Insulin target < 10 µIU/mL (Baseline: 16 µIU/mL)',
    'Report immediately if menstrual cycle exceeds 50 days',
  ]);
  const [ruleLockSuccess, setRuleLockSuccess] = useState<boolean>(false);

  // D11. Cross-Specialist Conflict state
  const [conflictResolved, setConflictResolved] = useState<boolean>(false);

  // D12 & D13. Prescription & Patient-Language state
  const [previewForPatientOpen, setPreviewForPatientOpen] = useState<boolean>(false);
  const [rxSimplerMode, setRxSimplerMode] = useState<boolean>(false);
  const [pushToAbha, setPushToAbha] = useState<boolean>(true);
  const [rxSignedSuccess, setRxSignedSuccess] = useState<boolean>(false);

  // D14 & D15. Trials state
  const [pendingTrialStatus, setPendingTrialStatus] = useState<'pending' | 'approved' | 'declined'>('pending');
  const [verdictConvertedToRule, setVerdictConvertedToRule] = useState<boolean>(false);

  // D19. Ultrasound Report upload state
  const [ultrasoundReportUploaded, setUltrasoundReportUploaded] = useState<boolean>(true);

  // D20. Referral & Handoff Writer state
  const [referralModalOpen, setReferralModalOpen] = useState<boolean>(false);
  const [selectedReferralSpecialist, setSelectedReferralSpecialist] = useState<string>('Dr. Ramesh Gupta (Endocrinologist)');
  const [referralSentSuccess, setReferralSentSuccess] = useState<boolean>(false);

  // D21. Messages Team vs Patient toggle
  const [messageViewMode, setMessageViewMode] = useState<'patient' | 'team'>('patient');

  // D22. Practice Insights Natural Language Query state
  const [nlQuery, setNlQuery] = useState<string>('Which of my phenotype B patients haven’t had Fasting Insulin in 4 months?');
  const [nlQueryResultVisible, setNlQueryResultVisible] = useState<boolean>(true);

  // Notifications deep-link here: via an in-page event, or ?section=&tab=&item= when arriving from another page.
  useEffect(() => {
    const apply = (t: DoctorNavTarget) => {
      setActiveSection(t.section);
      if (t.tab) setActivePatientSubTab(t.tab);
      if (t.inboxItemId) {
        setInboxFilter('all');
        setExpandedInboxItemId(t.inboxItemId);
        const item = DOCTOR_INBOX_ITEMS.find((i) => i.id === t.inboxItemId);
        if (item) setSelectedMessageItem(item);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const q = new URLSearchParams(window.location.search);
    const section = q.get('section') as DoctorNavTarget['section'] | null;
    if (section) {
      apply({
        section,
        tab: (q.get('tab') as DoctorNavTarget['tab']) || undefined,
        inboxItemId: q.get('item') || undefined,
      });
    }

    const onNav = (e: Event) => apply((e as CustomEvent<DoctorNavTarget>).detail);
    window.addEventListener(DOCTOR_NAV_EVENT, onNav);
    return () => window.removeEventListener(DOCTOR_NAV_EVENT, onNav);
  }, []);

  // Filtered inbox items
  const filteredInbox = DOCTOR_INBOX_ITEMS.filter((item) => {
    if (inboxFilter === 'all') return true;
    return item.category === inboxFilter;
  });

  return (
    <div className="min-h-screen text-slate-900 pb-28 lg:pb-16 pt-2">
      {/* Top Clinical Header Bar */}
      <div className="mb-4 bg-white border border-slate-200/90 rounded-3xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 shrink-0 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h1 className="font-heading text-base sm:text-lg font-bold text-slate-900">
                Dr. Ananya Sen, MD, FRCOG
              </h1>
              <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Lead Gynecologist
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Apollo Health City OPD
              </span>
            </div>
            <p className="hidden sm:block text-xs text-slate-500 mt-0.5">
              Rotterdam Phenotype Oversight • 24 AI Decision Support Tools Active • HPR: HP98472918
            </p>
          </div>
        </div>

        {/* Quick OPD Status Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="p-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700">
            <span className="font-bold text-indigo-700">3</span> Appointments Today
          </div>
          <div className="p-2 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 font-bold">
            1 Urgent Risk Item
          </div>
        </div>
      </div>

      {/* Main Grid: Desktop Left Sidebar + Central Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* DESKTOP LEFT SIDEBAR (Hidden on small mobile screens; becomes 5-tab bar) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-2">
          <div className="bg-white rounded-4xl p-3 border border-slate-200 shadow-sm space-y-1">
            {[
              { id: 'patients', label: '👥 Patient Chart', badge: 'Active: Priya' },
              { id: 'inbox', label: '📥 Risk-Ranked Inbox', badge: '4 Items', alert: true },
              { id: 'schedule', label: '🗓️ OPD Schedule', badge: 'Today (3)' },
              { id: 'insights', label: '📊 Practice Insights', badge: '184 Patients' },
              { id: 'settings', label: '⚙️ Settings & ABDM', badge: 'ABHA Active' },
              { id: 'audit', label: '📋 AI Audit Trail', badge: 'All AI actions' },
            ].map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveSection(sec.id as any)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/20'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs">{sec.label}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : sec.alert
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {sec.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Doctor Profile Reference */}
          <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-3xl p-4 text-xs space-y-2">
            <div className="font-heading font-bold text-indigo-950 text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
              <span>Doctor Decides; AI Fine-Tunes</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Every AI output is a draft or flag. No diagnosis or prescription changes take effect until you sign.
            </p>
          </div>
        </aside>

        {/* CENTRAL CLINICAL WORKSTATION */}
        <section className="col-span-1 lg:col-span-9 space-y-4">
          {/* SECTION 1: PATIENTS / PATIENT CHART */}
          {activeSection === 'patients' && (
            <div className="space-y-4">
              {/* STICKY PATIENT HEADER */}
              <div className="bg-white border-2 border-indigo-100 rounded-4xl p-4 sm:p-5 shadow-sm space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-heading font-extrabold text-base shrink-0 shadow-xs">
                      PS
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <h2 className="font-heading text-lg font-extrabold text-slate-900">
                          Priya Sharma
                        </h2>
                        <span className="text-xs font-semibold text-slate-500">26F • Hyderabad</span>
                        <span className="bg-rose-100 text-brand-pink text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Rotterdam Phenotype B
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span>HOMA-IR: <strong className="text-coral">3.61</strong></span>
                        <span className="hidden sm:inline">•</span>
                        <span>Fasting Insulin: <strong>16 µIU/mL</strong></span>
                        <span className="hidden sm:inline">•</span>
                        <span>TSH: <strong className="text-amber-700">3.8 µIU/mL</strong></span>
                        <span className="hidden sm:inline">•</span>
                        <span>Life Stage: <strong>Tracking Cycles (Preconception 2027)</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Header Actions: D7 Ambient Scribe + D20 Referral */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* D7 Scribe Button */}
                    <button
                      type="button"
                      onClick={() => setIsScribing(!isScribing)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-bold text-xs shadow-xs transition ${
                        isScribing
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-brand-purple text-white hover:bg-brand-purpleHover'
                      }`}
                    >
                      {isScribing ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                          <span>Recording (04:18)</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-3.5 h-3.5" />
                          <span>Start Consult (Scribe)</span>
                        </>
                      )}
                    </button>

                    {/* D20 Refer Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-2xl text-xs font-bold h-9"
                      onClick={() => setReferralModalOpen(true)}
                    >
                      <Share2 className="w-3.5 h-3.5 mr-1" />
                      Refer
                    </Button>
                  </div>
                </div>

                {/* Consent & Data Streams Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px]">
                  <div className="flex flex-wrap items-center gap-1.5 text-slate-500">
                    <span className="w-full sm:w-auto font-semibold text-slate-700">Patient Consented Streams:</span>
                    <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md whitespace-nowrap">Labs ✓</span>
                    <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md whitespace-nowrap">Food & You ✓</span>
                    <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md whitespace-nowrap">Symptoms ✓</span>
                    <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md whitespace-nowrap">Workouts ✓</span>
                    <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md whitespace-nowrap">Meds ✓</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    3 Active Rules Locked
                  </span>
                </div>

                {/* 7 SUB-TABS NAVIGATION */}
                <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none pt-1">
                  {[
                    { id: 'brief', label: '📄 Brief (60s)' },
                    { id: 'timeline', label: '⏱️ Timeline' },
                    { id: 'labs', label: '🧪 Labs & Imaging' },
                    { id: 'rules', label: '🔒 Rules (Calibration)' },
                    { id: 'trials', label: '🔬 N-of-1 Trials' },
                    { id: 'notesRx', label: '✍️ Notes & Rx' },
                    { id: 'messages', label: '💬 Messages' },
                  ].map((tab) => {
                    const isTabActive = activePatientSubTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActivePatientSubTab(tab.id as any)}
                        className={`rounded-2xl px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition ${
                          isTabActive
                            ? 'bg-brand-purple text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SUB-TAB 1: BRIEF (D4, D5, D6) */}
              {activePatientSubTab === 'brief' && (
                <div className="space-y-4">
                  {/* D5. "WHAT CHANGED SINCE LAST VISIT" DIFF (Top Block, Light Periwinkle #EEF2FF) */}
                  <div className="p-4 rounded-3xl bg-[#EEF2FF] border border-blue-200 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 font-heading font-bold text-xs text-blue-950">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>What Changed Since Last Visit (14 Oct 2026 Diff)</span>
                      </div>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        Deterministic Snapshot Comparison
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-blue-950">
                      <div className="flex items-start gap-2">
                        <span className="text-amber-700 font-bold shrink-0">↑ Worse:</span>
                        <span>TSH rose to <strong>3.8 µIU/mL</strong> (up from 2.1 µIU/mL in March; family history maternal hypothyroid).</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-emerald-700 font-bold shrink-0">↓ Better:</span>
                        <span>Fasting glucose decreased from 108 mg/dL to <strong>94 mg/dL</strong> with evening brisk walking.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-brand-purple font-bold shrink-0">• New:</span>
                        <span>Completed 42-day Low-GI trial: Bayesian posterior probability of benefit &gt; MCID is <strong>91%</strong>.</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-brand-purple font-bold shrink-0">• New:</span>
                        <span>Patient inquired about fertility &amp; preconception timeline for late 2027.</span>
                      </div>
                    </div>
                  </div>

                  {/* D4. 60-SECOND PRE-CONSULT BRIEF CONTENT (2 Columns) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Column: Metrics & Tolerances */}
                    <Card className="rounded-4xl p-4 sm:p-5 border-slate-200 bg-white shadow-card space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-800 font-heading">
                          Cycle &amp; Physiological Status
                        </span>
                        {/* Audio Listen Button */}
                        <button
                          type="button"
                          onClick={() => setIsPlayingBriefAudio(!isPlayingBriefAudio)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-xl transition"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{isPlayingBriefAudio ? 'Pause Spoken Brief' : 'Listen (45s)'}</span>
                        </button>
                      </div>

                      {isPlayingBriefAudio && (
                        <div className="p-2.5 rounded-2xl bg-indigo-100 text-indigo-950 text-xs flex items-center gap-2 animate-in fade-in">
                          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                          <span>Playing audio summary for walking between consult rooms...</span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-center text-xs">
                        <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                          <div className="text-[10px] text-slate-400 uppercase font-bold">Current Cycle</div>
                          <div className="font-heading font-extrabold text-sm text-slate-900 mt-0.5">Day 18 of 42</div>
                          <div className="text-[9px] text-slate-500">Prolonged luteal phase</div>
                        </div>

                        <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                          <div className="text-[10px] text-slate-400 uppercase font-bold">Med Adherence</div>
                          <div className="font-heading font-extrabold text-sm text-emerald-700 mt-0.5">93%</div>
                          <div className="text-[9px] text-slate-500">Thyronorm &amp; Metformin</div>
                        </div>
                      </div>

                      {/* Food Tolerance Highlights */}
                      <div className="space-y-1.5 text-xs">
                        <span className="font-bold text-slate-800 text-[11px] block">
                          Tolerance Spectrum Highlights:
                        </span>
                        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-950 text-[11px]">
                          ✓ <strong>Fermented Millets (Ragi/Jowar):</strong> Zero bloating in 14 logged meals.
                        </div>
                        <div className="p-2 rounded-xl bg-amber-50 text-amber-950 text-[11px]">
                          ⚠️ <strong>Chana / Chickpeas:</strong> Tolerated in portions &le; 1 katori.
                        </div>
                        <div className="p-2 rounded-xl bg-rose-50 text-rose-950 text-[11px]">
                          ✕ <strong>A1 Dairy / Buffalo Milk:</strong> Provoked severe bloating in 5 of 6 meals.
                        </div>
                      </div>
                    </Card>

                    {/* Right Column: Questions & D6 Suggested Agenda */}
                    <Card className="rounded-4xl p-4 sm:p-5 border-slate-200 bg-white shadow-card space-y-3">
                      <div>
                        <span className="text-xs font-bold text-slate-800 font-heading block mb-1">
                          Patient's Prepared Questions:
                        </span>
                        <ul className="text-xs space-y-1 text-slate-700 pl-4 list-disc">
                          <li>"Given cycle running 42 days, should we increase Metformin dose?"</li>
                          <li>"Can we approve a 21-day dairy elimination trial to fix bloating?"</li>
                          <li>"When should we begin preconception blood work for 2027?"</li>
                        </ul>
                      </div>

                      {/* D6. Suggested Visit Agenda */}
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-heading font-bold text-xs text-brand-purple">
                            Suggested Visit Agenda (Ranked Priority):
                          </span>
                          <span className="text-[10px] text-slate-400">Tick during visit</span>
                        </div>

                        <div className="space-y-1.5 text-xs">
                          {[
                            '1. Review rising TSH (3.8): Consider repeating TSH & Anti-TPO panel.',
                            '2. Sign off completed Low-GI trial & approve 21-day A1 dairy trial.',
                            '3. Confirm Metformin 500mg SR adherence and tolerability.',
                            '4. Discuss preconception roadmap for late 2027.',
                          ].map((agendaItem, idx) => (
                            <label key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer">
                              <input type="checkbox" className="mt-0.5 rounded text-brand-purple focus:ring-brand-purple" />
                              <span className="text-slate-800 text-[11px]">{agendaItem}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: TIMELINE */}
              {activePatientSubTab === 'timeline' && (
                <Card className="rounded-4xl p-5 border-slate-200 bg-white shadow-card space-y-3">
                  <h3 className="font-heading text-sm font-bold text-slate-900">
                    Patient Longitudinal Timeline
                  </h3>
                  <div className="border-l-2 border-indigo-200 ml-2 pl-4 space-y-4 text-xs">
                    <div className="relative">
                      <span className="absolute -left-6 top-0 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white" />
                      <div className="font-bold text-slate-900">Today • 21 Nov 2026</div>
                      <div className="text-slate-500">Day 18 of current cycle. Pre-consult brief ready for OPD review.</div>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-6 top-0 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-white" />
                      <div className="font-bold text-slate-900">18 Nov 2026</div>
                      <div className="text-slate-500">N-of-1 Low-GI trial concluded with 91% posterior probability of benefit.</div>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-6 top-0 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-white" />
                      <div className="font-bold text-slate-900">14 Oct 2026</div>
                      <div className="text-slate-500">Consult with Dr. Ananya Sen: Metformin 500mg SR prescribed; gluten ban locked.</div>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-6 top-0 w-3 h-3 rounded-full bg-slate-400 ring-4 ring-white" />
                      <div className="font-bold text-slate-900">12 Sep 2026</div>
                      <div className="text-slate-500">Baseline diagnostic lab panel (Thyrocare): HOMA-IR 3.61, TSH 3.2.</div>
                    </div>
                  </div>
                </Card>
              )}

              {/* SUB-TAB 3: LABS & IMAGING (D17, D18, D19) */}
              {activePatientSubTab === 'labs' && (
                <div className="space-y-4">
                  {/* D17. Trend Grid + Derived Indices */}
                  <Card className="rounded-4xl p-5 border-slate-200 bg-white shadow-card space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-heading text-sm font-bold text-slate-900">
                        Lab Trend Analyst &amp; Normalised Indices
                      </span>
                      <span className="text-[10px] text-slate-400">Normalised across Thyrocare &amp; Apollo</span>
                    </div>

                    {/* Derived Indices Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                      <div className="p-2 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                        <div className="text-[10px] text-slate-500 font-semibold" title="Formula: (Fasting Glucose x Fasting Insulin) / 405">
                          HOMA-IR ℹ️
                        </div>
                        <div className="font-bold text-coral text-sm mt-0.5">3.61</div>
                        <div className="text-[9px] text-slate-400">Target &lt; 2.0</div>
                      </div>

                      <div className="p-2 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                        <div className="text-[10px] text-slate-500 font-semibold" title="Formula: (Total T / SHBG) x 100">
                          FAI ℹ️
                        </div>
                        <div className="font-bold text-amber-700 text-sm mt-0.5">6.2</div>
                        <div className="text-[9px] text-slate-400">Normal &lt; 4.5</div>
                      </div>

                      <div className="p-2 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                        <div className="text-[10px] text-slate-500 font-semibold">
                          LH : FSH
                        </div>
                        <div className="font-bold text-indigo-900 text-sm mt-0.5">2.4 : 1</div>
                        <div className="text-[9px] text-slate-400">PCOS inverted</div>
                      </div>

                      <div className="p-2 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                        <div className="text-[10px] text-slate-500 font-semibold">
                          TG : HDL
                        </div>
                        <div className="font-bold text-indigo-900 text-sm mt-0.5">3.1</div>
                        <div className="text-[9px] text-slate-400">Target &lt; 3.0</div>
                      </div>

                      <div className="p-2 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                        <div className="text-[10px] text-slate-500 font-semibold">
                          BMI
                        </div>
                        <div className="font-bold text-slate-900 text-sm mt-0.5">24.8</div>
                        <div className="text-[9px] text-slate-400">Asian Indian limit</div>
                      </div>

                      <div className="p-2 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                        <div className="text-[10px] text-slate-500 font-semibold">
                          WHR
                        </div>
                        <div className="font-bold text-slate-900 text-sm mt-0.5">0.83</div>
                        <div className="text-[9px] text-slate-400">Waist-to-hip</div>
                      </div>
                    </div>

                    {/* Biomarker Trend Rows */}
                    <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                      {[
                        { name: 'TSH (Thyroid Stimulating Hormone)', val: '3.8 µIU/mL', ref: '0.4 – 4.2', trend: '↑ Rising (+1.7 over 9 months; consider Anti-TPO)', status: 'Borderline' },
                        { name: 'Fasting Blood Glucose', val: '94 mg/dL', ref: '70 – 99', trend: '↓ Improved (-14 mg/dL post walking intervention)', status: 'Optimal' },
                        { name: 'Fasting Insulin', val: '16.2 µIU/mL', ref: '2.6 – 24.9', trend: '↔ Stable (Target < 10 for ovulatory recovery)', status: 'Elevated' },
                        { name: 'Free Testosterone', val: '42 pg/mL', ref: '15 – 45', trend: '↔ High-normal', status: 'Elevated' },
                      ].map((item, idx) => (
                        <div key={idx} className="p-2.5 rounded-2xl bg-slate-50 flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="font-bold text-slate-900">{item.name}: </span>
                            <span className="font-extrabold text-indigo-700">{item.val}</span>
                            <span className="text-[10px] text-slate-400 ml-2">(Ref: {item.ref})</span>
                            <div className="text-[10px] text-slate-500 mt-0.5">{item.trend}</div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.status === 'Optimal' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* D18. Diagnostic Criteria Checklist (Rotterdam 2023) */}
                  <Card className="rounded-4xl p-5 border-slate-200 bg-white shadow-card space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-heading text-sm font-bold text-slate-900">
                        Diagnostic Criteria Checklist (International PCOS 2023)
                      </span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                        Criteria Status (Not Automated Diagnosis)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                      <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                        <div className="font-bold text-emerald-950">1. Ovulatory Dysfunction</div>
                        <div className="text-[11px] text-emerald-800 mt-0.5">MET: Cycles 38–45 days across last 4 cycles.</div>
                      </div>
                      <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                        <div className="font-bold text-emerald-950">2. Biochemical Androgenism</div>
                        <div className="text-[11px] text-emerald-800 mt-0.5">MET: FAI 6.2 and Free T 42 pg/mL.</div>
                      </div>
                      <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                        <div className="font-bold text-emerald-950">3. Polycystic Morphology</div>
                        <div className="text-[11px] text-emerald-800 mt-0.5">MET: TVS shows 14+ follicles per ovary.</div>
                      </div>
                    </div>
                  </Card>

                  {/* D19. Ultrasound Report Drop Zone & Extraction */}
                  <Card className="rounded-4xl p-5 border-slate-200 bg-white shadow-card space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-heading text-sm font-bold text-slate-900">
                        Ultrasound &amp; Structured Report Extraction
                      </span>
                      <span className="text-[10px] text-slate-400">PDF / DICOM / Image OCR</span>
                    </div>

                    {ultrasoundReportUploaded && (
                      <div className="p-3.5 rounded-3xl bg-indigo-50/70 border border-indigo-200 text-xs space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-bold text-indigo-950">
                            📄 Extracted from: Apollo Cradle TVS Scan (Nov 2026)
                          </span>
                          <span className="text-emerald-700 font-bold text-[10px]">Verified 100%</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-800">
                          <div>Right Ovary Volume: <strong>11.2 cc</strong></div>
                          <div>Left Ovary Volume: <strong>10.8 cc</strong></div>
                          <div>Antral Follicles: <strong>14 per ovary</strong></div>
                          <div>Endometrial Thickness: <strong>7 mm</strong></div>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              )}

              {/* SUB-TAB 4: RULES (D10, D11, D16) */}
              {activePatientSubTab === 'rules' && (
                <div className="space-y-4">
                  {/* D10. Natural Language Rule Builder */}
                  <Card className="rounded-4xl p-5 border-slate-200 bg-white shadow-card space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-heading text-sm font-bold text-slate-900">
                        Natural-Language Rule Builder (Calibration Engine Limits)
                      </span>
                      <span className="text-[10px] text-slate-400">AI parses; Doctor locks</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <input
                        type="text"
                        value={newRuleText}
                        onChange={(e) => setNewRuleText(e.target.value)}
                        placeholder="Speak or type: 'No gluten for 3 months, recheck insulin in 12 weeks'..."
                        className="flex-1 min-w-0 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs focus:outline-none focus:border-indigo-500"
                      />
                      <Button
                        variant="purple"
                        size="sm"
                        className="rounded-full text-xs font-bold shrink-0"
                        onClick={() => {
                          if (newRuleText.trim()) {
                            setLockedRules([...lockedRules, newRuleText]);
                            setRuleLockSuccess(true);
                            setTimeout(() => setRuleLockSuccess(false), 3000);
                          }
                        }}
                      >
                        <Lock className="w-3.5 h-3.5 mr-1" />
                        Lock Rule
                      </Button>
                    </div>

                    {ruleLockSuccess && (
                      <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold animate-in fade-in">
                        ✓ Clinical rule locked into Ritu's Calibration Engine! The AI will never override this.
                      </div>
                    )}
                  </Card>

                  {/* D11. Cross-Specialist Conflict Checker Alert */}
                  {!conflictResolved && (
                    <div className="p-4 rounded-3xl bg-amber-50 border-2 border-amber-300 text-xs text-amber-950 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-bold flex items-center gap-1.5 text-amber-900">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          Cross-Specialist Rule Conflict Flagged
                        </span>
                        <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                          Care Team Alignment
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        <strong>Conflict:</strong> Dietitian Sneha Nair suggested a 16-hour intermittent fasting schedule. Your locked Metformin rule states: <em>"Must be taken with evening dinner to avoid hypoglycemia and GI distress."</em>
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <Button size="sm" variant="forest" className="rounded-full text-[10px] h-7" onClick={() => setConflictResolved(true)}>
                          Keep My Metformin Rule (Stricter)
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-full text-[10px] h-7" onClick={() => { setActivePatientSubTab('messages'); setMessageViewMode('team'); }}>
                          Open Team Case Thread
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Active Locked Clinical Rules List */}
                  <Card className="rounded-4xl p-5 border-slate-200 bg-white shadow-card space-y-2">
                    <span className="font-heading text-xs font-bold text-slate-800">
                      Active Locked Rules for Priya:
                    </span>
                    <div className="space-y-1.5 text-xs">
                      {lockedRules.map((r, i) => (
                        <div key={i} className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2">
                          <span>🔒 {r}</span>
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                            Active Hard Limit
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* D16. Remote Monitoring Thresholds */}
                  <Card className="rounded-4xl p-5 border-slate-200 bg-white shadow-card space-y-2">
                    <span className="font-heading text-xs font-bold text-slate-800">
                      Remote Monitoring Thresholds (Alerts Inbox if Crossed):
                    </span>
                    <div className="space-y-1 text-xs text-slate-700">
                      <div>• <strong>Menstrual gap:</strong> Alert if no period for &gt; 50 days (Triggered: currently Day 18).</div>
                      <div>• <strong>Medicine adherence:</strong> Alert if Metformin adherence &lt; 70% over 14 days (Adherence: 93%).</div>
                      <div>• <strong>Pain score:</strong> Alert immediately if reported pelvic pain &ge; 7/10.</div>
                    </div>
                  </Card>
                </div>
              )}

              {/* SUB-TAB 5: TRIALS (D14, D15) */}
              {activePatientSubTab === 'trials' && (
                <div className="space-y-4">
                  {/* D14. AI Trial Designer (Propose / Approve Protocol) */}
                  <Card className="rounded-4xl p-5 border-slate-200 bg-white shadow-card space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-heading text-sm font-bold text-slate-900">
                        AI Trial Designer (Pending Clinician Sign-Off)
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                        Awaiting Your Sign-Off
                      </span>
                    </div>

                    <div className="p-4 rounded-3xl bg-indigo-50/70 border border-indigo-200 text-xs space-y-2">
                      <div className="font-bold text-indigo-950 text-sm">
                        Proposed Protocol: 21-Day A1 Dairy Elimination Trial
                      </div>
                      <div className="text-slate-600">
                        <strong>Primary Endpoint:</strong> Postprandial bloating severity (VAS 0–10)<br />
                        <strong>Design:</strong> 14 days baseline + 28 days intervention • MCID = 0.5 pts • Floor = 70% adherence
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Bayesian Statistical Power: <strong>88%</strong> probability of reaching clear verdict.
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button
                          variant="forest"
                          size="sm"
                          className="rounded-full text-xs font-bold"
                          onClick={() => setPendingTrialStatus('approved')}
                        >
                          {pendingTrialStatus === 'approved' ? '✓ Protocol Approved' : 'Approve Trial Protocol'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full text-xs"
                          onClick={() => setPendingTrialStatus('declined')}
                        >
                          Decline with Reason
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* D15. Bayesian Verdict Reviewer */}
                  <Card className="rounded-4xl p-5 border-slate-200 bg-white shadow-card space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-heading text-sm font-bold text-slate-900">
                        Completed Trial Bayesian Verdict Reviewer
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Trial Concluded
                      </span>
                    </div>

                    <div className="p-4 rounded-3xl bg-[#F4F6F2] border border-slate-200 text-xs space-y-2">
                      <div className="font-bold text-slate-900 text-sm">
                        Trial: Low-GI Indian Diet Substitution (42 Days)
                      </div>
                      <p className="text-slate-700 leading-relaxed text-[11px]">
                        Cycle-adjusted OLS effect &delta; = +0.98 points on daily energy scale. Bayesian posterior probability of benefit &gt; MCID is <strong>91%</strong> (Verdict: <strong>Likely Worked</strong>). Autocorrelation lag-1 inflated SE applied.
                      </p>

                      <div className="pt-2">
                        <Button
                          variant="purple"
                          size="sm"
                          className="rounded-full text-xs font-bold"
                          onClick={() => setVerdictConvertedToRule(true)}
                        >
                          {verdictConvertedToRule ? '✓ Converted to Permanent Rule' : 'Convert Verdict to Fixed Health Rule'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* SUB-TAB 6: NOTES & RX (D7, D8, D12, D13, D23) */}
              {activePatientSubTab === 'notesRx' && (
                <div className="space-y-4">
                  {/* D8. Live Two-Way Translation Caption Bar */}
                  {showLiveCaptions && (
                    <div className="p-3 rounded-2xl bg-slate-900 text-white text-xs flex flex-wrap items-center justify-between gap-2 border border-slate-800">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-rose-300" />
                        <span className="font-bold text-rose-200">Live Two-Way Translation:</span>
                        <select
                          value={translationLangPair}
                          onChange={(e) => setTranslationLangPair(e.target.value as any)}
                          className="bg-white/10 text-white rounded-lg px-2 py-0.5 text-[10px] font-semibold"
                        >
                          <option value="EN_TE" className="bg-slate-900">English ⇄ Telugu</option>
                          <option value="EN_HI" className="bg-slate-900">English ⇄ Hindi</option>
                          <option value="EN_TA" className="bg-slate-900">English ⇄ Tamil</option>
                        </select>
                      </div>
                      <div className="text-[11px] text-slate-300 italic truncate max-w-md">
                        Doctor: "Take Metformin with dinner" ➔ రోజూ రాత్రి భోజనంతో మెట్‌ఫార్మిన్ వేసుకోండి
                      </div>
                    </div>
                  )}

                  {/* D7. Ambient Scribe Note */}
                  <Card className="rounded-4xl p-5 border-slate-200 bg-white shadow-card space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-heading text-sm font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        Auto-Structured Clinical Note (SOAP)
                      </span>
                      <span className="text-[10px] text-slate-400">Code-mixed Indic clinical speech recognized</span>
                    </div>

                    <div className="p-4 rounded-3xl bg-[#F4F6F2] border border-slate-200 text-xs space-y-2 text-slate-800 font-mono">
                      <div><strong>CC:</strong> Prolonged 42-day cycle, luteal lethargy, recurrent post-dairy bloating.</div>
                      <div><strong>Hx:</strong> PCOS Rotterdam B, HOMA-IR 3.61, on Metformin 500mg SR. Maternal hypothyroidism.</div>
                      <div><strong>Exam:</strong> BMI 24.8, BP 118/76, zero thyroid swelling, mild perioral acne.</div>
                      <div><strong>Assessment:</strong> Metabolic Phenotype B PCOS; subclinical TSH elevation (3.8).</div>
                      <div><strong>Plan:</strong> Repeat TSH/Anti-TPO at 12w; continue Metformin 500mg; approve dairy elimination trial.</div>
                    </div>
                  </Card>

                  {/* D12. Prescription Assistant */}
                  <Card className="rounded-4xl p-5 border-slate-200 bg-white shadow-card space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-heading text-sm font-bold text-slate-900">
                        Indian Generic &amp; Brand Rx Composer (Safety Checks)
                      </span>
                      <span className="text-[10px] text-slate-400">Telemedicine Practice Guidelines 2020 Compliant</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900">Tab. Metformin 500mg SR (Glycomet-SR)</div>
                          <div className="text-[10px] text-slate-500">1 tablet with dinner (0-0-1) • 90 Days</div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Generic Cost: ₹45/mo (Brand ₹140)
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900">Tab. Thyronorm 25mcg (Levothyroxine)</div>
                          <div className="text-[10px] text-slate-500">1 tablet empty stomach (1-0-0) • 90 Days</div>
                        </div>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                          Interaction: Separate from Iron/Calcium by 4h
                        </span>
                      </div>
                    </div>

                    {/* D23. ABDM Push & Preview Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                      <label className="flex items-center gap-2 text-xs text-slate-700 font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={pushToAbha}
                          onChange={(e) => setPushToAbha(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Push to Patient's ABHA Record (ICD-10: E28.2 PCOS)</span>
                      </label>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full text-xs"
                          onClick={() => setPreviewForPatientOpen(true)}
                        >
                          Preview for Patient
                        </Button>
                        <Button
                          variant="forest"
                          size="sm"
                          className="rounded-full text-xs font-bold"
                          onClick={() => {
                            setRxSignedSuccess(true);
                            setTimeout(() => setRxSignedSuccess(false), 3500);
                          }}
                        >
                          {rxSignedSuccess ? '✓ Signed & Pushed to ABHA' : 'Sign & Send e-Prescription'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* SUB-TAB 7: MESSAGES (D3, D21) */}
              {activePatientSubTab === 'messages' && (
                <Card className="rounded-4xl p-5 border-slate-200 bg-white shadow-card space-y-4">
                  {/* D21. Patient vs Team Toggle */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="inline-flex rounded-full bg-slate-100 p-1 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setMessageViewMode('patient')}
                        className={`rounded-full px-4 py-1.5 transition ${
                          messageViewMode === 'patient' ? 'bg-brand-purple text-white shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        Patient Chat
                      </button>
                      <button
                        type="button"
                        onClick={() => setMessageViewMode('team')}
                        className={`rounded-full px-4 py-1.5 transition ${
                          messageViewMode === 'team' ? 'bg-brand-purple text-white shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        👥 Care Team Thread
                      </button>
                    </div>

                    <span className="text-[10px] text-slate-400">
                      {messageViewMode === 'team' ? 'Private clinical team channel' : 'Patient visible'}
                    </span>
                  </div>

                  {/* Mode 1: Patient Message with D3 AI Draft Panel */}
                  {messageViewMode === 'patient' && (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-3xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between text-slate-500 text-[10px]">
                          <span>From Priya Sharma</span>
                          <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full">Clinical Tag</span>
                        </div>
                        <p className="font-semibold text-slate-900">
                          "Namaste Dr. Sen, given my cycle is running 42 days, should I increase Metformin dose or wait?"
                        </p>
                      </div>

                      {/* D3 AI Draft Panel on Right */}
                      <div className="p-4 rounded-3xl bg-indigo-50/70 border border-indigo-200 text-xs space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-heading font-bold text-xs text-indigo-950 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                            AI Drafted Reply (Grounded in Guidelines &amp; Your Locked Rules)
                          </span>
                          <span className="text-[10px] text-slate-400">Telugu &amp; English verified</span>
                        </div>

                        <div className="p-3 rounded-2xl bg-white border border-indigo-100 text-slate-800 leading-relaxed text-[11px]">
                          "నమస్తే ప్రియా, మెట్‌ఫార్మిన్ మోతాదును ప్రస్తుతానికి 500mg వద్దే కొనసాగించండి. శుక్రవారం మన సంప్రదింపులో మీ TSH మరియు ఇన్సులిన్ స్థాయిలను పరిశీలించి తగిన నిర్ణయం తీసుకుందాం."
                        </div>

                        <div className="text-[10px] text-slate-500">
                          <strong>English Back-Translation:</strong> "Namaste Priya, please continue Metformin 500mg for now. In our Friday consult, we will review your TSH and insulin levels together before adjusting."
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1">
                          <Button size="sm" variant="purple" className="rounded-full text-xs font-bold">
                            Send Verified Reply
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-full text-xs">
                            Edit Draft
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mode 2: D21 Care Team Thread */}
                  {messageViewMode === 'team' && (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-3xl bg-pastel-blue/40 border border-blue-200 text-xs space-y-1">
                        <div className="font-bold text-blue-950 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          Pinned AI Summary of Care Team Consensus:
                        </div>
                        <p className="text-blue-900 text-[11px] leading-relaxed">
                          Consensus reached on Low-GI diet intervention. Open point: Dietitian Sneha Nair to synchronize fasting window with evening Metformin dose. Dr. Gupta (Endo) to review TSH repetition in December.
                        </p>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                          <div className="font-bold text-slate-900">Sneha Nair, RD (Clinical Dietitian):</div>
                          <div className="text-slate-600 mt-0.5">"I have updated the meal plan to include fermented millets and shifted the fasting window to accommodate dinner Metformin."</div>
                        </div>
                        <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                          <div className="font-bold text-slate-900">Dr. Ramesh Gupta, MD (Endocrinologist):</div>
                          <div className="text-slate-600 mt-0.5">"Agree with TSH repetition in 12 weeks. If TSH remains &gt; 3.5 with symptoms, we can initiate Thyronorm 25mcg titration."</div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              )}
            </div>
          )}

          {/* SECTION 2: RISK-RANKED INBOX (D1, D2) */}
          {activeSection === 'inbox' && (
            <Card className="rounded-4xl p-5 border-slate-200 bg-white shadow-card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-heading text-base font-bold text-slate-900">
                    Risk-Ranked Inbox &amp; AI Triage
                  </h3>
                  <p className="text-xs text-slate-500">
                    Scored by clinical urgency, out-of-range labs, red flags, and adherence drops.
                  </p>
                </div>

                {/* Filter Chips */}
                <div className="flex gap-1 overflow-x-auto pb-1 text-xs">
                  {(['all', 'urgent', 'approvals', 'labs', 'messages', 'overdue'] as const).map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setInboxFilter(chip)}
                      className={`rounded-full px-3 py-1 font-semibold capitalize transition ${
                        inboxFilter === chip
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rows */}
              <div className="space-y-2.5">
                {filteredInbox.map((item) => {
                  const isExpanded = expandedInboxItemId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="rounded-3xl border border-slate-200 p-3.5 hover:border-indigo-300 transition space-y-2 bg-slate-50/50"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-3 h-3 rounded-full shrink-0 ${
                              item.priority === 'red'
                                ? 'bg-red-600 animate-pulse'
                                : item.priority === 'amber'
                                ? 'bg-amber-500'
                                : 'bg-slate-400'
                            }`}
                          />
                          <div>
                            <span className="font-heading font-bold text-xs text-slate-900">
                              {item.patientName} ({item.age}F)
                            </span>
                            <span className="text-slate-400 text-[10px] ml-2">{item.time}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveSection('patients');
                              setActivePatientSubTab('brief');
                            }}
                            className="text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-full transition"
                          >
                            {item.primaryAction}
                          </button>
                          <button
                            type="button"
                            onClick={() => setExpandedInboxItemId(isExpanded ? null : item.id)}
                            className="p-1 text-slate-400 hover:text-slate-600"
                            title="Why was this flagged?"
                          >
                            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      </div>

                      <div className="text-xs text-slate-700 pl-5">
                        {item.reason}
                      </div>

                      {/* D2. Alert Explanations ("Why is this here?") */}
                      {isExpanded && (
                        <div className="mt-2 ml-5 p-3 rounded-2xl bg-white border border-indigo-100 text-xs text-slate-700 space-y-1 animate-in fade-in">
                          <div className="font-bold text-indigo-950 text-[11px] flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Why is this alert prioritized?</span>
                          </div>
                          <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-600">
                            {item.evidence.map((ev, idx) => (
                              <li key={idx}>{ev}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* SECTION 3: OPD SCHEDULE */}
          {activeSection === 'schedule' && (
            <Card className="rounded-4xl p-5 border-slate-200 bg-white shadow-card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <h3 className="font-heading text-base font-bold text-slate-900">
                  Today's Consult Schedule (Apollo Health City OPD)
                </h3>
                <span className="text-xs text-slate-500 font-semibold">21 Nov 2026</span>
              </div>

              <div className="space-y-3">
                {DOCTOR_SCHEDULE_TODAY.map((slot) => (
                  <div key={slot.id} className="p-4 rounded-3xl border border-slate-200 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex flex-col items-center justify-center font-bold text-xs shrink-0">
                        <Clock className="w-4 h-4 mb-0.5" />
                        <span className="text-[10px]">{slot.time}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-bold text-sm text-slate-900">{slot.patientName}</h4>
                          <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                            {slot.slotType}
                          </span>
                          {slot.briefReady && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3" /> Brief Ready
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5">
                          {slot.chiefConcern}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="forest"
                      size="sm"
                      className="rounded-full text-xs font-bold"
                      onClick={() => {
                        setActiveSection('patients');
                        setActivePatientSubTab('brief');
                      }}
                    >
                      Open Patient Chart
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* SECTION 4: PRACTICE INSIGHTS (D22) */}
          {activeSection === 'insights' && (
            <div className="space-y-4">
              <Card className="rounded-4xl p-5 border-slate-200 bg-white shadow-card space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-heading text-base font-bold text-slate-900">
                      Practice Insights &amp; Clinical Panel Analytics
                    </h3>
                    <p className="text-xs text-slate-500">
                      Aggregated metrics over your 184 consented patients (DPDP N &ge; 5 privacy floor applied).
                    </p>
                  </div>
                  <span className="text-xs bg-indigo-50 text-brand-purple font-bold px-3 py-1 rounded-full">
                    Last 6 Months
                  </span>
                </div>

                {/* KPI Highlights */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Consented Panel</div>
                    <div className="font-heading font-extrabold text-lg text-slate-900 mt-0.5">184</div>
                    <div className="text-[10px] text-slate-500">112 PCOS • 48 Thyroid</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Median HOMA-IR</div>
                    <div className="font-heading font-extrabold text-lg text-emerald-700 mt-0.5">2.9</div>
                    <div className="text-[10px] text-emerald-600">↓ Reduced from 3.8</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Cycle Regularity</div>
                    <div className="font-heading font-extrabold text-lg text-emerald-700 mt-0.5">78%</div>
                    <div className="text-[10px] text-emerald-600">↑ Up 22% in 6 mos</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">N-of-1 Completion</div>
                    <div className="font-heading font-extrabold text-lg text-indigo-700 mt-0.5">84%</div>
                    <div className="text-[10px] text-slate-500">Adherence &ge; 70%</div>
                  </div>
                </div>

                {/* Natural Language Query Box */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <span className="font-heading text-xs font-bold text-slate-800">
                    Natural-Language Clinical Query Engine:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="text"
                      value={nlQuery}
                      onChange={(e) => setNlQuery(e.target.value)}
                      className="flex-1 min-w-0 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs focus:outline-none focus:border-indigo-500"
                    />
                    <Button size="sm" variant="forest" className="rounded-full text-xs font-bold shrink-0" onClick={() => setNlQueryResultVisible(true)}>
                      Run Query
                    </Button>
                  </div>

                  {nlQueryResultVisible && (
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1 animate-in fade-in">
                      <div className="font-bold flex items-center justify-between">
                        <span>Query Result: 4 patients identified (Priya Sharma, Ananya Iyer, Deepa M, Sneha K)</span>
                        <Button size="sm" variant="outline" className="text-[10px] h-6 px-2">
                          Bulk Send Lab Reminder
                        </Button>
                      </div>
                      <p className="text-[11px] text-emerald-800">
                        Patients with Rotterdam B diagnosis whose last Fasting Insulin &gt; 120 days ago.
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* SECTION 5: SETTINGS & ABDM (D23) */}
          {activeSection === 'settings' && (
            <Card className="rounded-4xl p-5 border-slate-200 bg-white shadow-card space-y-4">
              <h3 className="font-heading text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                ABDM / ABHA Record Exchange &amp; Registry Linkage
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">Health Professional Registry (HPR ID)</div>
                    <div className="text-[10px] text-slate-500">HP98472918 • Dr. Ananya Sen (Verified Active)</div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Linked ✓
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">Facility Registry (HFR ID)</div>
                    <div className="text-[10px] text-slate-500">Apollo Health City, Jubilee Hills, Hyderabad</div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Linked ✓
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* SECTION 6: AI AUDIT TRAIL (D24) */}
          {activeSection === 'audit' && (
            <Card className="rounded-4xl p-5 border-slate-200 bg-white shadow-card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-heading text-base font-bold text-slate-900">
                    Medico-Legal AI Audit Trail
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tamper-proof log of every AI clinical recommendation, citation, and physician action.
                  </p>
                </div>
                <Button size="sm" variant="outline" className="rounded-full text-xs">
                  <Download className="w-3.5 h-3.5 mr-1" />
                  Export Audit PDF
                </Button>
              </div>

              <div className="space-y-2.5">
                {DOCTOR_AUDIT_TRAIL.map((audit) => (
                  <div key={audit.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-slate-900">
                        {audit.patientName} • {audit.feature}
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        {audit.clinicianAction} by Dr. Sen
                      </span>
                    </div>
                    <div className="text-slate-700"><strong>Suggestion:</strong> {audit.suggestion}</div>
                    <div className="text-[10px] text-slate-400">
                      Model: {audit.model} • Citation: {audit.sourcesCited} • {audit.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </section>
      </div>

      {/* D9. GLOBAL GUIDELINE COPILOT (Floating Action Button + Slide-out Drawer) */}
      <div className="fixed bottom-20 right-3 lg:bottom-4 lg:right-4 z-50">
        <button
          type="button"
          onClick={() => setCopilotOpen(!copilotOpen)}
          aria-label="Ask Guidelines (Copilot)"
          className="flex items-center gap-2 p-3 sm:px-4 sm:py-2.5 rounded-full bg-brand-purple hover:bg-brand-purpleHover text-white font-bold text-xs shadow-xl shadow-indigo-500/30 transition transform hover:scale-105"
        >
          <BookOpen className="w-4 h-4" />
          <span className="hidden sm:inline">Ask Guidelines (Copilot)</span>
        </button>
      </div>

      {/* D9 Copilot Drawer */}
      {copilotOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-5 space-y-4 overflow-y-auto animate-in slide-in-from-right duration-200 text-xs text-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-purple" />
                <span className="font-heading text-base font-bold text-slate-900">
                  Guideline Copilot
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCopilotOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="text-[11px] text-slate-500">
              Passages retrieved strictly from versioned guidelines: <strong>International PCOS Guideline 2023</strong>, <strong>FOGSI</strong>, <strong>ACOG</strong>, <strong>ATA</strong>, and <strong>ICMR-NIN</strong>.
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={copilotQuery}
                onChange={(e) => setCopilotQuery(e.target.value)}
                placeholder="Ask guideline query..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Cited Guideline Answer */}
            <div className="p-4 rounded-3xl bg-indigo-50/70 border border-indigo-200 space-y-2">
              <div className="font-bold text-indigo-950 text-xs">
                Passage Citation: International PCOS Guideline 2023 · Sec. 4.2
              </div>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                "Combined Oral Contraceptive Pills (COCPs) or Spironolactone are first-line pharmacological options for clinical hyperandrogenism in women not actively seeking pregnancy. For women with metabolic risk (HOMA-IR &gt; 2.5), Metformin should be co-prescribed."
              </p>
              <div className="p-2.5 rounded-2xl bg-white border border-indigo-100 text-slate-800 text-[11px]">
                <strong>Context for Priya Sharma:</strong> Priya is in <em>TTC 2027 mode</em>: Spironolactone is contraindicated due to potential feminization of male fetus. Recommend continuing Metformin + lifestyle sequencing.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* D13. PATIENT-LANGUAGE PREVIEW MODAL */}
      {previewForPatientOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-4xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <span className="font-heading text-base font-bold text-slate-900">
                Patient-Language Instructions + Automatic Back-Translation
              </span>
              <button
                type="button"
                onClick={() => setPreviewForPatientOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Left Column: Telugu / Indic */}
              <div className="p-4 rounded-3xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                <div className="font-bold text-indigo-950 text-xs">
                  Patient App View (Telugu • తెలుగు):
                </div>
                <p className="text-slate-800 leading-relaxed text-xs">
                  "1. గ్లైకోమెట్-SR 500mg: రోజూ రాత్రి భోజనం తర్వాత 1 మాత్ర వేసుకోండి.<br />
                  2. థైరోనార్మ్ 25mcg: ఉదయం ఖాళీ కడుపుతో టీ లేదా కాఫీ తాగడానికి 30 నిమిషాల ముందు వేసుకోండి.<br />
                  3. మైదా మరియు గ్లూటెన్ ఆహారాలను 3 నెలలు నివారించండి."
                </p>
              </div>

              {/* Right Column: English Back-Translation */}
              <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-xs">
                  English Back-Translation (Physician Verification):
                </div>
                <p className="text-slate-700 leading-relaxed text-xs">
                  "1. Glycomet-SR 500mg: Take 1 tablet daily with evening dinner.<br />
                  2. Thyronorm 25mcg: Take 1 tablet on an empty stomach 30 mins before tea/coffee.<br />
                  3. Avoid maida and refined wheat products for 3 months."
                </p>
                <div className="text-emerald-700 font-bold text-[10px]">
                  ✓ 100% Clinical Semantic Match Verified
                </div>
              </div>
            </div>

            <Button
              variant="forest"
              className="w-full text-xs font-bold py-2.5 rounded-2xl"
              onClick={() => setPreviewForPatientOpen(false)}
            >
              Confirm Verified Instructions
            </Button>
          </div>
        </div>
      )}

      {/* D20. REFERRAL MODAL */}
      {referralModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-4xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <span className="font-heading text-base font-bold text-slate-900">
                Referral &amp; Care-Team Handoff Writer
              </span>
              <button
                type="button"
                onClick={() => setReferralModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-slate-700">Select Colleague / Specialty:</label>
              <select
                value={selectedReferralSpecialist}
                onChange={(e) => setSelectedReferralSpecialist(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-2 text-xs"
              >
                <option value="Dr. Ramesh Gupta (Endocrinologist)">Dr. Ramesh Gupta (Endocrinologist)</option>
                <option value="Sneha Nair (Clinical Dietitian)">Sneha Nair, RD (Clinical Dietitian)</option>
                <option value="Priya Rao (Physiotherapist)">Priya Rao, PT (Women’s Physiotherapist)</option>
              </select>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 leading-relaxed">
              <strong>Auto-Drafted Referral Note:</strong><br />
              "Referring Priya Sharma (26F, Rotterdam B PCOS) for subclinical TSH elevation (3.8 µIU/mL vs baseline 2.1) and persistent 42-day cycle prolongation. Sharing metabolic labs and locked dietary constraints with patient consent."
            </div>

            <Button
              variant="forest"
              className="w-full text-xs font-bold py-2.5 rounded-2xl"
              onClick={() => {
                setReferralSentSuccess(true);
                setTimeout(() => {
                  setReferralSentSuccess(false);
                  setReferralModalOpen(false);
                }, 2000);
              }}
            >
              {referralSentSuccess ? '✓ Referral & Consent Sent' : 'Send Referral Letter'}
            </Button>
          </div>
        </div>
      )}

      {/* MOBILE 5-TAB BOTTOM NAVIGATION BAR (Visible only on mobile devices) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg py-2">
        <nav className="mx-auto flex max-w-md items-center justify-around px-2">
          {[
            { id: 'inbox', label: 'Inbox', icon: InboxIcon },
            { id: 'patients', label: 'Patients', icon: Users },
            { id: 'schedule', label: 'Schedule', icon: Calendar },
            { id: 'insights', label: 'Insights', icon: BarChart3 },
            { id: 'audit', label: 'Audit', icon: ShieldCheck },
          ].map((item) => {
            const isTabActive = activeSection === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id as any)}
                className={`flex flex-col items-center justify-center transition-all ${
                  isTabActive ? 'text-brand-purple' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-full transition-all ${
                    isTabActive
                      ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/30 scale-105'
                      : 'bg-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
