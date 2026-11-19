// Banco de ejercicios del Gimnasio mental (Lengua y Comunicación).
// Mismos tipos de razonamiento que el simulador psicométrico, pero con
// preguntas DISTINTAS, para que practicar aquí no sea aprenderse el test.
// Todas son originales.
//
// Formato: en `o` la PRIMERA opción es la correcta; la página las baraja al
// mostrarlas. `x` es la explicación que ve el alumno si se equivoca.

export type Ejercicio = { id: string; t: string; q: string; big?: string; o: string[]; x: string };

export const TIPOS: Record<string, { n: string; truco: string }> = {
  a: { n: 'Analogías', truco: 'Di en voz alta la relación del primer par ("el pez vive en el agua") y aplícala tal cual al segundo ("el ave vive en el…").' },
  s: { n: 'Series', truco: 'Escribe cuánto cambia de un número al siguiente. Si no es una suma fija, prueba multiplicar o busca dos patrones que se alternan.' },
  v: { n: 'Vocabulario', truco: 'Usa la palabra en una oración que conozcas y cámbiala por cada opción: la que no cambia el sentido es el sinónimo.' },
  l: { n: 'Lógica', truco: 'Usa solo lo que dicen las premisas, no lo que tú sabes o supones. Si las premisas no lo aseguran, la respuesta es "no se puede saber".' },
  p: { n: 'Problemas', truco: 'Antes de calcular, escribe qué te piden. Luego resuelve por pasos pequeños y revisa si el resultado tiene sentido.' },
  c: { n: 'Comprensión', truco: 'Fíjate en las palabras que cambian el sentido: "podría", "pocos", "aunque", "no". Un hecho se puede comprobar; una opinión, no.' },
};

export const EJERCICIOS: Ejercicio[] = [
  // ─── Analogías ───────────────────────────────────────────────────────────
  { id: 'a1', t: 'a', q: 'Libro es a leer como canción es a…', o: ['escuchar', 'guardar', 'escribir', 'comprar'], x: 'Un libro sirve para leerse; una canción, para escucharse. La relación es "objeto → para qué sirve".' },
  { id: 'a2', t: 'a', q: 'Médico es a hospital como maestro es a…', o: ['escuela', 'alumno', 'libro', 'pizarrón'], x: 'Es "persona → lugar donde trabaja". El médico trabaja en el hospital; el maestro, en la escuela.' },
  { id: 'a3', t: 'a', q: 'Semilla es a árbol como huevo es a…', o: ['pollo', 'nido', 'yema', 'cascarón'], x: 'De la semilla crece el árbol; del huevo nace el pollo. Es "origen → lo que llega a ser".' },
  { id: 'a4', t: 'a', q: 'Frío es a calor como silencio es a…', o: ['ruido', 'paz', 'noche', 'calma'], x: 'Son opuestos. Lo contrario del silencio es el ruido.' },
  { id: 'a5', t: 'a', q: 'Pez es a agua como ave es a…', o: ['aire', 'nido', 'pluma', 'árbol'], x: 'El pez se mueve en el agua; el ave, en el aire. El nido es donde descansa, no donde se desplaza.' },
  { id: 'a6', t: 'a', q: 'Reloj es a hora como termómetro es a…', o: ['temperatura', 'fiebre', 'grado', 'mercurio'], x: 'Es "instrumento → lo que mide". El reloj mide la hora; el termómetro, la temperatura.' },
  { id: 'a7', t: 'a', q: 'Capítulo es a libro como escena es a…', o: ['obra de teatro', 'actor', 'aplauso', 'butaca'], x: 'Es "parte → todo". Un capítulo es parte de un libro; una escena, parte de una obra de teatro.' },
  { id: 'a8', t: 'a', q: 'Hambre es a comer como sueño es a…', o: ['dormir', 'soñar', 'cama', 'noche'], x: 'Es "necesidad → acción que la quita". El hambre se quita comiendo; el sueño, durmiendo.' },
  { id: 'a9', t: 'a', q: 'Escritor es a novela como compositor es a…', o: ['canción', 'piano', 'oído', 'cantante'], x: 'Es "autor → lo que crea". El escritor crea novelas; el compositor, canciones.' },
  { id: 'a10', t: 'a', q: 'Llave es a cerradura como contraseña es a…', o: ['cuenta', 'teclado', 'letra', 'pantalla'], x: 'Es "lo que abre → lo que se abre". La llave abre la cerradura; la contraseña abre tu cuenta.' },

  // ─── Series ──────────────────────────────────────────────────────────────
  { id: 's1', t: 's', q: '¿Qué número sigue?', big: '5 · 10 · 20 · 40 · ?', o: ['80', '60', '70', '45'], x: 'Cada número es el doble del anterior: 40 × 2 = 80.' },
  { id: 's2', t: 's', q: '¿Qué número sigue?', big: '100 · 91 · 82 · 73 · ?', o: ['64', '63', '65', '72'], x: 'Se resta 9 cada vez: 73 − 9 = 64.' },
  { id: 's3', t: 's', q: '¿Qué número sigue?', big: '1 · 4 · 9 · 16 · 25 · ?', o: ['36', '30', '34', '49'], x: 'Son números al cuadrado: 1×1, 2×2, 3×3, 4×4, 5×5… el siguiente es 6×6 = 36.' },
  { id: 's4', t: 's', q: '¿Qué número sigue?', big: '2 · 3 · 5 · 8 · 12 · ?', o: ['17', '15', '16', '18'], x: 'Lo que se suma crece de uno en uno: +1, +2, +3, +4… ahora +5: 12 + 5 = 17.' },
  { id: 's5', t: 's', q: '¿Qué número sigue?', big: '1 · 1 · 2 · 3 · 5 · 8 · ?', o: ['13', '11', '12', '16'], x: 'Cada número es la suma de los dos anteriores: 5 + 8 = 13.' },
  { id: 's6', t: 's', q: '¿Qué número sigue?', big: '3 · 6 · 5 · 10 · 9 · 18 · ?', o: ['17', '36', '19', '15'], x: 'Se alternan dos pasos: ×2 y luego −1. Después de 18 toca −1: 17.' },
  { id: 's7', t: 's', q: '¿Qué letra sigue?', big: 'B · D · F · H · ?', o: ['J', 'I', 'K', 'L'], x: 'Se salta una letra cada vez: B (c) D (e) F (g) H (i) J.' },
  { id: 's8', t: 's', q: '¿Qué letra sigue?', big: 'Z · X · V · T · ?', o: ['R', 'S', 'Q', 'P'], x: 'El alfabeto va hacia atrás saltando una letra: Z (y) X (w) V (u) T (s) R.' },
  { id: 's9', t: 's', q: '¿Qué número sigue?', big: '64 · 32 · 16 · 8 · ?', o: ['4', '2', '6', '0'], x: 'Cada número es la mitad del anterior: 8 ÷ 2 = 4.' },
  { id: 's10', t: 's', q: '¿Qué número sigue?', big: '2 · 6 · 18 · 54 · ?', o: ['162', '108', '72', '160'], x: 'Cada número es el triple del anterior: 54 × 3 = 162.' },

  // ─── Vocabulario ─────────────────────────────────────────────────────────
  { id: 'v1', t: 'v', q: 'Sinónimo de HONESTO', o: ['sincero', 'valiente', 'amable', 'tímido'], x: 'Honesto es quien dice la verdad y actúa con rectitud: sincero.' },
  { id: 'v2', t: 'v', q: 'Antónimo de ESCASO', o: ['abundante', 'pequeño', 'raro', 'poco'], x: 'Escaso es "que hay poco". Lo contrario es abundante, "que hay mucho".' },
  { id: 'v3', t: 'v', q: 'Sinónimo de PERSEVERAR', o: ['persistir', 'perder', 'descansar', 'olvidar'], x: 'Perseverar es seguir intentando a pesar de las dificultades: persistir.' },
  { id: 'v4', t: 'v', q: 'Antónimo de GENEROSO', o: ['tacaño', 'rico', 'amable', 'alegre'], x: 'Generoso es quien comparte con gusto; lo contrario es tacaño.' },
  { id: 'v5', t: 'v', q: '¿Qué palabra no pertenece al grupo?', big: 'martillo · serrucho · desarmador · clavo', o: ['clavo', 'martillo', 'serrucho', 'desarmador'], x: 'Martillo, serrucho y desarmador son herramientas. El clavo es un material que se usa con ellas.' },
  { id: 'v6', t: 'v', q: '¿Qué palabra no pertenece al grupo?', big: 'rojo · azul · verde · oscuro', o: ['oscuro', 'rojo', 'azul', 'verde'], x: 'Rojo, azul y verde son colores. "Oscuro" describe qué tan intenso es un color, pero no es un color.' },
  { id: 'v7', t: 'v', q: 'Sinónimo de AMENO', o: ['entretenido', 'aburrido', 'lejano', 'largo'], x: 'Algo ameno es agradable y entretenido. "Aburrido" es justo lo contrario.' },
  { id: 'v8', t: 'v', q: 'Antónimo de SUMISO', o: ['rebelde', 'obediente', 'callado', 'tranquilo'], x: 'Sumiso es quien obedece sin protestar. Lo contrario es rebelde. "Obediente" sería sinónimo.' },
  { id: 'v9', t: 'v', q: '¿Qué palabra no pertenece al grupo?', big: 'Puebla · Jalisco · Oaxaca · Monterrey', o: ['Monterrey', 'Puebla', 'Jalisco', 'Oaxaca'], x: 'Puebla, Jalisco y Oaxaca son estados. Monterrey es una ciudad (la capital de Nuevo León).' },
  { id: 'v10', t: 'v', q: '"El medicamento sirvió para MITIGAR el dolor." Mitigar significa…', o: ['aliviar', 'aumentar', 'ocultar', 'provocar'], x: 'Mitigar es hacer que algo sea menos fuerte: aliviar.' },

  // ─── Lógica ──────────────────────────────────────────────────────────────
  { id: 'l1', t: 'l', q: 'Todos los perros ladran. Firulais es un perro. Por lo tanto…', o: ['Firulais ladra', 'Todo lo que ladra es perro', 'Firulais no ladra', 'No se puede saber'], x: 'Si TODOS los perros ladran y Firulais es perro, entonces Firulais ladra. Ojo: eso no quiere decir que todo lo que ladra sea perro.' },
  { id: 'l2', t: 'l', q: 'Algunos alumnos usan lentes. Pedro es alumno. Por lo tanto…', o: ['No se puede saber si Pedro usa lentes', 'Pedro usa lentes', 'Pedro no usa lentes', 'Todos los alumnos usan lentes'], x: '"Algunos" no es "todos". Pedro puede estar entre los que usan lentes o entre los que no.' },
  { id: 'l3', t: 'l', q: 'Si llueve, el patio se moja. Hoy el patio está seco. Por lo tanto…', o: ['Hoy no llovió', 'Hoy llovió', 'Va a llover', 'No se puede saber'], x: 'Si hubiera llovido, el patio estaría mojado. Como está seco, no llovió.' },
  { id: 'l4', t: 'l', q: 'Si llueve, el patio se moja. Hoy el patio está mojado. Por lo tanto…', o: ['No se puede saber si llovió', 'Seguro llovió', 'No llovió', 'Va a llover'], x: 'El patio pudo mojarse por otra razón: alguien lo lavó o lo regó. La lluvia no es la única causa posible.' },
  { id: 'l5', t: 'l', q: 'Ana es más alta que Beto. Beto es más alto que Carla. ¿Quién es la más baja?', o: ['Carla', 'Ana', 'Beto', 'No se puede saber'], x: 'Ordénalos de mayor a menor: Ana, Beto, Carla. La más baja es Carla.' },
  { id: 'l6', t: 'l', q: 'En una fila, Luis está delante de Marta y detrás de Pedro. ¿Quién está en medio?', o: ['Luis', 'Marta', 'Pedro', 'Nadie'], x: 'Dibújalo: Pedro, luego Luis, luego Marta. Luis queda en medio.' },
  { id: 'l7', t: 'l', q: 'Ningún reptil tiene plumas. La iguana es un reptil. Por lo tanto…', o: ['La iguana no tiene plumas', 'La iguana tiene plumas', 'Algunos reptiles tienen plumas', 'No se puede saber'], x: 'Si NINGÚN reptil tiene plumas y la iguana es reptil, la iguana no tiene plumas.' },
  { id: 'l8', t: 'l', q: 'Hoy es miércoles. ¿Qué día será dentro de 10 días?', o: ['sábado', 'viernes', 'domingo', 'jueves'], x: 'En 7 días vuelve a ser miércoles. Faltan 3 más: jueves, viernes, sábado.' },
  { id: 'l9', t: 'l', q: 'María tiene más de 15 años y menos de 18. Su edad es un número par. ¿Cuántos años tiene?', o: ['16', '15', '17', '18'], x: 'Entre 15 y 18 (sin contarlos) están 16 y 17. El único par es 16.' },
  { id: 'l10', t: 'l', q: 'Juan, Raúl y Sergio practican fútbol, básquet y natación (un deporte cada uno). Raúl practica básquet. Juan no practica fútbol. ¿Qué practica Sergio?', o: ['fútbol', 'natación', 'básquet', 'No se puede saber'], x: 'Raúl tiene básquet. A Juan le quedan fútbol o natación, pero no es fútbol: es natación. A Sergio le queda fútbol.' },

  // ─── Problemas ───────────────────────────────────────────────────────────
  { id: 'p1', t: 'p', q: 'Un cuaderno cuesta $25. Compras 4 y te descuentan $10 en total. ¿Cuánto pagas?', o: ['$90', '$100', '$80', '$85'], x: '4 × $25 = $100. Menos el descuento de $10: $90.' },
  { id: 'p2', t: 'p', q: 'Una película empieza a las 4:45 p.m. y dura 1 hora 50 minutos. ¿A qué hora termina?', o: ['6:35 p.m.', '6:25 p.m.', '5:35 p.m.', '6:45 p.m.'], x: '4:45 + 1 hora = 5:45. Más 50 minutos: 5:45 + 15 = 6:00, y faltan 35: 6:35 p.m.' },
  { id: 'p3', t: 'p', q: '5 trabajadores pintan una barda en 6 horas. ¿Cuánto tardan 10 trabajadores al mismo ritmo?', o: ['3 horas', '12 horas', '6 horas', '2 horas'], x: 'Con el doble de trabajadores se tarda la mitad: 6 ÷ 2 = 3 horas.' },
  { id: 'p4', t: 'p', q: 'Una playera cuesta $200 y tiene 25% de descuento. ¿Cuánto pagas?', o: ['$150', '$175', '$125', '$180'], x: '25% es la cuarta parte: $200 ÷ 4 = $50 de descuento. $200 − $50 = $150.' },
  { id: 'p5', t: 'p', q: 'Un camión avanza 60 km cada hora. ¿Cuánto avanza en 2 horas y media?', o: ['150 km', '120 km', '180 km', '130 km'], x: '2 horas = 120 km, y media hora = 30 km. En total, 150 km.' },
  { id: 'p6', t: 'p', q: 'En un grupo de 30 alumnos, 2 de cada 5 son hombres. ¿Cuántas mujeres hay?', o: ['18', '12', '20', '15'], x: '30 ÷ 5 = 6 grupos de cinco. En cada uno hay 2 hombres: 12 hombres. 30 − 12 = 18 mujeres.' },
  { id: 'p7', t: 'p', q: 'Tienes $500. Gastas la mitad en comida y $80 en pasajes. ¿Cuánto te queda?', o: ['$170', '$250', '$220', '$180'], x: 'La mitad de $500 es $250. Te quedan $250, y luego gastas $80: $170.' },
  { id: 'p8', t: 'p', q: 'Una receta para 4 personas lleva 3 huevos. ¿Cuántos huevos necesitas para 12 personas?', o: ['9', '12', '6', '8'], x: '12 personas es el triple de 4. Entonces se necesita el triple de huevos: 3 × 3 = 9.' },
  { id: 'p9', t: 'p', q: 'Una llave llena una cubeta de 20 litros en 4 minutos. ¿Cuánto tarda en llenar un tinaco de 300 litros?', o: ['60 minutos', '75 minutos', '45 minutos', '80 minutos'], x: 'La llave echa 5 litros por minuto (20 ÷ 4). 300 ÷ 5 = 60 minutos.' },
  { id: 'p10', t: 'p', q: 'Si hoy fuera 18 de noviembre, ¿qué fecha sería dentro de 37 días?', o: ['25 de diciembre', '24 de diciembre', '26 de diciembre', '23 de diciembre'], x: 'Noviembre tiene 30 días: del 18 al 30 pasan 12. Faltan 37 − 12 = 25 días de diciembre: 25 de diciembre.' },

  // ─── Comprensión ─────────────────────────────────────────────────────────
  { id: 'c1', t: 'c', q: '"El gerente dijo que la tienda podría cerrar temprano el viernes." Esto significa que…', o: ['Es posible que cierre temprano, pero no es seguro', 'La tienda cerrará temprano', 'La tienda no abrirá el viernes', 'El gerente ya decidió cerrar'], x: '"Podría" indica posibilidad, no algo decidido.' },
  { id: 'c2', t: 'c', q: '"Pocos alumnos entregaron la tarea a tiempo." ¿Qué se puede concluir?', o: ['La mayoría no la entregó a tiempo', 'Nadie la entregó', 'Todos la entregaron tarde', 'La tarea era muy difícil'], x: '"Pocos" quiere decir que algunos sí la entregaron, pero la mayoría no. Que fuera difícil es una suposición: el texto no lo dice.' },
  { id: 'c3', t: 'c', q: '¿Cuál de estas oraciones es un HECHO y no una opinión?', o: ['El Popocatépetl mide más de 5,000 metros de altura', 'El Popocatépetl es el volcán más bonito de México', 'Subir al Popocatépetl es aburrido', 'Todos deberían conocer el Popocatépetl'], x: 'La altura se puede medir y comprobar. "Bonito", "aburrido" y "deberían" son opiniones.' },
  { id: 'c4', t: 'c', q: '"Aunque estaba cansada, Lucía terminó su exposición." La palabra "aunque" indica…', o: ['Algo que se opone a lo que pasó', 'La causa de lo que pasó', 'La consecuencia de lo que pasó', 'El orden en que pasaron las cosas'], x: '"Aunque" presenta un obstáculo: el cansancio podía impedirle terminar, y aun así terminó.' },
  { id: 'c5', t: 'c', q: '"Desde que pusieron un semáforo en la esquina, ya no ha habido choques." ¿Cuál es la inferencia más razonable?', o: ['Probablemente el semáforo ayudó a evitar choques', 'El semáforo costó mucho dinero', 'En esa esquina nunca hubo choques', 'Ahora los choques son en otra esquina'], x: 'El texto relaciona el semáforo con el fin de los choques. Las otras opciones hablan de cosas que el texto no menciona o contradice.' },
  { id: 'c6', t: 'c', q: 'Un anuncio dice: "9 de cada 10 dentistas recomiendan esta pasta". ¿Qué deberías preguntarte primero?', o: ['A cuántos dentistas les preguntaron y quién pagó el estudio', 'De qué color es el empaque', 'Cuánto cobra un dentista', 'Si la pasta sabe a menta'], x: 'Un dato así solo vale si sabes de dónde sale: pudieron preguntar a 10 dentistas pagados por la marca.' },
  { id: 'c7', t: 'c', q: '"El examen no fue nada fácil." Quiere decir que el examen fue…', o: ['difícil', 'fácil', 'corto', 'injusto'], x: '"No fue nada fácil" es otra forma de decir que fue difícil. Que fuera injusto no lo dice.' },
  { id: 'c8', t: 'c', q: '¿Cuál de estas oraciones es una OPINIÓN?', o: ['El mejor deporte del mundo es el fútbol', 'En el fútbol juegan 11 jugadores por equipo', 'El Mundial de fútbol se juega cada 4 años', 'Un partido de fútbol dura 90 minutos más la compensación'], x: '"El mejor" depende del gusto de cada quien. Las demás se pueden comprobar en el reglamento.' },
  { id: 'c9', t: 'c', q: '"Andrés llegó empapado y con el paraguas cerrado en la mano." ¿Qué es lo más probable?', o: ['Estaba lloviendo y no abrió su paraguas', 'Hacía mucho calor', 'Venía de nadar en una alberca', 'Se acaba de comprar el paraguas'], x: 'Empapado + paraguas en la mano apunta a lluvia. Las otras opciones no explican por qué traía paraguas.' },
  { id: 'c10', t: 'c', q: '"Carlos siempre llega temprano, pero hoy no ha llegado y no contesta el teléfono." ¿Cuál es la conclusión más prudente?', o: ['Algo pudo pasarle; conviene buscarlo', 'Carlos ya no quiere venir', 'Carlos es impuntual', 'Carlos está enojado con todos'], x: 'Como "siempre" llega temprano, que no llegue es raro. Las otras opciones juzgan a Carlos sin pruebas.' },
];
