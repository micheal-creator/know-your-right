import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Relative base so the built app works on any static host
// (GitHub Pages project sites, Vercel, Netlify) and offline.
export default defineConfig({
  base: './',
  define: {
    __APP_VERSION__: JSON.stringify('0.1.0'),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon.svg'],
      manifest: {
        name: 'Know Your Right',
        short_name: 'KnowYourRight',
        description:
          'Look up what Nigerian law actually says — the Constitution, traffic fines, and federal/state powers — and connect to a real lawyer.',
        theme_color: '#0F5132',
        background_color: '#FBFBF9',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        icons: [
          { src: 'icon.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any' },
          { src: 'icon-maskable.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
})
