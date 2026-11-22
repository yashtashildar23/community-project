import { useMemo, useState } from 'react';
import { ClipboardList, ArrowLeft, ArrowRight, RotateCcw, ShieldCheck, Info } from 'lucide-react';
import { screeners, screenerList, screenerOptions } from '../data';
import { navigate } from '../lib/router';
import CrisisBanner from '../components/CrisisBanner';
import Disclaimer from '../components/Disclaimer';

const TONE_STYLES = {
  green: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  yellow: 'bg-amber-100 text-amber-900 border-amber-300',
  orange: 'bg-orange-100 text-orange-900 border-orange-300',
  red: 'bg-red-100 text-red-900 border-red-300',
};

export default function Screeners() {
  const [activeId, setActiveId] = useState('phq9');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [complete, setComplete] = useState(false);

  const screener = screenerList.find((item) => item.id === activeId);
  const question = screener.questions[index];
  const progress = Math.round((answers.filter((value) => value !== undefined).length / screener.questions.length) * 100);

  const result = useMemo(() => {
    if (!complete) return null;
    const score = answers.reduce((sum, value) => sum + (value || 0), 0);
    const severity = screener.severity.find((band) => score >= band.min && score <= band.max);
    const riskAnswer = screener.riskQuestionIndex === null ? 0 : answers[screener.riskQuestionIndex];
    return { score, severity, riskAnswer };
  }, [complete, answers, screener]);

  const select = (value) => {
    const next = [...answers];
    next[index] = value;
    setAnswers(next);
  };

  const next = () => {
    if (index === screener.questions.length - 1) {
      setComplete(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIndex((current) => current + 1);
    }
  };

  const back = () => {
    if (index === 0) return;
    setIndex((current) => current - 1);
  };

  const reset = (id = activeId) => {
    setActiveId(id);
    setIndex(0);
    setAnswers([]);
    setComplete(false);
  };

  const answered = answers[index] !== undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Private self-check</h1>
        <p className="mt-1 text-muted">
          Answer a few questions to better understand how you've been feeling. Nothing is saved or sent anywhere.
        </p>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a screener">
        {screenerList.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => reset(item.id)}
            aria-pressed={activeId === item.id}
            className={`rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
              activeId === item.id
                ? 'border-accent bg-accent text-white'
                : 'border-border bg-surface-alt text-muted hover:text-ink'
            }`}
          >
            {item.name} <span className="font-normal">· {item.description.split(' ').slice(0, 4).join(' ')}…</span>
          </button>
        ))}
      </div>

      <Disclaimer compact />

      {!complete ? (
        <section className="card" aria-labelledby="question-heading">
          <div className="mb-5">
            <div className="flex items-center justify-between text-sm font-bold text-muted">
              <span className="flex items-center gap-2">
                <ClipboardList size={17} className="text-accent" aria-hidden="true" />
                {screener.fullName}
              </span>
              <span>{index + 1} / {screener.questions.length}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface" aria-hidden="true">
              <div className="h-full rounded-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <p className="mb-2 text-sm font-semibold text-muted">{screeners.instrumentNote}</p>
          <h2 id="question-heading" className="text-lg font-bold leading-snug text-ink sm:text-xl">
            {question}
          </h2>

          <fieldset className="mt-5 space-y-2">
            <legend className="sr-only">Choose how often this has applied to you</legend>
            {screenerOptions.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                  answers[index] === option.value
                    ? 'border-accent bg-accent-soft text-ink'
                    : 'border-border bg-surface text-muted hover:border-accent hover:text-ink'
                }`}
              >
                <input
                  type="radio"
                  name={`q-${index}`}
                  value={option.value}
                  checked={answers[index] === option.value}
                  onChange={() => select(option.value)}
                  className="h-5 w-5 accent-[var(--accent)]"
                />
                <span className="font-semibold">{option.label}</span>
              </label>
            ))}
          </fieldset>

          <div className="mt-6 flex items-center justify-between gap-3">
            <button type="button" onClick={back} disabled={index === 0} className="btn-secondary disabled:cursor-not-allowed disabled:opacity-40">
              <ArrowLeft size={18} aria-hidden="true" /> Back
            </button>
            <button type="button" onClick={next} disabled={!answered} className="btn-primary disabled:cursor-not-allowed disabled:opacity-40">
              {index === screener.questions.length - 1 ? 'See my result' : 'Next'}
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </section>
      ) : (
        <section className="space-y-5" aria-live="polite">
          {result.riskAnswer >= 1 && <CrisisBanner urgent={result.riskAnswer === 3} />}

          <div className="card text-center">
            <p className="text-sm font-bold uppercase tracking-wide text-muted">Your {screener.name} result</p>
            <p className="mt-2 text-5xl font-extrabold text-ink">
              {result.score}<span className="text-2xl font-bold text-muted"> / {screener.maxScore}</span>
            </p>
            <p className={`mx-auto mt-4 inline-block rounded-full border-2 px-5 py-1.5 text-lg font-extrabold ${TONE_STYLES[result.severity.tone]}`}>
              {result.severity.label}
            </p>
            <p className="mx-auto mt-4 max-w-xl text-muted">{result.severity.message}</p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => reset()} className="btn-secondary">
                <RotateCcw size={17} aria-hidden="true" /> Retake
              </button>
              <button
                type="button"
                onClick={() => navigate('/helplines')}
                className="btn-primary"
              >
                Find support near me
              </button>
            </div>
          </div>

          <div className="card flex items-start gap-3">
            <ShieldCheck size={22} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
            <p className="text-sm text-muted">
              Your answers were held in memory only for this session and were never stored or
              transmitted. A screener cannot diagnose a condition — only a qualified professional can.
            </p>
          </div>
          <Disclaimer />
        </section>
      )}

      <p className="flex items-center justify-center gap-2 text-xs text-muted">
        <Info size={14} aria-hidden="true" /> Based on the standard PHQ-9 and GAD-7 instruments.
      </p>
    </div>
  );
}
