/* ===== Constants and Data ===== */
const BASE_POKEMON = 'https://pokeapi.co/api/v2/pokemon/';
const BASE_SPECIES = 'https://pokeapi.co/api/v2/pokemon-species/';

const typeColors = {
  normal: '#A8A878', fighting: '#C03028', flying: '#A890F0', poison: '#A040A0',
  ground: '#E0C068', rock: '#B8A038', bug: '#A8B820', ghost: '#705898',
  steel: '#B8B8D0', fire: '#F08030', water: '#6890F0', grass: '#78C850',
  electric: '#F8D030', psychic: '#F85888', ice: '#98D8D8', dragon: '#7038F8',
  dark: '#705848', fairy: '#EE99AC', unknown: '#68A090',
};

const typeBgColors = {
  normal: ['#f5f5f5', '#dcdcce'], fighting: ['#ffb3b0', '#d95e59'],
  flying: ['#e6d3ff', '#b59beb'], poison: ['#eab5ea', '#b26eb2'],
  ground: ['#fcedb6', '#debc62'], rock: ['#e6d8a3', '#bfaa53'],
  bug: ['#eff7b5', '#bccf44'], ghost: ['#d3cdeb', '#8b79b5'],
  steel: ['#e3e3eb', '#acaac4'], fire: ['#ffccb0', '#ed9653'],
  water: ['#cde1ff', '#7a9ee8'], grass: ['#d8f5c4', '#8acf63'],
  electric: ['#fff2ba', '#e8c635'], psychic: ['#ffc4d5', '#f07d9b'],
  ice: ['#e0fafa', '#8fd1d1'], dragon: ['#cab3fc', '#8a5eed'],
  dark: ['#c4b5ac', '#8a7364'], fairy: ['#ffdeed', '#e8a5c2'],
};

const typeGradients = {
  normal: 'from-stone-300 to-stone-400', fighting: 'from-red-400 to-red-600',
  flying: 'from-indigo-200 to-indigo-400', poison: 'from-purple-400 to-purple-600',
  ground: 'from-amber-300 to-amber-500', rock: 'from-yellow-600 to-yellow-800',
  bug: 'from-lime-400 to-lime-600', ghost: 'from-purple-500 to-purple-800',
  steel: 'from-slate-300 to-slate-500', fire: 'from-orange-400 to-red-500',
  water: 'from-blue-400 to-blue-600', grass: 'from-green-400 to-green-600',
  electric: 'from-yellow-300 to-yellow-500', psychic: 'from-pink-400 to-pink-600',
  ice: 'from-cyan-200 to-cyan-400', dragon: 'from-violet-500 to-violet-800',
  dark: 'from-gray-600 to-gray-900', fairy: 'from-pink-300 to-pink-500',
};

const legendariosFijos = [144, 145, 146, 150, 243, 244, 245, 249, 250, 377, 378, 379, 380, 381, 382, 383, 384, 483, 484, 487];
const miticosFijos = [151, 251, 385, 386, 490, 492, 493, 494, 648, 649, 719, 720, 721, 801, 802, 807, 808, 809];
const megasFijas = [10033, 10034, 10035, 10036, 10037, 10038, 10039, 10040, 10041, 10042, 10043, 10044, 10045, 10048, 10050, 10051, 10052, 10053, 10054, 10055, 10057, 10062, 10073, 10075];
const regionalesFijas = [10100, 10101, 10102, 10103, 10104, 10105, 10106, 10107, 10108, 10109, 10110, 10111, 10112, 10113, 10114, 10115, 10158, 10159, 10160, 10161, 10162, 10163, 10164, 10165, 10166];
const dinamaxFijos = [10197, 10198, 10199, 10200, 10201, 10202, 10203, 10204, 10205, 10206, 10207, 10208, 10209, 10210, 10211, 10212, 10213];

/* ===== State ===== */
let pokemonList = [];
let featuredPokemon = null;
let isLoading = true;
let currentFilter = '';
let searchResult = null;
let fullPokemonList = [];

/* ===== API Functions ===== */
async function fetchPokemon(id) {
  const res = await fetch(`${BASE_POKEMON}${id}`);
  if (!res.ok) throw new Error(`Pokemon ${id} not found`);
  return res.json();
}

async function fetchSpecies(id) {
  try {
    const res = await fetch(`${BASE_SPECIES}${id}`);
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

async function fetchEvolutionChain(url) {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

async function fetchLocationEncounters(id) {
  try {
    const res = await fetch(`${BASE_POKEMON}${id}/encounters`);
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

async function fetchMoveDetails(url) {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

async function fetchAbilityDetails(url) {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

function getRegion(id, name = '') {
  const n = (name || '').toLowerCase();
  if (n.includes('-alola')) return 'Alola';
  if (n.includes('-galar')) return 'Galar';
  if (n.includes('-hisui')) return 'Hisui';
  if (n.includes('-paldea')) return 'Paldea';
  
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

const regionColors = {
  kanto: 'bg-black/40 text-red-400 border-red-500/30',
  johto: 'bg-black/40 text-amber-400 border-amber-500/30',
  hoenn: 'bg-black/40 text-emerald-400 border-emerald-500/30',
  sinnoh: 'bg-black/40 text-indigo-400 border-indigo-500/30',
  unova: 'bg-black/40 text-zinc-300 border-zinc-500/30',
  kalos: 'bg-black/40 text-blue-400 border-blue-500/30',
  alola: 'bg-black/40 text-yellow-400 border-yellow-500/30',
  galar: 'bg-black/40 text-pink-400 border-pink-500/30',
  hisui: 'bg-black/40 text-teal-400 border-teal-500/30',
  paldea: 'bg-black/40 text-orange-400 border-orange-500/30',
  unknown: 'bg-black/40 text-gray-400 border-gray-500/30'
};

function normalizePokemon(p, speciesData, isShiny = false) {
  const nombre = p.name;
  const id = p.id;
  const isAlternative = id > 10000;
  const idFmt = `#${id}`;
  let varieties = [];

  let img = isShiny ? (p.sprites?.other?.['official-artwork']?.front_shiny || p.sprites?.front_shiny || '') : '';
  if (!img) img = p.sprites?.other?.['official-artwork']?.front_default || p.sprites?.front_default || '';

  const soundUrl = p.cries?.latest || '';
  const abilities = p.abilities?.map(a => ({ name: a.ability.name, isHidden: a.is_hidden })) || [];
  const heldItems = p.held_items?.slice(0, 3).map(i => i.item.name.replace('-', ' ')) || [];

  let description = '', isLegendary = false, isMythical = false;
  let growthRate = 'Desconocido', eggGroups = [], baseExp = p.base_experience ? `${p.base_experience} XP` : 'Desconocido';
  let captureRate = 'Desconocido', habitat = 'Desconocido', baseHappiness = 'Desconocido';
  let color = 'Desconocido', shape = 'Desconocido', isBaby = false, genderRate = -1;
  let hatchCounter = 0, genera = 'Pokémon';

  if (speciesData) {
    isLegendary = speciesData.is_legendary; isMythical = speciesData.is_mythical;
    captureRate = speciesData.capture_rate || 'Desconocido';
    habitat = speciesData.habitat ? speciesData.habitat.name : 'Desconocido';
    baseHappiness = speciesData.base_happiness || 'Desconocido';
    color = speciesData.color ? speciesData.color.name : 'Desconocido';
    shape = speciesData.shape ? speciesData.shape.name : 'Desconocido';
    isBaby = speciesData.is_baby;
    genderRate = speciesData.gender_rate;
    hatchCounter = speciesData.hatch_counter || 0;
    const g = speciesData.genera?.find(g => g.language.name === 'es') || speciesData.genera?.find(g => g.language.name === 'en');
    if (g) genera = g.genus;

    if (speciesData.growth_rate) growthRate = speciesData.growth_rate.name.replace('-', ' ');
    if (speciesData.egg_groups?.length > 0) eggGroups = speciesData.egg_groups.map(e => e.name);
    const entries = speciesData.flavor_text_entries || [];
    const es = entries.find(e => e.language?.name === 'es'), en = entries.find(e => e.language?.name === 'en');
    const chosen = es || en;
    if (chosen) description = chosen.flavor_text.replace(/\s+/g, ' ').trim();
    
    if (speciesData.varieties?.length > 1) {
      varieties = speciesData.varieties.map(v => {
        const vid = v.pokemon.url.split('/').filter(Boolean).pop();
        return { 
          name: v.pokemon.name, 
          id: vid, 
          isDefault: v.is_default,
          img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${vid}.png`
        };
      });
    }
  }

  const types = p.types.map(t => t.type.name);
  const height = (p.height / 10).toFixed(1) + ' m', weight = (p.weight / 10).toFixed(1) + ' kg';
  const region = getRegion(id, nombre);

  const moves = p.moves?.map(m => m.move.name.replace('-', ' ')) || [];

  let stats = { hp: 0, atk: 0, def: 0, spd: 0, spatk: 0, spdef: 0 };
  if (p.stats) {
    p.stats.forEach(s => {
      if (s.stat.name === 'hp') stats.hp = s.base_stat;
      if (s.stat.name === 'attack') stats.atk = s.base_stat;
      if (s.stat.name === 'defense') stats.def = s.base_stat;
      if (s.stat.name === 'speed') stats.spd = s.base_stat;
      if (s.stat.name === 'special-attack') stats.spatk = s.base_stat;
      if (s.stat.name === 'special-defense') stats.spdef = s.base_stat;
    });
  }
  const bst = stats.hp + stats.atk + stats.def + stats.spd + stats.spatk + stats.spdef;

  let evolutionStage = 'Básico', stageType = 'basic';
  if (speciesData?.evolution_chain && p.evolutionChainData) {
    const depth = findDepth(p.evolutionChainData.chain, speciesData.name);
    if (depth === 1) { evolutionStage = 'Fase 1'; stageType = 'stage1'; }
    else if (depth >= 2) { evolutionStage = 'Fase 2'; stageType = 'stage2'; }
  }
  if (nombre.includes('-mega')) { evolutionStage = 'Mega'; stageType = 'mega'; }
  else if (nombre.includes('-gmax')) { evolutionStage = 'Gigamax'; stageType = 'mega'; }
  else if (nombre.includes('-alola') || nombre.includes('-galar') || nombre.includes('-paldea') || nombre.includes('-hisui')) { evolutionStage = 'Regional'; stageType = 'stage2'; }

  const evolutionFamily = getEvolutionFamily(p.evolutionChainData?.chain);
  // Regionalizar miembros de la familia si es posible
  if (region !== 'Kanto' && evolutionFamily.length > 0) {
    evolutionFamily.forEach(member => {
      const regName = `${member.name}-${region.toLowerCase()}`;
      const regMatch = fullPokemonList.find(x => x.name === regName);
      if (regMatch) {
        member.id = regMatch.url.split('/').filter(Boolean).pop();
        member.name = regName;
        member.img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${member.id}.png`;
      }
    });
  }

  return {
    id, idFmt, nombre, img, types, height, weight, region, ...stats, bst,
    isShiny, soundUrl, description, isLegendary, isMythical,
    abilities, heldItems, growthRate, eggGroups, evolutionStage, stageType,
    baseExp, captureRate, habitat, baseHappiness, color, shape, isBaby, genderRate, moves, hatchCounter, genera, evolutionFamily, varieties,
    eggGroups, growthRate, isLegendary, isMythical, description
  };
}

function getEvolutionFamily(chain) {
  if (!chain) return [];
  const family = [];
  function traverse(node) {
    const id = node.species.url.split('/').filter(Boolean).pop();
    family.push({ 
      name: node.species.name, 
      id, 
      img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
    });
    node.evolves_to.forEach(traverse);
  }
  traverse(chain);
  return family;
}

/* ===== UI Generation ===== */
function createPokemonCard(p, index) {
  const t1 = p.types[0];
  const t2 = p.types.length > 1 ? p.types[1] : null;
  const rgb1 = typeBgColors[t1] || typeBgColors.normal;
  const rgb2 = t2 ? (typeBgColors[t2] || typeBgColors.normal) : null;
  const bgStyle = rgb2
    ? `background: linear-gradient(135deg, ${rgb1[0]} 0%, ${rgb1[1]} 45%, ${rgb2[0]} 55%, ${rgb2[1]} 100%)`
    : `background: linear-gradient(135deg, ${rgb1[0]}, ${rgb1[1]})`;
  const borderColor = typeColors[t1] || '#999';
  const isSpecial = p.isLegendary || p.isMythical;
  
  const stageClasses = {
    basic: 'bg-gray-200 text-gray-600 border-gray-300',
    stage1: 'bg-sky-200 text-sky-700 border-sky-400',
    stage2: 'bg-indigo-500 text-white border-indigo-600',
    mega: 'bg-gradient-to-r from-orange-400 to-red-500 text-white border-orange-500',
  };

  return `
    <div class="pokemon-card-enter group" style="animation-delay: ${index * 80}ms">
      <div class="relative rounded-2xl overflow-hidden shadow-lg transition-all duration-400 hover:shadow-2xl hover:-translate-y-3 hover:scale-[1.03] ${isSpecial ? 'rarity-glow' : ''} h-[450px] flex flex-col" style="${bgStyle}">
        
        <div class="absolute top-3 left-3 z-10 flex flex-col gap-2">
          ${p.isShiny ? '<div class="text-xl animate-bounce-slow">✨</div>' : ''}
          ${p.soundUrl ? `
            <button onclick="event.stopPropagation(); new Audio('${p.soundUrl}').play()" class="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-gray-800 flex items-center justify-center hover:bg-white/40 active:scale-90 transition-all">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
            </button>` : ''}
        </div>

        <div onclick="openModalById(${p.id})" class="cursor-pointer flex flex-col h-full">
          <div class="relative pt-6 px-4 pb-0 flex justify-center">
            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-8 rounded-[50%] opacity-20 blur-md" style="background-color: ${borderColor}"></div>
            <img src="${p.img}" alt="${p.nombre}" class="relative z-[1] w-36 h-36 object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-115">
          </div>

          <div class="h-[2px] mx-6 mt-4 opacity-50" style="background: linear-gradient(90deg, transparent, ${borderColor}, transparent)"></div>

          <div class="p-4 text-center flex flex-col flex-1 space-y-2">
            <h3 class="text-lg font-black capitalize text-gray-800 tracking-tight font-orbitron leading-tight">${p.nombre}</h3>
            
            <div class="flex flex-wrap justify-center gap-1.5 items-center">
              ${p.idFmt !== '???' ? `<span class="px-2 py-0.5 text-[0.6rem] font-mono font-bold rounded bg-gray-900/10 text-gray-800 border border-gray-900/10">${p.idFmt}</span>` : ''}
              <span class="px-2 py-0.5 text-[0.55rem] font-bold rounded border ${p.stageType ? stageClasses[p.stageType] || stageClasses.basic : stageClasses.basic}">${p.evolutionStage}</span>
            </div>

            <div class="flex-grow flex items-center justify-center">
               <div class="px-3 py-1 rounded-full border flex items-center gap-1.5 shadow-sm transition-all duration-300 ${regionColors[p.region.toLowerCase()] || regionColors.unknown}">
                 <span class="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                 <span class="text-[0.65rem] font-black tracking-widest uppercase">${p.region}</span>
               </div>
            </div>

            <div class="flex justify-center gap-1.5 py-1">
              ${p.types.map(t => `<span class="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter text-white shadow-sm" style="background-color: ${typeColors[t]}">${t}</span>`).join('')}
            </div>

            <button onclick="event.stopPropagation(); openModalById(${p.id})" class="mt-2 w-full py-2.5 text-[0.7rem] font-black uppercase tracking-widest rounded-xl bg-gray-900 text-white shadow-lg transform transition-all hover:bg-black active:scale-95">
              VER DATOS
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function createFeaturedCard(p) {
  if (!p) return '';
  const isSpecial = p.isLegendary || p.isMythical;
  
  return `
    <div onclick="openModalById(${p.id})" class="featured-card relative flex flex-col md:flex-row rounded-2xl overflow-hidden border-2 border-cyan-400/60 bg-gradient-to-br from-[#0a192f] via-[#020c1b] to-[#0a192f] shadow-[0_0_30px_rgba(0,255,255,0.2)] backdrop-blur-sm cursor-pointer transition-all duration-500 hover:shadow-[0_0_50px_rgba(0,255,255,0.4)] hover:border-cyan-300 ${isSpecial ? 'rarity-glow' : ''}">
      <div class="absolute inset-0 pointer-events-none z-[2] rounded-2xl scanlines-effect opacity-30"></div>

      <div class="relative flex-shrink-0 md:w-[35%] flex items-center justify-center p-8 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15)_0%,transparent_70%)] border-b md:border-b-0 md:border-r border-cyan-500/30">
        <img src="${p.img}" alt="${p.nombre}" class="relative z-[3] w-[80%] max-w-[250px] drop-shadow-[0_0_15px_rgba(0,255,255,0.5)] animate-float-smooth">
      </div>

      <div class="flex-1 p-6 md:p-8 flex flex-col z-[3] text-[#e6f1ff]">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h2 class="text-2xl md:text-3xl font-extrabold capitalize text-cyan-300 tracking-wider drop-shadow-[0_0_8px_rgba(0,255,255,0.5)] font-orbitron">${p.nombre}</h2>
            <div class="flex flex-wrap gap-2 mt-2 items-center">
              <span class="px-2 py-0.5 text-[0.7rem] font-mono rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">${p.idFmt}</span>
              ${p.isShiny ? '<span class="px-2 py-0.5 text-[0.65rem] font-bold rounded-md bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">✨ SHINY</span>' : ''}
              ${p.isLegendary ? '<span class="px-2 py-0.5 text-[0.65rem] font-bold rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">🌟 LEGENDARIO</span>' : ''}
              ${p.isMythical ? '<span class="px-2 py-0.5 text-[0.65rem] font-bold rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40">✨ MÍTICO</span>' : ''}
            </div>
          </div>
          ${p.soundUrl ? `
            <button onclick="event.stopPropagation(); new Audio('${p.soundUrl}').play()" class="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 flex items-center justify-center hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all active:scale-90">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
            </button>` : ''}
        </div>

        <p class="text-[#64ffda] font-bold font-mono text-sm mb-3">📍 [ LOC: ${p.region.toUpperCase()} ]</p>
        <div class="bg-[rgba(0,20,40,0.6)] border-l-4 border-cyan-400 px-4 py-3 rounded-r-md mb-4 font-mono text-sm text-[#64ffda] leading-relaxed">${p.description}</div>

        <div class="flex flex-wrap gap-4 mb-4">
          <div class="flex flex-col"><span class="text-[0.6rem] text-cyan-400/60 uppercase font-black tracking-tighter">Altura</span><span class="text-sm font-bold text-cyan-200">${p.height}</span></div>
          <div class="flex flex-col border-l border-cyan-500/30 pl-3"><span class="text-[0.6rem] text-cyan-400/60 uppercase font-black tracking-tighter">Peso</span><span class="text-sm font-bold text-cyan-200">${p.weight}</span></div>
          <div class="flex flex-col border-l border-cyan-500/30 pl-3"><span class="text-[0.6rem] text-cyan-400/60 uppercase font-black tracking-tighter">Hábitat</span><span class="text-sm font-bold text-cyan-200 capitalize">${p.habitat}</span></div>
        </div>

        <div class="flex gap-2 mb-6">
          ${p.types.map(t => `<span class="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white shadow-sm" style="background-color: ${typeColors[t]}">${t}</span>`).join('')}
        </div>

        <button onclick="event.stopPropagation(); openModalById(${p.id})" class="w-full md:w-max px-8 py-3 text-sm font-bold uppercase tracking-widest rounded-lg border border-cyan-400 text-cyan-300 bg-transparent transition-all duration-300 hover:bg-cyan-500/20 hover:text-white hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]">INICIAR ANÁLISIS</button>
      </div>
    </div>
  `;
}

function renderStat(label, value, color) {
  const percentage = Math.min((value / 255) * 100, 100);
  return `
    <div>
      <div class="flex justify-between text-xs mb-1">
        <span class="text-gray-400">${label}</span>
        <span class="font-bold" style="color: ${color}">${value}</span>
      </div>
      <div class="h-2 bg-black/40 rounded-full overflow-hidden">
        <div class="h-full rounded-full stat-bar-animate" style="width: ${percentage}%; background-color: ${color}; box-shadow: 0 0 8px ${color}80"></div>
      </div>
    </div>
  `;
}

/* ===== App Logic ===== */
async function fetchFullList() {
  if (fullPokemonList.length > 0) return fullPokemonList;
  try {
    const res = await fetch(`${BASE_POKEMON}?limit=2000`);
    const data = await res.json();
    fullPokemonList = data.results;
    return fullPokemonList;
  } catch (e) { return []; }
}

function generateRandomIds(count, maxId) {
  const ids = new Set();
  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
  ids.add(getRandom(legendariosFijos));
  ids.add(getRandom(miticosFijos));
  ids.add(getRandom(megasFijas));
  ids.add(getRandom(regionalesFijas));
  ids.add(getRandom(dinamaxFijos));

  while (ids.size < count) {
    if (Math.random() < 0.2) ids.add(Math.floor(Math.random() * (10277 - 10001 + 1)) + 10001);
    else ids.add(Math.floor(Math.random() * maxId) + 1);
  }
  return Array.from(ids).sort(() => Math.random() - 0.5);
}

async function loadPokedex() {
  try {
    document.getElementById('error-container').innerHTML = '';
    isLoading = true; updateUI();
    if (fullPokemonList.length === 0) await fetchFullList();

    const ids = generateRandomIds(13, 1025);
    const [pData, sData] = await Promise.all([
      Promise.all(ids.map(fetchPokemon)),
      Promise.all(ids.map(fetchSpecies)),
    ]);
    
    // Fetch evolution chains
    const eData = await Promise.all(sData.map(s => s?.evolution_chain?.url ? fetchEvolutionChain(s.evolution_chain.url) : null));

    const normalized = pData.map((p, i) => {
      p.evolutionChainData = eData[i];
      const isShiny = Math.random() < 0.1;
      return normalizePokemon(p, sData[i], isShiny);
    });

    featuredPokemon = normalized[0];
    pokemonList = normalized.slice(1);
    isLoading = false; updateUI();
  } catch (e) {
    document.getElementById('error-container').innerHTML = '⚠️ Error al cargar datos.';
    isLoading = false; updateUI();
  }
}

function updateUI() {
  const grid = document.getElementById('pokemon-grid'), featured = document.getElementById('featured-container'), loader = document.getElementById('loader');
  if (isLoading) { loader.classList.remove('hidden'); grid.innerHTML = ''; featured.innerHTML = ''; return; }
  loader.classList.add('hidden');
  
  if (searchResult) {
    featured.innerHTML = '';
    if (Array.isArray(searchResult)) {
      grid.innerHTML = searchResult.map((p, i) => createPokemonCard(p, i)).join('');
    } else {
      grid.innerHTML = createPokemonCard(searchResult, 0);
    }
  } else if (currentFilter) {
    const filtered = pokemonList.filter(p => p.nombre.includes(currentFilter.toLowerCase()) || p.types.some(t => t.includes(currentFilter.toLowerCase())));
    grid.innerHTML = filtered.map((p, i) => createPokemonCard(p, i)).join('');
  } else {
    featured.innerHTML = createFeaturedCard(featuredPokemon);
    grid.innerHTML = pokemonList.map((p, i) => createPokemonCard(p, i)).join('');
  }
}

async function searchByName(query) {
  if (!query) { searchResult = null; updateUI(); return; }
  const trimmed = query.trim().toLowerCase();
  
  try {
    document.getElementById('error-container').innerHTML = '';
    isLoading = true; updateUI();

    let matches = [];
    if (fullPokemonList.length > 0) {
      matches = fullPokemonList.filter(p => p.name === trimmed || p.name.includes(trimmed)).slice(0, 48);
    }

    if (matches.length === 0) {
      try {
        const pData = await fetchPokemon(trimmed);
        matches = [pData];
      } catch {
        throw new Error('Not found');
      }
    }

    const details = await Promise.all(matches.map(async (m) => {
      const pData = m.url ? await (await fetch(m.url)).json() : m;
      const sData = pData.species?.url ? await (await fetch(pData.species.url)).json() : await fetchSpecies(pData.id);
      if (sData?.evolution_chain?.url) pData.evolutionChainData = await fetchEvolutionChain(sData.evolution_chain.url);
      return normalizePokemon(pData, sData, false);
    }));

    searchResult = details;
    isLoading = false; updateUI();
  } catch (e) {
    document.getElementById('error-container').innerHTML = '⚠️ No encontrado.';
    isLoading = false; updateUI();
  }
}

async function openModalById(id) {
  const allPool = [featuredPokemon, ...pokemonList];
  if (Array.isArray(searchResult)) allPool.push(...searchResult);
  else if (searchResult) allPool.push(searchResult);

  let p = allPool.find(x => x && x.id == id);
  
  if (p && (!p.evolutionFamily || p.evolutionFamily.length <= 1)) {
    if (id > 10000 || id > 151) {
       if (!p.nombre.includes('-mega') && !p.nombre.includes('-gmax')) p = null;
    }
  }

  if (!p) {
    try {
      isLoading = true; updateUI();
      const pData = await fetchPokemon(id);
      const sData = pData.species?.url ? await (await fetch(pData.species.url)).json() : await fetchSpecies(id);
      if (sData?.evolution_chain?.url) pData.evolutionChainData = await fetchEvolutionChain(sData.evolution_chain.url);
      p = normalizePokemon(pData, sData, false);
      isLoading = false; updateUI();
    } catch (e) {
      isLoading = false; updateUI();
      return;
    }
  }
  if (!p) return;

  if (!p.encounters) p.encounters = await fetchLocationEncounters(p.id);

  const modal = document.getElementById('pokemon-modal'), content = document.getElementById('modal-body'), borderColor = typeColors[p.types[0]] || '#999';
  
  content.innerHTML = `
    <div class="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-red-900 via-red-800 to-red-950 border-4 border-[${borderColor}] text-white h-full flex flex-col">
      <!-- Header Fijo -->
      <div class="p-6 pb-2 bg-black/30 border-b border-white/10 flex justify-between items-start">
        <div class="flex flex-col">
          <div class="flex items-center gap-2 mb-1">
            <span class="px-2 py-0.5 rounded-full bg-black/40 border border-white/20 text-[10px] font-black tracking-tighter text-gray-400">${p.idFmt}</span>
            <span class="text-[10px] uppercase font-black text-gray-500 tracking-widest">${p.region}</span>
          </div>
          <h2 class="text-3xl font-black uppercase italic tracking-tighter mb-1">${p.nombre}</h2>
          <div class="flex gap-2">
            ${p.types.map(t => `<span class="px-3 py-0.5 rounded-md ${typeGradients[t] || 'bg-gray-500'} text-[10px] font-black uppercase tracking-widest shadow-lg">${t}</span>`).join('')}
          </div>
        </div>
        <div class="flex flex-col items-end gap-2">
          ${p.soundUrl ? `<button onclick="const a=new Audio('${p.soundUrl}'); a.volume=0.4; a.play()" class="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all text-white/80"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg></button>` : ''}
          <span class="px-2 py-0.5 rounded bg-black/40 text-[9px] font-bold text-cyan-400/80 uppercase border border-cyan-500/20">${p.evolutionStage}</span>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="flex border-b border-white/5 bg-black/20 overflow-x-auto no-scrollbar scroll-smooth">
        <button onclick="changeTab('resumen')" class="tab-btn px-6 py-3 text-[10px] font-black uppercase tracking-widest text-cyan-400 border-b-2 border-cyan-400 shrink-0">Resumen</button>
        <button onclick="changeTab('combate')" class="tab-btn px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors shrink-0">Combate</button>
        <button onclick="changeTab('evolucion')" class="tab-btn px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors shrink-0">Evolución</button>
        <button onclick="changeTab('mundo')" class="tab-btn px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors shrink-0">Mundo</button>
        <button onclick="changeTab('crianza')" class="tab-btn px-6 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors shrink-0">Crianza</button>
      </div>

      <!-- Body Scrollable -->
      <div class="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        
        <!-- Tab: Resumen -->
        <div id="tab-resumen" class="tab-content space-y-6">
          <div class="flex flex-col md:flex-row gap-6 items-center">
            <div class="relative w-48 h-48 bg-white/5 rounded-full flex items-center justify-center border-4 border-white/10 shadow-2xl p-6 group">
              <div class="absolute inset-x-0 bottom-0 h-1/3 bg-white/5 rounded-b-full blur-xl opacity-50"></div>
              <img src="${p.img}" class="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] animate-float">
            </div>
            
            <div class="flex-1 w-full space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-black/20 p-3 rounded-xl border border-white/5">
                  <div class="text-gray-500 text-[9px] uppercase font-bold mb-1">Altura</div>
                  <div class="font-black text-sm">${p.height}</div>
                </div>
                <div class="bg-black/20 p-3 rounded-xl border border-white/5">
                  <div class="text-gray-500 text-[9px] uppercase font-bold mb-1">Peso</div>
                  <div class="font-black text-sm">${p.weight}</div>
                </div>
                <div class="bg-black/20 p-3 rounded-xl border border-white/5">
                  <div class="text-gray-500 text-[9px] uppercase font-bold mb-1">Exp. Base</div>
                  <div class="font-black text-sm text-cyan-400">${p.baseExp}</div>
                </div>
                <div class="bg-black/20 p-3 rounded-xl border border-white/5">
                  <div class="text-gray-500 text-[9px] uppercase font-bold mb-1">Captura</div>
                  <div class="font-black text-sm text-yellow-500">${p.captureRate}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="bg-black/40 rounded-2xl p-5 border border-white/10">
            <h3 class="text-xs font-black uppercase tracking-widest text-white/40 mb-4">Estadísticas Base</h3>
            <div class="space-y-3">
              ${Object.entries({HP:p.hp, ATQ:p.atk, DEF:p.def, SPD:p.spd, SATK:p.spatk, SDEF:p.spdef}).map(([lab, val]) => `
                <div class="flex items-center gap-4">
                  <span class="w-10 text-[9px] font-black text-gray-400 uppercase tracking-tighter">${lab}</span>
                  <div class="flex-1 h-3 bg-black/50 rounded-full overflow-hidden border border-white/5">
                    <div class="h-full bg-gradient-to-r ${val > 100 ? 'from-cyan-400 to-blue-500' : 'from-red-400 to-red-600'} transition-all duration-1000" style="width: ${Math.min((val/255)*100, 100)}%"></div>
                  </div>
                  <span class="w-8 text-[11px] font-black text-right text-white/80">${val}</span>
                </div>
              `).join('')}
              <div class="pt-2 border-t border-white/5 flex justify-between items-center text-xs font-black uppercase text-cyan-400 tracking-widest">
                <span>Total (BST)</span>
                <span class="text-xl italic">${p.bst}</span>
              </div>
            </div>
          </div>

          ${p.description ? `
          <div class="bg-black/20 rounded-2xl p-5 border border-white/5 italic">
            <h4 class="text-[10px] uppercase font-black text-white/30 mb-2 tracking-tighter">Reporte Biológico</h4>
            <p class="text-sm leading-relaxed text-gray-200">${p.description}</p>
          </div>` : ''}

          <div class="grid grid-cols-2 gap-4">
            <div class="bg-black/20 rounded-xl p-4 border border-white/5">
              <h4 class="text-[9px] uppercase font-black text-gray-500 mb-2">Hábitat</h4>
              <div class="capitalize text-xs font-bold">${p.habitat}</div>
            </div>
            <div class="bg-black/20 rounded-xl p-4 border border-white/5">
              <h4 class="text-[9px] uppercase font-black text-gray-500 mb-2">Género</h4>
              <div class="text-xs font-bold">
                ${p.genderRate === -1 ? 'Sin género' : `♂️ ${(100 - (p.genderRate/8)*100).toFixed(1)}% / ♀️ ${((p.genderRate/8)*100).toFixed(1)}%`}
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Combate -->
        <div id="tab-combate" class="tab-content hidden space-y-6">
          <div class="bg-black/30 rounded-2xl p-4 border border-white/5">
            <h4 class="text-xs font-black uppercase text-cyan-400 mb-3 tracking-widest">Habilidades</h4>
            <div class="space-y-3">
              ${p.abilities.map(a => `
                <div class="p-3 bg-white/5 rounded-xl border border-white/5">
                  <span class="capitalize text-sm font-black">${a.name.replace(/-/g, ' ')}</span>
                  ${a.isHidden ? '<span class="text-[8px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded font-black uppercase ml-2">Oculta</span>' : ''}
                </div>
              `).join('')}
            </div>
          </div>

          ${p.moves.length > 0 ? `
          <div class="bg-black/40 rounded-2xl p-4 border border-white/5">
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-xs font-black uppercase text-yellow-500 tracking-widest">Movimientos</h4>
              <span class="text-[9px] bg-white/10 px-2 py-0.5 rounded-full font-black text-gray-400 uppercase">Totales: ${p.moves.length}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto custom-scrollbar pr-2">
              ${p.moves.map(m => `
                <div class="capitalize text-[10px] bg-white/5 p-2 rounded-lg border border-white/5 text-gray-300 font-bold flex items-center justify-between">
                  ${m}
                </div>
              `).join('')}
            </div>
          </div>` : ''}
        </div>

        <!-- Tab: Evolución -->
        <div id="tab-evolucion" class="tab-content hidden space-y-6">
          ${p.varieties && p.varieties.length > 1 ? `
          <div class="bg-black/20 rounded-xl p-4 border border-white/5">
            <h4 class="text-xs font-bold uppercase text-yellow-500 mb-3 tracking-widest text-center">Formas Alternativas</h4>
            <div class="flex flex-wrap items-center justify-center gap-6">
              ${p.varieties.map(v => `
                <div class="flex flex-col items-center group cursor-pointer" onclick="openModalById(${v.id})">
                  <div class="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-all p-2 ${v.id == p.id ? 'ring-2 ring-yellow-500/50 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : ''}">
                    <img src="${v.img}" class="w-full h-full object-contain drop-shadow-md">
                  </div>
                  <span class="text-[9px] mt-1 capitalize font-bold ${v.id == p.id ? 'text-yellow-400' : 'text-gray-400'}">
                    ${v.name.replace(p.nombre.split('-')[0], '').replace(/-/g, ' ').trim() || 'Normal'}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>` : ''}

          ${p.evolutionFamily.length > 1 ? `
          <div class="bg-black/20 rounded-xl p-4 border border-white/5 relative">
            <h4 class="text-xs font-bold uppercase text-cyan-300 mb-4 tracking-widest text-center">Cadena Evolutiva</h4>
            <div class="flex flex-wrap items-center justify-center gap-6">
              ${p.evolutionFamily.map((member, i) => `
                <div class="flex flex-col items-center group cursor-pointer" onclick="openModalById(${member.id})">
                  <div class="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-all p-4 ${member.id == p.id ? 'ring-2 ring-cyan-500/50 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : ''}">
                    <img src="${member.img}" class="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform">
                  </div>
                  <span class="text-[10px] mt-2 capitalize font-black ${member.id == p.id ? 'text-cyan-400' : 'text-gray-500'}">${member.name}</span>
                </div>
                ${i < p.evolutionFamily.length - 1 ? '<svg class="w-4 h-4 text-gray-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>' : ''}
              `).join('')}
            </div>
          </div>` : ''}
        </div>

        <!-- Tab: Mundo -->
        <div id="tab-mundo" class="tab-content hidden space-y-6">
          <div class="space-y-4">
            <h4 class="text-xs font-black uppercase text-emerald-400 tracking-widest text-center">Ubicaciones Registradas</h4>
            <div class="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              ${p.encounters.length > 0 ? p.encounters.map(e => `
                <div class="bg-white/5 p-3 rounded-xl border border-white/5 flex justify-between items-center text-[10px] font-bold">
                  <span class="capitalize text-gray-300">${e.location_area.name.replace(/-/g, ' ')}</span>
                  <span class="text-emerald-500/80 uppercase">Área</span>
                </div>
              `).join('') : '<div class="text-gray-500 text-xs italic text-center py-10">Ubicación desconocida o no disponible vía API.</div>'}
            </div>
          </div>
        </div>

        <!-- Tab: Crianza -->
        <div id="tab-crianza" class="tab-content hidden space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-black/20 rounded-2xl p-4 border border-white/5">
              <h4 class="text-[9px] uppercase font-black text-cyan-400 mb-2">Grupos de Huevo</h4>
              <div class="flex flex-wrap gap-2">
                ${p.eggGroups.map(e => `<span class="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] uppercase font-black">${e}</span>`).join('')}
              </div>
            </div>
            <div class="bg-black/20 rounded-2xl p-4 border border-white/5">
              <h4 class="text-[9px] uppercase font-black text-rose-400 mb-2">Tasa de Crecimiento</h4>
              <div class="capitalize text-sm font-black">${p.growthRate}</div>
            </div>
            <div class="bg-black/20 rounded-2xl p-4 border border-white/10">
              <h4 class="text-[9px] uppercase font-black text-amber-400 mb-2">Pasos para Eclosión</h4>
              <div class="text-xl font-black italic">${p.hatchCounter * 255} <span class="text-[10px] not-italic text-gray-500">aprox.</span></div>
            </div>
            <div class="bg-black/20 rounded-2xl p-4 border border-white/10">
              <h4 class="text-[9px] uppercase font-black text-indigo-400 mb-2">Felicidad Base</h4>
              <div class="text-xl font-black italic">${p.baseHappiness}</div>
            </div>
          </div>
        </div>

      </div>

      <!-- Footer Fijo -->
      <div class="p-6 pt-2 bg-black/30 border-t border-white/10">
        <button onclick="closeModal()" class="w-full py-3 text-xs font-black uppercase tracking-[0.2em] rounded-xl bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 transition-all shadow-lg active:scale-95 border border-white/10">Cerrar Enciclopedia</button>
      </div>
    </div>
  `;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  setTimeout(() => { modal.querySelector('.modal-overlay').classList.add('modal-visible'); modal.querySelector('.modal-content').classList.add('modal-content-visible'); }, 10);
}

function closeModal() {
  const modal = document.getElementById('pokemon-modal');
  modal.querySelector('.modal-overlay').classList.remove('modal-visible');
  modal.querySelector('.modal-content').classList.remove('modal-content-visible');
  document.body.style.overflow = '';
  setTimeout(() => modal.classList.add('hidden'), 300);
}

function changeTab(tabId) {
  const modal = document.getElementById('pokemon-modal');
  const tabs = modal.querySelectorAll('.tab-content');
  const buttons = modal.querySelectorAll('.tab-btn');
  
  tabs.forEach(t => t.classList.add('hidden'));
  buttons.forEach(b => {
    b.classList.remove('text-cyan-400', 'border-b-2', 'border-cyan-400');
    b.classList.add('text-gray-500');
  });
  
  const target = document.getElementById(`tab-${tabId}`);
  if (target) target.classList.remove('hidden');
  
  const btn = Array.from(buttons).find(b => b.getAttribute('onclick').includes(tabId));
  if (btn) {
    btn.classList.add('text-cyan-400', 'border-b-2', 'border-cyan-400');
    btn.classList.remove('text-gray-500');
  }
}

let searchTimeout;
window.addEventListener('DOMContentLoaded', () => {
  loadPokedex();
  const searchInput = document.getElementById('search-input');
  const clearBtn = document.getElementById('clear-search');

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value;
    if (q.length > 0) {
      clearBtn.classList.remove('opacity-0', 'pointer-events-none');
    } else {
      clearBtn.classList.add('opacity-0', 'pointer-events-none');
    }
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => searchByName(q), 500);
  });

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.classList.add('opacity-0', 'pointer-events-none');
    searchByName('');
  });
});
