import { useState, useCallback, useRef } from 'react';
import {
  fetchPokemon,
  fetchSpecies,
  fetchEvolutionChain,
  normalizePokemon,
  searchPokemon,
} from '../api/pokeapi';
import {
  legendariosFijos,
  miticosFijos,
  megasFijas,
  regionalesFijas,
  dinamaxFijos,
} from '../data/typeColors';

const NUM_POKEMON = 10;
const MAX_ID = 1025;

function generateRandomIds(count, maxId) {
  const ids = new Set();
  ids.add(legendariosFijos[Math.floor(Math.random() * legendariosFijos.length)]);
  ids.add(miticosFijos[Math.floor(Math.random() * miticosFijos.length)]);
  ids.add(megasFijas[Math.floor(Math.random() * megasFijas.length)]);
  ids.add(regionalesFijas[Math.floor(Math.random() * regionalesFijas.length)]);
  ids.add(dinamaxFijos[Math.floor(Math.random() * dinamaxFijos.length)]);

  while (ids.size < count) {
    let id;
    if (Math.random() < 0.2) {
      id = Math.floor(Math.random() * (10277 - 10001 + 1)) + 10001;
    } else {
      id = Math.floor(Math.random() * maxId) + 1;
    }
    ids.add(id);
  }

  const arr = Array.from(ids);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function usePokemon() {
  const [pokemon, setPokemon] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const cacheRef = useRef([]);

  const loadPokedex = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setSearchResult(null);
      setFilterQuery('');

      const ids = generateRandomIds(NUM_POKEMON, MAX_ID);
      const [pokemonData, speciesData] = await Promise.all([
        Promise.all(ids.map(fetchPokemon)),
        Promise.all(ids.map(fetchSpecies)),
      ]);

      const evolutionData = await Promise.all(
        speciesData.map(s =>
          s?.evolution_chain?.url ? fetchEvolutionChain(s.evolution_chain.url) : null
        )
      );

      pokemonData.forEach((p, i) => {
        p.evolutionChainData = evolutionData[i];
      });

      const idxFeatured = Math.floor(Math.random() * ids.length);
      const normalIndices = [];
      for (let i = 0; i < ids.length; i++) {
        if (i !== idxFeatured) normalIndices.push(i);
      }
      const idxShiny = normalIndices[Math.floor(Math.random() * normalIndices.length)];

      const normalized = pokemonData.map((p, i) => {
        let isShiny = false;
        if (i === idxFeatured) isShiny = Math.random() < 0.1;
        else if (i === idxShiny) isShiny = true;
        return normalizePokemon(p, speciesData[i], isShiny);
      });

      cacheRef.current = normalized;
      setFeatured(normalized[idxFeatured]);
      setPokemon(normalized.filter((_, i) => i !== idxFeatured));
    } catch (e) {
      console.error(e);
      setError('Error de red: no fue posible obtener datos de la PokeAPI.');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchByName = useCallback(async (query) => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      setSearchResult(null);
      return;
    }

    // First, check if it's already in the local cache to avoid API call
    const localMatch = cacheRef.current.find(p => 
      p.nombre.toLowerCase() === trimmed || p.idFmt === `#${trimmed.padStart(3, '0')}` || p.id.toString() === trimmed
    );
    
    if (localMatch) {
      setSearchResult(localMatch);
      setError(null);
      return;
    }

    try {
      setIsSearching(true);
      setError(null);

      const pData = await searchPokemon(trimmed);
      const pSpecies = await fetchSpecies(pData.id);

      let pEvoData = null;
      if (pSpecies?.evolution_chain?.url) {
        pEvoData = await fetchEvolutionChain(pSpecies.evolution_chain.url);
      }
      pData.evolutionChainData = pEvoData;

      const result = normalizePokemon(pData, pSpecies, false);
      setSearchResult(result);

      if (!cacheRef.current.find(p => p.id === result.id)) {
        cacheRef.current.push(result);
      }
    } catch (err) {
      setError('No se encontró el Pokémon exacto. Prueba con el nombre completo o su ID.');
      setSearchResult(null);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResult(null);
    setFilterQuery('');
    setError(null);
  }, []);

  const handleFilterChange = useCallback((query) => {
    setFilterQuery(query);
    setError(null);
    if (searchResult) setSearchResult(null);
  }, [searchResult]);

  const filteredPokemon = pokemon.filter(p => 
    p.nombre.toLowerCase().includes(filterQuery.toLowerCase()) ||
    p.idFmt.includes(filterQuery) ||
    p.types.some(t => t.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  const filteredFeatured = featured && (
    featured.nombre.toLowerCase().includes(filterQuery.toLowerCase()) ||
    featured.idFmt.includes(filterQuery) ||
    featured.types.some(t => t.toLowerCase().includes(filterQuery.toLowerCase()))
  ) ? featured : null;

  return {
    pokemon: filteredPokemon,
    featured: filteredFeatured,
    loading,
    error,
    searchResult,
    isSearching,
    filterQuery,
    loadPokedex,
    searchByName,
    clearSearch,
    handleFilterChange,
    cache: cacheRef,
  };
}
