/**
 * Corti keeps the sound of the house for MEMORY's fifth stream.
 * Sound becomes place. No invented pitch lock.
 */
export const HOUSE_CHANNEL = "christman.house.record";
export const SILENCE_RMS = 0.008;

export type CortiEar = {
  listening: boolean;
  rms: number;
  zcr: number;
  f0: number | null;
  locked: boolean;
};

export function earFromFrame(args: {
  listening: boolean;
  rms: number;
  zcr: number;
  f0: number | null;
}): CortiEar {
  const locked =
    args.listening && args.f0 != null && Number.isFinite(args.f0) && args.f0 > 0;
  return {
    listening: args.listening,
    rms: args.rms,
    zcr: args.zcr,
    f0: locked ? args.f0 : null,
    locked,
  };
}

export function postCortiHouse(ear: CortiEar): void {
  if (typeof BroadcastChannel === "undefined") return;
  const ch = new BroadcastChannel(HOUSE_CHANNEL);
  ch.postMessage({ source: "corti", t: Date.now(), corti: ear });
  ch.close();
}
