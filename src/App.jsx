import { useEffect, useState, useCallback } from 'react';
import { usePokemon } from './hooks/usePokemon';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import FeaturedCard from './components/FeaturedCard';
import PokemonCard from './components/PokemonCard';
import PokemonModal from './components/PokemonModal';
import SkeletonCard from './components/SkeletonCard';

export default function App() {
  const {
    pokemon,
    featured,
    loading,
    error,
    searchResult,
    isSearching,
    loadPokedex,
    searchByName,
    clearSearch,
  } = usePokemon();

  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    loadPokedex();
  }, [loadPokedex]);

  const handleCardClick = useCallback((p) => {
    setSelectedPokemon(p);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedPokemon(null);
  }, []);

  const displayPokemon = searchResult ? [searchResult] : pokemon;
  const showFeatured = !searchResult && featured && !loading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white relative overflow-hidden">
      {/* Ambient background particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[15%] w-64 h-64 bg-red-500/5 rounded-full blur-3xl animate-float-bg" />
        <div className="absolute top-[60%] right-[10%] w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-float-bg" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[20%] left-[40%] w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-float-bg" style={{ animationDelay: '4s' }} />
      </div>

      {/* Main Pokédex Shell */}
      <div className="relative z-10 max-w-5xl mx-auto my-4 md:my-8">
        <div className="pokedex-shell bg-gradient-to-b from-red-700 via-red-800 to-red-950 rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.7),inset_0_2px_0_rgba(255,255,255,0.1)] border-4 border-red-950/80 overflow-hidden transition-transform duration-500 hover:shadow-[0_25px_90px_rgba(0,0,0,0.8)]">
          
          {/* Header */}
          <Header onReload={loadPokedex} />

          {/* Screen */}
          <div className="m-4 md:m-6 rounded-2xl bg-gray-300 p-4 md:p-6 shadow-[inset_0_0_30px_rgba(0,0,0,0.4)] rounded-bl-[40px]">
            <div className="bg-gray-950 rounded-xl p-4 md:p-6 border-[6px] border-gray-900 shadow-[inset_0_0_40px_rgba(0,0,0,0.9)] min-h-[500px]">
              
              {/* Search area */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <p className="text-gray-500 text-sm font-['Inter']">
                  Pokédex interactiva • React + Vite + PokeAPI
                </p>
                <SearchBar
                  onSearch={searchByName}
                  onClear={clearSearch}
                  isSearching={isSearching}
                />
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-shake">
                  ⚠️ {error}
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              )}

              {/* Content */}
              {!loading && (
                <>
                  {/* Featured Card */}
                  {showFeatured && (
                    <div className="mb-6 pokemon-card-enter">
                      <FeaturedCard pokemon={featured} onClick={handleCardClick} />
                    </div>
                  )}

                  {/* Search result message */}
                  {searchResult && (
                    <div className="mb-4 text-center">
                      <span className="text-cyan-400 text-sm font-['Inter']">
                        Resultado para la búsqueda:
                      </span>
                    </div>
                  )}

                  {/* Grid */}
                  {displayPokemon.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {displayPokemon.map((p, i) => (
                        <PokemonCard
                          key={p.id}
                          pokemon={p}
                          onClick={handleCardClick}
                          index={i}
                        />
                      ))}
                    </div>
                  ) : !searchResult && !error && (
                    <div className="text-center py-12 text-gray-500">
                      <p className="text-lg">No se encontraron Pokémon</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Bottom Pokédex buttons */}
          <div className="flex items-center justify-around px-8 py-5 bg-gradient-to-r from-red-950 via-red-900 to-red-950 border-t-4 border-black/40">
            <button className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-900 border-2 border-gray-700 text-gray-400 font-bold shadow-[2px_2px_8px_rgba(0,0,0,0.8),inset_-2px_-2px_5px_rgba(0,0,0,0.5),inset_2px_2px_4px_rgba(255,255,255,0.1)] active:scale-95 transition-transform cursor-pointer">
              B
            </button>

            {/* D-Pad */}
            <div className="relative w-20 h-20">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-700 border-2 border-gray-500 hover:bg-gray-600 transition-colors cursor-pointer rounded-t-sm" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-700 border-2 border-gray-500 hover:bg-gray-600 transition-colors cursor-pointer rounded-b-sm" />
              <div className="absolute top-1/2 left-0 -translate-y-1/2 w-6 h-6 bg-gray-700 border-2 border-gray-500 hover:bg-gray-600 transition-colors cursor-pointer rounded-l-sm" />
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-6 h-6 bg-gray-700 border-2 border-gray-500 hover:bg-gray-600 transition-colors cursor-pointer rounded-r-sm" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-gray-800 border-2 border-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <PokemonModal pokemon={selectedPokemon} onClose={handleCloseModal} />
    </div>
  );
}
