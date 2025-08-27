import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [solid()],
  css: {
    postcss: './postcss.config.js'
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'KahitSanDesignSystem',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['solid-js', 'solid-js/web', 'lucide-solid'],
      output: {
        globals: {
          'solid-js': 'SolidJS',
          'solid-js/web': 'SolidJSWeb',
          'lucide-solid': 'LucideSolid'
        }
      }
    },
    cssCodeSplit: false,
    minify: 'terser'
  },
  resolve: {
    alias: { '@': resolve(__dirname, 'src') }
  }
});