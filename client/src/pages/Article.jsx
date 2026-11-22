import { useState } from 'react';
import { ArrowLeft, Bookmark, Clock3, BookOpen } from 'lucide-react';
import { articles } from '../data';
import { getBookmarks, toggleBookmark } from '../lib/storage';
import { navigate } from '../lib/router';
import Disclaimer from '../components/Disclaimer';

export default function Article({ id }) {
  const article = articles.find((item) => item.id === id);
  const [bookmarks, setBookmarks] = useState(getBookmarks);

  if (!article) {
    return (
      <div className="card py-16 text-center">
        <BookOpen size={32} className="mx-auto text-muted" aria-hidden="true" />
        <h1 className="mt-4 text-xl font-bold text-ink">Article not found</h1>
        <button type="button" onClick={() => navigate('/library')} className="btn-primary mx-auto mt-5">
          Back to library
        </button>
      </div>
    );
  }

  const saved = bookmarks.includes(article.id);

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <button
        type="button"
        onClick={() => navigate('/library')}
        className="flex items-center gap-2 text-sm font-bold text-accent hover:underline"
      >
        <ArrowLeft size={17} aria-hidden="true" /> Back to library
      </button>

      <header className="card">
        <div className="flex items-start justify-between gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${article.color}`}>{article.category}</span>
          <button
            type="button"
            onClick={() => setBookmarks(toggleBookmark(article.id))}
            aria-pressed={saved}
            className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-bold text-muted transition hover:text-accent"
          >
            <Bookmark size={17} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-ink">{article.title}</h1>
        <p className="mt-3 text-lg text-muted">{article.summary}</p>
        <p className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-muted">
          <Clock3 size={15} aria-hidden="true" /> {article.readTime}
        </p>
      </header>

      <div className="space-y-5">
        {article.content.map((section, index) => (
          <section key={index} className="card">
            <h2 className="text-xl font-bold text-ink">{section.heading}</h2>
            <p className="mt-2 text-ink">{section.text}</p>
            {section.list?.length > 0 && (
              <ul className="mt-3 space-y-2">
                {section.list.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex gap-2 text-muted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <Disclaimer />
    </article>
  );
}
