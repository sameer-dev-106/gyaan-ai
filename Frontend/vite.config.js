import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',

      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },

      manifest: {
        name: 'Gyaan AI',
        short_name: 'GyaanAI',
        description: 'AI powered assistant',
        theme_color: "#0f0f0f",
        background_color: "#0f0f0f",
        display: 'standalone',
        start_url: '/',

        icons: [
          {
            src: '/pwa-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-markdown': ['react-markdown', 'remark-gfm', 'remark-math', 'rehype-katex', 'katex'],
          'vendor-syntax': ['react-syntax-highlighter'],
          'vendor-mermaid': ['mermaid'],
        }
      }
    }
  }
})