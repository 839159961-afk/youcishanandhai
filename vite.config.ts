import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

/** 始終以本配置文件所在目錄為專案根（避免在子目錄執行時 index.html / public 404） */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, projectRoot, '');
  return {
    root: projectRoot,
    publicDir: path.join(projectRoot, 'public'),
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: false,
        includeAssets: ['apple-touch-icon.png', 'pwa-192.png', 'pwa-512.png'],
        manifest: {
          name: '游此山海',
          short_name: '游此山海',
          description: '山海游历与图鉴收集',
          theme_color: '#fcf9f1',
          background_color: '#fcf9f1',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/pwa-512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: '/pwa-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          // Keep precache lightweight to reduce first-install stutter on mobile.
          globPatterns: ['**/*.{js,css,html,ico,svg,json,woff2}'],
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
          runtimeCaching: [
            {
              urlPattern: ({ sameOrigin, url }) =>
                sameOrigin && /\.(?:png|jpg|jpeg|webp)$/i.test(url.pathname),
              handler: 'CacheFirst',
              options: {
                cacheName: 'app-images',
                expiration: {
                  maxEntries: 300,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/lh3\.googleusercontent\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'googleusercontent-images',
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
      }),
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.join(projectRoot, 'src'),
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      host: true,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: {
        ignored: ['**/server-data/**', '**/server/**'],
      },
    },
  };
});
