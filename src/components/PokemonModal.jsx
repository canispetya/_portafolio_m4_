import { useEffect, useRef } from 'react';
import TypeBadge from './TypeBadge';
import { typeColors } from '../data/typeColors';

export default function PokemonModal({ pokemon, onClose }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (pokemon) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        overlayRef.current?.classList.add('modal-visible');
        contentRef.current?.classList.add('modal-content-visible');
      });
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [pokemon]);

  const handleClose = () => {
    overlayRef.current?.classList.remove('modal-visible');
    contentRef.current?.classList.remove('modal-content-visible');
    setTimeout(onClose, 300);
  };

  if (!pokemon) return null;

  const MAX_STAT = 255;
  const stats = [
    { name: 'HP', value: pokemon.statHp, color: '#22c55e' },
    { name: 'Ataque', value: pokemon.statAtk, color: '#ef4444' },
    { name: 'Defensa', value: pokemon.statDef, color: '#3b82f6' },
    { name: 'Vel.', value: pokemon.statSpd, color: '#eab308' },
    { name: 'At. Esp.', value: pokemon.statSpAtk, color: '#a855f7' },
    { name: 'Def. Esp.', value: pokemon.statSpDef, color: '#06b6d4' },
  ];

  const borderColor = typeColors[pokemon.types[0]] || '#999';

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/0 backdrop-blur-0 transition-all duration-300 modal-overlay"
      onClick={handleClose}
    >
      <div
        ref={contentRef}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-br from-red-900 via-red-800 to-red-950 border-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.8)] modal-content transform translate-y-8 opacity-0 transition-all duration-300 custom-scrollbar"
        style={{ borderColor }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 text-white/80 flex items-center justify-center hover:bg-black/60 hover:text-white transition-all cursor-pointer"
        >
          ✕
        </button>

        {/* Pokemon image header */}
        <div
          className="relative flex justify-center pt-8 pb-4"
          style={{ background: `linear-gradient(180deg, ${borderColor}33 0%, transparent 100%)` }}
        >
          <img
            src={pokemon.img}
            alt={pokemon.nombre}
            className="w-48 h-48 object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-float-smooth"
          />
        </div>

        {/* Body */}
        <div className="px-6 pb-6 space-y-4">
          {/* Name & ID */}
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-extrabold capitalize tracking-wide font-['Orbitron']">{pokemon.nombre}</h3>
            <span className="text-gray-300 font-mono text-lg">{pokemon.idFmt}</span>
          </div>

          {/* Types */}
          <div className="flex gap-2">
            {pokemon.types.map(t => (
              <TypeBadge key={t} type={t} />
            ))}
          </div>

          {/* Physical */}
          <div className="flex gap-6 text-sm">
            <div><span className="text-gray-400">Altura:</span> <span className="font-semibold">{pokemon.height}</span></div>
            <div><span className="text-gray-400">Peso:</span> <span className="font-semibold">{pokemon.weight}</span></div>
          </div>

          {/* Stats */}
          <div className="bg-black/30 rounded-xl p-4 space-y-2.5">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-3">Estadísticas Base</h4>
            {stats.map((s) => (
              <div key={s.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{s.name}</span>
                  <span className="font-bold" style={{ color: s.color }}>{s.value}</span>
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out stat-bar-animate"
                    style={{
                      width: `${(s.value / MAX_STAT) * 100}%`,
                      backgroundColor: s.color,
                      boxShadow: `0 0 8px ${s.color}80`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Extra Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-black/20 rounded-lg p-3">
              <div className="text-gray-400 text-[0.7rem] uppercase tracking-wider mb-1">Habilidades</div>
              <div className="space-y-1">
                {pokemon.abilities.map(a => (
                  <span key={a.name} className="block capitalize text-white/90 text-[0.8rem]">
                    {a.name} {a.isHidden && <span className="text-red-400 text-[0.65rem]">(Oculta)</span>}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <div className="text-gray-400 text-[0.7rem] uppercase tracking-wider mb-1">Grupos Huevo</div>
              <div className="capitalize text-white/90 text-[0.8rem]">{pokemon.eggGroups.join(' / ') || 'Desconocido'}</div>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <div className="text-gray-400 text-[0.7rem] uppercase tracking-wider mb-1">Crecimiento</div>
              <div className="capitalize text-white/90 text-[0.8rem]">{pokemon.growthRate}</div>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <div className="text-gray-400 text-[0.7rem] uppercase tracking-wider mb-1">Captura</div>
              <div className="text-white/90 text-[0.8rem]">{pokemon.captureRate} <span className="text-gray-500 text-[0.65rem]">(1-255)</span></div>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <div className="text-gray-400 text-[0.7rem] uppercase tracking-wider mb-1">Exp. Base</div>
              <div className="text-white/90 text-[0.8rem]">{pokemon.baseExp}</div>
            </div>
            <div className="bg-black/20 rounded-lg p-3">
              <div className="text-gray-400 text-[0.7rem] uppercase tracking-wider mb-1">Hábitat</div>
              <div className="capitalize text-white/90 text-[0.8rem]">{pokemon.habitat}</div>
            </div>
            {pokemon.heldItems.length > 0 && (
              <div className="bg-black/20 rounded-lg p-3 col-span-2">
                <div className="text-gray-400 text-[0.7rem] uppercase tracking-wider mb-1">Objetos Equipados</div>
                <div className="capitalize text-white/90 text-[0.8rem]">{pokemon.heldItems.join(', ')}</div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-black/20 rounded-xl p-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-2">📖 Descripción</h4>
            <p className="text-gray-200 text-sm leading-relaxed italic">{pokemon.description}</p>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="w-full py-3 text-sm font-bold uppercase tracking-wider rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg transition-all hover:from-blue-500 hover:to-indigo-600 hover:shadow-xl active:scale-[0.98] cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
