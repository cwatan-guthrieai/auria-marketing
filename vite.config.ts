import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { soundchartsLookup } from './vite-plugins/soundcharts-lookup.ts'
import { waitlistApi } from './vite-plugins/waitlist-api.ts'

export default defineConfig({
  plugins: [react(), tailwindcss(), soundchartsLookup(), waitlistApi()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 4040,
    strictPort: true,
    proxy: {
      "/lookup/itunes": {
        target: "https://itunes.apple.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/lookup\/itunes/, ""),
      },
      "/lookup/spotify-oembed": {
        target: "https://open.spotify.com",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/lookup\/spotify-oembed/, "/oembed"),
      },
    },
  },
  preview: {
    port: 4040,
    strictPort: true,
  },
})
