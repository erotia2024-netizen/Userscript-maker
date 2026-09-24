// ==UserScript==
// @name         h-flash.com
// @version      0.1.201
// @description  Escrito en el laboratorio de Userscript Maker.
// @author       Userscript Maker
// @namespace    https://github.com/erotia2024-netizen/Userscript-maker
// @homepageURL  https://github.com/erotia2024-netizen/Userscript-maker
// @downloadURL  https://raw.githubusercontent.com/erotia2024-netizen/Userscript-maker/main/h-flash-com.user.js
// @updateURL    https://raw.githubusercontent.com/erotia2024-netizen/Userscript-maker/main/h-flash-com.user.js
// @match        *://h-flash.com/*
// @match        *://*.h-flash.com/*
// @run-at       document-start
// @noframes
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      *
// ==/UserScript==

(function () {
  "use strict";
  var css = "/* =============================================================================================\n   h-flash.com — el CSS del userscript (lo pega el compilador del laboratorio dentro del .user.js).\n\n   La web es del año 2005: 1280 px fijos, cabecera de 300 px con 180 de aire, tarjetas de 152 px,\n   rosa chicle y blanco nuclear. Aquí está todo lo que hace falta para ponerla al día sin tocar su\n   HTML ni su JS: los colores salen de variables (bloque 1), la maquetación fluida vive en el bloque\n   2 y todo lo demás es repintar la web pieza a pieza.\n\n   Los bloques de maquetación van dentro de `@media (min-width: 1025px)` a propósito: por debajo de\n   ese ancho manda `mobile.css` del propio sitio, que ya tiene su versión móvil y no hay por qué\n   pisarla (esto es para PC).\n\n   Índice\n     1. la piel (variables)\n     2. la página (fondo, tipografía, contenedores fluidos)\n     3. la cabecera (logo, fila de publicidad, navegación, buscador)\n     4. títulos de sección y migas\n     5. las rejillas de juegos (tarjetas)\n     6. la ficha de juego: el marco del reproductor\n     7. el controlador de la web y las cajas de arranque\n     8. la información del juego, etiquetas y relacionadas\n     8b. la columna derecha de los listados (cajas y fichas con puesto)\n     9. listas, paginación y formularios\n    10. el pie\n    11. lo nuestro (panel, botón, avisos, marcas)\n    12. los iconos del sprite en la piel oscura\n    13. pantallas estrechas\n   ============================================================================================= */\n\n/* ---------------------------------------------------------------------------------------------\n   1. LA PIEL — todo el color sale de aquí\n   --------------------------------------------------------------------------------------------- */\nhtml.hf {\n  --hf-bg: #0b0d12;\n  --hf-bg2: #12151d;\n  --hf-card: 190px; /* lo cambia el panel; con 0 se deja el tamaño de la web */\n  --hf-bg3: #171b25;\n  --hf-line: #2a3140;\n  --hf-line2: #38414f;\n  --hf-text: #e9edf7;\n  --hf-dim: #98a2b8;\n  --hf-dim2: #6f7a91;\n  --hf-accent: #ff3fa4;\n  --hf-accent-2: #7a5cff;\n  --hf-accent-soft: rgba(255, 63, 164, 0.14);\n  --hf-ok: #4bd39b;\n  --hf-bad: #ff6b6b;\n  --hf-radius: 12px;\n  --hf-radius-s: 8px;\n  --hf-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);\n}\n\nhtml.hf.hf-skin-claro {\n  --hf-bg: #f5f6fa;\n  --hf-bg2: #ffffff;\n  --hf-bg3: #ffffff;\n  --hf-line: #e3e7f0;\n  --hf-line2: #cfd6e4;\n  --hf-text: #171b26;\n  --hf-dim: #5d687e;\n  --hf-dim2: #8791a6;\n  --hf-accent: #e0248c;\n  --hf-accent-2: #5b45d6;\n  --hf-accent-soft: rgba(224, 36, 140, 0.1);\n  --hf-shadow: 0 10px 26px rgba(20, 26, 45, 0.12);\n}\n\n/* ---------------------------------------------------------------------------------------------\n   2. LA PÁGINA\n   --------------------------------------------------------------------------------------------- */\nhtml.hf {\n  background: var(--hf-bg);\n}\n\nhtml.hf body {\n  background: var(--hf-bg) !important;\n  color: var(--hf-text) !important;\n  font-family: system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif !important;\n  text-align: start !important;\n  -webkit-font-smoothing: antialiased;\n}\n\nhtml.hf a {\n  color: var(--hf-text);\n}\n\nhtml.hf a:hover {\n  color: var(--hf-accent);\n}\n\nhtml.hf img {\n  border-color: var(--hf-line) !important;\n}\n\n/* El sitio fija 1280 px: en una pantalla grande queda un pasillo a los lados y entre 1025 y 1280\n   aparecía scroll horizontal. Aquí el ancho es el de la ventana, con un tope generoso. */\n@media (min-width: 1025px) {\n  html.hf body .pagebody {\n    width: auto !important;\n    max-width: 1720px;\n    margin: 0 auto !important;\n    padding-left: clamp(12px, 2vw, 28px);\n    padding-right: clamp(12px, 2vw, 28px);\n    box-sizing: border-box;\n  }\n  html.hf body .pagefoot {\n    width: auto !important;\n    max-width: 1720px;\n    margin: 18px auto 0 !important;\n    padding: 14px clamp(12px, 2vw, 28px);\n    box-sizing: border-box;\n  }\n  /* La ficha de juego (y cualquier página con columna lateral): la de la izquierda se come el\n     hueco que sobre y la de la derecha se queda en sus 300 px, sin `position:absolute` de por\n     medio (el sitio la saca del flujo y quedaba pegada arriba, encima de la cabecera). */\n  /* OJO: en esta web la CABECERA también es un `.pagebody` (lleva las dos clases), y si se pone en\n     fila se desmonta: el anuncio de la cabecera es un 728x90 que la web agranda con\n     `transform:scale(1.76)` para llenar los 1280 px, y en una fila encogida se sale de la pantalla.\n     Solo van en fila las páginas de contenido. */\n  html.hf.hf-split body .pagebody:not(.pagehead) {\n    display: flex !important;\n    flex-wrap: wrap;\n    align-items: flex-start;\n    gap: 20px;\n  }\n  /* la miga de pan, el título de la sección y cualquier otro hermano suelto ocupan la fila entera,\n     encima de las columnas (si no, en la fila de al lado el título se comía el ancho de la\n     izquierda: en /hot/ la columna de las tarjetas quedaba en 293 px) */\n  html.hf.hf-split body .pagebody:not(.pagehead) > *:not(.pageleft):not(.pageright):not(#flash_pageleft):not(#flash_pageright) {\n    flex: 0 0 100%;\n  }\n  html.hf.hf-split .pageleft {\n    float: none !important;\n    width: auto !important;\n    /* la web la estira a 1500 px de alto porque su columna derecha va en `position:absolute` y\n       necesitaba sitio; con las dos columnas de verdad sobra ese hueco */\n    min-height: 0 !important;\n    flex: 1 1 0;\n    min-width: 0;\n    clear: none !important;\n  }\n  /* La de la derecha se queda en sus 300 px, pero sin los márgenes que la web le pone para sacarla\n     del flujo: `margin-left:976px` la empujaba fuera de la pantalla (y con ella la página entera,\n     porque eso alargaba el ancho desplazable). */\n  html.hf.hf-split .pageright {\n    float: none !important;\n    position: static !important;\n    width: 300px !important;\n    flex: 0 0 300px;\n    margin: 8px 0 0 !important;\n  }\n}\n\n/* ---------------------------------------------------------------------------------------------\n   3. LA CABECERA\n   --------------------------------------------------------------------------------------------- */\nhtml.hf body .pagehead {\n  display: block !important;\n  height: auto !important;\n  min-height: 0 !important;\n  padding: 10px clamp(12px, 2vw, 28px) 12px !important;\n  background: var(--hf-bg2) !important;\n  border-bottom: 1px solid var(--hf-line);\n  box-sizing: border-box;\n}\n\n/* El banner de la cabecera: la web sirve un 728x90 y lo agranda con `transform:scale(1.76)` en\n   línea (728*1.76 = 1281, los 1280 px del diseño original). Con el diseño fluido eso se sale de la\n   pantalla en ventanas medianas, así que `skin.js` recalcula la escala para que quepa justo (sin\n   taparlo nunca: se encoge, no se recorta) y reserva el alto que ocupa de verdad. */\n\nhtml.hf .pagehead .logo {\n  width: 100px;\n  height: 26px;\n  margin: 4px 0 0 0;\n  vertical-align: middle;\n}\n\n/* La fila de publicidad del pie de cabecera (enlaces de texto): la web la saca del flujo con\n   `position:absolute` y un margen negativo. Aquí vuelve al flujo, pequeña y sin estorbar. */\nhtml.hf #ads_a {\n  position: static !important;\n  width: auto !important;\n  height: auto !important;\n  margin: 0 0 0 14px !important;\n  display: inline-flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 4px 12px;\n  font-weight: 600 !important;\n  font-size: 12px;\n  vertical-align: middle;\n}\n\nhtml.hf #ads_a a {\n  margin: 0 !important;\n  background: transparent !important;\n  color: var(--hf-text) !important;\n  opacity: 0.82;\n}\n\nhtml.hf #ads_a a:hover {\n  opacity: 1;\n}\n\nhtml.hf #ads_a a:hover {\n  color: var(--hf-accent) !important;\n}\n\n/* la barra de navegación (tres líneas: secciones, etiquetas, etiquetas) */\nhtml.hf .nav {\n  margin: 10px 0 0 0 !important;\n  border-radius: var(--hf-radius) !important;\n  box-shadow: none !important;\n  background: var(--hf-bg3);\n  border: 1px solid var(--hf-line);\n  color: var(--hf-dim2) !important;\n  overflow: hidden;\n}\n\n/* Los enlaces de la web traen a veces un fondo blanco en línea (los del anuncio de arriba): en la\n   piel oscura se veían como cuadros blancos sueltos. El resalte al pasar el ratón lo ponen las\n   reglas de cada línea. */\nhtml.hf .nav a,\nhtml.hf .nav a:hover {\n  background: transparent !important;\n}\n\nhtml.hf .nav > div {\n  border-radius: 0 !important;\n}\n\nhtml.hf .nav .line1 {\n  background: transparent !important;\n  border-bottom: 1px solid var(--hf-line);\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 2px;\n  padding: 2px 6px;\n}\n\nhtml.hf .nav .line1 a {\n  padding: 8px 12px !important;\n  border-radius: var(--hf-radius-s) !important;\n  font-weight: 700 !important;\n  font-size: 13px;\n  letter-spacing: 0.03em;\n  color: var(--hf-text) !important;\n}\n\nhtml.hf .nav .line1 a:hover {\n  background: var(--hf-accent-soft) !important;\n  color: var(--hf-accent) !important;\n}\n\n/* las dos filas de etiquetas de la cabecera: en la web son una lista de enlaces sin más, de ahí\n   que pareciera «un montón de texto suelto». Como píldoras, con su fondo y su hueco regular, se\n   leen de un vistazo (y las de autor, que son otro tipo de enlace, van con el color de acento). */\nhtml.hf .nav .line2,\nhtml.hf .nav .line3 {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 3px 4px;\n  background: transparent !important;\n  /* la web separa estas filas con un filo rosa claro (`#FFCCF2`): sobre el fondo oscuro brillaba */\n  border-color: var(--hf-line) !important;\n  padding: 6px 8px 5px;\n}\n\nhtml.hf .nav .line2 a,\nhtml.hf .nav .line3 a {\n  padding: 2px 9px !important;\n  margin: 0 !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: 999px !important;\n  background: var(--hf-bg3) !important;\n  font-size: 11.5px;\n  line-height: 1.6;\n  color: var(--hf-dim) !important;\n  text-decoration: none !important;\n}\n\nhtml.hf .nav .line2 a[href^=\"/author/\"],\nhtml.hf .nav .line3 a[href^=\"/author/\"] {\n  background: var(--hf-accent-soft) !important;\n  border-color: transparent !important;\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .nav .line2 a:hover,\nhtml.hf .nav .line3 a:hover {\n  background: var(--hf-accent-soft) !important;\n  border-color: var(--hf-accent) !important;\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .nav a.fav {\n  background: transparent !important;\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .nav a.fav:before {\n  filter: none;\n}\n\n/* el buscador */\nhtml.hf .navsearch {\n  margin: 0 6px 0 0 !important;\n  display: inline-flex;\n  align-items: center;\n}\n\nhtml.hf .navsearch .keyword {\n  width: 240px !important;\n  height: 32px !important;\n  padding: 0 12px !important;\n  border: 1px solid var(--hf-line2) !important;\n  border-right: none !important;\n  border-radius: var(--hf-radius-s) 0 0 var(--hf-radius-s) !important;\n  background: var(--hf-bg) !important;\n  background-image: none !important;\n  color: var(--hf-text) !important;\n  font-weight: 500 !important;\n  font-size: 13px;\n}\n\nhtml.hf .navsearch .keyword:focus {\n  outline: none;\n  border-color: var(--hf-accent) !important;\n}\n\nhtml.hf .navsearch .keyword::placeholder {\n  color: var(--hf-dim2);\n}\n\nhtml.hf .navsearch .submit {\n  width: auto !important;\n  height: 32px !important;\n  padding: 0 16px !important;\n  border: 1px solid var(--hf-accent) !important;\n  border-radius: 0 var(--hf-radius-s) var(--hf-radius-s) 0 !important;\n  background: var(--hf-accent) !important;\n  background-image: none !important;\n  color: #fff !important;\n  font-weight: 700 !important;\n  font-size: 12px !important;\n  letter-spacing: 0.06em;\n  cursor: pointer;\n}\n\nhtml.hf .navsearch .submit:hover {\n  filter: brightness(1.08);\n}\n\n/* ---------------------------------------------------------------------------------------------\n   4. TÍTULOS DE SECCIÓN Y MIGAS\n   --------------------------------------------------------------------------------------------- */\nhtml.hf .mtitle {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 10px;\n  margin: 14px 0 8px;\n  /* la web las pinta en rosa claro (`#FFE5F8`) a todo lo ancho: en la piel oscura, una franja\n     oscura con un filo de color */\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line) !important;\n  border-left: 3px solid var(--hf-accent) !important;\n  border-radius: var(--hf-radius-s) !important;\n  color: var(--hf-text) !important;\n  padding: 6px 12px !important;\n  height: auto !important;\n  line-height: 1.4 !important;\n  font-size: 13px !important;\n  font-weight: 700 !important;\n  letter-spacing: 0.04em;\n}\n\nhtml.hf .mtitle a {\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .dhead {\n  padding: 3px 0 3px 11px !important;\n  background: transparent !important;\n  color: var(--hf-text) !important;\n  border-left: 4px solid var(--hf-accent);\n  border-radius: 0 !important;\n  box-shadow: none !important;\n  font-weight: 800 !important;\n  font-size: 15px !important;\n  letter-spacing: 0.07em;\n  text-transform: uppercase;\n  display: inline-block;\n}\n\nhtml.hf h1.dhead {\n  font-size: 22px !important;\n  letter-spacing: 0.02em;\n  text-transform: none;\n}\n\nhtml.hf .gameinfo .dhead,\nhtml.hf .chesshead {\n  font-size: 12px !important;\n}\n\nhtml.hf .chead {\n  color: var(--hf-dim) !important;\n  font-size: 11px;\n  font-weight: 700;\n  letter-spacing: 0.06em;\n  padding: 4px 10px;\n  border: 1px solid var(--hf-line);\n  border-radius: 999px;\n  background: var(--hf-bg3);\n}\n\nhtml.hf .chead:hover {\n  color: var(--hf-accent) !important;\n  border-color: var(--hf-accent);\n}\n\nhtml.hf .location {\n  margin: 12px 0 6px;\n  color: var(--hf-dim) !important;\n  font-size: 12px;\n}\n\nhtml.hf .location a {\n  color: var(--hf-dim) !important;\n}\n\nhtml.hf .location a:hover {\n  color: var(--hf-accent) !important;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   5. LAS REJILLAS DE JUEGOS\n   --------------------------------------------------------------------------------------------- */\n@media (min-width: 1025px) {\n  /* La tarjeta de toda la vida: 152×200 fijos con una miniatura de 140. Ahora el ancho sale de\n     `--hf-card` (el panel) y la miniatura llena la tarjeta, así que la rejilla se recoloca sola. */\n  html.hf .gameboxlite {\n    width: var(--hf-card) !important;\n    height: auto !important;\n    margin: 5px 5px !important;\n    padding: 0 0 2px !important;\n    background: transparent !important;\n    text-align: center;\n    border-radius: var(--hf-radius);\n    overflow: hidden;\n    box-sizing: border-box;\n    transition: transform 0.12s ease, background 0.12s ease;\n  }\n\n  html.hf a.gameboxlite {\n    display: inline-block;\n    vertical-align: top;\n    float: left;\n  }\n\n  html.hf .gameboxlite:hover {\n    background: var(--hf-accent-soft) !important;\n    box-shadow: none !important;\n    transform: translateY(-2px);\n  }\n\n  html.hf .gameboxlite .thumb {\n    width: 100% !important;\n    height: auto !important;\n    aspect-ratio: 1 / 1;\n    object-fit: cover;\n    margin: 0 !important;\n    border: 1px solid var(--hf-line) !important;\n    border-radius: var(--hf-radius-s) !important;\n    background: var(--hf-bg3);\n    display: block !important;\n    float: none !important;\n  }\n\n  html.hf .gameboxlite:hover .thumb {\n    border-color: var(--hf-accent) !important;\n  }\n\n  html.hf .gameboxlite .title {\n    display: -webkit-box;\n    -webkit-line-clamp: 2;\n    -webkit-box-orient: vertical;\n    overflow: hidden;\n    height: 2.9em;\n    margin: 6px 4px 4px !important;\n    font-size: 12.5px;\n    font-weight: 600;\n    line-height: 1.45;\n    text-align: start;\n    color: var(--hf-text) !important;\n    word-break: break-word;\n  }\n\n  html.hf .gameboxlite:hover .title {\n    color: var(--hf-accent) !important;\n  }\n\n  /* el cuadro de arriba a la izquierda (contador y nota de la web) y el de rank de las listas */\n  html.hf .gameboxlite .top {\n    margin: 4px !important;\n    background: rgba(6, 8, 12, 0.72) !important;\n    border-radius: 999px !important;\n    padding: 2px 6px 0 !important;\n    z-index: 2;\n  }\n\n  /* Las tarjetas que la web pinta como ficha con texto al lado (favoritos, aleatorios). OJO: las\n     de rejilla llevan DOS clases (`gamebox gameboxlite`), así que hay que dejar fuera a las de\n     rejilla — si no, estas reglas (que vienen después) le pisaban la miniatura de 112 px y el\n     margen a las tarjetas de la portada y de /all/. */\n  html.hf .gamebox:not(.gameboxlite) {\n    background: var(--hf-bg3) !important;\n    border: 1px solid var(--hf-line) !important;\n    border-radius: var(--hf-radius) !important;\n    padding: 8px 10px 8px 0 !important;\n    margin: 6px 0 !important;\n    box-sizing: border-box;\n  }\n\n  html.hf .gamebox:not(.gameboxlite):hover {\n    border-color: var(--hf-accent) !important;\n    box-shadow: var(--hf-shadow) !important;\n  }\n\n  html.hf .gamebox:not(.gameboxlite) .thumb {\n    width: 112px !important;\n    height: 112px !important;\n    margin: 0 12px 0 8px !important;\n    border: 1px solid var(--hf-line) !important;\n    border-radius: var(--hf-radius-s) !important;\n    object-fit: cover;\n  }\n\n  html.hf .gamebox:not(.gameboxlite) .title {\n    color: var(--hf-text) !important;\n    font-size: 15px;\n  }\n\n  html.hf .gamebox:not(.gameboxlite):hover .title {\n    color: var(--hf-accent) !important;\n  }\n\n  html.hf .gamebox:not(.gameboxlite) .desc {\n    background: transparent !important;\n    color: var(--hf-dim) !important;\n    font-size: 12px;\n  }\n\n  html.hf .gamebox:not(.gameboxlite) .no {\n    color: var(--hf-dim) !important;\n  }\n\n  html.hf .gamebox:not(.gameboxlite):hover .no {\n    color: var(--hf-accent) !important;\n  }\n\n  /* ---------------------------------------------------------------------------------------\n     LA REJILLA DE VERDAD\n     ---------------------------------------------------------------------------------------\n     `grid.js` marca con `hf-grid` los contenedores que son una lista de tarjetas (portada,\n     /all/, etiquetas, búsqueda, favoritos). Dentro, todo ocupa la fila entera (títulos, la\n     paginación, `clear`) menos las tarjetas y el hueco de anuncio que la web mete en medio, que\n     son una celda cada uno. Las columnas salen solas del ancho disponible, así que nunca queda\n     un hueco a la derecha ni una fila descuadrada. */\n  html.hf .hf-grid {\n    display: grid;\n    grid-template-columns: repeat(auto-fill, minmax(var(--hf-card), 1fr));\n    gap: 10px;\n    align-items: start;\n    justify-items: stretch;\n  }\n\n  html.hf .hf-grid > * {\n    grid-column: 1 / -1;\n    min-width: 0;\n  }\n\n  html.hf .hf-grid > a.gameboxlite {\n    grid-column: auto;\n    width: auto !important;\n    height: auto !important;\n    margin: 0 !important;\n    float: none !important;\n  }\n\n  /* el hueco del anuncio nativo de la lista (`#randomzone1`) es una celda más: se centra en su\n     columna y en su fila (la web lo deja de 152 px de ancho con una creatividad de 150) y se le\n     pone el mismo borde suave que a las tarjetas, para que se lea como una pieza de la rejilla y\n     no como un agujero. El anuncio no se toca: se carga igual y se ve igual. */\n  html.hf .hf-grid > #randomzone1,\n  html.hf .hf-grid > #randomzone2 {\n    grid-column: auto;\n    justify-self: center;\n    align-self: center;\n    background: var(--hf-bg3);\n    border: 1px solid var(--hf-line);\n    border-radius: var(--hf-radius);\n  }\n\n  /* Los listados de etiqueta y de autor usan otra tarjeta (`.gameboxmain2`, 300×130, con `float`):\n     tres por fila y a la derecha sobraba un pasillo. En rejilla, las columnas se reparten el\n     ancho real de la columna izquierda y quedan igualadas. */\n  html.hf .hf-grid-main {\n    display: grid;\n    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n    gap: 12px;\n    align-items: start;\n  }\n\n  html.hf .hf-grid-main > * {\n    grid-column: 1 / -1;\n    min-width: 0;\n  }\n\n  html.hf .hf-grid-main > a.gameboxmain2 {\n    grid-column: auto;\n    width: auto !important;\n    float: none !important;\n    margin: 0 !important;\n  }}\n\nhtml.hf .gameboxlite .nw,\nhtml.hf .gamebox .nw {\n  opacity: 0.45;\n}\n\nhtml.hf .gameboxlite:hover .nw {\n  opacity: 0.9;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   6. LA FICHA DE JUEGO: NUESTRO MARCO\n   --------------------------------------------------------------------------------------------- */\nhtml.hf .hf-stage {\n  position: relative !important;\n  margin: 10px 0 0;\n  /* la web le pone un fondo blanco con una rejilla (`#gamecontainer`), y con el juego dentro se\n     colaba por los bordes: en la piel oscura el marco es negro */\n  background: #05070b !important;\n  border: 1px solid var(--hf-line);\n  border-radius: var(--hf-radius);\n  box-shadow: var(--hf-shadow);\n  overflow: hidden;\n  min-height: 280px;\n  /* El marco es una columna: la barra del reproductor arriba, en su propia franja, y el juego\n     centrado en lo que queda (así la barra no tapa nada del juego). */\n  display: flex;\n  flex-direction: column;\n  align-items: stretch;\n  justify-content: flex-start;\n}\n\n@media (min-width: 1025px) {\n  html.hf .hf-stage {\n    height: var(--hf-stage-h, 520px) !important;\n  }\n}\n\n/* El juego, dentro del marco. La web le pone el tamaño en los atributos `width`/`height` (es lo\n   que lee su controlador) y Ruffle lo pisa con `width:100%;height:100%` en línea, así que aquí\n   manda lo que calcula `fit()` en `--hf-game-w/h` — la caja más grande con la proporción REAL del\n   juego que cabe en el marco. Sin esas variables (por ejemplo si el juego aún no tiene medidas) se\n   deja el 100% de Ruffle. */\nhtml.hf .hf-stage #embedswf {\n  margin: 0 !important;\n  flex: 0 0 auto;\n  align-self: center;\n  max-width: 100%;\n  max-height: 100%;\n  width: var(--hf-game-w, 100%) !important;\n  height: var(--hf-game-h, 100%) !important;\n}\n\n/* La barra de debajo del reproductor (la web la usa para la nota, el «por defecto» y poco más).\n   Ojo al `height`: la web la clava en `24px` con la fila de 970 px de ancho, pero con la maquetación\n   fluida y los botones de la piel hay más de una línea: todo lo que no cupiera en la primera caía\n   **fuera de la caja** de la barra (sin fondo ni borde), que es lo que dejaba al botón de descarga\n   suelto por debajo. Con `auto` la barra mide lo que mide su contenido. */\nhtml.hf .playerctrl {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 4px;\n  height: auto !important;\n  padding: 6px 8px !important;\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line);\n  border-top: none;\n  border-radius: 0 0 var(--hf-radius) var(--hf-radius);\n  font-size: 12px;\n  color: var(--hf-dim) !important;\n}\n\nhtml.hf .playerctrl .button1,\nhtml.hf .playerctrl .button3 {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 5px 7px !important;\n  border-radius: var(--hf-radius-s);\n  cursor: pointer;\n  color: var(--hf-dim) !important;\n  vertical-align: middle;\n}\n\n/* `.button2` no es un botón: es el **grupo** que envuelve a los suyos (el menú de RESIZE con sus\n   zoom, el de PLUGIN…). Con el relleno de botón se hinchaba (41 px de alto frente a los 26 de los\n   demás) y la barra entera crecía con él; sin él, el relleno lo llevan sus hijos, que ya lo tienen. */\nhtml.hf .playerctrl .button2 {\n  display: inline-flex;\n  align-items: center;\n  gap: 0;\n  padding: 0 !important;\n  cursor: pointer;\n  color: var(--hf-dim) !important;\n  vertical-align: middle;\n}\n\n/* La descarga (`#icon_download`: el icono con su «Download» que crea el propio reproductor de la\n   web) es el **último control** de la barra: se queda al final de la fila y, si en una ventana\n   estrecha no cabe junto a los demás, cae al final de la línea de abajo en vez de quedarse sola a\n   la izquierda, que es lo que pasaba cuando no cabía en la única línea que había. */\nhtml.hf .playerctrl .download {\n  margin-left: auto !important;\n  height: 16px;\n  display: inline-flex;\n  align-items: center;\n  cursor: pointer;\n}\n\nhtml.hf .playerctrl .button1:hover,\nhtml.hf .playerctrl .button2:hover,\nhtml.hf .playerctrl .button3:hover {\n  background: var(--hf-accent-soft) !important;\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .playerctrl .process {\n  position: relative !important;\n  background: var(--hf-bg) !important;\n  border-color: var(--hf-line) !important;\n}\n\n/* La zona de clic de la barra de progreso (`.process_overlay`). La web la pone `absolute` y sin\n   coordenadas, así que cae en su «sitio natural» del flujo; con la barra de controles en `flex`\n   (arriba) ese sitio es el **principio de la fila**, o sea encima de los créditos del reproductor\n   (`run by Ruffle` y el enlace rojo `[2024 Flash Solutions]`), y al pintarla con el fondo de la piel\n   se veía como una caja oscura de 200x20 sobre ellos. Aquí vuelve a ser lo que era: **invisible** y\n   del tamaño justo de la barra de progreso, que es donde tiene que recoger el clic para buscar en el\n   vídeo (el resto lo coloca `seek()`, en `skin.js`, metiéndola dentro de `.process`). */\nhtml.hf .playerctrl .process_overlay {\n  position: absolute !important;\n  left: 0 !important;\n  top: 0 !important;\n  width: 100% !important;\n  height: 100% !important;\n  margin: 0 !important;\n  background: transparent !important;\n  border: 0 !important;\n  z-index: 100 !important;\n}\n\nhtml.hf .playerctrl .submenu {\n  background: var(--hf-bg2) !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  box-shadow: var(--hf-shadow);\n  padding: 4px !important;\n}\n\nhtml.hf .playerctrl .submenu span {\n  color: var(--hf-dim) !important;\n}\n\nhtml.hf .playerctrl .submenu span:hover {\n  background: var(--hf-accent-soft) !important;\n  color: var(--hf-accent) !important;\n}\n\n/* la barra nuestra: la franja de arriba del marco, dentro del flujo (no tapa el juego) */\nhtml.hf .hf-bar {\n  position: static;\n  order: -1;\n  flex: 0 0 auto;\n  z-index: 5;\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 6px;\n  padding: 6px 8px;\n  background: var(--hf-bg3);\n  border-bottom: 1px solid var(--hf-line);\n  pointer-events: none;\n}\n\nhtml.hf .hf-bar > * {\n  pointer-events: auto;\n}\n\nhtml.hf .hf-btn {\n  padding: 6px 11px;\n  border: 1px solid var(--hf-line2);\n  border-radius: 999px;\n  background: var(--hf-bg2);\n  color: var(--hf-text);\n  font: 600 12px system-ui, -apple-system, \"Segoe UI\", Roboto, Arial, sans-serif;\n  cursor: pointer;\n  backdrop-filter: blur(4px);\n}\n\nhtml.hf .hf-btn:hover {\n  border-color: var(--hf-accent);\n  color: var(--hf-accent);\n}\n\nhtml.hf .hf-btn-play {\n  background: var(--hf-accent);\n  border-color: var(--hf-accent);\n  color: #fff !important;\n}\n\nhtml.hf .hf-btn-play:hover {\n  filter: brightness(1.1);\n  color: #fff !important;\n}\n\nhtml.hf .hf-note {\n  margin-left: auto;\n  padding: 5px 11px;\n  border-radius: 999px;\n  background: var(--hf-bg2);\n  color: var(--hf-dim);\n  font-size: 12px;\n  backdrop-filter: blur(4px);\n}\n\nhtml.hf .hf-note--ok {\n  color: var(--hf-ok);\n}\n\nhtml.hf .hf-note--bad {\n  color: var(--hf-bad);\n}\n\n/* En pantalla completa el marco manda: el juego se ajusta a la ventana y la barra se queda arriba. */\nhtml.hf .hf-stage:fullscreen {\n  height: 100vh !important;\n  border: none;\n  border-radius: 0;\n  margin: 0;\n}\n\nhtml.hf .hf-stage:fullscreen #gamecontainer {\n  height: 100% !important;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   7. EL CONTROLADOR DE LA WEB Y LAS CAJAS DE ARRANQUE\n   --------------------------------------------------------------------------------------------- */\n/* Las dos cajas de «CLICK TO PLAY» (la del HFlashPlayer, que es un .exe para Windows, y la de\n   Ruffle) ocupan el sitio del juego. Si el juego arranca solo, sobran; si no arranca, se quedan\n   (bloque 12 las vuelve a enseñar). */\nhtml.hf.hf-autoplay .quickrun {\n  display: none !important;\n}\n\nhtml.hf.hf-autoplay.hf-show-fallbacks .quickrun {\n  display: block !important;\n}\n\nhtml.hf .quickrun {\n  position: absolute !important;\n  z-index: 4;\n  background: rgba(10, 13, 19, 0.9) !important;\n  border: 1px solid var(--hf-line2) !important;\n  border-radius: var(--hf-radius) !important;\n  color: var(--hf-text) !important;\n  padding: 12px 14px !important;\n  box-shadow: var(--hf-shadow);\n  top: 72px !important;\n  left: 50% !important;\n  transform: translateX(-50%);\n  width: 260px !important;\n  height: auto !important;\n}\n\nhtml.hf .quickrun .name {\n  font-weight: 700;\n}\n\n/* Cuando las cajas vuelven (el juego no arranca solo) salen las dos, y tal cual se pisarían: la\n   del HFlashPlayer a la izquierda y la de Ruffle a la derecha, las dos dentro del marco. */\nhtml.hf.hf-show-fallbacks .quickrun {\n  top: 88px !important;\n}\n\nhtml.hf #quickrun_hfplayer {\n  left: 27% !important;\n}\n\nhtml.hf #quickrun_ruffle {\n  left: 73% !important;\n}\n\nhtml.hf .quickrun .hint {\n  color: var(--hf-dim);\n  font-size: 11px;\n}\n\n/* la cruz de cerrar de la web va colocada con un `margin` de 300 px (para su caja de 600): aquí se\n   ancla en la esquina de la caja */\nhtml.hf .quickrun .close {\n  position: absolute;\n  top: 8px;\n  right: 10px;\n  margin: 0 !important;\n  width: 14px;\n  height: 14px;\n  z-index: 2;\n}\n\nhtml.hf .quickrun .button {\n  display: inline-block;\n  margin-top: 8px;\n  padding: 7px 14px;\n  border-radius: 999px;\n  background: var(--hf-accent);\n  color: #fff !important;\n  font-size: 11px;\n  font-weight: 800;\n  letter-spacing: 0.08em;\n}\n\nhtml.hf .quickrun .more a {\n  color: var(--hf-dim) !important;\n  font-size: 11px;\n}\n\nhtml.hf .quickrun .more a:hover {\n  color: var(--hf-accent) !important;\n}\n\n/* el «cargando…» de la web (miniatura + porcentaje) */\nhtml.hf .loadprocess {\n  background: rgba(10, 13, 19, 0.86) !important;\n  border: none !important;\n  color: var(--hf-text) !important;\n}\n\nhtml.hf.hf-autoplay .loadprocess .status {\n  color: var(--hf-dim);\n}\n\n/* …y en cuanto el juego está listo, fuera. Esa caja (la miniatura del juego, el icono y el\n   porcentaje) sirve mientras el `.swf` baja, pero luego no aporta nada y encima le come sitio al\n   juego. `player.js` pone `hf-playing` en <html> al llegar a «Listo» —no al pulsar ▶ Jugar: durante\n   la descarga es lo único que hay que mirar— y lo quita si hay que arrancar de nuevo (▶ Jugar,\n   recargar, cambiar de emulador), que es cuando la caja tiene que volver. La caja mide 0×0 (su\n   contenido es `absolute`), así que no se mueve nada al quitarla. Va sin el prefijo `html.hf` a\n   propósito: es cosa del reproductor, no de la piel, y así funciona también con «Como la web».\n   Y sin transición, a propósito: la desaparición (y la vuelta) tienen que ser de fiar y no depender\n   de que la pestaña esté delante, que un fundido con la pestaña de fondo se queda a medias. */\nhtml.hf-playing .loadprocess {\n  transition: none !important;\n  opacity: 0 !important;\n  visibility: hidden !important;\n  pointer-events: none !important;\n}\n/* ---------------------------------------------------------------------------------------------\n   8. LA INFORMACIÓN DEL JUEGO, ETIQUETAS Y RELACIONADAS\n   --------------------------------------------------------------------------------------------- */\nhtml.hf .gameinfo {\n  margin-top: 14px;\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line);\n  border-radius: var(--hf-radius);\n  padding: 14px 16px !important;\n  color: var(--hf-text) !important;\n}\n\nhtml.hf .gameinfo .infotable {\n  width: 100%;\n  border-collapse: collapse;\n}\n\nhtml.hf .gameinfo .infotable th {\n  width: 150px;\n  padding: 7px 10px 7px 0;\n  color: var(--hf-dim) !important;\n  font-weight: 600;\n  font-size: 12px;\n  text-align: start;\n  vertical-align: top;\n  border-top: 1px solid var(--hf-line);\n}\n\nhtml.hf .gameinfo .infotable td {\n  padding: 7px 0;\n  color: var(--hf-text) !important;\n  font-size: 13px;\n  vertical-align: top;\n  border-top: 1px solid var(--hf-line);\n  /* con el ratón encima la web pone la celda en blanco (`td:hover`), que sobre el fondo oscuro da\n     un fogonazo: aquí se le da el tono de acento, mucho más suave */\n  background: transparent !important;\n}\n\nhtml.hf .gameinfo .infotable td:hover {\n  background: var(--hf-accent-soft) !important;\n}\n\nhtml.hf .gameinfo .infotable tr:first-child th,\nhtml.hf .gameinfo .infotable tr:first-child td {\n  border-top: none;\n}\n\nhtml.hf .gameinfo a {\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .gameinfo .link {\n  color: var(--hf-dim) !important;\n  font-size: 12px;\n  word-break: break-all;\n}\n\nhtml.hf .gameinfo .link:hover {\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .gameinfo .origdesc,\nhtml.hf .gameinfo .transfield {\n  color: var(--hf-dim) !important;\n  font-size: 13px;\n  line-height: 1.65;\n}\n\nhtml.hf .gameinfo .origdesc_btn,\nhtml.hf .gameinfo .items .btn {\n  display: inline-block;\n  margin-top: 6px;\n  padding: 5px 12px;\n  border: 1px solid var(--hf-line2);\n  border-radius: 999px;\n  color: var(--hf-dim) !important;\n  font-size: 11px;\n  font-weight: 700;\n  letter-spacing: 0.05em;\n  cursor: pointer;\n}\n\nhtml.hf .gameinfo .origdesc_btn:hover,\nhtml.hf .gameinfo .items .btn:hover {\n  border-color: var(--hf-accent);\n  color: var(--hf-accent) !important;\n}\n\n/* las etiquetas (fichas del juego y de las tarjetas) */\nhtml.hf .tag {\n  display: inline-block;\n  margin: 2px 4px 2px 0 !important;\n  padding: 3px 10px !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: 999px !important;\n  background: var(--hf-bg2) !important;\n  color: var(--hf-dim) !important;\n  font-size: 11px !important;\n  line-height: 1.6;\n}\n\nhtml.hf .tag:hover {\n  border-color: var(--hf-accent) !important;\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .tag .nw {\n  opacity: 0.5;\n}\n\nhtml.hf .icon.soundwarning {\n  color: var(--hf-bad) !important;\n  cursor: pointer;\n  font-size: 11px;\n  font-weight: 700;\n}\n\nhtml.hf .fav,\nhtml.hf .favorite {\n  color: var(--hf-accent) !important;\n}\n\n/* la columna de la derecha: relacionadas + el hueco de publicidad */\nhtml.hf #pageright_title .dhead {\n  margin-bottom: 6px;\n}\n\nhtml.hf .gameboxright {\n  display: block !important;\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius) !important;\n  padding: 8px !important;\n  margin: 8px 0 !important;\n  min-height: 0 !important;\n  box-sizing: border-box;\n}\n\nhtml.hf .gameboxright:hover {\n  border-color: var(--hf-accent) !important;\n}\n\nhtml.hf .gameboxright .thumb {\n  width: 72px !important;\n  height: 72px !important;\n  float: left !important;\n  margin: 0 10px 0 0 !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  object-fit: cover;\n}\n\n/* las miniaturas son imágenes claras (y mientras cargan, o si no cargan, se veían como cuadros\n   blancos sueltos por toda la página): fondo del tono de la piel */\nhtml.hf img.thumb,\nhtml.hf .thumb,\nhtml.hf .gamebox .thumb,\nhtml.hf .gameboxright .thumb,\nhtml.hf .gameboxlite .thumb {\n  background: var(--hf-bg2) !important;\n}\n\nhtml.hf .gameboxright .title {\n  margin: 0 0 4px !important;\n  color: var(--hf-text) !important;\n  font-size: 13px;\n  font-weight: 600;\n  line-height: 1.3;\n}\n\nhtml.hf .gameboxright:hover .title {\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .gameboxright .tags {\n  display: block !important;\n  max-width: none !important;\n  clear: both;\n  padding-top: 4px;\n}\n\nhtml.hf .gameboxright .tags .tag {\n  font-size: 10px !important;\n  padding: 2px 7px !important;\n}\n\nhtml.hf .gameboxright .authoricon {\n  width: 20px !important;\n  height: 20px !important;\n  border-radius: 999px;\n  vertical-align: middle;\n}\n\nhtml.hf #rightzone iframe {\n  border-radius: var(--hf-radius);\n  overflow: hidden;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   7b. EL CUADRADO DE LA COLUMNA, AL LADO DEL BANNER (ficha de juego)\n   ---------------------------------------------------------------------------------------------\n   `skin.js` (`layoutAds()`) saca el hueco de anuncio de la columna derecha de la ficha de juego\n   (`#rightzone`: un 300x250 que la web mete entre el título «Related» y la lista de juegos) y lo\n   sube al lado del banner de la cabecera, que se estrecha para dejarle sitio: la columna se queda\n   solo con los juegos. Aquí está lo que no depende de las medidas —fuera del flujo y su sombra—;\n   `left`, `top` y el alto que hay que bajar la columna los pone el JS en línea, que es lo único\n   que se sabe al medir. El anuncio no se toca: se carga igual, en el mismo hueco, en otro sitio.\n   (Va sin el prefijo `html.hf` a propósito: es cosa de la maquetación, no de la piel, y así\n   funciona también con «Como la web».) */\n@media (min-width: 1025px) {\n  html.hf-ads-side #rightzone {\n    position: absolute !important;\n    margin: 0 !important;\n    width: 300px;\n    /* el anuncio se escala, así que su caja de maquetación (300x250) es más grande que el hueco:\n       sin esto, esa parte que no se ve alargaría el ancho desplazable de la página */\n    overflow: hidden;\n    z-index: 4;\n  }\n  html.hf-ads-side #rightzone iframe {\n    box-shadow: var(--hf-shadow);\n  }\n}\n\n/* ---------------------------------------------------------------------------------------------\n   8b. LA COLUMNA DERECHA DE LOS LISTADOS (etiquetas, autores, TOP/HOT)\n   ---------------------------------------------------------------------------------------------\n   Son las cajas y las fichas de `.rightbox`/`pageright`. Vienen de fábrica en rosa claro\n   (`#FFE5FF`), con la insignia del puesto en blanco (`#FFF` con el número amarillo) y —lo peor—\n   con el ratón encima la ficha se pone AMARILLA entera (`#FFCC00`) y su descripción reaparece en\n   un amarillo pálido. Nada de eso se ve en una foto de la página: son estados `:hover`, así que\n   hay que repintarlos a mano. */\nhtml.hf .rightbox {\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius) !important;\n  overflow: hidden;\n}\n\nhtml.hf .rightbox .boxtitle {\n  background: var(--hf-bg2) !important;\n  border-bottom: 1px solid var(--hf-line);\n  color: var(--hf-text) !important;\n  padding: 0 10px !important;\n  letter-spacing: 0.04em;\n}\n\nhtml.hf .gamebox.gameboxright2,\nhtml.hf .gamebox.gameboxtop2 {\n  background: var(--hf-bg2) !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  overflow: hidden;\n}\n\nhtml.hf .gamebox.gameboxright2:hover,\nhtml.hf .gamebox.gameboxtop2:hover {\n  background: var(--hf-accent-soft) !important;\n  border-color: var(--hf-accent) !important;\n}\n\nhtml.hf .gamebox.gameboxright2 .no,\nhtml.hf .gamebox.gameboxtop2 .no {\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  background: var(--hf-bg3) !important;\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .gamebox.gameboxright2:hover .no,\nhtml.hf .gamebox.gameboxtop2:hover .no {\n  border-color: var(--hf-accent) !important;\n  background: var(--hf-accent) !important;\n  color: #fff !important;\n}\n\nhtml.hf .gamebox.gameboxright2 .desc,\nhtml.hf .gamebox.gameboxtop2 .desc {\n  background: transparent !important;\n  color: var(--hf-dim) !important;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   9. LISTAS, PAGINACIÓN Y FORMULARIOS\n   --------------------------------------------------------------------------------------------- */\n/* Los resultados del buscador (`/search/`) usan una maqueta que no se parece a ninguna otra: una\n   lista de filas con la miniatura a la izquierda y, a la derecha, título, autor, etiquetas,\n   descripción y la ruta. La web las deja casi sin pintar (una línea de puntos gris claro y la ruta\n   en azul) y con `float`; aquí cada resultado es una ficha con su borde, y el color de la ruta\n   pasa a ser discreto, que el azul chillón sobre el fondo oscuro no hay quien lo lea. */\nhtml.hf .searchresult .row {\n  margin: 0 0 10px !important;\n  padding: 12px 14px !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius) !important;\n  background: var(--hf-bg3) !important;\n}\n\nhtml.hf .searchresult .row:hover {\n  border-color: var(--hf-accent) !important;\n}\n\nhtml.hf .searchresult .row::after {\n  content: \"\";\n  display: block;\n  clear: both;\n}\n\nhtml.hf .searchresult .thumb {\n  float: left !important;\n  width: 120px !important;\n  height: 120px !important;\n  margin: 0 14px 6px 0 !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  object-fit: cover;\n}\n\nhtml.hf .searchresult .title {\n  display: block;\n  margin: 0 0 3px !important;\n  color: var(--hf-text) !important;\n  font-size: 16px;\n  font-weight: 700;\n}\n\nhtml.hf .searchresult .row:hover .title {\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .searchresult .author {\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .searchresult .tags,\nhtml.hf .searchresult .desc {\n  display: block;\n  margin: 5px 0 0;\n  color: var(--hf-dim) !important;\n  font-size: 12.5px;\n}\n\nhtml.hf .searchresult .url {\n  display: block;\n  margin: 6px 0 0 !important;\n  color: var(--hf-dim2) !important;\n  font-size: 11px;\n  text-decoration: none !important;\n}\n/* Los sombreados «2px 2px #ccc» de la web son de su estética de 2005: sobre el fondo oscuro\n   parecían una segunda copia fantasma de cada título y de cada tarjeta. Aquí sobra todo eso: el\n   relieve lo dan los bordes y el color de acento. */\nhtml.hf .dhead,\nhtml.hf .chead,\nhtml.hf .nav,\nhtml.hf .pagelink a,\nhtml.hf .pagelink a:hover,\nhtml.hf .tagslist a:hover,\nhtml.hf .authorlist a:hover,\nhtml.hf .gamebox:hover,\nhtml.hf .gameboxlite:hover,\nhtml.hf .gameboxmain:hover,\nhtml.hf .gameboxmain2:hover,\nhtml.hf .gameboxright:hover,\nhtml.hf .gameboxright2:hover {\n  box-shadow: none !important;\n}\n\nhtml.hf .pagelink {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 5px;\n  margin: 18px 0 6px;\n  font-size: 12px;\n}\n\nhtml.hf .pagelink .stat {\n  margin-right: 10px;\n  color: var(--hf-dim) !important;\n}\n\nhtml.hf .pagelink a,\nhtml.hf .pagelink .currentpage {\n  display: inline-block;\n  min-width: 30px;\n  padding: 5px 9px !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  background: var(--hf-bg3) !important;\n  color: var(--hf-dim) !important;\n  text-align: center;\n  text-decoration: none !important;\n}\n\nhtml.hf .pagelink a:hover {\n  border-color: var(--hf-accent) !important;\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .pagelink .currentpage {\n  background: var(--hf-accent) !important;\n  border-color: var(--hf-accent) !important;\n  color: #fff !important;\n  font-weight: 700;\n}\n\nhtml.hf .pagelink .more {\n  color: var(--hf-dim2) !important;\n}\n\nhtml.hf .gameboxlink {\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  color: var(--hf-text) !important;\n  padding: 4px 10px !important;\n}\n\nhtml.hf .gameboxlink:hover {\n  border-color: var(--hf-accent) !important;\n  background: var(--hf-accent-soft) !important;\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .gameboxlink.current {\n  background: var(--hf-accent-soft) !important;\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .info,\nhtml.hf .info2,\nhtml.hf .info3 {\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  color: var(--hf-dim) !important;\n  padding: 8px 12px !important;\n  margin: 10px 0 !important;\n}\n\nhtml.hf .info a,\nhtml.hf .info2 a,\nhtml.hf .info3 a {\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .hf-list .thumblist,\nhtml.hf .thumblist {\n  min-height: 0 !important;\n}\n\n/* comentarios (los sirve comment.js de la web) */\nhtml.hf .comment {\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius) !important;\n  padding: 10px !important;\n  margin: 8px 0 !important;\n}\n\n/* El cajón de los comentarios y la barra de «jugado/valorado»: en la web son cajas de rosa claro\n   (`#FFE5F8`, `#FFE5FF`) y en la piel oscura cantaban como un parche (además de quedar grandes y\n   vacías mientras no cargan los comentarios). */\nhtml.hf .commentfield,\nhtml.hf .rankinfo {\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius) !important;\n  color: var(--hf-dim) !important;\n  padding: 12px 14px !important;\n}\n\nhtml.hf .rankinfo {\n  padding: 6px 12px !important;\n  margin: 8px 0 !important;\n  font-size: 12px;\n}\n\nhtml.hf .commentfield .commentlist,\nhtml.hf .commentform {\n  color: var(--hf-dim) !important;\n}\n\nhtml.hf .commentform .name,\nhtml.hf .commentform .text {\n  color: var(--hf-dim) !important;\n}\n\nhtml.hf .comment .text,\nhtml.hf .comment .name,\nhtml.hf .comment .date {\n  color: var(--hf-text) !important;\n}\n\nhtml.hf .comment .name {\n  font-weight: 700;\n}\n\nhtml.hf .comment .date {\n  color: var(--hf-dim2) !important;\n  font-size: 11px;\n}\n\n/* los estados `:hover` de la web (el comentario y su lista de respuestas se ponen en blanco, y el\n   selector de emojis con su borde gris claro) */\nhtml.hf .comment:hover,\nhtml.hf .comment .replylist,\nhtml.hf .comment .replylist:hover {\n  background: var(--hf-bg3) !important;\n}\n\nhtml.hf .commentform .emoji .list,\nhtml.hf .commentform .emoji .active {\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  background: var(--hf-bg2) !important;\n}\n\nhtml.hf .commentform .emoji .list:hover {\n  border-color: var(--hf-accent) !important;\n}\n\nhtml.hf textarea,\nhtml.hf input[type=\"text\"],\nhtml.hf input[type=\"password\"],\nhtml.hf input[type=\"email\"],\nhtml.hf select {\n  background: var(--hf-bg2) !important;\n  border: 1px solid var(--hf-line2) !important;\n  border-radius: var(--hf-radius-s) !important;\n  color: var(--hf-text) !important;\n  padding: 6px 10px !important;\n}\n\nhtml.hf select {\n  padding: 4px 8px !important;\n}\n\n/* los botones de envío que no son el del buscador de la cabecera (el del formulario de comentarios,\n   el del buscador de la página de resultados) vienen del navegador en gris claro (`#f0f0f0`) con\n   texto negro: en la piel oscura, un botón de color. El del buscador tiene su propia regla (más\n   específica) y no lo toca esta. */\nhtml.hf input.submit,\nhtml.hf input[type=\"submit\"],\nhtml.hf input[type=\"button\"] {\n  height: 32px !important;\n  padding: 0 16px !important;\n  border: 1px solid var(--hf-accent) !important;\n  border-radius: var(--hf-radius-s) !important;\n  background: var(--hf-accent) !important;\n  background-image: none !important;\n  color: #fff !important;\n  font-weight: 700 !important;\n  font-size: 12px !important;\n  letter-spacing: 0.06em;\n  cursor: pointer;\n}\n\nhtml.hf input.submit:hover,\nhtml.hf input[type=\"submit\"]:hover,\nhtml.hf input[type=\"button\"]:hover {\n  filter: brightness(1.08);\n}\n\n/* El «advanced filter» (`/list/`) es un formulario suelto: un campo con borde de puntos gris claro\n   y las etiquetas elegibles que van pintando su propio script (`.selected` en rosa claro con\n   texto negro). Aquí va con el tono de la piel y las elegidas con el color de acento. */\nhtml.hf .queryfield {\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius) !important;\n  background: var(--hf-bg3) !important;\n  color: var(--hf-dim) !important;\n}\n\nhtml.hf .tags .selected {\n  background: var(--hf-accent) !important;\n  color: #fff !important;\n}\n\nhtml.hf .tags .tag .opt:hover {\n  background: var(--hf-accent) !important;\n  color: #fff !important;\n}\n\n/* La página de AJUSTES de la web (`/tool/prefs/`) es un formulario tal cual sale del navegador: los\n   `fieldset` con su borde gris de siempre, los `legend` a caballo del borde, las pistas con el mismo\n   tamaño y el mismo brillo que el texto de verdad, y las casillas con la pintura del sistema\n   (blancas, en una piel oscura). Aquí queda como lo que es —una lista de ajustes—: cada bloque en su\n   caja, el título del ajuste con su raya, las pistas pequeñas y apagadas (que es lo que son) y las\n   casillas en el color de acento. La página entera es interfaz, así que va además traducida (ver\n   `lang.js`).\n   El `form` del selector es solo esta página («preform»): la web no usa `hint` dentro de un\n   formulario en ningún otro sitio, así no se toca el `.quickrun .hint` del reproductor, y el\n   `.utitle` de la página de búsqueda (que es la fila del título con su enlace, y lleva la raya rosa\n   de la web) se queda como estaba. */\nhtml.hf .pagebody form .utitle {\n  color: var(--hf-text) !important;\n  font-weight: 700 !important;\n  border-bottom: 1px solid var(--hf-line) !important;\n}\n\nhtml.hf .pagebody form .hint {\n  color: var(--hf-dim) !important;\n  font-size: 12px !important;\n  line-height: 1.5;\n  margin: 2px 0 4px;\n}\n\nhtml.hf .pagebody fieldset {\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius) !important;\n  background: var(--hf-bg2) !important;\n  margin: 10px 0 0 !important;\n  padding: 8px 12px 12px !important;\n}\n\nhtml.hf .pagebody legend {\n  color: var(--hf-dim2) !important;\n  font-size: 12px;\n  font-weight: 700;\n  letter-spacing: 0.06em;\n  padding: 0 6px;\n}\n\n/* Las casillas (solo las de la web: las del panel son `hf-sw` y tienen la suya, con el mismo\n   interruptor de siempre). */\nhtml.hf .pagebody input[type=\"checkbox\"] {\n  accent-color: var(--hf-accent);\n  width: 15px;\n  height: 15px;\n  margin: 0 7px 0 0;\n  vertical-align: -2px;\n}\n\n/* El botón de buscar etiquetas de los ajustes nace `disabled` (su script lo suelta al escribir): en\n   gris y sin el rosa de los botones, para que se note que todavía no hace nada. */\nhtml.hf input[type=\"button\"]:disabled,\nhtml.hf input[type=\"submit\"]:disabled {\n  opacity: 0.45;\n  cursor: default;\n}\n\n/* El enlace a la ayuda del reproductor que se pone al lado de su selector (`prefs.js`): pequeño, en\n   el color de acento apagado y sin gritar — está para el que duda, no para el que ya lo sabe. */\nhtml.hf .pagebody form .hf-prefs-help {\n  display: inline-block;\n  margin-left: 12px;\n  font-size: 12px;\n  color: var(--hf-accent-2) !important;\n  text-decoration: none !important;\n  border-bottom: 1px dotted currentColor;\n}\n\nhtml.hf .pagebody form .hf-prefs-help:hover {\n  color: var(--hf-accent) !important;\n}\n\n/* Y las etiquetas de esa página (las bloqueadas y las que salen al buscar, que su script pinta como\n   `<a class=\"tag\">`): las de la web son color crema con texto gris, de su estética de 2005; aquí\n   como fichas de la piel, y la que se puede quitar con su cruz. */\nhtml.hf .pagebody fieldset .tags .tag {\n  color: var(--hf-dim) !important;\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n}\n\nhtml.hf .pagebody fieldset .tags .tag:hover {\n  color: var(--hf-text) !important;\n  border-color: var(--hf-accent) !important;\n}\n\nhtml.hf .pagebody fieldset .tags .tag.blocked,\nhtml.hf .pagebody fieldset .tags .tag.hf-blocked {\n  color: var(--hf-text) !important;\n  background: var(--hf-accent-soft) !important;\n  border-color: var(--hf-accent) !important;\n  cursor: pointer;\n}\n\n/* Una etiqueta de los resultados que ya está bloqueada: se ve que lo está y que al tocarla se quita. */\nhtml.hf .pagebody fieldset .tags .tag.hf-blocked::after {\n  content: \" ✓\";\n  color: var(--hf-accent);\n}\n\n/* La barrita de la caja de las bloqueadas (`prefs.js`): cuántas hay y el botón de quitarlas todas. */\nhtml.hf .pagebody fieldset .hf-tags-bar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  min-height: 22px;\n  margin: 2px 0 6px;\n}\n\nhtml.hf .pagebody fieldset .hf-tags-count {\n  color: var(--hf-dim2);\n  font-size: 12px;\n  letter-spacing: 0.04em;\n}\n\nhtml.hf .pagebody fieldset .hf-tags-clear {\n  padding: 2px 11px;\n  border: 1px solid var(--hf-line2);\n  border-radius: 999px;\n  background: transparent;\n  color: var(--hf-dim);\n  font-size: 11px;\n  font-weight: 700;\n  letter-spacing: 0.04em;\n  cursor: pointer;\n}\n\nhtml.hf .pagebody fieldset .hf-tags-clear:hover {\n  border-color: var(--hf-bad);\n  color: var(--hf-bad);\n}\n\nhtml.hf .pagebody fieldset .hf-tags-empty {\n  margin: 4px 0 0;\n  color: var(--hf-dim2);\n  font-size: 12px;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   10. EL PIE\n   --------------------------------------------------------------------------------------------- */\n/* El pie de la web es una fila de columnas **flotadas** (`float:left` y `.contact` en `float:right`)\n   dentro de una caja que no las envuelve: la caja se quedaba en 29 px de alto (sólo el relleno) y las\n   columnas se salían por debajo, colgando fuera del fondo con las esquinas redondeadas y todas\n   apiladas contra el borde izquierdo (el `float:right` del contacto, en cambio, se iba al extremo\n   opuesto: un hueco en medio de la nada). Aquí vuelve a ser lo que parece: una fila centrada que sí\n   envuelve a sus columnas. De paso, el pegote que el pie invadía por debajo es donde aterrizaba el\n   `<a>` invisible del anuncio (ver `shield.js`), así que al cuadrar la caja ese clic fantasma se va\n   con ella. */\nhtml.hf .pagefoot {\n  border-top: 1px solid var(--hf-line) !important;\n  color: var(--hf-dim2) !important;\n  font-size: 12px;\n  background: var(--hf-bg2) !important;\n  border-radius: var(--hf-radius) var(--hf-radius) 0 0;\n  display: flex !important;\n  flex-wrap: wrap;\n  justify-content: center;\n  align-items: flex-start;\n  gap: 12px clamp(18px, 3vw, 46px);\n  text-align: left;\n  overflow: visible;\n}\n\nhtml.hf .pagefoot > div {\n  float: none !important;\n  width: auto !important;\n  margin: 0 !important;\n  padding: 0 !important;\n}\n\n/* Los enlaces de las webs amigas (lo que la web llama `friendlinks`) son once y en español ocupan\n   más: en la misma fila que las otras cuatro columnas empujarían una de ellas a la fila de abajo\n   (y quedaría sola, que es lo que se veía torcido antes). Van en **su propia fila**, centrados como\n   un bloque de enlaces, y debajo las cuatro columnas cortas. Así el pie queda igual de ordenado a\n   cualquier ancho. */\nhtml.hf .pagefoot .friendlinks {\n  flex: 1 1 100%;\n  max-width: none;\n  text-align: center;\n}\n\nhtml.hf .pagefoot .friendlinks a {\n  display: inline-block;\n  margin: 3px 11px;\n  line-height: 1.6;\n}\n\n/* El copyright venía alineado a la derecha (`float:right` + `.fhead.right`), contra el borde del\n   otro extremo de la fila. Como una columna más, a la izquierda. */\nhtml.hf .pagefoot .fhead.right {\n  text-align: left !important;\n}\n\nhtml.hf .pagefoot .contact {\n  text-align: left;\n}\n\n/* La columna del idioma trae los `<a>` de cada idioma separados por un `<br>` suelto. Al esconder\n   los enlaces (los sustituye nuestro desplegable, ver `lang.js`) el salto se quedaba ahí y empujaba\n   el desplegable una línea hacia abajo: el `Español` caía más bajo que el `auto` de al lado. Fuera. */\nhtml.hf .pagefoot .language > br {\n  display: none !important;\n}\n\n/* El hueco de anuncio que la web pone al final del contenido (encima de los comentarios de la ficha:\n   `div[style=\"width:728px;height:110px\"]` con el `aclib` dentro) es una caja de ancho fijo pegada al\n   borde izquierdo de una columna que ahora mide más de mil píxeles: se quedaba torcida hacia la\n   izquierda. Centrada en su columna — el anuncio se carga y se cuenta igual, sólo cambia dónde\n   cae. */\nhtml.hf div[style*=\"width:728px\"]:not(iframe) {\n  margin-left: auto !important;\n  margin-right: auto !important;\n}\n\n/* Y el banner que las redes cuelgan del cuerpo al final de la página (ver `centerBanners` en\n   `skin.js`): misma idea, centrado en su fila. */\nhtml.hf .hf-banner {\n  display: block !important;\n  margin-left: auto !important;\n  margin-right: auto !important;\n}\n\nhtml.hf .pagefoot a {\n  color: var(--hf-dim) !important;\n}\n\nhtml.hf .pagefoot a:hover {\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .pagefoot .fhead {\n  color: var(--hf-dim2) !important;\n  font-weight: 700;\n  letter-spacing: 0.06em;\n}\n\nhtml.hf .pagefoot .friendlinks a {\n  font-size: 11px;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   11. LO NUESTRO\n   --------------------------------------------------------------------------------------------- */\nhtml.hf .hf-settings-btn {\n  position: fixed;\n  right: 16px;\n  bottom: 16px;\n  z-index: 2147483000;\n  width: 44px;\n  height: 44px;\n  border: 1px solid var(--hf-line2);\n  border-radius: 999px;\n  background: var(--hf-bg2);\n  color: var(--hf-accent);\n  font-size: 20px;\n  line-height: 1;\n  cursor: pointer;\n  box-shadow: var(--hf-shadow);\n}\n\nhtml.hf .hf-settings-btn:hover {\n  border-color: var(--hf-accent);\n}\n\nhtml.hf .hf-settings-btn.hf-on {\n  background: var(--hf-accent);\n  color: #fff;\n}\n\nhtml.hf .hf-panel {\n  position: fixed;\n  right: 16px;\n  bottom: 70px;\n  z-index: 2147483001;\n  width: 372px;\n  max-height: min(78vh, 720px);\n  overflow: auto;\n  background: var(--hf-bg2);\n  border: 1px solid var(--hf-line2);\n  border-radius: 14px;\n  box-shadow: var(--hf-shadow);\n  color: var(--hf-text);\n  font: 13px system-ui, -apple-system, \"Segoe UI\", Roboto, Arial, sans-serif;\n  text-align: start;\n}\n\nhtml.hf .hf-panel[hidden] {\n  display: none !important;\n}\n\nhtml.hf .hf-panel .hf-head {\n  position: sticky;\n  top: 0;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 12px 14px;\n  background: var(--hf-bg2);\n  border-bottom: 1px solid var(--hf-line);\n  font-size: 14px;\n}\n\nhtml.hf .hf-panel .hf-head b {\n  letter-spacing: 0.02em;\n}\n\nhtml.hf .hf-panel .hf-x {\n  border: none;\n  background: transparent;\n  color: var(--hf-dim);\n  font-size: 15px;\n  cursor: pointer;\n}\n\nhtml.hf .hf-panel .hf-x:hover {\n  color: var(--hf-accent);\n}\n\nhtml.hf .hf-panel .hf-body {\n  padding: 6px 14px 14px;\n}\n\nhtml.hf .hf-panel .hf-cap {\n  margin: 14px 0 6px;\n  color: var(--hf-accent);\n  font-size: 11px;\n  font-weight: 800;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;\n}\n\nhtml.hf .hf-panel .hf-row {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n  margin: 6px 0;\n}\n\nhtml.hf .hf-panel .hf-row-lab {\n  color: var(--hf-text);\n  font-size: 12.5px;\n}\n\nhtml.hf .hf-panel .hf-hint {\n  display: block;\n  margin: 4px 0 8px;\n  color: var(--hf-dim2);\n  font-size: 11.5px;\n  line-height: 1.55;\n}\n\nhtml.hf .hf-panel .hf-seg {\n  display: inline-flex;\n  border: 1px solid var(--hf-line2);\n  border-radius: 999px;\n  overflow: hidden;\n}\n\nhtml.hf .hf-panel .hf-segb {\n  padding: 5px 11px;\n  border: none;\n  border-right: 1px solid var(--hf-line2);\n  background: transparent;\n  color: var(--hf-dim);\n  font: 600 12px inherit;\n  cursor: pointer;\n}\n\nhtml.hf .hf-panel .hf-segb:last-child {\n  border-right: none;\n}\n\nhtml.hf .hf-panel .hf-segb.hf-on {\n  background: var(--hf-accent);\n  color: #fff;\n}\n\nhtml.hf .hf-panel .hf-select {\n  padding: 5px 8px;\n  border: 1px solid var(--hf-line2);\n  border-radius: var(--hf-radius-s);\n  background: var(--hf-bg);\n  color: var(--hf-text);\n  font: 12px inherit;\n}\n\nhtml.hf .hf-panel .hf-sw {\n  accent-color: var(--hf-accent);\n  width: 15px;\n  height: 15px;\n}\n\nhtml.hf .hf-panel .hf-btn {\n  background: var(--hf-bg3);\n  color: var(--hf-text);\n}\n\nhtml.hf .hf-panel .hf-foot {\n  padding: 10px 14px 14px;\n  border-top: 1px solid var(--hf-line);\n  color: var(--hf-dim2);\n  font-size: 11px;\n}\n\nhtml.hf .hf-toast {\n  position: fixed;\n  left: 16px;\n  bottom: 16px;\n  z-index: 2147483002;\n  max-width: 380px;\n  padding: 9px 14px;\n  border: 1px solid var(--hf-line2);\n  border-radius: 999px;\n  background: rgba(12, 15, 21, 0.94);\n  color: var(--hf-text);\n  font: 12.5px system-ui, -apple-system, \"Segoe UI\", Roboto, Arial, sans-serif;\n  box-shadow: var(--hf-shadow);\n  opacity: 0;\n  transform: translateY(6px);\n  transition: opacity 0.16s ease, transform 0.16s ease;\n  pointer-events: none;\n}\n\nhtml.hf.hf-skin-claro .hf-toast {\n  background: rgba(255, 255, 255, 0.97);\n}\n\nhtml.hf .hf-toast.hf-on {\n  opacity: 1;\n  transform: translateY(0);\n}\n\nhtml.hf .hf-seen-badge {\n  position: absolute;\n  right: 6px;\n  bottom: 40px;\n  z-index: 3;\n  padding: 1px 6px;\n  border-radius: 999px;\n  background: var(--hf-ok);\n  color: #04140d;\n  font: 800 11px system-ui, -apple-system, \"Segoe UI\", Roboto, Arial, sans-serif;\n  line-height: 1.4;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   12. LOS ICONOS DEL SPRITE EN LA PIEL OSCURA\n   --------------------------------------------------------------------------------------------- */\n/* Los iconos de la web salen todos del mismo sprite, dibujados en negro para un fondo blanco. En la\n   piel oscura se invierten (menos el logotipo y las estrellas del voto, que ya se ven bien). */\nhtml.hf-skin-cueva .played:before,\nhtml.hf-skin-cueva .rank:before,\nhtml.hf-skin-cueva .myrating:before,\nhtml.hf-skin-cueva .soundwarning:before,\nhtml.hf-skin-cueva .archives:before,\nhtml.hf-skin-cueva .offlineplayer:before,\nhtml.hf-skin-cueva .ruffle:before,\nhtml.hf-skin-cueva .lastupdate,\nhtml.hf-skin-cueva .nw,\nhtml.hf-skin-cueva .closeicon,\nhtml.hf-skin-cueva .quickrun .close,\nhtml.hf-skin-cueva .playerctrl .button1:before,\nhtml.hf-skin-cueva .playerctrl .button2:before,\nhtml.hf-skin-cueva .playerctrl .button3:before,\nhtml.hf-skin-cueva .download .init,\nhtml.hf-skin-cueva .download .ready,\nhtml.hf-skin-cueva .download .close,\nhtml.hf-skin-cueva .download .raw,\nhtml.hf-skin-cueva .transfield .google_translate_button,\nhtml.hf-skin-cueva .comment .reply,\nhtml.hf-skin-cueva .comment .thumbup,\nhtml.hf-skin-cueva .comment .thumbdown,\nhtml.hf-skin-cueva .gameinfo .items .btn.expand,\nhtml.hf-skin-cueva .gameinfo .items .btn.collapse {\n  filter: invert(1);\n}\n\n/* ---------------------------------------------------------------------------------------------\n   13. LAS PÁGINAS DE TEXTO (la ayuda del reproductor; el FAQ y los avisos vendrán después)\n   --------------------------------------------------------------------------------------------- */\n/* La web escribe sus artículos a mano con las etiquetas de 2005 —ver `article.js`, que es quien\n   arregla la estructura y pone las clases (`hf-article`, `hf-meta`, `hf-pc`, `hf-notes`, `hf-file`)—:\n   los párrafos van con `text-indent` de 2em y 40 px de margen por cada lado, los apartados son un\n   `<span>` con dos `<br/>` detrás para hacer el hueco, las «ventajas / inconvenientes» son listas\n   que no son listas... Aquí está todo lo que hace que se lean: un ritmo constante entre bloques,\n   cada cosa con su caja y el color de la piel en los sitios donde el suyo no se lee sobre oscuro\n   (que es el caso del recuadro del TL;DR: amarillo claro con el texto casi blanco encima). */\n\n/* Los párrafos: sin el sangrado de 2em ni los 40 px de margen. */\nhtml.hf .hf-article p {\n  margin: 12px 0 !important;\n  padding: 0 !important;\n  line-height: 1.75 !important;\n  text-indent: 0 !important;\n}\n\nhtml.hf .hf-article li {\n  text-indent: 0 !important;\n}\n\n/* Los enlaces del artículo sí se notan: en la piel, un enlace suelto es del color del texto. */\nhtml.hf .hf-article p a,\nhtml.hf .hf-article li a {\n  color: var(--hf-accent) !important;\n  text-decoration: none !important;\n  border-bottom: 1px solid var(--hf-accent-soft);\n}\n\nhtml.hf .hf-article p a:hover,\nhtml.hf .hf-article li a:hover {\n  border-bottom-color: var(--hf-accent);\n}\n\n/* La línea de la última actualización, en pequeño y aparte. */\nhtml.hf .hf-article .hf-meta {\n  margin: 14px 0 0 !important;\n  padding: 2px 10px !important;\n  border-left: 3px solid var(--hf-line2);\n  color: var(--hf-dim2) !important;\n  font-size: 11px !important;\n  letter-spacing: 0.04em;\n  text-transform: uppercase;\n}\n\n/* El recuadro del TL;DR: en la web es amarillo claro (`#FFFFCC`) y su texto queda casi blanco\n   encima, o sea que no se leía. Aquí es una caja de acento con el filo grueso a la izquierda. */\nhtml.hf .hf-article .hint {\n  margin: 16px 0 !important;\n  padding: 11px 14px !important;\n  border: 1px solid var(--hf-accent) !important;\n  border-left-width: 4px !important;\n  border-radius: var(--hf-radius-s) !important;\n  background: var(--hf-accent-soft) !important;\n  color: var(--hf-text) !important;\n  line-height: 1.7 !important;\n  text-indent: 0 !important;\n}\n\nhtml.hf .hf-article .hint a {\n  color: var(--hf-accent) !important;\n  font-weight: 700;\n  border-bottom: 0;\n}\n\n/* Los apartados (`.dhead`, que ya lleva su filo de acento desde el bloque 4): aquí solo se les da\n   el aire de arriba, que la web lo hacía con los dos `<br/>` de detrás. */\nhtml.hf .hf-article .dhead {\n  margin: 26px 0 0 !important;\n  font-size: 17px !important;\n}\n\nhtml.hf .hf-article .dhead + br,\nhtml.hf .hf-article .dhead + br + br {\n  display: none !important;\n}\n\n/* Ventajas / inconvenientes: la web los escribe como `<li>` sueltos y en verde oscuro y rojo puro\n   sobre el fondo oscuro. Ahora son una fila de dos píldoras, cada una con su filo. */\nhtml.hf .hf-article .hf-pcs {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n  margin: 10px 0 4px !important;\n  padding: 0 !important;\n  list-style: none !important;\n}\n\nhtml.hf .hf-article .hf-pcs > .hf-pc {\n  flex: 1 1 260px;\n  margin: 0 !important;\n  padding: 7px 12px !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  background: var(--hf-bg3) !important;\n  color: var(--hf-dim) !important;\n  font-size: 13px !important;\n  line-height: 1.6 !important;\n}\n\nhtml.hf .hf-article .hf-pcs > .hf-pro {\n  border-left: 3px solid var(--hf-ok) !important;\n}\n\nhtml.hf .hf-article .hf-pcs > .hf-con {\n  border-left: 3px solid var(--hf-bad) !important;\n}\n\nhtml.hf .hf-article .hf-pc .pros {\n  color: var(--hf-ok) !important;\n}\n\nhtml.hf .hf-article .hf-pc .cons {\n  color: var(--hf-bad) !important;\n}\n\n/* El índice («Table of content»): una tarjeta con su título en pequeño y cada entrada en acento,\n   la descripción en gris (que en la web es `#999`, apagado sobre el fondo oscuro). */\nhtml.hf .hf-article .tcontent {\n  margin: 16px 0 !important;\n  padding: 12px 16px 14px !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius) !important;\n  background: var(--hf-bg3) !important;\n  list-style: none !important;\n  line-height: 1.65 !important;\n}\n\nhtml.hf .hf-article .tcontent > b {\n  display: block;\n  margin: 0 0 8px;\n  color: var(--hf-dim2) !important;\n  font-size: 11px;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n}\n\nhtml.hf .hf-article .tcontent > li {\n  margin: 6px 0 !important;\n  padding: 0 !important;\n  color: var(--hf-dim) !important;\n}\n\nhtml.hf .hf-article .tcontent > li a {\n  color: var(--hf-accent) !important;\n  font-weight: 700;\n  border-bottom: 0;\n}\n\n/* Los guiones de «navegadores» (los `<p>` que empezaban por «- »): una lista con su punto. */\nhtml.hf .hf-article .hf-notes {\n  margin: 12px 0 !important;\n  padding: 0 !important;\n  list-style: none !important;\n}\n\nhtml.hf .hf-article .hf-notes > li {\n  position: relative;\n  margin: 6px 0 !important;\n  padding: 0 0 0 18px !important;\n  color: var(--hf-dim) !important;\n  line-height: 1.7 !important;\n}\n\nhtml.hf .hf-article .hf-notes > li::before {\n  content: \"\";\n  position: absolute;\n  left: 4px;\n  top: 0.62em;\n  width: 5px;\n  height: 5px;\n  border-radius: 50%;\n  background: var(--hf-accent);\n}\n\n/* El aviso del paquete viejo: en la web es una línea roja; la caja `.info2` la pinta el bloque 9,\n   pero un aviso merece su filo de color. */\nhtml.hf .hf-article .info2 {\n  border-left: 4px solid var(--hf-bad) !important;\n}\n\n/* Los archivos (el reproductor, el paquete, el `.swf`): una descarga se ve como una descarga. */\nhtml.hf .hf-article a.hf-file {\n  display: inline-block;\n  margin: 2px 0;\n  padding: 2px 10px !important;\n  border: 1px solid var(--hf-line2) !important;\n  border-radius: 999px !important;\n  background: var(--hf-bg3) !important;\n  color: var(--hf-text) !important;\n  font-size: 12px !important;\n  font-weight: 700 !important;\n  text-decoration: none !important;\n  word-break: break-all;\n}\n\nhtml.hf .hf-article a.hf-file:hover {\n  border-color: var(--hf-accent) !important;\n  color: var(--hf-accent) !important;\n}\n\n/* La lista de autocomprobación del reproductor: un `<textarea readonly>` de la web (de 250 px, y\n   1200 en móvil) con la letra monoespaciada y el árbol marcado con tabuladores. Se queda el\n   textarea —así se puede copiar entera— pero con el aspecto de un panel y sin el alto disparatado:\n   `white-space: pre` conserva la sangría del árbol y el `resize` deja estirarla a mano. */\nhtml.hf .hf-article #ta_check {\n  width: 100% !important;\n  height: auto !important;\n  min-height: 200px;\n  max-height: 46vh;\n  margin: 10px 0 0 !important;\n  padding: 12px 14px !important;\n  border: 1px solid var(--hf-line) !important;\n  border-left: 3px solid var(--hf-accent) !important;\n  border-radius: var(--hf-radius-s) !important;\n  background: var(--hf-bg2) !important;\n  color: var(--hf-text) !important;\n  font: 400 13px/1.7 ui-monospace, SFMono-Regular, Menlo, Consolas, \"Liberation Mono\", monospace !important;\n  white-space: pre;\n  overflow: auto;\n  resize: vertical;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   14. PANTALLAS ESTRECHAS\n   --------------------------------------------------------------------------------------------- */\n@media (max-width: 1024px) {\n  /* Por aquí manda `mobile.css` del sitio. Lo nuestro se queda en los colores y en las piezas\n     propias (panel, avisos, marco del reproductor), que no existen en su versión. */\n  html.hf .hf-panel {\n    right: 8px;\n    left: 8px;\n    width: auto;\n    bottom: 66px;\n    max-height: 72vh;\n  }\n  html.hf .hf-settings-btn {\n    right: 10px;\n    bottom: 10px;\n  }\n  html.hf .hf-stage {\n    margin: 8px 0;\n  }\n}\n";
  if (!css) return;
  var style = document.createElement("style");
  style.id = "r34g-styles";
  style.textContent = css;
  // Con @run-at document-start puede que <head> (o incluso <html>) todavía no exista: en
  // ese caso se reintenta en cuanto el documento tenga dónde ponerlo, en vez de reventar.
  function add() {
    var host = document.head || document.documentElement;
    if (!host) return false;
    host.appendChild(style);
    return true;
  }
  if (!add()) {
    document.addEventListener("DOMContentLoaded", add);
    var t = setInterval(function () {
      if (add()) clearInterval(t);
    }, 10);
  }
})();
// ---- h-flash-com ----
// ---------------------------------------------------------------------------------------------
// h-flash.com — NÚCLEO del userscript: el espacio de nombres `hf`, los ajustes, las utilidades y
// las tres cosas que valen para cualquier página del sitio (aplazar los anuncios hasta que se
// miran, llevar la cuenta de los juegos ya abiertos y avisar de los cambios del DOM).
//
// Todo lo demás (la piel, el escudo de anuncios invasivos, el reproductor, las rejillas, el panel)
// vive en sus módulos y se cuelga de aquí. Los ajustes del usuario están en
// `localStorage["hf.settings.v1"]`: nada de esto sale del navegador ni entra en el script compilado.
// ---------------------------------------------------------------------------------------------
(function () {
  "use strict";
  if (window.hf) return;

  // =============================================================================================
  // AJUSTES
  // =============================================================================================
  // Cada ajuste se puede tocar desde el panel (botón flotante) y desde la consola:
  //   hf.set("cards", 240)      hf.set({skin:"claro", ads:"normal"})      hf.all()
  // =============================================================================================
  var KEY = "hf.settings.v1";

  var DEFAULTS = {
    // piel de colores: "cueva" (oscura, por defecto), "claro" (moderna en blanco), "off" (como la web)
    skin: "cueva",
    // tamaño máximo de las tarjetas de los listados, en píxeles (0 = como la web: 152 px)
    cards: 190,
    // qué hacer con los huecos de anuncio: "lazy" los carga al acercarse a la pantalla, "normal" los
    // deja como la web (que los carga de golpe)
    ads: "lazy",
    // en la ficha de juego, subir el cuadrado de la columna derecha al lado del banner de la
    // cabecera (que se estrecha para dejarle sitio) y dejar la columna solo con los juegos
    sideAds: true,
    // cortar los anuncios invasivos: ventanas y pestañas que se abren solas, redirecciones al
    // pinchar y pantallas completas de anuncio. Los anuncios que se ven en la página no se tocan
    shield: true,
    // qué hacer al abrir una ficha de juego: "auto" arranca solo, "click" deja los botones de la web,
    // "off" no toca nada
    play: "auto",
    // emulador con el que arrancar los juegos: "web" (el que trae el propio sitio, Ruffle 0.6.0),
    // "nuevo" (el Ruffle más reciente, del CDN oficial)
    emulator: "web",
    // marcar en los listados los juegos ya abiertos (historial en este navegador)
    seen: true,
    // atajos de teclado en las fichas de juego (F pantalla completa, R recargar, +/- zoom)
    keys: true,
    // idioma de la web: "auto" (el suyo: inglés, o japonés en `ja.h-flash.com`) o "es" (español,
    // traducido encima de la página — lo pone `lang.js`)
    lang: "auto"
  };

  var settings = {};
  var watchers = [];

  function loadSettings() {
    var saved = {};
    try {
      saved = JSON.parse(localStorage.getItem(KEY) || "{}") || {};
    } catch (e) {
      saved = {};
    }
    Object.keys(DEFAULTS).forEach(function (k) {
      settings[k] = saved[k] == null ? DEFAULTS[k] : saved[k];
    });
    if (typeof settings.cards !== "number") settings.cards = DEFAULTS.cards;
    if (["cueva", "claro", "off"].indexOf(settings.skin) < 0) settings.skin = DEFAULTS.skin;
    if (["lazy", "normal"].indexOf(settings.ads) < 0) settings.ads = DEFAULTS.ads;
    if (["auto", "click", "off"].indexOf(settings.play) < 0) settings.play = DEFAULTS.play;
    if (["web", "nuevo"].indexOf(settings.emulator) < 0) settings.emulator = DEFAULTS.emulator;
    if (typeof settings.sideAds !== "boolean") settings.sideAds = DEFAULTS.sideAds;
    if (typeof settings.shield !== "boolean") settings.shield = DEFAULTS.shield;
    if (["auto", "es"].indexOf(settings.lang) < 0) settings.lang = DEFAULTS.lang;
  }

  function saveSettings() {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings));
    } catch (e) {}
  }

  function set(patch, key) {
    if (key !== undefined) {
      patch = {};
      patch[arguments[0]] = arguments[1];
    }
    var changed = [];
    Object.keys(patch || {}).forEach(function (k) {
      if (!(k in DEFAULTS)) return;
      if (settings[k] === patch[k]) return;
      settings[k] = patch[k];
      changed.push(k);
    });
    if (!changed.length) return changed;
    saveSettings();
    watchers.forEach(function (fn) {
      try {
        fn(changed.slice(), settings);
      } catch (e) {}
    });
    return changed;
  }

  function onChange(fn) {
    if (typeof fn === "function") watchers.push(fn);
  }

  // =============================================================================================
  // UTILIDADES
  // =============================================================================================
  // La página es de otro mundo: en el sandbox de Tampermonkey `window` NO es el de la web, así que
  // para tocar SUS variables y SUS funciones (flashctrl, embedswf, load_ruffle, flashvars…) hay que
  // pasar por `unsafeWindow`. En el laboratorio (sin sandbox) es transparente.
  function pageWin() {
    try {
      return typeof unsafeWindow !== "undefined" && unsafeWindow ? unsafeWindow : window;
    } catch (e) {
      return window;
    }
  }

  // De dónde es la web de verdad, según el propio HTML (canonical / og:url) y si no, el origen.
  // Importa para el laboratorio (la vista previa vive en otro origen) y para resolver las rutas
  // root-relative del sitio (`/data/swf/…`) contra el dominio real. Se pregunta una vez, cuando el
  // `<head>` ya está (en `document-start` todavía no lo está).
  var baseCache = "";
  function base() {
    if (baseCache) return baseCache;
    var cand = "";
    var link = document.querySelector('link[rel="canonical"]');
    if (link && link.href) cand = link.href;
    if (!cand) {
      var og = document.querySelector('meta[property="og:url"]');
      if (og) cand = og.getAttribute("content") || "";
    }
    if (cand) {
      try {
        baseCache = new URL(cand, location.href).origin;
        return baseCache;
      } catch (e) {}
    }
    // sin pistas: el origen de la página, pero solo se da por bueno cuando el documento ya está
    // parseado (antes, el canonical puede estar todavía por llegar).
    if (document.readyState !== "loading") baseCache = location.origin;
    return location.origin;
  }

  // Una ruta de la web (`/data/swf/x.swf`) puesta en absoluto. Lo que ya es absoluto (o un blob:,
  // como el del laboratorio) se deja igual.
  function abs(url) {
    url = String(url == null ? "" : url).trim();
    if (!url || /^[a-z][a-z0-9+.-]*:/i.test(url) || /^\/\//.test(url)) return url;
    if (url.charAt(0) !== "/") return url;
    return base().replace(/\/+$/, "") + url;
  }

  function q(sel, root) {
    return (root || document).querySelector(sel);
  }
  function qa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === "text") n.textContent = v;
      else if (k === "html") n.innerHTML = v;
      else if (k === "cls") n.className = v;
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v);
    });
    (kids || []).forEach(function (c) {
      if (c) n.appendChild(c);
    });
    return n;
  }

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn, { once: true });
    else fn();
  }

  // Espera a que aparezca algo (el HTML de la web se monta tarde: el laboratorio lo inyecta y el
  // sitio lo rellena por AJAX).
  function until(sel, fn, tries) {
    var n = 0;
    var max = tries || 60;
    (function tick() {
      var node = typeof sel === "function" ? null : q(sel);
      if (node || (typeof sel === "function" && sel())) return fn(node);
      if (++n > max) return null;
      setTimeout(tick, 200);
    })();
  }

  // Aviso discreto abajo a la izquierda (nuestro; no tapa nada de la web).
  var toastBox = null;
  var toastTimer = 0;
  function toast(msg, ms) {
    if (!document.body) return;
    if (!toastBox) {
      toastBox = el("div", { id: "hf-toast", cls: "hf-toast" });
      document.body.appendChild(toastBox);
    }
    toastBox.textContent = msg;
    toastBox.classList.add("hf-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      if (toastBox) toastBox.classList.remove("hf-on");
    }, ms || 2600);
  }

  // =============================================================================================
  // QUÉ PÁGINA ES
  // =============================================================================================
  // El sitio no marca las páginas de ninguna forma cómoda, así que se mira lo que hay: una ficha de
  // juego tiene `#gamecontainer` (y su `swfpath`), un listado tiene tarjetas `.gamebox`, y la
  // portada tiene las tres secciones de siempre.
  function pageKind() {
    if (q("#gamecontainer") || (pageWin().swfpath && q("#flash_pageleft"))) return "game";
    if (q(".gamebox")) return "list";
    if (document.body && /\/fav\/|\/search\/|\/tag\/|\/author\/|\/all\/|\/hot\/|\/top\/|\/random\//.test(location.pathname)) return "list";
    return "other";
  }

  // =============================================================================================
  // LOS ANUNCIOS, APLAZADOS HASTA QUE SE MIRAN
  // =============================================================================================
  // El sitio convierte sus `<iframe2>` en `<iframe>` de verdad nada más cargar (ver `pack0.js`), así
  // que los anuncios de `adglare` y `sadbaguette` se descargan aunque estén a 2000 px de la
  // pantalla. Aquí se les guarda la dirección y se quedan en `about:blank` hasta que su hueco se
  // acerca a la ventana: el anuncio se carga igual (y cuenta la impresión, que es lo que paga la
  // web), pero cuando de verdad se mira. No se quita ni un hueco ni se toca la red que los sirve.
  // La misma lista la usa `shield.js` para reconocer los huecos de publicidad (y solo eso: para
  // saber cuáles son anuncios, nunca para esconderlos).
  var AD_HOSTS = /(adglare|sadbaguette|acscdn|magsrv|exoclick|juicyads|trafficjunky|adnium|realsrv|tsyndicate|clickadu|popads|popcash|adcash|propellerads|onclickads|adsterra|admaven|exdynsrv|hilltopads|clickaine)/i;
  var adQueue = [];

  function isAdFrame(f) {
    var src = f.getAttribute("src") || "";
    return AD_HOSTS.test(src);
  }

  // Solo se aplaza ANTES de que el anuncio se haya cargado una vez. En cuanto se le devuelve su
  // dirección (`unpark`) queda marcado como vivo y ya no se le vuelve a tocar: si no, cada repaso
  // lo devolvía a `about:blank` y el anuncio (que ya había contado la impresión y estaba puesto)
  // se recargaba una y otra vez. Aquí no se quita ni se esconde nada: solo se retrasa lo que aún
  // no ha pedido nada a la red.
  function park(frame) {
    if (frame.dataset.hfAdLive || frame.dataset.hfAd) return;
    frame.dataset.hfAd = frame.getAttribute("src") || "";
    frame.setAttribute("src", "about:blank");
    adQueue.push(frame);
  }

  function unpark(frame) {
    var url = frame.dataset.hfAd;
    if (!url) return;
    delete frame.dataset.hfAd;
    frame.dataset.hfAdLive = "1";
    frame.setAttribute("src", url);
  }

  function isNear(node, margin) {
    try {
      var r = node.getBoundingClientRect();
      var m = margin == null ? 700 : margin;
      var vh = window.innerHeight || document.documentElement.clientHeight || 0;
      return r.bottom > -m && r.top < vh + m;
    } catch (e) {
      return true;
    }
  }

  function sweep() {
    if (settings.ads !== "lazy") {
      adQueue.splice(0).forEach(unpark);
      return;
    }
    for (var i = adQueue.length - 1; i >= 0; i--) {
      if (isNear(adQueue[i])) {
        unpark(adQueue[i]);
        adQueue.splice(i, 1);
      }
    }
  }

  function deferAds(root) {
    if (settings.ads !== "lazy") return;
    qa("iframe", root).forEach(function (f) {
      if (f.id === "hflashplayer_open_frame") return;
      if (isAdFrame(f)) park(f);
    });
    // Los que va creando la web (paginación por AJAX, comentarios) se cazan con el observador.
  }

  // =============================================================================================
  // LOS JUEGOS QUE YA HAS ABIERTO (en este navegador)
  // =============================================================================================
  // El sitio tiene su propio contador en el servidor, pero necesita el AJAX de `pack0.js`. Esto es
  // nuestro y es local: sirve para no volver a entrar en el mismo juego sin querer.
  var SEEN_KEY = "hf.seen.v1";
  var SEEN_MAX = 4000;
  var seenCache = null;

  function seenAll() {
    if (seenCache) return seenCache;
    try {
      seenCache = JSON.parse(localStorage.getItem(SEEN_KEY) || "{}") || {};
    } catch (e) {
      seenCache = {};
    }
    return seenCache;
  }

  function seenSave() {
    try {
      var map = seenAll();
      var keys = Object.keys(map);
      if (keys.length > SEEN_MAX) {
        keys.sort(function (a, b) {
          return map[a] - map[b];
        });
        keys.slice(0, keys.length - SEEN_MAX).forEach(function (k) {
          delete map[k];
        });
      }
      localStorage.setItem(SEEN_KEY, JSON.stringify(map));
    } catch (e) {}
  }

  function seenHas(id) {
    return !!seenAll()[String(id || "")];
  }

  function seenMark(id) {
    id = String(id || "");
    if (!id) return;
    seenAll()[id] = Date.now();
    seenSave();
  }

  function seenCount() {
    return Object.keys(seenAll()).length;
  }

  function seenForget() {
    seenCache = {};
    try {
      localStorage.removeItem(SEEN_KEY);
    } catch (e) {}
  }

  // La clave de un juego: su dirección sin barras (`/kikyou-maid/` → `kikyou-maid`).
  function idOf(href) {
    try {
      var u = new URL(href, location.href);
      return u.pathname.replace(/^\/+|\/+$/g, "") || "home";
    } catch (e) {
      return "";
    }
  }

  function gameId() {
    // La web declara la dirección «buena» de la ficha en su `link[rel=canonical]`. En el sitio real
    // es la misma que la de la barra de direcciones, pero en el laboratorio la vista previa vive en
    // otra (la del generador), así que sin esto el historial de «ya visto» no reconocía nada.
    var c = document.querySelector('link[rel="canonical"]');
    var href = c && c.getAttribute("href");
    return idOf(href || location.pathname) || "";
  }

  // =============================================================================================
  // VIGILANTE DEL DOM
  // =============================================================================================
  // La web cambia trozos de la página por AJAX (la lista de aleatorios, los comentarios, la
  // paginación). Un solo observador, con espera, y quien quiera se suscribe.
  var domWatchers = [];

  function onDom(fn) {
    if (typeof fn === "function") domWatchers.push(fn);
  }

  function watch() {
    if (!document.body || !window.MutationObserver) return;
    var busy = false;
    var timer = 0;
    var obs = new MutationObserver(function () {
      if (busy) return;
      busy = true;
      clearTimeout(timer);
      timer = setTimeout(function () {
        busy = false;
        domWatchers.forEach(function (fn) {
          try {
            fn();
          } catch (e) {}
        });
      }, 250);
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  window.hf = {
    DEFAULTS: DEFAULTS,
    settings: settings,
    // Lo que falle en los pasos de `boot.js` (`pass()`) se apunta aquí en vez de reventar la página.
    errors: [],
    set: set,
    onChange: onChange,
    load: loadSettings,
    pageWin: pageWin,
    base: base,
    abs: abs,
    q: q,
    qa: qa,
    el: el,
    ready: ready,
    until: until,
    toast: toast,
    pageKind: pageKind,
    adHosts: AD_HOSTS,
    deferAds: deferAds,
    sweep: sweep,
    onDom: onDom,
    watch: watch,
    seen: { has: seenHas, mark: seenMark, count: seenCount, forget: seenForget },
    idOf: idOf,
    gameId: gameId
  };

  loadSettings();
})();

// ---------------------------------------------------------------------------------------------
// h-flash.com — EL ESCUDO: los anuncios que te sacan de la web, fuera.
//
// La web vive de la publicidad, así que aquí **no se quita ningún anuncio**: ni un hueco, ni una
// impresión, ni un céntimo. Lo que se corta es lo que usa al visitante como mercancía:
//
//   · ventanas y pestañas que se abren solas (popups/popunders), vengan de donde vengan;
//   · redirecciones: el iframe del anuncio navegando la pestaña con un clic que no era suyo, un
//     `<a>` fantasma (invisible, fuera del documento) que el script pulsa por ti, un formulario o
//     un `meta refresh` que te manda lejos, o un enlace a una **web de anuncios** — las redes de
//     redirección y popunder tipo `trafficoza.com/click?key=…&zone=…&mzone=…` (`onclickads`,
//     `popads`, `propellerads`, `adsterra`, `monetag`…). Son las que el bloqueador del navegador
//     frena, y por eso te queda la pestaña de advertencia encima;
//   · pantallas completas de anuncio (interstitiales) que tapan la página entera.
//
// Nada de eso es lo que paga el anuncio que se ve en la página: la impresión se cuenta igual. Los
// huecos de verdad (el banner, el cuadrado, los nativos, la fila de enlaces del pie) se cargan y
// cuentan como siempre — la política de `core.js` es aplazarlos, no tocarlos.
//
// Cómo se corta, de lo más eficaz a lo menos:
//
//   1. **El `sandbox` de los iframes de anuncio.** El sitio los crea con
//      `allow-top-navigation-by-user-activation … allow-popups allow-popups-to-escape-sandbox`, que
//      son justo los permisos que necesita un creativo para llevarte a su web con un clic tuyo (el
//      de arriba: la bandera de `top-navigation` es la que hace posible el salto a `trafficoza`, y
//      `allow-popups` la que abre pestañas). Sin ellas un iframe **no puede** tocar la pestaña: el
//      anuncio se sigue viendo y contando igual. Las banderas solo se leen al empezar a navegar el
//      iframe, así que hay que quitarlas *antes*: por eso se enganchan `setAttribute`, la propiedad
//      `sandbox`, la propiedad `src` (justo antes de que arranque la carga) y
//      `appendChild`/`insertBefore`/`replaceChild` (justo antes de que el iframe entre en el
//      documento, que es cuando empieza a cargar). A un iframe de anuncio que venga **sin**
//      `sandbox` se le pone el mínimo (`allow-scripts allow-same-origin allow-forms`): sin la
//      bandera de arriba tampoco podrá saltar.
//   2. **La navegación de la pestaña** (`Navigation` API, la que entiende el navegador). Se corta
//      *cualquier* intento de llevar la pestaña a una web de anuncios: el clic de un enlace, el
//      `location.href = …` de un script, el `submit()` de un formulario o un `meta refresh`. Es la
//      única puerta que queda después del `sandbox`, y la última línea de defensa: en el navegador
//      que no la tenga (Firefox/Safari) quedan los enganches de clic, envío de formulario y
//      `meta refresh` que están más abajo.
//   3. **`window.open` de la página.** Se deja pasar lo que apunta a la propia web (o no apunta a
//      ningún sitio: `about:blank`, `blob:`…) y se descarta lo demás. Un `<a target="_blank">` de
//      la web no pasa por aquí: eso lo abre el navegador, y el visitante decide.
//   4. **El clic sobre un `<a>` que no se ve** (creado, pulsado y tirado; o puesto por encima de
//      la pantalla con `opacity:0` que es el truco de manual del popunder), y el clic sobre
//      cualquier enlace que apunte a una web de anuncios, aunque se vea.
//   5. **El intersticial.** Un iframe de anuncio (o una caja cuyo único contenido es un anuncio)
//      que aparece tapando la pantalla y sin nada más dentro: se va, porque no hay manera de
//      enseñarlo sin tapar la web.
//
// Todo lo que se corta se cuenta en `hf.shield.stats` (y se enseña en el panel ⚡). El ajuste es
// `hf.settings.shield` (puesto por defecto): apagarlo devuelve la página a como estaba, con los
// permisos y las funciones originales.
// ---------------------------------------------------------------------------------------------
(function () {
  "use strict";
  var hf = window.hf;
  if (!hf || hf.shield) return;

  // El dominio de la web (y su versión japonesa: ja.h-flash.com).
  var SITE = /(^|\.)h-flash\.com$/i;
  // Los huecos de publicidad, para reconocer un anuncio cuando hay que decidir si algo es un
  // intersticial (la misma lista que usa el aplazado de `core.js`).
  var AD_HOSTS = hf.adHosts || /(adglare|sadbaguette|acscdn|magsrv|exoclick|juicyads)/i;

  // Lo que le da a un iframe una salida de la página. Para verse y contar, un anuncio solo necesita
  // `allow-scripts` (y, si acaso, `allow-same-origin` y `allow-forms`); todo lo demás es para
  // moverse: navegar la pestaña (con o sin permiso de tu clic), abrir ventanas, descargar cosas o
  // sacar modales.
  var ESCAPE = /allow-(popups(-to-escape-sandbox)?|top-navigation(-by-user-activation|-to-custom-protocols)?|downloads|modals|storage-access-by-user-activation)/;
  var ESCAPE_G = /allow-(popups(-to-escape-sandbox)?|top-navigation(-by-user-activation|-to-custom-protocols)?|downloads|modals|storage-access-by-user-activation)\s*/g;
  // Lo que se le pone a un iframe de anuncio que venga sin `sandbox`: puede pintarse, nada más.
  var BASELINE = "allow-scripts allow-same-origin allow-forms";

  // Las redes de redirección y popunder de siempre: las que reparten anuncios que son un salto a su
  // web (`trafficoza.com/click?…` es una de ellas).
  var REDIRECT_HOSTS = /(^|\.)(trafficoza|onclick(ads|max|algo|papa|best|mega|top|hi)|pop(ads|under|myads)|click(under|adu|aine|io)?|adcash|adsterra|monetag|propellerads|ad-?maven|exoclick|juicyads|trafficjunky|realsrv|exdynsrv|tsyndicate|hilltopads|adnium|bidvertiser|mgid|revenuehits|(in)?ads?exchange[a-z0-9-]*|nettrck|logivanta[0-9]*|adf(\.ly|oc\.us)|linkvertise|shorte\.st|ouo\.io)\./i;
  // Y la pinta, para las que no están en la lista (estas redes cambian de dominio cada pocas
  // semanas): un dominio de tráfico/clic/anuncio con los parámetros de una campaña.
  var TRAP_HOST = /(^|\.)[a-z0-9-]*(click|onclick|popunder|clickunder|redir|traffic|traf|adtrack|adserv|adserver|adsrv|trk|trck)[a-z0-9-]*\./i;
  var CAMPAIGN = /[?&](zone|mzone|zoneid|zone_id|qtier|campaign|campaignid|advertiser|cid|clickid|click_id|redirection_cost|pubid|banner_id|spot|creative|creativeid|adg|externalid|adzone|ad_id|adgroup)=/gi;

  var MSG = {
    popup: "Ventana emergente bloqueada",
    anchor: "Redirección a una web de anuncios bloqueada",
    overlay: "Anuncio a pantalla completa cerrado"
  };

  var stats = { popup: 0, anchor: 0, overlay: 0, sandbox: 0 };
  var hist = [];
  var subs = [];
  var undo = [];
  var layers = [];
  var on = false;
  var watching = false;
  var toastAt = 0;
  var origSet = null;

  function total() {
    return stats.popup + stats.anchor + stats.overlay;
  }

  function notify(fn) {
    subs.forEach(function (s) {
      try {
        s(stats, fn);
      } catch (e) {}
    });
  }

  // Apuntar un corte: al marcador, al historial (los últimos 25, para poder mirarlos desde la
  // consola con `hf.shield.log`) y a un aviso si hace falta.
  function blocked(kind, url, how) {
    hist.unshift({ kind: kind, how: String(how || ""), url: String(url == null ? "" : url).slice(0, 300), at: Date.now() });
    if (hist.length > 25) hist.pop();
    if (kind in stats) stats[kind]++;
    notify(hist[0]);
    var now = Date.now();
    if (now - toastAt < 2500) return;
    toastAt = now;
    hf.toast(MSG[kind] + (total() > 1 ? " · " + total() + " en total" : ""), 2600);
  }

  // =============================================================================================
  // ¿ESTO ES DE LA WEB, O DE FUERA? ¿ES UNA WEB DE ANUNCIOS?
  // =============================================================================================
  function sameHost(a, b) {
    a = String(a || "").toLowerCase();
    b = String(b || "").toLowerCase();
    if (!a || !b) return false;
    return a === b || a.slice(-(b.length + 1)) === "." + b;
  }

  // Lo que es «de casa»: la propia web (por su dominio real, el del `canonical`, o el que está
  // sirviendo la página ahora mismo) y lo que no sale a la red (about:, blob:, data:…).
  function own(url) {
    var s = String(url == null ? "" : url).trim();
    if (!s) return true;
    if (/^(about|blob|data|javascript|mailto|tel|hflash):/i.test(s)) return true;
    var u;
    try {
      u = new URL(s, location.href);
    } catch (e) {
      return true;
    }
    if (u.protocol !== "http:" && u.protocol !== "https:") return true;
    if (sameHost(u.hostname, location.hostname)) return true;
    try {
      if (sameHost(u.hostname, new URL(hf.base()).hostname)) return true;
    } catch (e) {}
    return SITE.test(u.hostname);
  }

  // ¿A dónde te lleva esto? A una web de anuncios: o el sitio es de una de las redes (por dominio),
  // o la dirección tiene la pinta de una campaña (varios parámetros de los suyos). Lo que apunta a
  // la propia web nunca lo es, se diga lo que se diga.
  function adDest(url) {
    var s = String(url == null ? "" : url).trim();
    if (!s) return false;
    var u;
    try {
      u = new URL(s, location.href);
    } catch (e) {
      return false;
    }
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    if (own(u.href)) return false;
    var h = u.hostname.toLowerCase();
    if (AD_HOSTS.test(h) || REDIRECT_HOSTS.test(h)) return true;
    var hits = (u.search.match(CAMPAIGN) || []).length;
    if (hits >= 3) return true;
    return hits >= 2 && TRAP_HOST.test(h);
  }

  // =============================================================================================
  // 1. EL `SANDBOX` DE LOS IFRAMES DE ANUNCIO (sin las banderas de salida no pueden ir a ningún
  //    sitio ni abrir nada)
  // =============================================================================================
  function writeSandbox(frame, value) {
    var s = String(value == null ? "" : value);
    if (!ESCAPE.test(s)) return false;
    s = s.replace(ESCAPE_G, "").replace(/\s+/g, " ").trim();
    stats.sandbox++;
    notify(null);
    try {
      origSet.call(frame, "sandbox", s);
    } catch (e) {}
    return true;
  }

  // A un iframe de anuncio sin `sandbox` se le pone el mínimo. Sin la bandera de `top-navigation`
  // (que es la que el sitio no le pone porque no tiene `sandbox` ninguno) tampoco podrá llevar la
  // pestaña a su web con un clic tuyo.
  function sealHost(frame, src) {
    if (!frame || frame.tagName !== "IFRAME") return false;
    if (frame.getAttribute("sandbox") != null) return false; // ya tiene: lo suyo es `tidyFrame`
    var url = String(src == null ? "" : src);
    if (!url || own(url)) return false;
    if (!adDest(url)) return false;
    try {
      origSet.call(frame, "sandbox", BASELINE);
    } catch (e) {
      return false;
    }
    stats.sandbox++;
    notify(null);
    return true;
  }

  function tidyFrame(frame, nextSrc) {
    if (!frame || frame.tagName !== "IFRAME") return false;
    var v = frame.getAttribute ? frame.getAttribute("sandbox") : null;
    if (v == null) return sealHost(frame, nextSrc != null ? nextSrc : frame.getAttribute("src") || "");
    if (!ESCAPE.test(v)) return false;
    return writeSandbox(frame, v);
  }

  // Un `meta refresh` que apunta a una web de anuncios: ni entrar. Es una redirección como
  // cualquier otra, y en un `<meta>` metido por un script pasa desapercibida.
  function metaTrap(node) {
    if (!node || node.tagName !== "META") return false;
    var eq = String(node.getAttribute("http-equiv") || "").toLowerCase();
    if (eq !== "refresh") return false;
    var c = String(node.getAttribute("content") || "");
    var m = c.match(/url\s*=\s*["']?\s*([^"';]+)/i);
    if (!m) return false;
    var url = m[1].trim();
    if (!adDest(url)) return false;
    blocked("anchor", url, "meta refresh");
    return true;
  }

  // Limpiar un nodo que va a entrar en el documento (o un fragmento entero de una vez) **antes** de
  // que entre: en cuanto un iframe se cuelga del documento empieza a cargar, y ahí ya está decidido
  // con qué permisos. Devuelve `true` cuando el nodo no debe entrar (el `meta refresh` condenado).
  function scan(node, nextSrc) {
    if (!node) return false;
    var t = node.nodeType;
    if (t === 1) {
      if (node.tagName === "IFRAME") {
        tidyFrame(node, nextSrc);
        return false;
      }
      if (node.tagName === "META") return metaTrap(node);
      if (!node.querySelectorAll) return false;
    } else if (t !== 9 && t !== 11) {
      return false;
    } else if (!node.querySelectorAll) {
      return false;
    }
    var frames = node.querySelectorAll("iframe");
    for (var i = 0; i < frames.length; i++) tidyFrame(frames[i]);
    var metas = node.querySelectorAll("meta[http-equiv]");
    for (var j = 0; j < metas.length; j++) if (metaTrap(metas[j])) metas[j].remove();
    return false;
  }

  // =============================================================================================
  // 2. LA NAVEGACIÓN DE LA PESTAÑA (la última puerta: `location.href`, `submit()`, `meta refresh`,
  //    el clic de un enlace… todo pasa por aquí en los navegadores que la tienen)
  // =============================================================================================
  function navTrap(ev) {
    if (!on) return;
    var url = "";
    try {
      url = (ev.destination && ev.destination.url) || "";
    } catch (e) {
      url = "";
    }
    if (!adDest(url)) return;
    blocked("anchor", url, "navegación (" + (ev.navigationType || "?") + ")");
    try {
      ev.preventDefault();
    } catch (e) {}
  }

  // Un `submit` de verdad (el del clic en el botón): se mira a dónde manda el formulario antes de
  // que el navegador salga.
  function onSubmit(ev) {
    if (!on) return;
    var f = ev.target;
    if (!f || f.tagName !== "FORM") return;
    var act = f.getAttribute("action") || "";
    if (!act) return;
    if (!adDest(act)) return;
    blocked("anchor", act, "envío de formulario");
    ev.preventDefault();
    ev.stopImmediatePropagation();
  }

  // =============================================================================================
  // 3. `window.open` Y 4. EL CLIC (el fantasma y el de verdad)
  // =============================================================================================
  // Una «ventana» inerte para lo que se bloquea: los scripts que la usan siguen sin reventar (y
  // `closed` ya es `true`, así que el suyo tampoco se queda colgado esperando).
  function deadWindow() {
    var noop = function () {};
    return {
      closed: true,
      focus: noop,
      blur: noop,
      close: noop,
      moveTo: noop,
      moveBy: noop,
      resizeTo: noop,
      resizeBy: noop,
      print: noop,
      postMessage: noop,
      opener: null
    };
  }

  // Un enlace que nadie ve. Los de verdad están en el documento y a la vista, porque hace falta que
  // alguien los pulse.
  function hiddenLink(a) {
    if (!a || a.nodeType !== 1) return false;
    try {
      if (!a.isConnected) return true;
    } catch (e) {
      return false;
    }
    var r = a.getBoundingClientRect();
    if (r.width || r.height) return false;
    var cs = window.getComputedStyle(a);
    return cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0";
  }

  // Lo que el visitante no puede estar pulsando a propósito: un enlace que no se ve (transparente,
  // escondido: está ahí solo para recoger el clic, que es el otro truco de manual del popunder).
  function ghost(a) {
    if (!a || a.nodeType !== 1) return false;
    try {
      if (!a.isConnected) return true;
    } catch (e) {
      return false;
    }
    var cs = window.getComputedStyle(a);
    if (!cs) return false;
    return cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0";
  }

  // El otro truco del popunder: un `<a>` **vacío** —ni texto, ni imagen, ni fondo— pero del tamaño de
  // un banner. Nadie ve nada, así que nadie puede pulsarlo a propósito: es una alfombra para recoger
  // el clic de lo que tenga debajo. En h-flash hay una de 728x90 justo encima del selector de
  // LAYOUT del pie (el clic en «auto/PC/Mobile» abría su web de anuncios). Sin contenido visible, el
  // clic no era suyo: se corta igual que el de un enlace fantasma.
  function emptyTrap(a) {
    if (!a || a.nodeType !== 1) return false;
    var r;
    try {
      r = a.getBoundingClientRect();
    } catch (e) {
      return false;
    }
    if (r.width < 60 || r.height < 30) return false;
    if (String(a.textContent || "").replace(/\s+/g, "").length) return false;
    if (a.querySelector && a.querySelector("img, svg, video, canvas, iframe, object, embed, picture")) return false;
    var cs = window.getComputedStyle(a);
    if (!cs) return false;
    if (/url\(/.test(cs.backgroundImage || "")) return false;
    return true;
  }

  function anchorIn(ev) {
    var path;
    try {
      path = ev.composedPath ? ev.composedPath() : null;
    } catch (e) {
      path = null;
    }
    if (!path) {
      var n = ev.target;
      while (n && n.nodeType === 1) {
        if (n.tagName === "A" || n.tagName === "AREA") return n;
        n = n.parentElement;
      }
      return null;
    }
    for (var i = 0; i < path.length; i++) {
      var node = path[i];
      if (!node || node.nodeType !== 1) continue;
      if (node.tagName === "A" || node.tagName === "AREA") return node;
      if (node.tagName === "BODY" || node.tagName === "HTML") break;
    }
    return null;
  }

  // El clic de verdad del visitante (fase de captura, así el enlace ni se enteran los scripts de la
  // web): se corta el que apunta a una web de anuncios —mire el visitante o no dónde pincha— y el
  // que cae sobre un enlace fantasma.
  function onUserClick(ev) {
    if (!on) return;
    if (ev.button != null && ev.button !== 0) return;
    var a = anchorIn(ev);
    if (!a) return;
    var href = a.getAttribute ? a.getAttribute("href") || "" : "";
    if (!href || own(href)) return;
    var why = "";
    if (ghost(a)) why = "clic sobre un enlace invisible";
    else if (adDest(href)) why = "enlace a una web de anuncios";
    else if (emptyTrap(a)) why = "enlace vacío del tamaño de un banner (alfombra de clics)";
    if (!why) return;
    blocked("anchor", href, why);
    ev.preventDefault();
    ev.stopImmediatePropagation();
  }

  // =============================================================================================
  // 5. EL INTERSTICIAL
  // =============================================================================================
  function adFrame(node) {
    return !!(node && node.tagName === "IFRAME" && AD_HOSTS.test(node.getAttribute("src") || ""));
  }

  // ¿dentro de esta caja lo único que hay es publicidad? Un intersticial no trae contenido de la
  // web: un iframe de anuncio, una creatividad o un enlace de salida, y poco más.
  function adInside(node) {
    if (adFrame(node)) return true;
    if (!node.querySelectorAll) return false;
    var bits = node.querySelectorAll("iframe[src], img[src], a[href]");
    for (var i = 0; i < bits.length; i++) {
      var url = bits[i].getAttribute("src") || bits[i].getAttribute("href") || "";
      if (!url || own(url)) continue;
      if (AD_HOSTS.test(url) || adDest(url)) return true;
    }
    return false;
  }

  // Un intersticial: tapa media pantalla o más, va en `fixed` (o flotando por encima de todo), no
  // trae ni un trozo de la web dentro y lo único que tiene es un anuncio.
  var SITE_MARKS = "#gamecontainer, #flash_pageleft, #flash_pageright, .pagehead, .pagebody, .gamebox, .nav, .logo, #hf-panel, #hf-toast, #hf-bar";

  function sweep() {
    if (!on || !document.body) return;
    var vw = window.innerWidth || 0;
    var vh = window.innerHeight || 0;
    if (!vw || !vh) return;
    hf.qa("body > *").forEach(function (node) {
      if (node.nodeType !== 1) return;
      if (node.id && node.id.indexOf("hf-") === 0) return;
      if (node.querySelector && node.querySelector(SITE_MARKS)) return;
      var r = node.getBoundingClientRect();
      if (r.width * r.height < vw * vh * 0.5) return;
      var cs = window.getComputedStyle(node);
      if (cs.position !== "fixed" && !(cs.position === "absolute" && (parseInt(cs.zIndex, 10) || 0) >= 1000)) return;
      if (cs.display === "none" || cs.visibility === "hidden" || cs.pointerEvents === "none") return;
      if ((node.textContent || "").replace(/\s+/g, " ").trim().length > 160) return;
      if (!adInside(node)) return;
      var inner = node.querySelector ? node.querySelector("iframe[src]") : null;
      blocked("overlay", (inner && inner.getAttribute("src")) || node.id || node.className, "intersticial");
      node.remove();
    });

    // Y las alfombras de clics: un enlace vacío del tamaño de un banner (ver `emptyTrap`) colgado
    // del cuerpo o de una caja suelta del cuerpo no enseña nada — está ahí sólo para recoger el clic
    // de lo que tenga debajo. Se va.
    hf.qa("body > a, body > div > a").forEach(function (a) {
      if (!a.getAttribute || own(a.getAttribute("href") || "")) return;
      if (!emptyTrap(a)) return;
      blocked("anchor", a.getAttribute("href"), "alfombra de clics invisible");
      a.remove();
    });
  }

  // =============================================================================================
  // ENGANCHAR (Y PODER DESENGANCHAR)
  // =============================================================================================
  function patch(target, key, make) {
    if (!target) return false;
    var d = Object.getOwnPropertyDescriptor(target, key);
    if (!d || !d.configurable) return false;
    var orig = d.value || d.set;
    if (typeof orig !== "function" || orig.__hfShield) return false;
    var fn = make(orig, d);
    if (typeof fn !== "function") return false;
    fn.__hfShield = true;
    try {
      if (d.value !== undefined) {
        Object.defineProperty(target, key, { value: fn, writable: true, configurable: true, enumerable: d.enumerable });
      } else {
        Object.defineProperty(target, key, { get: d.get, set: fn, configurable: true, enumerable: d.enumerable });
      }
    } catch (e) {
      return false;
    }
    undo.push(function () {
      try {
        Object.defineProperty(target, key, d);
      } catch (e) {}
    });
    return true;
  }

  function listen(target, type, fn) {
    if (!target || !target.addEventListener) return false;
    try {
      target.addEventListener(type, fn, true);
    } catch (e) {
      return false;
    }
    undo.push(function () {
      try {
        target.removeEventListener(type, fn, true);
      } catch (e) {}
    });
    return true;
  }

  function install() {
    if (hf.settings.shield === false) return;
    if (on) return;
    var W = hf.pageWin();
    if (!W || !W.document) return;
    origSet = W.Element && W.Element.prototype && W.Element.prototype.setAttribute;
    if (typeof origSet !== "function") return;
    on = true;
    layers.length = 0;

    // 1. el `sandbox`: se limpia en las cuatro puertas por las que un iframe de anuncio puede
    //    entrar (atributo, propiedad, `src` y el momento de colgarse del documento).
    patch(W.Element.prototype, "setAttribute", function (orig) {
      return function (name, value) {
        if (name === "sandbox" && value != null && ESCAPE.test(String(value))) {
          var s = String(value).replace(ESCAPE_G, "").replace(/\s+/g, " ").trim();
          stats.sandbox++;
          notify(null);
          return orig.call(this, name, s);
        }
        return orig.apply(this, arguments);
      };
    });
    patch(W.HTMLIFrameElement && W.HTMLIFrameElement.prototype, "sandbox", function (orig, d) {
      return function (v) {
        if (v != null && ESCAPE.test(String(v))) {
          var s = String(v).replace(ESCAPE_G, "").replace(/\s+/g, " ").trim();
          stats.sandbox++;
          notify(null);
          return orig.call(this, s);
        }
        return orig.call(this, v);
      };
    });
    patch(W.HTMLIFrameElement && W.HTMLIFrameElement.prototype, "src", function (orig) {
      return function (v) {
        try {
          tidyFrame(this, v);
        } catch (e) {}
        return orig.call(this, v);
      };
    });
    var nodes = 0;
    if (W.Node && W.Node.prototype) {
      ["appendChild", "insertBefore", "replaceChild"].forEach(function (m) {
        var ok = patch(W.Node.prototype, m, function (orig) {
          return function (node) {
            try {
              if (scan(node)) return node;
            } catch (e) {}
            return orig.apply(this, arguments);
          };
        });
        if (ok) nodes++;
      });
    }
    layers.push("sandbox" + (nodes ? "" : " (sin hooks de nodo)"));

    // 2. la navegación de la pestaña (la última puerta que queda después del `sandbox`).
    if (W.navigation && W.navigation.addEventListener) {
      if (listen(W.navigation, "navigate", navTrap)) layers.push("navegación");
    } else {
      layers.push("navegación (sin Navigation API)");
    }

    // 3. `window.open` (y `_self`/`_top`/`_parent`, que no son ventanas nuevas sino navegar).
    if (
      patch(W, "open", function (orig) {
        return function (url, name) {
          var nm = arguments.length > 1 ? String(name == null ? "" : name) : "";
          if (nm !== "_self" && nm !== "_top" && nm !== "_parent") {
            var target = arguments.length ? String(url == null ? "" : url) : "";
            if (!own(target)) {
              blocked("popup", target, "window.open");
              return deadWindow();
            }
          }
          return orig.apply(this, arguments);
        };
      })
    ) {
      layers.push("window.open");
    }

    // 4. el clic: el fantasma (sintético sobre un enlace escondido) y el de verdad (que cae sobre
    //    un enlace invisible o apunta a una web de anuncios).
    if (
      patch(W.HTMLElement && W.HTMLElement.prototype, "click", function (orig) {
        return function () {
          try {
            var tag = this.tagName;
            if (tag === "A" || tag === "AREA") {
              var href = this.getAttribute("href") || "";
              if (href && !own(href)) {
                var why = hiddenLink(this) ? "clic fantasma" : adDest(href) ? "enlace a una web de anuncios" : emptyTrap(this) ? "enlace vacío del tamaño de un banner (alfombra de clics)" : "";
                if (why) {
                  blocked("anchor", href, why);
                  return undefined;
                }
              }
            }
          } catch (e) {}
          return orig.apply(this, arguments);
        };
      })
    ) {
      layers.push("clic sintético");
    }
    if (listen(W.document, "click", onUserClick)) layers.push("clic del visitante");
    if (listen(W.document, "submit", onSubmit)) layers.push("formularios");

    if (!watching) {
      watching = true;
      hf.onDom(sweep);
    }
    sweep();
  }

  function remove() {
    if (!on) return;
    on = false;
    undo.splice(0).forEach(function (fn) {
      try {
        fn();
      } catch (e) {}
    });
    layers.length = 0;
  }

  hf.shield = {
    install: install,
    remove: remove,
    stats: stats,
    log: hist,
    layers: layers,
    own: own,
    adDest: adDest,
    sweep: sweep,
    onChange: function (fn) {
      if (typeof fn === "function") subs.push(fn);
    }
  };

  hf.onChange(function (changed) {
    if (changed.indexOf("shield") < 0) return;
    if (hf.settings.shield === false) remove();
    else install();
  });

  install();
})();

// ---------------------------------------------------------------------------------------------
// h-flash.com — LA PIEL. Solo pone clases en `<html>`: todo el color y la maquetación viven en
// `styles.css` (bloques 1 y 2), así que cambiar la paleta es cambiar variables, no repintar la web.
//
// Corre en `document-start` (antes de que exista `<body>`) para que no se vea el blanco de la web
// antes de que entre la piel: el sitio es blanco nuclear y el salto se notaría.
// ---------------------------------------------------------------------------------------------
(function () {
  "use strict";
  var hf = window.hf;
  if (!hf || hf.skin) return;

  function apply() {
    var html = document.documentElement;
    if (!html) return;
    var s = hf.settings;
    var on = s.skin !== "off";
    html.classList.toggle("hf", on);
    html.classList.toggle("hf-skin-cueva", on && s.skin === "cueva");
    html.classList.toggle("hf-skin-claro", on && s.skin === "claro");
    // El tamaño de las tarjetas de los listados: lo que el CSS llama `--hf-card`.
    if (on && s.cards) html.style.setProperty("--hf-card", s.cards + "px");
    else html.style.removeProperty("--hf-card");
  }

  // =============================================================================================
  // LOS ANUNCIOS Y SU SITIO
  // =============================================================================================
  // (1) El banner de la cabecera. La web mete ahí un 728x90 y lo agranda con
  // `transform:scale(1.76)` en línea, porque su diseño mide 1280 px justos y 728*1.76 = 1281. Con
  // la maquetación fluida eso es un desborde en cuanto la ventana baja de ~1280: aquí se recalcula
  // la escala para que quepa justo en el hueco que hay, y se reserva el alto que ocupa de verdad
  // (el `transform` no cambia la caja de maquetación, así que sin ese margen el banner se montaría
  // encima de la ficha del juego). Nada se recorta: el anuncio se ve entero, solo un poco más
  // pequeño cuando no cabe.
  //
  // (2) El cuadrado de la columna de la ficha de juego. Ahí la web mete un 300x250 (`#rightzone`)
  // justo debajo del título «Related», y parte en dos la lista de juegos relacionados. Con el
  // ajuste `sideAds` puesto, ese hueco se saca del flujo y se sube al lado del banner: la cabecera
  // queda como una fila de dos anuncios (los dos **del mismo alto**, el cuadrado escalado entero,
  // sin recortar nada) y la columna se queda solo con los juegos. La fila se reparte de una vez y
  // lo que sobre se parte en dos, así que el conjunto va **centrado** en la franja del banner y los
  // dos márgenes salen iguales; y el ancho que se le quita al banner se le da al cuadrado, por lo
  // que el banner sale lo más grande que cabe en vez de dejar un hueco en medio. Es el mismo
  // anuncio, en el mismo hueco, cargado igual; se coloca con `position:absolute` en vez de mover el
  // nodo del DOM porque mover un iframe lo recargaría y contaría otra impresión. Las medidas se
  // toman en cada pasada, así que aguanta que cambie la ventana o el contenido.
  var adBase = 0;
  var adWritten = "";
  var COL_GAP = 16;
  var COL_MIN = 1025;

  function scaleOf(v) {
    var m = /scale\(\s*([\d.]+)\s*\)/.exec(v || "");
    return m ? Number(m[1]) : 0;
  }

  // Solo se escribe si el valor cambia: así se puede llamar en cada pasada sin marear al navegador.
  function setStyle(node, prop, val) {
    if (node.style.getPropertyValue(prop) === val) return;
    node.style.setProperty(prop, val, "important");
  }

  // La escala del banner (y, si se le pasa el cuadrado de la columna, la cuenta con él).
  //
  // Las dos piezas van a la par: el cuadrado se escala para acabar con **el mismo alto** que el
  // banner, así que su ancho también sale de la escala del banner (`coef` es lo que mide de ancho
  // por unidad de escala). Con eso, «que quepan los dos con su hueco» ya es una sola cuenta:
  //   ancho*f  +  hueco  +  coef*f  <=  franja de la cabecera
  // Lo que sobre (ventanas muy anchas, con el banner ya en su tamaño de fábrica) se reparte en dos:
  // la mitad de margen a la izquierda del banner y la otra mitad a la derecha del cuadrado, así que
  // el conjunto queda **centrado** en la franja, con los dos márgenes iguales.
  function fitBanner(ad, sit) {
    var cur = ad.style.transform || "";
    // lo que hay en línea puede ser lo que escribimos nosotros (y entonces no sirve de medida)
    if (cur && cur !== adWritten) {
      var s = scaleOf(cur);
      if (s) adBase = s;
    }
    if (!adBase) return null;
    var head = ad.parentElement;
    var cs = window.getComputedStyle(head);
    var avail =
      (head.clientWidth || head.offsetWidth) -
      (parseFloat(cs.paddingLeft) || 0) -
      (parseFloat(cs.paddingRight) || 0);
    var w = ad.offsetWidth || 728;
    var h = ad.offsetHeight || 90;
    if (!avail || !w) return null;
    var coef = sit ? (sit.frameW / sit.frameH) * h : 0;
    var fit = Math.min(adBase, (avail - (sit ? COL_GAP : 0)) / (w + coef));
    if (!(fit > 0)) return null;
    var slack = Math.max(0, Math.round(avail - (w * fit + (sit ? COL_GAP + coef * fit : 0))));
    var txt = "scale(" + Math.round(fit * 1000) / 1000 + ")";
    if (txt !== adWritten) {
      adWritten = txt;
      ad.style.setProperty("transform", txt, "important");
      ad.style.setProperty("transform-origin", "left top", "important");
      var extra = Math.max(0, Math.round(h * fit) - h);
      ad.style.setProperty("margin-bottom", extra + 8 + "px", "important");
    }
    // lo que sobra se reparte en dos: la mitad de margen a la izquierda del banner y la otra mitad
    // a la derecha del cuadrado, así que el conjunto queda centrado y los dos márgenes iguales. Sin
    // cuadrado al lado (los listados) no hay pareja que centrar: el banner va pegado a su margen.
    setStyle(ad, "margin-left", Math.round((sit ? slack : 0) / 2) + "px");
    return { fit: fit, slack: slack };
  }

  // El cuadrado de la columna y la cabecera, si toca ponerlo al lado (ficha de juego, pantalla de
  // PC y el ajuste puesto).
  function sideOf() {
    if (!hf.settings.sideAds) return null;
    if ((window.innerWidth || 0) < COL_MIN) return null;
    var col = hf.q("#rightzone");
    var right = hf.q("#flash_pageright");
    var banner = hf.q("#ads_2");
    if (!col || !right || !banner || !banner.parentElement) return null;
    var frame = hf.q("iframe", col);
    return {
      col: col,
      right: right,
      banner: banner,
      frame: frame,
      // el cuadrado se mide por su iframe, no por su caja: la caja la encogemos nosotros y con el
      // `transform` puesta esa medida entraría otra vez en la cuenta por su cuenta
      frameW: (frame && frame.offsetWidth) || 300,
      frameH: (frame && frame.offsetHeight) || 250
    };
  }

  // Devolver el cuadrado a la columna (ajuste apagado, ventana estrecha, o página sin cabecera).
  function unsit() {
    document.documentElement.classList.remove("hf-ads-side");
    var col = hf.q("#rightzone");
    if (col && col.dataset.hfSide) {
      var frame = hf.q("iframe", col);
      if (frame) {
        frame.style.removeProperty("transform");
        frame.style.removeProperty("transform-origin");
      }
      ["position", "left", "top", "width", "height", "z-index"].forEach(function (p) {
        col.style.removeProperty(p);
      });
      delete col.dataset.hfSide;
    }
    var right = hf.q("#flash_pageright");
    if (right && right.dataset.hfSide) {
      right.style.removeProperty("padding-top");
      delete right.dataset.hfSide;
    }
    return false;
  }

  // La barra de progreso del reproductor de la web (`#playerctrl`) tiene su **zona de clic** aparte:
  // un `<span class="process_overlay">` vacío, invisible y transparente que la web coloca `absolute`
  // y sin coordenadas (o sea, en su «sitio natural» del flujo) justo para recoger el clic y el hover
  // de la barra y poder buscar en el vídeo. Con la barra de controles en `flex` (arriba) ese sitio
  // natural se va al principio de la fila, así que el `span` acababa **encima de los créditos** del
  // reproductor (`run by Ruffle` y el enlace rojo) en vez de sobre la barra: esa esquina se volvía
  // una zona de búsqueda invisible y, pintada con el fondo de la piel, se veía como una caja oscura.
  // Aquí se mete **dentro** de la barra de progreso (que ya es `position:relative`), donde el CSS la
  // deja del tamaño justo de su contenedor: el clic para buscar sigue midiéndose igual (`offsetX`
  // sobre la barra, del ancho que se le da al `pretoframe` de la web) y no tapa nada más. Se hace en
  // cada pasada porque el elemento es de la web y podría volver a su sitio.
  function seek() {
    var proc = hf.q(".playerctrl .process");
    var ov = hf.q(".playerctrl .process_overlay");
    if (!proc || !ov || ov.parentElement === proc) return false;
    proc.appendChild(ov);
    return true;
  }

  // (3) El banner suelto del final de la página. Las redes (`aclib` y compañía) cuelgan la
  // creatividad de un `<a>`/`<div>` directamente del cuerpo, después del pie: en el flujo cae pegada
  // al borde izquierdo de una página ya fluida, y ahí se queda torcida. Se marca con `hf-banner` y el
  // CSS la centra en su fila (margen automático), sin sacarla del flujo y sin tocar el anuncio.
  function centerBanners() {
    var vw = window.innerWidth || 0;
    if (!vw) return false;
    var changed = false;
    hf.qa("body > a, body > div, body > ins, body > table").forEach(function (node) {
      if (!node || (node.id && node.id.indexOf("hf-") === 0)) return;
      if (node.classList.contains("hf-banner")) return;
      if (node.querySelector && node.querySelector(".pagebody, .pagehead, .pagefoot, #r34g-app")) return;
      var r = node.getBoundingClientRect();
      if (r.width < 300 || r.height < 40) return;
      if (r.width > vw - 40) return; // si ya ocupa la fila entera, no hay nada que centrar
      var inside = [node].concat(hf.qa("a[href], iframe[src], img[src], ins", node));
      var ad = inside.some(function (n) {
        var u = (n.getAttribute && (n.getAttribute("href") || n.getAttribute("src"))) || "";
        if (!u) return false;
        if (hf.adHosts && hf.adHosts.test(u)) return true;
        return !!(hf.shield && hf.shield.adDest && hf.shield.adDest(u));
      });
      if (!ad) return;
      node.classList.add("hf-banner");
      changed = true;
    });
    return changed;
  }

  function layoutAds() {
    seek();
    centerBanners();
    var banner = hf.q("#ads_2");
    if (!banner || !banner.parentElement) return unsit();
    var sit = sideOf();
    var geo = fitBanner(banner, sit);
    if (!geo || !sit) return unsit();
    var col = sit.col;
    var right = sit.right;
    var frame = sit.frame;
    var br = banner.getBoundingClientRect();
    var cr = right.getBoundingClientRect();
    var sx = window.pageXOffset || 0;
    var sy = window.pageYOffset || 0;
    // Al principio de cargar el banner todavía no tiene caja (la web convierte su `<iframe2>` en
    // un `<iframe>` de verdad un poco después): si se mide entonces sale un hueco de cero y el
    // cuadrado acabaría pegado al borde. Cuando eso pasa no se toca nada y se deja para la
    // siguiente pasada (el arranque repasa cada pocos segundos hasta que la página se está quieta).
    if (!(br.width > 100)) return false;
    // el cuadrado, entero (se escala, no se recorta) y con el mismo alto que el banner
    var k = Math.min(1, ((banner.offsetHeight || 90) * geo.fit) / sit.frameH);
    var boxW = Math.round(sit.frameW * k);
    var boxH = Math.round(sit.frameH * k);
    // pegado al banner por la derecha y arriba con él
    var left = Math.round(br.left + sx + br.width + COL_GAP);
    var top = Math.round(br.top + sy);
    // y la columna arranca debajo de él (si aún sobresale), con un respiro, para que no se pisen
    var pad = Math.max(0, Math.round(top + boxH + 10 - (cr.top + sy)));
    document.documentElement.classList.add("hf-ads-side");
    col.dataset.hfSide = "1";
    right.dataset.hfSide = "1";
    if (frame) {
      setStyle(frame, "transform", "scale(" + Math.round(k * 1000) / 1000 + ")");
      setStyle(frame, "transform-origin", "left top");
    }
    setStyle(col, "width", boxW + "px");
    setStyle(col, "height", boxH + "px");
    setStyle(col, "left", left + "px");
    setStyle(col, "top", top + "px");
    setStyle(right, "padding-top", pad + "px");
    return true;
  }

  hf.skin = { apply: apply, layoutAds: layoutAds };
  hf.onChange(function (changed) {
    if (changed.indexOf("skin") >= 0 || changed.indexOf("cards") >= 0) apply();
    // el banner se reescala (y el cuadrado se coloca o se devuelve a la columna) en cuanto cambia
    // cualquiera de los dos ajustes que lo gobiernan
    if (changed.indexOf("skin") >= 0 || changed.indexOf("sideAds") >= 0) layoutAds();
  });
  apply();
})();

// ---------------------------------------------------------------------------------------------
// h-flash.com — EL IDIOMA. La web es inglesa y tiene su versión japonesa en otro dominio
// (`ja.h-flash.com`); el bloque «LANGUAGE» del pie son dos enlaces y ahí se acaba el asunto. Aquí ese
// bloque pasa a ser un **desplegable** con los dos idiomas de la web y **español**, que el sitio no
// tiene: el español lo pone este módulo traduciendo la **interfaz** encima de la página (menú de la
// cabecera, títulos de sección, botones, la ficha del juego, los comentarios, el pie, los avisos…).
//
// Sólo se traduce lo que está en el diccionario, palabra por palabra: el contenido de la web (los
// títulos de los juegos, las etiquetas, los nombres de los autores, las descripciones) es material
// y se queda como está — traducir eso sería inventarse lo que la web no ha dicho.
//
// El ajuste es `hf.settings.lang`: "auto" (el idioma de la web: inglés, o japonés en `ja.*`) o "es".
// Cambiar de idioma desde el desplegable no recarga nada cuando es «español» (se traduce la página
// que ya está abierta); los otros dos son navegar al enlace que la propia web pone en el pie.
// ---------------------------------------------------------------------------------------------
(function () {
  "use strict";
  var hf = window.hf;
  if (!hf || hf.lang) return;

  // ¿Estamos en la versión japonesa? Es otro dominio (ja.h-flash.com), así que allí el diccionario
  // inglés no sirve: la web sirve su interfaz en japonés.
  var JA = /^ja\./i.test(location.hostname);
  // Cuando se elige español desde la web japonesa hay que irse a la inglesa y traducirla al llegar
  // (el ajuste vive en `localStorage`, que es por dominio: no cruza a `ja.`). El encargo va en el
  // hash, que no llega al servidor ni le cambia la URL que la web indexa.
  var MARK_ES = "#hf-es";
  var MARK_EN = "#hf-en";

  // =============================================================================================
  // EL DICCIONARIO
  // =============================================================================================
  // Clave: el texto **exacto** que se ve (comparado ya sin espacios de sobra). Valor: el español.
  var DICT = {
    // --- La cabecera ---
    HOME: "INICIO",
    TAGS: "ETIQUETAS",
    CATEGORIES: "CATEGORÍAS",
    LIST: "LISTA",
    AUTHORS: "AUTORES",
    HOT: "POPULARES",
    GAMES: "JUEGOS",
    TOP: "TOP",
    ALL: "TODOS",
    RANDOM: "ALEATORIO",
    AUTHOR: "AUTOR",
    "H-FLASH.COM": "H-FLASH.COM",

    // --- Los enlaces de reclamo de la cabecera (y las webs amigas del pie) ---
    "Hentai Flash Games": "Juegos Flash Hentai",
    "Hentai Sex Games": "Juegos de sexo Hentai",
    "Sex Games Hentai": "Juegos de sexo Hentai",
    "Hentai XXX": "Hentai XXX",
    "Hentai Games": "Juegos Hentai",
    "hentai porn": "Porno hentai",
    "hentai sex games": "Juegos de sexo hentai",
    "Porn Games": "Juegos porno",
    "Sex Games": "Juegos de sexo",
    "Free Strip Games": "Juegos de strip gratis",
    "Best Porn Games": "Mejores juegos porno",

    // --- Los títulos de sección (los cambia la web según la página) ---
    "OLD HENTAI FLASH GAMES": "JUEGOS FLASH HENTAI ANTIGUOS",
    "HOT HENTAI FLASH GAMES": "JUEGOS FLASH HENTAI POPULARES",
    "TOP HENTAI FLASH GAMES": "MEJORES JUEGOS FLASH HENTAI",
    "RANDOM HENTAI FLASH GAMES": "JUEGOS FLASH HENTAI ALEATORIOS",
    "ALL HENTAI FLASH GAMES": "TODOS LOS JUEGOS FLASH HENTAI",
    "HOT 100 HENTAI FLASH GAMES": "LOS 100 JUEGOS FLASH HENTAI MÁS POPULARES",
    // La web parte estos títulos en dos trozos (`HOT 100<span class="mobhide"> HENTAI FLASH
    // GAMES</span>`, que en el móvil se queda en «HOT 100»): hay que traducir también los trozos.
    "HENTAI FLASH GAMES": "JUEGOS FLASH HENTAI",
    "HOT 100": "TOP 100",
    "TOP 1000 HENTAI FLASH GAMES": "LOS 1000 JUEGOS FLASH HENTAI MEJOR VALORADOS",
    "Previous Page": "Anterior",
    "Next Page": "Siguiente",
    "First Page": "Primera página",
    "Last Page": "Última página",
    "MY FAVORITES": "MIS FAVORITOS",
    "HIGHEST RATED": "MEJOR VALORADOS",
    "MOST PLAYED": "MÁS JUGADOS",
    "ADVANCED FILTER": "FILTRO AVANZADO",

    // --- El buscador y el filtro ---
    SEARCH: "BUSCAR",
    Search: "Buscar",
    Filter: "Filtrar",
    "descending": "Descendente",
    "ascending": "Ascendente",
    "pages": "Páginas",
    // El formulario del filtro avanzado (`/list/`)
    "Title:": "Título:",
    "Applied Tags:": "Etiquetas aplicadas:",
    "Sort:": "Orden:",
    "PageSize:": "Por página:",
    "rating": "Valoración",
    "play count": "Visitas",
    "title": "Título",
    "update date": "Fecha de actualización",
    "release date": "Fecha de publicación",
    Mobile: "Móvil",

    // --- La página de ayuda del reproductor (`/plugin/flash/`) ---
    "TL;DR. mobile => Ruffle, PC => HFlashPlayer": "RESUMEN: en el móvil → Ruffle, en PC → HFlashPlayer",
    "Solution: Ruffle": "Solución: Ruffle",
    "Solution: HFlashPlayer": "Solución: HFlashPlayer",
    "Solution: Download": "Solución: descargar",
    "Solution: Browsers that still support Flash": "Solución: navegadores que aún soportan Flash",
    "Alternate archived old version plugin package": "Paquete alternativo del complemento (versión antigua archivada)",
    "Please leave a comment if you need help": "Si necesitas ayuda, deja un comentario",

    // --- Las herramientas (`/tool/…`) y la ayuda (`/help/…`) ---
    "disable extreme content warning": "Desactivar el aviso de contenido extremo",
    "remove blocked item from list": "Quitar de la lista los elementos bloqueados",
    // La página de AJUSTES (`/tool/prefs/`) es toda ella interfaz: sus bloques, sus pistas y las
    // etiquetas de su formulario. (El bloque «Language» de esa página lo tiene la web comentado en
    // su propio HTML: el idioma se cambia desde el desplegable del pie.)
    "All options saved in your cookies.": "Todas las opciones se guardan en tus cookies.",
    "Default Flash Plugin": "Reproductor Flash por defecto",
    "choose my default flash plugin to use:": "Elige el reproductor flash que quiero usar:",
    "*select one of this option flash content will launch automatically without click.":
      "*Si eliges una de estas opciones, el contenido flash arrancará solo, sin hacer clic.",
    None: "Ninguno",
    Layout: "Diseño",
    "choose my interface layout:": "Elige el diseño de la interfaz:",
    "Content Block": "Bloqueo de contenido",
    "*check this option will disable extreme content warning with dark red background in game page.":
      "*Marca esta opción y el aviso de contenido extremo (el fondo rojo oscuro de la ficha) no sale.",
    "*check this option will remove blocked items from list instead of showing blocked hint.":
      "*Marca esta opción y los elementos bloqueados desaparecen de la lista en vez de salir su aviso.",
    "Blocked tags": "Etiquetas bloqueadas",
    "Search tags to block": "Buscar etiquetas para bloquear",
    "* click listed tag to block.": "* Haz clic en una etiqueta de la lista para bloquearla.",
    "Q: How do I download a flash?": "P: ¿Cómo descargo un flash?",
    "Q: How do I upload my flash?": "P: ¿Cómo subo mi flash?",
    "ONLINE FLASH SAVE EDITOR": "EDITOR DE PARTIDAS FLASH EN LÍNEA",
    "HOW TO USE": "CÓMO SE USA",
    "HOW TO EDIT SAVES NOT IN LIST": "CÓMO EDITAR PARTIDAS QUE NO ESTÁN EN LA LISTA",
    "HOW TO IDENTIFY SAVE FILE LOCATION": "CÓMO ENCONTRAR EL ARCHIVO DE PARTIDA",

    // --- La ficha de juego: la información ---
    "Game Info": "Información del juego",
    "Game Name": "Nombre",
    "Original Name": "Nombre original",
    "Statistcs": "Estadísticas",
    "My Rating:": "Mi nota:",
    "My Favorites": "Mis favoritos",
    "Favorite!": "¡Favorito!",
    Favorited: "En favoritos",
    Author: "Autor",
    "Release Date": "Fecha de publicación",
    "Game Tags": "Etiquetas",
    Download: "Descargar",
    "Download Offline Flash Player": "Descargar el reproductor Flash sin conexión",
    Source: "Fuente",
    "Alternate Source": "Fuente alternativa",
    "Original Description": "Descripción original",
    "SHOW MORE": "VER MÁS",
    "SHOW LESS": "VER MENOS",
    "Show more": "Ver más",
    Description: "Descripción",
    TRANSLATE: "TRADUCIR",

    // --- La ficha de juego: el reproductor y sus cajas de arranque ---
    "SOUND WARNING": "AVISO DE SONIDO",
    "Beware, some games may have loud sound": "Cuidado: algunos juegos tienen sonido fuerte",
    "CLICK TO PLAY": "CLIC PARA JUGAR",
    "(for pc)": "(para PC)",
    "(flash emulator)": "(emulador flash)",
    "How to use": "Cómo se usa",
    "More Solutions": "Más soluciones",
    "PLUGIN": "COMPLEMENTO",
    "RESIZE": "TAMAÑO",
    "original size": "Tamaño original",
    "fit width and height": "Ajustar ancho y alto",
    "fit width": "Ajustar al ancho",
    "fill playzone": "Llenar el área",
    "full window": "Ventana completa",
    "Adobe Flash Plugin": "Complemento de Adobe Flash",
    "Select default": "Elegir por defecto",
    "loading": "Cargando",
    "loading...": "Cargando...",
    "preparing": "Preparando",
    "download not available": "Descarga no disponible",
    "download not available for adblock user": "Descarga no disponible con bloqueador de anuncios",
    "raw link": "Enlace directo",

    // --- Los comentarios ---
    Comment: "Comentarios",
    Name: "Nombre",
    Rules: "Normas",
    "Submit Comment": "Enviar comentario",
    "no comment yet": "Todavía no hay comentarios",
    Related: "Relacionados",

    // --- El pie ---
    "FRIENDSITES:": "WEBS AMIGAS:",
    "LANGUAGE:": "IDIOMA:",
    "LAYOUT:": "DISEÑO:",
    "TOOLS:": "HERRAMIENTAS:",
    Preferences: "Preferencias",
    Plugin: "Complemento",
    SaveEditor: "Editor de partidas",
    "F.A.Q.": "Preguntas",
    Disclaimer: "Aviso legal",
    "Submit Flash": "Enviar Flash",
    Contact: "Contacto",

    // --- El aviso de contenido (el que tapa el juego en algunos casos) ---
    "This game contains extreme content (extremely gore, violence, abuse, scat, etc.)":
      "Este juego tiene contenido extremo (gore, violencia, abuso, scat, etc.)",
    " was not recommended to everyone.": " no es recomendable para todo el mundo.",
    "I understand, but i will continue anyway, then complain in comment.":
      "Lo entiendo y sigo igual; ya me quejaré en los comentarios.",
    "or [disable this in setting]": "o [desactívalo en los ajustes]",
    "This game has a very large file size, play it online may take a long loading time or crash your browser, download to play offline is recommended.":
      "Este juego pesa mucho: jugarlo en línea puede tardar en cargar o colgar el navegador. Mejor descárgalo y juégalo sin conexión.",
    "I understand, but i want to run it online.": "Lo entiendo, quiero jugarlo en línea.",
    "This file is not available in your location": "Este archivo no está disponible en tu ubicación"
  };

  // Textos que la web monta en un elemento con varios trozos dentro (ahí no vale traducir nodo a
  // nodo: hay que rehacer el elemento entero).
  var ELEMS = {
    "Bug Report": 'Informe de <span style="color:red">error</span>',
    "Previous Page": "Anterior",
    "Next Page": "Siguiente",
    "First Page": "Primera página",
    "Last Page": "Última página"
  };

  // Elementos del menú que la web parte en dos («ALL» + un `<span class="mobhide"> GAMES</span>` que
  // esconde en el móvil): nodo a nodo saldría «TODOS JUEGOS». Aquí se les da su texto entero, corto
  // para que el menú siga entrando en una pantalla de teléfono.
  var IDS = {
    nav_top: "MEJORES",
    nav_all: "TODOS",
    nav_hot: "POPULARES",
    nav_random: "ALEATORIO"
  };

  // Lo que la web escribe con números por medio (los títulos de los iconos de visitas y de nota).
  var PATTERNS = [
    [
      /^This game has been played ([\d.,]+) times , today:([\d.,]+) weekly:([\d.,]+)$/,
      "Este juego se ha jugado $1 veces · hoy: $2 · esta semana: $3"
    ],
    [
      /^([\d.,]+) games has been played ([\d.,]+) times , today:([\d.,]+) weekly:([\d.,]+)$/,
      "$1 juegos jugados $2 veces · hoy: $3 · esta semana: $4"
    ],
    [/^([\d.,]+) ?\/5 rating voted by ([\d.,]+) players$/, "$1/5, votado por $2 jugadores"],
    [/^Search "(.*)"$/, "Búsqueda: «$1»"],
    [/^Related tags : (.*)$/, "Etiquetas relacionadas: $1"],
    [/^(\d+) rows?$/, "$1 filas"],
    // La fecha de publicación de la ficha («July 24, 2002»).
    [
      /^(January|February|March|April|May|June|July|August|September|October|November|December) (\d{1,2}), (\d{4})$/,
      function (all, month, day, year) {
        return day + " de " + MESES[month] + " de " + year;
      }
    ]
  ];

  var MESES = {
    January: "enero",
    February: "febrero",
    March: "marzo",
    April: "abril",
    May: "mayo",
    June: "junio",
    July: "julio",
    August: "agosto",
    September: "septiembre",
    October: "octubre",
    November: "noviembre",
    December: "diciembre"
  };

  // Los atributos que también se leen (el texto de los botones, el ejemplo de los campos, los
  // títulos que aparecen al pasar el ratón).
  var ATTRS = {
    placeholder: { anonymous: "Anónimo" },
    value: {
      SEARCH: "BUSCAR",
      Search: "Buscar",
      Filter: "Filtrar",
      "Submit Comment": "ENVIAR COMENTARIO"
    },
    title: {
      close: "Cerrar",
      "Beware, some games may have loud sound": "Cuidado: algunos juegos tienen sonido fuerte",
      "Hentai Flash HomePage": "Portada de Hentai Flash",
      "all hentai flash games": "Todos los juegos flash hentai",
      "top 100 highest rated hentai flash games": "Los 100 juegos flash hentai mejor valorados",
      "random games list": "Lista de juegos aleatorios",
      // Las etiquetas que bloqueas en los ajustes (`/tool/prefs/`), que su script pinta con la pista
      // en el `title`.
      "click to block": "Clic para bloquear",
      "click to remove": "Clic para quitar"
    },
    alt: { loading: "cargando" }
  };

  var SKIP_TAGS = /^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA|IFRAME|SVG|CODE|PRE)$/;

  // =============================================================================================
  // TRADUCIR LO QUE YA ESTÁ EN LA PÁGINA
  // =============================================================================================
  function tr(s) {
    if (!s) return s;
    // La web a veces corta las frases con dos espacios de más («OLD  HENTAI FLASH GAMES», con el
    // hueco que deja una etiqueta vacía): se busca por el texto ya normalizado.
    var key = s.replace(/\s+/g, " ");
    var v = DICT[key];
    if (v != null) return v;
    for (var i = 0; i < PATTERNS.length; i++) {
      if (PATTERNS[i][0].test(key)) return key.replace(PATTERNS[i][0], PATTERNS[i][1]);
    }
    return s;
  }

  // Nada de lo nuestro se traduce (el panel, los avisos, la barra): ya está en español.
  function skip(el) {
    // OJO: la piel pone sus clases en `<html>` (`hf`, `hf-skin-cueva`, `hf-game`…), así que el
    // `<html>` y el `<body>` no cuentan; a partir de ahí, un `hf-…` (id o clase) es nuestro.
    for (var n = el; n && n.nodeType === 1 && n !== document.body && n !== document.documentElement; n = n.parentElement) {
      if (n.id && n.id.indexOf("hf-") === 0) return true;
      var c = n.className;
      if (typeof c === "string" && /(^|\s)hf-\w/.test(c)) return true;
      if (SKIP_TAGS.test(n.tagName)) return true;
    }
    return false;
  }

  function textNode(node) {
    var el = node.parentElement;
    if (!el || skip(el)) return false;
    var raw = node.nodeValue;
    if (!raw) return false;
    var s = raw.trim();
    if (!s) return false;
    var out = tr(s);
    if (out === s) return false;
    node.nodeValue = raw.replace(s, out);
    return true;
  }

  function attr(el, name) {
    var map = ATTRS[name];
    if (!map) return false;
    if (name === "value" && el.tagName === "OPTION") return false;
    var v = el.getAttribute && el.getAttribute(name);
    if (!v) return false;
    var out = map[v.trim()] || tr(v.trim());
    if (!out || out === v) return false;
    if (name === "value" && el.value !== undefined && el.tagName !== "OPTION") {
      try {
        el.value = out;
      } catch (e) {}
    }
    el.setAttribute(name, out);
    return true;
  }

  function apply(root) {
    if (hf.settings.lang !== "es") return 0;
    root = root && root.nodeType === 1 ? root : document.body;
    if (!root) return 0;
    var count = 0;
    // 1. Los elementos que hay que rehacer enteros (el «Bug Report» con su palabra en rojo).
    Object.keys(IDS).forEach(function (id) {
      var el = document.getElementById(id);
      if (!el || skip(el)) return;
      if (el.textContent.replace(/\s+/g, " ").trim() === IDS[id]) return;
      el.textContent = IDS[id];
      count++;
    });
    hf.qa("a, span, b, strong", root).forEach(function (el) {
      var t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (ELEMS[t] && !el.querySelector("iframe")) {
        el.innerHTML = ELEMS[t];
        count++;
      }
    });
    // 2. Los nodos de texto (el grueso de la interfaz).
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    var n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(function (node) {
      if (textNode(node)) count++;
    });
    // 3. Los atributos que se ven. Ojo: lo que la web añade por AJAX llega aquí siendo *él mismo* el
    //    nodo nuevo (una ficha suelta), y un `querySelectorAll` no se mira a sí mismo: el nodo de
    //    arriba entra en la lista a mano, que si no sus propios `title` se quedaban sin traducir.
    var names = Object.keys(ATTRS);
    var attrSel = names.map(function (k) { return "[" + k + "]"; }).join(",");
    var targets = hf.qa(attrSel, root);
    if (root !== document.body && root.matches && root.matches(attrSel)) targets.unshift(root);
    targets.forEach(function (el) {
      if (skip(el)) return;
      names.forEach(function (name) {
        if (attr(el, name)) count++;
      });
    });
    // 4. El idioma del documento y su título (es lo que leen el navegador y los buscadores). La web
    //    los escribe como «Preferences - Hentai Flash Games»: se traduce trozo a trozo, que el
    //    nombre del juego («Maid - Hentai Flash Games») no está en el diccionario y se queda igual.
    document.documentElement.setAttribute("lang", "es");
    if (document.title) {
      document.title = document.title
        .split(" - ")
        .map(function (part) {
          return tr(part.trim()).replace(/Hentai Flash Games/gi, "Juegos Flash Hentai");
        })
        .join(" - ");
    }
    // 5. El campo de buscar etiquetas de los ajustes (`/tool/prefs/`) va sin pista ninguna al lado de
    //    su botón: la web no se la pone, así que se la pone esta (solo ahí: el `#keyword` del filtro
    //    avanzado es otro campo y ya tiene su etiqueta al lado).
    var pre = document.forms && document.forms.preform;
    if (pre) {
      var kw = pre.querySelector("#keyword");
      if (kw && !kw.getAttribute("placeholder")) kw.setAttribute("placeholder", "Etiqueta…");
    }
    return count;
  }

  // =============================================================================================
  // MIRAR LO QUE LA WEB AÑADE DESPUÉS (los comentarios por AJAX, el «ver más», la descarga)
  // =============================================================================================
  var obs = null;
  var applied = false;

  function observe() {
    if (obs || !document.body || !window.MutationObserver) return;
    obs = new MutationObserver(function (records) {
      if (hf.settings.lang !== "es") return;
      records.forEach(function (r) {
        if (r.type === "characterData") {
          textNode(r.target);
          return;
        }
        for (var i = 0; i < r.addedNodes.length; i++) {
          var node = r.addedNodes[i];
          if (node.nodeType === 1) apply(node);
          else if (node.nodeType === 3) textNode(node);
        }
      });
    });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  // =============================================================================================
  // EL DESPLEGABLE DEL PIE
  // =============================================================================================
  // La web pone sus idiomas como enlaces en el bloque «LANGUAGE»: dos en casi todas las páginas y
  // **cuatro** (inglés, japonés, ruso y chino) en el editor de partidas. El desplegable se monta con
  // los que la web ponga —sus direcciones y sus nombres, tal cual— y se le añade el español: así no
  // se pierde ninguno de los suyos por el camino. Los enlaces se esconden, pero se quedan en el
  // documento.
  var langs = null;

  function links() {
    var box = hf.q(".pagefoot .language");
    if (!box) return null;
    return { box: box, anchors: hf.qa("a[href]", box) };
  }

  function read(anchors) {
    return anchors.map(function (a) {
      var href = hf.abs(a.getAttribute("href") || "");
      var host = "";
      try {
        host = new URL(href, location.href).hostname;
      } catch (e) {}
      return { value: href, label: a.textContent.replace(/\s+/g, " ").trim() || href, host: host };
    });
  }

  // El enlace «de casa»: el de la web inglesa (en `ja.h-flash.com` es el que no es de `ja.`), que es
  // a donde se va cuando aquí no se puede traducir (la versión japonesa) y se elige español.
  function mainLang() {
    var list = langs || [];
    for (var i = 0; i < list.length; i++) if (!/^ja\./i.test(list[i].host)) return list[i];
    return list[0] || null;
  }

  function homeUrl() {
    var main = mainLang();
    return (main && main.value) || (JA ? "https://h-flash.com" : location.origin) + location.pathname;
  }

  function build() {
    var got = links();
    if (!got || !got.anchors.length) return false;
    var box = got.box;
    // La lista de idiomas se lee siempre (es barata) y no solo al montar el desplegable: así el panel
    // la tiene aunque pregunte antes de que el pie esté montado.
    langs = read(got.anchors);
    var sel = hf.q("#hf-lang", box);
    if (!sel) {
      sel = document.createElement("select");
      sel.id = "hf-lang";
      sel.setAttribute("aria-label", "Idioma de la web");
      langs.concat([{ value: "es", label: "Español" }]).forEach(function (o) {
        var op = document.createElement("option");
        op.value = o.value;
        op.textContent = o.label;
        sel.appendChild(op);
      });
      sel.addEventListener("change", function () {
        pick(sel.value);
      });
      box.appendChild(sel);
      got.anchors.forEach(function (a) {
        a.hidden = true;
      });
    }
    // El que está puesto: el español si lo tenemos puesto, si no el del dominio en el que estamos.
    var want = "es";
    if (hf.settings.lang !== "es") {
      var mine = null;
      (langs || []).forEach(function (o) {
        if (!mine && o.host === location.hostname) mine = o;
      });
      want = ((mine || mainLang() || {}).value) || "";
    }
    if (want && sel.value !== want) sel.value = want;
    return true;
  }

  function pick(value) {
    if (value === "es") {
      if (JA) {
        location.href = homeUrl() + MARK_ES;
        return;
      }
      hf.set("lang", "es");
      return;
    }
    hf.set("lang", "auto");
    if (value) location.href = value;
  }

  // Los idiomas que la web pone (los de su bloque «LANGUAGE»), ya leídos: es lo que usan el panel y
  // el bloque «Idioma» de la página de ajustes para montar su desplegable (`chooser`).
  function languages() {
    if (!langs) build();
    return (langs || []).slice();
  }

  // El encargo que viaja en el hash (ver `MARK_ES`): se apunta el idioma y se deja la URL limpia.
  function mark() {
    var h = location.hash || "";
    var want = h.indexOf("hf-es") >= 0 ? "es" : h.indexOf("hf-en") >= 0 ? "auto" : null;
    if (!want) return;
    hf.set("lang", want);
    try {
      history.replaceState(null, "", location.href.replace(/#hf-(es|en)/, ""));
    } catch (e) {}
  }

  function init() {
    mark();
    observe();
    build();
    if (hf.settings.lang === "es" && !applied) {
      applied = true;
      apply();
    }
  }

  // El mismo desplegable, suelto, para poder ponerlo donde haga falta sin repetir la lista: lo usan
  // el panel ⚡ (su sección «Idioma») y el bloque «Idioma» de la página de ajustes de la web (ver
  // `prefs.js`) — los idiomas que la web pone en su pie, tal cual, más el español de aquí.
  function chooser(cls) {
    var sel = document.createElement("select");
    if (cls) sel.className = cls;
    function paint() {
      var list = languages();
      sel.innerHTML = "";
      list.forEach(function (o) {
        var op = document.createElement("option");
        op.value = o.value;
        op.textContent = o.label;
        sel.appendChild(op);
      });
      var es = document.createElement("option");
      es.value = "es";
      es.textContent = "Español";
      sel.appendChild(es);
      if (hf.settings.lang === "es") {
        sel.value = "es";
        return;
      }
      var mine = "";
      list.forEach(function (o) {
        if (!mine && o.host === location.hostname) mine = o.value;
      });
      if (mine) sel.value = mine;
    }
    paint();
    sel.addEventListener("change", function () {
      pick(sel.value);
    });
    hf.onChange(function (changed) {
      if (changed.indexOf("lang") >= 0) paint();
    });
    // Puede montarse antes de que la web tenga su pie (y es ahí donde están los idiomas): si
    // todavía no los tiene, se rellena en cuanto aparezcan.
    hf.onDom(function () {
      if (sel.options.length <= 1) paint();
    });
    return sel;
  }

  hf.lang = {
    init: init,
    apply: apply,
    chooser: chooser,
    get: function () {
      return hf.settings.lang === "es" ? "es" : JA ? "ja" : "en";
    },
    set: function (code) {
      hf.set("lang", code === "es" ? "es" : "auto");
    },
    // Los idiomas de la web (los que pone en su bloque «LANGUAGE») y el «elegir» del desplegable, que
    // es lo que usa el panel para tener el mismo mando sin bajar al pie.
    languages: languages,
    pick: pick,
    // Pasar el texto por el diccionario (para lo que se construya fuera del documento).
    tr: tr,
    dict: DICT
  };

  hf.onChange(function (changed) {
    if (changed.indexOf("lang") < 0) return;
    build();
    // Volver a 「auto」 no puede deshacer lo ya traducido (los textos originales no se guardan): eso
    // lo arregla la recarga del navegador que hace `pick()`. Cambiarlo a mano desde la consola
    // necesita recargar la página.
    if (hf.settings.lang === "es") {
      applied = true;
      apply();
      observe();
    }
  });
})();

// ---------------------------------------------------------------------------------------------
// h-flash.com — EL REPRODUCTOR.
//
// El sitio trae DOS formas de jugar y ninguna es cómoda: dos cajas («HFlashPlayer (for pc) CLICK TO
// PLAY» y «Ruffle (flash emulator) CLICK TO PLAY») que hay que pulsar, y el juego metido en una
// caja de 500 px con un `<embed>` de 450×450 en una columna de 970 (o sea, la mitad del sitio
// vacío). Aquí se arregla lo uno y lo otro:
//
//   · Arranca solo. Si el navegador no tiene Flash (ninguno lo tiene ya), se carga Ruffle sin que el
//     usuario tenga que hacer clic; se usa el Ruffle del propio sitio (0.6.0, el estable) o el más
//     nuevo del CDN oficial, a elegir en el panel. Si el sitio ya está reproduciendo algo (por
//     ejemplo porque el visitante tiene la extensión de Ruffle puesta), no se toca nada.
//   · El juego se hace grande. El marco se mide con la ventana (alto y ancho) y se le pide al
//     controlador de la web que ajuste el juego a ese hueco, en vez de dejarlo en 450 px.
//   · Pantalla completa de verdad (además de la que trae la web), recargar el juego y zoom ±.
//   · Atajos: F pantalla completa, R recargar, + / − zoom, Esc salir.
//   · Si no arranca solo, se vuelven a enseñar las cajas del sitio y se avisa, en vez de dejar una
//     pantalla en blanco.
//
// No se inventa nada del juego: la dirección del `.swf` y el controlador son los de la web
// (`swfpath`, `embedswf()`, `load_ruffle()`, `ctrl`). Esto solo los pone en marcha y les da sitio.
// ---------------------------------------------------------------------------------------------
(function () {
  "use strict";
  var hf = window.hf;
  if (!hf || hf.player) return;

  var NEWEST_RUFFLE = "https://cdn.jsdelivr.net/npm/@ruffle-rs/ruffle@nightly/ruffle.js";
  var started = false;
  var stage = null;
  var box = null;
  var bar = null;
  var note = null;
  var poll = 0;
  var tries = 0;
  var fitLeft = 10;

  function site() {
    return hf.pageWin();
  }
  function q(sel) {
    return hf.q(sel);
  }

  // ---- el sitio, con cuidado -------------------------------------------------------------------
  // Las funciones y variables del sitio (`embedswf`, `load_ruffle`, `ctrl`, `swfpath`) viven en SU
  // mundo: se buscan por si acaso, sin dar por hecho que están (pueden no haber cargado todavía).
  function siteFn(name) {
    try {
      var f = site()[name];
      return typeof f === "function" ? f : null;
    } catch (e) {
      return null;
    }
  }
  function siteVar(name) {
    try {
      return site()[name];
    } catch (e) {
      return undefined;
    }
  }

  function ruffleReady() {
    try {
      return !!site().RufflePlayer;
    } catch (e) {
      return false;
    }
  }

  // La dirección del `.swf`, en absoluto. En el sitio es la misma que ya hay (root-relative contra
  // su propio dominio); en el laboratorio, la vista previa vive en otro origen, y sin esto Ruffle
  // pediría el juego a un dominio que no lo tiene.
  function swfUrl() {
    var p = siteVar("swfpath");
    return p ? hf.abs(p) : "";
  }

  function embed() {
    return q("#embedswf") || q("ruffle-embed") || q("#embedsp");
  }

  function playing() {
    var e = q("ruffle-embed, ruffle-player");
    if (e) return true;
    return !!q("#embedsp");
  }

  // ---- cargar un script del emulador -----------------------------------------------------------
  function loadScript(url, ok, fail) {
    var s = document.createElement("script");
    s.src = url;
    s.async = true;
    s.onload = function () {
      if (ok) ok();
    };
    s.onerror = function () {
      if (fail) fail();
    };
    (document.head || document.documentElement).appendChild(s);
    return s;
  }

  function loadNewestRuffle(next) {
    if (document.getElementById("hf-ruffle-new")) {
      if (next) setTimeout(next, 300);
      return;
    }
    var s = loadScript(
      NEWEST_RUFFLE,
      function () {
        if (next) next();
      },
      function () {
        hf.toast("No se pudo descargar el emulador nuevo (¿bloqueador de anuncios?)");
      }
    );
    s.id = "hf-ruffle-new";
  }

  // ---- arrancar el juego -----------------------------------------------------------------------
  // Monta el `<embed>`. Primero por el camino de la web (`embedswf()`: es quien cuenta la
  // reproducción, respeta sus parámetros y monta su controlador); si esa función no existe, se pone
  // uno igual con lo que la web trae en `swfpath`/`swfw`/`swfh`. Nunca crea un segundo reproductor.
  function createEmbed() {
    if (embed()) return true;
    var f = siteFn("embedswf");
    if (f) {
      try {
        f();
      } catch (e) {}
      if (embed()) return true;
    }
    var c = q("#gamecontainer");
    var url = swfUrl();
    if (!c || !url) return false;
    var e = hf.el("embed", {
      id: "embedswf",
      src: url,
      type: "application/x-shockwave-flash",
      quality: "high",
      width: String(siteVar("swfw") || 450),
      height: String(siteVar("swfh") || 450)
    });
    c.appendChild(e);
    return true;
  }

  // Un solo reproductor. El código de la web es `async` y a veces monta el suyo justo cuando
  // llegamos nosotros: si acaban habiendo dos, sobra uno (los dos cargan el mismo juego, y cada uno
  // es una instancia de Ruffle entera). Se queda el primero, que es al que el controlador da tamaño.
  function dedupePlayers() {
    var list = hf.qa("#gamecontainer ruffle-embed, #gamecontainer ruffle-player, #gamecontainer embed, #gamecontainer object");
    for (var i = 1; i < list.length; i++) {
      if (list[i].parentNode) list[i].parentNode.removeChild(list[i]);
    }
  }

  // La web mete su `<embed>` con `container.innerHTML += html`. Eso NO añade un nodo: vuelve a
  // construir todo lo que había dentro del contenedor, así que nuestra barra (y su nota) se quedan
  // fuera y en su sitio aparece una COPIA sin los manejadores de los botones (el texto se queda
  // congelado y «▶ Jugar» no respondería). Cuando pasa, se quita la copia y se vuelve a colocar la
  // barra de verdad.
  function reattachBar() {
    if (!stage || !bar) return;
    if (bar.isConnected && bar.parentElement === stage) return;
    var stale = q("#hf-bar");
    if (stale && stale !== bar) stale.remove();
    stage.appendChild(bar);
  }

  var run = 0;

  function start() {
    if (started) return;
    if (hf.settings.play === "off") return;
    if (playing() || q("#embedswf")) {
      // ya hay reproductor (la web lo montó porque el navegador dice tener Flash, o porque el
      // visitante lleva la extensión de Ruffle): no se toca nada, solo se le da sitio.
      started = true;
      dedupePlayers();
      fit();
      return;
    }
    if (hf.settings.play === "click") return; // los botones del sitio, tal cual

    started = true;
    fit();
    begin(++run, 0);
  }

  // El botón ▶ Jugar: vuelve a intentarlo desde cero (sirve cuando el primer intento se quedó a
  // medias, por ejemplo porque Ruffle no llegó a cargar).
  function retry() {
    started = false;
    tries = 0;
    run++;
    fitLeft = 10;
    document.documentElement.classList.remove("hf-show-fallbacks");
    setReady(false);
    start();
  }

  // Arrancar de verdad, esperando a la web si hace falta. Sus funciones son `async`, así que es
  // normal llegar antes de que existan: en vez de montar un `<embed>` propio (que acabaría
  // duplicando el reproductor en cuanto llegue el suyo) se le da hasta 10 s.
  function begin(id, attempt) {
    if (id !== run) return; // los ajustes han cambiado mientras esperábamos
    if (playing() || q("#embedswf")) return;
    var emu = hf.settings.emulator;
    var haveSite = !!siteFn("embedswf");
    if (!haveSite) {
      if (emu === "nuevo") {
        loadNewestRuffle(function () {
          if (id === run) createEmbed();
        });
      } else if (attempt < 20) {
        setTimeout(function () {
          begin(id, attempt + 1);
        }, 500);
      } else {
        loadNewestRuffle(function () {
          if (id === run) createEmbed();
        });
      }
      return;
    }
    if (ruffleReady()) {
      // Hay Ruffle cargado (la extensión del navegador, o una carga anterior): solo hace falta el
      // `<embed>`; ya se encarga él de reproducirlo.
      createEmbed();
      return;
    }
    if (emu === "nuevo") {
      loadNewestRuffle(function () {
        if (id === run) createEmbed();
      });
      return;
    }
    // El camino del sitio: `load_ruffle()` crea el `<embed>` y carga SU Ruffle (0.6.0, el estable,
    // servido desde h-flash.com). Si ese script no llega en 12 s (bloqueado, movido…), se tira del
    // emulador más nuevo del CDN oficial.
    var theirs = siteFn("load_ruffle");
    if (theirs) {
      try {
        theirs();
      } catch (e) {}
      setTimeout(function () {
        if (id === run && !ruffleReady() && !playing()) {
          hf.toast("El emulador del sitio no cargó: probando con el más nuevo…");
          loadNewestRuffle(function () {
            if (id === run) createEmbed();
          });
        }
      }, 12000);
      return;
    }
    loadNewestRuffle(function () {
      if (id === run) createEmbed();
    });
  }

  // ---- el marco (nuestro sitio para el juego) ---------------------------------------------------
  // Alto del hueco que le dejamos al juego: algo menos de dos tercios de la ventana (el juego se ve
  // grande pero sigue asomando el título y la barra por abajo). En pantalla completa, todo.
  function gameBoxHeight() {
    if (document.fullscreenElement === stage) {
      var vh = window.innerHeight || 900;
      return Math.max(320, vh - 14);
    }
    var h = window.innerHeight || 900;
    return Math.min(Math.max(340, Math.round(h * 0.66)), 820);
  }

  // Los atributos `width`/`height` del `<embed>` son el tamaño que le ha dado el controlador de la
  // web (que es quien sabe la proporción del juego). Se copian al CSS, porque Ruffle pisa el tamaño
  // con `width:100%;height:100%` en línea y si no el juego sale estirado.
  function applyEmbedSize() {
    if (!stage) return;
    var t = q("#embedswf");
    var w = t ? parseInt(t.getAttribute("width"), 10) : 0;
    var h = t ? parseInt(t.getAttribute("height"), 10) : 0;
    if (w > 0 && h > 0) {
      stage.style.setProperty("--hf-game-w", w + "px");
      stage.style.setProperty("--hf-game-h", h + "px");
    } else {
      stage.style.removeProperty("--hf-game-w");
      stage.style.removeProperty("--hf-game-h");
    }
  }

  function fit() {
    if (!stage) return;
    // la barra va en su propia franja dentro del marco: el juego solo tiene lo que sobra
    var barH = bar ? bar.offsetHeight : 0;
    var gh = gameBoxHeight();
    stage.style.setProperty("--hf-stage-h", gh + barH + "px");
    var w = stage.clientWidth || stage.offsetWidth || 970;
    var ctrl = siteVar("ctrl");
    if (ctrl && ctrl.info && typeof ctrl.resize === "function") {
      var iw = Number(ctrl.info.width) || 0;
      var ih = Number(ctrl.info.height) || 0;
      var aspect = iw > 0 && ih > 0 ? iw / ih : 1;
      // El controlador de la web, en «fit», solo mira `maxwidth` cuando el juego es más ancho que
      // alto y `maxheight` cuando es más alto que ancho. Aquí se le dan ya recortados a nuestro
      // hueco (respetando la proporción del juego), así que el resultado cabe siempre entero.
      ctrl.info.maxheight = aspect > 1 ? gh : Math.min(gh, Math.round(w / aspect));
      ctrl.info.maxwidth = aspect > 1 ? Math.min(w, Math.round(gh * aspect)) : w;
      try {
        ctrl.resize("fit");
      } catch (e) {}
      applyEmbedSize();
      return;
    }
    // sin controlador (la web cambió): que el propio Ruffle llene el marco
    applyEmbedSize();
  }

  function zoom(flag) {
    var ctrl = siteVar("ctrl");
    if (ctrl && typeof ctrl.resize === "function") {
      if (ctrl.info) {
        ctrl.info.maxwidth = stage.clientWidth || stage.offsetWidth || 970;
        ctrl.info.maxheight = gameBoxHeight();
      }
      try {
        ctrl.resize(flag);
        applyEmbedSize();
        return;
      } catch (e) {}
    }
    hf.toast("Esta ficha no trae el controlador de la web: no se puede cambiar el tamaño");
  }

  function toggleFullscreen() {
    if (!stage) return;
    if (document.fullscreenElement) {
      if (document.exitFullscreen) document.exitFullscreen();
      return;
    }
    var r = stage.requestFullscreen && stage.requestFullscreen();
    if (r && r.catch) r.catch(function () {});
  }

  function reloadGame() {
    try {
      site().location.reload();
    } catch (e) {
      location.reload();
    }
  }

  function mount() {
    box = q("#gamecontainer");
    if (!box || stage) return;
    // El propio contenedor de la web es el marco: NO se mueve ni se envuelve nada (mover el nodo
    // del juego lo recargaría, y el juego volvería a empezar de cero).
    stage = box;
    box.classList.add("hf-stage");

    note = hf.el("div", { id: "hf-note", cls: "hf-note", text: "Preparando el juego…" });
    bar = hf.el("div", { id: "hf-bar", cls: "hf-bar" }, [
      hf.el("button", { type: "button", cls: "hf-btn hf-btn-play", text: "▶ Jugar", onclick: retry, title: "Arranca el juego con Ruffle (F = pantalla completa)" }),
      hf.el("button", { type: "button", cls: "hf-btn", text: "⛶ Pantalla completa", onclick: toggleFullscreen, title: "Pantalla completa (F)" }),
      hf.el("button", { type: "button", cls: "hf-btn", text: "↻ Recargar", onclick: reloadGame, title: "Recargar el juego (R)" }),
      hf.el("button", { type: "button", cls: "hf-btn", text: "＋", onclick: function () { zoom("bigger"); }, title: "Más grande (+)" }),
      hf.el("button", { type: "button", cls: "hf-btn", text: "－", onclick: function () { zoom("smaller"); }, title: "Más pequeño (−)" }),
      hf.el("button", { type: "button", cls: "hf-btn", text: "Ajustar", onclick: function () { fit(); }, title: "Que el juego llene el hueco" }),
      note
    ]);
    box.appendChild(bar);
    document.documentElement.classList.add("hf-staged");
    document.documentElement.classList.toggle("hf-autoplay", hf.settings.play === "auto");
  }

  // ---- el estado, en una línea ----------------------------------------------------------------
  function noteText(t, kind) {
    if (!note) return;
    note.textContent = t;
    note.className = "hf-note" + (kind ? " hf-note--" + kind : "");
  }

  // La caja de «cargando…» de la web (la miniatura del juego, el icono y el porcentaje): mientras el
  // `.swf` baja es lo único que hay que mirar, pero en cuanto el emulador está listo sobra —y encima
  // le come sitio al juego—. Aquí se marca `<html>` con `hf-playing` (el CSS la retira con un
  // fundido) y se quita la marca si hay que arrancar de nuevo: ahí la caja vuelve, que es la que dice
  // que el juego se está cargando. Ojo: se retira al llegar a «Listo» (el `.swf` ya está en el
  // emulador), no al pulsar ▶ Jugar; si no, el rato de la descarga se queda en negro sin nada.
  var ready = false;
  function setReady(v) {
    v = !!v;
    if (v === ready) return;
    ready = v;
    document.documentElement.classList.toggle("hf-playing", v);
  }

  function pollState() {
    if (!note) return;
    dedupePlayers();
    reattachBar();
    var ctrl = siteVar("ctrl");
    // La web monta su controlador tarde (cuando Ruffle termina de cargar el juego) y al montarse
    // pone su tamaño de siempre («orig», 450 px). Mientras no esté a NUESTRO tamaño se le vuelve a
    // pedir el ajuste; pasados ~30 s se deja de insistir, por si el visitante ha elegido él otro.
    if (fitLeft > 0 || (ctrl && ctrl.info && ctrl.info.size !== "fit" && tries < 60)) {
      if (fitLeft > 0) fitLeft--;
      fit();
    }
    var e = embed();
    var loaded = ctrl && ctrl.info ? ctrl.info.loaded : null;
    if (loaded >= 100 || (e && e.tagName && e.tagName.indexOf("RUFFLE") >= 0 && loaded == null)) {
      noteText("Listo", "ok");
      stage.classList.add("hf-stage--on");
      setReady(true);
      return;
    }
    setReady(false);
    if (loaded > 0) {
      noteText("Cargando el juego… " + Math.round(loaded) + "%");
      return;
    }
    if (!e && !started) {
      noteText(hf.settings.play === "off" ? "Reproductor apagado · actívalo en ⚡" : "Pulsa ▶ Jugar");
      return;
    }
    if (++tries > 40) {
      // 20 s sin arrancar: se devuelven las cajas del sitio (la de HFlashPlayer y la de Ruffle)
      noteText("No arrancó solo: usa las opciones de abajo", "bad");
      document.documentElement.classList.add("hf-show-fallbacks");
      return;
    }
    noteText("Cargando el juego…");
  }

  // ---- atajos ----------------------------------------------------------------------------------
  function typing(e) {
    var t = e.target;
    if (!t) return false;
    var tag = (t.tagName || "").toLowerCase();
    return tag === "input" || tag === "textarea" || tag === "select" || t.isContentEditable;
  }

  function onKey(e) {
    if (!hf.settings.keys) return;
    if (typing(e) || e.ctrlKey || e.metaKey || e.altKey) return;
    var k = e.key;
    if (k === "f" || k === "F") {
      e.preventDefault();
      toggleFullscreen();
    } else if (k === "r" || k === "R") {
      e.preventDefault();
      reloadGame();
    } else if (k === "+" || k === "=") {
      e.preventDefault();
      zoom("bigger");
    } else if (k === "-" || k === "_") {
      e.preventDefault();
      zoom("smaller");
    }
  }

  // ---- en marcha --------------------------------------------------------------------------------
  var bound = false;

  // Los escuchas y los ajustes se enganchan una sola vez; `init()` se puede llamar muchas veces
  // (el laboratorio y la propia web montan trozos de la página después: quien llama es `boot.js`
  // en cada repaso del DOM, y solo monta el marco cuando la ficha ya está en la página).
  function bind() {
    if (bound) return;
    bound = true;
    window.addEventListener("keydown", onKey, true);
    window.addEventListener(
      "resize",
      (function () {
        var t = 0;
        return function () {
          clearTimeout(t);
          t = setTimeout(fit, 300);
        };
      })()
    );
    document.addEventListener("fullscreenchange", function () {
      fit();
      if (note && document.fullscreenElement) hf.toast("F o Esc para salir de pantalla completa");
    });
    hf.onChange(function (changed) {
      if (changed.indexOf("play") >= 0) document.documentElement.classList.toggle("hf-autoplay", hf.settings.play === "auto");
      if (changed.indexOf("play") >= 0 || changed.indexOf("emulator") >= 0) {
        started = false;
        document.documentElement.classList.remove("hf-show-fallbacks");
        setReady(false);
        start();
      }
    });
  }

  function init() {
    bind();
    if (stage) return; // ya montado
    if (hf.pageKind() !== "game" || !q("#gamecontainer")) return; // todavía no está la ficha
    mount();
    fit();
    start();
    clearInterval(poll);
    poll = setInterval(pollState, 500);
    // El juego se apunta como abierto (historial local, para no volver a entrar sin querer).
    setTimeout(function () {
      if (hf.settings.seen) hf.seen.mark(hf.gameId());
    }, 2000);
  }

  hf.player = {
    init: init,
    start: start,
    retry: retry,
    fit: fit,
    zoom: zoom,
    fullscreen: toggleFullscreen,
    reload: reloadGame,
    swfUrl: swfUrl,
    // para depurar (y para el laboratorio): en qué estado está el reproductor
    debug: function () {
      return { started: started, mounted: !!stage, polling: !!poll, note: note && note.textContent, fallbacks: document.documentElement.classList.contains("hf-show-fallbacks") };
    },
    stage: function () {
      return stage;
    }
  };
})();

// ---------------------------------------------------------------------------------------------
// h-flash.com — LAS REJILLAS (portada, /all/, etiquetas, autores, búsqueda, favoritos).
//
// De momento hace una cosa, la que el sitio no puede hacer bien: acordarse de los juegos que ya has
// abierto. El contador del sitio necesita su AJAX, y esto es local y privado (vive en este
// navegador): las fichas ya vistas llevan una marca discreta y se puede vaciar desde el panel.
//
// El tamaño de las tarjetas también se elige desde el panel, pero eso es cosa del CSS
// (`--hf-card`, puesto por `skin.js`): aquí no se toca ni una medida, para no pelearse con la web.
// ---------------------------------------------------------------------------------------------
(function () {
  "use strict";
  var hf = window.hf;
  if (!hf || hf.grid) return;

  var BADGE = "hf-seen-badge";
  var GRID = "hf-grid";
  var GRID_MAIN = "hf-grid-main";

  function cards() {
    return hf.qa("a.gamebox[href]");
  }

  function markCard(a) {
    var id = hf.idOf(a.getAttribute("href"));
    if (!id) return;
    if (!hf.seen.has(id)) {
      a.classList.remove("hf-seen");
      var b = a.querySelector("." + BADGE);
      if (b) b.remove();
      return;
    }
    a.classList.add("hf-seen");
    if (a.querySelector("." + BADGE)) return;
    // Donde la web no pone nada: abajo a la derecha de la miniatura (la izquierda la usa para el
    // número de las listas TOP/HOT y arriba está la hora/fecha cuando la trae).
    a.appendChild(hf.el("span", { cls: BADGE, text: "✓", title: "Ya lo abriste (lo recuerda este navegador)" }));
  }

  function mark() {
    if (!hf.settings.seen) return;
    cards().forEach(markCard);
  }

  // Lo demás que la web mete por AJAX (la lista de aleatorios de la portada) llega después: se
  // vuelve a repasar cuando cambie el DOM (lo avisa `core.js`).
  function forget() {
    hf.qa("." + BADGE).forEach(function (b) {
      b.remove();
    });
    hf.qa(".gamebox").forEach(function (a) {
      a.classList.remove("hf-seen");
    });
  }

  // -------------------------------------------------------------------------------------------
  // LA REJILLA
  // -------------------------------------------------------------------------------------------
  // La web coloca las tarjetas con `float` y a mano (152 px de ancho), así que en cuanto se
  // agrandan queda un hueco a la derecha, y una sola pieza de otro tamaño descuadra toda la fila:
  // la web mete un hueco de anuncio (152 px) EN MEDIO de la lista, y las filas siguientes empiezan
  // más a la derecha que la primera. Los contenedores que son de verdad una rejilla se marcan aquí
  // y el CSS los pone en `grid` (sección 5): columnas exactas, huecos iguales, y el anuncio cae en
  // su celda como una tarjeta más. Ni una medida se calcula a mano, así que el panel puede cambiar
  // el tamaño sin que esto se entere.
  function layout() {
    var holders = new Map();
    cards().forEach(function (a) {
      if (!a.classList.contains("gameboxlite")) return;
      var p = a.parentElement;
      if (p) holders.set(p, (holders.get(p) || 0) + 1);
    });
    hf.qa("." + GRID).forEach(function (p) {
      if (holders.has(p)) return;
      // ya no es una rejilla (la web cambió el contenido): se le quita y vuelve a su maqueta
      p.classList.remove(GRID);
    });
    holders.forEach(function (n, p) {
      if (n < 2) return;
      // el contenedor de las dos columnas de la ficha no se toca nunca
      if (hf.q("#flash_pageright", p) || hf.q("#flash_pageleft", p)) return;
      p.classList.add(GRID);
    });

    // Los listados de etiqueta/autor (`.gameboxmain2`, 300×130 con `float`) van en la columna
    // izquierda, que es más ancha: en rejilla se reparten el ancho en vez de dejar un pasillo.
    var mains = new Map();
    hf.qa("a.gameboxmain2").forEach(function (a) {
      var p = a.parentElement;
      if (p) mains.set(p, (mains.get(p) || 0) + 1);
    });
    hf.qa("." + GRID_MAIN).forEach(function (p) {
      if (mains.has(p)) return;
      p.classList.remove(GRID_MAIN);
    });
    mains.forEach(function (n, p) {
      if (n >= 2) p.classList.add(GRID_MAIN);
    });
  }

  function init() {
    mark();
    // Al pulsar una ficha se apunta en el momento (así, si vuelves atrás, ya está marcada).
    document.addEventListener(
      "click",
      function (e) {
        var a = e.target && e.target.closest ? e.target.closest("a.gamebox[href]") : null;
        if (!a) return;
        if (e.ctrlKey || e.metaKey || e.button === 1) {
          // abrir en otra pestaña también cuenta como abrirlo
        }
        if (!hf.settings.seen) return;
        hf.seen.mark(hf.idOf(a.getAttribute("href")));
        markCard(a);
      },
      true
    );
    hf.onChange(function (changed) {
      if (changed.indexOf("seen") >= 0) (hf.settings.seen ? mark : forget)();
    });
  }

  hf.grid = { init: init, mark: mark, forget: forget, layout: layout };
})();

// ---------------------------------------------------------------------------------------------
// h-flash.com — EL PANEL DE AJUSTES (nuestro; la web no tiene nada parecido).
//
// Un botoncito flotante abajo a la derecha y, dentro, todo lo que se puede cambiar: la piel, el
// tamaño de las tarjetas, los anuncios, cómo arranca el reproductor, el historial de juegos
// abiertos y los atajos. Se guarda solo (`localStorage["hf.settings.v1"]`) y todo se aplica al
// momento, sin recargar.
// ---------------------------------------------------------------------------------------------
(function () {
  "use strict";
  var hf = window.hf;
  if (!hf || hf.panel) return;

  var box = null;
  var btn = null;

  // ---- piezas pequeñas -------------------------------------------------------------------------
  function caption(text) {
    return hf.el("div", { cls: "hf-cap", text: text });
  }

  function hint(text) {
    return hf.el("small", { cls: "hf-hint", text: text });
  }

  function row(label, control, extra) {
    return hf.el("label", { cls: "hf-row" }, [hf.el("span", { cls: "hf-row-lab", text: label }), control, extra || null]);
  }

  // Botones pegados tipo «interruptor»: se marca el que está elegido.
  function segmented(key, options, cast) {
    var wrap = hf.el("span", { cls: "hf-seg" });
    options.forEach(function (o) {
      var b = hf.el("button", {
        type: "button",
        cls: "hf-segb",
        text: o[1],
        "data-val": o[0],
        onclick: function () {
          var v = cast ? cast(o[0]) : o[0];
          hf.set(key, v);
          paint();
        }
      });
      wrap.appendChild(b);
    });
    function paint() {
      hf.qa(".hf-segb", wrap).forEach(function (b) {
        b.classList.toggle("hf-on", String(hf.settings[key]) === b.getAttribute("data-val"));
      });
    }
    paint();
    hf.onChange(function (changed) {
      if (changed.indexOf(key) >= 0) paint();
    });
    return wrap;
  }

  function chooser(key, options, cast) {
    var sel = hf.el("select", {
      cls: "hf-select",
      onchange: function () {
        hf.set(key, cast ? cast(sel.value) : sel.value);
      }
    });
    options.forEach(function (o) {
      sel.appendChild(hf.el("option", { value: o[0], text: o[1] }));
    });
    function paint() {
      sel.value = String(hf.settings[key]);
    }
    paint();
    hf.onChange(function (changed) {
      if (changed.indexOf(key) >= 0) paint();
    });
    return sel;
  }

  // El idioma de la web: el mismo desplegable que el bloque «LANGUAGE» del pie, aquí a mano (el pie
  // está al final de la página y en un listado largo eso es un rato de scroll). Lo monta `lang.js`
  // (`hf.lang.chooser`), que es el mismo que se pone en el bloque «Idioma» de la página de ajustes.
  function langChooser() {
    return hf.lang ? hf.lang.chooser("hf-select") : hf.el("select", { cls: "hf-select" });
  }

  function sw(key, label, extraHint) {
    var input = hf.el("input", { type: "checkbox", cls: "hf-sw" });
    var wrap = hf.el("label", { cls: "hf-row" }, [input, hf.el("span", { cls: "hf-row-lab", text: label })]);
    input.checked = !!hf.settings[key];
    input.addEventListener("change", function () {
      hf.set(key, !!input.checked);
    });
    hf.onChange(function (changed) {
      if (changed.indexOf(key) >= 0) input.checked = !!hf.settings[key];
    });
    var out = hf.el("div", { cls: "hf-rowwrap" }, [wrap, extraHint ? hint(extraHint) : null]);
    return out;
  }

  // El marcador del escudo (`shield.js`): se repinta solo en cuanto se bloquea algo, así se ve que
  // está trabajando sin tener que abrir la consola.
  function adNote() {
    var box = hf.el("small", { cls: "hf-hint" });
    function paint() {
      var s = hf.shield ? hf.shield.stats : null;
      if (!s) {
        box.textContent = "";
        return;
      }
      var n = s.popup + s.anchor + s.overlay;
      box.textContent = n
        ? "En esta página se han bloqueado " + n + " (" + s.popup + " ventanas emergentes, " + s.anchor + " saltos a webs de anuncios y " + s.overlay + " pantallas completas) y se han desarmado " + s.sandbox + " huecos de anuncio."
        : "En esta página todavía no ha hecho falta nada. Cuando un anuncio intente abrir una pestaña, llevarte a su web o tapar la página, saldrá aquí.";
    }
    paint();
    if (hf.shield) hf.shield.onChange(paint);
    return box;
  }

  // ---- el panel --------------------------------------------------------------------------------
  function build() {
    var count = hf.seen.count();
    var body = hf.el("div", { cls: "hf-body" }, [
      caption("Piel"),
      row("Colores", segmented("skin", [["cueva", "Cueva"], ["claro", "Claro"], ["off", "Como la web"]])),
      hint("Cueva es oscura y con el rosa del sitio como acento. «Como la web» deja los colores del sitio y solo aplica el resto de arreglos."),

      caption("Idioma"),
      row("Idioma de la web", langChooser()),
      hint("Los mismos idiomas del bloque «IDIOMA» del pie, más el español: «Español» traduce la interfaz de la página que tienes abierta (los títulos de los juegos, las etiquetas y las descripciones son de la web y se quedan como están); los demás son los de la web y llevan a su dirección."),

      caption("Listados"),
      row("Tamaño de las tarjetas", chooser("cards", [["0", "Como la web (152 px)"], ["170", "Pequeñas · 170"], ["190", "Normales · 190"], ["220", "Grandes · 220"], ["250", "Muy grandes · 250"], ["280", "Enormes · 280"]], Number)),
      hint("La rejilla reparte el ancho de la página: el número es el mínimo de cada tarjeta, así que nunca queda un hueco a la derecha."),
      sw("seen", "Marcar los juegos que ya abriste", count ? "Ahora mismo hay " + count + " en el historial de este navegador." : "Todavía no hay ninguno."),

      caption("Anuncios"),
      row("Cargar", segmented("ads", [["lazy", "Cuando se miran"], ["normal", "Como la web"]])),
      hint("No se quita ningún anuncio: los del sitio se cargan igual, pero cuando su hueco llega a la pantalla en vez de nada más abrir la página."),
      sw("sideAds", "Poner el cuadrado de la columna junto al banner", "En la ficha de juego, el 300×250 de la columna derecha sube al lado del banner de la cabecera —que se estrecha para dejarle sitio— y la columna se queda solo con los juegos relacionados. Es el mismo anuncio, en el mismo hueco: solo cambia de sitio, y la carga se aplaza igual."),
      sw("shield", "Bloquear los anuncios que te sacan de la web", "Fuera las ventanas y pestañas que se abren solas, las pantallas completas de anuncio y todo lo que te redirige a una web de anuncios (las redes de popunder y redirección tipo trafficoza.com, las que hacen que el bloqueador del navegador te deje su advertencia encima): se corta el salto, pinches donde pinches, y también el que intenta darse solo. Los anuncios que se ven en la página (el banner, el cuadrado, los nativos, los enlaces del pie) no se tocan: se cargan y cuentan igual."),
      adNote(),

      caption("Reproductor"),
      row("Al abrir un juego", segmented("play", [["auto", "Arranca solo"], ["click", "Con un clic"], ["off", "No tocar"]])),
      row("Emulador", chooser("emulator", [["web", "El del sitio (Ruffle)"], ["nuevo", "El más nuevo (CDN)"]]), null),
      hint("Los juegos son de Flash, que ya no existe en los navegadores: los reproduce un emulador (Ruffle). «El del sitio» usa el que h-flash.com sirve desde su propio dominio; «el más nuevo» el último del proyecto Ruffle."),
      row(
        "Atajos",
        (function () {
          var input = hf.el("input", { type: "checkbox", cls: "hf-sw" });
          input.checked = !!hf.settings.keys;
          input.addEventListener("change", function () {
            hf.set("keys", !!input.checked);
          });
          hf.onChange(function (changed) {
            if (changed.indexOf("keys") >= 0) input.checked = !!hf.settings.keys;
          });
          return input;
        })()
      ),
      hint("F pantalla completa · R recargar el juego · + y − cambiar el tamaño · Esc salir de pantalla completa."),

      caption("Historial"),
      hf.el("div", { cls: "hf-row" }, [
        hf.el("button", {
          type: "button",
          cls: "hf-btn",
          text: "Borrar el historial (" + count + ")",
          onclick: function () {
            hf.seen.forget();
            if (hf.grid) hf.grid.forget();
            build();
            hf.toast("Historial borrado");
          }
        })
      ]),
      hint("Los juegos abiertos se apuntan solo en este navegador (no se envía nada a ningún sitio).")
    ]);

    var wasOpen = box && !box.hidden;
    if (box) box.remove();
    box = hf.el("div", { id: "hf-panel", cls: "hf-panel", hidden: !wasOpen }, [
      hf.el("div", { cls: "hf-head" }, [hf.el("b", { text: "Ajustes de h-flash" }), hf.el("button", { type: "button", cls: "hf-x", text: "✕", onclick: close })]),
      body,
      hf.el("div", { cls: "hf-foot", text: "Se guarda solo en este navegador · nada sale de aquí" })
    ]);
    document.body.appendChild(box);
    return box;
  }

  function open() {
    if (!box || !box.isConnected) build();
    box.hidden = false;
    if (btn) btn.classList.add("hf-on");
  }

  function close() {
    if (box) box.hidden = true;
    if (btn) btn.classList.remove("hf-on");
  }

  function toggle() {
    if (box && !box.hidden) close();
    else open();
  }

  function init() {
    if (!document.body) return;
    // Si la web (o el laboratorio) ha reemplazado el trozo de DOM donde vivía el botón, vuelve:
    // por eso esto se puede llamar todas las veces que haga falta.
    if (btn && btn.isConnected) return;
    btn = hf.el("button", {
      type: "button",
      id: "hf-settings-btn",
      cls: "hf-settings-btn",
      text: "⚡",
      title: "Ajustes de h-flash (los añade este userscript)",
      onclick: toggle
    });
    document.body.appendChild(btn);
    build();
  }

  hf.panel = { init: init, open: open, close: close, toggle: toggle, build: build };
})();

// ---------------------------------------------------------------------------------------------
// h-flash.com — LA PÁGINA DE AJUSTES DE LA WEB (`/tool/prefs/`).
//
// La web guarda aquí sus ajustes en cookies: el reproductor por defecto, la maqueta, los dos avisos
// del bloqueo de contenido y las etiquetas bloqueadas. La piel ya le da el aspecto y `lang.js` la
// traduce entera; lo que le falta a la página es esto:
//
//   · El bloque **Idioma**, que la web tiene **comentado dentro de su propio HTML** (su versión
//     japonesa se quedó sin desplegable en esa página): se pone el nuestro en el mismo sitio, con
//     los idiomas que la web ofrece en su pie y el español de `lang.js`.
//   · Un enlace a la **ayuda del reproductor** («¿cuál elijo?») junto al selector de plugin, que es
//     justo la duda que plantea ese ajuste y ya tiene su página con las soluciones.
//   · Un aviso de **guardado**: la web los guarda al instante en cookies, pero no lo dice en
//     ninguna parte y el ajuste parece no hacer nada.
//   · El bloque entero **subido hasta el menú de etiquetas**: la cabecera de la web trae debajo del
//     menú su banner de anuncios (un 728x90 que la web agranda a 1281 px), y en una página tan corta
//     como esta ese hueco se queda vacío cuando la red no rellena el anuncio —en el laboratorio,
//     siempre—, así que entre las etiquetas y los ajustes aparecía un hueco muerto de casi doscientos
//     píxeles. Aquí el bloque sube y el banner baja al final del contenido (`hoist`), sin quitar el
//     anuncio ni tocar su iframe: se carga y cuenta igual, sólo cambia de sitio.
//
// Todo lo de aquí es de esta página: si no es la de ajustes (se reconoce por su formulario, ver
// `isPrefs`), no se toca nada. Las piezas se insertan una sola vez (cada una se busca a sí misma
// antes de montarse), así que `init()` puede llamarse tantas veces como quiera el vigilante del DOM.
// ---------------------------------------------------------------------------------------------
(function () {
  "use strict";
  var hf = window.hf;
  if (!hf || hf.prefs) return;

  // ¿Es esta la página de ajustes? No se pregunta por la dirección (`/tool/prefs/`) a propósito: el
  // laboratorio monta la página guardada dentro de su propia URL, así que la ruta no sirve. Se
  // pregunta por el formulario, que es suyo y no lo tiene ninguna otra página de la web
  // (`<form name="preform">` con el selector de reproductor).
  function form() {
    return (document.forms && document.forms.preform) || null;
  }

  function isPrefs() {
    var f = form();
    return !!(f && f.querySelector("select[name=plugin_selector]"));
  }

  // El `.field` (el bloque con su título) que contiene un control.
  function fieldOf(node) {
    return node && node.closest ? node.closest(".field") : null;
  }

  // ---------------------------------------------------------------------------------------------
  // EL BLOQUE «IDIOMA» QUE LA WEB TIENE COMENTADO
  // ---------------------------------------------------------------------------------------------
  function language() {
    var f = form();
    if (!f || f.querySelector("#hf-lang-field")) return;
    var plugin = f.querySelector("select[name=plugin_selector]");
    var anchor = fieldOf(plugin);
    if (!anchor) return;
    var field = hf.el("div", { cls: "field", id: "hf-lang-field" }, [
      hf.el("div", { cls: "utitle", text: "Idioma" }),
      document.createTextNode("Elige el idioma de la interfaz: "),
      hf.lang ? hf.lang.chooser() : null
    ]);
    // Va donde la web tiene el suyo (entre el reproductor y la maqueta), aunque allí sea un
    // comentario del HTML.
    anchor.parentNode.insertBefore(field, anchor.nextSibling);
  }

  // ---------------------------------------------------------------------------------------------
  // LA AYUDA DEL REPRODUCTOR, AL LADO DEL SELECTOR
  // ---------------------------------------------------------------------------------------------
  function help() {
    var f = form();
    if (!f || f.querySelector(".hf-prefs-help")) return;
    var sel = f.querySelector("select[name=plugin_selector]");
    if (!sel) return;
    var a = hf.el("a", {
      cls: "hf-prefs-help",
      href: hf.abs("/plugin/flash/"),
      title: "Cómo reproducir Flash hoy y qué reproductor elegir",
      text: "¿Cuál elijo?"
    });
    sel.parentNode.insertBefore(a, sel.nextSibling);
  }

  // ---------------------------------------------------------------------------------------------
  // EL BANNER DE LA CABECERA, AL FINAL DEL CONTENIDO
  // ---------------------------------------------------------------------------------------------
  // Debajo del menú de etiquetas la web pone su banner (`#ads_2`): un 728x90 que su propio código
  // agranda con `transform:scale(1.76)` hasta los 1281 px de su diseño. En una página como esta,
  // que no tiene más contenido, ese hueco de 158 px es lo primero que se ve —y cuando la red no
  // rellena el anuncio se queda en negro—. Como aquí no hay nada que mirar por encima de los
  // ajustes, se trae el bloque «Preferencias» hasta pegarlo al menú de etiquetas y el banner se va
  // al final del contenido, entre los ajustes y el pie. **No se quita, no se esconde y su iframe no
  // se toca**: se carga y cuenta la impresión igual, sólo cambia de sitio (el mismo criterio que en
  // el resto de la suite: los huecos de publicidad se aplazan, nunca se quitan).
  //
  // El iframe sólo se mueve mientras la web lo tiene **aplazado** (`core.js` le guarda la dirección
  // y lo deja en `about:blank` hasta que su hueco se acerca a la ventana; es el ajuste `ads` que
  // viene puesto). Mover un iframe ya cargado lo recargaría —y pediría el anuncio una segunda vez—,
  // así que si ya está cargado la página se queda como la tiene la web. Con eso el paso se puede
  // repetir en cada repaso (que es como se llama) sin moverlo dos veces: si el banner ya está en su
  // sitio no se hace nada, y si la web lo devolviera a la cabecera, vuelve a bajar mientras siga
  // sin cargar.
  function hoist() {
    var f = form();
    if (!f) return;
    var ad = hf.q("#ads_2");
    if (!ad) return;
    var foot = hf.q(".pagefoot");
    var target = (foot && foot.parentNode) || document.body;
    if (!target || ad.parentNode === target) return; // ya está al final del contenido
    if (!ad.getAttribute("data-hf-ad")) return; // ya cargado (o sin aplazar): no se toca
    target.insertBefore(ad, foot || null);
    ad.setAttribute("data-hf-moved", "1");
    // El banner ya no vive en la cabecera: hay que volver a medirlo para su sitio nuevo.
    if (hf.skin && hf.skin.layoutAds) hf.skin.layoutAds();
  }

  // ---------------------------------------------------------------------------------------------
  // EL AVISO DE GUARDADO (y los de las etiquetas)
  // ---------------------------------------------------------------------------------------------
  var last = 0;

  function say(msg) {
    var now = Date.now();
    // Una ráfaga de cambios (marcar dos casillas seguidas, bloquear tres etiquetas) es un solo aviso.
    if (now - last < 800) return;
    last = now;
    hf.toast(msg, 1600);
  }

  function saved() {
    say("Guardado");
  }

  function salute() {
    var f = form();
    if (!f || f.getAttribute("data-hf-salute")) return;
    f.setAttribute("data-hf-salute", "1");
    // `change` sube de los dos: los desplegables y las casillas. El de idioma es nuestro y también
    // guarda (o navega, y entonces la página se va y el aviso da igual).
    f.addEventListener("change", function (e) {
      var t = e.target;
      if (!t) return;
      if (t.tagName === "SELECT" || t.type === "checkbox") saved();
    });
  }

  // =============================================================================================
  // LAS ETIQUETAS BLOQUEADAS
  // =============================================================================================
  // La web tiene aquí sus dos cajas: la de las etiquetas bloqueadas (las pinta su `cb_showblock`
  // pidiendo los nombres al servidor, **una vez por cada clic** y mandando en cada petición *todas*
  // tus ids, así que cuanto más bloqueas, más pide) y la de buscar etiquetas para bloquear (que
  // espera a que pulses BUSCAR). Lo que se hace aquí:
  //
  //   · Buscar **mientras escribes** (con un respiro de 400 ms): se llama al buscador de la propia
  //     web, que contesta en un par de KB, y así no hay que darle al botón.
  //   · **Marcar las que ya están bloqueadas** en los resultados, y que un clic sobre una de ellas
  //     la **desbloquee** (en vez de volver a bloquearla).
  //   · Bloquear y desbloquear **al momento y sin pedir nada**: los nombres se apuntan en este
  //     navegador (los que se ven en las fichas) y la lista se rehace con ellos. Si alguna vez falta
  //     un nombre, entonces sí se le pide al servidor (y solo entonces).
  //   · Un contador y un botón para **quitar todas** de una vez, y un texto para cuando no hay
  //     ninguna (que si no la caja sale vacía y parece rota).
  //
  // El estado de verdad sigue siendo el de la web: la cookie `cb_tagid` (la misma que escribe su
  // propio código) y su variable `cb_tagid`, que se dejan siempre como las dejaría la web.
  var TAGS_KEY = "hf.tags.v1";

  function cache() {
    try {
      return JSON.parse(localStorage.getItem(TAGS_KEY) || "{}") || {};
    } catch (e) {
      return {};
    }
  }

  function cacheSave(map) {
    try {
      localStorage.setItem(TAGS_KEY, JSON.stringify(map));
    } catch (e) {}
  }

  function boxes() {
    return { blocked: document.getElementById("tag_blocked_field"), results: document.getElementById("tag_list_field") };
  }

  function chips(box) {
    return box ? hf.qa("a.tag[tagid]", box) : [];
  }

  // El nombre de la ficha, sin el « | X» de las bloqueadas.
  function nameOf(a) {
    var first = a.firstChild;
    var text = first && first.nodeType === 3 ? first.nodeValue : a.textContent;
    return String(text || a.textContent || "").replace(/\s*\|\s*X\s*$/, "").trim();
  }

  function busy(box) {
    return !!(box && box.hasAttribute("disabled"));
  }

  // Las bloqueadas: manda lo que hay pintado; mientras la web está pidiéndolas, lo que ya se sabía.
  function blockedIds() {
    var b = boxes().blocked;
    var dom = chips(b).map(function (a) {
      return String(a.getAttribute("tagid"));
    });
    if (dom.length || !busy(b)) return dom;
    var known = window.cb_tagid;
    return Array.isArray(known)
      ? known.filter(function (x) {
          return x != null && x !== "";
        }).map(String)
      : [];
  }

  function saveIds(list) {
    var value = list.join(",");
    window.cb_tagid = list;
    try {
      if (window.cookie && window.cookie.set) {
        window.cookie.set("cb_tagid", value, window.year || new Date(Date.now() + 365 * 864e5), "/");
        return;
      }
    } catch (e) {}
    try {
      document.cookie =
        "cb_tagid=" + value + ";path=/;expires=" + new Date(Date.now() + 365 * 864e5).toUTCString();
    } catch (e) {}
  }

  function chip(id, name) {
    var a = hf.el("a", { cls: "tag blocked", title: "Clic para quitarla", tagid: id });
    a.appendChild(document.createTextNode(name));
    a.appendChild(hf.el("span", { text: " | X" }));
    return a;
  }

  function renderBlocked(list) {
    var box = boxes().blocked;
    if (!box) return;
    var map = cache();
    var missing = [];
    box.innerHTML = "";
    list.forEach(function (id) {
      if (map[id] == null) {
        missing.push(id);
        return;
      }
      box.appendChild(chip(id, map[id]));
    });
    // Solo si de verdad falta algún nombre se molesta al servidor (y con la lista entera, que es
    // como rehace él la caja).
    if (missing.length && typeof window.cb_showblock === "function") {
      try {
        window.cb_showblock(box, list.join(","));
      } catch (e) {}
    }
  }

  // La barra de arriba de la caja: cuántas hay y el botón de quitarlas todas.
  function bar() {
    var box = boxes().blocked;
    var field = box && box.parentNode;
    if (!field) return null;
    var found = hf.q(".hf-tags-bar", field);
    if (found) return found;
    var count = hf.el("span", { cls: "hf-tags-count" });
    var clear = hf.el("button", {
      type: "button",
      cls: "hf-tags-clear",
      text: "Quitar todas",
      onclick: function () {
        saveIds([]);
        renderBlocked([]);
        paint();
        say("Etiquetas desbloqueadas");
      }
    });
    found = hf.el("div", { cls: "hf-tags-bar" }, [count, clear]);
    field.insertBefore(found, box);
    return found;
  }

  function emptyNote() {
    var box = boxes().blocked;
    var field = box && box.parentNode;
    if (!field) return null;
    var found = hf.q(".hf-tags-empty", field);
    if (found) return found;
    found = hf.el("p", { cls: "hf-tags-empty", text: "Todavía no has bloqueado ninguna etiqueta." });
    field.appendChild(found);
    return found;
  }

  // Repinta lo que depende del estado: los nombres que se ven se apuntan, los resultados se marcan y
  // la barra y el texto de «no hay ninguna» se ponen al día.
  function paint() {
    var b = boxes();
    if (!b.blocked) return;
    var map = cache();
    var changed = false;
    chips(b.blocked).forEach(function (a) {
      var id = String(a.getAttribute("tagid"));
      var name = nameOf(a);
      if (name && map[id] !== name) {
        map[id] = name;
        changed = true;
      }
      // Las que pinta la web desde el servidor llevan su propia pista; se la ponemos igual que a las
      // nuestras (las de esta página quitan, no ponen).
      if (a.getAttribute("title") !== "Clic para quitarla") a.setAttribute("title", "Clic para quitarla");
    });
    chips(b.results).forEach(function (a) {
      var id = String(a.getAttribute("tagid"));
      var name = nameOf(a);
      if (name && map[id] == null) {
        map[id] = name;
        changed = true;
      }
    });
    if (changed) cacheSave(map);
    var ids = blockedIds();
    chips(b.results).forEach(function (a) {
      var on = ids.indexOf(String(a.getAttribute("tagid"))) >= 0;
      a.classList.toggle("hf-blocked", on);
      a.setAttribute("title", on ? "Ya bloqueada · clic para quitarla" : "Clic para bloquearla");
    });
    var n = ids.length;
    var row = bar();
    if (row) {
      hf.q(".hf-tags-count", row).textContent = n ? (n === 1 ? "1 etiqueta bloqueada" : n + " etiquetas bloqueadas") : "";
      hf.q(".hf-tags-clear", row).hidden = !n;
    }
    var empty = emptyNote();
    if (empty) empty.hidden = n > 0 || busy(b.blocked);
  }

  // Bloquear o desbloquear: se deja el estado como lo dejaría la web y se repinta al momento.
  function toggle(id, on) {
    var list = blockedIds().filter(function (x) {
      return x !== String(id);
    });
    if (on) list.push(String(id));
    saveIds(list);
    renderBlocked(list);
    paint();
    say(on ? "Etiqueta bloqueada" : "Etiqueta desbloqueada");
  }

  // El clic en una ficha es nuestro (va en captura, antes del suyo): una ficha bloqueada se
  // desbloquea y una suelta se bloquea.
  function intercept() {
    var b = boxes();
    [b.blocked, b.results].forEach(function (box) {
      if (!box || box.getAttribute("data-hf-tags")) return;
      box.setAttribute("data-hf-tags", "1");
      box.addEventListener(
        "click",
        function (e) {
          var t = e.target;
          var a = t && t.closest ? t.closest("a.tag[tagid]") : null;
          if (!a || !box.contains(a)) return;
          var id = a.getAttribute("tagid");
          if (!id) return;
          e.preventDefault();
          e.stopPropagation();
          toggle(id, blockedIds().indexOf(String(id)) < 0);
        },
        true
      );
    });
  }

  // Buscar mientras escribes: se llama al buscador de la web con un respiro, y su respuesta se
  // repasa sola (el vigilante de abajo).
  var wait = 0;
  var typed = null;

  function typeAhead() {
    var input = hf.q("form[name=preform] #keyword") || hf.q("#keyword");
    var box = boxes().results;
    if (!input || !box || input.getAttribute("data-hf-type")) return;
    if (typeof window.cb_query !== "function") return;
    input.setAttribute("data-hf-type", "1");
    input.addEventListener("input", function () {
      clearTimeout(wait);
      wait = setTimeout(function () {
        var kw = String(input.value || "");
        if (!kw.trim() || kw === typed) return;
        typed = kw;
        try {
          window.cb_query(box, kw);
        } catch (e) {}
      }, 400);
    });
  }

  // Lo que la web (o nosotros) pinten en las dos cajas se repasa aquí.
  function watchTags() {
    var b = boxes();
    [b.blocked, b.results].forEach(function (box) {
      if (!box || box.getAttribute("data-hf-obs")) return;
      box.setAttribute("data-hf-obs", "1");
      new MutationObserver(paint).observe(box, { childList: true, subtree: true });
    });
  }

  function tags() {
    var b = boxes();
    if (!b.blocked || !b.results) return;
    intercept();
    watchTags();
    typeAhead();
    paint();
  }

  function init() {
    if (!isPrefs()) return;
    language();
    help();
    hoist();
    salute();
    tags();
  }

  hf.prefs = { init: init, tags: tags, blocked: blockedIds, hoist: hoist };
})();

// ---------------------------------------------------------------------------------------------
// h-flash.com — LAS PÁGINAS DE TEXTO (la ayuda del reproductor y, después, el FAQ y los avisos).
//
// La web escribe sus artículos a mano, con las etiquetas de 2005: los apartados son un `<span>` con
// `<br/><br/>` detrás para hacer el hueco, las «ventajas / inconvenientes» son `<li>` sueltos —sin
// ninguna lista que los envuelva, que es HTML inválido—, los guiones de la sección de navegadores
// viven dentro de `<p>` que empiezan por «- » (y además la web los mete dentro de otro `<p>`, que el
// navegador parte por la mitad), los párrafos van con `text-indent` de 2em y 40 px de margen a los
// lados, y la lista de autocomprobación del reproductor es un `<textarea readonly>` de 250 px (1200
// en móvil) lleno de texto monoespaciado.
//
// Aquí no se reescribe el artículo: se le ponen las clases que el CSS necesita (el aspecto va todo
// en `styles.css`, bloque 13) y se arreglan las cosas que no se pueden apañar desde el CSS:
//
//   · las «ventajas / inconvenientes» y los guiones, que pasan a ser listas de verdad;
//   · la línea de «last update», que era un `<div>` sin clase;
//   · los enlaces a archivos (`.exe`, `.zip`, `.swf`), que se marcan para pintarlos como descargas;
//   · y los **comentarios**, que en estas páginas de texto no tienen ningún sentido y se van enteros
//     (ver `comments()`).
//
// Todo es idempotente (cada paso se busca a sí mismo antes de tocar nada), así que `init()` puede
// llamarse en cada repaso del vigilante del DOM sin duplicar nada.
// ---------------------------------------------------------------------------------------------
(function () {
  "use strict";
  var hf = window.hf;
  if (!hf || hf.article) return;

  // Las marcas de que esta página es un artículo: su índice («Table of content») o la lista de
  // autocomprobación del reproductor. Cuando se hagan el FAQ y los avisos se añaden aquí sus marcas
  // (son la misma clase de página: texto con apartados).
  function page() {
    var b = hf.q(".pagebody:not(.pagehead)");
    if (!b) return null;
    if (hf.q(".tcontent", b) || hf.q("#ta_check", b)) return b;
    return null;
  }

  // ¿Es esta la página de ajustes? Esa tiene su propio módulo (`prefs.js`) y no se toca desde aquí.
  function isPrefs() {
    return !!(hf.q("form[name=preform]") || hf.q(".pagebody #hf-lang-field"));
  }

  // La línea de la última actualización: en la web es el primer `<div>` del artículo, sin clase.
  function meta(b) {
    var first = b.firstElementChild;
    if (!first || first.tagName !== "DIV" || first.className) return;
    first.classList.add("hf-meta");
  }

  // Ventajas / inconvenientes: son `<li>` sueltos, fuera de cualquier lista. Se marcan (y se les dice
  // cuál de los dos son) para que el CSS los pinte como la píldora verde o roja que son.
  function proscons(b) {
    hf.qa("li", b).forEach(function (li) {
      if (li.closest("ul, ol")) return;
      var pro = hf.q(".pros", li);
      var con = hf.q(".cons", li);
      if (!pro && !con) return;
      li.classList.add("hf-pc", pro ? "hf-pro" : "hf-con");
    });
  }

  // Y se juntan en una fila: los que van seguidos entran en un `<ul>` de verdad —con eso el `<li>`
  // vuelve a estar dentro de una lista, que es lo correcto— y el CSS los pone en paralelo.
  function group(b) {
    hf.qa("li.hf-pc", b).forEach(function (li) {
      var parent = li.parentElement;
      if (!parent || parent.classList.contains("hf-pcs")) return;
      var ul = hf.el("ul", { cls: "hf-pcs" });
      parent.insertBefore(ul, li);
      var n = li;
      while (n && n.nodeType === 1 && n.classList.contains("hf-pc")) {
        var next = n.nextElementSibling;
        ul.appendChild(n);
        n = next;
      }
    });
  }

  // Los guiones de «Browsers that still support Flash»: `<p>` que empiezan por «- ». Se juntan los
  // que van seguidos en una lista de verdad, quitándole a cada uno el guion (que ya lo pone la lista).
  function notes(b) {
    var ps = hf
      .qa("p", b)
      .filter(function (p) {
        return !p.closest(".hf-notes") && /^-\s+\S/.test(String(p.textContent || "").trim());
      });
    if (ps.length < 2) return;
    var ul = hf.el("ul", { cls: "hf-notes" });
    ps[0].parentNode.insertBefore(ul, ps[0]);
    ps.forEach(function (p) {
      var li = hf.el("li");
      // se mueve el contenido tal cual (los enlaces que haya dentro, incluidos)
      while (p.firstChild) li.appendChild(p.firstChild);
      var first = li.firstChild;
      if (first && first.nodeType === 3) first.nodeValue = first.nodeValue.replace(/^\s*-\s*/, "");
      ul.appendChild(li);
      p.remove();
    });
  }

  // Los enlaces a un archivo (el reproductor, el paquete del archivo, el .swf suelto): se marcan para
  // que se vean como lo que son —una descarga— y no como un enlace cualquiera del texto.
  var FILE = /\.(exe|zip|swf|reg|rar|7z)(\?|#|$)/i;

  function files(b) {
    hf.qa("a[href]", b).forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (!FILE.test(href) && !/\/data\/swf\//i.test(href)) return;
      a.classList.add("hf-file");
    });
  }

  // El párrafo que trae la lista de autocomprobación (el `<textarea>`): se marca aparte porque no
  // lleva el ritmo de los demás párrafos (ahí dentro va un panel, no una frase).
  function check(b) {
    var ta = hf.q("#ta_check", b);
    if (ta && ta.parentElement) ta.parentElement.classList.add("hf-check");
  }

  // =============================================================================================
  // LOS COMENTARIOS, FUERA
  // =============================================================================================
  // En una página de ayuda no hay nada que comentar: nadie lo hace, y la web los sirve con
  // `comment.js`, que en cuanto la caja asoma por la pantalla pide el archivo de comentarios al
  // servidor. Aquí se quitan —título con su ancla, hueco del formulario y lista— y el envoltorio se
  // va con ellos si se queda vacío, para no dejar el hueco.
  //
  // Con una excepción: la web mete a veces su caja de anuncio dentro de este envoltorio (el
  // `aclib`, una caja de 728x110; en la ficha de juego está ahí mismo). Un anuncio no se toca
  // nunca —ni se quita, ni se mueve, ni se recarga—, así que si al vaciarlo queda algo dentro, el
  // envoltorio se queda tal cual y solo se habrán ido los comentarios.
  //
  // Y hay que dejar el enganche de la web sin nada que enganchar: el script de los comentarios llama
  // a `onscreen("commentcontent", …)` (el de la web: «cuando esta caja llegue a la pantalla, haz
  // esto»), y su `onscreen_test()` hace `$id(id).getBoundingClientRect()` — que revienta si el
  // elemento ya no está (`Cannot read properties of null`), y lo llama la web en cada scroll. Por eso
  // `guardOnscreen()` le pone delante una comprobación de que el elemento existe: el enganche que
  // quede pendiente devuelve `false` y se queda quieto en vez de llenar la consola de errores.
  // Lo que no puede quedarse dentro del envoltorio: un anuncio (o la caja que lo trae).
  var KEEP = "iframe, ins, object, embed, picture, [id*=aclib], [class*=aclib]";

  function comments(b) {
    var field = hf.q("#commentfield", b) || hf.q("#commentfield");
    if (!field) return false;
    var win = hf.pageWin();
    // El enganche que ya estuviera apuntado se borra; el que la web apunte después lo para el
    // guardián de abajo.
    if (win && win.__onscreen_callback) delete win.__onscreen_callback["commentcontent"];
    ["#commenttitle", "#commentformloader", "#commentcontent"].forEach(function (sel) {
      var n = hf.q(sel, field);
      if (n) n.remove();
    });
    if (!hf.q(KEEP, field) && !String(field.textContent || "").trim()) field.remove();
    return true;
  }

  // El `onscreen_test` de la web, a prueba de elementos que ya no están. Se instala una sola vez y
  // da igual el orden: la función de la web puede aparecer antes o después que este módulo (en el
  // sitio real llega con su `pack0.js`; en el laboratorio, cuando se le pide que ejecute los scripts
  // de la página guardada). Devuelve `true` cuando el guardián ya está puesto.
  function guardOnscreen() {
    var win = hf.pageWin();
    var orig = win && win.onscreen_test;
    if (typeof orig !== "function") return false;
    if (orig.__hfGuard) return true;
    var safe = function (id) {
      if (!document.getElementById(id)) return false;
      return orig.apply(this, arguments);
    };
    safe.__hfGuard = true;
    try {
      win.onscreen_test = safe;
    } catch (e) {
      return false;
    }
    return true;
  }

  var guarding = false;

  function disarm() {
    if (guardOnscreen()) return;
    if (guarding) return;
    guarding = true;
    // La función de la web puede llegar un momento después (su `pack0.js` entra con `async`, y el
    // enganche de los comentarios se apunta justo detrás): se espera con un tic corto, que es una
    // comprobación de nada, y se para en cuanto está (o a los 20 s, si en esta página no hay tal
    // función y no hay nada que guardar).
    var tries = 0;
    (function tick() {
      if (guardOnscreen()) return;
      if (++tries > 400) return;
      setTimeout(tick, 50);
    })();
  }

  function init() {
    if (isPrefs()) return;
    var b = page();
    if (!b) return;
    b.classList.add("hf-article");
    meta(b);
    proscons(b);
    group(b);
    notes(b);
    files(b);
    check(b);
    comments(b);
    disarm();
  }

  hf.article = {
    init: init,
    page: page,
    meta: meta,
    proscons: proscons,
    group: group,
    notes: notes,
    files: files,
    check: check,
    comments: comments,
    guard: guardOnscreen
  };
})();

// ---------------------------------------------------------------------------------------------
// h-flash.com — ARRANQUE. Junta las piezas en el orden que toca y deja un solo vigilante del DOM
// para lo que la web añade por AJAX (la lista de aleatorios de la portada, los comentarios, los
// anuncios nuevos): todo lo que entra después se vuelve a repasar.
// ---------------------------------------------------------------------------------------------
(function () {
  "use strict";
  var hf = window.hf;
  if (!hf || hf.started) return;
  hf.started = true;

  hf.ready(function () {
    hf.watch();

    // Marcar el tipo de página en <html>: con eso el CSS sabe si tiene que montar la maqueta de
    // dos columnas (ficha de juego) y no hace falta `:has()` ni adivinar nada dentro del CSS.
    // Dos columnas hay en la ficha de juego (`#flash_pageleft`/`#flash_pageright`) y en las
    // páginas de etiqueta/autor/TOP/HOT (`.pageleft`/`.pageright`), que es otra maqueta distinta.
    function layout() {
      var html = document.documentElement;
      var kind = hf.pageKind();
      html.classList.toggle("hf-game", kind === "game");
      html.classList.toggle("hf-list", kind === "list");
      var split =
        !!(hf.q("#flash_pageleft") && hf.q("#flash_pageright")) ||
        !!(hf.q(".pageleft") && hf.q(".pageright"));
      html.classList.toggle("hf-split", split);
    }

    // El aviso de sonido de la web es un `alert()` del navegador (y corta la página): se cambia por
    // nuestro aviso, que hace lo mismo sin parar nada.
    function softerAlerts() {
      hf.qa(".soundwarning[onclick]").forEach(function (n) {
        n.removeAttribute("onclick");
        n.addEventListener("click", function (e) {
          e.preventDefault();
          hf.toast(n.getAttribute("title") || "Aviso de sonido", 6000);
        });
      });
    }

    // En el HTML de la web la columna derecha va DENTRO de la izquierda (de ahí que la saquen del
    // flujo con `position:absolute; margin-left:976px`, y que la página se alargue a lo ancho). Aquí
    // se sube al contenedor de la página, para que las dos columnas sean hermanas y el flex pueda
    // repartir el ancho de verdad.
    function columns() {
      var left = hf.q("#flash_pageleft");
      var right = hf.q("#flash_pageright");
      if (!left || !right) return;
      var parent = left.parentElement;
      if (!parent || right.parentElement !== left) return;
      parent.appendChild(right);
    }

    // El buscador de la web no trae la más mínima pista (ni etiqueta ni texto de ejemplo): se le
    // pone uno, que si no parece una caja negra.
    function searchHint() {
      hf.qa("input.keyword").forEach(function (n) {
        if (!n.placeholder) n.placeholder = "Buscar juegos…";
      });
    }

    function pass() {
      // Cada paso va aislado: un fallo en una pieza (una web que cambia, un navegador viejo) no
      // puede llevarse por delante a las demás — y menos a las que van al final, que son el idioma y
      // la página de ajustes. Lo que falle se apunta en `hf.errors` para mirarlo desde la consola.
      function safe(name, fn) {
        try {
          fn();
        } catch (e) {
          hf.errors.push({ piece: name, error: String((e && e.message) || e) });
        }
      }
      safe("columns", columns);
      safe("layout", layout);
      safe("softerAlerts", softerAlerts);
      safe("searchHint", searchHint);
      safe("skin", function () {
        if (hf.skin) hf.skin.layoutAds();
      });
      safe("ads", hf.deferAds);
      safe("grid", function () {
        if (hf.grid) hf.grid.layout();
      });
      safe("gridMarks", function () {
        if (hf.grid) hf.grid.mark();
      });
      safe("player", function () {
        if (hf.player) hf.player.init();
      });
      safe("panel", function () {
        if (hf.panel) hf.panel.init();
      });
      safe("lang", function () {
        if (hf.lang) hf.lang.init();
      });
      safe("prefs", function () {
        if (hf.prefs) hf.prefs.init();
      });
      safe("article", function () {
        if (hf.article) hf.article.init();
      });
    }

    hf.onDom(function () {
      pass();
      hf.sweep();
    });

    pass();
    if (hf.player) hf.player.init();
    if (hf.grid) hf.grid.init();
    if (hf.panel) hf.panel.init();

    // Los anuncios aplazados se devuelven al acercarse. `scroll` en captura y pasivo (barato), y un
    // repaso flojo cada pocos segundos como red de seguridad (hay navegadores que no avisan de un
    // cambio de tamaño, y el laboratorio monta la página después de cargar). En ese repaso se
    // vuelve a colocar el banner y el cuadrado de la columna: la primera pasada puede pillar la
    // página a medio montar (el banner todavía sin caja) y así se arregla sola en cuanto está.
    window.addEventListener("scroll", hf.sweep, { passive: true, capture: true });
    window.addEventListener("resize", function () {
      hf.sweep();
      if (hf.skin) hf.skin.layoutAds();
    });
    setInterval(function () {
      hf.sweep();
      if (hf.skin) hf.skin.layoutAds();
    }, 2500);
  });
})();

