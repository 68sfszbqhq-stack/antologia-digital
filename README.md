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
├── lib/
│   ├── url.ts              # helper para enlaces internos (respeta el base de Pages)
│   ├── firebase.ts         # conexión con Firebase (la config pública va aquí)
│   ├── alumno.ts           # entrar, salir y entregar el diagnóstico
│   ├── matricula.mjs       # matrícula → correo interno (lo usan sitio y scripts)
│   └── csv-idoceo.ts       # arma el CSV de calificaciones
├── components/
│   └── AccesoAlumno.astro  # pantalla de matrícula + código
├── layouts/Layout.astro
└── pages/
    ├── index.astro
    ├── profesor.astro      # panel: resultados y exportación
    └── sesion/[dia].astro  # plantilla única: se arma con los datos

scripts/                    # corren en la Mac, no en el navegador
├── alta-alumnos.mjs        # da de alta un grupo y genera sus códigos
└── reset-codigo.mjs        # código nuevo para quien perdió el suyo
```

Para editar el contenido de un módulo no hay que tocar la plantilla: todo vive en `src/data/`.

> **Nota sobre enlaces internos:** el sitio se publica en un subdirectorio, así que todo `href` interno debe construirse con el helper `u()` de `src/lib/url.ts`. Un `href="/sesion/1"` escrito a mano funciona en local pero da 404 al publicarse.

## Evaluaciones: cómo se registran y cómo llegan a iDoceo

El diagnóstico de cada módulo se guarda en Firebase y se exporta como columna de
evaluación para iDoceo.

**El sitio sigue en GitHub Pages.** Firebase entra solo como base de datos
(Firestore) e identidad (Authentication); no se usa Firebase Hosting y el flujo
de publicación no cambia. Todo cabe en el plan gratuito.

### Cómo funciona

El alumno escribe **su matrícula y un código** que le entrega el profesor. Por
debajo eso es Firebase Authentication de verdad: la matrícula se convierte en un
correo interno (`2024001@antologia.local`) que el alumno nunca ve, y el código es
la contraseña. La ventaja de hacerlo así es que **quien valida el código es
Firebase, no la página**: si se comprobara en el navegador, cualquiera lo saltaría
abriendo las herramientas de desarrollo.

El navegador recuerda la sesión, así que el alumno se identifica una sola vez para
los ocho módulos. No hay ninguna lista pública de nombres.

**Un intento por módulo.** El registro se guarda con el nombre `<matrícula>_<módulo>`
y las reglas solo permiten crearlo, nunca modificarlo. Un segundo envío choca con
el primero y Firestore lo rechaza. El profesor puede borrar un intento desde el
panel para que un alumno repita.

### Configuración inicial (una sola vez)

1. Crear el proyecto en [console.firebase.google.com](https://console.firebase.google.com).
2. **Authentication** → habilitar **Correo/contraseña** y **Google**.
3. **Firestore Database** → crear la base en modo producción.
4. ⚙️ **Configuración del proyecto** → copiar el bloque `Config` y pegarlo en
   `src/lib/firebase.ts`.
5. ⚙️ → **Cuentas de servicio** → *Generar nueva clave privada* → guardarla como
   `serviceAccountKey.json` en la raíz.
6. **Authentication → Settings → Dominios autorizados** → agregar
   `68sfszbqhq-stack.github.io`.
7. Entrar a `/profesor` con Google: la página muestra tu UID. Pegarlo en
   `firestore.rules` (donde dice `PENDIENTE_UID_DEL_PROFESOR`) y publicar:

```sh
firebase deploy --only firestore:rules
```

> El paso 6 es el que más se olvida: sin él el acceso funciona en local pero falla
> en el sitio publicado, con un error que no explica nada.

### Dar de alta un grupo

Preparar un `alumnos.csv` con estas columnas:

```csv
matricula,nombre,grupo
2024001,Pérez López Juan,CDI-A
2024002,Ramírez Cruz Ana,CDI-A
```

```sh
node scripts/alta-alumnos.mjs alumnos.csv --ensayo   # revisa el archivo, no crea nada
node scripts/alta-alumnos.mjs alumnos.csv            # da de alta de verdad
```

Genera `credenciales-CDI-A.csv` con el código de cada alumno, listo para imprimir
y recortar. **Los códigos solo existen en ese archivo**: en Firebase quedan
cifrados y no se pueden volver a consultar.

Volver a correrlo no cambia los códigos de quien ya existe, así que sirve para
agregar a los que llegaron tarde.

```sh
node scripts/reset-codigo.mjs 2024001    # código nuevo para quien perdió el suyo
```

### Durante el curso

En `/profesor` (entrando con Google):

- **Abrir y cerrar módulos.** Un módulo cerrado no deja contestar a nadie.
- **Ver la tabla** de calificaciones por grupo.
- **Borrar un intento** tocando la calificación, si alguien necesita repetir.
- **Descargar el CSV** para iDoceo.

### Importar en iDoceo

En iDoceo: *Herramientas → Clase → Herramientas → Importar CSV/XLS*, opción
**Importación guiada**. Cada módulo entra como una columna de evaluación.

Las columnas que empiezan con `!` son datos personales del alumno, no
calificaciones — así lo espera iDoceo:

```csv
!Alumno,!Matrícula,Diagnóstico 1.1,Diagnóstico 1.2
Pérez López Juan,2024001,8,9
```

Quien no contestó queda **vacío, no en cero**: un cero significa que lo hizo y
falló todo, y eso no es lo mismo que no haberlo entregado.

### Qué nunca se sube a GitHub

Ya está en `.gitignore`, pero conviene tenerlo presente:

| Archivo | Por qué |
|---|---|
| `serviceAccountKey.json` | Llave maestra: abre toda la base sin pasar por las reglas |
| `credenciales-*.csv` | Códigos de los alumnos en texto plano |
| `alumnos.csv` | Nombres y matrículas de menores de edad |

La `apiKey` de `src/lib/firebase.ts` **sí** es pública por diseño y no es una
fuga: solo identifica al proyecto. La seguridad real vive en `firestore.rules`.

### Un límite que conviene conocer

El sitio es estático, así que **las preguntas y sus respuestas correctas viajan al
navegador**. Un alumno con conocimientos técnicos puede verlas antes de contestar.
Evitarlo exigiría calificar en un servidor (Cloud Functions), que requiere el plan
de pago de Firebase.

En la práctica esto se acota aplicando el diagnóstico en clase. Lo que sí está
garantizado por las reglas es que nadie puede **ver ni alterar las calificaciones
de otros**, ni contestar dos veces, ni entrar a un módulo cerrado.

## Construido con

[Astro](https://astro.build), [Tailwind CSS](https://tailwindcss.com) y
[Firebase](https://firebase.google.com) (Firestore + Authentication).
