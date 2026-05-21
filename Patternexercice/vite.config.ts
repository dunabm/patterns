import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/patterns/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
