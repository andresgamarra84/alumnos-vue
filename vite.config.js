import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'https://cjjc.edu.ar', // Tu servidor PHP
        changeOrigin: true,
        secure: false,
      },
    },
  },
});