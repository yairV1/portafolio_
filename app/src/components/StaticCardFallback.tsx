import { profile } from '../data/content';
import { asset } from '../lib/asset';

/**
 * Fallback estático (sin WebGL / prefers-reduced-motion): el mismo carné,
 * sin física ni arrastre, con una cinta dibujada en CSS.
 */
export function StaticCardFallback() {
  return (
    <div className="relative flex h-full w-full items-start justify-center pt-6">
      <div className="flex flex-col items-center">
        <div className="h-28 w-10 rounded-b-full bg-gradient-to-b from-[#171126] to-[#221a3d]" />
        <div
          style={{ width: 300 }}
          className="-mt-2 flex select-none flex-col rounded-[22px] border border-white/10 bg-gradient-to-br from-[#1a1330] via-[#221a3d] to-[#140f24] p-5 shadow-2xl"
        >
          <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent-border bg-accent-soft text-sm font-bold text-accent">
              YV
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-text-dim">
                Identificación
              </div>
              <div className="text-xs font-semibold text-text-muted">{profile.role}</div>
            </div>
          </div>

          <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-accent-border">
            <img
              src={asset('img/yotas.png')}
              alt={`Foto de perfil de ${profile.name}`}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="text-center">
            <div className="text-lg font-bold text-text">{profile.name}</div>
            <div className="text-xs text-accent">Web Developer</div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[9px] text-text-dim">
            <span>Miembro desde {profile.memberSince}</span>
            <span>{profile.memberId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
