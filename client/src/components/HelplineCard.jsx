import { useState } from 'react';
import {
  Phone,
  MessageSquare,
  MessageCircle,
  Globe2,
  Clock3,
  Languages,
  BadgeCheck,
  ChevronDown,
  Star,
} from 'lucide-react';

const WEBSITES = {
  befrienders: 'https://www.befrienders.org/',
  iasp: 'https://www.iasp.info/resources/Crisis_Centres/',
  'samaritans-uk': 'https://www.samaritans.org/',
  'childline-uk': 'https://www.childline.org.uk/',
  'calm-uk': 'https://thecalmzone.net/',
  'trevor-project': 'https://www.thetrevorproject.org/',
  'veterans-crisis': 'https://www.veteranscrisisline.net/',
};

function ActionLink({ href, icon: Icon, label, primary = false, external = false }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={primary ? 'btn-primary px-3 py-2 text-sm' : 'btn-secondary px-3 py-2 text-sm'}
    >
      <Icon size={17} aria-hidden="true" /> {label}
    </a>
  );
}

export default function HelplineCard({ helpline }) {
  const [expanded, setExpanded] = useState(false);
  const digits = helpline.number.replace(/[^\d+]/g, '');
  const website = WEBSITES[helpline.id];

  return (
    <article className="card flex flex-col gap-3 transition hover:shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold leading-tight text-ink">{helpline.name}</h3>
            {helpline.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-bold text-accent">
                <Star size={11} fill="currentColor" aria-hidden="true" /> Featured
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-muted">
            {helpline.region}
          </p>
        </div>
        {helpline.verified && (
          <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-accent">
            <BadgeCheck size={17} aria-hidden="true" /> Verified
          </span>
        )}
      </div>

      {helpline.number ? (
        <a
          href={`tel:${digits}`}
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-accent hover:underline"
          aria-label={`Call ${helpline.name} at ${helpline.number}`}
        >
          <Phone size={22} aria-hidden="true" /> {helpline.number}
        </a>
      ) : (
        <span className="text-lg font-bold text-ink">Find local support online</span>
      )}

      <div className="flex flex-wrap gap-1.5">
        {helpline.categories.map((category) => (
          <span key={category} className="chip text-xs">
            {category}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className="flex items-center gap-1 self-start text-sm font-bold text-accent hover:underline"
      >
        {expanded ? 'Show less' : 'Details & hours'}
        <ChevronDown
          size={16}
          className={`transition ${expanded ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {expanded && (
        <div className="space-y-3 border-t border-border pt-3 text-sm text-muted">
          <p>{helpline.description}</p>
          <p className="flex items-center gap-2">
            <Clock3 size={16} className="shrink-0 text-accent" aria-hidden="true" />
            {helpline.hours}
          </p>
          <p className="flex items-start gap-2">
            <Languages size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
            {helpline.languages.join(', ')}
          </p>
          {helpline.altNumber && (
            <p>
              <span className="font-semibold text-ink">Alternate: </span>
              <a href={`tel:${helpline.altNumber.replace(/[^\d+]/g, '')}`} className="text-accent hover:underline">
                {helpline.altNumber}
              </a>
            </p>
          )}
        </div>
      )}

      <div className="mt-auto flex flex-wrap gap-2 pt-1">
        {helpline.number && (
          <ActionLink href={`tel:${digits}`} icon={Phone} label="Call now" primary />
        )}
        {helpline.type.includes('SMS') && (
          <ActionLink href={`sms:${digits}?body=Hello,%20I%20need%20support.`} icon={MessageSquare} label="Text" />
        )}
        {(helpline.whatsapp || helpline.type.includes('WhatsApp')) && (
          <ActionLink
            href={`https://wa.me/${(helpline.whatsapp || digits).replace(/\D/g, '')}`}
            icon={MessageCircle}
            label="WhatsApp"
            external
          />
        )}
        {website && (
          <ActionLink href={website} icon={Globe2} label="Website" external />
        )}
      </div>
    </article>
  );
}
