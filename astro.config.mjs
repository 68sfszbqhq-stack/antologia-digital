// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// El sitio se publica en GitHub Pages dentro de un subdirectorio, por eso
// `base`. Los enlaces internos deben construirse con el helper de src/lib/url.ts
// para que funcionen igual en local y en producción.
// https://astro.build/config
export default defineConfig({
  site: 'https://68sfszbqhq-stack.github.io',
  base: '/antologia-digital',

  vite: {
    plugins: [tailwindcss()],

    build: {
      // A qué navegador se le apunta al compilar.
      //
      // POR QUÉ TAN ABAJO. Esto lo usan alumnos de bachillerato con el teléfono
      // que tienen, no con el que uno quisiera: gama baja, Android viejo, Chrome
      // que no se actualiza desde hace años. Sin fijar esto, la herramienta
      // compila para navegadores recientes y emite cosas como `??=` o `static{}`,
      // que un Chrome de 2020 NI SIQUIERA PUEDE LEER. Y cuando un navegador no
      // puede leer el archivo no muestra un error: deja la página en blanco. El
      // alumno solo sabe que "no puede entrar".
      //
      // Chrome 80 es de principios de 2020. Más abajo no tiene caso: el sitio se
      // sirve como módulos de JavaScript, que ningún navegador anterior a 2018
      // entiende, y ese es el piso real.
      //
      // OJO: esto arregla la SINTAXIS, no las funciones que falten. Para eso
      // están los remiendos del <head> en src/layouts/Layout.astro. Las dos
      // cosas hacen falta.
      target: ['chrome80', 'safari13.1', 'firefox78', 'edge88'],
    },
  },

  integrations: [react()]
});