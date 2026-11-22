import { Info } from 'lucide-react';

export default function Disclaimer({ children, compact = false }) {
  return (
    <aside
      className={`flex gap-3 rounded-xl border border-border bg-surface text-sm leading-relaxed text-muted ${
        compact ? 'p-3' : 'p-4'
      }`}
    >
      <Info size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
      <p>
        {children || (
          <>
            <strong className="text-ink">This is not a medical diagnosis.</strong> These tools are
            for self-reflection only and do not replace professional care. If you are in crisis,
            please contact a helpline or emergency service.
          </>
        )}
      </p>
    </aside>
  );
}
