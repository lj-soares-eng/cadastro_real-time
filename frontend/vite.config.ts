import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// Em dev, `npm run dev -- --host` + proxy abaixo permite usar `VITE_API_URL=''`
// e chamar `/auth/*` e `/socket.io` no mesmo origin que o Vite (evita CORS).
const apiTarget = process.env.VITE_DEV_PROXY_API ?? 'http://localhost:3000'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      '/socket.io': {
        target: apiTarget,
        ws: true,
        changeOrigin: true,
      },
      '/auth': { target: apiTarget, changeOrigin: true },
      '/users': { target: apiTarget, changeOrigin: true },
    },
  },
})
