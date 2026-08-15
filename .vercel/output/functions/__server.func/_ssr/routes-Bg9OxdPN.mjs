import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as MicOff, n as Power, r as Mic } from "../_libs/lucide-react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as signOut, n as authClient, r as cn, t as Button } from "./client-CkmXsD7L.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Bg9OxdPN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled (default) -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of).
*/
function UserButton() {
	const user = useCurrentUser();
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => void signOut(),
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline",
				children: "Sign out"
			})
		]
	});
}
function AuthSlot() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-8 animate-pulse rounded-full bg-raised" });
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "max-w-[10rem] truncate text-xs text-muted [&_button]:text-subtle [&_img]:size-7 [&_span]:text-xs",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/login",
		className: "font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-subtle hover:text-fg",
		children: "Sign in"
	});
}
var NOTE_NAMES = [
	"C",
	"C♯",
	"D",
	"D♯",
	"E",
	"F",
	"F♯",
	"G",
	"G♯",
	"A",
	"A♯",
	"B"
];
var A4_PRESETS = [
	432,
	440,
	442,
	444
];
function midiToFreq(midi, a4 = 440) {
	return a4 * 2 ** ((midi - 69) / 12);
}
function freqToMidi(freq, a4 = 440) {
	return 69 + 12 * Math.log2(freq / a4);
}
function analyzeNote(freq, a4 = 440) {
	const raw = freqToMidi(freq, a4);
	const midi = Math.round(raw);
	const cents = (raw - midi) * 100;
	const pc = (midi % 12 + 12) % 12;
	const octave = Math.floor(midi / 12) - 1;
	const letter = NOTE_NAMES[pc] ?? "C";
	return {
		midi,
		pc,
		name: `${letter}${octave}`,
		letter,
		octave,
		cents,
		freq,
		inTune: Math.abs(cents) < 8
	};
}
function midiName(midi) {
	const pc = (midi % 12 + 12) % 12;
	const octave = Math.floor(midi / 12) - 1;
	return `${NOTE_NAMES[pc] ?? "C"}${octave}`;
}
function isBlackKey(midi) {
	const pc = (midi % 12 + 12) % 12;
	return pc === 1 || pc === 3 || pc === 6 || pc === 8 || pc === 10;
}
/** Greenwood (1961) human cochlear frequency–place map. x = 0 at apex, 1 at base. */
var GW_A = 165.4;
var GW_A_EXP = 2.1;
var GW_K = .88;
function freqToPlace(freq) {
	const x = Math.log10(freq / GW_A + GW_K) / GW_A_EXP;
	return Math.max(0, Math.min(1, x));
}
function placeToFreq(place) {
	return GW_A * (10 ** (GW_A_EXP * Math.max(0, Math.min(1, place))) - GW_K);
}
var COCHLEA_FMIN = placeToFreq(.05);
var COCHLEA_FMAX = placeToFreq(.98);
function formatHz(freq) {
	if (freq >= 1e4) return `${(freq / 1e3).toFixed(2)} k`;
	if (freq >= 1e3) return `${(freq / 1e3).toFixed(3)} k`;
	if (freq >= 100) return freq.toFixed(1);
	return freq.toFixed(2);
}
function formatCents(cents) {
	return `${cents >= 0 ? "+" : "−"}${Math.abs(cents).toFixed(1)}`;
}
/**
* Compact YIN pitch detector (de Cheveigné & Kawahara, 2002).
* Returns the strongest periodic fundamental in the buffer, or null.
*/
function detectPitchYin(buf, sampleRate, threshold = .13) {
	const size = buf.length;
	const half = Math.floor(size / 2);
	if (half < 32) return null;
	const yin = new Float32Array(half);
	for (let tau = 1; tau < half; tau++) {
		let sum = 0;
		for (let i = 0; i < half; i++) {
			const d = buf[i] - buf[i + tau];
			sum += d * d;
		}
		yin[tau] = sum;
	}
	let running = 0;
	yin[0] = 1;
	for (let tau = 1; tau < half; tau++) {
		running += yin[tau];
		yin[tau] = running > 0 ? yin[tau] * tau / running : 1;
	}
	const tauMin = Math.max(2, Math.floor(sampleRate / 1800));
	const tauMax = Math.min(half - 2, Math.floor(sampleRate / 55));
	let tauEst = -1;
	for (let tau = tauMin; tau < tauMax; tau++) if (yin[tau] < threshold) {
		while (tau + 1 < tauMax && yin[tau + 1] < yin[tau]) tau++;
		tauEst = tau;
		break;
	}
	if (tauEst < 0) return null;
	const s0 = yin[tauEst - 1];
	const s1 = yin[tauEst];
	const s2 = yin[tauEst + 1];
	const denom = 2 * s1 - s2 - s0;
	const better = denom !== 0 ? tauEst + (s2 - s0) / (2 * denom) : tauEst;
	if (better <= 0) return null;
	const freq = sampleRate / better;
	const probability = 1 - s1;
	if (freq < 55 || freq > 1800 || probability < .55) return null;
	return {
		freq,
		probability
	};
}
function interpolateBin(mags, bin, sampleRate, fftSize) {
	const y0 = mags[bin - 1] ?? 0;
	const y1 = mags[bin] ?? 0;
	const y2 = mags[bin + 1] ?? 0;
	const denom = 2 * (2 * y1 - y0 - y2);
	return (bin + (denom !== 0 ? (y2 - y0) / denom : 0)) * sampleRate / fftSize;
}
function findPartials(mags, sampleRate, fftSize, count = 6) {
	const nyquist = sampleRate / 2;
	const minBin = Math.max(2, Math.floor(55 / nyquist * (mags.length - 1)));
	const maxBin = Math.min(mags.length - 2, Math.floor(8e3 / nyquist * (mags.length - 1)));
	const peaks = [];
	for (let i = minBin; i <= maxBin; i++) {
		const v = mags[i] ?? 0;
		if (v < 28) continue;
		if (v >= (mags[i - 1] ?? 0) && v >= (mags[i + 1] ?? 0)) peaks.push({
			freq: interpolateBin(mags, i, sampleRate, fftSize),
			amp: v / 255,
			bin: i
		});
	}
	peaks.sort((a, b) => b.amp - a.amp);
	const picked = [];
	for (const p of peaks) {
		if (picked.some((q) => Math.abs(q.freq - p.freq) / p.freq < .03)) continue;
		picked.push(p);
		if (picked.length >= count) break;
	}
	picked.sort((a, b) => a.freq - b.freq);
	return picked;
}
function rmsLevel(buf) {
	let sum = 0;
	for (let i = 0; i < buf.length; i++) {
		const s = buf[i] ?? 0;
		sum += s * s;
	}
	return Math.sqrt(sum / Math.max(1, buf.length));
}
var FFT_SIZE = 4096;
var HearingEngine = class {
	ctx;
	analyser;
	mixer;
	master;
	micGain;
	oscBus;
	micSource = null;
	micStream = null;
	voices = /* @__PURE__ */ new Map();
	freqBuf;
	timeBuf;
	pitchClock = 0;
	lastPitch = null;
	a4 = 440;
	waveform = "sine";
	volume = .22;
	constructor() {
		const Ctx = window.AudioContext || window.webkitAudioContext;
		this.ctx = new Ctx();
		this.analyser = this.ctx.createAnalyser();
		this.analyser.fftSize = FFT_SIZE;
		this.analyser.smoothingTimeConstant = .72;
		this.analyser.minDecibels = -92;
		this.analyser.maxDecibels = -18;
		this.mixer = this.ctx.createGain();
		this.master = this.ctx.createGain();
		this.micGain = this.ctx.createGain();
		this.oscBus = this.ctx.createGain();
		this.mixer.gain.value = 1;
		this.master.gain.value = 1;
		this.micGain.gain.value = 1.4;
		this.oscBus.gain.value = 1;
		this.oscBus.connect(this.mixer);
		this.oscBus.connect(this.master);
		this.micGain.connect(this.mixer);
		this.mixer.connect(this.analyser);
		this.master.connect(this.ctx.destination);
		this.freqBuf = new Uint8Array(this.analyser.frequencyBinCount);
		this.timeBuf = new Float32Array(this.analyser.fftSize);
	}
	async resume() {
		if (this.ctx.state !== "running") await this.ctx.resume();
	}
	async startMic() {
		await this.resume();
		if (this.micSource) return;
		const stream = await navigator.mediaDevices.getUserMedia({ audio: {
			echoCancellation: false,
			noiseSuppression: false,
			autoGainControl: false
		} });
		this.micStream = stream;
		this.micSource = this.ctx.createMediaStreamSource(stream);
		this.micSource.connect(this.micGain);
	}
	stopMic() {
		this.micSource?.disconnect();
		this.micSource = null;
		this.micStream?.getTracks().forEach((t) => t.stop());
		this.micStream = null;
	}
	playMidi(midi, opts = {}) {
		const id = opts.id ?? `v-${midi}`;
		this.release(id);
		const now = this.ctx.currentTime;
		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();
		osc.type = this.waveform;
		const detune = opts.cents ?? 0;
		osc.frequency.value = midiToFreq(midi + detune / 100, this.a4);
		const level = this.waveform === "sine" ? this.volume : this.waveform === "triangle" ? this.volume * .7 : this.volume * .28;
		gain.gain.setValueAtTime(1e-4, now);
		gain.gain.exponentialRampToValueAtTime(Math.max(2e-4, level), now + .018);
		osc.connect(gain);
		gain.connect(this.oscBus);
		osc.start(now);
		if (opts.duration != null) {
			const end = now + opts.duration;
			gain.gain.setValueAtTime(level, Math.max(now, end - .06));
			gain.gain.exponentialRampToValueAtTime(1e-4, end);
			osc.stop(end + .02);
			osc.onended = () => {
				try {
					gain.disconnect();
				} catch {}
				this.voices.delete(id);
			};
		}
		this.voices.set(id, {
			id,
			osc,
			gain,
			midi
		});
		return id;
	}
	release(id) {
		const v = this.voices.get(id);
		if (!v) return;
		const now = this.ctx.currentTime;
		try {
			v.gain.gain.cancelScheduledValues(now);
			v.gain.gain.setValueAtTime(Math.max(1e-4, v.gain.gain.value), now);
			v.gain.gain.exponentialRampToValueAtTime(1e-4, now + .05);
			v.osc.stop(now + .06);
		} catch {}
		this.voices.delete(id);
	}
	releaseAll() {
		for (const id of [...this.voices.keys()]) this.release(id);
	}
	sample(now = performance.now()) {
		this.analyser.getByteFrequencyData(this.freqBuf);
		this.analyser.getFloatTimeDomainData(this.timeBuf);
		const rms = rmsLevel(this.timeBuf);
		this.pitchClock += 1;
		if (this.pitchClock % 2 === 0) this.lastPitch = rms > .007 ? detectPitchYin(this.timeBuf, this.ctx.sampleRate) : null;
		const note = this.lastPitch && this.lastPitch.probability > .62 ? analyzeNote(this.lastPitch.freq, this.a4) : null;
		const partials = findPartials(this.freqBuf, this.ctx.sampleRate, this.analyser.fftSize, 6);
		return {
			time: now,
			rms,
			freqData: this.freqBuf,
			timeData: this.timeBuf,
			sampleRate: this.ctx.sampleRate,
			fftSize: this.analyser.fftSize,
			pitch: this.lastPitch,
			note,
			partials
		};
	}
	dispose() {
		this.releaseAll();
		this.stopMic();
		this.ctx.close();
	}
};
function christmanZcr(audio) {
	const n = audio.length;
	if (n < 2) return 0;
	let crossings = 0;
	for (let i = 1; i < n; i++) {
		const a = audio[i - 1] ?? 0;
		const b = audio[i] ?? 0;
		if (b > 0 && a <= 0 || b <= 0 && a > 0) crossings++;
	}
	return crossings / n;
}
/** Levinson-Durbin LPC. Returns a[0..order] with a[0] = 1. */
function christmanLpc(audio, order) {
	const a = new Float32Array(order + 1);
	a[0] = 1;
	const length = audio.length;
	if (length === 0 || order <= 0 || length <= order) return a;
	const r = new Float32Array(order + 1);
	for (let lag = 0; lag <= order; lag++) {
		let s = 0;
		const lim = length - lag;
		for (let i = 0; i < lim; i++) s += (audio[i] ?? 0) * (audio[i + lag] ?? 0);
		r[lag] = s;
	}
	if (r[0] === 0) return a;
	const k = new Float32Array(order + 1);
	let error = r[0];
	for (let i = 1; i <= order; i++) {
		let sum = 0;
		for (let j = 1; j < i; j++) sum += (a[j] ?? 0) * (r[i - j] ?? 0);
		if (error === 0) break;
		const ki = ((r[i] ?? 0) - sum) / error;
		k[i] = ki;
		a[i] = ki;
		const half = Math.floor(i / 2);
		for (let j = 1; j <= half; j++) {
			const aj = a[j] ?? 0;
			const aij = a[i - j] ?? 0;
			a[j] = aj - ki * aij;
			a[i - j] = aij - ki * aj;
		}
		error *= 1 - ki * ki;
	}
	return a;
}
/**
* Formant peaks from |1 / A(ω)|. Same job as extract_frequency_signature
* in voice_capture_client.py, but from LPC instead of raw FFT band-max.
* Returns 0 for a slot that has no peak (never invents 150 Hz).
*/
function lpcFormants(coeffs, sampleRate, nfft = 512) {
	const half = nfft / 2;
	const mag = new Float32Array(half);
	for (let bin = 1; bin < half; bin++) {
		const w = Math.PI * bin / half;
		let re = 0;
		let im = 0;
		for (let i = 0; i < coeffs.length; i++) {
			const c = coeffs[i] ?? 0;
			re += c * Math.cos(w * i);
			im -= c * Math.sin(w * i);
		}
		const den = re * re + im * im;
		mag[bin] = den > 1e-12 ? 1 / Math.sqrt(den) : 0;
	}
	const hzPer = sampleRate / nfft;
	const peaks = [];
	for (let bin = 2; bin < half - 1; bin++) {
		const v = mag[bin] ?? 0;
		if (v > (mag[bin - 1] ?? 0) && v >= (mag[bin + 1] ?? 0) && v > .4) {
			const hz = bin * hzPer;
			if (hz >= 180 && hz <= 4200) peaks.push({
				hz,
				mag: v
			});
		}
	}
	const pick = (lo, hi) => {
		let best = 0;
		let bestMag = 0;
		for (const p of peaks) if (p.hz >= lo && p.hz <= hi && p.mag > bestMag) {
			bestMag = p.mag;
			best = p.hz;
		}
		return best;
	};
	const f1 = pick(200, 1200);
	const f2 = pick(Math.max(700, f1 ? f1 + 180 : 700), 3200);
	return {
		f1,
		f2,
		f3: pick(Math.max(1800, f2 ? f2 + 180 : 1800), 4200)
	};
}
/** C comment: RMS for arousal/dominance. Clipped, unlabeled as emotion. */
function arousalProxy(rms) {
	return Math.max(0, Math.min(1, rms * 10));
}
/** C comment: ZCR for valence smoothness. High ZCR = noisier / less smooth. */
function smoothnessProxy(zcr) {
	return Math.max(0, Math.min(1, 1 - zcr * 10));
}
/**
* Spectral + DSP proxies — measured features, not emotions.
* Rule 13: these are physics. Do not report them as clinical affect.
*/
var lpcClock = 0;
var lastFormants = {
	f1: 0,
	f2: 0,
	f3: 0
};
function measureProxies(freqData, timeData, sampleRate, fftSize, rms) {
	const binHz = sampleRate / fftSize;
	let weighted = 0;
	let total = 0;
	for (let i = 1; i < freqData.length; i++) {
		const mag = (freqData[i] ?? 0) / 255;
		weighted += mag * i * binHz;
		total += mag;
	}
	const centroidHz = total > .001 ? weighted / total : 0;
	let cum = 0;
	const target = total * .85;
	let rolloffHz = 0;
	for (let i = 1; i < freqData.length; i++) {
		cum += (freqData[i] ?? 0) / 255;
		if (cum >= target) {
			rolloffHz = i * binHz;
			break;
		}
	}
	const zcr = christmanZcr(timeData);
	lpcClock += 1;
	if (rms > .008 && lpcClock % 3 === 0) lastFormants = lpcFormants(christmanLpc(timeData, sampleRate > 4e4 ? 16 : 12), sampleRate);
	else if (rms <= .008) lastFormants = {
		f1: 0,
		f2: 0,
		f3: 0
	};
	const brightness = Math.max(0, Math.min(1, centroidHz / 4e3));
	const noisiness = Math.max(0, Math.min(1, zcr * 8));
	return {
		centroidHz,
		rolloffHz,
		zcr,
		brightness,
		noisiness,
		arousal: arousalProxy(rms),
		smoothness: smoothnessProxy(zcr),
		formants: lastFormants
	};
}
var ONSET = .016;
var OFFSET = .0065;
var MIN_MS = 30;
function median(xs) {
	if (xs.length === 0) return 0;
	const s = [...xs].sort((a, b) => a - b);
	const mid = Math.floor(s.length / 2);
	return s.length % 2 ? s[mid] ?? 0 : ((s[mid - 1] ?? 0) + (s[mid] ?? 0)) / 2;
}
function classify(ms, voiced, zcr, f0) {
	if (!voiced && zcr > .16 && ms < 140) return "tick";
	if (!voiced && zcr > .12) return "hiss";
	if (voiced && ms < 95) return "tick";
	if (voiced && ms < 430 && (f0 ?? 180) < 230) return "grunt";
	if (voiced && ms >= 430) return "groan";
	if (voiced) return "voiced";
	return "noise";
}
var VocalTracker = class {
	active = null;
	nextId = 1;
	events = [];
	get open() {
		return this.active != null;
	}
	durationMs(now) {
		return this.active ? now - this.active.startedAt : 0;
	}
	step(now, rms, zcr, f0, f1, f2) {
		if (!this.active) {
			if (rms >= ONSET) this.active = {
				startedAt: now,
				peakRms: rms,
				riseAt: now,
				attackMs: 0,
				f0s: f0 ? [f0] : [],
				zcrs: [zcr],
				f1,
				f2
			};
			return null;
		}
		const a = this.active;
		if (rms > a.peakRms) a.peakRms = rms;
		if (a.attackMs === 0 && a.peakRms > 0 && rms >= a.peakRms * .85) a.attackMs = Math.max(4, now - a.riseAt);
		if (f0) a.f0s.push(f0);
		a.zcrs.push(zcr);
		if (f1) a.f1 = f1;
		if (f2) a.f2 = f2;
		if (rms < OFFSET && now - a.startedAt >= MIN_MS) return this.close(now);
		return null;
	}
	close(now) {
		const a = this.active;
		this.active = null;
		const durationMs = now - a.startedAt;
		const voiced = a.f0s.length >= 2;
		const f0 = voiced ? median(a.f0s) : null;
		const zcr = a.zcrs.reduce((s, x) => s + x, 0) / Math.max(1, a.zcrs.length);
		const ev = {
			id: this.nextId++,
			kind: classify(durationMs, voiced, zcr, f0),
			startedAt: a.startedAt,
			durationMs,
			peakRms: a.peakRms,
			attackMs: a.attackMs || Math.min(18, durationMs * .2),
			decayMs: Math.max(0, durationMs - (a.attackMs || 0)),
			f0,
			f1: a.f1,
			f2: a.f2,
			zcr,
			voiced
		};
		this.events = [ev, ...this.events].slice(0, 8);
		return ev;
	}
};
var HearingContext = (0, import_react.createContext)(null);
function HearingProvider({ children }) {
	const engine = (0, import_react.useRef)(null);
	const listeners = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const tracker = (0, import_react.useRef)(new VocalTracker());
	const raf = (0, import_react.useRef)(0);
	const [opened, setOpened] = (0, import_react.useState)(false);
	const [opening, setOpening] = (0, import_react.useState)(false);
	const [mic, setMic] = (0, import_react.useState)("off");
	const [mode, setMode] = (0, import_react.useState)("listen");
	const [a4, setA4State] = (0, import_react.useState)(440);
	const [waveform, setWaveformState] = (0, import_react.useState)("sine");
	const [volume, setVolumeState] = (0, import_react.useState)(.22);
	const [held, setHeld] = (0, import_react.useState)([]);
	const [last, setLast] = (0, import_react.useState)(null);
	const [events, setEvents] = (0, import_react.useState)([]);
	const [liveVocalMs, setLiveVocalMs] = (0, import_react.useState)(0);
	const [error, setError] = (0, import_react.useState)(null);
	const lastUi = (0, import_react.useRef)(0);
	const loop = (0, import_react.useCallback)(() => {
		const e = engine.current;
		if (!e) return;
		const raw = e.sample();
		const frame = {
			...raw,
			proxies: measureProxies(raw.freqData, raw.timeData, raw.sampleRate, raw.fftSize, raw.rms)
		};
		const f0 = frame.pitch && frame.pitch.probability > .62 ? frame.pitch.freq : null;
		const closed = tracker.current.step(frame.time, frame.rms, frame.proxies.zcr, f0, frame.proxies.formants.f1, frame.proxies.formants.f2);
		listeners.current.forEach((fn) => fn(frame));
		const now = performance.now();
		if (now - lastUi.current > 50) {
			lastUi.current = now;
			setLast(frame);
			setLiveVocalMs(tracker.current.durationMs(frame.time));
			if (closed) setEvents([...tracker.current.events]);
		}
		raf.current = requestAnimationFrame(loop);
	}, []);
	const open = (0, import_react.useCallback)(async () => {
		if (engine.current || opening) return;
		setOpening(true);
		setError(null);
		try {
			const e = new HearingEngine();
			await e.resume();
			engine.current = e;
			setOpened(true);
			raf.current = requestAnimationFrame(loop);
			[
				60,
				64,
				67,
				72
			].forEach((midi, i) => {
				window.setTimeout(() => e.playMidi(midi, { duration: .38 }), i * 280);
			});
		} catch (err) {
			const message = err instanceof Error ? err.message : "Audio context failed to open.";
			setError(message);
		} finally {
			setOpening(false);
		}
	}, [loop, opening]);
	const startMic = (0, import_react.useCallback)(async () => {
		if (!engine.current) await open();
		const e = engine.current;
		if (!e) return;
		setMic("pending");
		setError(null);
		try {
			await e.startMic();
			setMic("on");
		} catch (err) {
			setMic("denied");
			const message = err instanceof Error ? err.message : "Microphone permission was denied.";
			setError(message);
		}
	}, [open]);
	const stopMic = (0, import_react.useCallback)(() => {
		engine.current?.stopMic();
		setMic("off");
	}, []);
	const setA4 = (0, import_react.useCallback)((n) => {
		setA4State(n);
		if (engine.current) engine.current.a4 = n;
	}, []);
	const setWaveform = (0, import_react.useCallback)((w) => {
		setWaveformState(w);
		if (engine.current) engine.current.waveform = w;
	}, []);
	const setVolume = (0, import_react.useCallback)((v) => {
		setVolumeState(v);
		if (engine.current) engine.current.volume = v;
	}, []);
	const playMidi = (0, import_react.useCallback)((midi, opts) => {
		const e = engine.current;
		if (!e) return;
		e.playMidi(midi, {
			id: `key-${midi}`,
			...opts
		});
		if (opts?.duration == null) setHeld((h) => h.includes(midi) ? h : [...h, midi]);
	}, []);
	const releaseMidi = (0, import_react.useCallback)((midi) => {
		engine.current?.release(`key-${midi}`);
		setHeld((h) => h.filter((m) => m !== midi));
	}, []);
	const releaseAll = (0, import_react.useCallback)(() => {
		engine.current?.releaseAll();
		setHeld([]);
	}, []);
	const subscribe = (0, import_react.useCallback)((fn) => {
		listeners.current.add(fn);
		return () => {
			listeners.current.delete(fn);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		return () => {
			cancelAnimationFrame(raf.current);
			engine.current?.dispose();
			engine.current = null;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const map = {
			a: 60,
			w: 61,
			s: 62,
			e: 63,
			d: 64,
			f: 65,
			t: 66,
			g: 67,
			y: 68,
			h: 69,
			u: 70,
			j: 71,
			k: 72
		};
		const onKey = (ev) => {
			if (!engine.current) return;
			if (ev.repeat || ev.metaKey || ev.ctrlKey || ev.altKey) return;
			const midi = map[ev.key.toLowerCase()];
			if (midi == null) return;
			ev.preventDefault();
			playMidi(midi);
		};
		const onUp = (ev) => {
			const midi = map[ev.key.toLowerCase()];
			if (midi == null) return;
			releaseMidi(midi);
		};
		window.addEventListener("keydown", onKey);
		window.addEventListener("keyup", onUp);
		return () => {
			window.removeEventListener("keydown", onKey);
			window.removeEventListener("keyup", onUp);
		};
	}, [playMidi, releaseMidi]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HearingContext.Provider, {
		value: {
			opened,
			opening,
			mic,
			mode,
			a4,
			waveform,
			volume,
			held,
			last,
			events,
			liveVocalMs,
			error,
			open,
			startMic,
			stopMic,
			setMode,
			setA4,
			setWaveform,
			setVolume,
			playMidi,
			releaseMidi,
			releaseAll,
			subscribe
		},
		children
	});
}
function useHearing() {
	const ctx = (0, import_react.useContext)(HearingContext);
	if (!ctx) throw new Error("useHearing must be used inside HearingProvider");
	return ctx;
}
var TURNS = 2.62;
var CELLS = 168;
var PHASE = Math.PI * .42;
function sampleMag(frame, freq) {
	const idx = freq / (frame.sampleRate / 2) * (frame.freqData.length - 1);
	const i0 = Math.max(0, Math.floor(idx));
	const i1 = Math.min(frame.freqData.length - 1, i0 + 1);
	const t = idx - i0;
	const a = (frame.freqData[i0] ?? 0) / 255;
	const b = (frame.freqData[i1] ?? 0) / 255;
	return a * (1 - t) + b * t;
}
function travelingWave(s, peakS, energy) {
	const d = s - peakS;
	return (d < 0 ? Math.exp(-d * d * 22) * .4 : Math.exp(-d * d * 78)) * energy;
}
function CochleaCanvas() {
	const { subscribe, last } = useHearing();
	const canvasRef = (0, import_react.useRef)(null);
	const frameRef = (0, import_react.useRef)(null);
	const idleRef = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		return subscribe((f) => {
			frameRef.current = f;
		});
	}, [subscribe]);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		let raf = 0;
		const styles = getComputedStyle(canvas);
		const accent = styles.getPropertyValue("--color-accent").trim() || "#c8d0d6";
		const fg = styles.getPropertyValue("--color-fg").trim() || "#eceae6";
		const draw = (t) => {
			const parent = canvas.parentElement;
			const w = parent?.clientWidth ?? 480;
			const h = parent?.clientHeight ?? 480;
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
				canvas.width = Math.floor(w * dpr);
				canvas.height = Math.floor(h * dpr);
				canvas.style.width = `${w}px`;
				canvas.style.height = `${h}px`;
			}
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.clearRect(0, 0, w, h);
			const cx = w / 2;
			const cy = h / 2 + 4;
			const maxR = Math.min(w, h) * .42;
			const minR = maxR * .07;
			const frame = frameRef.current;
			const energy = frame ? Math.min(1, frame.rms * 14) : 0;
			const peakPlace = frame?.note ? freqToPlace(frame.note.freq) : null;
			const peakS = peakPlace == null ? null : 1 - peakPlace;
			idleRef.current = t;
			ctx.strokeStyle = "rgba(236,234,230,0.045)";
			ctx.lineWidth = 1;
			for (let i = 1; i <= 7; i++) {
				ctx.beginPath();
				ctx.arc(cx, cy, minR + (maxR - minR) * i / 7, 0, Math.PI * 2);
				ctx.stroke();
			}
			for (let i = 0; i < 12; i++) {
				const a = i / 12 * Math.PI * 2;
				ctx.beginPath();
				ctx.moveTo(cx + Math.cos(a) * minR, cy + Math.sin(a) * minR);
				ctx.lineTo(cx + Math.cos(a) * maxR, cy + Math.sin(a) * maxR);
				ctx.stroke();
			}
			ctx.beginPath();
			for (let i = 0; i <= 480; i++) {
				const s = i / 480;
				const theta = s * TURNS * Math.PI * 2 + PHASE;
				const r = maxR - s * (maxR - minR);
				const x = cx + Math.cos(theta) * r;
				const y = cy + Math.sin(theta) * r;
				if (i === 0) ctx.moveTo(x, y);
				else ctx.lineTo(x, y);
			}
			ctx.strokeStyle = "rgba(200,208,214,0.22)";
			ctx.lineWidth = 1.25;
			ctx.stroke();
			for (let i = 0; i < CELLS; i++) {
				const s = i / 167;
				const freq = placeToFreq(1 - s);
				if (freq < COCHLEA_FMIN || freq > COCHLEA_FMAX) continue;
				const theta = s * TURNS * Math.PI * 2 + PHASE;
				const r = maxR - s * (maxR - minR);
				const x = cx + Math.cos(theta) * r;
				const y = cy + Math.sin(theta) * r;
				const s2 = Math.min(1, s + .01);
				const th2 = s2 * TURNS * Math.PI * 2 + PHASE;
				const r2 = maxR - s2 * (maxR - minR);
				const tx = Math.cos(th2) * r2 - Math.cos(theta) * r;
				const ty = Math.sin(th2) * r2 - Math.sin(theta) * r;
				const len = Math.hypot(tx, ty) || 1;
				const nx = -ty / len;
				const ny = tx / len;
				const spec = frame ? sampleMag(frame, freq) : 0;
				const wave = peakS == null ? 0 : travelingWave(s, peakS, Math.max(energy, .35));
				const idle = .04 + .03 * Math.sin(t / 1800 + s * 9);
				const amp = Math.max(idle, spec * 1.15, wave);
				const cilia = 3.2 + amp * 9;
				ctx.strokeStyle = `rgba(200, 208, 214, ${.07 + amp * .9})`;
				ctx.lineWidth = 1 + amp * 1.7;
				ctx.beginPath();
				ctx.moveTo(x - nx * cilia, y - ny * cilia);
				ctx.lineTo(x + nx * cilia * .35, y + ny * cilia * .35);
				ctx.stroke();
			}
			const labels = [
				24,
				36,
				48,
				60,
				72,
				84,
				96
			];
			ctx.fillStyle = "rgba(236,234,230,0.38)";
			ctx.font = "10px 'IBM Plex Mono', ui-monospace, monospace";
			ctx.textAlign = "center";
			for (const midi of labels) {
				const s = 1 - freqToPlace(440 * 2 ** ((midi - 69) / 12));
				const theta = s * TURNS * Math.PI * 2 + PHASE;
				const r = maxR - s * (maxR - minR) + 14;
				const x = cx + Math.cos(theta) * r;
				const y = cy + Math.sin(theta) * r;
				ctx.fillText(midiName(midi), x, y + 3);
			}
			ctx.beginPath();
			ctx.arc(cx, cy, minR * .72, 0, Math.PI * 2);
			ctx.fillStyle = "rgba(18,20,22,0.9)";
			ctx.fill();
			ctx.strokeStyle = accent;
			ctx.globalAlpha = .35 + energy * .5;
			ctx.lineWidth = 1;
			ctx.stroke();
			ctx.globalAlpha = 1;
			ctx.fillStyle = fg;
			ctx.globalAlpha = .45;
			ctx.font = "9px 'IBM Plex Mono', ui-monospace, monospace";
			ctx.fillText("APEX", cx, cy + 3);
			ctx.globalAlpha = 1;
			raf = requestAnimationFrame(draw);
		};
		raf = requestAnimationFrame(draw);
		return () => cancelAnimationFrame(raf);
	}, []);
	const locked = last?.note?.name ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative aspect-square w-full max-w-[560px]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "size-full",
				"aria-label": "Greenwood cochlear place map"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pointer-events-none absolute bottom-2 left-3 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-subtle",
				children: "Base 20 kHz"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pointer-events-none absolute bottom-2 right-3 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-subtle",
				children: locked ? `CF ${locked}` : "No lock"
			})
		]
	});
}
var START = 48;
var COUNT = 25;
function capture(e) {
	try {
		e.currentTarget.setPointerCapture(e.pointerId);
	} catch {}
}
function Keyboard() {
	const { playMidi, releaseMidi, held, last } = useHearing();
	const [oct, setOct] = (0, import_react.useState)(4);
	const liveMidi = last?.note?.midi;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-subtle",
					children: "Membrane keys"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							onClick: () => setOct((o) => Math.max(2, o - 1)),
							"aria-label": "Lower octave",
							children: "−"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-10 text-center font-mono text-xs tabular-nums text-muted",
							children: ["C", oct]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							onClick: () => setOct((o) => Math.min(6, o + 1)),
							"aria-label": "Raise octave",
							children: "+"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-6 gap-1.5 sm:hidden",
				children: NOTE_NAMES.map((name, pc) => {
					const midi = (oct + 1) * 12 + pc;
					const on = held.includes(midi) || liveMidi === midi;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"data-testid": `key-${midi}`,
						className: cn("h-12 rounded-sm font-mono text-xs transition-colors duration-150", on ? "bg-accent text-accent-fg" : "bg-raised text-muted"),
						onPointerDown: (e) => {
							capture(e);
							playMidi(midi);
						},
						onPointerUp: () => releaseMidi(midi),
						onPointerCancel: () => releaseMidi(midi),
						children: name
					}, name);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative hidden h-28 overflow-hidden rounded-md bg-raised sm:block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 flex",
					children: Array.from({ length: COUNT }, (_, i) => START + i).filter((m) => !isBlackKey(m)).map((midi) => {
						const on = held.includes(midi) || liveMidi === midi;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"data-testid": `key-${midi}`,
							className: cn("relative flex-1 border-r border-bg text-[0.625rem] font-mono text-subtle last:border-0", on ? "bg-accent text-accent-fg" : "bg-fg/95 text-bg"),
							onPointerDown: (e) => {
								capture(e);
								playMidi(midi);
							},
							onPointerUp: () => releaseMidi(midi),
							onPointerCancel: () => releaseMidi(midi),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute inset-x-0 bottom-2",
								children: midiName(midi)
							})
						}, midi);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-0 flex",
					children: Array.from({ length: COUNT }, (_, i) => START + i).filter((m) => !isBlackKey(m)).map((midi) => {
						const next = midi + 1;
						if (!isBlackKey(next) || next > 72) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "relative flex-1" }, `gap-${midi}`);
						const on = held.includes(next) || liveMidi === next;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"data-testid": `key-${next}`,
								className: cn("pointer-events-auto absolute left-[68%] top-0 z-10 h-[58%] w-[64%] rounded-b-sm", on ? "bg-accent" : "bg-bg"),
								onPointerDown: (e) => {
									capture(e);
									playMidi(next);
								},
								onPointerUp: () => releaseMidi(next),
								onPointerCancel: () => releaseMidi(next)
							})
						}, `gap-${midi}`);
					})
				})]
			})
		]
	});
}
var badgeVariants = cva("inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-[0.6875rem] tracking-wide uppercase", {
	variants: { variant: {
		default: "bg-raised text-muted",
		lock: "bg-in-tune/15 text-in-tune",
		open: "bg-accent/10 text-accent",
		warn: "bg-danger/15 text-danger"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function Readout() {
	const { last, mic, opened, a4 } = useHearing();
	const note = last?.note ?? null;
	const pitch = last?.pitch ?? null;
	const locked = Boolean(note && pitch && pitch.probability > .62);
	const cents = note?.cents ?? 0;
	const needle = Math.max(-50, Math.min(50, cents));
	const live = Boolean(last && last.rms > .006);
	const f = last?.proxies.formants;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-5 rounded-lg bg-surface p-5 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-subtle",
					children: "Absolute lock"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: locked ? "lock" : mic === "on" ? "open" : "default",
					children: locked ? "Locked" : mic === "on" ? "Listening" : opened ? "Idle" : "Closed"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				"data-testid": "note-name",
				className: "font-sans text-6xl font-light leading-none tracking-tight text-fg tabular-nums sm:text-7xl",
				children: locked ? note.name : "—"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-mono text-sm text-muted tabular-nums",
				children: locked ? `${formatHz(note.freq)} Hz` : "No fundamental"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative h-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-1/2 top-1 h-6 w-px -translate-x-1/2 bg-accent/50" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute top-1 h-6 w-px bg-fg transition-transform duration-150 ease-out",
						style: {
							left: "50%",
							transform: `translateX(${needle}%)`
						}
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex justify-between font-mono text-[0.625rem] uppercase tracking-wider text-subtle",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "−50 ¢" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums text-muted",
						children: locked ? `${formatCents(cents)} ¢` : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "+50 ¢" })
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid grid-cols-2 gap-x-4 gap-y-3 font-mono text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-subtle",
						children: "Clarity"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-0.5 tabular-nums text-fg",
						children: pitch ? `${Math.round(pitch.probability * 100)}%` : "—"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-subtle",
						children: "A4"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: "mt-0.5 tabular-nums text-fg",
						children: [a4, " Hz"]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-subtle",
						children: "F1 · LPC"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-0.5 tabular-nums text-fg",
						children: live && f && f.f1 > 0 ? `${Math.round(f.f1)} Hz` : "—"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-subtle",
						children: "F2 · LPC"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-0.5 tabular-nums text-fg",
						children: live && f && f.f2 > 0 ? `${Math.round(f.f2)} Hz` : "—"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-subtle",
						children: "Centroid"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-0.5 tabular-nums text-fg",
						children: live ? `${Math.round(last.proxies.centroidHz)} Hz` : "—"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-subtle",
						children: "Level"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-0.5 tabular-nums text-fg",
						children: last ? last.rms.toFixed(3) : "—"
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-subtle",
				children: "Partials"
			}), last && last.partials.length > 0 && last.rms > .006 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-wrap gap-1.5",
				children: last.partials.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "rounded-sm bg-raised px-2 py-1 font-mono text-[0.6875rem] tabular-nums text-muted",
					children: Math.round(p.freq)
				}, p.bin))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-subtle",
				children: "No spectral peaks above the floor."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs leading-relaxed text-subtle",
				children: "F1/F2 are LPC peaks, not emotion. Centroid is a spectral proxy. Greenwood 1961 maps frequency to place. If there is no lock, there is no note."
			})
		]
	});
}
var BINS = 96;
function Spectrogram() {
	const { subscribe } = useHearing();
	const canvasRef = (0, import_react.useRef)(null);
	const col = (0, import_react.useRef)(new Uint8Array(BINS));
	(0, import_react.useEffect)(() => {
		return subscribe((frame) => {
			const next = new Uint8Array(BINS);
			for (let i = 0; i < BINS; i++) {
				const idx = placeToFreq(i / 95) / (frame.sampleRate / 2) * (frame.freqData.length - 1);
				const i0 = Math.max(0, Math.min(frame.freqData.length - 1, Math.floor(idx)));
				next[i] = frame.freqData[i0] ?? 0;
			}
			col.current = next;
		});
	}, [subscribe]);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		let raf = 0;
		const draw = () => {
			const parent = canvas.parentElement;
			const w = parent?.clientWidth ?? 640;
			const h = parent?.clientHeight ?? 88;
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
				canvas.width = Math.floor(w * dpr);
				canvas.height = Math.floor(h * dpr);
				canvas.style.width = `${w}px`;
				canvas.style.height = `${h}px`;
				ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
				ctx.fillStyle = "#090a0b";
				ctx.fillRect(0, 0, w, h);
			} else ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.drawImage(canvas, -1, 0, w, h);
			const data = col.current;
			for (let i = 0; i < BINS; i++) {
				const v = (data[i] ?? 0) / 255;
				const y = h - (i + 1) / BINS * h;
				const bh = h / BINS + .5;
				ctx.fillStyle = `rgba(200,208,214,${.04 + v * .92})`;
				ctx.fillRect(w - 1, y, 1, bh);
			}
			raf = requestAnimationFrame(draw);
		};
		raf = requestAnimationFrame(draw);
		return () => cancelAnimationFrame(raf);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-24 w-full overflow-hidden rounded-md bg-surface shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref: canvasRef,
			className: "size-full",
			"aria-label": "Log-frequency spectrogram"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "pointer-events-none absolute left-3 top-2 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-subtle",
			children: "Place · time"
		})]
	});
}
var Slider = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
	ref,
	className: cn("relative flex w-full touch-none select-none items-center", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
		className: "relative h-1 w-full grow overflow-hidden rounded-full bg-raised",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-accent" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-4 rounded-full bg-accent shadow-[var(--shadow-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50" })]
}));
Slider.displayName = Slider$1.displayName;
var WAVES = [
	"sine",
	"triangle",
	"square",
	"sawtooth"
];
function Meter({ label, value, unit }) {
	const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-1.5 flex justify-between font-mono text-[0.625rem] uppercase tracking-wider text-subtle",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tabular-nums text-muted",
			children: unit ?? `${pct}`
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-1.5 overflow-hidden rounded-full bg-raised",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full bg-accent transition-[width] duration-150 ease-out",
			style: { width: `${pct}%` }
		})
	})] });
}
function hz(n) {
	return n > 0 ? `${Math.round(n)}` : "—";
}
function EventRow({ ev }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "grid grid-cols-[4.5rem_1fr_auto] items-baseline gap-2 font-mono text-[0.6875rem]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "uppercase tracking-wider text-fg",
				children: ev.kind
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "tabular-nums text-muted",
				children: [
					Math.round(ev.durationMs),
					" ms · atk ",
					Math.round(ev.attackMs),
					" · F0",
					" ",
					ev.f0 ? Math.round(ev.f0) : "—",
					" · F1 ",
					hz(ev.f1),
					" · F2 ",
					hz(ev.f2)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "tabular-nums text-subtle",
				children: ev.peakRms.toFixed(2)
			})
		]
	});
}
function TonePanel() {
	const { last, events, liveVocalMs, a4, setA4, waveform, setWaveform, volume, setVolume } = useHearing();
	const p = last?.proxies;
	const live = last && last.rms > .008;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-5 rounded-lg bg-surface p-5 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				"data-testid": "dsp-panel",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-subtle",
					children: "christman_dsp.c"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Four functions, first time they actually run."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
					label: "Arousal · rms",
					value: p?.arousal ?? 0,
					unit: live ? (p?.arousal ?? 0).toFixed(2) : "—"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
					label: "Smoothness · zcr",
					value: p?.smoothness ?? 0,
					unit: live ? (p?.smoothness ?? 0).toFixed(2) : "—"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid grid-cols-3 gap-3 font-mono text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-subtle",
						children: "F1"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: "mt-0.5 tabular-nums text-fg",
						children: [live ? hz(p?.formants.f1 ?? 0) : "—", live && (p?.formants.f1 ?? 0) > 0 ? " Hz" : ""]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-subtle",
						children: "F2"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: "mt-0.5 tabular-nums text-fg",
						children: [live ? hz(p?.formants.f2 ?? 0) : "—", live && (p?.formants.f2 ?? 0) > 0 ? " Hz" : ""]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-subtle",
						children: "F3"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: "mt-0.5 tabular-nums text-fg",
						children: [live ? hz(p?.formants.f3 ?? 0) : "—", live && (p?.formants.f3 ?? 0) > 0 ? " Hz" : ""]
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-baseline justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-subtle",
					children: "Vocalizations"
				}), liveVocalMs > 40 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-[0.625rem] tabular-nums text-muted",
					children: [
						"open ",
						Math.round(liveVocalMs),
						" ms"
					]
				})]
			}), events.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-subtle",
				children: "Hum, grunt, or play a key. Kind is a duration bin — not pain, not annoyance, not a being."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-1.5",
				children: events.map((ev) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventRow, { ev }, ev.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-sm bg-raised px-3 py-2 text-xs leading-relaxed text-muted",
				children: "RMS, ZCR, YIN, LPC — the C you wrote. Arousal and smoothness are the comments on those functions, not Giuseppe. The 94 / 91 / 87 table is a docstring. It is not measured. It is not shown."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border pt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-subtle",
						children: "Reference oscillator"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5",
						children: A4_PRESETS.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setA4(n),
							className: cn("h-9 rounded-sm px-3 font-mono text-xs tabular-nums", a4 === n ? "bg-accent text-accent-fg" : "bg-raised text-muted"),
							children: n
						}, n))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-1.5",
						children: WAVES.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setWaveform(w),
							className: cn("h-9 rounded-sm px-3 font-mono text-xs capitalize", waveform === w ? "bg-accent text-accent-fg" : "bg-raised text-muted"),
							children: w
						}, w))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex justify-between font-mono text-[0.6875rem] uppercase tracking-wider text-subtle",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Level" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: Math.round(volume * 100)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							min: .02,
							max: .5,
							step: .01,
							value: [volume],
							onValueChange: (v) => setVolume(v[0] ?? .22)
						})]
					})
				]
			})
		]
	});
}
var STATS_KEY = "corti-train-stats";
function loadStats() {
	try {
		const raw = localStorage.getItem(STATS_KEY);
		if (!raw) return {
			rounds: 0,
			hits: 0,
			streak: 0,
			best: 0
		};
		const parsed = JSON.parse(raw);
		return {
			rounds: Number(parsed.rounds) || 0,
			hits: Number(parsed.hits) || 0,
			streak: Number(parsed.streak) || 0,
			best: Number(parsed.best) || 0
		};
	} catch {
		return {
			rounds: 0,
			hits: 0,
			streak: 0,
			best: 0
		};
	}
}
function saveStats(s) {
	localStorage.setItem(STATS_KEY, JSON.stringify(s));
}
function TrainPanel() {
	const { opened, open, playMidi } = useHearing();
	const [target, setTarget] = (0, import_react.useState)(null);
	const [revealed, setRevealed] = (0, import_react.useState)(false);
	const [choice, setChoice] = (0, import_react.useState)(null);
	const [stats, setStats] = (0, import_react.useState)(() => typeof window === "undefined" ? {
		rounds: 0,
		hits: 0,
		streak: 0,
		best: 0
	} : loadStats());
	const targetName = target == null ? null : NOTE_NAMES[target];
	const playTarget = (pc) => {
		const midi = (4 + Math.floor(Math.random() * 2) + 1) * 12 + pc;
		playMidi(midi, { duration: .85 });
	};
	const nextRound = () => {
		const pc = Math.floor(Math.random() * 12);
		setTarget(pc);
		setRevealed(false);
		setChoice(null);
		if (!opened) open().then(() => playTarget(pc));
		else playTarget(pc);
	};
	const guess = (pc) => {
		if (target == null || revealed) return;
		setChoice(pc);
		setRevealed(true);
		const hit = pc === target;
		setStats((prev) => {
			const next = {
				rounds: prev.rounds + 1,
				hits: prev.hits + (hit ? 1 : 0),
				streak: hit ? prev.streak + 1 : 0,
				best: hit ? Math.max(prev.best, prev.streak + 1) : prev.best
			};
			saveStats(next);
			return next;
		});
	};
	const acc = (0, import_react.useMemo)(() => stats.rounds === 0 ? 0 : Math.round(stats.hits / stats.rounds * 100), [stats]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-4 rounded-lg bg-surface p-5 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-subtle",
					children: "Absolute drill"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-xs tabular-nums text-muted",
					children: [
						acc,
						"% · ",
						stats.streak,
						" streak · best ",
						stats.best
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-muted",
				children: "Hear a tone. Name the pitch class. No reference is given. That is the point."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					onClick: nextRound,
					"data-testid": "train-next",
					children: target == null ? "Hear a tone" : "Next tone"
				}), target != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					onClick: () => playTarget(target),
					children: "Repeat"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-4 gap-1.5 sm:grid-cols-6",
				children: NOTE_NAMES.map((name, pc) => {
					const show = revealed && target != null;
					const correct = show && pc === target;
					const wrong = show && pc === choice && pc !== target;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: target == null,
						onClick: () => guess(pc),
						className: cn("h-11 rounded-sm font-mono text-xs transition-colors duration-150 disabled:opacity-40", correct && "bg-in-tune text-accent-fg", wrong && "bg-danger/80 text-fg", !correct && !wrong && "bg-raised text-muted hover:text-fg"),
						children: name
					}, name);
				})
			}),
			revealed && targetName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-mono text-sm text-fg",
				children: [
					"It was ",
					targetName,
					choice === target ? "." : `. You said ${NOTE_NAMES[choice ?? 0]}.`
				]
			})
		]
	});
}
var MODES = [
	{
		id: "listen",
		label: "Listen"
	},
	{
		id: "tone",
		label: "Tone"
	},
	{
		id: "train",
		label: "Train"
	}
];
function AppShell() {
	const { opened, opening, open, mic, startMic, stopMic, mode, setMode, error } = useHearing();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-dvh overflow-x-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				className: "pointer-events-none absolute inset-0 opacity-[0.035]",
				style: { backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative z-10 flex items-center justify-between gap-4 px-4 py-4 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[0.625rem] uppercase tracking-[0.32em] text-subtle",
						children: "Christman · organ of corti"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-sans text-xl font-light tracking-[0.28em] text-fg",
						children: "CORTI"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "hidden items-center gap-1 sm:flex",
						"aria-label": "Mode",
						children: MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"data-testid": `mode-${m.id}`,
							onClick: () => setMode(m.id),
							className: cn("h-9 rounded-sm px-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] transition-colors duration-150", mode === m.id ? "bg-raised text-fg" : "text-subtle hover:text-fg"),
							children: m.label
						}, m.id))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSlot, {})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pb-28 sm:px-6 lg:pb-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center rounded-xl bg-surface p-3 shadow-[var(--shadow-border)] sm:p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CochleaCanvas, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 flex w-full flex-wrap items-center justify-center gap-2",
									children: !opened ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										onClick: () => void open(),
										disabled: opening,
										"data-testid": "open-cochlea",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "size-4" }), opening ? "Opening…" : "Open the cochlea"]
									}) : mic === "on" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: "outline",
										onClick: stopMic,
										"data-testid": "start-mic",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "size-4" }), "Close mic"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: "outline",
										onClick: () => void startMic(),
										disabled: mic === "pending",
										"data-testid": "start-mic",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-4" }), mic === "pending" ? "Requesting…" : "Listen"]
									})
								}),
								error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 max-w-md text-center text-sm text-danger",
									role: "alert",
									children: error
								}),
								mic === "denied" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 max-w-md text-center text-sm text-muted",
									children: "The microphone is closed. Tone and train still work. I will not invent a room."
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col gap-5",
							children: mode === "train" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainPanel, {}) : mode === "tone" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TonePanel, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Readout, {})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spectrogram, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Keyboard, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
						className: "border-t border-border pt-5 pb-2 text-xs leading-relaxed text-subtle",
						children: "Corti is the silicon cochlea of The Christman AI Project. Sister to OpenSmell. It feeds CHRISTMAN_EAR_CANAL. christman_dsp.c runs here — RMS, ZCR, YIN, LPC. It will not name a pitch it did not lock, and it will not wear a percentage it did not measure."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 gap-1 border-t border-border bg-bg/95 px-2 py-2 backdrop-blur-sm sm:hidden",
				style: { paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" },
				"aria-label": "Mode",
				children: MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setMode(m.id),
					className: cn("h-11 rounded-sm font-mono text-[0.6875rem] uppercase tracking-[0.14em]", mode === m.id ? "bg-raised text-fg" : "text-subtle"),
					children: m.label
				}, m.id))
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HearingProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {}) });
}
//#endregion
export { Home as component };
