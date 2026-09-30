import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/match-puzzle-gi/',
  assetsInclude: ['**/*.md'],
  build: {
    rollupOptions: {
      input:{
        'index': resolve(__dirname, 'index.html'),
        'graphisomorphism': resolve(__dirname, 'src/games/graphisomorphism/main.ts'),
        'eulercircuit': resolve(__dirname, 'src/games/eulercircuit/main.ts'),
      }
    }
  }
});