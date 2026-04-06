import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // ESTA LINHA É A CHAVE: ela remove o "/api" da frente antes de mandar pro Nest
        rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },
});