import { fileURLToPath, URL } from 'url';
import { createVuePlugin } from 'vite-plugin-vue2';
import { resolve } from "path";

module.exports = {
  plugins: [createVuePlugin()],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.js'),
      name: 'Vue2FlexiDataTable',
      // the proper extensions will be added
      fileName: 'vue2-flexi-data-table',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
    },
    sourcemap: false,
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