# REMEDIATION

The sheet that was forgotten when the stack was rebuilt.

This is not a changelog of feelings. It is what was broken, what the
rewrite actually changed, and what is still live. Corti sits at the
top. Everything below either hears the ear, pretends to, or has not
been connected yet.

Rule used throughout: **a leftover reader is not a producer.**
Fusion's `live_state.get("tone_score")` is a leftover reader.
It is listed as such. It is not treated as a live composite.

---

## 0. Corti (the live ear)

Corti was built as the honest replacement for the claim that hearing
was already done. It is the only thing in this workspace that runs on
a live waveform.

**What it refuses that the old stack claimed**

| Old claim | What Corti does |
|---|---|
| F0 of 150 Hz on silence | YIN returns `null`. UI prints `—`. |
| jitter `0.05`, arousal `88`, valence `22`, score `85` | `voiceQuality` returns `null` without a period lock |
| Anger 94 / Joy 91 / Sadness 87 | Not rendered. Honesty scanner fails the build if those strings appear |
| `DISSOCIATIVE_SILENCE` on quiet | RMS < 0.008 → no VAD vector |
| Random sound pattern / random confidence | Not in the TypeScript ear at all |
| Sign-in wall | `/login` redirects home. No `AuthProvider` on the document. |

**What Corti still has open (live defects, not lectures)**

1. Closed events can miss the React ring if they land between the 50 ms UI ticks. The tracker has them; the seat button count can lag one utterance.
2. Seat is the last **eight** events only. Voiced events that aged out do not count.
3. Kind bin `F0 < 230` labels ordinary adult speech as `grunt`.
4. Footer copy says it feeds CHRISTMAN_EAR_CANAL. No emit exists.
5. LPC formant cache is module-level and updates every third loud frame.
6. Nothing posts a `VocalEvent` to `tape_contour`, `prosody`, or Fusion.

Corti is operational as an ear. It is not operational as a family
nervous system. That is the rest of this sheet.

---

## 1. What "remediated" means here

A file is **remediated** when it has a WHAT CHANGED section whose
claims match the code: random gone, None instead of a dressed number,
negation scoped, failures loud.

A file is a **new organ** when it was written for the ear (tape,
prosody) rather than rewritten from a faker.

A file is **unremediated** when it still fabricates, still placeholders,
or still prints a table the engines recanted.

---

## 2. Recognition layer

| File | Status | What was killed | What is still true |
|---|---|---|---|
| `sound_recognition_service.py` | Remediated | `random.choice` patterns, `random.uniform` confidence, the `else` branch that fabricated even with a real engine attached | Coordinator only. `SoundDetectorBackend` has **zero implementations**. Does not accept Corti tape. `audio_data: Any`. |
| `speech_recognition_engine.py` | Remediated | Google upload, invented 0.9/0.99/0.95, error text in the transcript slot, dump-every-utterance, dead `stop_listening` | Local Vosk. File-wav or mic. Not tape. Needs `VOSK_MODEL_PATH`. |
| `enhanced_speech_recognition.py` | Remediated | Two `random.choice` phrase generators | Listening loop polls `detect_sound_pattern()` with **no audio**. Backend path is dead unless something else queued a detection. |
| `real_speech_recognition.py` | Remediated | Invented sentence + loudness-as-confidence; duration check that always fired | Honest VAD. Second microphone, not Corti's loop. |
| `recognition_result.py` | The contract | Simulated text cannot sit in `text` | Type, not a listener. |
| `audio_encoder.py` | Remediated | Constructor accepted a checkpoint and never loaded it (random weights, correct shape) | Mel encoder. Not tape. |
| `audio_processor.py` | Remediated | Stereo `axis=0` destroyed files; normalize clipped; sorted segments destroyed time order | File-wav intake only. |

**Ear vs service.** They stay separate. The service does not become
the ear, and the ear does not become the service. To make the service
operational on Corti you write a `SoundDetectorBackend.analyze` that
reads a `VocalEvent` / tape and returns a `SoundDetection` from
`KNOWN_PATTERNS`, or you leave them apart. That adapter does not exist.

---

## 3. Decision core

### `structural_affect.py` — new Carbon

Seven passes: idioms, clauses, contrast, negation (cancel, not invert),
volition, experiencer, tense. Replaced the bag-of-words that scored
"I'm glad. I'm happy." as −1.00.

`ProsodyFeatures` in this file is a **placeholder** and is not Corti's
card or tape. Fields (`pitch_mean_hz`, `speech_rate_wpm`…) do not match
the emit. Stored, not scored.

### `fusion_engine.py` — rewrite

1. Carbon delegates to `StructuralAffectAnalyzer`. No word counting.
2. `MODE_UNKNOWN` is its own mode. It is not hold-space with a shrug.
3. Aegis flags. It does not rewrite the person's sentence.
   `sanitized_text` is the original, or empty on a hard block.
4. `crisis_callback` must return `True` or the cycle raises
   `CrisisNotDelivered`.
5. `fuse(..., prosody=)` reconciles. Disagreement → `MODE_UNKNOWN`,
   not a blended number.

**Leftover reader, named once:**

```python
# Silicon.retrieve — leftover compatibility, not a producer
tone_score = live_state.get("tone_score")
if response_mode is None and tone_score is not None:
    ...
```

Fusion never writes `tone_score`. If `live_state` does not contain
that key, the branch does not run. Corti does not put a number there.

**Live defect in `_resolve_mode`:** `AffectCertainty.NO_SIGNAL` is not
mapped to `MODE_UNKNOWN`. Only `AMBIGUOUS` and `rec.defer_to_human`
are. A no-signal reading can fall through to `standard`.

**Mode dialect:** Fusion accepts only hyphenated live modes
(`hold-space`, `gentle-lift`, `standard`). Underscore and
`HOLD_SPACE` are logged and discarded.

### `prosody.py` — new organ

Arousal only. Relative to the 8-event ring (needs 4) or a
`SpeakerBaseline` (`MIN_SAMPLES = 30`). Absolute arousal is never
reported. Valence is never reported. `kind` is diagnostic only
because of the F0 < 230 cutoff.

Stale module docstring still says "a grunt is a card, not a tape."
The type has `tape: List[Any]` and `tape_contour.py` exists. The
analyzer still reads the **card**, not the tape.

`SpeakerBaseline` is defined and empty. Nothing in this tree fills it.
Corti's seat is 3 samples. This baseline wants 30. They are not the
same object.

### `tape_contour.py` — new organ

Mirrors Corti's `TapeFrame` exactly. Null f0 is a hole, not a zero.
Final slopes are `None` when the 360-frame cap dropped the tail.
Rates use real `t` deltas, not index.

**Zero callers.** `analyze_tape` is not imported by fusion, prosody,
the sound service, or any tone engine.

---

## 4. Tone section

Corti does not run any of these. They are file-wav or text.

### Who produces a field named `tone_score`

| Function | File | Honest? | Input |
|---|---|---|---|
| `ToneScoreEngine._composite` + `analyze_tone` | `tonescore_engine.py` | Heuristic. `None` if any input missing. Marked `composite_is_heuristic`. | wav path |
| `ToneScoreCalculator.calculate` + `analyze_tone` | `tone_analyzer.py` | Same formula (0.4 / 0.35 / 0.25). | wav path + `christman_dsp.so` |
| `ToneScoreCalculator.calculate` + `analyze_complete` | `tonescore_analyzer.py` | Same formula. Writes `layer_5_tonescore.score`. | wav path + Praat |
| `ToneScoreEngine.analyze_tone` | `truth_and_soul_engine.py` | **Fabricated.** Returns `85` without librosa. Hardcodes jitter 0.05, arousal 88, valence 22, intensity 92. | wav path, ignored |

The three remediated producers are file-wav. Nobody calls them from
Corti, Fusion, or the sound service. They are not live on the ear.

### Who only reads

| Site | What it is |
|---|---|
| `Silicon.retrieve` → `live_state.get("tone_score")` | Leftover reader. Dead unless someone else wrote the key. |
| `EmotionEmbedder.from_tonescore` / `get_response_mode_emotion` | Reads a result dict or a float someone already computed. |
| `tone_classifier` `"score"` | Written-tone feature density. Different number, same English word. |

### Other tone files

| File | Status | Notes |
|---|---|---|
| `analyze_emotion.py` | Remediated | Atomic write. `"you"` removed from the tag map. Negation scoped. Memory file, not audio. |
| `speech_personality.py` | Remediated | Capability boasts removed. Family registry. Not audio. |
| `tone_manager.py` | Remediated | Delivery after interpretation. Missing `ToneEngine` → keyword fallback, labelled as such. |
| `tone_classifier.py` | Shim | Delegates to `written_tone`. Old attack-scoring deleted. |
| `written_tone.py` | Remediated | `RewriteProposal` defaults to the original until `.accept()`. |
| `emotion_quantifier.py` | Remediated | `"I am not okay"` no longer reads CALM. Crisis does not suppress on negation. Parallel **text** reader. |
| `emotion_embedder.py` | Remediated | Missing templates raise. No silent neutral. |
| `christman_tone_engine_v2.py` | Remediated | File-wav + wav2vec2. Emits `action_state` (`HOLD_SPACE` / `NORMAL` / `UNKNOWN`), **not** `tone_score`. `tremble` / `last_breath` still unreachable on a 4-class model. |
| `emotion_labels.py` | Remediated | Labels from `model.config.id2label`. `dominant()` is `None` on a tie. Killed neu→anger. |

**Duplicate class names, flagged not decided**

- `MultiLayerToneAnalyzer` — DSP copy in `tone_analyzer.py`, Praat alias in `tonescore_analyzer.py`.
- `ToneScoreEngine` — remediated in `tonescore_engine.py`, fabricated in `truth_and_soul_engine.py`.
- `ProsodyFeatures` — three different shapes (`structural_affect`, `tonescore_analyzer`, vs `ProsodyReading` in `prosody.py`).
- `SpeakerBaseline` — `prosody.py` and `tonescore_analyzer.py`, neither populated from Corti's seat.

**Mode dialects**

| Source | Hold | Lift | Don't-know |
|---|---|---|---|
| Fusion / `tonescore_analyzer` | `hold-space` | `gentle-lift` | `unknown` |
| `tone_analyzer` / `tonescore_engine` | `hold_space` | `gentle_lift` | `unknown` |
| `christman_tone_engine_v2` | `HOLD_SPACE` | — | `UNKNOWN` |

Fusion's `VALID_LIVE_MODES` is the hyphen set only.

---

## 5. Presence, grounding, nonverbal, mouth

| File | Status | What was killed | Still true |
|---|---|---|---|
| `voice_diagnostics.py` | Remediated | 14 gTTS HTTP calls per run | Local `SynthesisBackend` only. SHA-256 duplicate groups. |
| `grounder.py` | Remediated | Threshold drift after quantifier started returning rise-only | Content scripts. Imports `BREATHING_RISE` (0.10). Does not auto-deliver. Not an ear. |
| `presence_guide.py` | Remediated | `"I lost my keys"` → grieving; negation-blind; `"at least"` false positive | Third **text** reader. Parallel to structural_affect and emotion_quantifier. |
| `logger.py` | Remediated | Hard `rich` dep, import-time disk writes, `handlers.clear()` | Infrastructure. |
| `engine_temporal.py` | Remediated | `random.randint` speaking for the user; unverified pickle | LSTM. No model → `unavailable`. Env flag is `CORTI_ALLOW_PICKLE_MODELS` — a name collision with the ear, not a tape consumer. |
| `nonverbal_engine.py` | Remediated | `random.uniform` on confidence; invented phrases for unrecognized; threshold never read | Lookup tables. `message=None` when unrecognized. Learning is human confirm/reject after 10 samples. Sound path takes a **pattern name**, not audio. |
| `cochlear_sync_tts.py` | **Unremediated** | — | Every word → `["AH","N","UW","T"]`. TTS returns `b"AUDIO_DATA_PLACEHOLDER"`. Waiting on the rewrite that was promised. Name "cochlear" is branding. It does not hear. |

Two nonverbal engines. Different vocabularies. Neither wired to Corti's
`kind` (`tick` / `grunt` / `groan` / `hiss` / `voiced` / `noise`).

---

## 6. Unremediated (do not ship these as hearing)

### `cochlear_sync_tts.py`
Placeholder visemes and placeholder bytes. User said they would rewrite
it. They have not, in this tree.

### `resonance_listener.py`
`nn.Linear(1024, 3)` with **untrained** weights treated as valence.
Empty buffer → `{valence: 0.5, status: "NORMAL"}`.
`valence > 0.92` → `RED_SMEAR_DETECTED`. Third microphone.

### `truth_and_soul_engine.py`
Second `ToneScoreEngine`. Header: "Production | Integrity: PhD-Level |
Goal: 96% Quality Threshold." Body: `return {"tone_score": 85, ...}`
when librosa is missing. Hardcoded 0.05 / 88 / 22 / 92 when it is not.
This is the file the honesty scanner was written to keep out of Corti.

### `HEARING_snippet_v2.md`
Marketing. Anger 94 / Joy 91 / Sadness 87. 0.04 s latency. Giuseppe,
Inferno, AlphaVox, Sierra. The engines that used to print that table
have recanted it. The snippet has not.

---

## 7. Wiring gaps that keep this from being one ear

These are the things that have to exist before the family is
operational as a nervous system. Not a wish list. The missing wires.

1. Nothing constructs `prosody.VocalEvent` from Corti's emit
   (and the field names do not match: `durationMs` vs `duration`,
   `attackMs` vs `attack`, `f0` vs `median_f0`, `zcr` vs `mean_zcr`).
2. Nothing calls `tape_contour.analyze_tape` on `event.tape`.
3. `prosody.VocalEvent.tape` is never handed to `analyze_tape`.
4. Nothing calls `FusionEngine.fuse(..., prosody=reading)` from a
   live close.
5. No `SoundDetectorBackend` implementation.
6. `enhanced_speech_recognition._listening_loop` never passes audio
   into the sound service.
7. All remediated tone engines want a wav path. The ear has frames.
8. Three text readers (structural_affect, emotion_quantifier,
   presence_guide) do not share a result and are not reconciled,
   except `prosody.reconcile()` which only sees structural valence
   plus a ProsodyReading that nobody builds.
9. Corti seat is 3 samples. `prosody.SpeakerBaseline` wants 30.
   Nobody copies one into the other.
10. Mode-string dialects will drop a live mode even if someone stuffs
    it into `live_state["response_mode"]`.
11. Recognition VAD and `resonance_listener` are extra microphones.
12. Footer claims a canal feed that does not exist.

**What is not required to keep Corti itself operational:**
Fusion, ToneScore, nonverbal maps, TTS, presence, grounding. The ear
already measures. Those are consumers. They can wait for a wire.
They cannot wait for a pretend wire.

---

## 8. Parallel text readers (do not collapse them by accident)

| Module | Input | Output | Care gate |
|---|---|---|---|
| `structural_affect` | text | `AffectReading` | `is_self_distress` |
| `emotion_quantifier` | text (+ optional gestures) | `EmotionalMetrics` | `needs_grounding` / `crisis_detected` |
| `presence_guide` | text | `StateAssessment` | presence vs problem-solving |

Fusion uses only the first. Grounder reads the second. Presence is
alone. A single sentence can get three answers.

---

## 9. What "keep training" actually does

In the preview:

- **Listen** writes vocalization events into an 8-deep ring and
  (if you press Seat) a `SpeakerSeat`.
- **Tone** shows the proxies and the ring. Seat lives here.
- **Train** drills *your* pitch-class hearing and appends labelled
  oscillator trials to `corti-calib-corpus`.

None of that updates a Python engine. None of that writes
`tone_score`. None of that reaches Fusion. The corpus JSON can be
downloaded from Train. That is the whole learning surface that exists.

---

## 10. Next honest step (when we take it)

Not "connect everything." One wire.

Corti already emits the contract `tape_contour.py` was written against.
The smallest operational step is:

1. On `VocalTracker.close`, keep doing what it does.
2. Map that `VocalEvent` onto `prosody.VocalEvent` (card) and hand
   `event.tape` to `analyze_tape`.
3. Hand the `ProsodyReading` into `fuse(..., prosody=)`.
4. Leave `tone_score` unread unless a measured producer is actually
   on the path. Do not stuff a heuristic 0–100 into `live_state`
   to make Silicon look busy.

That is Corti sitting at the top. Everything else remains a consumer.
