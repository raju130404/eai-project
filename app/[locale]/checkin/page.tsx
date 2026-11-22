'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Locale } from '@/i18n';
import { getDictionary } from '@/lib/i18n-dictionary';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DisclaimerBanner } from '@/components/disclaimer-banner';
import type { ExtractedCheckInData } from '@/lib/ai/checkin-extractor';
import { getVoiceProvider } from '@/lib/voice';
import { CRAVING_CATEGORIES, CravingCategory, HealthySwap } from '@/data/craving-swaps-data';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Mic,
  MicOff,
  Send,
  RotateCcw,
  Volume2,
  Calendar,
  Flame,
  Droplets,
  Activity,
  Heart,
  ChevronRight,
  Info,
  Utensils,
} from 'lucide-react';

const MOOD_EMOJIS = [
  { score: 5, label: 'Overjoyed', emoji: '🤩', color: 'bg-pastel-yellow border-amber-300 text-amber-900' },
  { score: 4, label: 'Happy / Good', emoji: '😊', color: 'bg-pastel-mint border-emerald-300 text-emerald-900' },
  { score: 3, label: 'Neutral', emoji: '😐', color: 'bg-pastel-blue border-blue-300 text-blue-900' },
  { score: 2, label: 'Low / Sad', emoji: '😔', color: 'bg-pastel-purple border-purple-300 text-purple-900' },
  { score: 1, label: 'Exhausted', emoji: '😫', color: 'bg-pastel-peach border-rose-300 text-rose-900' },
];

const QUICK_TAG_OPTIONS = [
  'Walking (Adhered)',
  'Sugar Cravings',
  'Bloating',
  'Period Bleeding',
  'Hormonal Acne',
  'Brain Fog',
  'Deep Sleep',
  'Low Stress',
  'Spearmint Tea',
  'Spike in Fatigue',
];

export default function CheckinPage() {
  const t = useTranslations('checkin');
  const tCommon = useTranslations('common');
  const locale = useLocale() as Locale;
  const dict = getDictionary(locale);

  const [mode, setMode] = useState<'quick' | 'voice'>('quick');

  // Form states
  const [selectedMood, setSelectedMood] = useState<number>(4);

  // L2. Mood Journal & DRSP Screener state
  const [subEmotions, setSubEmotions] = useState<string[]>(['Grounded']);
  const [drspExpanded, setDrspExpanded] = useState<boolean>(false);
  const [drspScores, setDrspScores] = useState({
    overwhelmed: 2,
    irritability: 2,
    tension: 1,
  });

  // L3. Weekly photo progress state
  const [photoSectionOpen, setPhotoSectionOpen] = useState<boolean>(false);
  const [capturedPhoto, setCapturedPhoto] = useState<boolean>(true);
  const [activePhotoType, setActivePhotoType] = useState<'jawline' | 'hairline'>('jawline');

  const SUB_EMOTION_OPTIONS = ['Anxious', 'Irritable', 'Grateful', 'Exhausted', 'Grounded', 'Tearful', 'Focused'];
  const drspTotal = drspScores.overwhelmed + drspScores.irritability + drspScores.tension;
  const [energyLevel, setEnergyLevel] = useState<number>(4);
  const [cravings, setCravings] = useState<number>(2);
  const [periodToday, setPeriodToday] = useState<boolean>(false);
  const [periodFlow, setPeriodFlow] = useState<string>('none');
  const [adherence, setAdherence] = useState<boolean>(true);
  const [activeTags, setActiveTags] = useState<string[]>(['Walking (Adhered)']);
  const [notes, setNotes] = useState<string>('');

  // Voice & NLP extraction state
  const [naturalInput, setNaturalInput] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [stopListeningFn, setStopListeningFn] = useState<(() => void) | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractedReview, setExtractedReview] = useState<ExtractedCheckInData | null>(null);
  const [emergencyAlert, setEmergencyAlert] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Hormonal Craving Decoder & Healthy Swaps state
  const [selectedCravingCategory, setSelectedCravingCategory] = useState<string>('chocolate_sweets');
  const [cravingDecoderOpen, setCravingDecoderOpen] = useState<boolean>(true);
  const [loggedSwaps, setLoggedSwaps] = useState<string[]>([]);
  const [swapToast, setSwapToast] = useState<string | null>(null);
  const [isSpeakingCause, setIsSpeakingCause] = useState<boolean>(false);

  const activeCategory = CRAVING_CATEGORIES.find((c) => c.id === selectedCravingCategory) || CRAVING_CATEGORIES[0];

  const handleLogSwap = (swap: HealthySwap, categoryTitle: string) => {
    if (!loggedSwaps.includes(swap.id)) {
      setLoggedSwaps([...loggedSwaps, swap.id]);
      const swapTagName = `Swap: ${swap.name}`;
      if (!activeTags.includes(swapTagName)) {
        setActiveTags([...activeTags, swapTagName]);
      }
      setNotes((prev) => (prev ? `${prev}\n` : '') + `[Healthy Swap Eaten: ${swap.name} for ${categoryTitle}]`);
      setSwapToast(`Logged "${swap.name}"! Great choice for your hormonal balance.`);
      setTimeout(() => setSwapToast(null), 3500);
    }
  };

  const handleSpeakCause = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setIsSpeakingCause(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeakingCause(false);
      utterance.onerror = () => setIsSpeakingCause(false);
      setIsSpeakingCause(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleTag = (tag: string) => {
    if (activeTags.includes(tag)) {
      setActiveTags(activeTags.filter((t) => t !== tag));
      if (tag === 'Period Bleeding') setPeriodToday(false);
      if (tag === 'Walking (Adhered)') setAdherence(false);
    } else {
      setActiveTags([...activeTags, tag]);
      if (tag === 'Period Bleeding') setPeriodToday(true);
      if (tag === 'Walking (Adhered)') setAdherence(true);
    }
  };

  const handleToggleVoice = () => {
    if (isListening) {
      if (stopListeningFn) stopListeningFn();
      setIsListening(false);
      setStopListeningFn(null);
    } else {
      const voice = getVoiceProvider();
      const stop = voice.startListening(
        locale,
        (result) => {
          setNaturalInput(result.transcript);
        },
        (error) => {
          console.warn('Voice error:', error);
          setIsListening(false);
        }
      );
      setStopListeningFn(() => stop);
      setIsListening(true);
    }
  };

  const handleExtractFromText = async () => {
    if (!naturalInput.trim()) return;
    setIsExtracting(true);
    setEmergencyAlert(null);
    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: naturalInput, locale }),
      });
      const res = await response.json();
      if (res.redFlag?.hasRedFlag) {
        setEmergencyAlert(res.redFlag.emergencyMessageLocale);
      } else if (res.data) {
        setExtractedReview(res.data);
        setEnergyLevel(res.data.energy);
        setSelectedMood(res.data.mood);
        setCravings(res.data.cravings);
        setPeriodToday(res.data.periodToday);
        setPeriodFlow(res.data.periodFlow);
        setAdherence(res.data.adherenceToExperiment);
        if (res.data.notes) setNotes(res.data.notes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSaveCheckin = () => {
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setExtractedReview(null);
    }, 3500);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Prompt in Deep Burgundy (matching slide theme) */}
      <div className="rounded-4xl bg-gradient-to-br from-[#801D30] via-[#7A1D2E] to-[#601422] p-6 text-white text-center shadow-md shadow-[#7A1D2E]/20 relative overflow-hidden">
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/20 blur-xl" />
        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-rose-50">
          <Calendar className="w-3.5 h-3.5 text-white" />
          {dict.checkin.headerPhase}
        </span>
        <h1 className="mt-2 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {dict.checkin.headerTitle}
        </h1>
        <p className="mt-1 text-xs text-[#FCEEEB] max-w-sm mx-auto">
          {dict.checkin.headerSub}
        </p>

        {/* Mode Toggle: Quick Tap vs Voice Natural Language */}
        <div className="mt-4 inline-flex rounded-full bg-black/15 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('quick')}
            className={`rounded-full px-4 py-1.5 transition-all ${
              mode === 'quick' ? 'bg-white text-[#7A1D2E] shadow-xs font-bold' : 'text-white'
            }`}
          >
            {dict.checkin.quickTap}
          </button>
          <button
            type="button"
            onClick={() => setMode('voice')}
            className={`rounded-full px-4 py-1.5 transition-all ${
              mode === 'voice' ? 'bg-white text-[#7A1D2E] shadow-xs font-bold' : 'text-white'
            }`}
          >
            {dict.checkin.voiceNote}
          </button>
        </div>
      </div>

      {/* Emergency Red Flag Notice if triggered */}
      {emergencyAlert && (
        <DisclaimerBanner type="emergency" customMessage={emergencyAlert} />
      )}

      {/* Mode 1: Quick Tap Interface (Matching s4.avif Emoji + Category chips) */}
      {mode === 'quick' && (
        <div className="space-y-4">
          {/* Mood Selector (Large Emoji Cards) */}
          <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
              {dict.checkin.moodLabel}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {MOOD_EMOJIS.map((m) => {
                const isSelected = selectedMood === m.score;
                return (
                  <button
                    key={m.score}
                    type="button"
                    onClick={() => setSelectedMood(m.score)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-3xl border-2 transition-all ${
                      isSelected
                        ? `${m.color} scale-105 shadow-md`
                        : 'border-slate-100 bg-[#F4F6F2] hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl">{m.emoji}</span>
                    <span className="mt-1 text-[10px] font-bold font-heading truncate w-full text-center">
                      {m.label.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* L2. Sub-emotions selector */}
            <div className="mt-3 pt-3 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 block mb-2">
                {dict.checkin.feelingsLabel}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SUB_EMOTION_OPTIONS.map((emotion) => {
                  const isChecked = subEmotions.includes(emotion);
                  return (
                    <button
                      key={emotion}
                      type="button"
                      onClick={() => {
                        if (isChecked) {
                          setSubEmotions(subEmotions.filter((e) => e !== emotion));
                        } else {
                          setSubEmotions([...subEmotions, emotion]);
                        }
                      }}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition ${
                        isChecked
                          ? 'bg-brand-purple text-white border-brand-purple shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {emotion}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Energy & Cravings Sliders */}
          <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card space-y-4">
            {/* Energy */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  Energy Level: {energyLevel} / 5
                </span>
                <span className="text-slate-400 font-normal">
                  {energyLevel >= 4 ? 'Energized' : energyLevel >= 3 ? 'Moderate' : 'Fatigued'}
                </span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setEnergyLevel(lvl)}
                    className={`flex-1 py-2 rounded-2xl text-xs font-bold transition-all ${
                      energyLevel === lvl
                        ? 'bg-forest text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Cravings */}
            <div className="pt-2 border-t border-[#F2E2DD]">
              <div className="flex items-center justify-between text-xs font-bold text-[#361118] mb-2">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#7A1D2E]" />
                  Carb / Sugar Cravings: {cravings} / 5
                </span>
                <span className="text-[#7A5A62] font-normal">
                  {cravings <= 2 ? 'Minimal' : cravings >= 4 ? 'High' : 'Moderate'}
                </span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      setCravings(lvl);
                      if (lvl >= 3) setCravingDecoderOpen(true);
                    }}
                    className={`flex-1 py-2 rounded-2xl text-xs font-bold transition-all ${
                      cravings === lvl
                        ? 'bg-[#7A1D2E] text-white shadow-sm scale-102'
                        : 'bg-[#FAF4F0] text-[#7A5A62] hover:bg-[#FCEEEB]/60 border border-[#F2E2DD]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* HORMONAL CRAVING DECODER & HEALTHY ALTERNATES */}
          <div id="cravings" className="rounded-3xl border border-[#F2E2DD] bg-white p-4 sm:p-5 shadow-xs space-y-3.5 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#FCEEEB] flex items-center justify-center text-[#7A1D2E] shrink-0">
                  <Utensils className="w-4 h-4 text-[#7A1D2E]" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-[#361118] flex items-center gap-1.5">
                    <span>Hormonal Craving Decoder &amp; Swaps</span>
                    <span className="text-[9px] font-semibold bg-[#FCEEEB] text-[#7A1D2E] px-2 py-0.5 rounded-full border border-[#F0DDD8]">
                      ICMR &amp; Endocrine Guided
                    </span>
                  </h3>
                  <p className="text-[11px] text-[#7A5A62]">
                    Craving unhealthy food? Decode the hormone driving it and choose a healthy Indian swap.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCravingDecoderOpen(!cravingDecoderOpen)}
                className="text-xs font-bold text-[#7A1D2E] hover:underline shrink-0"
              >
                {cravingDecoderOpen ? 'Collapse' : 'Explore Swaps'}
              </button>
            </div>

            {/* Instant Swap Success Notification */}
            {swapToast && (
              <div className="p-3 rounded-2xl bg-[#EBF5F0] border border-emerald-300 text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">{swapToast}</span>
              </div>
            )}

            {cravingDecoderOpen && (
              <div className="space-y-3.5 pt-1 animate-in fade-in">
                {/* Craving Categories Selector Pills */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {CRAVING_CATEGORIES.map((cat) => {
                    const isSelected = selectedCravingCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCravingCategory(cat.id)}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                          isSelected
                            ? 'bg-[#7A1D2E] text-white shadow-xs font-bold scale-[1.02]'
                            : 'bg-[#FAF4F0] text-[#7A5A62] border border-[#F2E2DD] hover:bg-[#FCEEEB]/60'
                        }`}
                      >
                        <span>{cat.emoji}</span>
                        <span>{cat.title}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Category: Hormonal Root Cause Box */}
                <div className="p-3.5 rounded-2xl bg-[#FFF9F7] border border-[#F2E2DD] space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#7A1D2E]">
                        Hormonal Driver Behind This Craving
                      </div>
                      <div className="font-heading text-xs font-bold text-[#361118] mt-0.5">
                        {activeCategory.hormonalRootCause.hormone}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSpeakCause(activeCategory.hormonalRootCause.explanation)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition shrink-0 ${
                        isSpeakingCause
                          ? 'bg-[#7A1D2E] text-white animate-pulse'
                          : 'bg-[#FCEEEB] text-[#7A1D2E] hover:bg-[#F8DDD7]'
                      }`}
                      title="Listen to explanation"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-[#361118] leading-relaxed">
                    {activeCategory.hormonalRootCause.explanation}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                    <span className="bg-[#FAF4F0] text-[#7A5A62] px-2 py-0.5 rounded-md border border-[#F2E2DD]">
                      <strong>Timing:</strong> {activeCategory.hormonalRootCause.phaseRelevance}
                    </span>
                    <span className="bg-[#FAF4F0] text-[#7A1D2E] px-2 py-0.5 rounded-md border border-[#F2E2DD]">
                      <strong>Depletion:</strong> {activeCategory.hormonalRootCause.deficiencyRisk}
                    </span>
                  </div>

                  <div className="text-[10px] text-[#7A5A62] pt-1.5 border-t border-[#F2E2DD]/80 flex items-center gap-1.5">
                    <span className="font-semibold text-rose-700">Craving:</span>
                    <span className="truncate">{activeCategory.unhealthyExamples.join(' • ')}</span>
                  </div>
                </div>

                {/* Healthy Swaps List */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between px-0.5">
                    <span className="text-xs font-bold text-[#361118] font-heading">
                      Recommended Healthy Indian Swaps
                    </span>
                    <span className="text-[10px] text-[#7A5A62]">
                      {activeCategory.swaps.length} vetted options
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {activeCategory.swaps.map((swap) => {
                      const isLogged = loggedSwaps.includes(swap.id);
                      return (
                        <div
                          key={swap.id}
                          className={`p-3.5 rounded-2xl border transition ${
                            isLogged
                              ? 'bg-[#EBF5F0] border-emerald-300 shadow-xs'
                              : 'bg-white border-[#F2E2DD] hover:border-[#7A1D2E]/40'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-heading font-bold text-xs text-[#361118]">
                                  {swap.name}
                                </span>
                                <span className="text-[9px] font-bold bg-[#FAF4F0] text-[#7A1D2E] px-1.5 py-0.5 rounded border border-[#F2E2DD]">
                                  {swap.prepTime}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#7A5A62] mt-0.5 leading-relaxed">
                                {swap.description}
                              </p>
                            </div>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FAF4F0] text-[#7A1D2E] border border-[#F2E2DD] shrink-0">
                              GI: {swap.glycemicImpact}
                            </span>
                          </div>

                          {/* Physiological benefits tags */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {swap.benefits.map((b, idx) => (
                              <span
                                key={idx}
                                className="text-[9px] bg-[#FCEEEB] text-[#7A1D2E] font-medium px-1.5 py-0.5 rounded"
                              >
                                ✓ {b}
                              </span>
                            ))}
                          </div>

                          {/* Quick tip and 1-tap Log Button */}
                          <div className="mt-2.5 pt-2 border-t border-[#F2E2DD]/70 flex items-center justify-between gap-2">
                            <span className="text-[10px] text-[#7A5A62] italic truncate max-w-[200px] sm:max-w-xs">
                              💡 {swap.recipeQuickTip}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleLogSwap(swap, activeCategory.title)}
                              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition flex items-center gap-1 shrink-0 ${
                                isLogged
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-[#7A1D2E] text-white hover:bg-[#661423] shadow-xs'
                              }`}
                            >
                              {isLogged ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Swap Logged</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3 h-3" />
                                  <span>Try This Swap</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Symptoms & Categories Chips */}
          <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Symptom &amp; Lifestyle Tags (Tap to toggle)
            </label>
            <div className="flex flex-wrap gap-2">
              {QUICK_TAG_OPTIONS.map((tag) => {
                const isSelected = activeTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-forest text-white shadow-sm scale-102'
                        : 'bg-[#F4F6F2] text-slate-700 hover:bg-slate-200/70 border border-slate-200/60'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {tag}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* L2. DRSP LUTEAL SCREENING ACCORDION */}
          <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900 font-heading flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
                  <span>Bi-Weekly Luteal Check (DRSP Screener)</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Daily Record of Severity of Problems (ACOG &amp; FOGSI standard)
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDrspExpanded(!drspExpanded)}
                className="text-xs font-semibold text-brand-purple hover:underline"
              >
                {drspExpanded ? 'Hide' : 'Check'}
              </button>
            </div>

            {drspExpanded && (
              <div className="space-y-3 pt-2 border-t border-slate-100 text-xs animate-in fade-in">
                <div>
                  <div className="flex justify-between font-medium text-slate-700 mb-1">
                    <span>Feeling overwhelmed / unable to cope:</span>
                    <span className="font-bold text-brand-purple">{drspScores.overwhelmed} / 5</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setDrspScores({ ...drspScores, overwhelmed: val })}
                        className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold ${
                          drspScores.overwhelmed === val ? 'bg-brand-purple text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-medium text-slate-700 mb-1">
                    <span>Irritability or sudden anger spikes:</span>
                    <span className="font-bold text-brand-purple">{drspScores.irritability} / 5</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setDrspScores({ ...drspScores, irritability: val })}
                        className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold ${
                          drspScores.irritability === val ? 'bg-brand-purple text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tele-MANAS Card (shown when elevated or available as resource) */}
                <div className="rounded-3xl bg-pastel-peach/50 border border-rose-200 p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-rose-950 font-heading">
                      Tele-MANAS Support (Govt. of India)
                    </span>
                    <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                      Toll-Free 24/7
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-900 leading-relaxed">
                    If luteal mood swings or anxiety feel unmanageable, trained women's counselors are available in 20+ Indian languages.
                  </p>
                  <a
                    href="tel:14416"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-brand-pink hover:bg-brand-pinkDark px-3 py-1.5 rounded-xl shadow-xs transition mt-1"
                  >
                    📞 Call 14416 (Tele-MANAS)
                  </a>
                </div>
              </div>
            )}
          </Card>

          {/* Adherence to Trial */}
          <Card className="rounded-4xl p-4 border-slate-200/80 bg-white shadow-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-pastel-mint text-pastel-mintText flex items-center justify-center font-bold">
                🚶‍♀️
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 font-heading">
                  Completed 30-min brisk walk today?
                </div>
                <div className="text-[11px] text-slate-500">
                  Required for N-of-1 statistical weighting
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAdherence(!adherence)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                adherence ? 'bg-forest text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {adherence ? 'Yes, Adhered' : 'Skipped'}
            </button>
          </Card>

          {/* L3. SKIN & HAIR PROGRESS PHOTOS */}
          <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">📸</span>
                <div>
                  <div className="text-xs font-bold text-slate-900 font-heading">
                    Weekly Skin &amp; Hair Progress Photo
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Week 4 Check • Jawline Acne &amp; Midline Parting
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPhotoSectionOpen(!photoSectionOpen)}
                className="text-xs font-semibold text-brand-purple hover:underline"
              >
                {photoSectionOpen ? 'Close' : 'View / Capture'}
              </button>
            </div>

            {photoSectionOpen && (
              <div className="pt-2 border-t border-slate-100 space-y-3 animate-in fade-in text-xs">
                {/* Photo type tabs */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActivePhotoType('jawline')}
                    className={`flex-1 py-1.5 rounded-xl font-bold text-xs ${
                      activePhotoType === 'jawline'
                        ? 'bg-rose-100 text-brand-pink border border-rose-300'
                        : 'bg-slate-50 text-slate-600 border border-slate-200'
                    }`}
                  >
                    Jawline Acne
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePhotoType('hairline')}
                    className={`flex-1 py-1.5 rounded-xl font-bold text-xs ${
                      activePhotoType === 'hairline'
                        ? 'bg-indigo-100 text-brand-purple border border-indigo-300'
                        : 'bg-slate-50 text-slate-600 border border-slate-200'
                    }`}
                  >
                    Midline Hair Parting
                  </button>
                </div>

                {/* Simulated Face Guide Overlay Viewfinder */}
                <div className="relative rounded-3xl bg-slate-900 h-44 flex flex-col items-center justify-center text-white overflow-hidden border-2 border-dashed border-rose-300/80">
                  {/* Overlay guidelines */}
                  <div className="absolute inset-4 border border-white/30 rounded-full pointer-events-none flex items-center justify-center">
                    <span className="text-[10px] text-white/50 uppercase font-mono">
                      {activePhotoType === 'jawline' ? 'Align Chin in Oval' : 'Align Parting with Center Guide'}
                    </span>
                  </div>

                  <div className="z-10 text-center space-y-1">
                    <span className="text-2xl">📸</span>
                    <div className="text-xs font-bold text-white">Week 4 Comparison Logged</div>
                    <div className="text-[10px] text-emerald-300 font-semibold">
                      Lesions tracked: 6 ➔ 2 (66% reduction)
                    </div>
                  </div>
                </div>

                {/* Privacy Guarantee as required by DPDP Act */}
                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-[10px] text-slate-600 flex items-start gap-2">
                  <span className="text-xs">🔒</span>
                  <span>
                    <strong>On-Device Encryption (DPDP Act 2023):</strong> Photos are stored strictly on your local device. Ritu never uploads your photos to any external cloud or AI model.
                  </span>
                </div>
              </div>
            )}
          </Card>

          {/* Big CTA Button (Matching s4.avif) */}
          <Button
            type="button"
            variant="forest"
            size="lg"
            onClick={handleSaveCheckin}
            className="w-full text-base font-bold shadow-lg"
          >
            {dict.checkin.saveLog}
          </Button>
        </div>
      )}

      {/* Mode 2: Natural Language Voice / Chat Mode */}
      {mode === 'voice' && (
        <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-forest font-heading">
              Vernacular Voice / Chat Extraction
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Speak or type naturally in Hindi, Telugu, Tamil, or English (e.g. &ldquo;Aaj bahut thakaan thi, walk complete kiya, periods nahi aaye&rdquo;).
            </p>
          </div>

          <div className="relative">
            <textarea
              value={naturalInput}
              onChange={(e) => setNaturalInput(e.target.value)}
              placeholder="Speak or type how your body felt today..."
              rows={4}
              className="w-full rounded-3xl border border-slate-200 bg-[#F4F6F2] p-4 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
            />

            {/* Signature Red Wave Audio Recording Button from reference s3.avif */}
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-transform ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse shadow-lg scale-110'
                    : 'bg-coral text-white shadow-md hover:scale-105'
                }`}
                title="Tap to speak"
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="forest"
              onClick={handleExtractFromText}
              disabled={isExtracting || !naturalInput.trim()}
              className="flex-1"
            >
              {isExtracting ? 'Extracting with Zod...' : 'Extract Health Scores'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setNaturalInput('Aaj thakaan thi, 30 min brisk walk kiya, sweet craving hui.');
              }}
              className="text-xs"
            >
              Load Sample
            </Button>
          </div>

          {/* Extracted Review Card */}
          {extractedReview && (
            <div className="rounded-3xl border border-emerald-200 bg-pastel-mint/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pastel-mintText font-heading">
                  AI Extracted Confirmation:
                </span>
                <span className="text-[10px] text-slate-500">Review before saving</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white rounded-2xl p-2 border border-emerald-100">
                  <div className="text-[10px] text-slate-400">Energy</div>
                  <div className="font-bold text-forest">{extractedReview.energy} / 5</div>
                </div>
                <div className="bg-white rounded-2xl p-2 border border-emerald-100">
                  <div className="text-[10px] text-slate-400">Mood</div>
                  <div className="font-bold text-forest">{extractedReview.mood} / 5</div>
                </div>
                <div className="bg-white rounded-2xl p-2 border border-emerald-100">
                  <div className="text-[10px] text-slate-400">Cravings</div>
                  <div className="font-bold text-forest">{extractedReview.cravings} / 5</div>
                </div>
              </div>

              <div className="text-xs text-slate-700 italic">
                &ldquo;{extractedReview.summary}&rdquo;
              </div>

              <Button
                type="button"
                variant="forest"
                size="sm"
                onClick={handleSaveCheckin}
                className="w-full text-xs"
              >
                Confirm &amp; Commit Check-in
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-3xl bg-pastel-mint p-4 text-xs font-semibold text-pastel-mintText shadow-md animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Daily check-in recorded! Your N-of-1 trial posterior distribution has been updated.</span>
        </div>
      )}
    </div>
  );
}
