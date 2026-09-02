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

// Proyecto "Antologia Digital" (antologia-digital).
// Se obtiene con: firebase apps:sdkconfig WEB --project antologia-digital
export const configFirebase = {
  apiKey: "AIzaSyD5uDyzuiqHVATRRApiwOcJDRaRXrqB8bk",
  authDomain: "antologia-digital.firebaseapp.com",
  projectId: "antologia-digital",
  storageBucket: "antologia-digital.firebasestorage.app",
  messagingSenderId: "964976077150",
  appId: "1:964976077150:web:9ec8d96c61899fb2acc7cf",
};

/** ¿Ya quedó configurado, o siguen los valores de ejemplo? */
export function firebaseConfigurado(): boolean {
  return !Object.values(configFirebase).some((v) => v.includes("PEGAR_AQUI"));
}
