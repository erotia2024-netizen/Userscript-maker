// ==UserScript==
// @name         h-flash.com
// @version      0.1.300
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
  var css = "/* =============================================================================================\n   h-flash.com — el CSS del userscript (lo pega el compilador del laboratorio dentro del .user.js).\n\n   La web es del año 2005: 1280 px fijos, cabecera de 300 px con 180 de aire, tarjetas de 152 px,\n   rosa chicle y blanco nuclear. Aquí está todo lo que hace falta para ponerla al día sin tocar su\n   HTML ni su JS: los colores salen de variables (bloque 1), la maquetación fluida vive en el bloque\n   2 y todo lo demás es repintar la web pieza a pieza.\n\n   Los bloques de maquetación van dentro de `@media (min-width: 1025px)` a propósito: por debajo de\n   ese ancho manda `mobile.css` del propio sitio, que ya tiene su versión móvil y no hay por qué\n   pisarla (esto es para PC).\n\n   Índice\n     1. la piel (variables)\n     2. la página (fondo, tipografía, contenedores fluidos)\n     3. la cabecera (logo, fila de publicidad, navegación, buscador)\n     4. títulos de sección y migas\n     5. las rejillas de juegos (tarjetas)\n     6. la ficha de juego: el marco del reproductor\n     7. el controlador de la web y las cajas de arranque\n     8. la información del juego, etiquetas y relacionadas\n     7b. el cuadrado de la columna, al lado del banner (ficha de juego)\n     8b. la columna derecha de los listados (cajas y fichas con puesto)\n     9. listas, paginación y formularios\n    10. el pie\n    11. lo nuestro (panel, botón, avisos, marcas)\n    12. los iconos del sprite en la piel oscura\n    13. las páginas de texto (la ayuda del reproductor, el FAQ y el aviso legal)\n    14. el editor de partidas (`/tool/save-editor/`)\n    15. el formulario de contacto (`/plugin/feedback/`)\n    16. pantallas estrechas\n    17. la página de autores (`/author/`) y su buscador\n    18. el «SORT» de los listados de etiqueta y de autor\n    19. la ficha del autor (`/author/<nombre>/`)\n    20. el índice de etiquetas (`/tags/list/`)\n    21. las coronas de la cabecera (las etiquetas que más se usan)\n    22. la corona y el corazón de los «favoritos de todos» (en las fichas)\n   ============================================================================================= */\n\n/* ---------------------------------------------------------------------------------------------\n   1. LA PIEL — todo el color sale de aquí\n   --------------------------------------------------------------------------------------------- */\nhtml.hf {\n  --hf-bg: #0b0d12;\n  --hf-bg2: #12151d;\n  --hf-card: 190px; /* lo cambia el panel; con 0 se deja el tamaño de la web */\n  --hf-bg3: #171b25;\n  --hf-line: #2a3140;\n  --hf-line2: #38414f;\n  --hf-text: #e9edf7;\n  --hf-dim: #98a2b8;\n  --hf-dim2: #6f7a91;\n  --hf-accent: #ff3fa4;\n  --hf-accent-2: #7a5cff;\n  --hf-accent-soft: rgba(255, 63, 164, 0.14);\n  --hf-accent-line: rgba(255, 63, 164, 0.5); /* la barra vertical que separa columnas (página de autores) */\n  --hf-ok: #4bd39b;\n  --hf-bad: #ff6b6b;\n  --hf-radius: 12px;\n  --hf-radius-s: 8px;\n  --hf-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);\n}\n\nhtml.hf.hf-skin-claro {\n  --hf-bg: #f5f6fa;\n  --hf-bg2: #ffffff;\n  --hf-bg3: #ffffff;\n  --hf-line: #e3e7f0;\n  --hf-line2: #cfd6e4;\n  --hf-text: #171b26;\n  --hf-dim: #5d687e;\n  --hf-dim2: #8791a6;\n  --hf-accent: #e0248c;\n  --hf-accent-2: #5b45d6;\n  --hf-accent-soft: rgba(224, 36, 140, 0.1);\n  --hf-accent-line: rgba(224, 36, 140, 0.4);\n  --hf-shadow: 0 10px 26px rgba(20, 26, 45, 0.12);\n}\n\n/* ---------------------------------------------------------------------------------------------\n   2. LA PÁGINA\n   --------------------------------------------------------------------------------------------- */\nhtml.hf {\n  background: var(--hf-bg);\n}\n\nhtml.hf body {\n  background: var(--hf-bg) !important;\n  color: var(--hf-text) !important;\n  font-family: system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif !important;\n  text-align: start !important;\n  -webkit-font-smoothing: antialiased;\n}\n\nhtml.hf a {\n  color: var(--hf-text);\n}\n\nhtml.hf a:hover {\n  color: var(--hf-accent);\n}\n\nhtml.hf img {\n  border-color: var(--hf-line) !important;\n}\n\n/* El sitio fija 1280 px: en una pantalla grande queda un pasillo a los lados y entre 1025 y 1280\n   aparecía scroll horizontal. Aquí el ancho es el de la ventana, con un tope generoso. */\n@media (min-width: 1025px) {\n  html.hf body .pagebody {\n    width: auto !important;\n    max-width: 1720px;\n    margin: 0 auto !important;\n    padding-left: clamp(12px, 2vw, 28px);\n    padding-right: clamp(12px, 2vw, 28px);\n    box-sizing: border-box;\n  }\n  html.hf body .pagefoot {\n    width: auto !important;\n    max-width: 1720px;\n    margin: 18px auto 0 !important;\n    padding: 14px clamp(12px, 2vw, 28px);\n    box-sizing: border-box;\n  }\n  /* La ficha de juego (y cualquier página con columna lateral): la de la izquierda se come el\n     hueco que sobre y la de la derecha se queda en sus 300 px, sin `position:absolute` de por\n     medio (el sitio la saca del flujo y quedaba pegada arriba, encima de la cabecera). */\n  /* OJO: en esta web la CABECERA también es un `.pagebody` (lleva las dos clases), y si se pone en\n     fila se desmonta: el anuncio de la cabecera es un 728x90 que la web agranda con\n     `transform:scale(1.76)` para llenar los 1280 px, y en una fila encogida se sale de la pantalla.\n     Solo van en fila las páginas de contenido. */\n  html.hf.hf-split body .pagebody:not(.pagehead) {\n    display: flex !important;\n    flex-wrap: wrap;\n    align-items: flex-start;\n    gap: 20px;\n  }\n  /* la miga de pan, el título de la sección y cualquier otro hermano suelto ocupan la fila entera,\n     encima de las columnas (si no, en la fila de al lado el título se comía el ancho de la\n     izquierda: en /hot/ la columna de las tarjetas quedaba en 293 px) */\n  html.hf.hf-split body .pagebody:not(.pagehead) > *:not(.pageleft):not(.pageright):not(#flash_pageleft):not(#flash_pageright) {\n    flex: 0 0 100%;\n  }\n  html.hf.hf-split .pageleft {\n    float: none !important;\n    width: auto !important;\n    /* la web la estira a 1500 px de alto porque su columna derecha va en `position:absolute` y\n       necesitaba sitio; con las dos columnas de verdad sobra ese hueco */\n    min-height: 0 !important;\n    flex: 1 1 0;\n    min-width: 0;\n    clear: none !important;\n  }\n  /* La de la derecha se queda en sus 300 px, pero sin los márgenes que la web le pone para sacarla\n     del flujo: `margin-left:976px` la empujaba fuera de la pantalla (y con ella la página entera,\n     porque eso alargaba el ancho desplazable). */\n  html.hf.hf-split .pageright {\n    float: none !important;\n    position: static !important;\n    width: 300px !important;\n    flex: 0 0 300px;\n    margin: 8px 0 0 !important;\n  }\n}\n\n/* ---------------------------------------------------------------------------------------------\n   3. LA CABECERA\n   --------------------------------------------------------------------------------------------- */\nhtml.hf body .pagehead {\n  display: block !important;\n  height: auto !important;\n  min-height: 0 !important;\n  padding: 10px clamp(12px, 2vw, 28px) 12px !important;\n  background: var(--hf-bg2) !important;\n  border-bottom: 1px solid var(--hf-line);\n  box-sizing: border-box;\n}\n\n/* El banner de la cabecera: la web sirve un 728x90 y lo agranda con `transform:scale(1.76)` en\n   línea (728*1.76 = 1281, los 1280 px del diseño original). Con el diseño fluido eso se sale de la\n   pantalla en ventanas medianas, así que `skin.js` recalcula la escala para que quepa justo (sin\n   taparlo nunca: se encoge, no se recorta) y reserva el alto que ocupa de verdad. */\n\nhtml.hf .pagehead .logo {\n  width: 100px;\n  height: 26px;\n  margin: 4px 0 0 0;\n  vertical-align: middle;\n}\n\n/* La fila de publicidad del pie de cabecera (enlaces de texto): la web la saca del flujo con\n   `position:absolute` y un margen negativo. Aquí vuelve al flujo, pequeña y sin estorbar. */\nhtml.hf #ads_a {\n  position: static !important;\n  width: auto !important;\n  height: auto !important;\n  margin: 0 0 0 14px !important;\n  display: inline-flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 4px 12px;\n  font-weight: 600 !important;\n  font-size: 12px;\n  vertical-align: middle;\n}\n\nhtml.hf #ads_a a {\n  margin: 0 !important;\n  background: transparent !important;\n  color: var(--hf-text) !important;\n  opacity: 0.82;\n}\n\nhtml.hf #ads_a a:hover {\n  opacity: 1;\n}\n\nhtml.hf #ads_a a:hover {\n  color: var(--hf-accent) !important;\n}\n\n/* la barra de navegación (tres líneas: secciones, etiquetas, etiquetas) */\nhtml.hf .nav {\n  margin: 10px 0 0 0 !important;\n  border-radius: var(--hf-radius) !important;\n  box-shadow: none !important;\n  background: var(--hf-bg3);\n  border: 1px solid var(--hf-line);\n  color: var(--hf-dim2) !important;\n  overflow: hidden;\n}\n\n/* Los enlaces de la web traen a veces un fondo blanco en línea (los del anuncio de arriba): en la\n   piel oscura se veían como cuadros blancos sueltos. El resalte al pasar el ratón lo ponen las\n   reglas de cada línea. */\nhtml.hf .nav a,\nhtml.hf .nav a:hover {\n  background: transparent !important;\n}\n\nhtml.hf .nav > div {\n  border-radius: 0 !important;\n}\n\nhtml.hf .nav .line1 {\n  background: transparent !important;\n  border-bottom: 1px solid var(--hf-line);\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 2px;\n  padding: 2px 6px;\n}\n\nhtml.hf .nav .line1 a {\n  padding: 8px 12px !important;\n  border-radius: var(--hf-radius-s) !important;\n  font-weight: 700 !important;\n  font-size: 13px;\n  letter-spacing: 0.03em;\n  color: var(--hf-text) !important;\n}\n\nhtml.hf .nav .line1 a:hover {\n  background: var(--hf-accent-soft) !important;\n  color: var(--hf-accent) !important;\n}\n\n/* las dos filas de etiquetas de la cabecera: en la web son una lista de enlaces sin más, de ahí\n   que pareciera «un montón de texto suelto». Como píldoras, con su fondo y su hueco regular, se\n   leen de un vistazo (y las de autor, que son otro tipo de enlace, van con el color de acento). */\nhtml.hf .nav .line2,\nhtml.hf .nav .line3 {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 3px 4px;\n  background: transparent !important;\n  /* la web separa estas filas con un filo rosa claro (`#FFCCF2`): sobre el fondo oscuro brillaba */\n  border-color: var(--hf-line) !important;\n  padding: 6px 8px 5px;\n}\n\nhtml.hf .nav .line2 a,\nhtml.hf .nav .line3 a {\n  padding: 2px 9px !important;\n  margin: 0 !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: 999px !important;\n  background: var(--hf-bg3) !important;\n  font-size: 11.5px;\n  line-height: 1.6;\n  color: var(--hf-dim) !important;\n  text-decoration: none !important;\n}\n\nhtml.hf .nav .line2 a[href^=\"/author/\"],\nhtml.hf .nav .line3 a[href^=\"/author/\"] {\n  background: var(--hf-accent-soft) !important;\n  border-color: transparent !important;\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .nav .line2 a:hover,\nhtml.hf .nav .line3 a:hover {\n  background: var(--hf-accent-soft) !important;\n  border-color: var(--hf-accent) !important;\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .nav a.fav {\n  background: transparent !important;\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .nav a.fav:before {\n  filter: none;\n}\n\n/* el buscador */\nhtml.hf .navsearch {\n  margin: 0 6px 0 0 !important;\n  display: inline-flex;\n  align-items: center;\n}\n\nhtml.hf .navsearch .keyword {\n  width: 240px !important;\n  height: 32px !important;\n  padding: 0 12px !important;\n  border: 1px solid var(--hf-line2) !important;\n  border-right: none !important;\n  border-radius: var(--hf-radius-s) 0 0 var(--hf-radius-s) !important;\n  background: var(--hf-bg) !important;\n  background-image: none !important;\n  color: var(--hf-text) !important;\n  font-weight: 500 !important;\n  font-size: 13px;\n}\n\nhtml.hf .navsearch .keyword:focus {\n  outline: none;\n  border-color: var(--hf-accent) !important;\n}\n\nhtml.hf .navsearch .keyword::placeholder {\n  color: var(--hf-dim2);\n}\n\nhtml.hf .navsearch .submit {\n  width: auto !important;\n  height: 32px !important;\n  padding: 0 16px !important;\n  border: 1px solid var(--hf-accent) !important;\n  border-radius: 0 var(--hf-radius-s) var(--hf-radius-s) 0 !important;\n  background: var(--hf-accent) !important;\n  background-image: none !important;\n  color: #fff !important;\n  font-weight: 700 !important;\n  font-size: 12px !important;\n  letter-spacing: 0.06em;\n  cursor: pointer;\n}\n\nhtml.hf .navsearch .submit:hover {\n  filter: brightness(1.08);\n}\n\n/* ---------------------------------------------------------------------------------------------\n   4. TÍTULOS DE SECCIÓN Y MIGAS\n   --------------------------------------------------------------------------------------------- */\nhtml.hf .mtitle {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 10px;\n  margin: 14px 0 8px;\n  /* la web las pinta en rosa claro (`#FFE5F8`) a todo lo ancho: en la piel oscura, una franja\n     oscura con un filo de color */\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line) !important;\n  border-left: 3px solid var(--hf-accent) !important;\n  border-radius: var(--hf-radius-s) !important;\n  color: var(--hf-text) !important;\n  padding: 6px 12px !important;\n  height: auto !important;\n  line-height: 1.4 !important;\n  font-size: 13px !important;\n  font-weight: 700 !important;\n  letter-spacing: 0.04em;\n}\n\nhtml.hf .mtitle a {\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .dhead {\n  padding: 3px 0 3px 11px !important;\n  background: transparent !important;\n  color: var(--hf-text) !important;\n  border-left: 4px solid var(--hf-accent);\n  border-radius: 0 !important;\n  box-shadow: none !important;\n  font-weight: 800 !important;\n  font-size: 15px !important;\n  letter-spacing: 0.07em;\n  text-transform: uppercase;\n  display: inline-block;\n}\n\nhtml.hf h1.dhead {\n  font-size: 22px !important;\n  letter-spacing: 0.02em;\n  text-transform: none;\n}\n\nhtml.hf .gameinfo .dhead,\nhtml.hf .chesshead {\n  font-size: 12px !important;\n}\n\nhtml.hf .chead {\n  color: var(--hf-dim) !important;\n  font-size: 11px;\n  font-weight: 700;\n  letter-spacing: 0.06em;\n  padding: 4px 10px;\n  border: 1px solid var(--hf-line);\n  border-radius: 999px;\n  background: var(--hf-bg3);\n}\n\nhtml.hf .chead:hover {\n  color: var(--hf-accent) !important;\n  border-color: var(--hf-accent);\n}\n\nhtml.hf .location {\n  margin: 12px 0 6px;\n  color: var(--hf-dim) !important;\n  font-size: 12px;\n}\n\nhtml.hf .location a {\n  color: var(--hf-dim) !important;\n}\n\nhtml.hf .location a:hover {\n  color: var(--hf-accent) !important;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   5. LAS REJILLAS DE JUEGOS\n   --------------------------------------------------------------------------------------------- */\n@media (min-width: 1025px) {\n  /* La tarjeta de toda la vida: 152×200 fijos con una miniatura de 140. Ahora el ancho sale de\n     `--hf-card` (el panel) y la miniatura llena la tarjeta, así que la rejilla se recoloca sola. */\n  html.hf .gameboxlite {\n    width: var(--hf-card) !important;\n    height: auto !important;\n    margin: 5px 5px !important;\n    padding: 0 0 2px !important;\n    background: transparent !important;\n    text-align: center;\n    border-radius: var(--hf-radius);\n    overflow: hidden;\n    box-sizing: border-box;\n    transition: transform 0.12s ease, background 0.12s ease;\n  }\n\n  html.hf a.gameboxlite {\n    display: inline-block;\n    vertical-align: top;\n    float: left;\n  }\n\n  html.hf .gameboxlite:hover {\n    background: var(--hf-accent-soft) !important;\n    box-shadow: none !important;\n    transform: translateY(-2px);\n  }\n\n  html.hf .gameboxlite .thumb {\n    width: 100% !important;\n    height: auto !important;\n    aspect-ratio: 1 / 1;\n    object-fit: cover;\n    margin: 0 !important;\n    border: 1px solid var(--hf-line) !important;\n    border-radius: var(--hf-radius-s) !important;\n    background: var(--hf-bg3);\n    display: block !important;\n    float: none !important;\n  }\n\n  html.hf .gameboxlite:hover .thumb {\n    border-color: var(--hf-accent) !important;\n  }\n\n  html.hf .gameboxlite .title {\n    display: -webkit-box;\n    -webkit-line-clamp: 2;\n    -webkit-box-orient: vertical;\n    overflow: hidden;\n    height: 2.9em;\n    margin: 6px 4px 4px !important;\n    font-size: 12.5px;\n    font-weight: 600;\n    line-height: 1.45;\n    text-align: start;\n    color: var(--hf-text) !important;\n    word-break: break-word;\n  }\n\n  html.hf .gameboxlite:hover .title {\n    color: var(--hf-accent) !important;\n  }\n\n  /* el cuadro de arriba a la izquierda (contador y nota de la web) y el de rank de las listas */\n  html.hf .gameboxlite .top {\n    margin: 4px !important;\n    background: rgba(6, 8, 12, 0.72) !important;\n    border-radius: 999px !important;\n    padding: 2px 6px 0 !important;\n    z-index: 2;\n  }\n\n  /* Las tarjetas que la web pinta como ficha con texto al lado (favoritos, aleatorios). OJO: las\n     de rejilla llevan DOS clases (`gamebox gameboxlite`), así que hay que dejar fuera a las de\n     rejilla — si no, estas reglas (que vienen después) le pisaban la miniatura de 112 px y el\n     margen a las tarjetas de la portada y de /all/. */\n  html.hf .gamebox:not(.gameboxlite) {\n    background: var(--hf-bg3) !important;\n    border: 1px solid var(--hf-line) !important;\n    border-radius: var(--hf-radius) !important;\n    padding: 8px 10px 8px 0 !important;\n    margin: 6px 0 !important;\n    box-sizing: border-box;\n  }\n\n  html.hf .gamebox:not(.gameboxlite):hover {\n    border-color: var(--hf-accent) !important;\n    box-shadow: var(--hf-shadow) !important;\n  }\n\n  html.hf .gamebox:not(.gameboxlite) .thumb {\n    width: 112px !important;\n    height: 112px !important;\n    margin: 0 12px 0 8px !important;\n    border: 1px solid var(--hf-line) !important;\n    border-radius: var(--hf-radius-s) !important;\n    object-fit: cover;\n  }\n\n  html.hf .gamebox:not(.gameboxlite) .title {\n    color: var(--hf-text) !important;\n    font-size: 15px;\n  }\n\n  html.hf .gamebox:not(.gameboxlite):hover .title {\n    color: var(--hf-accent) !important;\n  }\n\n  html.hf .gamebox:not(.gameboxlite) .desc {\n    background: transparent !important;\n    color: var(--hf-dim) !important;\n    font-size: 12px;\n  }\n\n  html.hf .gamebox:not(.gameboxlite) .no {\n    color: var(--hf-dim) !important;\n  }\n\n  html.hf .gamebox:not(.gameboxlite):hover .no {\n    color: var(--hf-accent) !important;\n  }\n\n  /* ---------------------------------------------------------------------------------------\n     LA REJILLA DE VERDAD\n     ---------------------------------------------------------------------------------------\n     `grid.js` marca con `hf-grid` los contenedores que son una lista de tarjetas (portada,\n     /all/, etiquetas, búsqueda, favoritos). Dentro, todo ocupa la fila entera (títulos, la\n     paginación, `clear`) menos las tarjetas y el hueco de anuncio que la web mete en medio, que\n     son una celda cada uno. Las columnas salen solas del ancho disponible, así que nunca queda\n     un hueco a la derecha ni una fila descuadrada. */\n  html.hf .hf-grid {\n    display: grid;\n    grid-template-columns: repeat(auto-fill, minmax(var(--hf-card), 1fr));\n    gap: 10px;\n    align-items: start;\n    justify-items: stretch;\n  }\n\n  html.hf .hf-grid > * {\n    grid-column: 1 / -1;\n    min-width: 0;\n  }\n\n  html.hf .hf-grid > a.gameboxlite {\n    grid-column: auto;\n    width: auto !important;\n    height: auto !important;\n    margin: 0 !important;\n    float: none !important;\n  }\n\n  /* el hueco del anuncio nativo de la lista (`#randomzone1`) es una celda más: se centra en su\n     columna y en su fila (la web lo deja de 152 px de ancho con una creatividad de 150) y se le\n     pone el mismo borde suave que a las tarjetas, para que se lea como una pieza de la rejilla y\n     no como un agujero. El anuncio no se toca: se carga igual y se ve igual. */\n  html.hf .hf-grid > #randomzone1,\n  html.hf .hf-grid > #randomzone2 {\n    grid-column: auto;\n    justify-self: center;\n    align-self: center;\n    background: var(--hf-bg3);\n    border: 1px solid var(--hf-line);\n    border-radius: var(--hf-radius);\n  }\n\n  /* Los listados de etiqueta y de autor usan otra tarjeta (`.gameboxmain2`, 300×130, con `float`):\n     tres por fila y a la derecha sobraba un pasillo. En rejilla, las columnas se reparten el\n     ancho real de la columna izquierda y quedan igualadas. */\n  html.hf .hf-grid-main {\n    display: grid;\n    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n    gap: 12px;\n    align-items: start;\n  }\n\n  html.hf .hf-grid-main > * {\n    grid-column: 1 / -1;\n    min-width: 0;\n  }\n\n  html.hf .hf-grid-main > a.gameboxmain2 {\n    grid-column: auto;\n    width: auto !important;\n    float: none !important;\n    margin: 0 !important;\n  }\n\n  /* `/hot/` y `/top/` (100 puestos): la web los pinta a todo lo ancho —un número de 3em en cursiva\n     a la izquierda, la miniatura, el texto y media fila de nada a la derecha—. En la rejilla son\n     tarjetas como las de los listados de etiqueta, y el puesto pasa a ser una insignia en la\n     esquina de la miniatura. La descripción se corta a tres renglones (la web ya la trae cortada\n     con puntos suspensivos, así que aquí no se pierde nada que no estuviera perdido antes). */\n  html.hf .hf-grid-main > a.gameboxmain {\n    position: relative;\n    grid-column: auto;\n    width: auto !important;\n    float: none !important;\n    margin: 0 !important;\n  }\n\n  html.hf .gameboxmain .no {\n    position: absolute;\n    top: 8px;\n    left: 8px;\n    z-index: 2;\n    min-width: 24px;\n    margin: 0 !important;\n    padding: 1px 6px !important;\n    border: 1px solid var(--hf-line) !important;\n    border-radius: var(--hf-radius-s) !important;\n    background: rgba(6, 8, 12, 0.72) !important;\n    color: var(--hf-accent) !important;\n    font-size: 12px !important;\n    font-style: normal !important;\n    font-weight: 700 !important;\n    line-height: 1.5;\n    text-align: center;\n  }\n\n  html.hf .gameboxmain:hover .no {\n    border-color: var(--hf-accent) !important;\n    background: var(--hf-accent) !important;\n    color: #fff !important;\n  }\n\n  html.hf .hf-grid-main > a.gameboxmain .desc {\n    display: -webkit-box;\n    -webkit-line-clamp: 3;\n    -webkit-box-orient: vertical;\n    overflow: hidden;\n  }}\n\nhtml.hf .gameboxlite .nw,\nhtml.hf .gamebox .nw {\n  opacity: 0.45;\n}\n\nhtml.hf .gameboxlite:hover .nw {\n  opacity: 0.9;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   6. LA FICHA DE JUEGO: NUESTRO MARCO\n   --------------------------------------------------------------------------------------------- */\nhtml.hf .hf-stage {\n  position: relative !important;\n  margin: 10px 0 0;\n  /* la web le pone un fondo blanco con una rejilla (`#gamecontainer`), y con el juego dentro se\n     colaba por los bordes: en la piel oscura el marco es negro */\n  background: #05070b !important;\n  border: 1px solid var(--hf-line);\n  border-radius: var(--hf-radius);\n  box-shadow: var(--hf-shadow);\n  overflow: hidden;\n  min-height: 280px;\n  /* El marco es una columna: la barra del reproductor arriba, en su propia franja, y el juego\n     centrado en lo que queda (así la barra no tapa nada del juego). */\n  display: flex;\n  flex-direction: column;\n  align-items: stretch;\n  justify-content: flex-start;\n}\n\n@media (min-width: 1025px) {\n  html.hf .hf-stage {\n    height: var(--hf-stage-h, 520px) !important;\n  }\n}\n\n/* El juego, dentro del marco. La web le pone el tamaño en los atributos `width`/`height` (es lo\n   que lee su controlador) y Ruffle lo pisa con `width:100%;height:100%` en línea, así que aquí\n   manda lo que calcula `fit()` en `--hf-game-w/h` — la caja más grande con la proporción REAL del\n   juego que cabe en el marco. Sin esas variables (por ejemplo si el juego aún no tiene medidas) se\n   deja el 100% de Ruffle. */\nhtml.hf .hf-stage #embedswf {\n  margin: 0 !important;\n  flex: 0 0 auto;\n  align-self: center;\n  max-width: 100%;\n  max-height: 100%;\n  width: var(--hf-game-w, 100%) !important;\n  height: var(--hf-game-h, 100%) !important;\n}\n\n/* La barra de debajo del reproductor (la web la usa para la nota, el «por defecto» y poco más).\n   Ojo al `height`: la web la clava en `24px` con la fila de 970 px de ancho, pero con la maquetación\n   fluida y los botones de la piel hay más de una línea: todo lo que no cupiera en la primera caía\n   **fuera de la caja** de la barra (sin fondo ni borde), que es lo que dejaba al botón de descarga\n   suelto por debajo. Con `auto` la barra mide lo que mide su contenido. */\nhtml.hf .playerctrl {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 4px;\n  height: auto !important;\n  padding: 6px 8px !important;\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line);\n  border-top: none;\n  border-radius: 0 0 var(--hf-radius) var(--hf-radius);\n  font-size: 12px;\n  color: var(--hf-dim) !important;\n}\n\nhtml.hf .playerctrl .button1,\nhtml.hf .playerctrl .button3 {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 5px 7px !important;\n  border-radius: var(--hf-radius-s);\n  cursor: pointer;\n  color: var(--hf-dim) !important;\n  vertical-align: middle;\n}\n\n/* `.button2` no es un botón: es el **grupo** que envuelve a los suyos (el menú de RESIZE con sus\n   zoom, el de PLUGIN…). Con el relleno de botón se hinchaba (41 px de alto frente a los 26 de los\n   demás) y la barra entera crecía con él; sin él, el relleno lo llevan sus hijos, que ya lo tienen. */\nhtml.hf .playerctrl .button2 {\n  display: inline-flex;\n  align-items: center;\n  gap: 0;\n  padding: 0 !important;\n  cursor: pointer;\n  color: var(--hf-dim) !important;\n  vertical-align: middle;\n}\n\n/* La descarga (`#icon_download`: el icono con su «Download» que crea el propio reproductor de la\n   web) es el **último control** de la barra: se queda al final de la fila y, si en una ventana\n   estrecha no cabe junto a los demás, cae al final de la línea de abajo en vez de quedarse sola a\n   la izquierda, que es lo que pasaba cuando no cabía en la única línea que había. */\nhtml.hf .playerctrl .download {\n  margin-left: auto !important;\n  height: 16px;\n  display: inline-flex;\n  align-items: center;\n  cursor: pointer;\n}\n\nhtml.hf .playerctrl .button1:hover,\nhtml.hf .playerctrl .button2:hover,\nhtml.hf .playerctrl .button3:hover {\n  background: var(--hf-accent-soft) !important;\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .playerctrl .process {\n  position: relative !important;\n  background: var(--hf-bg) !important;\n  border-color: var(--hf-line) !important;\n}\n\n/* La zona de clic de la barra de progreso (`.process_overlay`). La web la pone `absolute` y sin\n   coordenadas, así que cae en su «sitio natural» del flujo; con la barra de controles en `flex`\n   (arriba) ese sitio es el **principio de la fila**, o sea encima de los créditos del reproductor\n   (`run by Ruffle` y el enlace rojo `[2024 Flash Solutions]`), y al pintarla con el fondo de la piel\n   se veía como una caja oscura de 200x20 sobre ellos. Aquí vuelve a ser lo que era: **invisible** y\n   del tamaño justo de la barra de progreso, que es donde tiene que recoger el clic para buscar en el\n   vídeo (el resto lo coloca `seek()`, en `skin.js`, metiéndola dentro de `.process`). */\nhtml.hf .playerctrl .process_overlay {\n  position: absolute !important;\n  left: 0 !important;\n  top: 0 !important;\n  width: 100% !important;\n  height: 100% !important;\n  margin: 0 !important;\n  background: transparent !important;\n  border: 0 !important;\n  z-index: 100 !important;\n}\n\nhtml.hf .playerctrl .submenu {\n  background: var(--hf-bg2) !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  box-shadow: var(--hf-shadow);\n  padding: 4px !important;\n}\n\nhtml.hf .playerctrl .submenu span {\n  color: var(--hf-dim) !important;\n}\n\nhtml.hf .playerctrl .submenu span:hover {\n  background: var(--hf-accent-soft) !important;\n  color: var(--hf-accent) !important;\n}\n\n/* la barra nuestra: la franja de arriba del marco, dentro del flujo (no tapa el juego) */\nhtml.hf .hf-bar {\n  position: static;\n  order: -1;\n  flex: 0 0 auto;\n  z-index: 5;\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 6px;\n  padding: 6px 8px;\n  background: var(--hf-bg3);\n  border-bottom: 1px solid var(--hf-line);\n  pointer-events: none;\n}\n\nhtml.hf .hf-bar > * {\n  pointer-events: auto;\n}\n\nhtml.hf .hf-btn {\n  padding: 6px 11px;\n  border: 1px solid var(--hf-line2);\n  border-radius: 999px;\n  background: var(--hf-bg2);\n  color: var(--hf-text);\n  font: 600 12px system-ui, -apple-system, \"Segoe UI\", Roboto, Arial, sans-serif;\n  cursor: pointer;\n  backdrop-filter: blur(4px);\n}\n\nhtml.hf .hf-btn:hover {\n  border-color: var(--hf-accent);\n  color: var(--hf-accent);\n}\n\nhtml.hf .hf-btn-play {\n  background: var(--hf-accent);\n  border-color: var(--hf-accent);\n  color: #fff !important;\n}\n\nhtml.hf .hf-btn-play:hover {\n  filter: brightness(1.1);\n  color: #fff !important;\n}\n\nhtml.hf .hf-note {\n  margin-left: auto;\n  padding: 5px 11px;\n  border-radius: 999px;\n  background: var(--hf-bg2);\n  color: var(--hf-dim);\n  font-size: 12px;\n  backdrop-filter: blur(4px);\n}\n\nhtml.hf .hf-note--ok {\n  color: var(--hf-ok);\n}\n\nhtml.hf .hf-note--bad {\n  color: var(--hf-bad);\n}\n\n/* En pantalla completa el marco manda: el juego se ajusta a la ventana y la barra se queda arriba. */\nhtml.hf .hf-stage:fullscreen {\n  height: 100vh !important;\n  border: none;\n  border-radius: 0;\n  margin: 0;\n}\n\nhtml.hf .hf-stage:fullscreen #gamecontainer {\n  height: 100% !important;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   7. EL CONTROLADOR DE LA WEB Y LAS CAJAS DE ARRANQUE\n   --------------------------------------------------------------------------------------------- */\n/* Las dos cajas de «CLICK TO PLAY» (la del HFlashPlayer, que es un .exe para Windows, y la de\n   Ruffle) ocupan el sitio del juego. Si el juego arranca solo, sobran; si no arranca, se quedan\n   (bloque 12 las vuelve a enseñar). */\nhtml.hf.hf-autoplay .quickrun {\n  display: none !important;\n}\n\nhtml.hf.hf-autoplay.hf-show-fallbacks .quickrun {\n  display: block !important;\n}\n\nhtml.hf .quickrun {\n  position: absolute !important;\n  z-index: 4;\n  background: rgba(10, 13, 19, 0.9) !important;\n  border: 1px solid var(--hf-line2) !important;\n  border-radius: var(--hf-radius) !important;\n  color: var(--hf-text) !important;\n  padding: 12px 14px !important;\n  box-shadow: var(--hf-shadow);\n  top: 72px !important;\n  left: 50% !important;\n  transform: translateX(-50%);\n  width: 260px !important;\n  height: auto !important;\n}\n\nhtml.hf .quickrun .name {\n  font-weight: 700;\n}\n\n/* Cuando las cajas vuelven (el juego no arranca solo) salen las dos, y tal cual se pisarían: la\n   del HFlashPlayer a la izquierda y la de Ruffle a la derecha, las dos dentro del marco. */\nhtml.hf.hf-show-fallbacks .quickrun {\n  top: 88px !important;\n}\n\nhtml.hf #quickrun_hfplayer {\n  left: 27% !important;\n}\n\nhtml.hf #quickrun_ruffle {\n  left: 73% !important;\n}\n\nhtml.hf .quickrun .hint {\n  color: var(--hf-dim);\n  font-size: 11px;\n}\n\n/* la cruz de cerrar de la web va colocada con un `margin` de 300 px (para su caja de 600): aquí se\n   ancla en la esquina de la caja */\nhtml.hf .quickrun .close {\n  position: absolute;\n  top: 8px;\n  right: 10px;\n  margin: 0 !important;\n  width: 14px;\n  height: 14px;\n  z-index: 2;\n}\n\nhtml.hf .quickrun .button {\n  display: inline-block;\n  margin-top: 8px;\n  padding: 7px 14px;\n  border-radius: 999px;\n  background: var(--hf-accent);\n  color: #fff !important;\n  font-size: 11px;\n  font-weight: 800;\n  letter-spacing: 0.08em;\n}\n\nhtml.hf .quickrun .more a {\n  color: var(--hf-dim) !important;\n  font-size: 11px;\n}\n\nhtml.hf .quickrun .more a:hover {\n  color: var(--hf-accent) !important;\n}\n\n/* el «cargando…» de la web (miniatura + porcentaje) */\nhtml.hf .loadprocess {\n  background: rgba(10, 13, 19, 0.86) !important;\n  border: none !important;\n  color: var(--hf-text) !important;\n}\n\nhtml.hf.hf-autoplay .loadprocess .status {\n  color: var(--hf-dim);\n}\n\n/* …y en cuanto el juego está listo, fuera. Esa caja (la miniatura del juego, el icono y el\n   porcentaje) sirve mientras el `.swf` baja, pero luego no aporta nada y encima le come sitio al\n   juego. `player.js` pone `hf-playing` en <html> al llegar a «Listo» —no al pulsar ▶ Jugar: durante\n   la descarga es lo único que hay que mirar— y lo quita si hay que arrancar de nuevo (▶ Jugar,\n   recargar, cambiar de emulador), que es cuando la caja tiene que volver. La caja mide 0×0 (su\n   contenido es `absolute`), así que no se mueve nada al quitarla. Va sin el prefijo `html.hf` a\n   propósito: es cosa del reproductor, no de la piel, y así funciona también con «Como la web».\n   Y sin transición, a propósito: la desaparición (y la vuelta) tienen que ser de fiar y no depender\n   de que la pestaña esté delante, que un fundido con la pestaña de fondo se queda a medias. */\nhtml.hf-playing .loadprocess {\n  transition: none !important;\n  opacity: 0 !important;\n  visibility: hidden !important;\n  pointer-events: none !important;\n}\n/* ---------------------------------------------------------------------------------------------\n   8. LA INFORMACIÓN DEL JUEGO, ETIQUETAS Y RELACIONADAS\n   --------------------------------------------------------------------------------------------- */\nhtml.hf .gameinfo {\n  margin-top: 14px;\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line);\n  border-radius: var(--hf-radius);\n  padding: 14px 16px !important;\n  color: var(--hf-text) !important;\n}\n\nhtml.hf .gameinfo .infotable {\n  width: 100%;\n  border-collapse: collapse;\n}\n\nhtml.hf .gameinfo .infotable th {\n  width: 150px;\n  padding: 7px 10px 7px 0;\n  color: var(--hf-dim) !important;\n  font-weight: 600;\n  font-size: 12px;\n  text-align: start;\n  vertical-align: top;\n  border-top: 1px solid var(--hf-line);\n}\n\nhtml.hf .gameinfo .infotable td {\n  padding: 7px 0;\n  color: var(--hf-text) !important;\n  font-size: 13px;\n  vertical-align: top;\n  border-top: 1px solid var(--hf-line);\n  /* con el ratón encima la web pone la celda en blanco (`td:hover`), que sobre el fondo oscuro da\n     un fogonazo: aquí se le da el tono de acento, mucho más suave */\n  background: transparent !important;\n}\n\nhtml.hf .gameinfo .infotable td:hover {\n  background: var(--hf-accent-soft) !important;\n}\n\nhtml.hf .gameinfo .infotable tr:first-child th,\nhtml.hf .gameinfo .infotable tr:first-child td {\n  border-top: none;\n}\n\nhtml.hf .gameinfo a {\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .gameinfo .link {\n  color: var(--hf-dim) !important;\n  font-size: 12px;\n  word-break: break-all;\n}\n\nhtml.hf .gameinfo .link:hover {\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .gameinfo .origdesc,\nhtml.hf .gameinfo .transfield {\n  color: var(--hf-dim) !important;\n  font-size: 13px;\n  line-height: 1.65;\n}\n\nhtml.hf .gameinfo .origdesc_btn,\nhtml.hf .gameinfo .items .btn {\n  display: inline-block;\n  margin-top: 6px;\n  padding: 5px 12px;\n  border: 1px solid var(--hf-line2);\n  border-radius: 999px;\n  color: var(--hf-dim) !important;\n  font-size: 11px;\n  font-weight: 700;\n  letter-spacing: 0.05em;\n  cursor: pointer;\n}\n\nhtml.hf .gameinfo .origdesc_btn:hover,\nhtml.hf .gameinfo .items .btn:hover {\n  border-color: var(--hf-accent);\n  color: var(--hf-accent) !important;\n}\n\n/* las etiquetas (fichas del juego y de las tarjetas) */\nhtml.hf .tag {\n  display: inline-block;\n  margin: 2px 4px 2px 0 !important;\n  padding: 3px 10px !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: 999px !important;\n  background: var(--hf-bg2) !important;\n  color: var(--hf-dim) !important;\n  font-size: 11px !important;\n  line-height: 1.6;\n}\n\nhtml.hf .tag:hover {\n  border-color: var(--hf-accent) !important;\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .tag .nw {\n  opacity: 0.5;\n}\n\nhtml.hf .icon.soundwarning {\n  color: var(--hf-bad) !important;\n  cursor: pointer;\n  font-size: 11px;\n  font-weight: 700;\n}\n\nhtml.hf .fav,\nhtml.hf .favorite {\n  color: var(--hf-accent) !important;\n}\n\n/* la columna de la derecha: relacionadas + el hueco de publicidad */\nhtml.hf #pageright_title .dhead {\n  margin-bottom: 6px;\n}\n\nhtml.hf .gameboxright {\n  display: block !important;\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius) !important;\n  padding: 8px !important;\n  margin: 8px 0 !important;\n  min-height: 0 !important;\n  box-sizing: border-box;\n}\n\nhtml.hf .gameboxright:hover {\n  border-color: var(--hf-accent) !important;\n}\n\nhtml.hf .gameboxright .thumb {\n  width: 72px !important;\n  height: 72px !important;\n  float: left !important;\n  margin: 0 10px 0 0 !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  object-fit: cover;\n}\n\n/* las miniaturas son imágenes claras (y mientras cargan, o si no cargan, se veían como cuadros\n   blancos sueltos por toda la página): fondo del tono de la piel */\nhtml.hf img.thumb,\nhtml.hf .thumb,\nhtml.hf .gamebox .thumb,\nhtml.hf .gameboxright .thumb,\nhtml.hf .gameboxlite .thumb {\n  background: var(--hf-bg2) !important;\n}\n\nhtml.hf .gameboxright .title {\n  margin: 0 0 4px !important;\n  color: var(--hf-text) !important;\n  font-size: 13px;\n  font-weight: 600;\n  line-height: 1.3;\n}\n\nhtml.hf .gameboxright:hover .title {\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .gameboxright .tags {\n  display: block !important;\n  max-width: none !important;\n  clear: both;\n  padding-top: 4px;\n}\n\nhtml.hf .gameboxright .tags .tag {\n  font-size: 10px !important;\n  padding: 2px 7px !important;\n}\n\nhtml.hf .gameboxright .authoricon {\n  width: 20px !important;\n  height: 20px !important;\n  border-radius: 999px;\n  vertical-align: middle;\n}\n\nhtml.hf #rightzone iframe {\n  border-radius: var(--hf-radius);\n  overflow: hidden;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   7b. EL CUADRADO DE LA COLUMNA, AL LADO DEL BANNER (ficha de juego)\n   ---------------------------------------------------------------------------------------------\n   `skin.js` (`layoutAds()`) saca el hueco de anuncio de la columna derecha de la ficha de juego\n   (`#rightzone`: un 300x250 que la web mete entre el título «Related» y la lista de juegos) y lo\n   sube al lado del banner de la cabecera, que se estrecha para dejarle sitio: la columna se queda\n   solo con los juegos. Aquí está lo que no depende de las medidas —fuera del flujo y su sombra—;\n   `left`, `top` y el alto que hay que bajar la columna los pone el JS en línea, que es lo único\n   que se sabe al medir. El anuncio no se toca: se carga igual, en el mismo hueco, en otro sitio.\n   (Va sin el prefijo `html.hf` a propósito: es cosa de la maquetación, no de la piel, y así\n   funciona también con «Como la web».) */\n@media (min-width: 1025px) {\n  html.hf-ads-side #rightzone {\n    position: absolute !important;\n    margin: 0 !important;\n    width: 300px;\n    /* el anuncio se escala, así que su caja de maquetación (300x250) es más grande que el hueco:\n       sin esto, esa parte que no se ve alargaría el ancho desplazable de la página */\n    overflow: hidden;\n    z-index: 4;\n  }\n  html.hf-ads-side #rightzone iframe {\n    box-shadow: var(--hf-shadow);\n  }\n}\n\n/* ---------------------------------------------------------------------------------------------\n   8b. LA COLUMNA DERECHA DE LOS LISTADOS (etiquetas, autores, TOP/HOT)\n   ---------------------------------------------------------------------------------------------\n   Son las cajas y las fichas de `.rightbox`/`pageright`. Vienen de fábrica en rosa claro\n   (`#FFE5FF`), con la insignia del puesto en blanco (`#FFF` con el número amarillo) y —lo peor—\n   con el ratón encima la ficha se pone AMARILLA entera (`#FFCC00`) y su descripción reaparece en\n   un amarillo pálido. Nada de eso se ve en una foto de la página: son estados `:hover`, así que\n   hay que repintarlos a mano. */\nhtml.hf .rightbox {\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius) !important;\n  overflow: hidden;\n}\n\nhtml.hf .rightbox .boxtitle {\n  background: var(--hf-bg2) !important;\n  border-bottom: 1px solid var(--hf-line);\n  color: var(--hf-text) !important;\n  padding: 0 10px !important;\n  letter-spacing: 0.04em;\n}\n\nhtml.hf .gamebox.gameboxright2,\nhtml.hf .gamebox.gameboxtop2 {\n  background: var(--hf-bg2) !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  overflow: hidden;\n}\n\nhtml.hf .gamebox.gameboxright2:hover,\nhtml.hf .gamebox.gameboxtop2:hover {\n  background: var(--hf-accent-soft) !important;\n  border-color: var(--hf-accent) !important;\n}\n\nhtml.hf .gamebox.gameboxright2 .no,\nhtml.hf .gamebox.gameboxtop2 .no {\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  background: var(--hf-bg3) !important;\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .gamebox.gameboxright2:hover .no,\nhtml.hf .gamebox.gameboxtop2:hover .no {\n  border-color: var(--hf-accent) !important;\n  background: var(--hf-accent) !important;\n  color: #fff !important;\n}\n\nhtml.hf .gamebox.gameboxright2 .desc,\nhtml.hf .gamebox.gameboxtop2 .desc {\n  background: transparent !important;\n  color: var(--hf-dim) !important;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   9. LISTAS, PAGINACIÓN Y FORMULARIOS\n   --------------------------------------------------------------------------------------------- */\n/* Los resultados del buscador (`/search/`) usan una maqueta que no se parece a ninguna otra: una\n   lista de filas con la miniatura a la izquierda y, a la derecha, título, autor, etiquetas,\n   descripción y la ruta. La web las deja casi sin pintar (una línea de puntos gris claro y la ruta\n   en azul) y con `float`; aquí cada resultado es una ficha con su borde, y el color de la ruta\n   pasa a ser discreto, que el azul chillón sobre el fondo oscuro no hay quien lo lea. */\nhtml.hf .searchresult .row {\n  margin: 0 0 10px !important;\n  padding: 12px 14px !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius) !important;\n  background: var(--hf-bg3) !important;\n}\n\nhtml.hf .searchresult .row:hover {\n  border-color: var(--hf-accent) !important;\n}\n\nhtml.hf .searchresult .row::after {\n  content: \"\";\n  display: block;\n  clear: both;\n}\n\nhtml.hf .searchresult .thumb {\n  float: left !important;\n  width: 120px !important;\n  height: 120px !important;\n  margin: 0 14px 6px 0 !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  object-fit: cover;\n}\n\nhtml.hf .searchresult .title {\n  display: block;\n  margin: 0 0 3px !important;\n  color: var(--hf-text) !important;\n  font-size: 16px;\n  font-weight: 700;\n}\n\nhtml.hf .searchresult .row:hover .title {\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .searchresult .author {\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .searchresult .tags,\nhtml.hf .searchresult .desc {\n  display: block;\n  margin: 5px 0 0;\n  color: var(--hf-dim) !important;\n  font-size: 12.5px;\n}\n\nhtml.hf .searchresult .url {\n  display: block;\n  margin: 6px 0 0 !important;\n  color: var(--hf-dim2) !important;\n  font-size: 11px;\n  text-decoration: none !important;\n}\n/* Los resultados, en dos columnas (lo pidió el usuario). A todo lo ancho, cada ficha dejaba media\n   fila vacía a la derecha del texto: la miniatura y el título ocupan 500 px de los 1.378 que hay.\n   Con `grid` cada resultado es una casilla de media fila —los dos primeros, uno al lado del otro—\n   y las filas de arriba y abajo quedan alineadas; `align-items:start` deja que cada ficha tenga\n   su alto (los textos son de largo distinto) sin estirar la vecina. Solo en PC: por debajo de\n   1.025 px manda `mobile.css` del sitio, que ya los pone a una columna. */\n@media (min-width: 1025px) {\n  html.hf .searchresult {\n    display: grid !important;\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n    gap: 10px;\n    align-items: start;\n  }\n  html.hf .searchresult .row {\n    margin: 0 !important;\n  }\n}\n/* Los sombreados «2px 2px #ccc» de la web son de su estética de 2005: sobre el fondo oscuro\n   parecían una segunda copia fantasma de cada título y de cada tarjeta. Aquí sobra todo eso: el\n   relieve lo dan los bordes y el color de acento. */\nhtml.hf .dhead,\nhtml.hf .chead,\nhtml.hf .nav,\nhtml.hf .pagelink a,\nhtml.hf .pagelink a:hover,\nhtml.hf .tagslist a:hover,\nhtml.hf .authorlist a:hover,\nhtml.hf .gamebox:hover,\nhtml.hf .gameboxlite:hover,\nhtml.hf .gameboxmain:hover,\nhtml.hf .gameboxmain2:hover,\nhtml.hf .gameboxright:hover,\nhtml.hf .gameboxright2:hover {\n  box-shadow: none !important;\n}\n\nhtml.hf .pagelink {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 5px;\n  margin: 18px 0 6px;\n  font-size: 12px;\n}\n\nhtml.hf .pagelink .stat {\n  margin-right: 10px;\n  color: var(--hf-dim) !important;\n}\n\nhtml.hf .pagelink a,\nhtml.hf .pagelink .currentpage {\n  display: inline-block;\n  min-width: 30px;\n  padding: 5px 9px !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  background: var(--hf-bg3) !important;\n  color: var(--hf-dim) !important;\n  text-align: center;\n  text-decoration: none !important;\n}\n\nhtml.hf .pagelink a:hover {\n  border-color: var(--hf-accent) !important;\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .pagelink .currentpage {\n  background: var(--hf-accent) !important;\n  border-color: var(--hf-accent) !important;\n  color: #fff !important;\n  font-weight: 700;\n}\n\nhtml.hf .pagelink .more {\n  color: var(--hf-dim2) !important;\n}\n\nhtml.hf .gameboxlink {\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  color: var(--hf-text) !important;\n  padding: 4px 10px !important;\n}\n\nhtml.hf .gameboxlink:hover {\n  border-color: var(--hf-accent) !important;\n  background: var(--hf-accent-soft) !important;\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .gameboxlink.current {\n  background: var(--hf-accent-soft) !important;\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .info,\nhtml.hf .info2,\nhtml.hf .info3 {\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  color: var(--hf-dim) !important;\n  padding: 8px 12px !important;\n  margin: 10px 0 !important;\n}\n\nhtml.hf .info a,\nhtml.hf .info2 a,\nhtml.hf .info3 a {\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .hf-list .thumblist,\nhtml.hf .thumblist {\n  min-height: 0 !important;\n}\n\n/* comentarios (los sirve comment.js de la web) */\nhtml.hf .comment {\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius) !important;\n  padding: 10px !important;\n  margin: 8px 0 !important;\n}\n\n/* El cajón de los comentarios y la barra de «jugado/valorado»: en la web son cajas de rosa claro\n   (`#FFE5F8`, `#FFE5FF`) y en la piel oscura cantaban como un parche (además de quedar grandes y\n   vacías mientras no cargan los comentarios). */\nhtml.hf .commentfield,\nhtml.hf .rankinfo {\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius) !important;\n  color: var(--hf-dim) !important;\n  padding: 12px 14px !important;\n}\n\nhtml.hf .rankinfo {\n  padding: 6px 12px !important;\n  margin: 8px 0 !important;\n  font-size: 12px;\n}\n\nhtml.hf .commentfield .commentlist,\nhtml.hf .commentform {\n  color: var(--hf-dim) !important;\n}\n\nhtml.hf .commentform .name,\nhtml.hf .commentform .text {\n  color: var(--hf-dim) !important;\n}\n\nhtml.hf .comment .text,\nhtml.hf .comment .name,\nhtml.hf .comment .date {\n  color: var(--hf-text) !important;\n}\n\nhtml.hf .comment .name {\n  font-weight: 700;\n}\n\nhtml.hf .comment .date {\n  color: var(--hf-dim2) !important;\n  font-size: 11px;\n}\n\n/* los estados `:hover` de la web (el comentario y su lista de respuestas se ponen en blanco, y el\n   selector de emojis con su borde gris claro) */\nhtml.hf .comment:hover,\nhtml.hf .comment .replylist,\nhtml.hf .comment .replylist:hover {\n  background: var(--hf-bg3) !important;\n}\n\nhtml.hf .commentform .emoji .list,\nhtml.hf .commentform .emoji .active {\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  background: var(--hf-bg2) !important;\n}\n\nhtml.hf .commentform .emoji .list:hover {\n  border-color: var(--hf-accent) !important;\n}\n\n/* Ojo con `input:not([type])`: la web tiene campos sin atributo `type` (el de la URL del formulario\n   de contacto, `<input name=\"url\" class=\"w400\">`), y a ésos no los cogía ninguna de las reglas de\n   abajo —el navegador los trata como `text`, pero el selector de atributo no casa, porque el\n   atributo no está—, así que se quedaban con el **fondo blanco del navegador** y el texto claro de\n   la piel: ilegibles. */\nhtml.hf textarea,\nhtml.hf input:not([type]),\nhtml.hf input[type=\"text\"],\nhtml.hf input[type=\"password\"],\nhtml.hf input[type=\"email\"],\nhtml.hf input[type=\"url\"],\nhtml.hf input[type=\"tel\"],\nhtml.hf input[type=\"search\"],\nhtml.hf select {\n  background: var(--hf-bg2) !important;\n  border: 1px solid var(--hf-line2) !important;\n  border-radius: var(--hf-radius-s) !important;\n  color: var(--hf-text) !important;\n  padding: 6px 10px !important;\n}\n\nhtml.hf select {\n  padding: 4px 8px !important;\n}\n\n/* los botones de envío que no son el del buscador de la cabecera (el del formulario de comentarios,\n   el del buscador de la página de resultados) vienen del navegador en gris claro (`#f0f0f0`) con\n   texto negro: en la piel oscura, un botón de color. El del buscador tiene su propia regla (más\n   específica) y no lo toca esta. */\nhtml.hf input.submit,\nhtml.hf input[type=\"submit\"],\nhtml.hf input[type=\"button\"] {\n  height: 32px !important;\n  padding: 0 16px !important;\n  border: 1px solid var(--hf-accent) !important;\n  border-radius: var(--hf-radius-s) !important;\n  background: var(--hf-accent) !important;\n  background-image: none !important;\n  color: #fff !important;\n  font-weight: 700 !important;\n  font-size: 12px !important;\n  letter-spacing: 0.06em;\n  cursor: pointer;\n}\n\nhtml.hf input.submit:hover,\nhtml.hf input[type=\"submit\"]:hover,\nhtml.hf input[type=\"button\"]:hover {\n  filter: brightness(1.08);\n}\n\n/* El «advanced filter» (`/list/`) es un formulario suelto: un campo con borde de puntos gris claro\n   y las etiquetas elegibles que van pintando su propio script (`.selected` en rosa claro con\n   texto negro). Aquí va con el tono de la piel y las elegidas con el color de acento. */\nhtml.hf .queryfield {\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius) !important;\n  background: var(--hf-bg3) !important;\n  color: var(--hf-dim) !important;\n}\n\nhtml.hf .tags .selected {\n  background: var(--hf-accent) !important;\n  color: #fff !important;\n}\n\nhtml.hf .tags .tag .opt:hover {\n  background: var(--hf-accent) !important;\n  color: #fff !important;\n}\n\n/* La página de AJUSTES de la web (`/tool/prefs/`) es un formulario tal cual sale del navegador: los\n   `fieldset` con su borde gris de siempre, los `legend` a caballo del borde, las pistas con el mismo\n   tamaño y el mismo brillo que el texto de verdad, y las casillas con la pintura del sistema\n   (blancas, en una piel oscura). Aquí queda como lo que es —una lista de ajustes—: cada bloque en su\n   caja, el título del ajuste con su raya, las pistas pequeñas y apagadas (que es lo que son) y las\n   casillas en el color de acento. La página entera es interfaz, así que va además traducida (ver\n   `lang.js`).\n   El `form` del selector es solo esta página («preform»): la web no usa `hint` dentro de un\n   formulario en ningún otro sitio, así no se toca el `.quickrun .hint` del reproductor, y el\n   `.utitle` de la página de búsqueda (que es la fila del título con su enlace, y lleva la raya rosa\n   de la web) se queda como estaba. */\nhtml.hf .pagebody form .utitle {\n  color: var(--hf-text) !important;\n  font-weight: 700 !important;\n  border-bottom: 1px solid var(--hf-line) !important;\n}\n\nhtml.hf .pagebody form .hint {\n  color: var(--hf-dim) !important;\n  font-size: 12px !important;\n  line-height: 1.5;\n  margin: 2px 0 4px;\n}\n\nhtml.hf .pagebody fieldset {\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius) !important;\n  background: var(--hf-bg2) !important;\n  margin: 10px 0 0 !important;\n  padding: 8px 12px 12px !important;\n}\n\nhtml.hf .pagebody legend {\n  color: var(--hf-dim2) !important;\n  font-size: 12px;\n  font-weight: 700;\n  letter-spacing: 0.06em;\n  padding: 0 6px;\n}\n\n/* Las casillas (solo las de la web: las del panel son `hf-sw` y tienen la suya, con el mismo\n   interruptor de siempre). */\nhtml.hf .pagebody input[type=\"checkbox\"] {\n  accent-color: var(--hf-accent);\n  width: 15px;\n  height: 15px;\n  margin: 0 7px 0 0;\n  vertical-align: -2px;\n}\n\n/* El botón de buscar etiquetas de los ajustes nace `disabled` (su script lo suelta al escribir): en\n   gris y sin el rosa de los botones, para que se note que todavía no hace nada. */\nhtml.hf input[type=\"button\"]:disabled,\nhtml.hf input[type=\"submit\"]:disabled {\n  opacity: 0.45;\n  cursor: default;\n}\n\n/* El enlace a la ayuda del reproductor que se pone al lado de su selector (`prefs.js`): pequeño, en\n   el color de acento apagado y sin gritar — está para el que duda, no para el que ya lo sabe. */\nhtml.hf .pagebody form .hf-prefs-help {\n  display: inline-block;\n  margin-left: 12px;\n  font-size: 12px;\n  color: var(--hf-accent-2) !important;\n  text-decoration: none !important;\n  border-bottom: 1px dotted currentColor;\n}\n\nhtml.hf .pagebody form .hf-prefs-help:hover {\n  color: var(--hf-accent) !important;\n}\n\n/* Y las etiquetas de esa página (las bloqueadas y las que salen al buscar, que su script pinta como\n   `<a class=\"tag\">`): las de la web son color crema con texto gris, de su estética de 2005; aquí\n   como fichas de la piel, y la que se puede quitar con su cruz. */\nhtml.hf .pagebody fieldset .tags .tag {\n  color: var(--hf-dim) !important;\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n}\n\nhtml.hf .pagebody fieldset .tags .tag:hover {\n  color: var(--hf-text) !important;\n  border-color: var(--hf-accent) !important;\n}\n\nhtml.hf .pagebody fieldset .tags .tag.blocked,\nhtml.hf .pagebody fieldset .tags .tag.hf-blocked {\n  color: var(--hf-text) !important;\n  background: var(--hf-accent-soft) !important;\n  border-color: var(--hf-accent) !important;\n  cursor: pointer;\n}\n\n/* Una etiqueta de los resultados que ya está bloqueada: se ve que lo está y que al tocarla se quita. */\nhtml.hf .pagebody fieldset .tags .tag.hf-blocked::after {\n  content: \" ✓\";\n  color: var(--hf-accent);\n}\n\n/* La barrita de la caja de las bloqueadas (`prefs.js`): cuántas hay y el botón de quitarlas todas. */\nhtml.hf .pagebody fieldset .hf-tags-bar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n  min-height: 22px;\n  margin: 2px 0 6px;\n}\n\nhtml.hf .pagebody fieldset .hf-tags-count {\n  color: var(--hf-dim2);\n  font-size: 12px;\n  letter-spacing: 0.04em;\n}\n\nhtml.hf .pagebody fieldset .hf-tags-clear {\n  padding: 2px 11px;\n  border: 1px solid var(--hf-line2);\n  border-radius: 999px;\n  background: transparent;\n  color: var(--hf-dim);\n  font-size: 11px;\n  font-weight: 700;\n  letter-spacing: 0.04em;\n  cursor: pointer;\n}\n\nhtml.hf .pagebody fieldset .hf-tags-clear:hover {\n  border-color: var(--hf-bad);\n  color: var(--hf-bad);\n}\n\nhtml.hf .pagebody fieldset .hf-tags-empty {\n  margin: 4px 0 0;\n  color: var(--hf-dim2);\n  font-size: 12px;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   10. EL PIE\n   --------------------------------------------------------------------------------------------- */\n/* El pie de la web es una fila de columnas **flotadas** (`float:left` y `.contact` en `float:right`)\n   dentro de una caja que no las envuelve: la caja se quedaba en 29 px de alto (sólo el relleno) y las\n   columnas se salían por debajo, colgando fuera del fondo con las esquinas redondeadas y todas\n   apiladas contra el borde izquierdo (el `float:right` del contacto, en cambio, se iba al extremo\n   opuesto: un hueco en medio de la nada). Aquí vuelve a ser lo que parece: una fila centrada que sí\n   envuelve a sus columnas. De paso, el pegote que el pie invadía por debajo es donde aterrizaba el\n   `<a>` invisible del anuncio (ver `shield.js`), así que al cuadrar la caja ese clic fantasma se va\n   con ella. */\nhtml.hf .pagefoot {\n  border-top: 1px solid var(--hf-line) !important;\n  color: var(--hf-dim2) !important;\n  font-size: 12px;\n  background: var(--hf-bg2) !important;\n  border-radius: var(--hf-radius) var(--hf-radius) 0 0;\n  display: flex !important;\n  flex-wrap: wrap;\n  justify-content: center;\n  align-items: flex-start;\n  gap: 12px clamp(18px, 3vw, 46px);\n  text-align: left;\n  overflow: visible;\n}\n\nhtml.hf .pagefoot > div {\n  float: none !important;\n  width: auto !important;\n  margin: 0 !important;\n  padding: 0 !important;\n}\n\n/* Los enlaces de las webs amigas (lo que la web llama `friendlinks`) son once y en español ocupan\n   más: en la misma fila que las otras cuatro columnas empujarían una de ellas a la fila de abajo\n   (y quedaría sola, que es lo que se veía torcido antes). Van en **su propia fila**, centrados como\n   un bloque de enlaces, y debajo las cuatro columnas cortas. Así el pie queda igual de ordenado a\n   cualquier ancho. */\nhtml.hf .pagefoot .friendlinks {\n  flex: 1 1 100%;\n  max-width: none;\n  text-align: center;\n}\n\nhtml.hf .pagefoot .friendlinks a {\n  display: inline-block;\n  margin: 3px 11px;\n  line-height: 1.6;\n}\n\n/* El copyright venía alineado a la derecha (`float:right` + `.fhead.right`), contra el borde del\n   otro extremo de la fila. Como una columna más, a la izquierda. */\nhtml.hf .pagefoot .fhead.right {\n  text-align: left !important;\n}\n\nhtml.hf .pagefoot .contact {\n  text-align: left;\n}\n\n/* La columna del idioma trae los `<a>` de cada idioma separados por un `<br>` suelto. Al esconder\n   los enlaces (los sustituye nuestro desplegable, ver `lang.js`) el salto se quedaba ahí y empujaba\n   el desplegable una línea hacia abajo: el `Español` caía más bajo que el `auto` de al lado. Fuera. */\nhtml.hf .pagefoot .language > br {\n  display: none !important;\n}\n\n/* El hueco de anuncio que la web pone al final del contenido (encima de los comentarios de la ficha:\n   `div[style=\"width:728px;height:110px\"]` con el `aclib` dentro) es una caja de ancho fijo pegada al\n   borde izquierdo de una columna que ahora mide más de mil píxeles: se quedaba torcida hacia la\n   izquierda. Centrada en su columna — el anuncio se carga y se cuenta igual, sólo cambia dónde\n   cae. */\nhtml.hf div[style*=\"width:728px\"]:not(iframe) {\n  margin-left: auto !important;\n  margin-right: auto !important;\n}\n\n/* Y el banner que las redes cuelgan del cuerpo al final de la página (ver `centerBanners` en\n   `skin.js`): misma idea, centrado en su fila. */\nhtml.hf .hf-banner {\n  display: block !important;\n  margin-left: auto !important;\n  margin-right: auto !important;\n}\n\n/* Y el hueco de anuncios de la cabecera (`#topzone`, debajo del menú de etiquetas) cuando no lo\n   rellena nadie: la web le reserva ~110 px y en las páginas cortas (el editor de partidas, los\n   ajustes, una página de texto) es lo primero que se ve, así que con la red caída —o un\n   bloqueador— queda un rectángulo vacío. `core.js` (`emptyZones`) mira si de verdad hay algo\n   pintado dentro y, si no lo hay, le pone `hf-ad-empty`: aquí se desploma y el contenido sube. No\n   se toca ningún `<iframe>`: si el anuncio llega y pinta, la marca se quita sola y el hueco\n   vuelve a estar. */\n/* Vale para cualquier caja de anuncio que `core.js` marque vacía: `#topzone` y también los huecos\n   sueltos del cuerpo (`div[style=\"width:728px;height:110px\"]` con el `aclib` dentro). Los `<iframe>`\n   tienen su propia regla debajo, que además les quita el `transform` de la web. */\nhtml.hf .hf-ad-empty:not(iframe) {\n  height: 0 !important;\n  min-height: 0 !important;\n  max-height: 0 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  border: 0 !important;\n  overflow: hidden !important;\n}\n\n/* El mismo caso cuando la web no lo envuelve en `#topzone` y deja el `<iframe>` de anuncio suelto\n   en el `.pagehead` (la faq, el disclaimer, el formulario de contacto): se desploma él solo. El\n   `transform: none` es porque la web lo agranda con un `scale(1.76)` puesto a mano. */\nhtml.hf iframe.hf-ad-empty {\n  height: 0 !important;\n  min-height: 0 !important;\n  max-height: 0 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  border: 0 !important;\n  overflow: hidden !important;\n  transform: none !important;\n}\n\nhtml.hf .pagefoot a {\n  color: var(--hf-dim) !important;\n}\n\nhtml.hf .pagefoot a:hover {\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .pagefoot .fhead {\n  color: var(--hf-dim2) !important;\n  font-weight: 700;\n  letter-spacing: 0.06em;\n}\n\nhtml.hf .pagefoot .friendlinks a {\n  font-size: 11px;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   11. LO NUESTRO\n   --------------------------------------------------------------------------------------------- */\nhtml.hf .hf-settings-btn {\n  position: fixed;\n  right: 16px;\n  bottom: 16px;\n  z-index: 2147483000;\n  width: 44px;\n  height: 44px;\n  border: 1px solid var(--hf-line2);\n  border-radius: 999px;\n  background: var(--hf-bg2);\n  color: var(--hf-accent);\n  font-size: 20px;\n  line-height: 1;\n  cursor: pointer;\n  box-shadow: var(--hf-shadow);\n}\n\nhtml.hf .hf-settings-btn:hover {\n  border-color: var(--hf-accent);\n}\n\nhtml.hf .hf-settings-btn.hf-on {\n  background: var(--hf-accent);\n  color: #fff;\n}\n\nhtml.hf .hf-panel {\n  position: fixed;\n  right: 16px;\n  bottom: 70px;\n  z-index: 2147483001;\n  width: 372px;\n  max-height: min(78vh, 720px);\n  overflow: auto;\n  background: var(--hf-bg2);\n  border: 1px solid var(--hf-line2);\n  border-radius: 14px;\n  box-shadow: var(--hf-shadow);\n  color: var(--hf-text);\n  font: 13px system-ui, -apple-system, \"Segoe UI\", Roboto, Arial, sans-serif;\n  text-align: start;\n}\n\nhtml.hf .hf-panel[hidden] {\n  display: none !important;\n}\n\nhtml.hf .hf-panel .hf-head {\n  position: sticky;\n  top: 0;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 12px 14px;\n  background: var(--hf-bg2);\n  border-bottom: 1px solid var(--hf-line);\n  font-size: 14px;\n}\n\nhtml.hf .hf-panel .hf-head b {\n  letter-spacing: 0.02em;\n}\n\nhtml.hf .hf-panel .hf-x {\n  border: none;\n  background: transparent;\n  color: var(--hf-dim);\n  font-size: 15px;\n  cursor: pointer;\n}\n\nhtml.hf .hf-panel .hf-x:hover {\n  color: var(--hf-accent);\n}\n\nhtml.hf .hf-panel .hf-body {\n  padding: 6px 14px 14px;\n}\n\nhtml.hf .hf-panel .hf-cap {\n  margin: 14px 0 6px;\n  color: var(--hf-accent);\n  font-size: 11px;\n  font-weight: 800;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;\n}\n\nhtml.hf .hf-panel .hf-row {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n  margin: 6px 0;\n}\n\nhtml.hf .hf-panel .hf-row-lab {\n  color: var(--hf-text);\n  font-size: 12.5px;\n}\n\nhtml.hf .hf-panel .hf-hint {\n  display: block;\n  margin: 4px 0 8px;\n  color: var(--hf-dim2);\n  font-size: 11.5px;\n  line-height: 1.55;\n}\n\nhtml.hf .hf-panel .hf-seg {\n  display: inline-flex;\n  border: 1px solid var(--hf-line2);\n  border-radius: 999px;\n  overflow: hidden;\n}\n\nhtml.hf .hf-panel .hf-segb {\n  padding: 5px 11px;\n  border: none;\n  border-right: 1px solid var(--hf-line2);\n  background: transparent;\n  color: var(--hf-dim);\n  font: 600 12px inherit;\n  cursor: pointer;\n}\n\nhtml.hf .hf-panel .hf-segb:last-child {\n  border-right: none;\n}\n\nhtml.hf .hf-panel .hf-segb.hf-on {\n  background: var(--hf-accent);\n  color: #fff;\n}\n\nhtml.hf .hf-panel .hf-select {\n  padding: 5px 8px;\n  border: 1px solid var(--hf-line2);\n  border-radius: var(--hf-radius-s);\n  background: var(--hf-bg);\n  color: var(--hf-text);\n  font: 12px inherit;\n}\n\nhtml.hf .hf-panel .hf-sw {\n  accent-color: var(--hf-accent);\n  width: 15px;\n  height: 15px;\n}\n\nhtml.hf .hf-panel .hf-btn {\n  background: var(--hf-bg3);\n  color: var(--hf-text);\n}\n\nhtml.hf .hf-panel .hf-foot {\n  padding: 10px 14px 14px;\n  border-top: 1px solid var(--hf-line);\n  color: var(--hf-dim2);\n  font-size: 11px;\n}\n\nhtml.hf .hf-toast {\n  position: fixed;\n  left: 16px;\n  bottom: 16px;\n  z-index: 2147483002;\n  max-width: 380px;\n  padding: 9px 14px;\n  border: 1px solid var(--hf-line2);\n  border-radius: 999px;\n  background: rgba(12, 15, 21, 0.94);\n  color: var(--hf-text);\n  font: 12.5px system-ui, -apple-system, \"Segoe UI\", Roboto, Arial, sans-serif;\n  box-shadow: var(--hf-shadow);\n  opacity: 0;\n  transform: translateY(6px);\n  transition: opacity 0.16s ease, transform 0.16s ease;\n  pointer-events: none;\n}\n\nhtml.hf.hf-skin-claro .hf-toast {\n  background: rgba(255, 255, 255, 0.97);\n}\n\nhtml.hf .hf-toast.hf-on {\n  opacity: 1;\n  transform: translateY(0);\n}\n\nhtml.hf .hf-seen-badge {\n  position: absolute;\n  right: 6px;\n  bottom: 40px;\n  z-index: 3;\n  padding: 1px 6px;\n  border-radius: 999px;\n  background: var(--hf-ok);\n  color: #04140d;\n  font: 800 11px system-ui, -apple-system, \"Segoe UI\", Roboto, Arial, sans-serif;\n  line-height: 1.4;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   12. LOS ICONOS DEL SPRITE EN LA PIEL OSCURA\n   --------------------------------------------------------------------------------------------- */\n/* Los iconos de la web salen todos del mismo sprite, dibujados en negro para un fondo blanco. En la\n   piel oscura se invierten (menos el logotipo y las estrellas del voto, que ya se ven bien). */\nhtml.hf-skin-cueva .played:before,\nhtml.hf-skin-cueva .rank:before,\nhtml.hf-skin-cueva .myrating:before,\nhtml.hf-skin-cueva .soundwarning:before,\nhtml.hf-skin-cueva .archives:before,\nhtml.hf-skin-cueva .offlineplayer:before,\nhtml.hf-skin-cueva .ruffle:before,\nhtml.hf-skin-cueva .lastupdate,\nhtml.hf-skin-cueva .nw,\nhtml.hf-skin-cueva .closeicon,\nhtml.hf-skin-cueva .quickrun .close,\nhtml.hf-skin-cueva .playerctrl .button1:before,\nhtml.hf-skin-cueva .playerctrl .button2:before,\nhtml.hf-skin-cueva .playerctrl .button3:before,\nhtml.hf-skin-cueva .download .init,\nhtml.hf-skin-cueva .download .ready,\nhtml.hf-skin-cueva .download .close,\nhtml.hf-skin-cueva .download .raw,\nhtml.hf-skin-cueva .transfield .google_translate_button,\nhtml.hf-skin-cueva .comment .reply,\nhtml.hf-skin-cueva .comment .thumbup,\nhtml.hf-skin-cueva .comment .thumbdown,\nhtml.hf-skin-cueva .gameinfo .items .btn.expand,\nhtml.hf-skin-cueva .gameinfo .items .btn.collapse {\n  filter: invert(1);\n}\n\n/* ---------------------------------------------------------------------------------------------\n   13. LAS PÁGINAS DE TEXTO (la ayuda del reproductor; el FAQ y los avisos vendrán después)\n   --------------------------------------------------------------------------------------------- */\n/* La web escribe sus artículos a mano con las etiquetas de 2005 —ver `article.js`, que es quien\n   arregla la estructura y pone las clases (`hf-article`, `hf-meta`, `hf-pc`, `hf-notes`, `hf-file`)—:\n   los párrafos van con `text-indent` de 2em y 40 px de margen por cada lado, los apartados son un\n   `<span>` con dos `<br/>` detrás para hacer el hueco, las «ventajas / inconvenientes» son listas\n   que no son listas... Aquí está todo lo que hace que se lean: un ritmo constante entre bloques,\n   cada cosa con su caja y el color de la piel en los sitios donde el suyo no se lee sobre oscuro\n   (que es el caso del recuadro del TL;DR: amarillo claro con el texto casi blanco encima). */\n\n/* Los párrafos: sin el sangrado de 2em ni los 40 px de margen. */\nhtml.hf .hf-article p {\n  margin: 12px 0 !important;\n  padding: 0 !important;\n  line-height: 1.75 !important;\n  text-indent: 0 !important;\n}\n\nhtml.hf .hf-article li {\n  text-indent: 0 !important;\n}\n\n/* Los enlaces del artículo sí se notan: en la piel, un enlace suelto es del color del texto. */\nhtml.hf .hf-article p a,\nhtml.hf .hf-article li a {\n  color: var(--hf-accent) !important;\n  text-decoration: none !important;\n  border-bottom: 1px solid var(--hf-accent-soft);\n}\n\nhtml.hf .hf-article p a:hover,\nhtml.hf .hf-article li a:hover {\n  border-bottom-color: var(--hf-accent);\n}\n\n/* La línea de la última actualización, en pequeño y aparte. */\nhtml.hf .hf-article .hf-meta {\n  margin: 14px 0 0 !important;\n  padding: 2px 10px !important;\n  border-left: 3px solid var(--hf-line2);\n  color: var(--hf-dim2) !important;\n  font-size: 11px !important;\n  letter-spacing: 0.04em;\n  text-transform: uppercase;\n}\n\n/* El recuadro del TL;DR: en la web es amarillo claro (`#FFFFCC`) y su texto queda casi blanco\n   encima, o sea que no se leía. Aquí es una caja de acento con el filo grueso a la izquierda. */\nhtml.hf .hf-article .hint {\n  margin: 16px 0 !important;\n  padding: 11px 14px !important;\n  border: 1px solid var(--hf-accent) !important;\n  border-left-width: 4px !important;\n  border-radius: var(--hf-radius-s) !important;\n  background: var(--hf-accent-soft) !important;\n  color: var(--hf-text) !important;\n  line-height: 1.7 !important;\n  text-indent: 0 !important;\n}\n\nhtml.hf .hf-article .hint a {\n  color: var(--hf-accent) !important;\n  font-weight: 700;\n  border-bottom: 0;\n}\n\n/* Los apartados (`.dhead`, que ya lleva su filo de acento desde el bloque 4): aquí solo se les da\n   el aire de arriba, que la web lo hacía con los dos `<br/>` de detrás. */\nhtml.hf .hf-article .dhead {\n  margin: 26px 0 0 !important;\n  font-size: 17px !important;\n}\n\nhtml.hf .hf-article .dhead + br,\nhtml.hf .hf-article .dhead + br + br {\n  display: none !important;\n}\n\n/* Ventajas / inconvenientes: la web los escribe como `<li>` sueltos y en verde oscuro y rojo puro\n   sobre el fondo oscuro. Ahora son una fila de dos píldoras, cada una con su filo. */\nhtml.hf .hf-article .hf-pcs {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n  margin: 10px 0 4px !important;\n  padding: 0 !important;\n  list-style: none !important;\n}\n\nhtml.hf .hf-article .hf-pcs > .hf-pc {\n  flex: 1 1 260px;\n  margin: 0 !important;\n  padding: 7px 12px !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  background: var(--hf-bg3) !important;\n  color: var(--hf-dim) !important;\n  font-size: 13px !important;\n  line-height: 1.6 !important;\n}\n\nhtml.hf .hf-article .hf-pcs > .hf-pro {\n  border-left: 3px solid var(--hf-ok) !important;\n}\n\nhtml.hf .hf-article .hf-pcs > .hf-con {\n  border-left: 3px solid var(--hf-bad) !important;\n}\n\nhtml.hf .hf-article .hf-pc .pros {\n  color: var(--hf-ok) !important;\n}\n\nhtml.hf .hf-article .hf-pc .cons {\n  color: var(--hf-bad) !important;\n}\n\n/* El índice («Table of content»): una tarjeta con su título en pequeño y cada entrada en acento,\n   la descripción en gris (que en la web es `#999`, apagado sobre el fondo oscuro). */\nhtml.hf .hf-article .tcontent {\n  margin: 16px 0 !important;\n  padding: 12px 16px 14px !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius) !important;\n  background: var(--hf-bg3) !important;\n  list-style: none !important;\n  line-height: 1.65 !important;\n}\n\nhtml.hf .hf-article .tcontent > b {\n  display: block;\n  margin: 0 0 8px;\n  color: var(--hf-dim2) !important;\n  font-size: 11px;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n}\n\nhtml.hf .hf-article .tcontent > li {\n  margin: 6px 0 !important;\n  padding: 0 !important;\n  color: var(--hf-dim) !important;\n}\n\nhtml.hf .hf-article .tcontent > li a {\n  color: var(--hf-accent) !important;\n  font-weight: 700;\n  border-bottom: 0;\n}\n\n/* Los guiones de «navegadores» (los `<p>` que empezaban por «- »): una lista con su punto. */\nhtml.hf .hf-article .hf-notes {\n  margin: 12px 0 !important;\n  padding: 0 !important;\n  list-style: none !important;\n}\n\nhtml.hf .hf-article .hf-notes > li {\n  position: relative;\n  margin: 6px 0 !important;\n  padding: 0 0 0 18px !important;\n  color: var(--hf-dim) !important;\n  line-height: 1.7 !important;\n}\n\nhtml.hf .hf-article .hf-notes > li::before {\n  content: \"\";\n  position: absolute;\n  left: 4px;\n  top: 0.62em;\n  width: 5px;\n  height: 5px;\n  border-radius: 50%;\n  background: var(--hf-accent);\n}\n\n/* El aviso del paquete viejo: en la web es una línea roja; la caja `.info2` la pinta el bloque 9,\n   pero un aviso merece su filo de color. */\nhtml.hf .hf-article .info2 {\n  border-left: 4px solid var(--hf-bad) !important;\n}\n\n/* Los archivos (el reproductor, el paquete, el `.swf`): una descarga se ve como una descarga. */\nhtml.hf .hf-article a.hf-file {\n  display: inline-block;\n  margin: 2px 0;\n  padding: 2px 10px !important;\n  border: 1px solid var(--hf-line2) !important;\n  border-radius: 999px !important;\n  background: var(--hf-bg3) !important;\n  color: var(--hf-text) !important;\n  font-size: 12px !important;\n  font-weight: 700 !important;\n  text-decoration: none !important;\n  word-break: break-all;\n}\n\nhtml.hf .hf-article a.hf-file:hover {\n  border-color: var(--hf-accent) !important;\n  color: var(--hf-accent) !important;\n}\n\n/* La lista de autocomprobación del reproductor: un `<textarea readonly>` de la web (de 250 px, y\n   1200 en móvil) con la letra monoespaciada y el árbol marcado con tabuladores. Se queda el\n   textarea —así se puede copiar entera— pero con el aspecto de un panel y sin el alto disparatado:\n   `white-space: pre` conserva la sangría del árbol y el `resize` deja estirarla a mano. */\nhtml.hf .hf-article #ta_check {\n  width: 100% !important;\n  box-sizing: border-box !important;\n  height: auto !important;\n  min-height: 200px;\n  max-height: 46vh;\n  margin: 10px 0 0 !important;\n  padding: 12px 14px !important;\n  border: 1px solid var(--hf-line) !important;\n  border-left: 3px solid var(--hf-accent) !important;\n  border-radius: var(--hf-radius-s) !important;\n  background: var(--hf-bg2) !important;\n  color: var(--hf-text) !important;\n  font: 400 13px/1.7 ui-monospace, SFMono-Regular, Menlo, Consolas, \"Liberation Mono\", monospace !important;\n  white-space: pre;\n  overflow: auto;\n  resize: vertical;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   LA FAQ (`.hf-qas`) Y EL AVISO LEGAL (`.hf-prose`)\n   --------------------------------------------------------------------------------------------- */\n/* Dos páginas de texto corto: el FAQ son tres parejas de pregunta y respuesta y el aviso legal tres\n   párrafos sueltos. En una columna de 1378 px cada bloque son dos renglones larguísimos y el resto\n   hueco, así que van en una rejilla de tarjetas que se reparte el ancho sola (más columnas cuanto\n   más ancha la pantalla, y una sola en un móvil). El aspecto de tarjeta es el mismo que el de las\n   piezas del editor, para que las dos páginas no parezcan de otra web. */\nhtml.hf .hf-qas,\nhtml.hf .hf-prose {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));\n  gap: 18px;\n  align-items: start;\n}\n\nhtml.hf .hf-qas .hf-qa,\nhtml.hf .hf-prose > p {\n  margin: 0 !important;\n  padding: 14px 16px !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  background: var(--hf-bg2) !important;\n}\n\n/* La pregunta: la web la pone en un `<span class=\"dhead\">`, que ya trae su filo de acento y su\n   sangría desde el bloque 4 —aquí solo se le quita el aire de apartado (26 px de arriba) y las\n   mayúsculas, que en una pregunta de 70 caracteres se leen mal—. Y el `<p>` que la envuelve se\n   queda sin margen ni sangría para no dejar un doble filo. */\nhtml.hf .hf-qas .hf-qa .hf-q {\n  margin: 0 0 9px !important;\n  padding: 0 !important;\n  text-indent: 0 !important;\n}\n\nhtml.hf .hf-qas .hf-qa .hf-q .dhead {\n  margin: 0 !important;\n  padding: 3px 0 3px 10px !important;\n  border-left-width: 3px !important;\n  font-size: 13px !important;\n  font-weight: 700 !important;\n  letter-spacing: 0;\n  line-height: 1.45 !important;\n  text-transform: none;\n}\n\n/* La respuesta (y los párrafos del aviso): sin el sangrado de 2em ni los 40 px de margen de la web,\n   y con un ritmo de texto de verdad —el aviso se trae su propio `p{font-size:20px;line-height:250%}`,\n   que es lo que lo dejaba en renglones estirados de lado a lado—. */\nhtml.hf .hf-qas .hf-qa p,\nhtml.hf .hf-prose > p {\n  color: var(--hf-text) !important;\n  font-size: 14px !important;\n  line-height: 1.7 !important;\n  text-indent: 0 !important;\n}\n\nhtml.hf .hf-qas .hf-qa p {\n  margin: 0 !important;\n  padding: 0 !important;\n}\n\nhtml.hf .hf-qas .hf-qa p + p {\n  margin-top: 10px !important;\n}\n\nhtml.hf .hf-prose > p:first-child {\n  border-left: 3px solid var(--hf-accent) !important;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   14. EL EDITOR DE PARTIDAS (la herramienta de `/tool/save-editor/`)\n   --------------------------------------------------------------------------------------------- */\n/* La web pone aquí su herramienta con las etiquetas de 2005: «KNOWN GAMES:» es un texto suelto sin\n   etiqueta, el campo de la ruta y su botón van cada uno a su altura dentro de un `div` con margen, el\n   editor de Flash vive en un hueco de 640x480 metido en una columna de 970 (media página vacía) y la\n   ayuda son cuatro bloques de `<li>` sueltos con los colores en línea. El módulo (`editor.js`) marca\n   las piezas —porque hay cosas que el CSS no puede arreglar: quitar el texto suelto, hacer listas de\n   verdad con los `<li>`, poner el puente hacia el `.swf`— y aquí se pintan. */\n\n/* La tarjeta del formulario: la ruta, el botón de generar el enlace y el enlace que sale. */\nhtml.hf .hf-tool .hf-form {\n  margin: 18px 0 0 !important;\n  padding: 16px 18px 14px !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius) !important;\n  background: var(--hf-bg2) !important;\n}\n\n/* La fila del desplegable, con su etiqueta de verdad y su filtro. */\nhtml.hf .hf-tool .hf-knownrow {\n  display: flex !important;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 10px;\n  margin: 16px 0 0 !important;\n}\n\nhtml.hf .hf-label,\nhtml.hf .hf-tool .hf-known {\n  flex: 0 0 auto;\n  color: var(--hf-dim) !important;\n  font-size: 13px !important;\n  font-weight: 700 !important;\n  letter-spacing: 0.02em;\n}\n\nhtml.hf .hf-tool #known_selector {\n  flex: 1 1 320px;\n  min-width: 0;\n  box-sizing: border-box !important;\n  height: 38px !important;\n  padding: 0 12px !important;\n  border: 1px solid var(--hf-line2) !important;\n  border-radius: var(--hf-radius-s) !important;\n  background: var(--hf-bg) !important;\n  background-image: none !important;\n  color: var(--hf-text) !important;\n  font-size: 13.5px !important;\n}\n\nhtml.hf .hf-tool #known_selector:focus {\n  border-color: var(--hf-accent) !important;\n  outline: none;\n}\n\n/* El filtro de los juegos conocidos: delante del desplegable, con el ancho de un campo cómodo (el\n   `select` se queda con el resto) y el mismo aire que los demás campos. Está escondido hasta que la\n   web trae la lista (lo enseña `editor.js`), así que si el AJAX falla no aparece un campo de más. */\nhtml.hf .hf-tool .hf-knownfilter {\n  flex: 1 1 180px;\n  width: auto;\n  min-width: 0;\n  max-width: 230px;\n  box-sizing: border-box !important;\n  height: 38px !important;\n  padding: 0 12px !important;\n  border: 1px solid var(--hf-line2) !important;\n  border-radius: var(--hf-radius-s) !important;\n  background: var(--hf-bg) !important;\n  color: var(--hf-text) !important;\n  font-size: 13px !important;\n}\n\nhtml.hf .hf-tool .hf-knownfilter::placeholder {\n  color: var(--hf-dim2);\n}\n\nhtml.hf .hf-tool .hf-knownfilter:focus {\n  border-color: var(--hf-accent) !important;\n  outline: none;\n}\n\n/* La fila de la ruta: el campo se lleva el ancho y el botón queda a su altura (que es lo que la web\n   no consigue: el suyo va colgando de la línea base). */\nhtml.hf .hf-tool .hf-pathrow {\n  display: flex !important;\n  align-items: center;\n  gap: 10px;\n  margin: 0 0 12px !important;\n}\n\nhtml.hf .hf-tool #savepath {\n  flex: 1 1 auto;\n  width: auto !important;\n  min-width: 0;\n  height: 38px !important;\n  padding: 0 12px !important;\n  border: 1px solid var(--hf-line2) !important;\n  border-radius: var(--hf-radius-s) !important;\n  background: var(--hf-bg) !important;\n  color: var(--hf-text) !important;\n  font: 400 13px/1 ui-monospace, SFMono-Regular, Menlo, Consolas, \"Liberation Mono\", monospace !important;\n}\n\nhtml.hf .hf-tool #savepath:focus {\n  border-color: var(--hf-accent) !important;\n  outline: none;\n}\n\nhtml.hf .hf-tool .hf-btn {\n  flex: 0 0 auto;\n  padding: 0 15px !important;\n  height: 38px !important;\n  border: 1px solid var(--hf-line2) !important;\n  border-radius: var(--hf-radius-s) !important;\n  background: var(--hf-bg3) !important;\n  color: var(--hf-text) !important;\n  font-size: 13px !important;\n  font-weight: 700 !important;\n  cursor: pointer;\n}\n\nhtml.hf .hf-tool .hf-btn:hover {\n  border-color: var(--hf-accent) !important;\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .hf-tool .hf-btn:disabled {\n  opacity: 0.45;\n  cursor: default;\n}\n\nhtml.hf .hf-tool .hf-btn:disabled:hover {\n  border-color: var(--hf-line2) !important;\n  color: var(--hf-text) !important;\n}\n\n/* El enlace de HFlashPlayer: es un `hflash://` larguísimo (lleva la dirección en base64), así que va\n   en monoespaciada, con su punto de ruptura, y en el color de acento. Sin enlace todavía, la fila se\n   queda apagada con su pista, que si no parece rota. */\nhtml.hf .hf-tool .hf-linkrow {\n  display: flex !important;\n  align-items: center;\n  gap: 10px;\n  margin: 0 !important;\n}\n\nhtml.hf .hf-tool .hf-linkrow .hf-label {\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .hf-tool .hf-linkrow #hflashplayer_link {\n  flex: 1 1 auto;\n  min-width: 0;\n  overflow: hidden;\n  color: var(--hf-accent) !important;\n  font: 400 12.5px/1.5 ui-monospace, SFMono-Regular, Menlo, Consolas, \"Liberation Mono\", monospace !important;\n  text-decoration: none;\n  word-break: break-all;\n}\n\n/* Con enlace, una sola línea: es un `hflash://` con la dirección entera en base64, así que en la\n   columna (más estrecha que la página) ocupaba media tarjeta en renglones ilegibles. El texto entero\n   sigue estando —se copia con su botón y el `title` de la web lo enseña al pasar por encima—. */\nhtml.hf .hf-tool .hf-linkrow:not(.hf-link-empty) #hflashplayer_link {\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n\nhtml.hf .hf-tool .hf-linkrow #hflashplayer_link:hover {\n  text-decoration: underline;\n}\n\nhtml.hf .hf-tool .hf-link-empty #hflashplayer_link {\n  color: var(--hf-dim2) !important;\n}\n\nhtml.hf .hf-tool .hf-link-empty #hflashplayer_link::before {\n  content: \"Todavía no hay enlace: elige un juego o escribe una ruta\";\n  font-style: italic;\n}\n\nhtml.hf .hf-tool .hf-linktip {\n  margin: 10px 0 0 !important;\n  color: var(--hf-dim2) !important;\n  font-size: 12.5px !important;\n  line-height: 1.5 !important;\n}\n\n/* El marco del editor: **su tamaño es el del propio `.swf`** (640x480), ni más ni menos. Ojo, que\n   aquí no vale «que ocupe el ancho»: el editor pone `stage.scaleMode = NO_SCALE` (AS3), así que\n   Ruffle lo pinta 1:1 pase lo que pase —si la caja es más grande, el hueco que sobra se queda en\n   BLANCO (un marco enorme con la herramienta pegada en la esquina), y si es más pequeña, RECORTA la\n   tabla por la derecha—. Se comprobó a 1200x900, a 640x480 y a 400x300: sólo en 640x480 llena el\n   marco. `box-sizing: content-box` para que el borde de 1 px no le coma 2 px al lienzo (con 638x478\n   ya se corta la última columna). Ojo: NO se envuelve ni se mueve el nodo del reproductor —eso lo\n   reiniciaría—, sólo se le da tamaño con el CSS. */\nhtml.hf .hf-tool #embedswf {\n  display: block !important;\n  float: none !important;\n  clear: both !important;\n  width: 640px !important;\n  height: 480px !important;\n  box-sizing: content-box !important;\n  margin: 20px 0 0 !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius) !important;\n  background: #fff;\n  box-shadow: var(--hf-shadow);\n  overflow: hidden;\n}\n\n/* La línea de estado del editor (cargando / listo / no cargó), al ancho del propio editor. */\nhtml.hf .hf-editor-note {\n  max-width: 640px;\n  margin: 10px 0 0 !important;\n  text-align: left !important;\n  color: var(--hf-dim) !important;\n  font-size: 12.5px !important;\n}\n\nhtml.hf .hf-editor-note--ok {\n  color: var(--hf-ok) !important;\n}\n\nhtml.hf .hf-editor-note--bad {\n  color: var(--hf-bad) !important;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   La ayuda del editor: los pasos, las pistas y el textarea con las rutas del disco.\n   --------------------------------------------------------------------------------------------- */\nhtml.hf .hf-help .hf-steps {\n  margin: 8px 0 20px !important;\n  padding: 0 !important;\n  list-style: none !important;\n}\n\nhtml.hf .hf-help .hf-steps > li {\n  margin: 0 0 8px !important;\n  padding: 0 0 0 1.8em !important;\n  text-indent: -1.8em !important;\n  background: none !important;\n  color: var(--hf-text) !important;\n  font-size: 13.5px !important;\n  line-height: 1.7 !important;\n}\n\nhtml.hf .hf-help .hf-tip-ok {\n  color: var(--hf-ok) !important;\n}\n\nhtml.hf .hf-help .hf-tip-bad {\n  color: var(--hf-bad) !important;\n}\n\n/* Los mismos colores, pero cuando la pista es un paso de la lista (que es como son aquí): la regla de\n   los `<li>` pesa más, así que hay que ganarle en especificidad. */\nhtml.hf .hf-help .hf-steps > li.hf-tip-ok {\n  color: var(--hf-ok) !important;\n}\n\nhtml.hf .hf-help .hf-steps > li.hf-tip-bad {\n  color: var(--hf-bad) !important;\n}\n\nhtml.hf .hf-help .hf-codepath {\n  color: var(--hf-accent) !important;\n  font: 400 12.5px/1.6 ui-monospace, SFMono-Regular, Menlo, Consolas, \"Liberation Mono\", monospace !important;\n  word-break: break-all;\n}\n\n/* Las rutas del disco: la web las enseña en un `<textarea readonly>` que su propio código estira\n   hasta el alto del contenido (en móvil, 1200 px). Se queda el textarea —así se copia entera— pero\n   con el aspecto de un panel y con tope de alto, que las rutas son largas. */\nhtml.hf .hf-help #ta_hdd {\n  width: 100% !important;\n  box-sizing: border-box !important;\n  height: auto !important;\n  min-height: 140px;\n  max-height: 40vh;\n  margin: 10px 0 0 !important;\n  padding: 12px 14px !important;\n  border: 1px solid var(--hf-line) !important;\n  border-left: 3px solid var(--hf-accent) !important;\n  border-radius: var(--hf-radius-s) !important;\n  background: var(--hf-bg2) !important;\n  color: var(--hf-text) !important;\n  font: 400 13px/1.7 ui-monospace, SFMono-Regular, Menlo, Consolas, \"Liberation Mono\", monospace !important;\n  white-space: pre;\n  overflow: auto;\n  resize: vertical;\n}\n\n/* El buscador de partidas: la recomendación de un buscador de archivos del PC (Everything, gratis),\n   que es lo que resuelve el paso que la web deja a medias. Va pegado a las rutas del disco, que es\n   donde se necesita. */\nhtml.hf .hf-help .hf-tools {\n  margin: 4px 0 26px !important;\n  padding: 14px 16px !important;\n  border: 1px solid var(--hf-line) !important;\n  border-left: 3px solid var(--hf-accent) !important;\n  border-radius: var(--hf-radius) !important;\n  background: var(--hf-bg2);\n}\n\nhtml.hf .hf-help .hf-tools-head {\n  margin: 0 0 8px !important;\n  color: var(--hf-text) !important;\n  font-size: 13.5px !important;\n  font-weight: 600;\n}\n\nhtml.hf .hf-help .hf-tools-line {\n  margin: 0 !important;\n  color: var(--hf-text) !important;\n  text-align: left !important;\n  font-size: 13px !important;\n  line-height: 1.7 !important;\n}\n\nhtml.hf .hf-help .hf-tools-line a {\n  color: var(--hf-accent) !important;\n  font-weight: 600;\n}\n\nhtml.hf .hf-help .hf-tools-line code {\n  padding: 1px 5px;\n  border-radius: 4px;\n  background: var(--hf-bg);\n  color: var(--hf-accent) !important;\n  font: 400 12.5px/1.5 ui-monospace, SFMono-Regular, Menlo, Consolas, \"Liberation Mono\", monospace !important;\n}\n\nhtml.hf .hf-help .hf-tools-note {\n  margin: 8px 0 0 !important;\n  color: var(--hf-dim2) !important;\n  text-align: left !important;\n  font-size: 12.5px !important;\n  line-height: 1.6 !important;\n  word-break: break-word;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   El reparto de la página: el editor a la izquierda y, a su derecha, lo que antes caía debajo.\n   --------------------------------------------------------------------------------------------- */\n/* La web deja el editor de 640x480 en una columna de 1378 y la ayuda debajo, a todo lo ancho: media\n   página vacía al lado del editor y mil píxeles de renglones larguísimos. El editor **no se puede\n   mover** (moverlo reiniciaría Ruffle), así que se coloca con `grid`: él y su nota en la columna de\n   la izquierda, y al lado la columna que trae `editor.js` (el formulario de la ruta y los dos\n   primeros bloques de la ayuda, que son los pasos). El resto de la ayuda se queda debajo, a dos\n   columnas. */\nhtml.hf .hf-tool.hf-two {\n  display: grid;\n  grid-template-columns: 672px minmax(0, 1fr);\n  grid-template-rows: auto auto auto minmax(0, 1fr);\n  column-gap: 30px;\n  align-items: start;\n}\n\nhtml.hf .hf-tool.hf-two > .mtitle {\n  grid-column: 1 / -1;\n  grid-row: 1;\n}\n\nhtml.hf .hf-tool.hf-two > .hf-knownrow {\n  grid-column: 1 / -1;\n  grid-row: 2;\n}\n\nhtml.hf .hf-tool.hf-two > #embedswf {\n  grid-column: 1;\n  grid-row: 3;\n}\n\nhtml.hf .hf-tool.hf-two > .hf-editor-note {\n  grid-column: 1;\n  grid-row: 4;\n}\n\nhtml.hf .hf-tool.hf-two > .hf-side {\n  grid-column: 2;\n  grid-row: 3 / span 2;\n}\n\nhtml.hf .hf-tool.hf-two > .clear {\n  display: none !important;\n}\n\nhtml.hf .hf-side {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n  min-width: 0;\n}\n\nhtml.hf .hf-side .hf-form {\n  margin: 0 !important;\n}\n\n/* Cada bloque de la ayuda, envuelto para poder llevarlo entero. */\nhtml.hf .hf-sec {\n  min-width: 0;\n}\n\n/* En la ayuda de debajo, que va a dos columnas, los pasos sí pueden partirse entre columnas (si no,\n   un bloque largo obliga a su columna a ser él solo de alto y la otra se queda medio vacía), pero\n   cada paso entero no —y menos el que lleva las rutas del disco en su `<textarea>`—, y el título\n   nunca se queda solo al final de una columna. */\nhtml.hf .pagebody.hf-help .hf-steps > li {\n  break-inside: avoid;\n  -webkit-column-break-inside: avoid;\n  page-break-inside: avoid;\n}\n\nhtml.hf .pagebody.hf-help .dhead {\n  break-after: avoid;\n  -webkit-column-break-after: avoid;\n}\n\nhtml.hf .pagebody.hf-help .hf-tools {\n  break-inside: avoid;\n  -webkit-column-break-inside: avoid;\n}\n\n/* Lo que queda de la ayuda, debajo y a dos columnas. */\nhtml.hf .pagebody.hf-help {\n  column-count: 2;\n  column-gap: 34px;\n}\n\n/* En cuanto no quepan las dos columnas, todo a una: el formulario y los pasos vuelven delante del\n   editor, que es el orden de la web. */\n@media (max-width: 1180px) {\n  html.hf .hf-tool.hf-two {\n    display: flex;\n    flex-direction: column;\n    align-items: stretch;\n  }\n  html.hf .hf-tool.hf-two > .hf-side,\n  html.hf .hf-tool.hf-two > .hf-knownrow {\n    width: auto !important;\n    max-width: 100%;\n    box-sizing: border-box;\n  }\n  html.hf .hf-tool.hf-two > .hf-side {\n    order: 3;\n  }\n  html.hf .hf-tool.hf-two > #embedswf {\n    order: 4;\n  }\n  html.hf .hf-tool.hf-two > .hf-editor-note {\n    order: 5;\n  }\n  html.hf .pagebody.hf-help {\n    column-count: 1;\n  }\n}\n\nhtml.hf .hf-hidden-copy {\n  position: fixed;\n  left: -9999px;\n  top: 0;\n  opacity: 0;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   15. EL FORMULARIO DE CONTACTO (`/plugin/feedback/`: enviar un juego, informar de un error…)\n   --------------------------------------------------------------------------------------------- */\n/* La web lo monta con su tabla de 2005 —ver `feedback.js`, que es quien marca las filas y las\n   celdas—: la columna de etiquetas son `<th>` de 120 px y la de campos ocupa el 98% del ancho de la\n   página, así que un `<input>` para la URL mide 1200 px y el resto de la pantalla se va en campos\n   vacíos de lado a lado. Aquí la tabla pasa a ser una rejilla `display: grid` con los `<tr>` en\n   `display: contents` (así las celdas son las celdas de la rejilla y los campos se pueden emparejar\n   sin tocar el HTML de la web): los cortos en pareja, el mensaje a lo ancho, la ayuda al lado del\n   correo y el captcha con su botón al final. Las dos filas de relleno de la web se van. */\n\nhtml.hf .hf-feedback .hf-formtable {\n  display: grid;\n  grid-template-columns: 118px minmax(0, 1.35fr) 118px minmax(0, 1fr);\n  gap: 10px 14px;\n  align-items: center;\n  width: 100% !important;\n  box-sizing: border-box !important;\n  margin: 0 !important;\n  padding: 18px 20px 16px !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius) !important;\n  background: var(--hf-bg2) !important;\n}\n\nhtml.hf .hf-feedback .hf-formtable > tbody,\nhtml.hf .hf-feedback .hf-formtable > tbody > tr {\n  display: contents;\n}\n\nhtml.hf .hf-feedback .hf-row-spacer {\n  display: none !important;\n}\n\n/* Cada campo se coloca a mano en la rejilla: la web los escribió uno por fila, así que sin esto\n   todos los `<th>` caen en la columna 1 y todos los `<td>` en la 2 — dos por fila, apilados. */\nhtml.hf .hf-feedback .hf-lab {\n  grid-column: 1;\n  padding: 0 !important;\n  border: 0 !important;\n  background: none !important;\n  color: var(--hf-dim) !important;\n  font-size: 13px !important;\n  font-weight: 700 !important;\n  text-align: right !important;\n}\n\nhtml.hf .hf-feedback .hf-field {\n  grid-column: 2;\n  padding: 0 !important;\n  border: 0 !important;\n  background: none !important;\n}\n\n/* La URL y el «Type», en pareja: una etiqueta en la columna 1 con su campo en la 2, y el otro par\n   en la 3 con su campo en la 4. */\nhtml.hf .hf-feedback .hf-row-url .hf-lab,\nhtml.hf .hf-feedback .hf-row-url .hf-field {\n  grid-row: 1;\n}\n\nhtml.hf .hf-feedback .hf-row-type .hf-lab {\n  grid-row: 1;\n  grid-column: 3;\n}\n\nhtml.hf .hf-feedback .hf-row-type .hf-field {\n  grid-row: 1;\n  grid-column: 4;\n}\n\nhtml.hf .hf-feedback .hf-row-content .hf-lab,\nhtml.hf .hf-feedback .hf-row-content .hf-field {\n  grid-row: 2;\n}\n\nhtml.hf .hf-feedback .hf-row-email .hf-lab,\nhtml.hf .hf-feedback .hf-row-email .hf-field {\n  grid-row: 3;\n}\n\nhtml.hf .hf-feedback .hf-field > * {\n  width: 100% !important;\n  max-width: none !important;\n  box-sizing: border-box !important;\n}\n\nhtml.hf .hf-feedback input.hf-field,\nhtml.hf .hf-feedback .hf-field input,\nhtml.hf .hf-feedback .hf-field select {\n  height: 36px !important;\n}\n\n/* El mensaje: a lo ancho de las dos parejas, y se le deja estirar hacia abajo. */\nhtml.hf .hf-feedback .hf-row-content .hf-field {\n  grid-column: 2 / -1;\n  align-self: start;\n}\n\nhtml.hf .hf-feedback .hf-row-content .hf-lab {\n  align-self: start;\n  padding-top: 8px !important;\n}\n\nhtml.hf .hf-feedback .hf-row-content textarea {\n  min-height: 148px;\n  line-height: 1.6 !important;\n  resize: vertical;\n}\n\n/* La ayuda de la web: no es un campo, así que va al lado del correo, no debajo. */\nhtml.hf .hf-feedback .hf-gap {\n  display: none !important;\n}\n\nhtml.hf .hf-feedback .hf-wide {\n  grid-column: 2 / -1;\n}\n\nhtml.hf .hf-feedback .hf-row-help .hf-wide {\n  grid-row: 3;\n  grid-column: 3 / -1;\n  align-self: stretch;\n  margin: 0 !important;\n  padding: 12px 14px !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  background: var(--hf-bg3) !important;\n  color: var(--hf-dim) !important;\n  font-size: 12.5px !important;\n  line-height: 1.65 !important;\n}\n\nhtml.hf .hf-feedback .hf-row-help .hf-wide br {\n  display: none;\n}\n\n/* Y el captcha con su botón, al final de todo: una barra —el captcha junto a la columna de los\n   campos y el botón al borde derecho del panel—, que es lo que cierra el formulario. */\nhtml.hf .hf-feedback .hf-row-send .hf-wide {\n  grid-row: 4;\n  grid-column: 2 / -1;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n  margin: 6px 0 0 !important;\n}\n\nhtml.hf .hf-feedback .hf-row-send .g-recaptcha {\n  flex: 0 0 auto;\n}\n\nhtml.hf .hf-feedback .g-recaptcha {\n  transform-origin: left top;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   16. PANTALLAS ESTRECHAS\n   --------------------------------------------------------------------------------------------- */\n@media (max-width: 1024px) {\n  /* Por aquí manda `mobile.css` del sitio. Lo nuestro se queda en los colores y en las piezas\n     propias (panel, avisos, marco del reproductor), que no existen en su versión. */\n  html.hf .hf-panel {\n    right: 8px;\n    left: 8px;\n    width: auto;\n    bottom: 66px;\n    max-height: 72vh;\n  }\n  html.hf .hf-settings-btn {\n    right: 10px;\n    bottom: 10px;\n  }\n  html.hf .hf-stage {\n    margin: 8px 0;\n  }\n  /* El filtro, a su propia línea, y el desplegable debajo a todo lo ancho. */\n  html.hf .hf-tool .hf-knownfilter {\n    flex: 1 1 100%;\n    max-width: none;\n  }\n  /* El formulario de contacto, a una sola columna. */\n  html.hf .hf-feedback .hf-formtable {\n    grid-template-columns: 92px minmax(0, 1fr);\n  }\n  html.hf .hf-feedback .hf-row-url .hf-lab,\n  html.hf .hf-feedback .hf-row-url .hf-field {\n    grid-row: 1;\n  }\n  html.hf .hf-feedback .hf-row-type .hf-lab {\n    grid-row: 2;\n    grid-column: 1;\n  }\n  html.hf .hf-feedback .hf-row-type .hf-field {\n    grid-row: 2;\n    grid-column: 2;\n  }\n  html.hf .hf-feedback .hf-row-content .hf-lab,\n  html.hf .hf-feedback .hf-row-content .hf-field {\n    grid-row: 3;\n  }\n  html.hf .hf-feedback .hf-row-email .hf-lab,\n  html.hf .hf-feedback .hf-row-email .hf-field {\n    grid-row: 4;\n  }\n  html.hf .hf-feedback .hf-field,\n  html.hf .hf-feedback .hf-row-content .hf-field,\n  html.hf .hf-feedback .hf-wide {\n    grid-column: 2 / -1;\n  }\n  html.hf .hf-feedback .hf-row-help .hf-wide {\n    grid-row: 5;\n    grid-column: 2 / -1;\n  }\n  html.hf .hf-feedback .hf-row-send .hf-wide {\n    grid-row: 6;\n    grid-column: 2 / -1;\n  }\n  /* El buscador de autores: baja a su propia línea y se lleva el ancho. */\n  html.hf .hf-authorhead .hf-abar {\n    flex: 1 1 100%;\n    margin: 6px 0 0;\n  }\n  html.hf .hf-afield {\n    flex: 1 1 auto;\n    width: auto;\n  }\n}\n\n/* ---------------------------------------------------------------------------------------------\n   17. LA PÁGINA DE AUTORES (`/author/`) Y SU BUSCADOR\n   --------------------------------------------------------------------------------------------- */\n/* La web pone sus 190 autores en `<a class=\"tag\">` de 280 px —cuatro por fila, y 144 px muertos al\n   final de cada fila—, con el avatar flotado a la izquierda, el nombre, el nombre japonés, el\n   contador de juegos y los dos iconos del sprite (vistos y nota) debajo. Y como la web llama `tag` a\n   cualquier cosa que se pueda pulsar, la ficha se llevaba además la píldora de nuestras etiquetas:\n   `border-radius` de 999 px sobre una tarjeta de 72 px y el texto a 11 px.\n   Aquí la lista pasa a ser un **índice a columnas**, como el de una guía de teléfonos: la ficha es una\n   tarjeta de dos renglones —el avatar, el nombre y, debajo, el nombre japonés con la fila de marcas\n   (los juegos, los vistos y la nota) a su derecha— y la letra del tramo es una **etiqueta** que va\n   delante de sus autores, dentro de la misma columna.\n   El primer intento fue una rejilla de ocho columnas sin la letra (para no gastar una fila por\n   tramo), y funcionaba —5.266 px de página a 1.913—, pero el usuario la vio **demasiado apretada**:\n   «al menos sepáralos por columnas con una especie de barra rosa vertical, y en lugar de 8 columnas\n   hazlo en 4 y con paginación». Así que son **cuatro columnas de verdad** (`column-count`, que reparte\n   el contenido y equilibra las alturas solo), con la **barra rosa** entre ellas (`column-rule`, que es\n   justo eso: la raya que separa columna y columna) y **paginación** en `author.js` —de ahí que la\n   página vuelva a tener un final—. Cuatro columnas de 324 px dan fichas anchas, así que la tarjeta\n   respira otra vez (avatar de 40 px, nombre a 13) sin volver a los 5.000 px. */\n\nhtml.hf .hf-authorlist,\nhtml.hf .hf-tagindex {\n  column-count: 4;\n  column-gap: 26px;\n  column-rule: 2px solid var(--hf-accent-line);\n  padding-bottom: 8px !important;\n}\n\n/* La letra del tramo: una etiqueta dentro de la columna, con el filo de acento (el del `dhead`) a la\n   izquierda y una raya que se va apagando hacia la derecha. Va delante de sus autores, así que se lee\n   «A» y luego sus fichas. `break-inside` para que ni ella ni las fichas se partan entre dos columnas. */\nhtml.hf .hf-authorlist .hf-al-letter,\nhtml.hf .hf-tagindex .hf-al-letter {\n  display: flex;\n  align-items: center;\n  gap: 7px;\n  margin: 0 0 6px !important;\n  padding: 5px 9px !important;\n  border: 1px solid var(--hf-line) !important;\n  border-left: 2px solid var(--hf-accent) !important;\n  border-radius: var(--hf-radius-s) !important;\n  background: var(--hf-bg3) !important;\n  min-height: 0 !important;\n  min-width: 0 !important;\n  overflow: hidden;\n  break-inside: avoid;\n  -webkit-column-break-inside: avoid;\n}\n\nhtml.hf .hf-authorlist .hf-al-letter .hf-al-l,\nhtml.hf .hf-tagindex .hf-al-letter .hf-al-l {\n  flex: 0 0 auto;\n  margin: 0 !important;\n  color: var(--hf-accent) !important;\n  font-size: 13px !important;\n  font-weight: 800 !important;\n  line-height: 1.1 !important;\n  letter-spacing: 0.08em;\n}\n\nhtml.hf .hf-authorlist .hf-al-letter::after,\nhtml.hf .hf-tagindex .hf-al-letter::after {\n  content: \"\";\n  flex: 1 1 auto;\n  height: 1px;\n  background: linear-gradient(to right, var(--hf-line2), transparent);\n}\n\n/* La ficha: una rejilla de dos renglones dentro de la rejilla grande. El avatar ocupa la primera\n   columna en los dos renglones (y manda en el alto); el nombre cruza todo el primer renglón —así se\n   queda con el ancho que el avatar no usa, que es donde antes se perdía el espacio— y en el segundo\n   van el nombre japonés y, pegadas a la derecha, las tres marcas. Cada pieza va colocada por su\n   `grid-area`, así que el orden del HTML da igual. */\nhtml.hf .hf-authorlist .hf-al-card {\n  position: relative;\n  display: grid;\n  grid-template-columns: 40px minmax(0, 1fr) auto auto auto;\n  grid-template-rows: auto auto;\n  column-gap: 8px;\n  row-gap: 3px;\n  align-items: center;\n  width: auto !important;\n  min-height: 0 !important;\n  margin: 0 0 6px !important;\n  padding: 7px 10px !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  background: var(--hf-bg2) !important;\n  color: var(--hf-text) !important;\n  font-size: 12px !important;\n  overflow: hidden;\n  break-inside: avoid;\n  -webkit-column-break-inside: avoid;\n}\n\nhtml.hf .hf-authorlist .hf-al-card:hover {\n  border-color: var(--hf-accent) !important;\n  background: var(--hf-bg3) !important;\n}\n\nhtml.hf .hf-authorlist .hf-al-card:hover .title {\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .hf-authorlist .hf-al-card .avatar {\n  grid-area: 1 / 1 / 3 / 2;\n  width: 40px !important;\n  height: 40px !important;\n  margin: 0 !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  background: var(--hf-bg3);\n  float: none !important;\n  object-fit: cover;\n}\n\nhtml.hf .hf-authorlist .hf-al-card .title {\n  grid-area: 1 / 2 / 2 / -1;\n  display: block;\n  color: var(--hf-text) !important;\n  font-size: 13px !important;\n  font-weight: 800 !important;\n  line-height: 1.3;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n/* El nombre japonés, debajo y en gris (cuando la web lo trae). Se le reserva siempre su renglón,\n   para que las tarjetas sin él midan lo mismo que las demás y las filas no bailen. */\nhtml.hf .hf-authorlist .hf-al-card .fname {\n  grid-area: 2 / 2 / 3 / 3;\n  display: block;\n  min-height: 12px;\n  color: var(--hf-dim) !important;\n  font-size: 10px !important;\n  line-height: 1.2;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n/* La fila de marcas: el contador de juegos (el número que lleva dentro el icono del sprite) y los\n   dos iconos de la web (vistos y nota). El número, en el acento; los dos huecos, vacíos hasta que\n   la web los rellene. Los iconos se dejan **del tamaño de la web** (18×16, el mismo sprite que en el\n   resto de la página): encogerlos con un `transform` ahorraba tres píxeles por fila y no compensa\n   tocar lo que ya se ve bien en todas partes. Sólo se les quita el hueco del descendente con el\n   `vertical-align`, que es lo que estiraba el renglón. */\nhtml.hf .hf-authorlist .hf-al-card .archives {\n  grid-area: 2 / 3 / 3 / 4;\n  margin: 0 0 0 4px;\n  color: var(--hf-accent) !important;\n  font-weight: 700 !important;\n}\n\nhtml.hf .hf-authorlist .hf-al-card .icon {\n  display: inline-block !important;\n  line-height: 1 !important;\n  vertical-align: middle !important;\n  align-self: center;\n}\n\nhtml.hf .hf-authorlist .hf-al-card .played {\n  grid-area: 2 / 4 / 3 / 5;\n  min-width: 0 !important;\n  margin: 0 0 0 3px;\n}\n\nhtml.hf .hf-authorlist .hf-al-card .rank {\n  grid-area: 2 / 5 / 3 / 6;\n  min-width: 0 !important;\n  margin: 0 0 0 3px;\n}\n\n/* El icono de «abrir en otra ventana» de la web (`nw`), que vive dentro del nombre: se saca del\n   flujo —colocado encima de la esquina del avatar— para que no estire el renglón del nombre, y\n   asoma al pasar el ratón. Sigue dentro del enlace, así que el `nw()` de la web lo encuentra igual. */\nhtml.hf .hf-authorlist .hf-al-card .title .nw {\n  position: absolute !important;\n  left: 21px;\n  top: 21px;\n  width: 15px !important;\n  height: 13px !important;\n  margin: 0 !important;\n  overflow: hidden;\n  transform: scale(0.7);\n  transform-origin: left top;\n  opacity: 0;\n  visibility: hidden;\n  transition: opacity 0.12s;\n}\n\nhtml.hf .hf-authorlist .hf-al-card:hover .title .nw {\n  opacity: 1;\n  visibility: visible;\n}\n\n/* En una pantalla estrecha no caben cuatro columnas de 324 px: con tres (por debajo de 1.100 px) las\n   fichas aún miden ~290 px y se leen enteras; con dos (por debajo de 860) ya son ~450 px. La web se\n   anuncia con `width=970`, así que en un teléfono el caso real es el de tres columnas: la ficha baja a\n   ~295 px, que es de sobra —el japonés se queda con lo que sobra de las tres marcas—. El paginador se\n   entera del cambio solo, porque lee las columnas del propio CSS y rearma las páginas. */\n@media (max-width: 1100px) {\n  html.hf .hf-authorlist {\n    column-count: 3;\n  }\n}\n\n@media (max-width: 860px) {\n  html.hf .hf-authorlist {\n    column-count: 2;\n  }\n}\n\n/* El buscador: la fila del título tenía el hueco vacío a la derecha, y ahí se pone —con el contador\n   delante y el campo detrás—, así que no cuesta ni un píxel de alto. `flex-wrap` en esa fila es para\n   que en una pantalla estrecha el campo baje a su propia línea en vez de apretar el título. */\nhtml.hf .mtitle.hf-authorhead {\n  flex-wrap: wrap;\n}\n\nhtml.hf .hf-abar {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-left: auto;\n}\n\nhtml.hf .hf-acount {\n  color: var(--hf-dim) !important;\n  font-size: 12px !important;\n  font-variant-numeric: tabular-nums;\n  white-space: nowrap;\n}\n\nhtml.hf .hf-afield {\n  position: relative;\n  display: block;\n  width: 226px;\n  max-width: 100%;\n}\n\nhtml.hf .hf-aglass {\n  position: absolute;\n  left: 9px;\n  top: 50%;\n  width: 14px;\n  height: 14px;\n  transform: translateY(-50%);\n  color: var(--hf-dim2);\n  pointer-events: none;\n}\n\nhtml.hf .hf-aglass svg {\n  display: block;\n  width: 100%;\n  height: 100%;\n  fill: none;\n  stroke: currentColor;\n  stroke-width: 2;\n  stroke-linecap: round;\n}\n\nhtml.hf .hf-afilter {\n  box-sizing: border-box !important;\n  width: 100% !important;\n  height: 34px !important;\n  margin: 0 !important;\n  padding: 0 28px 0 29px !important;\n  border: 1px solid var(--hf-line2) !important;\n  border-radius: var(--hf-radius-s) !important;\n  background: var(--hf-bg) !important;\n  color: var(--hf-text) !important;\n  font-family: inherit !important;\n  font-size: 13px !important;\n}\n\nhtml.hf .hf-afilter::placeholder {\n  color: var(--hf-dim2);\n}\n\nhtml.hf .hf-afilter:focus {\n  border-color: var(--hf-accent) !important;\n  outline: none;\n}\n\n/* La ✕ del navegador (Chrome la pone en los `type=search`) sobra: la nuestra hace lo mismo. */\nhtml.hf .hf-afilter::-webkit-search-cancel-button,\nhtml.hf .hf-afilter::-webkit-search-decoration {\n  -webkit-appearance: none;\n  display: none;\n}\n\nhtml.hf .hf-aclear {\n  position: absolute;\n  right: 4px;\n  top: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 24px;\n  height: 24px;\n  margin: 0 !important;\n  padding: 0 !important;\n  border: 0 !important;\n  border-radius: 6px !important;\n  background: transparent !important;\n  color: var(--hf-dim) !important;\n  transform: translateY(-50%);\n  cursor: pointer;\n}\n\nhtml.hf .hf-aclear:hover {\n  background: var(--hf-bg3) !important;\n  color: var(--hf-text) !important;\n}\n\nhtml.hf .hf-aclear svg {\n  display: block;\n  width: 12px;\n  height: 12px;\n  fill: none;\n  stroke: currentColor;\n  stroke-width: 2.2;\n  stroke-linecap: round;\n}\n\nhtml.hf .hf-aclear[hidden] {\n  display: none !important;\n}\n\n/* Lo que la búsqueda deja fuera: la ficha, y el tramo de letra que se queda sin nadie. */\nhtml.hf .hf-authorlist .hf-aout,\nhtml.hf .hf-tagindex .hf-aout {\n  display: none !important;\n}\n\n/* Y lo que la paginación deja en otra página. Son dos cosas distintas —el buscador esconde lo que no\n   encaja y el paginador lo que no toca en esta página—, así que van en dos clases: así el contador\n   del buscador cuenta fichas y no casillas, y el paginador puede partir su lista sin pelearse. */\nhtml.hf .hf-authorlist .hf-apg,\nhtml.hf .hf-tagindex .hf-apg {\n  display: none !important;\n}\n\n/* El aviso de que no hay nada: cruza las cuatro columnas y sale donde estaban las fichas. */\nhtml.hf .hf-authorlist .hf-anone,\nhtml.hf .hf-tagindex .hf-anone {\n  column-span: all;\n  padding: 20px 2px !important;\n  color: var(--hf-dim) !important;\n  font-size: 13px !important;\n}\n\nhtml.hf .hf-authorlist .hf-anone[hidden],\nhtml.hf .hf-tagindex .hf-anone[hidden] {\n  display: none !important;\n}\n\n/* El paginador: va JUSTO DEBAJO de la lista —fuera del `.authorlist`, que si no lo paginaría él—,\n   centrado y con la misma piel que el resto (cajas del fondo 2, borde de la raya, acento al pasar por\n   encima; la página en la que se está, con el fondo de acento). */\nhtml.hf .hf-apager {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-wrap: wrap;\n  gap: 5px;\n  margin: 14px 0 2px;\n}\n\nhtml.hf .hf-apager[hidden] {\n  display: none !important;\n}\n\nhtml.hf .hf-apager button {\n  min-width: 32px;\n  height: 30px;\n  margin: 0 !important;\n  padding: 0 9px !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  background: var(--hf-bg2) !important;\n  color: var(--hf-text) !important;\n  font-family: inherit !important;\n  font-size: 12px !important;\n  font-weight: 700 !important;\n  cursor: pointer;\n}\n\nhtml.hf .hf-apager button:hover:not(:disabled) {\n  border-color: var(--hf-accent) !important;\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .hf-apager button:disabled {\n  opacity: 0.45;\n  cursor: default;\n}\n\nhtml.hf .hf-apager .hf-apage-on {\n  border-color: var(--hf-accent) !important;\n  background: var(--hf-accent) !important;\n  color: var(--hf-bg) !important;\n}\n\nhtml.hf .hf-apager .hf-apage-info {\n  margin: 0 4px;\n  color: var(--hf-dim) !important;\n  font-size: 12px !important;\n  font-variant-numeric: tabular-nums;\n  white-space: nowrap;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   18. EL «SORT» DE LOS LISTADOS DE ETIQUETA Y DE AUTOR (`/tag/<x>/`, `/author/<x>/`)\n   --------------------------------------------------------------------------------------------- */\n/* La fila del desplegable: la web pone «SORT:» y el `<select>` sueltos, en un renglón con el aire\n   justo. Aquí van en fila —la etiqueta, el desplegable y, al lado, la nota con lo que se está\n   viendo— y la nota se queda con el hueco que sobra, que en esta columna es mucho. La `SORT:` la\n   traduce el diccionario de `lang.js`. */\nhtml.hf .list_option {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 8px;\n  margin: 10px 0 0;\n  color: var(--hf-dim) !important;\n  font-size: 12.5px;\n}\n\nhtml.hf .list_option select {\n  flex: 0 0 auto;\n}\n\nhtml.hf .hf-asort-note {\n  color: var(--hf-dim2) !important;\n  font-size: 12px;\n  font-variant-numeric: tabular-nums;\n}\n\n/* El pie de páginas de estos listados es el mismo `.hf-apager` de la lista de autores: aquí sólo se\n   le da el aire de arriba, que va pegado a las tarjetas. */\nhtml.hf .hf-asort-pager {\n  margin: 14px 0 0;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   19. LA FICHA DEL AUTOR (`/author/<nombre>/`)\n   --------------------------------------------------------------------------------------------- */\n/* La web la deja en rosa claro (`#FFE5F8`) y a todo lo ancho: en la piel oscura era un rectángulo\n   pálido de 1.047 × 159 con el avatar de 64 px perdido dentro. Aquí es la cabecera del listado —\n   tarjeta del fondo 3, el avatar a la izquierda y los datos en una tabla como la de la ficha de un\n   juego— y el enlace a la web del autor, con el acento. La caja hermana de las páginas de etiqueta\n   (`.taginfo`) viene vacía y sin fondo: no se toca, que no hay nada que pintar. */\nhtml.hf .authorinfo {\n  display: flex;\n  align-items: flex-start;\n  gap: 14px;\n  margin: 0 !important;\n  padding: 12px 14px !important;\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius) !important;\n}\n\nhtml.hf .authorinfo .avatar {\n  flex: 0 0 auto;\n  width: 72px !important;\n  height: 72px !important;\n  margin: 0 !important;\n  float: none !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  object-fit: cover;\n}\n\nhtml.hf .authorinfo .infotable {\n  width: 100% !important;\n  margin: 0 !important;\n  float: none !important;\n  border-collapse: collapse;\n}\n\nhtml.hf .authorinfo .infotable th {\n  width: 130px;\n  padding: 6px 10px 6px 0 !important;\n  color: var(--hf-dim) !important;\n  font-size: 12px;\n  font-weight: 600;\n  text-align: start;\n  vertical-align: top;\n}\n\nhtml.hf .authorinfo .infotable td {\n  padding: 6px 0 !important;\n  color: var(--hf-text) !important;\n  font-size: 13px;\n  vertical-align: top;\n  background: transparent !important;\n}\n\nhtml.hf .authorinfo .infotable td:hover {\n  background: var(--hf-accent-soft) !important;\n}\n\nhtml.hf .authorinfo a {\n  color: var(--hf-accent) !important;\n  text-decoration: none !important;\n}\n\nhtml.hf .authorinfo a:hover {\n  text-decoration: underline !important;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   20. EL ÍNDICE DE ETIQUETAS (`/tags/list/`)\n   --------------------------------------------------------------------------------------------- */\n/* La otra cara de `/tags/`: aquélla son los seis bloques de las etiquetas gordas, ésta es el\n   **índice alfabético entero** —635 etiquetas en 32 tramos, de la «.» a la «Z»—, que la web pinta\n   como fichas sueltas: `a.tag1` al 30% de ancho, una detrás de otra, con la letra del tramo\n   (`.tline`, un `div` con su `h2.dhead`) **metida en medio del mismo flujo** y separada por una\n   raya de puntos. Y el fondo de cada ficha lo pone la regla general del sitio (`.tagslist a` con\n   `background:#FFF`), así que en la piel oscura salían **cajas blancas con el texto casi blanco**:\n   ilegibles, y con las 680 fichas en fila la página se iba a **14.900 px**.\n   El contenedor pasa a **índice a columnas** —el mismo del bloque 17, con su barra rosa: `author.js`\n   le pone la clase `hf-tagindex` y el `column-count` lo comparte con los autores, igual que la letra\n   del tramo y el paginador— y cada ficha es una **tarjeta oscura de dos renglones**: el nombre con su\n   contador a la derecha y, debajo, el nombre japonés (que la web trae entre paréntesis) en gris. Y,\n   como la lista de autores, el índice estrena **buscador y paginación** (18 filas por columna). Todo\n   sale del HTML de la web: no hay que tocar un enlace. */\n\n/* La ficha: una rejilla de dos renglones dentro de la ficha (el nombre y su contador arriba, el\n   japonés debajo). Los tres trozos son hijos directos del `<a>`, así que se colocan por `grid-area`\n   y el orden del HTML da igual. Las que la web destaca (`tag2`/`tag3`/`tag4`: las etiquetas gordas)\n   mantienen su realce con el fondo tenue de acento. */\nhtml.hf .hf-tagindex a {\n  position: relative;\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  grid-template-rows: auto auto;\n  column-gap: 6px;\n  width: auto !important;\n  min-width: 0;\n  margin: 0 0 6px !important;\n  padding: 6px 10px !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  background: var(--hf-bg2) !important;\n  color: var(--hf-text) !important;\n  font-size: 12px !important;\n  line-height: 1.35;\n  overflow: hidden;\n  break-inside: avoid;\n  -webkit-column-break-inside: avoid;\n}\n\nhtml.hf .hf-tagindex a.tag2,\nhtml.hf .hf-tagindex a.tag3,\nhtml.hf .hf-tagindex a.tag4 {\n  background: var(--hf-accent-soft) !important;\n  border-color: var(--hf-accent-line) !important;\n}\n\nhtml.hf .hf-tagindex a:hover {\n  border-color: var(--hf-accent) !important;\n  background: var(--hf-bg3) !important;\n}\n\nhtml.hf .hf-tagindex a .title {\n  grid-area: 1 / 1 / 2 / 2;\n  display: block;\n  overflow: hidden;\n  color: var(--hf-text) !important;\n  font-size: 12.5px !important;\n  font-weight: 700 !important;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n\nhtml.hf .hf-tagindex a:hover .title {\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .hf-tagindex a .archivecount {\n  grid-area: 1 / 2 / 2 / 3;\n  justify-self: end;\n  align-self: start;\n  color: var(--hf-accent) !important;\n  font-size: 11.5px !important;\n  font-variant-numeric: tabular-nums;\n}\n\nhtml.hf .hf-tagindex a .fname {\n  grid-area: 2 / 1 / 3 / 3;\n  overflow: hidden;\n  color: var(--hf-dim2) !important;\n  font-size: 11px !important;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n\n/* El «abrir en otra ventana» de la web vive dentro del nombre: fuera del flujo y en la esquina, que\n   asome al pasar el ratón. Así no le come ancho al nombre (que va con puntos suspensivos). */\nhtml.hf .hf-tagindex a .nw {\n  position: absolute;\n  right: 7px;\n  bottom: 4px;\n  opacity: 0;\n  transition: opacity 0.12s ease;\n}\n\nhtml.hf .hf-tagindex a:hover .nw {\n  opacity: 0.75;\n}\n\n\n/* ---------------------------------------------------------------------------------------------\n   21. LAS CORONAS DE LA CABECERA (las etiquetas que más se usan)\n   --------------------------------------------------------------------------------------------- */\n/* Las dos filas de etiquetas que la web tiene debajo del menú (.line2 y .line3) dejan de ser la\n   lista que alguien eligió hace años —etiquetas mezcladas con cuatro autores y sin decir cuánto se\n   usa ninguna— y pasan a ser **las 26 etiquetas más usadas de la web**, con sus números de verdad\n   (los de su propio índice de categorías) en el bocadillo. Las tres primeras llevan **corona**: oro,\n   plata y bronce. Las píldoras son las mismas de siempre (bloque 3): aquí sólo se les da hueco a la\n   corona y se tiñe el filo y el texto de las tres primeras. */\nhtml.hf .nav .line2 a.hf-ct,\nhtml.hf .nav .line3 a.hf-ct {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n}\n\n/* La corona: el dibujo va en el SVG que trae el enlace y el color aquí, con `currentColor`. */\nhtml.hf .hf-crown {\n  display: block;\n  flex: none;\n  width: 13px;\n  height: 12px;\n  color: #f3c64b;\n}\n\nhtml.hf .hf-crown svg {\n  display: block;\n  width: 100%;\n  height: 100%;\n  fill: currentColor;\n}\n\n/* Oro, plata y bronce. Se cambia el filo y el color del texto (el fondo se deja como el de las\n   demás píldoras, para que el realce al pasar el ratón siga siendo el mismo). El texto va con\n   `--hf-text` y no con un color fijo: en la piel clara un gris claro no se leería. */\nhtml.hf .nav .line2 a.hf-ct-1,\nhtml.hf .nav .line3 a.hf-ct-1 {\n  border-color: rgba(243, 198, 75, 0.6) !important;\n  color: var(--hf-text) !important;\n}\n\nhtml.hf .nav .line2 a.hf-ct-2,\nhtml.hf .nav .line3 a.hf-ct-2 {\n  border-color: rgba(201, 209, 220, 0.5) !important;\n  color: var(--hf-text) !important;\n}\n\nhtml.hf .nav .line2 a.hf-ct-3,\nhtml.hf .nav .line3 a.hf-ct-3 {\n  border-color: rgba(207, 139, 82, 0.5) !important;\n  color: var(--hf-text) !important;\n}\n\nhtml.hf .hf-ct-2 .hf-crown {\n  color: #c9d1dc;\n}\n\nhtml.hf .hf-ct-3 .hf-crown {\n  color: #cf8b52;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   22. LA CORONA Y EL CORAZÓN DE LOS «FAVORITOS DE TODOS» (en las fichas)\n   --------------------------------------------------------------------------------------------- */\n/* La insignia va arriba a la derecha: la esquina de arriba a la izquierda es el contador de la web\n   (.top, y el puesto en las listas TOP/HOT), y la de abajo a la derecha, nuestra marca de «ya lo\n   abriste». Corona para los tres primeros del club y corazón para el resto; los números (la nota\n   de todos, sus votos y sus partidas) salen en el bocadillo. */\nhtml.hf .hf-fav {\n  position: absolute;\n  top: 6px;\n  right: 6px;\n  z-index: 3;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 22px;\n  height: 22px;\n  border: 1px solid var(--hf-line2);\n  border-radius: 999px;\n  background: rgba(6, 8, 12, 0.72);\n  color: var(--hf-accent);\n  line-height: 1;\n}\n\nhtml.hf .hf-fav svg {\n  display: block;\n  width: 13px;\n  height: 12px;\n  fill: currentColor;\n}\n\nhtml.hf .hf-fav-1 {\n  border-color: rgba(243, 198, 75, 0.6);\n  color: #f3c64b;\n}\n\nhtml.hf .hf-fav-2 {\n  border-color: rgba(201, 209, 220, 0.55);\n  color: #c9d1dc;\n}\n\nhtml.hf .hf-fav-3 {\n  border-color: rgba(207, 139, 82, 0.55);\n  color: #cf8b52;\n}\n\n/* En la ficha del juego la insignia sale al lado del título y dice lo que es. */\nhtml.hf .hf-fav.hf-fav-big {\n  position: static;\n  width: auto;\n  height: auto;\n  padding: 3px 12px 3px 10px;\n  margin: 0 0 0 10px;\n  border-radius: 999px;\n  background: rgba(6, 8, 12, 0.5);\n  font: 700 11.5px system-ui, -apple-system, \"Segoe UI\", Roboto, Arial, sans-serif;\n  vertical-align: middle;\n}\n\nhtml.hf .hf-fav.hf-fav-big svg {\n  width: 13px;\n  height: 12px;\n}\n\n/* Y en la piel clara el oro y el bronce siguen leyéndose, pero la plata (que es casi blanca) se\n   oscurece, que sobre el blanco desaparecía. */\nhtml.hf.hf-skin-claro .hf-crown {\n  color: #d9a316;\n}\n\nhtml.hf.hf-skin-claro .hf-ct-2 .hf-crown {\n  color: #6f7a8b;\n}\n\nhtml.hf.hf-skin-claro .hf-ct-3 .hf-crown {\n  color: #b0703c;\n}\n\nhtml.hf.hf-skin-claro .nav .line2 a.hf-ct-2,\nhtml.hf.hf-skin-claro .nav .line3 a.hf-ct-2 {\n  border-color: rgba(111, 122, 139, 0.65) !important;\n}\n\nhtml.hf.hf-skin-claro .nav .line2 a.hf-ct-3,\nhtml.hf.hf-skin-claro .nav .line3 a.hf-ct-3 {\n  border-color: rgba(176, 112, 60, 0.5) !important;\n}\n";
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
    // las dos filas de etiquetas de la cabecera: las 26 más usadas de la web, con corona en las
    // tres primeras (las cuenta y las pinta `crown.js`)
    crownTags: true,
    // marcar en las fichas los «favoritos de todos» de la web (corona a los tres primeros y
    // corazón al resto del club; la lista la trae calculada `crown.js`)
    crownFavs: true,
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
    if (typeof settings.crownTags !== "boolean") settings.crownTags = DEFAULTS.crownTags;
    if (typeof settings.crownFavs !== "boolean") settings.crownFavs = DEFAULTS.crownFavs;
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

  // Para reconocer un hueco de anuncio ya montado (que puede tener la dirección en `src`, en el
  // `data-src` de la web o en el `data-hf-ad` con el que lo aplazamos nosotros).
  function adFrame(f) {
    var url = f.getAttribute("src") || f.getAttribute("data-src") || f.getAttribute("data-hf-ad") || "";
    return AD_HOSTS.test(url);
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
  // EL HUECO DE ANUNCIOS DE LA CABECERA, CUANDO NO LO RELLENA NADIE
  // =============================================================================================
  // Debajo del menú de etiquetas la web reserva `#topzone`: dos huecos de anuncio (un 728x90 y un
  // 300x50) con unos 110 px de alto. En una página corta —el editor de partidas, los ajustes, una
  // página de texto— es lo primero que se ve, y cuando la red no lo rellena (una caída, un
  // bloqueador) queda un rectángulo vacío de lado a lado. Aquí se mira si dentro hay de verdad
  // algún anuncio y, si no lo hay, se marca `hf-ad-empty` para que el CSS desplome el hueco y el
  // contenido suba. **No se toca ningún anuncio**: ni el `src`, ni el tamaño, ni la red que lo
  // sirve. Y en cuanto uno llega, la marca se quita sola y el hueco vuelve a estar.
  //
  // Con una sola señal no basta, porque el `<iframe>` de un anuncio pasa por varios estados antes de
  // decidirse: mientras la petición está en el aire no tiene caja; cuando el navegador la corta se
  // queda con su caja de 728x90 pero con `about:blank` dentro —así que mide lo mismo que un anuncio
  // de verdad—; y sólo cuando el anuncio **llega** tiene caja *y* un documento de otro dominio (su
  // `contentDocument` es `null`, o su `URL` no es `about:blank`). Por eso «hay algo» es caja **y**
  // documento: con las dos a la vez es un anuncio puesto; con una sola, no hay nada que enseñar.
  // En la duda (no se puede mirar dentro) se le deja el sitio: sólo se desploma lo que consta vacío.
  // La caja que la web le da al hueco, aunque lo hayamos encogido nosotros: al encogerlo se apunta
  // la que tenía (ver `markAdEmpty`). Un hueco **sin caja** no puede estar enseñando nada: ni la
  // web le ha dado tamaño, ni ha pedido nada a la red. Y eso pasa mucho en el laboratorio, que no
  // carga anuncios: sus `<iframe>` de publicidad se quedan a cero y su `load` **no** es un anuncio.
  function adBox(f) {
    var saved = f.dataset && f.dataset.hfAdBox;
    if (saved) {
      var p = String(saved).split("x");
      return { w: Number(p[0]) || 0, h: Number(p[1]) || 0 };
    }
    return { w: f.offsetWidth, h: f.offsetHeight };
  }

  function adHasBox(f) {
    var b = adBox(f);
    return b.w > 0 && b.h > 0;
  }

  function frameShows(f) {
    if (!adHasBox(f)) return false; // sin caja: no pinta nada
    if (f.dataset && f.dataset.hfAdFilled) return true; // ya se le vio un anuncio puesto aquí
    // Y el hueco que lleva un buen rato sin decir nada (ni un `load`, ni un documento que se pueda
    // leer): ahí no hay anuncio. Es el caso que se escapa a todo lo demás —el `<iframe>` de la red
    // que se queda a medias y no llega a pintar nunca— y el que dejaba 90 px de nada en cada
    // página. Si más tarde llega, el `load` le devuelve el sitio.
    if (f.dataset && f.dataset.hfAdQuiet) return false;
    var doc = null;
    try {
      doc = f.contentDocument;
    } catch (e) {
      return true;
    }
    if (!doc) return true; // de otro dominio: hay anuncio
    if ((doc.URL || "") !== "about:blank") return true; // documento de verdad: hay algo
    var body = doc.body;
    if (!body) return false;
    return body.children.length > 0 || !!(body.textContent || "").trim();
  }

  // El anuncio que llega DESPUÉS de que se le desplomara el hueco. El `height: 0` del CSS enmudece
  // la señal que se usaba para saber si había algo —la caja del `<iframe>`—, así que un anuncio que
  // aparece tarde (la petición que estaba en el aire, el hueco perezoso que se suelta al acercarse,
  // el que recarga la propia red) se quedaba sin sitio para siempre. Pero ese anuncio **recarga el
  // `<iframe>`**, y eso sí se puede oír: su `load`. Si al cargar el documento ya es de otro dominio
  // —o el `about:blank` se ha ido—, hay anuncio, y el hueco se le devuelve en el acto.
  //
  // El vigilante se pone en cuanto se mira un `<iframe>` de anuncio, para que esté antes de que el
  // anuncio pueda llegar. La comprobación no se hace al ponerlo: si se hiciera, el `<iframe>` que ya
  // trae el documento de la red (aunque esté vacío —el caso del hueco que se quiere desplomar—)
  // pasaría por anuncio y no se desplomaría nunca.
  function adLanded(f) {
    var doc = null;
    try {
      doc = f.contentDocument;
    } catch (e) {
      doc = null;
    }
    return !(doc && (doc.URL || "") === "about:blank");
  }

  // Marca (o desmarca) un hueco como vacío, y le pone a cero el alto que `skin.js` le reservaba al
  // banner escalado (ese margen va en línea y con `!important`, así que no hay regla de CSS que lo
  // gane: hay que quitarlo desde aquí). Antes de encogerlo se apunta la caja que tenía: es la única
  // señal que queda cuando el `height: 0` la enmudece.
  function markAdEmpty(node, on) {
    if (!node || !node.classList) return;
    if (on && !node.classList.contains("hf-ad-empty")) {
      node.dataset.hfAdBox = node.offsetWidth + "x" + node.offsetHeight;
    }
    node.classList.toggle("hf-ad-empty", on);
    var hf = window.hf;
    if (hf && hf.skin && hf.skin.adGap) hf.skin.adGap(node);
  }

  // Cuánto se le da a un hueco para que dé señales (un `load` con su documento) antes de darlo por
  // vacío. Los anuncios de verdad cargan en uno o dos segundos; esperar cinco no molesta a nadie y
  // deja margen de sobra.
  var AD_QUIET_MS = 5000;

  function watchAd(f) {
    if (f.__hfAdWatch) return;
    f.__hfAdWatch = true;
    f.addEventListener("load", function () {
      delete f.dataset.hfAdQuiet; // dio señales: sigue vivo
      if (!adLanded(f)) return;
      // Un `load` en un hueco **sin caja** (el que la web nunca midió, como los del laboratorio, que
      // no cargan anuncios) no es un anuncio: si se diera por bueno, el hueco se quedaría reservado
      // para siempre —110 px de nada en cada página— sin haber enseñado nada nunca.
      if (!adHasBox(f)) return;
      f.dataset.hfAdFilled = "1";
      markAdEmpty(f, false);
      var zone = f.closest && f.closest("#topzone");
      if (zone) markAdEmpty(zone, false);
    });
    // Y el reloj del silencio: si en `AD_QUIET_MS` no ha dicho ni mu, se marca `hfAdQuiet` (que es
    // lo que `frameShows` mira) y el repaso lo desploma en la pasada siguiente. Nada se toca del
    // anuncio: si llega, su `load` borra la marca y le devuelve su sitio.
    if (f.dataset && !f.dataset.hfAdQuiet) {
      setTimeout(function () {
        if (!f.isConnected || f.dataset.hfAdFilled || f.dataset.hfAdQuiet) return;
        f.dataset.hfAdQuiet = "1";
        try {
          emptyZones();
        } catch (e) {}
      }, AD_QUIET_MS);
    }
  }

  function emptyZones() {
    // En unas páginas la web envuelve sus anuncios en `#topzone` (el editor de partidas) y en otras
    // deja el `<iframe>` suelto como hijo del `.pagehead` (la faq, el disclaimer, el formulario de
    // contacto). Se miran los dos casos: el contenedor se desploma entero y el `<iframe>` suelto se
    // desploma él solo. En ningún caso se toca el anuncio —ni su `src`, ni su tamaño, ni la red—:
    // sólo se deja de reservar sitio a lo que consta vacío, y en cuanto carga se devuelve el hueco.
    var enZona = [];
    qa("#topzone").forEach(function (zone) {
      var frames = qa("iframe, iframe2", zone);
      frames.forEach(watchAd);
      enZona = enZona.concat(frames);
      var painted = qa("ins, img, object, embed, video, canvas, a", zone).some(function (n) {
        return n.offsetWidth > 0 || n.offsetHeight > 0;
      });
      var shows = frames.some(frameShows);
      var vacia = !frames.length && !(zone.textContent || "").trim();
      markAdEmpty(zone, !painted && !shows && (frames.length > 0 || vacia));
    });
    qa(".pagehead > iframe, .pagehead > iframe2").forEach(function (f) {
      if (!adFrame(f) || enZona.indexOf(f) >= 0) return;
      watchAd(f);
      markAdEmpty(f, !frameShows(f));
    });
    // Y los huecos que la web deja sueltos en el cuerpo con la medida puesta a mano (`width:728px;
    // height:110px` con el `aclib` dentro, que en algunas de sus páginas viene hasta comentado): si
    // no hay nada pintado dentro también se desploman, y el repaso les devuelve el sitio en cuanto
    // el anuncio pinte de verdad.
    qa('div[style*="width:728px"], div[style*="width: 728px"]').forEach(function (box) {
      if (box.closest && box.closest("#topzone")) return;
      var painted = qa("iframe, iframe2, ins, img, object, embed, video, canvas", box).some(function (n) {
        return n.offsetWidth > 0 && n.offsetHeight > 0;
      });
      markAdEmpty(box, !painted && !(box.textContent || "").trim());
    });
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
    emptyZones: emptyZones,
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
//      bandera de arriba tampoco podrá saltar. Y sólo se toca el `sandbox` de un iframe de anuncio
//      —el que va a `candy.engine.adglare.net`, `engine.sadbaguette.com`…—: a los de un widget de
//      fuera se les deja lo suyo, que Google pone a su captcha `allow-popups` y `allow-modals` para
//      que funcione, y quitárselas lo rompe.
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

  // ¿Este `<iframe>` da a la página una salida? `allow-popups`, `allow-top-navigation`… no son
  // banderas de un anuncio que se ve, son de uno que se mueve; pero **tampoco son cosa de un widget
  // de fuera que la web pone para que funcione**, así que hay que saber a qué iframe se le toca
  // antes de tocárselo. Google —el captcha del formulario de contacto— pone a su iframe
  // `allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation` y luego le añade
  // `allow-modals`, `allow-popups-to-escape-sandbox` y `allow-storage-access-by-user-activation`:
  // sin esas banderas su widget **da error** en cuanto se toca. La decisión se toma por la dirección
  // del `<iframe>` (la misma cuenta que usa `adDest` para los enlaces): si no se sabe a dónde va
  // —todavía no tiene `src`, o es `about:blank`, o es de la propia web— no se le toca nada. El de un
  // anuncio llega con su `src` de siempre (`candy.engine.adglare.net`, `engine.sadbaguette.com`…),
  // así que sí entra.
  function stripEscape(value) {
    return String(value).replace(ESCAPE_G, "").replace(/\s+/g, " ").trim();
  }

  function adSandboxHost(frame) {
    if (!frame || frame.tagName !== "IFRAME") return false;
    var s = (frame.getAttribute && frame.getAttribute("src")) || "";
    if (!s) {
      try {
        s = frame.src || "";
      } catch (e) {
        s = "";
      }
    }
    if (!s || own(s)) return false;
    return adDest(s);
  }

  function tidyFrame(frame, nextSrc) {
    if (!frame || frame.tagName !== "IFRAME") return false;
    var url = nextSrc != null ? nextSrc : (frame.getAttribute("src") || "");
    var v = frame.getAttribute ? frame.getAttribute("sandbox") : null;
    if (v == null) return sealHost(frame, url);
    if (!ESCAPE.test(v)) return false;
    if (!adDest(url) || own(url)) return false; // no es un anuncio: se le deja su `sandbox` en paz
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

    // 1. el `sandbox`: se limpia en las puertas por las que un iframe de anuncio puede entrar
    //    (atributo, propiedad, `src` y el momento de colgarse del documento). Sólo a los de anuncio
    //    —ver `adSandboxHost`—: a los de un widget de fuera (el captcha) se les deja lo suyo.
    patch(W.Element.prototype, "setAttribute", function (orig) {
      return function (name, value) {
        if (name === "sandbox" && value != null && ESCAPE.test(String(value)) && adSandboxHost(this)) {
          stats.sandbox++;
          notify(null);
          return orig.call(this, name, stripEscape(value));
        }
        // El `src` que llega por atributo —el HTML escrito a mano, un `setAttribute`— es la puerta
        // que faltaba: si el `<iframe>` ya traía su `sandbox` y el `src` le llega después (que es el
        // orden del HTML: los atributos van uno detrás de otro), al llegar el `src` ya se sabe a
        // dónde va y se le puede limpiar el `sandbox` que se le dejó pasar.
        if (name === "src" && this && this.tagName === "IFRAME") {
          try {
            tidyFrame(this, value);
          } catch (e) {}
        }
        return orig.apply(this, arguments);
      };
    });
    patch(W.HTMLIFrameElement && W.HTMLIFrameElement.prototype, "sandbox", function (orig, d) {
      return function (v) {
        if (v != null && ESCAPE.test(String(v)) && adSandboxHost(this)) {
          stats.sandbox++;
          notify(null);
          return orig.call(this, stripEscape(v));
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

  // El alto que hay que reservar debajo del banner: el `transform` no cambia la caja de maquetación,
  // así que sin este margen lo que viene detrás se le montaría encima. Se apunta en el propio nodo
  // (`data-hf-ad-gap`) porque va en línea con `!important` —no hay regla de CSS que gane eso—, y así
  // `core.js` puede ponerlo a cero cuando el hueco se desploma por vacío (y devolverlo en cuanto el
  // anuncio aparece: ver `markAdEmpty`).
  function adGap(ad) {
    if (!ad || !ad.dataset) return;
    var empty = ad.classList && ad.classList.contains("hf-ad-empty");
    var val = empty ? "0px" : ad.dataset.hfAdGap ? ad.dataset.hfAdGap + "px" : "";
    if (!val) return;
    if (ad.style.getPropertyValue("margin-bottom") === val) return;
    ad.style.setProperty("margin-bottom", val, "important");
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
      ad.dataset.hfAdGap = String(extra + 8);
      adGap(ad);
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

  hf.skin = { apply: apply, layoutAds: layoutAds, adGap: adGap };
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
    // El mismo desplegable, pero como lo escribe la ficha de una etiqueta o de un autor
    // (`/tag/x/`, `/author/x/`), que lo pone en mayúsculas y con las opciones en otro orden.
    "SORT:": "ORDEN:",
    "Update Date": "Fecha de actualización",
    "Release Date": "Fecha de publicación",
    "Play Count": "Veces jugado",
    Rating: "Valoración",
    "Title": "Título",
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
    // El editor de partidas (`/tool/save-editor/`): el formulario, los pasos de la ayuda y sus
    // pistas. Los nombres de los juegos conocidos, las rutas del disco y el `SaveFilePath` del campo
    // se quedan como están: son datos (o el nombre de un campo del propio editor), no interfaz.
    "Save Path:": "Ruta de la partida:",
    "HFlashPlayer Link:": "Enlace de HFlashPlayer:",
    "1. select game from known games list": "1. Elige el juego en la lista de juegos conocidos",
    "2. load save and edit value column": "2. Carga la partida y edita la columna de valores",
    "3. save and reload game": "3. Guarda y recarga el juego",
    "HOW TO EDIT GAMES IN LOCAL OR OTHER SITES": "CÓMO EDITAR JUEGOS LOCALES O DE OTRAS WEBS",
    "1. identify save file location (see under)": "1. Localiza el archivo de la partida (abajo se explica)",
    "2. sort by modifytime after saving to confirm save file (many games using autosave,and many games write save file when you CLOSE browser)":
      "2. Al guardar, ordena por fecha de modificación para dar con el archivo: muchos juegos guardan solos y muchos escriben la partida al CERRAR el navegador",
    "3. fill relative path to the domain folder (start with /) in SaveFilePath field then load and edit":
      "3. Escribe la ruta relativa a la carpeta del dominio (empezando por /) en el campo SaveFilePath, y luego carga y edita",
    "by default (if your are using IE/FreeFox or play in local), they are in:":
      "Por defecto (con IE/Firefox o si juegas en local) están en:",
    "if your are using chrome, they are in:": "Si usas Chrome, están en:",
    // La pista verde va partida en tres trozos por dos `<b>` (el nombre del archivo y el final de la
    // frase), así que se traduce trozo a trozo y la frase queda entera.
    '* the easiest way is search "': '* Lo más fácil es buscar "',
    '" on your harddriver if you are': '" en tu disco duro si has',
    "loaded this tool": "cargado esta herramienta",
    '* many saves located in subfolder looks like "folder/xxx.swf/save.sol"':
      '* Muchas partidas están en subcarpetas con esta pinta: "folder/xxx.swf/save.sol"',
    "1. find both local/other site and this site's save location (see above, most times they are in same location but different domain folder)":
      "1. Busca la partida del juego local/ajeno y la de este sitio (arriba se explica: casi siempre están en el mismo lugar, en carpetas de dominio distintas)",
    "2. copy the save file to current domain folder then load and edit":
      "2. Copia el archivo de la partida a la carpeta del dominio actual, y luego carga y edita",
    "3. copy the save file back, reload game": "3. Vuelve a copiar el archivo de la partida a su sitio y recarga el juego",

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
      "Submit Comment": "ENVIAR COMENTARIO",
      "Generate Link": "Generar enlace"
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

  // ¿Es uno de los juegos de terceros (los patrocinados, `/sp/...`)? La web los marca con `issp` y
  // los avisa ella misma: «This is a 3rd-party promote game. This game is not Flash-based.» Ahí no
  // hay `.swf` que emular: la web mete la oferta en su propio `<iframe id="embedsp">` y le engancha
  // su controlador. Se mira por `issp` (la marca de la web) y, si no estuviera, por el iframe con una
  // dirección que no es de Flash. Sin esto se llamaría a su `load_ruffle()`, que monta un `<embed>`
  // con la dirección de la oferta, y Ruffle se pasaría el rato intentando leer una página web como si
  // fuera un `.swf` (error de carga y una caja rota encima de la oferta).
  function promo() {
    if (siteVar("issp") === true) return true;
    if (!q("#embedsp")) return false;
    return !/\.swf(\?|#|$)/i.test(String(siteVar("swfpath") || ""));
  }

  // Los `<embed>` que no son un `.swf`: en una página de terceros los crea la propia web si alguien
  // llama a su `load_ruffle()`. No son un reproductor, así que se quitan (el juego es el `#embedsp`).
  function dropFakeEmbeds() {
    if (!q("#embedsp")) return;
    hf.qa("#gamecontainer embed, #gamecontainer ruffle-embed, #gamecontainer ruffle-player").forEach(function (n) {
      var u = n.getAttribute("src") || "";
      if (u && !/\.swf(\?|#|$)/i.test(u) && n.parentNode) n.parentNode.removeChild(n);
    });
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

  // Ruffle cargado, para quien no sea la ficha de juego (el **editor de partidas** de
  // `/tool/save-editor/` también es un `.swf` y también necesita el emulador). Se usa el del sitio o
  // el más nuevo del CDN según el ajuste `emulator`, igual que en el reproductor; `done` se llama
  // cuando está listo (o cuando se ha hecho lo posible).
  function withRuffle(done) {
    var finish = function () {
      if (done) done();
    };
    if (ruffleReady()) {
      finish();
      return;
    }
    if (hf.settings.emulator === "nuevo") {
      loadNewestRuffle(finish);
      return;
    }
    var theirs = siteFn("load_ruffle");
    if (!theirs) {
      loadNewestRuffle(finish);
      return;
    }
    // El camino del sitio: `load_ruffle()` pone el script de h-flash y va mirando si el `<embed>` ya
    // es de Ruffle. Si en unos segundos no lo es, se tira del más nuevo.
    try {
      theirs();
    } catch (e) {}
    var tries = 0;
    (function tick() {
      if (ruffleReady() || ++tries > 20) {
        if (!ruffleReady()) loadNewestRuffle(finish);
        else finish();
        return;
      }
      setTimeout(tick, 300);
    })();
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
    dropFakeEmbeds();
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
    if (promo()) {
      // De terceros: el reproductor ya es suyo (o lo monta la web, `embedsp()`), así que aquí no se
      // arranca nada; solo se le da sitio.
      started = true;
      fit();
      return;
    }
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

  // ▶ Jugar en un juego de terceros: se enseña su `<iframe>` (a la oferta le gusta que alguien la
  // pida; la web la deja tapada hasta entonces) y se le da el hueco que dice la ficha.
  function promoPlay() {
    var e = q("#embedsp");
    if (!e) return;
    e.style.visibility = "";
    var w = parseInt(siteVar("swfw"), 10);
    var h = parseInt(siteVar("swfh"), 10);
    if (w > 0) e.setAttribute("width", String(w));
    if (h > 0) e.setAttribute("height", String(h));
    fit();
  }

  function play() {
    if (promo()) promoPlay();
    else retry();
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
      hf.el("button", { type: "button", cls: "hf-btn hf-btn-play", text: "▶ Jugar", onclick: play, title: "Arranca el juego con Ruffle (F = pantalla completa)" }),
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
    // Juego de terceros: no hay `.swf` que emular ni porcentaje que mirar. La web ya tiene su
    // reproductor (su `<iframe id="embedsp">` con la oferta), así que se deja tal cual, se dice lo
    // que es y se le da sitio. El ▶ de la barra enseña/fitxa ese iframe (ver `promoPlay`).
    if (promo()) {
      if (bar) bar.classList.add("hf-promo");
      stage.classList.add("hf-stage--on");
      noteText("Juego de terceros: lo sirve la web (no es Flash)", "ok");
      setReady(true);
      // El mismo respeto por el tamaño elegido que en el reproductor normal: se insiste con el
      // «fit» mientras la web no lo tenga puesto, y se deja en paz en cuanto el visitante elige otro.
      var pc = siteVar("ctrl");
      if (fitLeft > 0 || (pc && pc.info && pc.info.size !== "fit" && tries < 60)) {
        if (fitLeft > 0) fitLeft--;
        fit();
      }
      return;
    }
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
    withRuffle: withRuffle,
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
    hf.qa("a.gameboxmain2, a.gameboxmain").forEach(function (a) {
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

      caption("Coronas"),
      sw(
        "crownTags",
        "Las etiquetas de la cabecera, por uso",
        "Las dos filas de etiquetas que la web tiene debajo del menú pasan a ser las 26 más usadas: el número de juegos de cada una —y su puesto— sale en su bocadillo, y las tres primeras llevan corona (oro, plata y bronce). No se inventa nada: son los números del índice de categorías de la propia web, que se vuelve a leer solo una vez a la semana. Al apagarlo vuelven las etiquetas de siempre."
      ),
      sw(
        "crownFavs",
        "Marcar los favoritos de todos",
        "Una insignia en las fichas de los juegos que la web tiene por favoritos de todos, calculados con lo único que la web publica de cada juego: su nota media y cuántos la han votado, con la nota pesada por los votos —un 4,3 con 2.500 votos manda sobre un 5,0 con tres—. Corona a los tres primeros del club y corazón al resto, y en el bocadillo salen la nota, los votos y las partidas. En la ficha del juego, al lado del título."
      ),

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
  // autocomprobación del reproductor. El FAQ y el aviso legal son la misma clase de página (texto
  // con apartados) pero no traen ninguna de las dos, así que se reconocen por el `<link
  // rel="canonical">` que declara la propia página: el laboratorio monta las páginas dentro de su
  // URL, así que la ruta del navegador no sirve de seña, pero el canonical del HTML guardado sí
  // sigue apuntando a la de la web.
  function route() {
    var l = hf.q('link[rel="canonical"]');
    var href = (l && l.getAttribute("href")) || "";
    if (!href) return "";
    try {
      return new URL(href, (window.location && window.location.href) || "https://h-flash.com/").pathname;
    } catch (e) {
      return "";
    }
  }

  function page() {
    var b = hf.q(".pagebody:not(.pagehead)");
    if (!b) return null;
    if (hf.q(".tcontent", b) || hf.q("#ta_check", b)) return b;
    var r = route();
    if (/^\/help\/(faq|disclaimer)\//.test(r)) return b;
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

  // =============================================================================================
  // EL FAQ: PREGUNTAS Y RESPUESTAS SUELTAS
  // =============================================================================================
  // La web escribe cada pregunta como un `<span class="dhead">` con dos `<br>` de relleno detrás y
  // la respuesta en un `<p>`, todo al mismo nivel y sin nada que agrupe la pareja. Así, en una
  // columna de 1378 px, cada respuesta son dos renglones larguísimos y el resto es hueco. Aquí se
  // envuelve cada pareja en su bloque (`.hf-qa`, con la pregunta en `.hf-q`) y los `<br>` de relleno
  // se van: el hueco lo pone el CSS, que además reparte los bloques en columnas.
  function questions(b) {
    var heads = Array.prototype.filter.call(b.children, function (n) {
      return n.tagName === "SPAN" && n.classList.contains("dhead");
    });
    if (heads.length < 2 || hf.q(".hf-qas", b)) return;
    var wrap = hf.el("div", { cls: "hf-qas" });
    b.insertBefore(wrap, heads[0]);
    var box = null;
    Array.prototype.slice.call(b.childNodes).forEach(function (n) {
      if (n.nodeType === 1) {
        if (n.tagName === "SPAN" && n.classList.contains("dhead")) {
          box = hf.el("div", { cls: "hf-qa" });
          var q = hf.el("p", { cls: "hf-q" });
          q.appendChild(n); // el `<span>` de la pregunta, tal cual
          box.appendChild(q);
          wrap.appendChild(box);
          return;
        }
        if (n.tagName === "BR") {
          if (box) n.remove();
          return;
        }
        // cualquier otra cosa (los comentarios, por ejemplo) corta la respuesta y se queda donde está
        if (n.tagName !== "P") {
          box = null;
          return;
        }
      } else if (n.nodeType === 3 && !String(n.nodeValue || "").trim()) {
        n.remove();
        return;
      }
      if (box) box.appendChild(n);
    });
  }

  // =============================================================================================
  // EL AVISO LEGAL: TRES PÁRRAFOS SIN FORMATO
  // =============================================================================================
  // La página se trae su propio `p{font-size:20px;line-height:250%}` en un `<style>` y deja los
  // tres avisos en renglones estirados de lado a lado. Aquí solo se marca el bloque: el CSS le pone
  // el ritmo de un texto (y le gana al de la página) y los reparte en tarjetas.
  function prose(b) {
    var ps = Array.prototype.filter.call(b.children, function (n) {
      return n.tagName === "P";
    });
    if (ps.length < 2) return;
    b.classList.add("hf-prose");
  }

  function init() {
    if (isPrefs()) return;
    var b = page();
    if (!b) return;
    b.classList.add("hf-article");
    var r = route();
    if (/^\/help\/faq\//.test(r)) questions(b);
    if (/^\/help\/disclaimer\//.test(r)) prose(b);
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
    route: route,
    questions: questions,
    prose: prose,
    meta: meta,
    proscons: proscons,
    group: group,
    notes: notes,
    files: files,
    check: check,
    comments: comments,
    disarm: disarm,
    guard: guardOnscreen
  };
})();

// ---------------------------------------------------------------------------------------------
// h-flash.com — EL EDITOR DE PARTIDAS A DOMICILIO (`/tool/save-editor/`).
//
// Aquí la web tiene su herramienta para tocar las partidas de los juegos (los `.sol` que Flash deja
// en el disco) y la tiene rota por dos sitios distintos:
//
//   1. **Es Flash.** El editor es `save-editor.swf` metido en un `<embed>`: sin Flash no hay nada, y
//      en su sitio queda un hueco muerto de 640x480 en mitad de la página. Aquí se carga **Ruffle**
//      (el del sitio o el más nuevo, según el ajuste `emulator` del panel ⚡) y el emulador se lleva
//      el `<embed>`: Ruffle «mejora» la etiqueta en su sitio, así que las variables de la web
//      (`swf`, `swfpath`) y su elemento siguen siendo los mismos.
//   2. **El puente JS↔Flash.** La web le manda la ruta de la partida con `swf.setpath(ruta)`, que es
//      una llamada al `ExternalInterface` del `.swf`: en Flash de verdad funcionaba, y en Ruffle esa
//      función **no existe**, así que el editor arranca pero nunca sabe qué partida abrir (su tabla
//      sale vacía y la herramienta no sirve para nada). Lo que se hace es ponerle al reproductor un
//      `setpath` que sí llega al `.swf` por donde Ruffle lo espera
//      (`callExternalInterface("setPath", ruta, cargar)`): con eso el código de la web funciona tal
//      y como está escrito —eliges el juego, la ruta viaja, el editor lista los valores de la
//      partida— y la herramienta vuelve a funcionar entera.
//
// Y de paso se le da el aire de la casa (bloque 14 del CSS) y se traduce (`lang.js`): el formulario
// —la lista de juegos con su filtro, la ruta, el enlace de HFlashPlayer, que es un `hflash://` que
// solo entiende su reproductor de escritorio— como una tarjeta con sus etiquetas y su botón de
// copiar; el marco del editor, que se queda en los 640x480 del propio `.swf` (el editor va en
// `NO_SCALE`: darle más caja es dejar blanco alrededor, y menos es recortarlo); la última ruta, que
// se recuerda entre visitas; y la ayuda —cuatro bloques que la web escribe con `<li>` sueltos, fuera
// de cualquier lista, y con los colores de 2005 en línea— como pasos de verdad con sus pistas.
//
// Todo se marca a sí mismo antes de tocar nada (y todo se busca, no se envuelve: al reproductor no se
// le mueve de sitio, que reiniciarlo es volver a cargar el editor), así que `init()` puede llamarse en
// cada repaso del vigilante del DOM.
// ---------------------------------------------------------------------------------------------
(function () {
  "use strict";
  var hf = window.hf;
  if (!hf || hf.editor) return;

  // ¿Es esta la página del editor? Se pregunta por sus tres piezas —la lista de juegos conocidos, el
  // campo de la ruta y el textarea con las rutas del disco— y no por la dirección, porque el
  // laboratorio monta la página dentro de su propia URL.
  function tool() {
    var sel = hf.q("#known_selector");
    var path = hf.q("#savepath");
    return sel && path ? sel.closest(".pagebody") : null;
  }

  function isEditor() {
    return !!(tool() && hf.q("#ta_hdd"));
  }

  // El bloque de la ayuda: el otro `.pagebody` (el que trae el textarea de las rutas).
  function helpBox() {
    var ta = hf.q("#ta_hdd");
    if (!ta) return null;
    var b = ta.closest(".pagebody");
    return b && b !== tool() ? b : null;
  }

  // =============================================================================================
  // EL FORMULARIO (la lista de juegos, la ruta, el enlace)
  // =============================================================================================
  // «KNOWN GAMES:» es un texto suelto dentro del `div`, sin etiqueta. Se le pone una de verdad (con
  // su `for`), que además se puede pintar como las de la casa.
  function selector(b) {
    var sel = hf.q("#known_selector", b);
    if (!sel || b.querySelector(".hf-known")) return;
    var line = sel.parentElement;
    if (!line) return;
    for (var i = 0; i < line.childNodes.length; i++) {
      var n = line.childNodes[i];
      if (n.nodeType === 3 && n.nodeValue.replace(/\s+/g, "")) n.nodeValue = "";
    }
    line.classList.add("hf-knownrow");
    line.insertBefore(hf.el("label", { cls: "hf-known", for: "known_selector", text: "Juegos conocidos" }), sel);
    // El filtro, delante del desplegable. Empieza escondido: la lista la trae la web por AJAX un
    // momento después, y mientras no haya juegos no hay nada que filtrar (un campo vacío solo
    // estorba). `draw()` es quien lo enseña cuando llegan.
    line.insertBefore(
      hf.el("input", {
        type: "search",
        cls: "hf-knownfilter",
        hidden: true,
        autocomplete: "off",
        spellcheck: "false",
        placeholder: "Filtrar los juegos…",
        "aria-label": "Filtrar los juegos conocidos",
        oninput: function () {
          draw(this.value);
        }
      }),
      sel
    );
    watchList(sel);
    readMaster(sel);
    if (master.length) draw("");
  }

  // ---------------------------------------------------------------------------------------------
  // LOS «SIMILARES» (los juegos del mismo círculo que los conocidos)
  // ---------------------------------------------------------------------------------------------
  // La lista de conocidos son ~22 juegos con su ruta de partida, y resulta que casi todos son del
  // mismo autor: la web los etiqueta a todos como **«JSK Studio»** (y la ficha de cada juego lleva su
  // autor en el meta). Cruzando el catálogo entero de la web —`/list/dataapp.json`, 12.534 juegos
  // con sus etiquetas y su dirección, el mismo que usa el *advanced filter* de `/list/`— con la
  // lista de conocidos, salen **67 entradas del círculo**: 22 ya están en la lista de fábrica y
  // **33 más se quedan fuera**. Esas 33 van aquí: el desplegable las enseña en su propio grupo y,
  // como su partida no se puede saber desde la web (el `.sol` vive en el disco y el nombre del
  // `.swf` no coincide con la dirección del juego), se propone `<swf>/save_data.sol`, que es el
  // patrón de las que sí se conocen. De cada juego se guarda su título, su dirección y la ruta de su
  // `.swf` (sacada de su ficha). Si algún día la web sube más juegos del círculo, esto se rehace
  // cruzando el catálogo otra vez.
  var SIMILAR = [
    ["Imouto-sama Can't Be Refused?", "/imouto-sama-can't-be-refused/", "/data/swf/2018/03/miyuka-unc.swf"],
    ["Tomboy Get Complete!", "/tomboy-get-complete/", "/data/swf/2013/09/Tomboy Get Complete Jap-Uncensored.swf"],
    ["With Imouto... 2", "/with-imouto-2/", "/data/swf/2014/05/Imouto2-uncensored.swf"],
    ["Shogun Princess Christianne", "/shogun-princess-christianne/", "/data/swf/2014/07/shogun-princess-christianne.swf"],
    ["Schoolgirl Torment FLASH", "/schoolgirl-torment-flash/", "/data/swf/2015/04/xx_with_ayasaki.swf"],
    ["Sherry", "/jsk-sherry/", "/data/swf/2015/04/sherry-uncensored.swf"],
    ["Fuuma Girl Maisa", "/fuuma-girl-maisa/", "/data/swf/2015/04/fuuma-girl-maisa.swf"],
    ["Rita", "/jsk-studio-rita/", "/data/swf/2015/05/rita-uncensored.swf"],
    ["Mating Admiral: Isokaze", "/mating-admiral-isokaze/", "/data/swf/2017/09/isokaze-unc.swf"],
    ["Mating Admiral: Arashi", "/mating-admiral-arashi/", "/data/swf/2017/09/arashi-unc.swf"],
    ["Mating Admiral: Hamakaze", "/mating-admiral-hamakaze/", "/data/swf/2017/09/hamakaze-unc.swf"],
    ["Tomboy Get Complete! English ver", "/tomboy-get-complete-eng/", "/data/swf/2018/02/tomboy_eng_unc.swf"],
    ["Misa", "/jsk-misa/", "/data/swf/2018/02/misa-uncensored.swf"],
    ["Imouto-sama Can't Be Refused? English ver", "/imouto-sama-cant-be-refused-eng/", "/data/swf/2018/03/miyuka-uncensored.swf"],
    ["With Imouto... 2 English ver", "/with-imouto-2-eng/", "/data/swf/2018/04/imoutoto2eng.swf"],
    ["Fuuma Girl Maisa English ver", "/fuuma-girl-maisa-eng/", "/data/swf/2018/04/maisa-eng-unc.swf"],
    ["Overthrow! The Demon Queen", "/overthrow-the-demon-queen/", "/data/swf/2018/04/overthrow.swf"],
    ["Overthrow! The Demon Queen English ver", "/overthrow-the-demon-queen-eng/", "/data/swf/2018/04/overthrow-eng.swf"],
    ["Shogun Princess Christianne English ver", "/shogun-princess-christianne-eng/", "/data/swf/2018/04/SPC.swf"],
    ["Manaka", "/jsk-manaka/", "/data/swf/2018/10/manaka.swf"],
    ["sex with Sasahara", "/jsk-sasahara/", "/data/swf/2018/10/xx_rp_sasahara.swf"],
    ["Kanami", "/jsk-kanami/", "/data/swf/2018/10/kanami.swf"],
    ["Fate", "/jsk-fate/", "/data/swf/2018/10/fate-uncensored.swf"],
    ["Devil girl vs Hero", "/devil-girl-vs-hero/", "/data/swf/2019/03/devil-girl-vs-hero.swf"],
    ["Hand-to-Hand Imouto English version", "/hand-to-hand-imouto-eng/", "/data/swf/2019/04/kakutou_imouto_english.swf"],
    ["Miyui ~My Neighbor Swordswoman in School~", "/miyui-my-neighbor-swordswoman-in-school/", "/data/swf/2019/04/kenshi.swf"],
    ["Schoolgirl Torment english version", "/schoolgirl-torment-flash-eng/", "/data/swf/2019/05/xxayasaki-eng.swf"],
    ["Kanami English ver", "/jsk-kanami-eng/", "/data/swf/2019/05/kanami-eng.swf"],
    ["Manaka English ver", "/jsk-manaka-eng/", "/data/swf/2019/05/manaka-eng.swf"],
    ["Magical Girl Buster Englisth Ver", "/magical-girl-buster-eng/", "/data/swf/data/jsk-studio/magical-girl-buster-eng/Magical Girl Buster.swf"],
    ["Miyui ~My Neighbor Swordswoman in School~ English ver", "/miyui-my-neighbor-swordswoman-in-school-eng/", "/data/swf/data/jsk-studio/miyui-eng/miyui-eng.swf"],
    ["Imouto Ryuko", "/ryuko-imouto-2/", "/data/swf/2023/12/ryuko edit.swf"],
    ["Yuiaki", "/jsk-yuiaki/", "/data/swf/2024/02/Yuiaki-uncensored.swf"]
  ];

  // =============================================================================================
  // EL FILTRO DE LOS JUEGOS CONOCIDOS
  // =============================================================================================
  // La web lleva ~22 juegos y sus títulos son un muro (el nombre del autor, el título en inglés y el
  // japonés entre paréntesis: hay entradas de 80 caracteres), así que buscar uno en el desplegable es
  // ir leyendo uno a uno. Encima se le pone un campo que filtra por lo que escribas —da igual
  // mayúsculas, tildes o espacios de más— y que busca tanto en el nombre como en la ruta.
  //
  // El orden manda: la lista la rellena la web por AJAX **después** de cargar la página, así que hay
  // que enterarse de cuándo llega. Un vigilante sobre el propio `<select>` guarda los juegos de
  // verdad la primera vez que aparecen (`master`) y a partir de ahí los pinta `draw()`: el vigilante
  // no vuelve a leer (si no, leería su propia lista ya filtrada y se perdería el resto).
  var master = []; // los juegos tal y como los puso la web

  function filterEl() {
    return hf.q(".hf-knownfilter");
  }

  // Para comparar: sin mayúsculas, sin tildes y con los espacios de dentro de una frase reducidos a
  // uno (los títulos de la web vienen con dobles espacios y espacios al final).
  function norm(s) {
    return String(s == null ? "" : s)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function readMaster(sel) {
    master = [];
    var opts = sel.options || [];
    for (var i = 0; i < opts.length; i++) {
      var o = opts[i];
      var name = String(o.textContent || "").replace(/\s+/g, " ").trim();
      if (!name || !o.value) continue; // la `option` vacía con la que arranca la web
      master.push({ name: name, value: o.value });
    }
  }

  // La ruta que se propone para un similar: la carpeta de su `.swf` y el nombre de partida de toda la
  // vida (`save_data.sol`). Es una aproximación (el nombre del `.sol` cambia: `save_data2.sol`,
  // `save_data4.sol`…) y así se avisa en el propio grupo del desplegable.
  function guess(s) {
    return s[2] ? s[2] + "/save_data.sol" : "";
  }

  function draw(q) {
    var sel = hf.q("#known_selector");
    if (!sel) return;
    var field = filterEl();
    var has = master.length > 0;
    if (field) field.hidden = !has;
    if (!has) return;
    var want = norm(q);
    var keep = [];
    for (var i = 0; i < master.length; i++) {
      if (!want || norm(master[i].name).indexOf(want) >= 0 || norm(master[i].value).indexOf(want) >= 0) {
        keep.push(master[i]);
      }
    }
    var sims = [];
    for (var k = 0; k < SIMILAR.length; k++) {
      if (!want || norm(SIMILAR[k][0]).indexOf(want) >= 0 || norm(SIMILAR[k][1]).indexOf(want) >= 0) {
        sims.push(SIMILAR[k]);
      }
    }
    var chosen = sel.value;
    while (sel.firstChild) sel.removeChild(sel.firstChild); // opciones **y** grupos: `options` no cuenta los `optgroup`
    if (!keep.length && !sims.length) {
      var none = new Option("Sin resultados", "");
      none.disabled = true;
      sel.options.add(none);
    } else {
      // Los conocidos primero (su ruta es la buena) y debajo los similares, en su grupo y con su
      // «≈» delante, para que se vea de un vistazo que ahí la ruta es una aproximación.
      if (keep.length || sims.length) {
        var ph = new Option("— Elige un juego —", "");
        if (!chosen) ph.selected = true;
        sel.appendChild(ph);
      }
      if (keep.length) {
        var gk = hf.el("optgroup", { label: "Juegos conocidos" });
        for (var j = 0; j < keep.length; j++) {
          var o = new Option(keep[j].name, keep[j].value);
          if (keep[j].value === chosen) o.selected = true;
          gk.appendChild(o);
        }
        sel.appendChild(gk);
      }
      if (sims.length) {
        var gs = hf.el("optgroup", { label: "Similares (JSK Studio) · ruta aproximada" });
        for (var m = 0; m < sims.length; m++) {
          var so = new Option("≈ " + sims[m][0], guess(sims[m]));
          so.setAttribute("title", guess(sims[m]));
          if (guess(sims[m]) === chosen) so.selected = true;
          gs.appendChild(so);
        }
        sel.appendChild(gs);
      }
    }
    if (field) {
      field.setAttribute(
        "title",
        (keep.length + sims.length) + " de " + (master.length + SIMILAR.length) + " juegos"
      );
    }
  }

  function watchList(sel) {
    if (sel.__hfWatch || typeof MutationObserver !== "function") return;
    sel.__hfWatch = new MutationObserver(function () {
      if (master.length) return; // ya tenemos la lista: a partir de aquí manda `draw`
      readMaster(sel);
      if (master.length) draw(filterEl() ? filterEl().value : "");
    });
    sel.__hfWatch.observe(sel, { childList: true });
  }

  // =============================================================================================
  // LA ÚLTIMA RUTA (que no haya que escribirla otra vez)
  // =============================================================================================
  // El campo de la ruta llega vacío en cada visita, así que la ruta se acaba copiando de un sitio o
  // volviendo a elegir el juego en el desplegable. Se guarda **solo eso** —la ruta— en `localStorage`
  // y al volver se pone sola: el campo, el enlace y el editor, para seguir donde lo dejaste. Si el
  // campo se vacía a mano, se olvida.
  var STORE = "hf.editor.v1";
  var restored = false;

  function store() {
    try {
      return JSON.parse(localStorage.getItem(STORE) || "{}") || {};
    } catch (e) {
      return {};
    }
  }

  function recall() {
    var p = store().path;
    return typeof p === "string" ? p.trim() : "";
  }

  function remember(path) {
    path = String(path == null ? "" : path).trim();
    try {
      if (!path) localStorage.removeItem(STORE);
      else localStorage.setItem(STORE, JSON.stringify({ path: path }));
    } catch (e) {}
  }

  // El enlace lo arma la propia `setpath()` de la web... y puede que todavía no esté: el HTML de la
  // página (con su `<script>`) se monta un momento DESPUÉS que el userscript, así que al volver a la
  // página la función aún no existe. Por eso la ruta se deja apuntada en `wantLink` y se reintenta en
  // el repaso del emulador (que va cada 400 ms), en vez de darse por perdida.
  var wantLink = "";

  function restore() {
    var path = recall();
    if (!path) return;
    var input = hf.q("#savepath");
    if (!input || String(input.value || "").trim()) return;
    restored = true;
    input.value = path; // el campo, ya
    wantLink = path; // el enlace y el editor, en cuanto se pueda
    send(path, false);
    state();
    linkIt();
  }

  // La ruta apuntada, al enlace de la web (que es quien rellena el `hflash://`, se lo pasa al editor
  // y deja la fila encendida).
  function linkIt() {
    if (!wantLink) return;
    var win = hf.pageWin();
    var theirs = win && win.setpath;
    if (typeof theirs !== "function") return;
    var path = wantLink;
    wantLink = "";
    try {
      theirs(path);
    } catch (e) {
      wantLink = path; // la web todavía no puede (le falta algo de su propio script)
    }
    state();
  }

  // La fila de la ruta: la web mete el campo, la etiqueta y el botón en un `<p>` y el botón queda
  // colgando a otra altura; aquí se marca la fila para que el CSS los alinee.
  function pathRow(b) {
    var input = hf.q("#savepath", b);
    if (!input) return;
    var row = input.closest("p") || input.parentElement;
    row.classList.add("hf-pathrow");
    // El `div` con el `margin:20px` que envuelve la ruta y el enlace: es la tarjeta del formulario.
    var card = row.parentElement;
    if (card && card !== b) card.classList.add("hf-form");
    var span = row.querySelector("span");
    if (span) span.classList.add("hf-label");
    var btn = row.querySelector("input[type=button]");
    if (btn) {
      btn.classList.add("hf-btn");
      btn.setAttribute("title", "Pon la ruta en el campo de arriba y genera el enlace de HFlashPlayer");
    }
    if (!input.getAttribute("placeholder")) input.setAttribute("placeholder", "/save_data_juego.sol");
    input.setAttribute("spellcheck", "false");
    // Lo que se escribe a mano también se recuerda (con un respiro, para no guardar en cada tecla);
    // vaciar el campo es olvidar la ruta.
    var t = 0;
    input.addEventListener("input", function () {
      var v = input.value;
      clearTimeout(t);
      t = setTimeout(function () {
        remember(v);
      }, 700);
    });
  }

  // El enlace de HFlashPlayer: es un `hflash://<base64>` que solo abre su reproductor de escritorio
  // (pégandolo allí), así que se le pone un botón para copiarlo y una pista que lo explique. Mientras
  // no haya ruta, la fila se queda apagada (que si no parece rota).
  function linkRow(b) {
    var a = hf.q("#hflashplayer_link", b);
    if (!a) return;
    var row = a.closest("p") || a.parentElement;
    row.classList.add("hf-linkrow");
    var span = row.querySelector("span");
    if (span) {
      span.classList.add("hf-label");
      span.removeAttribute("style");
    }
    if (!hf.q(".hf-copy", row)) {
      row.appendChild(
        hf.el("button", { type: "button", cls: "hf-copy hf-btn", text: "Copiar enlace", onclick: copy })
      );
    }
    if (!hf.q(".hf-linktip", row.parentNode)) {
      row.parentNode.insertBefore(
        hf.el("p", {
          cls: "hf-linktip",
          text: "El enlace hflash:// lo abre tu reproductor de escritorio (HFlashPlayer): cópialo y pégalo ahí."
        }),
        row.nextSibling
      );
    }
    state();
  }

  // El enlace ya generado (o nada, si todavía no hay ruta).
  function link() {
    var a = hf.q("#hflashplayer_link");
    return a ? String(a.textContent || "").trim() : "";
  }

  // Lo que depende de que haya enlace: la fila se enciende y el botón de copiar se puede pulsar.
  function state() {
    var a = hf.q("#hflashplayer_link");
    var row = a && a.closest(".hf-linkrow");
    var btn = row && hf.q(".hf-copy", row);
    var empty = !link();
    if (row) row.classList.toggle("hf-link-empty", empty);
    if (btn && btn.disabled !== empty) btn.disabled = empty;
  }

  function copy() {
    var text = link();
    if (!text) {
      hf.toast("Todavía no hay enlace: elige un juego o escribe una ruta");
      return;
    }
    var done = function () {
      hf.toast("Enlace copiado");
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, plain);
      return;
    }
    plain();

    // Sin permiso de portapapeles (o sin él, en un navegador viejo): el apaño de toda la vida.
    function plain() {
      var t = hf.el("textarea", { cls: "hf-hidden-copy" });
      t.value = text;
      document.body.appendChild(t);
      t.select();
      try {
        document.execCommand("copy");
        done();
      } catch (e) {
        hf.toast("No se pudo copiar: " + text);
      }
      t.remove();
    }
  }

  // =============================================================================================
  // LA AYUDA (los cuatro bloques de instrucciones)
  // =============================================================================================
  // Cada paso es un `<li>` suelto dentro de un `<p>` y el navegador los saca de ahí (un `<li>` cierra
  // el `<p>`): quedan hermanos y sin ninguna lista que los envuelva. Se juntan los que van seguidos en
  // una `<ul>` de verdad —con eso el `<li>` vuelve a estar donde tiene que estar— y el CSS los pinta.
  function steps(b) {
    hf.qa("li", b).forEach(function (li) {
      if (li.closest("ul, ol")) return;
      var parent = li.parentElement;
      if (!parent) return;
      var ul = hf.el("ul", { cls: "hf-steps" });
      parent.insertBefore(ul, li);
      var n = li;
      while (n && n.nodeType === 1 && n.tagName === "LI") {
        var next = n.nextElementSibling;
        ul.appendChild(n);
        n = next;
      }
    });
  }

  // Los colores van en línea (verde el consejo, rojo el aviso, naranja la ruta de Chrome) y en la
  // piel oscura esos tonos de 2005 no se leen. Se quitan y se cambia por nuestras clases, que además
  // dicen lo mismo: verde = consejo, rojo = aviso, acento = ruta.
  function paint(b) {
    hf.qa("[style]", b).forEach(function (el) {
      var c = String(el.style.color || "").toLowerCase().replace(/\s+/g, "");
      if (!c) return;
      el.style.removeProperty("color");
      el.style.removeProperty("word-break");
      if (c === "green") el.classList.add("hf-tip-ok");
      else if (c === "red") el.classList.add("hf-tip-bad");
      else if (c === "orange" || c === "orange;") el.classList.add("hf-codepath");
    });
  }

  // =============================================================================================
  // EL BUSCADOR DE PARTIDAS (una recomendación, no una herramienta nuestra)
  // =============================================================================================
  // El paso que la web deja a medias es «averigua dónde está tu archivo»: las rutas que enseña son
  // de ejemplo y la partida de verdad hay que encontrarla en el disco. Para eso no hay nada como un
  // buscador de archivos del sistema, y en Windows el de siempre es **Everything** (voidtools), que
  // es gratis: busca `ext:sol` y aparecen todos los «.sol» del disco en un segundo. Se recomienda
  // ahí, junto a las rutas del disco, y se avisa de lo único que tiene truco: de la ruta que te dé
  // (el disco entero), al editor sólo le sirve lo de dentro de la carpeta del dominio, empezando
  // por «/». Todo el bloque es nuestro, así que no hay nada que traducir.
  function tools(b) {
    // Ya está hecho: se pregunta en toda la página y no solo aquí dentro, porque `layout()` se lleva
    // el bloque a su columna y entonces este `b` ya no lo tiene (y sin esta comprobación se repetiría).
    if (!b || hf.q(".hf-tools")) return;
    var ta = hf.q("#ta_hdd", b);
    var ul = ta ? ta.closest("ul") : null;
    var box = hf.el("div", { cls: "hf-tools" });
    box.appendChild(hf.el("p", { cls: "hf-tools-head", text: "¿No encuentras el archivo de la partida?" }));
    var line = hf.el("p", { cls: "hf-tools-line" });
    line.appendChild(document.createTextNode("En Windows, "));
    line.appendChild(
      hf.el("a", {
        href: "https://www.voidtools.com/",
        target: "_blank",
        rel: "noopener noreferrer",
        text: "Everything"
      })
    );
    line.appendChild(document.createTextNode(" (de voidtools, gratis) los encuentra en un segundo: busca "));
    line.appendChild(hf.el("code", { text: "ext:sol" }));
    line.appendChild(document.createTextNode(" y, para solo los de esta web, añade "));
    line.appendChild(hf.el("code", { text: "#SharedObjects" }));
    line.appendChild(document.createTextNode("."));
    box.appendChild(line);
    if (ul && ul.parentNode) ul.parentNode.insertBefore(box, ul.nextSibling);
    else b.appendChild(box);
    // La nota (el ejemplo de la ruta) se queda en el bloque de abajo, con las rutas del disco, que es
    // de lo que habla; el bloque corto es el que sube al lado del formulario (`layout()`).
    var tip = hf.el("p", {
      cls: "hf-tools-note",
      text:
        "De la ruta que te dé, al editor solo le sirve lo que hay desde la carpeta del dominio hacia dentro, empezando por «/»: de «…\\#SharedObjects\\LYHNF2WQ\\h-flash.com\\save_data_juego.sol» se escribe «/save_data_juego.sol»."
    });
    if (box.parentNode) box.parentNode.insertBefore(tip, box.nextSibling);
  }

  // =============================================================================================
  // EL REPARTO DE LA PÁGINA (que no quede un hueco)
  // =============================================================================================
  // La web pone la herramienta a todo lo ancho y debajo, en otro bloque, un muro de ayuda: en un
  // monitor, el editor de 640x480 se queda con media página VACÍA a su derecha mientras la ayuda
  // ocupa mil píxeles de renglones larguísimos. Aquí se reparte: al lado del editor va lo que se usa
  // mientras se edita —el formulario de la ruta y los dos primeros bloques de la ayuda, que son los
  // pasos— y debajo, a dos columnas, el resto (dónde está el archivo y cómo editar los de fuera).
  //
  // El editor **no se mueve** (moverlo reiniciaría Ruffle): sólo se le dice al CSS, con `grid`, en qué
  // columna cae cada pieza. Lo que sí se mueve es lo inerte —el formulario y los trozos de la ayuda—,
  // y cada bloque de la ayuda se envuelve en su `div` (`.hf-sec`) para poder llevarlo entero y para
  // que la columna no lo parta por la mitad.
  function layout(b, hb) {
    if (!b || !hb || hf.q(".hf-side", b)) return;
    var secs = [];
    var cur = null;
    var loose = [];
    Array.prototype.slice.call(hb.children).forEach(function (n) {
      if (n.nodeType !== 1) {
        if (cur) cur.box.appendChild(n);
        return;
      }
      if (n.classList.contains("dhead")) {
        cur = { box: hf.el("div", { cls: "hf-sec" }) };
        secs.push(cur);
        hb.insertBefore(cur.box, n);
      }
      if (!cur) {
        loose.push(n); // los `<br>` de relleno con los que la web abre el bloque
        return;
      }
      cur.box.appendChild(n);
    });
    if (!secs.length) return;
    var side = hf.el("div", { cls: "hf-side hf-help" });
    var card = hf.q(".hf-form", b);
    if (card) side.appendChild(card); // el formulario, al lado del editor
    if (secs[0]) side.appendChild(secs[0].box); // «CÓMO SE USA», que son tres pasos
    // Y el bloque corto del buscador de partidas, que es del mismo tema que el formulario (el hueco
    // que la web deja sin resolver: averiguar dónde está el `.sol`). Su nota larga se queda abajo, con
    // las rutas del disco.
    var finder = hf.q(".hf-tools", hb);
    if (finder) side.appendChild(finder);
    loose.forEach(function (n) {
      n.parentNode.removeChild(n);
    });
    b.appendChild(side);
    b.classList.add("hf-two");
  }

  // =============================================================================================
  // EL EDITOR DE VERDAD (el `.swf`, con Ruffle)
  // =============================================================================================
  var note = null;
  var pending = null; // la ruta que llegó antes de que el emulador estuviera listo
  var poll = 0;

  function stageEl() {
    return hf.q("#embedswf");
  }

  // La API de Ruffle del reproductor que ocupa el `<embed>` (o nada, si todavía no está).
  function api() {
    var e = stageEl();
    if (!e || typeof e.ruffle !== "function") return null;
    try {
      var p = e.ruffle();
      return p && typeof p.callExternalInterface === "function" ? p : null;
    } catch (err) {
      return null;
    }
  }

  // El `setpath` que la web espera encontrar en la etiqueta. En Flash de verdad lo traía el
  // reproductor (LiveConnect); en Ruffle hay que hablarle por su API, que es la que acaba llamando al
  // `ExternalInterface` del `.swf`. Si el navegador SÍ tiene Flash, la etiqueta ya trae su `setpath` y
  // no se toca nada.
  function bridge() {
    var e = stageEl();
    if (!e || e.setpath) return;
    e.setpath = function (path, load) {
      send(path, load);
      remember(path); // es la ruta que acaba de elegir (o de escribir): se guarda para la próxima
      state();
    };
  }

  function send(path, load) {
    var p = api();
    if (!p) {
      pending = { path: path, load: load };
      return false;
    }
    try {
      p.callExternalInterface("setPath", String(path == null ? "" : path), !!load);
      pending = null;
      return true;
    } catch (err) {
      pending = { path: path, load: load };
      return false;
    }
  }

  function noteText(t, kind) {
    if (!note) return;
    note.textContent = t;
    note.className = "hf-editor-note" + (kind ? " hf-editor-note--" + kind : "");
  }

  // El marco: se marca la propia etiqueta (el CSS le da el ancho de la columna y su borde) y se le
  // pone debajo una línea de estado. No se envuelve el reproductor en nada: moverlo lo reiniciaría.
  function stage() {
    var e = stageEl();
    if (!e) return;
    if (!note) {
      note = hf.el("p", { cls: "hf-editor-note", text: "Cargando el editor…" });
      e.parentNode.insertBefore(note, e.nextSibling);
    }
    document.documentElement.classList.add("hf-saveeditor");
  }

  // El emulador, cuando haga falta. Igual que en la ficha de juego: el del sitio si el ajuste dice
  // «web», y si no el más nuevo del CDN (`player.js` es quien sabe de eso).
  function ensure() {
    if (api()) return;
    if (hf.player && hf.player.withRuffle) hf.player.withRuffle(function () {
      linkIt();
      ready();
    });
  }

  function ready() {
    if (!api()) return;
    noteText(
      "Listo · el editor lee las partidas guardadas en este navegador" + (restored ? " · con tu última ruta" : ""),
      "ok"
    );
    if (pending) {
      var p = pending;
      pending = null;
      send(p.path, p.load);
    }
    if (!wantLink) {
      clearInterval(poll);
      poll = 0;
    }
  }

  // Los comentarios, fuera también aquí (pedido del usuario: en la web queda el título —«Si
  // necesitas ayuda, deja un comentario»— con el formulario y la lista vacíos debajo, o sea un
  // apartado que solo ocupa sitio). Se reutiliza lo del módulo de las páginas de texto: quita el
  // título con su ancla, el hueco del formulario y la lista, deja a salvo el anuncio que la web
  // meta dentro del envoltorio (no se toca nunca) y desarma su `onscreen("commentcontent")`.
  function noComments() {
    if (!hf.article || !hf.article.comments) return;
    try {
      hf.article.comments();
    } catch (e) {}
    if (hf.article.disarm) {
      try {
        hf.article.disarm();
      } catch (e) {}
    }
  }

  // Un repaso flojo hasta que el emulador está y no queda nada apuntado: para poner la línea de
  // estado, mandar la ruta que se quedara esperando y armar el enlace de la web (que puede llegar
  // tarde). Se para en cuanto está (o a los 30 s, con su aviso).
  function watch() {
    if (poll) return;
    var tries = 0;
    poll = setInterval(function () {
      noComments();
      linkIt();
      if (api() && !pending && !wantLink) {
        ready();
        return;
      }
      if (++tries > 75) {
        clearInterval(poll);
        poll = 0;
        noteText("El emulador no cargó: el editor no puede abrirse (míralo en el panel ⚡)", "bad");
      }
    }, 400);
  }

  function init() {
    if (!isEditor()) return;
    var b = tool();
    var hb = helpBox();
    b.classList.add("hf-tool");
    if (hb) hb.classList.add("hf-help");
    document.documentElement.classList.add("hf-saveeditor");
    selector(b);
    pathRow(b);
    linkRow(b);
    if (hb) {
      steps(hb);
      paint(hb);
      tools(hb);
      layout(b, hb);
    }
    bridge();
    stage();
    restore();
    noComments();
    ensure();
    watch();
  }

  hf.editor = {
    init: init,
    isEditor: isEditor,
    tool: tool,
    help: helpBox,
    send: send,
    link: link,
    api: api,
    comments: noComments,
    filter: draw,
    recall: recall,
    remember: remember
  };
})();

// ---------------------------------------------------------------------------------------------
// h-flash.com — EL FORMULARIO DE CONTACTO (`/plugin/feedback/`)
//
// La web lo escribe con su tabla de 2005: una columna de etiquetas de 120 px y otra con los campos
// al 98% del ancho de la página (un `<input>` de 1200 px para una URL), dos filas de relleno que
// solo llevan `&nbsp;`, la ayuda en un renglón suelto, y el captcha con su botón al final. En una
// página que es solo ese formulario, media pantalla se va en campos vacíos de lado a lado.
//
// Aquí no se toca ni un campo: los `name`, el `save(this)` de la web, su `autoform` (que
// preselecciona el «Type» del `?type=` de la URL y rellena el «URL» con el referrer) y el captcha
// se quedan exactamente como están —solo se **marcan** las filas y las celdas— y el CSS las
// reparte en una rejilla: los campos cortos en pareja, la ayuda al lado del correo y el mensaje a
// lo ancho. Las filas de relleno se van. Es idempotente (cada paso se busca a sí mismo).
// ---------------------------------------------------------------------------------------------
(function () {
  "use strict";
  var hf = window.hf;
  if (!hf || hf.feedback) return;

  // La página es el formulario. No hay otra en el sitio con ese `name`.
  function page() {
    return hf.q("form[name=feedbackform]");
  }

  // El captcha de Google mete un `<textarea>` escondido (`g-recaptcha-response`) que no es un campo
  // del formulario para nosotros: si no se aparta, esa fila se toma por una más.
  var CTRL = "input:not([type=hidden]):not([name^=g-recaptcha]), select, textarea:not([name^=g-recaptcha])";

  function init() {
    var f = page();
    if (!f) return;
    f.classList.add("hf-feedback");
    if (f.getAttribute("data-hf-feedback") === "1") return;
    f.setAttribute("data-hf-feedback", "1");

    var table = hf.q("table", f);
    if (table) table.classList.add("hf-formtable");

    hf.qa("tr", f).forEach(function (tr) {
      var cells = Array.prototype.slice.call(tr.children);
      var ctrl = hf.q(CTRL, tr);
      var th = cells.filter(function (c) {
        return c.tagName === "TH";
      })[0];
      var tds = cells.filter(function (c) {
        return c.tagName === "TD";
      });
      if (!ctrl && !th && !String(tr.textContent || "").trim()) {
        tr.classList.add("hf-row-spacer"); // las filas de relleno de la web (solo `<td>&nbsp;</td>`)
        return;
      }
      tr.classList.add("hf-row");
      if (th) {
        // fila de campo: la etiqueta de verdad y su control
        th.classList.add("hf-lab");
        tds.forEach(function (c) {
          c.classList.add("hf-field");
        });
        var name = ctrl && ctrl.getAttribute("name");
        if (name) tr.classList.add("hf-row-" + name);
        return;
      }
      // fila sin etiqueta: el primer `<td>` es el hueco de la web y el segundo trae el contenido
      // (la ayuda de la web o el captcha con su botón)
      if (tds[0]) tds[0].classList.add("hf-gap");
      if (tds[1]) tds[1].classList.add("hf-wide");
      tr.classList.add(hf.q(".g-recaptcha, input[type=button], input[type=submit], button", tr) ? "hf-row-send" : "hf-row-help");
    });
  }

  hf.feedback = { init: init, page: page };
})();

  // ---------------------------------------------------------------------------------------------
  // h-flash.com — LA PÁGINA DE AUTORES (`/author/`)
  //
  // ...y, de propina, el «SORT» de los dos listados de juegos que la web deja a medias: la ficha de
  // un autor (`/author/<nombre>/`) y la de una etiqueta (`/tag/<nombre>/`). Ver el final del
  // archivo: el desplegable ordena la lista de la propia página, sin mandarte al filtro avanzado.
//
// 190 autores en una lista de 2005. Cada uno es un `<a class="tag">` de 280 px —la web los pone
// cuatro por fila y deja 144 px muertos al final de cada una— con el avatar flotado a la izquierda,
// el nombre, el nombre japonés, el contador de juegos y los dos iconos del sprite (vistos y nota),
// y un `<br>` de relleno detrás que le añade una línea de aire. Y como la web llama `tag` a
// cualquier cosa que se pueda pulsar, la ficha se lleva además la **píldora** de nuestras etiquetas:
// un `border-radius` de 999 px sobre una tarjeta de 72 px y el texto a 11 px.
//
// Aquí no se mueve ni un enlace ni se reescribe una línea de la lista: sólo se **marcan** la lista,
// la letra de cada tramo y cada ficha —el aspecto va entero en el bloque 17 del CSS—, y el CSS las
// pone en un **índice a columnas**: cuatro columnas con su barra rosa en medio (`column-count` +
// `column-rule`), la letra de cada tramo como etiqueta dentro de la columna que le toca y la ficha
// como tarjeta de dos renglones (avatar, nombre y, debajo, el nombre japonés con las marcas). El
// `<br>` de relleno se va. Todo es idempotente (cada paso se busca a sí mismo), así que el vigilante
// del documento puede volver a llamarlo sin duplicar nada.
//
// Y encima, dos cosas nuestras:
//
//   · El **buscador**: la fila del título (`AUTORES`) tenía media pantalla vacía a su derecha, así
//     que ahí vive un campo que va acotando la lista mientras se escribe —por el nombre y por el
//     nombre japonés—, con su contador y su ✕ para limpiar. El que no encaja se esconde, y el tramo
//     de letra que se queda sin nadie se esconde también. La lista entera sigue en el documento (no
//     se destruye nada: sólo se oculta), así que vaciar el campo la devuelve tal cual estaba.
//
//   · El **paginador**: cuatro columnas de 190 autores son un rato de scroll, así que la lista se
//     parte en páginas de `12 filas × columnas` casillas —contando letras y fichas— y debajo de la
//     lista va el pie de página. Se corta **al principio de un tramo** (cuando a la página ya le
//     toca cerrarse y lo que viene es una letra), para que un tramo no se parta entre dos páginas.
//     Las columnas las dice el CSS (4, 3 o 2 según el ancho), así que al estrecharse la ventana el
//     paginador rearma solo las páginas, sin que haya que tocar nada aquí.
// ---------------------------------------------------------------------------------------------
(function () {
  "use strict";
  var hf = window.hf;
  if (!hf || hf.author) return;

  // Cuántas filas de fichas caben en cada columna antes de pasar de página. Con 4 columnas son 48
  // casillas por página: 190 autores y 28 letras caen en 5 páginas.
  var ROWS = 12;

  // La página es la LISTA de autores: el contenedor `.authorlist` con sus fichas (un enlace con la
  // foto). Se piden dos para no confundirla con la ficha de un autor suelto (`/author/<nombre>/`),
  // que tampoco trae `.authorlist`.
  function page() {
    var l = hf.q(".authorlist");
    if (!l || hf.qa("a img.avatar", l).length < 2) return null;
    return l;
  }

  // Comparar sin mayúsculas, sin acentos y sin el ruido del japonés: «Airo» encuentra a «airo», y
  // «maido» a «マイド». NFKC va primero para que las formas de ancho completo («ＡＩＲＯ», los ﾏｲﾄﾞ de
  // medio ancho) caigan en la misma letra que las normales; luego NFD para poder quitarles acentos.
  function fold(s) {
    return String(s == null ? "" : s)
      .normalize("NFKC")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\u200b-\u200d\ufeff]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  // El estado de cada lista (`st` la de autores, `ts` el índice de etiquetas): se monta una vez por
  // lista y se vuelve a leer en cada pasada (la web puede cambiar el trozo por AJAX).
  var st = null;
  var ts = null;

  // Las dos listas que se buscan y se paginan —la de autores (`/author/`) y el índice de etiquetas
  // (`/tags/list/`)— son la misma pieza con otro texto: de aquí salen el rótulo del contador, el
  // ejemplo del campo, el nombre de la lista para el lector de pantalla y las filas que caben en una
  // página (12 en los autores; 18 en las etiquetas, que son 680 y con 12 salían quince páginas).
  var KIND_AUTHORS = {
    what: "autores",
    ph: "Buscar autor…",
    aria: "Buscar autor",
    pager: "Páginas de autores",
    rows: 12,
    none: function (v) {
      return "Ningún autor coincide con «" + v + "».";
    }
  };

  var KIND_TAGS = {
    what: "etiquetas",
    ph: "Buscar etiqueta…",
    aria: "Buscar etiqueta",
    pager: "Páginas de etiquetas",
    rows: 18,
    none: function (v) {
      return "Ninguna etiqueta coincide con «" + v + "».";
    }
  };

  function mount(l, kind) {
    kind = kind || KIND_AUTHORS;
    // Si ya había un buscador o un paginador por ahí (una lista vieja, un repaso del vigilante), se
    // recogen antes: el paginador cuelga de fuera de la lista, así que hay que buscarlo aparte.
    hf.qa(".hf-abar").forEach(function (n) {
      n.remove();
    });
    hf.qa(".hf-apager").forEach(function (n) {
      n.remove();
    });

    var field = hf.el("label", { cls: "hf-afield" }, [
      hf.el("span", {
        cls: "hf-aglass",
        html:
          '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.6"></circle><path d="M15.5 15.5 21 21"></path></svg>'
      })
    ]);
    var input = hf.el("input", {
      cls: "hf-afilter",
      type: "search",
      placeholder: kind.ph,
      "aria-label": kind.aria,
      autocomplete: "off",
      spellcheck: "false"
    });
    var clear = hf.el("button", {
      cls: "hf-aclear",
      type: "button",
      title: "Limpiar la búsqueda",
      "aria-label": "Limpiar la búsqueda",
      hidden: true,
      html: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6 18 18M18 6 6 18"></path></svg>'
    });
    field.appendChild(input);
    field.appendChild(clear);

    var count = hf.el("span", { cls: "hf-acount", role: "status", "aria-live": "polite" });
    var bar = hf.el("div", { cls: "hf-abar", role: "search" }, [count, field]);

    // El sitio natural del buscador es la fila del título (que tenía el hueco vacío a la derecha). Si
    // esa página no lo trae, se pone justo encima de la lista.
    var host = hf.q(".mtitle");
    if (host && host.parentNode) {
      host.classList.add("hf-authorhead");
      host.appendChild(bar);
    } else {
      l.parentNode.insertBefore(bar, l);
    }

    // El paginador: va **fuera** de la lista (si fuera dentro, el `column-count` lo repartiría como
    // una ficha más, y el propio paginador se paginaría a sí mismo).
    var pager = hf.el("div", { cls: "hf-apager", role: "navigation", "aria-label": kind.pager });
    l.parentNode.insertBefore(pager, l.nextSibling);

    // El «no hay nada»: vive dentro de la lista (cruza las cuatro columnas) y sólo aparece cuando la
    // búsqueda no deja ni una ficha.
    var none = hf.el("div", { cls: "hf-anone", hidden: true });
    l.appendChild(none);

    var s = {
      l: l,
      kind: kind,
      bar: bar,
      input: input,
      clear: clear,
      count: count,
      none: none,
      pager: pager,
      cells: [],
      items: [],
      letters: [],
      pages: [],
      page: 0
    };

    input.addEventListener("input", function () {
      apply(s, true);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        e.preventDefault();
        if (s.input.value) {
          s.input.value = "";
          apply(s, true);
        } else {
          s.input.blur();
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
      }
    });
    clear.addEventListener("click", function () {
      s.input.value = "";
      apply(s, true);
      s.input.focus();
    });

    return s;
  }

  // Leer la lista: cada ficha, la letra de su tramo (por índice) y su texto ya plegado, más la lista
  // de casillas (letras y fichas en el orden del documento, que es el orden en que el CSS las reparte
  // por las columnas). El orden del documento es ese, así que basta con pasear a los hijos.
  function read(l) {
    var items = [];
    var letters = [];
    var cells = [];
    var idx = -1;
    Array.prototype.forEach.call(l.children, function (n) {
      if (!n.classList) return;
      if (n.classList.contains("hf-al-letter")) {
        letters.push(n);
        idx = letters.length - 1;
        n.hfIdx = cells.length;
        cells.push(n);
        return;
      }
      if (!n.classList.contains("hf-al-card")) return;
      n.hfIdx = cells.length;
      cells.push(n);
      var t = hf.q(".title", n);
      var j = hf.q(".fname", n);
      var name = t ? t.textContent : "";
      var jp = j ? j.textContent : "";
      items.push({ card: n, letter: idx, name: name.trim(), jp: jp.trim(), hay: fold(name + " " + jp) });
    });
    return { items: items, letters: letters, cells: cells };
  }

  // Cuántas casillas entran en una página: una fila por columna. Las columnas las pone el CSS, así que
  // se le preguntan a él: en pantalla ancha son 4 (48 casillas), 3 por debajo de 1.100 px y 2 por
  // debajo de 860. Si el CSS no dijera nada, se da por una columna.
  function pageSize(l, rows) {
    var n = parseInt(getComputedStyle(l).columnCount, 10);
    if (!n || n < 1) n = 1;
    return n * (rows || ROWS);
  }

  // Partir lo que se ve en páginas. Se cierra página cuando ya se llegó al tamaño y **lo que viene es
  // una letra**: así un tramo no se parte entre dos páginas y cada página empieza por su cabecera.
  // (Un tramo larguísimo podría no caber nunca; a partir del doble se corta donde toque, por si acaso.)
  function paginate(vis, size) {
    var pages = [];
    var cur = [];
    for (var i = 0; i < vis.length; i++) {
      if (cur.length >= size && vis[i].classList.contains("hf-al-letter")) {
        pages.push(cur);
        cur = [];
      }
      cur.push(vis[i]);
      if (cur.length >= size * 2) {
        pages.push(cur);
        cur = [];
      }
    }
    if (cur.length) pages.push(cur);
    return pages.length ? pages : [[]];
  }

  // Enseñar una página: todo lo que no esté en ella se marca `hf-apg` (el CSS lo esconde). Las
  // casillas llevan su índice (`hfIdx`, puesto al leer la lista), así que esto es una pasada y ya.
  function show(s) {
    var on = {};
    (s.pages[s.page] || []).forEach(function (c) {
      on[c.hfIdx] = true;
    });
    s.cells.forEach(function (c) {
      c.classList.toggle("hf-apg", !on[c.hfIdx]);
    });
  }

  // El pie de página: «‹ 1 2 3 4 5 ›», con la página en la que se está en acento. Con muchas páginas
  // (pantalla estrecha) se enseñan la primera, la última y las de alrededor, con puntos suspensivos.
  function paint(s) {
    var p = s.pager;
    var n = s.pages.length;
    // El pie sólo se rehace si de verdad cambia (número de páginas y página en la que se está). Sin
    // esta salida, repintarlo en cada pasada era una escritura en el DOM, y el vigilante del
    // documento (que mira los cambios de hijos) volvía a llamar a la pasada: un tic de 250 ms para
    // siempre —en la lista de autores se notaba poco, pero en el índice de etiquetas (680 fichas) no
    // dejaba respirar a la página—. Rehacerlo «cada vez que cambia algo» era de gratis.
    var key = n + ":" + s.page;
    if (p.hfKey === key) return;
    p.hfKey = key;
    p.innerHTML = "";
    if (n < 2) {
      p.hidden = true;
      return;
    }
    p.hidden = false;

    function button(text, page, cls) {
      var b = hf.el("button", { type: "button", cls: cls || "" });
      b.textContent = text;
      b.disabled = page < 0 || page > n - 1;
      if (b.disabled) {
        b.setAttribute("aria-disabled", "true");
      } else {
        if (page === s.page) b.setAttribute("aria-current", "page");
        b.addEventListener("click", function () {
          goto(s, page);
        });
      }
      return b;
    }

    p.appendChild(button("‹", s.page - 1, "hf-apage-prev"));
    var nums = [];
    if (n <= 9) {
      for (var i = 0; i < n; i++) nums.push(i);
    } else {
      nums.push(0);
      if (s.page > 2) nums.push(-1);
      for (var m = Math.max(1, s.page - 1); m <= Math.min(n - 2, s.page + 1); m++) nums.push(m);
      if (s.page < n - 3) nums.push(-1);
      nums.push(n - 1);
    }
    nums.forEach(function (i) {
      if (i < 0) {
        p.appendChild(hf.el("span", { cls: "hf-apage-info", text: "…" }));
        return;
      }
      p.appendChild(button(String(i + 1), i, i === s.page ? "hf-apage-on" : ""));
    });
    p.appendChild(button("›", s.page + 1, "hf-apage-next"));
  }

  // Ir a una página: repinta las casillas, el pie, y sube a la lista (que es lo que ha cambiado) si
  // se estaba más abajo. El buscador se queda donde está, que no se ha tocado.
  function goto(s, i) {
    if (i < 0 || i > s.pages.length - 1 || i === s.page) return;
    s.page = i;
    show(s);
    paint(s);
    var r = s.l.getBoundingClientRect();
    if (r.top < 0 || r.bottom > window.innerHeight) window.scrollTo(0, window.scrollY + r.top - 70);
  }

  // La pasada completa: filtrar (si hay algo escrito) y repartir en páginas. `resetPage` cuando el
  // buscador cambia, que entonces lo que se enseña es otra lista y se empieza por el principio.
  function apply(s, resetPage) {
    var tokens = fold(s.input.value).split(" ").filter(Boolean);
    var lit = [];
    var shown = 0;

    s.items.forEach(function (it) {
      var ok = true;
      for (var i = 0; i < tokens.length; i++) {
        if (it.hay.indexOf(tokens[i]) === -1) {
          ok = false;
          break;
        }
      }
      if (ok) {
        shown++;
        if (it.letter >= 0) lit[it.letter] = true;
      }
      it.card.classList.toggle("hf-aout", !ok);
    });

    // La letra de un tramo que se queda sin nadie se va con él.
    s.letters.forEach(function (el, i) {
      el.classList.toggle("hf-aout", !lit[i]);
    });

    if (resetPage) s.page = 0;
    var vis = s.cells.filter(function (c) {
      return !c.classList.contains("hf-aout");
    });
    s.pages = paginate(vis, pageSize(s.l, s.kind.rows));
    if (s.page > s.pages.length - 1) s.page = s.pages.length - 1;
    show(s);
    paint(s);

    // El contador y el aviso se escriben sólo si cambian: escribir el mismo texto vuelve a tocar el
    // DOM, y eso despertaba otra vez al vigilante (ver la nota del pie de páginas).
    var total = s.items.length;
    var txt = tokens.length ? shown + " de " + total : total + " " + s.kind.what;
    if (s.count.textContent !== txt) s.count.textContent = txt;
    s.none.hidden = !(tokens.length && !shown);
    if (!s.none.hidden) {
      var aviso = s.kind.none(s.input.value.trim());
      if (s.none.textContent !== aviso) s.none.textContent = aviso;
    }
    s.clear.hidden = !s.input.value;

    // Si se estaba mirando la lista mucho más abajo, se sube hasta el buscador para ver lo que ha
    // quedado (sólo cuando se está buscando, para no dar tirones mientras se baja la página).
    if (resetPage && tokens.length) {
      var r = s.bar.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight) window.scrollTo(0, window.scrollY + r.top - 16);
    }
  }

  // =============================================================================================
  // EL «SORT» DE LOS DOS LISTADOS DE JUEGOS (`/tag/<x>/` y `/author/<x>/`)
  // =============================================================================================
  // Los dos traen el mismo `<select>` «SORT» y el mismo defecto: al elegir una opción hace
  // `window.location = '/list/#tag=<id>&sort=<x>'`, así que te **saca de la página**, te cambia la
  // maqueta por la del filtro avanzado y, encima, el título lo ordena de la Z a la A. Aquí el
  // desplegable se queda donde está y ordena **la lista de esta página**, sin movernos: los juegos
  // de esa etiqueta se piden al catálogo de la web (`/list/dataapp.json`, el mismo que usa su
  // filtro avanzado) y las tarjetas se repintan en nuestra rejilla, de `PER_PAGE` en `PER_PAGE`,
  // con el pie de páginas de siempre. El catálogo queda en `sessionStorage` con la clave de la
  // propia web (`json_list`): cuesta una vez por sesión y, si su filtro avanzado ya lo había
  // cargado, ni eso.
  var CATALOG = "/list/dataapp.json";
  var CATALOG_KEY = "json_list";
  var PER_PAGE = 24;

  // Cómo se ordena cada opción del desplegable, y cómo se llama en la nota de debajo. Los títulos,
  // de la A a la Z —que es como se leen—; lo demás, lo más nuevo/jugado/valorado primero.
  var SORTS = {
    "": { by: "update", up: false, name: "fecha de actualización" },
    release: { by: "release", up: false, name: "fecha de publicación" },
    played: { by: "played", up: false, name: "veces jugado" },
    rating: { by: "rating", up: false, name: "valoración" },
    title: { by: "title", up: true, name: "título (A→Z)" }
  };

  // La etiqueta de la página: en esta web el autor es una etiqueta más, así que `#tag=74` sirve
  // para las dos. Va en el `onchange` del desplegable —lo que la web iba a mandar al filtro
  // avanzado— y, en la ficha de un autor, además en los iconos de su caja (`played_auth_74`).
  function listTag() {
    var sel = hf.q(".list_option select");
    var m = sel && /[#?&]tag=(\d+)/.exec(sel.getAttribute("onchange") || "");
    if (m) return m[1];
    var icon = hf.q("[id^=acount_auth_]") || hf.q("[id^=played_auth_]");
    m = icon && /auth_(\d+)/.exec(icon.id);
    return m ? m[1] : "";
  }

  // ¿La página es uno de esos dos listados? Hacen falta el desplegable, su columna de tarjetas y la
  // etiqueta. `sel.hfSort` es la marca de «ya es nuestro», para no engancharlo dos veces.
  function sortedList() {
    var sel = hf.q(".list_option select");
    var list = hf.q(".pageleft");
    if (!sel || !list || sel.hfSort) return null;
    if (!hf.q("a.gameboxmain2", list)) return null;
    if (!listTag()) return null;
    return { sel: sel, list: list };
  }

  // El catálogo entero (12.534 juegos con sus etiquetas, fechas, visitas y notas). Se pide una vez:
  // si ya está en la sesión —la web lo guarda ahí— se aprovecha, y si no, se pide y se guarda como
  // lo guarda ella. Quien lo pida mientras carga, espera.
  var catalogData = null;
  var catalogWaiting = [];

  function catalog(ok, fail) {
    if (catalogData) return ok(catalogData);
    catalogWaiting.push({ ok: ok, no: fail });
    if (catalogWaiting.length > 1) return;
    var raw = null;
    try {
      raw = sessionStorage.getItem(CATALOG_KEY);
    } catch (e) {}
    if (raw && raw.length > 1000) {
      try {
        return catDone(JSON.parse(raw));
      } catch (e) {}
    }
    hf.toast("Cargando la lista de juegos de la web…", 8000);
    fetch(hf.abs(CATALOG))
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      })
      .then(function (txt) {
        try {
          sessionStorage.setItem(CATALOG_KEY, txt);
        } catch (e) {}
        catDone(JSON.parse(txt));
      })
      .catch(function () {
        var w = catalogWaiting.splice(0);
        hf.toast("No se pudo cargar la lista de juegos de la web");
        w.forEach(function (x) {
          if (x.no) x.no();
        });
      });
  }

  function catDone(data) {
    catalogData = data;
    var w = catalogWaiting.splice(0);
    w.forEach(function (x) {
      x.ok(data);
    });
  }

  // El comparador de cada orden. Los títulos van con `fold` —el mismo que el buscador de autores—
  // para que las mayúsculas y los acentos no partan la lista en dos.
  function comparator(cfg) {
    if (cfg.by === "title") {
      var sgn = cfg.up ? 1 : -1;
      return function (a, b) {
        var x = fold(a.title);
        var y = fold(b.title);
        return (x < y ? -1 : x > y ? 1 : 0) * sgn;
      };
    }
    if (cfg.by === "rating" || cfg.by === "played") {
      return function (a, b) {
        if (cfg.by === "rating") {
          var ra = a.rated ? 1 : 0;
          var rb = b.rated ? 1 : 0;
          if (ra !== rb) return rb - ra; // los que no tienen nota, al final
        }
        return (Number(b[cfg.by]) || 0) - (Number(a[cfg.by]) || 0);
      };
    }
    var mul = cfg.up ? 1 : -1;
    return function (a, b) {
      var x = a[cfg.by];
      var y = b[cfg.by];
      // Las fechas que la web no sabe (`0001-01-01`) se van al final, se ordene como se ordene.
      if (cfg.by === "release") {
        var ex = !x || x === "0001-01-01";
        var ey = !y || y === "0001-01-01";
        if (ex !== ey) return ex ? 1 : -1;
      }
      if (x === y) return 0;
      return (x > y ? 1 : -1) * mul;
    };
  }

  // Una tarjeta igual que las de la web (misma maqueta: nuestra piel las viste), pero con los datos
  // del catálogo: la miniatura, el título y su trozo de detrás, los dos iconos del sprite y las
  // etiquetas.
  function nwSpan() {
    var s = document.createElement("span");
    s.className = "nw";
    s.title = "open in new window";
    s.setAttribute("onclick", "nw(this)");
    return s;
  }

  function card(a) {
    var title = hf.el("span", { cls: "title" });
    title.textContent = a.title || a.stitle || "";
    title.appendChild(nwSpan());
    var kids = [
      hf.el("img", { cls: "thumb", src: hf.abs(a.thumb), alt: a.stitle || a.title, loading: "lazy" }),
      title
    ];
    var rest = "";
    if (a.stitle && a.title && a.stitle.indexOf(a.title) === 0) rest = a.stitle.slice(a.title.length).trim();
    if (rest) kids.push(hf.el("span", { cls: "title2", text: rest }));
    kids.push(hf.el("span", { cls: "icon played", id: "played_list_" + a.id, aid: a.id }));
    kids.push(hf.el("span", { cls: "icon rank", aid: a.id }));
    var names = String(a.tags || "")
      .split(",")
      .map(function (n) {
        return n.trim();
      })
      .filter(Boolean);
    if (names.length) {
      kids.push(hf.el("br"));
      var box = hf.el("span", { cls: "tags", id: "tags_list_" + a.id });
      names.forEach(function (n) {
        box.appendChild(hf.el("span", { cls: "tag", text: n }));
      });
      kids.push(box);
    }
    return hf.el(
      "a",
      {
        cls: "gamebox gameboxmain2",
        href: hf.abs(a.path),
        tagid: a.tagsid,
        title: a.stitle || a.title || ""
      },
      kids
    );
  }

  // Repintar una página: las tarjetas (que van ANTES del pie, que ya está puesto) y la nota con lo
  // que se está viendo.
  function sortPaint(l) {
    hf.qa("a.gameboxmain2, .clear, .pagelink", l.list).forEach(function (n) {
      n.remove();
    });
    var from = (l.page - 1) * PER_PAGE;
    var frag = document.createDocumentFragment();
    l.items.slice(from, from + PER_PAGE).forEach(function (a) {
      frag.appendChild(card(a));
    });
    l.list.insertBefore(frag, l.pager);
    if (hf.grid) {
      hf.grid.layout();
      hf.grid.mark();
    }
    // Las tarjetas son nuevas: la insignia de «favorito de todos» (si toca) se vuelve a mirar
    // aquí mismo, sin esperar a que el vigilante del documento se dé cuenta del repintado.
    if (hf.crown) hf.crown.paintFavs();
    var pages = Math.max(1, Math.ceil(l.items.length / PER_PAGE));
    l.note.textContent =
      l.items.length +
      (l.items.length === 1 ? " juego" : " juegos") +
      " · " +
      SORTS[l.key].name +
      (pages > 1 ? " · " + l.page + "/" + pages : "");
    sortPager(l, pages);
  }

  // El pie de páginas, con el mismo aspecto que el de la lista de autores (`.hf-apager`).
  function sortPager(l, pages) {
    var p = l.pager;
    p.innerHTML = "";
    if (pages < 2) {
      p.hidden = true;
      return;
    }
    p.hidden = false;

    function button(text, page, cls) {
      var b = hf.el("button", { type: "button", cls: cls || "" });
      b.textContent = text;
      var off = page < 1 || page > pages;
      b.disabled = off;
      if (off) {
        b.setAttribute("aria-disabled", "true");
      } else {
        if (page === l.page) b.setAttribute("aria-current", "page");
        b.addEventListener("click", function () {
          sortGo(l, page);
        });
      }
      return b;
    }

    p.appendChild(button("‹", l.page - 1, "hf-apage-prev"));
    var nums = [];
    if (pages <= 9) {
      for (var i = 1; i <= pages; i++) nums.push(i);
    } else {
      nums.push(1);
      if (l.page > 3) nums.push(0);
      for (var m = Math.max(2, l.page - 1); m <= Math.min(pages - 1, l.page + 1); m++) nums.push(m);
      if (l.page < pages - 2) nums.push(0);
      nums.push(pages);
    }
    nums.forEach(function (i) {
      if (!i) {
        p.appendChild(hf.el("span", { cls: "hf-apage-info", text: "…" }));
        return;
      }
      p.appendChild(button(String(i), i, i === l.page ? "hf-apage-on" : ""));
    });
    p.appendChild(button("›", l.page + 1, "hf-apage-next"));
  }

  function sortGo(l, page) {
    var pages = Math.max(1, Math.ceil(l.items.length / PER_PAGE));
    page = Math.min(Math.max(1, page), pages);
    if (page === l.page) return;
    l.page = page;
    sortPaint(l);
    var r = l.list.getBoundingClientRect();
    if (r.top < 0) window.scrollTo(0, window.scrollY + r.top - 16);
  }

  // Ordenar: primero el catálogo (que puede tardar), después filtrar por la etiqueta de la página,
  // ordenar y pintar. Si el catálogo no llega, se avisa y no se toca nada.
  function sortApply(l, key) {
    if (!SORTS[key]) key = "";
    l.key = key;
    l.page = 1;
    catalog(function (data) {
      var want = "," + l.tag + ",";
      var items = data.filter(function (a) {
        return a && a.tagsid && ("," + a.tagsid + ",").indexOf(want) > -1;
      });
      items.sort(comparator(SORTS[key]));
      l.items = items;
      sortPaint(l);
      var r = l.list.getBoundingClientRect();
      if (r.top < 0) window.scrollTo(0, window.scrollY + r.top - 16);
    });
  }

  // Enganchar el desplegable: fuera el salto a `/list/`, dentro el nuestro. Una sola vez.
  function initSorted(l) {
    l.sel.hfSort = true;
    l.tag = listTag();
    if (l.sel.getAttribute("onchange")) l.sel.removeAttribute("onchange");
    // La nota y el pie se buscan antes de crearlos (y se tira lo que hubiera de una pasada
    // anterior): así, si la web reemplazara el desplegable y volviéramos a entrar, no se apilan.
    hf.qa(".hf-asort-note").forEach(function (n) {
      n.remove();
    });
    hf.qa(".hf-asort-pager").forEach(function (n) {
      n.remove();
    });
    l.note = hf.el("span", { cls: "hf-asort-note" });
    l.sel.parentNode.appendChild(l.note);
    l.pager = hf.el("div", { cls: "hf-apager hf-asort-pager", hidden: "hidden" });
    l.list.appendChild(l.pager);
    l.sel.addEventListener("change", function () {
      sortApply(l, l.sel.value);
    });
  }

  // El índice de etiquetas (`/tags/list/`): la misma clase de lista que la de autores —32 tramos de
  // letra y unos 680 enlaces, cada uno con su nombre, su contador y su nombre japonés—, así que se
  // lleva el mismo buscador y el mismo paginador, con su propio hueco de estado (`ts`). Se reconoce
  // por el contenedor de la web (`.doujinlist`, que sólo tiene esa página) y por tener un puñado de
  // enlaces dentro; si no, no es una lista y no se toca.
  function tagIndex() {
    var l = hf.q(".doujinlist");
    if (!l) return null;
    var n = 0;
    Array.prototype.forEach.call(l.children, function (c) {
      if (c.tagName === "A") n++;
    });
    return n >= 20 ? l : null;
  }

  function initTags(l) {
    l.classList.add("hf-tagindex");
    // La letra del tramo va como la de los autores (la misma pieza, otro contenedor) y cada etiqueta
    // es una ficha más del paginador. Todo idempotente: el vigilante puede volver a pasar.
    Array.prototype.forEach.call(l.children, function (c) {
      if (!c.classList) return;
      if (c.classList.contains("tline")) {
        c.classList.add("hf-al-letter");
        var h = hf.q("h2, .dhead", c);
        if (h) h.classList.add("hf-al-l");
      } else if (c.tagName === "A") {
        c.classList.add("hf-al-card");
      }
    });
    hf.qa(".hf-al-card", l).forEach(function (a) {
      var t = hf.q(".title", a);
      if (t && !a.title && t.scrollWidth > t.clientWidth + 1) a.title = t.textContent.trim();
    });
    if (!ts || !ts.bar.isConnected || ts.l !== l) ts = mount(l, KIND_TAGS);
    var data = read(l);
    ts.items = data.items;
    ts.letters = data.letters;
    ts.cells = data.cells;
    apply(ts, false);
  }

  function init() {
    var s = sortedList();
    if (s) initSorted(s);

    var tags = tagIndex();
    if (tags) initTags(tags);

    var l = page();
    if (!l) return;
    l.classList.add("hf-authorlist");

    // La letra de cada tramo (la «=», la «4», la «A»…): pasa a ser su etiqueta dentro de la columna.
    hf.qa(".tline", l).forEach(function (t) {
      t.classList.add("hf-al-letter");
      var h = hf.q("h2, .dhead", t);
      if (h) h.classList.add("hf-al-l");
    });

    // Cada autor: su tarjeta, y fuera el `<br>` de relleno del final.
    hf.qa("a", l).forEach(function (a) {
      if (!hf.q("img.avatar", a)) return;
      a.classList.add("hf-al-card");
      var last = a.lastElementChild;
      if (last && last.tagName === "BR") last.remove();
    });

    // En una ficha de cuatro columnas hay nombres que no caben y salen cortados con puntos
    // suspensivos: a ésos —y sólo a ésos, para no llenar de bocadillos los que ya se leen enteros— se
    // les pone el nombre completo en el `title`, que es el bocadillo del navegador.
    hf.qa(".hf-al-card", l).forEach(function (a) {
      var t = hf.q(".title", a);
      if (t && !a.title && t.scrollWidth > t.clientWidth + 1) a.title = t.textContent.trim();
    });

    if (!st || !st.bar.isConnected || st.l !== l) st = mount(l, KIND_AUTHORS);
    var data = read(l);
    st.items = data.items;
    st.letters = data.letters;
    st.cells = data.cells;
    apply(st, false);
  }

  // Al cambiar el ancho de la ventana cambian las columnas (y con ellas las casillas que caben en una
  // página), así que se rearma: la página actual se queda donde estaba, recortada si hiciera falta.
  var rt = 0;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      if (st && st.l.isConnected) apply(st, false);
      if (ts && ts.l.isConnected) apply(ts, false);
    }, 250);
  });

  hf.author = { init: init, page: page, tags: tagIndex };
})();

// ---------------------------------------------------------------------------------------------
// h-flash.com — LA CORONA (las etiquetas que más se usan y los favoritos de todos).
//
// Dos cosas que la web no cuenta y que se pueden saber con sus propios números:
//
// 1) **Las etiquetas de la cabecera.** Debajo del menú el sitio tiene dos filas de etiquetas
//    (`.line2` y `.line3`), elegidas a mano hace años: mezclan etiquetas con cuatro autores, no
//    dicen cuánto se usa ninguna y llevan sin tocarse desde entonces. Aquí esas dos filas pasan a
//    ser **las 26 etiquetas más usadas de la web** —los juegos que tiene cada una los publica el
//    propio índice de categorías del sitio (`/tags/`, cada ficha con su `[5119]`)—, y las **tres
//    primeras llevan corona**: oro, plata y bronce. El número de juegos, y el puesto, salen en el
//    bocadillo de cada píldora.
//    La lista que viaja en el script es una foto del día en que se hizo, así que, si tiene más de
//    una semana, se vuelve a leer el índice de la web en segundo plano y se repinta: los números
//    —y hasta el orden, si alguna vez cambia— se mantienen de verdad. Si la lectura falla (sin
//    red, la web cambia su HTML), se queda la foto y no pasa nada más.
//
// 2) **Los favoritos de todos.** La web tiene favoritos (`/fav/`), pero son **tuyos**: viven en una
//    cookie (`myfav`, en su `favorite.js`) y no hay ningún contador público de cuánta gente ha
//    marcado cada juego —el enlace del menú está, de hecho, comentado en su propio HTML—. Lo que
//    sí publica, juego por juego, es su **nota media y cuántos la han votado**
//    (`/plugin/rating/?act=get&id=…`, lo mismo que enseñan sus estrellas). Así que «el favorito de
//    todos» se calcula con esa nota **ponderada por el número de votos**: un 4,3 con 2.500 votos
//    manda sobre un 5,0 con tres —que es justo lo que le pasa a la lista MEJORES de la web, llena
//    de juegos con tres votos—. La lista (160 juegos, con su nota, sus votos y sus partidas) viene
//    calculada en el script y se marca en cada ficha: **corona** para los tres primeros y
//    **corazón** para el resto del club. En la ficha del juego, además, sale al lado del título con
//    su nombre.
//
// Nada de esto toca el HTML de la web más de lo que se ve: se cambian los enlaces de esas dos
// filas (que se pueden devolver tal cual desde el panel, `crownTags`) y se añade una insignia a las
// fichas (`crownFavs`).
// ---------------------------------------------------------------------------------------------
(function () {
  "use strict";
  var hf = window.hf;
  if (!hf || hf.crown) return;

  // ---- los datos ------------------------------------------------------------------------------
  // Las dos listas viajan como texto (una línea por fila) y se leen al arrancar: pesa menos que un
  // JSON y se lee de un vistazo en el fuente.
  //   etiquetas: nombre | dirección | juegos
  //   favoritos: dirección | título | nota | votos | partidas   (ya ordenados del primero al 160)
  var TAGS = "loop|loop|5119\nCG|cg|2590\ngame|game|2334\nblowjob|blowjob|1872\nPOV|pov|1673\nstory|story|1661\nundress|undress|1643\ndoggy|doggy|1533\ncowgirl|cowgirl|1443\npose|pose|1426\nloli|loli|1422\nfurry|furry|1390\nstocking|stocking|1124\ncreampie|creampie|1024\nanal|anal|966\ntoy|toy|820\n3D|3d|762\nsimulation|simulation|726\nbusty|busty|694\ndress up|dress-up|693\nmissionary|missionary|568\nfunny|funny|562\nfutanari|futanari|544\nBDSM|bdsm|537\nhandjob|handjob|504\ntentacle|tentacle|498\nmilkshake|milkshake|473\nmusic|music|469\nbreakout|breakout|454\ntitjob|titjob|450\nBig Ass|ass|443\nB2|b2|428\nschoolgirl|schoolgirl|427\nFacial|facial|422\nmasturbation|masturbation|407\nstep|step|384\naction|action|369\nlesbian|lesbian|332\ncross section|cross-section|320\ncatgirl|catgirl|248\nx-ray|x-ray|246\ndiscovery|discovery|239\nquiz|quiz|220\nRPG|rpg|217\nstretching|stretching|206\nLine art|line-art|199\nGallery|gallery|193\npixel|pixel|193";
  var FAVS = "/creambee-boozy-beach-wumpa/|Creambee - Boozy Beach Wumpa|4.56|566|660536\n/creambee-bangin-talent-show/|Creambee - Bangin' Talent Show|4.36|2538|2096683\n/peni-parker-wants-it-here/|Peni Parker Wants It Here|4.49|246|241452\n/minus-8-rosalina-1up/|Princess Rosalina 1UP|4.33|1071|903496\n/creambee-anaringu/|Creambee - anaRingu|4.31|1591|1491648\n/osake-riesz/|Osake Riesz|4.37|523|589651\n/creambee-cyber-gal-street/|Creambee - Cyber Gal Street|4.32|1078|592740\n/crimson-keep-chapter-1/|Crimson Keep Chapter 1|4.32|857|1263142\n/fever-x/|Fever X|4.32|787|837813\n/creambee-short-splootoon/|Creambee Short - Splootoon|4.29|1340|777717\n/creambee-halloweengirl/|Creambee - halloweEnGIRL|4.30|1033|806244\n/catgirl-christmas/|Catgirl Christmas|4.31|720|529615\n/super-smash-a-pokegirl-brawl/|super smash a pokegirl brawl|4.31|703|758200\n/zone-ankha/|Ankha|4.30|819|557147\n/minus-8-goomba/|minus 8 goomba sex music loop|4.32|588|849394\n/ahri-huntress-of-souls/|Ahri: Huntress of Souls|4.29|930|842105\n/slave-lords-of-the-galaxy/|Slave Lords Of The Galaxy|4.26|2093|2634645\n/pinktea-pussy-trainer/|Pussy Trainer|4.29|881|1314552\n/minus-8-yoshi-island/|Yoshi Island Animation|4.32|493|431537\n/creambee-short-miss-lucoas-summer-fun/|Creambee Short - Miss Lucoa's Summer Fun|4.30|615|640405\n/pet-dot-nyanko/|Pet Dot! Nyanko|4.34|378|404347\n/the-modifuckers-adult-parody/|the Modifuckers adult parody|4.33|387|315504\n/zone-wakfuck/|Wakfuck|4.31|434|337431\n/pac-ghost-dance-nude-seek/|Pac Ghost Dance Nude Seek ver|4.30|470|555056\n/natsume-2-poison-ivy-bootleg/|Natsume II - Poison Ivy Bootleg|4.54|134|106240\n/minus-8-ankha/|Ankha cowgirl show|4.30|465|483055\n/minus-8-temmie/|Temmie deep throat|4.32|384|381683\n/hentaikeygirl-origins/|HentaikeyGirl Origins|4.56|126|142849\n/minus-8-switch/|switch-chan rear|4.30|446|490035\n/creambee-pumpout/|Creambee's Pumpout|4.27|610|611239\n/futas-for-you/|futas for you|4.33|329|302164\n/dong134-bad-boossette/|bad Boossette|4.29|446|557196\n/royalty-ppppu-interactive/|Royalty PPPPU interactive|4.25|745|911400\n/wtdinner-a-new-fetish/|A New Fetish|4.31|361|183361\n/con-quest-poke-con/|Con-Quest! Poke-con|4.24|829|1277448\n/7-minutes-in-heaven/|7 Minutes in Heaven|4.28|471|421602\n/new-1up/|New 1UP|4.29|397|434757\n/minus-8-pac-ghost-dance/|Pac Ghost Dance|4.30|361|263222\n/fandeltales-scene-viewer/|FandelTales Scene Viewer|4.24|689|963180\n/ponka-anal-rodeo/|Ponka Anal Rodeo|4.29|377|468189\n/lolorin-lunch/|Lolorin lunch|4.32|295|261159\n/teras-castle/|Tera's Castle|4.32|290|323453\n/notboogie-lana/|Lana|4.25|551|855372\n/noko-noko-1up/|Noko Noko 1up|4.29|356|445315\n/whitemanes-inquisition/|Whitemane's Inquisition|4.29|353|247038\n/octopussy-tower/|Tower|4.30|322|436980\n/koooonsoft-witch-girl-eng/|WITCH GIRL english version|4.26|446|723565\n/shygirl-1up/|Shygirl 1up|4.30|299|439598\n/a-date-with-a-ghost-girl/|A date with: a Ghost girl|4.29|314|182693\n/crimson-keep-chapter-3/|Crimson Keep Chapter 3|4.28|329|420871\n/wtdinner-kris/|Kris|4.31|263|160307\n/beep-beep-im-a-sheep/|beep beep I'm a sheep|4.29|295|216092\n/bioshock-infinite-elizabeth/|Biocock Infinite Elizabeth|4.29|289|236629\n/cunning-little-girl-in-a-tight-spot-eng/|Cunning Little Girl in a Tight Spot English ver|4.19|912|2180050\n/sakura-dino-crisis-bootleg/|Sakura - Dino Crisis Bootleg|4.50|114|104541\n/m-s-a-2-rainbowround/|My Sex Anthro: RainbowRound!|4.26|342|288781\n/bubblegums-experiment/|Bubblegum's experiment|4.31|239|144074\n/minus-8-yoshi-island-nude/|Yoshi Island Nude Version|4.28|287|199975\n/pokemon-hex-maniac-blowjob/|Hexxx Maniac|4.31|236|251245\n/lanas-tentacruel-lust/|Lana's Tentacruel Lust|4.22|499|771856\n/minus-8-little-suzy/|#7 Little Suzy POV loop|4.33|207|267520\n/gardevoirs-embrace/|Gardevoir's Embrace|4.18|903|1016164\n/marcelines-help/|Marceline's help|4.29|258|144053\n/dong134-whislash/|Whislash|4.35|184|336359\n/crimson-keep-chapter-4/|Crimson Keep Chapter 4|4.30|239|391618\n/rottytops-raunchy-romp-xxx-parody-p2/|Rottytops' Raunchy Romp XXX Parody - Part 2|4.29|247|247911\n/zone-natsume-2/|Natsume 2|4.30|230|224101\n/wtdinner-amour-tv/|Amour TV|4.31|214|167052\n/sexually-instructing-my-corner-masturbating-student/|Sexually Instructing My Corner-masturbating Student|4.20|529|1203353\n/rockcandy-zoo-phobia/|Zoo-Phobia|4.20|514|902129\n/doctorcursed-zone-tan-2/|Zone-tan 2|4.23|364|674151\n/inspector-gadget-penny-loop/|#6 Inspector Gadget Penny|4.33|187|230993\n/martial-arts-queen-serene-eng/|Martial Arts Queen Serene English ver|4.20|487|697713\n/lalas-micro-h-game/|Lala's Micro-H Game|4.28|242|351793\n/who-framed-roger-rabbit/|Who Framed Roger Rabbit|4.28|239|204338\n/spectacular-spectrophilia/|Spectacular Spectrophilia|4.30|212|197210\n/sb-slime-chan/|Slime-chan|4.32|189|153138\n/mayuri-samas-body-lab-eng/|Mayuri-sama's body laboratry English ver|4.17|705|1014602\n/i-love-sex/|I LOVE SEX|4.28|231|59603\n/wtdinner-platinum-love/|Platinum Love|4.26|262|219997\n/minus-8-mina/|#9 Mina|4.32|183|220580\n/the-girl-who-assaults-older-men-eng/|The Girl Who Assaults Older Men and the Middle-aged Man with Special Powers English Ver|4.22|351|807601\n/hentai-ad-girl/|Hentai Ad Girl|4.24|296|31014\n/queen-hunt/|Queen Hunt|4.30|199|160343\n/zone-kill-la-kill-matoi-ryuko/|Matoi Ryuko|4.17|619|682080\n/creambee-double-trick-or-double-treat/|Creambee - Double Trick or Double Treat|4.19|452|270368\n/vampire-hunter-n-eng/|Vampire Hunter N English ver|4.23|298|676945\n/pizzacats-space-invaders/|Space Invaders|4.28|201|136551\n/shantae-x-risky-futa/|Shantae X Risky Futa|4.32|162|224388\n/minus-8-ankha-standing/|Ankha standing|4.32|158|211566\n/rad-poppo/|Rad Poppo|4.29|181|152659\n/princess-pipe-trapped/|Princess Pipe Trapped|4.10|3139|5382864\n/bandit-breeding/|Bandit Breeding|4.24|237|254903\n/shantae-and-risky-bouncy-titfun/|Shantae & Risky Bouncy Titfun!|4.35|137|185379\n/near-automat-uh/|NeaR: Automat-uh|4.21|290|423880\n/overthrow-the-great-demoness-eng/|Overthrow The Great Demoness! English ver|4.18|380|685870\n/overthrow-the-demon-queen-eng/|Overthrow! The Demon Queen English ver|4.12|1025|3046920\n/wtdinner-sonias-wild-area/|Sonia's Wild Area|4.38|121|128318\n/liru-the-werewolf-hentai/|Liru the werewolf hentai|4.31|158|173714\n/reiko-biker-girl/|Reiko - biker girl|4.34|139|139117\n/creambee-velmas-sticky-sap-trap/|Creambee: Velma's Sticky Sap Trap|4.25|211|347708\n/darla-dimple-minus-8/|#5 Darla Dimple loop|4.32|148|178918\n/kristal-the-teacher/|Kristal the teacher|4.33|142|150563\n/ppppu-interactive/|ppppU Interactive|4.17|380|1396447\n/character-ero-flash-anumber/|Character Ero Flash -Anumber-|4.43|100|230681\n/slave-lord/|Slave Lord|4.13|638|847545\n/wtdinner-dick-house/|Dick House|4.29|164|144096\n/demon-girl-the-showcase/|Demon Girl: The Showcase|4.31|149|185704\n/mistaken-for-a-battle-girls-object-of-vengeance-eng/|Mistaken for a Battle Girl's Object of Vengeance English ver|4.15|458|714257\n/pokemon-parody-double-trouble/|Pokemon Parody - Double Trouble|4.20|277|369733\n/ghost-wife-from-tv/|Ghost Wife from TV|4.28|169|101977\n/reaper-anal-rodeo/|Reaper Anal Rodeo|4.21|248|327772\n/miyui-my-neighbor-swordswoman-in-school/|Miyui ~My Neighbor Swordswoman in School~|4.13|567|1307025\n/miunus-8-sally-brown/|#8 Sally Brown POV LOOP|4.28|165|251425\n/zone-mini-flash-loops-panty-stocking-brief/|ZONE mini FLASH LOOPS Panty, Stocking & Brief|4.19|283|352567\n/little-audrey-minus-8/|#3 Little Audrey|4.31|140|194171\n/space-paws/|Space Paws|4.21|234|275923\n/miyui-my-neighbor-swordswoman-in-school-eng/|Miyui ~My Neighbor Swordswoman in School~ English ver|4.15|390|897163\n/magical-girl-buster-eng/|Magical Girl Buster Englisth Ver|4.18|290|653450\n/meet-and-fuck-kingdom/|Meet and Fuck Lavindor Kingdom|4.11|694|597422\n/kannas-school-preparation/|Kanna's school preparation|4.17|311|334444\n/minus-8-msf/|Mighty Sex Force!|4.30|142|155896\n/derpixon-the-classic/|The Classic|4.32|130|177826\n/sexually-instructing-my-corner-masturbating-student-eng/|Sexually Instructing My Corner-masturbating Student English Version|4.11|649|1519621\n/ppppu-x/|ppppU X|4.14|389|1044160\n/palutenas-cozy-bed/|Palutena's cozy bed|4.27|155|243722\n/koooonsoft-touching-tifa/|Touching Tifa: INTERACTIVE TOUCHING GAME 2|4.13|434|883719\n/creambee-open-bar/|CreamBee - Open Bar|4.14|383|846296\n/wtdinner-ace-tournament/|Ace Tournament|4.37|106|101396\n/you-cant-escape-this-little-devil-eng/|You Can't Escape This Little Devil English ver|4.08|1183|2335827\n/adult-lisas-horse-ride/|Adult Lisa's horse ride|4.27|154|201356\n/kingdom-hearts-darkness-of-light/|Kingdom Hearts: Darkness of Light|4.27|154|171871\n/sophie-toy-fillin/|Sophie Toy Fillin'|4.28|147|124131\n/crimson-keep-chapter-5/|Crimson Keep Chapter 5|4.28|146|217899\n/heiwachan-onion/|Onion-kun's Hentai Flash|4.14|371|706589\n/ppppu-xi/|ppppU Xi|4.11|547|571776\n/camp-wanna-fukk-mi/|Camp Wanna-Fukk-Mi|4.27|151|112878\n/foot-lift-samus-san/|foot lift Samus-san|4.16|296|378166\n/cinematic-of-bunni-and-caprice-partying-on/|Cinematic of Bunni and Caprice partying on!|4.29|137|179648\n/ng-gold-1/|NG Gold #1 Dr. Tannou|4.17|267|249042\n/hentaikey-girl-5/|HentaiKey Girl 5|4.13|393|502027\n/mio's-hentai-simulator/|Mio's Hentai Simulator|4.17|265|407763\n/doctorcursed-18-ych-project/|18+ YCH Project|4.07|1265|2492067\n/sawari-maintenance/|Sawari Maintenance|4.20|211|343365\n/charizard-smashing-samus/|Charizard Smashing Samus|4.18|237|236028\n/squeaky-squirrel-anal-rodeo/|Squeaky Squirrel Anal Rodeo|4.22|183|156924\n/fuuma-girl-maisa-eng/|Fuuma Girl Maisa English ver|4.16|271|639021\n/the-tales-of-st-clares/|The Tales of St. Clare's|4.26|148|193477\n/zone-faye-valentine/|Faye Valentine|4.31|120|132392\n/supersatanson-a-date-with-squidna/|A date with Squidna|4.30|122|101160\n/zone-jinxed/|Jinxed|4.29|126|158658\n/brothel-empire/|Brothel Empire|4.16|253|186502\n/shantae-pov-loop/|Shantae POV loop|4.22|172|279854\n/miyuki-the-android/|Miyuki the Android|4.31|116|134351\n/revenge-in-the-glory-hole/|Revenge in the glory hole|4.13|328|358451\n/fastlane-made-in-ware/|made in ware|4.30|120|117174\n/reimi-the-queen-of-martial-arts/|Reimi, The Queen Of Martial Arts|4.15|270|636292\n/crimson-keep-chapter-2/|Crimson Keep Chapter 2|4.12|358|438580\n/rockcandy-headlights-and-christmas-ham/|Headlights and Christmas Ham|4.30|119|223477\n/azumangadaioh-the-hentai-animation/|Azumangadaioh - the hentai animation|4.19|200|237920";

  var TAG_KEY = "hf.crowns.tags.v1"; // la foto del índice de la web, cuando se ha vuelto a leer
  var TAG_FRESH = 7 * 24 * 3600 * 1000; // una semana
  var TAG_KEEP = 60; // etiquetas que se guardan al refrescar (en la cabecera sólo caben 26)
  var ROWS = [13, 13]; // la web tiene dos filas de trece
  var CROWNS = 3; // las coronas de la web: oro, plata y bronce
  var CLUB = 160; // los favoritos de todos, hasta el puesto 160

  // La corona y el corazón se dibujan aquí (nada de depender de la fuente de emojis de cada
  // sistema): son dos `path` y el color lo pone el CSS con `currentColor`.
  var CROWN_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 20.5 2.6 6.5 7.5 10.5 12 4 16.5 10.5 21.4 6.5 22 20.5Z"/></svg>';
  var HEART_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21.2C4.3 15.4 2 11.6 2 8.4 2 5.4 4.3 3.2 7.1 3.2c1.8 0 3.5.9 4.9 2.5 1.4-1.6 3.1-2.5 4.9-2.5C19.7 3.2 22 5.4 22 8.4c0 3.2-2.3 7-10 12.8z"/></svg>';

  // ---- números en español ---------------------------------------------------------------------
  // Miles con punto, sin depender del idioma del navegador (`toLocaleString` cambia de forma según
  // el sistema, y aquí lo que se lee es lo que se escribe).
  function num(n) {
    n = Math.round(Number(n) || 0);
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function rate(r) {
    return (Number(r) || 0).toFixed(2).replace(".", ",");
  }

  // ---- las etiquetas --------------------------------------------------------------------------
  function parseTags(str) {
    return String(str || "")
      .split("\n")
      .map(function (l) {
        var p = l.split("|");
        return p.length >= 3 ? { name: p[0], slug: p[1], n: Number(p[2]) || 0 } : null;
      })
      .filter(Boolean);
  }

  var tagCache = null;

  function savedTags() {
    try {
      var j = JSON.parse(localStorage.getItem(TAG_KEY) || "null");
      if (j && j.list && j.list.length >= ROWS[0] + ROWS[1]) return j;
    } catch (e) {}
    return null;
  }

  function tags() {
    if (tagCache) return tagCache;
    var saved = savedTags();
    tagCache = saved
      ? saved.list.map(function (t) {
          return { name: t[0], slug: t[1], n: t[2] };
        })
      : parseTags(TAGS);
    return tagCache;
  }

  // El índice de categorías de la web: cada etiqueta es un `<a href="/tag/<dirección>/">` con su
  // nombre dentro de `.title` (el «abrir en otra ventana» cuelga de ahí) y sus juegos en el `title`
  // del contador (`title="5119 games"`). Se leen los tres y se ordenan por juegos.
  function readTags(html) {
    if (!html || html.length < 5000) return null;
    var re = /<a href="\/tag\/([^"]+)\/"[^>]*class="tag[^"]*">\s*<span class="title"[^>]*>([\s\S]*?)<span class="nw"[\s\S]*?<span class="archivecount" title="(\d+) games"/g;
    var out = [];
    var m;
    while ((m = re.exec(html))) {
      var name = m[2].replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
      if (name) out.push({ name: name, slug: m[1], n: Number(m[3]) || 0 });
    }
    if (out.length < ROWS[0] + ROWS[1]) return null;
    out.sort(function (a, b) {
      return b.n - a.n;
    });
    return out.slice(0, TAG_KEEP);
  }

  // Volver a leer el índice de la web: una vez por semana, en segundo plano, y sólo si hace falta.
  var refreshing = false;

  function refreshTags() {
    var saved = savedTags();
    if (saved && saved.ts && Date.now() - saved.ts < TAG_FRESH) return;
    if (refreshing) return;
    refreshing = true;
    fetch(hf.abs("/tags/"))
      .then(function (r) {
        return r.ok ? r.text() : null;
      })
      .then(function (html) {
        var list = readTags(html);
        refreshing = false;
        if (!list) return;
        try {
          localStorage.setItem(
            TAG_KEY,
            JSON.stringify({
              ts: Date.now(),
              list: list.map(function (t) {
                return [t.name, t.slug, t.n];
              })
            })
          );
        } catch (e) {}
        tagCache = list;
        paintHeader(true);
      })
      .catch(function () {
        refreshing = false;
      });
  }

  // ---- la cabecera ----------------------------------------------------------------------------
  // La píldora de una etiqueta: el enlace con su bocadillo y, en las tres primeras, la corona.
  function tagTitle(t, i) {
    var n = num(t.n) + (t.n === 1 ? " juego" : " juegos");
    if (i === 0) return "La etiqueta más usada de la web: " + n;
    if (i < CROWNS) return "La " + (i + 1) + "ª etiqueta más usada de la web: " + n;
    return n + " · la " + (i + 1) + "ª etiqueta de la web (de las que más se usan)";
  }

  function tagLink(t, i) {
    var a = hf.el("a", {
      cls: "hf-ct" + (i < CROWNS ? " hf-ct-" + (i + 1) : ""),
      href: hf.abs("/tag/" + t.slug + "/"),
      title: tagTitle(t, i)
    });
    if (i < CROWNS) a.appendChild(hf.el("span", { cls: "hf-crown", html: CROWN_SVG }));
    a.appendChild(document.createTextNode(t.name));
    return a;
  }

  function rowLines() {
    return [hf.q(".nav .line2"), hf.q(".nav .line3")];
  }

  // Devolver las filas tal y como las tenía la web (cada una se guarda la primera vez).
  function restoreHeader(lines) {
    lines.forEach(function (l) {
      if (!l || !l.dataset.hfTags) return;
      l.innerHTML = l.hfOrig || "";
      delete l.dataset.hfTags;
    });
  }

  function paintHeader(force) {
    var lines = rowLines();
    if (!lines[0] || !lines[1]) return;
    lines.forEach(function (l) {
      if (!l.hfOrig) l.hfOrig = l.innerHTML;
    });
    if (!hf.settings.crownTags) {
      restoreHeader(lines);
      return;
    }
    var list = tags().slice(0, ROWS[0] + ROWS[1]);
    var sig = list
      .map(function (t) {
        return t.slug + ":" + t.n;
      })
      .join(",");
    if (!force && lines[0].dataset.hfTags === sig && lines[1].dataset.hfTags === sig) return;
    var at = 0;
    lines.forEach(function (l, i) {
      var frag = document.createDocumentFragment();
      list.slice(at, at + ROWS[i]).forEach(function (t, k) {
        frag.appendChild(tagLink(t, at + k));
      });
      at += ROWS[i];
      l.textContent = "";
      l.appendChild(frag);
      l.dataset.hfTags = sig;
    });
  }

  // ---- los favoritos de todos -----------------------------------------------------------------
  function parseFavs(str) {
    var out = [];
    String(str || "")
      .split("\n")
      .forEach(function (l) {
        var p = l.split("|");
        if (p.length < 5 || !p[0]) return;
        out.push({
          path: p[0],
          title: p[1],
          rating: Number(p[2]) || 0,
          votes: Number(p[3]) || 0,
          plays: Number(p[4]) || 0,
          rank: out.length + 1
        });
      });
    return out.slice(0, CLUB);
  }

  var favCache = null;
  var favMap = null;

  function favs() {
    if (!favCache) favCache = parseFavs(FAVS);
    return favCache;
  }

  function favFor(id) {
    if (!favMap) {
      favMap = {};
      favs().forEach(function (f) {
        favMap[hf.idOf(f.path)] = f;
      });
    }
    return (id && favMap[id]) || null;
  }

  function favTitle(f) {
    var s =
      "★" +
      rate(f.rating) +
      " con " +
      num(f.votes) +
      (f.votes === 1 ? " voto" : " votos") +
      " · " +
      num(f.plays) +
      " partidas";
    return f.rank <= CROWNS
      ? "El favorito nº" + f.rank + " de la web (la nota de todos): " + s
      : "Favorito de todos (el nº" + f.rank + "): " + s;
  }

  function badge(f, big) {
    var crown = f.rank <= CROWNS;
    var b = hf.el("span", {
      cls: "hf-fav" + (crown ? " hf-fav-" + f.rank : "") + (big ? " hf-fav-big" : ""),
      title: favTitle(f),
      html: crown ? CROWN_SVG : HEART_SVG
    });
    if (big) {
      b.appendChild(
        hf.el("span", {
          cls: "hf-fav-txt",
          text: crown ? "Corona de la web · nº" + f.rank : "Favorito de todos"
        })
      );
    }
    return b;
  }

  // La insignia de una ficha. Va arriba a la derecha: la esquina de arriba a la izquierda es el
  // contador de la web (`.top`), la de abajo a la derecha nuestra marca de «ya lo abriste» y el
  // puesto de TOP/HOT también va a la izquierda.
  function markCard(a) {
    var f = favFor(hf.idOf(a.getAttribute("href")));
    var b = a.querySelector(".hf-fav");
    if (!f) {
      if (b) b.remove();
      return;
    }
    if (b) return;
    a.appendChild(badge(f));
  }

  function markCards() {
    hf.qa("a.gamebox[href]").forEach(markCard);
  }

  // Y en la ficha del juego, al lado del título (la web lo deja en las migas: `… > <h1>`).
  function markGame() {
    var f = favFor(hf.gameId());
    var h = hf.q("h1.dhead");
    var old = hf.q(".hf-fav-big");
    if (!f) {
      if (old) old.remove();
      return;
    }
    if (!h || (old && old.hfPath === f.path)) return;
    if (old) old.remove();
    var b = badge(f, true);
    b.hfPath = f.path;
    h.parentNode.insertBefore(b, h.nextSibling);
  }

  function forgetFavs() {
    hf.qa(".hf-fav").forEach(function (b) {
      b.remove();
    });
  }

  function paintFavs() {
    if (!hf.settings.crownFavs) {
      forgetFavs();
      return;
    }
    markCards();
    markGame();
  }

  // ---- arranque -------------------------------------------------------------------------------
  var wired = false;

  function init() {
    if (!document.body) return;
    paintHeader();
    paintFavs();
    if (wired) return;
    wired = true;
    refreshTags();
    hf.onChange(function (changed) {
      if (changed.indexOf("crownTags") >= 0) paintHeader(true);
      if (changed.indexOf("crownFavs") >= 0) paintFavs();
    });
  }

  hf.crown = {
    init: init,
    tags: tags,
    favs: favs,
    favFor: favFor,
    paintHeader: paintHeader,
    paintFavs: paintFavs,
    refresh: refreshTags
  };
})();

// ---------------------------------------------------------------------------------------------
// h-flash.com — EL FILTRO AVANZADO (`/list/`), que la web deja a medias.
//
// Es la página con la que se buscan juegos por título, etiquetas, orden y tamaño de página, y su
// guion (`advfilter.js`) funciona, pero los mandos están a medio enchufar:
//
// 1) **Los tres desplegables no hacen nada hasta pulsar Filter**: su `onchange` sólo apunta el
//    valor en el objeto (`window.list.sort = …`) y espera a que pulses el botón. Cambias el orden,
//    miras la lista… y sigue igual; parece que la web está rota (y en la práctica se acaba pulsando
//    Filter dos veces). Aquí cada cambio **aplica el filtro en el acto** y lo dice en un aviso
//    («Lista ordenada por veces jugado (de mayor a menor)»), que es lo que hace falta para saber
//    que se ha entendido.
//
// 2) **Su contador de páginas cuenta una de más**: `pagecount()` es
//    `parseInt(data.length / pagesize) + 1`, así que con 24 juegos y una página de 24 salen «2
//    páginas», la segunda vacía, y el desplegable «Go to Page» ofrece una página que no existe (y a
//    la que se puede ir: el recorte del final lo hace él mismo y deja la lista en blanco). Se
//    sustituye por la cuenta que toca —`Math.ceil`, y nunca menos de una— y el pie que ya estaba
//    pintado con el número viejo se corrige en su sitio, sin repintar la lista (repintar sube la
//    página al principio, y eso molesta cuando estás mirando el final de un listado).
//
// No se toca ni su HTML ni su filtrado: es su mismo objeto `list` y su mismo `filter_callback`, así
// que lo que salga por pantalla es lo de siempre, sólo que reaccionando.
// ---------------------------------------------------------------------------------------------
(function () {
  "use strict";
  var hf = window.hf;
  if (!hf || hf.filter) return;

  // Cómo se llama cada orden en el aviso, y cada sentido.
  var SORTS = {
    rating: "valoración",
    played: "veces jugado",
    title: "título",
    update: "fecha de actualización",
    release: "fecha de publicación"
  };
  var ORDERS = { desc: "de mayor a menor", asc: "de menor a mayor" };
  var SELECTS = ["sortselector", "orderselector", "pagesizeselector"];

  function win() {
    return hf.pageWin();
  }

  // El filtro de la web: su objeto `list`. Mientras no exista no hay nada que arreglar (lo crea su
  // guion cuando arranca, y hasta entonces la página ni tiene lista), así que se devuelve `null` y
  // la pasada de `boot.js` vuelve a entrar cuando el documento cambie.
  function filter() {
    var w = win();
    var l = w && w.list;
    if (!l || typeof l.filter !== "function") return null;
    if (!hf.q("#list") || !hf.q("#btnfilter") || !hf.q("#sortselector")) return null;
    return l;
  }

  // 1) La cuenta de páginas, la que toca.
  function fixCount(l) {
    if (l.hfPages) return;
    l.hfPages = true;
    l.pagecount = function () {
      var size = Number(this.pagesize) || 1;
      return Math.max(1, Math.ceil(this.data.length / size));
    };
    fixPager(l);
  }

  // El pie que ya está pintado (el de la primera carga, o el de un cambio anterior) se corrige sin
  // tocar la lista: fuera la última opción del «Go to Page» si sobra, y el «1/2» del recuento.
  function fixPager(l) {
    var pager = hf.q("#list .pagelink");
    if (!pager) return;
    var count = l.pagecount();
    var sel = hf.q("select", pager);
    if (sel) {
      while (sel.options.length > count) sel.remove(sel.options.length - 1);
    }
    var txt = hf.q("span", pager);
    if (txt) {
      var m = /^(\d+)\/(\d+)/.exec(txt.textContent);
      if (m && Number(m[2]) !== count) {
        txt.textContent = txt.textContent.replace(/^\d+\/\d+/, l.page + "/" + count);
      }
    }
  }

  // 2) Aplicar el filtro como lo hace su botón Filter: volver a la primera página y filtrar con el
  // mismo `filter_callback` (que es quien pinta, cuenta las páginas y deja el filtro en la
  // dirección de la página, para poder compartirla).
  function apply(msg) {
    var w = win();
    var l = filter();
    if (!l || typeof w.filter_callback !== "function") return;
    try {
      l.page = 1;
      l.filter(hf.q("#keyword") ? hf.q("#keyword").value : "", w.filter_callback);
      if (hf.crown) hf.crown.paintFavs();
      if (msg) hf.toast(msg);
    } catch (e) {
      hf.errors.push({ piece: "filter", error: String((e && e.message) || e) });
    }
  }

  function describe(l) {
    return "Lista ordenada por " + (SORTS[l.sort] || l.sort) + " (" + (ORDERS[l.order] || l.order) + ")";
  }

  // Los desplegables: un `change` más (el de la web sigue haciendo lo suyo, apuntar el valor, y va
  // antes porque es el que trae el HTML).
  function wire() {
    SELECTS.forEach(function (id) {
      var node = hf.q("#" + id);
      if (!node || node.hfWired) return;
      node.hfWired = true;
      node.addEventListener("change", function () {
        var l = filter();
        if (!l) return;
        if (id === "pagesizeselector") apply("Página de " + node.value + " juegos");
        else apply(describe(l));
      });
    });
  }

  function init() {
    var l = filter();
    if (!l) return;
    fixCount(l);
    fixPager(l);
    wire();
  }

  hf.filter = { init: init, apply: apply };
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
      safe("emptyZones", hf.emptyZones);
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
      safe("editor", function () {
        if (hf.editor) hf.editor.init();
      });
      safe("feedback", function () {
        if (hf.feedback) hf.feedback.init();
      });
      safe("author", function () {
        if (hf.author) hf.author.init();
      });
      safe("crown", function () {
        if (hf.crown) hf.crown.init();
      });
      safe("filter", function () {
        if (hf.filter) hf.filter.init();
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
    window.addEventListener("scroll", function () {
      hf.sweep();
      hf.emptyZones();
    }, { passive: true, capture: true });
    window.addEventListener("resize", function () {
      hf.sweep();
      hf.emptyZones();
      if (hf.skin) hf.skin.layoutAds();
    });
    setInterval(function () {
      hf.sweep();
      hf.emptyZones();
      if (hf.skin) hf.skin.layoutAds();
    }, 2500);
  });
})();

