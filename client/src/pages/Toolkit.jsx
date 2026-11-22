import { useEffect, useMemo, useState } from 'react';
import { Play, Pause, RotateCcw, Wind, Check, Ear, Eye, Hand, Sparkles, Smile, Volume2, Vibrate } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const PATTERNS = {
  box: {
    name: 'Box breathing',
    subtitle: 'Used by athletes and first responders to steady the nervous system.',
    phases: [
      { label: 'Breathe in', duration: 4, scale: 1.08 },
      { label: 'Hold', duration: 4, scale: 1.08 },
      { label: 'Breathe out', duration: 4, scale: 0.72 },
      { label: 'Hold', duration: 4, scale: 0.72 },
    ],
  },
  '478': {
    name: '4-7-8 breathing',
    subtitle: 'A longer exhale that can help you settle when thoughts are racing.',
    phases: [
      { label: 'Breathe in', duration: 4, scale: 1.08 },
      { label: 'Hold', duration: 7, scale: 1.08 },
      { label: 'Breathe out', duration: 8, scale: 0.72 },
    ],
  },
};

const SENSES = [
  { key: 'see', count: 5, label: 'things you can see', icon: Eye, prompt: 'Look around slowly. What can you name?' },
  { key: 'touch', count: 4, label: 'things you can feel', icon: Hand, prompt: 'Notice fabric, temperature, the chair beneath you.' },
  { key: 'hear', count: 3, label: 'things you can hear', icon: Ear, prompt: 'Notice the furthest sound you can pick out.' },
  { key: 'smell', count: 2, label: 'things you can smell', icon: Sparkles, prompt: 'Even faint or neutral scents count.' },
  { key: 'taste', count: 1, label: 'thing you can taste', icon: Smile, prompt: 'Notice any lingering taste, or take a sip of water.' },
];

function playTone() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 520;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.3);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.32);
  } catch {
    /* audio unavailable */
  }
}

function BreathingTool() {
  const { settings, toggle } = useSettings();
  const [patternKey, setPatternKey] = useState('box');
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(PATTERNS.box.phases[0].duration);
  const [cycles, setCycles] = useState(0);
  const [haptics, setHaptics] = useState(true);

  const pattern = PATTERNS[patternKey];

  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => {
      setSecondsLeft((remaining) => {
        if (remaining > 1) return remaining - 1;
        setPhaseIndex((index) => {
          const next = (index + 1) % pattern.phases.length;
          if (next === 0) setCycles((count) => count + 1);
          return next;
        });
        return pattern.phases[(phaseIndex + 1) % pattern.phases.length].duration;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [running, pattern, phaseIndex]);

  useEffect(() => {
    if (!running || secondsLeft !== pattern.phases[phaseIndex].duration) return;
    if (settings.sound) playTone();
    if (haptics && navigator.vibrate) navigator.vibrate(35);
  }, [running, phaseIndex, secondsLeft, pattern, settings.sound, haptics]);

  const reset = (key = patternKey) => {
    setRunning(false);
    setPhaseIndex(0);
    setSecondsLeft(PATTERNS[key].phases[0].duration);
    setCycles(0);
  };

  const switchPattern = (key) => {
    setPatternKey(key);
    reset(key);
  };

  const phase = pattern.phases[phaseIndex];

  return (
    <section className="card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="section-title flex items-center gap-2">
            <Wind size={24} className="text-accent" aria-hidden="true" /> Guided breathing
          </h2>
          <p className="mt-1 max-w-xl text-sm text-muted">{pattern.subtitle}</p>
        </div>
        <div className="flex gap-1 rounded-xl border border-border bg-surface p-1" role="group" aria-label="Breathing pattern">
          {Object.entries(PATTERNS).map(([key, value]) => (
            <button
              key={key}
              type="button"
              onClick={() => switchPattern(key)}
              aria-pressed={patternKey === key}
              className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
                patternKey === key ? 'bg-accent text-white' : 'text-muted hover:text-ink'
              }`}
            >
              {value.name}
            </button>
          ))}
        </div>
      </div>

      <div className="my-8 flex flex-col items-center">
        <div className="relative flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-border" aria-hidden="true" />
          <div
            className="flex h-40 w-40 items-center justify-center rounded-full bg-accent-soft text-center transition-transform ease-in-out sm:h-48 sm:w-48"
            style={{
              transform: `scale(${running ? phase.scale : 0.85})`,
              transitionDuration: settings.reducedMotion ? '0ms' : `${phase.duration}s`,
            }}
          >
            <div>
              <p className="text-lg font-extrabold text-accent">{running ? phase.label : 'Ready?'}</p>
              <p className="text-4xl font-extrabold text-ink" aria-live="off">
                {running ? secondsLeft : '—'}
              </p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted" aria-live="polite">
          {running
            ? `Phase ${phaseIndex + 1} of ${pattern.phases.length} · ${cycles} completed ${cycles === 1 ? 'cycle' : 'cycles'}`
            : 'Sit comfortably, relax your shoulders, and press start.'}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={() => setRunning((value) => !value)} className="btn-primary min-w-[130px]">
          {running ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
          {running ? 'Pause' : 'Start breathing'}
        </button>
        <button type="button" onClick={() => reset()} className="btn-secondary">
          <RotateCcw size={17} aria-hidden="true" /> Reset
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-5 border-t border-border pt-4 text-sm text-muted">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.sound}
            onChange={() => toggle('sound')}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          <Volume2 size={16} aria-hidden="true" /> Sound feedback
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={haptics}
            onChange={(event) => setHaptics(event.target.checked)}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          <Vibrate size={16} aria-hidden="true" /> Gentle vibration
        </label>
      </div>
    </section>
  );
}

function GroundingTool() {
  const [checked, setChecked] = useState({});
  const total = SENSES.reduce((sum, sense) => sum + sense.count, 0);
  const done = Object.values(checked).filter(Boolean).length;

  return (
    <section className="card">
      <h2 className="section-title">5-4-3-2-1 sensory grounding</h2>
      <p className="mt-1 text-sm text-muted">
        A simple way to bring your attention back to the present when everything feels overwhelming.
      </p>

      <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-surface" aria-hidden="true">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${(done / total) * 100}%` }}
        />
      </div>
      <p className="mt-2 text-sm font-semibold text-muted" aria-live="polite">
        {done} of {total} noticed
      </p>

      <ol className="mt-5 space-y-5">
        {SENSES.map((sense, senseIndex) => {
          const Icon = sense.icon;
          return (
            <li key={sense.key} className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-bold text-ink">
                    {sense.count} {sense.label}
                  </p>
                  <p className="text-sm text-muted">{sense.prompt}</p>
                </div>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: sense.count }, (_, index) => {
                  const key = `${sense.key}-${index}`;
                  return (
                    <label
                      key={key}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                        checked[key]
                          ? 'border-accent bg-accent-soft text-ink'
                          : 'border-border bg-surface-alt text-muted hover:text-ink'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(checked[key])}
                        onChange={(event) => setChecked((current) => ({ ...current, [key]: event.target.checked }))}
                        className="h-4 w-4 accent-[var(--accent)]"
                      />
                      <span className="flex-1">
                        {senseIndex + 1}.{index + 1} {checked[key] && <Check size={14} className="inline" aria-hidden="true" />}
                      </span>
                    </label>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ol>

      {done === total && (
        <div className="mt-5 rounded-xl bg-accent-soft p-4 text-center font-bold text-accent" role="status">
          Well done. Take one slow breath and notice how you feel now.
        </div>
      )}
      <button
        type="button"
        onClick={() => setChecked({})}
        className="mt-4 text-sm font-bold text-muted hover:text-ink hover:underline"
      >
        Start over
      </button>
    </section>
  );
}

export default function Toolkit() {
  const patterns = useMemo(() => Object.keys(PATTERNS), []);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Calming toolkit</h1>
        <p className="mt-1 text-muted">
          Simple, evidence-informed exercises you can do anywhere. {patterns.length} breathing patterns and one grounding exercise.
        </p>
      </div>
      <BreathingTool />
      <GroundingTool />
    </div>
  );
}
