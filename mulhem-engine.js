"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");
const { spawnSync } = require("child_process");

const SAMPLE_RATE = 24000;
const ENGINE_VERSION = "3.0.0";
const TWO_PI = Math.PI * 2;
const ML_MANIFEST_PATH = path.join(__dirname, "models", "arabic-tts.manifest.json");

const STYLE_PROFILES = {
  podcast: {
    rate: 1.0,
    pitchShift: 0,
    energy: 0.54,
    pauseScale: 1.0,
    contour: 0.18,
    brightness: 0.02,
    attack: 0.018,
    release: 0.12
  },
  ad: {
    rate: 1.12,
    pitchShift: 0.08,
    energy: 0.8,
    pauseScale: 0.72,
    contour: 0.28,
    brightness: 0.14,
    attack: 0.012,
    release: 0.08
  },
  education: {
    rate: 0.95,
    pitchShift: -0.03,
    energy: 0.46,
    pauseScale: 1.06,
    contour: 0.12,
    brightness: -0.02,
    attack: 0.02,
    release: 0.14
  },
  story: {
    rate: 0.86,
    pitchShift: 0.03,
    energy: 0.62,
    pauseScale: 1.24,
    contour: 0.24,
    brightness: -0.04,
    attack: 0.024,
    release: 0.18
  }
};

const VOICE_PROFILES = {
  siraj: {
    baseHz: 118,
    brightness: 0.88,
    warmth: 1.05,
    breath: 0.03,
    vibratoDepth: 0.002,
    vibratoRate: 4.4,
    robotMix: 0.01,
    rhythm: 0.98,
    resonance: 0.98,
    tilt: -0.05
  },
  lujain: {
    baseHz: 192,
    brightness: 1.08,
    warmth: 0.96,
    breath: 0.05,
    vibratoDepth: 0.009,
    vibratoRate: 5.2,
    robotMix: 0.02,
    rhythm: 1.0,
    resonance: 1.04,
    tilt: 0.08
  },
  ruwad: {
    baseHz: 132,
    brightness: 1.0,
    warmth: 1.08,
    breath: 0.04,
    vibratoDepth: 0.005,
    vibratoRate: 4.6,
    robotMix: 0.02,
    rhythm: 1.03,
    resonance: 1.02,
    tilt: 0.03
  },
  nouf: {
    baseHz: 178,
    brightness: 0.96,
    warmth: 1.06,
    breath: 0.07,
    vibratoDepth: 0.011,
    vibratoRate: 5.1,
    robotMix: 0.03,
    rhythm: 1.02,
    resonance: 1.0,
    tilt: -0.01
  },
  sami: {
    baseHz: 148,
    brightness: 1.15,
    warmth: 0.9,
    breath: 0.03,
    vibratoDepth: 0.016,
    vibratoRate: 5.8,
    robotMix: 0.04,
    rhythm: 1.12,
    resonance: 0.94,
    tilt: 0.14
  },
  atheer: {
    baseHz: 164,
    brightness: 0.86,
    warmth: 1.12,
    breath: 0.08,
    vibratoDepth: 0.013,
    vibratoRate: 4.1,
    robotMix: 0.02,
    rhythm: 0.86,
    resonance: 1.08,
    tilt: -0.08
  },
  juman: {
    baseHz: 156,
    brightness: 0.98,
    warmth: 1.02,
    breath: 0.05,
    vibratoDepth: 0.007,
    vibratoRate: 4.8,
    robotMix: 0.02,
    rhythm: 0.95,
    resonance: 1.01,
    tilt: -0.01
  },
  barq: {
    baseHz: 144,
    brightness: 1.22,
    warmth: 0.88,
    breath: 0.04,
    vibratoDepth: 0.003,
    vibratoRate: 6.2,
    robotMix: 0.05,
    rhythm: 1.18,
    resonance: 0.9,
    tilt: 0.2
  },
  robot: {
    baseHz: 126,
    brightness: 1.32,
    warmth: 0.76,
    breath: 0.01,
    vibratoDepth: 0,
    vibratoRate: 0,
    robotMix: 0.32,
    rhythm: 1.03,
    resonance: 0.86,
    tilt: 0.22
  }
};

const DIGIT_WORDS_AR = [
  "\u0635\u0641\u0631",
  "\u0648\u0627\u062d\u062f",
  "\u0627\u062b\u0646\u0627\u0646",
  "\u062b\u0644\u0627\u062b\u0629",
  "\u0623\u0631\u0628\u0639\u0629",
  "\u062e\u0645\u0633\u0629",
  "\u0633\u062a\u0629",
  "\u0633\u0628\u0639\u0629",
  "\u062b\u0645\u0627\u0646\u064a\u0629",
  "\u062a\u0633\u0639\u0629"
];

const DIGIT_WORDS_EN = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine"
];

const FORMANTS = {
  a: [730, 1200, 2550],
  i: [310, 2200, 2960],
  u: [360, 880, 2250],
  e: [500, 1850, 2550],
  o: [470, 980, 2400],
  schwa: [560, 1500, 2450],
  back: [620, 1100, 2200],
  front: [350, 2050, 2850],
  nasal: [270, 1200, 2350],
  fricative: [420, 2600, 3950],
  plosive: [600, 1650, 3050],
  liquid: [480, 1450, 2500]
};

const ARABIC_RANGE = /[\u0600-\u06ff]/;
const DIACRITICS = /[\u064b-\u065f\u0670\u0640]/g;
const ARABIC_DIGITS = /[\u0660-\u0669]/g;
const TOKEN_PATTERN = /([.!?,;:\u060c\u061b\u061f])/g;

const SPACE_TOKEN = { type: "space", duration: 0.034, formants: FORMANTS.schwa, voiced: 0, noise: 0 };
const PUNCTUATION = {
  ".": { duration: 0.17, contour: -0.04, question: false },
  "!": { duration: 0.15, contour: 0.06, question: false },
  "?": { duration: 0.16, contour: 0.08, question: true },
  ",": { duration: 0.09, contour: 0, question: false },
  ";": { duration: 0.12, contour: -0.02, question: false },
  ":": { duration: 0.11, contour: 0.01, question: false },
  "\u060c": { duration: 0.09, contour: 0, question: false },
  "\u061b": { duration: 0.12, contour: -0.02, question: false },
  "\u061f": { duration: 0.16, contour: 0.08, question: true }
};

const ARABIC_GROUPS = {
  vowels: new Set(["\u0627", "\u0648", "\u064a", "\u0649", "\u0622", "\u0623", "\u0625", "\u0629"]),
  nasals: new Set(["\u0645", "\u0646"]),
  liquids: new Set(["\u0644", "\u0631"]),
  glides: new Set(["\u0648", "\u064a"]),
  fricatives: new Set(["\u0633", "\u0632", "\u0635", "\u0636", "\u0638", "\u0634", "\u062b", "\u062d", "\u062e", "\u0641", "\u0647", "\u063a"]),
  plosives: new Set(["\u0628", "\u062a", "\u062f", "\u0637", "\u0642", "\u0643", "\u062c", "\u0621"])
};

const LATIN_GROUPS = {
  vowels: new Set(["a", "e", "i", "o", "u", "y"]),
  nasals: new Set(["m", "n"]),
  liquids: new Set(["l", "r"]),
  glides: new Set(["w", "y"]),
  fricatives: new Set(["f", "v", "s", "z", "x", "h", "j"]),
  plosives: new Set(["b", "c", "d", "g", "k", "p", "q", "t"])
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function detectLanguage(text, preferred) {
  const lang = String(preferred || "").toLowerCase();
  if (lang.startsWith("en")) return "en";
  if (lang.startsWith("ar")) return "ar";
  return ARABIC_RANGE.test(text) ? "ar" : "en";
}

function asciiDigits(input) {
  return input.replace(ARABIC_DIGITS, (digit) => String(digit.charCodeAt(0) - 0x0660));
}

function expandDigitSequence(raw, lang) {
  const source = asciiDigits(raw).replace(/[.,]/g, "");
  const table = lang === "en" ? DIGIT_WORDS_EN : DIGIT_WORDS_AR;
  return source
    .split("")
    .map((char) => table[Number(char)] || char)
    .join(" ");
}

function normalizeText(text, preferredLang) {
  const base = String(text || "")
    .normalize("NFKC")
    .replace(DIACRITICS, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[(){}\[\]"']/g, " ")
    .replace(/\//g, " / ")
    .replace(/\n+/g, ". ")
    .replace(/\s+/g, " ")
    .trim();

  const lang = detectLanguage(base, preferredLang);
  const expanded = asciiDigits(base).replace(/\d[\d.,]*/g, (token) => expandDigitSequence(token, lang));
  return {
    lang,
    text: expanded
      .replace(TOKEN_PATTERN, " $1 ")
      .replace(/\s+/g, " ")
      .trim()
  };
}

function vowelKey(char, lang) {
  const lower = char.toLowerCase();
  if (lang === "ar") {
    if (char === "\u0648") return "u";
    if (char === "\u064a" || char === "\u0649" || char === "\u0625") return "i";
    if (char === "\u0627" || char === "\u0623" || char === "\u0622" || char === "\u0629") return "a";
    return "schwa";
  }
  if (lower === "i" || lower === "y") return "i";
  if (lower === "u") return "u";
  if (lower === "e") return "e";
  if (lower === "o") return "o";
  if (lower === "a") return "a";
  return "schwa";
}

function classifyChar(char, lang) {
  if (char === " ") return { ...SPACE_TOKEN };
  if (PUNCTUATION[char]) {
    return {
      type: "punct",
      duration: PUNCTUATION[char].duration,
      contour: PUNCTUATION[char].contour,
      question: PUNCTUATION[char].question,
      voiced: 0,
      noise: 0,
      formants: FORMANTS.schwa
    };
  }

  const lower = char.toLowerCase();
  const groups = lang === "ar" ? ARABIC_GROUPS : LATIN_GROUPS;

  if (groups.vowels.has(lang === "ar" ? char : lower)) {
    const key = vowelKey(char, lang);
    return { type: "vowel", duration: 0.084, formants: FORMANTS[key], voiced: 1, noise: 0.04 };
  }

  if (groups.nasals.has(lang === "ar" ? char : lower)) {
    return { type: "nasal", duration: 0.064, formants: FORMANTS.nasal, voiced: 0.88, noise: 0.08 };
  }

  if (groups.liquids.has(lang === "ar" ? char : lower)) {
    return { type: "liquid", duration: 0.06, formants: FORMANTS.liquid, voiced: 0.84, noise: 0.07 };
  }

  if (groups.glides.has(lang === "ar" ? char : lower)) {
    const key = lower === "w" || char === "\u0648" ? "u" : "i";
    return { type: "glide", duration: 0.056, formants: FORMANTS[key], voiced: 0.82, noise: 0.05 };
  }

  if (groups.fricatives.has(lang === "ar" ? char : lower)) {
    return { type: "fricative", duration: 0.05, formants: FORMANTS.fricative, voiced: 0.26, noise: 0.84 };
  }

  return { type: "plosive", duration: 0.046, formants: FORMANTS.plosive, voiced: 0.56, noise: 0.34 };
}

function tokenizeText(text, lang) {
  const raw = [...text].map((char) => ({ char, ...classifyChar(char, lang) }));
  let phraseStart = 0;

  for (let index = 0; index <= raw.length; index += 1) {
    const current = raw[index];
    if (!current || current.type === "punct") {
      const phrase = raw.slice(phraseStart, index).filter((token) => token.type !== "space");
      const lastIndex = Math.max(1, phrase.length - 1);

      phrase.forEach((token, tokenIndex) => {
        token.progress = phrase.length <= 1 ? 0 : tokenIndex / lastIndex;
      });

      phraseStart = index + 1;
    }
  }

  return raw.map((token) => ({
    ...token,
    progress: Number.isFinite(token.progress) ? token.progress : 0
  }));
}

function createRandom(seed) {
  let state = seed >>> 0;
  return function next() {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

function createResonators(formants, profile, style) {
  const weights = [1, 0.74, 0.48];
  return formants.map((freq, index) => {
    const bandwidth = [90, 125, 190][index] / profile.resonance;
    const clampedFreq = clamp(freq * (1 + style.brightness * 0.03 + profile.tilt * 0.02), 120, SAMPLE_RATE * 0.42);
    const radius = Math.exp((-Math.PI * bandwidth) / SAMPLE_RATE);
    return {
      c: 2 * radius * Math.cos((TWO_PI * clampedFreq) / SAMPLE_RATE),
      r2: radius * radius,
      gain: weights[index] * (0.95 + profile.brightness * 0.08 + style.brightness * 0.4),
      y1: 0,
      y2: 0
    };
  });
}

function stepResonator(state, input) {
  const output = input * (1 - state.r2) + state.c * state.y1 - state.r2 * state.y2;
  state.y2 = state.y1;
  state.y1 = output;
  return output * state.gain;
}

function contourMultiplier(token, punctuationAfter, profile, style, controls) {
  const manualPitch = clamp((Number(controls.pitch) || 0) * 0.05, -0.28, 0.28);
  const phraseLift = (0.5 - token.progress) * style.contour * 0.18;
  const phraseFall = (1 - token.progress) * style.contour * 0.08;
  const endingLift = punctuationAfter && punctuationAfter.question ? 0.06 + token.progress * 0.08 : 0;
  return 1 + manualPitch + style.pitchShift + phraseLift - phraseFall + endingLift + punctuationAfter.contour * 0.16;
}

function tokenDurationSeconds(token, nextToken, profile, style, controls) {
  const speed = clamp(Number(controls.speed) || 1, 0.55, 1.7);
  const pauses = clamp((Number(controls.pauses) || 40) / 100, 0, 1);
  const styleRate = style.rate * profile.rhythm;

  if (token.type === "space") {
    return clamp((0.02 + pauses * 0.045) * style.pauseScale, 0.012, 0.11);
  }

  if (token.type === "punct") {
    return clamp(token.duration * (0.8 + pauses * 0.75) * style.pauseScale, 0.05, 0.28);
  }

  let seconds = token.duration / (speed * styleRate);
  if (token.type === "vowel") seconds *= 1.16;
  if (token.type === "nasal") seconds *= 1.06;
  if (token.type === "fricative") seconds *= 0.94;
  if (nextToken && nextToken.type === "punct") seconds *= 1.06;

  return clamp(seconds, 0.02, 0.16);
}

function segmentEnvelope(local, profile, style, token) {
  const attack = clamp(style.attack + (token.type === "plosive" ? 0.006 : 0), 0.008, 0.06);
  const release = clamp(style.release + (token.type === "vowel" ? 0.025 : 0), 0.05, 0.24);

  if (local < attack) return local / attack;
  if (local > 1 - release) return Math.max(0, (1 - local) / release);
  return 1;
}

function harmonicExcitation(phase, profile, style, token) {
  const open = Math.max(0, Math.sin(phase));
  const body =
    Math.sin(phase) * 0.7 +
    Math.sin(phase * 2 + 0.2) * (0.24 + profile.brightness * 0.04) +
    Math.sin(phase * 3 + 0.45) * (0.12 + style.brightness * 0.04) +
    Math.sin(phase * 4 + 0.12) * (0.05 + profile.tilt * 0.02);
  const pulse = Math.pow(open, 0.62) * 1.35 - 0.45;
  return body * 0.62 + pulse * 0.38 + (token.type === "plosive" ? 0.05 : 0);
}

function renderSilence(samples, cursor, length, profile, style, random) {
  const breath = profile.breath * 0.18;
  for (let index = 0; index < length; index += 1) {
    const local = length <= 1 ? 0 : index / (length - 1);
    const taper = Math.sin(local * Math.PI);
    samples[cursor + index] += (random() * 2 - 1) * breath * taper * (0.14 + style.energy * 0.08);
  }
}

function renderVoicedToken(samples, cursor, length, token, nextToken, profile, style, controls, synthState, random) {
  const punctuationAfter = nextToken && nextToken.type === "punct" ? nextToken : { contour: 0, question: false };
  const energy = clamp((Number(controls.energy) || 50) / 100, 0.18, 1);
  const baseHz = profile.baseHz * contourMultiplier(token, punctuationAfter, profile, style, controls);
  const resonators = createResonators(token.formants, profile, style);
  const robotMix = profile.robotMix;

  for (let index = 0; index < length; index += 1) {
    const local = length <= 1 ? 0 : index / (length - 1);
    const envelope = segmentEnvelope(local, profile, style, token);
    const vibrato =
      profile.vibratoDepth === 0
        ? 1
        : 1 + Math.sin(synthState.vibratoPhase) * profile.vibratoDepth * (0.4 + token.progress * 0.3 + energy * 0.3);

    const frequency = baseHz * vibrato;
    synthState.phase += (TWO_PI * frequency) / SAMPLE_RATE;
    synthState.vibratoPhase += (TWO_PI * profile.vibratoRate) / SAMPLE_RATE;

    const voiceExcitation = harmonicExcitation(synthState.phase, profile, style, token) * token.voiced;
    const noise = (random() * 2 - 1) * (token.noise + profile.breath * 0.8);
    const aspirate = noise * (0.15 + style.energy * 0.04);
    let excitation = voiceExcitation + aspirate;

    if (robotMix > 0) {
      const carrier = Math.sin((TWO_PI * (82 + profile.baseHz * 0.12)) * synthState.time);
      excitation = excitation * (1 - robotMix) + (excitation * carrier) * robotMix;
    }

    const filtered =
      stepResonator(resonators[0], excitation) +
      stepResonator(resonators[1], excitation) +
      stepResonator(resonators[2], excitation);

    const sibilance = token.type === "fricative" ? noise * (0.2 + profile.brightness * 0.06) : 0;
    const lowBody = voiceExcitation * (0.08 + profile.warmth * 0.03);
    const sample =
      (filtered + sibilance + lowBody) *
      envelope *
      (0.52 + energy * 0.54 + style.energy * 0.14) *
      (0.94 + profile.warmth * 0.06);

    samples[cursor + index] += sample;
    synthState.time += 1 / SAMPLE_RATE;
  }
}

function postProcess(samples, profile, style, controls) {
  const output = new Float32Array(samples.length);
  const brightness = clamp(0.12 + profile.brightness * 0.08 + style.brightness * 0.12, 0.06, 0.34);
  const drive = 1.18 + ((Number(controls.energy) || 50) - 50) / 180;
  let previousInput = 0;
  let highPassed = 0;
  let lowPassed = 0;
  let smoothed = 0;
  let peak = 0;

  for (let index = 0; index < samples.length; index += 1) {
    const input = samples[index];
    highPassed = input - previousInput + 0.995 * highPassed;
    previousInput = input;
    lowPassed += (highPassed - lowPassed) * brightness;
    const voiced = lowPassed * (0.78 + profile.warmth * 0.1) + highPassed * (0.2 + profile.brightness * 0.08);
    const clipped = Math.tanh(voiced * drive);
    smoothed += (clipped - smoothed) * 0.34;
    output[index] = smoothed * 0.78 + clipped * 0.22;
    peak = Math.max(peak, Math.abs(output[index]));
  }

  const fade = Math.min(Math.floor(SAMPLE_RATE * 0.012), Math.floor(output.length / 2));
  const normalizer = peak > 0 ? 0.86 / peak : 1;

  for (let index = 0; index < output.length; index += 1) {
    let gain = normalizer;
    if (index < fade) gain *= index / Math.max(1, fade);
    if (index >= output.length - fade) gain *= (output.length - index) / Math.max(1, fade);
    output[index] = clamp(output[index] * gain, -1, 1);
  }

  return output;
}

function synthesizeSamples(text, voiceId, controls = {}) {
  const normalized = normalizeText(text, controls.lang);
  const profile = VOICE_PROFILES[voiceId] || VOICE_PROFILES.siraj;
  const style = STYLE_PROFILES[controls.styleId] || STYLE_PROFILES.podcast;
  const tokens = tokenizeText(normalized.text || ".", normalized.lang);
  const random = createRandom(tokens.length * 4099 + profile.baseHz);

  const durations = tokens.map((token, index) => {
    const seconds = tokenDurationSeconds(token, tokens[index + 1], profile, style, controls);
    return Math.max(48, Math.floor(seconds * SAMPLE_RATE));
  });

  let leadIn = Math.floor(SAMPLE_RATE * 0.05);
  let leadOut = Math.floor(SAMPLE_RATE * 0.08);
  const requestedDuration = Number(controls.targetDuration);
  if (Number.isFinite(requestedDuration) && requestedDuration > 0) {
    const currentDuration = durations.reduce((sum, value) => sum + value, leadIn + leadOut) / SAMPLE_RATE;
    const stretch = clamp(requestedDuration / currentDuration, 0.64, 1.82);
    for (let index = 0; index < durations.length; index += 1) {
      durations[index] = Math.max(48, Math.floor(durations[index] * stretch));
    }
    leadIn = Math.max(48, Math.floor(leadIn * Math.min(stretch, 1.25)));
    leadOut = Math.max(48, Math.floor(leadOut * Math.min(stretch, 1.25)));
  }

  const totalSamples = durations.reduce((sum, value) => sum + value, leadIn + leadOut);
  const samples = new Float32Array(totalSamples);
  const synthState = { phase: 0, vibratoPhase: 0, time: 0 };
  let cursor = leadIn;

  tokens.forEach((token, index) => {
    const length = durations[index];
    if (token.type === "space" || token.type === "punct") {
      renderSilence(samples, cursor, length, profile, style, random);
    } else {
      renderVoicedToken(samples, cursor, length, token, tokens[index + 1], profile, style, controls, synthState, random);
    }
    cursor += length;
  });

  return postProcess(samples, profile, style, controls);
}

function pcmToWavBuffer(samples, sampleRate = SAMPLE_RATE) {
  const byteRate = sampleRate * 2;
  const blockAlign = 2;
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let index = 0; index < samples.length; index += 1) {
    buffer.writeInt16LE(Math.round(clamp(samples[index], -1, 1) * 32767), 44 + index * 2);
  }

  return buffer;
}

function synthesize(options = {}) {
  const voiceId = VOICE_PROFILES[options.voiceId] ? options.voiceId : "siraj";
  const styleId = STYLE_PROFILES[options.styleId] ? options.styleId : "podcast";
  const normalized = normalizeText(options.text || "", options.lang);
  const samples = synthesizeSamples(normalized.text || ".", voiceId, {
    speed: options.speed,
    pitch: options.pitch,
    energy: options.energy,
    pauses: options.pauses,
    targetDuration: options.targetDuration,
    styleId,
    lang: normalized.lang
  });
  const durationSeconds = Number((samples.length / SAMPLE_RATE).toFixed(2));

  return {
    samples,
    buffer: pcmToWavBuffer(samples, SAMPLE_RATE),
    sampleRate: SAMPLE_RATE,
    durationSeconds,
    requestedDuration: Number.isFinite(Number(options.targetDuration)) ? Number(options.targetDuration) : null,
    engineVersion: ENGINE_VERSION,
    engineMode: "procedural",
    voiceId,
    styleId,
    lang: normalized.lang
  };
}

function synthesizeWavBuffer(options = {}) {
  return synthesize(options).buffer;
}

function readMlManifest() {
  try {
    if (!fs.existsSync(ML_MANIFEST_PATH)) return null;
    const parsed = JSON.parse(fs.readFileSync(ML_MANIFEST_PATH, "utf8"));
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.provider) return null;
    return parsed;
  } catch {
    return null;
  }
}

function getEngineState() {
  const manifest = readMlManifest();
  const mlVoices = Array.isArray(manifest?.voices) ? manifest.voices : [];
  return {
    version: ENGINE_VERSION,
    manifestPath: ML_MANIFEST_PATH,
    mode: manifest ? "hybrid" : "procedural",
    mlReady: Boolean(manifest),
    provider: manifest?.provider || null,
    voices: mlVoices,
    styles: Object.keys(STYLE_PROFILES)
  };
}

function buildMlPayload(options, manifest) {
  const mlVoices = Array.isArray(manifest.voices) ? manifest.voices : [];
  const matchedVoice =
    mlVoices.find((voice) => voice.id === options.voiceId) ||
    mlVoices.find((voice) => voice.remoteId === options.voiceId) ||
    null;

  return {
    text: String(options.text || ""),
    voiceId: matchedVoice?.remoteId || matchedVoice?.id || options.voiceId || "siraj",
    styleId: options.styleId || "podcast",
    lang: options.lang || "ar",
    speed: options.speed,
    pitch: options.pitch,
    energy: options.energy,
    pauses: options.pauses,
    targetDuration: options.targetDuration
  };
}

function parseMlResponse(buffer, headers = {}, fallbackMeta = {}) {
  const contentType = String(headers["content-type"] || "").toLowerCase();
  if (contentType.includes("application/json")) {
    const payload = JSON.parse(buffer.toString("utf8"));
    const audioBase64 = payload.audioBase64 || payload.audio || "";
    if (!audioBase64) {
      throw new Error("ML engine returned JSON without audioBase64.");
    }
    return {
      buffer: Buffer.from(audioBase64, "base64"),
      durationSeconds: Number(payload.durationSeconds || fallbackMeta.durationSeconds || 0),
      sampleRate: Number(payload.sampleRate || fallbackMeta.sampleRate || SAMPLE_RATE),
      voiceId: payload.voiceId || fallbackMeta.voiceId,
      styleId: payload.styleId || fallbackMeta.styleId,
      lang: payload.lang || fallbackMeta.lang
    };
  }

  return {
    buffer,
    durationSeconds: Number(headers["x-mulhem-duration"] || fallbackMeta.durationSeconds || 0),
    sampleRate: Number(headers["x-mulhem-sample-rate"] || fallbackMeta.sampleRate || SAMPLE_RATE),
    voiceId: String(headers["x-mulhem-voice"] || fallbackMeta.voiceId || "unknown"),
    styleId: String(headers["x-mulhem-style"] || fallbackMeta.styleId || "podcast"),
    lang: String(headers["x-mulhem-lang"] || fallbackMeta.lang || "ar")
  };
}

function httpRequestBuffer(urlString, payload, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const target = new URL(urlString);
    const body = Buffer.from(JSON.stringify(payload));
    const client = target.protocol === "https:" ? https : http;
    const request = client.request(
      {
        protocol: target.protocol,
        hostname: target.hostname,
        port: target.port || (target.protocol === "https:" ? 443 : 80),
        path: `${target.pathname}${target.search}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": body.length,
          ...extraHeaders
        }
      },
      (response) => {
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => {
          const buffer = Buffer.concat(chunks);
          if ((response.statusCode || 500) >= 400) {
            reject(new Error(`ML HTTP provider failed with ${response.statusCode || 500}.`));
            return;
          }
          resolve({ buffer, headers: response.headers });
        });
      }
    );

    request.on("error", reject);
    request.write(body);
    request.end();
  });
}

async function synthesizeViaHttp(options, manifest) {
  const payload = buildMlPayload(options, manifest);
  const fallbackMeta = {
    durationSeconds: Number(options.targetDuration || 0),
    sampleRate: Number(manifest.sampleRate || SAMPLE_RATE),
    voiceId: payload.voiceId,
    styleId: payload.styleId,
    lang: payload.lang
  };
  const response = await httpRequestBuffer(manifest.url, payload, manifest.headers || {});
  const parsed = parseMlResponse(response.buffer, response.headers, fallbackMeta);

  return {
    ...parsed,
    requestedDuration: Number.isFinite(Number(options.targetDuration)) ? Number(options.targetDuration) : null,
    engineVersion: ENGINE_VERSION,
    engineMode: "ml",
    provider: "http"
  };
}

function synthesizeViaCommand(options, manifest) {
  const payload = buildMlPayload(options, manifest);
  const args = Array.isArray(manifest.args) ? manifest.args : [];
  const result = spawnSync(manifest.command, args, {
    input: JSON.stringify(payload),
    encoding: "buffer",
    maxBuffer: 64 * 1024 * 1024,
    windowsHide: true
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error((result.stderr || Buffer.from("")).toString("utf8") || "ML command provider failed.");
  }

  const stdout = Buffer.isBuffer(result.stdout) ? result.stdout : Buffer.from(result.stdout || "");
  const parsed = parseMlResponse(
    stdout,
    { "content-type": manifest.output === "json" ? "application/json" : "audio/wav" },
    {
      durationSeconds: Number(options.targetDuration || 0),
      sampleRate: Number(manifest.sampleRate || SAMPLE_RATE),
      voiceId: payload.voiceId,
      styleId: payload.styleId,
      lang: payload.lang
    }
  );

  return {
    ...parsed,
    requestedDuration: Number.isFinite(Number(options.targetDuration)) ? Number(options.targetDuration) : null,
    engineVersion: ENGINE_VERSION,
    engineMode: "ml",
    provider: "command"
  };
}

async function synthesizeWithBestEngine(options = {}) {
  const preferredEngine = String(options.engine || "auto").toLowerCase();
  const strictEngine = Boolean(options.strictEngine);
  const manifest = readMlManifest();

  if (preferredEngine !== "procedural" && manifest) {
    try {
      if (manifest.provider === "http" && manifest.url) {
        return await synthesizeViaHttp(options, manifest);
      }
      if (manifest.provider === "command" && manifest.command) {
        return synthesizeViaCommand(options, manifest);
      }
      throw new Error("ML manifest is missing provider configuration.");
    } catch (error) {
      if (strictEngine || preferredEngine === "ml") {
        throw error;
      }
      const fallback = synthesize(options);
      return {
        ...fallback,
        fallbackFrom: "ml",
        fallbackReason: error.message
      };
    }
  }

  if (strictEngine || preferredEngine === "ml") {
    throw new Error(`ML engine is not configured. Add a manifest at ${ML_MANIFEST_PATH}.`);
  }

  return synthesize(options);
}

module.exports = {
  SAMPLE_RATE,
  ENGINE_VERSION,
  STYLE_PROFILES,
  VOICE_PROFILES,
  getEngineState,
  synthesizeSamples,
  synthesize,
  synthesizeWithBestEngine,
  synthesizeWavBuffer
};
