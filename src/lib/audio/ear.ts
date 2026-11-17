/**
 * The ear inside a being.
 *
 * Corti's own screen runs this same loop inside hearing-context.tsx, tied to
 * her interface. A being has no use for her screen; it needs her ear. This is
 * that loop on its own: open the microphone, measure every frame, close a card
 * when the utterance ends, post the card to Christman-Sound.
 *
 * Nothing here is a second ear. It is HearingEngine, measureProxies and
 * VocalTracker, called in the order hearing-context.tsx calls them.
 *
 * A being imports this file and calls `new Ear().start()` on its own mic press.
 */
import { postAcousticKey } from "./alphavox-live";
import { routeForAlphaVox, type AcousticKey } from "./alphavox-router";
import { HearingEngine, type HearingFrame } from "./engine";
import { measureProxies, type SpectralProxies } from "./proxies";
import { postSoundCard, soundEndpoint } from "./sound-live";
import { VocalTracker, type VocalEvent } from "./vocalization";

export type EarFrame = HearingFrame & { proxies: SpectralProxies };

export type EarOptions = {
  /** Where the closed card goes. Default: the sound package receiver on 5486. */
  soundUrl?: string;
  /**
   * Where the acoustic key goes. No default here: a being names its own
   * receiver, or no key is posted.
   */
  acousticUrl?: string;
  /** Called with each closed card, and whether Christman-Sound took it. */
  onCard?: (card: VocalEvent, delivered: boolean) => void;
  /** Called with every measured frame. */
  onFrame?: (frame: EarFrame) => void;
};

const LOCK = 0.62;

/** One frame through the ear: measure, step the tracker, return what closed. */
export function hearFrame(
  tracker: VocalTracker,
  raw: HearingFrame,
): { frame: EarFrame; closed: VocalEvent | null } {
  const f0 = raw.pitch && raw.pitch.probability > LOCK ? raw.pitch.freq : null;
  const frame: EarFrame = {
    ...raw,
    proxies: measureProxies(
      raw.freqData,
      raw.timeData,
      raw.sampleRate,
      raw.fftSize,
      raw.rms,
      f0,
    ),
  };
  const closed = tracker.step(
    frame.time,
    frame.rms,
    frame.proxies.zcr,
    f0,
    frame.proxies.formants.f1,
    frame.proxies.formants.f2,
  );
  return { frame, closed };
}

export class Ear {
  private engine: HearingEngine | null = null;
  private readonly tracker = new VocalTracker();
  private raf = 0;
  private readonly soundUrl: string;
  private readonly opts: EarOptions;
  /** The last acoustic key the router produced. "unknown" until one is. */
  lastKey: AcousticKey = "unknown";

  constructor(opts: EarOptions = {}) {
    this.opts = opts;
    this.soundUrl = opts.soundUrl ?? soundEndpoint();
  }

  get listening(): boolean {
    return this.engine !== null;
  }

  /** The last eight closed cards, newest first. */
  get cards(): VocalEvent[] {
    return [...this.tracker.events];
  }

  /**
   * Opens the microphone and starts measuring. A microphone that cannot be
   * opened throws, with the reason in the error's name (DENIED, MISSING, …),
   * exactly as HearingEngine.startMic reports it.
   */
  async start(): Promise<void> {
    if (this.engine) return;
    const engine = new HearingEngine();
    try {
      await engine.startMic();
    } catch (err) {
      engine.dispose();
      throw err;
    }
    this.engine = engine;
    this.raf = requestAnimationFrame(this.loop);
  }

  stop(): void {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.engine?.dispose();
    this.engine = null;
  }

  private readonly loop = (): void => {
    const engine = this.engine;
    if (!engine) return;
    const { frame, closed } = hearFrame(this.tracker, engine.sample());
    if (closed) this.deliver(closed);
    this.opts.onFrame?.(frame);
    this.raf = requestAnimationFrame(this.loop);
  };

  private deliver(card: VocalEvent): void {
    this.lastKey = routeForAlphaVox(this.cards);
    if (this.opts.acousticUrl) postAcousticKey(this.lastKey, this.opts.acousticUrl);
    void postSoundCard(card, this.soundUrl).then((delivered) => {
      this.opts.onCard?.(card, delivered);
    });
  }
}
