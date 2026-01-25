import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-512x512.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Luna Sutra',
        short_name: 'Luna Sutra',
        description: 'Experiência VIP para Casais',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        icons: [
          {
            src: 'icon-512x512.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});