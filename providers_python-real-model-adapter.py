import base64
import importlib
import inspect
import io
import json
import os
import pathlib
import sys
import wave

ADAPTER_VERSION = "mulhem-python-adapter-1.0.0"
ROOT_DIR = pathlib.Path(__file__).resolve().parent.parent
DEFAULT_RUNTIME_PATH = ROOT_DIR / "models" / "arabic-tts.runtime.json"


def fail(message, code=1):
    sys.stderr.write(f"{message}\n")
    raise SystemExit(code)


def load_runtime_config():
    runtime_path = pathlib.Path(os.environ.get("MULHEM_RUNTIME_CONFIG", str(DEFAULT_RUNTIME_PATH)))
    if not runtime_path.exists():
        fail(f"Runtime config not found: {runtime_path}")
    try:
        return json.loads(runtime_path.read_text(encoding="utf-8")), runtime_path
    except Exception as exc:
        fail(f"Failed to read runtime config: {exc}")


def load_payload():
    raw = sys.stdin.read().strip()
    if not raw:
        fail("No JSON payload received on stdin")
    try:
        return json.loads(raw)
    except Exception as exc:
        fail(f"Invalid input JSON: {exc}")


def ensure_list(samples):
    if samples is None:
        fail("Model returned no samples")

    if hasattr(samples, "tolist"):
        samples = samples.tolist()

    if isinstance(samples, (list, tuple)):
        out = []
        for item in samples:
            try:
                value = float(item)
            except Exception:
                value = 0.0
            if value > 1.0:
                value = 1.0
            if value < -1.0:
                value = -1.0
            out.append(value)
        return out

    fail("Model returned samples in an unsupported format")


def wav_bytes_from_samples(samples, sample_rate):
    samples = ensure_list(samples)
    with io.BytesIO() as buffer:
        with wave.open(buffer, "wb") as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)
            wav_file.setframerate(int(sample_rate))
            frames = bytearray()
            for sample in samples:
                pcm = int(max(-1.0, min(1.0, sample)) * 32767)
                frames.extend(int(pcm).to_bytes(2, byteorder="little", signed=True))
            wav_file.writeframes(bytes(frames))
        return buffer.getvalue(), round(len(samples) / float(sample_rate), 2)


def emit_result(result):
    sys.stdout.write(json.dumps(result, ensure_ascii=False))


def run_coqui_xtts(payload, config):
    try:
        from TTS.api import TTS
    except Exception as exc:
        fail(
            "Coqui TTS is not installed. Install the 'TTS' package and model dependencies first. "
            f"Original error: {exc}"
        )

    model_name = config.get("model_name")
    if not model_name:
        fail("pythonAdapter.model_name is required for coqui_xtts")

    gpu = bool(config.get("gpu", False))
    language = config.get("language") or payload.get("lang") or "ar"
    speaker_wav = config.get("speaker_wav") or None
    speaker = config.get("speaker") or None

    try:
        tts = TTS(model_name=model_name, progress_bar=False, gpu=gpu)
    except TypeError:
        tts = TTS(model_name)

    kwargs = {
        "text": payload.get("text", ""),
        "language": language
    }
    if speaker_wav:
        kwargs["speaker_wav"] = speaker_wav
    if speaker:
        kwargs["speaker"] = speaker

    try:
        samples = tts.tts(**kwargs)
    except Exception as exc:
        fail(f"Coqui XTTS synthesis failed: {exc}")

    sample_rate = int(
        getattr(getattr(tts, "synthesizer", None), "output_sample_rate", None)
        or config.get("sampleRate")
        or 24000
    )
    wav_bytes, duration = wav_bytes_from_samples(samples, sample_rate)
    return {
        "audioBase64": base64.b64encode(wav_bytes).decode("ascii"),
        "durationSeconds": duration,
        "sampleRate": sample_rate,
        "voiceId": payload.get("voiceId") or config.get("speaker") or "default",
        "styleId": payload.get("styleId") or "podcast",
        "lang": language,
        "providerVersion": ADAPTER_VERSION,
        "engineMode": "ml"
    }


def run_custom_module(payload, config):
    module_name = config.get("module")
    callable_name = config.get("callable", "synthesize")
    if not module_name:
        fail("pythonAdapter.module is required for custom_module")

    try:
        module = importlib.import_module(module_name)
    except Exception as exc:
        fail(f"Failed to import custom module '{module_name}': {exc}")

    fn = getattr(module, callable_name, None)
    if fn is None or not callable(fn):
        fail(f"Callable '{callable_name}' was not found in module '{module_name}'")

    try:
        signature = inspect.signature(fn)
        if len(signature.parameters) >= 2:
            result = fn(payload, config)
        else:
            result = fn(payload)
    except Exception as exc:
        fail(f"Custom module synthesis failed: {exc}")

    if isinstance(result, dict) and result.get("audioBase64"):
        result.setdefault("voiceId", payload.get("voiceId") or "default")
        result.setdefault("styleId", payload.get("styleId") or "podcast")
        result.setdefault("lang", payload.get("lang") or "ar")
        result.setdefault("providerVersion", ADAPTER_VERSION)
        result.setdefault("engineMode", "ml")
        return result

    if isinstance(result, dict) and ("samples" in result or "audio" in result):
        samples = result.get("samples", result.get("audio"))
        sample_rate = int(result.get("sampleRate") or config.get("sampleRate") or 24000)
        wav_bytes, duration = wav_bytes_from_samples(samples, sample_rate)
        return {
            "audioBase64": base64.b64encode(wav_bytes).decode("ascii"),
            "durationSeconds": duration,
            "sampleRate": sample_rate,
            "voiceId": result.get("voiceId") or payload.get("voiceId") or "default",
            "styleId": result.get("styleId") or payload.get("styleId") or "podcast",
            "lang": result.get("lang") or payload.get("lang") or "ar",
            "providerVersion": ADAPTER_VERSION,
            "engineMode": "ml"
        }

    fail("Custom module must return either {audioBase64: ...} or {samples: [...], sampleRate: ...}")


def main():
    payload = load_payload()
    runtime, runtime_path = load_runtime_config()
    config = runtime.get("pythonAdapter") or {}
    backend = config.get("backend") or runtime.get("backend")

    if backend == "coqui_xtts":
        result = run_coqui_xtts(payload, config)
    elif backend == "custom_module":
        result = run_custom_module(payload, config)
    else:
        fail(
            "pythonAdapter backend is not supported. Use 'coqui_xtts' or 'custom_module'. "
            f"Current backend: {backend!r}. Runtime file: {runtime_path}"
        )

    result.setdefault("runtimeConfigPath", str(runtime_path))
    emit_result(result)


if __name__ == "__main__":
    main()
