import { useState } from 'react';
import {
  House,
  PhoneCall,
  Wind,
  ClipboardList,
  SmilePlus,
  BookOpen,
  Settings2,
  WifiOff,
  HeartPulse,
} from 'lucide-react';
import { navigate } from '../lib/router';
import PanicButton from './PanicButton';
import SettingsPanel from './SettingsPanel';

const NAV = [
  { path: '/', label: 'Home', icon: House },
  { path: '/helplines', label: 'Helplines', icon: PhoneCall },
  { path: '/toolkit', label: 'Toolkit', icon: Wind },
  { path: '/screeners', label: 'Check', icon: ClipboardList },
  { path: '/mood', label: 'Mood', icon: SmilePlus },
  { path: '/library', label: 'Library', icon: BookOpen },
];

function Brand() {
  return (
    <button
      type="button"
      onClick={() => navigate('/')}
      className="flex items-center gap-2 text-left"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white">
        <HeartPulse size={23} aria-hidden="true" />
      </span>
      <span>
        <span className="block text-lg font-extrabold leading-none tracking-tight text-ink">
          MindLine
        </span>
        <span className="block text-[11px] font-semibold leading-tight text-muted">
          support, always here
        </span>
      </span>
    </button>
  );
}

export default function Layout({ path, children }) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface pb-28 sm:pb-24">
      <a href="#main" className="sr-only-focusable fixed left-4 top-4 z-50 rounded-lg bg-accent px-4 py-2 text-white">
        Skip to main content
      </a>

      <header className="sticky top-0 z-30 border-b border-border bg-surface backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Brand />
          <div className="flex items-center gap-2">
            <span className="chip hidden sm:inline-flex" title="Works fully offline">
              <WifiOff size={14} aria-hidden="true" /> Offline ready
            </span>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              aria-label="Open accessibility settings"
              className="rounded-xl border border-border bg-surface-alt p-2.5 text-ink transition hover:bg-accent-soft"
            >
              <Settings2 size={21} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        {children}
      </main>

      <nav
        aria-label="Main navigation"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface-alt backdrop-blur"
      >
        <ul className="mx-auto flex max-w-5xl items-stretch justify-around px-1 pb-[env(safe-area-inset-bottom)]">
          {NAV.map(({ path: itemPath, label, icon: Icon }) => {
            const active = itemPath === '/' ? path === '/' : path.startsWith(itemPath);
            return (
              <li key={itemPath} className="flex-1">
                <button
                  type="button"
                  onClick={() => navigate(itemPath)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex w-full flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold transition ${
                    active ? 'text-accent' : 'text-muted hover:text-ink'
                  }`}
                >
                  <Icon size={21} strokeWidth={active ? 2.5 : 2} aria-hidden="true" />
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <PanicButton />
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
