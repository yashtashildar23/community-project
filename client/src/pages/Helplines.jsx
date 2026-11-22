import { useEffect, useMemo, useState } from 'react';
import { Search, Globe2, Languages, Clock3, RotateCw, SlidersHorizontal, X } from 'lucide-react';
import { helplines as bundledHelplines } from '../data';
import { fetchHelplines } from '../lib/api';
import HelplineCard from '../components/HelplineCard';

const REGIONS = ['All', 'India', 'Global', 'US', 'UK'];

export default function Helplines() {
  const [helplines, setHelplines] = useState(bundledHelplines);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');
  const [language, setLanguage] = useState('All');
  const [category, setCategory] = useState('All');
  const [only247, setOnly247] = useState(false);

  // Silent optional refresh — the bundled directory is usable immediately.
  useEffect(() => {
    let active = true;
    fetchHelplines().then((remote) => {
      if (active && remote?.length) setHelplines(remote);
    });
    return () => { active = false; };
  }, []);

  const languages = useMemo(
    () => ['All', ...new Set(helplines.flatMap((item) => item.languages))].sort((a, b) =>
      a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b)
    ),
    [helplines]
  );
  const categories = useMemo(
    () => ['All', ...new Set(helplines.flatMap((item) => item.categories))].sort((a, b) =>
      a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b)
    ),
    [helplines]
  );

  const results = useMemo(() => {
    const term = search.trim().toLowerCase();
    return helplines
      .filter((item) => {
        if (region !== 'All' && item.region !== region) return false;
        if (language !== 'All' && !item.languages.includes(language)) return false;
        if (category !== 'All' && !item.categories.includes(category)) return false;
        if (only247 && !item.is247) return false;
        if (!term) return true;
        return [item.name, item.number, item.description, ...item.categories, ...item.languages]
          .join(' ')
          .toLowerCase()
          .includes(term);
      })
      .sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name));
  }, [helplines, search, region, language, category, only247]);

  const clearFilters = () => {
    setSearch('');
    setRegion('All');
    setLanguage('All');
    setCategory('All');
    setOnly247(false);
  };

  const hasFilters = search || region !== 'All' || language !== 'All' || category !== 'All' || only247;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Helpline directory</h1>
        <p className="mt-1 text-muted">
          Verified crisis and support lines. Search works entirely on your device — even offline.
        </p>
      </div>

      <div className="card space-y-4">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, number, language, or need…"
            aria-label="Search helplines"
            className="w-full rounded-xl border border-border bg-surface py-3 pl-11 pr-4 text-base text-ink placeholder:text-muted"
          />
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by region">
          {REGIONS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRegion(item)}
              aria-pressed={region === item}
              className={`rounded-full px-3 py-1.5 text-sm font-bold transition ${
                region === item ? 'bg-accent text-white' : 'border border-border bg-surface text-muted hover:text-ink'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block">
            <span className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted">
              <Languages size={14} aria-hidden="true" /> Language
            </span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-base text-ink"
            >
              {languages.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted">
              <Globe2 size={14} aria-hidden="true" /> Focus area
            </span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-base text-ink"
            >
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>

          <div className="flex items-end gap-2">
            <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-semibold text-ink">
              <input
                type="checkbox"
                checked={only247}
                onChange={(event) => setOnly247(event.target.checked)}
                className="h-5 w-5 accent-[var(--accent)]"
              />
              <Clock3 size={16} className="text-accent" aria-hidden="true" /> 24/7 only
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border pt-3 text-sm">
          <span className="flex items-center gap-2 font-semibold text-muted">
            <SlidersHorizontal size={16} aria-hidden="true" />
            {results.length} {results.length === 1 ? 'service' : 'services'} found
          </span>
          {hasFilters && (
            <button type="button" onClick={clearFilters} className="flex items-center gap-1 font-bold text-accent hover:underline">
              <X size={15} aria-hidden="true" /> Clear filters
            </button>
          )}
        </div>
      </div>

      {results.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {results.map((item) => <HelplineCard key={item.id} helpline={item} />)}
        </div>
      ) : (
        <div className="card py-12 text-center">
          <RotateCw size={28} className="mx-auto text-muted" aria-hidden="true" />
          <p className="mt-3 font-bold text-ink">No matching services</p>
          <p className="mt-1 text-sm text-muted">Try removing a filter or searching a different word.</p>
          <button type="button" onClick={clearFilters} className="btn-secondary mx-auto mt-4">
            Reset search
          </button>
        </div>
      )}
    </div>
  );
}
