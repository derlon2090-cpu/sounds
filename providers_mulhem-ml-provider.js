"use strict";

const fs = require("fs");
const path = require("path");
const http = require("http");
const { spawn } = require("child_process");
const { synthesize, SAMPLE_RATE } = require("../mulhem-engine");

const PORT = Number(process.env.MULHEM_PROVIDER_PORT || 3211);
const PROVIDER_VERSION = "mulhem-path-2.0.0";
const PROJECT_ROOT = path.join(__dirname, "..");
const RUNTIME_CONFIG_PATH = path.join(PROJECT_ROOT, "models", "arabic-tts.runtime.json");

function send(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
  });
  res.end(body);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2 * 1024 * 1024) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function splitSentences(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?,;:\u060c\u061b\u061f])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function countWords(text) {
  return Math.max(1, String(text || "").trim().split(/\s+/).filter(Boolean).length);
}

function buildChunks(text) {
  const sentences = splitSentences(text);
  if (!sentences.length) {
    return [{ text: ".", words: 1 }];
  }

  const chunks = [];
  let current = [];
  let words = 0;

  for (const sentence of sentences) {
    const sentenceWords = countWords(sentence);
    if (current.length && words + sentenceWords > 18) {
      chunks.push({ text: current.join(" ").trim(), words });
      current = [sentence];
      words = sentenceWords;
    } else {
      current.push(sentence);
      words += sentenceWords;
    }
  }

  if (current.length) {
    chunks.push({ text: current.join(" ").trim(), words });
  }

  return chunks;
}

function crossfadeAppend(target, source, fadeSamples) {
  if (!target.length) return source.slice();
  if (!source.length) return target.slice();

  const fade = Math.min(fadeSamples, target.length, source.length);
  const out = new Float32Array(target.length + source.length - fade);
  out.set(target, 0);

  const start = target.length - fade;
  for (let index = 0; index < fade; index += 1) {
    const mix = index / Math.max(1, fade - 1);
    out[start + index] = target[start + index] * (1 - mix) + source[index] * mix;
  }

  out.set(source.subarray(fade), target.length);
  return out;
}

function pcmToWavBuffer(samples, sampleRate = SAMPLE_RATE) {
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
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let index = 0; index < samples.length; index += 1) {
    const clamped = Math.max(-1, Math.min(1, samples[index]));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + index * 2);
  }

  return buffer;
}

function normalizeSamples(samples) {
  let peak = 0;
  for (let index = 0; index < samples.length; index += 1) {
    peak = Math.max(peak, Math.abs(samples[index]));
  }
  const gain = peak > 0 ? 0.88 / peak : 1;
  for (let index = 0; index < samples.length; index += 1) {
    samples[index] *= gain;
  }
  return samples;
}

function synthesizePath(payload) {
  const chunks = buildChunks(payload.text || ".");
  const totalWords = chunks.reduce((sum, chunk) => sum + chunk.words, 0);
  const requestedDuration = Number(payload.targetDuration);
  const crossfadeSamples = Math.floor(SAMPLE_RATE * 0.025);
  let merged = new Float32Array(0);

  for (const chunk of chunks) {
    const chunkTarget = Number.isFinite(requestedDuration) && requestedDuration > 0
      ? Number((requestedDuration * (chunk.words / totalWords)).toFixed(2))
      : undefined;

    const rendered = synthesize({
      text: chunk.text,
      voiceId: payload.voiceId,
      styleId: payload.styleId,
      lang: payload.lang,
      speed: payload.speed,
      pitch: payload.pitch,
      energy: payload.energy,
      pauses: payload.pauses,
      targetDuration: chunkTarget
    });

    merged = crossfadeAppend(merged, rendered.samples, crossfadeSamples);
  }

  const normalized = normalizeSamples(merged);
  const buffer = pcmToWavBuffer(normalized, SAMPLE_RATE);
  const durationSeconds = Number((normalized.length / SAMPLE_RATE).toFixed(2));

  return {
    audioBase64: buffer.toString("base64"),
    durationSeconds,
    sampleRate: SAMPLE_RATE,
    voiceId: payload.voiceId || "siraj",
    styleId: payload.styleId || "podcast",
    lang: payload.lang || "ar",
    providerVersion: PROVIDER_VERSION,
    engineMode: "ml"
  };
}

function readRuntimeConfig() {
  if (!fs.existsSync(RUNTIME_CONFIG_PATH)) {
    return {
      backend: "internal_path",
      pythonAdapter: {
        pythonCommand: "py",
        pythonArgs: ["-3"],
        entry: "providers/python-real-model-adapter.py",
        cwd: "."
      }
    };
  }

  const parsed = JSON.parse(fs.readFileSync(RUNTIME_CONFIG_PATH, "utf8"));
  return {
    backend: parsed.backend || "internal_path",
    pythonAdapter: {
      pythonCommand: parsed?.pythonAdapter?.pythonCommand || "py",
      pythonArgs: Array.isArray(parsed?.pythonAdapter?.pythonArgs) ? parsed.pythonAdapter.pythonArgs : ["-3"],
      entry: parsed?.pythonAdapter?.entry || "providers/python-real-model-adapter.py",
      cwd: parsed?.pythonAdapter?.cwd || "."
    }
  };
}

function resolveProjectPath(targetPath) {
  if (!targetPath) return PROJECT_ROOT;
  return path.isAbsolute(targetPath) ? targetPath : path.join(PROJECT_ROOT, targetPath);
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
    });
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/health") {
    send(res, 200, {
      ok: true,
      provider: "mulhem-path",
      version: PROVIDER_VERSION,
      sampleRate: SAMPLE_RATE
    });
    return;
  }

  if (req.method === "POST" && req.url === "/synthesize") {
    try {
      const payload = await readJson(req);
      const text = String(payload.text || "").trim();
      if (!text) {
        send(res, 400, { error: "Text is required." });
        return;
      }
      send(res, 200, synthesizePath(payload));
    } catch (error) {
      send(res, 500, { error: error.message || "Provider failure" });
    }
    return;
  }

  send(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`Mulhem ML path provider running on http://127.0.0.1:${PORT}`);
});
