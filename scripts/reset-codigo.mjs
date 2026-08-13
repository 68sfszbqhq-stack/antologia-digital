// Le genera un código nuevo a un alumno que perdió el suyo.
//
//   node scripts/reset-codigo.mjs 2024001
//
// Esto va a pasar, y va a pasar en medio de la clase. El código anterior deja
// de servir en ese momento; los intentos que el alumno ya haya entregado no se
// tocan.

import { conectar, generarCodigo, correoDeMatricula } from "./_admin.mjs";
import { normalizarMatricula } from "../src/lib/matricula.mjs";

const matricula = normalizarMatricula(process.argv[2] ?? "");

if (!matricula) {
  console.error("\nUso:  node scripts/reset-codigo.mjs <matricula>\n");
  process.exit(1);
}

const { auth, db } = conectar();

let ficha;
try {
  const snap = await db.collection("alumnos").doc(matricula).get();
  if (!snap.exists) {
    console.error(`\n✗ No hay ningún alumno con la matrícula ${matricula}.`);
    console.error("  Revisa que esté bien escrita, o dalo de alta con alta-alumnos.mjs\n");
    process.exit(1);
  }
  ficha = snap.data();
} catch (e) {
  console.error(`\n✗ No pude consultar la base de datos: ${e.message}\n`);
  process.exit(1);
}

const codigo = generarCodigo();

try {
  await auth.updateUser(matricula, { password: codigo });
} catch (e) {
  if (e.code === "auth/user-not-found") {
    // La ficha existe pero la cuenta no: se recrea para dejarlo consistente.
    await auth.createUser({ uid: matricula, email: correoDeMatricula(matricula), password: codigo });
  } else {
    console.error(`\n✗ No pude cambiar el código: ${e.message}\n`);
    process.exit(1);
  }
}

console.log(`
✓ Código nuevo para ${ficha.nombre}  (${ficha.grupo})

     matrícula:  ${matricula}
     código:     ${codigo}

  El código anterior ya no funciona. Sus calificaciones siguen intactas.
`);
