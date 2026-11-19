// Preguntas del simulador psicométrico de Lengua y Comunicación.
// Las usa la página del alumno (simulador-psicometrico.astro, vía define:vars)
// y el panel del profesor (para mostrar el detalle de cada respuesta).
// Son preguntas originales al estilo de las pruebas comerciales, no copias.
//
// OJO: los resultados guardados guardan el ÍNDICE de cada respuesta. Si cambias
// el orden de preguntas u opciones, los detalles viejos del panel se leerán mal.

export const SECS=[
 {id:'disc',nombre:'Personalidad',estilo:'tipo Cleaver / DISC',min:5,
  instr:'En cada renglón hay 4 palabras. Marca en la columna MÁS la que mejor te describe y en MENOS la que menos te describe. Usa una palabra distinta en cada columna. No hay respuestas buenas ni malas.'},
 {id:'raz',nombre:'Razonamiento',estilo:'tipo Terman / Raven',min:10,
  instr:'Elige la respuesta correcta. Si una pregunta se te atora, sigue con la siguiente y regresa al final. Las preguntas sin contestar cuentan como error.'},
 {id:'int',nombre:'Valores e integridad',estilo:'honestidad y reglas',min:4,
  instr:'Indica qué tan de acuerdo estás con cada frase. Contesta lo que de verdad piensas, no lo que crees que quieren leer.'},
 {id:'sit',nombre:'Situaciones laborales',estilo:'tipo Moss / Kostick',min:6,
  instr:'Lee cada situación y elige lo que harías. Piensa en lo que resuelve el problema y cuida la relación con las personas.'}
];

export const DISC: [string, string][][]=[
 [['Paciente','S'],['Decidido','D'],['Preciso','C'],['Sociable','I']],
 [['Entusiasta','I'],['Ordenado','C'],['Competitivo','D'],['Leal','S']],
 [['Cuidadoso','C'],['Tranquilo','S'],['Convincente','I'],['Directo','D']],
 [['Atrevido','D'],['Analítico','C'],['Alegre','I'],['Cooperador','S']],
 [['Constante','S'],['Expresivo','I'],['Exigente','D'],['Perfeccionista','C']],
 [['Optimista','I'],['Firme','D'],['Amable','S'],['Reservado','C']],
 [['Metódico','C'],['Comprensivo','S'],['Independiente','D'],['Comunicativo','I']],
 [['Calmado','S'],['Enérgico','D'],['Prudente','C'],['Encantador','I']]
];
export const DISC_INFO: Record<string,{n:string;t:string;c:string}>={
 D:{n:'Dominante',t:'Vas directo a los resultados, decides rápido y te gustan los retos.',c:'En la entrevista muestra que también sabes escuchar y trabajar en equipo.'},
 I:{n:'Influyente',t:'Convences, animas al grupo y te comunicas con facilidad.',c:'Demuestra que eres constante y que cumples con detalles y fechas, no solo con ideas.'},
 S:{n:'Estable',t:'Eres paciente, leal y das tranquilidad al equipo.',c:'Prepara ejemplos donde tomaste la iniciativa o te adaptaste a un cambio.'},
 C:{n:'Cumplido',t:'Eres preciso, ordenado y cuidas la calidad.',c:'Muestra que también decides a tiempo aunque no tengas toda la información.'}
};

export const RAZ: {q:string;big?:string;o:string[];a:number;x?:string}[]=[
 {q:'Pie es a zapato como mano es a…',o:['dedo','guante','brazo','anillo'],a:1},
 {q:'Pincel es a pintor como bisturí es a…',o:['hospital','corte','cirujano','enfermera'],a:2},
 {q:'¿Qué número sigue?',big:'2 · 6 · 12 · 20 · 30 · ?',o:['40','36','44','42'],a:3,x:'Se suma 4, 6, 8, 10 y luego 12.'},
 {q:'¿Qué número sigue?',big:'81 · 27 · 9 · 3 · ?',o:['1','0','2','1.5'],a:0,x:'Cada número se divide entre 3.'},
 {q:'¿Qué número sigue?',big:'3 · 4 · 8 · 17 · 33 · ?',o:['49','66','58','50'],a:2,x:'Se suma 1, 4, 9, 16 y luego 25 (cuadrados).'},
 {q:'Sinónimo de EFÍMERO',o:['eterno','pasajero','frágil','oculto'],a:1},
 {q:'Antónimo de LOCUAZ',o:['hablador','nervioso','callado','sabio'],a:2},
 {q:'¿Qué palabra no pertenece al grupo?',o:['Metáfora','Hipérbole','Párrafo','Símil'],a:2,x:'Las otras tres son figuras retóricas.'},
 {q:'Todos los locutores tienen buena dicción. Ana tiene buena dicción. Por lo tanto…',o:['Ana es locutora','Ana puede ser locutora o no','Ana no es locutora','Todo el que tiene buena dicción es locutor'],a:1,x:'La regla no dice que solo los locutores tengan buena dicción.'},
 {q:'Un video dura 4 min 30 s. Si lo publicas en partes de 45 segundos, ¿cuántas partes salen?',o:['5','7','9','6'],a:3,x:'270 segundos entre 45 = 6.'},
 {q:'3 reporteros escriben 3 notas en 3 horas. ¿Cuántas notas escriben 6 reporteros en 6 horas?',o:['6','9','12','18'],a:2,x:'Cada reportero escribe 1 nota cada 3 horas: 6 reporteros × 2 notas = 12.'},
 {q:'Luis llegó antes que Marta. Pedro llegó después de Marta. Sofía llegó antes que Luis. ¿Quién llegó en tercer lugar?',o:['Luis','Marta','Pedro','Sofía'],a:1,x:'El orden es Sofía, Luis, Marta y Pedro.'},
 {q:'¿Qué letra sigue?',big:'A · C · F · J · O · ?',o:['T','V','U','S'],a:2,x:'Se avanzan 2, 3, 4, 5 y luego 6 letras.'},
 {q:'¿Qué figura sigue?',big:'↑ · → · ↓ · ?',o:['↑','←','↗','↓'],a:1,x:'La flecha gira un cuarto de vuelta cada vez.'},
 {q:'Completa la tabla.',big:'2 4 8 / 3 9 27 / 4 16 ?',o:['32','48','64','20'],a:2,x:'Cada fila multiplica por el primer número: 4 × 4 × 4 = 64.'},
 {q:'"El vocero declaró que la empresa no descarta aumentar sus precios." Esto significa que…',o:['los precios subirán seguro','los precios no subirán','es posible que los precios suban','los precios ya bajaron'],a:2,x:'"No descartar" deja la puerta abierta, pero no lo confirma.'}
];

// k: + conviene estar de acuerdo, - conviene estar en desacuerdo, L = escala de "quedar bien"
export const INT: {q:string;k:string}[]=[
 {q:'Si encuentro un error en mi trabajo, lo reporto aunque nadie lo haya notado.',k:'+'},
 {q:'Llevarse algo pequeño de la oficina no le hace daño a nadie.',k:'-'},
 {q:'Nunca en mi vida he dicho una mentira.',k:'L'},
 {q:'Las reglas se pueden saltar si el resultado final es bueno.',k:'-'},
 {q:'Prefiero avisar que me retrasé antes que inventar una excusa.',k:'+'},
 {q:'Jamás me he enojado con nadie.',k:'L'},
 {q:'Publicar algo sin verificarlo está bien si mucha gente ya lo compartió.',k:'-'},
 {q:'Cumplir el horario es importante aunque el jefe no esté.',k:'+'},
 {q:'Siempre he sido amable con todas las personas, sin excepción.',k:'L'},
 {q:'Usar el trabajo de otra persona sin darle crédito es aceptable si lo mejoro.',k:'-'},
 {q:'Si me equivoco con un cliente, lo admito y busco cómo arreglarlo.',k:'+'},
 {q:'Si un compañero hace trampa, no es asunto mío.',k:'-'}
];
export const LIK=['Muy en desacuerdo','En desacuerdo','Neutral','De acuerdo','Muy de acuerdo'];

export const SIT: {q:string;o:string[];a:number;x:string}[]=[
 {q:'Tu jefe te corrige frente a todo el equipo y sientes que fue injusto.',o:['Le contestas ahí mismo para defenderte','Lo hablas con él en privado más tarde','Te quejas con tus compañeros','Ya no vuelves a dar tu opinión'],a:1,x:'Hablarlo en privado cuida la relación y aclara el problema.'},
 {q:'Llega un compañero nuevo que no entiende el sistema y tú vas atrasado.',o:['Le dices que le pregunte a otra persona','Haces su trabajo para que no se atrase','Le explicas lo básico y acuerdan otro momento para lo demás','Avisas al jefe que no sabe'],a:2,x:'Ayudas sin descuidar lo tuyo.'},
 {q:'Un cliente llega molesto por un error que no fue tuyo.',o:['Lo escuchas, te disculpas en nombre de la empresa y buscas la solución','Le aclaras que no fue tu culpa','Lo mandas con el responsable sin más','Le pides que se calme'],a:0,x:'Para el cliente tú eres la empresa: primero escuchar y resolver.'},
 {q:'Tienes dos entregas el mismo día y no te alcanza el tiempo.',o:['Haces las dos a medias','Entregas una y no dices nada de la otra','Te desvelas sin avisar a nadie','Hablas con tu jefe para decidir cuál va primero'],a:3,x:'Avisar a tiempo y priorizar juntos evita sorpresas.'},
 {q:'Te piden coordinar a un equipo de personas con más edad y experiencia que tú.',o:['Rechazas el puesto','Das órdenes firmes desde el primer día','Te reúnes con ellos, escuchas su experiencia y acuerdan cómo trabajar','Dejas que ellos decidan todo'],a:2,x:'Liderar es escuchar y acordar, sin soltar la responsabilidad.'},
 {q:'Propones una idea en una junta y nadie la apoya.',o:['Preguntas qué les preocupa y la ajustas','Insistes hasta que la acepten','No vuelves a proponer nada','La aplicas por tu cuenta'],a:0,x:'Las objeciones te dan información para mejorar la idea.'},
 {q:'Ves que un compañero publicó un dato equivocado en las redes de la empresa.',o:['Lo corriges en los comentarios para que todos lo vean','Esperas a que alguien más lo note','Le avisas en privado para que lo corrija pronto','Lo reportas a dirección sin hablar con él'],a:2,x:'Rápido y en privado: se corrige el error sin exhibir a nadie.'},
 {q:'Te asignan una tarea que nunca has hecho.',o:['Dices que no sabes y la rechazas','Esperas a que te den instrucciones paso a paso','Se la pasas a alguien que sepa','Investigas, haces un intento y pides retroalimentación'],a:3,x:'Muestra iniciativa y disposición para aprender.'}
];
