import React, { useState } from 'react';
import {
  signInWithEmailAndPassword, sendPasswordResetEmail, setPersistence,
  browserLocalPersistence, GoogleAuthProvider, signInWithPopup, signInWithRedirect,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

/* La pantalla de entrada de los paneles del profesor (/coordinacion y
 * /calificaciones). Vive aparte para que las dos puertas se comporten igual.
 * La seguridad no está aquí sino en firestore.rules: esto solo abre sesión. */

const caja = 'glass-card rounded-2xl border border-white/10';

export default function EntradaProfesor({ titulo, error }) {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [msg, setMsg] = useState('');
  const [ocupado, setOcupado] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setOcupado(true);
    setMsg('');
    try {
      await setPersistence(auth(), browserLocalPersistence);
      await signInWithEmailAndPassword(auth(), correo.trim(), clave);
    } catch (err) {
      setMsg(
        err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password'
          ? 'Correo o contraseña incorrectos.'
          : `No se pudo entrar (${err?.code ?? err}).`,
      );
      setOcupado(false);
    }
  };

  const campo = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50 transition';

  return (
    <div className={`${caja} p-8 max-w-md mx-auto`}>
      <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest block mb-2">
        // Acceso restringido
      </span>
      <h1 className="text-2xl font-bold text-white mb-2">{titulo}</h1>
      <p className="text-sm text-slate-400 mb-6">
        Entra con la cuenta de profesor. Sin ella, las reglas de seguridad no
        devuelven ni un dato.
      </p>

      {/* La cuenta del profesor quedó vinculada a Google sobre el mismo UID, así
          que este botón entra igual que el correo y la contraseña. Va primero
          porque es el camino sin nada que recordar. */}
      <button
        type="button"
        disabled={ocupado}
        onClick={async () => {
          setOcupado(true);
          setMsg('');
          try {
            await setPersistence(auth(), browserLocalPersistence);
            const prov = new GoogleAuthProvider();
            prov.setCustomParameters({ prompt: 'select_account' });
            try {
              await signInWithPopup(auth(), prov);
            } catch (e) {
              // Igual que del lado del alumno: si el navegador bloquea la
              // ventanita, se cae a redirección en vez de dejarlo varado.
              const codigo = e?.code ?? '';
              if (codigo === 'auth/popup-blocked'
                  || codigo === 'auth/operation-not-supported-in-this-environment') {
                await signInWithRedirect(auth(), prov);
                return;
              }
              throw e;
            }
          } catch (e) {
            setMsg(`No se pudo entrar con Google (${e?.code ?? e}).`);
            setOcupado(false);
          }
        }}
        className="w-full inline-flex items-center justify-center gap-3 rounded-xl bg-white text-slate-800 font-semibold px-6 py-3.5 hover:bg-slate-100 disabled:opacity-60 transition mb-5"
      >
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.2-.4-4.7H24v9h11.8c-.5 2.7-2 5-4.4 6.6v5.5h7.1c4.2-3.8 6.6-9.5 6.6-16.4z"/>
          <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41.2 15.5 46 24 46z"/>
          <path fill="#FBBC05" d="M11.8 28.3c-.4-1.3-.7-2.7-.7-4.3s.3-2.9.7-4.3v-5.7H4.5C2.9 17.2 2 20.5 2 24s.9 6.8 2.5 9.7l7.3-5.4z"/>
          <path fill="#EA4335" d="M24 10.7c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.1 29.9 2 24 2 15.5 2 8.1 6.8 4.5 14.3l7.3 5.7c1.7-5.2 6.5-9.3 12.2-9.3z"/>
        </svg>
        {ocupado ? 'Abriendo Google…' : 'Entrar con Google'}
      </button>

      <div className="flex items-center gap-3 mb-5">
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-[11px] font-mono-tech text-slate-600">o con contraseña</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <form onSubmit={enviar} className="space-y-4" noValidate>
        <input type="email" required value={correo} onChange={(e) => setCorreo(e.target.value)}
               placeholder="Correo" autoComplete="username" className={campo} />
        <input type="password" required value={clave} onChange={(e) => setClave(e.target.value)}
               placeholder="Contraseña" autoComplete="current-password" className={campo} />
        {(msg || error) && (
          <p className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
            {msg || error}
          </p>
        )}
        <button type="submit" disabled={ocupado} className="btn-primary w-full justify-center py-3 disabled:opacity-50">
          {ocupado ? 'Entrando…' : 'Entrar'}
        </button>
      </form>

      <button
        type="button"
        onClick={async () => {
          if (!correo.trim()) { setMsg('Escribe tu correo arriba y vuelve a tocar aquí.'); return; }
          try {
            await sendPasswordResetEmail(auth(), correo.trim());
            setMsg(`Te mandé un correo a ${correo.trim()} para restablecer la contraseña.`);
          } catch (e) {
            setMsg(`No se pudo enviar (${e?.code ?? e}).`);
          }
        }}
        className="text-xs font-mono-tech text-slate-500 hover:text-cyan-400 transition mt-5 block mx-auto"
      >
        Olvidé mi contraseña
      </button>

      <p className="text-[11px] text-slate-600 leading-relaxed mt-5 text-center">
        Cualquiera de los dos caminos sirve, siempre que sea la cuenta del
        profesor: las reglas reconocen esa identidad, no el correo.
      </p>
    </div>
  );
}
