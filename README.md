# 🧬 PETYADEX: La Enciclopedia Pokémon Definitiva

**PETYADEX** es una aplicación web de alto rendimiento y estética premium diseñada para ofrecer una experiencia de consulta Pokémon profunda y visualmente impactante. Transformada de una simple Pokédex a una enciclopedia de datos de alta fidelidad, PETYADEX integra información biológica, técnica y evolutiva avanzada directamente desde la **PokeAPI**.

![Petyadex Homepage](file:///C:/Users/dell/.gemini/antigravity/brain/16d61043-72b4-4133-861b-952dbbf6734c/petyadex_homepage_1774593504330.png)

## ✨ Características Principales

### 🔬 Escáner de ADN (Búsqueda Avanzada)
Sistema de búsqueda de alta visibilidad con estética cian pulsante que permite identificar instantáneamente Pokémon y sus formas alternativas. Al buscar un nombre base, el escáner detecta y muestra automáticamente **Mega-evoluciones**, **Formas Gigamax** y **Variantes Regionales**.

![DNA Scanner Results](file:///C:/Users/dell/.gemini/antigravity/brain/16d61043-72b4-4133-861b-952dbbf6734c/gengar_search_results_1774593494505.png)

### 📚 Enciclopedia de 5 Pestañas
Cada Pokémon cuenta con un expediente detallado distribuido en una interfaz de pestañas de alta densidad:
1. **Resumen**: Estadísticas base (BST), descripción biográfica y métricas físicas.
2. **Combate**: Listado de habilidades (incluyendo ocultas) y movimientos totales.
3. **Evolución**: Reconstrucción inteligente de la cadena evolutiva original, permitiendo navegar entre formas base y variantes (Mega/Regional) sin interrupciones.
4. **Mundo**: Ubicaciones de encuentro y hábitats registrados.
5. **Crianza**: Grupos de huevo, ciclos de eclosión y tasas de crecimiento.

### 🎨 Estética Premium y UX
- **Diseño Dark Moderno**: Interfaz optimizada para legibilidad y estilo tecnológico.
- **Carga Diferida**: Los datos profundos (movimientos, localizaciones) se cargan de forma asíncrona para garantizar que el modal se abra al instante.
- **Interactividad Total**: Cabecera interactiva y enlaces directos a la documentación de PokeAPI.
- **Reglas de Calidad**: El sistema omite automáticamente secciones sin datos (descripciones vacías o movimientos inexistentes) para mantener la limpieza visual.

## 🛠️ Stack Tecnológico
- **Core**: Vanilla JavaScript (ES6+)
- **Estilos**: Tailwind CSS (via CDN)
- **API**: [PokeAPI](https://pokeapi.co/)
- **Build Tool**: Vite (para desarrollo rápido)

## 🚀 Instalación y Uso

1. Clona el repositorio.
2. Instala las dependencias: `npm install`
3. Inicia el servidor de desarrollo: `npm run dev`

---
*Desarrollado con ❤️ para entrenadores que buscan el siguiente nivel de información.*
