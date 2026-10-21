/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import angular from '@analogjs/vite-plugin-angular';
import nitro from '@analogjs/vite-plugin-nitro';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [
    analog({
      prerender: {
        routes: [
          '/',
          '/auth',
          '/firestore',
          '/database',
          '/storage',
          '/functions',
          '/messaging',
          '/analytics',
          '/performance',
          '/remote-config',
          '/app-check',
          '/ai',
        ],
      },
      content: {
        highlighter: 'prism',
        prismOptions: {
          additionalLangs: ['typescript', 'json', 'bash', 'yaml'],
        },
      },
    }),
    angular(),
    nitro(),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    reporters: ['default'],
  },
}));
