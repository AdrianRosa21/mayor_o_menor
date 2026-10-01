import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Puertos por defecto: dev 5173, preview 4173
export default defineConfig({
  plugins: [react()],
  test: {
    // Las pruebas son de funciones puras, no necesitan navegador
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
});
