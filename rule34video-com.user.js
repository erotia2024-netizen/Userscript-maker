// ==UserScript==
// @name         rule34video.com
// @version      0.1.78
// @description  Escrito en el laboratorio de Userscript Maker.
// @author       Userscript Maker
// @namespace    https://github.com/erotia2024-netizen/Userscript-maker
// @homepageURL  https://github.com/erotia2024-netizen/Userscript-maker
// @downloadURL  https://raw.githubusercontent.com/erotia2024-netizen/Userscript-maker/main/rule34video-com.user.js
// @updateURL    https://raw.githubusercontent.com/erotia2024-netizen/Userscript-maker/main/rule34video-com.user.js
// @match        *://rule34video.com/*
// @match        *://*.rule34video.com/*
// @run-at       document-start
// @noframes
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      *
// ==/UserScript==

(function () {
  "use strict";
  var css = "/* ---------------------------------------------------------------------------------------------\n   rule34video.com — limpieza de la página.\n   El CSS del sitio se carga después que este, así que todo va con !important: estas reglas tienen\n   que ganar sí o sí.\n   --------------------------------------------------------------------------------------------- */\n\n/* 1) Botones de promoción del header: «AI Jerk Off» (enlace de afiliado) y «ThePornDude».\n      Se ocultan aquí para que no parpadeen, y core.js además los quita del DOM y vigila que no\n      vuelvan (la web repinta el header con su propio JS). */\n.panel_header.panel_header--promo,\na.button_fav.ai,\na.button_fav.theporndude {\n  display: none !important;\n}\n\n/* 2) La banda de aviso de rule34gen, la que sale pegada debajo del header («Due to the massive\n      influx of AI generated video's…»). Se esconde el enlace y sus dos contenedores, y también el\n      `.headline` que solo la envuelve a ella: si no, se quedaría su margen inferior como hueco. */\na.emger,\n#top-header,\n#emergency-response-opt,\n.headline:has(> a.emger) {\n  display: none !important;\n}\n\n/* 3) El hueco entre la paginación («Jump to … OK») y el logo del pie.\n      Entre esas dos cosas no hay más que la banda de anuncios del pie (.footer_spots), y esa banda\n      reserva 250 px de alto por cada hueco de anuncio aunque no haya anuncio que cargar\n      (.columns_spots .spots { min-height:250px } en el CSS de la web): eso es el vacío que se ve.\n      Se le quitan el alto mínimo y los márgenes, así mide exactamente lo que mida el anuncio que\n      cargue — y cero si no hay ninguno. Además el pie arranca un poco más arriba. */\n.footer_spots {\n  margin-top: 0 !important;\n  padding: 0 !important;\n}\n\n.footer_spots .columns_spots,\n.footer_spots .spots {\n  min-height: 0 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n}\n\n.footer_holder {\n  padding-top: 16px !important;\n}\n\n/* 4) Los botones de afiliado de la columna lateral (los de happyleafmotion) traen su animación en el\n      propio `style=\"\"` del enlace: un gradiente de fondo que se mueve en bucle (`gradientShift 8s` y\n      `r34flow 10s`). Un `background-position` animado no se puede componer en la GPU: el navegador\n      **repinta ese botón en cada frame, para siempre** mientras la pestaña esté abierta. Aquí solo se\n      le para la animación al botón (el `!important` gana al `style=\"\"` del propio enlace): se sigue\n      viendo y se puede pinchar igual —no se toca nada de lo que paga la web— pero deja de gastar CPU.\n      Medido con la pestaña quieta: eran las dos únicas animaciones infinitas que quedaban en la\n      página además del spinner de «cargando» del reproductor. */\na.button_fav.sidebar_ad {\n  animation: none !important;\n}\n\n/* 5) La ficha de anuncio de la rejilla, ya en el pie. La traslada core.js (ver `localStorage\n      [\"r34gv.ads\"]`): en vez de ir entre los vídeos haciéndose pasar por uno, va a la fila de anuncios\n      del propio pie (`.footer_spots .columns_spots`, donde la web tiene sus zonas y el hueco de\n      JuicyAds), al lado de ellos —o, si la página no trae esa fila, al hueco entre la paginación\n      («Jump to … OK») y el pie—. Aquí solo se le da sitio —centrada y del ancho de una ficha— y se le\n      quitan los adornos de vídeo: la duración («23:40»), el icono HD, el de play y la fila de\n      nota/vistas, que son relleno de la plantilla. El cartel «AD» se queda: el anuncio tiene que\n      poder distinguirse de lo demás. */\n.r34gv-footer-ad {\n  clear: both !important;\n  width: 336px !important;\n  max-width: 92% !important;\n  margin: 22px auto 4px !important;\n}\n\n.r34gv-footer-ad .item.thumb {\n  float: none !important;\n  width: 100% !important;\n  height: auto !important;\n  margin: 0 !important;\n}\n\n.r34gv-footer-ad .time,\n.r34gv-footer-ad .quality,\n.r34gv-footer-ad .custom-play,\n.r34gv-footer-ad .thumb_info {\n  display: none !important;\n}\n\n/* 6) La banda de anuncio que estaba debajo del reproductor, ya al final del contenido (la traslada\n      core.js). La web la hace de todo el ancho (1250 px) con el anuncio de 300×250 centrado dentro:\n      al final de la página esa banda ancha y casi vacía se ve mal, así que aquí se encoge a lo que\n      mide el anuncio y se centra — deja de parecer una fila vacía y es un hueco de anuncio, y punto.\n      No se cambia ni el tamaño ni el contenido del anuncio: solo el hueco que lo envuelve. */\n.spot_under[data-r34gv-under] {\n  width: -moz-fit-content !important;\n  width: fit-content !important;\n  min-height: 0 !important;\n  margin: 18px auto 6px !important;\n  padding: 0 !important;\n}\n\n/* 7) El aviso de «sigues en …», que pone player.js al reanudar un vídeo a medias. Va dentro de\n      `.kt-player` (igual que el indicador de ±10 s de kt_seek.js, que usa z-index 50), en la esquina\n      inferior izquierda del vídeo, y se va solo. Nada de esto existe si nunca se reanuda nada. */\n.r34gv-resume {\n  position: absolute !important;\n  left: 14px !important;\n  bottom: 64px !important;\n  z-index: 51 !important;\n  max-width: 78% !important;\n  padding: 8px 14px !important;\n  border: 1px solid rgba(255, 255, 255, 0.22) !important;\n  border-radius: 999px !important;\n  background: rgba(16, 16, 16, 0.82) !important;\n  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.45) !important;\n  color: #fff !important;\n  font-family: Roboto, Arial, Helvetica, sans-serif !important;\n  font-size: 12.5px !important;\n  font-weight: 600 !important;\n  line-height: 1.2 !important;\n  letter-spacing: 0.2px !important;\n  pointer-events: none !important;\n  opacity: 1 !important;\n  transition: opacity 0.5s ease !important;\n}\n\n.r34gv-resume--out {\n  opacity: 0 !important;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   8) La FICHA DEL PERFIL (profile.js le pone `r34gv-profile` a <html> solo en una página de perfil).\n      La web la deja en una caja de 220 px con el nombre, un 89% y el botón apilados y en columna, y\n      debajo el título del listado repitiendo el nombre otra vez en 21 px. Aquí pasa a ser una ficha\n      de una sola fila: avatar, nombre con su valoración, y la acción a la derecha; el título del\n      listado se queda en subtítulo y los filtros, en una barra compacta.\n      Nada de esto toca la maquetación de los vídeos: son cuatro cajas de la cabecera.\n   --------------------------------------------------------------------------------------------- */\nhtml.r34gv-profile .content_general {\n  padding-top: 4px !important;\n}\n\nhtml.r34gv-profile .panel_sup {\n  display: flex !important;\n  flex-direction: row !important;\n  align-items: center !important;\n  justify-content: flex-start !important;\n  flex-wrap: wrap !important;\n  gap: 16px !important;\n  padding: 14px 18px !important;\n  margin: 6px 0 14px !important;\n  border: 1px solid rgba(255, 255, 255, 0.08) !important;\n  border-radius: 14px !important;\n  background: linear-gradient(135deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02)) !important;\n  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.22) !important;\n  text-align: left !important;\n}\n\n/* El avatar: la web no manda foto de un modelo, manda un icono genérico. Cuando es así, profile.js\n   marca `data-r34gv-initial` y aquí se cambia por la inicial en un cuadrado redondeado. Si algún día\n   la web pone un avatar de verdad (una imagen de fondo), no se marca nada y se respeta tal cual. */\nhtml.r34gv-profile .panel_sup .brand_image {\n  flex: none !important;\n  width: 72px !important;\n  height: 72px !important;\n  margin: 0 !important;\n  border-radius: 16px !important;\n  overflow: hidden !important;\n  background: linear-gradient(140deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.04)) !important;\n  border: 1px solid rgba(255, 255, 255, 0.1) !important;\n}\n\nhtml.r34gv-profile .panel_sup .brand_image_wrapper {\n  position: relative !important;\n  display: flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n  width: 100% !important;\n  height: 100% !important;\n  background-size: cover !important;\n  background-position: center !important;\n}\n\nhtml.r34gv-profile[data-r34gv-initial] .brand_image_wrapper .custom-brand {\n  display: none !important;\n}\n\nhtml.r34gv-profile[data-r34gv-initial] .brand_image_wrapper::after {\n  content: var(--r34gv-initial, \"?\");\n  color: #fff !important;\n  font-family: Roboto, Arial, Helvetica, sans-serif !important;\n  font-size: 30px !important;\n  font-weight: 700 !important;\n  line-height: 1 !important;\n  letter-spacing: 0.5px !important;\n}\n\nhtml.r34gv-profile .panel_sup .brand_inform {\n  display: flex !important;\n  flex: 1 1 auto !important;\n  flex-direction: row !important;\n  align-items: center !important;\n  flex-wrap: wrap !important;\n  gap: 10px 14px !important;\n  min-width: 0 !important;\n  text-align: left !important;\n}\n\nhtml.r34gv-profile .panel_sup .brand_inform .title {\n  color: #fff !important;\n  font-family: Roboto, Arial, Helvetica, sans-serif !important;\n  font-size: 22px !important;\n  font-weight: 700 !important;\n  line-height: 1.1 !important;\n  letter-spacing: 0.2px !important;\n  margin: 0 !important;\n  max-width: 100% !important;\n  overflow: hidden !important;\n  text-overflow: ellipsis !important;\n}\n\n/* El 89% pasa a ser una pastilla de valoración, no una línea suelta con un pulgar. */\nhtml.r34gv-profile .panel_sup .brand_inform .count {\n  display: inline-flex !important;\n  align-items: center !important;\n  gap: 5px !important;\n  padding: 3px 10px !important;\n  border-radius: 999px !important;\n  background: rgba(255, 255, 255, 0.08) !important;\n  border: 1px solid rgba(255, 255, 255, 0.1) !important;\n  color: #e8eef2 !important;\n  font-size: 12.5px !important;\n  font-weight: 700 !important;\n  line-height: 1.6 !important;\n}\n\nhtml.r34gv-profile .panel_sup .brand_inform .count .custom-svg {\n  width: 13px !important;\n  height: 13px !important;\n  opacity: 0.8 !important;\n}\n\n/* La acción, a la derecha y con su sitio propio. */\nhtml.r34gv-profile .panel_sup .brand_inform .btn-wrapper {\n  margin-left: auto !important;\n  margin-top: 0 !important;\n}\n\nhtml.r34gv-profile .panel_sup .brand_inform .btn {\n  display: inline-flex !important;\n  align-items: center !important;\n  gap: 7px !important;\n  padding: 9px 16px !important;\n  border-radius: 10px !important;\n  font-size: 13px !important;\n  font-weight: 700 !important;\n  line-height: 1 !important;\n  letter-spacing: 0.2px !important;\n}\n\n/* El icono del botón trae su propio margen derecho del sitio: sobra con el `gap`. */\nhtml.r34gv-profile .panel_sup .brand_inform .btn .custom-svg {\n  width: 16px !important;\n  height: 16px !important;\n  margin: 0 !important;\n}\n\n/* El título del listado, en su sitio: es un subtítulo, ya dijo el nombre la ficha de arriba. */\nhtml.r34gv-profile .headline--filters {\n  display: block !important;\n  margin: 0 0 10px !important;\n}\n\nhtml.r34gv-profile .headline--filters h1 {\n  display: flex !important;\n  align-items: center !important;\n  gap: 9px !important;\n  color: rgba(255, 255, 255, 0.72) !important;\n  font-family: Roboto, Arial, Helvetica, sans-serif !important;\n  font-size: 14.5px !important;\n  font-weight: 600 !important;\n  line-height: 1.2 !important;\n  letter-spacing: 0.2px !important;\n  margin: 0 0 10px !important;\n}\n\nhtml.r34gv-profile .headline--filters h1 .total_results {\n  padding: 2px 9px !important;\n  border-radius: 999px !important;\n  background: rgba(255, 255, 255, 0.08) !important;\n  border: 1px solid rgba(255, 255, 255, 0.1) !important;\n  color: #fff !important;\n  font-size: 12px !important;\n  font-weight: 700 !important;\n}\n\nhtml.r34gv-profile .headline_panel {\n  margin: 0 !important;\n}\n\nhtml.r34gv-profile .filters-panel {\n  margin: 0 !important;\n  padding: 8px 12px !important;\n  border-radius: 12px !important;\n  background: rgba(255, 255, 255, 0.04) !important;\n  border: 1px solid rgba(255, 255, 255, 0.07) !important;\n}\n\nhtml.r34gv-profile .filters-panel__toggle {\n  background: none !important;\n  border: 0 !important;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   9) La BARRA del orden por personaje (profile.js). Va entre el título del listado y la rejilla: a\n      la izquierda el conmutador «Por personaje / Más recientes», en medio una pastilla por personaje\n      (pincharla lleva a su grupo) y a la derecha la nota de lo que se está haciendo. Y los carteles\n      de grupo dentro de la rejilla, que son bloques de ancho completo (la rejilla es de fichas\n      `inline-block`, así que un bloque corta la fila, que es justo lo que se quiere).\n   --------------------------------------------------------------------------------------------- */\n.r34gv-bar {\n  display: flex !important;\n  align-items: center !important;\n  flex-wrap: wrap !important;\n  gap: 8px 12px !important;\n  padding: 9px 12px !important;\n  margin: 0 0 14px !important;\n  border-radius: 12px !important;\n  border: 1px solid rgba(255, 255, 255, 0.07) !important;\n  background: rgba(255, 255, 255, 0.035) !important;\n  font-family: Roboto, Arial, Helvetica, sans-serif !important;\n  font-size: 12.5px !important;\n  text-align: left !important;\n}\n\n.r34gv-seg {\n  display: inline-flex !important;\n  gap: 2px !important;\n  padding: 3px !important;\n  border-radius: 10px !important;\n  background: rgba(0, 0, 0, 0.3) !important;\n  flex: none !important;\n}\n\n.r34gv-seg__btn {\n  appearance: none !important;\n  -webkit-appearance: none !important;\n  margin: 0 !important;\n  padding: 7px 12px !important;\n  border: 0 !important;\n  border-radius: 8px !important;\n  background: transparent !important;\n  color: rgba(255, 255, 255, 0.66) !important;\n  font-family: inherit !important;\n  font-size: 12.5px !important;\n  font-weight: 600 !important;\n  line-height: 1 !important;\n  letter-spacing: 0.2px !important;\n  cursor: pointer !important;\n  white-space: nowrap !important;\n}\n\n.r34gv-seg__btn:hover {\n  color: #fff !important;\n}\n\n.r34gv-seg__btn.is-on {\n  background: rgba(255, 255, 255, 0.15) !important;\n  color: #fff !important;\n}\n\n.r34gv-chips {\n  display: flex !important;\n  flex-wrap: wrap !important;\n  gap: 6px !important;\n  min-width: 0 !important;\n}\n\n.r34gv-chip {\n  appearance: none !important;\n  -webkit-appearance: none !important;\n  margin: 0 !important;\n  padding: 4px 10px !important;\n  border-radius: 999px !important;\n  border: 1px solid rgba(255, 255, 255, 0.1) !important;\n  background: rgba(255, 255, 255, 0.055) !important;\n  color: #dfe7ec !important;\n  font-family: inherit !important;\n  font-size: 11.5px !important;\n  font-weight: 600 !important;\n  line-height: 1.5 !important;\n  cursor: pointer !important;\n  white-space: nowrap !important;\n}\n\n.r34gv-chip:hover {\n  background: rgba(255, 255, 255, 0.12) !important;\n  border-color: rgba(255, 255, 255, 0.2) !important;\n  color: #fff !important;\n}\n\n.r34gv-bar__note {\n  margin-left: auto !important;\n  color: rgba(255, 255, 255, 0.5) !important;\n  font-size: 11.5px !important;\n  font-weight: 400 !important;\n  text-align: right !important;\n}\n\n.r34gv-group {\n  display: block !important;\n  clear: both !important;\n  width: 100% !important;\n  height: auto !important;\n  margin: 20px 0 10px !important;\n  padding: 0 0 8px !important;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;\n  font-family: Roboto, Arial, Helvetica, sans-serif !important;\n  font-size: 13.5px !important;\n  font-weight: 700 !important;\n  line-height: 1.2 !important;\n  letter-spacing: 0.3px !important;\n  color: #fff !important;\n  text-align: left !important;\n}\n\n.r34gv-group:first-child {\n  margin-top: 2px !important;\n}\n\n.r34gv-group__name {\n  color: #fff !important;\n}\n\n.r34gv-group__n {\n  margin-left: 8px !important;\n  color: rgba(255, 255, 255, 0.5) !important;\n  font-size: 12px !important;\n  font-weight: 500 !important;\n}\n\n\n/* ---------------------------------------------------------------------------------------------\n   10) LA PIEL — la paleta. Puesta a petición del usuario («esos colores no representan su\n       objetivo»). Todo el color de la piel vive aquí, en variables, y las reglas de las secciones\n       11 a 14 solo las usan: cambiar de piel es cambiar este bloque, no repintar la web pieza a pieza.\n\n       Por qué estos colores: la web mezclaba tres grises (fondo `#212b31` azulado, header y pie\n       `#202124` neutro, botones `#424c55`), ponía de acento un rojo apagado (`#ce5f5d`, que se lee\n       como «error») y arrastraba restos de la plantilla (azul de Bootstrap, cian, verde, naranja).\n       La piel `cine` deja **un solo acento** (rosa fuerte) con un violeta de apoyo, y todo lo demás\n       en grises neutros de tres alturas. La clase la pone theme.js en <html>; con la piel en `off`\n       este bloque no se aplica y la web se ve como siempre.\n\n       El rosa elige el papel de «vídeo y deseo» que el rojo apagado no daba; el violeta solo aparece\n       en detalles (degradados del avatar, la barrita de los carteles de grupo, el brillo del hover),\n       nunca compitiendo con el acento.\n   --------------------------------------------------------------------------------------------- */\nhtml.r34gv-theme {\n  --r34gv-bg: #0c0e13; /* el lienzo */\n  --r34gv-surface: #141821; /* barras: header y pie */\n  --r34gv-surface-2: #1a1f2b; /* cajas elevadas: buscador, panel de filtros */\n  --r34gv-well: rgba(0, 0, 0, 0.35); /* huecos hundidos: conmutador de orden */\n  --r34gv-soft: rgba(255, 255, 255, 0.045); /* superficies apenas insinuadas */\n  --r34gv-soft-2: rgba(255, 255, 255, 0.075); /* superficies suaves (botones, pastillas) */\n  --r34gv-strong: rgba(255, 255, 255, 0.14); /* hover */\n  --r34gv-line: rgba(255, 255, 255, 0.08); /* filete de 1 px */\n  --r34gv-line-2: rgba(255, 255, 255, 0.16); /* filete marcado */\n  --r34gv-text: #f2f5fa;\n  --r34gv-text-2: rgba(242, 245, 250, 0.74);\n  --r34gv-muted: rgba(242, 245, 250, 0.48);\n  --r34gv-accent: #ff2e63; /* el único acento */\n  --r34gv-accent-2: #8b5cf6; /* apoyo: degradados y detalles */\n  --r34gv-accent-ink: #ffffff;\n  --r34gv-accent-shadow: 0 6px 18px rgba(255, 46, 99, 0.28);\n  --r34gv-ok: #35d39f;\n  --r34gv-radius: 12px;\n  --r34gv-radius-sm: 8px;\n  --r34gv-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);\n  --r34gv-glow: 0 0 0 1px rgba(255, 46, 99, 0.6), 0 10px 26px rgba(255, 46, 99, 0.22);\n  --r34gv-panel-grad: linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.015));\n  --r34gv-avatar-grad: linear-gradient(140deg, #ff2e63, #8b5cf6);\n}\n\n/* La segunda piel: más negro, acento magenta y cian, y brillo en los bordes. Misma estructura. */\nhtml.r34gv-theme--neon {\n  --r34gv-bg: #07070c;\n  --r34gv-surface: #0e0d18;\n  --r34gv-surface-2: #15131f;\n  --r34gv-text: #f7f3ff;\n  --r34gv-text-2: rgba(247, 243, 255, 0.76);\n  --r34gv-muted: rgba(247, 243, 255, 0.5);\n  --r34gv-accent: #ff2ea6;\n  --r34gv-accent-2: #22d3ee;\n  --r34gv-accent-shadow: 0 6px 20px rgba(255, 46, 166, 0.34);\n  --r34gv-ok: #5eead4;\n  --r34gv-glow: 0 0 0 1px rgba(255, 46, 166, 0.7), 0 0 24px rgba(255, 46, 166, 0.38);\n  --r34gv-avatar-grad: linear-gradient(140deg, #ff2ea6, #22d3ee);\n}\n\n/* ---------------------------------------------------------------------------------------------\n   11) LA PIEL — el lienzo: fondo, barras, selección y barras de desplazamiento.\n   --------------------------------------------------------------------------------------------- */\nhtml.r34gv-theme,\nhtml.r34gv-theme body {\n  background: var(--r34gv-bg) !important;\n  color: var(--r34gv-text) !important;\n  scrollbar-color: var(--r34gv-line-2) transparent;\n}\n\nhtml.r34gv-theme .wrapper,\nhtml.r34gv-theme .main {\n  background: var(--r34gv-bg) !important;\n}\n\nhtml.r34gv-theme .header {\n  background: var(--r34gv-surface) !important;\n  border-bottom: 1px solid var(--r34gv-line) !important;\n}\n\nhtml.r34gv-theme .footer_holder,\nhtml.r34gv-theme .footer {\n  background: var(--r34gv-surface) !important;\n  border-top: 1px solid var(--r34gv-line) !important;\n}\n\nhtml.r34gv-theme ::selection {\n  background: var(--r34gv-accent) !important;\n  color: var(--r34gv-accent-ink) !important;\n}\n\nhtml.r34gv-theme ::-webkit-scrollbar {\n  width: 12px !important;\n  height: 12px !important;\n}\n\nhtml.r34gv-theme ::-webkit-scrollbar-track {\n  background: var(--r34gv-bg) !important;\n}\n\nhtml.r34gv-theme ::-webkit-scrollbar-thumb {\n  background: rgba(255, 255, 255, 0.14) !important;\n  border: 3px solid var(--r34gv-bg) !important;\n  border-radius: 999px !important;\n}\n\nhtml.r34gv-theme ::-webkit-scrollbar-thumb:hover {\n  background: rgba(255, 255, 255, 0.26) !important;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   12) LA PIEL — el header: navegación (Tags, My Favorites), buscador y botones de cuenta.\n       Son botones grises de tres estilos distintos en la web original; aquí pasan a ser tres cosas\n       claras: enlace suave, campo hundido y **una sola acción sólida** (el botón de la derecha).\n   --------------------------------------------------------------------------------------------- */\nhtml.r34gv-theme .panel_header--primary .button_fav {\n  background: var(--r34gv-soft-2) !important;\n  color: var(--r34gv-text-2) !important;\n  border-radius: var(--r34gv-radius-sm) !important;\n}\n\nhtml.r34gv-theme .panel_header--primary .button_fav:hover {\n  background: var(--r34gv-strong) !important;\n  color: var(--r34gv-text) !important;\n}\n\nhtml.r34gv-theme .form_search .search_wrapper {\n  background: transparent !important;\n}\n\nhtml.r34gv-theme .form_search .input {\n  background: var(--r34gv-surface-2) !important;\n  color: var(--r34gv-text) !important;\n  border: 1px solid var(--r34gv-line) !important;\n  border-radius: var(--r34gv-radius-sm) !important;\n}\n\nhtml.r34gv-theme .form_search .input:focus {\n  border-color: var(--r34gv-line-2) !important;\n}\n\nhtml.r34gv-theme .form_search .input::placeholder {\n  color: var(--r34gv-muted) !important;\n}\n\nhtml.r34gv-theme .form_search .search_button,\nhtml.r34gv-theme .form_search .search_button svg,\nhtml.r34gv-theme .form_search .custom-svg {\n  color: var(--r34gv-muted) !important;\n  fill: currentColor !important;\n}\n\nhtml.r34gv-theme .panel_buttons .button {\n  background: var(--r34gv-soft-2) !important;\n  color: var(--r34gv-text) !important;\n  border-radius: var(--r34gv-radius-sm) !important;\n}\n\nhtml.r34gv-theme .panel_buttons .button + .button {\n  margin-left: 8px !important;\n}\n\nhtml.r34gv-theme .panel_buttons .button.second {\n  background: var(--r34gv-accent) !important;\n  color: var(--r34gv-accent-ink) !important;\n  box-shadow: var(--r34gv-accent-shadow) !important;\n}\n\nhtml.r34gv-theme .panel_buttons .button.second:hover {\n  filter: brightness(1.08) !important;\n}\n\nhtml.r34gv-theme .burger,\nhtml.r34gv-theme .burger svg {\n  color: var(--r34gv-text-2) !important;\n  fill: currentColor !important;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   13) LA PIEL — la ficha de vídeo de la rejilla. La web las deja planas y pegadas unas a otras\n       (sin fondo, sin esquinas, sin nada que diga «esto se pincha»): aquí cada miniatura pasa a ser\n       una tarjeta —esquinas redondeadas, filete de 1 px y, al pasar por encima, el filete se enciende\n       con el acento y la foto crece un 4 % (un `transform`, que lo compone la GPU: no cuesta\n       maquetación ni pintado). Nada de esto cambia el tamaño de la foto ni la rejilla.\n\n       La ficha de ANUNCIO (la que lleva el cartel «AD», `.spot-thumb`) queda fuera a propósito:\n       no se toca nada de la red publicitaria.\n   --------------------------------------------------------------------------------------------- */\nhtml.r34gv-theme .thumbs .item.thumb {\n  padding: 0 10px 18px !important;\n}\n\nhtml.r34gv-theme .thumbs .item.thumb a.th {\n  display: block !important;\n  border-radius: var(--r34gv-radius) !important;\n}\n\nhtml.r34gv-theme .thumbs .item.thumb .img.wrap_image {\n  border-radius: var(--r34gv-radius) !important;\n  overflow: hidden !important;\n  background: var(--r34gv-surface-2) !important;\n  box-shadow: 0 0 0 1px var(--r34gv-line) !important;\n  transition: box-shadow 0.22s ease !important;\n}\n\nhtml.r34gv-theme .thumbs .item.thumb img.thumb {\n  transition: transform 0.4s cubic-bezier(0.22, 0.61, 0.36, 1) !important;\n}\n\nhtml.r34gv-theme .thumbs .item.thumb:hover img.thumb {\n  transform: scale(1.04) !important;\n}\n\nhtml.r34gv-theme .thumbs .item.thumb:hover .img.wrap_image {\n  box-shadow: var(--r34gv-glow) !important;\n}\n\nhtml.r34gv-theme .thumbs .item.thumb .thumb_title {\n  color: var(--r34gv-text) !important;\n  font-weight: 600 !important;\n  line-height: 1.35 !important;\n}\n\nhtml.r34gv-theme .thumbs .item.thumb .thumb_info {\n  color: var(--r34gv-muted) !important;\n}\n\nhtml.r34gv-theme .thumbs .item.thumb .thumb_info .rating {\n  color: var(--r34gv-ok) !important;\n}\n\nhtml.r34gv-theme .thumbs .item.thumb .time {\n  padding: 3px 7px !important;\n  border-radius: 6px !important;\n  background: rgba(8, 10, 14, 0.78) !important;\n  letter-spacing: 0.2px !important;\n}\n\n/* ---------------------------------------------------------------------------------------------\n   14) LA PIEL — los listados: título, panel de filtros, paginación y las piezas nuestras (la barra\n       del orden por personaje, las pastillas, los carteles de grupo y la ficha del perfil). Son las\n       que ya venían pintadas en las secciones 8 y 9 con blancos translúcidos: aquí se atan al acento\n       para que la piel y lo nuestro sean una sola cosa y no dos grises distintos.\n   --------------------------------------------------------------------------------------------- */\nhtml.r34gv-theme .headline .title,\nhtml.r34gv-theme .headline h1,\nhtml.r34gv-theme .headline h2 {\n  color: var(--r34gv-text) !important;\n}\n\nhtml.r34gv-theme .filters-panel {\n  background: var(--r34gv-surface-2) !important;\n  border: 1px solid var(--r34gv-line) !important;\n}\n\nhtml.r34gv-theme .filters-panel__toggle {\n  background: none !important;\n  border: 0 !important;\n  color: var(--r34gv-text-2) !important;\n}\n\nhtml.r34gv-theme .pagination .item a,\nhtml.r34gv-theme .pagination .item span,\nhtml.r34gv-theme .pagination .item.jump_to input {\n  background: var(--r34gv-soft-2) !important;\n  color: var(--r34gv-text-2) !important;\n  border: 1px solid var(--r34gv-line) !important;\n  border-radius: var(--r34gv-radius-sm) !important;\n}\n\nhtml.r34gv-theme .pagination .item a:hover {\n  background: var(--r34gv-strong) !important;\n  color: var(--r34gv-text) !important;\n}\n\nhtml.r34gv-theme .pagination .item.active a {\n  background: var(--r34gv-accent) !important;\n  color: var(--r34gv-accent-ink) !important;\n  border-color: var(--r34gv-accent) !important;\n}\n\n/* Nuestras piezas. */\nhtml.r34gv-theme .r34gv-bar {\n  background: var(--r34gv-soft) !important;\n  border-color: var(--r34gv-line) !important;\n}\n\nhtml.r34gv-theme .r34gv-seg {\n  background: var(--r34gv-well) !important;\n}\n\nhtml.r34gv-theme .r34gv-seg__btn {\n  color: var(--r34gv-text-2) !important;\n}\n\nhtml.r34gv-theme .r34gv-seg__btn:hover {\n  color: var(--r34gv-text) !important;\n}\n\nhtml.r34gv-theme .r34gv-seg__btn.is-on {\n  background: var(--r34gv-soft-2) !important;\n  color: var(--r34gv-text) !important;\n}\n\nhtml.r34gv-theme .r34gv-chip {\n  background: var(--r34gv-soft) !important;\n  border-color: var(--r34gv-line) !important;\n  color: var(--r34gv-text-2) !important;\n}\n\nhtml.r34gv-theme .r34gv-chip:hover {\n  background: var(--r34gv-soft-2) !important;\n  border-color: var(--r34gv-accent) !important;\n  color: var(--r34gv-text) !important;\n}\n\nhtml.r34gv-theme .r34gv-bar__note {\n  color: var(--r34gv-muted) !important;\n}\n\nhtml.r34gv-theme .r34gv-group {\n  border-bottom-color: var(--r34gv-line) !important;\n  color: var(--r34gv-text) !important;\n}\n\n/* El cartel del grupo, con su barrita de acento delante: es lo único decorativo de la lista. */\nhtml.r34gv-theme .r34gv-group__name::before {\n  content: \"\" !important;\n  display: inline-block !important;\n  width: 3px !important;\n  height: 14px !important;\n  margin-right: 9px !important;\n  border-radius: 2px !important;\n  background: linear-gradient(180deg, var(--r34gv-accent), var(--r34gv-accent-2)) !important;\n  vertical-align: -2px !important;\n}\n\nhtml.r34gv-theme .r34gv-group__name {\n  color: var(--r34gv-text) !important;\n}\n\nhtml.r34gv-theme .r34gv-group__n {\n  color: var(--r34gv-muted) !important;\n}\n\n/* La ficha del perfil y su avatar, atados a la piel. */\nhtml.r34gv-theme.r34gv-profile .panel_sup {\n  background: var(--r34gv-panel-grad) !important;\n  border-color: var(--r34gv-line) !important;\n}\n\nhtml.r34gv-theme.r34gv-profile .panel_sup .brand_image {\n  background: var(--r34gv-avatar-grad) !important;\n  border-color: var(--r34gv-line-2) !important;\n}\n\nhtml.r34gv-theme.r34gv-profile .panel_sup .brand_inform .btn {\n  background: var(--r34gv-accent) !important;\n  color: var(--r34gv-accent-ink) !important;\n}\n\nhtml.r34gv-theme.r34gv-profile .panel_sup .brand_inform .title {\n  color: var(--r34gv-text) !important;\n}\n\nhtml.r34gv-theme.r34gv-profile .headline--filters h1 {\n  color: var(--r34gv-text-2) !important;\n}\n\nhtml.r34gv-theme.r34gv-profile .headline--filters h1 .total_results {\n  background: var(--r34gv-soft-2) !important;\n  border-color: var(--r34gv-line) !important;\n  color: var(--r34gv-text) !important;\n}\n";
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
// ---- rule34video-com ----
// ---------------------------------------------------------------------------------------------
// rule34video.com — la piel (el tema de colores).
//
// El usuario lo pidió tal cual: «cambiarle la temática al completo, esos colores no representan su
// objetivo». Y lleva razón: la web mezcla tres grises distintos (el `#212b31` azulado del fondo, el
// `#202124` neutro del header y el pie, el `#424c55` de los botones), le pone de acento un rojo
// apagado (`#ce5f5d`, que en cualquier interfaz se lee como «error») y por el camino le quedan restos
// de la plantilla: enlaces en azul de Bootstrap (`#428bca`), un cian (`#2ec7ff`), un verde y un
// naranja. Cuatro acentos peleándose por la misma página.
//
// Aquí no se pinta nada: esto solo pone una clase en `<html>` y todo el color vive en `styles.css`
// (secciones 10 a 14), en variables (`--r34gv-*`). Las pieles que existen:
//
//   cine   (por defecto) — fondo casi negro neutro, un solo acento rosa fuerte y un violeta de apoyo
//   neon                 — más negro todavía, acento magenta con cian, y brillo en los bordes
//   off                  — como la web, sin tocar nada
//
// Se cambia sin recargar y sin tocar código:
//
//   r34gvTheme.set("neon")     // cambia de piel (queda guardado)
//   r34gvTheme.set("off")      // vuelve a la web original
//   r34gvTheme.status()        // qué piel hay puesta ahora
//
// Y en `localStorage["r34gv.theme"]` queda el nombre de la elegida, por si hay que ponerla a mano.
//
// La clase se pone en `document-start`, antes de que el navegador pinte nada, así que no hay
// parpadeo: la página ya nace con la piel puesta.
// ---------------------------------------------------------------------------------------------
(function () {
  "use strict";
  if (window.__r34gvTheme) return;
  window.__r34gvTheme = true;

  var KEY = "r34gv.theme";
  var BASE = "r34gv-theme";
  var DEF = "cine";
  var PRESETS = ["cine", "neon"]; // las que están escritas en styles.css
  var OFF = "off";

  var applied = "";

  function read() {
    try {
      return String(localStorage.getItem(KEY) || "");
    } catch (e) {
      return "";
    }
  }

  function write(v) {
    try {
      localStorage.setItem(KEY, v);
    } catch (e) {}
  }

  function good(id) {
    return id === OFF || PRESETS.indexOf(id) !== -1;
  }

  function put(id) {
    var el = document.documentElement;
    if (!el) return false;
    // Fuera todas las que haya puestas (por si el laboratorio recarga el mismo documento).
    el.classList.remove(BASE);
    for (var i = 0; i < PRESETS.length; i++) el.classList.remove(BASE + "--" + PRESETS[i]);
    applied = id;
    if (id === OFF) return true;
    el.classList.add(BASE);
    el.classList.add(BASE + "--" + id);
    return true;
  }

  function set(id) {
    id = String(id || "").toLowerCase().trim();
    if (!good(id)) return false;
    write(id);
    put(id);
    return true;
  }

  function status() {
    return { piel: applied, guardada: read() || DEF, disponibles: PRESETS.concat([OFF]) };
  }

  var wanted = read() || DEF;
  if (!good(wanted)) wanted = DEF;

  // A `document-start` el `<html>` ya está (es lo primero que aparece en el documento), pero por si
  // acaso se llega antes de que exista, se reintenta al vuelo en vez de perderse la clase.
  if (!put(wanted)) {
    document.addEventListener("DOMContentLoaded", function () {
      put(applied || wanted);
    });
  }

  window.r34gvTheme = {
    set: set,
    status: status,
    list: function () {
      return PRESETS.concat([OFF]);
    }
  };
})();

// ---------------------------------------------------------------------------------------------
// rule34video.com — ajustes del reproductor (kt_player: Flowplayer + envoltorio de KVS).
//
// Van en su propio archivo y no en core.js porque hay que llegar ANTES que la web. El reproductor
// arranca cuando el script en línea de la página hace `var flashvars = {...}; kt_player(..., flashvars)`,
// y eso ocurre durante el parseo del HTML: un userscript con @run-at document-end llegaría tarde.
// Por eso este userscript se compila con @run-at document-start (lo pide `runAt` en manifest.json) y
// aquí, en cuanto existe <html>, se instala un setter en `window.flashvars` que coge el objeto justo
// antes de que lo lea el reproductor.
//
// Qué se ajusta:
//   preload: 'auto'                 -> la web pide solo los metadatos (`preload: 'metadata'`), así que
//                                      el vídeo no se descarga hasta darle a play y el arranque se
//                                      nota. Con 'auto' empieza a bufferear en cuanto se abre la ficha.
//   timeline_screens_preload: false -> la barra de tiempo previsualiza 11 JPGs por vídeo y los pide
//                                      todos de golpe sin que hayas pasado el ratón por encima. Se
//                                      dejan para cuando hagan falta.
//   calidad por defecto             -> la web arranca en 360p (es la que va en `video_url`, la fuente
//                                      por defecto) y deja 480p/720p/1080p en los huecos alternativos.
//                                      La calidad se recuerda entre vídeos (ver «preferencia de
//                                      calidad», más abajo) y, como respaldo, la preferida se pone
//                                      delante en esos huecos con su texto y su marca HD.
//   loop: false                     -> la web trae `loop: 'true'`, o sea que si dejas la pestaña
//                                      abierta el vídeo se repite para siempre (y vuelve a
//                                      descargarse). Con esto se para al terminar, que es cuando una
//                                      pestaña abierta debería quedarse quieta. Se puede volver a
//                                      poner con localStorage["r34gv.loop"] = "true".
//
// El pre-roll (adv_pre_vast) NO se toca a propósito: es el anuncio que paga esta página, y quitarlo
// sería dejar al vídeo sin su único ingreso. Tampoco se simulan clics en los anuncios: eso es fraude
// publicitario, no lo cuenta nadie, y acaba con la cuenta de anuncios de la web suspendida (o sea,
// con la web sin ingresos). Más detalle en el README.
//
// Red de seguridad: si el setter no llega a tiempo (otra extensión ya definió `flashvars`, o el
// reproductor ya se construyó), queda el apaño del final: al vídeo ya creado se le pone
// preload='auto' directamente. Como el mapeo flashvars -> clip del envoltorio de KVS está ofuscado,
// ese apaño es además la garantía de que el preload se aplica sí o sí.
//
// Preferencia de calidad: se recuerda entre vídeos. Se puede cambiar también desde la consola con
//   localStorage.setItem("r34gv.quality", "1080p")   // o 480p, 360p…
// Si no hay ninguna guardada se usa 720p (480p si la conexión es lenta o hay ahorro de datos), y la
// primera vez se hereda la que ya tuviera elegida el reproductor de la web. La elección se apunta en
// el momento de elegirla, y además se escribe en la clave del propio reproductor
// (`kvsplayer_selected_format`), que es la que de verdad decide con cuál arranca cada vídeo —los
// cuatro huecos de `flashvars` solo se reordenan como respaldo—. Si un vídeo arranca en otra calidad
// distinta de la preferida, se cambia sola usando ese mismo menú.
//
// Memoria del reproductor (todo en localStorage, todo aplicado al motor `video.fp-engine`):
//   r34gv.volume  0..1     -> la web arranca cada vídeo con `volume: '1'` (al 100%, de golpe)
//   r34gv.mute    1/0      -> silencio recordado
//   r34gv.speed   0.25..4  -> la velocidad del menú del reproductor se reinicia en cada vídeo
//   r34gv.pos.<id> segundos -> por dónde ibas en ESE vídeo (se reanuda al volver a abrirlo)
//   r34gv.quality texto    -> la calidad elegida (ver arriba)
//
// Espacio = play/pausa (el reproductor de la web no lo tiene: sus teclas son las de Flowplayer y solo
// funcionan con el ratón encima; los cursores ±5 s los pone el propio `kt_seek.js` de la web, y el
// `0` nativo salta al principio — que es también lo que borra la posición guardada).
// ---------------------------------------------------------------------------------------------
(function () {
  "use strict";

  // En Tampermonkey el código vive en un mundo aparte: el objeto global de la página es unsafeWindow.
  // En el laboratorio (y con @grant none) no existe unsafeWindow y window ya es la página.
  var W = (function () {
    try {
      return typeof unsafeWindow !== "undefined" && unsafeWindow ? unsafeWindow : window;
    } catch (e) {
      return window;
    }
  })();

  if (W.__r34gvPlayer) return;
  W.__r34gvPlayer = true;

  var QUALITY_KEY = "r34gv.quality";
  var QUALITY_DEFAULT = "720p";
  var SITE_QUALITY_KEY = "kvsplayer_selected_format"; // la clave con la que el reproductor de la web recuerda su calidad

  // Los cuatro huecos de calidad del reproductor, en orden: el primero es el que suena por defecto.
  var URLS = ["video_url", "video_alt_url", "video_alt_url2", "video_alt_url3"];
  var TEXTS = ["video_url_text", "video_alt_url_text", "video_alt_url2_text", "video_alt_url3_text"];
  var HDS = ["", "", "video_alt_url2_hd", "video_alt_url3_hd"];
  var current = undefined;
  var videoId = ""; // `video_id` de los flashvars: la posición guardada va por vídeo
  var contentSet = {}; // dirección del vídeo (sin consulta) -> texto de su calidad

  function stripQuery(url) {
    var u = String(url || "");
    var i = u.search(/[?#]/);
    return i === -1 ? u : u.slice(0, i);
  }

  // Dirección absoluta: las de los flashvars y la del motor pueden venir con distinta forma (una
  // relativa, otra absoluta) y lo que se compara es el archivo, no cómo esté escrito. Se resuelve
  // contra `document.baseURI` y no contra `location.href`: si hay un `<base>` en la página (el motor
  // de Perchance pone uno), el navegador resuelve con él y hay que resolver igual.
  function absUrl(url) {
    var base = location.href;
    try {
      if (document.baseURI) base = document.baseURI;
    } catch (e) {}
    try {
      return new URL(String(url), base).href;
    } catch (e) {
      return String(url || "");
    }
  }

  // localStorage, siempre a la defensiva: en modo privado (o con el almacén lleno) no hay memoria,
  // pero la página tiene que seguir funcionando igual.
  function memGet(key) {
    try {
      var v = W.localStorage && W.localStorage.getItem(key);
      return v == null ? null : String(v);
    } catch (e) {
      return null;
    }
  }

  function memSet(key, value) {
    try {
      if (W.localStorage) W.localStorage.setItem(key, String(value));
    } catch (e) {}
  }

  function memDel(key) {
    try {
      if (W.localStorage) W.localStorage.removeItem(key);
    } catch (e) {}
  }

  function numOf(raw, min, max) {
    if (raw == null || raw === "") return null;
    var n = parseFloat(raw);
    if (!isFinite(n) || n < min || n > max) return null;
    return n;
  }

  var VOLUME_KEY = "r34gv.volume"; // 0..1
  var MUTE_KEY = "r34gv.mute"; // "1" silenciado, "0" con sonido
  var SPEED_KEY = "r34gv.speed"; // 0.25..4
  var POS_PREFIX = "r34gv.pos."; // + video_id
  var RESUME_MIN = 20; // por debajo de 20 s (o del 10% del vídeo) no se reanuda: no hay nada que reanudar
  var RESUME_TAIL = 10; // y a menos de 10 s (o del 5%) del final, la próxima vez desde el principio
  var POS_HEAD = 5; // los primeros segundos no se guardan: no es «donde te quedaste»

  function pref(key) {
    try {
      var v = W.localStorage && W.localStorage.getItem(key);
      if (v) return String(v).toLowerCase();
    } catch (e) {}
    return "";
  }

  function loopPref() {
    return pref("r34gv.loop");
  }

  // La web guarda su propia calidad elegida en `kvsplayer_selected_format` (por nombre: «720p»), y al
  // arrancar manda eso: los cuatro huecos de `flashvars` se reordenan, pero el reproductor termina
  // eligiendo la que tenga apuntada en su clave. Así que la preferencia se escribe donde manda él (y
  // así la pone sin cambiar de flujo a mitad del arranque). Si todavía no hay preferencia nuestra se
  // hereda la que ya tuviera elegida la web, que es la misma elección vista desde el otro lado.
  function pushQuality() {
    var mine = pref(QUALITY_KEY);
    if (mine) {
      memSet(SITE_QUALITY_KEY, mine);
      return mine;
    }
    var site = pref(SITE_QUALITY_KEY);
    if (site) memSet(QUALITY_KEY, site);
    return site;
  }

  function wanted() {
    var saved = pushQuality();
    if (saved) return saved;
    // Sin preferencia guardada: en una conexión lenta (o con ahorro de datos) empezar en 720p es
    // empezar a bufferear, así que se baja. Además del tipo de conexión se miran la velocidad estimada
    // y la latencia: una «4g» de 1 Mb/s con 400 ms de ida y vuelta no aguanta 720p sin pararse.
    try {
      var nav = W.navigator || navigator;
      var c = nav.connection || nav.mozConnection || nav.webkitConnection;
      if (c) {
        if (c.saveData || /^(slow-)?2g$|^3g$/.test(c.effectiveType || "")) return "480p";
        if (c.downlink && c.downlink < 2) return "480p";
        if (c.rtt && c.rtt > 300) return "480p";
      }
    } catch (e) {}
    return QUALITY_DEFAULT.toLowerCase();
  }

  // `_360.mp4` / `_720p.mp4`: el sufijo del archivo, que es lo que lleva el campo `postfix` de la
  // fuente que suena por defecto (4621435_720p.mp4 -> _720p.mp4). Ojo: las direcciones de la web
  // acaban en `/` antes de la consulta (`.../4621435_720p.mp4/?v-acctoken=...`).
  function postfixOf(url) {
    var path = String(url || "");
    try {
      path = new URL(path).pathname;
    } catch (e) {}
    var m = /([^\/?#]+)\/*(?:[?#]|$)/.exec(path);
    return m ? m[1].replace(/^\d+/, "") : "";
  }

  function tune(fv) {
    if (!fv || typeof fv !== "object") return fv;
    try {
      // Se apunta el id del vídeo (para la posición) y la calidad de cada una de sus direcciones
      // (para saber qué calidad está sonando de verdad, y para no confundir el pre-roll con el vídeo).
      if (fv.video_id != null) videoId = String(fv.video_id);
      contentSet = {};
      for (var q = 0; q < URLS.length; q++) {
        if (fv[URLS[q]]) contentSet[stripQuery(absUrl(fv[URLS[q]]))] = String(fv[TEXTS[q]] || "");
      }
      // 1) que empiece a bufferear desde el principio.
      fv.preload = "auto";
      // 2) las 11 miniaturas de la barra de tiempo, solo cuando se pase el ratón.
      if (fv.timeline_screens_url) fv.timeline_screens_preload = "false";
      // 3) que no se repita solo (una pestaña abierta con el vídeo en bucle no se queda nunca
      //    quieta). Se puede devolver a como estaba con localStorage["r34gv.loop"] = "true".
      if (loopPref() !== "true") fv.loop = "false";
      // 4) la calidad preferida, delante.
      var want = wanted();
      var list = [];
      for (var i = 0; i < URLS.length; i++) {
        if (!fv[URLS[i]]) continue;
        list.push({
          url: fv[URLS[i]],
          text: fv[TEXTS[i]] == null ? "" : String(fv[TEXTS[i]]),
          hd: HDS[i] ? String(fv[HDS[i]] || "") : "",
          want: String(fv[TEXTS[i]] || "").toLowerCase() === want
        });
      }
      for (var k = 0; k < list.length; k++) {
        if (!list[k].want) continue;
        if (k > 0) list.unshift(list.splice(k, 1)[0]);
        break;
      }
      // Se reescriben los cuatro huecos con la lista ya reordenada: cada calidad conserva su texto y
      // su marca HD (la marca solo existe en los huecos 2 y 3, así que se limpia la del que se vaya).
      for (var s = 0; s < URLS.length; s++) {
        var e = list[s];
        if (!e) {
          delete fv[URLS[s]];
          delete fv[TEXTS[s]];
          if (HDS[s]) delete fv[HDS[s]];
          continue;
        }
        fv[URLS[s]] = e.url;
        fv[TEXTS[s]] = e.text;
        if (HDS[s]) {
          if (e.hd) fv[HDS[s]] = e.hd;
          else delete fv[HDS[s]];
        }
      }
      // `postfix` acompaña a la fuente por defecto (es la que ahora está en el primer hueco).
      var pf = postfixOf(fv.video_url);
      if (pf && pf.length <= 20) fv.postfix = pf;
    } catch (e) {
      // Nunca dejamos la página sin sus flashvars por un error nuestro.
    }
    return fv;
  }

  // El setter. Con esto, el `var flashvars = {...}` del script en línea de la web llama aquí (una
  // declaración `var` sobre una propiedad que ya existe no la redefine: solo se le asigna) y el
  // reproductor lee después el objeto ya ajustado a través del getter.
  function install() {
    var d = null;
    try {
      d = Object.getOwnPropertyDescriptor(W, "flashvars");
    } catch (e) {
      return false;
    }
    if (d && (d.get || d.set)) return false; // ya hay alguien ahí: no le pisamos el sitio
    if (d && !d.configurable) return false; // no se puede redefinir
    try {
      Object.defineProperty(W, "flashvars", {
        configurable: true,
        enumerable: true,
        get: function () {
          return current;
        },
        set: function (v) {
          current = tune(v);
        }
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  if (!install()) {
    // Llegamos tarde o el hueco está cogido: si el objeto ya existe, se ajusta en el sitio.
    try {
      if (W.flashvars && typeof W.flashvars === "object") tune(W.flashvars);
    } catch (e) {}
  }

  // --- el motor del reproductor: preload, memoria y Espacio ---------------------------------------
  // Y SOLO ese vídeo: los *previews* de las listas son otra cosa, se cargan al pasar el ratón y no se
  // tocan. El motor es `video.fp-engine` dentro de `.kt-player` (el propio `kt_seek.js` de la web usa
  // ese mismo nodo), así que todo lo de aquí es igual de válido con su reproductor.
  var ENGINE = ".kt-player video.fp-engine, #kt_player video, .player-holder video";
  var seen = new WeakSet();
  var userTouched = false; // el usuario ya cambió volumen o velocidad: a partir de ahí solo se graba
  var busyUntil = 0; // hasta cuándo lo que llegue con los valores de fábrica es cosa de la web
  var hasPlayed = false; // antes de la primera reproducción, «lo de fábrica» siempre es la web

  // Un gesto sobre los controles de volumen/velocidad del propio reproductor (o sus teclas) es el
  // usuario cambiándolo: desde ese momento lo suyo manda, aunque ponga justo el valor de fábrica. Se
  // mira en captura, o sea antes de que el reproductor aplique su cambio.
  function isVolumeSpeedUi(t) {
    return !!(t && t.closest && t.closest("a.fp-speed, .fp-speed-list, .fp-volumeslider, .fp-volumelevel, .fp-mute"));
  }

  var selfClick = false; // mientras se sincroniza el menú de velocidad: ese clic es nuestro

  document.addEventListener(
    "pointerdown",
    function (e) {
      if (!selfClick && isVolumeSpeedUi(e.target)) userTouched = true;
    },
    true
  );

  document.addEventListener(
    "click",
    function (e) {
      if (!selfClick && isVolumeSpeedUi(e.target)) userTouched = true;
    },
    true
  );

  document.addEventListener(
    "keydown",
    function (e) {
      var c = e.keyCode || e.which;
      // M, ↑, ↓, K, J (volumen/silencio) y Shift+←/→ (velocidad): las teclas del reproductor.
      if (c === 77 || c === 38 || c === 40 || c === 75 || c === 74 || (e.shiftKey && (c === 37 || c === 39))) userTouched = true;
    },
    true
  );
  var lastSaved = -1;
  var resumedFor = ""; // dirección del contenido para el que ya se reanudó (el pre-roll no cuenta)
  var resumedShown = false; // el aviso «sigues en…» sale una vez por página, no en cada cambio de calidad

  function engine() {
    var v = null;
    try {
      v = document.querySelector(ENGINE);
    } catch (e) {}
    return v;
  }

  function playerRoot() {
    return document.querySelector(".kt-player") || document.getElementById("kt_player") || null;
  }

  function contentKey(v) {
    var src = (v && (v.currentSrc || v.src)) || "";
    if (!src) return "";
    var key = stripQuery(absUrl(src));
    return contentSet[key] ? key : ""; // vacío = no es una de las direcciones del vídeo (¿pre-roll?)
  }

  // Los valores con los que la web arranca cada vídeo (su `volume: '1'` y la velocidad a 1×).
  function factoryVol(v) {
    return Math.abs(v.volume - 1) < 0.001 && !v.muted;
  }

  function factoryRate(v) {
    return Math.abs(v.playbackRate - 1) < 0.001;
  }

  function wantVol() {
    return numOf(memGet(VOLUME_KEY), 0, 1);
  }

  function wantMute() {
    var m = memGet(MUTE_KEY);
    return m == null ? null : m === "1";
  }

  function wantRate() {
    return numOf(memGet(SPEED_KEY), 0.25, 4);
  }

  function applyVolume(v) {
    var vol = wantVol();
    if (vol != null && Math.abs(v.volume - vol) > 0.001) {
      try {
        v.volume = vol;
      } catch (e) {}
    }
    var mute = wantMute();
    if (mute != null && v.muted !== mute) {
      try {
        v.muted = mute;
      } catch (e) {}
    }
  }

  function applySpeed(v) {
    var sp = wantRate();
    if (sp == null) return;
    if (Math.abs(v.playbackRate - sp) > 0.001) {
      try {
        v.playbackRate = sp;
      } catch (e) {}
    }
    // A la velocidad le pasa lo que al volumen no: el menú de la web tiene su propio estado y, si no
    // se toca, el botón seguiría diciendo «x1.0» mientras el vídeo va a 1.5. Se pulsa su propia
    // entrada del menú (es el mismo código que corre cuando la pulsa el usuario): así el vídeo, el
    // botón y la marca de seleccionado quedan de acuerdo.
    syncSpeedUI(sp);
  }

  function syncSpeedUI(sp) {
    var btn = document.querySelector("a.fp-speed");
    if (!btn) return;
    var item = null;
    try {
      item = btn.querySelector('.fp-speed-list-item a[data-speed="' + sp + '"]');
    } catch (e) {
      return;
    }
    var box = item && item.parentNode;
    if (!box || box.classList.contains("is-selected")) return;
    try {
      selfClick = true; // el clic es nuestro: no cuenta como gesto del usuario
      item.click();
    } catch (e) {
    } finally {
      selfClick = false;
    }
  }

  // ¿El estado actual del motor es ya el nuestro? (Sirve para no grabar nuestros propios ajustes ni
  // para pelearse con ellos.)
  function isOursVolume(v) {
    var vol = wantVol();
    var mute = wantMute();
    if (vol != null && Math.abs(v.volume - vol) > 0.001) return false;
    if (mute != null && v.muted !== mute) return false;
    return vol != null || mute != null;
  }

  function isOursRate(v) {
    var sp = wantRate();
    return sp != null && Math.abs(v.playbackRate - sp) < 0.001;
  }

  // Poner lo guardado y abrir otra vez la ventana en la que «lo de fábrica» es la web arrancando. Es
  // lo que se llama en cada hito de la carga (metadatos, canplay, al empezar a sonar…): el envoltorio
  // de KVS reparte sus ajustes entre esos hitos, así que hay que insistir en más de uno.
  function reapply(v) {
    busyUntil = Date.now() + 1800;
    applyVolume(v);
    applySpeed(v);
  }

  function saveVolume(v) {
    memSet(VOLUME_KEY, Math.round(v.volume * 100) / 100);
    memSet(MUTE_KEY, v.muted ? "1" : "0");
  }

  function saveSpeed(v) {
    memSet(SPEED_KEY, Math.round(v.playbackRate * 100) / 100);
  }

  // --- la calidad: memoria de verdad -------------------------------------------------------------
  // La preferencia se escribe en la clave del propio reproductor (eso es lo que hace que arranque en
  // ella, ver `pushQuality`). Pero por si esta página no ofrece esa calidad, o el reproductor decide
  // otra cosa, quedan dos redes:
  //   1) se apunta en el momento de elegirla en el menú del reproductor, sin esperar a que el flujo
  //      cargue;
  //   2) si el vídeo arranca en otra calidad distinta de la preferida y esa sí está en el menú, se
  //      cambia sola usando el propio menú del reproductor.
  var selfQuality = false; // mientras el clic del menú lo damos nosotros
  var enforceTried = {}; // dirección del vídeo -> veces que se ha corregido la calidad
  var ENFORCE_MAX = 3;
  var lastEnforceAt = 0;

  function qualityBtn(text) {
    var want = String(text || "").toLowerCase();
    if (!want) return null;
    var found = null;
    var items = document.querySelectorAll(".fp-settings-list-item");
    for (var i = 0; i < items.length; i++) {
      if (String(items[i].textContent || "").trim().toLowerCase() !== want) continue;
      found = items[i].querySelector("a") || items[i];
      break;
    }
    return found;
  }

  function enforceQuality() {
    var want = pref(QUALITY_KEY);
    if (!want) return; // sin preferencia guardada manda la web (y si no, la de por defecto de arriba)
    var v = engine();
    if (!v) return;
    var key = contentKey(v);
    if (!key) return; // el pre-roll (u otra fuente) no se toca
    var cur = String(contentSet[key] || "").toLowerCase();
    if (!cur || cur === want) return; // ya está en la buena (lo normal: el setter hizo su trabajo)
    if ((enforceTried[key] || 0) >= ENFORCE_MAX) return;
    var now = Date.now();
    if (now - lastEnforceAt < 3000) return;
    var btn = qualityBtn(want);
    if (!btn) return; // esta página no ofrece esa calidad: la que hay, se queda
    enforceTried[key] = (enforceTried[key] || 0) + 1;
    lastEnforceAt = now;
    if (window.console) console.log("[r34gv] el vídeo arrancó en " + cur + ": se pone " + want);
    showNote("Calidad " + want + "…");
    selfQuality = true; // el clic es nuestro: no cuenta como elección del usuario
    try {
      btn.click();
    } catch (e) {
    } finally {
      selfQuality = false;
    }
  }

  // Elegir calidad en el menú del reproductor es la señal buena: se apunta al momento. Se mira en
  // captura, antes de que el reproductor haga nada, y solo si el texto es una calidad (`1080p`).
  function noteQualityPick(e) {
    if (selfQuality || !e.target || !e.target.closest) return;
    var it = e.target.closest(".fp-settings-list-item");
    if (!it) return;
    var t = String(it.textContent || "").trim().toLowerCase();
    if (!/^\d{3,4}p(\s|$)/.test(t)) return;
    memSet(QUALITY_KEY, t);
    memSet(SITE_QUALITY_KEY, t); // en la clave del reproductor también: en el siguiente vídeo, suya
  }

  document.addEventListener("pointerdown", noteQualityPick, true);
  document.addEventListener("click", noteQualityPick, true);

  function fmtTime(secs) {
    var s = Math.max(0, Math.round(secs));
    var m = Math.floor(s / 60);
    var r = s % 60;
    return m + ":" + (r < 10 ? "0" : "") + r;
  }

  // El avisito de «sigues en …», en la esquina del reproductor (el CSS está en styles.css).
  function showResume(secs) {
    var root = playerRoot();
    if (!root || root.querySelector(".r34gv-resume")) return;
    var el = document.createElement("div");
    el.className = "r34gv-resume";
    el.textContent = "Sigues en " + fmtTime(secs) + " · pulsa 0 para empezar de cero";
    root.appendChild(el);
    setTimeout(function () {
      el.className = "r34gv-resume r34gv-resume--out";
    }, 7000);
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 8000);
  }

  function resumeIn(v) {
    if (!videoId) return;
    var key = contentKey(v);
    if (!key || key === resumedFor) return; // durante el pre-roll (u otro clip) no se toca nada
    var t = numOf(memGet(POS_PREFIX + videoId), 0, 24 * 3600);
    var d = v.duration;
    if (t == null || !isFinite(d) || d <= 0) return;
    var min = Math.min(RESUME_MIN, d * 0.1);
    var max = d - Math.min(RESUME_TAIL, d * 0.05);
    resumedFor = key;
    if (t < min) return;
    if (t > max) {
      memDel(POS_PREFIX + videoId); // se quedó al final: la próxima vez, desde el principio
      return;
    }
    try {
      v.currentTime = t;
    } catch (e) {
      return;
    }
    if (!resumedShown) {
      resumedShown = true; // al cambiar de calidad se vuelve a llamar: el aviso ya se ha dado
      showResume(t);
    }
  }

  function savePos(v, force) {
    if (!videoId || !contentKey(v)) return;
    var t = v.currentTime;
    var d = v.duration;
    if (!isFinite(t) || !isFinite(d) || d <= 0) return;
    if (t < Math.min(POS_HEAD, d * 0.05) || t > d - Math.min(RESUME_TAIL, d * 0.05)) {
      memDel(POS_PREFIX + videoId);
      lastSaved = -1;
      return;
    }
    if (!force && Math.abs(t - lastSaved) < 3) return;
    lastSaved = t;
    memSet(POS_PREFIX + videoId, Math.round(t));
  }

  function onMeta(v) {
    try {
      if (v.preload !== "auto") v.preload = "auto";
    } catch (e) {}
    // Aquí NO se apunta la calidad: la que suena puede ser un apaño del reproductor (una calidad que
    // ese vídeo no tiene, un arranque suyo…), y grabarla pisaría la elección del usuario. La elección
    // se apunta al elegirla en el menú, que es cuando es una elección de verdad.
    reapply(v);
    resumeIn(v);
    setTimeout(enforceQuality, 1500);
  }

  function attach(v) {
    if (!v || seen.has(v)) return;
    seen.add(v);
    v.addEventListener("loadedmetadata", function () {
      onMeta(v);
    });
    // El envoltorio de KVS reparte sus ajustes (volumen, velocidad…) entre varios hitos, y al cambiar
    // de calidad vuelve a llamar a load(): en cada hito se vuelve a poner lo guardado.
    v.addEventListener("loadeddata", function () {
      try {
        if (v.preload !== "auto") v.preload = "auto";
      } catch (e) {}
      reapply(v);
    });
    v.addEventListener("canplay", function () {
      reapply(v);
      setTimeout(enforceQuality, 800);
    });
    v.addEventListener("playing", function () {
      hasPlayed = true;
      reapply(v);
    });
    v.addEventListener("volumechange", function () {
      if (isOursVolume(v)) return; // es nuestro propio ajuste: no hay nada que grabar
      // El valor de fábrica justo al cargar (o en un hito) es la web arrancando: se deshace con lo
      // guardado, sin grabarlo. Cualquier otro cambio (o uno más tarde) es del usuario, y a partir de
      // ahí manda él y solo se graba.
      if (!userTouched && factoryVol(v) && wantVol() != null && (Date.now() < busyUntil || !hasPlayed)) {
        reapply(v);
        return;
      }
      userTouched = true;
      saveVolume(v);
    });
    v.addEventListener("ratechange", function () {
      if (isOursRate(v)) return;
      if (!userTouched && factoryRate(v) && wantRate() != null && (Date.now() < busyUntil || !hasPlayed)) {
        reapply(v);
        return;
      }
      userTouched = true;
      saveSpeed(v);
    });
    v.addEventListener("timeupdate", function () {
      savePos(v, false);
      if (v.currentTime !== lastSeenTime) {
        lastSeenTime = v.currentTime;
        lastMovedAt = Date.now();
      }
    });
    v.addEventListener("progress", function () {
      var b = bufferedEnd(v);
      if (b > lastSeenBuffered + 0.01) {
        lastSeenBuffered = b;
        lastMovedAt = Date.now();
      }
    });
    v.addEventListener("playing", function () {
      markMoving(v);
    });
    // Un error de red o de fuente (p. ej. la firma caducada) deja el reproductor parado: se intenta
    // reabrir el flujo, que es lo único que se puede hacer desde el userscript.
    v.addEventListener("error", function () {
      if (document.hidden) return;
      if (!contentKey(v)) return; // el pre-roll (u otra fuente) no se toca
      var code = v.error ? v.error.code : 0;
      if (code !== 2 && code !== 4) return;
      replenishing = false; // si era un reintento nuestro, ha fallado: se sigue con el plan
      recover(v);
    });
    v.addEventListener("pause", function () {
      savePos(v, true);
    });
    // El `0` del reproductor (y nuestro «empezar de cero») saltan al principio: eso borra la posición.
    v.addEventListener("seeked", function () {
      if (v.currentTime < 1) {
        if (videoId) memDel(POS_PREFIX + videoId);
        lastSaved = -1;
      }
    });
    if (v.readyState >= 1) onMeta(v); // por si los metadatos llegaron antes de engancharnos
  }

  function boostVideo() {
    var v = engine();
    if (!v) return false;
    attach(v);
    try {
      if (v.preload !== "auto") v.preload = "auto";
    } catch (e) {}
    return true;
  }

  (function waitForVideo() {
    var tries = 0;
    (function loop() {
      if (boostVideo()) return;
      if (++tries > 40) return; // ~10 s: si no ha aparecido, no hay reproductor en esta página
      setTimeout(loop, 250);
    })();
  })();

  // Al guardar la posición, mejor no depender solo de que el vídeo se pare sola: al cerrar la pestaña
  // o al pasar a otra (que es como se deja un vídeo a medias) se apunta el segundo exacto.
  function saveNow() {
    var v = engine();
    if (v) savePos(v, true);
  }

  addEventListener("pagehide", saveNow);
  addEventListener("beforeunload", saveNow);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") saveNow();
  });

  // --- el vigilante de parones ---------------------------------------------------------------------
  // La web sirve el vídeo con una firma por sesión, y el botón de descarga usa ESA MISMA dirección (y
  // el mismo token): si se cruzan dos peticiones —una descarga, o un gestor de descargas que olfatea
  // la dirección— el CDN puede cortar la del reproductor, y el vídeo se queda parado sin decir nada.
  // Aquí se vigila que el motor siga avanzando (segundos o búfer) y, si se atasca, se reabre el flujo
  // solo: primero con la misma dirección y un `rnd` nuevo, y si vuelve a pasar, pidiéndole a la página
  // una firma fresca. Solo se actúa cuando la fuente es una de las del vídeo; el pre-roll no se toca.
  var STALL_MS = 9000; // tanto tiempo sin avanzar ni bufferear = atascado
  var STALL_TRIES = 4; // reintentos por carga de página
  var stallTries = 0;
  var replenishing = false; // mientras se reabre el flujo, que no se dispare otra vez
  var lastSeenTime = -1;
  var lastSeenBuffered = -1;
  var lastMovedAt = 0;
  var lastRecoverAt = 0; // para no encadenar reintentos a lo loco
  var freshUrls = null; // direcciones nuevas (firma fresca) de esta misma página

  function bufferedEnd(v) {
    try {
      return v.buffered.length ? v.buffered.end(v.buffered.length - 1) : 0;
    } catch (e) {
      return 0;
    }
  }

  function markMoving(v) {
    lastSeenTime = v.currentTime;
    lastSeenBuffered = bufferedEnd(v);
    lastMovedAt = Date.now();
  }

  // Pone al día el `rnd` (la marca de tiempo que el reproductor cuelga de la dirección) sin tocar el
  // token: es la forma de pedir el MISMO archivo como una petición nueva.
  function freshRnd(url) {
    var s = String(url || "");
    if (/^(blob|data|mediastream):/i.test(s)) return s; // estas no admiten consulta detrás
    var now = Date.now();
    var out = s.replace(/([?&])rnd=[^&#]*/i, "$1rnd=" + now);
    if (out === s) out = s + (s.indexOf("?") === -1 ? "?" : "&") + "rnd=" + now;
    return out;
  }

  function fieldOf(html, key) {
    var m = new RegExp(key + "\\s*:\\s*'([^']+)'").exec(html || "");
    return m ? m[1] : "";
  }

  // Firma fresca: se vuelve a pedir la propia página (mismo origen, con la sesión) y se leen las
  // direcciones nuevas de sus `flashvars`. Solo si el primer reintento no ha bastado.
  function refillUrls() {
    if (freshUrls) return Promise.resolve(freshUrls);
    return fetch(location.href, { credentials: "same-origin", cache: "no-store" })
      .then(function (r) {
        return r.ok ? r.text() : "";
      })
      .then(function (html) {
        var pairs = [
          ["video_url", "video_url_text"],
          ["video_alt_url", "video_alt_url_text"],
          ["video_alt_url2", "video_alt_url2_text"],
          ["video_alt_url3", "video_alt_url3_text"]
        ];
        var map = {};
        for (var i = 0; i < pairs.length; i++) {
          var u = fieldOf(html, pairs[i][0]);
          if (u) map[fieldOf(html, pairs[i][1]).toLowerCase()] = u;
        }
        freshUrls = map;
        return map;
      })
      .catch(function () {
        freshUrls = {};
        return freshUrls;
      });
  }

  function showNote(text) {
    var root = playerRoot();
    if (!root || root.querySelector(".r34gv-resume")) return;
    var el = document.createElement("div");
    el.className = "r34gv-resume";
    el.textContent = text;
    root.appendChild(el);
    setTimeout(function () {
      el.className = "r34gv-resume r34gv-resume--out";
    }, 5000);
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 6000);
  }

  // Reabre el flujo conservando el segundo, el volumen y la velocidad.
  function reopen(v, url) {
    var t = v.currentTime;
    var wasPlaying = !v.paused && !v.ended;
    replenishing = true;
    try {
      v.preload = "auto";
    } catch (e) {}
    var once = function () {
      v.removeEventListener("loadedmetadata", once);
      try {
        if (t > 1) v.currentTime = t;
      } catch (e) {}
      if (wasPlaying) {
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
      }
      markMoving(v);
      replenishing = false;
    };
    v.addEventListener("loadedmetadata", once);
    setTimeout(function () {
      replenishing = false; // red de seguridad: si no llega a cargar, que no se quede bloqueado
    }, 20000);
    try {
      v.src = url;
    } catch (e) {
      replenishing = false;
    }
  }

  function recover(v) {
    if (replenishing) return;
    if (Date.now() - lastRecoverAt < 3000) return; // ni dos reintentos pegados
    var src = absUrl(v.currentSrc || v.src);
    if (!src) return;
    stallTries++;
    if (stallTries > STALL_TRIES) return; // ya se ha intentado bastante: manda el reproductor
    lastRecoverAt = Date.now();
    var text = contentSet[stripQuery(src)] || "";
    if (stallTries === 1 || !text) {
      if (window.console) console.log("[r34gv] parón del vídeo: se reabre el flujo");
      showNote("Reconectando el vídeo…");
      reopen(v, freshRnd(src));
      return;
    }
    refillUrls().then(function (map) {
      var url = (text && map[text.toLowerCase()]) || "";
      if (window.console) console.log("[r34gv] parón del vídeo: firma fresca" + (url ? "" : " (no)"));
      showNote("Reconectando el vídeo…");
      reopen(v, freshRnd(url || src));
    });
  }

  function checkStall() {
    if (replenishing || document.hidden) return;
    var v = engine();
    if (!v) return;
    if (v.paused || v.ended || v.seeking) return;
    if (!contentKey(v)) return; // el pre-roll (u otra fuente) no se toca
    if (v.readyState >= 3) return; // hay datos de sobra: no está atascado
    if (!lastMovedAt) {
      lastMovedAt = Date.now();
      return;
    }
    if (Date.now() - lastMovedAt < STALL_MS) return;
    recover(v);
  }

  setInterval(checkStall, 2000);

  // --- Espacio = play/pausa -----------------------------------------------------------------------
  // Es la tecla que el reproductor de la web no tiene: las de Flowplayer (cursores con Shift, números
  // para saltar, M, F…) y los ±5 s con los cursores de `kt_seek.js` ya están puestas, así que aquí
  // solo se añade esta. No se toca nada si el foco está en un campo o en un botón: ahí el espacio es
  // suyo (y si el botón es el del propio reproductor, su acción ya es la correcta).
  function isTyping(el) {
    if (!el) return false;
    if (el.isContentEditable) return true;
    return /^(INPUT|TEXTAREA|SELECT|BUTTON|A|SUMMARY)$/.test(el.tagName || "");
  }

  document.addEventListener(
    "keydown",
    function (e) {
      if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) return;
      if ((e.keyCode || e.which) !== 32) return;
      if (isTyping(document.activeElement)) return;
      var v = engine();
      if (!v) return;
      e.preventDefault(); // que no baje la página
      if (v.paused || v.ended) {
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
      } else {
        v.pause();
      }
    },
    true
  );
})();

// ---------------------------------------------------------------------------------------------
// rule34video.com — limpieza de la página y aligerado de los listados.
//
// Limpieza (lo que no se puede hacer solo con CSS):
// 1) Botones de promoción del header («AI Jerk Off» y «ThePornDude»).
// 2) La banda de aviso de rule34gen («Due to the massive influx of AI generated video's…») que sale
//    pegada debajo del header.
//
// Las dos son enlaces que la web pinta con su propio JS, así que no basta con ocultarlas: se quitan
// del DOM y un MutationObserver vigila que, si vuelven a pintarse, desaparezcan otra vez. Del aviso
// se quita además su contenedor `.headline` (que solo lo envuelve a él), para no dejar el hueco del
// margen inferior.
//
// Aplazado: las fichas de anuncio de la rejilla (el cartel «AD») traen dentro un iframe del servidor
// de anuncios que se descarga su creatividad —y arranca sus temporizadores— en cuanto el navegador lo
// inserta, aunque quede a dos pantallas de distancia. A ese iframe se le aplaza la carga hasta que su
// ficha se acerca a la ventana (la web ingresa la impresión igual, cuando el anuncio va a verse de
// verdad, pero mientras nadie lo mira no cuesta red ni CPU). La ficha, además, se traslada al pie y el
// hueco que deja en la rejilla se rellena con el primer vídeo de la página siguiente del listado, así
// la última fila queda completa.
//
// Trasladado (2): en una ficha de vídeo, el hueco de anuncio que la web pone **debajo del
// reproductor** (`.spot_under`, otra banda de 250 px) se traslada también al pie: ahí queda grande y
// vacía y se ve mal. Se mueve con el anuncio aparcado, igual que la ficha de la rejilla (mover un
// iframe ya cargado lo recargaría y contaría la impresión dos veces).
//
// Y todos los que se trasladan van **a la misma zona**: la fila de huecos de anuncio del propio pie
// de la web (`.footer_spots .columns_spots`, sus 3 zonas + el hueco de JuicyAds), que es donde el
// sitio tiene sus anuncios de abajo. Así el final de la página se lee como «los anuncios del final» y
// no como un cuadro suelto, y no se inventa ni se toca ninguno de sus huecos: se ponen al lado. Sigue
// estando entre los vídeos relacionados y el logo, que es donde el usuario pidió verlo.
//
// Aligerado: la web sirve decenas de miniaturas por página y las aplaza con jquery.lazyload (que
// mide cada ficha en cada evento de scroll: lectura de maquetación forzada por evento). Aquí se le
// adelanta el trabajo al navegador —se resuelve el `src` y se le quita la clase al `img`, y el
// navegador las trae al acercarse con `loading="lazy"`— y se marca `decoding="async"` para que
// descodifiquen fuera del hilo principal. Todo esto es aditivo: si la web cambia, lo peor que pasa
// es que no se aplique.
//
// Aligerado (2): el panel lateral de la web («Trending searches», «Top Categories», «Top Artists»)
// vive fuera de pantalla y se abre con el botón «burger», pero sus 20 imágenes se descargan igual al
// cargar la página: ~0,5 MB que nadie mira (algunos avatares pesan más de 100 KB). Se les guarda la
// dirección y se quedan sin `src` hasta que el panel se abre de verdad.
//
// Página principal (2): el panel «Filters & Sorting» de los listados viene desplegado de fábrica en
// escritorio y ocupa ~290 px de scroll por delante de los vídeos. Se pliega solo si el usuario no ha
// elegido nada (la web guarda su propia preferencia); ver `localStorage["r34gv.filters"]`.
//
// (Se probó también `content-visibility: auto` en las fichas y se descartó: dentro de un subárbol
// saltado por content-visibility los descendientes no tienen caja, así que jquery.lazyload —que mide
// con `.offset()`— mediría 0. Ganancia nula en una rejilla de 24 fichas y riesgo de que la web
// cargue todo de golpe. Con `loading="lazy"` el navegador lo aplaza igual.)
//
// El resto (huecos de anuncios del pie, etc.) es cosa de styles.css. Los ajustes del reproductor
// están en player.js (y por eso sí que importa que el userscript entre en document-start).
//
// Las fichas de anuncio de la rejilla (la que lleva el cartel «AD») no se quitan, solo se aplaza su
// carga (ver más abajo, `localStorage["r34gv.ads"]`).
//
// POLÍTICA DE ANUNCIOS (decidida con el usuario): aquí solo se quitan promociones propias y enlaces
// de afiliado (los botones del header) y el aviso de rule34gen. NO se quita nada de red publicitaria
// (los `.spots` del pie, la ficha de anuncio nativo de la rejilla, el `spot_under`) y no se simulan
// clics en anuncios: eso es fraude publicitario y acaba con la cuenta de anuncios de la web
// suspendida. De la red publicitaria solo se **traslada** de sitio (con su carga aplazada) la ficha de
// la rejilla y el `spot_under` de debajo del reproductor, movidos donde el usuario pidió verlos (el
// hueco del pie y el final del contenido): el anuncio se carga igual, cuando esa parte se mira de
// verdad. Si algún día se añade un selector aquí, que sea de promoción propia, no de anuncio.
// ---------------------------------------------------------------------------------------------
(function () {
  "use strict";
  if (window.__r34gv) return;
  window.__r34gv = true;

  // El bloque de promoción entero y, por si la web lo repinta suelto, cada botón por su cuenta.
  var PROMO = ".panel_header--promo, a.button_fav.ai, a.button_fav.theporndude";
  // El aviso de rule34gen, por su enlace y por sus dos contenedores (por si cambia la estructura).
  var NOTICE = "a.emger, #top-header, #emergency-response-opt";
  var DROP = PROMO + ", " + NOTICE;

  function kill(node) {
    if (node && node.parentNode) node.parentNode.removeChild(node);
  }

  // El nodo, y de paso su contenedor `.headline` si era solo para él (si no, quedaría su margen).
  function killWithBox(node) {
    var box = node.closest ? node.closest(".headline") : null;
    kill(box && box.children.length === 1 ? box : node);
  }

  // Quita el nodo si él mismo está en la lista, y si no, los que lleve dentro. Devuelve cuántos.
  function purge(node) {
    if (!node || node.nodeType !== 1) return 0;
    if (node.matches && node.matches(DROP)) {
      killWithBox(node);
      return 1;
    }
    var hits = node.querySelectorAll ? node.querySelectorAll(DROP) : [];
    var n = 0;
    for (var i = hits.length - 1; i >= 0; i--) {
      killWithBox(hits[i]);
      n++;
    }
    return n;
  }

  function clean() {
    var root = document.documentElement || document.body;
    scanAds(root);
    return purge(root);
  }

  // --- fichas de anuncio de la rejilla -----------------------------------------------------------
  // Cada pocas fichas la rejilla mete una que no es un vídeo: es un anuncio nativo (lleva el cartel
  // «AD» y dentro un iframe del servidor de anuncios). El iframe se trae su creatividad —y arranca sus
  // temporizadores— en cuanto el navegador lo inserta, aunque quede a dos o tres pantallas de
  // distancia: es de lo que más gasta de la página.
  //
  // Por defecto esa ficha **se traslada al pie** (entre el «Jump to … OK» de la paginación y el pie,
  // donde está el logo): fuera del listado, deja de hacerse pasar por un vídeo entre los vídeos, y al
  // pie el anuncio se ve cuando de verdad se mira el final de la página —que es cuando paga—. En
  // cualquier caso la carga se **aplaza** hasta que la ficha entra en el margen de la ventana, así que
  // mientras nadie la mira no cuesta red ni CPU. No se quita: es dinero de la web.
  //
  // El traslado se hace **con el anuncio todavía aparcado** (su `src` original guardado y el iframe en
  // `about:blank`): mover un iframe que ya cargó lo recarga, y eso contaría la impresión dos veces. Si
  // el anuncio ya había cargado cuando lo vimos, la ficha se queda donde estaba.
  //
  // Ajuste, en `localStorage["r34gv.ads"]` (vale para la ficha de la rejilla y para el `spot_under`):
  //   "footer" (por defecto) → trasladarlos a la zona de anuncios del pie (y aplazar su carga hasta
  //                            que se acerquen)
  //   "lazy"                 → dejarlos donde están, solo con la carga aplazada
  //   "eager"                → no tocar nada; el anuncio carga como lo sirva la web
  //   "off"                  → quitar la ficha de anuncio (eso SÍ son ingresos de la web, por eso no
  //                            es lo que viene puesto: ver POLÍTICA DE ANUNCIOS)
  var AD_MARK = "data-r34gv-ad";
  var AD_LINK = 'a.th[title="Advertisement"]';
  var AD_SLOT = "r34gv-footer-ad";
  var AD_MARGIN = 400; // px de margen: se carga un poco antes de entrar en pantalla
  var adMode = (function () {
    try {
      var v = localStorage.getItem("r34gv.ads");
      return v === "eager" || v === "off" || v === "lazy" ? v : "footer";
    } catch (e) {
      return "footer";
    }
  })();
  var parkedAds = [];
  var adTimers = [];
  var adListening = false;

  // La zona de anuncios del final: la fila de huecos de anuncio del propio pie de la web
  // (`.footer_spots .columns_spots`, la que trae sus 3 zonas + el hueco de JuicyAds). Ahí es donde
  // acaban **todos** los anuncios que se trasladan —el `spot_under` de la ficha y la ficha de anuncio
  // de las rejillas—, para que al final de la página se lean como «los anuncios del final» y no como
  // un cuadro suelto. No se inventa ni se toca ningún hueco de los suyos: se meten al lado.
  // Si la página no trae esa fila, se usa su contenedor; y si tampoco hay pie, se devuelve null y cada
  // cosa se queda en su sitio de siempre (el anuncio no se pierde nunca).
  function adZone() {
    var cols = document.querySelector(".footer_spots .columns_spots");
    if (cols) return cols;
    var spots = document.querySelector(".footer_spots");
    if (spots) return spots.querySelector(".container") || spots;
    return null;
  }

  // El hueco de la ficha de la rejilla: en la fila de anuncios del pie. Si no la hay, justo después
  // de la paginación —donde acaba el listado— y por delante del pie, donde está el logo.
  function footerSlot() {
    var slot = document.querySelector("." + AD_SLOT);
    if (slot && document.documentElement.contains(slot)) return slot;
    slot = document.createElement("div");
    slot.className = AD_SLOT;
    var zone = adZone();
    if (zone) {
      zone.appendChild(slot);
      return slot;
    }
    var pag = document.querySelector(".item.jump_to");
    var anchor = pag && pag.closest ? pag.closest(".pagination") || pag.parentNode : null;
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(slot, anchor.nextSibling);
      return slot;
    }
    var before = document.querySelector(".footer") || (document.querySelector(".logo_footer") || {}).parentNode;
    if (before && before.parentNode) before.parentNode.insertBefore(slot, before);
    else if (document.body) document.body.appendChild(slot);
    else return null;
    return slot;
  }

  // El `spot_under` es el hueco de anuncio que la web pone justo debajo del reproductor: una banda de
  // 250 px de alto para un anuncio de 300×250, que ahí queda grande y vacía y se ve mal. En una ficha
  // se traslada a la **zona de anuncios del pie** (`adZone`, al lado de los huecos de la web: sigue
  // estando entre los vídeos relacionados y el logo, que es lo que pidió el usuario) y en un listado
  // no se toca (un hueco de listado no está debajo de ningún reproductor: se exige que su fila lleve
  // el `.video_container`).
  var UNDER_MARK = "data-r34gv-under";
  var underSpots = []; // huecos bajo el reproductor pendientes de colocar

  function underSpotOf(el) {
    if (!el || !el.classList || !el.classList.contains("spot_under")) return null;
    var row = el.parentNode;
    if (!row || !row.classList || !row.classList.contains("row_container")) return null;
    if (!row.querySelector(".video_container")) return null;
    // Y que la página tenga reproductor: es la ficha de vídeo. En un listado puede haber otros huecos
    // y ahí no se toca nada.
    return document.querySelector(".kt-player, #kt_player") ? el : null;
  }

  // ¿Sigue su anuncio aparcado (sin haber llegado a cargar)? Se mira por el iframe, que es lo que se
  // aparcó; si sigue aparcado, mover el hueco otra vez no puede contar ninguna impresión dos veces.
  function underParked(spot) {
    return !!(spot && spot.querySelector && spot.querySelector("iframe[" + AD_MARK + "]"));
  }

  // A dónde va el hueco: a la fila de anuncios del pie. Si esa página no tiene fila de anuncios en el
  // pie, al final del contenido —justo detrás del bloque de «Related Videos», o al final de la
  // columna—, que sigue siendo justo antes del pie. Devuelve false mientras no se pueda (todavía no
  // hay zona), para volver a intentarlo.
  function placeUnder(spot) {
    var zone = adZone();
    if (zone) {
      if (spot.parentNode !== zone) zone.appendChild(spot);
      return true;
    }
    var rel = document.querySelector(".row_container.js-related-filter");
    var host = (rel && rel.parentNode) || (spot.closest ? spot.closest(".content_general") : null);
    if (!host) return false;
    if (rel && rel.parentNode === host) host.insertBefore(spot, rel.nextSibling);
    else host.appendChild(spot);
    return true;
  }

  function moveUnder() {
    for (var i = underSpots.length - 1; i >= 0; i--) {
      var spot = underSpots[i];
      if (!document.documentElement.contains(spot)) {
        // Fuera del documento: o la web ha reescrito ese contenedor, o la página ha cambiado. Si su
        // anuncio sigue aparcado se vuelve a colocar (todavía no ha cargado nada, así que no hay
        // impresión que contar dos veces); si ya está cargando, se deja estar.
        if (!underParked(spot)) {
          underSpots.splice(i, 1);
          continue;
        }
      }
      if (placeUnder(spot)) underSpots.splice(i, 1);
    }
  }

  function parkUnder(spot) {
    if (!spot || spot.hasAttribute(UNDER_MARK)) return;
    spot.setAttribute(UNDER_MARK, "1");
    underSpots.push(spot);
    moveUnder();
    watchAds(); // que el repaso siga vivo hasta que se pueda colocar
  }

  function parkAd(frame) {
    if (!frame || frame.tagName !== "IFRAME" || frame.hasAttribute(AD_MARK)) return;
    // Solo los iframes de las fichas y del hueco de debajo del reproductor, y solo si apuntan fuera
    // (los del propio sitio se dejan en paz).
    var card = frame.closest ? frame.closest(".item.thumb") : null;
    var spot = !card && frame.closest ? underSpotOf(frame.closest(".spot_under")) : null;
    if (!card && !spot) return;
    var grid = card ? card.parentElement : null; // la rejilla de la que sale la ficha (se mira antes de moverla)
    var src = frame.getAttribute("src");
    if (!src || !/^https?:/i.test(src)) return;
    try {
      if (new URL(src, location.href).host === location.host) return;
    } catch (e) {
      return;
    }
    // Si el iframe ya se fue a otro dominio (su documento ya no es accesible) es que el anuncio ya
    // está cargando o ya cargó: se deja como está, que volver a cargarlo lo contaría dos veces.
    var doc = null;
    try {
      doc = frame.contentDocument;
    } catch (e) {
      doc = null;
    }
    if (doc === null) return;
    frame.setAttribute("loading", "lazy"); // por si acaso: el navegador también sabe aplazarlo
    frame.setAttribute(AD_MARK, src);
    frame.setAttribute("src", "about:blank"); // corta la descarga que hubiera empezado
    parkedAds.push(frame);
    // Con el anuncio aún sin cargar, la ficha (o el hueco) se puede mover sin que se recargue nada.
    if (adMode === "footer") {
      if (card) {
        var slot = footerSlot();
        if (slot && !slot.contains(card)) {
          while (slot.firstChild) slot.removeChild(slot.firstChild); // si venía otra, era de un listado ya cambiado
          slot.appendChild(card);
          needFill(grid, 1); // y su hueco en la rejilla se rellena con un vídeo de la página siguiente
        }
      } else {
        parkUnder(spot);
      }
    }
    watchAds();
  }

  function unparkAd(frame) {
    if (!frame || !frame.hasAttribute(AD_MARK)) return;
    var src = frame.getAttribute(AD_MARK);
    frame.removeAttribute(AD_MARK);
    var i = parkedAds.indexOf(frame);
    if (i !== -1) parkedAds.splice(i, 1);
    var now = frame.getAttribute("src");
    // Si la web (o su propio JS) ya le puso otra dirección, se respeta y no se carga la nuestra.
    if (!now || now === "about:blank") frame.setAttribute("src", src);
  }

  // ¿Está ya a tiro de vista (o a punto de estarlo)? Se mide el iframe, no la ficha: si el anuncio se
  // cargó y quedó en un contenedor sin tamaño, la ficha seguiría teniéndolo. Sin tamaño todavía no se
  // puede decidir nada (la maquetación no ha terminado): se espera al siguiente repaso.
  function adInRange(frame) {
    var r;
    try {
      r = frame.getBoundingClientRect();
    } catch (e) {
      return true;
    }
    if (!r.width && !r.height) return false;
    var h = window.innerHeight || 0;
    return r.top < h + AD_MARGIN && r.bottom > -AD_MARGIN;
  }

  function checkAds() {
    railCheck();
    maybeFill();
    moveUnder(); // por si el bloque de relacionados acaba de aparecer
    for (var i = parkedAds.length - 1; i >= 0; i--) {
      if (adInRange(parkedAds[i])) unparkAd(parkedAds[i]);
    }
    if (parkedAds.length === 0 && fillJobs.length === 0 && underSpots.length === 0) watchAds(false); // ya no queda nada que vigilar
  }

  // El repaso va por eventos de scroll/resize (barato: solo mira los anuncios apartados, que son uno o
  // dos, no las 24 fichas como hacía jquery.lazyload) y por unos cuantos tiempos por si la maquetación
  // termina tarde o la página se abre ya desplazada. Nada de IntersectionObserver: en un documento sin
  // pintar (p. ej. una pestaña en segundo plano) no entrega ni una entrada.
  function watchAds(on) {
    if (on === false) {
      for (var t = 0; t < adTimers.length; t++) clearTimeout(adTimers[t]);
      adTimers.length = 0;
      if (adListening) {
        adListening = false;
        removeEventListener("scroll", checkAds, { capture: true });
        removeEventListener("resize", checkAds);
        removeEventListener("load", checkAds);
        document.removeEventListener("visibilitychange", checkAds);
      }
      return;
    }
    if (!adListening) {
      adListening = true;
      addEventListener("scroll", checkAds, { passive: true, capture: true });
      addEventListener("resize", checkAds, { passive: true });
      addEventListener("load", checkAds);
      document.addEventListener("visibilitychange", checkAds);
    }
    if (adTimers.length === 0) {
      var delays = [0, 250, 800, 2000, 5000];
      for (var i = 0; i < delays.length; i++) adTimers.push(setTimeout(checkAds, delays[i]));
    }
  }

  function scanAds(node) {
    if (!node || node.nodeType !== 1 || adMode === "eager") return;
    if (adMode === "off") {
      var links = [];
      if (node.matches && (node.matches(AD_LINK) || node.matches("header"))) links.push(node);
      if (node.querySelectorAll) {
        var found = node.querySelectorAll(AD_LINK + ", .item.thumb > header");
        for (var k = 0; k < found.length; k++) links.push(found[k]);
      }
      for (var m = 0; m < links.length; m++) {
        // El cartel «AD» a secas no basta: solo se quita si de verdad está dentro de una ficha.
        var card = links[m].closest ? links[m].closest(".item.thumb") : null;
        if (card) {
          needFill(card.parentElement, 1); // su hueco se rellena con un vídeo de la página siguiente
          kill(card);
        }
      }
      return;
    }
    var frames = [];
    if (node.tagName === "IFRAME") frames.push(node);
    if (node.querySelectorAll) {
      var hits = node.querySelectorAll("iframe");
      for (var f = 0; f < hits.length; f++) frames.push(hits[f]);
    }
    for (var g = 0; g < frames.length; g++) parkAd(frames[g]);
  }

  // --- rellenar el hueco que deja la ficha de anuncio --------------------------------------------
  // Al sacar el anuncio de la rejilla, la última fila se queda con una casilla menos (un hueco al
  // final). Se rellena con fichas de verdad de la **página siguiente del propio listado**: entra el
  // vídeo que tocaba después (el primero de la página siguiente, saltándose su anuncio si lo trae).
  // Se pide cuando el final de la rejilla se acerca a la ventana, no al cargar —para ver el hueco hay
  // que llegar hasta abajo—, y si la web no contesta, el hueco se queda y no pasa nada más.
  var FILL_MARK = "data-r34gv-fill";
  var FILL_MARGIN = 1200; // px por delante del final de la rejilla en los que ya se pide
  var fillJobs = [];

  function isAdCard(el) {
    if (!el || !el.querySelector) return false;
    return !!(el.querySelector(AD_LINK) || el.querySelector("header") || el.querySelector(".spot-thumb, [data-cl-spot]"));
  }

  // La url que la propia página declara como suya (canonical / og:url). Es la única que sabe de qué
  // listado se trata cuando el enlace de paginación no lleva dirección.
  function declaredUrl(doc) {
    doc = doc || document;
    var el = doc.querySelector('link[rel="canonical"][href], meta[property="og:url"][content]');
    var raw = el ? el.getAttribute("href") || el.getAttribute("content") || "" : "";
    if (!raw) return null;
    try {
      return new URL(raw, baseOf(doc));
    } catch (e) {
      return null;
    }
  }

  // Contra qué se resuelven las direcciones relativas: el `baseURI` del documento manda (la web pone
  // un `<base>` y hay que resolver como el navegador), pero el de un documento traído para leerlo
  // (DOMParser) es `about:blank` y ahí no hay nada que resolver, así que se usa el de la página.
  function baseOf(doc) {
    try {
      if (doc && doc.baseURI && doc.baseURI !== "about:blank") return doc.baseURI;
    } catch (e) {}
    return location.href;
  }

  // ¿Es esta misma página? (misma dirección sin la barra final ni el ancla). Sirve para no traer lo
  // que ya está: en un listado por ajax el enlace «siguiente» a veces apunta a la página en la que
  // ya estás, y traerla duplicaría las fichas.
  function samePage(a, b) {
    var norm = function (u) {
      return String(u || "").replace(/#.*$/, "").replace(/\/+$/, "");
    };
    return !!a && norm(a) === norm(b);
  }

  // Unas páginas llevan la dirección de la siguiente en el enlace, y otras pagan por ajax: el enlace
  // es `#videos` y el número de página va en `data-parameters` (`from:2`). Ahí la dirección se arma
  // con ese número sobre la url declarada (`/models/wkysto/` -> `/models/wkysto/2/`).
  function ajaxPageUrl(link, doc) {
    var m = /(?:^|;)from:(\d+)/.exec(link.getAttribute("data-parameters") || "");
    var n = m ? parseInt(m[1], 10) : 0;
    if (!n || n < 2) return null;
    var u = declaredUrl(doc);
    if (!u) {
      try {
        u = new URL(baseOf(doc));
      } catch (e) {
        return null;
      }
    }
    u.hash = "";
    u.pathname = u.pathname.replace(/\/\d+\/?$/, "/") + n + "/";
    return u.href;
  }

  // A dónde se pide: el enlace «siguiente» de la paginación de este listado (si no hay, es la última
  // página y no hay nada que traer). `doc` es dónde mirar: la página (por defecto) o un documento
  // traído con fetch, que es lo que hace falta para encadenar varias páginas seguidas.
  function nextPageOf(grid, doc) {
    doc = doc || document;
    var pages = doc.querySelectorAll(".pagination"), link = null;
    var id = (grid && grid.id) || "";
    for (var i = 0; i < pages.length; i++) {
      var l = pages[i].querySelector(".pager.next a[href]");
      if (!l) continue;
      var block = l.getAttribute("data-block-id") || "";
      if (!link) link = l;
      if (block && id && id.indexOf(block) === 0) { link = l; break; } // la de nuestro bloque, si se sabe
    }
    if (!link) return null;
    var href = link.getAttribute("href") || "", url = null;
    if (href && href.charAt(0) !== "#") {
      try {
        url = new URL(href, baseOf(doc)).href;
      } catch (e) {
        url = null;
      }
    } else {
      url = ajaxPageUrl(link, doc);
    }
    // sin dirección —o la de esta misma página— no hay nada que traer: se rellenaría con lo que ya hay
    if (!url || samePage(url, location.href) || samePage(url, declaredUrl(doc) && declaredUrl(doc).href)) return null;
    return { url: url, base: id.replace(/_items$/, "") };
  }

  // Las fichas a traer: las de la rejilla del mismo listado en la página siguiente. La web le cambia
  // el nombre al bloque entre páginas, así que si el id no aparece se coge la rejilla más grande que
  // no sea la de la columna lateral.
  function pickCards(doc, base, need, inGrid) {
    var grid = (base && (doc.getElementById(base + "_items") || doc.getElementById(base))) || null;
    var cards = grid ? grid.querySelectorAll(":scope > .item.thumb") : [];
    if (!cards.length) {
      var cands = doc.querySelectorAll(".thumbs"), best = null, bestN = 0, k;
      for (k = 0; k < cands.length; k++) {
        if (cands[k].closest && cands[k].closest(".playlist_sidebar")) continue;
        var n = cands[k].querySelectorAll(":scope > .item.thumb").length;
        if (n > bestN) { bestN = n; best = cands[k]; }
      }
      grid = best;
      cards = grid ? grid.querySelectorAll(":scope > .item.thumb") : [];
    }
    var have = {};
    if (inGrid && inGrid.querySelectorAll) {
      var seen = inGrid.querySelectorAll("[data-video-card-id]");
      for (var h = 0; h < seen.length; h++) have[seen[h].getAttribute("data-video-card-id")] = 1;
    }
    var out = [];
    for (var c = 0; c < cards.length && out.length < need; c++) {
      if (isAdCard(cards[c])) continue; // el anuncio de la página siguiente no nos sirve
      var vid = cards[c].getAttribute("data-video-card-id") || "";
      if (vid && have[vid]) continue; // ya está en la rejilla: esto no es la página siguiente
      out.push(cards[c]);
    }
    return out;
  }

  // Mete en la rejilla las fichas de un HTML ya traído (sin su anuncio y sin repetir ninguna). Es lo
  // que hace el relleno del hueco, y también el reordenado del perfil (profile.js), que necesita
  // leer el listado entero.
  function importCards(grid, html, base, need) {
    if (!html || !grid || !document.documentElement.contains(grid)) return 0;
    var doc = typeof html === "string" ? new DOMParser().parseFromString(html, "text/html") : html;
    var cards = pickCards(doc, base, need, grid);
    for (var i = 0; i < cards.length; i++) {
      var el = document.importNode(cards[i], true);
      el.setAttribute(FILL_MARK, "1");
      grid.appendChild(el);
      takeOver(el); // por si el observador tarda: la miniatura se resuelve ya
      polish(el);
    }
    return cards.length;
  }

  function askFill(grid, need) {
    var info = nextPageOf(grid);
    if (!info) return;
    fetch(info.url, { credentials: "same-origin" }) // es la propia web: misma sesión y mismas cookies
      .then(function (r) {
        return r && r.ok ? r.text() : "";
      })
      .then(function (html) {
        importCards(grid, html, info.base, need);
      })
      .catch(function () {});
  }

  function needFill(grid, n) {
    if (!grid || !grid.nodeType) return;
    for (var i = 0; i < fillJobs.length; i++) {
      if (fillJobs[i].grid === grid) {
        fillJobs[i].need += n;
        return;
      }
    }
    fillJobs.push({ grid: grid, need: n });
    watchAds(); // el repaso de scroll ya está puesto y sirve para esto también
  }

  function maybeFill() {
    for (var i = fillJobs.length - 1; i >= 0; i--) {
      var job = fillJobs[i];
      if (!document.documentElement.contains(job.grid)) {
        fillJobs.splice(i, 1); // la web ya ha cambiado el listado
        continue;
      }
      var r = job.grid.getBoundingClientRect();
      if (!r.height) continue; // todavía sin maquetación
      if (r.bottom > (window.innerHeight || 0) + FILL_MARGIN) continue; // queda rejilla por delante
      fillJobs.splice(i, 1);
      askFill(job.grid, job.need);
    }
  }
  // --- aligerado de imágenes ---------------------------------------------------------------------
  // La web aplaza sus miniaturas con `jquery.lazyload`: en **cada evento de scroll** recorre las
  // fichas y mide dónde está cada una (`.offset()`, que es una lectura de maquetación forzada). Eso
  // es jank puro con la página llena de iframes de anuncios. El navegador sabe hacer exactamente lo
  // mismo sin gastar un tick de JS (`loading="lazy"`), así que se le adelanta el trabajo al plugin:
  // se le pone al `img` la dirección de verdad y se le quitan la clase `lazy-load` y los `data-*`,
  // con lo que `img.lazy-load` no encuentra nada y no hay nada que medir en el scroll. Las imágenes
  // se siguen cargando al acercarse, pero de eso ya se encarga el navegador.
  var MARK = "data-r34gv-img";
  var READY = false; // hasta DOMContentLoaded no hay maquetación: no se puede saber qué está debajo
  var WEBP = (function () {
    try {
      return document.createElement("canvas").toDataURL("image/webp").indexOf("data:image/webp") === 0;
    } catch (e) {
      return false;
    }
  })();

  function takeOverLazyload(img) {
    if (!img || img.nodeType !== 1 || img.tagName !== "IMG") return;
    if (!img.classList || !img.classList.contains("lazy-load")) return;
    // `data-original` es la copia JPG y `data-webp` la de WebP: se elige la que el navegador pinte.
    var src = (WEBP && img.getAttribute("data-webp")) || img.getAttribute("data-original");
    if (src) img.setAttribute("src", src);
    img.classList.remove("lazy-load");
    img.removeAttribute("data-original");
    img.removeAttribute("data-webp");
  }

  // Esto sí se puede hacer en cuanto la imagen existe: no mide nada. Y hay que hacerlo ya, durante
  // el parseo, porque así la clase `lazy-load` desaparece **antes** de que se ejecute el JS de la web
  // (va al final del body): su `find("img.lazy-load")` no encuentra nada y no llega ni a engancharse.
  function takeOver(node) {
    if (!node || node.nodeType !== 1) return;
    if (node.tagName === "IMG") {
      takeOverLazyload(node);
      return;
    }
    var found = node.querySelectorAll ? node.querySelectorAll("img.lazy-load") : [];
    for (var i = 0; i < found.length; i++) takeOverLazyload(found[i]);
  }

  function polishImg(img) {
    if (!img || img.nodeType !== 1 || img.hasAttribute(MARK)) return;
    img.setAttribute(MARK, "1");
    if (!img.hasAttribute("decoding")) img.setAttribute("decoding", "async");
    var top = 0;
    try {
      top = img.getBoundingClientRect().top;
    } catch (e) {}
    if (top > (window.innerHeight || 0)) img.setAttribute("loading", "lazy");
  }

  function polish(node) {
    if (!node || node.nodeType !== 1) return;
    if (node.tagName === "IMG") {
      polishImg(node);
      return;
    }
    var found = node.querySelectorAll ? node.querySelectorAll("img") : [];
    for (var i = 0; i < found.length; i++) polishImg(found[i]);
  }

  function sweep() {
    READY = true;
    var root = document.documentElement || document.body;
    takeOver(root); // por si alguna imagen se coló antes de que el observador estuviera puesto
    railStash(root);
    filtersCollapse();
    polish(root);
    scanAds(root); // y por si la ficha de anuncio ya estaba puesta
    moveUnder(); // y por si el hueco de debajo del reproductor ya estaba puesto
  }

  // --- el panel lateral de fuera de pantalla ------------------------------------------------------
  // `.sidebar-aside` es el panel que sale por la izquierda al pulsar el «burger»: «Trending
  // searches», «Top Categories» y «Top Artists». La web lo esconde con `visibility`/`transform`
  // —sigue en el documento y con tamaño—, así que sus 20 imágenes se descargan en cada carga aunque
  // el usuario no abra el panel nunca: ~0,5 MB y 20 peticiones (tres avatares de modelo pasan de
  // 100 KB cada uno). Aquí se les guarda la dirección en un atributo propio y se dejan apuntando a un
  // GIF de 1×1; en cuanto el panel se abre de verdad se les devuelve la dirección y se ven igual.
  // Es aditivo: si el panel no está, no pasa nada.
  var RAIL = ".sidebar-aside";
  var RAIL_ATTR = "data-r34gv-rail";
  var RAIL_BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  var railOpen = false; // en cuanto se abre una vez ya no se toca nada más del panel

  function railStashImg(img) {
    if (railOpen || !img || img.nodeType !== 1 || img.tagName !== "IMG") return;
    if (img.hasAttribute(RAIL_ATTR) || !img.closest || !img.closest(RAIL)) return;
    takeOverLazyload(img); // resuelve `data-original`/`data-webp` y le quita la clase `lazy-load`
    var src = img.getAttribute("src");
    if (!src || /^data:/i.test(src)) return;
    img.setAttribute(RAIL_ATTR, src);
    img.setAttribute("src", RAIL_BLANK); // esto aborta la descarga si ya había empezado
  }

  function railStash(node) {
    if (railOpen || !node || node.nodeType !== 1) return;
    railStashImg(node);
    var found = node.querySelectorAll ? node.querySelectorAll("img") : [];
    for (var i = 0; i < found.length; i++) railStashImg(found[i]);
  }

  function railRestore() {
    railOpen = true;
    var imgs = document.querySelectorAll("img[" + RAIL_ATTR + "]");
    for (var i = 0; i < imgs.length; i++) {
      imgs[i].setAttribute("src", imgs[i].getAttribute(RAIL_ATTR));
      imgs[i].removeAttribute(RAIL_ATTR);
    }
  }

  function railCheck() {
    if (railOpen) return;
    var wrap = document.querySelector(".wrapper");
    if (wrap && wrap.classList && wrap.classList.contains("active")) railRestore(); // así lo abre la web
  }

  // El clic del «burger» es la otra señal (y la de verdad): se restablece en el mismo clic, así que
  // las imágenes van llegando mientras el panel se desliza.
  document.addEventListener("click", function (e) {
    if (railOpen) return;
    var t = e.target;
    if (t && t.closest && t.closest(".burger")) railRestore();
  }, true);

  // --- «Filters & Sorting»: plegado de entrada ----------------------------------------------------
  // En escritorio la web pinta el panel desplegado (su JS: `isMobile ? false : true`) y son ~380 px
  // de botones de orden, fecha, duración y «verified uploaders» por delante de la rejilla: en una
  // pantalla de 900 px no se llega a ver ni media fila de vídeos al entrar. Plegado, la rejilla sube
  // 290 px y el botón «Filters & Sorting» sigue ahí, a un clic, para abrirlo.
  //
  // Se pliega **solo si el usuario no ha elegido nada**: la web guarda su preferencia en
  // `filtersPanelState:<id>` en cuanto él lo abre o lo cierra, y a partir de ahí no se toca. Como la
  // web aplica la suya al arrancar, se escribe también esa clave: si no, su JS lo desplegaría otra
  // vez en cuanto llegara a su código.
  //   localStorage["r34gv.filters"]: "closed" (por defecto) → plegar; "open" → no tocar nada.
  var filtersMode = (function () {
    try {
      return localStorage.getItem("r34gv.filters") === "open" ? "open" : "closed";
    } catch (e) {
      return "closed";
    }
  })();

  function filtersCollapse() {
    if (filtersMode === "open") return;
    var panels = document.querySelectorAll(".filters-panel[data-filters-panel]");
    for (var i = 0; i < panels.length; i++) {
      var panel = panels[i];
      var toggle = panel.querySelector(".filters-panel__toggle");
      var body = panel.querySelector(".filters-panel__body");
      if (!toggle || !body) continue; // aún a medio construir: ya volverá a pasar por aquí
      var key = "filtersPanelState:" + (panel.getAttribute("data-filters-panel") || "default");
      var stored = null;
      try {
        stored = localStorage.getItem(key);
      } catch (e) {
        stored = null;
      }
      if (stored === "open") continue; // el usuario lo abrió a propósito: eso manda
      if (!panel.classList.contains("filters-panel--collapsed")) {
        panel.classList.add("filters-panel--collapsed");
        panel.classList.remove("filters-panel--expanded");
        toggle.setAttribute("aria-expanded", "false");
      }
      // Si no había preferencia guardada, se deja escrito el «cerrado»: la web lo lee al arrancar y
      // si no, lo desplegaría otra vez en cuanto llegara a su código.
      if (stored === null) {
        try {
          localStorage.setItem(key, "closed");
        } catch (e) {}
      }
    }
  }

  // El panel (y sus trozos) llegan durante el parseo y también por AJAX al filtrar o buscar: solo se
  // mira cuando el nodo tiene que ver con él. Ojo: lo normal es que llegue dentro de un subárbol
  // grande (una respuesta de AJAX entera), así que hay que mirar también hacia abajo.
  function filtersMaybe(node) {
    if (!node || node.nodeType !== 1 || !node.closest) return;
    if ((node.matches && node.matches(".filters-panel")) || node.closest(".filters-panel")) {
      filtersCollapse();
      return;
    }
    if (node.querySelector && node.querySelector(".filters-panel")) filtersCollapse();
  }

  // La web también mete contenido por AJAX (los listados, el buscador), así que esto puede reaparecer
  // en cualquier momento. Solo se miran los nodos AÑADIDOS, así que nuestras propias eliminaciones no
  // vuelven a dispararlo (nada de bucles).
  var obs = new MutationObserver(function (records) {
    for (var i = 0; i < records.length; i++) {
      var added = records[i].addedNodes;
      for (var j = 0; j < added.length; j++) {
        purge(added[j]);
        scanAds(added[j]);
        if (underSpots.length) moveUnder(); // el bloque de relacionados llega después del hueco
        railStash(added[j]);
        takeOver(added[j]);
        filtersMaybe(added[j]);
        if (READY) polish(added[j]);
      }
    }
  });

  // El userscript entra en document-start (lo necesita player.js), así que aquí no se puede dar por
  // hecho que el documento ya tenga raíz: si todavía no la tiene (raro), se engancha en cuanto la
  // haya. Observar desde el principio es lo que hace que los botones de promoción no lleguen ni a
  // pintarse, en vez de quitarlos después con el parpadeo de rigor.
  var observing = false;
  function boot() {
    if (observing) return true;
    var root = document.documentElement || document.body;
    if (!root) return false;
    clean();
    obs.observe(root, { childList: true, subtree: true });
    observing = true;
    return true;
  }

  // Lo que hay que saber para leer un listado entero (la página siguiente de la paginación y cómo
  // meter sus fichas) se comparte aquí: lo usa el relleno del hueco y lo usa el perfil (profile.js),
  // y así el conocimiento de las dos formas de paginar (enlace normal y ajax) vive en un solo sitio.
  window.r34gvCore = {
    nextPageOf: nextPageOf,
    importCards: importCards,
    isAdCard: isAdCard,
    samePage: samePage
  };

  if (!boot()) {
    document.addEventListener("DOMContentLoaded", boot);
    var retry = setInterval(function () {
      if (boot()) clearInterval(retry);
    }, 20);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      clean();
      sweep();
    });
  } else {
    sweep();
  }
})();

// ---------------------------------------------------------------------------------------------
// rule34video.com — el perfil de un creador (vale para cualquier perfil: modelo, canal, usuario).
//
// La web deja la cabecera del perfil sin ficha —el nombre, un 89% y el botón «Subscribe», todo
// apilado en una caja de 220 px con un icono genérico— y debajo el listado por fecha. Aquí se hacen
// dos cosas:
//
// 1) CABECERA DE PERFIL (como una ficha de verdad): avatar (su inicial, o el que ponga la web si
//    algún día lo pone), nombre, valoración y la acción a la derecha; el título del listado se rebaja
//    a subtítulo y los filtros quedan como una barra compacta. Eso es CSS (styles.css, bajo
//    `html.r34gv-profile`); aquí solo se marca la página y se le pasa la inicial.
//
// 2) REORDENAR LOS VÍDEOS POR PERSONAJE, si el usuario quiere. La web los pone por fecha, y así un
//    vídeo de Lisa queda entre uno de Wednesday y uno de Sabrina. El orden por defecto pasa a ser
//    **por personaje, del que más vídeos tiene al que menos**, y cada grupo lleva su cartel.
//
//    ¿De dónde sale el personaje, si la web no lo dice en la ficha? Del propio título, y sin saber
//    nada de nadie: se cuentan las palabras de los títulos y **una que sale en dos o más vídeos del
//    perfil es un nombre** (un personaje); una que sale en uno solo es una postura, un adjetivo o lo
//    que sea. Así funciona con cualquier perfil, se llame su gente como se llame; y si los títulos no
//    repiten ningún nombre (un canal de escenas sueltas, p. ej.) se queda el orden de la web y se
//    avisa en la barra. Se guarda en `localStorage["r34gv.profile.sort"]` ("character" por defecto,
//    "date" para dejarlo como la web), y `r34gv.profile.head` = "off" para no tocar la cabecera.
//
// SIN LAG, que era la condición: nada de escuchar el scroll ni de medir al desplazarse. Es un
// análisis de texto (una lectura por ficha) y **una sola reordenación** del DOM hecha con un
// `DocumentFragment` (un reflow), y luego quieto. El único vigilante es un MutationObserver sobre la
// rejilla, que solo se despierta si la web cambia el listado por AJAX (paginación o filtros).
// ---------------------------------------------------------------------------------------------
(function () {
  "use strict";
  if (window.__r34gvProfile) return;
  window.__r34gvProfile = true;

  var CORE = window.r34gvCore; // lo deja core.js: la página siguiente de un listado y meter sus fichas
  var SORT_KEY = "r34gv.profile.sort"; // "character" (por defecto) | "date"
  var HEAD_KEY = "r34gv.profile.head"; // "off" no toca la cabecera
  var GROUP = "r34gv-group";
  var MULTI = "data-r34gv-multi";
  var MAX_PAGES = 4; // páginas de más que se traen para contar bien (esta + hasta 4)
  var MAX_CARDS = 180; // tope de fichas analizadas: un perfil no es un archivo infinito
  var WAIT = 260; // ms de calma antes de rehacer el orden (la web mete fichas por AJAX)
  var OTHERS = "Otros";

  // --- palabras que no son un personaje ---------------------------------------------------------
  // Todo lo que aparece en los títulos de estos sitios y no es un nombre: actos, posturas, calidad,
  // muletillas. Lo que filtra de verdad es tener que salir en **dos o más vídeos** para contar como
  // nombre; esta lista solo evita que un «cowgirl» repetido en cinco títulos parezca un personaje.
  var STOP = (
    "a an the and or of in on at to for with without my your his her its our their she he they you me it is are was were be been " +
    "this that these those from by as into over under again more most less least very much many all any some no not only own same than too " +
    "can will just should now then there here when where who what why how while during before after " +
    "video videos clip clips part parts full length hd hq uhd 4k 8k 60fps 30fps fps " +
    "sex porn porno xxx anal vaginal oral blow blowjob bj handjob hj tit titjob titfuck titty tits boobs breast ass pussy cock dick dildo " +
    "cum cumshot cumshots creampie facial facials swallow load loads squirt squirting pee piss golden " +
    "fuck fucks fucked fucking fuckslut fucktoy slut sluts sloppy hardcore hard fast slow rough gentle deep deeper deepthroat throat " +
    "cowgirl doggy doggystyle missionary spoon standing sitting lying riding ride rides prone lotus piledriver amazon reverse " +
    "pov solo duo threesome foursome gangbang orgy multi multiple " +
    "animation animated anime hentai manga cartoon toon blender sfm source filmmaker unreal unity " +
    "ai generated generation making create created character characters model models " +
    "edit edited remake remaster remastered version extended uncensored censored subtitled sub subs dub dubbed english spanish japanese " +
    "new newest old best top rated viewed longest random popular hot sexy good bad great nice " +
    "compilation teaser trailer preview sample short first second third last next " +
    "girl girls boy boys man men woman women lady ladies milf gilf teen teens young ebony asian latina " +
    "white black redhead blonde brunette futa futanari dickgirl shemale tranny trans " +
    "inside outside up down top bottom back front side left right " +
    "love loves loving like likes lick licking licks suck sucks sucked sucking kiss kissing " +
    "camera cam close closeup shot shots scene scenes angle angles view " +
    "let lets get gets got give gives take takes make makes made do does did " +
    "vs feat featuring ft watch watching free download stream online tube site " +
    "mouth mouthfuck mouthful titsjob boobjob footjob handjob blacked bbc bwc bdsm " +
    "sloppy sloopy boddy distracting distracted ahegao orgasm orgasms moaning moans " +
    "head tongue finger fingers toys toy " +
    "time times hour hours minute minutes second seconds day days week weeks month months year years ago " +
    "size sizes big huge giant small tiny little mega ultra super mmf ffm fff mfm"
  ).split(/\s+/);
  var stop = {};
  for (var i = 0; i < STOP.length; i++) stop[STOP[i]] = 1;

  // Un «nombre» es una palabra suelta o una con guión o apóstrofo (y vale cualquier alfabeto: los
  // nombres japoneses o rusos cuentan igual). Si el navegador no entiende `\p{L}`, se cae a ASCII.
  var WORD = (function () {
    try {
      return new RegExp("[\\p{L}\\p{N}][\\p{L}\\p{N}'’_-]*", "gu");
    } catch (e) {
      return /[A-Za-z0-9][A-Za-z0-9'’_-]*/g;
    }
  })();

  // Dónde acaba lo que habla del vídeo y empieza la etiqueta. En estos títulos lo de después de una
  // barra, un paréntesis, dos puntos o un guión suelto suele ser la serie o el juego («… | Fortnite»,
  // «(WKYSTO)», «… - 69 Blowjob») y no el personaje, así que la parte de delante (la «cabeza») es la
  // que cuenta para decidir si una palabra es un nombre. El guión de «Chun-Li» no separa: va sin
  // espacios alrededor.
  var SEP = /(\s*[|(\u00b7:]\s*|\s+[\u2013\u2014-]\s+)/;

  function headOf(title) {
    var m = SEP.exec(title);
    return m ? title.slice(0, m.index) : title;
  }

  var grid = null;
  var bar = null;
  var chipsEl = null;
  var noteEl = null;
  var mode = pref(SORT_KEY) === "date" ? "date" : "character";
  var snapshot = null; // el orden de la web, para poder volver a él
  var loaded = false; // ¿se han traído ya las páginas que faltaban?
  var loading = false;
  var started = false;
  var observer = null;
  var timer = 0;

  function pref(key) {
    try {
      return localStorage.getItem(key) || "";
    } catch (e) {
      return "";
    }
  }

  function setPref(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  }

  function say(text) {
    if (!noteEl) return;
    noteEl.textContent = text || "";
    noteEl.hidden = !text;
  }

  // Todas las fichas de la rejilla que son vídeos (el anuncio nativo de la rejilla no: no es un vídeo
  // ni tiene título que analizar).
  function cards() {
    if (!grid) return [];
    return [].slice.call(grid.querySelectorAll(":scope > .item.thumb")).filter(function (el) {
      return !(CORE && CORE.isAdCard && CORE.isAdCard(el));
    });
  }

  // Lo demás que vive en la rejilla (el hueco de anuncio nativo, p. ej.): no se analiza, pero no se
  // puede perder por el camino —se pondría el primero de la lista al reordenar— ni quedar sin sitio.
  function extras() {
    if (!grid) return [];
    return [].slice.call(grid.children).filter(function (el) {
      if (!el.classList || el.classList.contains(GROUP)) return false;
      if (el.classList.contains("item") && el.classList.contains("thumb")) {
        return !!(CORE && CORE.isAdCard && CORE.isAdCard(el)); // la ficha de anuncio no es un vídeo
      }
      return true; // cualquier otra cosa que la web tenga dentro de la rejilla
    });
  }

  function titleOf(card) {
    var a = card.querySelector("a.th[title]");
    var t = a ? a.getAttribute("title") : "";
    if (!t) {
      var el = card.querySelector(".thumb_title");
      t = el ? el.textContent : "";
    }
    return String(t || "").replace(/\s+/g, " ").trim();
  }

  function words(text) {
    var out = [], m;
    WORD.lastIndex = 0;
    while ((m = WORD.exec(text))) out.push(m[0]);
    return out;
  }

  // El nombre del propio perfil («Wkysto») no es un personaje de sus vídeos: se aparta.
  function profileWords() {
    var el = document.querySelector(".panel_sup .title");
    var out = {};
    if (!el) return out;
    var ws = words(el.textContent || "");
    for (var i = 0; i < ws.length; i++) out[ws[i].toLowerCase()] = 1;
    return out;
  }

  // --- el análisis ------------------------------------------------------------------------------
  // Devuelve {groups: [{key, name, count, cards}], others: [ficha]}. Cada grupo es un personaje y
  // `count` son sus vídeos (los que lo llevan en el título), que es por lo que se ordena.
  function analyze(list) {
    var mine = profileWords();
    var info = {}, k, j;

    for (k = 0; k < list.length; k++) {
      var title = titleOf(list[k]);
      var ws = words(title);
      var hw = words(headOf(title)), head = {};
      for (j = 0; j < hw.length; j++) head[hw[j].toLowerCase()] = 1;
      list[k].r34gvWords = ws;
      var once = {}, onceHead = {};
      for (j = 0; j < ws.length; j++) {
        var w = ws[j], key = w.toLowerCase();
        if (w.length < 2 || stop[key] || mine[key] || /^\d+$/.test(w)) continue;
        if (w.charAt(0) !== w.charAt(0).toUpperCase()) continue; // los nombres van en mayúscula
        var rec = info[key] || (info[key] = { key: key, name: w, count: 0, heads: 0, pos: 0, at: k, vids: {} });
        if (!once[key]) {
          once[key] = 1; // una vez por vídeo: lo que se cuenta son vídeos, no veces
          rec.count++;
          rec.vids[k] = 1;
          rec.pos += j;
        }
        if (head[key] && !onceHead[key]) {
          onceHead[key] = 1;
          rec.heads++;
        }
      }
    }

    // Un nombre es una palabra que **encabeza** el título (antes de la etiqueta) en dos o más vídeos,
    // y si todos los vídeos de un nombre salen también en los de otro es que es una etiqueta de ese
    // otro («Blackpink» no sale nunca sin «Lisa»), no un personaje: se cae.
    var names = [];
    for (var key2 in info) {
      if (!Object.prototype.hasOwnProperty.call(info, key2)) continue;
      if (info[key2].heads >= 2) names.push(info[key2]);
    }
    function subset(a, b, n) {
      var any = false;
      for (var v = 0; v < n; v++) {
        if (!a[v]) continue;
        any = true;
        if (!b[v]) return false;
      }
      return any;
    }
    names = names.filter(function (a) {
      for (var t = 0; t < names.length; t++) {
        if (names[t] !== a && subset(a.vids, names[t].vids, list.length)) return false;
      }
      return true;
    });
    // Orden: los que más vídeos tienen y, a igualdad, el que aparece antes en los títulos (y antes en
    // la rejilla).
    names.sort(function (a, b) {
      if (a.count !== b.count) return b.count - a.count;
      var pa = a.pos / a.count, pb = b.pos / b.count;
      if (pa !== pb) return pa - pb;
      if (a.at !== b.at) return a.at - b.at;
      return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
    });
    var rank = {};
    for (k = 0; k < names.length; k++) rank[names[k].key] = k;

    // Cada vídeo va con el nombre mejor colocado de su título; si lleva dos o más (esos que no son
    // «de un solo personaje») se apunta y van al final de su grupo.
    var groups = [];
    for (k = 0; k < names.length; k++) groups.push({ key: names[k].key, name: names[k].name, count: 0, cards: [], shared: [] });
    var others = [];
    for (k = 0; k < list.length; k++) {
      var found = [];
      for (j = 0; j < list[k].r34gvWords.length; j++) {
        var kk = list[k].r34gvWords[j].toLowerCase();
        if (rank[kk] != null && found.indexOf(rank[kk]) === -1) found.push(rank[kk]);
      }
      if (!found.length) {
        list[k].removeAttribute(MULTI);
        others.push(list[k]);
        continue;
      }
      found.sort(function (a, b) {
        return a - b;
      });
      var g = groups[found[0]];
      if (found.length > 1) {
        list[k].setAttribute(MULTI, "1");
        g.shared.push(list[k]);
      } else {
        list[k].removeAttribute(MULTI);
        g.cards.push(list[k]);
      }
      g.count++;
    }
    for (k = 0; k < groups.length; k++) groups[k].cards = groups[k].cards.concat(groups[k].shared);
    // Un nombre que se quedó sin ningún vídeo (salía en dos títulos pero siempre acompañado de otro
    // mejor situado) no pinta nada como grupo: fuera. Y los grupos, del que más vídeos tiene al que
    // menos, que es el orden que se pidió.
    groups = groups.filter(function (g) {
      return !!g.cards.length;
    });
    groups.sort(function (a, b) {
      return b.cards.length - a.cards.length;
    });
    return { groups: groups, others: others };
  }

  // --- pintar -----------------------------------------------------------------------------------
  function labelFor(name, count, shared) {
    var el = document.createElement("div");
    el.className = GROUP;
    el.setAttribute("data-r34gv-group", name.toLowerCase());
    var n = document.createElement("span");
    n.className = "r34gv-group__name";
    n.textContent = name;
    var c = document.createElement("span");
    c.className = "r34gv-group__n";
    c.textContent = (count === 1 ? "1 vídeo" : count + " vídeos") + (shared ? " · " + shared + " compartido" + (shared > 1 ? "s" : "") : "");
    el.appendChild(n);
    el.appendChild(c);
    return el;
  }

  function strip() {
    if (!grid) return;
    var labels = grid.querySelectorAll(":scope > ." + GROUP);
    for (var i = 0; i < labels.length; i++) labels[i].parentNode.removeChild(labels[i]);
  }

  function write(nodes) {
    var frag = document.createDocumentFragment();
    for (var i = 0; i < nodes.length; i++) frag.appendChild(nodes[i]);
    grid.appendChild(frag); // de una vez: un solo reflow
  }

  function restore() {
    strip();
    var all = cards(), have = [], order = [];
    for (var i = 0; i < all.length; i++) have.push(all[i]);
    if (snapshot) {
      for (i = 0; i < snapshot.length; i++) {
        var at = have.indexOf(snapshot[i]);
        if (at > -1 && document.documentElement.contains(snapshot[i])) {
          order.push(snapshot[i]);
          have.splice(at, 1);
        }
      }
    }
    for (i = 0; i < have.length; i++) order.push(have[i]);
    write(order.concat(extras()));
  }

  function render(sorted) {
    strip();
    if (!sorted.groups.length) {
      restore();
      say("Ningún nombre se repite en los títulos: se queda el orden de la web.");
      chipsFor(sorted);
      return;
    }
    var nodes = [];
    for (var g = 0; g < sorted.groups.length; g++) {
      var grp = sorted.groups[g];
      nodes.push(labelFor(grp.name, grp.cards.length, grp.shared.length));
      for (var i = 0; i < grp.cards.length; i++) nodes.push(grp.cards[i]);
    }
    if (sorted.others.length) {
      nodes.push(labelFor(OTHERS, sorted.others.length, 0));
      for (i = 0; i < sorted.others.length; i++) nodes.push(sorted.others[i]);
    }
    write(nodes.concat(extras()));
    say("Ordenado por personaje · " + sorted.groups.length + (sorted.groups.length === 1 ? " personaje" : " personajes") + " · " + cards().length + " vídeos.");
    chipsFor(sorted);
  }

  function chipsFor(sorted) {
    if (!chipsEl) return;
    while (chipsEl.firstChild) chipsEl.removeChild(chipsEl.firstChild);
    var top = sorted.groups.slice(0, 8);
    for (var i = 0; i < top.length; i++) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "r34gv-chip";
      b.textContent = top[i].name + " · " + top[i].count;
      b.onclick = (function (key) {
        return function () {
          var el = grid.querySelector(':scope > .' + GROUP + '[data-r34gv-group="' + key.replace(/"/g, '\\"') + '"]');
          if (el && el.scrollIntoView) el.scrollIntoView({ block: "start" });
        };
      })(top[i].key);
      chipsEl.appendChild(b);
    }
    chipsEl.hidden = !top.length;
  }
  // --- /pintar ----------------------------------------------------------------------------------

  function regroup() {
    if (!grid || !document.documentElement.contains(grid)) return;
    if (observer) observer.disconnect(); // lo que hace el userscript no es un cambio de la web
    var list = cards();
    if (!snapshot) snapshot = list.slice();
    var sorted = analyze(list);
    if (mode === "date") {
      restore();
      chipsFor(sorted);
    } else {
      render(sorted);
    }
    if (observer) observer.observe(grid, { childList: true });
  }

  function schedule() {
    if (loading || timer) return; // mientras se leen las páginas que faltan, un solo repaso al final
    timer = setTimeout(function () {
      timer = 0;
      regroup();
    }, WAIT);
  }

  // Trae las páginas que faltan del perfil para contar sobre el listado entero (con tope: un perfil de
  // 3.000 vídeos no se descarga entero solo por reordenar). Es lo mismo que hace el relleno del hueco
  // (core.js), encadenando la paginación de cada página traída.
  function loadRest() {
    if (loaded || loading || !CORE || !grid) return;
    loading = true;
    var pages = 0, doc = null;

    function stop() {
      loading = false;
      loaded = true;
      if (mode === "character") regroup();
      else say("");
    }

    function step() {
      if (!document.documentElement.contains(grid) || pages >= MAX_PAGES || cards().length >= MAX_CARDS) return stop();
      var info = CORE.nextPageOf(grid, doc);
      if (!info) return stop();
      pages++;
      fetch(info.url, { credentials: "same-origin" })
        .then(function (r) {
          return r && r.ok ? r.text() : "";
        })
        .then(function (html) {
          if (!html) return stop();
          var parsed = new DOMParser().parseFromString(html, "text/html");
          CORE.importCards(grid, parsed, info.base, MAX_CARDS);
          doc = parsed; // la paginación de la página traída es la que dice cuál viene después
          say("Leyendo el resto del perfil para contar bien… (" + cards().length + " vídeos)");
          step();
        })
        .catch(function () {
          stop();
        });
    }
    say("Leyendo el resto del perfil para contar bien…");
    step();
  }

  // --- la barra y la cabecera -------------------------------------------------------------------
  function buildBar() {
    if (bar) return;
    bar = document.createElement("div");
    bar.className = "r34gv-bar";

    var seg = document.createElement("div");
    seg.className = "r34gv-seg";
    var opts = [
      ["character", "Por personaje"],
      ["date", "Más recientes"]
    ];
    for (var i = 0; i < opts.length; i++) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "r34gv-seg__btn" + (mode === opts[i][0] ? " is-on" : "");
      b.setAttribute("data-mode", opts[i][0]);
      b.textContent = opts[i][1];
      b.onclick = choose;
      seg.appendChild(b);
    }
    chipsEl = document.createElement("div");
    chipsEl.className = "r34gv-chips";
    chipsEl.hidden = true;
    noteEl = document.createElement("span");
    noteEl.className = "r34gv-bar__note";
    noteEl.hidden = true;
    bar.appendChild(seg);
    bar.appendChild(chipsEl);
    bar.appendChild(noteEl);
    grid.parentNode.insertBefore(bar, grid);
  }

  function choose(e) {
    var want = e.currentTarget.getAttribute("data-mode");
    if (want === mode) return;
    mode = want;
    setPref(SORT_KEY, want);
    var btns = bar.querySelectorAll(".r34gv-seg__btn");
    for (var i = 0; i < btns.length; i++) btns[i].classList.toggle("is-on", btns[i] === e.currentTarget);
    say("");
    regroup();
    if (mode === "character") loadRest();
  }

  function head() {
    if (pref(HEAD_KEY) === "off") return;
    var panel = document.querySelector(".panel_sup");
    if (!panel) return;
    document.documentElement.classList.add("r34gv-profile");
    var wrap = panel.querySelector(".brand_image_wrapper");
    if (!wrap) return;
    // Si la web pone un avatar de verdad (una imagen de fondo), se respeta. Si lo que hay es su icono
    // genérico, se pone la inicial del perfil, que la pinta el CSS con esta variable.
    var bg = "";
    try {
      bg = getComputedStyle(wrap).backgroundImage || "";
    } catch (e) {}
    var name = (panel.querySelector(".title") || {}).textContent || "";
    var initial = String(name).replace(/[^0-9A-Za-z\u00C0-\u024F\u0400-\u04FF]/g, "").charAt(0);
    if (!initial || (bg && bg !== "none")) return;
    document.documentElement.setAttribute("data-r34gv-initial", "1");
    document.documentElement.style.setProperty("--r34gv-initial", '"' + initial.toUpperCase() + '"');
  }

  function start() {
    if (started) return true;
    if (!document.querySelector(".panel_sup")) return false; // un listado cualquiera no es un perfil
    grid = document.querySelector(".thumbs");
    if (!grid) return false;
    started = true;
    head();
    buildBar();
    snapshot = cards().slice();
    regroup();
    if (mode === "character") loadRest();

    // Solo se miran las fichas que añade o quita la web (AJAX: paginación, filtros). Mientras el
    // userscript reordena el observador está desconectado, así que sus propios movimientos no cuentan
    // y no hay idas y venidas.
    function isCard(n) {
      return n && n.nodeType === 1 && n.classList && n.classList.contains("item") && n.classList.contains("thumb");
    }
    observer = new MutationObserver(function (records) {
      for (var i = 0; i < records.length; i++) {
        var rec = records[i], j;
        for (j = 0; j < rec.addedNodes.length; j++) {
          if (isCard(rec.addedNodes[j])) {
            schedule();
            return;
          }
        }
        for (j = 0; j < rec.removedNodes.length; j++) {
          if (isCard(rec.removedNodes[j])) {
            schedule();
            return;
          }
        }
      }
    });
    observer.observe(grid, { childList: true });
    return true;
  }

  // El userscript entra en document-start (lo pide player.js), así que cuando se ejecuta esto la
  // página del perfil **todavía no está**: se espera a que aparezca (el propio documento la trae, o
  // la mete su JS). Igual que hace core.js: a la primera no, y luego se reintenta.
  if (!start()) {
    document.addEventListener("DOMContentLoaded", start);
    var tries = 0;
    var retry = setInterval(function () {
      // ~8 s y no se insiste más: un listado que no es de un perfil (la home, una búsqueda) no se
      // queda mirando para siempre.
      if (start() || ++tries > 200) clearInterval(retry);
    }, 40);
  }

  // Para probarlo desde la consola: r34gvProfile.mode("date") / r34gvProfile.mode("character")
  window.r34gvProfile = {
    mode: function (m) {
      if (m === "character" || m === "date") {
        setPref(SORT_KEY, m);
        mode = m;
        regroup();
        if (m === "character") loadRest();
      }
      return mode;
    },
    regroup: regroup,
    analyze: function () {
      return analyze(cards());
    }
  };
})();

// ---------------------------------------------------------------------------------------------
// rule34video.com — el registrador de la sesión (a petición del usuario: «al rato se cae la cuenta»).
//
// Esto NO es una función para el visitante normal: es una herramienta de diagnóstico que está
// **apagada por defecto y no cuesta nada mientras esté apagada** (si el interruptor no está puesto,
// el módulo termina aquí mismo, antes de poner un solo temporizador). Se enciende a mano:
//
//   localStorage["r34gv.debug"] = "1"      // encender (recargar después)
//   localStorage.removeItem("r34gv.debug") // apagar
//
// Y desde la consola, ya con la página cargada:
//   r34gvSesLog.status()   // ¿está corriendo? ¿me ve logueado ahora mismo?
//   copy(r34gvSesLog.dump())  // el volcado completo, en orden, listo para pegar y mandar
//   r34gvSesLog.clear()    // borrarlo y empezar de cero
//
// ¿Qué apunta? Lo justo para saber quién tumba la sesión, con la hora en milisegundos de cada cosa:
//
//   arranque   cada carga: la dirección, **de dónde vienes** (`document.referrer`; si pone la galería
//              del perfil, es un post abierto en otra pestaña) y las cookies que se ven desde JS.
//   sesión     el cambio de estado logueado/sin-loguear. En esta web el botón «Login» (`#login`) solo
//              existe sin sesión, y el enlace de salir solo con ella; con eso se sabe sin adivinar.
//   cookies    cada vez que cambia el juego de cookies visibles (nombres) o su tamaño. La cookie de
//              sesión de PHP es `HttpOnly` y no se puede leer desde JS, así que lo que se vigila son
//              las de la propia web (`kt_tcookie`, `csrf_token`, `flag2`): van y vienen con lo mismo,
//              así que si desaparecen a la vez que la sesión, el culpable es quien las borre.
//   peticiones las que importan para la sesión, vistas con `PerformanceObserver`: `/login`, `/logout`,
//              `/login-required`, `/cdn-cgi/` (Cloudflare), `playlist_security` y los dos avisos del
//              motor de la web (`js_stats` y `js_online_status`), más cualquier recurso que responda
//              con error. Con su duración y su tamaño de respuesta (0 B = no trajo nada).
//   ping       la web (KVS) mantiene la sesión viva con un ping cada 60 s **solo si estás logueado**.
//              Aquí se apunta cada ping y, si estando logueado pasan 90 s sin ninguno, se avisa: eso
//              es que el bloqueador, la red o la propia web se lo están comiendo, y explica que la
//              sesión se caiga «sola» aunque la cookie siga puesta.
//   pestaña    cuando la pestaña pasa a segundo plano y vuelve. Chrome estrangula los temporizadores
//              de las pestañas de fondo: si abres un post en otra pestaña, ésta deja de cumplir su
//              minuto, y con ella el ping de la sesión. Suele ser justo cuando se cae la cuenta.
//
// El volcado se guarda en `localStorage` (500 líneas, ~60 KB como mucho, se recortan las viejas), así
// que sobrevive a la recarga y a la pestaña que se cierre: se puede copiar mucho después.
// ---------------------------------------------------------------------------------------------
(function () {
  "use strict";
  if (window.__r34gvSesLog) return;
  window.__r34gvSesLog = true;

  var ON_KEY = "r34gv.debug"; // "1"/"true" enciende
  var LOG_KEY = "r34gv.seslog"; // el volcado, texto plano: una línea por cosa apuntada
  var MAX = 500; // líneas guardadas
  var TICK = 1000; // cada cuánto se mira si ha cambiado algo
  var PING_MS = 60000; // lo que tarda la web en mandar su ping (para el aviso de abajo)
  var SILENCIO = 90000; // sin ping en este tiempo y estando logueado → se avisa

  // Lo que merece la pena apuntar de una petición (el resto de la página no dice nada de la sesión).
  var WATCH = /\/login\b|\/logout\b|\/login-required\b|\/cdn-cgi\/|playlist_security|action=js_stats|action=js_online_status/i;

  var lines = [];
  var running = false;
  var timer = null;
  var observer = null;
  var known = null; // último estado sabido: true logueado, false sin sesión, null todavía no se sabe
  var cookies = null; // { names, len }
  var lastPingAt = 0;
  var pingWarned = false;

  function flag() {
    try {
      var v = localStorage.getItem(ON_KEY);
      return v === "1" || v === "true";
    } catch (e) {
      return false; // modo privado o almacén lleno: no se puede saber, y se queda apagado
    }
  }

  function pad(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function clock() {
    var d = new Date();
    return pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()) + "." + ("00" + d.getMilliseconds()).slice(-3);
  }

  // Una línea más: a la consola y al volcado, que se guarda ya mismo (si se cierra la pestaña de golpe,
  // lo apuntado hasta ahí no se pierde).
  function record(kind, msg) {
    var line = clock() + "  " + kind + "  " + msg;
    lines.push(line);
    if (lines.length > MAX) lines.splice(0, lines.length - MAX);
    try {
      localStorage.setItem(LOG_KEY, lines.join("\n"));
    } catch (e) {}
    try {
      console.log("[r34gv sesión] " + line);
    } catch (e) {}
  }

  function name(u) {
    var s = String(u || "");
    try {
      var a = document.createElement("a");
      a.href = s;
      return a.pathname + (a.search ? a.search.replace(/[?&]rand=\d+/, "") : "");
    } catch (e) {
      return s;
    }
  }

  // --- estado de la sesión ---------------------------------------------------------------------
  // En esta web el botón «Login» del header (`#login`) solo existe cuando NO hay sesión, y el enlace
  // de salir solo cuando la hay. Si no está ninguna de las dos cosas (la página aún no ha pintado el
  // header), se devuelve null y no se apunta nada: así no hay transiciones falsas al cargar.
  function loggedIn() {
    if (document.getElementById("login")) return false;
    if (document.querySelector('a[href*="/logout"]')) return true;
    // Sin botón «Login» y sin enlace de salir a la vista: si el header ya está pintado (el bloque
    // donde vive ese botón), es que no hay botón porque hay sesión. Si no está pintado todavía, no se
    // sabe nada y se devuelve null.
    if (document.querySelector(".panel_buttons")) return true;
    return null;
  }

  function cookieSig() {
    var raw = "";
    try {
      raw = document.cookie || "";
    } catch (e) {}
    var names = [];
    if (raw) {
      var parts = raw.split("; ");
      for (var i = 0; i < parts.length; i++) names.push(parts[i].split("=")[0]);
      names.sort();
    }
    return { names: names.join(","), len: raw.length };
  }

  function left(a, b) {
    var out = [];
    for (var i = 0; i < a.length; i++) {
      if (b.indexOf(a[i]) === -1) out.push(a[i]);
    }
    return out.join(", ");
  }

  function checkCookies() {
    var now = cookieSig();
    if (!cookies) {
      cookies = now;
      return;
    }
    if (now.names === cookies.names && now.len === cookies.len) return;
    var was = cookies.names ? cookies.names.split(",") : [];
    var is = now.names ? now.names.split(",") : [];
    var delta = now.len - cookies.len;
    var msg = "cookies: " + is.length + " · " + now.len + " B (" + (delta > 0 ? "+" : "") + delta + " B)";
    var gone = left(was, is);
    var add = left(is, was);
    if (gone) msg += " · se van: " + gone;
    if (add) msg += " · aparecen: " + add;
    cookies = now;
    record("cookies", msg);
  }

  function checkSession() {
    var now = loggedIn();
    if (now === null) return; // todavía no se puede saber
    if (now === known) return;
    var was = known;
    known = now;
    var msg = now ? "CON sesión (aparece el enlace de salir)" : "SIN sesión (vuelve el botón «Login»)";
    if (was === null) msg = "empieza el registro: ahora mismo " + (now ? "CON sesión" : "sin sesión");
    record("sesión", msg + " · cookies: " + (cookieSig().names || "(ninguna)"));
    pingWarned = false;
    if (!now) lastPingAt = 0;
  }

  // --- peticiones ------------------------------------------------------------------------------
  function watchRequests() {
    if (typeof PerformanceObserver !== "function") return;
    try {
      observer = new PerformanceObserver(function (list) {
        var items = list.getEntries();
        for (var i = 0; i < items.length; i++) {
          var e = items[i];
          if (!WATCH.test(e.name) && !(e.responseStatus >= 400)) continue;
          if (/action=js_online_status/i.test(e.name)) {
            lastPingAt = Date.now();
            pingWarned = false;
          }
          record(
            "petición",
            name(e.name) + " · " + (e.initiatorType || "?") + " · " + Math.round(e.duration) + " ms · " + (e.transferSize || 0) + " B" + (e.responseStatus ? " · HTTP " + e.responseStatus : "")
          );
        }
      });
      observer.observe({ entryTypes: ["resource"], buffered: true });
    } catch (e) {
      record("aviso", "no se pueden vigilar las peticiones en este navegador: " + e.message);
    }
  }

  // El ping de la web: si estás logueado, KVS manda uno cada 60 s. Aquí no se puede demostrar una
  // ausencia, pero sí se puede avisar de que llevas demasiado sin verlo.
  function checkPing() {
    if (known !== true) return;
    if (!lastPingAt) {
      // Nunca se ha visto uno: se cuenta desde que se supo que hay sesión.
      lastPingAt = -1;
      return;
    }
    if (lastPingAt === -1) return;
    if (!pingWarned && Date.now() - lastPingAt > SILENCIO) {
      pingWarned = true;
      record("ping", "sin `js_online_status` en " + Math.round(SILENCIO / 1000) + " s (la web debería mandarlo cada " + Math.round(PING_MS / 1000) + " s). Si sigue así, la sesión se caerá sola: ese ping es lo que la mantiene viva");
    }
  }

  // --- arranque y parada ------------------------------------------------------------------------
  function start() {
    if (running) return true;
    running = true;
    record(
      "arranque",
      location.origin + location.pathname + location.search + " · llega desde: " + (document.referrer ? name(document.referrer) : "(nada)") + " · cookies: " + (cookieSig().names || "(ninguna)") + " (" + cookieSig().len + " B)"
    );
    cookies = cookieSig();
    checkSession();
    watchRequests();
    timer = setInterval(function () {
      checkSession();
      checkCookies();
      checkPing();
    }, TICK);

    document.addEventListener("visibilitychange", function () {
      record("pestaña", document.visibilityState === "hidden" ? "pasa a segundo plano (Chrome estrangula los temporizadores)" : "vuelve a primer plano");
    });
    window.addEventListener("pagehide", function () {
      record("pestaña", "se va la página (" + (known ? "con sesión" : "sin sesión") + ")");
    });
    window.addEventListener("error", function (e) {
      // El «Script error.» de un script de otro origen no trae ni mensaje ni fichero: no dice nada (es
      // lo normal en esta página, con los anuncios y el consentimiento pinchando aquí). Solo se apunta
      // lo que se puede leer.
      if (!e || !e.message || !e.filename) return;
      record("error", e.message + " (" + name(e.filename) + ":" + e.lineno + ")");
    });
    return true;
  }

  function stop() {
    if (!running) return false;
    running = false;
    if (timer) clearInterval(timer);
    timer = null;
    if (observer) {
      try {
        observer.disconnect();
      } catch (e) {}
      observer = null;
    }
    return true;
  }

  // Para la consola. `start()`/`stop()` sirven para encenderlo sin recargar (aunque encenderlo a mano
  // pierde la parte del arranque de la página, que es justo la interesante, así que lo suyo es el
  // interruptor + recargar).
  window.r34gvSesLog = {
    start: start,
    stop: stop,
    status: function () {
      return { activo: running, logueado: loggedIn(), cookie: cookieSig().names, lineas: lines.length };
    },
    dump: function () {
      try {
        return localStorage.getItem(LOG_KEY) || "";
      } catch (e) {
        return "";
      }
    },
    clear: function () {
      lines = [];
      try {
        localStorage.removeItem(LOG_KEY);
      } catch (e) {}
      return true;
    }
  };

  // Apagado por defecto: aquí no queda nada corriendo (ni temporizador, ni observador, ni escuchas).
  if (flag()) start();
})();

