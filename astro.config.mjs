import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { VitePWA } from 'vite-plugin-pwa'; // ✅ Named import

import { defineConfig } from 'astro/config';
import react from '@astrojs/react'; // Import react here


export default defineConfig({
  site: 'https://astro-starter-vibes.web.app/',
  integrations: [tailwind(), react()],
  vite: {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'icons/*.png'],
        manifest: {
          name: 'Astro Starter Vibes',
          short_name: 'Astro Vibes',
          start_url: '/',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#000000',
          icons: [
            {
              src: '/icons/comic-192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/icons/comic-512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
    ],
  },
});
