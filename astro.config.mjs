// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// El sitio se publica en GitHub Pages dentro de un subdirectorio, por eso
// `base`. Los enlaces internos deben construirse con el helper de src/lib/url.ts
// para que funcionen igual en local y en producción.
// https://astro.build/config
export default defineConfig({
  site: 'https://68sfszbqhq-stack.github.io',
  base: '/antologia-digital',
  vite: {
    plugins: [tailwindcss()]
  }
});
