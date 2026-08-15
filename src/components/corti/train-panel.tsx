import { useEffect, useMemo, useState } from "react";
import { NOTE_NAMES } from "@/lib/audio/notes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useHearing } from "./hearing-context";

const STATS_KEY = "corti-train-stats";

type Stats = { rounds: number; hits: number; streak: number; best: number };

function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return { rounds: 0, hits: 0, streak: 0, best: 0 };
    const parsed = JSON.parse(raw) as Stats;
    return {
      rounds: Number(parsed.rounds) || 0,
      hits: Number(parsed.hits) || 0,
      streak: Number(parsed.streak) || 0,
      best: Number(parsed.best) || 0,
    };
  } catch {
    return { rounds: 0, hits: 0, streak: 0, best: 0 };
  }
}

function saveStats(s: Stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(s));
}

export function TrainPanel() {
  const { opened, open, playMidi, setBlind } = useHearing();
  const [target, setTarget] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [choice, setChoice] = useState<number | null>(null);
  const [stats, setStats] = useState<Stats>(() =>
    typeof window === "undefined" ? { rounds: 0, hits: 0, streak: 0, best: 0 } : loadStats(),
  );

  const targetName = target == null ? null : NOTE_NAMES[target];

  useEffect(() => {
    setBlind(target != null && !revealed);
    return () => setBlind(false);
  }, [target, revealed, setBlind]);

  const playTarget = (pc: number) => {
    const octave = 4 + Math.floor(Math.random() * 2);
    const midi = (octave + 1) * 12 + pc;
    playMidi(midi, { duration: 0.85 });
  };

  const nextRound = () => {
    const pc = Math.floor(Math.random() * 12);
    setTarget(pc);
    setRevealed(false);
    setChoice(null);
    if (!opened) {
      void open().then(() => playTarget(pc));
    } else {
      playTarget(pc);
    }
  };

  const guess = (pc: number) => {
    if (target == null || revealed) return;
    setChoice(pc);
    setRevealed(true);
    const hit = pc === target;
    setStats((prev) => {
      const next: Stats = {
        rounds: prev.rounds + 1,
        hits: prev.hits + (hit ? 1 : 0),
        streak: hit ? prev.streak + 1 : 0,
        best: hit ? Math.max(prev.best, prev.streak + 1) : prev.best,
      };
      saveStats(next);
      return next;
    });
    playTarget(target);
  };

  const acc = useMemo(
    () => (stats.rounds === 0 ? 0 : Math.round((stats.hits / stats.rounds) * 100)),
    [stats],
  );

  return (
    <section className="flex flex-col gap-4 rounded-lg bg-surface p-5 shadow-[var(--shadow-border)]">
      <header className="flex items-center justify-between gap-3">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-subtle">
          Absolute drill
        </p>
        <p className="font-mono text-xs tabular-nums text-muted">
          {acc}% · {stats.streak} streak · best {stats.best}
        </p>
      </header>

      <p className="text-sm leading-relaxed text-muted">
        Hear a tone. Name the pitch class. The spiral and spectrogram stay
        blind until you guess. No reference is given. That is the point.
      </p>

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={nextRound} data-testid="train-next">
          {target == null ? "Hear a tone" : "Next tone"}
        </Button>
        {target != null && (
          <Button type="button" variant="outline" onClick={() => playTarget(target)}>
            Repeat
          </Button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6">
        {NOTE_NAMES.map((name, pc) => {
          const show = revealed && target != null;
          const correct = show && pc === target;
          const wrong = show && pc === choice && pc !== target;
          return (
            <button
              key={name}
              type="button"
              data-testid={`train-pc-${pc}`}
              disabled={target == null}
              onClick={() => guess(pc)}
              className={cn(
                "h-11 rounded-sm font-mono text-xs transition-colors duration-150 disabled:opacity-40",
                correct && "bg-in-tune text-accent-fg",
                wrong && "bg-danger/80 text-fg",
                !correct && !wrong && "bg-raised text-muted hover:text-fg",
              )}
            >
              {name}
            </button>
          );
        })}
      </div>

      {revealed && targetName && (
        <p className="font-mono text-sm text-fg" data-testid="train-reveal">
          It was {targetName}
          {choice === target ? "." : `. You said ${NOTE_NAMES[choice ?? 0]}.`}
        </p>
      )}
    </section>
  );
}
