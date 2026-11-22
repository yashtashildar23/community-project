import { PhoneCall, Wind, ClipboardList, SmilePlus, BookOpen, ShieldCheck, ArrowRight, HeartHandshake } from 'lucide-react';
import { navigate } from '../lib/router';
import { helplines } from '../data';
import HelplineCard from '../components/HelplineCard';
import Disclaimer from '../components/Disclaimer';

const MODULES = [
  { path: '/helplines', label: 'Helplines', description: 'Verified crisis lines, searchable and offline.', icon: PhoneCall, color: 'bg-rose-100 text-rose-700' },
  { path: '/toolkit', label: 'Calm toolkit', description: 'Breathing and 5-4-3-2-1 grounding.', icon: Wind, color: 'bg-sky-100 text-sky-700' },
  { path: '/screeners', label: 'Self-check', description: 'Anonymous PHQ-9 & GAD-7 screeners.', icon: ClipboardList, color: 'bg-violet-100 text-violet-700' },
  { path: '/mood', label: 'Mood tracker', description: 'Private, on-device mood journal.', icon: SmilePlus, color: 'bg-amber-100 text-amber-700' },
  { path: '/library', label: 'Library', description: 'Short guides you can save for later.', icon: BookOpen, color: 'bg-emerald-100 text-emerald-700' },
];

export default function Home() {
  const featured = helplines.filter((item) => item.featured && item.number).slice(0, 3);

  return (
    <div className="space-y-8">
      <section className="hero relative overflow-hidden rounded-3xl bg-accent px-6 py-9 text-white shadow-soft sm:px-10 sm:py-12">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-black/25 px-3 py-1 text-sm font-bold">
            <HeartHandshake size={16} aria-hidden="true" /> Free · Private · No sign-up
          </p>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            Whatever you're feeling, you don't have to face it alone.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/90">
            MindLine puts crisis helplines, calming exercises, and gentle self-care tools in your
            pocket. Everything critical works offline, with no account and no tracking.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/helplines')}
              className="hero-primary inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-accent transition hover:bg-white/90"
            >
              Find a helpline <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/toolkit')}
              className="hero-secondary inline-flex items-center gap-2 rounded-xl border border-white/60 px-5 py-3 font-bold text-white transition hover:bg-white/10"
            >
              <Wind size={18} aria-hidden="true" /> Help me calm down
            </button>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 right-24 h-56 w-56 rounded-full bg-white/10" aria-hidden="true" />
      </section>

      <section aria-labelledby="modules-heading">
        <h2 id="modules-heading" className="section-title mb-4">What would help right now?</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map(({ path, label, description, icon: Icon, color }) => (
            <button
              key={path}
              type="button"
              onClick={() => navigate(path)}
              className="card flex items-start gap-4 text-left transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
                <Icon size={24} aria-hidden="true" />
              </span>
              <span>
                <span className="block font-bold text-ink">{label}</span>
                <span className="block text-sm text-muted">{description}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="featured-heading">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="featured-heading" className="section-title">Crisis lines to remember</h2>
          <button type="button" onClick={() => navigate('/helplines')} className="text-sm font-bold text-accent hover:underline">
            View all
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => <HelplineCard key={item.id} helpline={item} />)}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="card flex items-start gap-3">
          <ShieldCheck size={24} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
          <div>
            <h2 className="font-bold text-ink">Your privacy comes first</h2>
            <p className="mt-1 text-sm text-muted">
              No account, no personal details, no ads, no IP logging. Mood entries and bookmarks
              stay on this device only.
            </p>
          </div>
        </div>
        <Disclaimer />
      </section>
    </div>
  );
}
