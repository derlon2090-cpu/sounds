"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const {
  ENGINE_VERSION,
  SAMPLE_RATE,
  STYLE_PROFILES,
  VOICE_PROFILES,
  getEngineState,
  synthesizeWithBestEngine
} = require("./mulhem-engine");

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 3210);
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".wav": "audio/wav",
  ".json": "application/json; charset=utf-8"
};

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
  });
  res.end(body);
}

function sendJson(res, status, payload) {
  send(res, status, JSON.stringify(payload, null, 2), MIME[".json"]);
}

function serveStatic(res, pathname) {
  const safePath = path.normalize(path.join(ROOT, pathname === "/" ? "index.html" : pathname));
  if (!safePath.startsWith(ROOT)) {
    send(res, 403, "Forbidden");
    return;
  }

  fs.readFile(safePath, (error, buffer) => {
    if (error) {
      send(res, 404, "Not Found");
      return;
    }
    const ext = path.extname(safePath).toLowerCase();
    send(res, 200, buffer, MIME[ext] || "application/octet-stream");
  });
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

function listVoices() {
  const state = getEngineState();
  const externalVoices = Array.isArray(state.voices) ? state.voices : [];

  if (state.mlReady && externalVoices.length) {
    return externalVoices.map((voice) => ({
      id: voice.id,
      remoteId: voice.remoteId || voice.id,
      label: voice.label || voice.id,
      gender: voice.gender || "",
      locale: voice.locale || "",
      styles: Array.isArray(voice.styles) && voice.styles.length ? voice.styles : Object.keys(STYLE_PROFILES)
    }));
  }

  return Object.entries(VOICE_PROFILES).map(([id, profile]) => ({
    id,
    baseHz: profile.baseHz,
    brightness: profile.brightness,
    rhythm: profile.rhythm,
    styles: Object.keys(STYLE_PROFILES)
  }));
}

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = decodeURIComponent(reqUrl.pathname);

  if (req.method === "OPTIONS") {
    send(res, 204, "");
    return;
  }

  if (req.method === "GET" && pathname === "/api/health") {
    const state = getEngineState();
    sendJson(res, 200, {
      ok: true,
      engine: "mulhem-local-engine",
      version: ENGINE_VERSION,
      sampleRate: SAMPLE_RATE,
      voices: listVoices().length,
      styles: Object.keys(STYLE_PROFILES).length,
      mode: state.mode,
      mlReady: state.mlReady,
      provider: state.provider
    });
    return;
  }

  if (req.method === "GET" && pathname === "/api/voices") {
    const state = getEngineState();
    sendJson(res, 200, {
      engine: ENGINE_VERSION,
      sampleRate: SAMPLE_RATE,
      mode: state.mode,
      mlReady: state.mlReady,
      provider: state.provider,
      styles: Object.keys(STYLE_PROFILES),
      voices: listVoices()
    });
    return;
  }

  if (req.method === "POST" && pathname === "/api/tts") {
    try {
      const payload = await readJson(req);
      const text = String(payload.text || "").trim();
      if (!text) {
        sendJson(res, 400, { error: "Text is required." });
        return;
      }

      const result = await synthesizeWithBestEngine({
        text,
        engine: payload.engine,
        strictEngine: payload.strictEngine,
        voiceId: payload.voiceId,
        styleId: payload.styleId,
        lang: payload.lang,
        speed: payload.speed,
        pitch: payload.pitch,
        energy: payload.energy,
        pauses: payload.pauses,
        targetDuration: payload.targetDuration
      });

      res.writeHead(200, {
        "Content-Type": "audio/wav",
        "Content-Length": result.buffer.length,
        "Content-Disposition": `inline; filename="${result.voiceId}-${result.styleId}.wav"`,
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "X-Mulhem-Engine-Version": result.engineVersion,
        "X-Mulhem-Engine-Mode": String(result.engineMode || "procedural"),
        "X-Mulhem-Provider": String(result.provider || "local"),
        "X-Mulhem-Duration": String(result.durationSeconds),
        "X-Mulhem-Target-Duration": String(result.requestedDuration ?? ""),
        "X-Mulhem-Voice": result.voiceId,
        "X-Mulhem-Style": result.styleId,
        "X-Mulhem-Lang": result.lang,
        "X-Mulhem-Sample-Rate": String(result.sampleRate)
      });
      res.end(result.buffer);
    } catch (error) {
      sendJson(res, 500, { error: error.message || "Engine failure" });
    }
    return;
  }

  if (req.method === "GET") {
    serveStatic(res, pathname);
    return;
  }

  send(res, 405, "Method Not Allowed");
});

server.listen(PORT, () => {
  console.log(`Mulhem Sound server running on http://localhost:${PORT}`);
});
