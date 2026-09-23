// ==UserScript==
// @name         h-flash.com
// @version      0.1.123
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
  var css = "/* =============================================================================================\n   h-flash.com — el CSS del userscript (lo pega el compilador del laboratorio dentro del .user.js).\n\n   La web es del año 2005: 1280 px fijos, cabecera de 300 px con 180 de aire, tarjetas de 152 px,\n   rosa chicle y blanco nuclear. Aquí está todo lo que hace falta para ponerla al día sin tocar su\n   HTML ni su JS: los colores salen de variables (bloque 1), la maquetación fluida vive en el bloque\n   2 y todo lo demás es repintar la web pieza a pieza.\n\n   Los bloques de maquetación van dentro de `@media (min-width: 1025px)` a propósito: por debajo de\n   ese ancho manda `mobile.css` del propio sitio, que ya tiene su versión móvil y no hay por qué\n   pisarla (esto es para PC).\n\n   Índice\n     1. la piel (variables)\n     2. la página (fondo, tipografía, contenedores fluidos)\n     3. la cabecera (logo, fila de publicidad, navegación, buscador)\n     4. títulos de sección y migas\n     5. las rejillas de juegos (tarjetas)\n     6. la ficha de juego: el marco del reproductor\n     7. el controlador de la web y las cajas de arranque\n     8. la información del juego, etiquetas y relacionadas\n     9. listas, paginación y formularios\n    10. el pie\n    11. lo nuestro (panel, botón, avisos, marcas)\n    12. los iconos del sprite en la piel oscura\n    13. pantallas estrechas\n   ============================================================================================= */\n\n/* ---------------------------------------------------------------------------------------------\n   1. LA PIEL — todo el color sale de aquí\n   --------------------------------------------------------------------------------------------- */\nhtml.hf {\n  --hf-bg: #0b0d12;\n  --hf-bg2: #12151d;\n  --hf-card: 190px; /* lo cambia el panel; con 0 se deja el tamaño de la web */\n  --hf-bg3: #171b25;\n  --hf-line: #2a3140;\n  --hf-line2: #38414f;\n  --hf-text: #e9edf7;\n  --hf-dim: #98a2b8;\n  --hf-dim2: #6f7a91;\n  --hf-accent: #ff3fa4;\n  --hf-accent-2: #7a5cff;\n  --hf-accent-soft: rgba(255, 63, 164, 0.14);\n  --hf-ok: #4bd39b;\n  --hf-bad: #ff6b6b;\n  --hf-radius: 12px;\n  --hf-radius-s: 8px;\n  --hf-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);\n}\n\nhtml.hf.hf-skin-claro {\n  --hf-bg: #f5f6fa;\n  --hf-bg2: #ffffff;\n  --hf-bg3: #ffffff;\n  --hf-line: #e3e7f0;\n  --hf-line2: #cfd6e4;\n  --hf-text: #171b26;\n  --hf-dim: #5d687e;\n  --hf-dim2: #8791a6;\n  --hf-accent: #e0248c;\n  --hf-accent-2: #5b45d6;\n  --hf-accent-soft: rgba(224, 36, 140, 0.1);\n  --hf-shadow: 0 10px 26px rgba(20, 26, 45, 0.12);\n}\n\n/* ---------------------------------------------------------------------------------------------\n   2. LA PÁGINA\n   --------------------------------------------------------------------------------------------- */\nhtml.hf {\n  background: var(--hf-bg);\n}\n\nhtml.hf body {\n  background: var(--hf-bg) !important;\n  color: var(--hf-text) !important;\n  font-family: system-ui, -apple-system, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif !important;\n  text-align: start !important;\n  -webkit-font-smoothing: antialiased;\n}\n\nhtml.hf a {\n  color: var(--hf-text);\n}\n\nhtml.hf a:hover {\n  color: var(--hf-accent);\n}\n\nhtml.hf img {\n  border-color: var(--hf-line) !important;\n}\n\n/* El sitio fija 1280 px: en una pantalla grande queda un pasillo a los lados y entre 1025 y 1280\n   aparecía scroll horizontal. Aquí el ancho es el de la ventana, con un tope generoso. */\n@media (min-width: 1025px) {\n  html.hf body .pagebody {\n    width: auto !important;\n    max-width: 1720px;\n    margin: 0 auto !important;\n    padding-left: clamp(12px, 2vw, 28px);\n    padding-right: clamp(12px, 2vw, 28px);\n    box-sizing: border-box;\n  }\n  html.hf body .pagefoot {\n    width: auto !important;\n    max-width: 1720px;\n    margin: 18px auto 0 !important;\n    padding: 14px clamp(12px, 2vw, 28px);\n    box-sizing: border-box;\n  }\n  /* La ficha de juego (y cualquier página con columna lateral): la de la izquierda se come el\n     hueco que sobre y la de la derecha se queda en sus 300 px, sin `position:absolute` de por\n     medio (el sitio la saca del flujo y quedaba pegada arriba, encima de la cabecera). */\n  /* OJO: en esta web la CABECERA también es un `.pagebody` (lleva las dos clases), y si se pone en\n     fila se desmonta: el anuncio de la cabecera es un 728x90 que la web agranda con\n     `transform:scale(1.76)` para llenar los 1280 px, y en una fila encogida se sale de la pantalla.\n     Solo van en fila las páginas de contenido. */\n  html.hf.hf-split body .pagebody:not(.pagehead) {\n    display: flex !important;\n    flex-wrap: wrap;\n    align-items: flex-start;\n    gap: 20px;\n  }\n  /* la miga de pan (y cualquier otro hermano suelto) ocupa la fila entera, encima de las columnas */\n  html.hf.hf-split body .pagebody:not(.pagehead) > .location {\n    flex: 0 0 100%;\n  }\n  html.hf.hf-split .pageleft {\n    float: none !important;\n    width: auto !important;\n    /* la web la estira a 1500 px de alto porque su columna derecha va en `position:absolute` y\n       necesitaba sitio; con las dos columnas de verdad sobra ese hueco */\n    min-height: 0 !important;\n    flex: 1 1 0;\n    min-width: 0;\n    clear: none !important;\n  }\n  /* La de la derecha se queda en sus 300 px, pero sin los márgenes que la web le pone para sacarla\n     del flujo: `margin-left:976px` la empujaba fuera de la pantalla (y con ella la página entera,\n     porque eso alargaba el ancho desplazable). */\n  html.hf.hf-split .pageright {\n    float: none !important;\n    position: static !important;\n    width: 300px !important;\n    flex: 0 0 300px;\n    margin: 8px 0 0 !important;\n  }\n}\n\n/* ---------------------------------------------------------------------------------------------\n   3. LA CABECERA\n   --------------------------------------------------------------------------------------------- */\nhtml.hf body .pagehead {\n  display: block !important;\n  height: auto !important;\n  min-height: 0 !important;\n  padding: 10px clamp(12px, 2vw, 28px) 12px !important;\n  background: var(--hf-bg2) !important;\n  border-bottom: 1px solid var(--hf-line);\n  box-sizing: border-box;\n}\n\n/* El banner de la cabecera: la web sirve un 728x90 y lo agranda con `transform:scale(1.76)` en\n   línea (728*1.76 = 1281, los 1280 px del diseño original). Con el diseño fluido eso se sale de la\n   pantalla en ventanas medianas, así que `skin.js` recalcula la escala para que quepa justo (sin\n   taparlo nunca: se encoge, no se recorta) y reserva el alto que ocupa de verdad. */\n\nhtml.hf .pagehead .logo {\n  width: 100px;\n  height: 26px;\n  margin: 4px 0 0 0;\n  vertical-align: middle;\n}\n\n/* La fila de publicidad del pie de cabecera (enlaces de texto): la web la saca del flujo con\n   `position:absolute` y un margen negativo. Aquí vuelve al flujo, pequeña y sin estorbar. */\nhtml.hf #ads_a {\n  position: static !important;\n  width: auto !important;\n  height: auto !important;\n  margin: 0 0 0 14px !important;\n  display: inline-flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 4px 12px;\n  font-weight: 600 !important;\n  font-size: 12px;\n  vertical-align: middle;\n}\n\nhtml.hf #ads_a a {\n  margin: 0 !important;\n  background: transparent !important;\n  color: var(--hf-text) !important;\n  opacity: 0.82;\n}\n\nhtml.hf #ads_a a:hover {\n  opacity: 1;\n}\n\nhtml.hf #ads_a a:hover {\n  color: var(--hf-accent) !important;\n}\n\n/* la barra de navegación (tres líneas: secciones, etiquetas, etiquetas) */\nhtml.hf .nav {\n  margin: 10px 0 0 0 !important;\n  border-radius: var(--hf-radius) !important;\n  box-shadow: none !important;\n  background: var(--hf-bg3);\n  border: 1px solid var(--hf-line);\n  color: var(--hf-dim2) !important;\n  overflow: hidden;\n}\n\n/* Los enlaces de la web traen a veces un fondo blanco en línea (los del anuncio de arriba): en la\n   piel oscura se veían como cuadros blancos sueltos. El resalte al pasar el ratón lo ponen las\n   reglas de cada línea. */\nhtml.hf .nav a,\nhtml.hf .nav a:hover {\n  background: transparent !important;\n}\n\nhtml.hf .nav > div {\n  border-radius: 0 !important;\n}\n\nhtml.hf .nav .line1 {\n  background: transparent !important;\n  border-bottom: 1px solid var(--hf-line);\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 2px;\n  padding: 2px 6px;\n}\n\nhtml.hf .nav .line1 a {\n  padding: 8px 12px !important;\n  border-radius: var(--hf-radius-s) !important;\n  font-weight: 700 !important;\n  font-size: 13px;\n  letter-spacing: 0.03em;\n  color: var(--hf-text) !important;\n}\n\nhtml.hf .nav .line1 a:hover {\n  background: var(--hf-accent-soft) !important;\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .nav .line2 {\n  background: transparent !important;\n  border-bottom: 1px solid var(--hf-line);\n  padding: 5px 8px;\n}\n\nhtml.hf .nav .line2 a,\nhtml.hf .nav .line3 a {\n  padding: 3px 8px !important;\n  margin: 0 1px !important;\n  border-radius: 999px !important;\n  font-size: 12px;\n  color: var(--hf-dim) !important;\n  text-decoration: none !important;\n}\n\nhtml.hf .nav .line2 a:hover,\nhtml.hf .nav .line3 a:hover {\n  background: var(--hf-accent-soft) !important;\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .nav .line3 {\n  background: transparent !important;\n  border: none !important;\n  padding: 5px 8px;\n}\n\nhtml.hf .nav a.fav {\n  background: transparent !important;\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .nav a.fav:before {\n  filter: none;\n}\n\n/* el buscador */\nhtml.hf .navsearch {\n  margin: 0 6px 0 0 !important;\n  display: inline-flex;\n  align-items: center;\n}\n\nhtml.hf .navsearch .keyword {\n  width: 240px !important;\n  height: 32px !important;\n  padding: 0 12px !important;\n  border: 1px solid var(--hf-line2) !important;\n  border-right: none !important;\n  border-radius: var(--hf-radius-s) 0 0 var(--hf-radius-s) !important;\n  background: var(--hf-bg) !important;\n  background-image: none !important;\n  color: var(--hf-text) !important;\n  font-weight: 500 !important;\n  font-size: 13px;\n}\n\nhtml.hf .navsearch .keyword:focus {\n  outline: none;\n  border-color: var(--hf-accent) !important;\n}\n\nhtml.hf .navsearch .keyword::placeholder {\n  color: var(--hf-dim2);\n}\n\nhtml.hf .navsearch .submit {\n  width: auto !important;\n  height: 32px !important;\n  padding: 0 16px !important;\n  border: 1px solid var(--hf-accent) !important;\n  border-radius: 0 var(--hf-radius-s) var(--hf-radius-s) 0 !important;\n  background: var(--hf-accent) !important;\n  background-image: none !important;\n  color: #fff !important;\n  font-weight: 700 !important;\n  font-size: 12px !important;\n  letter-spacing: 0.06em;\n  cursor: pointer;\n}\n\nhtml.hf .navsearch .submit:hover {\n  filter: brightness(1.08);\n}\n\n/* ---------------------------------------------------------------------------------------------\n   4. TÍTULOS DE SECCIÓN Y MIGAS\n   --------------------------------------------------------------------------------------------- */\nhtml.hf .mtitle {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 10px;\n  margin: 14px 0 8px;\n  /* la web las pinta en rosa claro (`#FFE5F8`) a todo lo ancho: en la piel oscura, una franja\n     oscura con un filo de color */\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line) !important;\n  border-left: 3px solid var(--hf-accent) !important;\n  border-radius: var(--hf-radius-s) !important;\n  color: var(--hf-text) !important;\n  padding: 6px 12px !important;\n  height: auto !important;\n  line-height: 1.4 !important;\n  font-size: 13px !important;\n  font-weight: 700 !important;\n  letter-spacing: 0.04em;\n}\n\nhtml.hf .mtitle a {\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .dhead {\n  padding: 3px 0 3px 11px !important;\n  background: transparent !important;\n  color: var(--hf-text) !important;\n  border-left: 4px solid var(--hf-accent);\n  border-radius: 0 !important;\n  box-shadow: none !important;\n  font-weight: 800 !important;\n  font-size: 15px !important;\n  letter-spacing: 0.07em;\n  text-transform: uppercase;\n  display: inline-block;\n}\n\nhtml.hf h1.dhead {\n  font-size: 22px !important;\n  letter-spacing: 0.02em;\n  text-transform: none;\n}\n\nhtml.hf .gameinfo .dhead,\nhtml.hf .chesshead {\n  font-size: 12px !important;\n}\n\nhtml.hf .chead {\n  color: var(--hf-dim) !important;\n  font-size: 11px;\n  font-weight: 700;\n  letter-spacing: 0.06em;\n  padding: 4px 10px;\n  border: 1px solid var(--hf-line);\n  border-radius: 999px;\n  background: var(--hf-bg3);\n}\n\nhtml.hf .chead:hover {\n  color: var(--hf-accent) !important;\n  border-color: var(--hf-accent);\n}\n\nhtml.hf .location {\n  margin: 12px 0 6px;\n  color: var(--hf-dim) !important;\n  font-size: 12px;\n}\n\nhtml.hf .location a {\n  color: var(--hf-dim) !important;\n}\n\nhtml.hf .location a:hover {\n  color: var(--hf-accent) !important;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   5. LAS REJILLAS DE JUEGOS\n   --------------------------------------------------------------------------------------------- */\n@media (min-width: 1025px) {\n  /* La tarjeta de toda la vida: 152×200 fijos con una miniatura de 140. Ahora el ancho sale de\n     `--hf-card` (el panel) y la miniatura llena la tarjeta, así que la rejilla se recoloca sola. */\n  html.hf .gameboxlite {\n    width: var(--hf-card) !important;\n    height: auto !important;\n    margin: 5px 5px !important;\n    padding: 0 0 2px !important;\n    background: transparent !important;\n    text-align: center;\n    border-radius: var(--hf-radius);\n    overflow: hidden;\n    box-sizing: border-box;\n    transition: transform 0.12s ease, background 0.12s ease;\n  }\n\n  html.hf a.gameboxlite {\n    display: inline-block;\n    vertical-align: top;\n    float: left;\n  }\n\n  html.hf .gameboxlite:hover {\n    background: var(--hf-accent-soft) !important;\n    box-shadow: none !important;\n    transform: translateY(-2px);\n  }\n\n  html.hf .gameboxlite .thumb {\n    width: 100% !important;\n    height: auto !important;\n    aspect-ratio: 1 / 1;\n    object-fit: cover;\n    margin: 0 !important;\n    border: 1px solid var(--hf-line) !important;\n    border-radius: var(--hf-radius-s) !important;\n    background: var(--hf-bg3);\n    display: block !important;\n    float: none !important;\n  }\n\n  html.hf .gameboxlite:hover .thumb {\n    border-color: var(--hf-accent) !important;\n  }\n\n  html.hf .gameboxlite .title {\n    display: -webkit-box;\n    -webkit-line-clamp: 2;\n    -webkit-box-orient: vertical;\n    overflow: hidden;\n    height: 2.9em;\n    margin: 6px 4px 4px !important;\n    font-size: 12.5px;\n    font-weight: 600;\n    line-height: 1.45;\n    text-align: start;\n    color: var(--hf-text) !important;\n    word-break: break-word;\n  }\n\n  html.hf .gameboxlite:hover .title {\n    color: var(--hf-accent) !important;\n  }\n\n  /* el cuadro de arriba a la izquierda (contador y nota de la web) y el de rank de las listas */\n  html.hf .gameboxlite .top {\n    margin: 4px !important;\n    background: rgba(6, 8, 12, 0.72) !important;\n    border-radius: 999px !important;\n    padding: 2px 6px 0 !important;\n    z-index: 2;\n  }\n\n  /* Las tarjetas de fila (búsqueda, favoritos, aleatorios) */\n  html.hf .gamebox {\n    background: var(--hf-bg3) !important;\n    border: 1px solid var(--hf-line) !important;\n    border-radius: var(--hf-radius) !important;\n    padding: 8px 10px 8px 0 !important;\n    margin: 6px 0 !important;\n    box-sizing: border-box;\n  }\n\n  html.hf .gamebox:hover {\n    border-color: var(--hf-accent) !important;\n    box-shadow: var(--hf-shadow) !important;\n  }\n\n  html.hf .gamebox .thumb {\n    width: 112px !important;\n    height: 112px !important;\n    margin: 0 12px 0 8px !important;\n    border: 1px solid var(--hf-line) !important;\n    border-radius: var(--hf-radius-s) !important;\n    object-fit: cover;\n  }\n\n  html.hf .gamebox .title {\n    color: var(--hf-text) !important;\n    font-size: 15px;\n  }\n\n  html.hf .gamebox:hover .title {\n    color: var(--hf-accent) !important;\n  }\n\n  html.hf .gamebox .desc {\n    background: transparent !important;\n    color: var(--hf-dim) !important;\n    font-size: 12px;\n  }\n\n  html.hf .gamebox .no {\n    color: var(--hf-dim) !important;\n  }\n\n  html.hf .gamebox:hover .no {\n    color: var(--hf-accent) !important;\n  }\n}\n\nhtml.hf .gameboxlite .nw,\nhtml.hf .gamebox .nw {\n  opacity: 0.45;\n}\n\nhtml.hf .gameboxlite:hover .nw {\n  opacity: 0.9;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   6. LA FICHA DE JUEGO: NUESTRO MARCO\n   --------------------------------------------------------------------------------------------- */\nhtml.hf .hf-stage {\n  position: relative !important;\n  margin: 10px 0 0;\n  /* la web le pone un fondo blanco con una rejilla (`#gamecontainer`), y con el juego dentro se\n     colaba por los bordes: en la piel oscura el marco es negro */\n  background: #05070b !important;\n  border: 1px solid var(--hf-line);\n  border-radius: var(--hf-radius);\n  box-shadow: var(--hf-shadow);\n  overflow: hidden;\n  min-height: 280px;\n  /* El marco es una columna: la barra del reproductor arriba, en su propia franja, y el juego\n     centrado en lo que queda (así la barra no tapa nada del juego). */\n  display: flex;\n  flex-direction: column;\n  align-items: stretch;\n  justify-content: flex-start;\n}\n\n@media (min-width: 1025px) {\n  html.hf .hf-stage {\n    height: var(--hf-stage-h, 520px) !important;\n  }\n}\n\n/* El juego, dentro del marco. La web le pone el tamaño en los atributos `width`/`height` (es lo\n   que lee su controlador) y Ruffle lo pisa con `width:100%;height:100%` en línea, así que aquí\n   manda lo que calcula `fit()` en `--hf-game-w/h` — la caja más grande con la proporción REAL del\n   juego que cabe en el marco. Sin esas variables (por ejemplo si el juego aún no tiene medidas) se\n   deja el 100% de Ruffle. */\nhtml.hf .hf-stage #embedswf {\n  margin: 0 !important;\n  flex: 0 0 auto;\n  align-self: center;\n  max-width: 100%;\n  max-height: 100%;\n  width: var(--hf-game-w, 100%) !important;\n  height: var(--hf-game-h, 100%) !important;\n}\n\n/* La barra de debajo del reproductor (la web la usa para la nota, el «por defecto» y poco más) */\nhtml.hf .playerctrl {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 4px;\n  padding: 6px 8px !important;\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line);\n  border-top: none;\n  border-radius: 0 0 var(--hf-radius) var(--hf-radius);\n  font-size: 12px;\n  color: var(--hf-dim) !important;\n}\n\nhtml.hf .playerctrl .button1,\nhtml.hf .playerctrl .button2,\nhtml.hf .playerctrl .button3 {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 5px 9px !important;\n  border-radius: var(--hf-radius-s);\n  cursor: pointer;\n  color: var(--hf-dim) !important;\n  vertical-align: middle;\n}\n\nhtml.hf .playerctrl .button1:hover,\nhtml.hf .playerctrl .button2:hover,\nhtml.hf .playerctrl .button3:hover {\n  background: var(--hf-accent-soft) !important;\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .playerctrl .process_overlay,\nhtml.hf .playerctrl .process {\n  background: var(--hf-bg) !important;\n  border-color: var(--hf-line) !important;\n}\n\nhtml.hf .playerctrl .submenu {\n  background: var(--hf-bg2) !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  box-shadow: var(--hf-shadow);\n  padding: 4px !important;\n}\n\nhtml.hf .playerctrl .submenu span {\n  color: var(--hf-dim) !important;\n}\n\nhtml.hf .playerctrl .submenu span:hover {\n  background: var(--hf-accent-soft) !important;\n  color: var(--hf-accent) !important;\n}\n\n/* la barra nuestra: la franja de arriba del marco, dentro del flujo (no tapa el juego) */\nhtml.hf .hf-bar {\n  position: static;\n  order: -1;\n  flex: 0 0 auto;\n  z-index: 5;\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 6px;\n  padding: 6px 8px;\n  background: var(--hf-bg3);\n  border-bottom: 1px solid var(--hf-line);\n  pointer-events: none;\n}\n\nhtml.hf .hf-bar > * {\n  pointer-events: auto;\n}\n\nhtml.hf .hf-btn {\n  padding: 6px 11px;\n  border: 1px solid var(--hf-line2);\n  border-radius: 999px;\n  background: var(--hf-bg2);\n  color: var(--hf-text);\n  font: 600 12px system-ui, -apple-system, \"Segoe UI\", Roboto, Arial, sans-serif;\n  cursor: pointer;\n  backdrop-filter: blur(4px);\n}\n\nhtml.hf .hf-btn:hover {\n  border-color: var(--hf-accent);\n  color: var(--hf-accent);\n}\n\nhtml.hf .hf-btn-play {\n  background: var(--hf-accent);\n  border-color: var(--hf-accent);\n  color: #fff !important;\n}\n\nhtml.hf .hf-btn-play:hover {\n  filter: brightness(1.1);\n  color: #fff !important;\n}\n\nhtml.hf .hf-note {\n  margin-left: auto;\n  padding: 5px 11px;\n  border-radius: 999px;\n  background: var(--hf-bg2);\n  color: var(--hf-dim);\n  font-size: 12px;\n  backdrop-filter: blur(4px);\n}\n\nhtml.hf .hf-note--ok {\n  color: var(--hf-ok);\n}\n\nhtml.hf .hf-note--bad {\n  color: var(--hf-bad);\n}\n\n/* En pantalla completa el marco manda: el juego se ajusta a la ventana y la barra se queda arriba. */\nhtml.hf .hf-stage:fullscreen {\n  height: 100vh !important;\n  border: none;\n  border-radius: 0;\n  margin: 0;\n}\n\nhtml.hf .hf-stage:fullscreen #gamecontainer {\n  height: 100% !important;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   7. EL CONTROLADOR DE LA WEB Y LAS CAJAS DE ARRANQUE\n   --------------------------------------------------------------------------------------------- */\n/* Las dos cajas de «CLICK TO PLAY» (la del HFlashPlayer, que es un .exe para Windows, y la de\n   Ruffle) ocupan el sitio del juego. Si el juego arranca solo, sobran; si no arranca, se quedan\n   (bloque 12 las vuelve a enseñar). */\nhtml.hf.hf-autoplay .quickrun {\n  display: none !important;\n}\n\nhtml.hf.hf-autoplay.hf-show-fallbacks .quickrun {\n  display: block !important;\n}\n\nhtml.hf .quickrun {\n  position: absolute !important;\n  z-index: 4;\n  background: rgba(10, 13, 19, 0.9) !important;\n  border: 1px solid var(--hf-line2) !important;\n  border-radius: var(--hf-radius) !important;\n  color: var(--hf-text) !important;\n  padding: 12px 14px !important;\n  box-shadow: var(--hf-shadow);\n  top: 72px !important;\n  left: 50% !important;\n  transform: translateX(-50%);\n  width: 260px !important;\n  height: auto !important;\n}\n\nhtml.hf .quickrun .name {\n  font-weight: 700;\n}\n\n/* Cuando las cajas vuelven (el juego no arranca solo) salen las dos, y tal cual se pisarían: la\n   del HFlashPlayer a la izquierda y la de Ruffle a la derecha, las dos dentro del marco. */\nhtml.hf.hf-show-fallbacks .quickrun {\n  top: 88px !important;\n}\n\nhtml.hf #quickrun_hfplayer {\n  left: 27% !important;\n}\n\nhtml.hf #quickrun_ruffle {\n  left: 73% !important;\n}\n\nhtml.hf .quickrun .hint {\n  color: var(--hf-dim);\n  font-size: 11px;\n}\n\n/* la cruz de cerrar de la web va colocada con un `margin` de 300 px (para su caja de 600): aquí se\n   ancla en la esquina de la caja */\nhtml.hf .quickrun .close {\n  position: absolute;\n  top: 8px;\n  right: 10px;\n  margin: 0 !important;\n  width: 14px;\n  height: 14px;\n  z-index: 2;\n}\n\nhtml.hf .quickrun .button {\n  display: inline-block;\n  margin-top: 8px;\n  padding: 7px 14px;\n  border-radius: 999px;\n  background: var(--hf-accent);\n  color: #fff !important;\n  font-size: 11px;\n  font-weight: 800;\n  letter-spacing: 0.08em;\n}\n\nhtml.hf .quickrun .more a {\n  color: var(--hf-dim) !important;\n  font-size: 11px;\n}\n\nhtml.hf .quickrun .more a:hover {\n  color: var(--hf-accent) !important;\n}\n\n/* el «cargando…» de la web (miniatura + porcentaje) */\nhtml.hf .loadprocess {\n  background: rgba(10, 13, 19, 0.86) !important;\n  border: none !important;\n  color: var(--hf-text) !important;\n}\n\nhtml.hf.hf-autoplay .loadprocess .status {\n  color: var(--hf-dim);\n}\n\n/* ---------------------------------------------------------------------------------------------\n   8. LA INFORMACIÓN DEL JUEGO, ETIQUETAS Y RELACIONADAS\n   --------------------------------------------------------------------------------------------- */\nhtml.hf .gameinfo {\n  margin-top: 14px;\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line);\n  border-radius: var(--hf-radius);\n  padding: 14px 16px !important;\n  color: var(--hf-text) !important;\n}\n\nhtml.hf .gameinfo .infotable {\n  width: 100%;\n  border-collapse: collapse;\n}\n\nhtml.hf .gameinfo .infotable th {\n  width: 150px;\n  padding: 7px 10px 7px 0;\n  color: var(--hf-dim) !important;\n  font-weight: 600;\n  font-size: 12px;\n  text-align: start;\n  vertical-align: top;\n  border-top: 1px solid var(--hf-line);\n}\n\nhtml.hf .gameinfo .infotable td {\n  padding: 7px 0;\n  color: var(--hf-text) !important;\n  font-size: 13px;\n  vertical-align: top;\n  border-top: 1px solid var(--hf-line);\n}\n\nhtml.hf .gameinfo .infotable tr:first-child th,\nhtml.hf .gameinfo .infotable tr:first-child td {\n  border-top: none;\n}\n\nhtml.hf .gameinfo a {\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .gameinfo .link {\n  color: var(--hf-dim) !important;\n  font-size: 12px;\n  word-break: break-all;\n}\n\nhtml.hf .gameinfo .link:hover {\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .gameinfo .origdesc,\nhtml.hf .gameinfo .transfield {\n  color: var(--hf-dim) !important;\n  font-size: 13px;\n  line-height: 1.65;\n}\n\nhtml.hf .gameinfo .origdesc_btn,\nhtml.hf .gameinfo .items .btn {\n  display: inline-block;\n  margin-top: 6px;\n  padding: 5px 12px;\n  border: 1px solid var(--hf-line2);\n  border-radius: 999px;\n  color: var(--hf-dim) !important;\n  font-size: 11px;\n  font-weight: 700;\n  letter-spacing: 0.05em;\n  cursor: pointer;\n}\n\nhtml.hf .gameinfo .origdesc_btn:hover,\nhtml.hf .gameinfo .items .btn:hover {\n  border-color: var(--hf-accent);\n  color: var(--hf-accent) !important;\n}\n\n/* las etiquetas (fichas del juego y de las tarjetas) */\nhtml.hf .tag {\n  display: inline-block;\n  margin: 2px 4px 2px 0 !important;\n  padding: 3px 10px !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: 999px !important;\n  background: var(--hf-bg2) !important;\n  color: var(--hf-dim) !important;\n  font-size: 11px !important;\n  line-height: 1.6;\n}\n\nhtml.hf .tag:hover {\n  border-color: var(--hf-accent) !important;\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .tag .nw {\n  opacity: 0.5;\n}\n\nhtml.hf .icon.soundwarning {\n  color: var(--hf-bad) !important;\n  cursor: pointer;\n  font-size: 11px;\n  font-weight: 700;\n}\n\nhtml.hf .fav,\nhtml.hf .favorite {\n  color: var(--hf-accent) !important;\n}\n\n/* la columna de la derecha: relacionadas + el hueco de publicidad */\nhtml.hf #pageright_title .dhead {\n  margin-bottom: 6px;\n}\n\nhtml.hf .gameboxright {\n  display: block !important;\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius) !important;\n  padding: 8px !important;\n  margin: 8px 0 !important;\n  min-height: 0 !important;\n  box-sizing: border-box;\n}\n\nhtml.hf .gameboxright:hover {\n  border-color: var(--hf-accent) !important;\n}\n\nhtml.hf .gameboxright .thumb {\n  width: 72px !important;\n  height: 72px !important;\n  float: left !important;\n  margin: 0 10px 0 0 !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  object-fit: cover;\n}\n\n/* las miniaturas son imágenes claras (y mientras cargan, o si no cargan, se veían como cuadros\n   blancos sueltos por toda la página): fondo del tono de la piel */\nhtml.hf img.thumb,\nhtml.hf .thumb,\nhtml.hf .gamebox .thumb,\nhtml.hf .gameboxright .thumb,\nhtml.hf .gameboxlite .thumb {\n  background: var(--hf-bg2) !important;\n}\n\nhtml.hf .gameboxright .title {\n  margin: 0 0 4px !important;\n  color: var(--hf-text) !important;\n  font-size: 13px;\n  font-weight: 600;\n  line-height: 1.3;\n}\n\nhtml.hf .gameboxright:hover .title {\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .gameboxright .tags {\n  display: block !important;\n  max-width: none !important;\n  clear: both;\n  padding-top: 4px;\n}\n\nhtml.hf .gameboxright .tags .tag {\n  font-size: 10px !important;\n  padding: 2px 7px !important;\n}\n\nhtml.hf .gameboxright .authoricon {\n  width: 20px !important;\n  height: 20px !important;\n  border-radius: 999px;\n  vertical-align: middle;\n}\n\nhtml.hf #rightzone iframe {\n  border-radius: var(--hf-radius);\n  overflow: hidden;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   9. LISTAS, PAGINACIÓN Y FORMULARIOS\n   --------------------------------------------------------------------------------------------- */\n/* Los sombreados «2px 2px #ccc» de la web son de su estética de 2005: sobre el fondo oscuro\n   parecían una segunda copia fantasma de cada título y de cada tarjeta. Aquí sobra todo eso: el\n   relieve lo dan los bordes y el color de acento. */\nhtml.hf .dhead,\nhtml.hf .chead,\nhtml.hf .nav,\nhtml.hf .pagelink a,\nhtml.hf .pagelink a:hover,\nhtml.hf .tagslist a:hover,\nhtml.hf .authorlist a:hover,\nhtml.hf .gamebox:hover,\nhtml.hf .gameboxlite:hover,\nhtml.hf .gameboxmain:hover,\nhtml.hf .gameboxmain2:hover,\nhtml.hf .gameboxright:hover,\nhtml.hf .gameboxright2:hover {\n  box-shadow: none !important;\n}\n\nhtml.hf .pagelink {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 5px;\n  margin: 18px 0 6px;\n  font-size: 12px;\n}\n\nhtml.hf .pagelink .stat {\n  margin-right: 10px;\n  color: var(--hf-dim) !important;\n}\n\nhtml.hf .pagelink a,\nhtml.hf .pagelink .currentpage {\n  display: inline-block;\n  min-width: 30px;\n  padding: 5px 9px !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  background: var(--hf-bg3) !important;\n  color: var(--hf-dim) !important;\n  text-align: center;\n  text-decoration: none !important;\n}\n\nhtml.hf .pagelink a:hover {\n  border-color: var(--hf-accent) !important;\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .pagelink .currentpage {\n  background: var(--hf-accent) !important;\n  border-color: var(--hf-accent) !important;\n  color: #fff !important;\n  font-weight: 700;\n}\n\nhtml.hf .pagelink .more {\n  color: var(--hf-dim2) !important;\n}\n\nhtml.hf .gameboxlink {\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  color: var(--hf-text) !important;\n  padding: 4px 10px !important;\n}\n\nhtml.hf .gameboxlink:hover {\n  border-color: var(--hf-accent) !important;\n  background: var(--hf-accent-soft) !important;\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .gameboxlink.current {\n  background: var(--hf-accent-soft) !important;\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .info,\nhtml.hf .info2,\nhtml.hf .info3 {\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius-s) !important;\n  color: var(--hf-dim) !important;\n  padding: 8px 12px !important;\n  margin: 10px 0 !important;\n}\n\nhtml.hf .info a,\nhtml.hf .info2 a,\nhtml.hf .info3 a {\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .hf-list .thumblist,\nhtml.hf .thumblist {\n  min-height: 0 !important;\n}\n\n/* comentarios (los sirve comment.js de la web) */\nhtml.hf .comment {\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius) !important;\n  padding: 10px !important;\n  margin: 8px 0 !important;\n}\n\n/* El cajón de los comentarios y la barra de «jugado/valorado»: en la web son cajas de rosa claro\n   (`#FFE5F8`, `#FFE5FF`) y en la piel oscura cantaban como un parche (además de quedar grandes y\n   vacías mientras no cargan los comentarios). */\nhtml.hf .commentfield,\nhtml.hf .rankinfo {\n  background: var(--hf-bg3) !important;\n  border: 1px solid var(--hf-line) !important;\n  border-radius: var(--hf-radius) !important;\n  color: var(--hf-dim) !important;\n  padding: 12px 14px !important;\n}\n\nhtml.hf .rankinfo {\n  padding: 6px 12px !important;\n  margin: 8px 0 !important;\n  font-size: 12px;\n}\n\nhtml.hf .commentfield .commentlist,\nhtml.hf .commentform {\n  color: var(--hf-dim) !important;\n}\n\nhtml.hf .commentform .name,\nhtml.hf .commentform .text {\n  color: var(--hf-dim) !important;\n}\n\nhtml.hf .comment .text,\nhtml.hf .comment .name,\nhtml.hf .comment .date {\n  color: var(--hf-text) !important;\n}\n\nhtml.hf .comment .name {\n  font-weight: 700;\n}\n\nhtml.hf .comment .date {\n  color: var(--hf-dim2) !important;\n  font-size: 11px;\n}\n\nhtml.hf textarea,\nhtml.hf input[type=\"text\"],\nhtml.hf input[type=\"password\"],\nhtml.hf input[type=\"email\"],\nhtml.hf select {\n  background: var(--hf-bg2) !important;\n  border: 1px solid var(--hf-line2) !important;\n  border-radius: var(--hf-radius-s) !important;\n  color: var(--hf-text) !important;\n  padding: 6px 10px !important;\n}\n\nhtml.hf select {\n  padding: 4px 8px !important;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   10. EL PIE\n   --------------------------------------------------------------------------------------------- */\nhtml.hf .pagefoot {\n  border-top: 1px solid var(--hf-line) !important;\n  color: var(--hf-dim2) !important;\n  font-size: 12px;\n  background: var(--hf-bg2) !important;\n  border-radius: var(--hf-radius) var(--hf-radius) 0 0;\n}\n\nhtml.hf .pagefoot a {\n  color: var(--hf-dim) !important;\n}\n\nhtml.hf .pagefoot a:hover {\n  color: var(--hf-accent) !important;\n}\n\nhtml.hf .pagefoot .fhead {\n  color: var(--hf-dim2) !important;\n  font-weight: 700;\n  letter-spacing: 0.06em;\n}\n\nhtml.hf .pagefoot .friendlinks a {\n  font-size: 11px;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   11. LO NUESTRO\n   --------------------------------------------------------------------------------------------- */\nhtml.hf .hf-settings-btn {\n  position: fixed;\n  right: 16px;\n  bottom: 16px;\n  z-index: 2147483000;\n  width: 44px;\n  height: 44px;\n  border: 1px solid var(--hf-line2);\n  border-radius: 999px;\n  background: var(--hf-bg2);\n  color: var(--hf-accent);\n  font-size: 20px;\n  line-height: 1;\n  cursor: pointer;\n  box-shadow: var(--hf-shadow);\n}\n\nhtml.hf .hf-settings-btn:hover {\n  border-color: var(--hf-accent);\n}\n\nhtml.hf .hf-settings-btn.hf-on {\n  background: var(--hf-accent);\n  color: #fff;\n}\n\nhtml.hf .hf-panel {\n  position: fixed;\n  right: 16px;\n  bottom: 70px;\n  z-index: 2147483001;\n  width: 372px;\n  max-height: min(78vh, 720px);\n  overflow: auto;\n  background: var(--hf-bg2);\n  border: 1px solid var(--hf-line2);\n  border-radius: 14px;\n  box-shadow: var(--hf-shadow);\n  color: var(--hf-text);\n  font: 13px system-ui, -apple-system, \"Segoe UI\", Roboto, Arial, sans-serif;\n  text-align: start;\n}\n\nhtml.hf .hf-panel[hidden] {\n  display: none !important;\n}\n\nhtml.hf .hf-panel .hf-head {\n  position: sticky;\n  top: 0;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 12px 14px;\n  background: var(--hf-bg2);\n  border-bottom: 1px solid var(--hf-line);\n  font-size: 14px;\n}\n\nhtml.hf .hf-panel .hf-head b {\n  letter-spacing: 0.02em;\n}\n\nhtml.hf .hf-panel .hf-x {\n  border: none;\n  background: transparent;\n  color: var(--hf-dim);\n  font-size: 15px;\n  cursor: pointer;\n}\n\nhtml.hf .hf-panel .hf-x:hover {\n  color: var(--hf-accent);\n}\n\nhtml.hf .hf-panel .hf-body {\n  padding: 6px 14px 14px;\n}\n\nhtml.hf .hf-panel .hf-cap {\n  margin: 14px 0 6px;\n  color: var(--hf-accent);\n  font-size: 11px;\n  font-weight: 800;\n  letter-spacing: 0.1em;\n  text-transform: uppercase;\n}\n\nhtml.hf .hf-panel .hf-row {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n  margin: 6px 0;\n}\n\nhtml.hf .hf-panel .hf-row-lab {\n  color: var(--hf-text);\n  font-size: 12.5px;\n}\n\nhtml.hf .hf-panel .hf-hint {\n  display: block;\n  margin: 4px 0 8px;\n  color: var(--hf-dim2);\n  font-size: 11.5px;\n  line-height: 1.55;\n}\n\nhtml.hf .hf-panel .hf-seg {\n  display: inline-flex;\n  border: 1px solid var(--hf-line2);\n  border-radius: 999px;\n  overflow: hidden;\n}\n\nhtml.hf .hf-panel .hf-segb {\n  padding: 5px 11px;\n  border: none;\n  border-right: 1px solid var(--hf-line2);\n  background: transparent;\n  color: var(--hf-dim);\n  font: 600 12px inherit;\n  cursor: pointer;\n}\n\nhtml.hf .hf-panel .hf-segb:last-child {\n  border-right: none;\n}\n\nhtml.hf .hf-panel .hf-segb.hf-on {\n  background: var(--hf-accent);\n  color: #fff;\n}\n\nhtml.hf .hf-panel .hf-select {\n  padding: 5px 8px;\n  border: 1px solid var(--hf-line2);\n  border-radius: var(--hf-radius-s);\n  background: var(--hf-bg);\n  color: var(--hf-text);\n  font: 12px inherit;\n}\n\nhtml.hf .hf-panel .hf-sw {\n  accent-color: var(--hf-accent);\n  width: 15px;\n  height: 15px;\n}\n\nhtml.hf .hf-panel .hf-btn {\n  background: var(--hf-bg3);\n  color: var(--hf-text);\n}\n\nhtml.hf .hf-panel .hf-foot {\n  padding: 10px 14px 14px;\n  border-top: 1px solid var(--hf-line);\n  color: var(--hf-dim2);\n  font-size: 11px;\n}\n\nhtml.hf .hf-toast {\n  position: fixed;\n  left: 16px;\n  bottom: 16px;\n  z-index: 2147483002;\n  max-width: 380px;\n  padding: 9px 14px;\n  border: 1px solid var(--hf-line2);\n  border-radius: 999px;\n  background: rgba(12, 15, 21, 0.94);\n  color: var(--hf-text);\n  font: 12.5px system-ui, -apple-system, \"Segoe UI\", Roboto, Arial, sans-serif;\n  box-shadow: var(--hf-shadow);\n  opacity: 0;\n  transform: translateY(6px);\n  transition: opacity 0.16s ease, transform 0.16s ease;\n  pointer-events: none;\n}\n\nhtml.hf.hf-skin-claro .hf-toast {\n  background: rgba(255, 255, 255, 0.97);\n}\n\nhtml.hf .hf-toast.hf-on {\n  opacity: 1;\n  transform: translateY(0);\n}\n\nhtml.hf .hf-seen-badge {\n  position: absolute;\n  right: 6px;\n  bottom: 40px;\n  z-index: 3;\n  padding: 1px 6px;\n  border-radius: 999px;\n  background: var(--hf-ok);\n  color: #04140d;\n  font: 800 11px system-ui, -apple-system, \"Segoe UI\", Roboto, Arial, sans-serif;\n  line-height: 1.4;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   12. LOS ICONOS DEL SPRITE EN LA PIEL OSCURA\n   --------------------------------------------------------------------------------------------- */\n/* Los iconos de la web salen todos del mismo sprite, dibujados en negro para un fondo blanco. En la\n   piel oscura se invierten (menos el logotipo y las estrellas del voto, que ya se ven bien). */\nhtml.hf-skin-cueva .played:before,\nhtml.hf-skin-cueva .rank:before,\nhtml.hf-skin-cueva .myrating:before,\nhtml.hf-skin-cueva .soundwarning:before,\nhtml.hf-skin-cueva .archives:before,\nhtml.hf-skin-cueva .offlineplayer:before,\nhtml.hf-skin-cueva .ruffle:before,\nhtml.hf-skin-cueva .lastupdate,\nhtml.hf-skin-cueva .nw,\nhtml.hf-skin-cueva .closeicon,\nhtml.hf-skin-cueva .quickrun .close,\nhtml.hf-skin-cueva .playerctrl .button1:before,\nhtml.hf-skin-cueva .playerctrl .button2:before,\nhtml.hf-skin-cueva .playerctrl .button3:before,\nhtml.hf-skin-cueva .download .init,\nhtml.hf-skin-cueva .download .ready,\nhtml.hf-skin-cueva .download .close,\nhtml.hf-skin-cueva .download .raw,\nhtml.hf-skin-cueva .transfield .google_translate_button,\nhtml.hf-skin-cueva .comment .reply,\nhtml.hf-skin-cueva .comment .thumbup,\nhtml.hf-skin-cueva .comment .thumbdown,\nhtml.hf-skin-cueva .gameinfo .items .btn.expand,\nhtml.hf-skin-cueva .gameinfo .items .btn.collapse {\n  filter: invert(1);\n}\n\n/* ---------------------------------------------------------------------------------------------\n   13. PANTALLAS ESTRECHAS\n   --------------------------------------------------------------------------------------------- */\n@media (max-width: 1024px) {\n  /* Por aquí manda `mobile.css` del sitio. Lo nuestro se queda en los colores y en las piezas\n     propias (panel, avisos, marco del reproductor), que no existen en su versión. */\n  html.hf .hf-panel {\n    right: 8px;\n    left: 8px;\n    width: auto;\n    bottom: 66px;\n    max-height: 72vh;\n  }\n  html.hf .hf-settings-btn {\n    right: 10px;\n    bottom: 10px;\n  }\n  html.hf .hf-stage {\n    margin: 8px 0;\n  }\n}\n";
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
// Todo lo demás (la piel, el reproductor, las rejillas, el panel) vive en sus módulos y se cuelga
// de aquí. Los ajustes del usuario están en `localStorage["hf.settings.v1"]`: nada de esto sale del
// navegador ni entra en el script compilado.
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
    // qué hacer al abrir una ficha de juego: "auto" arranca solo, "click" deja los botones de la web,
    // "off" no toca nada
    play: "auto",
    // emulador con el que arrancar los juegos: "web" (el que trae el propio sitio, Ruffle 0.6.0),
    // "nuevo" (el Ruffle más reciente, del CDN oficial)
    emulator: "web",
    // marcar en los listados los juegos ya abiertos (historial en este navegador)
    seen: true,
    // atajos de teclado en las fichas de juego (F pantalla completa, R recargar, +/- zoom)
    keys: true
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
  var AD_HOSTS = /(adglare|sadbaguette|juicyads|exoclick|acscdn|trafficjunky|adnium|realsrv|tsyndicate|clickadu|popads|hilltopads)/i;
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

  // --- el banner de la cabecera --------------------------------------------------------------
  // La web mete en la cabecera un 728x90 y lo agranda con `transform:scale(1.76)` en línea, porque
  // su diseño mide 1280 px justos y 728*1.76 = 1281. Con la maquetación fluida eso es un desborde
  // en cuanto la ventana baja de ~1280: aquí se recalcula la escala para que quepa justo en el
  // hueco que hay, y se reserva el alto que ocupa de verdad (el `transform` no cambia la caja de
  // maquetación, así que sin ese margen el banner se montaría encima de la ficha del juego).
  // Nada se recorta: el anuncio se ve entero, solo un poco más pequeño cuando no cabe.
  var adBase = 0;
  var adWritten = "";

  function scaleOf(v) {
    var m = /scale\(\s*([\d.]+)\s*\)/.exec(v || "");
    return m ? Number(m[1]) : 0;
  }

  function fitHeaderAd() {
    var ad = document.getElementById("ads_2");
    if (!ad || !ad.parentElement) return;
    var cur = ad.style.transform || "";
    // lo que hay en línea puede ser lo que escribimos nosotros (y entonces no sirve de medida)
    if (cur && cur !== adWritten) {
      var s = scaleOf(cur);
      if (s) adBase = s;
    }
    if (!adBase) return;
    var head = ad.parentElement;
    var cs = window.getComputedStyle(head);
    var avail =
      (head.clientWidth || head.offsetWidth) -
      (parseFloat(cs.paddingLeft) || 0) -
      (parseFloat(cs.paddingRight) || 0);
    var w = ad.offsetWidth || 728;
    if (!avail || !w) return;
    var fit = Math.min(adBase, avail / w);
    var txt = "scale(" + Math.round(fit * 1000) / 1000 + ")";
    if (txt !== adWritten) {
      adWritten = txt;
      ad.style.setProperty("transform", txt, "important");
      ad.style.setProperty("transform-origin", "left top", "important");
      var h = ad.offsetHeight || 90;
      var extra = Math.max(0, Math.round(h * fit) - h);
      ad.style.setProperty("margin-bottom", extra + 8 + "px", "important");
    }
  }

  hf.skin = { apply: apply, fitHeaderAd: fitHeaderAd };
  hf.onChange(function (changed) {
    if (changed.indexOf("skin") >= 0 || changed.indexOf("cards") >= 0) apply();
  });
  apply();
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
      return;
    }
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

  hf.grid = { init: init, mark: mark, forget: forget };
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

  // ---- el panel --------------------------------------------------------------------------------
  function build() {
    var count = hf.seen.count();
    var body = hf.el("div", { cls: "hf-body" }, [
      caption("Piel"),
      row("Colores", segmented("skin", [["cueva", "Cueva"], ["claro", "Claro"], ["off", "Como la web"]])),
      hint("Cueva es oscura y con el rosa del sitio como acento. «Como la web» deja los colores del sitio y solo aplica el resto de arreglos."),

      caption("Listados"),
      row("Tamaño de las tarjetas", chooser("cards", [["0", "Como la web (152 px)"], ["170", "Pequeñas · 170"], ["190", "Normales · 190"], ["220", "Grandes · 220"], ["250", "Muy grandes · 250"], ["280", "Enormes · 280"]], Number)),
      sw("seen", "Marcar los juegos que ya abriste", count ? "Ahora mismo hay " + count + " en el historial de este navegador." : "Todavía no hay ninguno."),

      caption("Anuncios"),
      row("Cargar", segmented("ads", [["lazy", "Cuando se miran"], ["normal", "Como la web"]])),
      hint("No se quita ningún anuncio: los del sitio se cargan igual, pero cuando su hueco llega a la pantalla en vez de nada más abrir la página."),

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
    if (!box) build();
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
    function layout() {
      var html = document.documentElement;
      var kind = hf.pageKind();
      html.classList.toggle("hf-game", kind === "game");
      html.classList.toggle("hf-list", kind === "list");
      html.classList.toggle("hf-split", !!(hf.q("#flash_pageleft") && hf.q("#flash_pageright")));
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
        if (!n.placeholder) n.placeholder = "buscar juegos…";
      });
    }

    function pass() {
      columns();
      layout();
      softerAlerts();
      searchHint();
      if (hf.skin) hf.skin.fitHeaderAd();
      hf.deferAds();
      if (hf.grid) hf.grid.mark();
      if (hf.player) hf.player.init();
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
    // cambio de tamaño, y el laboratorio monta la página después de cargar).
    window.addEventListener("scroll", hf.sweep, { passive: true, capture: true });
    window.addEventListener("resize", function () {
      hf.sweep();
      if (hf.skin) hf.skin.fitHeaderAd();
    });
    setInterval(hf.sweep, 2500);
  });
})();

