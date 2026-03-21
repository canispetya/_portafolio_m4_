import TypeBadge from './TypeBadge';

export default function FeaturedCard({ pokemon, onClick }) {
  if (!pokemon) return null;

  return (
    <div
      className={`featured-card relative flex flex-col md:flex-row rounded-2xl overflow-hidden border-2 border-cyan-400/60 bg-gradient-to-br from-[#0a192f] via-[#020c1b] to-[#0a192f] shadow-[0_0_30px_rgba(0,255,255,0.2)] backdrop-blur-sm cursor-pointer transition-all duration-500 hover:shadow-[0_0_50px_rgba(0,255,255,0.4)] hover:border-cyan-300 ${
        pokemon.isLegendary || pokemon.isMythical ? 'rarity-glow' : ''
      }`}
      onClick={() => onClick(pokemon)}
    >
      {/* Scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none z-[2] rounded-2xl scanlines-effect opacity-30" />

      {/* Image Container */}
      <div className="relative flex-shrink-0 md:w-[35%] flex items-center justify-center p-8 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15)_0%,transparent_70%)] border-b md:border-b-0 md:border-r border-cyan-500/30">
        <img
          src={pokemon.img}
          alt={pokemon.nombre}
          className="relative z-[3] w-[80%] max-w-[250px] drop-shadow-[0_0_15px_rgba(0,255,255,0.5)] animate-float-smooth"
          loading="lazy"
        />
      </div>

      {/* Body */}
      <div className="flex-1 p-6 md:p-8 flex flex-col z-[3] text-[#e6f1ff]">
        {/* Title row */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold capitalize text-cyan-300 tracking-wider drop-shadow-[0_0_8px_rgba(0,255,255,0.5)] font-['Orbitron']">
              {pokemon.nombre}
            </h2>
            <div className="flex flex-wrap gap-2 mt-2 items-center">
              {pokemon.idFmt !== '???' && (
                <span className="px-2 py-0.5 text-[0.7rem] font-mono rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">{pokemon.idFmt}</span>
              )}
              {pokemon.isShiny && (
                <span className="px-2 py-0.5 text-[0.65rem] font-bold rounded-md bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">✨ SHINY</span>
              )}
              {pokemon.isLegendary && (
                <span className="px-2 py-0.5 text-[0.65rem] font-bold rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">🌟 LEGENDARIO</span>
              )}
              {pokemon.isMythical && (
                <span className="px-2 py-0.5 text-[0.65rem] font-bold rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40">✨ MÍTICO</span>
              )}
            </div>
          </div>

          {/* Sound button */}
          {pokemon.soundUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const audio = new Audio(pokemon.soundUrl);
                audio.volume = 0.5;
                audio.play();
              }}
              className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 flex items-center justify-center hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all active:scale-90 cursor-pointer flex-shrink-0"
              title="Reproducir grito"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </button>
          )}
        </div>

        {/* Region */}
        <p className="text-[#64ffda] font-bold font-mono text-sm mb-3">
          📍 [ LOC: {pokemon.region.toUpperCase()} ]
        </p>

        {/* Description */}
        <div className="bg-[rgba(0,20,40,0.6)] border-l-4 border-cyan-400 px-4 py-3 rounded-r-md mb-4 font-mono text-sm text-[#64ffda] leading-relaxed">
          {pokemon.description}
        </div>

        {/* Stats and Info row */}
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex flex-col">
            <span className="text-[0.6rem] text-cyan-400/60 uppercase font-black tracking-tighter">Exp. Base</span>
            <span className="text-sm font-bold text-cyan-200">{pokemon.baseExp || '??'}</span>
          </div>
          {[
            { label: 'HP', val: pokemon.statHp },
            { label: 'ATK', val: pokemon.statAtk },
            { label: 'DEF', val: pokemon.statDef },
            { label: 'SPD', val: pokemon.statSpd },
          ].map(s => (
            <div key={s.label} className="flex flex-col border-l border-cyan-500/30 pl-3">
              <span className="text-[0.6rem] text-cyan-400/60 uppercase font-black tracking-tighter">{s.label}</span>
              <span className="text-sm font-bold text-cyan-200">{s.val}</span>
            </div>
          ))}
        </div>

        {/* Types */}
        <div className="flex gap-2 mb-4">
          {pokemon.types.map(t => (
            <TypeBadge key={t} type={t} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-auto">
          <button className="px-6 py-2.5 text-sm font-bold uppercase tracking-wider rounded-lg border border-cyan-400 text-cyan-300 bg-transparent transition-all duration-300 hover:bg-cyan-500/20 hover:text-white hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] active:scale-95 cursor-pointer">
            INICIAR ANÁLISIS
          </button>
        </div>
      </div>
    </div>
  );
}
