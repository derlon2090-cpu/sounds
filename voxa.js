const THEME_KEY = "mulhem_theme_v2";
const LANG_KEY = "mulhem_lang_v2";
const FAV_KEY = "mulhem_voxa_favorites_v3";
const TONEFORGE_KEY = "mulhem_toneforge_preset_v1";

const themeToggle = document.getElementById("themeToggle");
const langAr = document.getElementById("langAr");
const langEn = document.getElementById("langEn");
const toTopBtn = document.getElementById("toTopBtn");
const voiceGrid = document.getElementById("voiceGrid");
const textInput = document.getElementById("textInput");
const styleSelect = document.getElementById("styleSelect");
const voiceSelect = document.getElementById("voiceSelect");
const speed = document.getElementById("speed");
const pitch = document.getElementById("pitch");
const energy = document.getElementById("energy");
const pauses = document.getElementById("pauses");
const speedValue = document.getElementById("speedValue");
const pitchValue = document.getElementById("pitchValue");
const energyValue = document.getElementById("energyValue");
const pauseValue = document.getElementById("pauseValue");
const estimateOutput = document.getElementById("estimateOutput");
const targetDurationRange = document.getElementById("targetDurationRange");
const targetDurationInput = document.getElementById("targetDurationInput");
const recommendedDurationOutput = document.getElementById("recommendedDurationOutput");
const wordCountOutput = document.getElementById("wordCountOutput");
const durationHint = document.getElementById("durationHint");
const durationResetBtn = document.getElementById("durationResetBtn");
const suggestBtn = document.getElementById("suggestBtn");
const bestBtn = document.getElementById("bestBtn");
const previewBtn = document.getElementById("previewBtn");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const saveBtn = document.getElementById("saveBtn");
const statusBox = document.getElementById("statusBox");
const engineAudio = document.getElementById("engineAudio");
const engineMeta = document.getElementById("engineMeta");
const favoriteList = document.getElementById("favoriteList");

let currentLang = "ar";
let currentVoiceId = "siraj";
let generatedBlob = null;
let generatedUrl = "";
const timingState = {
  baselineSpeed: 1,
  suggestedDuration: 12,
  actualDuration: 12,
  wordCount: 1
};

const copy = {
  ar: {
    title: "Voxa™ | تحويل النص إلى صوت | مُلهم ساوند",
    theme_dark: "الوضع الليلي",
    theme_light: "الوضع النهاري",
    nav_home: "الرئيسية",
    nav_writewave: "WriteWave",
    nav_toneforge: "ToneForge",
    hero_title: "أنشئ تعليقًا صوتيًا عربيًا أو جرّب أكثر من صوت قبل التصدير",
    hero_lead: "رفعنا Voxa من صفحة إعدادات عامة إلى مكتبة أصوات أقرب للبيع: أسماء أوضح، فئات استخدام، إعدادات عملية، ومفضلات محفوظة للمشاريع المتكررة.",
    hero_primary: "ابدأ تجربة الصوت",
    hero_secondary: "افتح WriteWave",
    hero_tag_1: "أصوات مسمّاة بوضوح",
    hero_tag_2: "بودكاست / إعلان / تعليم",
    hero_tag_3: "أفضل إعداد تلقائيًا",
    hero_problem_title: "مكتبة أصوات أوضح",
    hero_problem_text: "هذه الصفحة تُظهر الأصوات كمنتج فعلي: اسم، وصف، استخدام، ومفضلات بدل إبقائها خيارات عامة غير مقنعة.",
    hero_now_title: "الاقتراح الذكي",
    hero_now_text: "صارت المنصة تساعدك على اختيار الصوت والنمط الأنسب للنص بدل تركك مع قائمة أسماء فقط.",
    hero_next_title: "اتجاه المنتج",
    hero_next_text: "الخطوة التالية هي رفع جودة المحرك الصوتي نفسه، مع الحفاظ على نفس الوضوح في تجربة الاختيار والاستخدام.",
    library_badge: "المكتبة",
    library_title: "اختر الصوت كمنتج، لا كإعداد تقني فقط",
    library_copy: "كل بطاقة تحمل اسمًا ووصفًا واستخدامًا مناسبًا حتى يبدو الاختيار أقرب لمنصات الصوت الاحترافية.",
    studio_badge: "الاستوديو",
    studio_title: "اكتب النص ثم اختر الأسلوب الأنسب",
    speed_label: "السرعة",
    pitch_label: "النبرة",
    energy_label: "الحيوية",
    pauses_label: "إيقاع الوقفات",
    estimate_title: "المدة التقديرية",
    target_duration_title: "المدة المستهدفة",
    duration_reset_btn: "إعادة للمدة الذكية",
    recommended_duration: "اقتراح النظام: {value} ثانية",
    word_count_label: "عدد الكلمات: {value}",
    seconds_unit: "ثانية",
    duration_hint_balanced: "هذه المدة قريبة من الاقتراح الذكي للنص الحالي.",
    duration_hint_slow: "رفعت المدة، لذلك سنبطئ القراءة ليخرج الصوت بهدوء أكبر.",
    duration_hint_fast: "قللت المدة، لذلك سنسرع القراءة مقارنة بالاقتراح الذكي.",
    suggest_btn: "اقتراح صوت",
    best_btn: "أفضل إعداد تلقائيًا",
    preview_btn: "تجربة الصوت",
    generate_btn: "توليد WAV",
    download_btn: "تنزيل WAV",
    save_btn: "حفظ كمفضل",
    favorites_title: "المفضلات وآخر الإعدادات",
    favorites_empty: "لا توجد مفضلات بعد.",
    status_idle: "اختر الصوت أو الإعداد المناسب ثم جرّب المعاينة أو احفظ الإعداد ضمن المفضلات.",
    status_suggested: "تم اقتراح الصوت {voice} بناءً على النص الحالي.",
    status_best: "تم تطبيق أفضل إعدادات تلقائيًا حسب نوع النص.",
    status_loaded: "تم اختيار {voice}. يمكنك الآن تعديل السرعة والنبرة أو تشغيل المعاينة.",
    status_preview: "جارٍ تشغيل معاينة صوتية لـ {voice}.",
    status_saved: "تم حفظ {voice} ضمن المفضلات.",
    status_restore: "تمت استعادة {voice} من المفضلات.",
    status_imported: "تم استيراد إعداد ToneForge إلى {voice}. يمكنك الآن تشغيل المعاينة أو التوليد.",
    status_generating: "جارٍ توليد ملف WAV عبر Mulhem Engine لصوت {voice}.",
    status_generated: "تم توليد ملف WAV لصوت {voice}. يمكنك التشغيل أو التنزيل الآن.",
    status_downloaded: "تم تجهيز تنزيل ملف WAV لصوت {voice}.",
    status_engine_error: "تعذّر الوصول إلى Mulhem Engine. شغّل الخادم المحلي عبر npm start ثم أعد المحاولة.",
    status_error: "تعذّر تشغيل المعاينة الصوتية على هذا المتصفح حاليًا.",
    estimate_seconds: "{value} ثانية تقريبًا",
    listen_btn: "استمع",
    use_btn: "استخدم الصوت",
    voice_sample_label: "جملة المعاينة",
    engine_title: "مخرجات المحرك",
    engine_idle: "عند تشغيل الخادم المحلي سيظهر هنا ملف WAV الناتج من Mulhem Engine.",
    engine_ready: "تم تجهيز ملف WAV بطول تقريبي {value}.",
    voice_select_label: "اختر الصوت",
    style_select_label: "اختر الأسلوب",
    demo_text: "مرحبًا بكم في Voxa من مُلهم ساوند. هنا يمكننا تحويل النص إلى صوت عربي واضح يصلح للبودكاست، التعليم، الإعلانات، والمحتوى اليومي."
  },
  en: {
    title: "Voxa™ | Text To Speech | Mulhem Sound",
    theme_dark: "Dark Mode",
    theme_light: "Light Mode",
    nav_home: "Home",
    nav_writewave: "WriteWave",
    nav_toneforge: "ToneForge",
    hero_title: "Create Arabic voiceovers or compare multiple voices before export",
    hero_lead: "We moved Voxa from a plain settings page into a stronger voice library: clearer names, use-case categories, practical controls, and saved favorites for repeated projects.",
    hero_primary: "Start Voice Demo",
    hero_secondary: "Open WriteWave",
    hero_tag_1: "Clearly named voices",
    hero_tag_2: "Podcast / Ad / Education",
    hero_tag_3: "Auto best settings",
    hero_problem_title: "A clearer voice shelf",
    hero_problem_text: "This page now presents voices like real product options: a name, a use-case, a description, and a way to save favorites.",
    hero_now_title: "Smart guidance",
    hero_now_text: "The platform now helps suggest a voice and a preset based on the content instead of leaving the user with names only.",
    hero_next_title: "Product direction",
    hero_next_text: "The next step is improving the engine quality itself while keeping the current clarity of the selection flow.",
    library_badge: "Library",
    library_title: "Choose a voice like a product, not just a technical setting",
    library_copy: "Each card carries a name, description, and a practical use-case so the choice feels closer to premium audio platforms.",
    studio_badge: "Studio",
    studio_title: "Write your text, then choose the right style",
    speed_label: "Speed",
    pitch_label: "Pitch",
    energy_label: "Energy",
    pauses_label: "Pause Rhythm",
    estimate_title: "Estimated Duration",
    target_duration_title: "Target Duration",
    duration_reset_btn: "Reset To Smart Timing",
    recommended_duration: "System suggestion: {value} seconds",
    word_count_label: "Words: {value}",
    seconds_unit: "seconds",
    duration_hint_balanced: "This timing is close to the smart recommendation for the current text.",
    duration_hint_slow: "You increased the duration, so playback will slow down for a calmer read.",
    duration_hint_fast: "You reduced the duration, so playback will speed up compared with the smart recommendation.",
    suggest_btn: "Suggest Voice",
    best_btn: "Auto Best Settings",
    preview_btn: "Preview Voice",
    generate_btn: "Generate WAV",
    download_btn: "Download WAV",
    save_btn: "Save Favorite",
    favorites_title: "Favorites And Recent Settings",
    favorites_empty: "No favorites saved yet.",
    status_idle: "Choose a voice or preset, then preview it or save it to favorites.",
    status_suggested: "Suggested {voice} based on the current text.",
    status_best: "Applied the best automatic settings based on the content.",
    status_loaded: "Selected {voice}. You can now adjust speed, pitch, or play a preview.",
    status_preview: "Playing a preview for {voice}.",
    status_saved: "Saved {voice} to favorites.",
    status_restore: "Restored {voice} from favorites.",
    status_imported: "Imported a ToneForge preset into {voice}. You can preview or generate now.",
    status_generating: "Generating a WAV file for {voice} through Mulhem Engine.",
    status_generated: "Generated a WAV file for {voice}. You can play or download it now.",
    status_downloaded: "Prepared the WAV download for {voice}.",
    status_engine_error: "Could not reach Mulhem Engine. Start the local server with npm start, then try again.",
    status_error: "Audio preview is currently unavailable in this browser.",
    estimate_seconds: "About {value} seconds",
    listen_btn: "Listen",
    use_btn: "Use Voice",
    voice_sample_label: "Preview line",
    engine_title: "Engine Output",
    engine_idle: "Once the local server is running, the generated WAV from Mulhem Engine will appear here.",
    engine_ready: "WAV file ready with an estimated length of {value}.",
    voice_select_label: "Choose voice",
    style_select_label: "Choose style",
    demo_text: "Welcome to Voxa from Mulhem Sound. Here we can turn text into clear Arabic speech for podcasting, education, advertising, and everyday content."
  }
};

const styles = {
  podcast: {
    ar: "بودكاست",
    en: "Podcast",
    speed: 1.0,
    pitch: 0,
    energy: 52,
    pauses: 44
  },
  ad: {
    ar: "إعلان",
    en: "Ad",
    speed: 1.15,
    pitch: 1,
    energy: 78,
    pauses: 24
  },
  education: {
    ar: "تعليمي",
    en: "Education",
    speed: 0.95,
    pitch: -1,
    energy: 46,
    pauses: 38
  },
  story: {
    ar: "قصصي",
    en: "Storytelling",
    speed: 0.86,
    pitch: 1,
    energy: 58,
    pauses: 62
  }
};

const voices = [
  {
    id: "siraj",
    icon: "🎙️",
    nameAr: "سِراج",
    nameEn: "Siraj",
    badgeAr: "رسمي",
    badgeEn: "Formal",
    dialectAr: "فصحى تنفيذية",
    dialectEn: "Executive MSA",
    toneAr: "واثق ومنظّم",
    toneEn: "Confident and structured",
    useAr: "عروض ومقدمات تنفيذية",
    useEn: "Executive intros and formal demos",
    descAr: "صوت رجالي رسمي بثقة أعلى ووتيرة أكثر ثباتًا.",
    descEn: "A formal male voice with a steadier, more confident delivery.",
    voiceId: "mulhem-siraj-v1",
    langCode: "ar-SA",
    voiceHints: ["hamed", "saudi", "male", "ar-sa"],
    voiceIndex: 0,
    sampleAr: "مرحبًا بكم. يسعدنا تقديم هذا الملخص التنفيذي بصوت رسمي واضح ومنظّم.",
    sampleEn: "Welcome. This is a formal executive-style sample with a steady and confident tone.",
    style: "education",
    rate: 0.9,
    pitch: -2,
    energy: 34,
    pauses: 52
  },
  {
    id: "lujain",
    icon: "✨",
    nameAr: "لُجين",
    nameEn: "Lujain",
    badgeAr: "واضح",
    badgeEn: "Clear",
    dialectAr: "فصحى واضحة",
    dialectEn: "Clear MSA",
    toneAr: "هادئ ومباشر",
    toneEn: "Calm and direct",
    useAr: "شرح وتعليم",
    useEn: "Explainers and education",
    descAr: "صوت نسائي أنيق يركز على الوضوح والهدوء.",
    descEn: "An elegant female voice focused on clarity and calm delivery.",
    voiceId: "mulhem-lujain-v1",
    langCode: "ar-SA",
    voiceHints: ["zariyah", "female", "saudi", "ar-sa"],
    voiceIndex: 1,
    sampleAr: "أهلًا بك. في هذا الشرح سنرتب الفكرة خطوة بخطوة بصوت مريح وواضح.",
    sampleEn: "Hello there. This explainer sample is designed to sound calm, clear, and easy to follow.",
    style: "education",
    rate: 1.02,
    pitch: 2,
    energy: 44,
    pauses: 46
  },
  {
    id: "ruwad",
    icon: "📻",
    nameAr: "رَواد",
    nameEn: "Ruwad",
    badgeAr: "إذاعي",
    badgeEn: "Radio",
    dialectAr: "فصحى إذاعية",
    dialectEn: "Broadcast MSA",
    toneAr: "قوي وحاضر",
    toneEn: "Bold and present",
    useAr: "هوية ومقدمات",
    useEn: "Intros and sonic branding",
    descAr: "صوت إذاعي أقوى حضورًا للمقدمات والإعلانات الأطول.",
    descEn: "A radio-style voice with stronger presence for intros and branded reads.",
    voiceId: "mulhem-ruwad-v1",
    langCode: "ar-EG",
    voiceHints: ["shakir", "broadcast", "male", "ar-eg"],
    voiceIndex: 2,
    sampleAr: "هنا تبدأ الهوية الصوتية للمحتوى. حضور إذاعي أوضح للمقدمات والافتتاحيات.",
    sampleEn: "This is a broadcast-style sample built for intros, sonic identity, and high-presence reads.",
    style: "ad",
    rate: 1.08,
    pitch: -1,
    energy: 76,
    pauses: 26
  },
  {
    id: "nouf",
    icon: "🌿",
    nameAr: "نوف",
    nameEn: "Nouf",
    badgeAr: "خليجي",
    badgeEn: "Gulf",
    dialectAr: "خليجي دافئ",
    dialectEn: "Warm Gulf",
    toneAr: "محلي وقريب",
    toneEn: "Local and warm",
    useAr: "محتوى محلي",
    useEn: "Local content",
    descAr: "صوت خليجي دافئ أقرب للتجارب المحلية والسوشيال.",
    descEn: "A warm Gulf-style voice that feels closer to local users and social content.",
    voiceId: "mulhem-nouf-v1",
    langCode: "ar-SA",
    voiceHints: ["saudi", "female", "zariyah", "ar-sa"],
    voiceIndex: 3,
    sampleAr: "يا هلا. هذا نموذج صوت خليجي دافئ يناسب المحتوى المحلي واليومي بشكل أقرب.",
    sampleEn: "Here is a warmer Gulf-style sample tailored for regional content and local audiences.",
    style: "podcast",
    rate: 0.98,
    pitch: 1,
    energy: 52,
    pauses: 42
  },
  {
    id: "sami",
    icon: "⚡",
    nameAr: "سامي",
    nameEn: "Sami",
    badgeAr: "شبابي",
    badgeEn: "Youth",
    dialectAr: "عربي شبابي",
    dialectEn: "Youthful Arabic",
    toneAr: "سريع وحيوي",
    toneEn: "Fast and lively",
    useAr: "سوشيال ويوتيوب",
    useEn: "Social and creator content",
    descAr: "نبرة أخف للمحتوى السريع واليومي.",
    descEn: "A lighter tone built for social media and fast-paced creator content.",
    voiceId: "mulhem-sami-v1",
    langCode: "ar-SA",
    voiceHints: ["male", "saudi", "ar-sa", "young"],
    voiceIndex: 4,
    sampleAr: "أهلًا! هذا مثال أسرع للمحتوى القصير والسوشيال والريلز واليوميات.",
    sampleEn: "This faster sample fits creator content, shorts, and social media voiceovers.",
    style: "ad",
    rate: 1.18,
    pitch: 2,
    energy: 78,
    pauses: 20
  },
  {
    id: "atheer",
    icon: "📖",
    nameAr: "أثير",
    nameEn: "Atheer",
    badgeAr: "قصصي",
    badgeEn: "Story",
    dialectAr: "فصحى سردية",
    dialectEn: "Narrative MSA",
    toneAr: "هادئ وسردي",
    toneEn: "Soft and narrative",
    useAr: "قصص وبودكاست",
    useEn: "Stories and podcasts",
    descAr: "أسلوب سردي هادئ للمحتوى الطويل.",
    descEn: "A softer storytelling style for long-form narrative content.",
    voiceId: "mulhem-atheer-v1",
    langCode: "ar-SA",
    voiceHints: ["arabic", "soft", "narrative", "female"],
    voiceIndex: 5,
    sampleAr: "كان يا ما كان، في بداية الحكاية، يظهر الصوت الهادئ ليقود السرد بسلاسة.",
    sampleEn: "Once upon a time, a softer narrative voice carried the story with a slower, calmer rhythm.",
    style: "story",
    rate: 0.88,
    pitch: 1,
    energy: 40,
    pauses: 64
  },
  {
    id: "juman",
    icon: "🎓",
    nameAr: "جُمان",
    nameEn: "Juman",
    badgeAr: "تعليمي",
    badgeEn: "Education",
    dialectAr: "فصحى تعليمية",
    dialectEn: "Educational MSA",
    toneAr: "مرتب وواضح",
    toneEn: "Structured and clear",
    useAr: "دروس وشروحات",
    useEn: "Lessons and explainers",
    descAr: "صوت أنيق للدروس والتسجيلات التوضيحية.",
    descEn: "A refined voice for lessons, explainers, and guided learning content.",
    voiceId: "mulhem-juman-v1",
    langCode: "ar-SA",
    voiceHints: ["clear", "female", "education", "ar-sa"],
    voiceIndex: 6,
    sampleAr: "في هذا الدرس سنراجع الفكرة الأساسية، ثم ننتقل إلى الخطوات واحدة بعد الأخرى.",
    sampleEn: "In this lesson, we will review the core idea first, then move through the steps one by one.",
    style: "education",
    rate: 0.96,
    pitch: 0,
    energy: 46,
    pauses: 50
  },
  {
    id: "barq",
    icon: "📣",
    nameAr: "برق",
    nameEn: "Barq",
    badgeAr: "إعلاني",
    badgeEn: "Ad",
    dialectAr: "إعلاني قوي",
    dialectEn: "High-energy promo",
    toneAr: "سريع وحاسم",
    toneEn: "Punchy and urgent",
    useAr: "عروض قصيرة",
    useEn: "Short promotional reads",
    descAr: "إيقاع أسرع ووقفة أقل للعبارات الإعلانية.",
    descEn: "Faster pacing and shorter pauses for ad copy and short promos.",
    voiceId: "mulhem-barq-v1",
    langCode: "ar-SA",
    voiceHints: ["male", "strong", "promo", "ar-sa"],
    voiceIndex: 7,
    sampleAr: "عرض اليوم يبدأ الآن. جرّب الفرق بسرعة، واطلب الخدمة خلال ثوانٍ.",
    sampleEn: "Today’s offer starts now. Hear the difference fast and launch your promo in seconds.",
    style: "ad",
    rate: 1.24,
    pitch: -2,
    energy: 88,
    pauses: 14
  }
];

function setText(node, value) {
  if (node) node.textContent = value;
}

function updateThemeText() {
  setText(themeToggle, document.body.dataset.theme === "dark" ? copy[currentLang].theme_light : copy[currentLang].theme_dark);
}

function applyTheme(theme) {
  document.body.dataset.theme = theme === "dark" ? "dark" : "light";
  updateThemeText();
  localStorage.setItem(THEME_KEY, document.body.dataset.theme);
}

function voiceName(voice) {
  return currentLang === "ar" ? voice.nameAr : voice.nameEn;
}

function voiceBadge(voice) {
  return currentLang === "ar" ? voice.badgeAr : voice.badgeEn;
}

function voiceUse(voice) {
  return currentLang === "ar" ? voice.useAr : voice.useEn;
}

function voiceDialect(voice) {
  return currentLang === "ar" ? voice.dialectAr : voice.dialectEn;
}

function voiceTone(voice) {
  return currentLang === "ar" ? voice.toneAr : voice.toneEn;
}

function voiceSample(voice) {
  return currentLang === "ar" ? voice.sampleAr : voice.sampleEn;
}

function voiceDesc(voice) {
  return currentLang === "ar" ? voice.descAr : voice.descEn;
}

function styleLabel(styleId) {
  return styles[styleId][currentLang];
}

function currentVoice() {
  return voices.find((item) => item.id === currentVoiceId) || voices[0];
}

function currentStyle() {
  return styles[styleSelect.value] || styles.podcast;
}

function countWords(text) {
  return Math.max(1, String(text || "").trim().split(/\s+/).filter(Boolean).length);
}

function detectTextLang(text) {
  return /[\u0600-\u06FF]/.test(text) ? "ar" : "en";
}

function voiceDurationFactor(voiceId) {
  const map = {
    siraj: 1.04,
    lujain: 1.0,
    ruwad: 0.96,
    nouf: 1.03,
    sami: 0.88,
    atheer: 1.18,
    juman: 1.08,
    barq: 0.84,
    robot: 0.92
  };
  return map[voiceId] || 1;
}

function styleDurationFactor(styleId) {
  const map = {
    podcast: 1.0,
    ad: 0.82,
    education: 1.04,
    story: 1.18
  };
  return map[styleId] || 1;
}

function durationBounds(suggestedDuration) {
  return {
    min: Math.max(3, Number((suggestedDuration * 0.55).toFixed(1))),
    max: Math.min(360, Number((suggestedDuration * 1.9 + 4).toFixed(1)))
  };
}

function setBaselineSpeed(value = Number(speed.value)) {
  timingState.baselineSpeed = Math.max(0.55, Math.min(1.65, Number(value) || 1));
}

function updateDurationHint(suggestedDuration, actualDuration) {
  const delta = actualDuration - suggestedDuration;
  if (delta > 1.1) {
    setText(durationHint, copy[currentLang].duration_hint_slow);
    return;
  }
  if (delta < -1.1) {
    setText(durationHint, copy[currentLang].duration_hint_fast);
    return;
  }
  setText(durationHint, copy[currentLang].duration_hint_balanced);
}

function computeSuggestedDuration() {
  const voice = currentVoice();
  const sourceText = textInput.value.trim() || voiceSample(voice);
  const words = countWords(sourceText);
  const lang = detectTextLang(sourceText);
  const punctuationCount = (sourceText.match(/[.!?,;:\u060c\u061b\u061f]/g) || []).length;
  const baseSecondsPerWord = lang === "ar" ? 0.46 : 0.34;
  const pauseFactor = 0.84 + (Number(pauses.value) / 100) * 0.42;
  const energyFactor = 1 - (((Number(energy.value) || 50) - 50) / 350);
  const suggestion =
    words * baseSecondsPerWord * voiceDurationFactor(voice.id) * styleDurationFactor(styleSelect.value) * pauseFactor * energyFactor +
    punctuationCount * (0.08 + (Number(pauses.value) / 100) * 0.06) +
    1.05;

  return {
    words,
    suggestedDuration: Number(Math.max(3.5, Math.min(360, suggestion)).toFixed(1))
  };
}

function syncDurationFields(actualDuration, suggestedDuration) {
  const { min, max } = durationBounds(suggestedDuration);
  const resolved = Math.max(min, Math.min(max, Number(actualDuration.toFixed(1))));
  targetDurationRange.min = String(min);
  targetDurationRange.max = String(max);
  targetDurationInput.min = String(min);
  targetDurationInput.max = String(max);
  targetDurationRange.value = String(resolved);
  targetDurationInput.value = resolved.toFixed(1);
}

function updateEstimate() {
  const { words, suggestedDuration } = computeSuggestedDuration();
  const currentSpeed = Math.max(0.55, Math.min(1.65, Number(speed.value) || timingState.baselineSpeed || 1));
  const actualDuration = Number((suggestedDuration * (timingState.baselineSpeed || 1) / currentSpeed).toFixed(1));

  timingState.wordCount = words;
  timingState.suggestedDuration = suggestedDuration;
  timingState.actualDuration = actualDuration;

  setText(estimateOutput, copy[currentLang].estimate_seconds.replace("{value}", actualDuration.toFixed(1)));
  setText(recommendedDurationOutput, copy[currentLang].recommended_duration.replace("{value}", suggestedDuration.toFixed(1)));
  setText(wordCountOutput, copy[currentLang].word_count_label.replace("{value}", words));
  syncDurationFields(actualDuration, suggestedDuration);
  updateDurationHint(suggestedDuration, actualDuration);
}

function applyTargetDuration(rawValue) {
  const value = Number(rawValue);
  if (!Number.isFinite(value)) return;
  const { min, max } = durationBounds(timingState.suggestedDuration || 8);
  const target = Math.max(min, Math.min(max, value));
  const nextSpeed = Math.max(
    0.55,
    Math.min(1.65, (timingState.baselineSpeed || 1) * ((timingState.suggestedDuration || target) / target))
  );
  speed.value = nextSpeed.toFixed(2);
  syncControls();
  clearGeneratedAudio();
}

function syncControls() {
  speedValue.textContent = `${Number(speed.value).toFixed(1)}x`;
  pitchValue.textContent = pitch.value;
  energyValue.textContent = `${energy.value}%`;
  pauseValue.textContent = `${pauses.value}%`;
  updateEstimate();
}

function setEngineButtonsState({ generating = false, ready = false } = {}) {
  if (generateBtn) generateBtn.disabled = generating;
  if (downloadBtn) downloadBtn.disabled = !ready || generating;
}

function clearGeneratedAudio() {
  if (generatedUrl) URL.revokeObjectURL(generatedUrl);
  generatedUrl = "";
  generatedBlob = null;
  if (engineAudio) {
    engineAudio.pause();
    engineAudio.removeAttribute("src");
    engineAudio.load();
  }
  setEngineButtonsState({ generating: false, ready: false });
  setText(engineMeta, copy[currentLang].engine_idle);
}

function activeProfile() {
  const baseVoice = currentVoice();
  return {
    ...baseVoice,
    rate: Number(speed.value),
    pitch: Number(pitch.value),
    energy: Number(energy.value),
    pauses: Number(pauses.value),
    targetDuration: Number(targetDurationInput.value) || timingState.actualDuration
  };
}

function describeEngineOutput({ duration, version, voice, style, mode }) {
  const base = copy[currentLang].engine_ready.replace("{value}", duration);
  if (currentLang === "ar") {
    return `${base} • الإصدار ${version} • ${mode} • ${voice} • ${style}`;
  }
  return `${base} • v${version} • ${mode} • ${voice} • ${style}`;
}

function renderVoiceGrid() {
  voiceGrid.innerHTML = voices.map((voice) => `
    <article class="voice-card" data-animate>
      <div class="voice-icon">${voice.icon}</div>
      <div class="voice-meta">
        <span class="voice-badge">${voiceBadge(voice)}</span>
        <span class="voice-badge">${voiceDialect(voice)}</span>
      </div>
      <h3>${voiceName(voice)}</h3>
      <p>${voiceDesc(voice)}</p>
      <div class="voice-facts">
        <span class="voice-fact">${voiceUse(voice)}</span>
        <span class="voice-fact">${voiceTone(voice)}</span>
      </div>
      <div class="voice-sample">
        <strong>${copy[currentLang].voice_sample_label}</strong>
        <span>${voiceSample(voice)}</span>
      </div>
      <div class="voice-actions">
        <button class="btn btn-secondary" type="button" data-preview="${voice.id}">${copy[currentLang].listen_btn}</button>
        <button class="btn btn-primary" type="button" data-use="${voice.id}">${copy[currentLang].use_btn}</button>
      </div>
    </article>
  `).join("");

  document.querySelectorAll("[data-animate]").forEach((node, index) => {
    setTimeout(() => node.classList.add("is-visible"), 80 + index * 45);
  });
}

function renderSelects() {
  styleSelect.setAttribute("aria-label", copy[currentLang].style_select_label);
  voiceSelect.setAttribute("aria-label", copy[currentLang].voice_select_label);

  styleSelect.innerHTML = Object.keys(styles).map((styleId) => `
    <option value="${styleId}">${styleLabel(styleId)}</option>
  `).join("");

  voiceSelect.innerHTML = voices.map((voice) => `
    <option value="${voice.id}">${voiceName(voice)} — ${voiceBadge(voice)} • ${voiceDialect(voice)}</option>
  `).join("");

  voiceSelect.value = currentVoiceId;
}

function loadVoice(id) {
  const voice = voices.find((item) => item.id === id) || voices[0];
  currentVoiceId = voice.id;
  voiceSelect.value = voice.id;
  styleSelect.value = voice.style;
  speed.value = voice.rate;
  pitch.value = voice.pitch;
  energy.value = voice.energy;
  pauses.value = voice.pauses;
  setBaselineSpeed(speed.value);
  syncControls();
  clearGeneratedAudio();
  setText(statusBox, copy[currentLang].status_loaded.replace("{voice}", voiceName(voice)));
}

function suggestVoiceId() {
  const text = textInput.value.trim();
  if (!text) return currentVoiceId;
  if (/عرض|خصم|إعلان|اشترك|اطلب الآن|سارع|launch|promo|offer|sale|discount/i.test(text)) return "barq";
  if (/كان يا ما كان|حكاية|قصة|رواية|novel|story|once upon/i.test(text)) return "atheer";
  if (/في هذا الدرس|سنتعلم|شرح|خطوة|course|lesson|tutorial|training|lecture/i.test(text)) return "juman";
  if (/بودكاست|حلقة|ضيف|مقدّمة|podcast|episode|guest|intro/i.test(text)) return "ruwad";
  if (/يا هلا|حياكم|وش|هال|أبشر|معنا اليوم|gulf|khaleeji/i.test(text)) return "nouf";
  if (/ريلز|تيك توك|سناب|يوتيوب|shorts|reel|social|creator|tiktok|youtube/i.test(text)) return "sami";
  if (/أهلًا|مرحبًا|تعرف على|خطوات|guide|walkthrough|explainer/i.test(text)) return "lujain";
  if (/يسرنا|يسعدنا|التقرير|الإدارة|الشركة|executive|report|statement|board/i.test(text)) return "siraj";
  return "siraj";
}

function applyBestSettings() {
  const id = suggestVoiceId();
  const voice = voices.find((item) => item.id === id) || voices[0];
  loadVoice(id);
  const bump = /!|؟|\?|promo|launch|عرض|إعلان/i.test(textInput.value) ? 8 : 4;
  energy.value = Math.min(100, Number(energy.value) + bump);
  setBaselineSpeed(speed.value);
  syncControls();
  setText(statusBox, copy[currentLang].status_best);
  return voice;
}

function preferredSpeechVoice(langCode, profile = voices[0]) {
  const available = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  if (!available.length) return null;

  const desiredCodes = [currentLang === "ar" ? profile.langCode : null, langCode]
    .filter(Boolean)
    .map((code) => code.toLowerCase());

  let filtered = available.filter((item) => {
    const candidate = item.lang.toLowerCase();
    return desiredCodes.some((code) => candidate.startsWith(code));
  });

  if (!filtered.length) {
    const baseCode = currentLang === "ar" ? "ar" : "en";
    filtered = available.filter((item) => item.lang.toLowerCase().startsWith(baseCode));
  }

  if (!filtered.length) filtered = available;

  const hinted = filtered.find((item) => {
    const ref = `${item.name} ${item.voiceURI} ${item.lang}`.toLowerCase();
    return (profile.voiceHints || []).some((hint) => ref.includes(hint.toLowerCase()));
  });

  return hinted
    || filtered[profile.voiceIndex % filtered.length]
    || filtered[0]
    || null;
}

function computeSpeechRate(profile) {
  const base = Number(profile.rate) || 1;
  const energyBoost = ((Number(profile.energy) || 50) - 50) / 240;
  const pauseDrag = ((Number(profile.pauses) || 40) - 40) / 260;
  return Math.max(0.74, Math.min(1.34, base + energyBoost - pauseDrag));
}

function computeSpeechPitch(profile) {
  return Math.max(0.55, Math.min(1.85, 1 + (Number(profile.pitch) || 0) * 0.12));
}

function computeSpeechVolume(profile) {
  return Math.max(0.72, Math.min(1, 0.72 + (Number(profile.energy) || 50) / 380));
}

function stylizePreviewText(text, voice, useSample = false) {
  let output = text.replace(/\s+/g, " ").trim();
  if (!output) output = voiceSample(voice);

  if (voice.id === "barq") {
    output = output.replace(/\s*[.]+$/u, "");
    if (currentLang === "ar" && useSample) output = `${output} جرّب الآن.`;
    if (currentLang === "en" && useSample) output = `${output} Try it now.`;
  }

  if (voice.id === "atheer") {
    output = output.replace(/([.؟!?])/gu, " ... ");
  }

  if (voice.id === "juman") {
    output = output.replace(/[:؛]/gu, ". ");
  }

  if (voice.id === "sami" && !/[!؟?]$/u.test(output)) {
    output = `${output}${currentLang === "ar" ? "!" : "!"}`;
  }

  return output.replace(/\s{2,}/g, " ").trim();
}

function previewTextForVoice(voice, useSample = false) {
  const source = useSample ? voiceSample(voice) : (textInput.value.trim() || voiceSample(voice));
  return stylizePreviewText(source, voice, useSample);
}

function previewVoice(voiceId = currentVoiceId) {
  const voice = voices.find((item) => item.id === voiceId) || voices[0];
  const useDefaults = voiceId !== currentVoiceId;
  const profile = useDefaults ? voice : {
    ...voice,
    rate: Number(speed.value),
    pitch: Number(pitch.value),
    energy: Number(energy.value),
    pauses: Number(pauses.value)
  };
  const text = previewTextForVoice(voice, useDefaults);

  if (!("speechSynthesis" in window)) {
    setText(statusBox, copy[currentLang].status_error);
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = currentLang === "ar" ? (profile.langCode || "ar-SA") : "en-US";
  utterance.rate = computeSpeechRate(profile);
  utterance.pitch = computeSpeechPitch(profile);
  utterance.volume = computeSpeechVolume(profile);
  const matchedVoice = preferredSpeechVoice(currentLang === "ar" ? (profile.langCode || "ar") : "en", voice);
  if (matchedVoice) utterance.voice = matchedVoice;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  setText(statusBox, copy[currentLang].status_preview.replace("{voice}", voiceName(voice)));
}

async function generateEngineAudio({ autoDownload = false } = {}) {
  const profile = activeProfile();
  const sourceVoice = voices.find((item) => item.id === currentVoiceId) || voices[0];
  const text = previewTextForVoice(sourceVoice, false);

  setEngineButtonsState({ generating: true, ready: false });
  setText(statusBox, copy[currentLang].status_generating.replace("{voice}", voiceName(sourceVoice)));

  try {
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        engine: "auto",
        voiceId: sourceVoice.id,
        speed: profile.rate,
        pitch: profile.pitch,
        energy: profile.energy,
        pauses: profile.pauses,
        targetDuration: profile.targetDuration,
        styleId: styleSelect.value,
        lang: currentLang
      })
    });

    if (!response.ok) {
      throw new Error(`Engine request failed with ${response.status}`);
    }

    const blob = await response.blob();
    if (!blob.size) throw new Error("Empty audio payload");
    const engineVersion = response.headers.get("X-Mulhem-Engine-Version") || "local";
    const engineDuration = response.headers.get("X-Mulhem-Duration") || estimateOutput.textContent.replace(/^.*?(\d.*)$/u, "$1");
    const engineVoice = response.headers.get("X-Mulhem-Voice") || sourceVoice.id;
    const engineStyle = response.headers.get("X-Mulhem-Style") || styleSelect.value;
    const engineMode = response.headers.get("X-Mulhem-Engine-Mode") || "procedural";

    if (generatedUrl) URL.revokeObjectURL(generatedUrl);
    generatedBlob = blob;
    generatedUrl = URL.createObjectURL(blob);
    engineAudio.src = generatedUrl;
    setEngineButtonsState({ generating: false, ready: true });
    setText(
      engineMeta,
      describeEngineOutput({
        duration: engineDuration,
        version: engineVersion,
        mode: engineMode,
        voice: voiceName(voices.find((item) => item.id === engineVoice) || sourceVoice),
        style: styleLabel(engineStyle)
      })
    );
    setText(statusBox, copy[currentLang].status_generated.replace("{voice}", voiceName(sourceVoice)));

    if (autoDownload) {
      downloadGeneratedAudio();
    } else {
      engineAudio.play().catch(() => {});
    }
  } catch {
    setEngineButtonsState({ generating: false, ready: false });
    setText(engineMeta, copy[currentLang].engine_idle);
    setText(statusBox, copy[currentLang].status_engine_error);
  }
}

function downloadGeneratedAudio() {
  if (!generatedBlob || !generatedUrl) return;
  const voice = voices.find((item) => item.id === currentVoiceId) || voices[0];
  const link = document.createElement("a");
  link.href = generatedUrl;
  link.download = `${voice.id}-${styleSelect.value}.wav`;
  link.click();
  setText(statusBox, copy[currentLang].status_downloaded.replace("{voice}", voiceName(voice)));
}

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveFavorites(items) {
  localStorage.setItem(FAV_KEY, JSON.stringify(items.slice(-8)));
}

function renderFavorites() {
  const items = getFavorites();
  if (!items.length) {
    favoriteList.innerHTML = `<div class="favorite-item favorite-empty">${copy[currentLang].favorites_empty}</div>`;
    return;
  }

  favoriteList.innerHTML = items.slice().reverse().map((item, reversedIndex) => {
    const realIndex = items.length - 1 - reversedIndex;
    return `
      <div class="favorite-item">
        <div>
          <strong>${currentLang === "ar" ? item.nameAr : item.nameEn}</strong>
          <div class="favorite-pill">${item.styleLabel[currentLang]} • ${item.speed}x • pitch ${item.pitch}</div>
        </div>
        <button class="btn btn-secondary" data-fav="${realIndex}" type="button">${copy[currentLang].use_btn}</button>
      </div>
    `;
  }).join("");
}

function saveCurrentFavorite() {
  const voice = voices.find((item) => item.id === currentVoiceId) || voices[0];
  const items = getFavorites();
  items.push({
    id: voice.id,
    nameAr: voice.nameAr,
    nameEn: voice.nameEn,
    styleId: styleSelect.value,
    styleLabel: { ar: styleLabel(styleSelect.value), en: styles[styleSelect.value].en },
    speed: speed.value,
    pitch: pitch.value,
    energy: energy.value,
    pauses: pauses.value
  });
  saveFavorites(items);
  renderFavorites();
  setText(statusBox, copy[currentLang].status_saved.replace("{voice}", voiceName(voice)));
}

function restoreFavorite(index) {
  const item = getFavorites()[index];
  if (!item) return;
  currentVoiceId = item.id;
  renderSelects();
  voiceSelect.value = item.id;
  styleSelect.value = item.styleId;
  speed.value = item.speed;
  pitch.value = item.pitch;
  energy.value = item.energy;
  pauses.value = item.pauses;
  setBaselineSpeed(speed.value);
  syncControls();
  clearGeneratedAudio();
  setText(statusBox, copy[currentLang].status_restore.replace("{voice}", currentLang === "ar" ? item.nameAr : item.nameEn));
}

function consumeToneForgePreset() {
  const raw = localStorage.getItem(TONEFORGE_KEY);
  if (!raw) return false;

  try {
    const preset = JSON.parse(raw);
    const matchedVoice = voices.find((item) => item.id === preset.voiceId) || voices[0];
    currentVoiceId = matchedVoice.id;
    loadVoice(currentVoiceId);

    if (preset.styleId && styles[preset.styleId]) {
      styleSelect.value = preset.styleId;
    }

    if (typeof preset.speed === "number") speed.value = preset.speed;
    if (typeof preset.pitch === "number") pitch.value = preset.pitch;
    if (typeof preset.energy === "number") energy.value = preset.energy;
    if (typeof preset.pauses === "number") pauses.value = preset.pauses;

    const importedText = currentLang === "ar" ? preset.sampleTextAr : preset.sampleTextEn;
    if (importedText) textInput.value = importedText;

    setBaselineSpeed(speed.value);
    syncControls();
    setText(statusBox, copy[currentLang].status_imported.replace("{voice}", voiceName(matchedVoice)));
    localStorage.removeItem(TONEFORGE_KEY);
    return true;
  } catch {
    localStorage.removeItem(TONEFORGE_KEY);
    return false;
  }
}

function updateLocalizedNodes() {
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (copy[currentLang][key]) {
      node.textContent = copy[currentLang][key];
    }
  });
}

function applyLanguage(lang) {
  const previousLang = currentLang;
  const previousText = textInput.value.trim();
  const previousDemo = copy[previousLang]?.demo_text || "";
  currentLang = lang === "en" ? "en" : "ar";
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
  document.title = copy[currentLang].title;
  langAr.classList.toggle("active", currentLang === "ar");
  langEn.classList.toggle("active", currentLang === "en");
  updateLocalizedNodes();
  renderVoiceGrid();
  renderSelects();
  renderFavorites();
  textInput.value = !previousText || previousText === previousDemo ? copy[currentLang].demo_text : previousText;
  applyTheme(document.body.dataset.theme || localStorage.getItem(THEME_KEY) || "light");
  if (!consumeToneForgePreset()) loadVoice(currentVoiceId);
  if (!generatedBlob) {
    setText(engineMeta, copy[currentLang].engine_idle);
    setEngineButtonsState({ generating: false, ready: false });
  } else {
    setEngineButtonsState({ generating: false, ready: true });
  }
  localStorage.setItem(LANG_KEY, currentLang);
}

themeToggle.addEventListener("click", () => {
  applyTheme(document.body.dataset.theme === "dark" ? "light" : "dark");
});

langAr.addEventListener("click", () => applyLanguage("ar"));
langEn.addEventListener("click", () => applyLanguage("en"));

suggestBtn.addEventListener("click", () => {
  const id = suggestVoiceId();
  loadVoice(id);
  const voice = voices.find((item) => item.id === id) || voices[0];
  setText(statusBox, copy[currentLang].status_suggested.replace("{voice}", voiceName(voice)));
});

bestBtn.addEventListener("click", () => {
  applyBestSettings();
});

previewBtn.addEventListener("click", () => {
  previewVoice();
});

generateBtn.addEventListener("click", () => {
  generateEngineAudio();
});

downloadBtn.addEventListener("click", async () => {
  if (!generatedBlob || !generatedUrl) {
    await generateEngineAudio({ autoDownload: true });
    return;
  }
  downloadGeneratedAudio();
});

saveBtn.addEventListener("click", () => {
  saveCurrentFavorite();
});

[speed, pitch, energy, pauses].forEach((input) => {
  input.addEventListener("input", () => {
    syncControls();
    clearGeneratedAudio();
  });
});

targetDurationRange.addEventListener("input", () => {
  applyTargetDuration(targetDurationRange.value);
});

targetDurationInput.addEventListener("input", () => {
  applyTargetDuration(targetDurationInput.value);
});

durationResetBtn.addEventListener("click", () => {
  speed.value = timingState.baselineSpeed.toFixed(2);
  syncControls();
  clearGeneratedAudio();
});

styleSelect.addEventListener("change", () => {
  const style = styles[styleSelect.value];
  speed.value = style.speed;
  pitch.value = style.pitch;
  energy.value = style.energy;
  pauses.value = style.pauses;
  setBaselineSpeed(speed.value);
  syncControls();
  clearGeneratedAudio();
});

voiceSelect.addEventListener("change", () => {
  loadVoice(voiceSelect.value);
});

textInput.addEventListener("input", () => {
  updateEstimate();
  clearGeneratedAudio();
});

voiceGrid.addEventListener("click", (event) => {
  const preview = event.target.closest("[data-preview]");
  const use = event.target.closest("[data-use]");
  if (preview) previewVoice(preview.dataset.preview);
  if (use) loadVoice(use.dataset.use);
});

favoriteList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-fav]");
  if (!button) return;
  restoreFavorite(Number(button.dataset.fav));
});

window.addEventListener("scroll", () => {
  toTopBtn.classList.toggle("visible", window.scrollY > 320);
});

toTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelectorAll("[data-animate]").forEach((node, index) => {
  setTimeout(() => node.classList.add("is-visible"), 80 + index * 55);
});

applyTheme(localStorage.getItem(THEME_KEY) || ((window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light"));
applyLanguage(localStorage.getItem(LANG_KEY) || "ar");
setEngineButtonsState({ generating: false, ready: false });

window.addEventListener("beforeunload", () => {
  if (generatedUrl) URL.revokeObjectURL(generatedUrl);
});
