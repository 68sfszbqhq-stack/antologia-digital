# Antología Digital — Cultura Digital I

Material didáctico interactivo para la asignatura **Cultura Digital** de Educación Media Superior, alineado al Marco Curricular Común de la Educación Media Superior (MCCEMS 2024).

Cubre los ocho módulos del progresión 1.1 a 1.8, desde la evolución del hardware hasta la lógica de programación.

**Sitio publicado:** https://68sfszbqhq-stack.github.io/antologia-digital

## Qué incluye cada módulo

Cada sesión está organizada en cinco pasos que siguen la secuencia didáctica:

1. **Diagnóstico** — 10 preguntas de opción múltiple con retroalimentación inmediata y explicación del porqué de cada respuesta.
2. **Resultados** — puntaje y dominio calculado por eje de conocimiento a partir de las respuestas reales del estudiante.
3. **La clase** — apertura con datos duros y su fuente, conceptos clave, videos de apoyo y fuentes primarias.
4. **Contexto histórico** — línea del tiempo filtrable por categoría.
5. **Actividad de evaluación** — consigna, requisitos y rúbrica con ponderaciones.

| Módulo | Tema |
|---|---|
| 1.1 | Evolución del hardware y software |
| 1.2 | Licenciamiento y acceso a servicios |
| 1.3 | Impacto social de la tecnología digital |
| 1.4 | Alternativas y software libre |
| 1.5 | Normatividad y seguridad en el ciberespacio |
| 1.6 | Identidad digital y medio ambiente |
| 1.7 | Resolución de problemas algorítmicos |
| 1.8 | Lenguaje algorítmico y lógica |

## Sobre los datos

Toda cifra mostrada en el material lleva su fuente visible, y cada módulo enlaza a las fuentes primarias de donde salen. Las principales:

- **INEGI, ENDUTIH 2024** — conectividad y brecha digital en México
- **CONDUSEF** — estadísticas de fraude cibernético
- **Diario Oficial de la Federación** — Ley Federal de Protección de Datos Personales en Posesión de los Particulares, vigente desde el 21 de marzo de 2025
- **Global E-waste Monitor 2024** (ONU, UIT y UNITAR) — residuos electrónicos
- **Agencia Internacional de Energía** — consumo eléctrico de centros de datos
- **Free Software Foundation** y **TOP500** — software libre

Los videos incorporados fueron verificados uno por uno contra la API de YouTube.

## Desarrollo

```sh
npm install
npm run dev      # http://localhost:4321/antologia-digital/
npm run build    # genera ./dist
npm run preview  # revisa la versión construida
```

El sitio se publica solo: cada push a `main` dispara el flujo de `.github/workflows/deploy.yml`.

### Estructura

```
src/
├── data/
│   ├── tipos.ts            # tipos del contenido de un módulo
│   ├── contenido-1-4.ts    # contenido de los módulos 1.1 a 1.4
│   ├── contenido-5-8.ts    # contenido de los módulos 1.5 a 1.8
│   ├── contenido.ts        # une ambos, indexado por número de sesión
│   └── sesiones.json       # metadatos, videos y fuentes de cada módulo
├── lib/url.ts              # helper para enlaces internos (respeta el base de Pages)
├── layouts/Layout.astro
└── pages/
    ├── index.astro
    └── sesion/[dia].astro  # plantilla única: se arma con los datos
```

Para editar el contenido de un módulo no hay que tocar la plantilla: todo vive en `src/data/`.

> **Nota sobre enlaces internos:** el sitio se publica en un subdirectorio, así que todo `href` interno debe construirse con el helper `u()` de `src/lib/url.ts`. Un `href="/sesion/1"` escrito a mano funciona en local pero da 404 al publicarse.

## Construido con

[Astro](https://astro.build) y [Tailwind CSS](https://tailwindcss.com).
