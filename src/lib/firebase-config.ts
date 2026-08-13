// La configuración del proyecto de Firebase, sola y sin dependencias.
//
// Vive aparte de firebase.ts a propósito: así las páginas pueden preguntar en
// tiempo de construcción si Firebase ya está configurado, sin arrastrar el SDK
// completo al build. Eso es lo que permite que el texto que ve el alumno diga la
// verdad en cada caso.
//
// Esta apiKey es PÚBLICA por diseño y no es una fuga: solo identifica al
// proyecto, no abre nada por sí sola. La seguridad real vive en firestore.rules.
// Lo secreto es serviceAccountKey.json, que está gitignoreado.

// ⚠️ PEGAR AQUÍ la configuración del proyecto.
// Consola de Firebase → ⚙️ Configuración del proyecto → Tus apps → Config.
export const configFirebase = {
  apiKey: "PEGAR_AQUI",
  authDomain: "antologia-digital.firebaseapp.com",
  projectId: "antologia-digital",
  storageBucket: "antologia-digital.firebasestorage.app",
  messagingSenderId: "PEGAR_AQUI",
  appId: "PEGAR_AQUI",
};

/** ¿Ya quedó configurado, o siguen los valores de ejemplo? */
export function firebaseConfigurado(): boolean {
  return !Object.values(configFirebase).some((v) => v.includes("PEGAR_AQUI"));
}
