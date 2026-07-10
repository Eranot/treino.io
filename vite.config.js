import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'iconify-icon' || tag.includes('image-annotator')
        }
      }
    }),
    tailwindcss(),
    vueDevTools(),
  ],
  // Em lib mode o Vite não substitui process.env.NODE_ENV — sem isso o bundle
  // quebra com "process is not defined" fora de bundlers que façam a substituição
  define: command === 'build'
    ? { 'process.env.NODE_ENV': JSON.stringify('production') }
    : {},
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    target: 'es2019',
    // gerar bundle único para evitar falha de imports dinâmicos no app host
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined,
      },
    },
    lib: {
      entry: path.resolve(__dirname, 'src/main.js'),
      name: 'ImageAnnotator',
      formats: ['es'],
      fileName: (format) => `image-annotator.${format}.js`,
      cssFileName: 'image-annotator'
    },
  }
}))
