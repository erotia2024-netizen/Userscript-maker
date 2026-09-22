// ==UserScript==
// @name         rule34video.com
// @version      0.1.6
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
  var css = "/* ---------------------------------------------------------------------------------------------\n   rule34video.com — limpieza de la página.\n   El CSS del sitio se carga después que este, así que todo va con !important: estas reglas tienen\n   que ganar sí o sí.\n   --------------------------------------------------------------------------------------------- */\n\n/* 1) Botones de promoción del header: «AI Jerk Off» (enlace de afiliado) y «ThePornDude».\n      Se ocultan aquí para que no parpadeen, y core.js además los quita del DOM y vigila que no\n      vuelvan (la web repinta el header con su propio JS). */\n.panel_header.panel_header--promo,\na.button_fav.ai,\na.button_fav.theporndude {\n  display: none !important;\n}\n\n/* 2) La banda de aviso de rule34gen, la que sale pegada debajo del header («Due to the massive\n      influx of AI generated video's…»). Se esconde el enlace y sus dos contenedores, y también el\n      `.headline` que solo la envuelve a ella: si no, se quedaría su margen inferior como hueco. */\na.emger,\n#top-header,\n#emergency-response-opt,\n.headline:has(> a.emger) {\n  display: none !important;\n}\n\n/* 3) El hueco entre la paginación («Jump to … OK») y el logo del pie.\n      Entre esas dos cosas no hay más que la banda de anuncios del pie (.footer_spots), y esa banda\n      reserva 250 px de alto por cada hueco de anuncio aunque no haya anuncio que cargar\n      (.columns_spots .spots { min-height:250px } en el CSS de la web): eso es el vacío que se ve.\n      Se le quitan el alto mínimo y los márgenes, así mide exactamente lo que mida el anuncio que\n      cargue — y cero si no hay ninguno. Además el pie arranca un poco más arriba. */\n.footer_spots {\n  margin-top: 0 !important;\n  padding: 0 !important;\n}\n\n.footer_spots .columns_spots,\n.footer_spots .spots {\n  min-height: 0 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n}\n\n.footer_holder {\n  padding-top: 16px !important;\n}\n\n/* 4) Los listados traen decenas de fichas de vídeo y la web las dibuja todas, aunque no se vea\n      ninguna. Con content-visibility el navegador se salta el dibujo de las que están fuera de\n      pantalla y lo hace al llegar a ellas, y con contain-intrinsic-size reserva su alto de antemano\n      para que la barra de scroll no dé saltos — el `auto` hace que, una vez medida una ficha, se\n      use su alto de verdad en vez de los 300 px de estimación. */\n.thumbs .item.thumb {\n  content-visibility: auto;\n  contain-intrinsic-size: auto 300px;\n}\n";
  if (css) {
    var style = document.createElement("style");
    style.id = "r34g-styles";
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }
})();
// ---- rule34video-com ----
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
//                                      Aquí se pone delante la preferida —720p— con su texto y su
//                                      marca HD, y las demás se quedan como estaban.
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
// Preferencia de calidad: se puede cambiar desde la consola con
//   localStorage.setItem("r34gv.quality", "1080p")   // o 480p, 360p…
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

  // Los cuatro huecos de calidad del reproductor, en orden: el primero es el que suena por defecto.
  var URLS = ["video_url", "video_alt_url", "video_alt_url2", "video_alt_url3"];
  var TEXTS = ["video_url_text", "video_alt_url_text", "video_alt_url2_text", "video_alt_url3_text"];
  var HDS = ["", "", "video_alt_url2_hd", "video_alt_url3_hd"];
  var current = undefined;

  function wanted() {
    try {
      var v = W.localStorage && W.localStorage.getItem(QUALITY_KEY);
      if (v) return String(v).toLowerCase();
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
      // 1) que empiece a bufferear desde el principio.
      fv.preload = "auto";
      // 2) las 11 miniaturas de la barra de tiempo, solo cuando se pase el ratón.
      if (fv.timeline_screens_url) fv.timeline_screens_preload = "false";
      // 3) la calidad preferida, delante.
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
      if (fv.video_url) fv.postfix = postfixOf(fv.video_url);
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

  // Red de seguridad: el vídeo del reproductor (y SOLO ese: los previews de la lista son otra cosa y
  // se cargan al pasar el ratón, no queremos que se descarguen solos).
  var seen = new WeakSet();
  function boostVideo() {
    var v = null;
    try {
      v = document.querySelector("#kt_player video, .player-holder video, .player-wrap video");
    } catch (e) {}
    if (!v) return false;
    try {
      if (v.preload !== "auto") v.preload = "auto";
      if (!seen.has(v)) {
        seen.add(v);
        // el reproductor vuelve a llamar a load() al cambiar de calidad: se le recuerda el ajuste.
        v.addEventListener("loadedmetadata", function () {
          try {
            if (v.preload !== "auto") v.preload = "auto";
          } catch (e) {}
        });
      }
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
// Aligerado: la web sirve decenas de miniaturas por página y solo aplaza las de las fichas de vídeo
// (las que llevan `data-original`); las de categorías y modelos van con su `src` puesto y se piden
// todas al abrir. Aquí se le dice al navegador lo mismo (loading="lazy" en lo que queda por debajo
// de la pantalla) y que descodifique en segundo plano (decoding="async"), y las fichas que quedan
// fuera de pantalla no se dibujan hasta que llegas a ellas (content-visibility, en styles.css).
// Todo esto es aditivo: si la web cambia, lo peor que pasa es que no se aplique.
//
// El resto (huecos de anuncios del pie, etc.) es cosa de styles.css. Los ajustes del reproductor
// están en player.js (y por eso sí que importa que el userscript entre en document-start).
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
    return purge(document.documentElement || document.body);
  }

  // --- aligerado de imágenes ---------------------------------------------------------------------
  // Una imagen por debajo de la pantalla no hace falta que se descargue ahora: se marca para que el
  // navegador la traiga al acercarse. Las que se ven al abrir la página se quedan como están (si se
  // marcasen, el navegador las pediría igual, pero no tiene sentido mentirle).
  var MARK = "data-r34gv-img";
  var READY = false; // hasta DOMContentLoaded no hay maquetación: no se puede saber qué está debajo

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
    polish(document.documentElement || document.body);
  }

  clean();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      clean();
      sweep();
    });
  } else {
    sweep();
  }

  // La web también mete contenido por AJAX (los listados, el buscador), así que esto puede reaparecer
  // en cualquier momento. Solo se miran los nodos AÑADIDOS, así que nuestras propias eliminaciones no
  // vuelven a dispararlo (nada de bucles).
  var obs = new MutationObserver(function (records) {
    for (var i = 0; i < records.length; i++) {
      var added = records[i].addedNodes;
      for (var j = 0; j < added.length; j++) {
        purge(added[j]);
        if (READY) polish(added[j]);
      }
    }
  });
  obs.observe(document.documentElement || document.body, { childList: true, subtree: true });
})();

