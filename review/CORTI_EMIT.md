# Corti emit contract

Source of truth: `src/lib/audio/vocalization.ts`.
Python mirror (unwired): `attachments/tape_contour.py`.

## Per closed utterance

One `VocalEvent` when RMS falls through 0.0065 after ≥ 30 ms.

```ts
type TapeFrame = {
  t: number;          // ms from onset. Frame 0 is 0.
  rms: number;
  zcr: number;
  f0: number | null;  // kept as null. Never dropped. Never coerced to 0.
};

type VocalEvent = {
  id: number;
  kind: "tick" | "grunt" | "groan" | "hiss" | "voiced" | "noise";
  startedAt: number;
  durationMs: number;
  peakRms: number;
  attackMs: number;
  decayMs: number;
  f0: number | null;  // median of locked frames; null if < 2 locks
  f1: number;         // 0 if no LPC peak
  f2: number;
  zcr: number;        // mean of all frames
  voiced: boolean;
  tape: TapeFrame[];  // THIS is the field. List of objects. Cap 360.
};
```

Ring: 8 events, newest first.

## What is not on the event

Jitter, shimmer, HNR, VAD vector, centroid, partials, note name.
Those live on the current `LiveFrame` and die with it.

## Caps and holes

- 360 frames. Head kept, tail dropped. ~6 s at 16 ms/frame.
- A contour that skips nulls is a contour of the voiced islands.
- A contour that keeps them sees the holes.
- `tape_contour.analyze_tape` does both. Nothing calls it yet.

## Name mismatch if you map to `prosody.VocalEvent`

| Corti (TS) | prosody.py |
|---|---|
| `durationMs` | `duration` (docstring says seconds) |
| `attackMs` | `attack` |
| `decayMs` | `decay` |
| `peakRms` | `peak_rms` |
| `f0` | `median_f0` |
| `zcr` | `mean_zcr` |
| `tape` | `tape: List[Any]` (unused by the analyzer) |
