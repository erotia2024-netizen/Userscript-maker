// ==UserScript==
// @name         rule34video.com
// @version      0.1.0
// @description  Escrito en el laboratorio de Userscript Maker.
// @author       Userscript Maker
// @namespace    https://github.com/erotia2024-netizen/Userscript-maker
// @homepageURL  https://github.com/erotia2024-netizen/Userscript-maker
// @downloadURL  https://raw.githubusercontent.com/erotia2024-netizen/Userscript-maker/main/rule34video-com.user.js
// @updateURL    https://raw.githubusercontent.com/erotia2024-netizen/Userscript-maker/main/rule34video-com.user.js
// @match        *://rule34video.com/*
// @match        *://*.rule34video.com/*
// @run-at       document-end
// @noframes
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      *
// ==/UserScript==

(function () {
  "use strict";
  var css = "/* ---------------------------------------------------------------------------------------------\n   rule34video.com — limpieza de la página.\n   El CSS del sitio se carga después que este, así que todo va con !important: estas reglas tienen\n   que ganar sí o sí.\n   --------------------------------------------------------------------------------------------- */\n\n/* 1) Botones de promoción del header: «AI Jerk Off» (enlace de afiliado) y «ThePornDude».\n      Se ocultan aquí para que no parpadeen, y core.js además los quita del DOM y vigila que no\n      vuelvan (la web repinta el header con su propio JS). */\n.panel_header.panel_header--promo,\na.button_fav.ai,\na.button_fav.theporndude {\n  display: none !important;\n}\n\n/* 2) El hueco entre la paginación («Jump to … OK») y el logo del pie.\n      Entre esas dos cosas no hay más que la banda de anuncios del pie (.footer_spots), y esa banda\n      reserva 250 px de alto por cada hueco de anuncio aunque no haya anuncio que cargar\n      (.columns_spots .spots { min-height:250px } en el CSS de la web): eso es el vacío que se ve.\n      Se le quitan el alto mínimo y los márgenes, así mide exactamente lo que mida el anuncio que\n      cargue — y cero si no hay ninguno. Además el pie arranca un poco más arriba. */\n.footer_spots {\n  margin-top: 0 !important;\n  padding: 0 !important;\n}\n\n.footer_spots .columns_spots,\n.footer_spots .spots {\n  min-height: 0 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n}\n\n.footer_holder {\n  padding-top: 16px !important;\n}\n";
  if (css) {
    var style = document.createElement("style");
    style.id = "r34g-styles";
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }
})();
// ---- rule34video-com ----
// ---------------------------------------------------------------------------------------------
// rule34video.com — lo que no se puede hacer solo con CSS.
//
// 1) Botones de promoción del header («AI Jerk Off» y «ThePornDude»). Son enlaces de afiliado y la
//    web repinta el header con su propio JS, así que no basta con ocultarlos: se quitan del DOM y
//    un MutationObserver vigila que, si vuelven a pintarse, desaparezcan otra vez.
// 2) El hueco del pie (entre la paginación «Jump to … OK» y el logo) sí es cosa de styles.css.
//
// Al cargar como userscript, el script va con @run-at document-end y @noframes, y solo se ejecuta
// en rule34video.com; aquí no hace falta comprobar la URL.
// ---------------------------------------------------------------------------------------------
(function () {
  "use strict";
  if (window.__r34gv) return;
  window.__r34gv = true;

  // El bloque de promoción entero, y por si la web los repinta sueltos, cada botón por su cuenta.
  var PROMO = ".panel_header--promo, a.button_fav.ai, a.button_fav.theporndude";

  function kill(node) {
    if (node && node.parentNode) node.parentNode.removeChild(node);
  }

  // Quita el nodo si él mismo es de promoción, y si no, los que lleve dentro. Devuelve cuántos.
  function purge(node) {
    if (!node || node.nodeType !== 1) return 0;
    if (node.matches && node.matches(PROMO)) {
      kill(node);
      return 1;
    }
    var hits = node.querySelectorAll ? node.querySelectorAll(PROMO) : [];
    var n = 0;
    for (var i = hits.length - 1; i >= 0; i--) {
      kill(hits[i]);
      n++;
    }
    return n;
  }

  function clean() {
    return purge(document.documentElement || document.body);
  }

  clean();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", clean);
  }

  // La web también mete contenido por AJAX (los listados, el buscador), así que la promoción puede
  // reaparecer en cualquier momento. Solo se miran los nodos AÑADIDOS, así que nuestras propias
  // eliminaciones no vuelven a dispararlo (nada de bucles).
  var obs = new MutationObserver(function (records) {
    for (var i = 0; i < records.length; i++) {
      var added = records[i].addedNodes;
      for (var j = 0; j < added.length; j++) purge(added[j]);
    }
  });
  obs.observe(document.documentElement || document.body, { childList: true, subtree: true });
})();

