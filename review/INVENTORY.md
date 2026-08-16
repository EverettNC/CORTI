# Review inventory

Read beginning to end, 2026-08-16. This folder is the working review.
Canon docs sit at the root so Corti has a place to sit:

- [`/README.md`](../README.md) — Corti, the emit, the architecture
- [`/REMEDIATION.md`](../REMEDIATION.md) — what was fixed, what is still live
- [`/IDENTITY.md`](../IDENTITY.md) — who the ear is

Attachments reviewed from `/workspace/attachments/`.
Live ear reviewed from `/workspace/src/`.

Nothing in `attachments/` is imported by `src/`. The Python family
does not run inside the preview. Corti does.

---

## Live ear (`src/`)

| File | Role |
|---|---|
| `lib/audio/vocalization.ts` | Utterance emit. `TapeFrame[]` + card. Cap 360. Ring of 8. |
| `lib/audio/speaker.ts` | `SpeakerSeat`. Cold until 3 voiced locks. Human-triggered. |
| `lib/audio/dsp.ts` | christman_dsp.c port: RMS, ZCR, LPC, VAD, jitter/shimmer/HNR |
| `lib/audio/yin.ts` | YIN. Silence → null. Kept above p = 0.62. |
| `lib/audio/engine.ts` | Web Audio. Mic + oscillator + analyser. |
| `lib/audio/proxies.ts` | Per-frame spectral + DSP proxies. Die with the live frame. |
| `lib/audio/corpus.ts` | Labelled oscillator trials. Not a speaker model. Cap 400. |
| `lib/audio/notes.ts` | Note names, Greenwood place map. |
| `lib/audio/mic.ts` | Honest mic errors. `FRAMED` is this preview. |
| `lib/audio/corti.test.ts` | Physics + honesty tests. |
| `components/corti/hearing-context.tsx` | RAF loop. Owns seat, corpus, tracker. |
| `components/corti/app-shell.tsx` | Listen / Tone / Train. No sign-in. |
| `components/corti/readout.tsx` | Absolute lock, or a dash. |
| `components/corti/tone-panel.tsx` | Proxies, ring, seat. |
| `components/corti/train-panel.tsx` | Trains the human. Logs the ear. |
| `components/corti/cochlea-canvas.tsx` | Greenwood spiral. |
| `components/corti/spectrogram.tsx` | Place-map spectrogram. |
| `components/corti/keyboard.tsx` | Self-hearing oscillator. |
| `routes/index.tsx` | `/` is Corti, ungated. |
| `routes/login.tsx` | Redirects home. |
| `scripts/corti-honesty.test.mjs` | Banned-number scanner + Playwright. |

---

## Family SDK (`attachments/`)

### Recognition

| File | Remediated | Hears Corti? |
|---|---|---|
| `sound_recognition_service.py` | yes | no — protocol, no backend, no tape |
| `speech_recognition_engine.py` | yes | no — Vosk, file or mic |
| `enhanced_speech_recognition.py` | yes | no — coordinator, polls with no audio |
| `real_speech_recognition.py` | yes | no — second mic / VAD |
| `recognition_result.py` | yes (the contract) | n/a |
| `audio_encoder.py` | yes | no |
| `audio_processor.py` | yes | no — wav path |

### Ear-shaped consumers (written for Corti, unwired)

| File | Remediated | Hears Corti? |
|---|---|---|
| `tape_contour.py` | new organ | designed to; zero callers |
| `prosody.py` | new organ | designed to; no constructor from the emit |
| `fusion_engine.py` | yes | accepts `ProsodyReading`; nobody builds one |
| `structural_affect.py` | yes | text only |

### Tone (file-wav or text)

| File | Remediated | Produces `tone_score`? |
|---|---|---|
| `tonescore_engine.py` | yes | yes — heuristic, wav path, None if incomplete |
| `tone_analyzer.py` | yes | yes — same formula, DSP path |
| `tonescore_analyzer.py` | yes | yes — same formula, Praat path, hyphen modes |
| `christman_tone_engine_v2.py` | yes | no — emits `action_state` |
| `emotion_embedder.py` | yes | reads only |
| `emotion_labels.py` | yes | no |
| `emotion_quantifier.py` | yes | no — text |
| `analyze_emotion.py` | yes | no — memory file |
| `tone_manager.py` | yes | no — delivery |
| `tone_classifier.py` | shim | no — feature density named `"score"` |
| `written_tone.py` | yes | no |
| `speech_personality.py` | yes | no |
| `truth_and_soul_engine.py` | **no** | **fabricated 85 / 88 / 22** |

### Presence / nonverbal / mouth

| File | Remediated | Notes |
|---|---|---|
| `voice_diagnostics.py` | yes | local synthesis QA |
| `grounder.py` | yes | scripts; imports `BREATHING_RISE` |
| `presence_guide.py` | yes | third text reader |
| `logger.py` | yes | infrastructure |
| `engine_temporal.py` | yes | LSTM; env flag name-collides with Corti |
| `nonverbal_engine.py` | yes | lookup tables; pattern **names**, not audio |
| `cochlear_sync_tts.py` | **no** | `AH N UW T` / `AUDIO_DATA_PLACEHOLDER` |
| `resonance_listener.py` | **no** | untrained Linear → valence |
| `HEARING_snippet_v2.md` | **no** | 94 / 91 / 87 table |

---

## Answers that were sitting in the files

**What does the ear emit per utterance — summary or series?**
Both. A card (summary) and a `tape: TapeFrame[]` (series). Live-frame
quality (jitter/shimmer/HNR/VAD) is neither. It dies with the frame.

**Tape shape?**
List of `{ t, rms, zcr, f0 }` objects. Not parallel arrays. Field on
the event is `tape`. Cap 360. Unvoiced frames stay; `f0` is `null`.

**Per-speaker baseline, or cold?**
Cold until the human seats the voice (3 voiced locks). First
utterance is always COLD. Python `SpeakerBaseline` (30 samples) is
a different, empty record.

**Does the ear become `sound_recognition_service`?**
No. Separate. Service is a coordinator with no backend and no tape.

**How does Corti learn?**
It doesn't train a model from listening. Seat is explicit. Corpus is
labelled oscillator trials. Train panel trains the human.

**Where is `tone_score` coming from?**
Not from Corti. Not from Fusion. Three file-wav engines can compute
a heuristic composite. One unremediated file returns 85. Fusion may
*read* a leftover key. Nothing on the live path writes it.
