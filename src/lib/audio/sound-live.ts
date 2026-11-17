/**
 * Live delivery to Christman-Sound. Corti already measured. This posts the CARD.
 *
 * The receiving end is the sound package's corti_receiver: 127.0.0.1 only,
 * POST /api/sound/corti-event, seated as Hearing.hear(corti_event=card).
 * Does not recompute anything. `kind` stays on the Corti client; it does not cross.
 *
 * The card shape is the one THE WHOLE HOUSE already sends (lib/sound/packet.ts).
 */
import type { TapeFrame, VocalEvent } from "./vocalization";

export type SoundCard = {
  organ: "corti";
  family: "christman-sound";
  honesty: {
    corti: "present";
    kind: "dropped";
    rule: string;
  };
  id: number;
  startedAt: number;
  durationMs: number;
  peakRms: number;
  attackMs: number;
  decayMs: number;
  f0: number | null;
  f1: number;
  f2: number;
  zcr: number;
  voiced: boolean;
  truncated: boolean;
  tape: TapeFrame[];
};

const TAPE_CAP = 360;
const DEFAULT_URL = "http://127.0.0.1:5486/api/sound/corti-event";

export function eventToSoundCard(ev: VocalEvent): SoundCard {
  return {
    organ: "corti",
    family: "christman-sound",
    honesty: {
      corti: "present",
      kind: "dropped",
      rule: "Corti measures. Sound consumes card and tape. Kind does not cross.",
    },
    id: ev.id,
    startedAt: ev.startedAt,
    durationMs: ev.durationMs,
    peakRms: ev.peakRms,
    attackMs: ev.attackMs,
    decayMs: ev.decayMs,
    f0: ev.f0,
    f1: ev.f1,
    f2: ev.f2,
    zcr: ev.zcr,
    voiced: ev.voiced,
    truncated: ev.tape.length >= TAPE_CAP,
    tape: ev.tape,
  };
}

export function soundEndpoint(): string {
  const fromEnv =
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    (import.meta.env.VITE_SOUND_CORTI_URL as string | undefined);
  return fromEnv || DEFAULT_URL;
}

/**
 * Posts one closed card. Resolves true only when the receiver answered 200.
 * A refused or unreachable receiver is said out loud in the console, with the
 * reason. Nothing is retried and nothing is invented in its place.
 */
export async function postSoundCard(
  ev: VocalEvent,
  url: string = soundEndpoint(),
): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventToSoundCard(ev)),
    });
    if (!res.ok) {
      console.error(`Christman-Sound refused the card: ${res.status} at ${url}`);
      return false;
    }
    return true;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Christman-Sound card post failed at ${url}:`, message);
    return false;
  }
}
