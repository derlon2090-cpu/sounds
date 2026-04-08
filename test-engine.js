"use strict";

const fs = require("fs");
const path = require("path");
const { synthesizeWavBuffer } = require("../mulhem-engine");

const outDir = path.join(__dirname, "..", "generated");
const outFile = path.join(outDir, "mulhem-engine-sample.wav");

fs.mkdirSync(outDir, { recursive: true });

const buffer = synthesizeWavBuffer({
  text: "Mulhem Sound local engine sample for Voxa.",
  voiceId: "siraj",
  speed: 1,
  pitch: 0,
  energy: 58,
  pauses: 34
});

fs.writeFileSync(outFile, buffer);
console.log(outFile);
console.log(buffer.length);
