/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: 'var(--surface)',
        'surface-alt': 'var(--surface-alt)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        'accent-soft': 'var(--accent-soft)',
        border: 'var(--border)',
        danger: 'var(--danger)',
        'danger-soft': 'var(--danger-soft)',
      },
      fontFamily: {
        sans: ['Nunito', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(15, 118, 110, 0.22)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
    },
  },
  plugins: [],
};
