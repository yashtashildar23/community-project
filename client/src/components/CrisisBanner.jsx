import { ShieldAlert, Phone, ArrowRight } from 'lucide-react';
import { navigate } from '../lib/router';

/** High-priority escalation shown when a self-harm item is endorsed. */
export default function CrisisBanner({ urgent = false }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`rounded-2xl border-2 p-4 sm:p-5 ${
        urgent
          ? 'border-danger bg-danger-soft'
          : 'border-[var(--border)] bg-[var(--danger-soft)]'
      }`}
    >
      <div className="flex items-start gap-3">
        <ShieldAlert size={26} className="mt-0.5 shrink-0 text-danger" aria-hidden="true" />
        <div className="flex-1">
          <p className="text-base font-extrabold text-ink">
            {urgent ? 'Please reach out for help right now' : 'Support is available right now'}
          </p>
          <p className="mt-1 text-sm font-medium text-ink">
            You do not have to face this alone. Trained people are available to listen, free and
            confidential, 24/7.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href="tel:14416" className="btn-primary text-sm">
              <Phone size={17} aria-hidden="true" /> Call Tele MANAS 14416
            </a>
            <a href="tel:18005990019" className="btn-secondary text-sm">
              Call KIRAN 1800-599-0019
            </a>
            <button
              type="button"
              onClick={() => navigate('/helplines')}
              className="btn-secondary text-sm"
            >
              More crisis lines <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
