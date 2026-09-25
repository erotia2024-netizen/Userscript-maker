// ==UserScript==
// @name         emochi.com
// @version      0.1.0
// @description  Escrito en el laboratorio de Userscript Maker.
// @author       Userscript Maker
// @namespace    https://github.com/erotia2024-netizen/Userscript-maker
// @homepageURL  https://github.com/erotia2024-netizen/Userscript-maker
// @downloadURL  https://raw.githubusercontent.com/erotia2024-netizen/Userscript-maker/main/emochi-com.user.js
// @updateURL    https://raw.githubusercontent.com/erotia2024-netizen/Userscript-maker/main/emochi-com.user.js
// @match        *://emochi.com/*
// @match        *://*.emochi.com/*
// @run-at       document-start
// @noframes
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      *
// ==/UserScript==

(function () {
  "use strict";
  var css = "/* =============================================================================================\n   emochi.com — el CSS del panel de roles (🎭). Todo vive bajo #em-root, así que no toca nada de la\n   web: ni sus clases, ni su Tailwind, ni su Chakra. El único cuidado es que su reset global\n   (`* { margin: 0; padding: 0; font: inherit }`) no se coma lo nuestro, así que aquí se declara\n   todo lo que hace falta, sin dar por hecho nada.\n   ============================================================================================= */\n#em-root {\n  --em-bg: #141416;\n  --em-bg2: #1d1d21;\n  --em-bg3: #26262c;\n  --em-line: #34343c;\n  --em-text: #f2f2f5;\n  --em-dim: #a5a5b0;\n  --em-accent: #f7c948;\n  --em-accent-ink: #241c03;\n  --em-bad: #ff6b6b;\n  --em-good: #5ad18a;\n  --em-radius: 14px;\n  color: var(--em-text);\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif;\n  font-size: 14px;\n  line-height: 1.45;\n  text-align: left;\n  box-sizing: border-box;\n}\n#em-root *,\n#em-root *::before,\n#em-root *::after {\n  box-sizing: border-box;\n  font-family: inherit;\n}\n\n/* --- el botón flotante (abajo a la izquierda: abajo a la derecha está su asistente) --------- */\n#em-fab {\n  position: fixed;\n  left: 18px;\n  bottom: 18px;\n  z-index: 2147483000;\n  width: 52px;\n  height: 52px;\n  border: 1px solid var(--em-line);\n  border-radius: 50%;\n  background: var(--em-bg);\n  color: var(--em-text);\n  font-size: 24px;\n  line-height: 1;\n  cursor: pointer;\n  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);\n  transition: transform 0.15s ease, box-shadow 0.15s ease;\n}\n#em-fab:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.55);\n}\n#em-fab[aria-expanded=\"true\"] {\n  background: var(--em-accent);\n  color: var(--em-accent-ink);\n  border-color: var(--em-accent);\n}\n\n/* --- el panel ------------------------------------------------------------------------------- */\n#em-panel {\n  position: fixed;\n  left: 18px;\n  top: 18px;\n  bottom: 84px;\n  z-index: 2147483000;\n  width: 400px;\n  max-width: calc(100vw - 36px);\n  display: flex;\n  flex-direction: column;\n  background: var(--em-bg);\n  border: 1px solid var(--em-line);\n  border-radius: var(--em-radius);\n  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);\n  overflow: hidden;\n}\n#em-panel[hidden] {\n  display: none;\n}\n#em-fab,\n#em-panel,\n#em-panel * {\n  text-align: left;\n}\n#em-panel img {\n  max-width: 100%;\n}\n\n.em-head {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 12px 14px;\n  background: var(--em-bg2);\n  border-bottom: 1px solid var(--em-line);\n}\n.em-title {\n  font-size: 15px;\n  font-weight: 700;\n}\n.em-count {\n  font-size: 12px;\n  color: var(--em-dim);\n}\n.em-grow {\n  flex: 1 1 auto;\n}\n.em-icon {\n  background: transparent;\n  border: 0;\n  color: var(--em-dim);\n  font-size: 15px;\n  padding: 4px 6px;\n  border-radius: 8px;\n  cursor: pointer;\n}\n.em-icon:hover {\n  background: var(--em-bg3);\n  color: var(--em-text);\n}\n\n.em-body {\n  flex: 1 1 auto;\n  overflow-y: auto;\n  padding: 12px;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.em-foot {\n  padding: 10px 12px;\n  border-top: 1px solid var(--em-line);\n  background: var(--em-bg2);\n  display: flex;\n  gap: 8px;\n}\n\n.em-msg {\n  margin: 10px 12px 0;\n  padding: 8px 10px;\n  border-radius: 10px;\n  background: rgba(90, 209, 138, 0.12);\n  border: 1px solid rgba(90, 209, 138, 0.35);\n  font-size: 13px;\n}\n.em-msg-bad {\n  background: rgba(255, 107, 107, 0.12);\n  border-color: rgba(255, 107, 107, 0.4);\n}\n\n.em-note {\n  background: var(--em-bg2);\n  border: 1px solid var(--em-line);\n  border-radius: 12px;\n  padding: 12px;\n  color: var(--em-dim);\n  font-size: 13px;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  align-items: flex-start;\n}\n.em-note-bad {\n  border-color: rgba(255, 107, 107, 0.4);\n  color: #ffd9d9;\n}\n.em-note-small {\n  padding: 8px 10px;\n  font-size: 12px;\n}\n\n/* --- el bot en el que estás ----------------------------------------------------------------- */\n.em-bot {\n  background: var(--em-bg2);\n  border: 1px solid var(--em-line);\n  border-radius: 12px;\n  padding: 10px 12px;\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.em-bot-title {\n  font-size: 13px;\n  color: var(--em-dim);\n}\n.em-bot-title b {\n  color: var(--em-text);\n}\n.em-bot-note {\n  font-size: 12px;\n  color: var(--em-dim);\n}\n\n/* --- las tarjetas de rol -------------------------------------------------------------------- */\n.em-card {\n  background: var(--em-bg2);\n  border: 1px solid var(--em-line);\n  border-radius: 12px;\n  padding: 10px 12px;\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.em-card-primary {\n  border-color: rgba(247, 201, 72, 0.55);\n  box-shadow: inset 3px 0 0 var(--em-accent);\n}\n.em-card-top {\n  display: flex;\n  gap: 10px;\n  align-items: center;\n}\n.em-avatar {\n  width: 42px;\n  height: 42px;\n  border-radius: 50%;\n  object-fit: cover;\n  flex: 0 0 auto;\n  background: var(--em-bg3);\n}\n.em-avatar-empty {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: 700;\n  color: var(--em-dim);\n}\n.em-card-head {\n  min-width: 0;\n}\n.em-name {\n  font-weight: 700;\n  font-size: 15px;\n}\n.em-meta {\n  font-size: 12px;\n  color: var(--em-dim);\n}\n.em-story {\n  font-size: 13px;\n  color: #d7d7de;\n  margin: 0;\n  white-space: pre-wrap;\n}\n.em-chips {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n}\n.em-chip {\n  font-size: 11px;\n  padding: 2px 8px;\n  border-radius: 999px;\n  background: var(--em-bg3);\n  color: var(--em-dim);\n  border: 1px solid var(--em-line);\n}\n\n/* --- botones e inputs ----------------------------------------------------------------------- */\n.em-acts {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n}\n.em-acts-end {\n  justify-content: flex-end;\n  margin-top: 4px;\n}\n.em-btn {\n  font-size: 12.5px;\n  padding: 6px 10px;\n  border-radius: 9px;\n  border: 1px solid var(--em-line);\n  background: var(--em-bg3);\n  color: var(--em-text);\n  cursor: pointer;\n}\n.em-btn:hover {\n  border-color: #4a4a55;\n}\n.em-btn:disabled {\n  opacity: 0.55;\n  cursor: default;\n}\n.em-btn-main {\n  background: var(--em-accent);\n  border-color: var(--em-accent);\n  color: var(--em-accent-ink);\n  font-weight: 600;\n}\n.em-btn-bad {\n  color: #ffc9c9;\n  border-color: rgba(255, 107, 107, 0.35);\n}\n.em-btn-on {\n  background: rgba(90, 209, 138, 0.16);\n  border-color: rgba(90, 209, 138, 0.5);\n  color: #c9f5dc;\n}\n\n.em-form {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.em-row {\n  display: flex;\n  gap: 10px;\n}\n.em-row > * {\n  flex: 1 1 0;\n  min-width: 0;\n}\n.em-field {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.em-field-label {\n  font-size: 12px;\n  color: var(--em-dim);\n}\n.em-field small {\n  font-size: 11px;\n  color: var(--em-dim);\n}\n.em-input {\n  width: 100%;\n  background: var(--em-bg3);\n  color: var(--em-text);\n  border: 1px solid var(--em-line);\n  border-radius: 9px;\n  padding: 7px 9px;\n  font-size: 13px;\n  resize: vertical;\n}\n.em-input:focus {\n  outline: none;\n  border-color: var(--em-accent);\n}\n.em-input::placeholder {\n  color: #74747f;\n}\n\n.em-spin {\n  width: 12px;\n  height: 12px;\n  border-radius: 50%;\n  border: 2px solid var(--em-line);\n  border-top-color: var(--em-accent);\n  display: inline-block;\n  animation: em-spin 0.8s linear infinite;\n}\n@keyframes em-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@media (max-width: 520px) {\n  #em-panel {\n    left: 8px;\n    right: 8px;\n    width: auto;\n    max-width: none;\n    top: 8px;\n    bottom: 76px;\n  }\n  #em-fab {\n    left: 12px;\n    bottom: 12px;\n  }\n}\n";
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
// ---- emochi-com ----
/* =============================================================================================
   emochi.com — el núcleo del userscript: ajustes, el cliente de la API del propio sitio y las
   piezas que comparten los demás módulos.

   Nada de esto toca la web: solo lee y escribe en SU API (la misma que usa su aplicación) con la
   sesión que ya hay en el navegador. El token no se guarda en ningún sitio: se pide al vuelo al
   mismo origen (`/api/auth/refresh`, que lee la cookie httpOnly) y se queda en memoria.
   ============================================================================================= */
(function () {
  "use strict";
  if (window.emochiLab) return;

  var EM = (window.emochiLab = {});
  EM.version = "0.1.0";

  // --- ajustes (localStorage, por navegador) -------------------------------------------------
  var KEY = "emochi-lab:prefs:v1";
  var DEFAULTS = {
    on: true,          // el userscript encendido
    button: true,      // el botón flotante
    ideas: true,       // el botón de ideas en el formulario
    debug: false       // dejar rastro en la consola
  };
  var prefs = {};
  try {
    prefs = JSON.parse(localStorage.getItem(KEY) || "{}") || {};
  } catch (e) {
    prefs = {};
  }
  Object.keys(DEFAULTS).forEach(function (k) {
    if (prefs[k] == null) prefs[k] = DEFAULTS[k];
  });
  EM.prefs = prefs;
  EM.savePrefs = function () {
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch (e) {}
  };

  EM.log = function () {
    if (!prefs.debug) return;
    var a = Array.prototype.slice.call(arguments);
    a.unshift("[emochi-lab]");
    console.log.apply(console, a);
  };
  EM.warn = function () {
    var a = Array.prototype.slice.call(arguments);
    a.unshift("[emochi-lab]");
    console.warn.apply(console, a);
  };

  // --- MD5 -----------------------------------------------------------------------------------
  // El sitio firma así cada petición "signed": md5(`${timestamp}-${nonce}-${authorization}`),
  // donde `authorization` es el valor entero de la cabecera, con su "Bearer " incluido. Esto es
  // MD5 de manual (RFC 1321) porque `crypto.subtle` no lo trae.
  function md5(s) {
    return hex(md51(s));
  }
  function md51(s) {
    var n = s.length,
      state = [1732584193, -271733879, -1732584194, 271733878],
      i;
    for (i = 64; i <= s.length; i += 64) md5cycle(state, md5blk(s.substring(i - 64, i)));
    s = s.substring(i - 64);
    var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) {
      md5cycle(state, tail);
      for (i = 0; i < 16; i++) tail[i] = 0;
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return state;
  }
  function md5blk(s) {
    var b = [],
      i;
    for (i = 0; i < 64; i += 4) {
      b[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
    }
    return b;
  }
  function md5cycle(x, k) {
    var a = x[0],
      b = x[1],
      c = x[2],
      d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936); d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819); b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897); d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341); b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416); d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063); b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682); d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290); b = ff(b, c, d, a, k[15], 22, 1236535329);
    a = gg(a, b, c, d, k[1], 5, -165796510); d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713); b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691); d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335); b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438); d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961); b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467); d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473); b = gg(b, c, d, a, k[12], 20, -1926607734);
    a = hh(a, b, c, d, k[5], 4, -378558); d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562); b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060); d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632); b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174); d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979); b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487); d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520); b = hh(b, c, d, a, k[2], 23, -995338651);
    a = ii(a, b, c, d, k[0], 6, -198630844); d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905); b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571); d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523); b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359); d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380); b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070); d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259); b = ii(b, c, d, a, k[9], 21, -343485551);
    x[0] = add32(x[0], a); x[1] = add32(x[1], b); x[2] = add32(x[2], c); x[3] = add32(x[3], d);
  }
  function cmn(q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }
  function ff(a, b, c, d, x, s, t) { return cmn((b & c) | (~b & d), a, b, x, s, t); }
  function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & ~d), a, b, x, s, t); }
  function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | ~d), a, b, x, s, t); }
  function add32(a, b) { return (a + b) & 0xffffffff; }
  function hex(r) {
    var s = "", i, j, b;
    for (i = 0; i < 4; i++) {
      for (j = 0; j < 4; j++) {
        b = (r[i] >> (j * 8)) & 255;
        s += "0123456789abcdef".charAt((b >> 4) & 15) + "0123456789abcdef".charAt(b & 15);
      }
    }
    return s;
  }
  EM.md5 = md5;

  // --- el id de dispositivo (para lo que no necesita sesión) ---------------------------------
  var DEV_KEY = "emochi-lab:device:v1";
  function deviceId() {
    var d = "";
    try {
      d = localStorage.getItem(DEV_KEY) || "";
    } catch (e) {}
    if (!d) {
      d = (crypto && crypto.randomUUID && crypto.randomUUID()) ||
        String(Date.now()) + "-" + Math.random().toString(36).slice(2, 10);
      try {
        localStorage.setItem(DEV_KEY, d);
      } catch (e) {}
    }
    return d;
  }
  EM.deviceId = deviceId;

  // --- la API del sitio ----------------------------------------------------------------------
  var BACKEND = "https://emochi-backend-k8s.flowgpt.com";
  EM.BACKEND = BACKEND;

  var token = null;        // en memoria, nunca en disco
  var tokenAt = 0;
  var tokenPending = null;

  // El token sale de la cookie de sesión: `/api/auth/refresh` es del mismo origen que la página y
  // devuelve `encodedToken`. Si la cookie no vale, responde 401 y aquí se traduce a "sin sesión".
  function fetchToken(force) {
    if (!force && token && Date.now() - tokenAt < 60 * 1000) return Promise.resolve(token);
    if (tokenPending) return tokenPending;
    tokenPending = fetch("/api/auth/refresh" + (force ? "?readOnly=1" : ""), {
      method: "GET",
      credentials: "same-origin",
      headers: { Accept: "application/json" }
    })
      .then(function (r) {
        if (r.status === 401 || r.status === 403) return null;
        if (!r.ok) throw new Error("el sitio respondió " + r.status + " al pedir la sesión");
        return r.json().catch(function () { return null; });
      })
      .then(function (j) {
        var t = j && (j.encodedToken || (j.data && j.data.encodedToken));
        token = t || null;
        tokenAt = Date.now();
        tokenPending = null;
        return token;
      })
      .catch(function (e) {
        tokenPending = null;
        throw e;
      });
    return tokenPending;
  }
  EM.fetchToken = fetchToken;
  EM.hasSession = function () {
    return !!token;
  };

  function signHeaders(authorization) {
    var ts = String(Math.floor(Date.now() / 1000));
    var nonce = (crypto && crypto.randomUUID && crypto.randomUUID()) || String(Date.now()) + Math.random();
    return {
      "x-timestamp": ts,
      "x-nonce": nonce,
      "x-signature": md5(ts + "-" + nonce + "-" + authorization)
    };
  }

  function qs(query) {
    if (!query) return "";
    var parts = [];
    Object.keys(query).forEach(function (k) {
      var v = query[k];
      if (v == null || v === "") return;
      parts.push(encodeURIComponent(k) + "=" + encodeURIComponent(v));
    });
    return parts.length ? "?" + parts.join("&") : "";
  }

  // Una llamada a su backend. `signed: true` añade las tres cabeceras de firma (es lo que llevan
  // los endpoints que las piden). Si la sesión se ha caído (401/403) se pide token otra vez y se
  // reintenta una sola vez, que es lo que hace su propia app.
  function call(method, path, opts) {
    opts = opts || {};
    var authoriz = null;
    var tries = 0;

    function run() {
      tries++;
      return Promise.resolve()
        .then(function () {
          if (opts.anonymous) {
            authoriz = deviceId();
            return {
              headers: {
                Authorization: "Bearer " + authoriz,
                "x-flow-device-id": authoriz,
                "x-flow-language": navigator.language || "es"
              }
            };
          }
          return fetchToken(tries > 1).then(function (t) {
            if (!t) {
              var e = new Error("sin sesión");
              e.code = "no-session";
              throw e;
            }
            authoriz = "Bearer " + t;
            return { headers: { Authorization: authoriz, "x-flow-userid": "" } };
          });
        })
        .then(function (base) {
          var headers = base.headers;
          Object.keys(headers).forEach(function (k) {
            if (headers[k] === "") delete headers[k];
          });
          if (opts.signed) {
            var s = signHeaders(authoriz);
            Object.keys(s).forEach(function (k) {
              headers[k] = s[k];
            });
          }
          headers.Accept = "application/json";
          if (opts.body != null) headers["Content-Type"] = "application/json";
          EM.log(method, path, headers);
          return fetch(BACKEND + path + qs(opts.query), {
            method: method,
            headers: headers,
            credentials: "omit",
            body: opts.body != null ? JSON.stringify(opts.body) : undefined
          });
        })
        .then(function (r) {
          return r.text().then(function (txt) {
            var data = null;
            try {
              data = txt ? JSON.parse(txt) : null;
            } catch (e) {
              data = txt;
            }
            if (r.ok) return data;
            var msg = (data && (data.data || data.message || data.error)) || ("HTTP " + r.status);
            if (typeof msg !== "string") msg = JSON.stringify(msg).slice(0, 300);
            var err = new Error(msg + " (" + r.status + ")");
            err.status = r.status;
            err.path = path;
            if ((r.status === 401 || r.status === 403) && !opts.anonymous && tries < 2) {
              token = null;
              tokenPending = null;
              return run();
            }
            throw err;
          });
        });
    }
    return run();
  }
  EM.call = call;
  EM.get = function (path, opts) {
    return call("GET", path, opts);
  };
  EM.post = function (path, body, opts) {
    return call("POST", path, Object.assign({}, opts, { body: body }));
  };
  EM.patch = function (path, body, opts) {
    return call("PATCH", path, Object.assign({}, opts, { body: body }));
  };
  EM.del = function (path, opts) {
    return call("DELETE", path, opts);
  };

  // --- los roles (lo que la web llama "personas") --------------------------------------------
  // Cuerpo que manda su propio formulario (`savePersonaInfo`), comprobado en su JavaScript:
  //   { userId, personaId, name, backgroundStory, imageURL, gender, isPrimary, personaEnabled,
  //     age, appearance, likes, dislikes, label }
  function personaBody(p, extra) {
    var out = {
      userId: EM.userId || "",
      personaId: String(p.personaId == null ? "0" : p.personaId),
      name: p.name == null ? "" : String(p.name),
      backgroundStory: p.backgroundStory == null ? "" : String(p.backgroundStory).trim(),
      imageURL: p.imageURL == null ? "" : String(p.imageURL),
      gender: p.gender == null ? "" : String(p.gender),
      isPrimary: !!p.isPrimary,
      personaEnabled: !!p.personaEnabled,
      age: typeof p.age === "number" && p.age > 0 ? p.age : null,
      appearance: p.appearance ? String(p.appearance) : null,
      likes: p.likes ? String(p.likes) : null,
      dislikes: p.dislikes ? String(p.dislikes) : null,
      label: Array.isArray(p.label) && p.label.length ? p.label.slice(0, 12) : []
    };
    if (extra) Object.assign(out, extra);
    return out;
  }
  EM.api = {
    personas: function () {
      return EM.get("/user/v2/personas");
    },
    createPersona: function (p) {
      return EM.post("/user/v2/persona", personaBody(p, { isPrimary: !!p.isPrimary, personaEnabled: !!p.personaEnabled }));
    },
    updatePersona: function (p) {
      return EM.patch("/user/v2/persona", personaBody(p));
    },
    deletePersona: function (id) {
      return EM.del("/user/v2/persona", { query: { personaId: String(id) } });
    },
    personaStatus: function (id, on) {
      return EM.patch("/user/personas/status", { personaEnabled: !!on }, { query: { personaId: String(id) } });
    },
    // el rol de UN bot concreto (así es como "al entrar en un chatbot" sale un rol u otro)
    personaOfPrompt: function (promptId, personaId) {
      return EM.patch("/user/prompt/" + encodeURIComponent(promptId) + "/persona", { personaId: String(personaId) });
    },
    personaMap: function (promptId) {
      return EM.get("/user/prompt/persona/map", { query: { promptId: promptId } });
    },
    me: function () {
      return EM.get("/user/profile");
    },
    // los modelos del sitio (es público): útil para el chat anónimo y para saber qué hay
    models: function () {
      return EM.get("/models/settings-list");
    }
  };
  EM.personaBody = personaBody;

  // --- saber en qué bot estamos --------------------------------------------------------------
  // La dirección trae el "uri" del personaje, no su promptId, y el promptId es lo que pide la API.
  // Dos caminos: engancharse a lo que la propia app pregunta (sus peticiones llevan el promptId)
  // y, si no, resolverlo buscando el personaje por su uri.
  EM.bot = { uri: "", promptId: "", title: "" };
  EM.onBot = [];
  EM.setBot = function (bot) {
    var changed = bot && (bot.promptId !== EM.bot.promptId || bot.uri !== EM.bot.uri);
    EM.bot = Object.assign({}, EM.bot, bot || {});
    if (changed) {
      EM.log("bot:", EM.bot);
      EM.onBot.forEach(function (fn) {
        try {
          fn(EM.bot);
        } catch (e) {}
      });
    }
  };

  EM.readUriFromUrl = function (u) {
    try {
      var url = new URL(u || location.href, location.origin);
      var m = /^\/(?:[a-z]{2}(?:-[A-Z]{2})?\/)?character\/([^/]+)/.exec(url.pathname) ||
        /^\/(?:[a-z]{2}(?:-[A-Z]{2})?\/)?prompt\/([^/]+)/.exec(url.pathname);
      return m ? decodeURIComponent(m[1]) : "";
    } catch (e) {
      return "";
    }
  };

  // El promptId viaja en el cuerpo (o en la dirección) de varias llamadas de la app. Se copia.
  function learn(bodyText, url) {
    var id = "";
    try {
      if (bodyText && /"promptId"\s*:\s*"/.test(bodyText)) {
        id = (/"promptId"\s*:\s*"([A-Za-z0-9_\-]{6,40})"/.exec(bodyText) || [])[1] || "";
      }
      if (!id && url) {
        var m = /promptId=([A-Za-z0-9_\-]{6,40})/.exec(url);
        if (m) id = m[1];
      }
    } catch (e) {}
    if (id) EM.setBot({ promptId: id, uri: EM.bot.uri || EM.readUriFromUrl() });
  }
  EM.learnPromptId = learn;

  // Engancharse a fetch y a XHR ANTES de que la app haga nada (el manifest pide document-start).
  (function hookNetwork() {
    var origFetch = window.fetch;
    if (typeof origFetch === "function") {
      window.fetch = function (input, init) {
        try {
          var url = typeof input === "string" ? input : (input && input.url) || "";
          if (url && url.indexOf("flowgpt.com") >= 0) {
            var body = (init && init.body) || null;
            learn(typeof body === "string" ? body : null, url);
          }
        } catch (e) {}
        return origFetch.apply(this, arguments);
      };
    }
    var OrigXHR = window.XMLHttpRequest;
    if (OrigXHR) {
      var open = OrigXHR.prototype.open;
      var send = OrigXHR.prototype.send;
      OrigXHR.prototype.open = function (method, url) {
        try {
          this.__emUrl = url;
        } catch (e) {}
        return open.apply(this, arguments);
      };
      OrigXHR.prototype.send = function (body) {
        try {
          if (this.__emUrl && String(this.__emUrl).indexOf("flowgpt.com") >= 0) {
            learn(typeof body === "string" ? body : null, String(this.__emUrl));
          }
        } catch (e) {}
        return send.apply(this, arguments);
      };
    }
  })();

  // --- piezas de interfaz (las comparten roles.js y el panel) ---------------------------------
  EM.el = function (tag, props, children) {
    var n = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        var v = props[k];
        if (v == null || v === false) return;
        if (k === "text") n.textContent = v;
        else if (k === "html") n.innerHTML = v;
        else if (k === "class") n.className = v;
        else if (k === "style" && typeof v === "object") Object.assign(n.style, v);
        else if (k.slice(0, 2) === "on" && typeof v === "function") n.addEventListener(k.slice(2), v);
        else n.setAttribute(k, v === true ? "" : v);
      });
    }
    (Array.isArray(children) ? children : children == null ? [] : [children]).forEach(function (c) {
      if (c == null || c === false) return;
      n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return n;
  };
  EM.clear = function (node) {
    while (node && node.firstChild) node.removeChild(node.firstChild);
  };
  EM.esc = function (s) {
    return String(s == null ? "" : s);
  };
  EM.whenBody = function (fn) {
    if (document.body) return fn();
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else document.addEventListener("readystatechange", function h() {
      if (document.body) {
        document.removeEventListener("readystatechange", h);
        fn();
      }
    });
  };

  EM.log("núcleo listo, v" + EM.version);
})();

/* =============================================================================================
   emochi.com — el panel de roles (🎭).

   Los "roles" son lo que la web llama *personas*: la ficha del papel que haces TÚ en el roleplay
   (nombre, historia, apariencia, gustos, disgustos, etiquetas…). La web los esconde en un par de
   pantallas y su formulario no ayuda nada, así que aquí están: se ven, se crean, se editan, se
   borran, se marca el principal y se elige el rol de un bot concreto.

   Todo va contra SU API, con la sesión que ya tiene el navegador: los roles creados aquí son los
   mismos que luego usa el chat.
   ============================================================================================= */
(function () {
  "use strict";
  var EM = window.emochiLab;
  if (!EM) return;

  var el = EM.el;
  var GENDERS = [
    ["", "—"],
    ["Male", "Hombre"],
    ["Female", "Mujer"],
    ["Other", "Otro"]
  ];

  var state = {
    open: false,
    view: "list",     // list | form
    list: null,       // null = cargando
    draft: null,      // la ficha que se está editando
    isNew: false,
    botRole: "",      // personaId del rol elegido para el bot actual
    busy: false,
    msg: null,        // { text, bad }
    error: ""
  };

  var root, fab, panel, bodyEl, statusEl, msgEl, titleEl;

  // --- el borrador: lo que estás escribiendo no se pierde si cierras ---------------------------
  function draftKey() {
    var id = state.draft && state.draft.personaId ? String(state.draft.personaId) : "nuevo";
    return "emochi-lab:draft:v1:" + (EM.bot.uri || "-") + ":" + id;
  }
  function saveDraft() {
    if (state.view !== "form" || !state.draft) return;
    try {
      localStorage.setItem(draftKey(), JSON.stringify(state.draft));
    } catch (e) {}
  }
  function loadDraft(personaId) {
    var key = "emochi-lab:draft:v1:" + (EM.bot.uri || "-") + ":" + (personaId ? String(personaId) : "nuevo");
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }
  function dropDraft(personaId) {
    try {
      localStorage.removeItem("emochi-lab:draft:v1:" + (EM.bot.uri || "-") + ":" + (personaId ? String(personaId) : "nuevo"));
    } catch (e) {}
  }

  // --- ideas (sin red: para no quedarse en blanco) --------------------------------------------
  var IDEAS = {
    arquetipo: ["detective cansado", "vampira médica", "piloto de carga", "hechicera exiliada", "capitana pirata", "cazador de monstruos", "profesora severa", "ladrón de guante blanco", "guardaespaldas leal", "periodista metomentodo", "ingeniera de la estación orbital", "monja rebelde"],
    rasgo: ["fría por fuera y protectora por dentro", "habla poco y mira mucho", "sarcástica hasta que duele", "demasiado educada para ser sincera", "impulsiva y luego arrepentida", "cuida a los demás y se olvida de sí misma", "siempre está en otra parte con la cabeza", "rivaliza por deporte"],
    secreto: ["debe dinero a la persona equivocada", "es la única superviviente de algo que no cuenta", "cambió su nombre hace años", "tiene un hermano del que nadie sabe nada", "firma sus obras con otro nombre", "guarda una carta que nunca envió", "una vez dejó morir a alguien y no lo confesó"],
    gustos: ["el café solo y a deshoras", "la lluvia en las ventanas", "los libros con anotaciones ajenas", "las motos viejas", "las partidas de cartas por dinero", "dormir hasta tarde", "las tormentas"],
    disgustos: ["esperar", "la gente que presume", "los ruidos de boca", "que le den órdenes", "los ascensores", "el calor", "mentir sin motivo"],
    etiqueta: ["drama", "romance", "misterio", "nocturno", "lento", "intenso", "sobrenatural", "cotidiano", "cómico", "peligroso"]
  };
  function pick(a) {
    return a[Math.floor(Math.random() * a.length)];
  }
  function pickSome(a, n) {
    var copy = a.slice();
    var out = [];
    while (copy.length && out.length < n) out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
    return out;
  }
  function ideaList(a, n) {
    return pickSome(a, n).join(", ");
  }
  // Rellena solo los campos que estén vacíos: las ideas son para arrancar, no para pisar lo tuyo.
  function fillIdeas() {
    var d = state.draft;
    var arq = pick(IDEAS.arquetipo);
    if (!d.name.trim()) d.name = arq.replace(/^(.)/, function (c) { return c.toUpperCase(); });
    if (!d.backgroundStory.trim()) {
      d.backgroundStory = "Es " + arq + ", " + pick(IDEAS.rasgo) + ". " + "Nadie sabe que " + pick(IDEAS.secreto) + ".";
    }
    if (!d.appearance.trim()) d.appearance = "De pie firme y mirada de cansancio contenido; ropa práctica, marcada por el uso.";
    if (!d.likes.trim()) d.likes = ideaList(IDEAS.gustos, 3);
    if (!d.dislikes.trim()) d.dislikes = ideaList(IDEAS.disgustos, 3);
    if (!d.label.length) d.label = pickSome(IDEAS.etiqueta, 3);
    if (!d.gender) d.gender = pick(["Male", "Female", "Other"]);
    saveDraft();
    render();
  }

  // --- hablar con la API ----------------------------------------------------------------------
  function load() {
    state.list = null;
    state.error = "";
    state.msg = null;
    render();
    return EM.api
      .personas()
      .then(function (list) {
        state.list = Array.isArray(list) ? list : [];
        EM.log("roles:", state.list);
        if (EM.bot.promptId) return refreshBotRole();
      })
      .catch(function (e) {
        state.error = e.code === "no-session"
          ? "Sin sesión: entra en emochi.com con tu cuenta y vuelve a intentarlo."
          : "No se pudieron leer tus roles: " + e.message;
        state.list = [];
      })
      .then(render);
  }
  function refreshBotRole() {
    if (!EM.bot.promptId) {
      state.botRole = "";
      return Promise.resolve();
    }
    return EM.api
      .personaMap(EM.bot.promptId)
      .then(function (map) {
        var m = map && map[EM.bot.promptId];
        state.botRole = m && m.personaId ? String(m.personaId) : "";
        EM.log("rol del bot", EM.bot.promptId, m);
      })
      .catch(function (e) {
        EM.log("sin rol para este bot:", e.message);
        state.botRole = "";
      });
  }
  function say(text, bad) {
    state.msg = text ? { text: text, bad: !!bad } : null;
    render();
    if (text && !bad) setTimeout(function () { if (state.msg && state.msg.text === text) { state.msg = null; render(); } }, 4000);
  }
  function guard(promise) {
    state.busy = true;
    render();
    return Promise.resolve(promise)
      .then(function (r) {
        state.busy = false;
        return r;
      })
      .catch(function (e) {
        state.busy = false;
        throw e;
      });
  }
  function save() {
    var d = state.draft;
    if (!d.name.trim()) {
      say("El rol necesita un nombre.", true);
      return;
    }
    var body = EM.personaBody(d, {
      isPrimary: state.isNew ? !!d.isPrimary : undefined,
      personaEnabled: state.isNew ? !!d.personaEnabled : undefined
    });
    if (!state.isNew) {
      // editar: no se toca si es principal ni si está activo (eso se cambia con su botón)
      delete body.isPrimary;
      delete body.personaEnabled;
    }
    var op = state.isNew ? EM.api.createPersona(body) : EM.api.updatePersona(body);
    guard(op)
      .then(function () {
        dropDraft(d.personaId);
        state.view = "list";
        return load();
      })
      .then(function () {
        say(state.isNew ? "Rol creado." : "Rol guardado.");
      })
      .catch(function (e) {
        say("No se pudo guardar: " + e.message, true);
      });
  }
  function removePersona(p) {
    if (!window.confirm("¿Borrar el rol «" + p.name + "»? No se puede deshacer.")) return;
    guard(EM.api.deletePersona(p.personaId))
      .then(function () {
        if (String(state.botRole) === String(p.personaId)) state.botRole = "";
        return load();
      })
      .then(function () { say("Rol borrado."); })
      .catch(function (e) { say("No se pudo borrar: " + e.message, true); });
  }
  function makePrimary(p) {
    guard(EM.api.updatePersona(EM.personaBody(p, { isPrimary: true, personaEnabled: true })))
      .then(function () {
        if (p.personaId) return EM.api.personaStatus(p.personaId, true);
      })
      .then(load)
      .then(function () { say("«" + p.name + "» es tu rol principal."); })
      .catch(function (e) { say("No se pudo marcar: " + e.message, true); });
  }
  function useHere(p) {
    if (!EM.bot.promptId) {
      say("Todavía no sé en qué bot estás: abre su chat un momento y vuelve.", true);
      return;
    }
    guard(EM.api.personaOfPrompt(EM.bot.promptId, p.personaId))
      .then(function () {
        state.botRole = String(p.personaId);
        render();
        say("«" + p.name + "» queda puesto para este bot.");
      })
      .catch(function (e) { say("No se pudo asignar: " + e.message, true); });
  }
  function clearHere() {
    if (!EM.bot.promptId) return;
    guard(EM.api.personaOfPrompt(EM.bot.promptId, "0"))
      .then(function () {
        state.botRole = "";
        render();
        say("Este bot vuelve a usar tu rol principal.");
      })
      .catch(function (e) { say("No se pudo quitar: " + e.message, true); });
  }

  // --- vistas ---------------------------------------------------------------------------------
  function personaOf(id) {
    return (state.list || []).filter(function (p) { return String(p.personaId) === String(id); })[0] || null;
  }
  function genderLabel(g) {
    var m = GENDERS.filter(function (x) { return x[0] === g; })[0];
    return m ? m[1] : g || "";
  }
  function isPrimary(p) {
    return p.isPrimary === true || p.isPrimary === "true";
  }
  function isEnabled(p) {
    return p.personaEnabled === true || p.personaEnabled === "true";
  }

  function field(label, node, hint) {
    return el("label", { class: "em-field" }, [el("span", { class: "em-field-label", text: label }), node, hint ? el("small", { text: hint }) : null]);
  }
  function input(key, opts) {
    opts = opts || {};
    var node = opts.multiline
      ? el("textarea", { rows: opts.rows || 3, class: "em-input", placeholder: opts.placeholder || "" })
      : el("input", { class: "em-input", type: opts.type || "text", placeholder: opts.placeholder || "" });
    node.value = state.draft[key] == null ? "" : state.draft[key];
    node.addEventListener("input", function () {
      state.draft[key] = node.value;
      saveDraft();
    });
    return node;
  }

  function renderList() {
    var out = el("div", { class: "em-list" });

    if (state.error) {
      out.appendChild(el("div", { class: "em-note em-note-bad" }, [el("p", { text: state.error }), el("button", { class: "em-btn", text: "Reintentar", onclick: load })]));
      return out;
    }
    if (state.list === null) {
      out.appendChild(el("div", { class: "em-note" }, [el("span", { class: "em-spin" }), el("span", { text: " Leyendo tus roles…" })]));
      return out;
    }

    // el bot en el que estás: aquí es donde "los roles salen al entrar en un chatbot"
    if (EM.bot.uri || EM.bot.promptId) {
      var current = personaOf(state.botRole);
      var box = el("div", { class: "em-bot" });
      box.appendChild(el("div", { class: "em-bot-title" }, [
        el("span", { text: "Bot actual: " }),
        el("b", { text: EM.bot.title || EM.bot.uri || "…" })
      ]));
      if (!EM.bot.promptId) {
        box.appendChild(el("div", { class: "em-note em-note-small", text: "Todavía no he visto su id: dale a hablar con él un momento (o recarga el chat) y sabré cuál es." }));
      } else {
        var row = el("div", { class: "em-bot-row" });
        var sel = el("select", { class: "em-input" });
        sel.appendChild(el("option", { value: "", text: "— tu rol principal —" }));
        (state.list || []).forEach(function (p) {
          sel.appendChild(el("option", { value: String(p.personaId), text: p.name }));
        });
        sel.value = state.botRole || "";
        sel.addEventListener("change", function () {
          var id = sel.value;
          if (!id) return clearHere();
          var p = personaOf(id);
          if (p) return useHere(p);
        });
        row.appendChild(sel);
        box.appendChild(row);
        box.appendChild(el("div", { class: "em-bot-note", text: current ? "Usando «" + current.name + "» en este bot." : "Este bot usa tu rol principal." }));
      }
      out.appendChild(box);
    }

    if (!state.list.length) {
      out.appendChild(el("div", { class: "em-note" }, [
        el("p", { text: "No tienes ningún rol todavía." }),
        el("button", { class: "em-btn em-btn-main", text: "＋ Crear el primero", onclick: newPersona })
      ]));
      return out;
    }

    state.list.forEach(function (p) {
      var card = el("div", { class: "em-card" + (isPrimary(p) ? " em-card-primary" : "") });
      var top = el("div", { class: "em-card-top" });
      if (p.imageURL || p.image) {
        top.appendChild(el("img", { class: "em-avatar", src: p.imageURL || p.image, alt: "" }));
      } else {
        top.appendChild(el("span", { class: "em-avatar em-avatar-empty", text: (p.name || "?").trim().charAt(0).toUpperCase() }));
      }
      var head = el("div", { class: "em-card-head" });
      head.appendChild(el("div", { class: "em-name", text: p.name || "(sin nombre)" }));
      var meta = [];
      if (p.gender) meta.push(genderLabel(p.gender));
      if (p.age) meta.push(p.age + " años");
      if (isPrimary(p)) meta.push("principal");
      else if (isEnabled(p)) meta.push("activo");
      head.appendChild(el("div", { class: "em-meta", text: meta.join(" · ") }));
      top.appendChild(head);
      card.appendChild(top);

      if (p.backgroundStory) card.appendChild(el("p", { class: "em-story", text: p.backgroundStory.length > 220 ? p.backgroundStory.slice(0, 220) + "…" : p.backgroundStory }));
      var labels = Array.isArray(p.label) ? p.label : Array.isArray(p.labels) ? p.labels : [];
      if (labels.length) {
        var chips = el("div", { class: "em-chips" });
        labels.slice(0, 8).forEach(function (t) { chips.appendChild(el("span", { class: "em-chip", text: t })); });
        card.appendChild(chips);
      }
      var acts = el("div", { class: "em-acts" });
      if (EM.bot.promptId) {
        var mine = String(state.botRole) === String(p.personaId);
        acts.appendChild(el("button", { class: "em-btn" + (mine ? " em-btn-on" : ""), text: mine ? "✓ En este bot" : "Usar en este bot", onclick: function () { mine ? clearHere() : useHere(p); } }));
      }
      acts.appendChild(el("button", { class: "em-btn", text: "Editar", onclick: function () { editPersona(p); } }));
      if (!isPrimary(p)) acts.appendChild(el("button", { class: "em-btn", text: "★ Principal", title: "Que sea el rol que se usa por defecto", onclick: function () { makePrimary(p); } }));
      acts.appendChild(el("button", { class: "em-btn em-btn-bad", text: "Borrar", onclick: function () { removePersona(p); } }));
      card.appendChild(acts);
      out.appendChild(card);
    });
    return out;
  }

  function renderForm() {
    var d = state.draft;
    var out = el("div", { class: "em-form" });
    out.appendChild(field("Nombre", input("name", { placeholder: "Como quieres que te llamen" })));

    var row = el("div", { class: "em-row" });
    var gsel = el("select", { class: "em-input" });
    GENDERS.forEach(function (g) { gsel.appendChild(el("option", { value: g[0], text: g[1] })); });
    gsel.value = d.gender || "";
    gsel.addEventListener("change", function () { d.gender = gsel.value; saveDraft(); });
    row.appendChild(field("Género", gsel));
    var age = input("age", { type: "number", placeholder: "Ej. 27" });
    age.addEventListener("input", function () {
      var n = parseInt(age.value, 10);
      d.age = isNaN(n) ? null : n;
      saveDraft();
    });
    row.appendChild(field("Edad", age));
    out.appendChild(row);

    out.appendChild(field("Historia", input("backgroundStory", { multiline: true, rows: 5, placeholder: "Quién eres, de dónde vienes, qué te trajo aquí…" }), "Es lo que más pesa en cómo te trata el bot."));
    out.appendChild(field("Apariencia", input("appearance", { multiline: true, rows: 3, placeholder: "Cómo te ve el bot cuando te describe" })));
    out.appendChild(field("Gustos", input("likes", { multiline: true, rows: 2, placeholder: "Cosas que te gustan" })));
    out.appendChild(field("Disgustos", input("dislikes", { multiline: true, rows: 2, placeholder: "Cosas que no soportas" })));

    var lab = el("input", { class: "em-input", placeholder: "etiquetas separadas por comas" });
    lab.value = (d.label || []).join(", ");
    lab.addEventListener("input", function () {
      d.label = lab.value.split(",").map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 12);
      saveDraft();
    });
    out.appendChild(field("Etiquetas", lab));

    var acts = el("div", { class: "em-acts em-acts-end" });
    if (EM.prefs.ideas) acts.appendChild(el("button", { class: "em-btn", text: "🎲 Ideas", title: "Rellena los huecos con una sugerencia", onclick: fillIdeas }));
    acts.appendChild(el("button", { class: "em-btn", text: "Cancelar", onclick: function () { state.view = "list"; render(); } }));
    acts.appendChild(el("button", { class: "em-btn em-btn-main", text: state.isNew ? "Crear rol" : "Guardar", disabled: state.busy, onclick: save }));
    out.appendChild(acts);
    return out;
  }

  function newPersona() {
    var saved = loadDraft(null);
    state.draft = saved || { personaId: 0, name: "", backgroundStory: "", imageURL: "", gender: "", age: null, appearance: "", likes: "", dislikes: "", label: [], isPrimary: (state.list || []).length === 0, personaEnabled: true };
    state.isNew = true;
    state.view = "form";
    render();
  }
  function editPersona(p) {
    var saved = loadDraft(p.personaId);
    state.draft = saved || {
      personaId: p.personaId,
      name: p.name || "",
      backgroundStory: p.backgroundStory || "",
      imageURL: p.imageURL || "",
      gender: p.gender || "",
      age: typeof p.age === "number" ? p.age : null,
      appearance: p.appearance || "",
      likes: p.likes || "",
      dislikes: p.dislikes || "",
      label: Array.isArray(p.label) ? p.label.slice() : [],
      isPrimary: isPrimary(p),
      personaEnabled: isEnabled(p)
    };
    state.isNew = false;
    state.view = "form";
    render();
  }

  function render() {
    if (!panel) return;
    titleEl.textContent = state.view === "form" ? (state.isNew ? "Nuevo rol" : "Editar rol") : "Mis roles";
    statusEl.textContent = state.busy ? "…" : state.list ? state.list.length + "" : "";
    msgEl.hidden = !state.msg;
    msgEl.textContent = state.msg ? state.msg.text : "";
    msgEl.className = "em-msg" + (state.msg && state.msg.bad ? " em-msg-bad" : "");
    EM.clear(bodyEl);
    bodyEl.appendChild(state.view === "form" ? renderForm() : renderList());
    bodyEl.scrollTop = 0;
  }

  function openPanel() {
    state.open = true;
    panel.hidden = false;
    fab.setAttribute("aria-expanded", "true");
    if (state.list === null) load();
    else render();
  }
  function closePanel() {
    state.open = false;
    panel.hidden = true;
    fab.setAttribute("aria-expanded", "false");
  }

  function mount() {
    if (root) return;
    root = el("div", { id: "em-root" });

    fab = el("button", {
      id: "em-fab",
      type: "button",
      title: "Roles (personas) — emochi",
      "aria-label": "Roles",
      "aria-expanded": "false",
      onclick: function () { state.open ? closePanel() : openPanel(); }
    }, [el("span", { text: "🎭" })]);

    var head = el("header", { class: "em-head" });
    titleEl = el("b", { class: "em-title", text: "Mis roles" });
    statusEl = el("span", { class: "em-count" });
    head.appendChild(titleEl);
    head.appendChild(statusEl);
    head.appendChild(el("span", { class: "em-grow" }));
    head.appendChild(el("button", { class: "em-icon", title: "Recargar", text: "⟳", onclick: load }));
    head.appendChild(el("button", { class: "em-icon", title: "Cerrar", text: "✕", onclick: closePanel }));

    msgEl = el("div", { class: "em-msg", hidden: true });
    bodyEl = el("div", { class: "em-body" });

    var foot = el("footer", { class: "em-foot" });
    foot.appendChild(el("button", { class: "em-btn em-btn-main", text: "＋ Nuevo rol", onclick: newPersona }));

    panel = el("aside", { id: "em-panel", hidden: true, "aria-label": "Mis roles" }, [head, msgEl, bodyEl, foot]);
    root.appendChild(fab);
    root.appendChild(panel);
    EM.whenBody(function () {
      document.body.appendChild(root);
      render();
    });

    EM.onBot.push(function () {
      if (state.view === "list") {
        refreshBotRole().then(render);
      }
    });
  }

  EM.panel = {
    mount: mount,
    open: openPanel,
    close: closePanel,
    toggle: function () { state.open ? closePanel() : openPanel(); },
    reload: load,
    state: state,
    IDEAS: IDEAS
  };
})();

/* =============================================================================================
   emochi.com — el arranque: planta el botón y el panel, y sigue a la web cuando cambia de página
   (que es una SPA: la dirección cambia sin recargar).

   El orden es: `core.js` (ajustes, API y el enganche a sus peticiones para saber en qué bot
   estamos) → `roles.js` (el panel) → esto.
   ============================================================================================= */
(function () {
  "use strict";
  var EM = window.emochiLab;
  if (!EM) return;

  function syncBot() {
    var uri = EM.readUriFromUrl();
    if (uri && uri !== EM.bot.uri) EM.setBot({ uri: uri, promptId: "", title: decodeURIComponent(uri) });
    else if (!uri && EM.bot.uri) EM.setBot({ uri: "", promptId: "", title: "" });
  }

  function start() {
    syncBot();
    if (EM.prefs.on) {
      EM.panel.mount();
      // Una SPA cambia de pantalla sin avisar: se vigila la dirección (y el título, que es lo que
      // trae el nombre del personaje) para saber si hemos entrado o salido de un chat.
      var last = location.href;
      var lastTitle = document.title;
      setInterval(function () {
        if (location.href !== last) {
          last = location.href;
          syncBot();
        }
        if (document.title !== lastTitle) {
          lastTitle = document.title;
          if (EM.bot.uri) EM.setBot({ title: lastTitle.split("|")[0].trim() || EM.bot.uri });
        }
      }, 1000);
      // por si la app navega por historial
      ["pushState", "replaceState"].forEach(function (fn) {
        var orig = history[fn];
        if (typeof orig !== "function") return;
        history[fn] = function () {
          var r = orig.apply(this, arguments);
          setTimeout(syncBot, 0);
          return r;
        };
      });
      window.addEventListener("popstate", syncBot);
    } else {
      EM.log("apagado por ajuste");
    }
  }

  EM.whenBody(start);
})();

