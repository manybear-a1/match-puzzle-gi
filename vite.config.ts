import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/match-puzzle-gi/',
  assetsInclude: ['**/*.md'],
  build: {
    rollupOptions: {
      input: {
        'index': resolve(__dirname, 'index.html'),
        'src/games/graphisomorphism/index': resolve(__dirname, 'src/games/graphisomorphism/index.html'),
        'src/games/eulercircuit/index': resolve(__dirname, 'src/games/eulercircuit/index.html'),
      }
    }
  }
});