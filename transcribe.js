const d = document;
const body = d.body;
const $ = (id) => d.getElementById(id);
const all = (selector) => Array.from(d.querySelectorAll(selector));

const THEME_KEY = "mulhem_theme_v2";
const LANG_KEY = "mulhem_lang_v2";
const HISTORY_KEY = "mulhem_transcribe_history_v4";

const ui = {
  theme: $("themeToggle"),
  langAr: $("langAr"),
  langEn: $("langEn"),
  drop: $("dropZone"),
  file: $("fileInput"),
  browse: $("browseBtn"),
  run: $("runBtn"),
  clear: $("clearBtn"),
  demo: $("demoBtn"),
  name: $("fileName"),
  duration: $("fileDuration"),
  batch: $("fileBatch"),
  queue: $("queueList"),
  fill: $("stageFill"),
  track: $("stageTrack"),
  pills: all(".stage-pill"),
  status: $("statusValue"),
  note: $("statusNote"),
  eta: $("etaLabel"),
  audio: $("audioPreview"),
  preview: $("previewMeta"),
  canvas: $("waveCanvas"),
  lang: $("languageSelect"),
  summary: $("summarySelect"),
  exportPreset: $("exportSelect"),
  keywordRange: $("keywordsRange"),
  keywordLabel: $("keywordsCountLabel"),
  suggestionTitle: $("suggestionTitle"),
  suggestionBody: $("suggestionBody"),
  tags: $("quickTags"),
  resultTitle: $("resultTitle"),
  resultMeta: $("resultMeta"),
  copy: $("copyBtn"),
  txt: $("txtBtn"),
  json: $("jsonBtn"),
  srt: $("srtBtn"),
  rerun: $("rerunBtn"),
  transcript: $("transcriptPanel"),
  summaryPanel: $("summaryPanel"),
  points: $("pointsPanel"),
  translation: $("translationPanel"),
  keywords: $("keywordsGrid"),
  raw: $("rawPanel"),
  historyGrid: $("historyGrid"),
  historyEmpty: $("historyEmpty"),
  tabs: all(".tab"),
  panels: all(".panel")
};
const toTopBtn = $("toTopBtn");

const staticNodes = {
  navHome: d.querySelector(".nav-links a:nth-child(1)"),
  navServices: d.querySelector(".nav-links a:nth-child(2)"),
  navVoxa: d.querySelector(".nav-links a:nth-child(3)"),
  heroTitle: d.querySelector(".hero h1"),
  heroLead: d.querySelector(".hero .lead"),
  heroPrimary: d.querySelector(".hero-actions .btn-primary"),
  heroSecondary: d.querySelector(".hero-actions .btn-secondary"),
  heroTags: all(".hero-highlights .hero-highlight"),
  heroStatTitles: all(".hero-card strong"),
  heroStatTexts: all(".hero-card .muted"),
  uploadTitle: d.querySelector(".upload-copy h3"),
  uploadCopy: d.querySelector(".upload-copy .muted"),
  supportMulti: d.querySelector(".support-list .support-badge:last-child"),
  metricLabels: all(".metric-label"),
  progressTitle: d.querySelectorAll(".section-card .section-head h3")[0],
  previewTitle: d.querySelectorAll(".section-card .section-head h3")[1],
  settingsTitle: d.querySelectorAll(".section-card .section-head h3")[2],
  useTitles: all(".stack .hero-stat strong").slice(3, 6),
  useTexts: all(".stack .hero-stat .muted").slice(3, 6),
  sectionTitles: all(".section-head h2"),
  sectionCopies: all(".section-copy"),
  fieldLabels: all(".field-label"),
  rangeLabel: d.querySelector(".range-head span"),
  actionButtons: [ui.copy, ui.rerun],
  tabs: ui.tabs,
  historyTitle: d.querySelectorAll(".section-head h2")[2],
  historyCopy: d.querySelectorAll(".section-copy")[2],
  historyEmptyTitle: d.querySelector("#historyEmpty h3"),
  historyEmptyText: d.querySelector("#historyEmpty .empty-copy")
};

const ctx = ui.canvas.getContext("2d");
let currentLang = localStorage.getItem(LANG_KEY) || "ar";

const state = { files: [], file: null, url: "", duration: 0, payload: null, busy: false };

const copy = {
  ar: {
    theme_dark: "الوضع الليلي", theme_light: "الوضع النهاري",
    navHome: "الرئيسية", navServices: "الخدمات", navVoxa: "Voxa™",
    heroTitle: "حوّل التسجيل إلى نص خلال ثوانٍ وبنتيجة جاهزة للاستخدام",
    heroLead: "ارفع ملفك، شاهد مراحل المعالجة بوضوح، ثم احصل على تفريغ كامل وملخص ونقاط رئيسية وترجمة وكلمات مفتاحية في صفحة واحدة مرتبة وواضحة.",
    heroPrimary: "ابدأ التفريغ الآن", heroSecondary: "استكشف الخدمات",
    heroTags: ["تفريغ + ملخص + ترجمة", "معاينة صوتية قبل التحويل", "تصدير TXT و JSON و SRT"],
    heroStats: [
      ["الخدمة القائدة", "هذه الصفحة صارت المنتج الأوضح داخل المنصة، لذلك ركزنا على أن تكون أسرع فهمًا وأقرب لمنصة جاهزة لا مجرد نموذج أولي."],
      ["تدفّق بسيط", "ارفع الملف، اختر اللغة، شغّل التحليل، ثم تنقّل بين النتائج داخل تبويبات واضحة بدل تكديس طويل."],
      ["نتيجة نهائية جاهزة", "شريط إجراءات واضح للتنزيل والنسخ وإعادة المعالجة، مع سجل نتائج يمكن الرجوع إليه في أي وقت."]
    ],
    uploadTitle: "اسحب ملفك هنا أو اضغط للرفع",
    uploadCopy: "يمكنك رفع أكثر من ملف، وسنعالج أول ملف مباشرة مع إظهار الدفعة والمدة والصيغة بشكل واضح.",
    supportMulti: "دعم رفع متعدد",
    metricLabels: ["الملف الحالي", "مدة التسجيل", "الدفعة"],
    progressTitle: "تابع كل خطوة بوضوح",
    previewTitle: "استمع وراجع قبل استخدام النتيجة",
    settingsTitle: "اضبط النتيجة قبل بدء التفريغ",
    useTitles: ["تعليم ومحاضرات", "بودكاست ومقابلات", "سوشيال ومحتوى"],
    useTexts: [
      "تفريغ التسجيل، تلخيصه، ثم استخراج أهم النقاط لملاحظات الدراسة أو المحتوى التدريبي.",
      "تحويل المقابلات الطويلة إلى نص قابل للنشر مع ترجمة ومعاينة كلمات مفتاحية مهمة.",
      "أعد استخدام المقطع بسرعة عبر نقاط أساسية وملخص واضح وتصدير منظم يسهل البناء عليه."
    ],
    sectionTitles: ["صفحة تفريغ مصممة كمنتج حقيقي", "نتيجة منظمة بدل تكديس طويل", "عمليات سابقة يمكن الرجوع إليها"],
    sectionCopies: [
      "فصلنا الرفع والإعدادات والنتائج حتى يفهم المستخدم ما الذي يحدث فورًا، بدل الشعور بأن كل شيء موضوع دفعة واحدة.",
      "بعد اكتمال التحليل ستظهر النتيجة داخل تبويبات واضحة مع شريط إجراءات ثابت للتنزيل والنسخ وإعادة المعالجة.",
      "حفظنا السجل بصيغة بطاقات أوضح: اسم الملف، مدة التسجيل، اللغة، وقت المعالجة، ثم إجراءات مباشرة لفتح النتيجة السابقة."
    ],
    fieldLabels: ["لغة التفريغ", "مستوى الملخص", "التصدير الافتراضي"],
    rangeLabel: "عدد الكلمات المفتاحية",
    copyBtn: "نسخ النص", rerunBtn: "إعادة المعالجة",
    tabs: ["النص الكامل", "الملخص", "النقاط المهمة", "الترجمة", "الكلمات المفتاحية", "الملف الخام"],
    historyEmptyTitle: "لا توجد نتائج محفوظة بعد",
    historyEmptyText: "ابدأ بأول عملية تفريغ وسنحفظ لك السجل هنا لتعود إليه لاحقًا بسهولة.",
    fileEmpty: "لا يوجد ملف مرفوع", batchEmpty: "0 ملف", queueEmpty: "لم يتم رفع أي ملف بعد",
    previewEmpty: "سيظهر Waveform والمعاينة الصوتية بعد رفع الملف.",
    statusReady: "جاهز", noteReady: "جاهز للتفريغ. ارفع ملفًا وابدأ التحليل.", etaReady: "الوقت المتبقي: --",
    resultTitleEmpty: "لا توجد نتيجة بعد", resultMetaEmpty: "ابدأ التحليل ليظهر النص والملخص والكلمات المفتاحية هنا.",
    placeholders: ["ستظهر نتيجة التفريغ هنا بعد بدء المعالجة.", "سيظهر الملخص هنا.", "ستظهر النقاط الرئيسية هنا.", "ستظهر الترجمة هنا.", "ابدأ المعالجة أولًا", "سيظهر JSON الخام هنا."],
    quickReady: "جاهز للنسخ والتنزيل بعد التحليل", suggestionTitle: "اقتراح تلقائي",
    suggestionBody: "للملفات التعليمية أو الاجتماعات، ابدأ بالعربية ومستوى ملخص متوسط لتحصل على توازن جيد بين الاختصار والدقة.",
    browseBtn: "ابدأ الآن", runBtn: "حلّل التسجيل", clearBtn: "مسح الملف", demoBtn: "تجربة سريعة",
    options: {
      lang: { auto: "تلقائي", ar: "العربية", en: "الإنجليزية", "ar-gulf": "العربية الخليجية" },
      summary: { short: "قصير", medium: "متوسط", detailed: "مفصل" },
      export: { "txt-json": "TXT + JSON", "txt-srt": "TXT + SRT", all: "كل الصيغ" }
    },
    stages: ["تم استلام الملف ورفعه", "جارٍ تحويل الصوت إلى نص", "جارٍ تجهيز الملخص والنقاط", "تم تجهيز النتائج النهائية"],
    queueAnalyzing: "قيد التحليل", queueWaiting: "في الانتظار",
    tags: { lang: "اللغة", summary: "مستوى الملخص", export: "التصدير" },
    previewLoaded: "معاينة الملف جاهزة. المدة التقديرية {duration}.",
    copied: "تم نسخ النص الكامل إلى الحافظة.",
    demoFile: "تجربة-اجتماع-قصير.mp3",
    transcriptTemplate: "هذا تفريغ تجريبي لملف {file}. تم استخلاص النص بشكل منظم ليكون سهل القراءة والمراجعة وإعادة الاستخدام.",
    summaryTemplate: "الملخص: الملف يناقش نقاطًا رئيسية بشكل واضح، مع إمكانية استخدام الناتج مباشرة في التوثيق أو النشر أو إعداد المحتوى.",
    pointsTemplate: ["تسجيل واضح يمكن تحويله إلى نص بسرعة.", "الملخص يختصر الفكرة الأساسية دون إضاعة السياق.", "التصدير يسهّل مشاركة النتيجة أو أرشفتها."],
    translationTemplate: "ترجمة مختصرة: This recording was processed into a readable transcript with summary and key points.",
    keywordSeed: ["تفريغ", "ملخص", "نقاط", "ترجمة", "اجتماع", "محتوى", "صوت", "تحليل", "محاضرة", "توثيق"],
    historyOpen: "فتح النتيجة", historyOpenStatus: "تم فتح نتيجة محفوظة من السجل.",
    downloadNames: { txt: "transcript.txt", json: "result.json", srt: "captions.srt" }
  },
  en: {
    theme_dark: "Dark Mode", theme_light: "Light Mode",
    navHome: "Home", navServices: "Services", navVoxa: "Voxa™",
    heroTitle: "Turn recordings into text in seconds with results ready to use",
    heroLead: "Upload your file, watch the processing stages clearly, then get a full transcript, summary, key points, translation, and keywords in one organized page.",
    heroPrimary: "Start Transcription", heroSecondary: "Explore Services",
    heroTags: ["Transcription + summary + translation", "Audio preview before analysis", "TXT, JSON, and SRT export"],
    heroStats: [
      ["Flagship product", "This page is now the clearest product inside the platform, designed to feel closer to a ready tool than a prototype."],
      ["Simple flow", "Upload the file, choose the language, run analysis, then move through structured result tabs."],
      ["Ready outcome", "A clear action bar for copy, download, and rerun, with saved history cards you can reopen anytime."]
    ],
    uploadTitle: "Drag your file here or click to upload",
    uploadCopy: "You can upload multiple files. We analyze the first file immediately and still show the batch clearly.",
    supportMulti: "Multi-file support",
    metricLabels: ["Current File", "Recording Length", "Batch"],
    progressTitle: "Follow every stage clearly",
    previewTitle: "Listen and review before using the result",
    settingsTitle: "Adjust the output before analysis",
    useTitles: ["Education", "Podcasts", "Social Content"],
    useTexts: [
      "Transcribe the recording, summarize it, then extract the key points for learning notes or training content.",
      "Turn long interviews into publishable text with translation and highlighted keywords.",
      "Reuse the recording quickly through concise bullet points and structured exports."
    ],
    sectionTitles: ["A transcription page designed like a real product", "Structured results instead of a long wall of text", "Past runs you can reopen"],
    sectionCopies: [
      "We separated upload, settings, and results so users instantly understand what is happening instead of facing one crowded page.",
      "Once analysis finishes, the output appears inside clear tabs with a fixed action bar for copy and download.",
      "History is stored as clearer cards: file name, duration, language, and one-click reopen actions."
    ],
    fieldLabels: ["Transcription Language", "Summary Level", "Default Export"],
    rangeLabel: "Keyword Count",
    copyBtn: "Copy Transcript", rerunBtn: "Run Again",
    tabs: ["Transcript", "Summary", "Key Points", "Translation", "Keywords", "Raw Output"],
    historyEmptyTitle: "No saved results yet",
    historyEmptyText: "Run your first transcription and we will keep it here so you can revisit it later.",
    fileEmpty: "No file uploaded", batchEmpty: "0 files", queueEmpty: "No files uploaded yet",
    previewEmpty: "The waveform and audio preview will appear after you upload a file.",
    statusReady: "Ready", noteReady: "Ready to transcribe. Upload a file and start analysis.", etaReady: "Time left: --",
    resultTitleEmpty: "No results yet", resultMetaEmpty: "Start analysis to see the transcript, summary, and keywords here.",
    placeholders: ["The transcript will appear here after processing starts.", "The summary will appear here.", "Key points will appear here.", "The translation will appear here.", "Run the analysis first.", "The raw JSON will appear here."],
    quickReady: "Ready for copy and download after analysis", suggestionTitle: "Auto suggestion",
    suggestionBody: "For lectures or meetings, start with Arabic and a medium summary to balance brevity and clarity.",
    browseBtn: "Upload File", runBtn: "Analyze Recording", clearBtn: "Clear File", demoBtn: "Quick Demo",
    options: {
      lang: { auto: "Auto", ar: "Arabic", en: "English", "ar-gulf": "Gulf Arabic" },
      summary: { short: "Short", medium: "Medium", detailed: "Detailed" },
      export: { "txt-json": "TXT + JSON", "txt-srt": "TXT + SRT", all: "All Formats" }
    },
    stages: ["File uploaded", "Transcribing audio", "Generating summary and highlights", "Preparing final results"],
    queueAnalyzing: "Analyzing", queueWaiting: "Waiting",
    tags: { lang: "Language", summary: "Summary", export: "Export" },
    previewLoaded: "File preview is ready. Estimated duration {duration}.",
    copied: "The transcript has been copied to the clipboard.",
    demoFile: "quick-meeting-demo.mp3",
    transcriptTemplate: "This is a demo transcript for {file}. The content has been organized into a readable structure for review and reuse.",
    summaryTemplate: "Summary: the file covers a few core ideas in a clear format that can be reused for documentation, publishing, or content preparation.",
    pointsTemplate: ["The recording can be turned into text quickly.", "The summary keeps the core context without too much detail.", "Export options make sharing and archiving easier."],
    translationTemplate: "Short translation: تمت معالجة هذا التسجيل إلى نص واضح مع ملخص ونقاط رئيسية.",
    keywordSeed: ["transcript", "summary", "keywords", "audio", "recording", "meeting", "content", "analysis", "lecture", "archive"],
    historyOpen: "Open Result", historyOpenStatus: "Opened a saved result from history.",
    downloadNames: { txt: "transcript.txt", json: "result.json", srt: "captions.srt" }
  }
};

const stageMeta = [
  { width: 18, eta: "3.2" },
  { width: 52, eta: "2.1" },
  { width: 78, eta: "1.1" },
  { width: 100, eta: "0.0" }
];

function wait(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
function t(key) { return copy[currentLang][key]; }
function formatDuration(seconds) { if (!Number.isFinite(seconds) || seconds <= 0) return "--"; const total = Math.round(seconds); const m = Math.floor(total / 60); const s = total % 60; return m ? `${m}:${String(s).padStart(2, "0")}` : `${s}${currentLang === "ar" ? " ث" : "s"}`; }
function setText(node, value) { if (node) node.textContent = value; }
function getHistory() { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; } }
function saveHistory(items) { localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(-8))); }
function download(name, content, type) { const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const a = d.createElement("a"); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 800); }

function buildWave(seed = 1, duration = 0) { return Array.from({ length: 180 }, (_, i) => 0.18 + (((seed + i * 13 + duration * 11) * 9301) % 233280) / 233280 * 0.82); }
function drawWave(values) { const dark = body.dataset.theme === "dark"; ctx.clearRect(0, 0, ui.canvas.width, ui.canvas.height); ctx.fillStyle = dark ? "#10202b" : "#f7fbf8"; ctx.fillRect(0, 0, ui.canvas.width, ui.canvas.height); if (!values.length) return; const w = ui.canvas.width / values.length; values.forEach((v, i) => { const x = i * w; const h = Math.max(10, v * 160); const g = ctx.createLinearGradient(x, 0, x, ui.canvas.height); g.addColorStop(0, dark ? "#7ef7a8" : "#22c55e"); g.addColorStop(1, dark ? "#d6ffe4" : "#15803d"); ctx.fillStyle = g; ctx.fillRect(x, (ui.canvas.height - h) / 2, Math.max(2, w - 2), h); }); }

function applyTheme(theme) {
  body.dataset.theme = theme === "dark" ? "dark" : "light";
  setText(ui.theme, body.dataset.theme === "dark" ? t("theme_light") : t("theme_dark"));
  localStorage.setItem(THEME_KEY, body.dataset.theme);
  drawWave(state.file ? buildWave(state.file.size, state.duration) : []);
}

function updateSelectOptions() {
  ui.lang.innerHTML = Object.entries(t("options").lang).map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
  ui.summary.innerHTML = Object.entries(t("options").summary).map(([value, label]) => `<option value="${value}" ${value === "medium" ? "selected" : ""}>${label}</option>`).join("");
  ui.exportPreset.innerHTML = Object.entries(t("options").export).map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
}

function applyLanguage(lang) {
  currentLang = lang === "en" ? "en" : "ar";
  d.documentElement.lang = currentLang;
  d.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
  d.title = currentLang === "ar" ? "WriteWave™ | تحويل الصوت إلى نص | مُلهم ساوند" : "WriteWave™ | Speech To Text | Mulhem Sound";
  ui.langAr.classList.toggle("active", currentLang === "ar");
  ui.langEn.classList.toggle("active", currentLang === "en");
  setText(ui.theme, body.dataset.theme === "dark" ? t("theme_light") : t("theme_dark"));
  setText(staticNodes.navHome, t("navHome")); setText(staticNodes.navServices, t("navServices")); setText(staticNodes.navVoxa, t("navVoxa"));
  setText(staticNodes.heroTitle, t("heroTitle")); setText(staticNodes.heroLead, t("heroLead")); setText(staticNodes.heroPrimary, t("heroPrimary")); setText(staticNodes.heroSecondary, t("heroSecondary"));
  staticNodes.heroTags.forEach((node, i) => setText(node, t("heroTags")[i])); staticNodes.heroStatTitles.forEach((node, i) => setText(node, t("heroStats")[i][0])); staticNodes.heroStatTexts.forEach((node, i) => setText(node, t("heroStats")[i][1]));
  setText(staticNodes.uploadTitle, t("uploadTitle")); setText(staticNodes.uploadCopy, t("uploadCopy")); setText(staticNodes.supportMulti, t("supportMulti")); staticNodes.metricLabels.forEach((n, i) => setText(n, t("metricLabels")[i]));
  setText(staticNodes.progressTitle, t("progressTitle")); setText(staticNodes.previewTitle, t("previewTitle")); setText(staticNodes.settingsTitle, t("settingsTitle"));
  staticNodes.useTitles.forEach((n, i) => setText(n, t("useTitles")[i])); staticNodes.useTexts.forEach((n, i) => setText(n, t("useTexts")[i]));
  staticNodes.sectionTitles.forEach((n, i) => setText(n, t("sectionTitles")[i])); staticNodes.sectionCopies.forEach((n, i) => setText(n, t("sectionCopies")[i]));
  staticNodes.fieldLabels.forEach((n, i) => setText(n, t("fieldLabels")[i])); setText(staticNodes.rangeLabel, t("rangeLabel"));
  setText(ui.copy, t("copyBtn")); setText(ui.rerun, t("rerunBtn")); ui.tabs.forEach((n, i) => setText(n, t("tabs")[i]));
  setText(staticNodes.historyTitle, t("sectionTitles")[2]); setText(staticNodes.historyCopy, t("sectionCopies")[2]); setText(staticNodes.historyEmptyTitle, t("historyEmptyTitle")); setText(staticNodes.historyEmptyText, t("historyEmptyText"));
  setText(ui.browse, t("browseBtn")); setText(ui.run, t("runBtn")); setText(ui.clear, t("clearBtn")); setText(ui.demo, t("demoBtn"));
  setText(ui.suggestionTitle, t("suggestionTitle")); setText(ui.suggestionBody, t("suggestionBody"));
  updateSelectOptions(); syncTags(); resetResult(); resetProgress(); renderHistory(); localStorage.setItem(LANG_KEY, currentLang);
}

function syncTags() {
  ui.keywordLabel.textContent = ui.keywordRange.value;
  const optionSets = t("options");
  ui.tags.innerHTML = [
    `${t("tags").lang}: ${optionSets.lang[ui.lang.value]}`,
    `${t("tags").summary}: ${optionSets.summary[ui.summary.value]}`,
    `${t("tags").export}: ${optionSets.export[ui.exportPreset.value]}`
  ].map((item, idx) => `<div class="quick-tag">${item}</div>`).join("") + `<div class="quick-tag">${t("quickReady")}</div>`;
}

function resetResult() {
  setText(ui.transcript, t("placeholders")[0]); setText(ui.summaryPanel, t("placeholders")[1]); setText(ui.points, t("placeholders")[2]); setText(ui.translation, t("placeholders")[3]); setText(ui.raw, t("placeholders")[5]);
  ui.keywords.innerHTML = `<div class="keyword-chip">${t("placeholders")[4]}</div>`;
  setText(ui.resultTitle, t("resultTitleEmpty")); setText(ui.resultMeta, t("resultMetaEmpty"));
}

function resetProgress() {
  ui.fill.style.width = "0%"; ui.track.classList.remove("loading"); setText(ui.status, t("statusReady")); setText(ui.note, t("noteReady")); setText(ui.eta, t("etaReady")); ui.pills.forEach((pill, i) => { pill.classList.remove("active", "done"); pill.textContent = t("stages")[i].split(" ").slice(0, 2).join(" "); });
}

function setStage(index) {
  ui.track.classList.add("loading"); ui.fill.style.width = `${stageMeta[index].width}%`; setText(ui.status, t("stages")[index]); setText(ui.note, t("stages")[index]); setText(ui.eta, `${currentLang === "ar" ? "الوقت المتبقي" : "Time left"}: ${stageMeta[index].eta}${currentLang === "ar" ? " ث" : "s"}`);
  ui.pills.forEach((pill, i) => { pill.classList.toggle("done", i < index); pill.classList.toggle("active", i === index); });
}

function clearSelection() {
  if (state.url) URL.revokeObjectURL(state.url);
  Object.assign(state, { files: [], file: null, url: "", duration: 0, payload: null });
  ui.file.value = ""; setText(ui.name, t("fileEmpty")); setText(ui.duration, "--"); setText(ui.batch, t("batchEmpty")); setText(ui.preview, t("previewEmpty")); ui.queue.innerHTML = `<div class="queue-pill">${t("queueEmpty")}</div>`; ui.audio.removeAttribute("src"); ui.audio.load(); drawWave([]); resetProgress(); resetResult();
}

function renderQueue(files) {
  ui.queue.innerHTML = files.length ? files.map((file, index) => `<div class="queue-pill">${index === 0 ? t("queueAnalyzing") : t("queueWaiting")}: ${file.name}</div>`).join("") : `<div class="queue-pill">${t("queueEmpty")}</div>`;
}

function probeDuration(url, size) { return new Promise((resolve) => { const audio = new Audio(url); const done = (v) => resolve(Number.isFinite(v) && v > 0 ? v : Math.max(12, Math.round(size / 42000))); audio.addEventListener("loadedmetadata", () => done(audio.duration), { once: true }); audio.addEventListener("error", () => done(0), { once: true }); setTimeout(() => done(0), 1800); }); }

async function setFiles(fileList) {
  const files = Array.from(fileList || []).filter((file) => file.type.startsWith("audio/"));
  if (!files.length) return;
  clearSelection(); state.files = files; state.file = files[0]; state.url = URL.createObjectURL(state.file); ui.audio.src = state.url; setText(ui.name, state.file.name); setText(ui.batch, currentLang === "ar" ? `${files.length} ملف` : `${files.length} files`); renderQueue(files);
  state.duration = await probeDuration(state.url, state.file.size || 0); setText(ui.duration, formatDuration(state.duration)); setText(ui.preview, t("previewLoaded").replace("{duration}", formatDuration(state.duration))); drawWave(buildWave(state.file.size || 0, state.duration)); setText(ui.status, t("stages")[0]); setText(ui.note, currentLang === "ar" ? "الملف جاهز. يمكنك الآن بدء التحليل." : "The file is ready. You can start analysis now.");
}

function createPayload() {
  const seed = state.file?.name || t("demoFile"); const keywords = t("keywordSeed").slice(0, Number(ui.keywordRange.value));
  return {
    fileName: seed,
    transcript: t("transcriptTemplate").replace("{file}", seed),
    summary: t("summaryTemplate"),
    points: t("pointsTemplate").map((item, i) => `${i + 1}. ${item}`).join("\n"),
    translation: t("translationTemplate"),
    keywords,
    raw: JSON.stringify({ file: seed, language: ui.lang.value, summary: ui.summary.value, export: ui.exportPreset.value, keywords }, null, 2)
  };
}

async function runAnalysis() {
  if (state.busy) return;
  if (!state.file) {
    setText(ui.status, currentLang === "ar" ? "ارفع ملفًا أولًا أو استخدم تجربة سريعة." : "Upload a file first or use the quick demo.");
    setText(ui.note, currentLang === "ar" ? "لا يمكن بدء التحليل بدون ملف صوتي." : "Analysis cannot start without an audio file.");
    return;
  }
  state.busy = true; ui.track.classList.add("loading");
  for (let i = 0; i < stageMeta.length; i += 1) { setStage(i); await wait(650); }
  state.payload = createPayload();
  setText(ui.transcript, state.payload.transcript); setText(ui.summaryPanel, state.payload.summary); setText(ui.points, state.payload.points); setText(ui.translation, state.payload.translation); setText(ui.raw, state.payload.raw); ui.keywords.innerHTML = state.payload.keywords.map((word) => `<div class="keyword-chip">${word}</div>`).join(""); setText(ui.resultTitle, state.file?.name || t("demoFile")); setText(ui.resultMeta, `${ui.lang.options[ui.lang.selectedIndex].text} • ${ui.summary.options[ui.summary.selectedIndex].text} • ${formatDuration(state.duration || 18)}`);
  const items = getHistory(); items.push({ ...state.payload, duration: formatDuration(state.duration || 18), lang: ui.lang.options[ui.lang.selectedIndex].text, createdAt: new Date().toLocaleString(currentLang === "ar" ? "ar-SA" : "en-US") }); saveHistory(items); renderHistory(); state.busy = false;
}

function renderHistory() {
  const items = getHistory();
  ui.historyEmpty.classList.toggle("hidden", Boolean(items.length));
  ui.historyGrid.querySelectorAll(".history-card").forEach((card) => card.remove());
  items.slice().reverse().forEach((item, reversedIndex) => {
    const index = items.length - 1 - reversedIndex;
    const card = d.createElement("article");
    card.className = "history-card glass";
    card.innerHTML = `<strong>${item.fileName}</strong><div class="history-meta"><span class="keyword-chip">${item.lang}</span><span class="keyword-chip">${item.duration}</span></div><p class="muted">${item.createdAt}</p><div class="history-actions"><button class="btn btn-secondary" data-open="${index}" type="button">${t("historyOpen")}</button></div>`;
    ui.historyGrid.appendChild(card);
  });
}

function openHistory(index) {
  const item = getHistory()[index];
  if (!item) return;
  state.payload = item; setText(ui.transcript, item.transcript); setText(ui.summaryPanel, item.summary); setText(ui.points, item.points); setText(ui.translation, item.translation); setText(ui.raw, item.raw); ui.keywords.innerHTML = item.keywords.map((word) => `<div class="keyword-chip">${word}</div>`).join(""); setText(ui.resultTitle, item.fileName); setText(ui.resultMeta, `${item.lang} • ${item.duration}`); setText(ui.status, t("historyOpenStatus"));
}

function copyTranscript() { navigator.clipboard?.writeText(ui.transcript.textContent || ""); setText(ui.status, t("copied")); }
function exportSrt() { const lines = (state.payload?.transcript || ui.transcript.textContent).split(". ").filter(Boolean); const srt = lines.map((line, i) => `${i + 1}\n00:00:${String(i * 3).padStart(2, "0")},000 --> 00:00:${String(i * 3 + 2).padStart(2, "0")},500\n${line.trim()}\n`).join("\n"); download(t("downloadNames").srt, srt, "text/plain"); }
function switchTab(name) { ui.tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === name)); ui.panels.forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === name)); }

ui.theme.onclick = () => applyTheme(body.dataset.theme === "dark" ? "light" : "dark");
ui.langAr.onclick = () => applyLanguage("ar");
ui.langEn.onclick = () => applyLanguage("en");
ui.browse.onclick = () => ui.file.click();
ui.file.onchange = () => setFiles(ui.file.files);
ui.run.onclick = () => runAnalysis();
ui.clear.onclick = () => clearSelection();
ui.demo.onclick = async () => { const fake = new File(["demo"], t("demoFile"), { type: "audio/mp3" }); await setFiles([fake]); await runAnalysis(); };
ui.copy.onclick = () => copyTranscript();
ui.txt.onclick = () => download(t("downloadNames").txt, ui.transcript.textContent, "text/plain");
ui.json.onclick = () => download(t("downloadNames").json, state.payload?.raw || ui.raw.textContent, "application/json");
ui.srt.onclick = () => exportSrt();
ui.rerun.onclick = () => runAnalysis();
ui.lang.onchange = syncTags; ui.summary.onchange = syncTags; ui.exportPreset.onchange = syncTags; ui.keywordRange.oninput = syncTags;
ui.tabs.forEach((tab) => tab.onclick = () => switchTab(tab.dataset.tab));
ui.historyGrid.addEventListener("click", (event) => { const button = event.target.closest("[data-open]"); if (button) openHistory(Number(button.dataset.open)); });
["dragenter", "dragover"].forEach((eventName) => ui.drop.addEventListener(eventName, (event) => { event.preventDefault(); ui.drop.classList.add("dragging"); }));
["dragleave", "drop"].forEach((eventName) => ui.drop.addEventListener(eventName, (event) => { event.preventDefault(); ui.drop.classList.remove("dragging"); }));
ui.drop.addEventListener("drop", (event) => setFiles(event.dataTransfer.files));

window.addEventListener("scroll", () => {
  toTopBtn.classList.toggle("visible", window.scrollY > 320);
});

toTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

applyTheme(localStorage.getItem(THEME_KEY) || ((window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light"));
applyLanguage(currentLang);
renderHistory();
clearSelection();
all("[data-animate]").forEach((node, index) => setTimeout(() => node.classList.add("is-visible"), 80 + index * 45));
