import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://school-facility-reporting-portal.onrender.com',
      '/socket.io': {
        target: 'https://school-facility-reporting-portal.onrender.com',
        ws: true,
      },
    },
  },
});
