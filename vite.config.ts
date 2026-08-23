import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Daily-Expense/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Daily-Expense/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
