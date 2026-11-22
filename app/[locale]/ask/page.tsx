'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Locale } from '@/i18n';
import { getDictionary } from '@/lib/i18n-dictionary';
import { Link } from '@/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DisclaimerBanner } from '@/components/disclaimer-banner';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  HelpCircle,
  AlertTriangle,
  Mic,
  MicOff,
  FileText,
  CheckCircle2,
  XCircle,
  HelpCircle as QuestionIcon,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Users,
  Search,
  ExternalLink,
  PhoneCall,
  Clock,
  ArrowRight,
  Volume2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sourceCitation?: string;
  questionsForDoctor?: string[];
  isRedFlag?: boolean;
}

export default function AskPage() {
  const t = useTranslations('coach');
  const tCommon = useTranslations('common');
  const locale = useLocale() as Locale;
  const dict = getDictionary(locale);

  // Active view tab inside Ask
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'family' | 'explainer' | 'myths' | 'labs'>('chat');

  // A2. Simpler reading level and voice states
  const [simpleModeActive, setSimpleModeActive] = useState<Record<string, boolean>>({
    m1: false,
    m3: false,
  });
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  // V6. Glossary popover state
  const [activeGlossaryTerm, setActiveGlossaryTerm] = useState<{ term: string; explanation: string } | null>(null);

  // A1. Explain to Family state
  const [familyRecipient, setFamilyRecipient] = useState<'husband' | 'mother' | 'saas' | 'sister'>('saas');
  const [familyTopic, setFamilyTopic] = useState<string>('gluten');
  const [familyLang, setFamilyLang] = useState<'hi' | 'te' | 'ta' | 'en'>('hi');
  const [familyCopied, setFamilyCopied] = useState<boolean>(false);
  const [familyVoicePlaying, setFamilyVoicePlaying] = useState<boolean>(false);

  // A3. Forward Myth state
  const [whatsappForwardText, setWhatsappForwardText] = useState<string>('Drink papaya seed decoction twice a day to force late periods immediately');
  const [replyCopied, setReplyCopied] = useState<boolean>(false);

  // Chat state
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: 'Namaste Priya. I am Ritu, your private companion. I know your PCOS (Rotterdam B) profile, your latest HOMA-IR (3.61), and Dr. Sen’s guidance. Ask me anything about your symptoms, food choices, or lab values.',
      sourceCitation: 'Source: International PCOS Guideline 2023 · Chapter 4 | ICMR-NIN Dietary Guidelines',
    },
    {
      id: 'm2',
      sender: 'user',
      text: 'Can I have poha for breakfast, or will it cause an insulin spike?',
    },
    {
      id: 'm3',
      sender: 'assistant',
      text: 'For you, Priya, having Phenotype B with a HOMA-IR of 3.61 means flattened white rice (poha) has a high glycemic load (GI ~70) that can cause a rapid glucose and insulin excursion, leaving you fatigued 2 hours later. A much better Indian swap is Besan Chilla with grated paneer: it provides 3x more protein (11g) and dietary fiber (6.5g) to stabilize your morning energy.',
      sourceCitation: 'Source: ICMR-NIN Indian Nutrient Databank (INDB) & Rotterdam Consensus on Insulin Resistance',
      questionsForDoctor: [
        'Ask Dr. Sen: What is my target fasting insulin level over the next 3 months?',
        'Ask Dietician Sneha: How many grams of protein should I target per meal?',
      ],
    },
  ]);

  // Doctor's Advice Explainer state
  const [customAdviceInput, setCustomAdviceInput] = useState<string>('');
  const [activeAdvice, setActiveAdvice] = useState({
    instruction: 'Avoid Gluten and High-Glycemic Refined Carbs (Maida)',
    prescribedBy: 'Dr. Ananya Sen, MD (OB/GYN)',
    date: '10 Nov 2026',
    why: 'In women with PCOS and elevated HOMA-IR, gluten peptides and high-glycemic starches can compromise intestinal mucosal permeability and provoke compensatory hyperinsulinemia, signaling the ovaries to synthesize excess free testosterone.',
    howItAffectsYou: 'Stabilizes your post-meal blood sugar curves, eliminates afternoon energy dips, and reduces inflammatory acne flares.',
    foodsToStop: ['Maida & White Bread', 'Naan, Bhature & Kulcha', 'Suji / Rava Upma', 'Biscuits & Bakery Rusks'],
    hiddenSources: [
      'Hing (Asafoetida) — compounded Indian hing typically contains 40–50% wheat flour.',
      'Soy sauce & Chinese gravies in street food.',
      'Malted health drinks & pre-mixed curry pastes.',
    ],
    indianAlternatives: [
      'Besan (Chickpea flour) for chillas and kadhi',
      'Jowar (Sorghum) and Bajra (Pearl millet) rotis',
      'Ragi (Finger millet) for dosas and porridge',
      'Kuttu (Buckwheat) and Rajgira for parathas',
    ],
    progressDays: 14,
  });

  // Myth Checker state
  const [mythQuery, setMythQuery] = useState<string>('');
  const [selectedMyth, setSelectedMyth] = useState<any>(null);

  const sampleMyths = [
    {
      id: 'm_acv',
      claim: 'Drinking 2 tbsp raw apple cider vinegar on an empty stomach cures PCOS in 10 days.',
      verdict: 'BUSTED',
      verdictColor: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: XCircle,
      summary: 'No clinical trial supports a "cure" for PCOS in 10 days. ACV may produce modest blunting of gastric emptying, but undiluted intake can cause dental enamel erosion and gastric irritation in women taking Metformin.',
      evidence: 'FOGSI & Cochrane Systematic Review: Lifestyle interventions require minimum 12–16 weeks for neuroendocrine and ovarian follicular recalibration.',
    },
    {
      id: 'm_cruciferous',
      claim: 'Women with thyroid and PCOS must strictly stop eating cabbage, cauliflower, and broccoli.',
      verdict: 'SAFE IN NORMAL AMOUNTS',
      verdictColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: CheckCircle2,
      summary: 'Cooked cruciferous vegetables are safe in normal dietary amounts. Cooking and steaming deactivates goitrogenic glucosinolates. They provide valuable dietary fiber and indole-3-carbinol which aids estrogen metabolism.',
      evidence: 'American Thyroid Association (ATA) & Endocrine Society: Normal dietary intake of cooked cruciferous vegetables has no adverse clinical effect on thyroid function.',
    },
    {
      id: 'm_spearmint',
      claim: 'Spearmint tea twice daily helps reduce facial hair (hirsutism) in PCOS.',
      verdict: 'LIMITED BUT PROMISING',
      verdictColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      icon: CheckCircle2,
      summary: 'Preliminary small-scale clinical studies show spearmint (Mentha spicata) tea has modest anti-androgenic effects on free testosterone, but larger multi-center randomized trials are required before it can be recommended as a standalone medical therapy.',
      evidence: 'Phytotherapy Research: Preliminary 30-day trial showed modest anti-androgenic trends; lifestyle foundation remains primary.',
    },
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Check for red flags
    const lower = inputMessage.toLowerCase();
    const isRedFlag =
      lower.includes('severe pain') ||
      lower.includes('heavy bleeding') ||
      lower.includes('chest pain') ||
      lower.includes('fainting') ||
      lower.includes('emergency');

    const newUserMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: inputMessage,
    };

    let reply: ChatMessage;
    if (isRedFlag) {
      reply = {
        id: `a_${Date.now()}`,
        sender: 'assistant',
        text: 'EMERGENCY SAFETY ALERT: Your description mentions acute or severe symptoms. Ritu cannot evaluate acute medical crises. Please call emergency services (112) or visit an urgent care facility immediately.',
        isRedFlag: true,
      };
    } else {
      reply = {
        id: `a_${Date.now()}`,
        sender: 'assistant',
        text: `For your specific health profile (PCOS Phenotype B + Hypothyroidism), here is what the clinical guidelines suggest regarding "${inputMessage}": Keep dietary fiber above 30g/day, balance each meal with quality protein to maintain postprandial glycemic stability, and avoid high-intensity cortisol spikes.`,
        sourceCitation: 'Source: International PCOS Guideline 2023 · Section 4.2 | FOGSI Consensus',
        questionsForDoctor: [
          'Ask Dr. Sen if this is aligned with your active metformin protocol.',
          'Verify if your next lab panel includes lipid profiles and fasting insulin.',
        ],
      };
    }

    setMessages([...messages, newUserMsg, reply]);
    setInputMessage('');
  };

  const handleVoiceToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setInputMessage('Mujhe shaam ko bahut meetha khane ka mann hota hai, kya karun?');
        setIsRecording(false);
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-20">
      {/* Ask Header in Deep Burgundy (matching slide theme) */}
      <div className="rounded-4xl bg-gradient-to-br from-[#801D30] via-[#7A1D2E] to-[#601422] p-6 text-white shadow-md shadow-[#7A1D2E]/20 relative overflow-hidden">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white">
          <Sparkles className="w-3 h-3 text-white" />
          Personal Health Assistant
        </span>

        <h1 className="mt-2 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {dict.ask.headerTitle}
        </h1>
        <p className="mt-1 text-xs text-[#FCEEEB] max-w-md">
          {dict.ask.headerSub}
        </p>

        {/* Sub-navigation tabs */}
        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'chat', label: dict.ask.tabChat },
            { id: 'family', label: dict.ask.tabFamily },
            { id: 'explainer', label: dict.ask.tabExplainer },
            { id: 'myths', label: dict.ask.tabMyths },
            { id: 'labs', label: dict.ask.tabLabs },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                activeSubTab === tab.id
                  ? 'bg-white text-[#7A1D2E] shadow-xs font-bold'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: PERSONAL AI CHAT */}
      {activeSubTab === 'chat' && (
        <div className="space-y-3">
          {/* Community aggregate insight pill (Evidence fix: generic aggregate, no named doctor) */}
          <div className="rounded-2xl bg-pastel-blue/40 border border-blue-200/70 p-3 text-xs text-blue-950 flex items-start gap-2.5">
            <Users className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Community Insight (Hyderabad Aggregate):</span> 120+ women in your region with similar hormonal profiles (Rotterdam B, HOMA-IR &gt; 3.0) found low-GI meal sequencing and evening strength walks helpful for cycle regularity.
              <span className="block text-[10px] text-blue-800 mt-0.5">
                (Aggregated privately: N ≥ 120 threshold. Individual patient and doctor identities are never exposed.)
              </span>
            </div>
          </div>

          {/* Chat Stream */}
          <Card className="rounded-4xl p-4 sm:p-5 border-slate-200/80 bg-white shadow-card min-h-[380px] flex flex-col justify-between">
            <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1">
              {messages.map((msg) => {
                const isSimple = simpleModeActive[msg.id];
                const isSpeaking = speakingMsgId === msg.id;

                let displayText = msg.text;
                if (isSimple) {
                  if (msg.id === 'm1') {
                    displayText = 'Namaste Priya. I am Ritu. I remember your hormone checks and Dr. Sen\'s advice. You can ask me any question about your food, stomach, tiredness or medicines.';
                  } else if (msg.id === 'm3') {
                    displayText = 'For your body right now, white poha breaks down into sugar very fast, giving you a quick boost followed by tiredness and cravings after 2 hours. Besan chilla with paneer keeps your stomach full and gives steady energy through the whole morning.';
                  }
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[88%] sm:max-w-[80%] rounded-3xl p-3.5 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-forest text-white rounded-br-xs'
                          : msg.isRedFlag
                          ? 'bg-rose-50 border border-rose-300 text-rose-900 rounded-bl-xs'
                          : 'bg-[#F4F6F2] border border-slate-200/70 text-slate-800 rounded-bl-xs'
                      }`}
                    >
                      {msg.isRedFlag && (
                        <div className="flex items-center gap-1.5 font-bold text-rose-700 mb-1">
                          <PhoneCall className="w-4 h-4 animate-bounce" />
                          <span>Emergency Medical Protocol (Call 112)</span>
                        </div>
                      )}

                      {/* Message Body with Tap-to-Explain V6 Glossary Terms */}
                      <p>
                        {msg.sender === 'assistant' && !isSimple ? (
                          <>
                            {msg.id === 'm1' ? (
                              <>
                                Namaste Priya. I am Ritu, your private companion. I know your PCOS (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setActiveGlossaryTerm({
                                      term: 'Rotterdam B Phenotype',
                                      explanation:
                                        'An international medical classification for PCOS based on irregular menstrual cycles and androgen symptoms without polycystic ovary ultrasound findings.',
                                    })
                                  }
                                  className="border-b border-dotted border-brand-purple text-brand-purple font-semibold hover:bg-indigo-50"
                                >
                                  Rotterdam B
                                </button>
                                ) profile, your latest{' '}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setActiveGlossaryTerm({
                                      term: 'HOMA-IR',
                                      explanation:
                                        'Homeostatic Model Assessment of Insulin Resistance: a formula checking whether your pancreas is working harder to regulate sugar.',
                                    })
                                  }
                                  className="border-b border-dotted border-brand-purple text-brand-purple font-semibold hover:bg-indigo-50"
                                >
                                  HOMA-IR (3.61)
                                </button>
                                , and Dr. Sen’s guidance. Ask me anything about your symptoms, food choices, or lab values.
                              </>
                            ) : msg.id === 'm3' ? (
                              <>
                                For you, Priya, having Phenotype B with a{' '}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setActiveGlossaryTerm({
                                      term: 'HOMA-IR',
                                      explanation:
                                        'A calculation indicating insulin resistance, which can stimulate ovarian theca cells to produce excess androgens.',
                                    })
                                  }
                                  className="border-b border-dotted border-brand-purple text-brand-purple font-semibold hover:bg-indigo-50"
                                >
                                  HOMA-IR of 3.61
                                </button>{' '}
                                means flattened white rice (poha) has a high glycemic load that causes a rapid glucose and insulin excursion, leaving you fatigued 2 hours later. A much better Indian swap is Besan Chilla with grated paneer: it provides 3x more protein (11g) and dietary fiber (6.5g) to stabilize your morning energy.
                              </>
                            ) : (
                              displayText
                            )}
                          </>
                        ) : (
                          displayText
                        )}
                      </p>

                      {/* Source citation + A2 Simpler & Listen buttons */}
                      {msg.sender === 'assistant' && (
                        <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-1 text-[10px]">
                          {msg.sourceCitation && (
                            <div className="text-slate-500 font-semibold flex items-center gap-1">
                              <BookOpen className="w-3 h-3 text-sage" />
                              <span>{msg.sourceCitation}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-1.5 ml-auto">
                            {/* A2. Simple Mode Toggle */}
                            <button
                              type="button"
                              onClick={() =>
                                setSimpleModeActive({
                                  ...simpleModeActive,
                                  [msg.id]: !simpleModeActive[msg.id],
                                })
                              }
                              className={`px-2 py-0.5 rounded-full font-bold transition flex items-center gap-0.5 ${
                                isSimple
                                  ? 'bg-brand-purple text-white'
                                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                              title="Toggle between plain language and clinical explanation"
                            >
                              <span>Aa↓</span>
                              <span>{isSimple ? 'Clinical' : 'Simpler'}</span>
                            </button>

                            {/* A2. Listen button */}
                            <button
                              type="button"
                              onClick={() =>
                                setSpeakingMsgId(isSpeaking ? null : msg.id)
                              }
                              className={`p-1 rounded-full transition ${
                                isSpeaking
                                  ? 'bg-brand-pink text-white animate-pulse'
                                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                              title="Listen aloud in your app language"
                            >
                              <Volume2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* What to ask your doctor */}
                      {msg.questionsForDoctor && msg.questionsForDoctor.length > 0 && (
                        <div className="mt-2 p-2 rounded-xl bg-white/70 border border-slate-200/70 text-[11px] text-slate-700">
                          <span className="font-bold text-forest block mb-1">
                            Questions to ask your doctor:
                          </span>
                          <ul className="list-disc pl-4 space-y-0.5 text-[10px]">
                            {msg.questionsForDoctor.map((q, i) => (
                              <li key={i}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition shrink-0 ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title="Speak in Hindi, Telugu, Tamil or English"
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={dict.ask.inputPlaceholder}
                  className="flex-1 rounded-full border border-slate-200 bg-[#F4F6F2] px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-forest"
                />

                <Button
                  type="button"
                  variant="forest"
                  size="sm"
                  onClick={handleSendMessage}
                  className="w-10 h-10 rounded-full p-0 flex items-center justify-center shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {isRecording && (
                <div className="mt-1.5 text-center text-[10px] text-rose-600 font-semibold animate-pulse">
                  Listening in Indic Voice... Speak naturally
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* TAB: A1. EXPLAIN TO MY FAMILY */}
      {activeSubTab === 'family' && (
        <div className="space-y-4">
          <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-[10px] font-bold text-brand-purple">
                👨‍👩‍👧 Culturally Sensitive Family Bridge
              </span>
              <span className="text-[10px] text-slate-400">Respectful &amp; Evidence-Grounded</span>
            </div>

            <div>
              <h2 className="font-heading text-lg font-bold text-slate-900">
                Explain my health choices to family
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Generate polite WhatsApp messages and voice notes in Indian languages to explain doctor instructions without conflict.
              </p>
            </div>

            {/* Recipient Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">1. Who are you sharing with?</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'saas', label: 'Mother-in-law (Saas)' },
                  { id: 'husband', label: 'Husband' },
                  { id: 'mother', label: 'Mother (Mummy)' },
                  { id: 'sister', label: 'Sister / Bhabhi' },
                ].map((rec) => (
                  <button
                    key={rec.id}
                    type="button"
                    onClick={() => setFamilyRecipient(rec.id as any)}
                    className={`p-2.5 rounded-2xl border text-xs font-semibold transition text-center ${
                      familyRecipient === rec.id
                        ? 'bg-brand-purple text-white border-brand-purple shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {rec.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">2. What do you need to explain?</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'gluten', label: 'Why I am avoiding maida/wheat' },
                  { id: 'fatigue', label: 'Why I experience afternoon fatigue' },
                  { id: 'metformin', label: 'Why doctor gave Metformin' },
                  { id: 'delays', label: 'Why my cycle gets delayed' },
                ].map((top) => (
                  <button
                    key={top.id}
                    type="button"
                    onClick={() => setFamilyTopic(top.id)}
                    className={`p-2 rounded-xl border text-[11px] font-semibold transition text-left ${
                      familyTopic === top.id
                        ? 'bg-rose-100 border-brand-pink text-brand-pink'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {top.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">3. Language of message</label>
              <div className="flex gap-2">
                {[
                  { id: 'hi', label: 'Hindi (हिंदी)' },
                  { id: 'te', label: 'Telugu (తెలుగు)' },
                  { id: 'ta', label: 'Tamil (தமிழ்)' },
                  { id: 'en', label: 'English' },
                ].map((lng) => (
                  <button
                    key={lng.id}
                    type="button"
                    onClick={() => setFamilyLang(lng.id as any)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      familyLang === lng.id
                        ? 'bg-forest text-white border-forest'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {lng.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Respectful Generated Message Card */}
            <div className="p-4 rounded-3xl bg-indigo-50/70 border border-indigo-100 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-950 font-heading">
                <span>WhatsApp Message Preview</span>
                <span className="text-[10px] text-brand-purple">Respectful &amp; Warm</span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed italic bg-white/90 p-3 rounded-2xl border border-indigo-100">
                {familyRecipient === 'saas' && familyLang === 'hi' && (
                  `"प्रणाम मम्मी जी। डॉ. अनन्या सेन ने समझाया है कि मेरे शरीर में मैदा और सामान्य गेहूं से ब्लड शुगर तेजी से बढ़ता है, जिससे ओवरीज में हार्मोन असंतुलन होता है। इसलिए बेसन के चीले, ज्वार-बाजरा और हरी सब्जियां खाने से मेरा स्वास्थ्य सुधर रहा है, यह कोई वजन घटाने की डाइटिंग नहीं है। आपके आशीर्वाद और घर के इस स्वस्थ भोजन में सहयोग से मुझे बहुत शक्ति मिलती है।" `
                )}
                {familyRecipient === 'husband' && (
                  `"Hi, Dr. Sen explained that PCOS fatigue happens because insulin resistance prevents cells from absorbing glucose properly after meals. When I rest for 20 minutes in the afternoon or take a brisk walk, my insulin sensitivity improves. Thanks for supporting my routine!" `
                )}
                {familyRecipient === 'saas' && familyLang !== 'hi' && (
                  `"Namaste Mummy ji. Dr. Sen explained that in Priya's body, maida and heavy refined starches cause insulin spikes that affect ovulation. That is why cooking with besan, jowar and seasonal vegetables helps her health, not dieting for weight loss. Your kind blessing and support with these home food choices helps her heal." `
                )}
                {familyRecipient === 'mother' && (
                  `"Mummy, Dr. Sen has reviewed my lab reports. The Metformin tablet is to balance insulin sensitivity, not for diabetes. The doctor says it protects long-term ovarian health." `
                )}
                {familyRecipient === 'sister' && (
                  `"Hey! Just sharing what Dr. Sen explained about cycle delays in PCOS: high insulin increases androgen hormones which pauses the follicle from releasing an egg. Healthy swaps and walking help regulate it." `
                )}
              </p>

              {/* Action Buttons */}
              <div className="pt-1 flex flex-wrap gap-2">
                <Button
                  variant="purple"
                  size="sm"
                  onClick={() => {
                    setFamilyCopied(true);
                    setTimeout(() => setFamilyCopied(false), 2500);
                  }}
                  className="text-xs"
                >
                  {familyCopied ? '✓ Copied to Clipboard!' : '📋 Copy WhatsApp Message'}
                </Button>

                <button
                  type="button"
                  onClick={() => setFamilyVoicePlaying(!familyVoicePlaying)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-indigo-200 text-brand-purple text-xs font-semibold hover:bg-indigo-50 flex items-center gap-1 shadow-xs"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{familyVoicePlaying ? 'Pause Voice Note' : '🎙️ Generate Voice Note'}</span>
                </button>
              </div>

              {familyVoicePlaying && (
                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-900 text-[11px] flex items-center gap-2 animate-in fade-in">
                  <span className="w-2 h-2 rounded-full bg-brand-purple animate-ping" />
                  <span>Simulated Voice Note: Warm, respectful spoken Hindi audio playing...</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: DOCTOR'S ADVICE EXPLAINER */}
      {activeSubTab === 'explainer' && (
        <div className="space-y-4">
          <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full bg-pastel-mint px-2.5 py-0.5 text-[10px] font-bold text-pastel-mintText">
                <Stethoscope className="w-3 h-3" /> Doctor Instruction Explainer
              </span>
              <span className="text-xs text-slate-500">Prescribed: {activeAdvice.date}</span>
            </div>

            <div className="mt-3">
              <h2 className="font-heading text-xl font-bold text-slate-900">
                &ldquo;{activeAdvice.instruction}&rdquo;
              </h2>
              <div className="text-xs text-slate-500 mt-0.5">
                Prescribed by: <strong className="text-slate-700">{activeAdvice.prescribedBy}</strong>
              </div>
            </div>

            {/* Structured Explainer Sections */}
            <div className="mt-4 space-y-3">
              {/* Why */}
              <div className="p-3.5 rounded-2xl bg-[#F4F6F2] text-xs">
                <span className="font-bold text-forest block mb-1">❓ Why did your doctor advise this?</span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {activeAdvice.why}
                </p>
              </div>

              {/* How it affects you */}
              <div className="p-3.5 rounded-2xl bg-pastel-mint/30 border border-emerald-200 text-xs">
                <span className="font-bold text-emerald-900 block mb-1">🧬 How does it affect your body?</span>
                <p className="text-emerald-950 text-[11px] leading-relaxed">
                  {activeAdvice.howItAffectsYou}
                </p>
              </div>

              {/* Foods to stop & Hidden sources */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-pastel-peach/40 border border-rose-200 text-xs">
                  <span className="font-bold text-rose-900 block mb-1.5">🛑 Foods to Stop</span>
                  <ul className="space-y-1 text-[11px] text-rose-950">
                    {activeAdvice.foodsToStop.map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-pastel-yellow/50 border border-amber-200 text-xs">
                  <span className="font-bold text-amber-900 block mb-1.5">🕵️ Hidden Indian Sources</span>
                  <ul className="space-y-1 text-[11px] text-amber-950">
                    {activeAdvice.hiddenSources.map((h, i) => (
                      <li key={i}>• {h}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Indian Alternatives */}
              <div className="p-3.5 rounded-2xl bg-pastel-blue/40 border border-blue-200 text-xs">
                <span className="font-bold text-blue-900 block mb-1.5">🌾 Healthy Indian Alternatives</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-blue-950">
                  {activeAdvice.indianAlternatives.map((alt, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      <span>{alt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">Your Progress Tracker:</span>
                  <div className="text-[11px] text-slate-500">14 days followed · Energy score +0.8 pts</div>
                </div>
                <span className="rounded-full bg-forest text-white text-xs font-bold px-3 py-1">
                  On Track
                </span>
              </div>
            </div>

            {/* Paste New Advice Box */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-800 mb-1.5">
                Paste any new advice from your doctor or prescription:
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customAdviceInput}
                  onChange={(e) => setCustomAdviceInput(e.target.value)}
                  placeholder="e.g. 'Take Metformin 500mg with dinner' or 'Stop consuming dairy'..."
                  className="flex-1 rounded-full border border-slate-200 bg-[#F4F6F2] px-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-forest"
                />
                <Button
                  type="button"
                  variant="forest"
                  size="sm"
                  onClick={() => {
                    if (customAdviceInput) {
                      setActiveAdvice({
                        ...activeAdvice,
                        instruction: customAdviceInput,
                        date: 'Just now',
                      });
                      setCustomAdviceInput('');
                    }
                  }}
                  className="rounded-full text-xs"
                >
                  Explain
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: MYTH CHECKER */}
      {activeSubTab === 'myths' && (
        <div className="space-y-4">
          <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full bg-pastel-yellow px-2.5 py-0.5 text-[10px] font-bold text-pastel-yellowText">
                <QuestionIcon className="w-3 h-3" /> WhatsApp &amp; Reel Myth Checker
              </span>
              <span className="text-xs text-slate-500">Grounded in ICMR &amp; FOGSI</span>
            </div>

            <div className="mt-3">
              <h2 className="font-heading text-lg font-bold text-slate-900">
                Heard a health claim? Check the clinical facts
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Paste any viral post, reel claim, or family advice to get an unbiased, evidence-based verdict.
              </p>
            </div>

            {/* Search / Paste Input */}
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={mythQuery}
                onChange={(e) => setMythQuery(e.target.value)}
                placeholder="Paste a health claim (e.g., 'Does spearmint tea cure facial hair?')..."
                className="flex-1 rounded-full border border-slate-200 bg-[#F4F6F2] px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-forest"
              />
              <Button
                type="button"
                variant="forest"
                size="sm"
                onClick={() => {
                  if (mythQuery) {
                    setSelectedMyth(sampleMyths[0]);
                  }
                }}
                className="rounded-full text-xs"
              >
                Verify Claim
              </Button>
            </div>

            {/* A3. FORWARD-TO-RITU WHATSAPP DEBUNKER */}
            <div className="mt-5 p-4 rounded-3xl bg-pastel-yellow/30 border border-amber-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950 font-heading flex items-center gap-1.5">
                  <span>📱</span>
                  <span>Forward-to-Ritu (WhatsApp Rumor Check)</span>
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                  Share Sheet Target
                </span>
              </div>

              <div className="text-[11px] text-slate-600">
                Received a forwarded forward on a family group? Ritu checks the evidence and writes a respectful reply you can send back.
              </div>

              <div className="p-3 rounded-2xl bg-white border border-amber-200/60 text-xs text-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Simulated Forward:</div>
                <div className="italic font-medium">"{whatsappForwardText}"</div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                    Verdict: DANGEROUS / BUSTED
                  </span>
                  <span className="text-slate-500 text-[10px]">FOGSI Safety Alert</span>
                </div>
              </div>

              {/* Polite Group Reply Generator */}
              <div className="p-3 rounded-2xl bg-white border border-indigo-100 space-y-2">
                <div className="text-xs font-bold text-indigo-950 font-heading flex items-center justify-between">
                  <span>Polite Group Reply (Respectful to Elders)</span>
                  <span className="text-[10px] text-indigo-600">Ready to Paste</span>
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed italic bg-indigo-50/50 p-2.5 rounded-xl">
                  "Mummy ji / Aunty ji, I checked this with the gynecologist guidelines. Papaya seeds contain benzyl isothiocyanate which can cause severe gastric irritation and uterine spasms, but does not safely treat delayed cycles. Warm ajwain water or ginger tea is much gentler and safer for stomach cramps."
                </p>
                <Button
                  variant="purple"
                  size="sm"
                  onClick={() => {
                    setReplyCopied(true);
                    setTimeout(() => setReplyCopied(false), 2500);
                  }}
                  className="text-xs w-full"
                >
                  {replyCopied ? '✓ Copied Polite Group Reply!' : '📋 Copy Polite Group Reply'}
                </Button>
              </div>
            </div>

            {/* Sample Verified Claims */}
            <div className="mt-5 space-y-3">
              <div className="text-xs font-bold text-slate-700">Recent Indian Claims Verified:</div>
              {sampleMyths.map((m) => {
                const Icon = m.icon;
                return (
                  <div
                    key={m.id}
                    className="p-4 rounded-3xl border border-slate-200 bg-white hover:bg-slate-50/50 transition shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs font-bold text-slate-900 leading-snug">
                        &ldquo;{m.claim}&rdquo;
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border shrink-0 ${m.verdictColor}`}>
                        {m.verdict}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      {m.summary}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
                      <BookOpen className="w-3 h-3 text-sage" />
                      <span>{m.evidence}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: LAB RESULTS EXPLAINED */}
      {activeSubTab === 'labs' && (
        <div className="space-y-4">
          <Card className="rounded-4xl p-5 border-slate-200/80 bg-white shadow-card">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 rounded-full bg-pastel-mint px-2.5 py-0.5 text-[10px] font-bold text-pastel-mintText">
                🧪 Lab Meaning &amp; Trends
              </span>
              <span className="text-xs text-slate-500">Sample Date: 12 Oct 2026</span>
            </div>

            <div className="mt-3">
              <h2 className="font-heading text-lg font-bold text-slate-900">
                Your Biomarkers in Plain English
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                We translate clinical lab values into what they mean for your daily energy, cycles, and metabolism.
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {/* Marker 1: HOMA-IR */}
              <div className="p-3.5 rounded-3xl border border-slate-200 bg-[#F4F6F2]">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-xs">HOMA-IR (Insulin Resistance Index)</span>
                    <div className="text-[11px] text-slate-500">Computed from Fasting Glucose &amp; Fasting Insulin</div>
                  </div>
                  <span className="rounded-full bg-pastel-peach text-pastel-peachText text-xs font-bold px-2.5 py-0.5">
                    3.61 (High &gt; 2.5)
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  <strong>What this means:</strong> Your cells require higher insulin output to clear circulating blood glucose. This hyperinsulinemia acts directly on the theca cells in your ovaries, prompting excess androgen synthesis (facial hair/acne).
                </p>
                <div className="mt-2 text-[11px] font-semibold text-forest flex items-center gap-1">
                  <span>Target with Metformin &amp; Low-GI Diet: &lt; 2.0</span>
                </div>
              </div>

              {/* Marker 2: TSH */}
              <div className="p-3.5 rounded-3xl border border-slate-200 bg-[#F4F6F2]">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-xs">TSH (Thyroid Stimulating Hormone)</span>
                    <div className="text-[11px] text-slate-500">Thyroid Profile (Chemiluminescence)</div>
                  </div>
                  <span className="rounded-full bg-pastel-yellow text-pastel-yellowText text-xs font-bold px-2.5 py-0.5">
                    3.8 µIU/mL (Monitored)
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  <strong>What this means:</strong> While within the broad population laboratory reference range (0.4–4.2), women with concurrent PCOS thrive best when TSH is optimized around 1.5–2.5 to support regular ovulatory cycles.
                </p>
              </div>

              {/* Marker 3: Free Testosterone */}
              <div className="p-3.5 rounded-3xl border border-slate-200 bg-[#F4F6F2]">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-xs">Free Testosterone</span>
                    <div className="text-[11px] text-slate-500">Unbound active circulating hormone</div>
                  </div>
                  <span className="rounded-full bg-pastel-peach text-pastel-peachText text-xs font-bold px-2.5 py-0.5">
                    42 pg/mL (Elevated)
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  <strong>What this means:</strong> Explains the chin acne and hair thinning. Spearmint tea and inositol are currently being trialed to bind and reduce this level safely.
                </p>
              </div>
            </div>

            {/* Test Suggestions / Reminders */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">Upcoming Screening Reminder:</div>
                <div className="text-[11px] text-slate-500">HbA1c &amp; Vitamin D3 due in Dec 2026</div>
              </div>
              <Link href="/labs">
                <Button variant="forest" size="sm" className="rounded-full text-xs">
                  Schedule Home Test
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      )}

      {/* V6. TAP-TO-EXPLAIN GLOSSARY DRAWER */}
      {activeGlossaryTerm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-3 animate-in fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setActiveGlossaryTerm(null)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-4xl p-5 shadow-2xl border border-indigo-100 z-10 space-y-3 animate-in slide-in-from-bottom-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-brand-purple font-heading flex items-center gap-1.5">
                <span>📖</span>
                <span>Plain-Language Glossary</span>
              </span>
              <button
                type="button"
                onClick={() => setActiveGlossaryTerm(null)}
                className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <div className="text-sm font-bold text-slate-900 font-heading">
                {activeGlossaryTerm.term}
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {activeGlossaryTerm.explanation}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveGlossaryTerm(null)}
              className="w-full text-xs"
            >
              Got it
            </Button>
          </div>
        </div>
      )}

      <DisclaimerBanner type="wellness" />
    </div>
  );
}
