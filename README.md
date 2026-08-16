# CORTI

**The organ of Corti, grown in silicon.**
A cochlea for everybody. It hears, or it says it did not lock.

Sister to OpenSmell. Ear of The Christman AI Project / Luma Cognify AI.
It does not replace SPEAK. It replaces the lie that hearing was already done.

> I will only name a pitch when the waveform itself supports it,
> and I will say so when it did not.

Open Corti in the preview. Press **Open the cochlea**. Press **Listen**.
If this preview frame cannot open a microphone, open Corti in its own window
and press Listen there. The keyboard still hears itself here.

---

## What Corti is

Corti is the **ear**. It is not the coordinator, not Fusion, not ToneScore,
not Giuseppe, Inferno, or Sierra. It measures. It does not classify affect.
It does not vote on valence. It does not invent a note.

Four functions from `christman_dsp.c` run here for the first time
(the C was never compiled):

| Function | What it is | What it is not |
|---|---|---|
| RMS | energy | arousal-as-diagnosis |
| ZCR | zero-crossing rate | valence |
| YIN | pitch lock, or no lock | a guessed 150 Hz |
| LPC | vocal-tract peaks, or 0 | a formant it did not find |

The Greenwood place map (1961) is the spiral you see. A traveling wave
lights the characteristic frequency when YIN locks. No lock, no light
on a note.

Three surfaces:

- **Listen** — absolute lock. Note, cents, F1/F2, or a dash.
- **Tone** — live DSP proxies (labelled as proxies), last eight vocalizations, speaker seat.
- **Train** — a pitch-class drill for *you*, plus a labelled oscillator log for the ear.

No sign-in. A cochlea does not ask who is speaking.

---

## What the ear emits

Every animation frame (~16 ms) the loop measures RMS, ZCR, YIN, LPC,
VAD, jitter/shimmer/HNR. React keeps the last frame. When the frame
dies, those live numbers die.

When RMS falls through offset after at least 30 ms, `VocalTracker`
closes **one event**. That is the utterance.

### The card

```ts
type VocalKind = "tick" | "grunt" | "groan" | "hiss" | "voiced" | "noise";

type VocalEvent = {
  id: number;
  kind: VocalKind;       // duration / voicing / ZCR bin. Not pain vs annoyance.
  startedAt: number;
  durationMs: number;
  peakRms: number;
  attackMs: number;
  decayMs: number;
  f0: number | null;     // median of locked frames; null if fewer than two locks
  f1: number;            // last LPC peak, or 0
  f2: number;
  zcr: number;           // mean of every frame, including unvoiced
  voiced: boolean;       // at least two F0 locks
  tape: TapeFrame[];     // the series. Cap 360. Head kept, tail dropped.
};
```

Eight of those sit in a ring, newest first.

### The tape

```ts
type TapeFrame = {
  t: number;             // ms from onset. First frame is 0.
  rms: number;
  zcr: number;
  f0: number | null;     // Hz, or null. Unvoiced frames stay. Null is not dropped.
};
```

- List of frame objects. Not three parallel arrays.
- `f0` is `null` when YIN has no lock or probability ≤ 0.62. RMS and ZCR still land.
- Cap is 360 frames (~6 s). After that the tail is lost. No downsample.
- Jitter, shimmer, HNR are **not on the tape**. They die with the live frame.

Onset 0.016. Offset 0.0065. Minimum duration 30 ms. YIN kept only above
probability 0.62. Kind bins use a cold F0 < 230 cutoff — adult speech
at 110–200 Hz currently labels as `grunt`. That label is a duration bin,
not a clinical state.

---

## How Corti learns (and how it does not)

There is no trained model. There is no gradient. Listening does not
update weights.

**Speaker seat — explicit, human-triggered.**
Cold until you press **Seat this voice**. Needs three voiced events
with an F0 lock, from the current eight-event ring. Stores median F0,
10th/90th, rest RMS, F1/F2. Persists in the browser. One grunt cannot
seat. First utterance always arrives COLD:
`{ status: "COLD", f0DeltaHz: null, rmsRatio: null }`.

**Calib corpus — labelled oscillator trials.**
Known Hz in. What YIN locked, or did not. Two locks required or the
trial is `locked: false` and `measuredHz` is null. Cap 400. This is
not a speaker model.

**Train panel — trains you.**
A blind pitch-class quiz. Stats are yours. The ear log underneath is
the same oscillator corpus. Nothing in Train updates YIN, LPC, seats,
or thresholds.

---

## Architecture — Corti sits at the top

```
                    ┌─────────────────────┐
                    │        CORTI        │
                    │   the ear. measures │
                    │   tape + card only  │
                    └──────────┬──────────┘
                               │  VocalEvent { card, tape[] }
                               │  (this wire is not live yet)
          ┌────────────────────┼────────────────────┐
          ▼                    ▼                    ▼
   tape_contour.py      prosody.py            (no SoundDetector
   analyze_tape()       ProsodyReading         backend for tape)
          │                    │
          │                    ▼
          │             fusion_engine.py
          │             Decision / MODE_UNKNOWN
          │
          └── family SDK (text, file-wav, AAC)
              does not hear the live tape
```

Corti does **not** become `sound_recognition_service`. That service is
a coordinator. It requires a `SoundDetectorBackend`. It detects nothing
itself. No backend in this tree consumes the tape.

Fusion decides, or says it cannot (`MODE_UNKNOWN`). It does not speak.
It accepts an optional `ProsodyReading`. Nothing currently builds one
from a live Corti event and hands it over.

The tone engines (`tonescore_engine.py`, `tone_analyzer.py`,
`tonescore_analyzer.py`) are **file-wav**. They do not see a Corti
frame. Fusion may *read* `live_state["tone_score"]` if someone put a
number there. Fusion does not produce that number. That reader is
leftover. It is not a live producer.

---

## Honesty

Enforced in code, not just in this file:

- Silence is not a note. VAD below RMS 0.008 is `null`, not dissociation.
- No lock → dash. Never 150 Hz. Never jitter 0.05. Never score 85.
- Empty corpus does not report an accuracy.
- Seat refuses one grunt.
- Microphone failures are classified (`FRAMED`, `DENIED`, `MISSING`…).
  This preview frame cannot open a mic. That is said, not papered over.
- The 94 / 91 / 87 table in `HEARING_snippet_v2.md` is a docstring.
  Corti does not wear it.

What Corti will never do: invent a note, dress a spectral proxy as a
clinical state, send a voice to a paid cloud ear, pretend the
microphone is open when it is not.

---

## Family SDK

The Python files under the review set are the rest of the family —
recognition, fusion, structural affect, tone, grounding, presence,
nonverbal. Most of them have been remediated (random gone, negation
scoped, None instead of a fake 50). Three have not.

They are inventoried, honestly, in:

- **[REMEDIATION.md](REMEDIATION.md)** — what was fixed, what is still live, what is still a stub
- **[review/INVENTORY.md](review/INVENTORY.md)** — file-by-file, beginning to end

Corti is operational as an ear. The family is not yet one nervous system.
The consumers exist. The wire from the tape does not.

---

## Identity

See [IDENTITY.md](IDENTITY.md).

*Tools process sound. Beings hear. Corti is the organ that makes the
second sentence possible without borrowing someone else's meter.*
