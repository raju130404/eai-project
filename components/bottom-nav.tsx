'use client';

import React, { useState, useRef } from 'react';
import { Link, usePathname, useRouter } from '@/navigation';
import { useLocale } from 'next-intl';
import { Locale } from '@/i18n';
import { getDictionary } from '@/lib/i18n-dictionary';
import {
  Home,
  Calendar,
  Stethoscope,
  User,
  MessageCircle,
  Mic,
  X,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale() as Locale;
  const dict = getDictionary(locale);

  const isHomeActive = pathname === '/' || pathname.includes('/today') || pathname.includes('/dashboard');
  const isLogActive = pathname.includes('/checkin') || pathname.includes('/food') || pathname.includes('/labs');
  const isAskActive = pathname.includes('/ask') || pathname.includes('/coach');
  const isCareActive = pathname.includes('/care') || pathname.includes('/doctors');
  const isProfileActive = pathname.includes('/profile') || pathname.includes('/settings') || pathname.includes('/cart');

  // L1. Speak Anywhere long-press state
  const [speakOpen, setSpeakOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('Kal raat se pet phool raha hai, aur Metformin le liya');
  const [extractedTags, setExtractedTags] = useState(['Bloating (pet phoolna)', 'Metformin (taken)']);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  const startPress = () => {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      setSpeakOpen(true);
      setIsRecording(true);
      if (navigator.vibrate) navigator.vibrate(50);
    }, 450);
  };

  const endPress = (e: React.MouseEvent | React.TouchEvent) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (isLongPress.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#F2E2DD] shadow-lg py-2">
        <nav className="mx-auto flex max-w-md items-center justify-around px-4">
          {/* Tab 1: Home / Cycle */}
          <Link
            href="/today"
            className={`flex flex-col items-center justify-center transition-all ${
              isHomeActive ? 'text-[#7A1D2E]' : 'text-[#9E838A] hover:text-[#523338]'
            }`}
            aria-label="Home Cycle"
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                isHomeActive
                  ? 'bg-[#7A1D2E] text-white shadow-md shadow-[#7A1D2E]/25 scale-105'
                  : 'bg-transparent'
              }`}
            >
              <Home className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[10px] font-semibold mt-0.5">{dict.nav.home}</span>
          </Link>

          {/* Tab 2: Calendar & Daily Log (With L1 Speak Anywhere long-press) */}
          <div
            onPointerDown={startPress}
            onPointerUp={endPress}
            onPointerLeave={endPress}
            onTouchStart={startPress}
            onTouchEnd={endPress}
            className="relative"
          >
            <Link
              href="/checkin"
              onClick={(e) => {
                if (isLongPress.current) {
                  e.preventDefault();
                }
              }}
              className={`flex flex-col items-center justify-center transition-all ${
                isLogActive ? 'text-[#7A1D2E]' : 'text-[#9E838A] hover:text-[#523338]'
              }`}
              aria-label="Calendar and Log (Hold for voice)"
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                  isLogActive
                    ? 'bg-[#7A1D2E] text-white shadow-md shadow-[#7A1D2E]/25 scale-105'
                    : 'bg-transparent'
                }`}
              >
                <Calendar className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[10px] font-semibold mt-0.5">{dict.nav.log}</span>
            </Link>
          </div>

          {/* Tab 3: Ask Ritu */}
          <Link
            href="/ask"
            className={`flex flex-col items-center justify-center transition-all ${
              isAskActive ? 'text-[#7A1D2E]' : 'text-[#9E838A] hover:text-[#523338]'
            }`}
            aria-label="Ask Ritu"
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                isAskActive
                  ? 'bg-[#7A1D2E] text-white shadow-md shadow-[#7A1D2E]/25 scale-105'
                  : 'bg-transparent'
              }`}
            >
              <MessageCircle className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[10px] font-semibold mt-0.5">{dict.nav.ask}</span>
          </Link>

          {/* Tab 4: Care / Consult */}
          <Link
            href="/care"
            className={`flex flex-col items-center justify-center transition-all ${
              isCareActive ? 'text-[#7A1D2E]' : 'text-[#9E838A] hover:text-[#523338]'
            }`}
            aria-label="Care and Doctor"
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                isCareActive
                  ? 'bg-[#7A1D2E] text-white shadow-md shadow-[#7A1D2E]/25 scale-105'
                  : 'bg-transparent'
              }`}
            >
              <Stethoscope className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[10px] font-semibold mt-0.5">{dict.nav.care}</span>
          </Link>

          {/* Tab 5: Profile */}
          <Link
            href="/profile"
            className={`flex flex-col items-center justify-center transition-all ${
              isProfileActive ? 'text-[#7A1D2E]' : 'text-[#9E838A] hover:text-[#523338]'
            }`}
            aria-label="Profile and Settings"
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                isProfileActive
                  ? 'bg-[#7A1D2E] text-white shadow-md shadow-[#7A1D2E]/25 scale-105'
                  : 'bg-transparent'
              }`}
            >
              <User className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[10px] font-semibold mt-0.5">{dict.nav.profile}</span>
          </Link>
        </nav>
      </div>

      {/* L1. SPEAK ANYWHERE GLOBAL OVERLAY */}
      {speakOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-3 animate-in fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-4xl p-5 shadow-2xl border border-rose-100 z-10 space-y-4 animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-pink animate-ping" />
                <span className="font-heading text-sm font-bold text-slate-900">
                  Speak Anywhere • Vernacular Voice
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSpeakOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Pulsing mic graphic */}
            <div className="flex flex-col items-center justify-center py-3">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-20 h-20 rounded-full bg-rose-200 animate-ping opacity-60" />
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-pink to-rose-400 text-white flex items-center justify-center shadow-lg relative z-10">
                  <Mic className="w-8 h-8" />
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-500 mt-3">
                {isRecording ? 'Listening (Hinglish / Telugu / Tamil / English)...' : 'Speech recorded'}
              </span>
            </div>

            {/* Live recognized text */}
            <div className="p-3 rounded-2xl bg-rose-50/60 border border-rose-200/80 text-xs text-slate-800 italic">
              "{transcript}"
            </div>

            {/* Extracted editable chips */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-brand-pink" />
                <span>Extracted Items for Today's Log:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {extractedTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 rounded-full bg-white border border-rose-200 px-2.5 py-1 text-xs font-semibold text-brand-pink shadow-xs"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => setExtractedTags(extractedTags.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSavedSuccess(true);
                  setTimeout(() => {
                    setSavedSuccess(false);
                    setSpeakOpen(false);
                  }, 1200);
                }}
                className="flex-1 py-2.5 rounded-2xl bg-brand-pink text-white font-bold text-xs shadow-md shadow-rose-300 hover:bg-brand-pinkDark transition flex items-center justify-center gap-1.5"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Logged to Profile!</span>
                  </>
                ) : (
                  <span>Save to Daily Log</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setSpeakOpen(false)}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-600 font-semibold text-xs hover:bg-slate-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
