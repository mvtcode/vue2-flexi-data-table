import { fileURLToPath, URL } from 'url';
import { createVuePlugin } from 'vite-plugin-vue2';

module.exports = {
  plugins: [createVuePlugin()],
  build: {
    sourcemap: false
  },
  css: {
    devSourcemap: false
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
};