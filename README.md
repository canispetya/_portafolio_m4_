# Random Pokédex (Bootstrap 5 + JS + Fetch)

## Descripción
Random Pokédex moderna con diseño inspirado en el dispositivo clásico de Pokémon. Consume la **PokeAPI** para obtener **12 Pokémon aleatorios** de toda la base disponible (IDs 1–1010) y renderiza una grilla **responsive** con **cards estilizadas**. Incluye **modal de detalle**, **skeleton de carga**, **alert de error** y un diseño futurista con tema oscuro, gradientes y animaciones.

## Requisitos cumplidos
- ✅ Fetch/async–await a PokeAPI
- ✅ 12 Pokémon aleatorios (de toda la base, IDs 1–1010)
- ✅ Card por Pokémon con:
  - nombre (capitalize),
  - imagen oficial (official artwork),
  - ID formateado (#001),
  - tipos como badges con colores asociados.
- ✅ Responsive grid con Bootstrap (`row` + `col-md-4`)
- ✅ Interacción: botón **Ver más** abre modal con detalle
- ✅ Estados UI: skeleton loading + alert error de red
- ✅ (Opcional) Búsqueda por nombre (filtra en memoria)
- ✅ Diseño moderno: Tema Pokédex con carcasa roja, pantalla verde fosforescente, botones y D-pad

## Tecnologías
- HTML5
- CSS3 + Bootstrap 5 (CDN) + Google Fonts (Orbitron)
- JavaScript ES6+ (Fetch API, async/await, DOM)

## Estructura
_portafolio_m4_/
- index.html
- assets/
  - css/styles.css
  - js/app.js
- README.md

## Ejecutar
- Ejecutar un servidor local: `python -m http.server 8000`
- Abrir `http://localhost:8000` en el navegador
- Alternativa: Abrir `index.html` directamente (puede haber restricciones de CORS)

## Características del Diseño
- **Dispositivo Pokédex**: Carcasa roja con gradientes, pantalla negra con efecto verde.
- **Elementos Interactivos**: Luces rojas/azules, botones A/B, D-pad.
- **Animaciones**: Hover effects en tarjetas y dispositivo.
- **Tema Oscuro**: Colores inspirados en Pokédex clásicas (rojo, negro, verde).
- **Badges de Tipos**: Cada tipo tiene su color oficial de Pokémon.
- **Responsive**: Adaptable a diferentes tamaños de pantalla.

## Capturas
Agrega capturas:
- Vista general del dispositivo Pokédex
- Grid 3×3 de cards con estilo moderno
- Modal “Ver más” con tema adaptado
- Skeleton de carga y alert de error en pantalla verde

## Git/GitHub (recordatorio)
```bash
git init
git add .
git commit -m "feat: pokedex moderna con diseño dispositivo (bootstrap + fetch + modal + css moderno)"
git branch -M main
git remote add origin https://github.com/<usuario>/_portafolio_m4_.git
git push -u origin main
```