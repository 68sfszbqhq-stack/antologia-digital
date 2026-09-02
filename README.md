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

## Evaluación diagnóstica de inicio de ciclo

Es otra cosa que los ocho módulos y va por su lado: `/diagnostico`. Una sola
sesión seguida, sin matrícula ni código —el alumno llena una ficha y empieza—,
que encadena tres bloques:

1. **Test de atención** (Anillos de Landolt). Va primero, mientras el alumno
   está fresco: es lo único con reloj, y aplicado al final mediría el cansancio
   de la sesión.
2. **Test de temperamento** (cuatro temperamentos, 40 reactivos). En medio, sin
   reloj y sin respuestas correctas, funciona como descanso.
3. **Evaluación de conocimientos**, según el grado que el alumno elige:

| Grado | Qué contesta | Reactivos |
|---|---|---|
| 1º | Cuadernillo oficial de ingreso (EDIEMS), mostrado como PDF | 88 |
| 2º | Taller de Ciencias II, Lengua y Comunicación II, Inglés III | 15 |
| 3º | Cultura Digital, Energía, Salud Integral, Sexualidad y Género, Derecho y Sociedad, Conciencia Histórica | 31 |

### Abrirla y cerrarla

```bash
node scripts/abrir-diagnostico.mjs          # cómo está ahora
node scripts/abrir-diagnostico.mjs 1        # abrir la aplicación 1
node scripts/abrir-diagnostico.mjs cerrar   # cerrar
```

**Déjala abierta mientras dure la aplicación**, incluso varios días: es
justamente lo que permite que un alumno que se atoró vuelva a entrar y continúe.
Al cerrarla, las reglas dejan de aceptar cambios y quien iba a medias se queda a
medias. Como se entra con Google, tenerla abierta no significa que pueda entrar
cualquiera.

(El test suelto de `/landolt` es lo contrario: allá se entra sin cuenta, así que
ese sí hay que cerrarlo al acabar la sesión. Son dos interruptores distintos.)

Se pueden aplicar solo algunos bloques:

```bash
node scripts/abrir-diagnostico.mjs 1 --bloques atencion,academica
```

Tiene su propio interruptor, aparte del de `/landolt`: cerrar uno no cierra el
otro.

### Sacar los resultados

```bash
node scripts/exportar-diagnostico.mjs
```

Salen tres CSV: el resumen (un renglón por alumno, con correo y estado), las
respuestas de 2º y 3º, y las 88 del cuadernillo de 1º. Al final lista quiénes van
a medias, con su correo, para poder ir a buscarlos.

### El cuadernillo de primer año

El cuadernillo **no se transcribe**: se muestra el PDF original tal cual, con
las preguntas a un lado. Trae diagramas de Lewis, una tabla periódica, mapas
mentales y carteles publicitarios sobre los que se pregunta directamente;
pasarlo a HTML significaría reacomodar esas imágenes a mano, con el riesgo de
que una quede mal y la pregunta cambie de sentido.

Lo único que se teclea es en qué página está cada pregunta, y eso lo averigua un
script:

```bash
node scripts/mapear-cuadernillo.mjs cuadernillo.pdf --id ediems-2027
cp cuadernillo.pdf public/cuadernillos/ediems-2027.pdf
```

**No trae clave de respuestas**, porque el cuadernillo del alumno no la tiene.
El sitio guarda lo que marcó, sin calificar. Cuando la autoridad publique la
clave, se pone en un CSV de dos columnas y se aplica al exportar:

```bash
node scripts/exportar-diagnostico.mjs --clave clave-ediems.csv
```

### Cómo entra el alumno: con su cuenta de Google

No hay matrículas ni códigos que repartir. El alumno entra con Google y eso
resuelve tres cosas de golpe:

- **Rastreable.** Cada entrega trae el correo de quien la hizo; no hay que
  confiar en que escriba bien su nombre.
- **Se puede retomar.** El documento se llama `<uid>_<aplicación>`, así que al
  volver a entrar —el mismo día o tres días después, en otro aparato— el sitio
  encuentra lo que llevaba y sigue donde se quedó.
- **No hay que vigilar el interruptor.** Con acceso anónimo, dejar la evaluación
  abierta significaba que cualquiera con el enlace podía mandar basura. Con
  Google, quien entra queda identificado.

**Se guarda conforme avanza**, no al final: cada bloque terminado se manda en
cuanto termina, y el cuadernillo de primer año se manda unos segundos después de
cada tanda de respuestas. La diferencia entre perder una hora de examen por un
celular que se apagó y perder cuatro segundos.

Y siempre, pase lo que pase con la nube, se ofrece la descarga del CSV al final.

#### El único paso manual

Hay que activar el proveedor una vez en la consola de Firebase:

> *Authentication → Sign-in method → Google → Habilitar → elegir un correo de
> soporte → Guardar*

El dominio `68sfszbqhq-stack.github.io` ya está en la lista de dominios
autorizados, así que no hay nada más que tocar.

Si el proveedor no está activo, el alumno ve un mensaje claro y no puede entrar.
Si Firebase entero no está configurado, el sitio funciona igual y el alumno puede
contestar y descargar su CSV, pero no se guarda en la nube. Ese respaldo es
intencional.

#### El candado, que aquí es distinto

En el resto del sitio la regla es «se crea una vez y nunca se modifica». Aquí eso
es imposible: sin `update` no se puede retomar nada. El candado es otro y vive en
`firestore.rules`: en cuanto el documento pasa a `estado: 'entregado'`, las
reglas dejan de aceptar cambios. Se corrige lo que aún no se entrega, y nada más.

Además, la sesión de Firebase es una sola para todo el sitio, así que aquí solo
cuenta **quien entró con Google**: una sesión anónima de `/landolt` o una de
folio de `/expediente` se tratan como si no hubiera nadie.

## Construido con

[Astro](https://astro.build), [Tailwind CSS](https://tailwindcss.com) y
[Firebase](https://firebase.google.com) (Firestore + Authentication).
