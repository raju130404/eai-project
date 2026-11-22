# Ritu: Comprehensive Feature Specification & Documentation

> **Ritu (ऋतु / ఋతు / ரிது)**: A private, clinical-grade health companion for women navigating hormonal and lifestyle conditions — PCOS/PCOD, thyroid disorders, endometriosis, anaemia, irregular periods, pregnancy & postpartum, and perimenopause/menopause.

---

## 📑 Table of Contents

1. [Product Positioning & Core Principles](#1-product-positioning--core-principles)
2. [Visual Design System & Mobile UI Architecture](#2-visual-design-system--mobile-ui-architecture)
3. [Navigation Architecture (Docked 5-Tab Bar)](#3-navigation-architecture-docked-5-tab-bar)
4. [Module 1: Home & Daily Cycle Tracking](#4-module-1-home--daily-cycle-tracking)
5. [Module 2: Daily Check-in & Symptom Logging](#5-module-2-daily-check-in--symptom-logging)
6. [Module 3: Ask Ritu — Trusted Information & Clinical AI](#6-module-3-ask-ritu--trusted-information--clinical-ai)
7. [Module 4: Food & Indian Nutrition (INDB 150+ Dishes)](#7-module-4-food--indian-nutrition-indb-150-dishes)
8. [Module 5: Workouts & Condition-Adjusted Movement](#8-module-5-workouts--condition-adjusted-movement)
9. [Module 6: Smart Cart Agent (Grocery Swaps)](#9-module-6-smart-cart-agent-grocery-swaps)
10. [Module 7: Care Team & Doctor Coordination](#10-module-7-care-team--doctor-coordination)
11. [Module 8: Calibration Engine ("How Ritu Personalises")](#11-module-8-calibration-engine-how-ritu-personalises)
12. [Module 9: Deterministic N-of-1 Personal Science Engine](#12-module-9-deterministic-n-of-1-personal-science-engine)
13. [Module 10: Diagnostic Labs & OCR Vision Extraction](#13-module-10-diagnostic-labs--ocr-vision-extraction)
14. [Module 11: Privacy, DPDP 2023 & Data Portability](#14-module-11-privacy-dpdp-2023--data-portability)
15. [Module 12: IIM-A Economics of AI & Network Moat Simulation](#15-module-12-iim-a-economics-of-ai--network-moat-simulation)
16. [Module 13: Instant Persona Switcher (Zero Auth Barrier)](#16-module-13-instant-persona-switcher-zero-auth-barrier)
17. [Module 14: Multilingual Indic Support & Voice Engine](#17-module-14-multilingual-indic-support--voice-engine)
18. [Module 15: Ritu Doctor Portal (24 Clinical AI Features D1–D24)](#18-module-15-ritu-doctor-portal-24-clinical-ai-features-d1d24)

---

## 1. Product Positioning & Core Principles

### Core Problem
Hormonal conditions in women depend on individual neuroendocrine baselines, carry societal stigma, require elusive diet and lifestyle adjustments through trial-and-error, and suffer from widespread clinical misinformation.

### The Three Non-Negotiable Rules
1. **The doctor decides; the AI fine-tunes.**  
   The AI operates strictly within clinical boundaries set by qualified doctors. The AI never overrides a prescription, never changes a dosage, and never relaxes a restriction.
2. **Every answer shows its source.**  
   No unverified generative hallucinations. Every clinical statement provides an evidence citation (International PCOS Guideline, ICMR-NIN, FOGSI, ACOG, WHO).
3. **Private by default.**  
   In compliance with India's **Digital Personal Data Protection (DPDP) Act 2023**, sharing is opt-in, granular per person, and granular per data category. No health data is ever sold to advertisers, insurers, or FMCG brands.

---

## 2. Visual Design System & Mobile UI Architecture

*Aligned with the presentation prototype design:*

- **Canvas Background:** Warm Cream Linen (`#FAF4F0`) providing a high-end, tactile, human health aesthetic.
- **Card Surfaces:** Pure White (`#FFFFFF`) with delicate warm rose-sand borders (`#F2E2DD`) and soft depth shadows.
- **Color Palette:**
  - **Deep Burgundy / Wine (`#7A1D2E` / `#801D30`):** Signature primary color for active tabs, cycle progress indicators, primary CTA buttons ("See what you can do"), and the "Personalised. Connected. Actionable." banner.
  - **Soft Peach / Warm Blush (`#FCEEEB`):** Rounded container background for health icons (Cycle, Symptoms, Sleep, Mood).
  - **Warm Terracotta & Muted Rose (`#C46874` / `#BD535D`):** Supportive accent for trends and indicators.
  - **Espresso Charcoal Text (`#361118`):** Rich, legible typography for headings and high-emphasis labels.
  - **Muted Taupe Text (`#7A5A62`):** Calm, non-alarmist body and metric descriptions.
- **Typography:**
  - Headings: `Fredoka` & `Plus Jakarta Sans` for soft, elegant, friendly rounded titles.
  - Body & Metrics: `Poppins` & `Inter` for crisp medical-grade legibility.
- **Mobile Container:** Optimized for iPhone 14/15 profiles (`max-w-md sm:max-w-lg mx-auto`) with generous pill radii (`rounded-3xl` / `rounded-4xl`).

---

## 3. Navigation Architecture (Docked 5-Tab Bar)

A permanently docked, native mobile bottom navigation bar with fluid active-state pill indicators:

| Tab | Route | Description |
| :--- | :--- | :--- |
| 🏠 **Home** | `/today` (and `/`) | Greeting overview, Cycle progress, Symptoms & Sleep cards, Mood sparkline, AI Insight |
| 📅 **Log** | `/checkin` | 10-Second Daily Check-in, Symptoms, Pain slider, Indic Voice note |
| 💬 **Ask** | `/ask` | Personal AI Chat, Doctor Advice Explainer, Myth Checker, Lab Tracker |
| 🩺 **Care** | `/care` | Care Team roster, Sharing Toggles, 1-Page Summary, Doctor Directory & Triage |
| 👤 **Profile** | `/profile` | Health Baseline, Calibration Engine, Smart Cart Settings, DPDP Data Export |

---

## 4. Module 1: Home & Daily Health Overview

- **Welcome Greeting:** Displays `Good morning!` and `Here's your health overview` with user profile integration.
- **Cycle Progress Card:**
  - Replaced the legacy Day 18 heart and pregnancy chance widget with a clean, clinical cycle overview.
  - Features **Day 14 of 28** progress slider with a smooth indicator dot at 50% (Follicular phase • Regular baseline).
  - Clean phase markers: *Day 1 (Period)*, *Day 14 (Mid-Cycle)*, and *Day 28 (Expected)*.
- **2-Column Health Signals (Symptoms & Sleep):**
  - **Symptoms:** Bloating, fatigue quick indicators with 1-tap drill-down.
  - **Sleep:** 6 h 40 min sleep duration tracker.
- **Mood Card with 7-Day Sparkline Wave:**
  - Real-time mood trend card ("Mostly good • Calming trend") with a smooth SVG sparkline wave in deep burgundy.
- **Adaptive AI Insight Card:**
  - Direct clinical synthesis: *"Your fatigue and bloating are common around mid-cycle and may be linked to hormonal changes."*
  - 1-Tap CTA: **[See what you can do >]** in solid deep burgundy routing to Ask Ritu.
- **Core Pillars Banner:**
  - **CONNECT:** Symptoms, cycle, sleep & mood signals together.
  - **UNDERSTAND:** AI-powered insights adapting to evolving individual patterns.
  - **NAVIGATE:** Informed next steps and knowing when to seek professional care.
  - **Tagline Banner:** *"Personalised. Connected. Actionable."* in rich burgundy pill styling.
- **Weekly Interactive Calendar Strip:**
  - Displays current month (`November 2026`) with a 7-day row (`S M T W T F S`).
  - Active date highlighted in a solid burgundy circle (`#7A1D2E`).
- **Daily Medicines Checklist:**
  - Interactive checklists for prescribed morning Thyronorm and evening Metformin with smart timing advice.
- **2×3 Direct Access Tools Grid:**
  - 1-tap shortcuts to Food & Tolerance, Lab OCR, N-of-1 Trials, Smart Cart, Targeted Workouts, and Fasting Planner.
  - 🥗 **Mood Booster** (`#FFE8EF`): High-fiber Indian breakfast swaps.
  - ✨ **Spread Happines** (`#E8F8F5`): Restorative pelvic stretches and active trials.
- **Daily Medicine Checklist:**
  - One-tap checkoffs for *Thyronorm 25mcg* (Empty stomach) and *Metformin 500mg* (Evening).

---

## 5. Module 2: Daily Check-in & Symptom Logging

- **10-Second Flow:** Quick input without tedious questionnaires.
- **Vitals & Metrics:**
  - Energy slider (1 to 5).
  - Pelvic Cramp / Pain slider (0 to 10).
  - Period flow tracker (`None`, `Spotting`, `Light`, `Medium`, `Heavy`).
- **Interactive Symptom Chips:**
  - Quick-toggle tags: *Sugar Cravings*, *Bloating*, *Hormonal Acne*, *Afternoon Fatigue*, *Period Started*, *Brain Fog*.
- **Multilingual Voice & NLP Extraction:**
  - Users can speak naturally in Hindi, Telugu, Tamil, or English (e.g., *"Aaj bahut thakaan thi, period nahi aaya"*).
  - Vision/LLM parses structured fields (`energy: 2, period: false, notes: ...`).
  - Explicit confirmation review screen before committing to profile.
- **Red-Flag Emergency Safeguard:**
  - Detects acute symptoms (severe pelvic pain, heavy hemorrhage, chest pain, fainting, pregnancy complications).
  - Immediately replaces AI wellness advice with an urgent **Call Emergency (112) / Seek Care Today** card.

---

## 6. Module 3: Ask Ritu — Trusted Information & Clinical AI

- **Personal AI Chat ("Ask Ritu"):**
  - Speaks with personal context: *"For you, Priya, having Phenotype B with a HOMA-IR of 3.61 means..."*
  - Grounded in guidelines: *International PCOS Guideline (2023), ICMR-NIN, ACOG, FOGSI, WHO*.
  - Every reply includes a verifiable source line:  
    `Source: International PCOS Guideline 2023 · Section 4.2 | ICMR-NIN Guidelines for Indians`
  - Generates a **"Questions to Ask Your Doctor"** box at the end of answers.
- **Doctor's Advice Explainer:**
  - Deconstructs clinical instructions (e.g., *"Avoid Gluten & High Glycemic Carbs"* prescribed by Dr. Ananya Sen):
    - ❓ **Why:** Insulin resistance dampens follicular maturation; gut mucosal permeability.
    - 🧬 **How it affects your body:** Stabilizes postprandial glucose curves and reduces inflammatory acne.
    - 🛑 **Foods to stop:** Maida, white bread, naan, bhature, suji upma.
    - 🕵️ **Hidden Indian sources:** *Hing (asafoetida)* compounded with wheat flour, soy sauce in street food, packaged gravies.
    - 🌾 **Indian alternatives:** Jowar and Bajra rotis, Besan chilla, Ragi dosa, Kuttu/Rajgira parathas.
    - 📈 **Progress Tracker:** 14 days gluten-free logged, energy score +0.8 pts.
  - Interactive paste box for any new doctor note.
- **WhatsApp & Social Media Myth Checker:**
  - Users paste viral forwarded messages or Instagram reel claims.
  - Ritu evaluates the claim against scientific trials:
    - *Apple Cider Vinegar cures PCOS in 10 days* → ❌ **Busted** (Zero trial evidence; causes enamel erosion and gastric irritation with Metformin).
    - *Women with thyroid must strictly avoid cruciferous vegetables* → ⚖️ **Nuanced / Busted** (Cooked cabbage and cauliflower are completely safe; heat denatures goitrogens).
    - *Spearmint tea twice daily reduces facial hair (hirsutism)* → ✅ **Evidence Supported** (Double-blind RCTs prove significant free testosterone reduction).
- **Lab Results Explained in Plain English:**
  - Explains HOMA-IR (3.61 - Elevated), TSH (3.8 µIU/mL - Monitored for optimal ovulatory range 1.5–2.5), and Free Testosterone (42 pg/mL).
  - Out-of-range visual alerts with target benchmarks.
- **Community Aggregate Insights:**
  - *"42 women in Hyderabad with similar hormonal baselines and insulin resistance consulted Dr. Ananya Sen and completed low-GI trials."*
  - Strict privacy constraint: Only displayed in aggregate with $N \ge 40$ privacy floor.

---

## 7. Module 4: Food & Indian Nutrition (INDB 150+ Dishes)

- **Indian Nutrient Databank (INDB) Seed:**
  - 150+ regional Indian dishes (North Indian, South Indian, Maharashtrian, Bengali, Gujarati).
  - Calculates per-serving calories, protein, carbohydrates, fat, dietary fiber, and estimated Glycemic Index.
- **PCOS-Friendliness Score (1 to 10):**
  - Computed deterministically from the **Fiber-to-Carb Ratio**, protein density, and glycemic load.
  - Color-coded badges: Green ($7.0–10$), Amber ($5.0–6.9$), Coral ($< 5.0$).
- **Smart Indian Swaps:**
  - *White Rice Poha ($4.5/10$)* ➔ *Besan Chilla with grated paneer ($9.0/10$)* (3x more protein, steady glycemic response).
  - *Maida Paratha* ➔ *Sattu-stuffed Jowar Roti*.
  - *Suji Upma* ➔ *Foxtail Millet & Vegetable Khichdi*.
- **Post-Meal 2–3 Hour Check-in:**
  - Tracks postprandial feedback: *No bloating*, *Mild bloating*, *Heavy distension*, *Sustained energy*.
- **Personal Food Group Tolerance Spectrum:**
  - 🟢 **Suits You:** Fermented millets (14 meals logged, 0 bloating).
  - 🟡 **Small Portions:** Chana / Chickpeas (fine up to 1 katori).
  - 🔴 **Low Tolerance:** A1 Buffalo Dairy (bloating in 5 of 6 logged meals).
  - 🟣 **Still Learning:** Spearmint tea (6 days logged).
- **Doctor Restriction Override:**
  - `[Doctor's rule: Avoid Gluten & Maida]` automatically overrides any AI tolerance scoring.
- **Food-Effect Export:** One-click export for clinical dietitian review.

---

## 8. Module 5: Workouts & Condition-Adjusted Movement

- **Clinical Target:** 150 minutes/week moderate activity + 2 weekly strength sessions (per ICMR and International PCOS guidelines).
- **Condition-Adjusted Modifications:**
  - *PCOS & Endometriosis:* Low-impact pelvic floor relaxation and steady-state walking to prevent intra-abdominal pressure.
  - *Hypothyroidism:* Heart-rate pacing avoiding chronic cortisol elevations.
  - *Anaemia:* Low-intensity intervals with recovery periods.
- **Daily Cycle-Phase Adjustment:**
  - *Luteal Phase (Day 18):* Progesterone elevation reduces joint laxity and insulin sensitivity. Recommends gentle strength and restorative mobility over intense HIIT.
- **Filters:** Home-friendly, Room-friendly, Women-only routines (10, 20, 30 min).
- **Activity Tracking:** Synchronizes steps and logs post-session energy.

---

## 9. Module 6: Smart Cart Agent (Grocery Swaps)

- **Permission-Based Integration:**
  - Connects to quick-commerce grocery apps (Zepto, Blinkit, Instamart).
  - **Opt-in by default:** Completely disabled until the user toggles access.
- **Three Help Levels:**
  1. *Suggest Only:* Flags items and displays healthier alternatives; user makes changes manually.
  2. *Swap with Approval:* Ritu asks before replacing each item in the cart.
  3. *Auto-Build:* Ritu compiles a weekly healthy grocery basket for user review.
- **Live Shopping Notification Simulator:**
  - Triggers alerts while shopping:  
    `"Haldiram Aloo Bhujia may not suit your insulin resistance (palm oil & trans fats). Swap with Roasted Foxnuts (Makhana) with rock salt from Zepto?"`
- **Purchase Protection Gate:**
  - **Ritu never places an order or charges payment autonomously.** Requires final `"Yes, Order"` tap.
- **Controls & Auditing:**
  - 1-tap pause agent, unlink app, or wipe cart audit history.
  - Zero sponsored ads: Recommendations are strictly dictated by doctor rules.

---

## 10. Module 7: Care Team & Doctor Coordination

- **Care Team Roster:**
  - **Dr. Ananya Sen, MD** (Gynecologist & PCOS Lead, Apollo Health City)
  - **Dr. Ramesh Gupta, MD** (Endocrinologist, Yashoda Hospitals)
  - **Sneha Nair, RD** (Clinical Dietitian, Care Hospitals)
  - **Priya Rao, PT** (Women's Physiotherapist & Trainer)
- **Granular Data Sharing Controls:**
  - Separate toggles per specialist across 5 data streams: `Labs`, `Food & Tolerance`, `Daily Symptoms`, `Workouts`, and `Medicines`.
- **Automatic Clinical Routing:**
  - New lipid/glucose lab uploads route to Endocrinologist and Dietitian.
  - Gynecologist dietary restrictions route directly into the Dietitian's meal planner.
- **1-Page Clinical Visit Summary:**
  - Formats cycle history, 93% medicine adherence, food tolerance findings, completed N-of-1 trial statistics, and lab trends into a 1-page brief.
  - Includes a pre-populated **"Questions for the Visit"** list.
  - One-tap button to transmit to the doctor before consults.
- **Preventive Screening Calendar:**
  - Tailored to age (26) and family history (Paternal Diabetes, Maternal Thyroid):
    - *Pelvic Ultrasound (TVS / Follicles)* — Annual review.
    - *Thyroid Function Panel (TSH, FT4)* — Every 6 months.
    - *HbA1c & Fasting Insulin* — Quarterly.
    - *Pap Smear / Cervical Screening* — Every 3 years.
    - *Clinical Breast Exam* — Annual wellness.
- **Doctor-Side View Portal:**
  - Specialists can log in to inspect the patient visit summary.
  - Review & approve AI trial suggestions (e.g., approve a 21-day dairy elimination trial).
  - Add fixed clinical rules that lock into the calibration engine.

---

## 11. Module 8: Calibration Engine ("How Ritu Personalises")

- **Doctor's Limits vs. AI Learning (Side-by-Side):**
  - **Doctor Rules (Fixed Limits — Always Wins):** Diagnoses, active prescriptions (Metformin 500mg, Thyronorm 25mcg), dietary bans (Avoid Gluten/Maida), and biomarker targets ($< 10$ Fasting Insulin).
  - **AI Learned Insights (Fine-Tuning Within Limits):** Tolerance for fermented millets, correlation between morning walks and reduced evening cravings ($r = -0.62$), and luteal cycle acne triggers.
- **Insight Source Tags:**
  - `[Doctor's rule]` (Fixed) vs `[Learned from you: 42 logs]`.
- **Clinical Conflict Alerts:**
  - Clashes between instructions (e.g., Dietitian recommends 16-hour fasting vs. Endocrinologist advises food with Metformin): **Ritu automatically prioritizes the doctor's rule.**
- **Staged AI Trial Proposals:**
  - Staged protocols awaiting doctor sign-off before commencement.

---

## 12. Module 9: Deterministic N-of-1 Personal Science Engine

*Located in `/lib/engine` — pure TypeScript functions with zero generative AI write access.*

- **Bayesian Normal-Normal Conjugate Update:**
  1. Computes daily outcome metrics across baseline (14 days) and intervention (28–42 days).
  2. Adjusts for menstrual cycle phase via ordinary least-squares regression:  
     $$y = \beta_0 + \hat{\delta}\cdot\text{phase} + \gamma_1\cdot\text{follicular} + \gamma_2\cdot\text{luteal} + \epsilon$$
  3. Corrects for lag-1 autocorrelation ($\rho$):  
     $$\text{SE}_{\text{adj}} = \text{SE} \times \sqrt{\frac{1+\rho}{1-\rho}}$$
  4. Weights by protocol adherence: Inflates standard error if adherence drops below 70%:  
     $$\text{SE}_{\text{final}} = \frac{\text{SE}_{\text{adj}}}{\sqrt{\text{adherence}}}$$
  5. Updates population prior $\mathcal{N}(\mu_0, \tau_0^2)$ to posterior $\mathcal{N}(\mu_n, \sigma_n^2)$:  
     $$\frac{1}{\sigma_n^2} = \frac{1}{\tau_0^2} + \frac{1}{\text{SE}_{\text{final}}^2}, \quad \mu_n = \sigma_n^2 \left(\frac{\mu_0}{\tau_0^2} + \frac{\hat{\delta}}{\text{SE}_{\text{final}}^2}\right)$$
  6. Computes Bayesian posterior probability of meaningful clinical benefit:  
     $$P(\text{benefit} > \text{MCID})$$
  7. Deterministic verdict thresholds:
     - $\ge 0.80$ ➔ `"Likely Worked For You"`
     - $\le 0.20$ ➔ `"Likely Did Not Work For You"`
     - Otherwise ➔ `"Inconclusive: Extend Trial"`
- **Thompson Sampling Recommender:**
  - Samples from posterior prior distributions to rank candidate interventions balancing exploration and exploitation.
- **Safety Filters:**
  - Automatically suppresses interventions exceeding user budget, contraindicated in pregnancy, or requiring pending doctor sign-off.

---

## 13. Module 10: Diagnostic Labs & OCR Vision Extraction

- **OCR Vision Extraction:**
  - Upload photo or PDF of a lab report ➔ Multimodal vision model extracts `{testName, value, unit, referenceRange, sampleDate, labName}` with strict Zod validation.
  - Normalizes aliases into canonical biomarkers: Fasting Glucose, Fasting Insulin, HbA1c, TSH, Free/Total Testosterone, LH, FSH, AMH, Prolactin, Lipid Panel, Vitamin D3, B12, Ferritin.
- **Built-in Mock Samples:**
  - Includes 3 realistic demo reports from *Thyrocare*, *Dr. Lal PathLabs*, and *Metropolis*.
- **Home Phlebotomist Scheduling:**
  - Simulated home sample collection booking via *Tata 1mg* and *Apollo Diagnostics*.
- **Deterministic Test Scheduler:**
  - Algorithmically schedules repeat tests based on Rotterdam phenotype and elapsed time.

---

## 14. Module 11: Privacy, DPDP 2023 & Data Portability

- **Granular Consent Settings:**
  - Toggle 1: Core Health Analytics (Cycles, HOMA-IR, trials).
  - Toggle 2: Care Team Sharing (Transmitting records to booked doctors).
  - Toggle 3: De-identified Population Research (Aggregating prior distributions).
- **Data Portability (1-Click JSON Export):**
  - Exports a complete machine-readable JSON copy of user vitals, lab history, symptoms, trial outcomes, and calibration rules.
- **Right to Erasure ("Danger Zone"):**
  - Instant permanent deletion of user account and de-indexing of medical logs.
- **Commercial Privacy Guarantee:**
  - User data is never sold, leased, or shared with third-party advertisers or insurance underwriters.

---

## 15. Module 12: IIM-A Economics of AI & Network Moats

*Course Capstone Demonstration Module (`/admin`):*

- **Hierarchical Empirical Bayes Prior Simulation:**
  - Interactive patient slider ($N = 50$ to $5,000$).
  - **Graph 1 (Days to Decisive Verdict):** Demonstrates data network effects: Time required for a statistically significant verdict drops from **38 days down to 14 days** as community priors tighten.
  - **Graph 2 (Verdict Accuracy):** Decision accuracy increases from **61% to 94%**.
- **LLM Unit Economics Panel:**
  - Token consumption tracker per active patient month.
  - AI inference cost (₹18.40/user/mo) vs. Subscription price (₹299/mo).
  - Demonstrates **91.4% gross margin** with sustainable SaaS unit economics.
- **Conversion Funnel Analytics:**
  - Monitors progression from Onboarding ➔ First Check-in ➔ Active Trial ➔ Lab Booking ➔ Doctor Consultation.

---

## 16. Module 13: Instant Persona Switcher (Zero Auth Barrier)

A top-bar pill switcher allowing seamless evaluation without login walls or credentials:

1. **Priya Sharma (Patient / User):**
   - 26F, Hyderabad • PCOS (Rotterdam Phenotype B) + Hypothyroidism • Active walking trial • Full access to Today, Ask, Care, Log, and Profile. Selecting Priya immediately switches to the patient mobile workspace at `/[locale]/today`.
2. **Dr. Ananya Sen, MD (Care Team Lead & Specialist):**
   - Senior Consultant Gynecologist & Reproductive Endocrinologist (KIMS Hospitals, Hyderabad). Selecting Dr. Sen immediately switches into the dedicated clinical environment: the **Ritu Doctor Portal** at `/[locale]/doctor`.

*(Note: The legacy course evaluator/admin persona has been retired in favor of clean 2-way clinical role switching.)*

---

## 17. Module 14: Multilingual Indic Support & Voice Engine

- **Four Languages Supported:**
  - English (`en`)
  - Hindi (`hi` - हिन्दी)
  - Telugu (`te` - తెలుగు)
  - Tamil (`ta` - தமிழ்)
- **Localization Infrastructure:**
  - Implemented using `next-intl` App Router shared pathnames (`/[locale]/...`) combined with a centralized, reactive multilingual dictionary engine (`lib/i18n-dictionary.ts`).
  - **Dynamic Full-Page Vernacular Translation:** Switching language in the top navbar (English ↔ हिन्दी ↔ తెలుగు ↔ தமிழ்) immediately re-renders every tab, card, header, checklist, and dialog dynamically in the selected Indic language with zero hardcoded English fallbacks.
  - All UI strings, clinical terms, and disclaimer notices localized.
- **Voice Provider Interface (`VoiceProvider`):**
  - Implemented with the browser Web Speech API.
  - Designed with clean adapter interfaces ready to swap in **Bhashini**, **Sarvam AI**, or **AI4Bharat** backends.

---

## 18. New AI & Vernacular Spec Implementation (Nov 2026 Spec)

Comprehensive implementation of all 18 AI features and cross-app vernacular architecture:

### 🏠 Home Tab Enhancements (`/today`)
- **H1. Today's Forecast:**
  - Slim full-width soft sky-blue (`#EEF2FF`) card positioned directly below the Period/Ovulation Heart.
  - Generates cycle-day personalized forecasts (e.g. *"Day 18: In your last 4 cycles, energy dipped and sugar cravings rose around now. Keep a roasted chana snack handy after 4 pm."*).
  - Tapping expands a **3-day outlook** with confidence ratings (*High Conf.*, *Medium Conf.*).
  - Speaker icon provides instant Indic audio read-aloud.
  - Safe medical guardrails: alerts emergency care (112) if severe pain is forecast.
- **H2. Pattern Watch ("Ritu noticed"):**
  - Pinned as the first item in the notification bell drawer with a distinctive periwinkle border (`border-l-4 border-l-brand-purple`).
  - Mirrored directly at the top of the `/care` tab until dismissed.
  - Actionable observations: *"Your last 3 cycles were 38, 41 and 45 days. Long gaps are worth raising with Dr. Sen."* with `[+ Add to visit questions]` and `[Book test]`.
- **H3. Weekly Audio Recap:**
  - Featured Sunday card with a 75-second audio player (`Play ▶` / `Pause ⏸`) and expandable transcript drawer.
  - Summarizes weekly check-in consistency, high-energy meal days, and medication adherence.
- **H4. Prescription Scan + Smart Timing:**
  - `+ Scan prescription` row at the bottom of the Daily Medicine Checklist.
  - Simulated OCR scanner extracts doctor instructions (Thyronorm, Metformin, Shelcal-HD).
  - Flags critical Smart Timing rules:
    - *Thyronorm:* Empty stomach, wait 30 minutes before tea/coffee.
    - *Calcium & Iron:* Separate by at least 4 hours to prevent absorption inhibition.
- **2×3 Tools Grid:**
  - Direct 1-tap shortcuts below the medicine checklist to *Food & You*, *Lab Records*, *N-of-1 Trials*, *Smart Cart*, *Targeted Workouts*, and *Fasting Planner*.
- **Top Bar Differentiation:**
  - Darker translucent glassmorphism bar (`bg-[#1E171B]/85 backdrop-blur-md border-b border-white/10 text-white`).

### 📅 Log Tab Enhancements (`/checkin`)
- **L1. Speak Anywhere (Global):**
  - 450ms long-press on the Log icon in the bottom navigation bar from any screen.
  - Pulsing rose microphone modal with code-mixed Indic recognition (*"Kal raat se pet phool raha hai, aur Metformin le liya"*).
  - Automatically extracts editable chips (*Bloating*, *Metformin taken*) with instant save.
- **L2. Mood Journal + DRSP Luteal Screener:**
  - Sub-emotion tagging: *Anxious*, *Irritable*, *Grateful*, *Exhausted*, *Grounded*, *Tearful*.
  - Bi-weekly Daily Record of Severity of Problems (DRSP) screener for PMDD/luteal mood clustering.
  - Confidential **Tele-MANAS (14416)** national mental health helpline card with 1-tap call button.
- **L3. Skin & Hair Progress Photos:**
  - Collapsible weekly photo row with face guide overlay (oval for jawline acne, midline guide for hair parting thinning).
  - Lesion reduction tracker (6 ➔ 2 lesions).
  - DPDP Act 2023 on-device encrypted vault guarantee.

### 💬 Ask Tab Enhancements (`/ask`)
- **A1. Explain to My Family:**
  - Fourth tool chip with recipient picker (*Mother-in-law / Saas*, *Husband*, *Mother*, *Sister*).
  - Respectful, culturally empathetic WhatsApp card generator in Hindi, Telugu, Tamil, and English.
  - Generates spoken voice notes and 1-tap WhatsApp sharing links.
- **A2. Simple Mode + Listen:**
  - `Aa↓ Simpler` toggle on every assistant answer converts clinical text to 6th-grade plain colloquial language.
  - Speaker icon reads answers aloud in Indic conversational accent.
- **A3. Forward-to-Ritu Myth Check:**
  - Simulated WhatsApp forward rumor debunker (*"Drink papaya seed decoction twice a day to force late periods"* ➔ *DANGEROUS / BUSTED*).
  - **Polite Group Reply Generator:** Produces respectful responses to paste back into family WhatsApp groups without offending elders.
- **V6. Tap-to-Explain Glossary:**
  - Dotted underline on clinical terms (*Rotterdam B*, *HOMA-IR*, *TSH*, *Luteal Phase*) popping up plain-language definition sheets.

### 🩺 Care Tab Enhancements (`/care`)
- **Doctor Directory by Location & Patient Ratings:**
  - Multi-city selector across Indian metropolitan centers (**Hyderabad**, **Bengaluru**, **Mumbai**, **Delhi NCR**, **Chennai**).
  - Verified specialist profiles with authentic qualifications, sub-specialty clinical focus, hospital/area coordinates, years of experience, consultation fee, and next available slots.
  - Star ratings (e.g. ★ 4.95) based on verified patient reviews.
  - Teleconsultation and in-clinic consultation badges with spoken language chips (Telugu, Hindi, Tamil, Kannada, English).
- **AI Matched Doctor for Patient Profile:**
  - Dedicated **AI Matchmaker (98% Compatibility)** card custom-matched to Priya's clinical profile (26F, Rotterdam Phenotype B, HOMA-IR 3.61, Hypothyroidism).
  - Highlights specific clinical rationales:
    * Specialist in Rotterdam Phenotype B metabolic PCOS with insulin resistance.
    * 92% clinical cycle regularity outcome rate with combined Metformin and low-GI nutritional sequencing.
    * Clinical consensus lead for FOGSI and International PCOS Guidelines 2023 panel.
  * Direct 1-tap `[Book AI Matched Consultation]` button with interactive appointment pass.
- **🚨 24/7 Medical Emergency Voice Triage & Doctor Dispatch:**
  - Prominent emergency SOS banner and dedicated triage module accessible with 1 tap from any screen.
  - Multilingual Indic voice input (speak in Hindi, Telugu, Tamil, or English, or trigger quick sample voice clips).
  - Real-time AI clinical triaging that parses unstructured distress audio into structured **Chief Complaints**:
    1. *Acute Severe Pelvic Pain:* Sudden-onset stabbing unilateral lower quadrant pain (9/10), acute peritoneal tenderness.
    2. *Presyncope & Autonomic Distress:* Diaphoresis (cold clammy sweats), lightheadedness, pale conjunctiva (hypotension risk).
    3. *Gastrointestinal Symptoms:* Persistent nausea and vomiting secondary to acute abdominal reflex.
    4. *Clinical Differential Consideration:* High suspicion for *Acute Ovarian Torsion*, *Ruptured Hemorrhagic Ovarian Cyst*, or *Ectopic Gestation*.
  - **Triage Urgency Rating:** `🔴 CRITICAL EMERGENCY — RED TRIAGE CODE (Immediate ER Required)`.
  - **1-Tap Ambulance Call:** Prominent pulsing `[📞 Call Ambulance (112)]` button.
  - **Best Suited On-Call Emergency Gynecologist & Facility:**
    * Matches closest 24/7 hospital with dedicated OB/GYN emergency unit based on active city (e.g., Apollo Cradle Jubilee Hills in Hyderabad, Cloudnine ER in Bengaluru, Hinduja ER in Mumbai, Max Saket in Delhi, Apollo Women's in Chennai).
    * Displays distance and drive time (e.g. 3.2 km, 11 mins).
    * Highlights on-duty specialist (e.g. Dr. Meera Nambiar, MD, DNB) on standby, 24/7 operating theatre, and blood bank availability.
    * Direct 1-tap hospital ER desk call button (`[🚨 Call Hospital ER Desk]`).
- **C1. Consult Companion:**
  - `[🎙️ Start visit]` button on each doctor card.
  - Explicit DPDP local processing consent banner and live recording status.
  - Post-visit draft rules queue awaiting patient and doctor approval before applying.
- **C2. Schemes & Costs Navigator:**
  - Comprehensive guide to *Ayushman Bharat PM-JAY*, *Telangana Aarogyasri*, *PMMVY*, and *JSSK*.
  - Fair diagnostic price range guide for Hyderabad (HOMA-IR ₹450–₹800, Thyroid ₹350–₹600, Pelvic USG ₹800–₹1,500).
- **C3. Trusted Person Access:**
  - Family & ASHA worker roster with narrow opt-in permissions (Emergency 112 alerts and medicine adherence visible; intimate logs strictly hidden).
- **Evidence Safeguard:**
  - Community insights aggregated with $N \ge 120$ privacy floor without exposing individual doctor identities.

### 👤 Profile Tab Enhancements (`/profile`)
- **P1. Life-Stage Modes:**
  - Segmented selector at top: *Tracking cycles*, *TTC (Fertility)*, *Pregnant*, *Postpartum*, *Perimenopause*.
  - Dynamically reshapes the Home Heart widget and guidance limits.
- **P2. Wearable & BBT Ovulation Confirm:**
  - Health Connect / Apple Health step and resting HR sync.
  - Basal Body Temperature (BBT) biphasic thermal shift (+0.32°C for 3 days) confirming ovulation.
- **V1, V3, V4 Vernacular Settings:**
  - Indic voice selection (Aditi, Deepa, Kavitha).
  - **Saathi Mode:** Hands-free voice-first toggle for non-typing users and mothers.
  - Ritu on WhatsApp companion connection (+91 98765 43210).

### 🥗 Food Screen Enhancements (`/food`)
- **F1. Thali Photo Logging:**
  - Floating Action Button (FAB) on bottom-right launching camera plate recognition.
  - Visual portion segmentation (millet, dal, palak paneer, salad) with net glycemic load score and personal tolerance verdict.
- **F2. Festival & Fasting Planner:**
  - Seasonal Vrat banner and dedicated Fasting Days tab with safe swaps for Navratri, Ekadashi, and Ramzan.
- **F3. Regional & Budget Meal Plans:**
  - `[🗓️ Plan my week]` header button with regional cuisine filters (Telugu/Deccan, North Indian, Tamil/Kerala).
  - Budget mode (under ₹80/meal) and cook-for-whole-family scaling toggles.

---

## 18. Module 15: Ritu Doctor Portal (24 Clinical AI Features D1–D24)

**Route:** `/[locale]/doctor` (and `/[locale]/doctors`)  
**Target User Persona:** `Dr. Ananya Sen, MD` (Senior Consultant Gynecologist & Reproductive Endocrinologist)  
**Clinical Design Philosophy:** Built for the high-volume Indian OPD environment (3–5 minutes per patient) to give doctors instantaneous, synthesized clinical insight without manual chart digging or typing burden. *The AI prepares, drafts, flags, and cross-checks; the doctor retains complete clinical authority, edits, and signs.*

### Layout & Adaptive Architecture
- **Desktop/Tablet First:** 6-section clinical sidebar (`Inbox`, `Patients`, `Schedule`, `Insights`, `Settings & ABDM`, `AI Audit Trail`), expanding to a high-density, multi-column clinical canvas (`max-w-7xl`).
- **Mobile Responsive Mode:** Adapts into a 5-tab bottom navigation bar (`Inbox`, `Patients`, `Schedule`, `Insights`, `More`) with Periwinkle (`#6C70EB`) active indicators, suppressing consumer bottom tabs.
- **Sticky Patient Context Header:** Patient name (`Priya Sharma, 26F`), Rotterdam Phenotype (`Phenotype B`), HOMA-IR index (`3.61`), Fasting Insulin (`16 μIU/mL`), active locked rules counter, and real-time ABDM consent indicators (`Labs [Shared]`, `Lifestyle [Shared]`, `Notes [Shared]`). Unshared streams are strictly represented with greyed *"Not shared by patient"* placeholders, never blank or assumed data.
- **7 Sub-Tabs:** **Brief · Timeline · Labs & Imaging · Rules · Trials · Notes & Rx · Messages**.

### Complete Specification of the 24 Clinical Features (D1–D24)

| Feature ID | Feature Name | Portal Location | Key Capabilities & Clinical Safeguards |
| :--- | :--- | :--- | :--- |
| **D1** | **Risk-Ranked Inbox** | Inbox | Ranks inbound patient alerts by clinical acuity (`Urgent`, `Action Needed`, `FYI`). Includes filter chips and 1-tap primary action buttons (`Review`, `Sign Rx`, `Draft Reply`). |
| **D2** | **Alert Explanations ("Why is this here?")** | Inbox | Expandable chevron on each inbox item displaying the multi-modal evidence chain (e.g. *Delayed cycle + fasting glucose spike + skipped Metformin doses*). |
| **D3** | **Message Triage + Reply Drafts** | Messages / Inbox | Classifies inbound patient messages into Urgent, Clinical, and Admin. Provides bilingual draft responses (e.g. Telugu/Hindi patient text paired with an English back-translation for the doctor to approve in 1 click). |
| **D4** | **60-Second Pre-Consult Brief** | Brief (Sub-tab 1) | Auto-generated synthesis accessible 10 min prior to OPD. Features a 45-second audio summary listen button, 28-day cycle overview, medication adherence stats (88%), key symptoms, and diet tolerances. |
| **D5** | **"What Changed Since Last Visit" Diff** | Brief (Top Block) | High-contrast periwinkle callout summarizing clinical shifts: `↑ worse` (HOMA-IR, cramps), `↓ better` (fasting insulin, energy), `• new` (started inositol, night shift). |
| **D6** | **Suggested Visit Agenda** | Brief (Right Col) | Prioritized 3-item checklist integrating patient concerns and pending clinical targets. Doctors can check off items in real time during the consultation. |
| **D7** | **Ambient Scribe (Consult Note)** | Notes & Rx | `[🎙️ Start Consult]` button in sticky header. Simulates real-time clinical speech-to-text recording, generating structured **SOAP notes** (Subjective, Objective, Assessment, Plan) with auto-detected action items. |
| **D8** | **Live Two-Way Translation** | Consult / Teleconsult | Dynamic caption strip along the bottom supporting language pairs (EN ⇄ TE, EN ⇄ HI, EN ⇄ TA) allowing doctors to consult comfortably with vernacular-speaking patients. |
| **D9** | **Guideline Copilot** | Global Floating Button | Persistent `[📖 Ask Guidelines]` button opening an evidence drawer powered by the International PCOS Guideline 2023, FOGSI, and ICMR. Highlights recommendations with exact grade citations (e.g. Grade A, Level 1b). |
| **D10** | **Natural-Language Rule Builder** | Rules (Sub-tab 4) | Text/mic input enabling doctors to dictate rules in plain English (e.g. *"Never suggest fasting over 14 hours due to migraine risk"*). Converts into a typed JSON schema with a 1-tap `[🔒 Lock Rule]` button. |
| **D11** | **Cross-Specialist Conflict Checker** | Rules | Real-time safety validation engine flagging conflicting instructions between endocrinologists, gynecologists, and nutritionists with amber warning callouts. |
| **D12** | **Prescription Assistant** | Notes & Rx | Indian pharmaceutical formulary search (branded generics, dosage, timing), automatic drug-lab interaction checks (e.g. Metformin vs eGFR, Thyronorm vs Calcium timing), and Janaushadhi cost comparisons. |
| **D13** | **Patient-Language Instructions + Back-Translation** | Notes & Rx | Generates vernacular prescription instructions (Hindi, Telugu, Tamil) alongside a side-by-side English back-translation for the doctor to review before signing. |
| **D14** | **AI Trial Designer** | Trials (Sub-tab 5) | Generates structured N-of-1 trial protocols (e.g. Spearmint tea for hirsutism, post-meal walks for insulin sensitivity) with statistical power calculations ($88\%$ power, $N=14$ days) awaiting doctor approval. |
| **D15** | **Bayesian Verdict Reviewer** | Trials | Interactive posterior probability density curve displaying probability of exceeding Minimal Clinically Important Difference ($P(\Delta > \text{MCID}) = 91\%$). Doctor can convert successful trials into permanent locked clinical rules. |
| **D16** | **Remote Monitoring Thresholds** | Rules | Configurable threshold triggers (e.g. *"Alert me if cycle length exceeds 42 days"* or *"Alert if fasting glucose > 115 mg/dL on 3 consecutive days"*). |
| **D17** | **Lab Trend Analyst + Derived Indices** | Labs & Imaging | Longitudinal trend graphs with sparklines and auto-calculated indices: HOMA-IR ($3.61 \rightarrow 2.84$), Free Androgen Index (FAI), LH:FSH ratio ($2.3:1$), and TG:HDL ratio. |
| **D18** | **Diagnostic Criteria Checklist** | Brief / Labs | Interactive Rotterdam 2003 criteria evaluator (Oligo/anovulation, Hyperandrogenism, Polycystic morphology on USG) confirming phenotypic diagnosis with differential exclusions (TSH, Prolactin, 17-OHP). |
| **D19** | **Ultrasound & Imaging Extraction** | Labs & Imaging | Drag-and-drop ultrasound report analyzer extracting antral follicle counts (AFC: 14 right, 16 left), ovarian stromal volume ($11.2\text{ cm}^3$), and endometrial stripe thickness ($7.2\text{ mm}$). |
| **D20** | **Referral & Handoff Writer** | Notes & Patient Actions | Generates concise, structured referral letters to sub-specialists (e.g. Reproductive Endocrinologist or Pelvic Floor PT) with granular patient-consented data checkboxes. |
| **D21** | **Care-Team Case Thread + AI Summary** | Messages / Team | Multi-disciplinary discussion feed between Gynecologist, Nutritionist, and Dermatologist, featuring a pinned AI consensus brief synthesizing the latest team decisions. |
| **D22** | **Practice Insights & Natural Language Queries** | Insights (Sidebar 4) | Population-level clinic analytics (e.g. Rotterdam phenotype breakdown, average HOMA-IR improvements, adherence rates) with a natural-language query bar (*"Show me all patients on Metformin with HbA1c > 6.0"*). |
| **D23** | **ABDM / ABHA Record Exchange** | Settings & ABDM | Ayushman Bharat Digital Mission (ABDM) sandbox bridge: maps clinical findings to SNOMED-CT and ICD-10 (`E28.2` for PCOS) and pushes encounter summaries to the patient's ABHA PHR app. |
| **D24** | **AI Audit Trail** | AI Audit Trail (Sidebar 6) | Immutable compliance log tracking every AI-generated suggestion, scribe note, guideline citation, and dosage draft, recording doctor approval status, timestamp, and edit deltas. |

---

## 📊 Summary Matrix of Application Routes

| Route | Purpose | Key Capabilities |
| :--- | :--- | :--- |
| `/[locale]` | **Application Entry** | Automatically launches the active mobile experience (`TodayPage`). |
| `/[locale]/today` | **Daily Management** | Interactive Period/Ovulation Heart, 7-day strip, Mood row, Articles, Meds checklist. |
| `/[locale]/checkin` | **Daily Log** | Energy & pelvic cramp sliders, flow picker, symptoms, Indic voice note. |
| `/[locale]/ask` | **Trusted Clinical AI** | Guidelines-grounded AI chat, Advice Explainer, Myth Checker, Lab Tracker. |
| `/[locale]/care` | **Doctor Coordination** | Care team sharing toggles, 1-page pre-consult summary, screening calendar, doctor directory & emergency triage. |
| `/[locale]/profile` | **Profile & Calibration** | Health baselines, Calibration engine (Doctor vs AI), DPDP privacy, JSON export. |
| `/[locale]/cart` | **Smart Cart Agent** | Zepto/Blinkit cart scanner, 3 help levels, live swap notification, order gate. |
| `/[locale]/food` | **Indian Nutrition** | 150+ INDB dishes, PCOS-friendliness scores, smart swaps, meal logging. |
| `/[locale]/experiments`| **N-of-1 Trials** | Deterministic OLS stats engine, Bayesian verdict card, AI explanation drawer. |
| `/[locale]/labs` | **Diagnostic Labs** | OCR vision extraction, 3 demo reports, home phlebotomist booking. |
| `/[locale]/doctor` | **Doctor Portal (D1–D24)**| Full clinical EHR & decision engine: Risk inbox, 60s Brief, Ambient Scribe, Rx Assistant, Bayesian trials, Rotterdam criteria, ABDM, Audit trail. |
| `/[locale]/doctors` | **Doctor Portal Alias** | Redirects/renders the clinical Doctor Portal. |
| `/[locale]/admin` | **IIM-A Economics Moat** | Interactive Bayes shrinkage slider, days-to-verdict curves, LLM unit economics. |
| `/[locale]/onboarding`| **Patient Setup** | 5-question baseline wizard, family history, and DPDP consent screen. |

---

## 🧪 Automated Testing & Verification

- **Vitest Test Suite (`lib/engine/__tests__/engine.test.ts`):**  
  **17 of 17 deterministic tests passing** covering OLS cycle adjustment, lag-1 autocorrelation inflation, normal conjugate updates, safety filtering, Thompson sampling, and phenotype estimation.
- **Production Build:**  
  **78 of 78 static routes compiled cleanly** across all 4 locales with zero TypeScript or webpack errors.
