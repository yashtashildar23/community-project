import { useState } from 'react';
import { Phone, LifeBuoy, Wind, ShieldAlert, X } from 'lucide-react';
import Modal from './Modal';
import { helplines } from '../data';
import { navigate } from '../lib/router';

export default function PanicButton() {
  const [open, setOpen] = useState(false);
  const urgent = helplines.filter((item) => item.featured && item.number);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Need help now? Open immediate help options"
        className="panic-btn fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full bg-danger px-5 py-3.5 text-base font-bold text-white shadow-lg ring-4 ring-white/40 transition hover:brightness-110 active:scale-95 sm:bottom-6 sm:right-6"
      >
        <LifeBuoy size={22} aria-hidden="true" />
        <span>Need help now?</span>
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="You are not alone. Help is one tap away."
        tone="danger"
      >
        <div className="rounded-xl bg-danger-soft p-4 text-danger" role="alert">
          <p className="flex items-center gap-2 font-bold">
            <ShieldAlert size={20} aria-hidden="true" /> If you are in immediate physical danger
          </p>
          <p className="mt-1 text-sm font-medium">
            Call your local emergency number (112 in India, 911 in the US) now.
          </p>
        </div>

        <p className="mt-5 mb-2 text-sm font-bold uppercase tracking-wide text-muted">
          24/7 crisis lines
        </p>
        <div className="space-y-2">
          {urgent.map((item) => (
            <a
              key={item.id}
              href={`tel:${item.number.replace(/\s/g, '')}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4 transition hover:border-accent"
            >
              <span>
                <span className="block font-bold text-ink">{item.name}</span>
                <span className="text-sm text-muted">{item.hours}</span>
              </span>
              <span className="flex items-center gap-2 font-bold text-accent">
                {item.number}
                <Phone size={18} aria-hidden="true" />
              </span>
            </a>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            className="btn-secondary w-full"
            onClick={() => {
              setOpen(false);
              navigate('/toolkit');
            }}
          >
            <Wind size={18} aria-hidden="true" /> Grounding tools
          </button>
          <button
            type="button"
            className="btn-secondary w-full"
            onClick={() => {
              setOpen(false);
              navigate('/helplines');
            }}
          >
            <LifeBuoy size={18} aria-hidden="true" /> All helplines
          </button>
        </div>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-4 w-full py-2 text-sm font-semibold text-muted hover:text-ink"
        >
          <X size={16} className="mr-1 inline" aria-hidden="true" /> Close
        </button>
      </Modal>
    </>
  );
}
