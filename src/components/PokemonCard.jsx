import TypeBadge from './TypeBadge';
import { typeBgColors, typeColors } from '../data/typeColors';

export default function PokemonCard({ pokemon, onClick, index = 0 }) {
  const t1 = pokemon.types[0];
  const t2 = pokemon.types.length > 1 ? pokemon.types[1] : null;

  const rgb1 = typeBgColors[t1] || typeBgColors.normal;
  const rgb2 = t2 ? (typeBgColors[t2] || typeBgColors.normal) : null;

  const bgStyle = rgb2
    ? { background: `linear-gradient(135deg, ${rgb1[0]} 0%, ${rgb1[1]} 45%, ${rgb2[0]} 55%, ${rgb2[1]} 100%)` }
    : { background: `linear-gradient(135deg, ${rgb1[0]}, ${rgb1[1]})` };

  const borderColor = typeColors[t1] || '#999';

  const isRarity = pokemon.isLegendary || pokemon.isMythical;

  const stageClasses = {
    basic: 'bg-gray-200 text-gray-600 border-gray-300',
    stage1: 'bg-sky-200 text-sky-700 border-sky-400',
    stage2: 'bg-indigo-500 text-white border-indigo-600',
    mega: 'bg-gradient-to-r from-orange-400 to-red-500 text-white border-orange-500',
  };

  return (
    <div
      className="pokemon-card-enter group"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div
        className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-400 hover:shadow-2xl hover:-translate-y-3 hover:scale-[1.03] ${
          isRarity ? 'rarity-glow' : ''
        }`}
        style={bgStyle}
        onClick={() => onClick(pokemon)}
      >
        {/* Shiny sparkle */}
        {pokemon.isShiny && (
          <div className="absolute top-3 left-3 z-10 text-xl animate-bounce-slow">✨</div>
        )}

        {/* Pokemon Image */}
        <div className="relative pt-4 px-4 pb-0 flex justify-center">
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-8 rounded-[50%] opacity-20 blur-md"
            style={{ backgroundColor: borderColor }}
          />
          <img
            src={pokemon.img}
            alt={pokemon.nombre}
            className="relative z-[1] w-40 h-40 object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-115 group-hover:drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
            loading="lazy"
          />
        </div>

        {/* Divider */}
        <div className="h-[3px] mx-4" style={{ background: `linear-gradient(90deg, transparent, ${borderColor}, transparent)` }} />

        {/* Body */}
        <div className="p-4 text-center space-y-2">
          {/* Name */}
          <h3 className="text-xl font-bold capitalize text-gray-800 tracking-wide font-['Orbitron'] leading-tight">
            {pokemon.nombre}
          </h3>

          {/* Badges row */}
          <div className="flex flex-wrap justify-center gap-1.5 items-center">
            {pokemon.idFmt !== '???' && (
              <span className="px-2 py-0.5 text-[0.65rem] font-mono font-bold rounded-md bg-gray-800 text-white/80">{pokemon.idFmt}</span>
            )}
            {pokemon.evolutionStage !== 'Desconocido' && (
              <span className={`px-2 py-0.5 text-[0.6rem] font-bold rounded-md border ${stageClasses[pokemon.stageType] || stageClasses.basic}`}>
                {pokemon.evolutionStage}
              </span>
            )}
            {pokemon.isShiny && (
              <span className="px-2 py-0.5 text-[0.6rem] font-bold rounded-md bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-sm">SHINY</span>
            )}
          </div>

          {/* Rarity */}
          {pokemon.isLegendary && (
            <span className="inline-block px-3 py-1 text-[0.65rem] font-bold rounded-full bg-gradient-to-r from-yellow-400 to-amber-600 text-white shadow-md animate-pulse-soft">🌟 LEGENDARIO</span>
          )}
          {pokemon.isMythical && (
            <span className="inline-block px-3 py-1 text-[0.65rem] font-bold rounded-full bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 text-white shadow-md animate-pulse-soft">✨ MÍTICO</span>
          )}

          {/* Region */}
          <p className="text-[0.75rem] font-semibold text-gray-700">
            📍 {pokemon.region}
          </p>

          {/* Types */}
          <div className="flex justify-center gap-2 pt-1">
            {pokemon.types.map(t => (
              <TypeBadge key={t} type={t} />
            ))}
          </div>

          {/* Action button */}
          <button className="mt-3 px-6 py-2 text-[0.75rem] font-bold uppercase tracking-wider rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md transition-all duration-300 hover:from-blue-500 hover:to-indigo-600 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 cursor-pointer">
            Ver más
          </button>
        </div>
      </div>
    </div>
  );
}
