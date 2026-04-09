const THEME_KEY = "mulhem_theme_v2";
const LANG_KEY = "mulhem_lang_v2";

const themeToggle = document.getElementById("themeToggle");
const langAr = document.getElementById("langAr");
const langEn = document.getElementById("langEn");
const heroText = document.getElementById("heroText");
const heroVoice = document.getElementById("heroVoice");
const heroPreview = document.getElementById("heroPreview");
const heroStatus = document.getElementById("heroStatus");
const servicesGrid = document.getElementById("servicesGrid");
const voicesGrid = document.getElementById("voicesGrid");
const usesGrid = document.getElementById("usesGrid");
const infoGrid = document.getElementById("infoGrid");
const trustGrid = document.getElementById("trustGrid");
const faqGrid = document.getElementById("faqGrid");
const toTopBtn = document.getElementById("toTopBtn");

let currentLang = "ar";

const copy = {
  ar: {
    title: "مُلهم ساوند | منصة الصوت الذكية",
    theme_dark: "الوضع الليلي",
    theme_light: "الوضع النهاري",
    nav_home: "الرئيسية",
    nav_services: "الخدمات",
    nav_voxa: "Voxa",
    nav_writewave: "WriteWave",
    nav_voices: "الأصوات",
    nav_faq: "الأسئلة الشائعة",
    hero_badge: "منصة الصوت الذكية",
    hero_title: "أنشئ صوتًا عربيًا احترافيًا أو حوّل التسجيل إلى نص خلال ثوانٍ",
    hero_lead: "مُلهم ساوند يجمع بين النص إلى صوت، والصوت إلى نص، وتلخيص التسجيلات، وتحسين الصوت، وأنماط جاهزة للمحتوى داخل تجربة واحدة واضحة وسريعة.",
    hero_primary: "جرّب تحويل الصوت إلى نص",
    hero_secondary: "جرّب تحويل النص إلى صوت",
    hero_tag_1: "تفريغ ذكي + تلخيص",
    hero_tag_2: "أصوات عربية جاهزة",
    hero_tag_3: "تجربة سريعة وواضحة",
    stat_one: "ملف صوتي تم العمل عليه",
    stat_two: "أصوات رئيسية داخل Voxa",
    stat_three: "متوسط تجهيز النتيجة",
    demo_badge: "تجربة مباشرة",
    demo_title: "جرّب تفريغًا سريعًا من الصفحة نفسها",
    demo_lead: "اضغط تجربة سريعة وسنأخذك مباشرة لصفحة التفريغ مع مثال جاهز لتشاهد النتيجة والتنزيل.",
    demo_voice_label: "نوع المثال",
    demo_preview: "ابدأ تجربة سريعة",
    demo_cta: "افتح WriteWave",
    demo_status: "سيتم نقلك لتجربة تفريغ جاهزة مع ملخص ونقاط قابلة للنسخ والتنزيل.",
    demo_text: "ملخص سريع: الاجتماع ركز على ثلاث نقاط رئيسية: تحديث الجدول الزمني، توزيع المهام، وتأكيد المخرجات النهائية.",
    services_badge: "الخدمات",
    services_title: "خدمتان رئيسيتان تبدأ منهما التجربة",
    services_copy: "ابدأ إمّا بتحويل الصوت إلى نص عبر WriteWave، أو بتحويل النص إلى صوت عبر Voxa. هذا هو قلب المنتج قبل أي أدوات مساندة.",
    voices_badge: "اسمع الفرق",
    voices_title: "مكتبة أصوات أكثر إقناعًا من التسميات العامة",
    voices_copy: "رفعنا قيمة التجربة التسويقية عبر أسماء أصوات أوضح، واستخدامات محددة، وزر استماع لكل بطاقة حتى يشعر المستخدم أن المنصة غنية وليست مجرد واجهة تجريبية.",
    uses_badge: "الاستخدامات",
    uses_title: "أين تستفيد من مُلهم ساوند؟",
    uses_copy: "المنصة مصممة لتخدم المحتوى، والتعليم، والإعلانات، والتوثيق الصوتي بدل أن تكون مجرد أداة منعزلة عن السياق العملي.",
    info_badge: "الثقة والهوية",
    info_title: "تعرّف على المنتج قبل أن تبدأ",
    info_copy: "أضفنا صفحات مستقلة تبني الثقة وتشرح من نحن وماذا نقدم وكيف تتواصل معنا بسهولة.",
    trust_badge: "الثقة",
    trust_title: "عناصر ثقة ترفع قيمة المنتج",
    trust_copy: "الموقع الآن لا يكتفي بشرح الفكرة، بل يعرض مؤشرات ثقة واضحة: سرعة، دقة، مخرجات متعددة، وتجربة ثنائية اللغة.",
    faq_badge: "FAQ",
    faq_title: "أسئلة متوقعة قبل التجربة أو الشراء",
    faq_copy: "هذا القسم يخفف التردد ويشرح بوضوح ما هو جاهز الآن، وما الذي ما يزال في مرحلة التطوير داخل المنصة.",
    footer_home: "الرئيسية",
    footer_about: "من نحن",
    footer_offerings: "ماذا نقدم",
    footer_contact: "تواصل معنا",
    footer_faq: "الأسئلة الشائعة",
    footer_note: "منصة صوت ذكية تركّز على منتجين رئيسيين واضحين: تحويل النص إلى صوت وتحويل الصوت إلى نص، مع أدوات مساندة عند الحاجة.",
    faq_toggle_open: "إظهار الإجابة",
    faq_toggle_close: "إخفاء الإجابة",
    preview_playing: "جارٍ تجهيز تجربة التفريغ السريعة الآن.",
    preview_missing: "تعذّر تشغيل تجربة التفريغ السريعة. افتح WriteWave للمتابعة.",
    preview_ready: "اضغط ابدأ تجربة سريعة لنقلك مباشرة إلى صفحة التفريغ."
  },
  en: {
    title: "Mulhem Sound | AI Audio Platform",
    theme_dark: "Dark Mode",
    theme_light: "Light Mode",
    nav_home: "Home",
    nav_services: "Services",
    nav_voxa: "Voxa",
    nav_writewave: "WriteWave",
    nav_voices: "Voices",
    nav_faq: "FAQ",
    hero_badge: "AI Audio Platform",
    hero_title: "Create polished Arabic voiceovers or turn recordings into text in seconds",
    hero_lead: "Mulhem Sound brings together text to speech, speech to text, audio summaries, enhancement, and ready-made voice styles inside one clear product flow.",
    hero_primary: "Try Speech to Text",
    hero_secondary: "Try Text to Speech",
    hero_tag_1: "Smart transcription + summary",
    hero_tag_2: "Ready Arabic voices",
    hero_tag_3: "Fast and clear UX",
    stat_one: "audio files processed",
    stat_two: "core voices inside Voxa",
    stat_three: "average result time",
    demo_badge: "Live Demo",
    demo_title: "Try a quick transcription demo from the homepage",
    demo_lead: "Click the quick demo and we will take you to the transcription page with a ready example.",
    demo_voice_label: "Demo scenario",
    demo_preview: "Start Quick Demo",
    demo_cta: "Open WriteWave",
    demo_status: "You will be redirected to a ready transcription demo with summary and key points.",
    demo_text: "Quick summary: the meeting focused on timeline updates, task ownership, and final deliverables.",
    services_badge: "Services",
    services_title: "Two primary products lead the experience",
    services_copy: "Start with WriteWave for speech to text or Voxa for text to speech. These two products now carry the product story first.",
    voices_badge: "Hear The Difference",
    voices_title: "A stronger voice shelf than generic labels",
    voices_copy: "We upgraded the product story with clearer voice names, sharper use-cases, and preview buttons so the platform feels richer and easier to trust.",
    uses_badge: "Use Cases",
    uses_title: "Where does Mulhem Sound help?",
    uses_copy: "The platform is built for creators, education, ads, and voice documentation instead of feeling like a disconnected utility.",
    info_badge: "Identity",
    info_title: "Understand the product before you start",
    info_copy: "We added dedicated pages that explain who we are, what we offer, and how to contact the team.",
    trust_badge: "Trust",
    trust_title: "Signals that make the product feel ready",
    trust_copy: "The site now goes beyond explaining the idea and starts showing speed, clarity, export flexibility, and a bilingual experience.",
    faq_badge: "FAQ",
    faq_title: "Questions users ask before they try or buy",
    faq_copy: "This section reduces hesitation and makes it clear what is ready today versus what is still evolving in the platform.",
    footer_home: "Home",
    footer_about: "About",
    footer_offerings: "What We Offer",
    footer_contact: "Contact",
    footer_faq: "FAQ",
    footer_note: "An audio platform centered on two clear flagship products: text to speech and speech to text, with supporting tools when needed.",
    faq_toggle_open: "Show Answer",
    faq_toggle_close: "Hide Answer",
    preview_playing: "Launching the quick transcription demo now.",
    preview_missing: "Quick demo is unavailable in this browser. Open WriteWave to continue.",
    preview_ready: "Press Start Quick Demo to jump into the transcription page."
  }
};

const services = {
  ar: [
    {
      icon: "🎙️",
      title: "WriteWave™",
      text: "حوّل التسجيل إلى نص مع تبويبات للملخص والنقاط والترجمة والتصدير.",
      href: "transcribe.html",
      cta: "افتح الخدمة"
    },
    {
      icon: "🔊",
      title: "Voxa™",
      text: "حوّل النص إلى صوت مع مكتبة أصوات أوضح وتصنيفات أقرب للاستخدام الفعلي.",
      href: "voxa.html",
      cta: "جرّب الآن"
    }
  ],
  en: [
    {
      icon: "🎙️",
      title: "WriteWave™",
      text: "Turn recordings into text with tabs for summary, highlights, translation, and exports.",
      href: "transcribe.html",
      cta: "Open Service"
    },
    {
      icon: "🔊",
      title: "Voxa™",
      text: "Convert text into speech with a clearer voice shelf and more practical categories.",
      href: "voxa.html",
      cta: "Try Now"
    }
  ]
};

const infoCards = {
  ar: [
    {
      icon: "🟢",
      title: "من نحن",
      text: "صفحة قصيرة تشرح لماذا بُني مُلهم ساوند ولمن صُمم وما الذي نريد تحسينه في تجربة الصوت العربية.",
      href: "about.html",
      cta: "اكتشف الصفحة"
    },
    {
      icon: "🧩",
      title: "ماذا نقدم",
      text: "شرح سريع للمنتجين الرئيسيين والأدوات المساندة مثل التحسين والتقطيع وأنماط الصوت.",
      href: "offerings.html",
      cta: "شاهد الخدمات"
    },
    {
      icon: "📨",
      title: "تواصل معنا",
      text: "طرق واضحة للتواصل وطلب العروض والأسئلة العامة بدل ترك الموقع بلا نقطة ثقة مباشرة.",
      href: "contact.html",
      cta: "افتح الصفحة"
    }
  ],
  en: [
    {
      icon: "🟢",
      title: "About",
      text: "A short page explaining why Mulhem Sound was built, who it serves, and what we aim to improve in Arabic audio workflows.",
      href: "about.html",
      cta: "Open Page"
    },
    {
      icon: "🧩",
      title: "What We Offer",
      text: "A quick overview of the two flagship products and the supporting tools around enhancement, cutting, and voice styles.",
      href: "offerings.html",
      cta: "See Services"
    },
    {
      icon: "📨",
      title: "Contact",
      text: "Clear ways to reach the team for questions, product feedback, or enterprise requests.",
      href: "contact.html",
      cta: "Get In Touch"
    }
  ]
};

const voiceShelf = {
  ar: [
    {
      name: "سِراج",
      label: "رسمي",
      desc: "صوت رجالي رسمي للعروض التنفيذية والمقدمات الواثقة.",
      sample: "مرحبًا بكم. هذا مثال على صوت رسمي واضح من مُلهم ساوند."
    },
    {
      name: "لُجين",
      label: "واضح",
      desc: "صوت نسائي أنيق للشرح والمحتوى التعليمي الهادئ.",
      sample: "أهلًا بكم. هذا نموذج صوتي واضح يناسب الشروحات والمحتوى التعليمي."
    },
    {
      name: "رَواد",
      label: "إذاعي",
      desc: "صوت إذاعي قوي للمقدمات والهوية السمعية والمحتوى الإعلاني.",
      sample: "هنا تبدأ التجربة بصوت إذاعي قوي يمنح النص حضورًا أكبر."
    },
    {
      name: "نوف",
      label: "خليجي",
      desc: "صوت خليجي دافئ للمحتوى المحلي والسوشيال القريب من المستخدم.",
      sample: "هذا مثال على صوت خليجي دافئ يناسب المحتوى المحلي اليومي."
    }
  ],
  en: [
    {
      name: "Siraj",
      label: "Formal",
      desc: "A formal male voice for executive presentations and confident intros.",
      sample: "Welcome. This is a formal sample voice from Mulhem Sound."
    },
    {
      name: "Lujain",
      label: "Clear",
      desc: "An elegant female voice for explainers and calm educational content.",
      sample: "Welcome. This is a clear sample voice built for educational content."
    },
    {
      name: "Ruwad",
      label: "Radio",
      desc: "A radio-style voice for intros, sonic branding, and strong promo reads.",
      sample: "This is a radio-style sample with stronger presence and delivery."
    },
    {
      name: "Nouf",
      label: "Gulf",
      desc: "A warm Gulf-style voice for regional content and local social media.",
      sample: "Here is a warm Gulf-style sample that feels more local and approachable."
    }
  ]
};

const useCases = {
  ar: [
    { icon: "🎓", title: "تعليم", text: "حوّل المحاضرات إلى نص، لخّصها، ثم أنشئ نسخة صوتية للشرح نفسه." },
    { icon: "🎙️", title: "بودكاست", text: "أنشئ مقدمات، حرر الحلقات، واستخرج نصوصًا قابلة للنشر والمراجعة." },
    { icon: "📣", title: "إعلانات", text: "جهّز نصًا إعلانيًا، جرّب أكثر من صوت، ثم صدّر النتيجة بسرعة." },
    { icon: "📱", title: "سوشيال", text: "حوّل فكرة قصيرة إلى تعليق صوتي أو نقاط نصية جاهزة للنشر." }
  ],
  en: [
    { icon: "🎓", title: "Education", text: "Turn lectures into text, summarize them, then create a voice version for learning content." },
    { icon: "🎙️", title: "Podcasting", text: "Create intros, refine episodes, and extract publish-ready transcripts and notes." },
    { icon: "📣", title: "Advertising", text: "Prepare ad scripts, preview multiple voices, and export campaign audio fast." },
    { icon: "📱", title: "Social Media", text: "Turn short ideas into voiceovers or structured text snippets ready to publish." }
  ]
};

const trustSignals = {
  ar: [
    { value: "سريع", title: "تدفّق واضح", text: "المستخدم يفهم خلال ثوانٍ ما الذي يستطيع فعله وأين يذهب بعد ذلك." },
    { value: "AR / EN", title: "ثنائي اللغة", text: "واجهة عربية وإنجليزية مع حفظ التفضيل داخل المتصفح." },
    { value: "TXT / JSON / SRT", title: "مخرجات متعددة", text: "النتيجة لا تتوقف عند النص، بل تمتد إلى تصديرات جاهزة للاستخدام." },
    { value: "8", title: "أصوات أوضح", text: "مكتبة أصوات أكثر إقناعًا من التسميات العامة القديمة." }
  ],
  en: [
    { value: "Fast", title: "Clear flow", text: "Users understand within seconds what they can do and where to go next." },
    { value: "AR / EN", title: "Bilingual UI", text: "Arabic and English interface with the preference stored locally." },
    { value: "TXT / JSON / SRT", title: "Multiple outputs", text: "The result goes beyond plain text into export-ready formats." },
    { value: "8", title: "Stronger voice shelf", text: "A more convincing voice library than the earlier generic labels." }
  ]
};

const faqs = {
  ar: [
    {
      q: "هل تحويل الصوت إلى نص موجود فعليًا الآن؟",
      a: "نعم. WriteWave صفحة مستقلة للصوت إلى نص، وبداخلها رفع ملفات، ومعالجة متعددة المراحل، وتبويبات للنتائج، وتصدير TXT وJSON وSRT."
    },
    {
      q: "هل يوجد زر لغة عربي / English؟",
      a: "نعم. أضفنا تبديلاً واضحًا للغة في الصفحة الرئيسية وصفحة Voxa، مع حفظ الاختيار داخل المتصفح."
    },
    {
      q: "هل Voxa يعمل بمحرك أصوات داخلي كامل؟",
      a: "ليس بعد بالكامل. المعاينة الحالية تبدأ من الأصوات المتاحة على الجهاز، بينما تتجه المرحلة التالية إلى ربط Voxa بمكتبة أصوات أوسع وتجربة أكثر ثباتًا."
    },
    {
      q: "ما الخطوة التالية بعد هذه النسخة؟",
      a: "الأولوية التالية هي ربط Voxa بمحرك TTS فعلي، ثم توسيع العينات الجاهزة، ثم رفع بقية الصفحات لنفس مستوى WriteWave."
    }
  ],
  en: [
    {
      q: "Is speech to text actually available now?",
      a: "Yes. WriteWave is already a dedicated speech-to-text page with uploads, staged processing, tabbed results, and TXT/JSON/SRT export."
    },
    {
      q: "Is there now an Arabic / English switch?",
      a: "Yes. We added a visible language switch on the homepage and Voxa, while keeping the preference stored locally."
    },
    {
      q: "Does Voxa already run on a fully internal TTS engine?",
      a: "Not fully yet. The current preview starts from device-available voices, while the next stage connects Voxa to a broader voice library and a steadier audio experience."
    },
    {
      q: "What should be built next?",
      a: "The next priority is connecting Voxa to a real TTS engine, expanding ready-made samples, and bringing the remaining pages up to the same product level as WriteWave."
    }
  ]
};

const heroVoices = {
  ar: [
    { id: "siraj", label: "سِراج — رسمي", sample: "مرحبًا بكم في مُلهم ساوند. هنا نساعدكم على تحويل الصوت والنص إلى محتوى احترافي بسرعة ووضوح." },
    { id: "lujain", label: "لُجين — واضحة", sample: "هذه معاينة لصوت واضح ومريح يناسب الشروحات والمحتوى التعليمي." },
    { id: "ruwad", label: "رَواد — إذاعي", sample: "ابدأ الآن مع صوت إذاعي أقوى حضورًا للمقدمات والهوية السمعية." },
    { id: "nouf", label: "نوف — خليجي", sample: "هنا تجربة صوت خليجي دافئ أقرب للمحتوى المحلي والسوشيال." }
  ],
  en: [
    { id: "siraj", label: "Siraj — Formal", sample: "Welcome to Mulhem Sound. We help you turn text and audio into polished content with speed and clarity." },
    { id: "lujain", label: "Lujain — Clear", sample: "This is a calm and clear sample voice that works well for explainers and educational content." },
    { id: "ruwad", label: "Ruwad — Radio", sample: "Start with a stronger radio-style voice for intros and brand identity." },
    { id: "nouf", label: "Nouf — Gulf", sample: "Here is a warm Gulf-style sample built for local content and social media." }
  ]
};

function revealNodes() {
  const nodes = Array.from(document.querySelectorAll("[data-animate]"));
  nodes.forEach((node, index) => {
    node.style.transitionDelay = `${Math.min(index * 45, 220)}ms`;
  });

  if (!("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  nodes.forEach((node) => observer.observe(node));
}

function setText(node, value) {
  if (node) node.textContent = value;
}

function applyTheme(theme) {
  const next = theme === "dark" ? "dark" : "light";
  document.body.dataset.theme = next;
  setText(themeToggle, next === "dark" ? copy[currentLang].theme_light : copy[currentLang].theme_dark);
  localStorage.setItem(THEME_KEY, next);
}

const previewProfiles = {
  siraj: { langCode: "ar-SA", voiceIndex: 0, voiceHints: ["hamed", "saudi", "male", "ar-sa"], rate: 0.94, pitch: 0.88 },
  lujain: { langCode: "ar-SA", voiceIndex: 1, voiceHints: ["zariyah", "female", "saudi", "ar-sa"], rate: 0.99, pitch: 1.16 },
  ruwad: { langCode: "ar-EG", voiceIndex: 2, voiceHints: ["shakir", "broadcast", "male", "ar-eg"], rate: 1.02, pitch: 0.94 },
  nouf: { langCode: "ar-SA", voiceIndex: 3, voiceHints: ["female", "saudi", "gulf", "ar-sa"], rate: 1.0, pitch: 1.08 }
};

function getPreferredVoice(langCode, profileId = "siraj") {
  const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  if (!voices.length) return null;
  const profile = previewProfiles[profileId] || previewProfiles.siraj;
  const desiredCodes = [currentLang === "ar" ? profile.langCode : null, langCode]
    .filter(Boolean)
    .map((code) => code.toLowerCase());

  let filtered = voices.filter((voice) => {
    const candidate = voice.lang.toLowerCase();
    return desiredCodes.some((code) => candidate.startsWith(code));
  });

  if (!filtered.length) {
    const baseCode = currentLang === "ar" ? "ar" : "en";
    filtered = voices.filter((voice) => voice.lang.toLowerCase().startsWith(baseCode));
  }

  if (!filtered.length) filtered = voices;

  const hinted = filtered.find((voice) => {
    const ref = `${voice.name} ${voice.voiceURI} ${voice.lang}`.toLowerCase();
    return profile.voiceHints.some((hint) => ref.includes(hint));
  });

  return hinted
    || filtered[profile.voiceIndex % filtered.length]
    || filtered[0]
    || null;
}

function playPreview(text, voiceLabel, profileId = "siraj") {
  if (!("speechSynthesis" in window)) {
    setText(heroStatus, copy[currentLang].preview_missing);
    return;
  }

  const profile = previewProfiles[profileId] || previewProfiles.siraj;
  const utterance = new SpeechSynthesisUtterance(text);
  const langCode = currentLang === "ar" ? "ar" : "en";
  const matchedVoice = getPreferredVoice(langCode, profileId);
  utterance.lang = currentLang === "ar" ? (profile.langCode || "ar-SA") : "en-US";
  utterance.rate = profile.rate;
  utterance.pitch = profile.pitch;
  if (matchedVoice) utterance.voice = matchedVoice;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  setText(heroStatus, copy[currentLang].preview_playing.replace("{voice}", voiceLabel));
}

function renderServices() {
  servicesGrid.innerHTML = services[currentLang].map((item) => `
    <article class="card" data-animate>
      <div class="icon">${item.icon}</div>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
      <a class="service-link" href="${item.href}">${item.cta} ←</a>
    </article>
  `).join("");
}

function renderVoiceShelf() {
  voicesGrid.innerHTML = voiceShelf[currentLang].map((voice, index) => `
    <article class="card" data-animate>
      <div class="icon">🎚️</div>
      <div class="voice-meta">
        <span class="voice-badge">${voice.label}</span>
      </div>
      <h3>${voice.name}</h3>
      <p>${voice.desc}</p>
      <div class="voice-actions">
        <button class="btn btn-secondary preview-shelf" type="button" data-sample="${voice.sample}" data-voice="${voice.name}" data-voice-id="${heroVoices[currentLang][index]?.id || "siraj"}">
          ${currentLang === "ar" ? "استمع" : "Listen"}
        </button>
        <a class="voice-link" href="voxa.html">${currentLang === "ar" ? "افتح Voxa" : "Open Voxa"} ←</a>
      </div>
    </article>
  `).join("");
}

function renderUseCases() {
  usesGrid.innerHTML = useCases[currentLang].map((item) => `
    <article class="card" data-animate>
      <div class="icon">${item.icon}</div>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    </article>
  `).join("");
}

function renderInfoCards() {
  infoGrid.innerHTML = infoCards[currentLang].map((item) => `
    <article class="card" data-animate>
      <div class="icon">${item.icon}</div>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
      <a class="service-link" href="${item.href}">${item.cta} ←</a>
    </article>
  `).join("");
}

function renderTrustSignals() {
  trustGrid.innerHTML = trustSignals[currentLang].map((item) => `
    <article class="card" data-animate>
      <strong>${item.value}</strong>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    </article>
  `).join("");
}

function renderFaq() {
  faqGrid.innerHTML = faqs[currentLang].map((item, index) => `
    <article class="faq-item" data-animate>
      <div class="faq-row">
        <h3 style="flex:1;">${item.q}</h3>
        <button class="faq-toggle" type="button" data-faq="${index}">
          ${copy[currentLang].faq_toggle_open}
        </button>
      </div>
      <div class="faq-answer">${item.a}</div>
    </article>
  `).join("");
}

function renderHeroVoices() {
  if (!heroVoice) return;
  heroVoice.innerHTML = heroVoices[currentLang].map((voice) => `
    <option value="${voice.id}">${voice.label}</option>
  `).join("");
}

function updateLocalizedNodes() {
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (copy[currentLang][key]) {
      node.textContent = copy[currentLang][key];
    }
  });
}

function refreshMotionVisibility() {
  document.querySelectorAll("[data-animate]").forEach((node) => {
    node.classList.remove("is-visible");
  });
  revealNodes();
}

function applyLanguage(lang) {
  currentLang = lang === "en" ? "en" : "ar";
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
  document.title = copy[currentLang].title;

  langAr.classList.toggle("active", currentLang === "ar");
  langEn.classList.toggle("active", currentLang === "en");

  updateLocalizedNodes();
  renderServices();
  renderVoiceShelf();
  renderUseCases();
  renderInfoCards();
  renderTrustSignals();
  renderFaq();
  renderHeroVoices();

  heroText.value = copy[currentLang].demo_text;
  setText(heroStatus, copy[currentLang].preview_ready);
  applyTheme(document.body.dataset.theme || localStorage.getItem(THEME_KEY) || "light");
  localStorage.setItem(LANG_KEY, currentLang);
  refreshMotionVisibility();
}

heroPreview.addEventListener("click", () => {
  try {
    localStorage.setItem("mulhem_transcribe_autodemo", "1");
  } catch {}
  window.location.href = "transcribe.html#demo";
});

if (heroVoice) {
  heroVoice.addEventListener("change", () => {
    const selected = heroVoices[currentLang].find((voice) => voice.id === heroVoice.value) || heroVoices[currentLang][0];
    if (!heroText.value.trim()) {
      heroText.value = selected.sample;
    }
  });
}

voicesGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".card");
  if (card && !event.target.closest("a, button")) {
    const link = card.querySelector(".voice-link");
    if (link) window.location.href = link.getAttribute("href");
    return;
  }
  const button = event.target.closest(".preview-shelf");
  if (!button) return;
  playPreview(button.dataset.sample, button.dataset.voice, button.dataset.voiceId);
});

servicesGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".card");
  if (!card || event.target.closest("a, button")) return;
  const link = card.querySelector(".service-link");
  if (link) window.location.href = link.getAttribute("href");
});

infoGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".card");
  if (!card || event.target.closest("a, button")) return;
  const link = card.querySelector(".service-link");
  if (link) window.location.href = link.getAttribute("href");
});

faqGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-faq]");
  if (!button) return;
  const item = button.closest(".faq-item");
  const open = item.classList.toggle("open");
  button.textContent = open ? copy[currentLang].faq_toggle_close : copy[currentLang].faq_toggle_open;
});

themeToggle.addEventListener("click", () => {
  applyTheme(document.body.dataset.theme === "dark" ? "light" : "dark");
});

langAr.addEventListener("click", () => applyLanguage("ar"));
langEn.addEventListener("click", () => applyLanguage("en"));

window.addEventListener("scroll", () => {
  toTopBtn.classList.toggle("visible", window.scrollY > 420);
});

toTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.speechSynthesis?.addEventListener?.("voiceschanged", () => {
  setText(heroStatus, copy[currentLang].preview_ready);
});

applyTheme(localStorage.getItem(THEME_KEY) || ((window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light"));
applyLanguage(localStorage.getItem(LANG_KEY) || "ar");
