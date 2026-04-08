# Mulhem Sound

Mulhem Sound is a local Arabic audio platform prototype with:

- `Voxa™` for text to speech
- `WriteWave™` for speech to text
- `ClearTone™` for audio enhancement
- `ClipFlow™` for segmentation
- `ToneForge™` for style presets

## Quick Start

```powershell
npm start
```

Then open:

- `http://localhost:3210/`
- `http://localhost:3210/text-to-speech.html`

## Current Engine

The current engine is a local hybrid-ready TTS stack:

- procedural synthesis available now
- target-duration control available now
- style-aware rendering available now
- hybrid routing prepared for a future ML engine

## ML-Ready Path

The server now supports an automatic engine mode:

- if a real local ML TTS provider is configured later, the server can route to it
- if no ML provider is configured, it falls back to the local procedural engine

Planned ML manifest path:

```text
C:\man\models\arabic-tts.manifest.json
```

## Main Files

- `C:\man\mulhem-engine.js`
- `C:\man\server.js`
- `C:\man\voxa.js`
- `C:\man\text-to-speech.html`

## Real Arabic Model Path

Public API stays the same (/api/tts). Internally it now uses a command-based ML manifest that calls the Python adapter.

Key files:
- C:/man/models/arabic-tts.manifest.json
- C:/man/models/arabic-tts.runtime.json
- C:/man/providers/python-real-model-adapter.py

Behavior:
- If ML libs/weights are missing, it falls back to the local procedural engine automatically.
