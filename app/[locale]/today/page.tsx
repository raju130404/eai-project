'use client';

import React, { useState } from 'react';
import { Link, useRouter } from '@/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Locale } from '@/i18n';
import { getDictionary } from '@/lib/i18n-dictionary';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar as CalendarIcon,
  Flame,
  Clock,
  ChevronRight,
  Smile,
  Pill,
  Sparkles,
  Utensils,
  BookOpen,
  ArrowRight,
  Activity,
  Volume2,
  Camera,
  X,
  Play,
  Pause,
  AlertTriangle,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Plus,
} from 'lucide-react';

export default function TodayPage() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const dict = getDictionary(locale);

  // Selected date in weekly strip
  const [selectedDay, setSelectedDay] = useState<number>(18);

  // Selected mood
  const [activeMood, setActiveMood] = useState<string>('happy');
  const [moodSuccess, setMoodSuccess] = useState<boolean>(false);

  // Quick medicines
  const [medsTaken, setMedsTaken] = useState<Record<string, boolean>>({
    thyronorm: true,
    metformin: false,
  });

  // H1. Forecast state
  const [forecastExpanded, setForecastExpanded] = useState<boolean>(false);
  const [isSpeakingForecast, setIsSpeakingForecast] = useState<boolean>(false);

  // H3. Audio recap state
  const [audioRecapPlaying, setAudioRecapPlaying] = useState<boolean>(false);
  const [audioTranscriptOpen, setAudioTranscriptOpen] = useState<boolean>(false);

  // H4. Prescription scan state
  const [prescriptionScanOpen, setPrescriptionScanOpen] = useState<boolean>(false);
  const [prescriptionSaved, setPrescriptionSaved] = useState<boolean>(false);

  // Workouts modal
  const [workoutsModalOpen, setWorkoutsModalOpen] = useState<boolean>(false);

  const weekDays = [
    { date: 15, day: dict.home.daysOfWeek[0], isPeriod: false },
    { date: 16, day: dict.home.daysOfWeek[1], isPeriod: false },
    { date: 17, day: dict.home.daysOfWeek[2], isPeriod: false },
    { date: 18, day: dict.home.daysOfWeek[3], isPeriod: true }, // Today
    { date: 19, day: dict.home.daysOfWeek[4], isPeriod: false },
    { date: 20, day: dict.home.daysOfWeek[5], isPeriod: false },
    { date: 21, day: dict.home.daysOfWeek[6], isPeriod: false },
  ];

  const handleSelectMood = (moodId: string) => {
    setActiveMood(moodId);
    setMoodSuccess(true);
    setTimeout(() => setMoodSuccess(false), 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-5 pb-8 pt-1">
      {/* 1. TOP GREETING HEADER (Matching Slide Phone Prototype) */}
      <div className="px-1 pt-1 pb-0.5">
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#361118] tracking-tight">
          Good morning!
        </h1>
        <p className="text-xs sm:text-sm font-medium text-[#7A5A62] mt-0.5">
          Here&apos;s your health overview
        </p>
      </div>

      {/* 2. CYCLE OVERVIEW CARD (Clean progress bar, Day 14 of 28, matching slide phone) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F2E2DD] shadow-xs space-y-3.5 transition">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FCEEEB] flex items-center justify-center text-[#7A1D2E] shrink-0">
              <CalendarIcon className="w-5 h-5 text-[#7A1D2E]" />
            </div>
            <div>
              <span className="font-heading font-bold text-base text-[#361118] block leading-tight">
                Cycle
              </span>
              <span className="text-[11px] font-medium text-[#7A5A62]">
                Follicular phase • Regular baseline
              </span>
            </div>
          </div>
          <Link
            href="/checkin"
            className="flex items-center gap-1 text-xs font-bold text-[#7A1D2E] hover:underline bg-[#FCEEEB] px-3 py-1.5 rounded-full border border-[#F0DDD8] transition"
          >
            <span>Day 14 of 28</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#7A1D2E]" />
          </Link>
        </div>

        {/* Progress Bar & Phase Marker */}
        <div className="pt-1 pb-0.5">
          <div className="relative h-2.5 w-full rounded-full bg-[#F5E6E1]">
            <div
              className="h-2.5 rounded-full bg-[#7A1D2E] transition-all duration-500"
              style={{ width: '50%' }}
            />
            {/* Slider Indicator dot at Day 14 / 50% */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#7A1D2E] border-2 border-white shadow-xs"
              style={{ left: '50%' }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-medium text-[#7A5A62] mt-2 px-0.5">
            <span>Day 1 (Period)</span>
            <span className="text-[#7A1D2E] font-bold">Day 14 (Mid-Cycle)</span>
            <span>Day 28 (Expected)</span>
          </div>
        </div>
      </div>

      {/* 3. 2-COLUMN SUMMARY ROW: SYMPTOMS & SLEEP (Matching Slide Phone) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Left Card: Symptoms */}
        <Link
          href="/checkin"
          className="bg-white rounded-2xl p-3.5 border border-[#F2E2DD] shadow-xs hover:border-[#7A1D2E]/40 transition group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-[#FCEEEB] flex items-center justify-center text-[#7A1D2E]">
              <Flame className="w-4 h-4 text-[#7A1D2E]" />
            </div>
            <ChevronRight className="w-4 h-4 text-[#7A1D2E] opacity-60 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="mt-3">
            <span className="text-xs font-bold text-[#361118] block font-heading">
              Symptoms
            </span>
            <div className="text-[11px] font-medium text-[#7A5A62] flex items-center justify-between mt-0.5">
              <span>Bloating, fatigue</span>
              <span className="text-[10px] text-[#7A1D2E] font-bold">&gt;</span>
            </div>
          </div>
        </Link>

        {/* Right Card: Sleep */}
        <div className="bg-white rounded-2xl p-3.5 border border-[#F2E2DD] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-[#FCEEEB] flex items-center justify-center text-[#7A1D2E]">
              <Clock className="w-4 h-4 text-[#7A1D2E]" />
            </div>
            <ChevronRight className="w-4 h-4 text-[#7A1D2E] opacity-60" />
          </div>
          <div className="mt-3">
            <span className="text-xs font-bold text-[#361118] block font-heading">
              Sleep
            </span>
            <div className="text-[11px] font-medium text-[#7A5A62] flex items-center justify-between mt-0.5">
              <span>6 h 40 min</span>
              <span className="text-[10px] text-[#7A1D2E] font-bold">&gt;</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MOOD CARD WITH 7-DAY SPARKLINE WAVE (Matching Slide Phone) */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#F2E2DD] shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#FCEEEB] flex items-center justify-center text-[#7A1D2E] shrink-0">
            <Smile className="w-5 h-5 text-[#7A1D2E]" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-[#361118] block font-heading">
              Mood
            </span>
            <span className="text-[11px] font-medium text-[#7A5A62] block truncate">
              Mostly good • Calming trend
            </span>
          </div>
        </div>

        {/* Dynamic Sparkline Wave in Deep Burgundy */}
        <div className="shrink-0 flex items-center gap-2">
          <svg className="w-24 h-8 overflow-visible" viewBox="0 0 96 32">
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7A1D2E" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#7A1D2E" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M 0,22 Q 16,8 32,16 T 64,12 T 96,18 L 96,32 L 0,32 Z"
              fill="url(#moodGradient)"
            />
            <path
              d="M 0,22 Q 16,8 32,16 T 64,12 T 96,18"
              fill="none"
              stroke="#7A1D2E"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="96" cy="18" r="3.5" fill="#7A1D2E" stroke="#FFFFFF" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {/* 5. AI INSIGHT CARD (Matching Slide Phone) */}
      <div className="bg-[#FFF9F7] rounded-3xl p-4 sm:p-5 border border-[#F2E2DD] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FCEEEB] flex items-center justify-center text-[#7A1D2E]">
              <Sparkles className="w-4 h-4 text-[#7A1D2E]" />
            </div>
            <span className="font-heading font-bold text-sm text-[#7A1D2E]">
              AI Insight
            </span>
          </div>
          <span className="text-[10px] font-semibold bg-[#FCEEEB] text-[#7A1D2E] px-2.5 py-0.5 rounded-full border border-[#F0DDD8]">
            Adaptive
          </span>
        </div>

        <p className="text-xs sm:text-[13px] text-[#361118] leading-relaxed font-medium">
          Your fatigue and bloating are common around mid-cycle and may be linked to hormonal changes.
        </p>

        <Link
          href="/ask"
          className="w-full py-2.5 px-4 rounded-xl bg-[#7A1D2E] hover:bg-[#661423] text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
        >
          <span>See what you can do</span>
          <ChevronRight className="w-4 h-4 text-white" />
        </Link>
      </div>

      {/* 6. SLIDE CORE PILLARS & BANNER (Connect · Understand · Navigate) */}
      <div className="bg-white rounded-3xl p-4 border border-[#F2E2DD] shadow-xs space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-2xl bg-[#FAF4F0] border border-[#F2E2DD]">
            <div className="w-7 h-7 mx-auto rounded-full bg-[#FCEEEB] flex items-center justify-center text-[#7A1D2E] text-xs font-bold mb-1">
              🔗
            </div>
            <div className="font-heading font-bold text-[11px] text-[#7A1D2E]">CONNECT</div>
            <div className="text-[9px] text-[#7A5A62] mt-0.5 leading-tight">Cycle, sleep & mood signals</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#FAF4F0] border border-[#F2E2DD]">
            <div className="w-7 h-7 mx-auto rounded-full bg-[#FCEEEB] flex items-center justify-center text-[#7A1D2E] text-xs font-bold mb-1">
              🧠
            </div>
            <div className="font-heading font-bold text-[11px] text-[#7A1D2E]">UNDERSTAND</div>
            <div className="text-[9px] text-[#7A5A62] mt-0.5 leading-tight">Adaptive evolving patterns</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#FAF4F0] border border-[#F2E2DD]">
            <div className="w-7 h-7 mx-auto rounded-full bg-[#FCEEEB] flex items-center justify-center text-[#7A1D2E] text-xs font-bold mb-1">
              🧭
            </div>
            <div className="font-heading font-bold text-[11px] text-[#7A1D2E]">NAVIGATE</div>
            <div className="text-[9px] text-[#7A5A62] mt-0.5 leading-tight">Informed clinical next steps</div>
          </div>
        </div>

        {/* Banner from slide */}
        <div className="w-full py-2 px-3 rounded-xl bg-[#801D30] text-white text-center font-heading font-bold text-xs tracking-wider shadow-xs">
          Personalised. Connected. Actionable.
        </div>
      </div>

      {/* 7. WEEKLY CALENDAR STRIP */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-[#F2E2DD]">
        <div className="flex items-center justify-between px-1 mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#361118] font-heading">
            <CalendarIcon className="w-3.5 h-3.5 text-[#7A1D2E]" />
            <span>{dict.home.monthName}</span>
          </div>
          <Link
            href="/checkin"
            className="text-[11px] font-semibold text-[#7A1D2E] hover:underline"
          >
            {dict.home.viewCalendar}
          </Link>
        </div>

        {/* Row of 7 Days */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {weekDays.map((item) => {
            const isSelected = item.date === selectedDay;
            return (
              <button
                key={item.date}
                type="button"
                onClick={() => setSelectedDay(item.date)}
                className="flex flex-col items-center justify-center py-1 transition-all"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#7A1D2E] text-white shadow-md shadow-[#7A1D2E]/25 scale-105'
                      : item.isPeriod
                      ? 'border border-dashed border-[#7A1D2E] bg-[#FCEEEB] text-[#7A1D2E]'
                      : 'text-[#7A5A62] hover:bg-[#FAF4F0]'
                  }`}
                >
                  {item.date}
                </div>
                <span
                  className={`text-[10px] font-semibold mt-1 ${
                    isSelected ? 'text-[#7A1D2E] font-bold' : 'text-[#9E838A]'
                  }`}
                >
                  {item.day}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 8. QUICK MOOD TAG SELECTOR */}
      <div>
        <div className="flex items-center justify-between px-1 mb-2.5">
          <h3 className="font-heading text-sm font-bold text-[#361118]">
            {dict.home.yourMood}
          </h3>
          {moodSuccess && (
            <span className="text-[10px] font-bold text-[#7A1D2E] bg-[#FCEEEB] px-2.5 py-0.5 rounded-full border border-[#F0DDD8]">
              {dict.home.loggedToast}
            </span>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {/* ➕ Add Mood Card */}
          <Link
            href="/checkin"
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#FCEEEB] border border-[#F2E2DD] hover:bg-[#F8DDD7] transition shadow-xs"
          >
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#7A1D2E] shadow-xs mb-1">
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-bold text-[#7A1D2E] mt-0.5">
              {dict.home.addMood}
            </span>
          </Link>

          {/* 😭 Sad */}
          <button
            type="button"
            onClick={() => handleSelectMood('sad')}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition shadow-xs ${
              activeMood === 'sad'
                ? 'bg-[#FCEEEB] border-[#7A1D2E] scale-105'
                : 'bg-white border-[#F2E2DD] hover:bg-[#FAF4F0]'
            }`}
          >
            <span className="text-xl mb-1">😭</span>
            <span className="text-[10px] font-semibold text-[#7A5A62]">{dict.home.moodSad}</span>
          </button>

          {/* 😫 Badmood */}
          <button
            type="button"
            onClick={() => handleSelectMood('badmood')}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition shadow-xs ${
              activeMood === 'badmood'
                ? 'bg-[#FCEEEB] border-[#7A1D2E] scale-105'
                : 'bg-white border-[#F2E2DD] hover:bg-[#FAF4F0]'
            }`}
          >
            <span className="text-xl mb-1">😫</span>
            <span className="text-[10px] font-semibold text-[#7A5A62]">{dict.home.moodBad}</span>
          </button>

          {/* 😍 Happy */}
          <button
            type="button"
            onClick={() => handleSelectMood('happy')}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition shadow-xs ${
              activeMood === 'happy'
                ? 'bg-[#FCEEEB] border-[#7A1D2E] scale-105'
                : 'bg-white border-[#F2E2DD] hover:bg-[#FAF4F0]'
            }`}
          >
            <span className="text-xl mb-1">😍</span>
            <span className="text-[10px] font-semibold text-[#7A5A62]">{dict.home.moodHappy}</span>
          </button>
        </div>
      </div>

      {/* 9. TODAY'S DAILY MEDICINES CHECKLIST */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-[#F2E2DD] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-heading text-xs font-bold text-[#361118]">
            <Pill className="w-3.5 h-3.5 text-[#7A1D2E]" />
            <span>{dict.home.medsChecklistTitle}</span>
          </div>
          <span className="text-[10px] text-[#7A5A62] font-semibold">
            {dict.home.careTeamPrescribed}
          </span>
        </div>

        <div className="space-y-2">
          {/* Thyronorm */}
          <div
            onClick={() =>
              setMedsTaken({ ...medsTaken, thyronorm: !medsTaken.thyronorm })
            }
            className={`p-2.5 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
              medsTaken.thyronorm
                ? 'bg-[#FAF4F0] border-[#F2E2DD]'
                : 'bg-white border-[#F2E2DD]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center transition ${
                  medsTaken.thyronorm
                    ? 'bg-[#7A1D2E] text-white'
                    : 'border border-[#F2E2DD] bg-white'
                }`}
              >
                {medsTaken.thyronorm && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
              <div>
                <div className="text-xs font-bold text-[#361118]">
                  {dict.home.thyronormName}
                </div>
                <div className="text-[10px] text-[#7A5A62]">
                  {dict.home.thyronormDesc}
                </div>
              </div>
            </div>
            <span className="text-[10px] text-[#7A1D2E] font-bold">
              {medsTaken.thyronorm ? dict.home.takenLabel : dict.home.dueLabel}
            </span>
          </div>

          {/* Metformin */}
          <div
            onClick={() =>
              setMedsTaken({ ...medsTaken, metformin: !medsTaken.metformin })
            }
            className={`p-2.5 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
              medsTaken.metformin
                ? 'bg-[#FAF4F0] border-[#F2E2DD]'
                : 'bg-white border-[#F2E2DD]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center transition ${
                  medsTaken.metformin
                    ? 'bg-[#7A1D2E] text-white'
                    : 'border border-[#F2E2DD] bg-white'
                }`}
              >
                {medsTaken.metformin && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
              <div>
                <div className="text-xs font-bold text-[#361118]">
                  {dict.home.metforminName}
                </div>
                <div className="text-[10px] text-[#7A5A62]">
                  {dict.home.metforminDesc}
                </div>
              </div>
            </div>
            <span className="text-[10px] text-[#7A5A62] font-semibold">
              {medsTaken.metformin ? dict.home.takenLabel : dict.home.eveningLabel}
            </span>
          </div>
        </div>

        {/* H4. Prescription Scan Button */}
        <button
          type="button"
          onClick={() => setPrescriptionScanOpen(true)}
          className="w-full mt-2 py-2.5 px-3 rounded-2xl border border-dashed border-[#7A1D2E] text-[#7A1D2E] bg-[#FCEEEB]/60 hover:bg-[#FCEEEB] font-bold text-xs flex items-center justify-center gap-2 transition"
        >
          <Camera className="w-4 h-4" />
          <span>{dict.home.scanPrescriptionBtn}</span>
        </button>

        {prescriptionSaved && (
          <div className="p-2.5 rounded-2xl bg-[#EBF5F0] border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Prescription parsed! Smart timing rules applied.</span>
          </div>
        )}
      </div>

      {/* 10. 2×3 TOOLS GRID */}
      <div>
        <div className="flex items-center justify-between px-1 mb-2.5">
          <h3 className="font-heading text-sm font-bold text-[#361118]">
            {dict.home.toolsTitle}
          </h3>
          <span className="text-[11px] text-[#7A5A62] font-medium">{dict.home.oneTapAccess}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {/* Tool 1: Food & Tolerance */}
          <Link
            href="/food"
            className="p-3 rounded-2xl bg-white border border-[#F2E2DD] shadow-xs hover:border-[#7A1D2E] transition flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FCEEEB] text-[#7A1D2E] flex items-center justify-center text-lg shrink-0">
              🥗
            </div>
            <div>
              <div className="text-xs font-bold text-[#361118] leading-tight">{dict.home.toolFoodTitle}</div>
              <div className="text-[10px] text-[#7A5A62]">{dict.home.toolFoodSub}</div>
            </div>
          </Link>

          {/* Tool 2: Labs & OCR */}
          <Link
            href="/labs"
            className="p-3 rounded-2xl bg-white border border-[#F2E2DD] shadow-xs hover:border-[#7A1D2E] transition flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FCEEEB] text-[#7A1D2E] flex items-center justify-center text-lg shrink-0">
              🧪
            </div>
            <div>
              <div className="text-xs font-bold text-[#361118] leading-tight">{dict.home.toolLabsTitle}</div>
              <div className="text-[10px] text-[#7A5A62]">{dict.home.toolLabsSub}</div>
            </div>
          </Link>

          {/* Tool 3: Trials */}
          <Link
            href="/experiments"
            className="p-3 rounded-2xl bg-white border border-[#F2E2DD] shadow-xs hover:border-[#7A1D2E] transition flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FCEEEB] text-[#7A1D2E] flex items-center justify-center text-lg shrink-0">
              🔬
            </div>
            <div>
              <div className="text-xs font-bold text-[#361118] leading-tight">{dict.home.toolTrialsTitle}</div>
              <div className="text-[10px] text-[#7A5A62]">{dict.home.toolTrialsSub}</div>
            </div>
          </Link>

          {/* Tool 4: Smart Cart */}
          <Link
            href="/cart"
            className="p-3 rounded-2xl bg-white border border-[#F2E2DD] shadow-xs hover:border-[#7A1D2E] transition flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FCEEEB] text-[#7A1D2E] flex items-center justify-center text-lg shrink-0">
              🛒
            </div>
            <div>
              <div className="text-xs font-bold text-[#361118] leading-tight">{dict.home.toolCartTitle}</div>
              <div className="text-[10px] text-[#7A5A62]">{dict.home.toolCartSub}</div>
            </div>
          </Link>

          {/* Tool 5: Workouts */}
          <button
            type="button"
            onClick={() => setWorkoutsModalOpen(true)}
            className="p-3 rounded-2xl bg-white border border-[#F2E2DD] shadow-xs hover:border-[#7A1D2E] transition flex items-center gap-2.5 text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FCEEEB] text-[#7A1D2E] flex items-center justify-center text-lg shrink-0">
              🏃‍♀️
            </div>
            <div>
              <div className="text-xs font-bold text-[#361118] leading-tight">{dict.home.toolWorkoutsTitle}</div>
              <div className="text-[10px] text-[#7A5A62]">{dict.home.toolWorkoutsSub}</div>
            </div>
          </button>

          {/* Tool 6: Fasting Planner */}
          <Link
            href="/food"
            className="p-3 rounded-2xl bg-white border border-[#F2E2DD] shadow-xs hover:border-[#7A1D2E] transition flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FCEEEB] text-[#7A1D2E] flex items-center justify-center text-lg shrink-0">
              🌙
            </div>
            <div>
              <div className="text-xs font-bold text-[#361118] leading-tight">{dict.home.toolFastingTitle}</div>
              <div className="text-[10px] text-[#7A5A62]">{dict.home.toolFastingSub}</div>
            </div>
          </Link>
        </div>
      </div>

      {/* HORMONAL CRAVING SWAP PROMPT CARD */}
      <div className="p-4 rounded-3xl bg-[#FFF9F7] border border-[#F2E2DD] shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-[#FCEEEB] text-[#7A1D2E] flex items-center justify-center text-xl shrink-0">
            🍫
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-[#361118] font-heading flex items-center gap-1.5 flex-wrap">
              <span>Craving Unhealthy Food?</span>
              <span className="text-[9px] bg-[#FCEEEB] text-[#7A1D2E] font-semibold px-2 py-0.5 rounded-full border border-[#F0DDD8]">
                Hormonal Root Cause
              </span>
            </div>
            <div className="text-[11px] text-[#7A5A62] mt-0.5 truncate sm:whitespace-normal">
              PMS &amp; insulin shifts drive cravings. Find vetted Indian swaps in your log.
            </div>
          </div>
        </div>
        <Link
          href="/checkin#cravings"
          className="px-3.5 py-1.5 rounded-xl bg-[#7A1D2E] text-white hover:bg-[#661423] text-xs font-bold shadow-xs transition shrink-0 whitespace-nowrap"
        >
          Find Swaps &gt;
        </Link>
      </div>

      {/* 11. WEEKLY AUDIO RECAP & HEALTH ARTICLES */}
      <div>
        <div className="flex items-center justify-between px-1 mb-2.5">
          <h3 className="font-heading text-sm font-bold text-[#361118]">
            {dict.home.articlesTitle}
          </h3>
          <Link
            href="/ask"
            className="text-[11px] font-semibold text-[#7A1D2E] hover:underline flex items-center gap-0.5"
          >
            {dict.home.seeAll}
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {/* Card 1: H3. Weekly Audio Recap */}
          <div className="flex flex-col justify-between p-3 rounded-2xl bg-[#FFF9F7] border border-[#F2E2DD] shadow-xs h-32 relative">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-base">🎙️</span>
                <span className="text-[9px] font-bold bg-[#7A1D2E] text-white px-1.5 py-0.5 rounded-full">
                  {dict.home.duration75s}
                </span>
              </div>
              <div className="font-heading font-bold text-xs text-[#361118] mt-1 leading-snug">
                {dict.home.weeklyRecapTitle}
              </div>
              <p className="text-[9px] text-[#7A5A62] line-clamp-1 mt-0.5">
                {dict.home.weeklyRecapSub}
              </p>
            </div>
            <div className="flex items-center justify-between gap-1 mt-1">
              <button
                type="button"
                onClick={() => setAudioRecapPlaying(!audioRecapPlaying)}
                className="flex items-center gap-1 rounded-xl bg-[#7A1D2E] text-white px-2 py-1 text-[10px] font-bold hover:bg-[#661423] shadow-xs transition"
              >
                {audioRecapPlaying ? dict.home.pause : dict.home.play}
              </button>
              <button
                type="button"
                onClick={() => setAudioTranscriptOpen(!audioTranscriptOpen)}
                className="text-[9px] text-[#7A1D2E] underline font-semibold"
              >
                {audioTranscriptOpen ? dict.home.hideTranscript : dict.home.textTranscript}
              </button>
            </div>
          </div>

          {/* Card 2: Mood Booster */}
          <Link
            href="/food"
            className="flex flex-col justify-between p-3 rounded-2xl bg-white border border-[#F2E2DD] hover:scale-[1.02] transition shadow-xs h-32"
          >
            <div>
              <span className="text-lg">🥗</span>
              <div className="font-heading font-bold text-xs text-[#361118] mt-1 leading-snug">
                {dict.home.moodBooster}
              </div>
            </div>
            <span className="text-[9px] text-[#7A1D2E] font-semibold">
              {dict.home.smartSwaps}
            </span>
          </Link>

          {/* Card 3: Spread Happiness */}
          <Link
            href="/experiments"
            className="flex flex-col justify-between p-3 rounded-2xl bg-white border border-[#F2E2DD] hover:scale-[1.02] transition shadow-xs h-32"
          >
            <div>
              <span className="text-lg">✨</span>
              <div className="font-heading font-bold text-xs text-[#361118] mt-1 leading-snug">
                {dict.home.spreadHappiness}
              </div>
            </div>
            <span className="text-[9px] text-[#7A1D2E] font-semibold">
              {dict.home.activeTrials}
            </span>
          </Link>
        </div>

        {/* Weekly Audio Recap Transcript Drawer */}
        {audioTranscriptOpen && (
          <div className="mt-2.5 p-3 rounded-2xl bg-white border border-[#F2E2DD] text-xs text-[#361118] shadow-xs animate-in fade-in space-y-1">
            <div className="font-bold text-[#7A1D2E] text-[11px] flex items-center justify-between">
              <span>{dict.home.weeklyRecapTitle} ({dict.home.monthName})</span>
              <span className="text-[#7A5A62] text-[10px]">Read by Ritu</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#7A5A62]">
              {dict.home.recapTranscriptText}
            </p>
          </div>
        )}
      </div>

      {/* H4. PRESCRIPTION SCANNER MODAL */}
      {prescriptionScanOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-3 animate-in fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-4xl p-5 shadow-2xl border border-[#F2E2DD] z-10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F2E2DD]">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#7A1D2E]" />
                <span className="font-heading text-base font-bold text-[#361118]">
                  Prescription Scanner
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPrescriptionScanOpen(false)}
                className="w-7 h-7 rounded-full bg-[#FAF4F0] flex items-center justify-center text-[#7A5A62] hover:bg-[#F2E2DD]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated OCR viewfinder */}
            <div className="relative rounded-2xl bg-[#361118] p-4 text-center text-white space-y-2 border-2 border-dashed border-[#C46874]">
              <div className="text-xs font-semibold text-[#FCEEEB]">
                📄 Dr. Sen&apos;s RX Slip Detected
              </div>
              <div className="bg-white/10 rounded-xl p-2.5 text-[11px] text-left text-[#FAF4F0] space-y-1">
                <div>• Tab. Thyronorm 25mcg (1-0-0) AC</div>
                <div>• Tab. Metformin 500mg SR (0-0-1) PC</div>
                <div>• Cap. Shelcal-HD (1-0-0) PC</div>
              </div>
            </div>

            {/* Smart Timing AI Rules */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#361118] font-heading">
                Smart Timing Recommendations:
              </div>
              <div className="p-2.5 rounded-2xl bg-[#FAF4F0] border border-[#F2E2DD] text-[11px] text-[#361118] space-y-1">
                <div className="font-bold flex items-center gap-1 text-[#7A1D2E]">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#7A1D2E]" />
                  <span>Interaction Protection</span>
                </div>
                <div>
                  Take <strong>Thyronorm</strong> 30 min before chai. Separate from <strong>Shelcal-HD</strong> by 4+ hours.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setPrescriptionSaved(true);
                setPrescriptionScanOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-[#7A1D2E] text-white font-heading font-bold text-xs hover:bg-[#661423] transition"
            >
              Apply Reminders to Checklist
            </button>
          </div>
        </div>
      )}

      {/* WORKOUTS MODAL */}
      {workoutsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-3 animate-in fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-4xl p-5 shadow-2xl border border-[#F2E2DD] z-10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F2E2DD]">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#7A1D2E]" />
                <span className="font-heading text-base font-bold text-[#361118]">
                  Targeted Movement
                </span>
              </div>
              <button
                type="button"
                onClick={() => setWorkoutsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#FAF4F0] flex items-center justify-center text-[#7A5A62] hover:bg-[#F2E2DD]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#7A5A62]">
              Cortisol-conscious workouts calibrated to Priya&apos;s follicular phase and HOMA-IR target.
            </p>
            <div className="space-y-2">
              <div className="p-3 rounded-2xl bg-[#FAF4F0] border border-[#F2E2DD]">
                <div className="font-bold text-xs text-[#361118]">30-Min Post-Meal Walk</div>
                <div className="text-[11px] text-[#7A5A62]">Reduces glucose spike by 24% without cortisol spike.</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF4F0] border border-[#F2E2DD]">
                <div className="font-bold text-xs text-[#361118]">Slow-Paced Strength</div>
                <div className="text-[11px] text-[#7A5A62]">Glute & hamstring focus to build insulin sensitivity.</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setWorkoutsModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#7A1D2E] text-white font-heading font-bold text-xs hover:bg-[#661423] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
