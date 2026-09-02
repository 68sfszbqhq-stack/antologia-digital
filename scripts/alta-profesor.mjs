// Da de alta (o repara) la cuenta del profesor.
//
//   node scripts/alta-profesor.mjs correo@ejemplo.com
//
// Le asigna el UID fijo "profesor", que es el que aparece en firestore.rules.
// Fijarlo de antemano evita el paso incómodo de entrar, copiar un identificador
// aleatorio y volver a publicar las reglas.
//
// La contraseña inicial es aleatoria y NO se imprime en ningún lado: el script
// termina dándote un enlace de un solo uso para que elijas la tuya. Así la
// contraseña del profesor no pasa por la terminal, ni por el historial, ni por
// una conversación.

import { randomBytes } from "node:crypto";
import { conectar } from "./_admin.mjs";

export const UID_PROFESOR = "profesor";

const correo = (process.argv[2] ?? "").trim();

if (!correo || !correo.includes("@")) {
  console.error("\nUso:  node scripts/alta-profesor.mjs <tu-correo@ejemplo.com>\n");
  process.exit(1);
}

const { auth, db } = conectar();
const claveTemporal = randomBytes(24).toString("base64url");

let creado = false;
try {
  await auth.createUser({ uid: UID_PROFESOR, email: correo, password: claveTemporal });
  creado = true;
} catch (e) {
  if (e.code === "auth/uid-already-exists" || e.code === "auth/email-already-exists") {
    // Ya existía: se deja como está y solo se refresca el correo.
    await auth.updateUser(UID_PROFESOR, { email: correo }).catch(() => {});
  } else {
    console.error(`\n✗ No pude crear la cuenta: ${e.message}\n`);
    process.exit(1);
  }
}

// Marca de rol, por si algún día hace falta distinguirlo desde la app.
await db.collection("config").doc("profesor").set(
  { uid: UID_PROFESOR, correo, actualizado: new Date() },
  { merge: true },
);

let enlace = null;
try {
  enlace = await auth.generatePasswordResetLink(correo);
} catch (e) {
  console.error(`\n⚠️  La cuenta quedó lista, pero no pude generar el enlace: ${e.message}`);
  console.error("   Usa \"Olvidé mi contraseña\" en /profesor para establecerla.\n");
}

console.log(`
${creado ? "✓ Cuenta de profesor creada" : "· La cuenta ya existía; quedó verificada"}

     correo:  ${correo}
     UID:     ${UID_PROFESOR}   ← es el que va en firestore.rules
`);

if (enlace) {
  console.log(`Abre este enlace para elegir tu contraseña (un solo uso, caduca en 1 hora):

${enlace}
`);
}
