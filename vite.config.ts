import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { type PluginOption } from 'vite';
import { DynamicPublicDirectory } from 'vite-multiple-assets';
// same level as project root
const dirAssets = [
  '{\x01,src/games/graphisomorphism/img}/**',
  '{\x01,src/games/graphisomorphism/editorial}/**',
  'src/games/graphisomorphism/README.md',
  '{\x01,src/games/eulercircuit/img}/**',
  '{\x01,src/games/eulercircuit/editorial}/**',
  'src/games/eulercircuit/README.md',
];
// https://vitejs.dev/config/
export default defineConfig({
  base: '/match-puzzle-gi/',
  assetsInclude: ['**/*.md', '**/*.mp4', '**/*.png', '**/*.pdf', '**/*.typ'],
  plugins: [
    DynamicPublicDirectory(dirAssets) as PluginOption,
  ],
  build: {
    rollupOptions: {
      input: {
        'index': resolve(__dirname, 'index.html'),
        'src/games/graphisomorphism/index': resolve(__dirname, 'src/games/graphisomorphism/index.html'),
        'src/games/eulercircuit/index': resolve(__dirname, 'src/games/eulercircuit/index.html'),
      }
    }
  },
  publicDir: false,
});