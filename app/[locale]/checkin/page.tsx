'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Locale } from '@/i18n';
import { getDictionary } from '@/lib/i18n-dictionary';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DisclaimerBanner } from '@/components/disclaimer-banner';
import type { ExtractedCheckInData } from '@/lib/ai/checkin-extractor';
import { getVoiceProvider } from '@/lib/voice';
import { EAT_HEALTHY_FOODS, UnhealthyFoodItem, HealthyVariant } from '@/data/eat-healthy-data';
import { INDB_FOOD_ITEMS } from '@/data/indb-seed';
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
  Search,
  Plus,
  Trash2,
  Clock,
  Apple,
  Camera,
  X,
} from 'lucide-react';

const MOOD_EMOJIS = [
  { score: 5, label: 'Overjoyed', emoji: '🤩', color: 'bg-[#FDF4DE] border-amber-300 text-amber-900' },
  { score: 4, label: 'Happy / Good', emoji: '😊', color: 'bg-[#EBF5F0] border-emerald-300 text-emerald-900' },
  { score: 3, label: 'Neutral', emoji: '😐', color: 'bg-[#F4EFEA] border-stone-300 text-stone-800' },
  { score: 2, label: 'Low / Sad', emoji: '😔', color: 'bg-[#FCEEEB] border-[#F2E2DD] text-[#7A1D2E]' },
  { score: 1, label: 'Exhausted', emoji: '😫', color: 'bg-[#FCEEEB] border-[#7A1D2E] text-[#7A1D2E]' },
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

interface LoggedMealItem {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  dish: string;
  calories: number;
  carbs: number;
  protein: number;
  fiber: number;
  pcosScore: number;
  time: string;
  variantType?: string;
}

export default function CheckinPage() {
  const t = useTranslations('checkin');
  const tCommon = useTranslations('common');
  const locale = useLocale() as Locale;
  const dict = getDictionary(locale);

  // Top Section Selector: 'vitals' (Daily Check-in) | 'food' (Meals Log) | 'eatHealthy' (Craving & Healthy Swaps)
  const [activeSection, setActiveSection] = useState<'vitals' | 'food' | 'eatHealthy'>('vitals');
  const [mode, setMode] = useState<'quick' | 'voice'>('quick');

  // Form states (Vitals)
  const [selectedMood, setSelectedMood] = useState<number>(4);
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
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // -------------------------------------------------------------
  // FOOD LOGGING STATE
  // -------------------------------------------------------------
  const [loggedMeals, setLoggedMeals] = useState<LoggedMealItem[]>([
    {
      id: 'm1',
      mealType: 'breakfast',
      dish: 'Besan Chilla (2 pieces) with Mint Chutney',
      calories: 220,
      carbs: 26,
      protein: 11,
      fiber: 6.5,
      pcosScore: 9.0,
      time: '08:30 AM',
    },
    {
      id: 'm2',
      mealType: 'lunch',
      dish: 'Foxtail Millet (Kangni) + Moong Dal + Palak Paneer',
      calories: 420,
      carbs: 45,
      protein: 18.5,
      fiber: 10.2,
      pcosScore: 9.2,
      time: '01:15 PM',
    },
  ]);
  const [activeMealType, setActiveMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('snack');
  const [customMealInput, setCustomMealInput] = useState<string>('');
  const [mealSuccessToast, setMealSuccessToast] = useState<string | null>(null);

  // -------------------------------------------------------------
  // EAT HEALTHY STATE (Search Unhealthy Food -> Low Sugar, Low Calorie, Low Carb Alternates)
  // -------------------------------------------------------------
  const [eatHealthySearch, setEatHealthySearch] = useState<string>('');
  const [selectedEatHealthyFood, setSelectedEatHealthyFood] = useState<UnhealthyFoodItem>(EAT_HEALTHY_FOODS[0]);
  const [selectedVariantType, setSelectedVariantType] = useState<'all' | 'lowSugar' | 'lowCalorie' | 'lowCarb'>('all');
  const [speakingWhy, setIsSpeakingWhy] = useState<boolean>(false);

  // Filtered unhealthy foods based on search query
  const filteredUnhealthyFoods = EAT_HEALTHY_FOODS.filter((item) => {
    if (!eatHealthySearch.trim()) return true;
    const q = eatHealthySearch.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.aliases.some((a) => a.toLowerCase().includes(q))
    );
  });

  // Calculate today's logged nutrition totals
  const totalCalories = loggedMeals.reduce((sum, m) => sum + m.calories, 0);
  const totalCarbs = loggedMeals.reduce((sum, m) => sum + m.carbs, 0);
  const totalProtein = loggedMeals.reduce((sum, m) => sum + m.protein, 0);
  const totalFiber = loggedMeals.reduce((sum, m) => sum + m.fiber, 0);

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
    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: naturalInput, locale }),
      });
      if (response.ok) {
        const data: ExtractedCheckInData = await response.json();
        setExtractedReview(data);
        if (data.energy) setEnergyLevel(data.energy);
        if (data.cravings) setCravings(data.cravings);
        if (data.periodToday) setPeriodToday(true);
        if (data.notes) setNotes(data.notes);
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

  // Add a manual or quick meal to food log
  const handleAddMeal = (dishName: string, calories: number = 200, carbs: number = 22, protein: number = 10, fiber: number = 5) => {
    if (!dishName.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMeal: LoggedMealItem = {
      id: `m_${Date.now()}`,
      mealType: activeMealType,
      dish: dishName.trim(),
      calories,
      carbs,
      protein,
      fiber,
      pcosScore: 8.8,
      time: timeStr,
    };
    setLoggedMeals([newMeal, ...loggedMeals]);
    setCustomMealInput('');
    setMealSuccessToast(`Logged "${dishName}" to your ${activeMealType}!`);
    setTimeout(() => setMealSuccessToast(null), 3000);
  };

  // Delete logged meal
  const handleDeleteMeal = (id: string) => {
    setLoggedMeals(loggedMeals.filter((m) => m.id !== id));
  };

  // Add healthy swap from "Eat Healthy" directly into the food log
  const handleAddHealthySwapToFoodLog = (variant: HealthyVariant, originFoodName: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const numericCarbs = parseFloat(variant.carbs) || 12;
    const numericProtein = parseFloat(variant.protein) || 10;
    const numericFiber = parseFloat(variant.fiber) || 5;

    const newMeal: LoggedMealItem = {
      id: `swap_${Date.now()}`,
      mealType: activeMealType,
      dish: `${variant.title} (Healthy swap for ${originFoodName})`,
      calories: variant.calories,
      carbs: numericCarbs,
      protein: numericProtein,
      fiber: numericFiber,
      pcosScore: 9.5,
      time: timeStr,
      variantType: variant.type,
    };

    setLoggedMeals([newMeal, ...loggedMeals]);
    setMealSuccessToast(`Added healthy swap "${variant.title}" to your Food Log!`);
    setTimeout(() => setMealSuccessToast(null), 3500);
  };

  const handleSpeakWhy = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setIsSpeakingWhy(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeakingWhy(false);
      utterance.onerror = () => setIsSpeakingWhy(false);
      setIsSpeakingWhy(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-24 pt-1">
      {/* 1. Header Prompt in Deep Burgundy */}
      <div className="rounded-4xl bg-gradient-to-br from-[#801D30] via-[#7A1D2E] to-[#601422] p-5 sm:p-6 text-white text-center shadow-md shadow-[#7A1D2E]/20 relative overflow-hidden">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-rose-50">
          <Calendar className="w-3.5 h-3.5 text-white" />
          {dict.checkin.headerPhase}
        </span>
        <h1 className="mt-2 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {dict.checkin.headerTitle}
        </h1>
        <p className="mt-1 text-xs text-[#FCEEEB] max-w-sm mx-auto">
          Log daily vitals, track your nutrition, and explore healthy swaps for unhealthy cravings.
        </p>

        {/* 3 Main Sections: Daily Vitals · Food Log · Eat Healthy */}
        <div className="mt-4 flex flex-wrap justify-center gap-1.5 p-1 bg-black/20 rounded-2xl max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setActiveSection('vitals')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSection === 'vitals'
                ? 'bg-white text-[#7A1D2E] shadow-xs'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Daily Vitals</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('food')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSection === 'food'
                ? 'bg-white text-[#7A1D2E] shadow-xs'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Food Log</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('eatHealthy')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSection === 'eatHealthy'
                ? 'bg-white text-[#7A1D2E] shadow-xs'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Eat Healthy</span>
          </button>
        </div>
      </div>

      {/* Global Success Notification */}
      {mealSuccessToast && (
        <div className="p-3.5 rounded-2xl bg-[#EBF5F0] border border-emerald-300 text-xs text-emerald-900 font-medium flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{mealSuccessToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setActiveSection('food')}
            className="text-[11px] font-bold text-emerald-800 underline ml-2 shrink-0"
          >
            View Food Log &gt;
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 1: EAT HEALTHY (Search Unhealthy Foods -> Low Sugar/Calorie/Carb) */}
      {/* ========================================================================= */}
      {activeSection === 'eatHealthy' && (
        <div className="space-y-4 animate-in fade-in">
          <Card className="rounded-4xl p-5 border-[#F2E2DD] bg-white shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FCEEEB] flex items-center justify-center text-xl shrink-0">
                  🥗
                </div>
                <div>
                  <h2 className="font-heading text-base font-bold text-[#361118] flex items-center gap-1.5">
                    <span>Eat Healthy</span>
                    <span className="text-[10px] font-semibold bg-[#FCEEEB] text-[#7A1D2E] px-2 py-0.5 rounded-full border border-[#F0DDD8]">
                      Smart Alternates
                    </span>
                  </h2>
                  <p className="text-xs text-[#7A5A62]">
                    Craving something unhealthy like pizza or ice cream? Get low sugar, low calorie, and low carb alternatives.
                  </p>
                </div>
              </div>
            </div>

            {/* Search Input for Any Unhealthy Food or Craving */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A5A62]" />
              <input
                type="text"
                value={eatHealthySearch}
                onChange={(e) => setEatHealthySearch(e.target.value)}
                placeholder="Search food or craving (e.g. Pizza, Ice cream, Samosa, Burger, Biryani...)"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#F2E2DD] bg-[#FAF4F0] text-xs text-[#361118] placeholder:text-[#7A5A62]/70 focus:border-[#7A1D2E] focus:outline-none"
              />
              {eatHealthySearch && (
                <button
                  type="button"
                  onClick={() => setEatHealthySearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Popular Unhealthy Food Quick-Select Chips */}
            <div>
              <div className="text-[11px] font-bold text-[#7A5A62] mb-1.5">
                Popular unhealthy cravings (tap to view alternatives):
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {EAT_HEALTHY_FOODS.map((item) => {
                  const isSelected = selectedEatHealthyFood.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedEatHealthyFood(item);
                        setEatHealthySearch('');
                      }}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                        isSelected
                          ? 'bg-[#7A1D2E] text-white shadow-xs font-bold scale-[1.02]'
                          : 'bg-[#FAF4F0] text-[#7A5A62] border border-[#F2E2DD] hover:bg-[#FCEEEB]/60'
                      }`}
                    >
                      <span>{item.emoji}</span>
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Unhealthy Food Warning & Macro Breakdown */}
            <div className="p-3.5 rounded-2xl bg-[#FAF4F0] border border-[#F2E2DD] space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedEatHealthyFood.emoji}</span>
                  <div>
                    <span className="font-heading font-bold text-sm text-[#361118]">
                      {selectedEatHealthyFood.name}
                    </span>
                    <span className="text-[10px] text-[#7A5A62] ml-2">
                      ({selectedEatHealthyFood.unhealthyProfile.serving})
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSpeakWhy(selectedEatHealthyFood.unhealthyProfile.harmReason)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition shrink-0 ${
                    speakingWhy
                      ? 'bg-[#7A1D2E] text-white animate-pulse'
                      : 'bg-[#FCEEEB] text-[#7A1D2E] hover:bg-[#F8DDD7]'
                  }`}
                  title="Listen to why this impacts hormones"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Unhealthy Stats Grid */}
              <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                <div className="bg-white p-1.5 rounded-xl border border-[#F2E2DD]">
                  <div className="text-[9px] text-[#7A5A62]">Calories</div>
                  <div className="font-bold text-rose-700">{selectedEatHealthyFood.unhealthyProfile.calories}</div>
                </div>
                <div className="bg-white p-1.5 rounded-xl border border-[#F2E2DD]">
                  <div className="text-[9px] text-[#7A5A62]">Carbs</div>
                  <div className="font-bold text-rose-700">{selectedEatHealthyFood.unhealthyProfile.carbs}g</div>
                </div>
                <div className="bg-white p-1.5 rounded-xl border border-[#F2E2DD]">
                  <div className="text-[9px] text-[#7A5A62]">Sugar</div>
                  <div className="font-bold text-rose-700">{selectedEatHealthyFood.unhealthyProfile.sugar}g</div>
                </div>
                <div className="bg-white p-1.5 rounded-xl border border-[#F2E2DD]">
                  <div className="text-[9px] text-[#7A5A62]">Glycemic Idx</div>
                  <div className="font-bold text-rose-700">{selectedEatHealthyFood.unhealthyProfile.glycemicIndex} (High)</div>
                </div>
              </div>

              <p className="text-[11px] text-[#361118] leading-relaxed pt-1">
                <strong>Why to avoid:</strong> {selectedEatHealthyFood.unhealthyProfile.harmReason}
              </p>
            </div>

            {/* Healthier Alternatives Header & Filter */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <div className="font-heading font-bold text-xs text-[#361118] uppercase tracking-wider">
                  Healthier Alternatives for {selectedEatHealthyFood.name}
                </div>
                <div className="flex gap-1">
                  {(['all', 'lowSugar', 'lowCalorie', 'lowCarb'] as const).map((filterKey) => (
                    <button
                      key={filterKey}
                      type="button"
                      onClick={() => setSelectedEatHealthyFood(selectedEatHealthyFood)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition ${
                        selectedVariantType === filterKey
                          ? 'bg-[#7A1D2E] text-white'
                          : 'bg-[#FAF4F0] text-[#7A5A62] hover:bg-[#FCEEEB]'
                      }`}
                    >
                      {filterKey === 'all'
                        ? 'All'
                        : filterKey === 'lowSugar'
                        ? 'Low Sugar'
                        : filterKey === 'lowCalorie'
                        ? 'Low Calorie'
                        : 'Low Carb'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3 Detailed Alternative Cards: Low Sugar · Low Calorie · Low Carb */}
              <div className="grid grid-cols-1 gap-3">
                {/* 1. LOW SUGAR VERSION */}
                <div className="p-4 rounded-3xl border border-emerald-200 bg-[#EBF5F0]/70 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                        Low Sugar Alternative
                      </span>
                      <h4 className="font-heading font-bold text-sm text-[#361118] mt-1">
                        {selectedEatHealthyFood.lowSugarVariant.title}
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                      GI: {selectedEatHealthyFood.lowSugarVariant.glycemicIndex} (Very Low)
                    </span>
                  </div>

                  <p className="text-xs text-[#361118] leading-relaxed">
                    {selectedEatHealthyFood.lowSugarVariant.description}
                  </p>

                  <div className="grid grid-cols-4 gap-1.5 text-center text-xs py-1">
                    <div className="bg-white/90 p-1.5 rounded-xl border border-emerald-100">
                      <div className="text-[9px] text-slate-500">Calories</div>
                      <div className="font-bold text-emerald-800">{selectedEatHealthyFood.lowSugarVariant.calories}</div>
                    </div>
                    <div className="bg-white/90 p-1.5 rounded-xl border border-emerald-100">
                      <div className="text-[9px] text-slate-500">Sugar</div>
                      <div className="font-bold text-emerald-800">{selectedEatHealthyFood.lowSugarVariant.sugar}</div>
                    </div>
                    <div className="bg-white/90 p-1.5 rounded-xl border border-emerald-100">
                      <div className="text-[9px] text-slate-500">Protein</div>
                      <div className="font-bold text-emerald-800">{selectedEatHealthyFood.lowSugarVariant.protein}</div>
                    </div>
                    <div className="bg-white/90 p-1.5 rounded-xl border border-emerald-100">
                      <div className="text-[9px] text-slate-500">Fiber</div>
                      <div className="font-bold text-emerald-800">{selectedEatHealthyFood.lowSugarVariant.fiber}</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#7A5A62] italic">
                    💡 <strong>Quick Recipe:</strong> {selectedEatHealthyFood.lowSugarVariant.quickRecipe}
                  </div>

                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleAddHealthySwapToFoodLog(selectedEatHealthyFood.lowSugarVariant, selectedEatHealthyFood.name)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Food Log</span>
                    </button>
                  </div>
                </div>

                {/* 2. LOW CALORIE VERSION */}
                <div className="p-4 rounded-3xl border border-sky-200 bg-[#F4EFEA]/80 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200">
                        Low Calorie Alternative
                      </span>
                      <h4 className="font-heading font-bold text-sm text-[#361118] mt-1">
                        {selectedEatHealthyFood.lowCalorieVariant.title}
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold text-amber-900 bg-white px-2 py-0.5 rounded-full border border-amber-200">
                      GI: {selectedEatHealthyFood.lowCalorieVariant.glycemicIndex} (Low)
                    </span>
                  </div>

                  <p className="text-xs text-[#361118] leading-relaxed">
                    {selectedEatHealthyFood.lowCalorieVariant.description}
                  </p>

                  <div className="grid grid-cols-4 gap-1.5 text-center text-xs py-1">
                    <div className="bg-white/90 p-1.5 rounded-xl border border-amber-100">
                      <div className="text-[9px] text-slate-500">Calories</div>
                      <div className="font-bold text-amber-900">{selectedEatHealthyFood.lowCalorieVariant.calories}</div>
                    </div>
                    <div className="bg-white/90 p-1.5 rounded-xl border border-amber-100">
                      <div className="text-[9px] text-slate-500">Carbs</div>
                      <div className="font-bold text-amber-900">{selectedEatHealthyFood.lowCalorieVariant.carbs}</div>
                    </div>
                    <div className="bg-white/90 p-1.5 rounded-xl border border-amber-100">
                      <div className="text-[9px] text-slate-500">Protein</div>
                      <div className="font-bold text-amber-900">{selectedEatHealthyFood.lowCalorieVariant.protein}</div>
                    </div>
                    <div className="bg-white/90 p-1.5 rounded-xl border border-amber-100">
                      <div className="text-[9px] text-slate-500">Fiber</div>
                      <div className="font-bold text-amber-900">{selectedEatHealthyFood.lowCalorieVariant.fiber}</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#7A5A62] italic">
                    💡 <strong>Quick Recipe:</strong> {selectedEatHealthyFood.lowCalorieVariant.quickRecipe}
                  </div>

                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleAddHealthySwapToFoodLog(selectedEatHealthyFood.lowCalorieVariant, selectedEatHealthyFood.name)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#7A1D2E] hover:bg-[#661423] text-white font-bold text-xs flex items-center gap-1 shadow-xs transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Food Log</span>
                    </button>
                  </div>
                </div>

                {/* 3. LOW CARB VERSION */}
                <div className="p-4 rounded-3xl border border-[#F2E2DD] bg-[#FFF9F7] space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider bg-[#FCEEEB] text-[#7A1D2E] px-2 py-0.5 rounded-full border border-[#F0DDD8]">
                        Low Carb / Ketogenic Variant
                      </span>
                      <h4 className="font-heading font-bold text-sm text-[#361118] mt-1">
                        {selectedEatHealthyFood.lowCarbVariant.title}
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold text-[#7A1D2E] bg-white px-2 py-0.5 rounded-full border border-[#F2E2DD]">
                      GI: {selectedEatHealthyFood.lowCarbVariant.glycemicIndex} (Ultra Low)
                    </span>
                  </div>

                  <p className="text-xs text-[#361118] leading-relaxed">
                    {selectedEatHealthyFood.lowCarbVariant.description}
                  </p>

                  <div className="grid grid-cols-4 gap-1.5 text-center text-xs py-1">
                    <div className="bg-white/90 p-1.5 rounded-xl border border-[#F2E2DD]">
                      <div className="text-[9px] text-slate-500">Calories</div>
                      <div className="font-bold text-[#7A1D2E]">{selectedEatHealthyFood.lowCarbVariant.calories}</div>
                    </div>
                    <div className="bg-white/90 p-1.5 rounded-xl border border-[#F2E2DD]">
                      <div className="text-[9px] text-slate-500">Net Carbs</div>
                      <div className="font-bold text-[#7A1D2E]">{selectedEatHealthyFood.lowCarbVariant.carbs}</div>
                    </div>
                    <div className="bg-white/90 p-1.5 rounded-xl border border-[#F2E2DD]">
                      <div className="text-[9px] text-slate-500">Protein</div>
                      <div className="font-bold text-[#7A1D2E]">{selectedEatHealthyFood.lowCarbVariant.protein}</div>
                    </div>
                    <div className="bg-white/90 p-1.5 rounded-xl border border-[#F2E2DD]">
                      <div className="text-[9px] text-slate-500">Fiber</div>
                      <div className="font-bold text-[#7A1D2E]">{selectedEatHealthyFood.lowCarbVariant.fiber}</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#7A5A62] italic">
                    💡 <strong>Quick Recipe:</strong> {selectedEatHealthyFood.lowCarbVariant.quickRecipe}
                  </div>

                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleAddHealthySwapToFoodLog(selectedEatHealthyFood.lowCarbVariant, selectedEatHealthyFood.name)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#7A1D2E] hover:bg-[#661423] text-white font-bold text-xs flex items-center gap-1 shadow-xs transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Food Log</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: FOOD & MEALS LOG (Full Food Logging Restored & Integrated)      */}
      {/* ========================================================================= */}
      {activeSection === 'food' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Daily Nutrition Macro Bar */}
          <Card className="rounded-4xl p-5 border-[#F2E2DD] bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A5A62]">
                  Today&apos;s Nutrition Balance
                </span>
                <div className="font-heading text-lg font-bold text-[#361118]">
                  {totalCalories} kcal Total
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('eatHealthy')}
                className="text-xs font-bold text-[#7A1D2E] hover:underline flex items-center gap-1 bg-[#FCEEEB] px-3 py-1.5 rounded-full border border-[#F0DDD8]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Eat Healthy Swaps &gt;</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
              <div className="p-2 rounded-2xl bg-[#FAF4F0] border border-[#F2E2DD]">
                <div className="text-[10px] text-[#7A5A62]">Carbs</div>
                <div className="font-heading font-bold text-[#361118] text-sm">{totalCarbs}g</div>
                <div className="text-[9px] text-[#7A5A62]">Safe target &lt;120g</div>
              </div>
              <div className="p-2 rounded-2xl bg-[#FAF4F0] border border-[#F2E2DD]">
                <div className="text-[10px] text-[#7A5A62]">Protein</div>
                <div className="font-heading font-bold text-emerald-800 text-sm">{totalProtein}g</div>
                <div className="text-[9px] text-emerald-700 font-semibold">Goal 60g+</div>
              </div>
              <div className="p-2 rounded-2xl bg-[#FAF4F0] border border-[#F2E2DD]">
                <div className="text-[10px] text-[#7A5A62]">Fiber</div>
                <div className="font-heading font-bold text-[#7A1D2E] text-sm">{totalFiber}g</div>
                <div className="text-[9px] text-[#7A1D2E] font-semibold">Optimal &gt;25g</div>
              </div>
            </div>
          </Card>

          {/* Quick Meal Logger Card */}
          <Card className="rounded-4xl p-5 border-[#F2E2DD] bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-heading text-sm font-bold text-[#361118]">
                + Log a Meal or Snack
              </span>
              <div className="flex gap-1">
                {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((mType) => (
                  <button
                    key={mType}
                    type="button"
                    onClick={() => setActiveMealType(mType)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize transition ${
                      activeMealType === mType
                        ? 'bg-[#7A1D2E] text-white shadow-xs'
                        : 'bg-[#FAF4F0] text-[#7A5A62] hover:bg-[#FCEEEB]'
                    }`}
                  >
                    {mType}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={customMealInput}
                onChange={(e) => setCustomMealInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddMeal(customMealInput);
                }}
                placeholder={`What did you have for ${activeMealType}? (e.g. 2 Jowar Rotis, Palak Paneer...)`}
                className="flex-1 rounded-2xl border border-[#F2E2DD] bg-[#FAF4F0] px-4 py-2.5 text-xs text-[#361118] placeholder:text-[#7A5A62]/70 focus:border-[#7A1D2E] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleAddMeal(customMealInput)}
                disabled={!customMealInput.trim()}
                className="px-4 py-2.5 rounded-2xl bg-[#7A1D2E] disabled:opacity-40 text-white font-bold text-xs hover:bg-[#661423] shadow-xs transition"
              >
                Log
              </button>
            </div>

            {/* Quick-Pick Popular Healthy Indian Options */}
            <div>
              <div className="text-[11px] font-bold text-[#7A5A62] mb-1.5">
                Quick-add common healthy Indian dishes:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: 'Besan Chilla with Mint Chutney', c: 220, carbs: 26, p: 11, f: 6.5 },
                  { name: 'Foxtail Millet Khichdi', c: 260, carbs: 36, p: 9, f: 8 },
                  { name: 'Moong Dal Sprouts Salad', c: 140, carbs: 18, p: 10, f: 6 },
                  { name: 'Jeera Chaas (Buttermilk)', c: 45, carbs: 3, p: 4, f: 0.5 },
                  { name: 'Palak Paneer with 2 Jowar Rotis', c: 380, carbs: 34, p: 18, f: 9 },
                  { name: 'Steamed Idli (2) with Sambar', c: 210, carbs: 38, p: 7, f: 5 },
                ].map((dishItem, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddMeal(dishItem.name, dishItem.c, dishItem.carbs, dishItem.p, dishItem.f)}
                    className="text-[11px] font-medium bg-[#FAF4F0] text-[#361118] hover:bg-[#FCEEEB] border border-[#F2E2DD] px-2.5 py-1 rounded-full transition"
                  >
                    + {dishItem.name}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Today's Logged Meals List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-heading text-sm font-bold text-[#361118]">
                Logged Meals Today ({loggedMeals.length})
              </h3>
              <span className="text-xs text-[#7A5A62]">Tap to remove or edit</span>
            </div>

            {loggedMeals.map((meal) => (
              <div
                key={meal.id}
                className="p-3.5 rounded-3xl border border-[#F2E2DD] bg-white shadow-xs flex items-center justify-between gap-3 hover:border-[#7A1D2E]/40 transition"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#FAF4F0] text-[#7A1D2E] px-2 py-0.5 rounded-full border border-[#F2E2DD]">
                      {meal.mealType} • {meal.time}
                    </span>
                    {meal.variantType && (
                      <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        {meal.variantType}
                      </span>
                    )}
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                      PCOS: {meal.pcosScore}/10
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-xs text-[#361118] truncate">
                    {meal.dish}
                  </h4>
                  <div className="text-[11px] text-[#7A5A62]">
                    {meal.calories} kcal • {meal.carbs}g Carbs • {meal.protein}g Protein • {meal.fiber}g Fiber
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteMeal(meal.id)}
                  className="w-7 h-7 rounded-full bg-[#FAF4F0] hover:bg-rose-100 text-[#7A5A62] hover:text-rose-700 flex items-center justify-center shrink-0 transition"
                  title="Remove this meal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: DAILY VITALS & MOOD (Restored Complete Vitals Check-in)       */}
      {/* ========================================================================= */}
      {activeSection === 'vitals' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Quick 1-Tap Mood Selector */}
          <Card className="rounded-4xl p-5 border-[#F2E2DD] bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7A5A62]">
                1. How are you feeling right now?
              </span>
              <span className="text-[10px] text-[#7A1D2E] font-bold">10-Second Check</span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {MOOD_EMOJIS.map((m) => (
                <button
                  key={m.score}
                  type="button"
                  onClick={() => setSelectedMood(m.score)}
                  className={`flex flex-col items-center justify-center rounded-2xl py-2.5 transition-all ${
                    selectedMood === m.score
                      ? 'bg-[#FCEEEB] border-2 border-[#7A1D2E] scale-105 shadow-xs'
                      : 'bg-[#FAF4F0] border border-[#F2E2DD] hover:bg-[#FCEEEB]/60'
                  }`}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="mt-1 text-[10px] font-bold text-[#361118] leading-tight text-center">
                    {m.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Sub-emotions selector */}
            <div className="mt-2 pt-2 border-t border-[#F2E2DD]">
              <span className="text-[11px] font-semibold text-[#7A5A62] block mb-1.5">
                Tag your feelings:
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
                          ? 'bg-[#7A1D2E] text-white border-[#7A1D2E] shadow-xs'
                          : 'bg-[#FAF4F0] text-[#7A5A62] border-[#F2E2DD] hover:bg-[#FCEEEB]'
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
          <Card className="rounded-4xl p-5 border-[#F2E2DD] bg-white shadow-xs space-y-4">
            {/* Energy */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-[#361118] mb-2">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-600" />
                  Energy Level: {energyLevel} / 5
                </span>
                <span className="text-[#7A5A62] font-normal">
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
                        ? 'bg-[#7A1D2E] text-white shadow-xs scale-102'
                        : 'bg-[#FAF4F0] text-[#7A5A62] hover:bg-[#FCEEEB] border border-[#F2E2DD]'
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
                    onClick={() => setCravings(lvl)}
                    className={`flex-1 py-2 rounded-2xl text-xs font-bold transition-all ${
                      cravings === lvl
                        ? 'bg-[#7A1D2E] text-white shadow-xs scale-102'
                        : 'bg-[#FAF4F0] text-[#7A5A62] hover:bg-[#FCEEEB] border border-[#F2E2DD]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Eat Healthy Shortcut Banner if Cravings are High */}
            {cravings >= 3 && (
              <div className="p-3 rounded-2xl bg-[#FFF9F7] border border-[#F2E2DD] flex items-center justify-between gap-2 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🍨</span>
                  <div className="text-xs text-[#361118]">
                    <span className="font-bold">Craving unhealthy food right now?</span>
                    <div className="text-[10px] text-[#7A5A62]">Explore low sugar, low carb Indian alternates</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSection('eatHealthy')}
                  className="px-3 py-1 rounded-xl bg-[#7A1D2E] text-white text-xs font-bold shadow-xs hover:bg-[#661423] transition shrink-0"
                >
                  Eat Healthy &gt;
                </button>
              </div>
            )}
          </Card>

          {/* Quick Symptoms & Categories Chips */}
          <Card className="rounded-4xl p-5 border-[#F2E2DD] bg-white shadow-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-[#7A5A62] block mb-2">
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
                        ? 'bg-[#7A1D2E] text-white shadow-xs scale-102 font-bold'
                        : 'bg-[#FAF4F0] text-[#7A5A62] hover:bg-[#FCEEEB] border border-[#F2E2DD]'
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
          <Card className="rounded-4xl p-5 border-[#F2E2DD] bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#361118] font-heading flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#7A1D2E]" />
                  <span>Bi-Weekly Luteal Check (DRSP Screener)</span>
                </div>
                <div className="text-[11px] text-[#7A5A62]">
                  Daily Record of Severity of Problems (ACOG &amp; FOGSI standard)
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDrspExpanded(!drspExpanded)}
                className="text-xs font-bold text-[#7A1D2E] hover:underline"
              >
                {drspExpanded ? 'Hide' : 'Check'}
              </button>
            </div>

            {drspExpanded && (
              <div className="space-y-3 pt-2 border-t border-[#F2E2DD] text-xs animate-in fade-in">
                <div>
                  <div className="flex justify-between font-medium text-[#361118] mb-1">
                    <span>Feeling overwhelmed / unable to cope:</span>
                    <span className="font-bold text-[#7A1D2E]">{drspScores.overwhelmed} / 5</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setDrspScores({ ...drspScores, overwhelmed: val })}
                        className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold ${
                          drspScores.overwhelmed === val ? 'bg-[#7A1D2E] text-white' : 'bg-[#FAF4F0] text-[#7A5A62]'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-medium text-[#361118] mb-1">
                    <span>Irritability or sudden anger spikes:</span>
                    <span className="font-bold text-[#7A1D2E]">{drspScores.irritability} / 5</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setDrspScores({ ...drspScores, irritability: val })}
                        className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold ${
                          drspScores.irritability === val ? 'bg-[#7A1D2E] text-white' : 'bg-[#FAF4F0] text-[#7A5A62]'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tele-MANAS Card */}
                <div className="rounded-3xl bg-[#FCEEEB] border border-[#F2E2DD] p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#7A1D2E] font-heading">
                      Tele-MANAS Support (Govt. of India)
                    </span>
                    <span className="text-[10px] bg-white text-[#7A1D2E] font-bold px-2 py-0.5 rounded-full border border-[#F2E2DD]">
                      Toll-Free 24/7
                    </span>
                  </div>
                  <p className="text-[11px] text-[#361118] leading-relaxed">
                    If luteal mood swings or anxiety feel unmanageable, trained women&apos;s counselors are available in 20+ Indian languages.
                  </p>
                  <a
                    href="tel:14416"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#7A1D2E] hover:bg-[#661423] px-3 py-1.5 rounded-xl shadow-xs transition mt-1"
                  >
                    📞 Call 14416 (Tele-MANAS)
                  </a>
                </div>
              </div>
            )}
          </Card>

          {/* Adherence to Trial */}
          <Card className="rounded-4xl p-4 border-[#F2E2DD] bg-white shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EBF5F0] text-emerald-800 flex items-center justify-center font-bold">
                🚶‍♀️
              </div>
              <div>
                <div className="text-xs font-bold text-[#361118] font-heading">
                  Completed 30-min brisk walk today?
                </div>
                <div className="text-[11px] text-[#7A5A62]">
                  Required for N-of-1 statistical weighting
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAdherence(!adherence)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                adherence ? 'bg-[#7A1D2E] text-white shadow-xs' : 'bg-[#FAF4F0] text-[#7A5A62]'
              }`}
            >
              {adherence ? 'Yes, Adhered' : 'Skipped'}
            </button>
          </Card>

          {/* L3. SKIN & HAIR PROGRESS PHOTOS */}
          <Card className="rounded-4xl p-5 border-[#F2E2DD] bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">📸</span>
                <div>
                  <div className="text-xs font-bold text-[#361118] font-heading">
                    Weekly Skin &amp; Hair Progress Photo
                  </div>
                  <div className="text-[10px] text-[#7A5A62]">
                    Week 4 Check • Jawline Acne &amp; Midline Parting
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPhotoSectionOpen(!photoSectionOpen)}
                className="text-xs font-bold text-[#7A1D2E] hover:underline"
              >
                {photoSectionOpen ? 'Close' : 'View / Capture'}
              </button>
            </div>

            {photoSectionOpen && (
              <div className="space-y-3 pt-2 border-t border-[#F2E2DD] animate-in fade-in">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActivePhotoType('jawline')}
                    className={`flex-1 py-1.5 rounded-2xl text-xs font-bold transition ${
                      activePhotoType === 'jawline'
                        ? 'bg-[#7A1D2E] text-white'
                        : 'bg-[#FAF4F0] text-[#7A5A62]'
                    }`}
                  >
                    Jawline Acne Guide
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePhotoType('hairline')}
                    className={`flex-1 py-1.5 rounded-2xl text-xs font-bold transition ${
                      activePhotoType === 'hairline'
                        ? 'bg-[#7A1D2E] text-white'
                        : 'bg-[#FAF4F0] text-[#7A5A62]'
                    }`}
                  >
                    Hair Parting Guide
                  </button>
                </div>

                <div className="relative rounded-3xl bg-slate-900 p-6 text-center text-white overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                    <div className="w-32 h-44 border-2 border-dashed border-rose-300 rounded-full" />
                  </div>
                  <span className="text-3xl block mb-2">📷</span>
                  <div className="text-xs font-bold text-rose-100">
                    {activePhotoType === 'jawline'
                      ? 'Align Jawline within Oval Silhouette'
                      : 'Align Midline Hair Parting with Vertical Axis'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    On-device encrypted vault • Not shared with third parties
                  </div>
                  <button
                    type="button"
                    onClick={() => setCapturedPhoto(true)}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#7A1D2E] px-4 py-1.5 text-xs font-bold text-white shadow-xs"
                  >
                    Take Photo
                  </button>
                </div>
              </div>
            )}
          </Card>

          {/* Commit Checkin Button */}
          <button
            type="button"
            onClick={handleSaveCheckin}
            className="w-full py-3 rounded-2xl bg-[#7A1D2E] hover:bg-[#661423] text-white font-heading font-bold text-sm shadow-md shadow-[#7A1D2E]/20 transition"
          >
            Save Today&apos;s Daily Check-in
          </button>
        </div>
      )}

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-3xl bg-[#EBF5F0] border border-emerald-300 p-4 text-xs font-semibold text-emerald-900 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Daily check-in recorded! Your N-of-1 trial posterior distribution has been updated.</span>
        </div>
      )}
    </div>
  );
}
