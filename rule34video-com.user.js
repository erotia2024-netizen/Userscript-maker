// ==UserScript==
// @name         rule34video.com
// @version      0.1.22
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
  var css = "/* ---------------------------------------------------------------------------------------------\n   rule34video.com — limpieza de la página.\n   El CSS del sitio se carga después que este, así que todo va con !important: estas reglas tienen\n   que ganar sí o sí.\n   --------------------------------------------------------------------------------------------- */\n\n/* 1) Botones de promoción del header: «AI Jerk Off» (enlace de afiliado) y «ThePornDude».\n      Se ocultan aquí para que no parpadeen, y core.js además los quita del DOM y vigila que no\n      vuelvan (la web repinta el header con su propio JS). */\n.panel_header.panel_header--promo,\na.button_fav.ai,\na.button_fav.theporndude {\n  display: none !important;\n}\n\n/* 2) La banda de aviso de rule34gen, la que sale pegada debajo del header («Due to the massive\n      influx of AI generated video's…»). Se esconde el enlace y sus dos contenedores, y también el\n      `.headline` que solo la envuelve a ella: si no, se quedaría su margen inferior como hueco. */\na.emger,\n#top-header,\n#emergency-response-opt,\n.headline:has(> a.emger) {\n  display: none !important;\n}\n\n/* 3) El hueco entre la paginación («Jump to … OK») y el logo del pie.\n      Entre esas dos cosas no hay más que la banda de anuncios del pie (.footer_spots), y esa banda\n      reserva 250 px de alto por cada hueco de anuncio aunque no haya anuncio que cargar\n      (.columns_spots .spots { min-height:250px } en el CSS de la web): eso es el vacío que se ve.\n      Se le quitan el alto mínimo y los márgenes, así mide exactamente lo que mida el anuncio que\n      cargue — y cero si no hay ninguno. Además el pie arranca un poco más arriba. */\n.footer_spots {\n  margin-top: 0 !important;\n  padding: 0 !important;\n}\n\n.footer_spots .columns_spots,\n.footer_spots .spots {\n  min-height: 0 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n}\n\n.footer_holder {\n  padding-top: 16px !important;\n}\n\n/* 4) Los botones de afiliado de la columna lateral (los de happyleafmotion) traen su animación en el\n      propio `style=\"\"` del enlace: un gradiente de fondo que se mueve en bucle (`gradientShift 8s` y\n      `r34flow 10s`). Un `background-position` animado no se puede componer en la GPU: el navegador\n      **repinta ese botón en cada frame, para siempre** mientras la pestaña esté abierta. Aquí solo se\n      le para la animación al botón (el `!important` gana al `style=\"\"` del propio enlace): se sigue\n      viendo y se puede pinchar igual —no se toca nada de lo que paga la web— pero deja de gastar CPU.\n      Medido con la pestaña quieta: eran las dos únicas animaciones infinitas que quedaban en la\n      página además del spinner de «cargando» del reproductor. */\na.button_fav.sidebar_ad {\n  animation: none !important;\n}\n\n/* 5) La ficha de anuncio de la rejilla, ya en el pie. La traslada core.js (ver `localStorage\n      [\"r34gv.ads\"]`): en vez de ir entre los vídeos haciéndose pasar por uno, va al hueco que queda\n      entre la paginación («Jump to … OK», donde acaba el listado) y el pie del sitio, donde está el\n      logo. Aquí solo se le da sitio —centrada y del ancho de una ficha— y se le quitan los adornos de\n      vídeo: la duración («23:40»), el icono HD, el de play y la fila de nota/vistas, que son relleno\n      de la plantilla. El cartel «AD» se queda: el anuncio tiene que poder distinguirse de lo demás. */\n.r34gv-footer-ad {\n  clear: both !important;\n  width: 336px !important;\n  max-width: 92% !important;\n  margin: 22px auto 4px !important;\n}\n\n.r34gv-footer-ad .item.thumb {\n  float: none !important;\n  width: 100% !important;\n  height: auto !important;\n  margin: 0 !important;\n}\n\n.r34gv-footer-ad .time,\n.r34gv-footer-ad .quality,\n.r34gv-footer-ad .custom-play,\n.r34gv-footer-ad .thumb_info {\n  display: none !important;\n}\n";
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
//                                      Aquí se pone delante la preferida —720p, o 480p si la conexión
//                                      es lenta o hay ahorro de datos— con su texto y su marca HD, y
//                                      las demás se quedan como estaban.
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
// Preferencia de calidad: se puede cambiar desde la consola con
//   localStorage.setItem("r34gv.quality", "1080p")   // o 480p, 360p…
// Si no hay ninguna guardada se usa 720p (480p si la conexión es lenta o hay ahorro de datos).
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

  function wanted() {
    var saved = pref(QUALITY_KEY);
    if (saved) return saved;
    // Sin preferencia guardada: en una conexión lenta (o con ahorro de datos) empezar en 720p es
    // empezar a bufferear, así que se baja a 480p.
    try {
      var nav = W.navigator || navigator;
      var c = nav.connection || nav.mozConnection || nav.webkitConnection;
      if (c && (c.saveData || /^(slow-)?2g$|^3g$/.test(c.effectiveType || ""))) return "480p";
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
// Aplazado: las fichas de anuncio de la rejilla (el cartel «AD») traen dentro un iframe del servidor
// de anuncios que se descarga su creatividad —y arranca sus temporizadores— en cuanto el navegador lo
// inserta, aunque quede a dos pantallas de distancia. A ese iframe se le aplaza la carga hasta que su
// ficha se acerca a la ventana (la web ingresa la impresión igual, cuando el anuncio va a verse de
// verdad, pero mientras nadie lo mira no cuesta red ni CPU).
//
// Aligerado: la web sirve decenas de miniaturas por página y las aplaza con jquery.lazyload (que
// mide cada ficha en cada evento de scroll: lectura de maquetación forzada por evento). Aquí se le
// adelanta el trabajo al navegador —se resuelve el `src` y se le quita la clase al `img`, y el
// navegador las trae al acercarse con `loading="lazy"`— y se marca `decoding="async"` para que
// descodifiquen fuera del hilo principal. Todo esto es aditivo: si la web cambia, lo peor que pasa
// es que no se aplique.
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
// suspendida. Si algún día se añade un selector aquí, que sea de promoción propia, no de anuncio.
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
  // Ajuste, en `localStorage["r34gv.ads"]`:
  //   "footer" (por defecto) → trasladar la ficha al pie (y aplazar su carga hasta que se acerque)
  //   "lazy"                 → dejarla en la rejilla, solo con la carga aplazada
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

  // El hueco del pie: justo después de la paginación —donde acaba el listado— y por delante del pie,
  // donde está el logo. Si la página no trae paginación, se cuelga del propio pie.
  function footerSlot() {
    var slot = document.querySelector("." + AD_SLOT);
    if (slot && document.documentElement.contains(slot)) return slot;
    slot = document.createElement("div");
    slot.className = AD_SLOT;
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

  function parkAd(frame) {
    if (!frame || frame.tagName !== "IFRAME" || frame.hasAttribute(AD_MARK)) return;
    // Solo los iframes de las fichas, y solo si apuntan fuera (los del propio sitio se dejan en paz).
    var card = frame.closest ? frame.closest(".item.thumb") : null;
    if (!card) return;
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
    // Con el anuncio aún sin cargar, la ficha se puede mover sin que se recargue nada.
    if (adMode === "footer") {
      var slot = footerSlot();
      if (slot && !slot.contains(card)) slot.appendChild(card);
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
    for (var i = parkedAds.length - 1; i >= 0; i--) {
      if (adInRange(parkedAds[i])) unparkAd(parkedAds[i]);
    }
    if (parkedAds.length === 0) watchAds(false); // ya no queda nada que vigilar
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
        if (card) kill(card);
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
    polish(root);
    scanAds(root); // y por si la ficha de anuncio ya estaba puesta
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
        takeOver(added[j]);
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

