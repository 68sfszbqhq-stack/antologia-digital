## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Firebase (evaluaciones de los alumnos)

El sitio se publica en **GitHub Pages**, no en Firebase Hosting. Firebase se usa
solo para Firestore y Authentication, desde el navegador. `firebase.json` existe
únicamente para publicar `firestore.rules`.

Antes de tocar esta parte, leer la sección "Evaluaciones" del README. Puntos que
no se deducen del código:

- **Las reglas son la seguridad, no la interfaz.** `src/lib/alumno.ts` es solo la
  puerta amable; cualquiera puede llamar esas funciones desde la consola. Todo
  cambio de permisos se hace en `firestore.rules` y se verifica ahí.
- **El intento único** depende del ID del documento (`<matrícula>_<día>`) y de que
  las reglas concedan `create` pero nunca `update`. No romper ninguna de las dos
  cosas.
- **Los scripts de `scripts/` usan Admin SDK y se saltan las reglas.** Corren en la
  Mac de José, jamás en el navegador.
- **El cuestionario de `[dia].astro` es `is:inline`**, así que no puede importar
  módulos. Se comunica con `AccesoAlumno.astro` mediante el evento
  `antologia:diagnostico-terminado`.
- **View Transitions**: los scripts se cuelgan de `astro:page-load`, no de
  `DOMContentLoaded`.
- Si Firebase no está configurado, el sitio funciona como antes y no guarda nada.
  Ese respaldo es intencional; conservarlo.
- Nunca commitear `serviceAccountKey.json`, `credenciales-*.csv` ni `alumnos.csv`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
