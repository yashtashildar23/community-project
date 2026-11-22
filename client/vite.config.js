import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // The shared dataset lives one level above the client root (single source of truth).
  server: {
    fs: { allow: ['..'] },
    host: true,
  },
  build: { outDir: 'dist' },
});
