// src/components/GlobalStudyTimer.tsx
import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

type Props = {
  /** Inactividad permitida antes de dejar de contar (ms). Ej: 45s */
  idleMs?: number;
  /** Cada cuánto “late” el contador (ms). Ej: 5s */
  tickMs?: number;
  /** NO necesario ya: escribimos al minuto; dejamos por si quieres tunear */
  flushMs?: number;
  /**
   * Callback opcional para que tu app refleje el tiempo localmente.
   * Se llama SOLO cuando se acumula 1 o más minutos.
   */
  onAccumulated?: (minutes: number) => void;
};

export default function GlobalStudyTimer({
  idleMs = 45_000,
  tickMs = 5_000,
  flushMs = 60_000,
  onAccumulated,
}: Props) {
  const lastActiveRef = useRef<number>(Date.now());
  const secBucketRef = useRef<number>(0); // segundos acumulados sin flushear

  useEffect(() => {
    // Marcar actividad
    const markActive = () => (lastActiveRef.current = Date.now());

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach((e) => window.addEventListener(e, markActive, { passive: true }));

    const tick = setInterval(async () => {
      const now = Date.now();
      const idle = now - lastActiveRef.current;

      // Si NO está inactivo, contamos tickMs en segundos
      if (idle < idleMs) {
        secBucketRef.current += tickMs / 1000;

        // ¿Se cumplieron minutos completos?
        if (secBucketRef.current >= 60) {
          const mins = Math.floor(secBucketRef.current / 60);
          secBucketRef.current -= mins * 60;

          // 1) Avisar a la app (para que actualices tu UI local)
          if (onAccumulated) {
            try {
              onAccumulated(mins);
            } catch {
              /* no-op */
            }
          }

          // 2) Intentar persistir en Supabase
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return; // sin sesión -> no escribimos en BD

            // Leer estudio actual
            const { data: row } = await supabase
              .from('user_progress')
              .select('study_time')
              .eq('user_id', user.id)
              .maybeSingle();

            const current = Number(row?.study_time ?? 0);
            const next = current + mins;

            await supabase.from('user_progress').upsert({
              user_id: user.id,
              study_time: next,            // tiempo en MINUTOS
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });

            // Log opcional (no bloqueante)
            await supabase.from('activity_logs').insert({
              user_id: user.id,
              action: `Estudió ${mins} min`,
              item: 'Tiempo de estudio',
              type: 'system',
              created_at: new Date().toISOString(),
            });
          } catch (e) {
            // si falla, seguimos contando y lo verás en UI local
            console.warn('No se pudo guardar tiempo en Supabase:', e);
          }
        }
      }
    }, tickMs);

    // Limpieza
    return () => {
      clearInterval(tick);
      events.forEach((e) => window.removeEventListener(e, markActive));
    };
  }, [idleMs, tickMs, flushMs, onAccumulated]);

  return null; // componente invisible
}
