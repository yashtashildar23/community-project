import { useEffect, useMemo, useState } from 'react';
import { Bookmark, BookOpen, Clock3, ArrowUpRight } from 'lucide-react';
import { articles as bundledArticles } from '../data';
import { fetchArticles } from '../lib/api';
import { getBookmarks, toggleBookmark } from '../lib/storage';
import { navigate } from '../lib/router';

export default function Library() {
  const [articles, setArticles] = useState(bundledArticles);
  const [bookmarks, setBookmarks] = useState(getBookmarks);
  const [category, setCategory] = useState('All');
  const [savedOnly, setSavedOnly] = useState(false);

  useEffect(() => {
    let active = true;
    fetchArticles().then((remote) => {
      if (active && remote?.length) setArticles(remote);
    });
    return () => { active = false; };
  }, []);

  const categories = useMemo(
    () => ['All', ...new Set(articles.map((item) => item.category))],
    [articles]
  );

  const visible = articles.filter((item) =>
    (category === 'All' || item.category === category) &&
    (!savedOnly || bookmarks.includes(item.id))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Awareness library</h1>
        <p className="mt-1 text-muted">Short, practical guides. Bookmark any article to read it offline later.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            aria-pressed={category === item}
            className={`rounded-full px-3 py-1.5 text-sm font-bold transition ${
              category === item ? 'bg-accent text-white' : 'border border-border bg-surface-alt text-muted hover:text-ink'
            }`}
          >
            {item}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setSavedOnly((value) => !value)}
          aria-pressed={savedOnly}
          className={`ml-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition ${
            savedOnly ? 'bg-accent text-white' : 'border border-border bg-surface-alt text-muted hover:text-ink'
          }`}
        >
          <Bookmark size={15} fill={savedOnly ? 'currentColor' : 'none'} aria-hidden="true" /> Saved
        </button>
      </div>

      {visible.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {visible.map((article) => (
            <article key={article.id} className="card flex flex-col transition hover:shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${article.color}`}>{article.category}</span>
                <button
                  type="button"
                  onClick={() => setBookmarks(toggleBookmark(article.id))}
                  aria-label={bookmarks.includes(article.id) ? `Remove bookmark from ${article.title}` : `Bookmark ${article.title}`}
                  aria-pressed={bookmarks.includes(article.id)}
                  className="rounded-full p-2 text-muted transition hover:bg-accent-soft hover:text-accent"
                >
                  <Bookmark size={19} fill={bookmarks.includes(article.id) ? 'currentColor' : 'none'} aria-hidden="true" />
                </button>
              </div>
              <h2 className="mt-3 text-lg font-bold leading-snug text-ink">{article.title}</h2>
              <p className="mt-2 flex-1 text-sm text-muted">{article.summary}</p>
              <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-muted">
                  <Clock3 size={14} aria-hidden="true" /> {article.readTime}
                </span>
                <button
                  type="button"
                  onClick={() => navigate(`/library/${article.id}`)}
                  className="flex items-center gap-1 text-sm font-bold text-accent hover:underline"
                >
                  Read article <ArrowUpRight size={16} aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="card py-12 text-center">
          <BookOpen size={28} className="mx-auto text-muted" aria-hidden="true" />
          <p className="mt-3 font-bold text-ink">Nothing here yet</p>
          <p className="mt-1 text-sm text-muted">Try a different category or turn off the saved-only filter.</p>
        </div>
      )}
    </div>
  );
}
