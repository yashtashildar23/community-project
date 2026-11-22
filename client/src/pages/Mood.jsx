import { useState } from 'react';
import { LockKeyhole, Trash2, CalendarDays, Sparkles } from 'lucide-react';
import { addMood, deleteMood, getMoods } from '../lib/storage';
import MoodChart from '../components/MoodChart';

const MOODS = [
  { score: 5, emoji: '😄', label: 'Great', color: 'bg-emerald-100 text-emerald-800' },
  { score: 4, emoji: '🙂', label: 'Good', color: 'bg-lime-100 text-lime-800' },
  { score: 3, emoji: '😐', label: 'Okay', color: 'bg-amber-100 text-amber-800' },
  { score: 2, emoji: '😔', label: 'Low', color: 'bg-orange-100 text-orange-800' },
  { score: 1, emoji: '😢', label: 'Distressed', color: 'bg-rose-100 text-rose-800' },
];

const ACTIVITIES = ['Sleep', 'Exercise', 'Work', 'Study', 'Family', 'Social', 'Self-care', 'None'];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function Mood() {
  const [moods, setMoods] = useState(getMoods);
  const [score, setScore] = useState(0);
  const [activities, setActivities] = useState([]);
  const [note, setNote] = useState('');
  const [days, setDays] = useState(14);
  const [saved, setSaved] = useState(false);

  const save = (event) => {
    event.preventDefault();
    if (!score) return;
    setMoods(
      addMood({
        date: todayKey(),
        timestamp: new Date().toISOString(),
        score,
        activities,
        note: note.trim(),
      })
    );
    setScore(0);
    setActivities([]);
    setNote('');
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  };

  const toggleActivity = (activity) => {
    setActivities((current) =>
      current.includes(activity) ? current.filter((item) => item !== activity) : [...current, activity]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Mood & journal</h1>
        <p className="mt-1 text-muted">A private space to notice patterns. Everything stays on this device.</p>
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-accent-soft px-4 py-3 text-sm font-semibold text-accent">
        <LockKeyhole size={18} className="shrink-0" aria-hidden="true" />
        No account. No server. Your entries never leave this device.
      </div>

      <form onSubmit={save} className="card space-y-5">
        <fieldset>
          <legend className="mb-3 font-bold text-ink">How are you feeling today?</legend>
          <div className="grid grid-cols-5 gap-2">
            {MOODS.map((mood) => (
              <button
                key={mood.score}
                type="button"
                onClick={() => setScore(mood.score)}
                aria-pressed={score === mood.score}
                className={`flex flex-col items-center gap-1 rounded-xl border-2 p-2 transition sm:p-3 ${
                  score === mood.score ? 'border-accent bg-accent-soft' : 'border-transparent hover:border-border'
                }`}
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-full text-xl sm:h-12 sm:w-12 ${mood.color}`} aria-hidden="true">
                  {mood.emoji}
                </span>
                <span className="text-[11px] font-bold text-ink sm:text-xs">{mood.label}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-bold text-ink">What's been going on? <span className="font-normal text-muted">(optional)</span></legend>
          <div className="flex flex-wrap gap-2">
            {ACTIVITIES.map((activity) => (
              <button
                key={activity}
                type="button"
                onClick={() => toggleActivity(activity)}
                aria-pressed={activities.includes(activity)}
                className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                  activities.includes(activity)
                    ? 'border-accent bg-accent text-white'
                    : 'border-border bg-surface text-muted hover:text-ink'
                }`}
              >
                {activity}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="mb-1 block text-sm font-bold text-ink">Anything on your mind? <span className="font-normal text-muted">(optional)</span></span>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="A few words is enough…"
            className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-base text-ink placeholder:text-muted"
          />
        </label>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={!score} className="btn-primary disabled:cursor-not-allowed disabled:opacity-40">
            <Sparkles size={17} aria-hidden="true" /> Save check-in
          </button>
          {saved && <span className="text-sm font-bold text-accent" role="status">Saved on this device ✓</span>}
        </div>
      </form>

      <section className="card">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="section-title flex items-center gap-2">
            <CalendarDays size={22} className="text-accent" aria-hidden="true" /> Your trend
          </h2>
          <div className="flex gap-1 rounded-xl border border-border bg-surface p-1" role="group" aria-label="Chart range">
            {[7, 14, 30].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setDays(value)}
                aria-pressed={days === value}
                className={`rounded-lg px-3 py-1.5 text-sm font-bold transition ${
                  days === value ? 'bg-accent text-white' : 'text-muted hover:text-ink'
                }`}
              >
                {value}d
              </button>
            ))}
          </div>
        </div>
        <MoodChart moods={moods} days={days} />
      </section>

      <section className="card">
        <h2 className="section-title mb-3">Recent entries</h2>
        {moods.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-surface p-6 text-center text-sm text-muted">
            Your first check-in will appear here.
          </p>
        ) : (
          <ul className="space-y-2">
            {moods.slice(0, 20).map((entry) => {
              const mood = MOODS.find((item) => item.score === entry.score) || MOODS[2];
              return (
                <li key={entry.id} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-3">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg ${mood.color}`} aria-hidden="true">
                    {mood.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-ink">
                      {mood.label} <span className="font-normal text-muted">· {new Date(entry.date + 'T00:00:00').toLocaleDateString()}</span>
                    </p>
                    {entry.activities?.length > 0 && (
                      <p className="text-xs text-muted">{entry.activities.join(' · ')}</p>
                    )}
                    {entry.note && <p className="mt-1 break-words text-sm text-muted">“{entry.note}”</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => setMoods(deleteMood(entry.id))}
                    aria-label={`Delete entry from ${entry.date}`}
                    className="rounded-lg p-2 text-muted transition hover:bg-danger-soft hover:text-danger"
                  >
                    <Trash2 size={17} aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
