export default function Header({ onReload }) {
  return (
    <header className="relative flex items-center justify-between px-6 py-5 bg-gradient-to-r from-red-900 via-red-800 to-red-900 border-b-4 border-black/40 rounded-t-3xl">
      {/* Left: Logo + Lights */}
      <div className="flex items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-widest drop-shadow-[0_0_15px_rgba(255,60,60,0.8)] font-['Orbitron']">
          Pokédex
        </h1>
        <div className="flex items-center gap-3">
          {/* Main LED */}
          <div className="w-10 h-10 rounded-full bg-red-500 border-[3px] border-white/80 shadow-[0_0_20px_rgba(255,0,0,0.8),inset_-3px_-3px_8px_rgba(100,0,0,0.8),inset_3px_3px_8px_rgba(255,200,200,0.6)] animate-led-pulse" />
          {/* Small LEDs */}
          <div className="w-5 h-5 rounded-full bg-yellow-400 border-2 border-white/70 shadow-[0_0_10px_rgba(255,204,0,0.7)] animate-led-glow" style={{ animationDelay: '0.3s' }} />
          <div className="w-5 h-5 rounded-full bg-green-400 border-2 border-white/70 shadow-[0_0_10px_rgba(0,204,0,0.7)] animate-led-glow" style={{ animationDelay: '0.6s' }} />
        </div>
      </div>

      {/* Right: Reload button */}
      <button
        onClick={onReload}
        className="group w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 border-[3px] border-white/80 shadow-[0_0_15px_rgba(0,150,255,0.5)] flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,150,255,0.8)] hover:scale-110 active:scale-90 cursor-pointer"
        title="Escanear nuevos Pokémon"
      >
        <svg className="w-6 h-6 text-white transition-transform duration-500 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </header>
  );
}
