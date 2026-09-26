import type { AcentoLyC } from "./tipos";

// Clases completas y escritas tal cual: Tailwind solo genera las que encuentra
// literalmente en el código, así que no se pueden armar con `text-${color}-400`.
export const coloresLyC: Record<AcentoLyC, { texto: string; borde: string; fondo: string; chip: string }> = {
  amber:   { texto: "text-amber-400",   borde: "border-amber-500/30",   fondo: "bg-amber-500/5",   chip: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  rose:    { texto: "text-rose-400",    borde: "border-rose-500/30",    fondo: "bg-rose-500/5",    chip: "text-rose-400 bg-rose-500/10 border-rose-500/30" },
  sky:     { texto: "text-sky-400",     borde: "border-sky-500/30",     fondo: "bg-sky-500/5",     chip: "text-sky-400 bg-sky-500/10 border-sky-500/30" },
  emerald: { texto: "text-emerald-400", borde: "border-emerald-500/30", fondo: "bg-emerald-500/5", chip: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
  violet:  { texto: "text-violet-400",  borde: "border-violet-500/30",  fondo: "bg-violet-500/5",  chip: "text-violet-400 bg-violet-500/10 border-violet-500/30" },
};
