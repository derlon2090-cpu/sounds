const d = document;
const body = d.body;
const $ = (id) => d.getElementById(id);
const q = (s) => Array.from(d.querySelectorAll(s));

const E = {
  theme: $('themeToggle'),
  drop: $('dropZone'),
  file: $('fileInput'),
  browse: $('browseBtn'),
  run: $('runBtn'),
  clear: $('clearBtn'),
  demo: $('demoBtn'),
  name: $('fileName'),
  dur: $('fileDuration'),
  batch: $('fileBatch'),
  queue: $('queueList'),
  fill: $('stageFill'),
  track: $('stageTrack'),
  pills: q('.stage-pill'),
  status: $('statusValue'),
  note: $('statusNote'),
  eta: $('etaLabel'),
  audio: $('audioPreview'),
  preview: $('previewMeta'),
  canvas: $('waveCanvas'),
  lang: $('languageSelect'),
  summary: $('summarySelect'),
  exp: $('exportSelect'),
  kw: $('keywordsRange'),
  kwLabel: $('keywordsCountLabel'),
  sTitle: $('suggestionTitle'),
  sBody: $('suggestionBody'),
  tags: $('quickTags'),
  rTitle: $('resultTitle'),
  rMeta: $('resultMeta'),
  copy: $('copyBtn'),
  txt: $('txtBtn'),
  json: $('jsonBtn'),
  srt: $('srtBtn'),
  rerun: $('rerunBtn'),
  tr: $('transcriptPanel'),
  su: $('summaryPanel'),
  po: $('pointsPanel'),
  tl: $('translationPanel'),
  kwGrid: $('keywordsGrid'),
  raw: $('rawPanel'),
  hist: $('historyGrid'),
  empty: $('historyEmpty'),
  tabs: q('.tab'),
  panels: q('.panel')
};

const THEME = 'mulhem_theme_v2';
const HIST = 'mulhem_transcribe_history_v2';
const ctx = E.canvas.getContext('2d');
const state = { files: [], file: null, url: '', dur: 0, payload: null, busy: false };

const stages = [
  ['تم استلام الملف ورفعه', '3.2'],
  ['جاري تحويل الصوت إلى نص', '2.1'],
  ['جاري تجهيز الملخص والنقاط', '1.1'],
  ['تم تجهيز النتائج النهائية', '0.0']
];

const langMap = {
  auto: 'تلقائي',
  ar: 'العربية',
  en: 'الإنجليزية',
  'ar-gulf': 'العربية الخليجية'
};

const sumMap = {
  short: 'قصير',
  medium: 'متوسط',
  detailed: 'مفصل'
};

const sleep = (t) => new Promise((resolve) => setTimeout(resolve, t));

function theme(mode) {
  const next = mode === 'dark' ? 'dark' : 'light';
  body.dataset.theme = next;
  E.theme.textContent = next === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي';
  localStorage.setItem(THEME, next);
  draw(state.file ? seed(state.file.size, state.dur) : []);
}

function reveal() {
  const nodes = q('[data-animate]');
  if (!('IntersectionObserver' in window)) {
    nodes.forEach((node) => node.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  nodes.forEach((node, index) => {
    node.style.transitionDelay = `${Math.min(index * 45, 240)}ms`;
    observer.observe(node);
  });
}

function fmt(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '--';
  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  const secs = total % 60;
  return minutes > 0 ? `${minutes}:${String(secs).padStart(2, '0')}` : `${secs} ث`;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function hist() {
  try {
    return JSON.parse(localStorage.getItem(HIST) || '[]');
  } catch {
    return [];
  }
}

function saveHist(items) {
  localStorage.setItem(HIST, JSON.stringify(items.slice(-8)));
}

function seed(source = 1, duration = 0) {
  const values = [];
  let cursor = Math.max(0.22, (source % 97) / 97);
  for (let index = 0; index < 180; index += 1) {
    cursor = (cursor * 9301 + 49297 + index * 13 + duration * 11) % 233280;
    values.push(0.18 + (cursor / 233280) * 0.82);
  }
  return values;
}

function draw(values) {
  const dark = body.dataset.theme === 'dark';
  const bg = dark ? '#10202b' : '#f7fbf8';
  const top = dark ? '#7ef7a8' : '#22c55e';
  const bottom = dark ? '#d6ffe4' : '#15803d';

  ctx.clearRect(0, 0, E.canvas.width, E.canvas.height);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, E.canvas.width, E.canvas.height);
  if (!values.length) return;

  const barWidth = E.canvas.width / values.length;
  values.forEach((value, index) => {
    const x = index * barWidth;
    const height = Math.max(10, value * 160);
    const gradient = ctx.createLinearGradient(x, 0, x, E.canvas.height);
    gradient.addColorStop(0, top);
    gradient.addColorStop(1, bottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(x, (E.canvas.height - height) / 2, Math.max(2, barWidth - 2), height);
  });
}

function tags() {
  E.kwLabel.textContent = E.kw.value;
  E.tags.innerHTML = [
    `اللغة: ${langMap[E.lang.value]}`,
    `مستوى الملخص: ${sumMap[E.summary.value]}`,
    `التصدير: ${E.exp.options[E.exp.selectedIndex].text}`
  ].map((item) => `<div class="quick-tag">${item}</div>`).join('');

  E.sTitle.textContent = 'اقتراح تلقائي محدث';
  E.sBody.textContent = `الإعداد الحالي مناسب لملف ${langMap[E.lang.value]} مع ملخص ${sumMap[E.summary.value]} وتجهيز ${E.kw.value} كلمات مفتاحية.`;
}

function resetResult() {
  E.tr.textContent = 'ستظهر نتيجة التفريغ هنا بعد بدء المعالجة.';
  E.su.textContent = 'سيظهر الملخص هنا.';
  E.po.textContent = 'ستظهر النقاط الرئيسية هنا.';
  E.tl.textContent = 'ستظهر الترجمة هنا.';
  E.raw.textContent = 'سيظهر JSON الخام هنا.';
  E.kwGrid.innerHTML = '<div class="keyword-chip">ابدأ المعالجة أولًا</div>';
  E.rTitle.textContent = 'لا توجد نتيجة بعد';
  E.rMeta.textContent = 'ابدأ التحليل ليظهر النص والملخص والكلمات المفتاحية هنا.';
}

function resetProgress() {
  E.fill.style.width = '0%';
  E.track.classList.remove('loading');
  E.status.textContent = 'جاهز';
  E.note.textContent = 'جاهز للتفريغ. ارفع ملفًا وابدأ التحليل.';
  E.eta.textContent = 'الوقت المتبقي: --';
  E.pills.forEach((pill) => pill.classList.remove('active', 'done'));
}

function setStage(index) {
  E.track.classList.add('loading');
  E.pills.forEach((pill, pillIndex) => {
    pill.classList.toggle('done', pillIndex < index);
    pill.classList.toggle('active', pillIndex === index);
  });
  E.fill.style.width = [18, 52, 78, 100][index] + '%';
  E.status.textContent = stages[index][0];
  E.note.textContent = stages[index][0];
  E.eta.textContent = `الوقت المتبقي: ${stages[index][1]} ث`;
}

function clearSelection() {
  if (state.url) URL.revokeObjectURL(state.url);
  state.files = [];
  state.file = null;
  state.url = '';
  state.dur = 0;
  state.payload = null;

  E.file.value = '';
  E.name.textContent = 'لا يوجد ملف مرفوع';
  E.dur.textContent = '--';
  E.batch.textContent = '0 ملف';
  E.preview.textContent = 'سيظهر Waveform والمعاينة الصوتية بعد رفع الملف.';
  E.queue.innerHTML = '<div class="queue-pill">لم يتم رفع أي ملف بعد</div>';
  E.audio.removeAttribute('src');
  E.audio.load();
  draw([]);
  resetProgress();
  resetResult();
}

function renderQueue(files) {
  if (!files.length) {
    E.queue.innerHTML = '<div class="queue-pill">لم يتم رفع أي ملف بعد</div>';
    return;
  }

  E.queue.innerHTML = files
    .map((file, index) => `<div class="queue-pill">${index === 0 ? 'قيد التحليل' : 'في الانتظار'}: ${file.name}</div>`)
    .join('');
}

function probeDuration(url, size) {
  return new Promise((resolve) => {
    const audio = new Audio(url);
    const done = (value) => resolve(Number.isFinite(value) && value > 0 ? value : Math.max(12, Math.round(size / 42000)));
    audio.addEventListener('loadedmetadata', () => done(audio.duration), { once: true });
    audio.addEventListener('error', () => done(0), { once: true });
    setTimeout(() => done(0), 1800);
  });
}

async function setFiles(fileList) {
  const files = Array.from(fileList || []).filter((file) => file.type.startsWith('audio/'));
  if (!files.length) return;

  clearSelection();
  state.files = files;
  state.file = files[0];
  state.url = URL.createObjectURL(state.file);
  E.audio.src = state.url;
  E.name.textContent = state.file.name;
  E.batch.textContent = `${files.length} ملف`;
  renderQueue(files);

  state.dur = await probeDuration(state.url, state.file.size || 0);
  E.dur.textContent = fmt(state.dur);
  E.preview.textContent = `معاينة الملف جاهزة. المدة التقديرية ${fmt(state.dur)}.`;
  E.status.textContent = 'تم استلام الملف';
  E.note.textContent = 'الملف جاهز. يمكنك الآن بدء التحليل.';
  draw(seed(state.file.size || 0, state.dur));
}

function splitSentences(text) {
  return text.split(/(?<=[.!؟?؛،])\s+/).map((item) => item.trim()).filter(Boolean);
}

function buildPayload() {
  const clean = state.file.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ').trim();
  const transcript = [
    `تفريغ أولي للتسجيل "${clean}".`,
    'يشرح الملف الفكرة الأساسية بشكل منظم ثم ينتقل إلى النقاط الرئيسية ويعرضها بأسلوب واضح مناسب للمراجعة.',
    `مدة التسجيل تقارب ${fmt(state.dur)} ضمن ${langMap[E.lang.value]}.`,
    'جرى تجهيز النص مع ملخص ونقاط وكلمات مفتاحية لتسهيل إعادة الاستخدام.'
  ].join(' ');

  const sentences = splitSentences(transcript);
  const summary =
    E.summary.value === 'short' ? sentences.slice(0, 1).join(' ') :
    E.summary.value === 'detailed' ? sentences.slice(0, 3).join(' ') :
    sentences.slice(0, 2).join(' ');

  return {
    fileName: state.file.name,
    duration: state.dur || 18,
    languageLabel: langMap[E.lang.value],
    summaryLabel: sumMap[E.summary.value],
    exportLabel: E.exp.options[E.exp.selectedIndex].text,
    transcript,
    summary,
    points: sentences.slice(0, 4).map((item) => `• ${item}`).join('\n'),
    translation: 'English preview: This recording was converted into a structured transcript with a concise summary and key points.',
    keywords: ['تفريغ', 'تسجيل', 'ملخص', 'تحليل', 'محتوى', 'ترجمة'].slice(0, Number(E.kw.value)),
    sourceFiles: state.files.map((file) => file.name)
  };
}

function renderPayload(payload) {
  state.payload = payload;
  E.tr.textContent = payload.transcript;
  E.su.textContent = payload.summary;
  E.po.textContent = payload.points;
  E.tl.textContent = payload.translation;
  E.kwGrid.innerHTML = payload.keywords.map((item) => `<div class="keyword-chip">${item}</div>`).join('');
  E.raw.textContent = JSON.stringify(payload, null, 2);
  E.rTitle.textContent = payload.fileName;
  E.rMeta.textContent = `لغة التفريغ: ${payload.languageLabel} • مدة التسجيل: ${fmt(payload.duration)} • الملخص: ${payload.summaryLabel}`;
}

function renderHist() {
  const items = hist().slice().reverse();
  E.empty.classList.toggle('hidden', items.length > 0);
  q('.history-card').forEach((card) => card.remove());

  items.forEach((item) => {
    const card = d.createElement('article');
    card.className = 'history-card glass';
    card.innerHTML = `
      <div>
        <strong>${item.fileName}</strong>
        <div class="history-meta muted">
          <span>${formatDate(item.createdAt)}</span>
          <span>${fmt(item.duration)}</span>
          <span>${item.languageLabel}</span>
        </div>
      </div>
      <div class="small-note">ملخص ${item.summaryLabel} • ${item.exportLabel}</div>
      <div class="history-actions">
        <button class="ghost-btn" data-open="${item.id}" type="button">فتح النتيجة</button>
        <button class="ghost-btn" data-copy="${item.id}" type="button">نسخ النص</button>
      </div>
    `;
    E.hist.appendChild(card);
  });
}

function saveResult(payload) {
  const items = hist();
  items.push({
    id: `${Date.now()}-${Math.round(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
    fileName: payload.fileName,
    duration: payload.duration,
    languageLabel: payload.languageLabel,
    summaryLabel: payload.summaryLabel,
    exportLabel: payload.exportLabel,
    payload
  });
  saveHist(items);
  renderHist();
}

function toSrtTime(value) {
  const total = Math.max(0, Math.floor(value));
  const hours = String(Math.floor(total / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const seconds = String(total % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds},000`;
}

function buildSrt(payload) {
  const sentences = splitSentences(payload.transcript);
  const total = Math.max(12, Math.round(payload.duration || 12));
  const chunk = Math.max(3, Math.floor(total / Math.max(sentences.length, 1)));
  return sentences.map((sentence, index) => {
    const start = index * chunk;
    const end = Math.min(total, start + chunk);
    return `${index + 1}\n${toSrtTime(start)} --> ${toSrtTime(end)}\n${sentence}\n`;
  }).join('\n');
}

function downloadBlob(content, name, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = d.createElement('a');
  link.href = url;
  link.download = name;
  d.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1200);
}

async function analyze() {
  if (state.busy) return;
  if (!state.file) {
    E.status.textContent = 'ارفع ملفًا أولًا';
    E.note.textContent = 'لا يمكن بدء التفريغ قبل اختيار ملف صوتي.';
    return;
  }

  state.busy = true;
  [E.run, E.browse, E.clear, E.demo, E.rerun].forEach((button) => { button.disabled = true; });
  E.rTitle.textContent = 'جاري تجهيز النتيجة';
  E.rMeta.textContent = 'نعالج الملف الآن ونجهز النص والملخص والكلمات المفتاحية.';

  for (let index = 0; index < stages.length; index += 1) {
    setStage(index);
    await sleep(520);
  }

  E.track.classList.remove('loading');
  const payload = buildPayload();
  renderPayload(payload);
  saveResult(payload);
  E.status.textContent = 'اكتمل التحليل';
  E.note.textContent = 'النتيجة جاهزة الآن للنسخ أو التنزيل أو الرجوع إليها من السجل.';
  E.eta.textContent = 'الوقت المتبقي: 0.0 ث';
  E.preview.textContent = `تمت معالجة ${state.file.name} بنجاح. يمكنك التنقل بين التبويبات أو تصدير النتيجة مباشرة.`;
  [E.run, E.browse, E.clear, E.demo, E.rerun].forEach((button) => { button.disabled = false; });
  state.busy = false;
}

function openTab(name) {
  E.tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === name));
  E.panels.forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === name));
}

E.theme.onclick = () => theme(body.dataset.theme === 'dark' ? 'light' : 'dark');
E.browse.onclick = () => E.file.click();
E.run.onclick = analyze;
E.rerun.onclick = analyze;
E.clear.onclick = clearSelection;
E.demo.onclick = () => {
  const demoBlob = new Blob(['demo-audio'], { type: 'audio/wav' });
  setFiles([new File([demoBlob], 'demo-lecture.wav', { type: 'audio/wav' })]);
};

E.file.onchange = (event) => setFiles(event.target.files);
['dragenter', 'dragover'].forEach((name) => E.drop.addEventListener(name, (event) => {
  event.preventDefault();
  E.drop.classList.add('dragging');
}));
['dragleave', 'drop'].forEach((name) => E.drop.addEventListener(name, (event) => {
  event.preventDefault();
  E.drop.classList.remove('dragging');
}));

E.drop.addEventListener('drop', (event) => setFiles(event.dataTransfer ? event.dataTransfer.files : []));
E.drop.addEventListener('click', (event) => {
  if (event.target.closest('button')) return;
  E.file.click();
});

E.copy.onclick = async () => {
  if (!state.payload) {
    E.note.textContent = 'لا يوجد نص لنسخه بعد.';
    return;
  }
  try {
    await navigator.clipboard.writeText(state.payload.transcript);
    E.note.textContent = 'تم نسخ النص الكامل.';
  } catch {
    E.note.textContent = 'تعذر النسخ في هذا المتصفح.';
  }
};

E.txt.onclick = () => {
  if (!state.payload) {
    E.note.textContent = 'لا توجد نتيجة TXT بعد.';
    return;
  }
  downloadBlob(state.payload.transcript, 'writewave-transcript.txt', 'text/plain;charset=utf-8');
};

E.json.onclick = () => {
  if (!state.payload) {
    E.note.textContent = 'لا توجد نتيجة JSON بعد.';
    return;
  }
  downloadBlob(JSON.stringify(state.payload, null, 2), 'writewave-result.json', 'application/json;charset=utf-8');
};

E.srt.onclick = () => {
  if (!state.payload) {
    E.note.textContent = 'لا توجد نتيجة SRT بعد.';
    return;
  }
  downloadBlob(buildSrt(state.payload), 'writewave-subtitles.srt', 'text/plain;charset=utf-8');
};

E.hist.onclick = async (event) => {
  const open = event.target.closest('[data-open]');
  const copy = event.target.closest('[data-copy]');
  const items = hist();

  if (open) {
    const item = items.find((entry) => entry.id === open.dataset.open);
    if (item) {
      renderPayload(item.payload);
      E.name.textContent = item.fileName;
      E.dur.textContent = fmt(item.duration);
      E.batch.textContent = 'نتيجة محفوظة';
      E.queue.innerHTML = '<div class="queue-pill">تم تحميل نتيجة سابقة</div>';
      E.status.textContent = 'تم تحميل نتيجة سابقة';
      E.note.textContent = 'تم تحميل السجل بنجاح.';
      E.preview.textContent = `تم استرجاع النتيجة السابقة للملف ${item.fileName}.`;
      E.fill.style.width = '100%';
      E.pills.forEach((pill) => pill.classList.add('done'));
    }
  }

  if (copy) {
    const item = items.find((entry) => entry.id === copy.dataset.copy);
    if (!item) return;
    try {
      await navigator.clipboard.writeText(item.payload.transcript);
      E.note.textContent = 'تم نسخ النص من السجل.';
    } catch {
      E.note.textContent = 'تعذر النسخ من السجل في هذا المتصفح.';
    }
  }
};

E.tabs.forEach((tab) => {
  tab.onclick = () => openTab(tab.dataset.tab);
});

[E.lang, E.summary, E.exp].forEach((field) => {
  field.onchange = tags;
});
E.kw.oninput = tags;

theme(localStorage.getItem(THEME) || ((window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'));
reveal();
renderHist();
tags();
draw([]);
resetProgress();
resetResult();
