const THEME_KEY = "mulhem_theme_v2";
const LANG_KEY = "mulhem_lang_v2";
const FAV_KEY = "mulhem_voxa_favorites_v3";

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
const suggestBtn = document.getElementById("suggestBtn");
const bestBtn = document.getElementById("bestBtn");
const previewBtn = document.getElementById("previewBtn");
const saveBtn = document.getElementById("saveBtn");
const statusBox = document.getElementById("statusBox");
const favoriteList = document.getElementById("favoriteList");

let currentLang = "ar";
let currentVoiceId = "siraj";

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
    suggest_btn: "اقتراح صوت",
    best_btn: "أفضل إعداد تلقائيًا",
    preview_btn: "تجربة الصوت",
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
    status_error: "تعذّر تشغيل المعاينة الصوتية على هذا المتصفح حاليًا.",
    estimate_seconds: "{value} ثانية تقريبًا",
    listen_btn: "استمع",
    use_btn: "استخدم الصوت",
    voice_sample_label: "جملة المعاينة",
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
    suggest_btn: "Suggest Voice",
    best_btn: "Auto Best Settings",
    preview_btn: "Preview Voice",
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
    status_error: "Audio preview is currently unavailable in this browser.",
    estimate_seconds: "About {value} seconds",
    listen_btn: "Listen",
    use_btn: "Use Voice",
    voice_sample_label: "Preview line",
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
    rate: 0.95,
    pitch: -1,
    energy: 42,
    pauses: 38
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
    rate: 0.98,
    pitch: 1,
    energy: 48,
    pauses: 42
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
    style: "podcast",
    rate: 1.0,
    pitch: 0,
    energy: 65,
    pauses: 32
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
    rate: 1.02,
    pitch: 1,
    energy: 55,
    pauses: 36
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
    rate: 1.12,
    pitch: 1,
    energy: 72,
    pauses: 22
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
    rate: 0.86,
    pitch: 1,
    energy: 56,
    pauses: 60
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
    rate: 0.94,
    pitch: 0,
    energy: 46,
    pauses: 40
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
    rate: 1.18,
    pitch: 2,
    energy: 82,
    pauses: 18
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

function syncControls() {
  speedValue.textContent = `${Number(speed.value).toFixed(1)}x`;
  pitchValue.textContent = pitch.value;
  energyValue.textContent = `${energy.value}%`;
  pauseValue.textContent = `${pauses.value}%`;
  updateEstimate();
}

function updateEstimate() {
  const chars = textInput.value.trim().length || 1;
  const seconds = Math.max(4, Math.round((chars / 11) / Number(speed.value)));
  setText(estimateOutput, copy[currentLang].estimate_seconds.replace("{value}", seconds));
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
  syncControls();
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
  syncControls();
  setText(statusBox, copy[currentLang].status_restore.replace("{voice}", currentLang === "ar" ? item.nameAr : item.nameEn));
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
  textInput.value = copy[currentLang].demo_text;
  applyTheme(document.body.dataset.theme || localStorage.getItem(THEME_KEY) || "light");
  loadVoice(currentVoiceId);
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

saveBtn.addEventListener("click", () => {
  saveCurrentFavorite();
});

[speed, pitch, energy, pauses].forEach((input) => {
  input.addEventListener("input", syncControls);
});

styleSelect.addEventListener("change", () => {
  const style = styles[styleSelect.value];
  speed.value = style.speed;
  pitch.value = style.pitch;
  energy.value = style.energy;
  pauses.value = style.pauses;
  syncControls();
});

voiceSelect.addEventListener("change", () => {
  loadVoice(voiceSelect.value);
});

textInput.addEventListener("input", updateEstimate);

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
