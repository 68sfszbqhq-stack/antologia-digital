// Conexión con Firebase.
//
// Este proyecto se sigue publicando en GitHub Pages. Firebase entra solo como
// base de datos (Firestore) e identidad (Authentication); no hay servidor
// propio y no se usa Firebase Hosting.
//
// La configuración a pegar NO está aquí, sino en firebase-config.ts.

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { configFirebase, firebaseConfigurado } from "./firebase-config";

export { configFirebase, firebaseConfigurado };

let app: FirebaseApp | null = null;

function appFirebase(): FirebaseApp {
  if (app) return app;
  app = getApps().length ? getApps()[0]! : initializeApp(configFirebase);
  return app;
}

export function auth(): Auth {
  return getAuth(appFirebase());
}

export function db(): Firestore {
  return getFirestore(appFirebase());
}

/** El dominio interno de los correos sintéticos. El alumno nunca lo ve. */
export const DOMINIO_INTERNO = "antologia.local";
