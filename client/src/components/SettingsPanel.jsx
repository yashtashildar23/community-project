import { Type, Contrast, Waves, Volume2, VolumeX } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import Modal from './Modal';

function ToggleRow({ icon: Icon, label, description, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-border bg-surface p-4">
      <span className="flex items-start gap-3">
        <Icon className="mt-0.5 shrink-0 text-accent" size={20} aria-hidden="true" />
        <span>
          <span className="block font-bold text-ink">{label}</span>
          <span className="block text-sm text-muted">{description}</span>
        </span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-1 h-6 w-6 shrink-0 accent-[var(--accent)]"
      />
    </label>
  );
}

export default function SettingsPanel({ open, onClose }) {
  const { settings, toggle } = useSettings();

  return (
    <Modal open={open} onClose={onClose} title="Accessibility & preferences">
      <div className="space-y-3">
        <ToggleRow
          icon={Contrast}
          label="High contrast"
          description="Strong colour contrast for low vision."
          checked={settings.highContrast}
          onChange={() => toggle('highContrast')}
        />
        <ToggleRow
          icon={Type}
          label="Larger text"
          description="Increase text size across the app."
          checked={settings.largeText}
          onChange={() => toggle('largeText')}
        />
        <ToggleRow
          icon={Waves}
          label="Reduce motion"
          description="Pause breathing and other animations."
          checked={settings.reducedMotion}
          onChange={() => toggle('reducedMotion')}
        />
        <ToggleRow
          icon={settings.sound ? Volume2 : VolumeX}
          label="Sound feedback"
          description="Play a soft tone when a breathing phase changes."
          checked={settings.sound}
          onChange={() => toggle('sound')}
        />
      </div>
      <p className="mt-5 text-sm text-muted">
        Preferences are stored only on this device. No account or personal data is required.
      </p>
    </Modal>
  );
}
