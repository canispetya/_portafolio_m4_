/**
 * Portafolio M4 — Pokédex
 *
 * Requisitos:
 * - Obtener 12 Pokémon aleatorios de toda la base (IDs 1..1010) desde PokeAPI
 * - Renderizar una card Bootstrap por Pokémon con:
 *   nombre, imagen oficial, ID, tipos (badges con colores)
 * - Responsive grid (row + col-md-4 => 3 columnas en md+)
 * - Interactividad: botón "Ver más" abre modal con detalle
 * - Estados UI: skeleton de carga y alert error de red (mockup)
 * - (Opcional) búsqueda por nombre (filtrando en memoria)
 */
// Endpoints
const BASE_POKEMON = "https://pokeapi.co/api/v2/pokemon/";
const BASE_SPECIES = "https://pokeapi.co/api/v2/pokemon-species/";

// Colores asociados a tipos de Pokémon (reservado para futuro uso)
const typeColors = {
  normal: '#A8A878',
  fighting: '#C03028',
  flying: '#A890F0',
  poison: '#A040A0',
  ground: '#E0C068',
  rock: '#B8A038',
  bug: '#A8B820',
  ghost: '#705898',
  steel: '#B8B8D0',
  fire: '#F08030',
  water: '#6890F0',
  grass: '#78C850',
  electric: '#F8D030',
  psychic: '#F85888',
  ice: '#98D8D8',
  dragon: '#7038F8',
  dark: '#705848',
  fairy: '#EE99AC',
  unknown: '#68A090',
};

const typeBgColors = {
  normal: ['#f5f5f5', '#dcdcce'],
  fighting: ['#ffb3b0', '#d95e59'],
  flying: ['#e6d3ff', '#b59beb'],
  poison: ['#eab5ea', '#b26eb2'],
  ground: ['#fcedb6', '#debc62'],
  rock: ['#e6d8a3', '#bfaa53'],
  bug: ['#eff7b5', '#bccf44'],
  ghost: ['#d3cdeb', '#8b79b5'],
  steel: ['#e3e3eb', '#acaac4'],
  fire: ['#ffccb0', '#ed9653'],
  water: ['#cde1ff', '#7a9ee8'],
  grass: ['#d8f5c4', '#8acf63'],
  electric: ['#fff2ba', '#e8c635'],
  psychic: ['#ffc4d5', '#f07d9b'],
  ice: ['#e0fafa', '#8fd1d1'],
  dragon: ['#cab3fc', '#8a5eed'],
  dark: ['#c4b5ac', '#8a7364'],
  fairy: ['#ffdeed', '#e8a5c2']
};

// Configuración: número de Pokémon a mostrar (1 destacado + 9 grilla = 10)
const numPokemon = 10;

// --- IDs Fijos de Categorías Exclusivas ---
const legendariosFijos = [144, 145, 146, 150, 243, 244, 245, 249, 250, 377, 378, 379, 380, 381, 382, 383, 384, 483, 484, 487];
const miticosFijos = [151, 251, 385, 386, 490, 492, 493, 494, 648, 649, 719, 720, 721, 801, 802, 807, 808, 809];
const megasFijas = [10033, 10034, 10035, 10036, 10037, 10038, 10039, 10040, 10041, 10042, 10043, 10044, 10045, 10048, 10050, 10051, 10052, 10053, 10054, 10055, 10057, 10062, 10073, 10075];
const regionalesFijas = [10100, 10101, 10102, 10103, 10104, 10105, 10106, 10107, 10108, 10109, 10110, 10111, 10112, 10113, 10114, 10115, 10158, 10159, 10160, 10161, 10162, 10163, 10164, 10165, 10166];
const dinamaxFijos = [10197, 10198, 10199, 10200, 10201, 10202, 10203, 10204, 10205, 10206, 10207, 10208, 10209, 10210, 10211, 10212, 10213];

// Función para generar IDs aleatorios únicos (garantizando todas las categorías)
function generarIdsAleatorios(cantidad, maxId) {
  const ids = new Set();

  // Garantizar 1 Legendario
  ids.add(legendariosFijos[Math.floor(Math.random() * legendariosFijos.length)]);

  // Garantizar 1 Mítico
  ids.add(miticosFijos[Math.floor(Math.random() * miticosFijos.length)]);

  // Garantizar 1 Megaevolución
  ids.add(megasFijas[Math.floor(Math.random() * megasFijas.length)]);

  // Garantizar 1 Variante Regional
  ids.add(regionalesFijas[Math.floor(Math.random() * regionalesFijas.length)]);

  // Garantizar 1 Dinamax / Gigamax
  ids.add(dinamaxFijos[Math.floor(Math.random() * dinamaxFijos.length)]);

  // Rellenar el resto aleatoriamente (faltarán unos 5)
  while (ids.size < cantidad) {
    let id;
    if (Math.random() < 0.20) {
      // 20% de probabilidad de tirar otra variante (Megas/Gmax/Alola)
      id = Math.floor(Math.random() * (10277 - 10001 + 1)) + 10001;
    } else {
      id = Math.floor(Math.random() * maxId) + 1;
    }
    ids.add(id);
  }

  // Mezclar para que las formas raras no aparezcan siempre en las mismas posiciones
  const arrayIds = Array.from(ids);
  for (let i = arrayIds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayIds[i], arrayIds[j]] = [arrayIds[j], arrayIds[i]];
  }

  return arrayIds;
}

// Función para obtener la región basada en el ID
function obtenerRegion(id) {
  if (id <= 151) return { nombre: "Kanto", clase: "region-kanto" };
  if (id <= 251) return { nombre: "Johto", clase: "region-johto" };
  if (id <= 386) return { nombre: "Hoenn", clase: "region-hoenn" };
  if (id <= 493) return { nombre: "Sinnoh", clase: "region-sinnoh" };
  if (id <= 649) return { nombre: "Teselia", clase: "region-teselia" };
  if (id <= 721) return { nombre: "Kalos", clase: "region-kalos" };
  if (id <= 809) return { nombre: "Alola", clase: "region-alola" };
  if (id <= 905) return { nombre: "Galar", clase: "region-galar" };
  return { nombre: "Paldea", clase: "region-paldea" };
}

// IDs aleatorios de toda la base (hasta 1025)
let ids = generarIdsAleatorios(numPokemon, 1025);

// DOM
const grid = document.querySelector("#grid");
const loader = document.querySelector("#loader");
const alertEl = document.querySelector("#alert");
const skeletonGrid = document.querySelector("#skeletonGrid");
const searchInput = document.querySelector("#searchInput");
const btnReload = document.querySelector("#btnReload"); // Nuevo botón
const featuredCardContainer = document.querySelector("#featuredCardContainer");

// Elementos del Modal
const modalEl = document.getElementById("pokeModal");
const modal = new bootstrap.Modal(modalEl);
const modalName = document.getElementById("modalName");
const modalId = document.getElementById("modalId");
const modalImg = document.getElementById("modalImg");
const modalTypes = document.getElementById("modalTypes");
const modalHeight = document.getElementById("modalHeight");
const modalWeight = document.getElementById("modalWeight");
const modalDesc = document.getElementById("modalDesc");

// Nuevos Elementos Modal
const modalAbilities = document.getElementById("modalAbilities");
const modalEggGroups = document.getElementById("modalEggGroups");
const modalGrowthRate = document.getElementById("modalGrowthRate");
const modalHeldItems = document.getElementById("modalHeldItems");
const modalBaseExp = document.getElementById("modalBaseExp");
const modalCatchRate = document.getElementById("modalCatchRate");
const modalHabitat = document.getElementById("modalHabitat");
const modalHappiness = document.getElementById("modalHappiness");

// Stats del Modal
const statHpVal = document.getElementById("statHpVal");
const statHpBar = document.querySelector("#statHpBar");
const statAtkVal = document.querySelector("#statAtkVal");
const statAtkBar = document.querySelector("#statAtkBar");
const statDefVal = document.querySelector("#statDefVal");
const statDefBar = document.querySelector("#statDefBar");
const statSpdVal = document.querySelector("#statSpdVal");
const statSpdBar = document.querySelector("#statSpdBar");

// Cache (optimización de UI y búsqueda)
let pokedexCache = []; // lista de Pokémon iniciales

/* ---------------------------
   Utilidades UI (estados)
---------------------------- */
function mostrarCargando(on, maxItems = ids.length) {
  loader.hidden = !on;
  if (on) {
    if (skeletonGrid) skeletonGrid.innerHTML = "";
    // Skeleton cards para el número de IDs u opcion por defecto
    for (let i = 0; i < maxItems; i++) {
      skeletonGrid.insertAdjacentHTML("beforeend", `
        <div class="col-md-4 mb-4">
          <div class="skeleton-card">
            <div class="skeleton-img shimmer"></div>
            <div class="skeleton-line lg shimmer"></div>
            <div class="skeleton-line md shimmer"></div>
            <div class="skeleton-line sm shimmer"></div>
            <div class="p-3 pt-0">
              <div class="skeleton-line md shimmer" style="margin:0;"></div>
            </div>
          </div>
        </div>
      `);
    }
  } else {
    skeletonGrid.innerHTML = "";
  }
}

function mostrarError(msg) {
  alertEl.textContent = msg;
  alertEl.hidden = false;
}

function ocultarError() {
  alertEl.hidden = true;
}

/* ---------------------------
   Fetch
---------------------------- */
async function obtenerPokemon(id) {
  const res = await fetch(`${BASE_POKEMON}${id}`);
  if (!res.ok) throw new Error("Error de red al obtener Pokémon");
  return res.json();
}

/**
 * Para el modal se pide “descripción breve”.
 * La PokeAPI lo da en pokemon-species -> flavor_text_entries
 * (Tomamos español si existe, si no inglés como fallback)
 */
/* ---------------------------
   Transformación de datos
---------------------------- */
function normalizarPokemon(p, speciesData, isFeatured = false, isRosterShiny = false) {
  const nombre = p.name;
  const id = p.id;
  const idFmt = `#${String(id).padStart(3, "0")}`;

  // Verificar si es Shiny (el destacado siempre lo es, o si fue elegido como shiny en el rooster)
  const isShiny = isFeatured || isRosterShiny;

  // imagen oficial (preferir shiny si corresponde, fallback al sprite regular)
  let img = "";
  if (isShiny) {
    img = p.sprites?.other?.["official-artwork"]?.front_shiny || p.sprites?.front_shiny || "";
  }
  if (!img) {
    img = p.sprites?.other?.["official-artwork"]?.front_default || p.sprites?.front_default || "";
  }

  // Sonido (Grito)
  const soundUrl = p.cries?.latest || "";

  // Datos Extensos (Nuevos Modal)
  let hab = p.abilities?.map(a => {
    return `<span class="d-block mb-1 text-capitalize">${a.ability.name} ${a.is_hidden ? '<span class="text-danger" style="font-size:0.75rem;">(Oculta)</span>' : ''}</span>`;
  }) || [];
  const habilidadesHTML = hab.length ? hab.join("") : "Desconocido";

  let itemsHTML = "Ninguno";
  if (p.held_items && p.held_items.length > 0) {
    itemsHTML = p.held_items.slice(0, 3).map(i => `<span class="d-block mb-1 text-capitalize">- ${i.item.name.replace("-", " ")}</span>`).join("");
  }

  // Datos de Especie (para descripción, rareza, cría y misceláneos)
  let descripcion = "Sin descripción disponible.";
  let isLegendary = false;
  let isMythical = false;
  let growthRate = "Desconocido";
  let eggGroupsHTML = "Desconocido";
  let baseExp = p.base_experience ? `${p.base_experience} XP` : "Desconocido";
  let captureRate = "Desconocido";
  let habitat = "Desconocido";
  let baseHappiness = "Desconocido";

  if (speciesData) {
    isLegendary = speciesData.is_legendary;
    isMythical = speciesData.is_mythical;
    captureRate = speciesData.capture_rate || "Desconocido";
    habitat = speciesData.habitat ? speciesData.habitat.name : "Desconocido";
    baseHappiness = speciesData.base_happiness || "Desconocido";

    if (speciesData.growth_rate) {
      growthRate = `<span class="text-capitalize">${speciesData.growth_rate.name.replace("-", " ")}</span>`;
    }

    if (speciesData.egg_groups && speciesData.egg_groups.length > 0) {
      eggGroupsHTML = speciesData.egg_groups.map(e => `<span class="text-capitalize">${e.name}</span>`).join(" / ");
    }

    const entries = speciesData.flavor_text_entries || [];
    const es = entries.find(e => e.language?.name === "es");
    const en = entries.find(e => e.language?.name === "en");
    const elegido = es || en;
    if (elegido) {
      descripcion = elegido.flavor_text.replace(/\s+/g, " ").trim();
    }
  }

  const tipos = p.types.map(t => t.type.name);

  // altura/peso vienen en decímetros/hectogramos (común convertir)
  const alturaM = (p.height / 10).toFixed(1) + " m";
  const pesoKg = (p.weight / 10).toFixed(1) + " kg";
  const region = obtenerRegion(id);

  // Extraer stats
  let statHp = 0, statAtk = 0, statDef = 0, statSpd = 0;
  if (p.stats) {
    p.stats.forEach(s => {
      if (s.stat.name === "hp") statHp = s.base_stat;
      if (s.stat.name === "attack") statAtk = s.base_stat;
      if (s.stat.name === "defense") statDef = s.base_stat;
      if (s.stat.name === "speed") statSpd = s.base_stat;
    });
  }

  // Clasificación Evolutiva (Stage)
  let evolutionStage = "Desconocido";
  let stageClass = "evo-basic";

  if (p.name.includes("-mega")) {
    evolutionStage = "Megaevolución";
    stageClass = "evo-mega";
  } else if (speciesData && speciesData.evolution_chain && p.evolutionChainData) {
    // Traverse the evolution tree to find the depth of the current species
    const chain = p.evolutionChainData.chain;

    // Función recursiva para encontrar la profundidad (0 = Básico, 1 = Fase 1, 2 = Fase 2)
    function findDepth(node, targetName, currentDepth = 0) {
      if (node.species.name === targetName) {
        return currentDepth;
      }
      for (let evo of node.evolves_to) {
        let foundDepth = findDepth(evo, targetName, currentDepth + 1);
        if (foundDepth !== -1) return foundDepth;
      }
      return -1;
    }

    const depth = findDepth(chain, speciesData.name);
    if (depth === 0) {
      evolutionStage = "Básico";
      stageClass = "evo-basic";
    } else if (depth === 1) {
      evolutionStage = "Fase 1";
      stageClass = "evo-stage1";
    } else if (depth >= 2) {
      evolutionStage = "Fase 2";
      stageClass = "evo-stage2";
    }
  }

  // HTML Badge for Evolution
  const evoBadgeHtml = `<span class="evo-badge ${stageClass}">${evolutionStage}</span>`;

  return {
    id, idFmt, nombre, img, tipos, alturaM, pesoKg, region,
    statHp, statAtk, statDef, statSpd, isShiny, soundUrl,
    descripcion, isLegendary, isMythical,
    habilidadesHTML, itemsHTML, growthRate, eggGroupsHTML,
    evoBadgeHtml, baseExp, captureRate, habitat, baseHappiness
  };
}

// Función para reproducir sonido
function playCry(btn, url) {
  if (!url) return;
  const audio = new Audio(url);
  audio.volume = 0.5; // evitar que suene demasiado fuerte

  // Animación del botón pulsado
  btn.style.transform = "scale(0.8)";
  setTimeout(() => btn.style.transform = "", 150);

  audio.play();
}

/* ---------------------------
   Render Cards
---------------------------- */
function renderFeaturedCard(p) {
  const t1 = p.tipos[0];
  const t2 = p.tipos.length > 1 ? p.tipos[1] : null;

  let cardBg = '';
  const rgb1 = typeBgColors[t1] || typeBgColors.normal;
  if (t2) {
    const rgb2 = typeBgColors[t2] || typeBgColors.normal;
    cardBg = `background: linear-gradient(135deg, ${rgb1[0]} 0%, ${rgb1[1]} 45%, ${rgb2[0]} 55%, ${rgb2[1]} 100%);`;
  } else {
    cardBg = `background: linear-gradient(135deg, ${rgb1[0]}, ${rgb1[1]});`;
  }

  const borderColor = typeColors[t1] || '#999';

  let isRarity = p.isLegendary || p.isMythical;
  let cssRarityCardClass = isRarity ? 'rarity-card-glow' : '';
  let rarityBadgeHtml = p.isLegendary ? '<span class="badge rarity-legendary ms-2">🌟 LEGENDARIO</span>' :
    (p.isMythical ? '<span class="badge rarity-mythical ms-2">✨ MÍTICO</span>' : '');

  featuredCardContainer.innerHTML = `
    <div class="holographic-card mb-4 ${cssRarityCardClass}">
      <div class="holo-img-container">
        <img src="${p.img}" alt="${p.nombre}">
      </div>
      <div class="holo-body">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h2 class="holo-title text-capitalize mb-2">${p.nombre}</h2>
            <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
              <span class="badge" style="background: rgba(0, 255, 255, 0.2); color: #0ff; border: 1px solid #0ff;">${p.idFmt}</span>
              ${p.evoBadgeHtml}
              ${p.isShiny ? '<span class="badge" style="background: rgba(255, 215, 0, 0.2); color: #ffd700; border: 1px solid #ffd700;">✨ SHINY</span>' : ''}
              ${rarityBadgeHtml}
            </div>
          </div>
          <button class="sound-btn" onclick="playCry(this, '${p.soundUrl}')" title="Descifrar Patrón de Sonido" style="background: rgba(0,255,255,0.1); border-color: #0ff; color: #0ff;" ${!p.soundUrl ? 'disabled' : ''}>
            <i class="bi bi-soundwave fs-4"></i>
          </button>
        </div>
        
        <p class="mb-2" style="color: #64ffda; font-weight: 700; font-family: 'Courier New', monospace;">
          <i class="bi bi-geo-alt-fill text-info me-1"></i> [ LOC: ${p.region.nombre.toUpperCase()} ]
        </p>

        <p class="holo-pokedex-desc mb-3">
          > ${p.descripcion}
        </p>

        <div class="mb-4">
          ${p.tipos.map(t => `<span class="badge type-${t} me-2 text-uppercase py-1 px-2 border" style="background: transparent;">${t}</span>`).join("")}
        </div>

        <div class="mt-auto">
          <button class="btn btn-holo px-4 fw-bold" onclick="abrirModalDetalle(${p.id})">
            INICIAR ANÁLISIS
          </button>
        </div>
      </div>
    </div>
  `;

  featuredCardContainer.hidden = false;
}

function renderCards(lista) {
  grid.innerHTML = "";

  for (const p of lista) {
    const t1 = p.tipos[0];
    const t2 = p.tipos.length > 1 ? p.tipos[1] : null;

    let cardBg = '';
    const rgb1 = typeBgColors[t1] || typeBgColors.normal;
    if (t2) {
      const rgb2 = typeBgColors[t2] || typeBgColors.normal;
      // Gradiente suave combinando los dos tipos
      cardBg = `background: linear-gradient(135deg, ${rgb1[0]} 0%, ${rgb1[1]} 45%, ${rgb2[0]} 55%, ${rgb2[1]} 100%);`;
    } else {
      // Gradiente del tipo único
      cardBg = `background: linear-gradient(135deg, ${rgb1[0]}, ${rgb1[1]});`;
    }

    const borderColor = typeColors[t1] || '#999';

    let isRarity = p.isLegendary || p.isMythical;
    let cssRarityCardClass = isRarity ? 'rarity-card-glow border-warning border-3' : '';
    let rarityBadgeHtml = p.isLegendary ? '<span class="badge rarity-legendary ms-2 mb-2 d-inline-block">🌟 LEGENDARIO</span>' :
      (p.isMythical ? '<span class="badge rarity-mythical ms-2 mb-2 d-inline-block">✨ MÍTICO</span>' : '');

    grid.insertAdjacentHTML("beforeend", `
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow-sm rounded-4 ${cssRarityCardClass}" style="${cardBg}">
          ${p.isShiny ? '<div class="sparkle-container">✨</div>' : ''}
          <img src="${p.img}" class="card-img-top p-4" alt="${p.nombre}" style="border-bottom: 3px solid ${borderColor};">
          <div class="card-body d-flex flex-column align-items-center text-center">
            <div class="mb-2 d-flex flex-wrap justify-content-center gap-1 align-items-center w-100">
              <h5 class="card-title text-capitalize mb-1 me-1" style="color: #222; font-size: 1.4rem;">${p.nombre}</h5>
            </div>
            <div class="mb-2 d-flex flex-wrap justify-content-center gap-1 align-items-center w-100">
              <span class="badge bg-dark text-white opacity-75">${p.idFmt}</span>
              ${p.evoBadgeHtml}
              ${p.isShiny ? '<span class="badge shiny-badge ms-1">SHINY</span>' : ''}
            </div>
            ${p.isLegendary || p.isMythical ? `<div class="mb-2 w-100">${rarityBadgeHtml}</div>` : ''}
            
            <p class="small mb-2 w-100" style="color: #333; font-weight: 700;"><i class="bi bi-geo-alt-fill text-danger"></i> ${p.region.nombre}</p>

            <div class="mb-3 w-100 d-flex justify-content-center">
              ${p.tipos.map(t => `
                <span class="badge type-${t} mx-1 text-uppercase">${t}</span>
              `).join("")}
            </div>

            <button class="btn btn-primary btn-sm px-4 mt-auto" data-id="${p.id}">
              Ver más
            </button>
          </div>
        </div>
      </div>
    `);
  }

  // Delegación simple: escuchamos clicks del grid y abrimos modal
  grid.querySelectorAll("button[data-id]").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = Number(e.currentTarget.dataset.id);
      await abrirModalDetalle(id);
    });
  });
}

/* ---------------------------
   Modal Detalle
---------------------------- */
async function abrirModalDetalle(id) {
  // Obtenemos del cache el “core” del pokemon
  const base = pokedexCache.find(p => p.id === id);
  if (!base) return;

  // Pintamos lo inmediato
  modalName.textContent = base.nombre;
  modalId.textContent = base.idFmt;
  modalImg.src = base.img;
  modalImg.alt = `Imagen de ${base.nombre}`;
  modalTypes.innerHTML = base.tipos.map(t =>
    `<span class="badge type-${t} me-2 text-uppercase">${t}</span>`
  ).join("");
  modalHeight.textContent = base.alturaM;
  modalWeight.textContent = base.pesoKg;

  // Actualizar Barras de Stats (max 255 aprox)
  const MAX_STAT = 255;
  statHpVal.textContent = base.statHp;
  statHpBar.style.width = `${(base.statHp / MAX_STAT) * 100}%`;

  statAtkVal.textContent = base.statAtk;
  statAtkBar.style.width = `${(base.statAtk / MAX_STAT) * 100}%`;

  statDefVal.textContent = base.statDef;
  statDefBar.style.width = `${(base.statDef / MAX_STAT) * 100}%`;

  statSpdVal.textContent = base.statSpd;
  statSpdBar.style.width = `${(base.statSpd / MAX_STAT) * 100}%`;

  // Cargamos datos extra avanzados
  modalAbilities.innerHTML = base.habilidadesHTML;
  modalEggGroups.innerHTML = base.eggGroupsHTML;
  modalGrowthRate.innerHTML = base.growthRate;
  modalHeldItems.innerHTML = base.itemsHTML;
  modalBaseExp.textContent = base.baseExp;
  modalCatchRate.innerHTML = `${base.captureRate} <span style="font-size:0.75rem;opacity:0.7;">(1-255)</span>`;
  modalHabitat.textContent = base.habitat;
  modalHappiness.textContent = base.baseHappiness;

  // Cargamos descripción dinámica guardada en cache
  modalDesc.textContent = base.descripcion;

  modal.show();
}

/* ---------------------------
   Fetch Auxiliar para Species
---------------------------- */
async function obtenerSpecies(id) {
  try {
    const res = await fetch(`${BASE_SPECIES}${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

/* ---------------------------
   Fetch Auxiliar para Evolution Chain
---------------------------- */
async function obtenerEvolution(url) {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

/* ---------------------------
   Cargar Pokédex (Promise.all)
---------------------------- */
async function cargarPokedex() {
  try {
    ocultarError();
    mostrarCargando(true);

    // Fetch paralelo de Pokemon Details y Species Details
    const pokemonFetchPromises = ids.map(obtenerPokemon);
    const speciesFetchPromises = ids.map(obtenerSpecies);

    const [dataPokemon, dataSpecies] = await Promise.all([
      Promise.all(pokemonFetchPromises),
      Promise.all(speciesFetchPromises)
    ]);

    // Fetch paralelo de Cadena Evolutiva para cada Species
    const evolutionFetchPromises = dataSpecies.map(species => {
      // Some pokemon (like Megas parsed manually) might not have valid species/evolutions
      if (species && species.evolution_chain && species.evolution_chain.url) {
        return obtenerEvolution(species.evolution_chain.url);
      }
      return null;
    });
    const dataEvolutions = await Promise.all(evolutionFetchPromises);

    // Adjuntar la cadena evolutiva al objeto de pokemon temporalmente para la normalización
    dataPokemon.forEach((p, i) => {
      p.evolutionChainData = dataEvolutions[i];
    });

    // Elegir el índice del Featured al azar (antes de procesar rarity/shiny forzados)
    const idxFeatured = Math.floor(Math.random() * ids.length);

    // Seleccionar de entre el "roster normal" para garantizar shiny
    // El roster excluye al featured para aplicar las reglas de garantía independientemente
    let indicesNormales = [];
    for (let i = 0; i < ids.length; i++) {
      if (i !== idxFeatured) indicesNormales.push(i);
    }
    const idxShinyRooster = indicesNormales[Math.floor(Math.random() * indicesNormales.length)];

    // Normalizamos y guardamos en cache
    pokedexCache = dataPokemon.map((p, i) => {
      const isFeatured = (i === idxFeatured);

      // La rareza viene de dataSpecies[i], pero no forzaremos legendarios al featured, depende del "ids" aleatorio

      // Lógica de "shiny":
      // Si es parte del roster elegido para ser shiny:
      // Si es featured, tiene 10% prob de ser shiny (totalmente aleatorio y no garantizado):
      let finalShinyStatus = false;
      if (isFeatured) {
        finalShinyStatus = Math.random() < 0.1; // 10% chance
      } else if (i === idxShinyRooster) {
        finalShinyStatus = true; // el rooster normal tiene 1 garantizado
      }

      return normalizarPokemon(p, dataSpecies[i], false, finalShinyStatus); // Pasamos 'false' en depends on feature to avoid old logic overriding
    });

    // Dividimos listas:
    const featured = pokedexCache[idxFeatured];
    const listNormales = pokedexCache.filter((_, i) => i !== idxFeatured);

    // Renderizamos la card destacada y el grid de las normales
    if (featured) renderFeaturedCard(featured);
    renderCards(listNormales);
  } catch (e) {
    console.error(e);
    mostrarError("Error de red: no fue posible obtener datos de la PokeAPI. Intenta nuevamente.");
  } finally {
    mostrarCargando(false);
  }
}

/* ---------------------------
   Búsqueda Global API
---------------------------- */
let isSearching = false;

searchInput.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    const q = searchInput.value.trim().toLowerCase();

    if (q === "") {
      isSearching = false;
      renderCards(pokedexCache); // Restaurar lista inicial
      return;
    }

    try {
      isSearching = true;
      grid.innerHTML = "";
      ocultarError();
      mostrarCargando(true, 1); // mostrar 1 skeleton

      // Buscar en API Real
      const res = await fetch(`${BASE_POKEMON}${q}`);
      if (!res.ok) throw new Error("Pokémon no encontrado");
      const pData = await res.json();
      const pSpecies = await obtenerSpecies(pData.id);

      let pEvoData = null;
      if (pSpecies && pSpecies.evolution_chain && pSpecies.evolution_chain.url) {
        pEvoData = await obtenerEvolution(pSpecies.evolution_chain.url);
      }
      pData.evolutionChainData = pEvoData;

      const p = normalizarPokemon(pData, pSpecies, false, false);

      // Añadir temporalmente al cache para abrir el modal si es necesario
      if (!pokedexCache.find(poke => poke.id === p.id)) {
        pokedexCache.push(p);
      }

      if (featuredCardContainer) featuredCardContainer.hidden = true; // Ocultar destacado en búsqueda
      renderCards([p]);
    } catch (err) {
      console.error(err);
      mostrarError("No se encontró el Pokémon. Verifica el nombre.");
      grid.innerHTML = "";
    } finally {
      mostrarCargando(false);
    }
  }
});

// Botón de recargar (Reroll)
if (btnReload) {
  btnReload.addEventListener("click", () => {
    ids = generarIdsAleatorios(numPokemon, 1010);
    searchInput.value = "";
    cargarPokedex();
  });
}

/* Init */
document.addEventListener("DOMContentLoaded", cargarPokedex);