const BASE_POKEMON = 'https://pokeapi.co/api/v2/pokemon/';
const BASE_SPECIES = 'https://pokeapi.co/api/v2/pokemon-species/';

export async function fetchFullList() {
  const res = await fetch(`${BASE_POKEMON}?limit=2000`);
  if (!res.ok) throw new Error('Could not fetch Pokémon list');
  const data = await res.json();
  return data.results.map((p, index) => ({
    name: p.name,
    id: index + 1, // Basic ID mapping, though some IDs might differ for special forms
    url: p.url,
  }));
}

export async function fetchPokemon(id) {
  const res = await fetch(`${BASE_POKEMON}${id}`);
  if (!res.ok) throw new Error(`Pokemon ${id} not found`);
  return res.json();
}

export async function fetchSpecies(id) {
  try {
    const res = await fetch(`${BASE_SPECIES}${id}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchEvolutionChain(url) {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function searchPokemon(query) {
  const res = await fetch(`${BASE_POKEMON}${query.toLowerCase()}`);
  if (!res.ok) throw new Error('Pokémon no encontrado');
  return res.json();
}

function getRegion(id) {
  if (id <= 151) return 'Kanto';
  if (id <= 251) return 'Johto';
  if (id <= 386) return 'Hoenn';
  if (id <= 493) return 'Sinnoh';
  if (id <= 649) return 'Teselia';
  if (id <= 721) return 'Kalos';
  if (id <= 809) return 'Alola';
  if (id <= 905) return 'Galar';
  return 'Paldea';
}

function findDepth(node, targetName, currentDepth = 0) {
  if (node.species.name === targetName) return currentDepth;
  for (const evo of node.evolves_to) {
    const found = findDepth(evo, targetName, currentDepth + 1);
    if (found !== -1) return found;
  }
  return -1;
}

export function normalizePokemon(p, speciesData, isShiny = false) {
  const nombre = p.name;
  const id = p.id;
  const isAlternative = id > 10000;
  const idFmt = isAlternative ? '???' : `#${String(id).padStart(3, '0')}`;

  let img = '';
  if (isShiny) {
    img = p.sprites?.other?.['official-artwork']?.front_shiny || p.sprites?.front_shiny || '';
  }
  if (!img) {
    img = p.sprites?.other?.['official-artwork']?.front_default || p.sprites?.front_default || '';
  }

  const soundUrl = p.cries?.latest || '';

  const abilities = p.abilities?.map(a => ({
    name: a.ability.name,
    isHidden: a.is_hidden,
  })) || [];

  const heldItems = p.held_items?.slice(0, 3).map(i => i.item.name.replace('-', ' ')) || [];

  let description = 'Sin descripción disponible.';
  let isLegendary = false;
  let isMythical = false;
  let growthRate = 'Desconocido';
  let eggGroups = [];
  let baseExp = p.base_experience ? `${p.base_experience} XP` : 'Desconocido';
  let captureRate = 'Desconocido';
  let habitat = 'Desconocido';
  let baseHappiness = 'Desconocido';

  if (speciesData) {
    isLegendary = speciesData.is_legendary;
    isMythical = speciesData.is_mythical;
    captureRate = speciesData.capture_rate || 'Desconocido';
    habitat = speciesData.habitat ? speciesData.habitat.name : 'Desconocido';
    baseHappiness = speciesData.base_happiness || 'Desconocido';

    if (speciesData.growth_rate) {
      growthRate = speciesData.growth_rate.name.replace('-', ' ');
    }

    if (speciesData.egg_groups?.length > 0) {
      eggGroups = speciesData.egg_groups.map(e => e.name);
    }

    const entries = speciesData.flavor_text_entries || [];
    const es = entries.find(e => e.language?.name === 'es');
    const en = entries.find(e => e.language?.name === 'en');
    const chosen = es || en;
    if (chosen) {
      description = chosen.flavor_text.replace(/\s+/g, ' ').trim();
    }
  }

  const types = p.types.map(t => t.type.name);
  const height = (p.height / 10).toFixed(1) + ' m';
  const weight = (p.weight / 10).toFixed(1) + ' kg';
  const region = getRegion(id);

  let statHp = 0, statAtk = 0, statDef = 0, statSpd = 0, statSpAtk = 0, statSpDef = 0;
  if (p.stats) {
    p.stats.forEach(s => {
      if (s.stat.name === 'hp') statHp = s.base_stat;
      if (s.stat.name === 'attack') statAtk = s.base_stat;
      if (s.stat.name === 'defense') statDef = s.base_stat;
      if (s.stat.name === 'speed') statSpd = s.base_stat;
      if (s.stat.name === 'special-attack') statSpAtk = s.base_stat;
      if (s.stat.name === 'special-defense') statSpDef = s.base_stat;
    });
  }

  let evolutionStage = 'Desconocido';
  let stageType = 'basic';

  if (nombre.includes('-mega')) {
    evolutionStage = 'Mega';
    stageType = 'mega';
  } else if (nombre.includes('-gmax')) {
    evolutionStage = 'Gigamax';
    stageType = 'mega';
  } else if (nombre.includes('-alola') || nombre.includes('-galar') || nombre.includes('-paldea') || nombre.includes('-hisui')) {
    evolutionStage = 'Regional';
    stageType = 'stage2';
  } else if (speciesData?.evolution_chain && p.evolutionChainData) {
    const depth = findDepth(p.evolutionChainData.chain, speciesData.name);
    if (depth === 0) { evolutionStage = 'Básico'; stageType = 'basic'; }
    else if (depth === 1) { evolutionStage = 'Fase 1'; stageType = 'stage1'; }
    else if (depth >= 2) { evolutionStage = 'Fase 2'; stageType = 'stage2'; }
  }

  return {
    id, idFmt, nombre, img, types, height, weight, region,
    statHp, statAtk, statDef, statSpd, statSpAtk, statSpDef,
    isShiny, soundUrl, description, isLegendary, isMythical,
    abilities, heldItems, growthRate, eggGroups, evolutionStage, stageType,
    baseExp, captureRate, habitat, baseHappiness,
  };
}
