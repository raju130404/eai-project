export interface HealthySwap {
  id: string;
  name: string;
  description: string;
  whyItWorks: string;
  prepTime: string;
  benefits: string[];
  glycemicImpact: 'Zero' | 'Very Low' | 'Low' | 'Moderate';
  recipeQuickTip: string;
}

export interface CravingCategory {
  id: string;
  title: string;
  emoji: string;
  unhealthyExamples: string[];
  hormonalRootCause: {
    hormone: string;
    explanation: string;
    phaseRelevance: string;
    deficiencyRisk: string;
  };
  swaps: HealthySwap[];
}

export const CRAVING_CATEGORIES: CravingCategory[] = [
  {
    id: 'chocolate_sweets',
    title: 'Chocolate & Sweets',
    emoji: '🍫',
    unhealthyExamples: ['Milk Chocolate Bars', 'Gulab Jamun / Jalebi', 'Pastries & Bakery Donuts', 'Mithai'],
    hormonalRootCause: {
      hormone: 'Progesterone Drop & Magnesium Depletion',
      explanation: 'In the late luteal phase (pre-period) or during insulin resistance, cellular magnesium drops and serotonin synthesis dips. Your brain demands fast dopamine and glucose, which processed sweets temporarily mimic before causing an insulin crash.',
      phaseRelevance: 'Days 21–28 (Luteal / PMS phase) & Rotterdam Phenotype B (Insulin-resistant PCOS)',
      deficiencyRisk: 'Magnesium, Vitamin B6, Tryptophan',
    },
    swaps: [
      {
        id: 'dark_choco_almonds',
        name: '70%+ Dark Chocolate + Roasted Almonds',
        description: '2 squares of 70–85% dark chocolate paired with 8–10 soaked or roasted almonds.',
        whyItWorks: 'Directly replenishes dietary magnesium and polyphenols with healthy monounsaturated fats that prevent an insulin spike.',
        prepTime: 'Instant (1 min)',
        benefits: ['High Magnesium (64mg)', 'Zero Insulin Crash', 'Dopamine Stabilization'],
        glycemicImpact: 'Very Low',
        recipeQuickTip: 'Enjoy mindfully after a main meal so the healthy fats slow down gastric absorption.',
      },
      {
        id: 'date_peanut_cocoa',
        name: 'Medjool Date Stuffed with Peanut Butter & Cocoa',
        description: '1 soft Medjool date slit open, filled with unsweetened peanut butter and dusted with raw cocoa powder.',
        whyItWorks: 'Delivers the rich, chewy satisfaction of a chocolate caramel bar with 3g of prebiotic fiber and potassium.',
        prepTime: '2 mins',
        benefits: ['Natural Potassium', 'High Satiety', 'Slow-Release Energy'],
        glycemicImpact: 'Low',
        recipeQuickTip: 'Keep a batch of 4 in the freezer for an instant fudge-like treat.',
      },
      {
        id: 'cacao_chia_pudding',
        name: 'Chilled Raw Cacao & Coconut Chia Pudding',
        description: '2 tbsp chia seeds soaked in unsweetened coconut milk with 1 tsp raw cacao and a dash of cinnamon.',
        whyItWorks: 'Omega-3 ALA fatty acids reduce ovarian prostaglandins (menstrual cramp drivers) while satisfying creamy chocolate cravings.',
        prepTime: 'Prep ahead (5 mins)',
        benefits: ['Omega-3 Fatty Acids', 'Gut Microbiome Fiber', 'Anti-inflammatory'],
        glycemicImpact: 'Very Low',
        recipeQuickTip: 'Add Ceylon cinnamon to increase peripheral insulin receptor sensitivity.',
      },
    ],
  },
  {
    id: 'fried_savory',
    title: 'Samosa & Fried Snacks',
    emoji: '🥟',
    unhealthyExamples: ['Samosas & Kachoris', 'Deep-Fried Pakoras', 'French Fries & Spring Rolls', 'Fried Murukku'],
    hormonalRootCause: {
      hormone: 'Cortisol & Dopamine Deficit (Stress Cravings)',
      explanation: 'Elevated cortisol combined with hypothalamic-pituitary-adrenal (HPA) axis stress activates the brain’s comfort center, urging you toward dense fried carbohydrates and trans-fats that temporarily dampen stress hormones.',
      phaseRelevance: 'High-stress days, ovulatory shift, or pre-menstrual tension (PMDD)',
      deficiencyRisk: 'Healthy Essential Fatty Acids (Omega-3), Zinc',
    },
    swaps: [
      {
        id: 'spiced_makhana',
        name: 'Pan-Toasted Turmeric Makhana (Foxnuts)',
        description: 'Roasted foxnuts in 1/2 tsp A2 cow ghee with turmeric, rock salt, and chaat masala.',
        whyItWorks: 'Delivers identical crunch and savory aroma without trans-fats, inflammatory palm oil, or blood sugar spikes.',
        prepTime: '4 mins',
        benefits: ['Anti-inflammatory Kaempferol', 'Zero Cholesterol', 'Light & Crunchy'],
        glycemicImpact: 'Low',
        recipeQuickTip: 'Roast on low flame until a nut snaps crisp between two fingers.',
      },
      {
        id: 'airfried_besan_chilla',
        name: 'Crispy Besan & Palak Pinwheel Rolls',
        description: 'Thin chickpea flour chilla cooked with spinach and rolled with green mint-coriander chutney.',
        whyItWorks: 'Provides the familiar samosa-batter spiced chickpea flavor with 8g of plant protein and iron instead of refined maida.',
        prepTime: '8 mins',
        benefits: ['High Plant Protein', 'Folate & Iron for Anaemia', 'Gut-Friendly'],
        glycemicImpact: 'Low',
        recipeQuickTip: 'Cook on a well-seasoned iron tawa with minimal cold-pressed mustard or coconut oil.',
      },
      {
        id: 'roasted_chana_chaat',
        name: 'Tangy Roasted Bengal Gram (Chana) Chaat',
        description: 'Crunchy dry-roasted chana tossed with diced onions, tomatoes, green chillies, lemon juice & cumin.',
        whyItWorks: 'High resistant starch feeds beneficial bifidobacteria and stabilizes insulin for up to 4 hours.',
        prepTime: '3 mins',
        benefits: ['Resistant Starch', 'Prolonged Satiety', 'High Zinc for Skin'],
        glycemicImpact: 'Low',
        recipeQuickTip: 'Leave the dark skins on the chana for maximum insoluble fiber.',
      },
    ],
  },
  {
    id: 'salty_crunchy',
    title: 'Salty Chips & Kurkure',
    emoji: '🍟',
    unhealthyExamples: ['Potato Chips (Lays)', 'Kurkure & Bhujia', 'Salted Peanuts with Palm Oil', 'Salted Biscuits'],
    hormonalRootCause: {
      hormone: 'Adrenal Shift & Progesterone-Driven Diuresis',
      explanation: 'Progesterone has a mild antimineralocorticoid effect that causes natural renal sodium excretion. When progesterone fluctuates, your adrenals signal intense cravings for salt and electrolytes.',
      phaseRelevance: 'Early Luteal to Mid-Luteal Phase (Days 16–22)',
      deficiencyRisk: 'Sodium-Potassium Balance, Hydration, Iodine',
    },
    swaps: [
      {
        id: 'roasted_edamame_peas',
        name: 'Crunchy Himalayan Salt Roasted Edamame',
        description: 'Oven-roasted or dry-toasted edamame (or green peas) sprinkled with pink Himalayan salt and crushed pepper.',
        whyItWorks: 'Provides authentic salty crunch with 12g of complete protein and phytoestrogens that support healthy estrogen metabolism.',
        prepTime: '5 mins',
        benefits: ['Complete Plant Protein', 'Phytoestrogens (Isoflavones)', 'Trace Minerals'],
        glycemicImpact: 'Very Low',
        recipeQuickTip: 'Toss with nutritional yeast or chaat masala for a savory cheesy-umami kick.',
      },
      {
        id: 'cucumber_curd_dip',
        name: 'Chilled Cucumber Rounds + Garlic Herb Hung Curd',
        description: 'Crisp English cucumber slices served with a thick hung curd dip seasoned with garlic, black salt, and dill.',
        whyItWorks: 'High water content and potassium naturally balance fluid retention, relieving pre-menstrual bloating while fulfilling salt cravings.',
        prepTime: '3 mins',
        benefits: ['Hydration & Electrolytes', 'Probiotic Gut Support', 'Zero Bloat'],
        glycemicImpact: 'Very Low',
        recipeQuickTip: 'Use full-fat A2 curd hung in muslin for 20 mins for restaurant-style dip texture.',
      },
      {
        id: 'lotus_stem_chips',
        name: 'Baked Lotus Stem (Kamal Kakdi) Crisps',
        description: 'Thinly sliced lotus root tossed in cold-pressed sesame oil, sea salt, and smoked paprika, baked crisp.',
        whyItWorks: 'Rich in dietary fiber and vitamin C, calming inflammatory cytokines and easing pelvic congestion.',
        prepTime: '10 mins',
        benefits: ['High Dietary Fiber', 'Immune Vitamin C', 'Clean Sodium Source'],
        glycemicImpact: 'Low',
        recipeQuickTip: 'Pat slices completely dry with a cotton cloth before baking to ensure maximum crunch.',
      },
    ],
  },
  {
    id: 'refined_carbs_bakery',
    title: 'White Bread, Pizza & Bakery',
    emoji: '🍚',
    unhealthyExamples: ['White Bread Toast', 'Cheesy Maida Pizza', 'White Rice Bowls with Gravy', 'Bakery Rusks / Pav'],
    hormonalRootCause: {
      hormone: 'Compensatory Hyperinsulinemia (Insulin Resistance)',
      explanation: 'When insulin receptors are sluggish, cells starve for quick glucose even if blood sugar is normal. This drives sudden, uncontrollable cravings for soft refined starches that break down instantaneously in the mouth.',
      phaseRelevance: 'Mid-morning or late-afternoon energy dips (Common in PCOS and Hypothyroidism)',
      deficiencyRisk: 'Chromium, Inositol, B-Complex Vitamins',
    },
    swaps: [
      {
        id: 'millet_pizza_crust',
        name: 'Jowar-Methi Mini Pizza with Paneer & Veggies',
        description: 'Crisp sorghum flatbread base topped with home-cooked tomato-oregano puree, sautéed bell peppers, and fresh paneer.',
        whyItWorks: 'Replaces inflammatory wheat gluten with slow-digesting sorghum and high-satiety dairy protein.',
        prepTime: '10 mins',
        benefits: ['Gluten-Free', 'Low Glycemic Index (~48)', 'High Calcium (200mg)'],
        glycemicImpact: 'Low',
        recipeQuickTip: 'Add grated fresh paneer instead of processed mozzarella for cleaner bioactive peptides.',
      },
      {
        id: 'zucchini_besan_cheela',
        name: 'Zucchini & Moong Dal Waffles / Chilla',
        description: 'Sprouted yellow moong batter blended with grated zucchini, ginger, and cumin, cooked crisp.',
        whyItWorks: 'Provides the warm comfort of bread and bakery carbs while feeding muscle tissue with 14g of lean bioavailable protein.',
        prepTime: '7 mins',
        benefits: ['Sprouted Bio-availability', 'Zero Post-Meal Slump', 'High Folate'],
        glycemicImpact: 'Low',
        recipeQuickTip: 'Pair with spicy peanut chutney for essential monosaturated fats.',
      },
      {
        id: 'bajra_khakhra',
        name: 'Spiced Bajra & Sesame Khakhra',
        description: 'Crisp, roasted pearl millet wafer toasted with white sesame seeds and ajwain.',
        whyItWorks: 'Pearl millet (Bajra) is loaded with iron and magnesium, keeping insulin level and reducing water retention.',
        prepTime: 'Instant (1 min)',
        benefits: ['Iron Rich (for Anaemia)', 'High Magnesium', 'Warm Digestive Spices'],
        glycemicImpact: 'Low',
        recipeQuickTip: 'Dip in warm ginger tea for an invigorating mid-afternoon snack.',
      },
    ],
  },
  {
    id: 'icecream_creamy',
    title: 'Ice Cream & Creamy Dairy',
    emoji: '🍨',
    unhealthyExamples: ['Heavy Cream Ice Cream', 'Store-Bought Milkshakes', 'Kulfi with Commercial Sugar', 'Sweet Lassi with Syrup'],
    hormonalRootCause: {
      hormone: 'Thyroid Hypometabolism & Low Core Temperature',
      explanation: 'Women with subclinical hypothyroidism or luteal temperature shifts often crave cool, soothing, high-fat dairy to coat the digestive tract and provide immediate, dense caloric satisfaction.',
      phaseRelevance: 'Post-ovulatory shift and evening relaxation wind-down',
      deficiencyRisk: 'Calcium, Vitamin D3, Probiotics',
    },
    swaps: [
      {
        id: 'banana_cinnamon_nicecream',
        name: 'Frozen Banana & Cinnamon "Nice-Cream"',
        description: 'Blended frozen banana with 2 tbsp Greek yogurt, a pinch of Ceylon cinnamon, and chopped walnuts.',
        whyItWorks: 'Replicates creamy churned soft-serve with prebiotic inulin fiber, natural potassium, and zero added cane sugar.',
        prepTime: '3 mins',
        benefits: ['Natural Inulin Prebiotics', 'Cinnamon Insulin Support', 'Brain Dopamine'],
        glycemicImpact: 'Low',
        recipeQuickTip: 'Freeze overripe spotted bananas in chunks for the sweetest natural texture.',
      },
      {
        id: 'saffron_hung_curd_shrikhand',
        name: 'Kesar Pista Hung Curd Shrikhand',
        description: 'Strained thick A2 yogurt infused with saffron strands, crushed green cardamom, and raw pistachios.',
        whyItWorks: 'Delivers probiotic Lactobacillus cultures that help metabolize excess estrogens, paired with soothing saffron.',
        prepTime: 'Prep ahead (3 mins)',
        benefits: ['Probiotic Lactobacillus', 'Saffron Mood Uplift', 'Zero Industrial Sugar'],
        glycemicImpact: 'Very Low',
        recipeQuickTip: 'Sweeten with a few drops of natural monk fruit or raw unprocessed honey.',
      },
      {
        id: 'chia_mango_parfait',
        name: 'Coconut-Mango Chia Parfait with Pumpkin Seeds',
        description: 'Layered coconut milk chia seeds with fresh Alphonso/Banganapalli pulp and zinc-rich pumpkin seeds.',
        whyItWorks: 'Pumpkin seeds provide essential zinc to block 5-alpha reductase (the enzyme driving hormonal facial hair and acne).',
        prepTime: '5 mins',
        benefits: ['Zinc for Androgen Reduction', 'Omega-3 ALA', 'Vitamin A for Skin'],
        glycemicImpact: 'Low',
        recipeQuickTip: 'Pumpkin seeds are a cornerstone of cycle-syncing during the follicular phase.',
      },
    ],
  },
  {
    id: 'sweet_beverages',
    title: 'Sweet Chai, Coffee & Sodas',
    emoji: '☕',
    unhealthyExamples: ['3-Spoon Sugar Cutting Chai', 'Caramel Iced Lattes', 'Commercial Colas & Energy Drinks', 'Boba Tea'],
    hormonalRootCause: {
      hormone: 'Adenosine Accumulation & Estrogen-Related Fatigue',
      explanation: 'When ovarian hormones dip, cellular ATP production slows down, making adenosine (the sleepiness molecule) feel heavier. Sugary caffeine gives an artificial adrenaline kick that exhausts the adrenal glands.',
      phaseRelevance: 'Early morning fatigue or the 4 PM afternoon energy dip',
      deficiencyRisk: 'B-Complex Vitamins, Iron, Adrenal Adaptogens',
    },
    swaps: [
      {
        id: 'jeera_buttermilk_chaas',
        name: 'Chilled Jeera-Mint Buttermilk (Chaas)',
        description: 'Whisked thin curd with roasted cumin powder, fresh mint leaves, grated ginger, and a pinch of black salt.',
        whyItWorks: 'Immediately cools internal pitta, hydrates mucosal linings, and stops sugar-craving signals within 5 minutes.',
        prepTime: '2 mins',
        benefits: ['Rapid Hydration', 'Gut-Soothing Probiotics', 'Digestive Cumin (Jeera)'],
        glycemicImpact: 'Very Low',
        recipeQuickTip: 'Drink at 4 PM instead of sugary tea to avoid evening insulin and cortisol surges.',
      },
      {
        id: 'spearmint_iced_tea',
        name: 'Iced Spearmint & Lemon Infusion',
        description: 'Fresh or dried spearmint leaves brewed, chilled, and finished with fresh lemon juice and chia seeds.',
        whyItWorks: 'Clinical trials demonstrate 2 cups of spearmint tea daily significantly reduces free testosterone in women with PCOS.',
        prepTime: '4 mins',
        benefits: ['Clinically Anti-Androgenic', 'Reduces Hirsutism', 'Refreshing & Hydrating'],
        glycemicImpact: 'Zero',
        recipeQuickTip: 'Brew in bulk in the morning and sip chilled throughout your afternoon work sessions.',
      },
      {
        id: 'cinnamon_cardamom_latte',
        name: 'Spiced Golden Almond Milk Latte',
        description: 'Warm unsweetened almond or oat milk simmered with crushed green cardamom, turmeric, and Ceylon cinnamon.',
        whyItWorks: 'Cardamom and cinnamon naturally simulate sweetness on the palate without containing any sucrose or fructose.',
        prepTime: '3 mins',
        benefits: ['Zero Added Sugar', 'Curcumin Anti-Inflammatory', 'Calming Wind-Down'],
        glycemicImpact: 'Zero',
        recipeQuickTip: 'Use a handheld milk frother to create a cozy coffee-shop style foam on top.',
      },
    ],
  },
];
