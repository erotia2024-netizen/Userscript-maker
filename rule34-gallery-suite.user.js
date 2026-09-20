// ==UserScript==
// @name         Rule34 Gallery Suite
// @namespace    https://github.com/erotia2024-netizen/Userscript-maker
// @version      0.8.0
// @description  Reconstruye rule34.xxx para PC: galeria escalable (tu eliges el tamano de miniatura) con icono de "ya visto", descarga de originales con nombre y carpeta propios (cola que se puede continuar y reintentar tras recargar), seleccion manual de posts (con lista de lo marcado) y lotes de una busqueda entera en un solo .zip, seccion de videos con barra de controles propia, analizador de etiquetas por personaje (con IA opcional), aviso si hay otro descargador en conflicto, y panel "Mejoras" con todas las opciones del ensamblador, en espanol.
// @author       rule34-gallery-suite
// @homepageURL  https://github.com/erotia2024-netizen/Userscript-maker
// @supportURL   https://github.com/erotia2024-netizen/Userscript-maker/issues
// @downloadURL  https://raw.githubusercontent.com/erotia2024-netizen/Userscript-maker/main/rule34-gallery-suite.user.js
// @updateURL    https://raw.githubusercontent.com/erotia2024-netizen/Userscript-maker/main/rule34-gallery-suite.user.js
// @match        *://rule34.xxx/*
// @match        *://www.rule34.xxx/*
// @run-at       document-end
// @noframes
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      *
// @connect      rule34.xxx
// @connect      api.rule34.xxx
// @connect      wimg.rule34.xxx
// @connect      us.rule34.xxx
// @connect      video-cdn1.rule34.xxx
// @connect      video-cdn2.rule34.xxx
// @connect      video-cdn3.rule34.xxx
// ==/UserScript==

(function () {
  "use strict";
  var css = "html {\n  --r34g-cols: 5;\n  --r34g-aspect: 1 / 1;\n  --r34g-gap: 12px;\n  --r34g-radius: 8px;\n  --r34g-card: #232a23;\n  --r34g-card-hover: #2a322a;\n  --r34g-line: #3d473d;\n  --r34g-accent: var(--c-link-soft, #93b393);\n  --r34g-bg: var(--c-bg, #303a30);\n  --r34g-bg-alt: var(--c-bg-alt, #293129);\n  --r34g-bg-deep: var(--c-bg-deep, #303030);\n  --r34g-text: var(--c-text, #c0c0c0);\n  --r34g-text-soft: var(--c-text-soft, #878787);\n  --r34g-link: var(--c-link, #b0e0b0);\n  --r34g-shadow: 0 18px 48px rgba(0, 0, 0, .55);\n  --r34g-vwidth: 1000px;\n  --r34g-z: 2147482000;\n}\n\nhtml[data-r34g-cols=\"3\"] { --r34g-cols: 3; }\nhtml[data-r34g-cols=\"4\"] { --r34g-cols: 4; }\nhtml[data-r34g-cols=\"5\"] { --r34g-cols: 5; }\nhtml[data-r34g-cols=\"6\"] { --r34g-cols: 6; }\nhtml[data-r34g-cols=\"7\"] { --r34g-cols: 7; }\nhtml[data-r34g-aspect=\"1\"] { --r34g-aspect: 1 / 1; }\nhtml[data-r34g-aspect=\"4/5\"] { --r34g-aspect: 4 / 5; }\nhtml[data-r34g-aspect=\"3x4\"] { --r34g-aspect: 3 / 4; }\nhtml[data-r34g-aspect=\"auto\"] { --r34g-aspect: auto; }\nhtml[data-r34g-aspect=\"auto\"] { --r34g-fit: contain; }\nhtml[data-r34g-fit=\"contain\"] { --r34g-fit: contain; }\nhtml[data-r34g-fit=\"cover\"] { --r34g-fit: cover; }\nhtml[data-r34g-hover=\"off\"] .image-list .thumb img.preview { transform: none !important; }\n\n#r34g-nav-item a {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  cursor: pointer;\n}\n\n#r34g-nav-item a b {\n  font-weight: normal;\n  font-size: 1.15em;\n  line-height: 1;\n}\n\n#r34g-nav-item a:hover {\n  color: var(--c-link, #b0e0b0) !important;\n}\n\n#r34g-nav-item a svg {\n  width: 14px;\n  height: 14px;\n}\n\n#r34g-nav-item.r34g-active a {\n  color: var(--c-link, #b0e0b0) !important;\n  text-shadow: 0 0 0 currentColor;\n}\n\nhtml body #r34g-modal .r34g-title svg {\n  width: 15px;\n  height: 15px;\n}\n\nhtml body #post-list > .content,\nhtml body .image-list {\n  min-width: 0;\n}\n\nhtml body #post-list > .content {\n  flex: 1 1 auto !important;\n  width: auto !important;\n  max-width: none !important;\n}\n\nhtml body .image-list {\n  display: grid !important;\n  grid-template-columns: repeat(var(--r34g-cols), minmax(0, 1fr)) !important;\n  gap: var(--r34g-gap) !important;\n  align-items: start !important;\n  align-content: start !important;\n  justify-content: stretch !important;\n  width: 100% !important;\n  margin: 0 !important;\n  padding: 0 !important;\n}\n\nhtml body .image-list > .thumb {\n  position: relative !important;\n  display: block !important;\n  width: auto !important;\n  height: auto !important;\n  min-width: 0 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  border-radius: var(--r34g-radius) !important;\n  background: var(--r34g-card);\n  overflow: hidden;\n  box-shadow: 0 1px 0 rgba(255, 255, 255, .04) inset, 0 2px 10px rgba(0, 0, 0, .28);\n  transition: background .18s ease, box-shadow .18s ease, transform .18s ease;\n}\n\nhtml body .image-list > .thumb::before {\n  content: \"\";\n  display: block;\n  padding-top: 0;\n}\n\nhtml body .image-list > .thumb > a {\n  position: relative !important;\n  display: block !important;\n  width: 100% !important;\n  height: 100% !important;\n  aspect-ratio: var(--r34g-aspect) !important;\n  text-align: center !important;\n  overflow: hidden;\n  border-radius: var(--r34g-radius) !important;\n  background: linear-gradient(160deg, rgba(255, 255, 255, .03), rgba(0, 0, 0, .25));\n  outline: 1px solid rgba(255, 255, 255, .05);\n  outline-offset: -1px;\n}\n\nhtml body .image-list > .thumb:hover {\n  background: var(--r34g-card-hover);\n  transform: translateY(-2px);\n  box-shadow: 0 6px 20px rgba(0, 0, 0, .45);\n}\n\nhtml body .image-list > .thumb:hover > a {\n  outline-color: rgba(147, 179, 147, .6);\n}\n\nhtml body .image-list > .thumb:hover img.preview,\nhtml body .image-list > .thumb:hover img.r34g-ready {\n  filter: brightness(1.06) saturate(1.04);\n}\n\nhtml body .image-list > .thumb > a::after {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  background: linear-gradient(to top, rgba(0, 0, 0, .78) 0%, rgba(0, 0, 0, .32) 32%, rgba(0, 0, 0, 0) 62%);\n  opacity: 0;\n  transition: opacity .2s ease;\n  pointer-events: none;\n}\n\nhtml body .image-list > .thumb:hover > a::after {\n  opacity: 1;\n}\n\nhtml body .image-list > .thumb img.preview,\nhtml body .image-list > .thumb img,\nhtml body .image-list > .thumb video {\n  display: block !important;\n  width: 100% !important;\n  height: 100% !important;\n  max-width: none !important;\n  max-height: none !important;\n  margin: 0 !important;\n  object-fit: var(--r34g-fit, cover) !important;\n  object-position: center 22%;\n  border: 0 !important;\n  box-sizing: border-box !important;\n  opacity: 0;\n  transition: opacity .35s ease, transform .3s ease, filter .3s ease;\n}\n\nhtml body .image-list > .thumb img.r34g-ready {\n  opacity: 1;\n}\n\nhtml body .image-list > .thumb:hover img.preview,\nhtml body .image-list > .thumb:hover img.r34g-ready {\n  transform: scale(1.045);\n}\n\nhtml body .image-list > .thumb img.webm-thumb {\n  border: 0 !important;\n  outline: 0 !important;\n}\n\nhtml body .image-list > .thumb > a > .score-info {\n  position: absolute !important;\n  right: 7px !important;\n  bottom: 7px !important;\n  z-index: 3;\n  display: inline-flex !important;\n  align-items: center;\n  gap: 4px;\n  margin: 0 !important;\n  padding: 2px 7px !important;\n  border-radius: 999px !important;\n  background: rgba(0, 0, 0, .62) !important;\n  border: 1px solid rgba(255, 255, 255, .12);\n  border-left-width: 3px;\n  color: #e8e8e8 !important;\n  font-size: 11px !important;\n  line-height: 1.45 !important;\n  letter-spacing: .2px;\n  text-align: center !important;\n  backdrop-filter: blur(3px);\n  transition: background .2s ease, transform .2s ease, border-color .2s ease;\n}\n\nhtml body .image-list > .thumb:hover > a > .score-info {\n  background: rgba(0, 0, 0, .85) !important;\n  transform: translateY(-1px);\n}\n\nhtml body .image-list > .thumb > a > .score-info.low {\n  border-left-color: #d9534f !important;\n}\n\nhtml body .image-list > .thumb > a > .score-info.medium {\n  border-left-color: #f0ad4e !important;\n}\n\nhtml body .image-list > .thumb > a > .score-info.high {\n  border-left-color: #5cb85c !important;\n}\n\nhtml[data-r34g-score=\"off\"] .image-list .thumb > a > .score-info {\n  display: none !important;\n}\n\nhtml body .image-list .thumb .r34g-badges {\n  position: absolute;\n  top: 7px;\n  left: 7px;\n  z-index: 3;\n  display: flex;\n  gap: 5px;\n  opacity: .92;\n  transition: opacity .2s ease;\n}\n\nhtml body .image-list .thumb:hover .r34g-badges {\n  opacity: 1;\n}\n\nhtml body .image-list .thumb .r34g-badge {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 20px;\n  height: 20px;\n  padding: 0 5px;\n  border-radius: 6px;\n  background: rgba(0, 0, 0, .68);\n  border: 1px solid rgba(255, 255, 255, .14);\n  color: #f2f2f2;\n  font-size: 10px;\n  font-weight: bold;\n  letter-spacing: .3px;\n  line-height: 1;\n  backdrop-filter: blur(3px);\n}\n\nhtml body .image-list .thumb .r34g-badge.r34g-video {\n  color: #8fd0ff;\n  border-color: rgba(143, 208, 255, .4);\n}\n\nhtml body .image-list .thumb .r34g-badge.r34g-gif {\n  color: #ffd479;\n  border-color: rgba(255, 212, 121, .4);\n}\n\nhtml body .image-list .thumb .r34g-badge.r34g-sound {\n  color: #a9f0a9;\n  border-color: rgba(169, 240, 169, .4);\n}\n\nhtml[data-r34g-badges=\"off\"] .image-list .thumb .r34g-badges {\n  display: none !important;\n}\n\nhtml body .image-list .thumb .r34g-meta {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 2;\n  padding: 22px 8px 7px;\n  text-align: left;\n  font-size: 10px;\n  color: #d8d8d8;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, .9);\n  opacity: 0;\n  transform: translateY(4px);\n  transition: opacity .2s ease, transform .2s ease;\n  pointer-events: none;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n\nhtml body .image-list .thumb:hover .r34g-meta {\n  opacity: 1;\n  transform: none;\n}\n\nhtml body .image-list .thumb .r34g-meta .r34g-taglist {\n  display: block;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  color: #cfd8cf;\n}\n\nhtml body .image-list > .thumb.r34g-hidden-by-filter {\n  display: none !important;\n}\n\nhtml body .r34g-ad-hidden {\n  display: none !important;\n}\n\nhtml.r34g-drawer-open {\n  overflow: hidden;\n}\n\nhtml body .sidebar {\n  align-self: flex-start;\n  max-height: calc(100vh - 12px);\n  position: sticky;\n  top: 8px;\n  overflow-y: auto;\n  overflow-x: hidden;\n  padding: 0 10px 14px 0;\n  scrollbar-width: thin;\n  scrollbar-color: #4b564b rgba(0, 0, 0, .25);\n  z-index: 4;\n}\n\nhtml body #r34g-drawer-head {\n  display: none;\n  align-items: center;\n  gap: 8px;\n  margin: 0 0 8px;\n  padding-bottom: 7px;\n  border-bottom: 1px solid var(--r34g-line);\n}\n\nhtml body #r34g-drawer-head h5 {\n  flex: 1;\n  margin: 0 !important;\n  color: var(--r34g-link);\n  font-family: Tahoma, verdana, sans-serif;\n  font-size: 12.5px;\n  letter-spacing: .06em;\n  text-transform: uppercase;\n}\n\nhtml body #r34g-drawer-close {\n  width: 30px;\n  height: 30px;\n  padding: 0;\n  border: 1px solid var(--c-bg-highlight, #505a50);\n  border-radius: 7px;\n  background: #333d33;\n  color: var(--r34g-text) !important;\n  font-size: 16px;\n  line-height: 1;\n  cursor: pointer;\n}\n\nhtml body #r34g-drawer-close:hover {\n  border-color: var(--r34g-accent);\n  color: #eafaea !important;\n}\n\nhtml body .tag-search input[type=\"text\"],\nhtml body .tag-search input[type=\"search\"] {\n  width: 100% !important;\n  box-sizing: border-box !important;\n  padding: 4px 7px !important;\n  border: 1px solid var(--c-bg-highlight, #505a50) !important;\n  border-radius: 5px !important;\n  background: var(--r34g-bg-deep) !important;\n  color: var(--r34g-text) !important;\n  font-family: verdana, sans-serif !important;\n  font-size: 12px !important;\n  outline: none;\n}\n\nhtml body .tag-search input[type=\"text\"]:focus,\nhtml body .tag-search input[type=\"search\"]:focus {\n  border-color: var(--r34g-accent) !important;\n}\n\nhtml body .tag-search input[type=\"submit\"] {\n  margin-top: 5px;\n  padding: 4px 12px !important;\n  border: 1px solid var(--c-bg-highlight, #505a50) !important;\n  border-radius: 5px !important;\n  background: #333d33 !important;\n  color: var(--r34g-link) !important;\n  font-family: verdana, sans-serif !important;\n  font-size: 12px !important;\n  cursor: pointer;\n}\n\nhtml body .tag-search input[type=\"submit\"]:hover {\n  border-color: var(--r34g-accent) !important;\n  color: #eafaea !important;\n}\n\nhtml body .sidebar small {\n  display: block;\n  margin-top: 4px;\n  color: var(--r34g-text-soft);\n  font-size: 10.5px;\n}\n\nhtml[data-r34g-sticky=\"off\"] body .sidebar {\n  position: static;\n  max-height: none;\n  overflow: visible;\n}\n\nhtml body .sidebar::-webkit-scrollbar {\n  width: 9px;\n}\n\nhtml body .sidebar::-webkit-scrollbar-thumb {\n  background: #4b564b;\n  border-radius: 6px;\n}\n\nhtml body .sidebar::-webkit-scrollbar-track {\n  background: rgba(0, 0, 0, .2);\n}\n\nhtml body .tag-search h5,\nhtml body #r34g-sidebar-tags-title {\n  margin: 0 0 6px !important;\n  font-family: Tahoma, verdana, sans-serif;\n  font-size: 12px !important;\n  letter-spacing: .08em;\n  text-transform: uppercase;\n  color: var(--r34g-text-soft) !important;\n  border-bottom: 1px solid var(--r34g-line);\n  padding-bottom: 5px;\n}\n\nhtml body #r34g-tag-filter {\n  width: 100% !important;\n  box-sizing: border-box !important;\n  margin: 0 0 7px !important;\n  padding: 4px 6px !important;\n  background: var(--r34g-bg-deep) !important;\n  color: var(--r34g-text) !important;\n  border: 1px solid var(--c-bg-highlight, #505a50) !important;\n  border-radius: 4px !important;\n  font-family: verdana, sans-serif !important;\n  font-size: 11px !important;\n  outline: none;\n}\n\nhtml body #r34g-tag-filter:focus {\n  border-color: var(--r34g-accent) !important;\n}\n\nhtml body #r34g-tag-filter::placeholder {\n  color: #6f7a6f;\n}\n\nhtml[data-r34g-filter=\"off\"] body #r34g-tag-filter {\n  display: none !important;\n}\n\nhtml body .sidebar ul {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n\nhtml body .sidebar li {\n  padding: 1px 0 !important;\n  line-height: 1.45;\n}\n\nhtml body .sidebar li a {\n  font-size: 13px !important;\n  line-height: 1.5;\n  color: var(--c-link-metadata, #90d9ed);\n}\n\nhtml body .sidebar li a:hover {\n  text-decoration: underline;\n  color: #d9f4ff;\n}\n\nhtml body .sidebar li {\n  display: flex !important;\n  align-items: flex-start;\n  gap: 6px;\n  padding: 1px 2px !important;\n  line-height: 1.5;\n  border-radius: 4px;\n  transition: background .12s ease;\n}\n\nhtml body .sidebar li > a {\n  flex: 1 1 auto;\n  min-width: 0;\n  overflow-wrap: anywhere;\n}\n\nhtml body .sidebar .tag-count {\n  flex: 0 0 auto;\n  min-width: 46px;\n  text-align: right;\n  color: var(--r34g-text-soft) !important;\n  font-size: 10.5px !important;\n  line-height: 1.85;\n  padding-left: 6px;\n}\n\nhtml body .sidebar li > a[href^=\"https://rule34.xxx/\"],\nhtml body .sidebar li > a[href*=\"page=wiki\"] {\n  order: 3;\n  flex: 0 0 auto;\n  width: 0;\n  overflow: hidden;\n  opacity: 0;\n  padding-left: 3px;\n  color: var(--r34g-text-soft) !important;\n  font-size: 11px !important;\n  line-height: 1.9;\n  text-decoration: none;\n  transition: width .15s ease, opacity .15s ease;\n}\n\nhtml body .sidebar li:hover > a[href^=\"https://rule34.xxx/\"],\nhtml body .sidebar li:hover > a[href*=\"page=wiki\"] {\n  width: 13px;\n  opacity: 1;\n  text-align: center;\n}\n\nhtml body .sidebar li > a[href*=\"page=post\"] {\n  order: 1;\n}\n\nhtml body .sidebar li > .tag-count {\n  order: 2;\n}\n\nhtml body .sidebar li:hover {\n  background: rgba(255, 255, 255, .045);\n}\n\nhtml body .sidebar .tag-type-general a { color: var(--c-link-metadata, #90d9ed); }\nhtml body .sidebar .tag-type-artist a { color: var(--c-link-artist, #f0a0a0); }\nhtml body .sidebar .tag-type-character a { color: var(--c-link-character, #f0f0a0); }\nhtml body .sidebar .tag-type-copyright a { color: var(--c-link-copyright, #f0a0f0); }\n\nhtml body .sidebar .tag-count {\n  color: var(--r34g-text-soft) !important;\n  font-size: 10.5px !important;\n  padding-left: 3px;\n}\n\nhtml body .sidebar li.r34g-tag-hidden {\n  display: none !important;\n}\n\nhtml body #r34g-sidebar-section {\n  border-top: 1px solid var(--r34g-line);\n  margin-top: 10px;\n  padding-top: 9px;\n}\n\nhtml body #r34g-sidebar-toggle {\n  display: none;\n  position: fixed;\n  left: 12px;\n  bottom: 14px;\n  z-index: calc(var(--r34g-z) - 5);\n  align-items: center;\n  gap: 6px;\n  padding: 8px 12px;\n  border: 1px solid var(--c-bg-highlight, #505a50);\n  border-radius: 999px;\n  background: var(--r34g-bg-alt);\n  color: var(--r34g-link) !important;\n  font-family: verdana, sans-serif;\n  font-size: 12px;\n  cursor: pointer;\n  box-shadow: 0 6px 18px rgba(0, 0, 0, .5);\n}\n\nhtml body #r34g-sidebar-toggle:hover {\n  border-color: var(--r34g-accent);\n  color: #dff0df !important;\n}\n\nhtml body #r34g-drawer-backdrop {\n  display: none;\n  position: fixed;\n  inset: 0;\n  z-index: calc(var(--r34g-z) - 6);\n  background: rgba(0, 0, 0, .6);\n}\n\nhtml body #r34g-to-top {\n  position: fixed;\n  right: 12px;\n  bottom: 14px;\n  z-index: calc(var(--r34g-z) - 5);\n  width: 38px;\n  height: 38px;\n  padding: 0;\n  border: 1px solid var(--c-bg-highlight, #505a50);\n  border-radius: 50%;\n  background: var(--r34g-bg-alt);\n  color: var(--r34g-link) !important;\n  font-size: 15px;\n  cursor: pointer;\n  opacity: 0;\n  pointer-events: none;\n  transition: opacity .25s ease, border-color .2s ease;\n  box-shadow: 0 6px 18px rgba(0, 0, 0, .5);\n}\n\nhtml body #r34g-to-top.r34g-visible {\n  opacity: .92;\n  pointer-events: auto;\n}\n\nhtml body #r34g-to-top:hover {\n  border-color: var(--r34g-accent);\n}\n\nhtml body #paginator {\n  margin-top: 14px !important;\n}\n\nhtml body #paginator .pagination {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: center;\n  gap: 4px;\n  row-gap: 6px;\n  padding: 7px 8px;\n  background: var(--r34g-bg-alt);\n  border: 1px solid var(--r34g-line);\n  border-radius: var(--r34g-radius);\n}\n\nhtml body #paginator #manualpage {\n  display: inline-flex !important;\n  align-items: center;\n  gap: 4px;\n  margin-left: 6px;\n  padding-left: 8px;\n  border-left: 1px solid var(--r34g-line);\n}\n\nhtml body #paginator #manualpage input[type=\"text\"] {\n  width: 62px !important;\n  height: 28px;\n  box-sizing: border-box;\n  padding: 0 7px !important;\n  border: 1px solid var(--c-bg-highlight, #505a50) !important;\n  border-radius: 6px !important;\n  background: var(--r34g-bg-deep) !important;\n  color: var(--r34g-text) !important;\n  font-family: verdana, sans-serif !important;\n  font-size: 12px !important;\n  outline: none;\n}\n\nhtml body #paginator #manualpage input[type=\"text\"]:focus {\n  border-color: var(--r34g-accent) !important;\n}\n\nhtml body #paginator #manualpage input[type=\"text\"]::placeholder {\n  color: #6f7a6f;\n}\n\nhtml body #paginator #manualpage input[type=\"submit\"] {\n  height: 28px;\n  padding: 0 10px !important;\n  border: 1px solid var(--c-bg-highlight, #505a50) !important;\n  border-radius: 6px !important;\n  background: #333d33;\n  color: var(--r34g-link) !important;\n  font-family: verdana, sans-serif !important;\n  font-size: 12px !important;\n  cursor: pointer;\n}\n\nhtml body #paginator #manualpage input[type=\"submit\"]:hover {\n  border-color: var(--r34g-accent) !important;\n  color: #eafaea !important;\n}\n\nhtml body #paginator .pagination a,\nhtml body #paginator .pagination b,\nhtml body #paginator .pagination span {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 30px;\n  height: 28px;\n  padding: 0 9px !important;\n  border: 1px solid transparent;\n  border-radius: 6px;\n  color: var(--r34g-link) !important;\n  font-size: 12.5px !important;\n  line-height: 1 !important;\n  transition: background .15s ease, color .15s ease, border-color .15s ease, transform .15s ease;\n}\n\nhtml body #paginator .pagination a:hover {\n  background: var(--c-bg-highlight, #505a50);\n  border-color: rgba(147, 179, 147, .55);\n  color: #eafaea !important;\n  transform: translateY(-1px);\n}\n\nhtml body #paginator .pagination b {\n  background: var(--r34g-accent);\n  border-color: rgba(255, 255, 255, .25);\n  color: var(--r34g-bg) !important;\n  font-weight: bold;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, .35);\n}\n\nhtml body #paginator .pagination a.arrow,\nhtml body #paginator .pagination a[alt] {\n  color: var(--r34g-text-soft) !important;\n}\n\nhtml body #paginator .pagination a.arrow:hover,\nhtml body #paginator .pagination a[alt]:hover {\n  color: #eafaea !important;\n}\n\nhtml body .image-list + br,\nhtml body #post-list > br {\n  display: none;\n}\n\nhtml body #r34g-modal {\n  position: fixed;\n  inset: 0;\n  z-index: var(--r34g-z);\n  display: none;\n  align-items: center;\n  justify-content: center;\n  padding: 24px 16px;\n  background: rgba(0, 0, 0, .66);\n  backdrop-filter: blur(2px);\n  font-family: verdana, sans-serif;\n  text-align: left;\n  color-scheme: dark;\n}\n\nhtml body #r34g-modal.r34g-open {\n  display: flex;\n}\n\nhtml body #r34g-modal .r34g-dialog {\n  display: flex;\n  flex-direction: column;\n  width: min(880px, 100%);\n  max-height: min(84vh, 780px);\n  background: var(--r34g-bg-alt);\n  border: 1px solid var(--c-bg-highlight, #505a50);\n  border-radius: 10px;\n  box-shadow: var(--r34g-shadow);\n  color: var(--r34g-text);\n  font-size: 12.8px;\n  overflow: hidden;\n}\n\nhtml body #r34g-modal .r34g-head {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  padding: 10px 14px 0;\n  border-bottom: 1px solid var(--r34g-line);\n  background: linear-gradient(#2d362d, var(--r34g-bg-alt));\n}\n\nhtml body #r34g-modal .r34g-title {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding-bottom: 9px;\n  color: var(--r34g-link);\n  font-family: Tahoma, verdana, sans-serif;\n  font-size: 13px;\n  font-weight: bold;\n  letter-spacing: .06em;\n  text-transform: uppercase;\n  white-space: nowrap;\n}\n\nhtml body #r34g-modal .r34g-tabs {\n  display: flex;\n  align-items: flex-end;\n  gap: 4px;\n  flex: 1;\n  overflow-x: auto;\n  scrollbar-width: none;\n}\n\nhtml body #r34g-modal .r34g-tabs::-webkit-scrollbar {\n  display: none;\n}\n\nhtml body #r34g-modal .r34g-tab {\n  padding: 7px 13px;\n  border: 1px solid transparent;\n  border-bottom: 0;\n  border-radius: 7px 7px 0 0;\n  background: transparent;\n  color: var(--r34g-link) !important;\n  font-family: verdana, sans-serif;\n  font-size: 12px;\n  white-space: nowrap;\n  cursor: pointer;\n  position: relative;\n  bottom: -1px;\n}\n\nhtml body #r34g-modal .r34g-tab:hover {\n  background: rgba(255, 255, 255, .045);\n  color: #dff0df !important;\n}\n\nhtml body #r34g-modal .r34g-tab.r34g-tab-active {\n  background: var(--r34g-bg);\n  border-color: var(--r34g-line);\n  border-bottom: 1px solid var(--r34g-bg);\n  color: #ffffff !important;\n}\n\nhtml body #r34g-modal .r34g-tab-short {\n  display: none;\n}\n\nhtml body #r34g-modal .r34g-close {\n  width: 30px;\n  height: 30px;\n  margin-bottom: 8px;\n  padding: 0;\n  border: 1px solid transparent;\n  border-radius: 6px;\n  background: transparent;\n  color: var(--r34g-text-soft) !important;\n  font-size: 17px;\n  line-height: 1;\n  cursor: pointer;\n}\n\nhtml body #r34g-modal .r34g-close:hover {\n  background: rgba(217, 83, 79, .16);\n  border-color: rgba(217, 83, 79, .5);\n  color: #ff9a96 !important;\n}\n\nhtml body #r34g-modal .r34g-body {\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  padding: 14px 16px;\n  background: var(--r34g-bg);\n  scrollbar-width: thin;\n  scrollbar-color: #4b564b rgba(0, 0, 0, .25);\n}\n\nhtml body #r34g-modal .r34g-body::-webkit-scrollbar {\n  width: 10px;\n}\n\nhtml body #r34g-modal .r34g-body::-webkit-scrollbar-thumb {\n  background: #4b564b;\n  border-radius: 6px;\n}\n\nhtml body #r34g-modal .r34g-panel {\n  display: none;\n}\n\nhtml body #r34g-modal .r34g-panel.r34g-panel-active {\n  display: block;\n}\n\nhtml body #r34g-modal .r34g-foot {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 14px;\n  border-top: 1px solid var(--r34g-line);\n  background: var(--r34g-bg-alt);\n}\n\nhtml body #r34g-modal .r34g-foot .r34g-spacer {\n  flex: 1;\n}\n\nhtml body #r34g-modal .r34g-foot button,\nhtml body #r34g-modal .r34g-btn {\n  padding: 6px 14px;\n  border: 1px solid var(--c-bg-highlight, #505a50);\n  border-radius: 6px;\n  background: #333d33;\n  color: var(--r34g-text) !important;\n  font-family: verdana, sans-serif;\n  font-size: 12px;\n  cursor: pointer;\n  transition: background .15s ease, border-color .15s ease, color .15s ease;\n}\n\nhtml body #r34g-modal .r34g-foot button:hover,\nhtml body #r34g-modal .r34g-btn:hover {\n  border-color: var(--r34g-accent);\n  color: #eafaea !important;\n}\n\nhtml body #r34g-modal #ibenhancerSettingsSave {\n  background: var(--r34g-accent);\n  border-color: var(--r34g-accent);\n  color: var(--r34g-bg) !important;\n  font-weight: bold;\n}\n\nhtml body #r34g-modal #ibenhancerSettingsSave:hover {\n  background: var(--c-link, #b0e0b0);\n  color: #22301f !important;\n}\n\nhtml body #r34g-modal .r34g-section {\n  margin: 0 0 16px;\n}\n\nhtml body #r34g-modal .r34g-section > h6 {\n  margin: 0 0 4px;\n  padding-bottom: 5px;\n  border-bottom: 1px solid var(--r34g-line);\n  color: var(--r34g-link);\n  font-family: Tahoma, verdana, sans-serif;\n  font-size: 11.5px;\n  font-weight: bold;\n  letter-spacing: .09em;\n  text-transform: uppercase;\n}\n\nhtml body #r34g-modal .r34g-hint {\n  margin: 2px 0 8px;\n  color: var(--r34g-text-soft);\n  font-size: 11px;\n  line-height: 1.5;\n}\n\nhtml body #r34g-modal .r34g-row {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  min-height: 30px;\n  padding: 3px 2px;\n  border-bottom: 1px dashed rgba(255, 255, 255, .055);\n}\n\nhtml body #r34g-modal .r34g-row:last-child {\n  border-bottom: 0;\n}\n\nhtml body #r34g-modal .r34g-row > .r34g-label {\n  flex: 1;\n  min-width: 0;\n  line-height: 1.45;\n  color: var(--r34g-text);\n}\n\nhtml body #r34g-modal .r34g-row > .r34g-value {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  flex: 0 0 auto;\n}\n\nhtml body #r34g-modal .r34g-row > .r34g-value label {\n  display: inline-flex !important;\n  align-items: center;\n  gap: 6px;\n}\n\nhtml.r34g-modal-open {\n  overflow: hidden !important;\n}\n\nhtml body #r34g-modal .r34g-row .r34g-note {\n  display: block;\n  color: var(--r34g-text-soft);\n  font-size: 10.5px;\n}\n\nhtml body #r34g-modal .r34g-seg {\n  display: inline-flex;\n  gap: 3px;\n  padding: 2px;\n  border: 1px solid var(--r34g-line);\n  border-radius: 7px;\n  background: var(--r34g-bg-deep);\n}\n\nhtml body #r34g-modal .r34g-seg button {\n  padding: 4px 10px;\n  border: 0;\n  border-radius: 5px;\n  background: transparent;\n  color: var(--r34g-text-soft) !important;\n  font-family: verdana, sans-serif;\n  font-size: 11.5px;\n  cursor: pointer;\n}\n\nhtml body #r34g-modal .r34g-seg button:hover {\n  color: #eafaea !important;\n}\n\nhtml body #r34g-modal .r34g-seg button.r34g-on {\n  background: var(--r34g-accent);\n  color: #22301f !important;\n  font-weight: bold;\n}\n\nhtml body .r34g-switch {\n  position: relative;\n  display: inline-block;\n  flex: 0 0 auto;\n  width: 40px;\n  height: 20px;\n  vertical-align: middle;\n}\n\nhtml body .r34g-switch > input {\n  position: absolute;\n  inset: 0;\n  width: 100% !important;\n  height: 100% !important;\n  margin: 0 !important;\n  opacity: 0 !important;\n  cursor: pointer;\n  z-index: 2;\n}\n\nhtml body .r34g-switch > .r34g-slider {\n  position: absolute;\n  inset: 0;\n  border: 1px solid var(--r34g-line);\n  border-radius: 999px;\n  background: #3b453b;\n  transition: background .2s ease, border-color .2s ease;\n}\n\nhtml body .r34g-switch > .r34g-slider::before {\n  content: \"\";\n  position: absolute;\n  top: 2px;\n  left: 2px;\n  width: 14px;\n  height: 14px;\n  border-radius: 50%;\n  background: #c9cfc9;\n  transition: transform .2s ease, background .2s ease;\n}\n\nhtml body .r34g-switch > input:checked + .r34g-slider {\n  background: var(--r34g-accent);\n  border-color: var(--r34g-accent);\n}\n\nhtml body .r34g-switch > input:checked + .r34g-slider::before {\n  transform: translateX(20px);\n  background: #f4fff4;\n}\n\nhtml body .r34g-switch > input:focus-visible + .r34g-slider {\n  box-shadow: 0 0 0 2px rgba(147, 179, 147, .45);\n}\n\nhtml body #r34g-modal #ibenhancerSettings-options {\n  overflow: visible !important;\n  width: auto !important;\n  height: auto !important;\n}\n\nhtml body #r34g-modal #ibenhancerSettings-options > .r34g-moved,\nhtml body #r34g-modal #ibenhancerSettings-options > br {\n  display: none !important;\n}\n\nhtml body #r34g-modal #ibenhancerSettings-options label {\n  white-space: normal !important;\n  display: flex !important;\n  align-items: center;\n  gap: 10px;\n  width: 100%;\n  line-height: 1.45;\n}\n\nhtml body #r34g-modal #ibenhancerSettings input[type=\"checkbox\"] {\n  flex: 0 0 auto;\n  margin: 0 !important;\n  width: auto !important;\n}\n\nhtml body #r34g-modal #ibenhancerSettings input[type=\"number\"],\nhtml body #r34g-modal #ibenhancerSettings select {\n  margin: 0 !important;\n  padding: 3px 5px !important;\n  border: 1px solid var(--c-bg-highlight, #505a50) !important;\n  border-radius: 5px !important;\n  background: var(--r34g-bg-deep) !important;\n  color: var(--r34g-text) !important;\n  font-family: verdana, sans-serif !important;\n  font-size: 11.5px !important;\n}\n\nhtml body #r34g-modal #ibenhancerSettings button {\n  padding: 4px 9px !important;\n  margin: 0 !important;\n  border: 1px solid var(--c-bg-highlight, #505a50) !important;\n  border-radius: 5px !important;\n  background: #333d33 !important;\n  color: var(--r34g-text) !important;\n  font-family: verdana, sans-serif !important;\n  font-size: 11.5px !important;\n  cursor: pointer;\n}\n\nhtml body #r34g-modal #ibenhancerSettings button:hover {\n  border-color: var(--r34g-accent) !important;\n  color: #eafaea !important;\n}\n\nhtml body #r34g-modal #ibenhancerSettings .tooltip-140 {\n  position: relative;\n}\n\nhtml body #r34g-modal #r34g-icon-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(168px, 1fr));\n  gap: 1px 14px;\n  margin-top: 6px;\n  padding: 8px 10px;\n  border: 1px solid var(--r34g-line);\n  border-radius: 7px;\n  background: rgba(0, 0, 0, .16);\n}\n\nhtml body #r34g-modal #r34g-icon-grid label {\n  display: flex !important;\n  align-items: center;\n  gap: 8px;\n  padding: 1px 0;\n  font-size: 11.5px !important;\n}\n\nhtml body #r34g-modal #r34g-icon-grid .r34g-icon-text {\n  flex: 1;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\nhtml body #r34g-modal #r34g-icon-grid .r34g-switch {\n  width: 34px;\n  height: 17px;\n}\n\nhtml body #r34g-modal #r34g-icon-grid .r34g-switch > .r34g-slider::before {\n  width: 11px;\n  height: 11px;\n}\n\nhtml body #r34g-modal #r34g-icon-grid .r34g-switch > input:checked + .r34g-slider::before {\n  transform: translateX(17px);\n}\n\nhtml body #r34g-modal #r34g-actions-row {\n  gap: 6px;\n}\n\nhtml body #r34g-modal #ibenhancer-favorite-tags,\nhtml body #r34g-modal #ibenhancer-changelog {\n  background: transparent !important;\n  border: 0 !important;\n  padding: 0 !important;\n  width: auto !important;\n  color: var(--r34g-text) !important;\n  font-family: verdana, sans-serif !important;\n  font-size: 12.8px !important;\n}\n\nhtml body #r34g-modal #ibenhancer-favorite-tags *,\nhtml body #r34g-modal #ibenhancer-changelog * {\n  color: var(--r34g-text) !important;\n  font-size: 12px !important;\n}\n\nhtml body #r34g-modal #ibenhancer-changelog-updates > div,\nhtml body #r34g-modal #ibenhancer-changelog > div {\n  border-bottom: 1px dashed rgba(255, 255, 255, .07);\n  padding: 5px 0;\n  line-height: 1.5;\n}\n\nhtml body #r34g-modal #ibenhancer-changelog > div:first-child,\nhtml body #r34g-modal #ibenhancer-changelog > a {\n  color: var(--r34g-link) !important;\n  font-weight: bold;\n}\n\nhtml body #r34g-sidebar-favs {\n  margin-top: 10px;\n  padding-top: 9px;\n  border-top: 1px solid var(--r34g-line);\n}\n\nhtml body #ibenhancer {\n  display: block;\n}\n\nhtml.r34g-integrated body #ibenhancer {\n  display: none !important;\n}\n\nhtml body #ibenhancerSettings-blocker {\n  display: none !important;\n}\n\nhtml.r34g-integrated body #ibenhancerSettings.show {\n  display: none !important;\n}\n\n@media (max-width: 900px) {\n  html body #r34g-sidebar-toggle {\n    display: inline-flex;\n  }\n\n  html body #r34g-drawer-head {\n    display: flex;\n  }\n\n  html {\n    --r34g-gap: 10px;\n  }\n\n  html body .sidebar {\n    position: fixed !important;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    width: min(320px, 88vw) !important;\n    min-width: 0 !important;\n    max-width: none !important;\n    max-height: none !important;\n    padding: 12px 12px 24px;\n    background: var(--r34g-bg-alt);\n    border-right: 1px solid var(--c-bg-highlight, #505a50);\n    box-shadow: 12px 0 32px rgba(0, 0, 0, .5);\n    transform: translateX(-102%);\n    transition: transform .24s ease;\n    z-index: calc(var(--r34g-z) - 4);\n    overflow-y: auto;\n  }\n\n  html.r34g-drawer-open body .sidebar {\n    transform: none;\n  }\n\n  html.r34g-drawer-open body #r34g-drawer-backdrop {\n    display: block;\n  }\n\n  html body #post-list > .content {\n    flex: 1 1 100% !important;\n    margin: 0 !important;\n  }\n}\n\n@media (max-width: 620px) {\n  html body #r34g-modal .r34g-head {\n    flex-wrap: wrap;\n    gap: 6px 10px;\n    padding: 9px 12px 0;\n  }\n\n  html body #r34g-modal .r34g-title {\n    padding-bottom: 0;\n  }\n\n  html body #r34g-modal .r34g-tabs {\n    order: 3;\n    flex: 1 1 100%;\n    flex-wrap: wrap;\n    overflow-x: visible;\n    gap: 4px 6px;\n    padding-bottom: 0;\n  }\n\n  html body #r34g-modal .r34g-tab {\n    padding: 6px 10px;\n    font-size: 11.5px;\n  }\n\n  html body #r34g-modal .r34g-tab-long {\n    display: none;\n  }\n\n  html body #r34g-modal .r34g-tab-short {\n    display: inline;\n  }\n\n  html body #r34g-modal .r34g-close {\n    margin-left: auto;\n    margin-bottom: 0;\n  }\n\n  html body #r34g-modal .r34g-body {\n    padding: 12px 12px;\n  }\n\n  html body #r34g-modal .r34g-row {\n    flex-wrap: wrap;\n    row-gap: 4px;\n    padding: 5px 2px;\n  }\n\n  html body #r34g-modal .r34g-row > .r34g-seg {\n    flex: 1 1 100%;\n    justify-content: space-between;\n  }\n\n  html body #r34g-modal .r34g-foot {\n    flex-wrap: wrap;\n    gap: 6px;\n  }\n\n  html body #r34g-modal .r34g-foot #r34g-reset {\n    flex: 1 1 100%;\n    text-align: center;\n  }\n\n  html body #r34g-modal .r34g-foot .r34g-spacer {\n    display: none;\n  }\n\n  html body #r34g-modal #r34g-icon-grid {\n    grid-template-columns: 1fr;\n  }\n\n  html body #r34g-modal .r34g-dialog {\n    max-height: 90vh;\n  }\n  html {\n    --r34g-gap: 8px;\n    --r34g-radius: 6px;\n  }\n\n  html[data-r34g-cols] {\n    --r34g-cols: 3;\n  }\n\n  html body #post-list {\n    padding: 0 8px !important;\n  }\n\n  html body #paginator .pagination {\n    gap: 3px;\n    padding: 6px;\n  }\n\n  html body #paginator .pagination a,\n  html body #paginator .pagination b,\n  html body #paginator .pagination span {\n    min-width: 24px;\n    height: 24px;\n    padding: 0 6px !important;\n  }\n\n  html body #r34g-modal .r34g-dialog {\n    max-height: 90vh;\n  }\n\n  html body #r34g-modal .r34g-title span.r34g-title-text {\n    display: none;\n  }\n}\n\nhtml body .image-list .thumb .r34g-seen-badge {\n  position: absolute;\n  top: 7px;\n  right: 7px;\n  z-index: 4;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 24px;\n  height: 24px;\n  border-radius: 50%;\n  background: rgba(6, 12, 6, .74);\n  border: 1px solid rgba(147, 179, 147, .55);\n  color: #d9f4d9;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, .5);\n}\n\nhtml body .image-list .thumb .r34g-seen-badge svg {\n  width: 15px;\n  height: 15px;\n}\n\nhtml body .image-list .thumb.r34g-seen > a::before {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n  pointer-events: none;\n  box-shadow: inset 0 0 0 2px rgba(147, 179, 147, .5);\n  border-radius: var(--r34g-radius);\n}\n\nhtml[data-r34g-seen=\"off\"] body .image-list .thumb .r34g-seen-badge {\n  display: none !important;\n}\n\nhtml[data-r34g-seendim=\"on\"] body .image-list .thumb.r34g-seen img {\n  filter: grayscale(.5) brightness(.6) !important;\n}\n\nhtml[data-r34g-seendim=\"on\"] body .image-list .thumb.r34g-seen:hover img {\n  filter: grayscale(.15) brightness(.92) !important;\n}\n\nhtml body #r34g-toasts {\n  position: fixed;\n  left: 50%;\n  bottom: 22px;\n  transform: translateX(-50%);\n  z-index: 2147482100;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  align-items: center;\n  pointer-events: none;\n}\n\nhtml body .r34g-toast {\n  max-width: 460px;\n  padding: 8px 14px;\n  border: 1px solid var(--c-bg-highlight, #505a50);\n  border-radius: 7px;\n  background: rgba(24, 32, 24, .96);\n  color: #d8e6d8;\n  font: 12px/1.45 verdana, sans-serif;\n  box-shadow: 0 10px 30px rgba(0, 0, 0, .6);\n  transition: opacity .28s ease, transform .28s ease;\n}\n\nhtml body .r34g-toast.r34g-toast-out {\n  opacity: 0;\n  transform: translateY(6px);\n}\n\nhtml body .r34g-search {\n  margin: 0 0 12px;\n}\n\nhtml body .r34g-search input {\n  width: 100%;\n  box-sizing: border-box;\n  padding: 6px 9px;\n  border: 1px solid var(--r34g-line);\n  border-radius: 6px;\n  background: var(--r34g-bg-deep);\n  color: var(--r34g-text);\n  font: 12px verdana, sans-serif;\n  outline: none;\n}\n\nhtml body .r34g-search input:focus {\n  border-color: var(--r34g-accent);\n}\n\nhtml body #r34g-modal .r34g-mini,\nhtml body #r34g-tags-panel .r34g-mini {\n  padding: 4px 10px;\n  border: 1px solid var(--r34g-line);\n  border-radius: 6px;\n  background: #333d33;\n  color: var(--r34g-link) !important;\n  font: 11.5px verdana, sans-serif;\n  cursor: pointer;\n}\n\nhtml body #r34g-modal .r34g-mini:hover,\nhtml body #r34g-tags-panel .r34g-mini:hover {\n  border-color: var(--r34g-accent);\n  color: #eafaea !important;\n}\n\nhtml body .r34g-mini-row {\n  display: inline-flex;\n  gap: 6px;\n  flex-wrap: wrap;\n  align-items: center;\n}\n\nhtml body #r34g-modal .r34g-num,\nhtml body #r34g-modal .r34g-text,\nhtml body #r34g-modal .r34g-select,\nhtml body #r34g-modal .r34g-textarea {\n  box-sizing: border-box;\n  padding: 3px 6px;\n  border: 1px solid var(--r34g-line);\n  border-radius: 5px;\n  background: var(--r34g-bg-deep);\n  color: var(--r34g-text);\n  font: 11.5px verdana, sans-serif;\n  outline: none;\n}\n\nhtml body #r34g-modal .r34g-num:focus,\nhtml body #r34g-modal .r34g-text:focus,\nhtml body #r34g-modal .r34g-select:focus,\nhtml body #r34g-modal .r34g-textarea:focus {\n  border-color: var(--r34g-accent);\n}\n\nhtml body #r34g-modal .r34g-text {\n  width: 100%;\n  min-width: 180px;\n}\n\nhtml body #r34g-modal .r34g-textarea {\n  width: 100%;\n  min-height: 66px;\n  resize: vertical;\n  line-height: 1.45;\n}\n\nhtml body #r34g-modal .r34g-mono {\n  font-family: monospace, monospace;\n}\n\nhtml body #r34g-modal .r34g-value-wide {\n  flex: 0 1 56%;\n  max-width: 56%;\n}\n\nhtml body #r34g-modal .r34g-stack {\n  display: block;\n}\n\nhtml body #r34g-modal .r34g-row.r34g-filtered-out,\nhtml body #r34g-modal #r34g-icon-grid label.r34g-filtered-out,\nhtml body #r34g-modal .r34g-section.r34g-filtered-out {\n  display: none !important;\n}\n\nhtml body #r34g-modal .r34g-section.r34g-collapsed {\n  display: none !important;\n}\n\nhtml body #r34g-modal .r34g-enh-sticky {\n  position: sticky;\n  top: -14px;\n  z-index: 3;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n  margin: -14px -16px 14px;\n  padding: 10px 16px;\n  background: var(--r34g-bg-alt);\n  border-bottom: 1px solid var(--r34g-line);\n}\n\nhtml body #r34g-modal .r34g-enh-sticky .r34g-note {\n  flex: 1 1 220px;\n}\n\nhtml body #r34g-modal .r34g-notes {\n  margin: 4px 0 0;\n  padding-left: 18px;\n  color: var(--r34g-text);\n  font-size: 12px;\n  line-height: 1.6;\n}\n\nhtml body #r34g-modal .r34g-notes li {\n  margin-bottom: 3px;\n}\n\nhtml body #r34g-modal .r34g-panel-actions {\n  display: inline-flex;\n  gap: 6px;\n  align-items: center;\n}\n\nhtml body .r34g-vhost {\n  flex: 1 1 auto !important;\n  width: auto !important;\n  min-width: 0 !important;\n  max-width: none !important;\n}\n\nhtml body #gelcomVideoContainer,\nhtml body .r34g-vwrap {\n  position: relative !important;\n  width: 100% !important;\n  max-width: var(--r34g-vwidth) !important;\n  margin: 0 auto !important;\n  background: #000;\n  overflow: hidden;\n}\n\nhtml[data-r34g-vbg=\"ninguno\"] body #gelcomVideoContainer,\nhtml[data-r34g-vbg=\"ninguno\"] body .r34g-vwrap {\n  background: transparent;\n}\n\nhtml[data-r34g-vradius=\"on\"] body #gelcomVideoContainer,\nhtml[data-r34g-vradius=\"on\"] body .r34g-vwrap {\n  border-radius: 10px;\n}\n\nhtml[data-r34g-vshadow=\"on\"] body #gelcomVideoContainer,\nhtml[data-r34g-vshadow=\"on\"] body .r34g-vwrap {\n  box-shadow: 0 14px 40px rgba(0, 0, 0, .55);\n}\n\nhtml[data-r34g-vcinema=\"on\"] body::before {\n  content: \"\";\n  position: fixed;\n  inset: 0;\n  z-index: 60;\n  background: rgba(0, 0, 0, .84);\n}\n\nhtml[data-r34g-vcinema=\"on\"] body #gelcomVideoContainer,\nhtml[data-r34g-vcinema=\"on\"] body .r34g-vwrap {\n  z-index: 61 !important;\n}\n\nhtml body .r34g-vwrap .r34g-vbackdrop {\n  position: absolute;\n  inset: -30px;\n  z-index: 0;\n  background-size: cover;\n  background-position: center;\n  filter: blur(26px) brightness(.45) saturate(1.25);\n  opacity: .9;\n  pointer-events: none;\n}\n\nhtml body .r34g-vwrap video,\nhtml body #gelcomVideoPlayer {\n  position: relative;\n  z-index: 1;\n  display: block !important;\n  width: 100% !important;\n  height: auto !important;\n  max-height: 84vh !important;\n  margin: 0 auto !important;\n  background: #000;\n  object-fit: contain;\n}\n\nhtml[data-r34g-vfit=\"cover\"] body .r34g-vwrap video {\n  object-fit: cover !important;\n}\n\nhtml[data-r34g-vfit=\"contain\"] body .r34g-vwrap video {\n  object-fit: contain !important;\n}\n\nhtml body .r34g-vbar {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 6;\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n  padding: 26px 10px 7px;\n  background: linear-gradient(to top, rgba(0, 0, 0, .88) 0%, rgba(0, 0, 0, .5) 55%, rgba(0, 0, 0, 0) 100%);\n  color: #ececec;\n  font-family: verdana, sans-serif;\n  transition: opacity .25s ease;\n}\n\nhtml body .r34g-vbar.r34g-idle {\n  opacity: 0;\n}\n\nhtml body .r34g-vbar:hover {\n  opacity: 1 !important;\n}\n\nhtml body .r34g-vbar-top {\n  display: flex;\n  align-items: center;\n}\n\nhtml body .r34g-vbar input[type=\"range\"] {\n  width: 100%;\n  height: 16px;\n  margin: 0;\n  padding: 0;\n  accent-color: var(--r34g-accent);\n  cursor: pointer;\n  background: transparent;\n}\n\nhtml body .r34g-vbar .r34g-vvolume {\n  width: 74px;\n}\n\nhtml body .r34g-vbar-bottom {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n\nhtml body .r34g-vbar .r34g-vgrow {\n  flex: 1;\n}\n\nhtml body .r34g-vbar-main {\n  display: flex;\n  align-items: center;\n  gap: 3px;\n}\n\nhtml body .r34g-vbar .r34g-vbtn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 28px;\n  height: 28px;\n  padding: 0;\n  border: 1px solid transparent;\n  border-radius: 6px;\n  background: transparent;\n  color: #e4e4e4 !important;\n  font: bold 11.5px/1 verdana, sans-serif;\n  cursor: pointer;\n  transition: background .15s ease, border-color .15s ease, color .15s ease;\n}\n\nhtml body .r34g-vbar .r34g-vbtn svg {\n  width: 16px;\n  height: 16px;\n}\n\nhtml body .r34g-vbar .r34g-vbtn:hover {\n  background: rgba(255, 255, 255, .12);\n  border-color: rgba(147, 179, 147, .55);\n  color: #fff !important;\n}\n\nhtml body .r34g-vbar .r34g-vbtn.r34g-on {\n  color: var(--r34g-accent) !important;\n  border-color: rgba(147, 179, 147, .55);\n}\n\nhtml body .r34g-vbar .r34g-vspeed {\n  width: auto;\n  min-width: 42px;\n  padding: 0 7px;\n}\n\nhtml body .r34g-vbar .r34g-vtime {\n  font-size: 11.5px;\n  line-height: 1;\n  min-width: 96px;\n  color: #dcdcdc;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, .8);\n}\n\nhtml body .r34g-vbar .r34g-vvol {\n  display: flex;\n  align-items: center;\n  gap: 2px;\n}\n\nhtml.r34g-vbar-on .fluid_controls_container,\nhtml.r34g-vbar-on .fluid_video_wrapper > .fluid_controls_container,\nhtml.r34g-vbar-on .fluid_control_video,\nhtml.r34g-vbar-on .video-js .vjs-control-bar {\n  display: none !important;\n}\n\nhtml.r34g-vbar-on .fluid_video_wrapper .fluid_control_play_button,\nhtml.r34g-vbar-on .fluid_video_wrapper .fluid_control_duration,\nhtml.r34g-vbar-on .fluid_video_wrapper .fluid_control_theatre,\nhtml.r34g-vbar-on .fluid_video_wrapper .fluid_control_playback_rate,\nhtml.r34g-vbar-on .fluid_video_wrapper .fluid_control_fullscreen,\nhtml.r34g-vbar-on .fluid_video_wrapper .fluid_control_video_volume,\nhtml.r34g-vbar-on .fluid_video_wrapper .fluid_control_download,\nhtml.r34g-vbar-on .fluid_video_wrapper .fluid_control_card,\nhtml.r34g-vbar-on .fluid_video_wrapper .fluid_control_vast_skip {\n  display: none !important;\n}\n\nhtml body #r34g-tags-panel {\n  box-sizing: border-box;\n  max-width: var(--r34g-vwidth);\n  margin: 14px auto;\n  padding: 10px 12px;\n  background: var(--r34g-bg-alt);\n  border: 1px solid var(--r34g-line);\n  border-radius: 10px;\n  color: var(--r34g-text);\n  font-family: verdana, sans-serif;\n  font-size: 12px;\n  text-align: left;\n}\n\nhtml body #r34g-tags-panel .r34g-tp-launch {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n\nhtml body #r34g-tags-panel .r34g-tp-toggle {\n  flex: 1 1 220px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 8px;\n  padding: 2px 0;\n  border: 0;\n  background: transparent;\n  color: var(--r34g-link) !important;\n  font: bold 13px verdana, sans-serif;\n  cursor: pointer;\n}\n\nhtml body #r34g-tags-panel .r34g-tp-toggle svg {\n  width: 16px;\n  height: 16px;\n}\n\nhtml body #r34g-tags-panel .r34g-tp-head {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  flex-wrap: wrap;\n  margin: 8px 0;\n  padding-bottom: 7px;\n  border-bottom: 1px solid var(--r34g-line);\n}\n\nhtml body #r34g-tags-panel .r34g-tp-head b {\n  color: var(--r34g-link);\n  font-family: Tahoma, verdana, sans-serif;\n  font-size: 12px;\n  letter-spacing: .06em;\n  text-transform: uppercase;\n}\n\nhtml body #r34g-tags-panel .r34g-tp-count {\n  flex: 1;\n}\n\nhtml body #r34g-tags-panel .r34g-tp-group {\n  margin-bottom: 9px;\n}\n\nhtml body #r34g-tags-panel .r34g-tp-group-head {\n  display: flex;\n  align-items: baseline;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n\nhtml body #r34g-tags-panel .r34g-tp-group-head b {\n  color: #dff0df;\n  font-size: 12px;\n}\n\nhtml body #r34g-tags-panel .r34g-chips {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 5px;\n  margin-top: 5px;\n  min-width: 0;\n}\n\nhtml body .r34g-chip {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  max-width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n  padding: 3px 9px;\n  border: 1px solid var(--r34g-line);\n  border-radius: 999px;\n  background: var(--r34g-bg-deep);\n  color: var(--r34g-text) !important;\n  font: 11.5px/1.4 verdana, sans-serif;\n  cursor: pointer;\n  transition: border-color .15s ease, opacity .15s ease, background .15s ease;\n}\n\nhtml body .r34g-chip .r34g-chip-name {\n  overflow-wrap: anywhere;\n}\n\nhtml body .r34g-chip:hover {\n  border-color: var(--r34g-accent);\n  background: #364236;\n}\n\nhtml body .r34g-chip.r34g-chip-off {\n  opacity: .66;\n  border-color: rgba(217, 83, 79, .55);\n}\n\nhtml body .r34g-chip.r34g-chip-off .r34g-chip-name {\n  text-decoration: line-through;\n  color: #ffb3ae;\n}\n\nhtml body .r34g-chip .r34g-chip-count {\n  color: var(--r34g-text-soft);\n  font-size: 9.5px;\n}\n\nhtml body #r34g-tags-panel .r34g-tp-outputwrap {\n  margin: 10px 0 0;\n}\n\nhtml body #r34g-tags-panel .r34g-tp-output {\n  width: 100%;\n  box-sizing: border-box;\n  min-height: 58px;\n  padding: 7px 9px;\n  border: 1px solid var(--r34g-line);\n  border-radius: 6px;\n  background: var(--r34g-bg-deep);\n  color: #cfe8cf;\n  font: 12px/1.5 monospace, monospace;\n  resize: vertical;\n}\n\nhtml body #r34g-tags-panel .r34g-hint,\nhtml body .r34g-hint {\n  color: var(--r34g-text-soft);\n}\n\nhtml body #r34g-tags-panel .r34g-tp-status {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-top: 8px;\n  color: var(--r34g-text-soft);\n  font-size: 11.5px;\n}\n\nhtml body .r34g-spinner {\n  width: 14px;\n  height: 14px;\n  border: 2px solid rgba(255, 255, 255, .25);\n  border-top-color: var(--r34g-accent);\n  border-radius: 50%;\n  animation: r34g-spin .8s linear infinite;\n}\n\nhtml body #r34g-tags-panel .r34g-rel {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n  padding: 3px 0;\n  border-bottom: 1px dashed rgba(255, 255, 255, .06);\n}\n\nhtml body #r34g-tags-panel .r34g-rel:last-child {\n  border-bottom: 0;\n}\n\nhtml body #r34g-tags-panel .r34g-rel-text {\n  flex: 1 1 240px;\n  color: #cfd8cf;\n  font-size: 11.5px;\n}\n\n@keyframes r34g-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n\n/* API de rule34: diagnóstico en Ajustes → Etiquetas */\n.r34g-probe {\n  margin: 8px 0 0;\n  padding: 8px 10px;\n  background: rgba(0, 0, 0, .18);\n  border: 1px solid var(--r34g-line);\n  border-radius: 6px;\n  color: var(--r34g-text-soft);\n  font-size: 11.5px;\n  text-align: left;\n}\n\n.r34g-probe:empty {\n  display: none;\n}\n\n.r34g-probe-line + .r34g-probe-line {\n  margin-top: 4px;\n}\n\n.r34g-probe-line b {\n  color: var(--r34g-accent);\n}\n\n.r34g-probe-bad b {\n  color: #d98b7f;\n}\n\n/* Sugerencias de etiquetas (API) bajo el buscador del panel lateral */\nhtml body #r34g-tag-filter + .r34g-suggest {\n  display: block;\n}\n\nhtml body .r34g-suggest {\n  position: relative;\n  z-index: 30;\n  margin: 4px 0 6px;\n  max-height: 224px;\n  overflow-y: auto;\n  background: var(--r34g-bg-deep);\n  border: 1px solid var(--r34g-line);\n  border-radius: 6px;\n  box-shadow: 0 10px 26px rgba(0, 0, 0, .45);\n  text-align: left;\n}\n\nhtml body .r34g-suggest[hidden] {\n  display: none !important;\n}\n\nhtml body .r34g-suggest-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  width: 100%;\n  padding: 4px 8px;\n  border: 0;\n  border-bottom: 1px solid rgba(255, 255, 255, .04);\n  background: transparent;\n  color: var(--r34g-text);\n  font: 11.5px verdana, sans-serif;\n  text-align: left;\n  cursor: pointer;\n}\n\nhtml body .r34g-suggest-row:last-child {\n  border-bottom: 0;\n}\n\nhtml body .r34g-suggest-row:hover {\n  background: var(--r34g-card-hover);\n  color: #eaf6ea;\n}\n\nhtml body .r34g-suggest-name {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\nhtml body .r34g-suggest-count {\n  flex: 0 0 auto;\n  color: var(--r34g-text-soft);\n  font-size: 10.5px;\n}\n\n/* ---- Botón flotante de Ajustes: siempre accesible (clave de rule34, IA, opciones) ---- */\nhtml body #r34g-fab {\n  position: fixed !important;\n  right: 18px !important;\n  bottom: 18px !important;\n  z-index: calc(var(--r34g-z) - 4) !important;\n  display: inline-flex !important;\n  align-items: center;\n  gap: 7px;\n  margin: 0 !important;\n  padding: 9px 14px 9px 12px !important;\n  border: 1px solid var(--r34g-accent) !important;\n  border-radius: 999px !important;\n  background: linear-gradient(#3a463a, #2c362c) !important;\n  color: var(--r34g-link) !important;\n  font: bold 12.5px verdana, sans-serif !important;\n  cursor: pointer;\n  box-shadow: 0 8px 22px rgba(0, 0, 0, .5);\n  opacity: .92;\n  transition: opacity .15s, transform .15s;\n}\nhtml body #r34g-fab:hover {\n  opacity: 1;\n  transform: translateY(-1px);\n}\nhtml body #r34g-fab svg {\n  width: 14px;\n  height: 14px;\n  fill: currentColor;\n}\nhtml[data-r34g-fab=\"off\"] #r34g-fab {\n  display: none !important;\n}\nhtml.r34g-modal-open #r34g-fab {\n  display: none !important;\n}\n\n/* ---- Descargas: botones, barra del post, cola y dialogos ---- */\nhtml body .r34g-btn,\nhtml body .r34g-dlq .r34g-mini {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 6px;\n  padding: 6px 12px !important;\n  margin: 0 !important;\n  border: 1px solid var(--r34g-line) !important;\n  border-radius: 6px !important;\n  background: var(--r34g-bg-alt) !important;\n  color: var(--r34g-text) !important;\n  font: 12px verdana, sans-serif !important;\n  line-height: 1.2 !important;\n  text-decoration: none !important;\n  cursor: pointer;\n}\nhtml body .r34g-dlq .r34g-mini {\n  padding: 3px 9px !important;\n  font-size: 11px !important;\n  white-space: nowrap;\n}\nhtml body .r34g-btn:hover,\nhtml body .r34g-dlq .r34g-mini:hover {\n  border-color: var(--r34g-accent) !important;\n  color: #ffffff !important;\n}\nhtml body .r34g-btn.r34g-on {\n  background: linear-gradient(#3d4b3d, #2f3b2f) !important;\n  border-color: var(--r34g-accent) !important;\n  color: var(--r34g-link) !important;\n}\nhtml body .r34g-btn svg,\nhtml body .r34g-dlq .r34g-mini svg {\n  width: 14px;\n  height: 14px;\n}\nhtml body .r34g-note {\n  color: var(--r34g-text-soft);\n  font-size: 11px;\n}\n\nhtml body .image-list .thumb .r34g-dl-btn {\n  position: absolute;\n  left: 7px;\n  top: 34px;\n  z-index: 5;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 28px;\n  height: 28px;\n  padding: 0 !important;\n  margin: 0 !important;\n  border: 1px solid rgba(255, 255, 255, .22) !important;\n  border-radius: 50%;\n  background: rgba(10, 14, 10, .78);\n  color: #e8f4e8;\n  cursor: pointer;\n  opacity: 0;\n  transform: translateY(3px);\n  transition: opacity .16s, transform .16s, background .16s;\n}\nhtml body .image-list .thumb:hover .r34g-dl-btn,\nhtml body .image-list .thumb .r34g-dl-btn:focus-visible {\n  opacity: 1;\n  transform: none;\n}\nhtml body .image-list .thumb .r34g-dl-btn:hover {\n  background: #38513a;\n  border-color: var(--r34g-accent) !important;\n}\nhtml body .image-list .thumb .r34g-dl-btn svg {\n  width: 16px;\n  height: 16px;\n}\nhtml body .image-list .thumb .r34g-dl-btn.r34g-busy {\n  opacity: 1;\n  transform: none;\n  animation: r34g-dl-pulse 1.1s ease-in-out infinite;\n}\n@keyframes r34g-dl-pulse {\n  0%, 100% { box-shadow: 0 0 0 0 rgba(147, 179, 147, 0); }\n  50% { box-shadow: 0 0 0 5px rgba(147, 179, 147, .28); }\n}\nhtml body .image-list .thumb .r34g-dl-badge {\n  position: absolute;\n  top: 37px;\n  right: 7px;\n  z-index: 4;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  background: rgba(8, 18, 8, .78);\n  border: 1px solid rgba(147, 179, 147, .5);\n  color: #cfeccf;\n}\nhtml body .image-list .thumb .r34g-dl-badge svg {\n  width: 13px;\n  height: 13px;\n}\n\nhtml body #r34g-dl-bar {\n  display: flex !important;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 8px;\n  margin: 0 0 10px !important;\n  padding: 8px 10px !important;\n  border: 1px solid var(--r34g-line);\n  border-radius: 8px;\n  background: rgba(20, 26, 20, .9);\n  text-align: left;\n}\nhtml body .r34g-dl-name {\n  color: var(--r34g-text-soft);\n  font: 11.5px monospace;\n  word-break: break-all;\n}\nhtml body #r34g-grid-bar {\n  display: flex !important;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n  margin: 0 0 10px !important;\n  padding: 5px 9px !important;\n  border: 1px solid var(--r34g-line);\n  border-radius: 8px;\n  background: rgba(20, 26, 20, .9);\n  text-align: left;\n  font: 11.5px verdana, sans-serif;\n}\nhtml[data-r34g-gridbar=\"off\"] body #r34g-grid-bar {\n  display: none !important;\n}\nhtml body .r34g-grid-label {\n  color: var(--r34g-text-soft);\n  text-transform: uppercase;\n  letter-spacing: .04em;\n  font-size: 10.5px;\n}\nhtml body .r34g-grid-btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 22px;\n  padding: 2px 7px !important;\n  margin: 0 !important;\n  border: 1px solid var(--r34g-line) !important;\n  border-radius: 5px !important;\n  background: var(--r34g-bg-alt) !important;\n  color: var(--r34g-text) !important;\n  font: 11.5px verdana, sans-serif !important;\n  line-height: 1.35 !important;\n  cursor: pointer;\n}\nhtml body .r34g-grid-btn:hover {\n  border-color: var(--r34g-accent) !important;\n  color: #fff !important;\n}\nhtml body .r34g-grid-range {\n  -webkit-appearance: none !important;\n  appearance: none !important;\n  width: 132px !important;\n  height: 4px !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  border: 0 !important;\n  border-radius: 3px !important;\n  background: #465046 !important;\n  cursor: pointer;\n}\nhtml body .r34g-grid-range:focus {\n  outline: none !important;\n}\nhtml body .r34g-grid-range::-webkit-slider-thumb {\n  -webkit-appearance: none !important;\n  appearance: none !important;\n  width: 13px !important;\n  height: 13px !important;\n  border: 1px solid rgba(255, 255, 255, .4) !important;\n  border-radius: 50% !important;\n  background: var(--r34g-link, #b0e0b0) !important;\n  cursor: pointer;\n}\nhtml body .r34g-grid-range::-moz-range-thumb {\n  width: 12px !important;\n  height: 12px !important;\n  border: 1px solid rgba(255, 255, 255, .4) !important;\n  border-radius: 50% !important;\n  background: var(--r34g-link, #b0e0b0) !important;\n  cursor: pointer;\n}\nhtml body .r34g-grid-val {\n  min-width: 96px;\n  color: var(--r34g-link);\n  font: 11.5px monospace;\n}\n\nhtml[data-r34g-card=\"tiny\"] body .image-list .thumb .r34g-sel-box {\n  width: 20px;\n  height: 20px;\n  left: 7px;\n  top: 33px;\n  border-radius: 5px;\n}\nhtml[data-r34g-card=\"tiny\"] body .image-list .thumb .r34g-sel-box svg {\n  width: 13px;\n  height: 13px;\n}\nhtml[data-r34g-card=\"tiny\"] body .image-list .thumb .r34g-dl-btn {\n  width: 20px;\n  height: 20px;\n  left: 7px;\n  top: 33px;\n}\nhtml[data-r34g-card=\"tiny\"] body .image-list .thumb .r34g-dl-btn svg {\n  width: 12px;\n  height: 12px;\n}\nhtml[data-r34g-card=\"tiny\"] body .image-list .thumb .r34g-seen-badge {\n  width: 20px;\n  height: 20px;\n  top: 5px;\n  right: 5px;\n}\nhtml[data-r34g-card=\"tiny\"] body .image-list .thumb .r34g-seen-badge svg {\n  width: 13px;\n  height: 13px;\n}\nhtml[data-r34g-card=\"tiny\"] body .image-list .thumb .r34g-dl-badge {\n  width: 17px;\n  height: 17px;\n  top: 27px;\n  right: 5px;\n}\nhtml[data-r34g-card=\"tiny\"] body .image-list .thumb .r34g-dl-badge svg {\n  width: 11px;\n  height: 11px;\n}\nhtml[data-r34g-card=\"tiny\"] body .image-list .thumb > a > .score-info {\n  display: none !important;\n}\nhtml[data-r34g-card=\"tiny\"] body .image-list .thumb .r34g-meta {\n  display: none !important;\n}\n\nhtml body #r34g-dl-batch {\n  display: flex !important;\n  align-items: center;\n  gap: 10px;\n  margin: 0 0 12px !important;\n  text-align: left;\n}\n\nhtml body .image-list .thumb .r34g-sel-box {\n  position: absolute;\n  left: 7px;\n  top: 34px;\n  z-index: 6;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 24px;\n  height: 24px;\n  padding: 0 !important;\n  margin: 0 !important;\n  border: 1px solid rgba(255, 255, 255, .38) !important;\n  border-radius: 6px;\n  background: rgba(10, 14, 10, .72);\n  color: #e6f6e6;\n  cursor: pointer;\n  opacity: 0;\n  transform: translateY(-3px);\n  transition: opacity .16s, transform .16s, background .16s, border-color .16s;\n  pointer-events: none;\n}\nhtml body.r34g-selecting .image-list .thumb .r34g-sel-box {\n  opacity: 1;\n  transform: none;\n  pointer-events: auto;\n}\nhtml body.r34g-selecting .image-list .thumb .r34g-dl-btn {\n  display: none !important;\n}\nhtml body .image-list .thumb .r34g-sel-box svg {\n  width: 15px;\n  height: 15px;\n  opacity: 0;\n  transition: opacity .12s;\n}\nhtml body .image-list .thumb .r34g-sel-box:hover {\n  border-color: var(--r34g-accent) !important;\n  background: rgba(30, 46, 30, .92);\n}\nhtml body .image-list .thumb .r34g-sel-box.r34g-on {\n  background: #3f7a44;\n  border-color: #a8ddac !important;\n  color: #ffffff;\n}\nhtml body .image-list .thumb .r34g-sel-box.r34g-on svg {\n  opacity: 1;\n}\nhtml body.r34g-selecting .image-list .thumb.r34g-picked > a::before {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  z-index: 3;\n  pointer-events: none;\n  box-shadow: inset 0 0 0 3px rgba(150, 226, 160, .9);\n  border-radius: var(--r34g-radius);\n}\nhtml body .r34g-sel-note {\n  color: var(--r34g-link);\n  font-size: 11.5px;\n  font-weight: bold;\n}\nhtml body #r34g-dl-selpill {\n  position: fixed !important;\n  right: 18px !important;\n  bottom: 18px !important;\n  z-index: calc(var(--r34g-z) - 3) !important;\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 8px;\n  max-width: 620px;\n  padding: 8px 10px !important;\n  border: 1px solid var(--r34g-line);\n  border-radius: 10px;\n  background: rgba(18, 24, 18, .97);\n  color: var(--r34g-text);\n  box-shadow: var(--r34g-shadow);\n  font: 11.5px verdana, sans-serif;\n  text-align: left;\n}\nhtml body #r34g-dl-selpill .r34g-selpill-info {\n  color: var(--r34g-text-soft);\n}\nhtml body #r34g-dl-selpill .r34g-selpill-info b {\n  color: var(--r34g-link);\n  font-size: 14px;\n}\nhtml body #r34g-dl-selpill .r34g-selpill-x {\n  padding: 6px 9px !important;\n}\nhtml body #r34g-dl-selpill .r34g-selpill-info {\n  display: inline-flex !important;\n  align-items: baseline;\n  gap: 5px;\n  padding: 3px 8px !important;\n  margin: 0 !important;\n  border: 1px solid transparent !important;\n  border-radius: 6px !important;\n  background: transparent !important;\n  color: var(--r34g-text-soft) !important;\n  font: inherit !important;\n  cursor: pointer;\n}\nhtml body #r34g-dl-selpill .r34g-selpill-info:hover {\n  border-color: var(--r34g-line) !important;\n  color: #ffffff !important;\n}\nhtml body button.r34g-sel-note {\n  padding: 3px 8px !important;\n  margin: 0 !important;\n  border: 1px solid transparent !important;\n  border-radius: 6px !important;\n  background: transparent !important;\n  color: var(--r34g-link) !important;\n  font: bold 11.5px verdana, sans-serif !important;\n  cursor: pointer;\n}\nhtml body button.r34g-sel-note:hover {\n  border-color: var(--r34g-line) !important;\n  color: #ffffff !important;\n}\nhtml body #r34g-dl-batch .r34g-selgo {\n  background: linear-gradient(#3d4b3d, #2f3b2f) !important;\n  border-color: var(--r34g-accent) !important;\n  color: var(--r34g-link) !important;\n}\n\n/* ---- Descargas: lista de lo seleccionado ---- */\nhtml body #r34g-dl-selpanel {\n  position: fixed !important;\n  right: 18px !important;\n  bottom: 78px !important;\n  z-index: calc(var(--r34g-z) - 3) !important;\n  display: flex;\n  flex-direction: column;\n  width: 370px;\n  max-width: 48vw;\n  max-height: 52vh;\n  border: 1px solid var(--r34g-line);\n  border-radius: 10px;\n  background: rgba(18, 24, 18, .97);\n  color: var(--r34g-text);\n  box-shadow: var(--r34g-shadow);\n  font: 11.5px verdana, sans-serif;\n  text-align: left;\n}\nhtml body .r34g-dlsp-head {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 7px 9px;\n  border-bottom: 1px solid var(--r34g-line);\n}\nhtml body .r34g-dlsp-head b {\n  color: var(--r34g-link);\n  font-size: 12.5px;\n}\nhtml body .r34g-dlsp-count {\n  flex: 1;\n  color: var(--r34g-text-soft);\n  font-size: 10.5px;\n}\nhtml body .r34g-dlsp-head .r34g-mini,\nhtml body .r34g-dlsp-x {\n  padding: 3px 8px !important;\n  margin: 0 !important;\n  border: 1px solid var(--r34g-line) !important;\n  border-radius: 6px !important;\n  background: var(--r34g-bg-alt) !important;\n  color: var(--r34g-text) !important;\n  font: 11px verdana, sans-serif !important;\n  line-height: 1.2 !important;\n  cursor: pointer;\n}\nhtml body .r34g-dlsp-head .r34g-mini:hover {\n  border-color: var(--r34g-accent) !important;\n  color: #ffffff !important;\n}\nhtml body .r34g-dlsp-x:hover {\n  border-color: #ff8f8f !important;\n  color: #ffd0d0 !important;\n}\nhtml body .r34g-dlsp-list {\n  overflow: auto;\n  padding: 4px 0;\n}\nhtml body .r34g-dlsp-item {\n  display: grid;\n  grid-template-columns: 46px 1fr auto;\n  gap: 8px;\n  align-items: center;\n  padding: 4px 9px;\n}\nhtml body .r34g-dlsp-thumb {\n  display: block;\n  width: 46px;\n  height: 34px;\n  object-fit: cover;\n  border-radius: 4px;\n  background: rgba(255, 255, 255, .07);\n}\nhtml body .r34g-dlsp-info {\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\nhtml body .r34g-dlsp-info b {\n  color: #dbe6db;\n  font-size: 11.5px;\n}\nhtml body .r34g-dlsp-tags {\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  color: var(--r34g-text-soft);\n  font-size: 10px;\n}\nhtml body .r34g-dlsp-item.r34g-dlsp-other .r34g-dlsp-info b {\n  color: #ffd479;\n}\nhtml body .r34g-dlsp-foot {\n  display: flex;\n  gap: 8px;\n  padding: 7px 9px;\n  border-top: 1px solid var(--r34g-line);\n}\nhtml body .r34g-dlg-sel {\n  padding: 9px 11px;\n  margin: 0 0 10px;\n  border: 1px solid var(--r34g-accent);\n  border-radius: 8px;\n  background: rgba(60, 84, 60, .28);\n}\nhtml body .r34g-dlg-sel > b {\n  color: var(--r34g-link);\n  font-size: 12.5px;\n}\nhtml body .r34g-dlg-sel .r34g-dlg-actions {\n  justify-content: flex-start;\n  margin-top: 8px;\n}\nhtml body .r34g-dlg-sel .r34g-hint {\n  margin: 8px 0 0;\n}\nhtml body .r34g-dlg-est {\n  margin: 0 0 10px !important;\n  color: #ffd479;\n  font-weight: bold;\n}\nhtml body .r34g-btn[disabled] {\n  opacity: .5;\n  cursor: default;\n}\n\nhtml body #r34g-dlq {\n  position: fixed !important;\n  left: 18px !important;\n  bottom: 18px !important;\n  z-index: calc(var(--r34g-z) - 3) !important;\n  display: flex;\n  flex-direction: column;\n  width: 340px;\n  max-width: 46vw;\n  max-height: 44vh;\n  border: 1px solid var(--r34g-line);\n  border-radius: 10px;\n  background: rgba(18, 24, 18, .97);\n  color: var(--r34g-text);\n  box-shadow: var(--r34g-shadow);\n  font: 11.5px verdana, sans-serif;\n  text-align: left;\n}\nhtml body .r34g-dlq-head {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 8px;\n  padding: 7px 9px;\n  border-bottom: 1px solid var(--r34g-line);\n}\nhtml body .r34g-dlq-head b {\n  color: var(--r34g-link);\n  font-size: 12.5px;\n}\nhtml body .r34g-dlq-count {\n  flex: 1;\n  min-width: 0;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  color: var(--r34g-text-soft);\n}\nhtml body .r34g-dlq-list {\n  overflow: auto;\n  padding: 4px 0;\n}\nhtml body .r34g-dlq-item {\n  display: grid;\n  grid-template-columns: 1fr 70px;\n  gap: 3px 8px;\n  align-items: center;\n  padding: 5px 9px;\n}\nhtml body .r34g-dlq-name {\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  color: #dbe6db;\n}\nhtml body .r34g-dlq-state {\n  grid-column: 1 / -1;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  color: var(--r34g-text-soft);\n  font-size: 10.5px;\n}\nhtml body .r34g-dlq-bar {\n  height: 6px;\n  border-radius: 4px;\n  background: rgba(255, 255, 255, .1);\n  overflow: hidden;\n}\nhtml body .r34g-dlq-bar > i {\n  display: block;\n  width: 0;\n  height: 100%;\n  background: linear-gradient(90deg, #6f9a6f, #a9d3a9);\n  transition: width .2s ease;\n}\nhtml body .r34g-dlq-item[data-state=\"error\"] .r34g-dlq-state { color: #ffb3ae; }\nhtml body .r34g-dlq-item[data-state=\"done\"] .r34g-dlq-state { color: #a9f0a9; }\nhtml body .r34g-dlq-item[data-state=\"skip\"] .r34g-dlq-state,\nhtml body .r34g-dlq-item[data-state=\"open\"] .r34g-dlq-state { color: #ffd479; }\nhtml body .r34g-dlq-item[data-state=\"hold\"] .r34g-dlq-state { color: #ffd479; }\nhtml body .r34g-dlq-item[data-state=\"hold\"] .r34g-dlq-bar > i {\n  background: repeating-linear-gradient(45deg, #6f7a6f 0 6px, #8b968b 6px 12px);\n}\n\nhtml body .r34g-dlq-restore {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 6px;\n  margin: 7px 9px 3px;\n  padding: 6px 8px;\n  border: 1px solid rgba(255, 212, 121, .4);\n  border-radius: 8px;\n  background: rgba(255, 212, 121, .09);\n}\nhtml body .r34g-dlq-restore[hidden],\nhtml body #r34g-dlq-retry[hidden] {\n  display: none !important;\n}\nhtml body .r34g-dlq-restore-txt {\n  flex: 1 1 100%;\n  color: #ffd479;\n  font-size: 11px;\n  line-height: 1.35;\n}\n\nhtml body .r34g-dlg {\n  position: fixed !important;\n  inset: 0;\n  z-index: 2147482090 !important;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 20px;\n  background: rgba(6, 9, 6, .62);\n}\nhtml body .r34g-dlg-box {\n  width: 430px;\n  max-width: 92vw;\n  max-height: 86vh;\n  overflow: auto;\n  padding: 16px 18px;\n  border: 1px solid var(--r34g-line);\n  border-radius: 10px;\n  background: var(--r34g-bg);\n  color: var(--r34g-text);\n  box-shadow: var(--r34g-shadow);\n  font: 12px/1.5 verdana, sans-serif;\n  text-align: left;\n}\nhtml body .r34g-dlg-box.r34g-dlg-wide {\n  width: 620px;\n}\nhtml body .r34g-dlg-box h5 {\n  margin: 0 0 8px;\n  color: var(--r34g-link);\n  font-size: 14px;\n}\nhtml body .r34g-dlg-box p {\n  margin: 0 0 9px;\n}\nhtml body .r34g-dlg-head {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-bottom: 10px;\n}\nhtml body .r34g-dlg-head b {\n  flex: 1;\n  color: var(--r34g-link);\n  font-size: 14px;\n}\nhtml body .r34g-dlg .r34g-close {\n  padding: 0 6px !important;\n  border: 0 !important;\n  background: transparent !important;\n  color: var(--r34g-text-soft) !important;\n  font: bold 18px/1 verdana, sans-serif !important;\n  cursor: pointer;\n}\nhtml body .r34g-dlg .r34g-close:hover {\n  color: #ffffff !important;\n}\nhtml body .r34g-dlg-row {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin: 0 0 8px;\n}\nhtml body .r34g-dlg-row input[type=\"number\"] {\n  width: 72px;\n  padding: 3px 7px;\n  border: 1px solid var(--r34g-line);\n  border-radius: 5px;\n  background: var(--r34g-bg-alt);\n  color: var(--r34g-text);\n  font: 12px verdana, sans-serif;\n}\nhtml body .r34g-dlg-actions {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: flex-end;\n  gap: 8px;\n  margin-top: 12px;\n}\nhtml body .r34g-dlg-status {\n  min-height: 16px;\n  color: var(--r34g-text-soft);\n  font-size: 11.5px;\n}\nhtml body #r34g-warn .r34g-notes {\n  margin: 0 0 10px 18px;\n  padding: 0;\n  color: var(--r34g-text-soft);\n  font-size: 11.5px;\n}\nhtml body #r34g-warn .r34g-hint {\n  color: var(--r34g-text-soft);\n  font-size: 11.5px;\n}\n\n/* ---- Vista rápida: la imagen o el vídeo encima de la galería ---- */\nhtml body.r34g-lb-open {\n  overflow: hidden !important;\n}\nhtml body #r34g-lb {\n  position: fixed !important;\n  inset: 0;\n  z-index: calc(var(--r34g-z) + 60) !important;\n  display: flex;\n  flex-direction: column;\n  background: rgba(7, 10, 7, .95);\n  color: #e8f2e8;\n  font: 12px verdana, sans-serif;\n  text-align: left;\n}\nhtml body #r34g-lb .r34g-lb-top {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 8px 12px;\n  border-bottom: 1px solid var(--r34g-line);\n  background: rgba(18, 24, 18, .92);\n}\nhtml body #r34g-lb .r34g-lb-pos {\n  color: var(--r34g-link);\n  font-size: 13px;\n  font-weight: bold;\n}\nhtml body #r34g-lb .r34g-lb-id {\n  color: #dbe6db;\n  font-weight: bold;\n}\nhtml body #r34g-lb .r34g-lb-seen {\n  color: #a9f0a9;\n  font-size: 11px;\n}\nhtml body #r34g-lb .r34g-lb-tags {\n  flex: 1 1 auto;\n  min-width: 0;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  color: var(--r34g-text-soft);\n  font-size: 11px;\n}\nhtml body #r34g-lb .r34g-lb-gap {\n  display: none;\n}\nhtml body #r34g-lb a.r34g-btn {\n  text-decoration: none !important;\n}\nhtml body #r34g-lb .r34g-lb-stage {\n  position: relative;\n  flex: 1 1 auto;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 0;\n  padding: 12px 58px;\n}\nhtml body #r34g-lb .r34g-lb-media {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n}\nhtml body #r34g-lb .r34g-lb-media img,\nhtml body #r34g-lb .r34g-lb-media video {\n  max-width: 100%;\n  max-height: 100%;\n  border-radius: 6px;\n  background: #05070a;\n  box-shadow: 0 12px 44px rgba(0, 0, 0, .6);\n}\nhtml body #r34g-lb .r34g-lb-media video {\n  outline: none;\n}\nhtml body #r34g-lb .r34g-lb-img {\n  cursor: zoom-in;\n  object-fit: contain;\n}\nhtml body #r34g-lb .r34g-lb-quick {\n  filter: blur(1.5px);\n}\nhtml body #r34g-lb .r34g-lb-stage.r34g-lb-zoom {\n  align-items: flex-start;\n  justify-content: flex-start;\n  overflow: auto;\n}\nhtml body #r34g-lb .r34g-lb-stage.r34g-lb-zoom .r34g-lb-media {\n  width: auto;\n  height: auto;\n  min-width: 100%;\n  min-height: 100%;\n}\nhtml body #r34g-lb .r34g-lb-stage.r34g-lb-zoom .r34g-lb-img {\n  max-width: none;\n  max-height: none;\n  cursor: zoom-out;\n}\nhtml body #r34g-lb .r34g-lb-nav {\n  position: absolute !important;\n  top: 50%;\n  transform: translateY(-50%);\n  width: 44px;\n  height: 86px;\n  padding: 0 !important;\n  margin: 0 !important;\n  border: 1px solid var(--r34g-line) !important;\n  border-radius: 8px;\n  background: rgba(18, 24, 18, .84) !important;\n  color: var(--r34g-link) !important;\n  font: bold 30px/1 verdana, sans-serif !important;\n  cursor: pointer;\n}\nhtml body #r34g-lb .r34g-lb-nav:hover {\n  border-color: var(--r34g-accent) !important;\n  color: #ffffff !important;\n}\nhtml body #r34g-lb .r34g-lb-prev {\n  left: 7px;\n}\nhtml body #r34g-lb .r34g-lb-next {\n  right: 7px;\n}\nhtml body #r34g-lb .r34g-lb-foot {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 7px 12px;\n  border-top: 1px solid var(--r34g-line);\n  background: rgba(18, 24, 18, .92);\n  color: var(--r34g-text-soft);\n  font-size: 11px;\n}\nhtml body #r34g-lb .r34g-lb-file {\n  color: #dbe6db;\n}\nhtml body #r34g-lb .r34g-lb-keys {\n  flex: 1 1 auto;\n  text-align: right;\n}\nhtml body #r34g-lb .r34g-lb-note {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  display: flex;\n  align-items: center;\n  gap: 9px;\n  padding: 10px 14px;\n  border: 1px solid var(--r34g-line);\n  border-radius: 8px;\n  background: rgba(18, 24, 18, .94);\n  color: var(--r34g-text);\n  font-size: 12px;\n}\nhtml body #r34g-lb .r34g-lb-note.r34g-lb-bad {\n  color: #ffb3ae;\n  border-color: #6c4040;\n}\n";
  var style = document.createElement("style");
  style.id = "r34g-styles";
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);
})();
// ---- rule34-gallery-suite ----
(function () {
  "use strict";
  var R = (window.__r34g = window.__r34g || {});
  if (R.core) return;
  R.core = true;

  R.VERSION = "0.8.0";
  R.NAME = "Rule34 Gallery Suite";

  var SETTINGS_KEY = "r34g.settings.v2";
  var SEEN_KEY = "r34g.seen.v1";
  var SEEN_LIMIT = 20000;

  R.DEFAULTS = {
    cols: "auto",
    thumbSize: 200,
    gridBar: true,
    aspect: "1",
    fit: "cover",
    score: true,
    badges: true,
    hover: true,
    lb: true,
    sticky: true,
    filter: true,
    seen: true,
    seenDim: false,
    vFit: "contain",
    vWidth: "1000",
    vRadius: true,
    vShadow: true,
    vBg: "negro",
    vCinema: false,
    vBar: true,
    vKeys: true,
    vSpeed: "1",
    vLoop: true,
    vAutoplay: false,
    vVolume: 1,
    vSkip: 5,
    tRed: "count",
    tAlias: true,
    tShared: true,
    tAuto: false,
    tAutoAI: false,
    fab: true,
    tEngine: "local",
    tEndpoint: "https://text.pollinations.ai/openai",
    tModel: "openai",
    tKey: "",
    tPrompt: "",
    apiUser: "",
    apiKey: "",
    dlOn: true,
    dlPost: true,
    dlOpen: true,
    dlFile: "{id}_{artist}_{character}",
    dlFolder: "rule34/{artist}",
    dlConflict: "uniquify",
    dlQueue: "3",
    dlPages: "1",
    dlSkip: true,
    dlZip: false,
    pdlAction: "ask",
    tBridge: "https://perchance.org/userscript-maker"
  };

  function readJSON(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  var stored = readJSON(SETTINGS_KEY) || {};
  // migración 0.2.1: las tarjetas pasaron de verticales (4:5) a cuadradas (1:1)
  try {
    if (!localStorage.getItem("r34g.mig.cuadrada")) {
      if (!stored.aspect || stored.aspect === "4/5") stored.aspect = R.DEFAULTS.aspect;
      localStorage.setItem("r34g.mig.cuadrada", "1");
    }
  } catch (e) {}
  // migración 0.5.0: las columnas fijas por defecto (5) pasan a automáticas, que se calculan
  // a partir del tamaño de miniatura elegido. Quien haya elegido otro número, lo conserva.
  try {
    if (!localStorage.getItem("r34g.mig.tamano")) {
      if (!stored.cols || stored.cols === "5") stored.cols = R.DEFAULTS.cols;
      localStorage.setItem("r34g.mig.tamano", "1");
    }
  } catch (e) {}
  // migración 0.6.1: «Descargar esta búsqueda» venía con 3 páginas por defecto, así que un clic
  // descargaba 126 posts cuando el usuario solo había marcado unos pocos a mano. Ahora empieza en 1.
  try {
    if (!localStorage.getItem("r34g.mig.paginas")) {
      if (!stored.dlPages || stored.dlPages === "3") stored.dlPages = R.DEFAULTS.dlPages;
      localStorage.setItem("r34g.mig.paginas", "1");
    }
  } catch (e) {}
  var settings = Object.assign({}, R.DEFAULTS, stored);
  R.settings = settings;
  writeJSON(SETTINGS_KEY, settings);

  R.saveSettings = function () {
    writeJSON(SETTINGS_KEY, settings);
  };

  R.applySettings = function () {
    var h = document.documentElement;
    h.setAttribute("data-r34g-cols", String(settings.cols));
    h.setAttribute("data-r34g-gridbar", settings.gridBar ? "on" : "off");
    h.setAttribute("data-r34g-aspect", settings.aspect);
    h.setAttribute("data-r34g-fit", settings.fit);
    h.setAttribute("data-r34g-score", settings.score ? "on" : "off");
    h.setAttribute("data-r34g-badges", settings.badges ? "on" : "off");
    h.setAttribute("data-r34g-hover", settings.hover ? "on" : "off");
    h.setAttribute("data-r34g-sticky", settings.sticky ? "on" : "off");
    h.setAttribute("data-r34g-filter", settings.filter ? "on" : "off");
    h.setAttribute("data-r34g-seen", settings.seen ? "on" : "off");
    h.setAttribute("data-r34g-seendim", settings.seenDim ? "on" : "off");
    h.setAttribute("data-r34g-vfit", settings.vFit);
    h.setAttribute("data-r34g-vwidth", settings.vWidth);
    h.setAttribute("data-r34g-vbg", settings.vBg);
    h.setAttribute("data-r34g-vradius", settings.vRadius ? "on" : "off");
    h.setAttribute("data-r34g-vshadow", settings.vShadow ? "on" : "off");
    h.setAttribute("data-r34g-vbar", settings.vBar ? "on" : "off");
    h.setAttribute("data-r34g-vcinema", settings.vCinema ? "on" : "off");
    h.setAttribute("data-r34g-fab", settings.fab ? "on" : "off");
    var width = settings.vWidth === "full" ? "100%" : settings.vWidth === "1200" ? "1200px" : "1000px";
    h.style.setProperty("--r34g-vwidth", width);
  };

  R.set = function (key, value) {
    settings[key] = value;
    R.applySettings();
    R.saveSettings();
    if (R.refreshControls) R.refreshControls();
    R.changeHooks.forEach(function (fn) {
      try {
        fn(key, value);
      } catch (e) {}
    });
  };

  R.resetSettings = function () {
    Object.keys(R.DEFAULTS).forEach(function (k) {
      settings[k] = R.DEFAULTS[k];
    });
    R.applySettings();
    R.saveSettings();
    if (R.refreshControls) R.refreshControls();
    R.changeHooks.forEach(function (fn) {
      try {
        fn(null, null);
      } catch (e) {}
    });
  };

  R.changeHooks = [];
  R.onChange = function (fn) {
    R.changeHooks.push(fn);
  };

  var seen = {
    map: {},
    dirty: false,
    timer: 0,
    load: function () {
      var data = readJSON(SEEN_KEY);
      this.map = data && typeof data === "object" ? data : {};
      return this;
    },
    has: function (id) {
      return id ? Object.prototype.hasOwnProperty.call(this.map, String(id)) : false;
    },
    add: function (id) {
      id = id == null ? "" : String(id);
      if (!id || this.map[id]) return false;
      this.map[id] = Date.now();
      this.dirty = true;
      this.schedule();
      return true;
    },
    clear: function () {
      this.map = {};
      this.dirty = true;
      this.flush();
    },
    size: function () {
      return Object.keys(this.map).length;
    },
    schedule: function () {
      var self = this;
      if (this.timer) return;
      this.timer = setTimeout(function () {
        self.timer = 0;
        self.flush();
      }, 1200);
    },
    flush: function () {
      if (!this.dirty) return;
      this.dirty = false;
      var keys = Object.keys(this.map);
      if (keys.length > SEEN_LIMIT) {
        keys.sort(function (a, b) {
          return seen.map[a] - seen.map[b];
        });
        keys.slice(0, keys.length - SEEN_LIMIT).forEach(function (k) {
          delete seen.map[k];
        });
      }
      writeJSON(SEEN_KEY, this.map);
    }
  };
  seen.load();
  R.seen = seen;

  window.addEventListener("pagehide", function () {
    seen.flush();
  });
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") seen.flush();
  });

  var util = {};

  util.el = function (tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  util.svg = function (path, viewBox) {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", viewBox || "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    var p = document.createElementNS(ns, "path");
    p.setAttribute("d", path);
    p.setAttribute("fill", "currentColor");
    svg.appendChild(p);
    return svg;
  };

  util.icon = function (name) {
    var paths = util.ICON_PATHS;
    return util.svg(paths[name] || paths.dot);
  };

  util.ICON_PATHS = {
    play: "M8 5v14l11-7z",
    pause: "M6 5h4v14H6zm8 0h4v14h-4z",
    start: "M6 5h2v14H6zm12 0v14l-9-7z",
    end: "M16 5h2v14h-2zM6 19V5l9 7z",
    volume: "M3 9h3l4-4v14l-4-4H3zm12.5-2.5a6 6 0 0 1 0 11v-2a4 4 0 0 0 0-7zM17.5 3a10 10 0 0 1 0 18v-2a8 8 0 0 0 0-14z",
    mute: "M3 9h3l4-4v14l-4-4H3zm16.5-1.1 1.4 1.4L18.4 12l2.5 2.7-1.4 1.4L17 13.4l-2.5 2.7-1.4-1.4L15.6 12l-2.5-2.7 1.4-1.4L17 10.6z",
    loop: "M7 7h8V4l5 4-5 4V9H7a3 3 0 0 0-3 3H2a5 5 0 0 1 5-5zm10 10H9v3l-5-4 5-4v3h8a3 3 0 0 0 3-3h2a5 5 0 0 1-5 5z",
    pip: "M3 5h18v14H3zm2 2v10h14V7zm7 5h5v4h-5z",
    full: "M4 4h6v2H6v4H4zm10 0h6v6h-2V6h-4zM4 14h2v4h4v2H4zm12 4v-4h2v6h-6v-2z",
    camera: "M9 3h6l1.5 2H21v14H3V5h4.5zm3 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z",
    cine: "M3 4h18v16H3zm2 2v12h14V6zm2 1h4v2H7zm6 0h4v2h-4zM7 9h4v2H7zm6 0h4v2h-4zm-6 3h4v2H7zm6 0h4v2h-4z",
    fit: "M4 4h7v2H6v5H4zm9 0h7v7h-2V6h-5zM4 13h2v5h5v2H4zm14 0h2v7h-7v-2h5z",
    search: "M10 3a7 7 0 1 0 4.2 12.6l4.1 4.1 1.4-1.4-4.1-4.1A7 7 0 0 0 10 3zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10z",
    eye: "M12 5c5 0 9 4.5 10 7-1 2.5-5 7-10 7S3 14.5 2 12c1-2.5 5-7 10-7zm0 2c-3.4 0-6.4 2.9-7.7 5 1.3 2.1 4.3 5 7.7 5s6.4-2.9 7.7-5C18.4 9.9 15.4 7 12 7zm0 1.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z",
    dot: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
    tag: "M3 3h9l9 9-9 9-9-9zm4 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
    wand: "M6 3l1.2 2.6L10 7l-2.8 1.4L6 11l-1.2-2.6L2 7l2.8-1.4zm10.8 1.6L18 1.6l1.2 3L22 6l-2.8 1.4L18 10.4l-1.2-3L14 6zM12.5 9.5l2 2L6 20l-2-2z",
    check: "M9.5 17.2 4.8 12.5l-1.4 1.4 6.1 6.1L21 8.6l-1.4-1.4z",
    copy: "M8 2h9l4 4v12H8zm2 2v12h9V7h-3V4zm-4 2H4v16h13v-2H6z",
    bolt: "M11 2 4 14h6l-1 8 7-12h-6z",
    dl: "M12 3v10.6l3.3-3.3 1.4 1.4L12 17.6l-4.7-5 1.4-1.4L12 13.6V3zM5 19h14v2H5z"
  };

  util.onReady = function (fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  };

  util.debounce = function (fn, ms) {
    var t = 0;
    return function () {
      var args = arguments,
        self = this;
      clearTimeout(t);
      t = setTimeout(function () {
        fn.apply(self, args);
      }, ms);
    };
  };

  util.num = function (v) {
    var n = parseInt(v, 10);
    return isNaN(n) ? 0 : n;
  };

  util.pretty = function (v) {
    var n = util.num(v);
    try {
      return n.toLocaleString("es-ES");
    } catch (e) {
      return String(n);
    }
  };

  util.copy = function (text) {
    var done = function () {
      util.toast("Copiado al portapapeles");
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {
        util.legacyCopy(text) && done();
      });
    } else if (util.legacyCopy(text)) {
      done();
    }
  };

  util.legacyCopy = function (text) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch (e) {
      return false;
    }
  };

  util.download = function (name, text, type) {
    try {
      var blob = new Blob([text], { type: type || "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 20000);
      return true;
    } catch (e) {
      return false;
    }
  };

  var toastHost = null;
  util.toast = function (message, ms) {
    if (!toastHost) {
      toastHost = util.el("div");
      toastHost.id = "r34g-toasts";
      document.body.appendChild(toastHost);
    }
    var t = util.el("div", "r34g-toast", message);
    toastHost.appendChild(t);
    setTimeout(function () {
      t.classList.add("r34g-toast-out");
      setTimeout(function () {
        t.remove();
      }, 300);
    }, ms || 2600);
  };

  util.postIdFromHref = function (href) {
    if (!href) return "";
    var m = /[?&]id=(\d+)/.exec(href);
    if (m) return m[1];
    m = /^p(\d+)$/.exec(href);
    return m ? m[1] : "";
  };

  util.currentPostId = function () {
    try {
      var p = new URLSearchParams(location.search);
      if ((p.get("page") || "") === "post" && (p.get("s") || "") === "view") return p.get("id") || "";
    } catch (e) {}
    return "";
  };

  R.util = util;

  R.panels = [];
  R.panel = function (panel) {
    R.panels.push(panel);
  };

  R.readyFns = [];
  R.onReady = function (fn) {
    R.readyFns.push(fn);
  };
})();

(function () {
  "use strict";
  var R = window.__r34g;
  if (!R || R.ui) return;
  R.ui = true;
  var util = R.util;

  var controls = [];
  R.controls = controls;

  function refresh() {
    controls.forEach(function (fn) {
      try {
        fn();
      } catch (e) {}
    });
  }
  R.refreshControls = refresh;

  function labelEl(title, note) {
    var l = util.el("span", "r34g-label", title);
    if (note) l.appendChild(util.el("span", "r34g-note", note));
    return l;
  }

  function row(o) {
    var r = util.el("div", "r34g-row");
    r.dataset.r34gSearch = ((o.title || "") + " " + (o.note || "")).toLowerCase();
    r.appendChild(labelEl(o.title, o.note));
    (o.into || o.section).appendChild(r);
    return r;
  }

  function section(panel, title, note) {
    var s = util.el("div", "r34g-section");
    s.appendChild(util.el("h6", null, title));
    if (note) s.appendChild(util.el("p", "r34g-hint", note));
    panel.appendChild(s);
    return s;
  }

  function addBtn(host, o) {
    var b = util.el("button", "r34g-mini " + (o.cls || ""), o.label);
    b.type = "button";
    if (o.title) b.title = o.title;
    b.addEventListener("click", function () {
      o.onClick(b);
    });
    host.appendChild(b);
    return b;
  }

  function seg(o) {
    var r = row(o);
    var segEl = util.el("span", "r34g-seg");
    o.options.forEach(function (opt) {
      var b = util.el("button", null, opt.label);
      b.type = "button";
      b.dataset.value = opt.value;
      if (opt.title) b.title = opt.title;
      b.addEventListener("click", function () {
        R.set(o.key, opt.value);
        if (o.onPick) o.onPick(opt.value);
      });
      segEl.appendChild(b);
    });
    r.appendChild(segEl);
    controls.push(function () {
      segEl.querySelectorAll("button").forEach(function (b) {
        b.classList.toggle("r34g-on", String(R.settings[o.key]) === b.dataset.value);
      });
    });
    return segEl;
  }

  function toggle(o) {
    var r = row(o);
    var wrap = util.el("span", "r34g-switch");
    var input = util.el("input");
    input.type = "checkbox";
    var slider = util.el("span", "r34g-slider");
    input.addEventListener("change", function () {
      R.set(o.key, input.checked);
    });
    wrap.appendChild(input);
    wrap.appendChild(slider);
    r.appendChild(wrap);
    controls.push(function () {
      input.checked = !!R.settings[o.key];
    });
    input.checked = !!R.settings[o.key];
    return input;
  }

  function bindInput(input, o) {
    var get = o.get || function () {
      return R.settings[o.key];
    };
    var set = o.set || function (v) {
      R.set(o.key, v);
    };
    var apply = function () {
      var v = get();
      if (input.type === "checkbox") input.checked = !!v;
      else input.value = v == null ? "" : v;
    };
    var evt = o.event || "change";
    input.addEventListener(evt, function () {
      var v = input.type === "checkbox" ? input.checked : input.type === "number" ? Number(input.value) : input.value;
      set(v);
    });
    apply();
    controls.push(apply);
    return input;
  }

  function number(o) {
    var r = row(o);
    var slot = util.el("span", "r34g-value");
    var input = util.el("input", "r34g-num");
    input.type = "number";
    if (o.min != null) input.min = o.min;
    if (o.max != null) input.max = o.max;
    if (o.step != null) input.step = o.step;
    input.style.width = o.width || "76px";
    slot.appendChild(input);
    if (o.suffix) slot.appendChild(util.el("span", "r34g-note", o.suffix));
    r.appendChild(slot);
    bindInput(input, o);
    if (o.onChange) {
      input.addEventListener("change", function () {
        o.onChange(input.value);
      });
    }
    return input;
  }

  function select(o) {
    var r = row(o);
    var slot = util.el("span", "r34g-value");
    var sel = util.el("select", "r34g-select");
    o.options.forEach(function (opt) {
      var op = util.el("option", null, opt.label);
      op.value = opt.value;
      sel.appendChild(op);
    });
    slot.appendChild(sel);
    r.appendChild(slot);
    bindInput(sel, o);
    return sel;
  }

  function text(o) {
    var r = row(o);
    var slot = util.el("span", "r34g-value r34g-value-wide");
    var input = util.el("input", "r34g-text");
    input.type = o.password ? "password" : "text";
    if (o.placeholder) input.placeholder = o.placeholder;
    if (o.mono) input.classList.add("r34g-mono");
    slot.appendChild(input);
    if (o.suffixBtn) addBtn(slot, o.suffixBtn);
    r.appendChild(slot);
    bindInput(input, o);
    return input;
  }

  function textarea(o) {
    var r = row(o);
    var slot = util.el("span", "r34g-value r34g-value-wide r34g-stack");
    var ta = util.el("textarea", "r34g-textarea");
    if (o.placeholder) ta.placeholder = o.placeholder;
    if (o.rows) ta.rows = o.rows;
    slot.appendChild(ta);
    if (o.buttons) {
      var bar = util.el("span", "r34g-mini-row");
      o.buttons.forEach(function (b) {
        addBtn(bar, b);
      });
      slot.appendChild(bar);
    }
    r.appendChild(slot);
    bindInput(ta, o);
    return ta;
  }

  function button(o) {
    var r = row(o);
    var slot = util.el("span", "r34g-value");
    var b = util.el("button", "r34g-mini " + (o.cls || ""), o.label);
    b.type = "button";
    if (o.title) b.title = o.title;
    b.addEventListener("click", function () {
      o.onClick(b);
    });
    slot.appendChild(b);
    if (o.extra) slot.appendChild(o.extra);
    r.appendChild(slot);
    return b;
  }

  function group(panel, title, note) {
    return section(panel, title, note);
  }

  R.ui = {
    section: group,
    row: row,
    seg: seg,
    toggle: toggle,
    number: number,
    select: select,
    text: text,
    textarea: textarea,
    button: button,
    buttonInto: addBtn,
    refresh: refresh,
    bind: bindInput
  };
})();

(function () {
  "use strict";
  var R = (window.__r34g = window.__r34g || {});
  if (R.api) return;
  R.api = true;

  var util = R.util;

  // API pública de rule34: el endpoint de autocompletado no pide clave y devuelve el contador
  // real de cada etiqueta. El DAPI (posts/tags) sí necesita user_id + api_key.
  var AUTO = "https://api.rule34.xxx/autocomplete.php?q=";
  var DAPI = "https://api.rule34.xxx/index.php";
  var CACHE_KEY = "r34g.tagcache.v1";
  var CACHE_MAX = 4000;
  var TTL = 1000 * 60 * 60 * 24 * 7;
  var GAP = 280;
  var MAX_CONCURRENT = 2;

  var counts = {};
  var stamps = {};
  try {
    var saved = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (saved && saved.v) {
      counts = saved.v;
      stamps = saved.t || {};
    }
  } catch (e) {}

  var saveTimer = null;
  function persist() {
    if (saveTimer) return;
    saveTimer = setTimeout(function () {
      saveTimer = null;
      try {
        var names = Object.keys(counts);
        if (names.length > CACHE_MAX) {
          names.sort(function (a, b) {
            return (stamps[a] || 0) - (stamps[b] || 0);
          });
          names.slice(0, names.length - CACHE_MAX).forEach(function (n) {
            delete counts[n];
            delete stamps[n];
          });
        }
        localStorage.setItem(CACHE_KEY, JSON.stringify({ v: counts, t: stamps }));
      } catch (e) {}
    }, 1500);
  }

  var queue = [];
  var running = 0;
  var lastStart = 0;

  function pump() {
    if (running >= MAX_CONCURRENT || !queue.length) return;
    var wait = Math.max(0, GAP - (Date.now() - lastStart));
    if (wait > 0) {
      if (!pump.timer) {
        pump.timer = setTimeout(function () {
          pump.timer = null;
          pump();
        }, wait);
      }
      return;
    }
    lastStart = Date.now();
    running++;
    var job = queue.shift();
    Promise.resolve()
      .then(job.fn)
      .then(job.res, job.rej)
      .then(function () {
        running--;
        pump();
      });
    pump();
  }

  function schedule(fn) {
    return new Promise(function (res, rej) {
      queue.push({ fn: fn, res: res, rej: rej });
      pump();
    });
  }

  var searches = {};

  function parseLabel(label) {
    var m = /^(.*?)\s*\((\d+)\)\s*$/.exec(label || "");
    if (!m) return null;
    return { name: m[1].trim(), count: Number(m[2]) };
  }

  function search(query) {
    var q = String(query || "").trim();
    if (!q) return Promise.resolve([]);
    var key = q.toLowerCase();
    var hit = searches[key];
    if (hit && Date.now() - hit.t < 1000 * 60 * 10) return Promise.resolve(hit.list);
    return schedule(function () {
      return fetch(AUTO + encodeURIComponent(q), { credentials: "omit" }).then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      });
    })
      .then(function (text) {
        var data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          data = [];
        }
        var list = (Array.isArray(data) ? data : [])
          .map(function (item) {
            var p = parseLabel(item.label);
            return p ? { name: item.value || p.name, count: p.count } : null;
          })
          .filter(Boolean);
        searches[key] = { list: list, t: Date.now() };
        cacheList(list);
        return list;
      })
      .catch(function () {
        return [];
      });
  }

  function cacheList(list) {
    var now = Date.now();
    var changed = false;
    list.forEach(function (item) {
      var k = item.name.toLowerCase();
      if (counts[k] !== item.count) changed = true;
      counts[k] = item.count;
      stamps[k] = now;
    });
    if (changed) persist();
  }

  function remember(name, count) {
    counts[String(name).toLowerCase()] = count;
    stamps[String(name).toLowerCase()] = Date.now();
    persist();
  }

  function exact(name, list) {
    var want = String(name).toLowerCase();
    for (var i = 0; i < list.length; i++) {
      if (String(list[i].name).toLowerCase() === want) return list[i];
    }
    return null;
  }

  function countOf(name) {
    var key = String(name || "").toLowerCase();
    if (!key) return Promise.resolve(null);
    if (key in counts) return Promise.resolve(counts[key]);
    return search(key).then(function (list) {
      var hit = exact(key, list);
      remember(key, hit ? hit.count : null);
      return hit ? hit.count : null;
    });
  }

  // Resuelve un nombre suelto («raven», «bruja escarlata») a la etiqueta real más probable.
  function canonical(name) {
    var q = String(name || "").trim();
    if (!q) return Promise.resolve(null);
    return search(q.replace(/\s+/g, "_")).then(function (list) {
      if (!list.length) return null;
      var hit = exact(q.replace(/\s+/g, "_"), list);
      if (hit) return { name: hit.name, count: hit.count, exact: true };
      var best = list[0];
      for (var i = 1; i < list.length; i++) {
        if (list[i].count > best.count) best = list[i];
      }
      return { name: best.name, count: best.count, exact: false };
    });
  }

  function hasKey() {
    var s = R.settings;
    return !!(s && s.apiUser && s.apiKey);
  }

  function dapi(params) {
    if (!hasKey()) return Promise.reject(new Error("Falta el user_id o la api_key"));
    var url = DAPI + "?" + params + "&user_id=" + encodeURIComponent(R.settings.apiUser) + "&api_key=" + encodeURIComponent(R.settings.apiKey);
    return fetch(url, { credentials: "omit" }).then(function (r) {
      return r.text();
    });
  }

  // Lista de etiquetas real del post (con tipos) según la API; null si no hay clave o falla.
  function postTags(postId) {
    if (!postId || !hasKey()) return Promise.resolve(null);
    return dapi("page=dapi&s=post&q=index&json=1&id=" + encodeURIComponent(postId) + "&fields=tag_info")
      .then(function (text) {
        var data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          return null;
        }
        if (!Array.isArray(data) || !data.length) return null;
        var post = data[0];
        var info = post.tag_info;
        if (Array.isArray(info)) {
          return info
            .map(function (t) {
              var name = typeof t === "string" ? t : t.tag || t.name;
              return name ? { name: name, type: (t && t.type) || "" } : null;
            })
            .filter(Boolean);
        }
        if (typeof post.tags === "string") {
          return post.tags.split(/\s+/).filter(Boolean).map(function (name) {
            return { name: name, type: "" };
          });
        }
        return null;
      })
      .catch(function () {
        return null;
      });
  }

  function probe() {
    var out = { items: [] };
    return search("rule").then(function (list) {
      out.items.push({
        ok: list.length > 0,
        label: "Autocompletado (sin clave)",
        detail: list.length ? list.length + " resultados, ejemplo: " + list[0].name + " (" + util.pretty(list[0].count) + ")" : "sin resultados"
      });
      if (!hasKey()) {
        out.items.push({
          ok: false,
          label: "API con cuenta (user_id + api_key)",
          detail: "Faltan datos. Se piden en rule34.xxx \u2192 Ajustes de la cuenta \u2192 Options."
        });
        return out;
      }
      return dapi("page=dapi&s=post&q=index&json=1&limit=1&fields=tag_info").then(function (text) {
        var data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          data = null;
        }
        var post = Array.isArray(data) && data.length ? data[0] : null;
        out.items.push({
          ok: !!(post && post.tag_info),
          label: "Posts con tag_info",
          detail: post ? "post " + post.id + ", " + (post.tag_info ? post.tag_info.length + " etiquetas con tipo" : "sin tag_info") : String(text).slice(0, 90)
        });
      })
        .then(function () {
          return dapi("page=dapi&s=tag&q=index&json=1&limit=1&name=large_breasts");
        })
        .then(function (text) {
          var data;
          try {
            data = JSON.parse(text);
          } catch (e) {
            data = null;
          }
          var tag = Array.isArray(data) && data.length ? data[0] : null;
          out.items.push({
            ok: !!tag,
            label: "B\u00fasqueda de etiqueta por nombre",
            detail: tag ? tag.name + " (" + util.pretty(tag.count) + ")" : String(text).slice(0, 90)
          });
          return out;
        })
        .catch(function (e) {
          out.items.push({ ok: false, label: "API con cuenta", detail: e && e.message ? e.message : String(e) });
          return out;
        });
    });
  }

  R.api = {
    search: search,
    counts: counts,
    countOf: countOf,
    canonical: canonical,
    remember: remember,
    hasKey: hasKey,
    postTags: postTags,
    probe: probe
  };
})();

(function () {
  "use strict";
  var R = window.__r34g;
  if (!R || R.modal) return;
  R.modal = true;
  var util = R.util;

  var MODAL_ID = "r34g-modal";
  var active = null;
  var lastFocus = null;

  function panelActions(panel) {
    if (!panel) return [];
    return panel.actions || [];
  }

  function selectTab(key) {
    var modal = document.getElementById(MODAL_ID);
    if (!modal) return;
    active = key;
    modal.querySelectorAll("[data-r34g-tab]").forEach(function (tab) {
      tab.classList.toggle("r34g-tab-active", tab.dataset.r34gTab === key);
    });
    modal.querySelectorAll("[data-r34g-panel]").forEach(function (p) {
      p.classList.toggle("r34g-panel-active", p.dataset.r34gPanel === key);
    });
    var host = modal.querySelector(".r34g-panel-actions");
    if (host) {
      host.innerHTML = "";
      var panel = R.panels.filter(function (p) {
        return p.key === key;
      })[0];
      panelActions(panel).forEach(function (action) {
        var b = util.el("button", "r34g-btn " + (action.cls || ""), action.label);
        b.type = "button";
        b.title = action.title || action.label;
        b.addEventListener("click", function () {
          action.onClick(b);
        });
        host.appendChild(b);
      });
    }
    try {
      localStorage.setItem("r34g.tab.v1", key);
    } catch (e) {}
  }

  R.selectTab = selectTab;

  function build() {
    if (document.getElementById(MODAL_ID)) return;
    var ORDER = ["gallery", "downloads", "video", "tags", "enhancer", "changelog"];
    R.panels.sort(function (a, b) {
      var ia = ORDER.indexOf(a.key);
      var ib = ORDER.indexOf(b.key);
      if (ia === -1) ia = ORDER.length;
      if (ib === -1) ib = ORDER.length;
      return ia - ib;
    });
    var modal = util.el("div");
    modal.id = MODAL_ID;

    var head = util.el("div", "r34g-head");
    var title = util.el("div", "r34g-title");
    title.appendChild(util.icon("bolt"));
    title.appendChild(util.el("span", "r34g-title-text", "Ajustes"));
    head.appendChild(title);

    var tabs = util.el("div", "r34g-tabs");
    R.panels.forEach(function (panel) {
      var b = util.el("button", "r34g-tab", panel.label);
      b.type = "button";
      b.dataset.r34gTab = panel.key;
      b.addEventListener("click", function () {
        selectTab(panel.key);
      });
      tabs.appendChild(b);
    });
    head.appendChild(tabs);

    var close = util.el("button", "r34g-close", "\u00d7");
    close.type = "button";
    close.title = "Cerrar";
    close.addEventListener("click", closeModal);
    head.appendChild(close);
    modal.appendChild(head);

    var dialog = util.el("div", "r34g-dialog");
    dialog.appendChild(head);
    var body = util.el("div", "r34g-body");
    R.panels.forEach(function (panel) {
      var p = util.el("div", "r34g-panel");
      p.dataset.r34gPanel = panel.key;
      body.appendChild(p);
      try {
        panel.build(p);
      } catch (e) {
        p.appendChild(util.el("p", "r34g-hint", "No se pudo construir esta sección: " + e.message));
      }
    });
    dialog.appendChild(body);

    var foot = util.el("div", "r34g-foot");
    var reset = util.el("button", "r34g-btn", "Restablecer ajustes de la suite");
    reset.type = "button";
    reset.title = "Devuelve galería, vídeo y etiquetas a sus valores por defecto (no toca las opciones de Mejoras)";
    reset.addEventListener("click", function () {
      R.resetSettings();
      util.toast("Ajustes de la suite restablecidos");
    });
    var spacer = util.el("span", "r34g-spacer");
    var actions = util.el("span", "r34g-panel-actions");
    var closeBtn = util.el("button", "r34g-btn", "Cerrar");
    closeBtn.type = "button";
    closeBtn.addEventListener("click", closeModal);
    foot.appendChild(reset);
    foot.appendChild(spacer);
    foot.appendChild(actions);
    foot.appendChild(closeBtn);
    dialog.appendChild(foot);

    modal.appendChild(dialog);

    modal.addEventListener("mousedown", function (e) {
      if (e.target === modal) closeModal();
    });

    document.body.appendChild(modal);
    selectTab(active || R.panels[0].key);
  }

  R.buildModal = build;

  function openModal(tab) {
    build();
    var modal = document.getElementById(MODAL_ID);
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.classList.add("r34g-open");
    document.documentElement.classList.add("r34g-modal-open");
    var key = tab;
    if (!key) {
      try {
        key = localStorage.getItem("r34g.tab.v1") || "";
      } catch (e) {}
    }
    if (!key || !R.panels.some(function (p) {
      return p.key === key;
    })) key = R.panels[0].key;
    selectTab(key);
    var first = modal.querySelector(".r34g-tab");
    if (first && first.focus) setTimeout(function () {
      first.focus();
    }, 30);
  }

  R.openModal = openModal;

  function closeModal() {
    var modal = document.getElementById(MODAL_ID);
    if (!modal) return;
    modal.classList.remove("r34g-open");
    document.documentElement.classList.remove("r34g-modal-open");
    var cancel = document.getElementById("ibenhancerSettingsCancel");
    if (cancel && R.enhancerIntegrated) {
      try {
        cancel.click();
      } catch (e) {}
    }
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  R.closeModal = closeModal;

  function buildNavItem() {
    var nav = document.getElementById("subnavbar") || document.getElementById("navbar");
    var item = document.getElementById("r34g-nav-item");
    if (!item) {
      item = util.el("li");
      item.id = "r34g-nav-item";
      var link = util.el("a");
      link.href = "#";
      link.title = "Ajustes de la galería, vídeos, etiquetas y mejoras";
      link.appendChild(util.icon("bolt"));
      link.appendChild(document.createTextNode(" Ajustes"));
      link.addEventListener("click", function (e) {
        e.preventDefault();
        openModal();
      });
      item.appendChild(link);
    }
    if (nav) nav.appendChild(item);
    else if (!item.parentNode) document.body.appendChild(item);
  }

  // La barra de navegaci\u00f3n de rule34 puede aparecer m\u00e1s tarde (o no existir, como en el editor),
  // as\u00ed que insistimos un rato y, adem\u00e1s, dejamos un bot\u00f3n flotante siempre visible.
  function buildNavItemSoon(tries) {
    buildNavItem();
    var nav = document.getElementById("subnavbar") || document.getElementById("navbar");
    if (nav || tries >= 40) return;
    setTimeout(function () {
      buildNavItemSoon((tries || 0) + 1);
    }, 500);
  }

  function buildFab() {
    var fab = document.getElementById("r34g-fab");
    if (!fab) {
      fab = util.el("button", "r34g-fab");
      fab.id = "r34g-fab";
      fab.type = "button";
      fab.title = "Ajustes: clave de rule34 (API), motor de IA, cuadr\u00edcula, v\u00eddeos, etiquetas\u2026";
      fab.appendChild(util.icon("bolt"));
      fab.appendChild(util.el("span", "r34g-fab-text", "Ajustes"));
      fab.addEventListener("click", function (e) {
        e.preventDefault();
        openModal();
      });
    }
    if (!fab.parentNode) document.body.appendChild(fab);
  }

  R.buildFab = buildFab;

  R.onReady(function () {
    build();
    buildNavItemSoon(0);
    buildFab();

    document.addEventListener("keydown", function (e) {
      var modal = document.getElementById(MODAL_ID);
      if (modal && e.key === "Escape" && modal.classList.contains("r34g-open")) closeModal();
    });
  });
})();

(function () {
  "use strict";
  var R = window.__r34g;
  if (!R || R.gallery) return;
  R.gallery = true;
  var util = R.util;
  var ui = R.ui;

  var THUMB_SEL = ".image-list .thumb";

  function postIdOf(thumb) {
    var a = thumb.querySelector("a[href*='id=']") || thumb.querySelector("a");
    var id = a ? util.postIdFromHref(a.getAttribute("href")) : "";
    if (!id && thumb.id) {
      var m = /^s(\d+)$/.exec(thumb.id);
      if (m) id = m[1];
    }
    return id;
  }

  R.postIdOfThumb = postIdOf;

  function tagInfo(img) {
    var title = (img && (img.getAttribute("title") || img.getAttribute("alt"))) || "";
    var raw = title.toLowerCase();
    var out = { video: false, gif: false, sound: false, tags: [] };
    if (/\b(webm|mp4|video)\b/.test(raw) || (img && /(^|\s)webm-thumb(\s|$)/.test(img.className))) out.video = true;
    if (/\b(animated_gif|gif)\b/.test(raw)) out.gif = true;
    if (/\b(sound|audio|has_sound)\b/.test(raw)) out.sound = true;
    out.tags = title
      .replace(/\b(score|rating|user|id|date|status|size|source|tags)\s*:\s*/gi, " ")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .filter(Boolean)
      .slice(0, 40);
    return out;
  }

  function seenBadge(thumb) {
    var id = postIdOf(thumb);
    var badge = thumb.querySelector(".r34g-seen-badge");
    var isSeen = R.settings.seen && id && R.seen.has(id);
    thumb.classList.toggle("r34g-seen", !!isSeen);
    if (!isSeen) {
      if (badge) badge.remove();
      return;
    }
    if (!badge) {
      badge = util.el("span", "r34g-seen-badge");
      badge.title = "Ya visto en este navegador";
      badge.appendChild(util.icon("eye"));
      var link = thumb.querySelector("a") || thumb;
      link.appendChild(badge);
    }
  }

  function enhanceThumb(thumb) {
    if (!thumb || thumb.dataset.r34gDone) {
      if (thumb) seenBadge(thumb);
      return;
    }
    thumb.dataset.r34gDone = "1";
    var img = thumb.querySelector("img");
    var link = thumb.querySelector("a") || thumb;

    if (img && !img.dataset.r34gWatch) {
      img.dataset.r34gWatch = "1";
      img.setAttribute("loading", "lazy");
      img.setAttribute("decoding", "async");
      if (img.complete && img.naturalWidth > 0) img.classList.add("r34g-ready");
      else {
        img.addEventListener("load", function () {
          img.classList.add("r34g-ready");
        }, { once: true });
        img.addEventListener("error", function () {
          img.classList.add("r34g-ready");
        }, { once: true });
      }
    }

    var info = tagInfo(img || thumb);

    var badges = util.el("span", "r34g-badges");
    if (info.video) badges.appendChild(util.el("span", "r34g-badge r34g-video", "\u25b6"));
    if (info.gif) badges.appendChild(util.el("span", "r34g-badge r34g-gif", "GIF"));
    if (info.sound) badges.appendChild(util.el("span", "r34g-badge r34g-sound", "\u266a"));
    if (badges.childElementCount) link.appendChild(badges);

    if (info.tags.length) {
      var meta = util.el("span", "r34g-meta");
      meta.appendChild(util.el("span", "r34g-taglist", info.tags.slice(0, 14).join(" \u00b7 ")));
      link.appendChild(meta);
    }

    var score = thumb.querySelector(".score-info");
    if (score && !score.dataset.r34gCompact) {
      score.dataset.r34gCompact = "1";
      var num = (score.textContent.match(/-?\d+/) || [])[0];
      score.textContent = num != null ? "\u2605 " + num : "\u2605";
    }

    seenBadge(thumb);
  }

  function enhanceGallery(root) {
    var scope = root && root.querySelectorAll ? root : document;
    if (scope.classList && scope.classList.contains("thumb")) {
      enhanceThumb(scope);
      return;
    }
    scope.querySelectorAll(THUMB_SEL).forEach(enhanceThumb);
  }

  R.enhanceGallery = enhanceGallery;
  R.refreshSeenBadges = function () {
    document.querySelectorAll(THUMB_SEL).forEach(seenBadge);
  };

  function watchGallery() {
    var list = document.querySelector(".image-list");
    if (!list || list.dataset.r34gWatch) return;
    list.dataset.r34gWatch = "1";
    enhanceGallery(list);
    list.addEventListener(
      "click",
      function (e) {
        var a = e.target.closest(THUMB_SEL + " > a");
        if (!a) return;
        var id = util.postIdFromHref(a.getAttribute("href"));
        if (id) {
          R.seen.add(id);
          var thumb = a.closest(".thumb");
          if (thumb) seenBadge(thumb);
        }
      },
      true
    );
    var mo = new MutationObserver(function (records) {
      records.forEach(function (r) {
        r.addedNodes.forEach(function (n) {
          if (n.nodeType === 1) enhanceGallery(n);
        });
      });
    });
    mo.observe(list, { childList: true, subtree: true });
  }

  R.watchGallery = watchGallery;

  var GRID_BAR_ID = "r34g-grid-bar";
  var GRID_MIN = 110;
  var GRID_MAX = 400;
  var GRID_TINY = 120;

  function clampSize(n) {
    return Math.max(GRID_MIN, Math.min(GRID_MAX, Math.round(n)));
  }

  function gridTarget() {
    var n = util.num(R.settings.thumbSize);
    if (!n || n <= 0) return 0;
    return clampSize(n);
  }

  function gridAuto() {
    return !R.settings.cols || R.settings.cols === "auto";
  }

  // Columnas mínimas que hacen que ninguna tarjeta pase del tamaño pedido: con N columnas cada
  // tarjeta mide (ancho - (N-1)*hueco)/N, así que buscamos el N más pequeño que cumpla
  // (ancho + hueco) <= N * (tamaño + hueco).
  function gridCols(list) {
    var t = gridTarget();
    if (!t || !gridAuto()) return 0;
    var w = list.clientWidth;
    if (!w) return 0;
    var gap = parseFloat(getComputedStyle(list).columnGap);
    if (!isFinite(gap) || gap < 0) gap = 12;
    return Math.max(1, Math.ceil((w + gap) / (t + gap)));
  }

  function applyGridSize() {
    var list = document.querySelector(".image-list");
    if (!list) return 0;
    var cols = gridCols(list);
    if (cols) list.style.setProperty("--r34g-cols", String(cols));
    else list.style.removeProperty("--r34g-cols");
    var gap = parseFloat(getComputedStyle(list).columnGap);
    if (!isFinite(gap) || gap < 0) gap = 12;
    var w = list.clientWidth;
    var used = cols || parseFloat(getComputedStyle(list).getPropertyValue("--r34g-cols")) || 1;
    var cardW = w ? (w - (used - 1) * gap) / used : 0;
    markCardWidth(cardW);
    setupGrid.lastW = w;
    return cols;
  }

  // Con tarjetas muy estrechas los botones y el chip de puntuación se pisarían: avisamos por CSS
  // para encogerlos (y esconder la puntuación) en vez de dejar la esquina hecha un lío.
  function markCardWidth(cardW) {
    var tiny = cardW > 0 && cardW < GRID_TINY ? "tiny" : "normal";
    var h = document.documentElement;
    if (h.getAttribute("data-r34g-card") !== tiny) h.setAttribute("data-r34g-card", tiny);
    return tiny;
  }

  R.applyGridSize = applyGridSize;

  function gridCardWidth() {
    var list = document.querySelector(".image-list");
    var thumb = list && list.querySelector(".thumb");
    return thumb ? Math.round(thumb.getBoundingClientRect().width) : 0;
  }

  function syncGridBar() {
    var bar = document.getElementById(GRID_BAR_ID);
    if (!bar) return;
    var t = gridTarget();
    var range = bar.querySelector(".r34g-grid-range");
    var out = bar.querySelector(".r34g-grid-val");
    if (range && t && range.value !== String(t)) range.value = String(t);
    if (!out) return;
    var real = gridCardWidth();
    var text = t ? t + " px" + (real && Math.abs(real - t) > 8 ? " \u2192 " + real + " px" : "") : "\u2014";
    var title = t ? "M\u00e1ximo " + t + " px" + (real ? "; ahora miden " + real + " px" : "") : "Tama\u00f1o libre";
    if (out.textContent !== text) out.textContent = text;
    if (out.title !== title) out.title = title;
  }

  function setGridSize(value) {
    if (!gridAuto()) R.set("cols", "auto");
    R.set("thumbSize", clampSize(value));
    applyGridSize();
    syncGridBar();
  }

  function buildGridBar() {
    var existing = document.getElementById(GRID_BAR_ID);
    var list = document.querySelector(".image-list");
    if (!list || !list.parentNode) {
      if (existing) existing.remove();
      return;
    }
    if (existing) {
      syncGridBar();
      return;
    }
    var bar = util.el("div", "r34g-grid-bar");
    bar.id = GRID_BAR_ID;
    var label = util.el("span", "r34g-grid-label", "Miniaturas");
    label.title = "Reduce o agranda los cuadrados de la galer\u00eda (tambi\u00e9n con Alt + rueda sobre la cuadr\u00edcula)";
    bar.appendChild(label);

    var minus = util.el("button", "r34g-grid-btn", "\u2212");
    minus.type = "button";
    minus.title = "M\u00e1s peque\u00f1as";
    minus.addEventListener("click", function () {
      setGridSize((gridTarget() || 200) - 20);
    });
    bar.appendChild(minus);

    var range = util.el("input", "r34g-grid-range");
    range.type = "range";
    range.min = String(GRID_MIN);
    range.max = String(GRID_MAX);
    range.step = "5";
    range.value = String(gridTarget() || 200);
    range.title = "Tama\u00f1o máximo de cada miniatura";
    range.addEventListener("input", function () {
      setGridSize(Number(range.value));
    });
    bar.appendChild(range);

    var plus = util.el("button", "r34g-grid-btn", "+");
    plus.type = "button";
    plus.title = "M\u00e1s grandes";
    plus.addEventListener("click", function () {
      setGridSize((gridTarget() || 200) + 20);
    });
    bar.appendChild(plus);

    var out = util.el("span", "r34g-grid-val");
    bar.appendChild(out);

    var natural = util.el("button", "r34g-grid-btn", "Natural");
    natural.type = "button";
    natural.title = "Tama\u00f1o original de las miniaturas de rule34 (\u2248250 px): n\u00edtidas y ocupando menos";
    natural.addEventListener("click", function () {
      setGridSize(250);
    });
    bar.appendChild(natural);

    var compact = util.el("button", "r34g-grid-btn", "Compacto");
    compact.type = "button";
    compact.title = "Miniaturas peque\u00f1as (130 px): muchas m\u00e1s por fila";
    compact.addEventListener("click", function () {
      setGridSize(130);
    });
    bar.appendChild(compact);

    list.parentNode.insertBefore(bar, list);
    syncGridBar();
  }

  function setupGrid() {
    applyGridSize();
    buildGridBar();
    if (setupGrid.on) return;
    setupGrid.on = true;
    var pending = false;
    var relayout = function () {
      pending = false;
      applyGridSize();
      syncGridBar();
    };
    // el cambio de columnas cambia la altura de la cuadrícula y algunos navegadores se quejan
    // («ResizeObserver loop»): lo hacemos fuera de la entrega del observador y solo si el ancho cambió.
    var schedule = function () {
      if (pending) return;
      pending = true;
      setTimeout(relayout, 0);
    };
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener(
      "wheel",
      function (e) {
        if (!e.altKey || !e.target || !e.target.closest) return;
        if (!e.target.closest(".image-list")) return;
        e.preventDefault();
        var next = clampSize((gridTarget() || 200) + (e.deltaY < 0 ? 20 : -20));
        setGridSize(next);
        util.toast("Miniaturas: " + next + " px", 1100);
      },
      { passive: false }
    );
    if (window.ResizeObserver && document.body) {
      var ro = new ResizeObserver(function () {
        var list = document.querySelector(".image-list");
        if (!list || !list.clientWidth || list.clientWidth === setupGrid.lastW) return;
        schedule();
      });
      ro.observe(document.body);
      var list = document.querySelector(".image-list");
      if (list) ro.observe(list);
    }
    // red de seguridad: en algunos navegadores (o con la pestaña oculta) ni el evento resize ni el
    // ResizeObserver avisan, y la cuadrícula se queda con las columnas del ancho anterior.
    setInterval(function () {
      var list = document.querySelector(".image-list");
      if (!list) return;
      var w = list.clientWidth;
      if (!w || w === setupGrid.lastW) return;
      relayout();
    }, 1000);
  }

  R.syncGridBar = syncGridBar;
  R.applySettingsGrid = function () {
    applyGridSize();
    syncGridBar();
    buildGridBar();
  };

  function buildTagFilter() {
    var tagList = document.querySelector(".sidebar ul");
    if (!tagList || document.getElementById("r34g-tag-filter")) return;
    var input = util.el("input");
    input.type = "search";
    input.id = "r34g-tag-filter";
    input.placeholder = "Filtrar etiquetas\u2026";
    input.autocomplete = "off";
    input.spellcheck = false;
    tagList.parentNode.insertBefore(input, tagList);
    var box = util.el("div", "r34g-suggest");
    box.hidden = true;
    tagList.parentNode.insertBefore(box, tagList);
    var sugTimer = 0;
    var sugSeq = 0;

    function hideSuggest() {
      box.hidden = true;
      box.innerHTML = "";
    }

    function suggest(q) {
      clearTimeout(sugTimer);
      if (!R.api || q.length < 2) {
        hideSuggest();
        return;
      }
      var seq = ++sugSeq;
      sugTimer = setTimeout(function () {
        R.api.search(q).then(function (list) {
          if (seq !== sugSeq) return;
          var top = list.slice(0, 8);
          if (!top.length) {
            hideSuggest();
            return;
          }
          box.innerHTML = "";
          top.forEach(function (item) {
            var b = util.el("button", "r34g-suggest-row");
            b.type = "button";
            b.appendChild(util.el("span", "r34g-suggest-name", item.name));
            b.appendChild(util.el("span", "r34g-suggest-count", util.pretty(item.count)));
            b.addEventListener("mousedown", function (e) {
              e.preventDefault();
              goToTag(item.name);
            });
            box.appendChild(b);
          });
          box.hidden = false;
        });
      }, 220);
    }

    function goToTag(name) {
      var form = document.querySelector(".tag-search form");
      var field = form && form.querySelector("input[name='tags']");
      if (field) {
        field.value = name;
        form.submit();
      } else {
        location.href = "index.php?page=post&s=list&tags=" + encodeURIComponent(name);
      }
    }

    var raf = 0;
    input.addEventListener("input", function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        var q = input.value.trim().toLowerCase();
        var items = tagList.querySelectorAll("li");
        items.forEach(function (li) {
          if (li.querySelector("h6")) return;
          var hit = !q || (li.textContent || "").toLowerCase().indexOf(q) !== -1;
          li.classList.toggle("r34g-tag-hidden", !hit);
        });
      });
      suggest(input.value.trim());
    });
    input.addEventListener("blur", function () {
      setTimeout(hideSuggest, 120);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        hideSuggest();
        input.value = "";
        input.dispatchEvent(new Event("input"));
        input.blur();
      }
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        var v = input.value.trim();
        if (!v) return;
        goToTag(v);
      }
    });
  }

  function isEmptyAd(node) {
    return !node.querySelector("iframe, img, video, object, embed") && !(node.textContent || "").trim();
  }

  function collapseEmptyAdSlots() {
    var ads = document.querySelectorAll("ins[data-zoneid], ins[id^='aswift'], ins[class^='eas'], .boxer_ad, .postListSidebarRight, .postListSidebarLeft");
    ads.forEach(function (ad) {
      if (!isEmptyAd(ad)) return;
      var holder =
        ad.closest("span[data-nosnippet]") ||
        (ad.parentElement && ad.parentElement.classList.contains("postListSidebarRight") ? ad.parentElement : null) ||
        ad;
      if (!holder || holder === document.body) return;
      if (holder.classList.contains("r34g-ad-hidden")) return;
      if (!isEmptyAd(holder)) return;
      holder.classList.add("r34g-ad-hidden");
      var obs = new MutationObserver(function () {
        if (!isEmptyAd(holder)) {
          holder.classList.remove("r34g-ad-hidden");
          obs.disconnect();
        }
      });
      obs.observe(holder, { childList: true, subtree: true });
    });
  }

  function buildPageTools() {
    var sidebar = document.querySelector(".sidebar");
    if (sidebar && !document.getElementById("r34g-drawer-head")) {
      var head = util.el("div");
      head.id = "r34g-drawer-head";
      head.appendChild(util.el("h5", null, "Etiquetas"));
      var close = util.el("button", null, "\u00d7");
      close.id = "r34g-drawer-close";
      close.type = "button";
      close.title = "Cerrar";
      close.addEventListener("click", function () {
        document.documentElement.classList.remove("r34g-drawer-open");
      });
      head.appendChild(close);
      sidebar.insertBefore(head, sidebar.firstChild);
    }

    if (sidebar && !document.getElementById("r34g-drawer-backdrop")) {
      var backdrop = util.el("div");
      backdrop.id = "r34g-drawer-backdrop";
      backdrop.addEventListener("click", function () {
        document.documentElement.classList.remove("r34g-drawer-open");
      });
      document.body.appendChild(backdrop);
    }

    if (sidebar && !document.getElementById("r34g-sidebar-toggle")) {
      var toggle = util.el("button", null, "\u2630");
      toggle.id = "r34g-sidebar-toggle";
      toggle.type = "button";
      toggle.title = "Mostrar etiquetas";
      toggle.addEventListener("click", function () {
        document.documentElement.classList.toggle("r34g-drawer-open");
      });
      document.body.appendChild(toggle);
    }

    if (!document.getElementById("r34g-to-top")) {
      var btn = util.el("button", null, "\u2191");
      btn.id = "r34g-to-top";
      btn.type = "button";
      btn.title = "Volver arriba";
      btn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      document.body.appendChild(btn);
      var sync = function () {
        btn.classList.toggle("r34g-visible", window.scrollY > 600);
      };
      window.addEventListener("scroll", sync, { passive: true });
      sync();
    }
  }

  function buildPanel(panel) {
    var grid = ui.section(panel, "Cuadr\u00edcula", "Las tarjetas se reparten el ancho de la p\u00e1gina. Con columnas en \u00abAuto\u00bb el n\u00famero se calcula a partir del tama\u00f1o de miniatura, as\u00ed que nunca salen m\u00e1s grandes de lo que pidas.");
    ui.seg({
      section: grid,
      key: "cols",
      title: "Columnas",
      note: "Auto = seg\u00fan el ancho y el tama\u00f1o de abajo. Un n\u00famero fijo manda sobre el tama\u00f1o.",
      options: [
        { label: "Auto", value: "auto", title: "Calcula las columnas para que quepan miniaturas del tama\u00f1o elegido" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "5", value: "5" },
        { label: "6", value: "6" },
        { label: "7", value: "7" }
      ]
    });
    ui.number({
      section: grid,
      key: "thumbSize",
      title: "Tama\u00f1o de miniatura",
      note: "M\u00e1ximo en p\u00edxeles. Si reduces este valor, caben m\u00e1s por fila. Atajo: Alt + rueda del rat\u00f3n sobre la galer\u00eda.",
      min: GRID_MIN,
      max: GRID_MAX,
      step: 5,
      suffix: "px",
      event: "input"
    });
    var sizeRow = util.el("div", "r34g-mini-row");
    var presets = [
      { label: "Muy peque\u00f1as (110)", value: 110 },
      { label: "Peque\u00f1as (160)", value: 160 },
      { label: "Natural (250)", value: 250, title: "El tama\u00f1o original de las miniaturas de rule34: se ven n\u00edtidas, sin ampliar" }
    ];
    presets.forEach(function (p) {
      var b = util.el("button", "r34g-mini", p.label);
      b.type = "button";
      if (p.title) b.title = p.title;
      b.addEventListener("click", function () {
        setGridSize(p.value);
        util.toast("Miniaturas: " + p.value + " px");
      });
      sizeRow.appendChild(b);
    });
    grid.appendChild(sizeRow);
    ui.toggle({
      section: grid,
      key: "gridBar",
      title: "Barra de tama\u00f1o sobre la galer\u00eda",
      note: "Control r\u00e1pido (deslizador y botones) encima de las miniaturas, sin abrir este panel."
    });
    ui.seg({
      section: grid,
      key: "aspect",
      title: "Proporci\u00f3n de tarjeta",
      options: [
        { label: "1:1", value: "1" },
        { label: "4:5", value: "4/5" },
        { label: "3:4", value: "3x4" },
        { label: "Original", value: "auto" }
      ]
    });
    ui.seg({
      section: grid,
      key: "fit",
      title: "Ajuste de la imagen",
      options: [
        { label: "Recortar", value: "cover", title: "Rellena la tarjeta recortando los bordes" },
        { label: "Completa", value: "contain", title: "Muestra la imagen entera con bandas" }
      ]
    });

    var card = ui.section(panel, "Detalles de la tarjeta");
    ui.toggle({ section: card, key: "score", title: "Mostrar puntuaci\u00f3n", note: "Chip \u2605 con el score de cada post." });
    ui.toggle({ section: card, key: "badges", title: "Mostrar tipo de contenido", note: "Insignias \u25b6 v\u00eddeo, GIF y \u266a sonido." });
    ui.toggle({ section: card, key: "hover", title: "Zoom al pasar el rat\u00f3n", note: "Agranda ligeramente la miniatura." });
    ui.toggle({
      section: card,
      key: "lb",
      title: "Vista r\u00e1pida al pulsar una miniatura",
      note: "Abre la imagen o el v\u00eddeo encima de la galer\u00eda en vez de ir a la p\u00e1gina del post. Flechas para pasar, D descargar, M marcar, O abrir el post, Esc cerrar. Con Ctrl o bot\u00f3n central sigues abriendo el post en otra pesta\u00f1a."
    });

    var seen = ui.section(panel, "Ya visto", "El historial se guarda en la cach\u00e9 de este navegador (localStorage), as\u00ed que es privado y por usuario.");
    ui.toggle({ section: seen, key: "seen", title: "\u00cdcono de ya visto", note: "Marca con un ojo las miniaturas que ya abriste." });
    ui.toggle({ section: seen, key: "seenDim", title: "Atenuar los ya vistos", note: "Baja el brillo de las miniaturas vistas." });
    var countEl = util.el("span", "r34g-note");
    ui.button({
      section: seen,
      title: "Historial de vistos",
      label: "Borrar historial",
      extra: countEl,
      onClick: function () {
        R.seen.clear();
        R.refreshSeenBadges();
        syncCount();
        util.toast("Historial de vistos borrado");
      }
    });
    function syncCount() {
      var n = R.seen.size();
      countEl.textContent = n === 1 ? "1 post guardado" : util.pretty(n) + " posts guardados";
    }
    syncCount();
    R.changeHooks.push(function () {
      R.refreshSeenBadges();
      syncCount();
    });

    var side = ui.section(panel, "Panel lateral y navegaci\u00f3n");
    ui.toggle({ section: side, key: "sticky", title: "Panel de etiquetas fijo", note: "Mantiene las etiquetas visibles al hacer scroll." });
    ui.toggle({ section: side, key: "filter", title: "Buscador de etiquetas", note: "Filtro instant\u00e1neo de la lista; Enter busca ese tag." });
    ui.toggle({
      section: side,
      key: "fab",
      title: "Bot\u00f3n flotante de Ajustes (abajo a la derecha)",
      note: "Siempre a mano: ah\u00ed est\u00e1n la clave de rule34, el motor de IA y todas las opciones."
    });
    ui.button({
      section: side,
      title: "Ocultar los huecos de publicidad vac\u00edos",
      label: "Limpiar huecos de anuncios",
      onClick: function () {
        collapseEmptyAdSlots();
        util.toast("Huecos vac\u00edos revisados");
      }
    });
  }

  R.panel({
    key: "gallery",
    label: "Galer\u00eda",
    build: buildPanel
  });

  R.onReady(function () {
    watchGallery();
    setupGrid();
    var hasGallery = !!document.querySelector(".image-list");
    var hasTags = !!document.getElementById("tag-sidebar");
    if (hasGallery || hasTags) buildPageTools();
    if (hasGallery) {
      collapseEmptyAdSlots();
      setTimeout(collapseEmptyAdSlots, 1500);
      setTimeout(collapseEmptyAdSlots, 4000);
    }
    buildTagFilter();
    var id = util.currentPostId();
    if (id && R.settings.seen) R.seen.add(id);
    R.changeHooks.push(function () {
      setupGrid();
      applyGridSize();
      syncGridBar();
    });
  });
})();

(function () {
  "use strict";
  var R = window.__r34g;
  if (!R || R.enhancer) return;
  R.enhancer = true;
  var util = R.util;
  var ui = R.ui;

  var LABELS = {
    resizeImageToFitCheckbox: "Ajustar las im\u00e1genes a la pantalla",
    resizeVideoToFitCheckbox: "Ajustar los v\u00eddeos a la pantalla",
    autoplayVideosCheckbox: "Reproducir los v\u00eddeos autom\u00e1ticamente",
    autoScrollToContentCheckbox: "Bajar autom\u00e1ticamente al contenido",
    updateWithWindowResizeCheckbox: "Reajustar el contenido con la ventana",
    updateScrollOnWindowResizeCheckbox: "Reajustar el scroll con la ventana",
    showFitButtonCheckbox: "Mostrar el bot\u00f3n \u00abAjustar\u00bb",
    showScrollButtonCheckbox: "Mostrar el bot\u00f3n \u00abDesplazar\u00bb",
    showVotingButtonsCheckbox: "Botones de me gusta y favorito",
    removeFluidCheckbox: "Quitar el reproductor Fluid",
    enableEnhancedThumbnailsCheckbox: "Miniaturas ampliadas al pasar el rat\u00f3n",
    enableEnhancedThumbnailsDetailsCheckbox: "Detalles del post con clic derecho",
    alwaysShowScrollbarsCheckbox: "Mostrar siempre las barras de scroll",
    enableZoomableImageCheckbox: "Imagen con zoom",
    showFavoriteTagsCheckbox: "Etiquetas favoritas en el panel",
    defaultClickActionSelect: "Abrir las miniaturas en",
    maxZoomInput: "Zoom m\u00e1ximo",
    zoomSpeedInput: "Velocidad del zoom",
    videoVolumeInput: "Volumen de los v\u00eddeos",
    iconSizeInput: "Tama\u00f1o de los iconos",
    resizeButton: "Atajo para ajustar",
    scrollButton: "Atajo para desplazar",
    deleteTagDbButton: "Borrar la base de datos de etiquetas",
    hideIconGifCheckbox: "GIF",
    hideIconVideoCheckbox: "V\u00eddeo",
    hideIconSoundCheckbox: "Sonido",
    hideIconFlashCheckbox: "Flash",
    hideIconStraightCheckbox: "Hetero",
    hideIconGayCheckbox: "Yaoi / Gay",
    hideIconLesbianCheckbox: "Yuri / Lesbianas",
    hideIconTransCheckbox: "Futanari / Trans",
    hideIconTrapCheckbox: "Trap",
    hideIconThreeDCheckbox: "3D",
    hideIconLoliCheckbox: "Loli",
    hideIconShotaCheckbox: "Shota",
    hideIconGoreDeathCheckbox: "Gore / Muerte",
    hideIconPregnantCheckbox: "Embarazo",
    hideIconBestialityCheckbox: "Bestialismo",
    hideIconFeetCheckbox: "Pies / Footjob",
    hideIconBondageCheckbox: "Bondage / BDSM",
    hideIconPoopCheckbox: "Scat",
    hideIconPissCheckbox: "Lluvia dorada",
    hideIconGroupCheckbox: "Grupo / Gangbang",
    hideIconIncestCheckbox: "Incesto",
    hideIconBukkakeCheckbox: "Bukkake",
    hideIconTentaclesCheckbox: "Tent\u00e1culos",
    hideIconRapeCheckbox: "Violaci\u00f3n",
    hideIconPublicCheckbox: "P\u00fablico",
    hideIconFurryCheckbox: "Furry",
    hideIconFatCheckbox: "BBW",
    hideIconHypnosisCheckbox: "Hipnosis",
    hideIconNtrCheckbox: "NTR",
    hideIconFemdomCheckbox: "Femdom / Dominatrix",
    hideIconAICheckbox: "Generada por IA",
    hideIconCensoredCheckbox: "Censurada",
    hideIconUncensoredCheckbox: "Sin censura",
    hideIconSafeCheckbox: "Rating: Safe",
    hideIconGeneralCheckbox: "Rating: General",
    hideIconQuestionableCheckbox: "Rating: Questionable",
    hideIconExplicitCheckbox: "Rating: Explicit",
    hideIconR15Checkbox: "Rating: R15+",
    hideIconR18Checkbox: "Rating: R18+"
  };

  var HINTS = {
    resizeImageToFitCheckbox: "Escala la imagen al alto y ancho de la ventana del navegador.",
    resizeVideoToFitCheckbox: "Escala el v\u00eddeo al alto y ancho de la ventana.",
    autoplayVideosCheckbox: "Los navegadores modernos bloquean el autoplay con sonido.",
    autoScrollToContentCheckbox: "Baja solo hasta el contenido del post al abrirlo.",
    updateWithWindowResizeCheckbox: "Vuelve a calcular el tama\u00f1o cuando cambias el tama\u00f1o de la ventana.",
    updateScrollOnWindowResizeCheckbox: "Vuelve a desplazarse al contenido al redimensionar.",
    showFitButtonCheckbox: "Bot\u00f3n flotante para ajustar la imagen o el v\u00eddeo a la pantalla.",
    showScrollButtonCheckbox: "Bot\u00f3n flotante para desplazarse al contenido.",
    showVotingButtonsCheckbox: "A\u00f1ade los botones de voto y favorito en la vista del post.",
    removeFluidCheckbox: "Sustituye el reproductor Fluid por los controles nativos del navegador.",
    enableEnhancedThumbnailsCheckbox: "Ampl\u00eda la miniatura bajo el cursor para verla en grande.",
    enableEnhancedThumbnailsDetailsCheckbox: "Con clic derecho sobre la miniatura ampliada muestra los datos del post.",
    alwaysShowScrollbarsCheckbox: "Evita el salto de layout cuando aparece la barra de scroll.",
    enableZoomableImageCheckbox: "Permite hacer zoom con la rueda del rat\u00f3n sobre la imagen.",
    showFavoriteTagsCheckbox: "Muestra el bloque de etiquetas favoritas en el panel lateral.",
    defaultClickActionSelect: "D\u00f3nde se abre el post al pulsar una miniatura ampliada.",
    videoVolumeInput: "0 es silencio y 1 el volumen m\u00e1ximo.",
    iconSizeInput: "Tama\u00f1o de los iconos de tipo de contenido sobre las miniaturas.",
    resizeButton: "Pulsa y despu\u00e9s una tecla para cambiar el atajo.",
    scrollButton: "Pulsa y despu\u00e9s una tecla para cambiar el atajo.",
    deleteTagDbButton: "Borra los colores de etiquetas guardados; se recalculan al navegar."
  };

  var ENHANCER_DEFAULTS = {
    resizeImageToFitCheckbox: true,
    resizeVideoToFitCheckbox: true,
    autoplayVideosCheckbox: true,
    autoScrollToContentCheckbox: true,
    updateWithWindowResizeCheckbox: true,
    updateScrollOnWindowResizeCheckbox: true,
    showFitButtonCheckbox: true,
    showScrollButtonCheckbox: true,
    showVotingButtonsCheckbox: true,
    removeFluidCheckbox: false,
    enableEnhancedThumbnailsCheckbox: true,
    enableEnhancedThumbnailsDetailsCheckbox: true,
    alwaysShowScrollbarsCheckbox: false,
    enableZoomableImageCheckbox: true,
    showFavoriteTagsCheckbox: true,
    defaultClickActionSelect: "new-tab",
    maxZoomInput: "1",
    zoomSpeedInput: "7",
    videoVolumeInput: "0",
    iconSizeInput: "36"
  };

  var SECTIONS = [
    {
      key: "viewer",
      title: "Visualizador de im\u00e1genes y v\u00eddeo",
      ids: [
        "resizeImageToFitCheckbox",
        "resizeVideoToFitCheckbox",
        "autoplayVideosCheckbox",
        "autoScrollToContentCheckbox",
        "updateWithWindowResizeCheckbox",
        "updateScrollOnWindowResizeCheckbox",
        "alwaysShowScrollbarsCheckbox",
        "removeFluidCheckbox",
        "enableZoomableImageCheckbox",
        "maxZoomInput",
        "zoomSpeedInput",
        "videoVolumeInput"
      ]
    },
    {
      key: "thumbnails",
      title: "Miniaturas y contenido",
      ids: [
        "enableEnhancedThumbnailsCheckbox",
        "enableEnhancedThumbnailsDetailsCheckbox",
        "defaultClickActionSelect",
        "iconSizeInput"
      ]
    },
    {
      key: "account",
      title: "Cuenta, votos y etiquetas favoritas",
      ids: ["showVotingButtonsCheckbox", "showFavoriteTagsCheckbox"]
    },
    {
      key: "misc",
      title: "Botones y atajos de teclado",
      ids: ["showFitButtonCheckbox", "showScrollButtonCheckbox", "resizeButton", "scrollButton"]
    }
  ];

  var SECTION_BY_ID = {};
  SECTIONS.forEach(function (s) {
    s.ids.forEach(function (id) {
      SECTION_BY_ID[id] = s.key;
    });
  });

  var panelEl = null;
  var searchInput = null;
  var searched = [];
  var enhancerReady = false;
  R.enhancerIntegrated = false;

  function controlOf(node) {
    return node.querySelector("input, select, button");
  }

  function cleanText(node, control) {
    var clone = node.cloneNode(true);
    clone.querySelectorAll("input, select, button, option, span.r34g-switch").forEach(function (n) {
      n.remove();
    });
    return (clone.textContent || "").replace(/\s+/g, " ").replace(/[\s:–-]+$/, "").trim();
  }

  function rangeNote(text) {
    var m = text.match(/(-?\d+(?:\.\d+)?\s*[-–]\s*-?\d+(?:\.\d+)?)\s*$/);
    return m ? m[1].replace(/\s+/g, " ") : "";
  }

  function snapshotValues(root) {
    var out = [];
    root.querySelectorAll("input, select").forEach(function (n) {
      out.push([n, n.type === "checkbox" || n.type === "radio" ? n.checked : n.value]);
    });
    return out;
  }

  function restoreValues(snap) {
    snap.forEach(function (pair) {
      var n = pair[0],
        v = pair[1];
      if (n.type === "checkbox" || n.type === "radio") n.checked = v;
      else n.value = v;
    });
  }

  function switchify(input) {
    if (!input || input.dataset.r34gSwitch || input.type !== "checkbox") return;
    var checked = input.checked;
    var wrap = util.el("span", "r34g-switch");
    var slider = util.el("span", "r34g-slider");
    input.replaceWith(wrap);
    wrap.appendChild(input);
    wrap.appendChild(slider);
    input.checked = checked;
    input.dataset.r34gSwitch = "1";
  }

  function row(title, hint, key) {
    var r = util.el("div", "r34g-row");
    r.dataset.r34gSearch = (title + " " + (hint || "")).toLowerCase();
    var l = util.el("span", "r34g-label", title);
    if (hint) l.appendChild(util.el("span", "r34g-note", hint));
    r.appendChild(l);
    if (key) r.dataset.r34gKey = key;
    return r;
  }

  function sectionBox(panel, title, hint) {
    var s = util.el("div", "r34g-section");
    s.dataset.r34gSearch = title.toLowerCase();
    s.appendChild(util.el("h6", null, title));
    if (hint) s.appendChild(util.el("p", "r34g-hint", hint));
    panel.appendChild(s);
    return s;
  }

  function collectValues() {
    var out = {};
    if (!panelEl) return out;
    panelEl.querySelectorAll("input[id], select[id]").forEach(function (n) {
      out[n.id] = n.type === "checkbox" ? n.checked : n.value;
    });
    return out;
  }

  function applyValues(map) {
    if (!panelEl) return 0;
    var n = 0;
    Object.keys(map).forEach(function (id) {
      var node = panelEl.querySelector("#" + CSS.escape(id)) || document.getElementById(id);
      if (!node) return;
      if (node.type === "checkbox") node.checked = !!map[id];
      else node.value = map[id];
      n++;
    });
    return n;
  }

  function integrate() {
    if (enhancerReady) return true;
    if (!panelEl) return false;
    var widget = document.getElementById("ibenhancer");
    var options = document.getElementById("ibenhancerSettings-options");
    if (!widget || !options) return false;

    enhancerReady = true;
    var snap = snapshotValues(options);
    var boxes = {};
    SECTIONS.forEach(function (s) {
      boxes[s.key] = sectionBox(panelEl, s.title);
    });

    var iconBox = sectionBox(
      panelEl,
      "Iconos de contenido en las miniaturas",
      "Marca las etiquetas cuyo icono no quieres que aparezca sobre las miniaturas."
    );
    var grid = util.el("div");
    grid.id = "r34g-icon-grid";
    grid.dataset.r34gSearch = "iconos";
    var actions = util.el("div", "r34g-row");
    actions.id = "r34g-actions-row";
    iconBox.appendChild(grid);
    iconBox.appendChild(actions);

    var advanced = sectionBox(panelEl, "Avanzado");
    var moved = [];

    Array.prototype.slice.call(options.childNodes).forEach(function (node) {
      if (node.nodeType !== 1) return;
      var tag = node.tagName.toLowerCase();
      if (tag === "br") return;

      if (node.id === "iconCheckboxes") {
        Array.prototype.slice.call(node.querySelectorAll("label")).forEach(function (lb) {
          var input = lb.querySelector("input");
          if (!input) return;
          var r = util.el("label");
          r.dataset.r34gSearch = (LABELS[input.id] || input.id).toLowerCase();
          switchify(input);
          r.appendChild(input.parentNode);
          r.appendChild(util.el("span", "r34g-icon-text", LABELS[input.id] || input.id));
          grid.appendChild(r);
        });
        return;
      }

      if (node.id === "hideAllIconsButton" || node.id === "unhideAllIconsButton") {
        node.textContent = node.id === "hideAllIconsButton" ? "Ocultar todos" : "Mostrar todos";
        actions.appendChild(node);
        return;
      }

      if (node.id === "deleteTagDbButton") {
        var r = row(LABELS.deleteTagDbButton, HINTS.deleteTagDbButton);
        r.appendChild(node);
        advanced.insertBefore(r, advanced.children[1] || null);
        return;
      }

      if (tag !== "label") return;

      var control = controlOf(node);
      if (!control) return;
      var id = control.id || "";
      var key = SECTION_BY_ID[id] || "misc";
      var raw = cleanText(node, control);
      var note = rangeNote(raw);
      var title = LABELS[id] || raw.replace(/\s*[-–]?\s*-?\d+(?:\.\d+)?\s*[-–]\s*-?\d+(?:\.\d+)?\s*$/, "").replace(/\s*:\s*$/, "");
      var hint = HINTS[id] || "";
      if (note) hint = hint ? hint + " \u00b7 Rango: " + note : "Rango permitido: " + note;
      var r2 = row(title, hint, id);
      if (id === "resizeButton" || id === "scrollButton") {
        r2.appendChild(node);
      } else if (control.type === "checkbox") {
        switchify(control);
        var slot = util.el("span", "r34g-value");
        slot.appendChild(control.parentNode);
        r2.appendChild(slot);
      } else {
        var slot2 = util.el("span", "r34g-value");
        if (control.tagName === "SELECT") {
          Array.prototype.slice.call(control.options).forEach(function (op) {
            if (op.value === "new-tab") op.textContent = "Pesta\u00f1a nueva";
            else if (op.value === "same-window") op.textContent = "Misma pesta\u00f1a";
          });
        }
        slot2.appendChild(control);
        r2.appendChild(slot2);
      }
      boxes[key].appendChild(r2);
      moved.push(node);
    });

    var favs = document.getElementById("ibenhancer-favorite-tags");
    var sidebar = document.querySelector(".sidebar");
    if (favs && sidebar) {
      var holder = util.el("div");
      holder.id = "r34g-sidebar-favs";
      holder.appendChild(util.el("h5", null, "Etiquetas favoritas"));
      holder.appendChild(favs);
      sidebar.appendChild(holder);
    }

    var changelog = document.getElementById("ibenhancer-changelog");
    var changelogPanel = document.querySelector('[data-r34g-panel="changelog"]');
    if (changelog && changelogPanel) changelogPanel.appendChild(changelog);

    var save = document.getElementById("ibenhancerSettingsSave");
    var cancel = document.getElementById("ibenhancerSettingsCancel");
    var sticky = util.el("div", "r34g-enh-sticky");
    var noteEl = util.el("span", "r34g-note", "Los cambios de Mejoras se aplican al guardar (la p\u00e1gina se recarga).");
    if (save) {
      save.textContent = "Guardar cambios";
      sticky.appendChild(save);
    }
    if (cancel) {
      cancel.textContent = "Descartar";
      sticky.appendChild(cancel);
    }
    sticky.appendChild(noteEl);
    panelEl.insertBefore(sticky, panelEl.firstChild);

    options.innerHTML = "";
    options.style.display = "none";

    restoreValues(snap);
    widget.style.setProperty("display", "none", "important");
    document.documentElement.classList.add("r34g-integrated");
    R.enhancerIntegrated = true;
    return true;
  }

  function watch() {
    if (integrate()) return;
    var observer = new MutationObserver(function () {
      if (integrate()) {
        observer.disconnect();
        clearInterval(timer);
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    var timer = setInterval(function () {
      if (integrate()) {
        clearInterval(timer);
        observer.disconnect();
      }
    }, 700);
  }

  function applySearch() {
    if (!panelEl) return;
    var q = (searchInput && searchInput.value ? searchInput.value : "").trim().toLowerCase();
    var rows = panelEl.querySelectorAll("[data-r34g-search]");
    rows.forEach(function (n) {
      if (!q) {
        n.classList.remove("r34g-filtered-out");
        return;
      }
      var hay = (n.dataset.r34gSearch || "") + " " + (n.textContent || "").toLowerCase();
      n.classList.toggle("r34g-filtered-out", hay.indexOf(q) === -1);
    });
    panelEl.querySelectorAll(".r34g-section").forEach(function (s) {
      var visible = false;
      s.querySelectorAll(".r34g-row").forEach(function (r) {
        if (!r.classList.contains("r34g-filtered-out")) visible = true;
      });
      if (s.querySelector("#r34g-icon-grid")) {
        var anyIcon = false;
        s.querySelectorAll("#r34g-icon-grid label").forEach(function (l) {
          if (!l.classList.contains("r34g-filtered-out")) anyIcon = true;
        });
        if (anyIcon) visible = true;
      }
      s.classList.toggle("r34g-filtered-out", !!q && !visible);
    });
  }

  function buildPanel(panel) {
    panelEl = panel;
    var search = util.el("div", "r34g-search");
    searchInput = util.el("input");
    searchInput.type = "search";
    searchInput.placeholder = "Buscar una opci\u00f3n\u2026";
    searchInput.autocomplete = "off";
    searchInput.addEventListener("input", util.debounce(applySearch, 120));
    search.appendChild(searchInput);
    panel.appendChild(search);
    searched.push(searchInput);

    var mine = sectionBox(panel, "De la suite", "Mejoras propias a\u00f1adidas por encima del ensamblador original.");
    var exportBtn = ui.button({
      section: mine,
      title: "Copia de seguridad de Mejoras",
      note: "Guarda o restaura todas estas opciones en un archivo de texto.",
      label: "Exportar ajustes",
      onClick: function () {
        util.download("r34g-mejoras.json", JSON.stringify(collectValues(), null, 2), "application/json");
      }
    });
    var importInput = document.createElement("input");
    importInput.type = "file";
    importInput.accept = ".json,application/json";
    importInput.style.display = "none";
    importInput.addEventListener("change", function () {
      var f = importInput.files && importInput.files[0];
      if (!f) return;
      var fr = new FileReader();
      fr.onload = function () {
        try {
          var map = JSON.parse(String(fr.result));
          var n = applyValues(map);
          util.toast("Importadas " + n + " opciones. Pulsa Guardar cambios.");
        } catch (e) {
          util.toast("El archivo no es v\u00e1lido");
        }
      };
      fr.readAsText(f);
      importInput.value = "";
    });
    document.body.appendChild(importInput);
    var importBtn = ui.button({
      section: mine,
      title: "Restaurar desde un archivo exportado",
      label: "Importar ajustes",
      onClick: function () {
        importInput.click();
      }
    });
    ui.button({
      section: mine,
      title: "Vuelve a los valores con los que viene el ensamblador de f\u00e1brica",
      label: "Valores de f\u00e1brica",
      onClick: function () {
        if (!window.confirm("\u00bfDevolver las opciones de Mejoras a sus valores de f\u00e1brica? No se guardar\u00e1 hasta que pulses Guardar cambios.")) return;
        var map = {};
        Object.keys(ENHANCER_DEFAULTS).forEach(function (k) {
          map[k] = ENHANCER_DEFAULTS[k];
        });
        panelEl.querySelectorAll("#r34g-icon-grid input[type=checkbox]").forEach(function (n) {
          map[n.id] = false;
        });
        applyValues(map);
        util.toast("Valores de f\u00e1brica aplicados (sin guardar)");
      }
    });
    ui.button({
      section: mine,
      title: "Muestra u oculta todas las opciones del ensamblador",
      label: "Ocultar/mostrar el resto",
      onClick: function () {
        var hidden = mine.dataset.r34gCollapsed === "1";
        mine.dataset.r34gCollapsed = hidden ? "0" : "1";
        panel.querySelectorAll(".r34g-section").forEach(function (s) {
          if (s === mine) return;
          s.classList.toggle("r34g-collapsed", !hidden);
        });
      }
    });

    var note = util.el("p", "r34g-hint");
    note.innerHTML =
      "Estas opciones provienen del ensamblador original, integradas aqu\u00ed como una secci\u00f3n m\u00e1s de la herramienta " +
      "y traducidas al espa\u00f1ol. Si el ensamblador no est\u00e1 instalado, esta pesta\u00f1a aparece vac\u00eda.";
    panel.appendChild(note);
  }

  R.panel({
    key: "enhancer",
    label: "Mejoras",
    build: buildPanel
  });

  R.onReady(watch);
})();

(function () {
  "use strict";
  var R = window.__r34g;
  if (!R || R.video) return;
  R.video = true;
  var util = R.util;
  var ui = R.ui;

  var SPEEDS = ["0.5", "0.75", "1", "1.25", "1.5", "2"];

  function fmt(t) {
    if (!isFinite(t) || t < 0) t = 0;
    t = Math.floor(t);
    var h = Math.floor(t / 3600);
    var m = Math.floor((t % 3600) / 60);
    var s = t % 60;
    var mm = (h ? (m < 10 ? "0" : "") : "") + m;
    var ss = (s < 10 ? "0" : "") + s;
    return (h ? h + ":" : "") + mm + ":" + ss;
  }

  function videos() {
    return Array.prototype.slice.call(
      document.querySelectorAll(
        "#gelcomVideoPlayer, #gelcomVideoContainer video, .fluid_video_wrapper video, .video-js video, video#image"
      )
    );
  }

  function containerOf(video) {
    return (
      video.closest("#gelcomVideoContainer") ||
      video.closest(".fluid_video_wrapper") ||
      video.closest(".r34g-vwrap") ||
      video.parentElement
    );
  }

  // El contenedor del vídeo es un elemento flexible dentro de la maquetación del sitio,
  // así que marcamos su contenedor padre para que ocupe el ancho disponible (no el de la miniatura).
  function markHost(wrap) {
    if (wrap && wrap.parentElement) wrap.parentElement.classList.add("r34g-vhost");
  }

  function poster(video) {
    return video.getAttribute("poster") || "";
  }

  function applyPlayback(video) {
    var s = R.settings;
    try {
      video.loop = !!s.vLoop;
      var wants = Number(s.vSpeed) || 1;
      if (video.playbackRate !== wants) video.playbackRate = wants;
      var vol = Number(s.vVolume);
      if (isFinite(vol)) video.volume = Math.max(0, Math.min(1, vol));
    } catch (e) {}
    if (s.vAutoplay) {
      video.muted = true;
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    }
  }

  function buildBar(video) {
    var wrap = containerOf(video);
    if (!wrap) return;
    wrap.classList.add("r34g-vwrap");
    markHost(wrap);
    var old = wrap.querySelector(".r34g-vbar");
    if (old) old.remove();
    if (!R.settings.vBar) return;

    var bar = util.el("div", "r34g-vbar");
    bar.setAttribute("role", "group");

    var controls = util.el("div", "r34g-vbar-main");
    var play = util.el("button", "r34g-vbtn r34g-vplay");
    play.type = "button";
    play.title = "Reproducir / pausar (Espacio)";
    play.appendChild(util.icon("play"));
    var back = util.el("button", "r34g-vbtn");
    back.type = "button";
    back.title = "Retroceder " + R.settings.vSkip + "s";
    back.appendChild(util.icon("start"));
    var fwd = util.el("button", "r34g-vbtn");
    fwd.type = "button";
    fwd.title = "Avanzar " + R.settings.vSkip + "s";
    fwd.appendChild(util.icon("end"));

    var seek = util.el("input", "r34g-vseek");
    seek.type = "range";
    seek.min = "0";
    seek.max = "1000";
    seek.value = "0";
    seek.step = "1";
    var time = util.el("span", "r34g-vtime", "0:00 / 0:00");

    var volWrap = util.el("div", "r34g-vvol");
    var mute = util.el("button", "r34g-vbtn r34g-vmute");
    mute.type = "button";
    mute.title = "Silenciar (M)";
    mute.appendChild(util.icon("volume"));
    var vol = util.el("input", "r34g-vvolume");
    vol.type = "range";
    vol.min = "0";
    vol.max = "1";
    vol.step = "0.05";
    vol.value = String(R.settings.vVolume);
    volWrap.appendChild(mute);
    volWrap.appendChild(vol);

    var speed = util.el("button", "r34g-vbtn r34g-vspeed", (Number(R.settings.vSpeed) || 1) + "x");
    speed.type = "button";
    speed.title = "Velocidad de reproducci\u00f3n";
    var loop = util.el("button", "r34g-vbtn r34g-vloop");
    loop.type = "button";
    loop.title = "Repetir en bucle (L)";
    loop.appendChild(util.icon("loop"));
    var shot = util.el("button", "r34g-vbtn");
    shot.type = "button";
    shot.title = "Guardar fotograma (S)";
    shot.appendChild(util.icon("camera"));
    var pip = util.el("button", "r34g-vbtn");
    pip.type = "button";
    pip.title = "Imagen en imagen (P)";
    pip.appendChild(util.icon("pip"));
    var cine = util.el("button", "r34g-vbtn r34g-vcine");
    cine.type = "button";
    cine.title = "Modo cine (C)";
    cine.appendChild(util.icon("cine"));
    var fit = util.el("button", "r34g-vbtn r34g-vfit");
    fit.type = "button";
    fit.title = "Ajustar / recortar";
    fit.appendChild(util.icon("fit"));
    var full = util.el("button", "r34g-vbtn");
    full.type = "button";
    full.title = "Pantalla completa (F)";
    full.appendChild(util.icon("full"));

    [back, play, fwd, volWrap, speed, loop, shot, pip, cine, fit, full].forEach(function (n) {
      controls.appendChild(n);
    });

    var top = util.el("div", "r34g-vbar-top");
    top.appendChild(seek);
    var bottom = util.el("div", "r34g-vbar-bottom");
    bottom.appendChild(time);
    var grow = util.el("span", "r34g-vgrow");
    bottom.appendChild(grow);
    bottom.appendChild(controls);

    bar.appendChild(top);
    bar.appendChild(bottom);
    wrap.appendChild(bar);
    document.documentElement.classList.add("r34g-vbar-on");

    function syncPlay() {
      play.innerHTML = "";
      play.appendChild(util.icon(video.paused ? "play" : "pause"));
    }
    function syncTime() {
      var d = video.duration || 0;
      var c = video.currentTime || 0;
      seek.value = d ? String(Math.round((c / d) * 1000)) : "0";
      time.textContent = fmt(c) + " / " + fmt(d);
    }
    function syncVol() {
      vol.value = String(video.muted ? 0 : video.volume);
      mute.innerHTML = "";
      mute.appendChild(util.icon(video.muted || video.volume === 0 ? "mute" : "volume"));
    }
    function syncLoop() {
      loop.classList.toggle("r34g-on", !!video.loop);
    }

    play.addEventListener("click", function () {
      if (video.paused) video.play();
      else video.pause();
    });
    back.addEventListener("click", function () {
      video.currentTime = Math.max(0, video.currentTime - Number(R.settings.vSkip || 5));
    });
    fwd.addEventListener("click", function () {
      video.currentTime = Math.min(video.duration || 1e9, video.currentTime + Number(R.settings.vSkip || 5));
    });
    seek.addEventListener("input", function () {
      if (video.duration) video.currentTime = (Number(seek.value) / 1000) * video.duration;
    });
    vol.addEventListener("input", function () {
      video.volume = Number(vol.value);
      video.muted = video.volume === 0;
      R.set("vVolume", video.volume);
      syncVol();
    });
    mute.addEventListener("click", function () {
      video.muted = !video.muted;
      syncVol();
    });
    speed.addEventListener("click", function () {
      var i = SPEEDS.indexOf(String(video.playbackRate));
      i = (i + 1) % SPEEDS.length;
      video.playbackRate = Number(SPEEDS[i]);
      speed.textContent = SPEEDS[i] + "x";
      R.set("vSpeed", SPEEDS[i]);
    });
    loop.addEventListener("click", function () {
      video.loop = !video.loop;
      R.set("vLoop", video.loop);
      syncLoop();
    });
    shot.addEventListener("click", function () {
      saveFrame(video);
    });
    pip.addEventListener("click", function () {
      try {
        if (document.pictureInPictureElement) document.exitPictureInPicture();
        else if (video.requestPictureInPicture) video.requestPictureInPicture();
      } catch (e) {}
    });
    cine.addEventListener("click", function () {
      R.set("vCinema", !R.settings.vCinema);
      cine.classList.toggle("r34g-on", !!R.settings.vCinema);
    });
    fit.addEventListener("click", function () {
      R.set("vFit", R.settings.vFit === "contain" ? "cover" : "contain");
      util.toast(R.settings.vFit === "cover" ? "V\u00eddeo recortado" : "V\u00eddeo completo");
    });
    full.addEventListener("click", function () {
      var el = containerOf(video);
      if (document.fullscreenElement) document.exitFullscreen();
      else if (el.requestFullscreen) el.requestFullscreen();
    });

    video.addEventListener("play", syncPlay);
    video.addEventListener("pause", syncPlay);
    video.addEventListener("timeupdate", syncTime);
    video.addEventListener("loadedmetadata", syncTime);
    video.addEventListener("durationchange", syncTime);
    video.addEventListener("volumechange", syncVol);
    video.addEventListener("dblclick", function (e) {
      e.preventDefault();
      var el = containerOf(video);
      if (document.fullscreenElement) document.exitFullscreen();
      else if (el.requestFullscreen) el.requestFullscreen();
    });
    video.addEventListener("click", function (e) {
      if (e.target.closest(".r34g-vbar")) return;
      if (video.paused) video.play();
      else video.pause();
    });

    bar.addEventListener("mousemove", function () {
      bar.classList.remove("r34g-idle");
    });
    var idleTimer = 0;
    function armIdle() {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(function () {
        if (!video.paused) bar.classList.add("r34g-idle");
      }, 2600);
    }
    wrap.addEventListener("mousemove", function () {
      bar.classList.remove("r34g-idle");
      armIdle();
    });
    wrap.addEventListener("mouseleave", function () {
      if (!video.paused) bar.classList.add("r34g-idle");
    });

    syncPlay();
    syncTime();
    syncVol();
    syncLoop();
    cine.classList.toggle("r34g-on", !!R.settings.vCinema);
    if (R.settings.vFit === "cover") fit.classList.add("r34g-on");
  }

  function saveFrame(video) {
    try {
      var c = document.createElement("canvas");
      c.width = video.videoWidth || 1280;
      c.height = video.videoHeight || 720;
      c.getContext("2d").drawImage(video, 0, 0, c.width, c.height);
      var url = c.toDataURL("image/jpeg", 0.92);
      var id = util.currentPostId() || Date.now();
      var a = document.createElement("a");
      a.href = url;
      a.download = "r34g-post-" + id + ".jpg";
      document.body.appendChild(a);
      a.click();
      a.remove();
      util.toast("Fotograma guardado");
    } catch (e) {
      util.toast("No se pudo guardar el fotograma");
    }
  }

  function buildBackdrop(video) {
    var wrap = containerOf(video);
    if (!wrap) return;
    var bg = wrap.querySelector(".r34g-vbackdrop");
    if (R.settings.vBg !== "blur") {
      if (bg) bg.remove();
      return;
    }
    var src = poster(video);
    if (!src) return;
    if (!bg) {
      bg = util.el("div", "r34g-vbackdrop");
      wrap.insertBefore(bg, wrap.firstChild);
    }
    bg.style.backgroundImage = "url('" + src.replace(/'/g, "%27") + "')";
  }

  function ensureBar(video) {
    var wrap = containerOf(video);
    if (!wrap) return;
    wrap.classList.add("r34g-vwrap");
    markHost(wrap);
    var has = !!wrap.querySelector(".r34g-vbar");
    if (R.settings.vBar) {
      video.removeAttribute("controls");
      video.controls = false;
      if (!has) buildBar(video);
      else {
        var bar = wrap.querySelector(".r34g-vbar");
        bar.classList.toggle("r34g-cinema", !!R.settings.vCinema);
        var loopBtn = bar.querySelector(".r34g-vloop");
        if (loopBtn) loopBtn.classList.toggle("r34g-on", !!video.loop);
        var sp = bar.querySelector(".r34g-vspeed");
        if (sp) sp.textContent = (Number(video.playbackRate) || 1) + "x";
      }
    } else {
      video.controls = true;
      if (has) wrap.querySelector(".r34g-vbar").remove();
    }
  }

  function applyToAll() {
    var list = videos();
    if (!list.length) {
      document.documentElement.classList.remove("r34g-vbar-on");
      return;
    }
    document.documentElement.classList.add("r34g-has-video");
    list.forEach(function (v) {
      v.dataset.r34gVideo = "1";
      applyPlayback(v);
      buildBackdrop(v);
      ensureBar(v);
    });
    document.documentElement.classList.toggle("r34g-vbar-on", list.some(function (v) {
      return !!R.settings.vBar;
    }));
  }

  function enhanceAll() {
    applyToAll();
  }

  R.enhanceVideos = enhanceAll;

  function keyboard(e) {
    if (!R.settings.vKeys) return;
    var t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
    var modal = document.getElementById("r34g-modal");
    if (modal && modal.classList.contains("r34g-open")) return;
    var list = videos();
    if (!list.length) return;
    var video = list[0];
    var k = e.key.toLowerCase();
    var skip = Number(R.settings.vSkip || 5);
    var handled = true;
    if (k === " " || k === "k") video.paused ? video.play() : video.pause();
    else if (k === "arrowright") video.currentTime = Math.min(video.duration || 1e9, video.currentTime + skip);
    else if (k === "arrowleft") video.currentTime = Math.max(0, video.currentTime - skip);
    else if (k === "arrowup") {
      video.volume = Math.min(1, video.volume + 0.05);
      video.muted = false;
      R.set("vVolume", video.volume);
    } else if (k === "arrowdown") {
      video.volume = Math.max(0, video.volume - 0.05);
      R.set("vVolume", video.volume);
    } else if (k === "m") video.muted = !video.muted;
    else if (k === "l") {
      video.loop = !video.loop;
      R.set("vLoop", video.loop);
    } else if (k === "c") R.set("vCinema", !R.settings.vCinema);
    else if (k === "s") saveFrame(video);
    else if (k === "p") {
      try {
        document.pictureInPictureElement ? document.exitPictureInPicture() : video.requestPictureInPicture();
      } catch (err) {}
    } else if (k === "f") {
      var el = containerOf(video);
      document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen && el.requestFullscreen();
    } else if (e.key === ",") video.currentTime = Math.max(0, video.currentTime - 1 / 30);
    else if (e.key === ".") video.currentTime = Math.min(video.duration || 1e9, video.currentTime + 1 / 30);
    else handled = false;
    if (handled) e.preventDefault();
  }

  function buildPanel(panel) {
    var size = ui.section(panel, "Tama\u00f1o y encuadre", "Funciona con el reproductor que use rule34 (Fluid, nativo o Video.js): la barra es nuestra, encima del v\u00eddeo.");
    ui.seg({
      section: size,
      key: "vFit",
      title: "Encuadre",
      note: "Completo respeta la proporci\u00f3n original; recortar llena el marco.",
      options: [
        { label: "Completo", value: "contain" },
        { label: "Recortar", value: "cover" }
      ],
      onPick: function () {
        enhanceAll();
      }
    });
    ui.seg({
      section: size,
      key: "vWidth",
      title: "Ancho m\u00e1ximo",
      options: [
        { label: "1000 px", value: "1000" },
        { label: "1200 px", value: "1200" },
        { label: "Todo el ancho", value: "full" }
      ]
    });
    ui.seg({
      section: size,
      key: "vBg",
      title: "Fondo del reproductor",
      note: "El desenfoque usa el p\u00f3ster del v\u00eddeo como fondo.",
      options: [
        { label: "Negro", value: "negro" },
        { label: "Desenfoque", value: "blur" },
        { label: "Sin fondo", value: "ninguno" }
      ],
      onPick: function () {
        enhanceAll();
      }
    });
    ui.toggle({ section: size, key: "vRadius", title: "Esquinas redondeadas" });
    ui.toggle({ section: size, key: "vShadow", title: "Sombra alrededor del v\u00eddeo" });
    ui.toggle({ section: size, key: "vCinema", title: "Modo cine", note: "Oscurece el resto de la p\u00e1gina para centrarte en el v\u00eddeo." });

    var play = ui.section(panel, "Reproducci\u00f3n");
    ui.seg({
      section: play,
      key: "vSpeed",
      title: "Velocidad inicial",
      options: [
        { label: "0.5x", value: "0.5" },
        { label: "0.75x", value: "0.75" },
        { label: "1x", value: "1" },
        { label: "1.25x", value: "1.25" },
        { label: "1.5x", value: "1.5" },
        { label: "2x", value: "2" }
      ],
      onPick: function () {
        enhanceAll();
      }
    });
    ui.seg({
      section: play,
      key: "vSkip",
      title: "Salto de los botones \u00ab\u00bb",
      options: [
        { label: "5 s", value: 5 },
        { label: "10 s", value: 10 },
        { label: "15 s", value: 15 },
        { label: "30 s", value: 30 }
      ]
    });
    ui.number({ section: play, key: "vVolume", title: "Volumen", min: 0, max: 1, step: 0.05, suffix: "0 \u2013 1" });
    ui.toggle({ section: play, key: "vLoop", title: "Repetir en bucle" });
    ui.toggle({ section: play, key: "vAutoplay", title: "Reproducir al abrir", note: "Empieza en silencio porque los navegadores bloquean el autoplay con sonido." });

    var bar = ui.section(panel, "Barra de controles propia");
    ui.toggle({ section: bar, key: "vBar", title: "Usar mi barra de controles", note: "Sustituye los controles del reproductor por una barra uniforme con salto, velocidad, bucle, fotograma, PiP y pantalla completa." });
    ui.toggle({ section: bar, key: "vKeys", title: "Atajos de teclado", note: "Espacio/K reproducir \u00b7 \u2190\u2192 salto \u00b7 \u2191\u2193 volumen \u00b7 M silencio \u00b7 L bucle \u00b7 C cine \u00b7 S fotograma \u00b7 P PiP \u00b7 F pantalla completa." });
    ui.button({
      section: bar,
      title: "Reaplicar los ajustes de v\u00eddeo a esta p\u00e1gina",
      label: "Aplicar ahora",
      onClick: function () {
        enhanceAll();
        util.toast("Ajustes de v\u00eddeo aplicados");
      }
    });
  }

  R.panel({
    key: "video",
    label: "V\u00eddeos",
    build: buildPanel
  });

  R.onChange(function (key) {
    if (
      key === "vFit" ||
      key === "vWidth" ||
      key === "vRadius" ||
      key === "vShadow" ||
      key === "vBg" ||
      key === "vCinema" ||
      key === "vBar"
    ) {
      applyToAll();
    }
  });

  R.onReady(function () {
    applyToAll();
    document.addEventListener("keydown", keyboard);
    var signature = "";
    function poll() {
      var list = videos();
      var sig = list
        .map(function (v) {
          return (v.currentSrc || v.src || "") + (v.paused ? "p" : "r");
        })
        .join("|");
      if (sig !== signature || !document.querySelector(".r34g-vwrap")) {
        signature = sig;
        applyToAll();
      }
    }
    setInterval(poll, 1800);
    setTimeout(poll, 800);
    setTimeout(poll, 2500);
  });
})();

(function () {
  "use strict";
  var R = window.__r34g;
  if (!R || R.tags) return;
  R.tags = true;
  var util = R.util;
  var ui = R.ui;

  var AI_KEY = "r34g.ai.v1";
  var STOP = { the: 1, of: 1, a: 1, an: 1, and: 1, de: 1, la: 1, el: 1, vs: 1, with: 1 };
  var META_TAGS = {
    video: 1,
    webm: 1,
    animated: 1,
    sound: 1,
    animated_gif: 1,
    animated_gif_loop: 1,
    text: 1,
    english_text: 1,
    japanese_text: 1,
    speech_bubble: 1,
    commentary: 1,
    watermark: 1,
    artist_name: 1,
    webm_audio: 1,
    sound_effect: 1
  };

  var ALIAS_GROUPS = [
    ["big breasts", "large breasts"],
    ["small breasts", "flat chest"],
    ["anal", "anal sex"],
    ["vaginal sex", "vaginal penetration", "vaginal"],
    ["sex from behind", "doggystyle"],
    ["cum in pussy", "creampie", "cum inside", "internal cumshot"],
    ["paizuri", "titfuck"],
    ["oral", "fellatio", "blowjob"],
    ["handjob", "hand job"],
    ["urination", "piss", "golden shower", "peeing"],
    ["scat", "poop", "defecation"],
    ["bdsm", "bondage"],
    ["futanari", "futa"],
    ["glasses", "eyewear"],
    ["lactation", "milking"],
    ["yuri", "lesbian"],
    ["yaoi", "gay", "male/male"],
    ["hetero", "straight", "male/female"],
    ["dark skin", "dark-skinned"],
    ["1girl", "solo female"],
    ["open mouth", "parted lips"]
  ];

  var AI_DEFAULT_INSTRUCTION = [
    "Eres un experto en etiquetado de imageboards (rule34). Recibes las etiquetas de un post y la lista de personajes detectados.",
    "Haz dos cosas:",
    "1) Reparte las etiquetas generales entre los personajes a los que describen realmente. Si una etiqueta describe a varios personajes o a la escena en general, ponla en \"shared\". Si describe a uno solo, ponla con ese personaje.",
    "2) Detecta etiquetas redundantes (sinónimos, singular/plural, o una que ya queda cubierta por otra con más posts) y ponlas en \"discard\" indicando con \"kept\" la etiqueta que se queda.",
    "No inventes etiquetas que no estén en la lista. Responde SOLO con JSON válido, sin texto adicional, con esta forma exacta:",
    '{"characters":[{"tag":"tag_del_personaje","tags":["..."]}],"shared":["..."],"discard":[{"tag":"...","kept":"..."}],"notas":"..."}'
  ].join(" ");

  // Cualquier endpoint compatible con OpenAI sirve. Los tres primeros tienen nivel gratuito
  // (con clave gratuita) y suelen ir mejor que la cola p\u00fablica de Pollinations.
  // El compilador sustituye "on" por "on" u "off" según el panel Proyecto.
  var BRIDGE_MODE = "on";

  var AI_PROVIDERS = [
    {
      value: "groq",
      label: "Groq (nivel gratis)",
      endpoint: "https://api.groq.com/openai/v1/chat/completions",
      model: "llama-3.1-8b-instant"
    },
    {
      value: "gemini",
      label: "Google Gemini (nivel gratis)",
      endpoint: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      model: "gemini-2.0-flash"
    },
    {
      value: "openrouter",
      label: "OpenRouter (modelos :free)",
      endpoint: "https://openrouter.ai/api/v1/chat/completions",
      model: "meta-llama/llama-3.1-8b-instruct:free"
    },
    {
      value: "pollinations",
      label: "Pollinations (sin clave, con cola)",
      endpoint: "https://text.pollinations.ai/openai",
      model: "openai"
    },
    {
      value: "openai",
      label: "OpenAI (de pago)",
      endpoint: "https://api.openai.com/v1/chat/completions",
      model: "gpt-4o-mini"
    },
    {
      value: "mistral",
      label: "Mistral",
      endpoint: "https://api.mistral.ai/v1/chat/completions",
      model: "mistral-small-latest"
    },
    {
      value: "ollama",
      label: "Ollama en tu PC (localhost:11434)",
      endpoint: "http://localhost:11434/v1/chat/completions",
      model: "llama3.1"
    },
    {
      value: "perchance",
      label: "IA de Perchance (gratis, sin clave)",
      bridge: true
    },
    { value: "custom", label: "Personalizado" }
  ];

  function providerOf(endpoint) {
    var found = AI_PROVIDERS.filter(function (p) {
      return p.endpoint && p.endpoint === endpoint;
    })[0];
    return found ? found.value : "custom";
  }

  function providerByKey(key) {
    return AI_PROVIDERS.filter(function (p) {
      return p.value === key;
    })[0];
  }

  function loadAI() {
    var stored = null;
    try {
      stored = JSON.parse(localStorage.getItem(AI_KEY) || "null");
    } catch (e) {}
    var cfg = stored && typeof stored === "object" ? stored : {};
    cfg.endpoint = cfg.endpoint || R.settings.tEndpoint || "https://text.pollinations.ai/openai";
    cfg.model = cfg.model || "openai";
    cfg.key = cfg.key || "";
    cfg.instruction = cfg.instruction || AI_DEFAULT_INSTRUCTION;
    cfg.provider = cfg.provider || providerOf(cfg.endpoint);
    cfg.bridge = cfg.bridge || R.settings.tBridge || "";
    return cfg;
  }

  var ai = {
    config: loadAI(),
    save: function () {
      try {
        localStorage.setItem(AI_KEY, JSON.stringify(this.config));
      } catch (e) {}
    }
  };

  // La IA es lo \u00fanico que tiene cuota, as\u00ed que se guarda su respuesta por post: volver a analizar
  // el mismo post no vuelve a gastar una petici\u00f3n.
  var AI_CACHE_KEY = "r34g.aicache.v1";
  var AI_CACHE_MAX = 300;
  var AI_CACHE_TTL = 1000 * 60 * 60 * 24 * 30;

  function aiCacheAll() {
    try {
      return JSON.parse(localStorage.getItem(AI_CACHE_KEY) || "{}") || {};
    } catch (e) {
      return {};
    }
  }

  function aiCacheId() {
    var id = util.currentPostId ? util.currentPostId() : "";
    if (id) return "post:" + id;
    var tags = R.lastAnalysis && R.lastAnalysis.tags ? R.lastAnalysis.tags : [];
    if (!tags.length) return "";
    var sig = tags
      .map(function (t) {
        return t.name;
      })
      .sort()
      .join(",");
    return "sig:" + sig.length + ":" + sig.slice(0, 140);
  }

  function aiCacheGet(key) {
    if (!key) return null;
    var hit = aiCacheAll()[key];
    if (!hit || Date.now() - (hit.t || 0) > AI_CACHE_TTL) return null;
    return hit.data || null;
  }

  function aiCachePut(key, data) {
    if (!key || !data) return;
    var all = aiCacheAll();
    all[key] = { t: Date.now(), data: data };
    var keys = Object.keys(all);
    if (keys.length > AI_CACHE_MAX) {
      keys.sort(function (a, b) {
        return (all[a].t || 0) - (all[b].t || 0);
      });
      keys.slice(0, keys.length - AI_CACHE_MAX).forEach(function (k) {
        delete all[k];
      });
    }
    try {
      localStorage.setItem(AI_CACHE_KEY, JSON.stringify(all));
    } catch (e) {}
  }

  ai.cacheSize = function () {
    return Object.keys(aiCacheAll()).length;
  };

  ai.cacheClear = function () {
    try {
      localStorage.removeItem(AI_CACHE_KEY);
    } catch (e) {}
  };

  ai.applyProvider = function (value) {
    ai.config.provider = value;
    var p = providerByKey(value);
    if (p && p.endpoint) {
      ai.config.endpoint = p.endpoint;
      ai.config.model = p.model;
    }
    ai.save();
    if (R.refreshControls) R.refreshControls();
  };

  // Puente con este mismo generador de Perchance: el userscript abre su p\u00e1gina en un iframe
  // oculto (con #r34g-ai, que all\u00ed solo carga el receptor) y le pide el texto por postMessage.
  // As\u00ed la IA sale del plugin de Perchance: gratis y sin clave en el script.
  var bridgeFrame = null;
  var bridgeSeq = 0;
  var bridgeWaiting = {};

  function bridgeUrl() {
    var url = String(ai.config.bridge || "").trim();
    if (!url || url.indexOf("userscript-maker") !== -1) url = String(R.settings.tBridge || "").trim();
    return url;
  }

  function bridgeFrameFor(url) {
    if (bridgeFrame && bridgeFrame.dataset.r34gUrl === url && bridgeFrame.parentNode) return bridgeFrame;
    if (bridgeFrame) bridgeFrame.remove();
    var src = url.replace(/^https?:\/\/(www\.)?perchance\.org\//i, "https://null.perchance.org/");
    src += (src.indexOf("#") === -1 ? "#r34g-ai" : "");
    var f = document.createElement("iframe");
    f.src = src;
    f.dataset.r34gUrl = url;
    f.style.cssText = "position:fixed;left:-9999px;top:0;width:1px;height:1px;border:0;";
    f.setAttribute("aria-hidden", "true");
    f.addEventListener("load", function () {
      f.dataset.r34gReady = "1";
    });
    (document.body || document.documentElement).appendChild(f);
    bridgeFrame = f;
    return f;
  }

  function bridgeAsk(messages) {
    var url = bridgeUrl();
    if (!url) return Promise.reject(new Error("falta la direcci\u00f3n del generador en Ajustes \u2192 Etiquetas"));
    var system = "";
    var user = "";
    messages.forEach(function (m) {
      if (m.role === "system") system = m.content;
      else user += (user ? "\n\n" : "") + m.content;
    });
    return new Promise(function (resolve, reject) {
      var id = "r34g-" + ++bridgeSeq + "-" + Date.now();
      var timer = setTimeout(function () {
        delete bridgeWaiting[id];
        reject(new Error("la IA de Perchance no respondi\u00f3 a tiempo"));
      }, 120000);
      bridgeWaiting[id] = { res: resolve, rej: reject, timer: timer };
      var frame = bridgeFrameFor(url);
      var send = function () {
        if (!bridgeWaiting[id]) return;
        try {
          frame.contentWindow.postMessage({ r34g: "ai-request", id: id, system: system, user: user }, "*");
        } catch (e) {
          clearTimeout(timer);
          delete bridgeWaiting[id];
          reject(new Error("no se pudo hablar con el generador"));
        }
      };
      if (frame.dataset.r34gReady === "1") setTimeout(send, 250);
      else frame.addEventListener("load", function () {
        setTimeout(send, 600);
      });
    });
  }

  window.addEventListener("message", function (e) {
    var d = e.data;
    if (!d || d.r34g !== "ai-reply" || !d.id) return;
    if (!/\.perchance\.org$/.test((e.origin || "").replace(/^https?:\/\//, ""))) return;
    var w = bridgeWaiting[d.id];
    if (!w) return;
    clearTimeout(w.timer);
    delete bridgeWaiting[d.id];
    if (d.error) w.rej(new Error(String(d.error).slice(0, 180)));
    else w.res(String(d.text == null ? "" : d.text));
  });

  // Proveedor "IA de Perchance" con red de seguridad: si el generador no responde (privado,
  // renombrado o borrado), seguimos con Pollinations, que es gratis y no pide clave.
  function perchanceAsk(messages) {
    return bridgeAsk(messages).catch(function (err) {
      util.toast("La IA de Perchance no respondi\u00f3 (" + ((err && err.message) || err) + "). Sigo con Pollinations, que no necesita clave.");
      return directAsk(FALLBACK, messages);
    });
  }

  // Petición directa a un endpoint compatible con OpenAI (Groq, Gemini, OpenRouter, Pollinations…).
  function directAsk(cfg, messages) {
    if (!cfg.endpoint) return Promise.reject(new Error("falta la direcci\u00f3n del motor de IA"));
    var headers = { "Content-Type": "application/json" };
    if (cfg.key) headers.Authorization = "Bearer " + cfg.key;
    return fetch(cfg.endpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ model: cfg.model, messages: messages, temperature: 0.2 })
    }).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (body) {
          var detail = "";
          try {
            var j = JSON.parse(body);
            detail = (j && j.error && (j.error.message || j.error)) || (j && j.message) || "";
            detail = detail ? String(detail) : "";
          } catch (e) {}
          if (!detail) detail = String(body || "").slice(0, 120);
          if (res.status === 429) {
            var wait = res.headers ? res.headers.get("retry-after") : "";
            throw new Error(
              "l\u00edmite alcanzado" + (wait ? " (reintentar en " + wait + " s)" : "") + ". Usa el an\u00e1lisis local o cambia de proveedor."
            );
          }
          if (res.status === 401 || res.status === 403) {
            throw new Error("clave rechazada (" + res.status + "). Rev\u00edsala o cambia de proveedor.");
          }
          throw new Error("HTTP " + res.status + (detail ? ": " + detail.slice(0, 140) : ""));
        });
      }
      return res.text().then(function (body) {
        var data;
        try {
          data = JSON.parse(body);
        } catch (e) {
          return body;
        }
        if (data && data.choices && data.choices[0] && data.choices[0].message) return data.choices[0].message.content || "";
        if (typeof data === "string") return data;
        if (data && typeof data.text === "string") return data.text;
        return JSON.stringify(data);
      });
    }).catch(function (e) {
      var msg = (e && e.message) || String(e);
      if (/failed to fetch|network ?error|load failed|err_/i.test(msg)) {
        throw new Error("no se pudo conectar (revisa la direcci\u00f3n, la conexi\u00f3n o el CORS del proveedor)");
      }
      throw e;
    });
  }

  // Proveedor de reserva: gratis y sin clave.
  var FALLBACK = { endpoint: "https://text.pollinations.ai/openai", model: "openai", key: "" };

  ai.request = function (messages) {
    if (typeof window.__r34gAIHook === "function") return Promise.resolve(window.__r34gAIHook(messages));
    var cfg = ai.config;
    if (cfg.provider === "perchance" && BRIDGE_MODE !== "off") return perchanceAsk(messages);
    return directAsk(cfg, messages);
  };

  R.ai = ai;

  function norm(name) {
    return String(name || "")
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function singular(text) {
    return text
      .split(" ")
      .map(function (w) {
        if (w.length > 4 && /ies$/.test(w)) return w.replace(/ies$/, "y");
        if (w.length > 4 && /es$/.test(w) && /(s|x|z|ch|sh)es$/.test(w)) return w.replace(/es$/, "");
        if (w.length > 3 && /s$/.test(w) && !/ss$/.test(w)) return w.replace(/s$/, "");
        return w;
      })
      .join(" ");
  }

  function tokens(text) {
    return norm(text)
      .split(/[\s/]+/)
      .filter(function (w) {
        return w && !STOP[w];
      });
  }

  function charName(tag) {
    return norm(tag).replace(/\s*\([^)]*\)\s*$/, "").trim();
  }

  function charSeries(tag) {
    var m = /\(([^)]+)\)\s*$/.exec(tag);
    return m ? norm(m[1]) : "";
  }

  function roleOf(tag) {
    if (META_TAGS[norm(tag.name)]) return "meta";
    var t = (tag.type || "").toLowerCase();
    if (t === "character") return "character";
    if (t === "copyright") return "copyright";
    if (t === "artist") return "artist";
    if (/^rating[: ]/.test(norm(tag.name))) return "meta";
    return "general";
  }

  function parse() {
    var side = document.getElementById("tag-sidebar");
    if (!side) return [];
    var out = [];
    var group = "";
    Array.prototype.slice.call(side.querySelectorAll("li")).forEach(function (li) {
      var h = li.querySelector("h6");
      if (h) {
        group = (h.textContent || "").trim().toLowerCase();
        return;
      }
      var cls = li.className || "";
      var type = "";
      var m = /tag-type-([a-z]+)/.exec(cls);
      if (m) type = m[1];
      else if (group.indexOf("character") !== -1) type = "character";
      else if (group.indexOf("copyright") !== -1) type = "copyright";
      else if (group.indexOf("artist") !== -1) type = "artist";
      else if (group.indexOf("general") !== -1) type = "general";
      var links = Array.prototype.slice.call(li.querySelectorAll("a[href*='tags=']"));
      var name = "";
      links.forEach(function (a) {
        var mm = /[?&]tags=([^&]+)/.exec(a.getAttribute("href") || "");
        if (mm) {
          try {
            name = decodeURIComponent(mm[1].replace(/\+/g, " "));
          } catch (e) {}
        }
      });
      if (!name) {
        var plain = li.querySelector("a:not([href*='wiki'])");
        name = plain ? (plain.textContent || "").trim() : "";
      }
      if (!name) return;
      name = name
        .replace(/&#0?39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&");
      var countEl = li.querySelector(".tag-count");
      var count = util.num(countEl ? countEl.textContent : 0);
      var tag = { name: name.replace(/\s+/g, "_"), label: norm(name), type: type, count: count };
      tag.role = roleOf(tag);
      out.push(tag);
    });
    var seenNames = {};
    return out.filter(function (t) {
      var k = t.name.toLowerCase();
      if (seenNames[k]) return false;
      seenNames[k] = 1;
      return true;
    });
  }

  var ALIAS_LOOKUP = null;
  function aliasLookup() {
    if (ALIAS_LOOKUP) return ALIAS_LOOKUP;
    ALIAS_LOOKUP = {};
    ALIAS_GROUPS.forEach(function (group, i) {
      group.forEach(function (name) {
        ALIAS_LOOKUP[norm(name)] = i;
        ALIAS_LOOKUP[singular(norm(name))] = i;
      });
    });
    return ALIAS_LOOKUP;
  }

  function redundancy(tags, criterion) {
    var redundant = [];
    var related = [];
    var alias = aliasLookup();
    var byNorm = {};

    tags.forEach(function (t) {
      var key = singular(t.label);
      if (!byNorm[key]) byNorm[key] = [];
      byNorm[key].push(t);
    });

    var dropped = {};

    function keep(tag) {
      return !dropped[tag.name];
    }

    function better(a, b) {
      if (criterion === "specific") {
        var la = tokens(a.label).length;
        var lb = tokens(b.label).length;
        if (la !== lb) return la > lb ? a : b;
        if (a.label.length !== b.label.length) return a.label.length > b.label.length ? a : b;
      }
      if (a.count === b.count) return a.name.length >= b.name.length ? a : b;
      return a.count > b.count ? a : b;
    }

    function pickCount(a, b) {
      return better(a, b);
    }

    Object.keys(byNorm).forEach(function (key) {
      var group = byNorm[key];
      if (group.length < 2) return;
      var winner = group[0];
      group.forEach(function (g) {
        if (pickCount(winner, g) === g) winner = g;
      });
      group.forEach(function (g) {
        if (g === winner) return;
        dropped[g.name] = 1;
        redundant.push({ tag: g, kept: winner, reason: "Singular/plural o duplicado de " + winner.name });
      });
    });

    tags.forEach(function (t) {
      var idx = alias[t.label];
      if (idx == null) return;
      var group = tags.filter(function (o) {
        return alias[o.label] === idx;
      });
      if (group.length < 2) return;
      var winner = group[0];
      group.forEach(function (g) {
        if (pickCount(winner, g) === g) winner = g;
      });
      group.forEach(function (g) {
        if (g === winner || dropped[g.name]) return;
        dropped[g.name] = 1;
        redundant.push({ tag: g, kept: winner, reason: "Sin\u00f3nimo de " + winner.name });
      });
    });

    var generals = tags.filter(function (t) {
      return t.role === "general";
    });
    for (var i = 0; i < generals.length; i++) {
      for (var j = i + 1; j < generals.length; j++) {
        var a = generals[i];
        var b = generals[j];
        if (dropped[a.name] || dropped[b.name]) continue;
        var ta = tokens(a.label);
        var tb = tokens(b.label);
        if (!ta.length || !tb.length) continue;
        var short = ta.length <= tb.length ? a : b;
        var long = short === a ? b : a;
        var st = tokens(short.label);
        var lt = tokens(long.label);
        if (st.length === lt.length) continue;
        var subset = st.every(function (w) {
          return lt.indexOf(w) !== -1;
        });
        if (!subset) continue;
        related.push({ tag: short, kept: long, reason: "«" + short.name + "» y «" + long.name + "» se solapan" });
      }
    }

    return { redundant: redundant, related: related, dropped: dropped };
  }

  function analyze(list) {
    var tags = list.map(function (t) {
      return { name: t.name, label: t.label || norm(t.name), type: t.type || "", count: t.count || 0, role: t.role || roleOf(t) };
    });
    var criterion = R.settings.tRed === "off" ? "none" : R.settings.tRed;
    var red = criterion === "none" ? { redundant: [], related: [], dropped: {} } : redundancy(tags, criterion);
    if (R.settings.tAlias === false && criterion !== "none") {
      red.redundant = red.redundant.filter(function (item) {
        return item.reason.indexOf("Sin\u00f3nimo") === -1;
      });
      var dropped = {};
      red.redundant.forEach(function (item) {
        dropped[item.tag.name] = 1;
      });
      red.dropped = dropped;
    }

    var characters = tags
      .filter(function (t) {
        return t.role === "character";
      })
      .map(function (t) {
        return { tag: t.name, name: charName(t.name), series: charSeries(t.name), count: t.count, tags: [] };
      });
    var copyrights = tags.filter(function (t) {
      return t.role === "copyright";
    });

    characters.forEach(function (c) {
      var ct = tokens(c.name);
      copyrights.forEach(function (cp) {
        var pt = tokens(cp.label);
        var hit = pt.some(function (w) {
          return w.length > 2 && ct.indexOf(w) !== -1;
        });
        if (hit && !c.copyright) c.copyright = cp.name;
      });
      if (!c.copyright && c.series) {
        var bySeries = copyrights.filter(function (cp) {
          return cp.label.indexOf(c.series) !== -1;
        })[0];
        if (bySeries) c.copyright = bySeries.name;
      }
    });

    var shared = [];
    var byTag = {};

    tags.forEach(function (t) {
      if (t.role === "character" || t.role === "copyright" || t.role === "artist") return;
      if (t.role === "meta") {
        byTag[t.name] = "meta";
        shared.push(t.name);
        return;
      }
      var tt = tokens(t.label);
      var owners = characters.filter(function (c) {
        var ct = tokens(c.name);
        return ct.some(function (w) {
          return w.length > 2 && tt.indexOf(w) !== -1;
        });
      });
      if (owners.length) {
        owners.forEach(function (c) {
          c.tags.push(t.name);
        });
        byTag[t.name] = owners[0].tag;
      } else {
        shared.push(t.name);
        byTag[t.name] = "shared";
      }
    });

    var artists = tags.filter(function (t) {
      return t.role === "artist";
    });

    var result = {
      tags: tags,
      characters: characters,
      copyrights: copyrights,
      artists: artists,
      shared: shared,
      byTag: byTag,
      redundant: red.redundant,
      related: red.related || [],
      dropped: red.dropped,
      criterion: criterion,
      discarded: {},
      output: ""
    };
    result.discarded = Object.assign({}, red.dropped);
    return result;
  }

  function groupOf(result, name) {
    if (result.discarded[name]) return "discarded";
    if (result.byTag[name] === "meta") return "meta";
    if (result.byTag[name] === "shared") return "shared";
    var c = result.characters.filter(function (ch) {
      return ch.tag === result.byTag[name];
    })[0];
    return c ? c.tag : "shared";
  }

  function orderTags(result) {
    var order = [];
    result.characters.forEach(function (c) {
      c.tags.forEach(function (n) {
        order.push(n);
      });
    });
    result.artists.forEach(function (a) {
      order.push(a.name);
    });
    result.discarded = result.discarded || {};
    result.tags.forEach(function (t) {
      if (order.indexOf(t.name) === -1) order.push(t.name);
    });
    return order;
  }

  function buildOutput(result) {
    var parts = [];
    orderTags(result).forEach(function (name) {
      if (result.discarded[name]) return;
      if (R.settings.tShared === false && groupOf(result, name) === "shared") return;
      parts.push(name);
    });
    result.output = parts.join(" ");
    return result.output;
  }

  function chip(result, tagName, opts) {
    opts = opts || {};
    var tag = result.tags.filter(function (t) {
      return t.name === tagName;
    })[0];
    var b = util.el("button", "r34g-chip");
    b.type = "button";
    b.dataset.tag = tagName;
    b.appendChild(util.el("span", "r34g-chip-name", tagName.replace(/_/g, " ")));
    if (tag && tag.count) b.appendChild(util.el("span", "r34g-chip-count", util.pretty(tag.count)));
    if (result.discarded[tagName]) b.classList.add("r34g-chip-off");
    var reason = opts.reason || "";
    b.title = (reason ? reason + "\n" : "") + "Clic: incluir/excluir \u00b7 Clic derecho: mover a otro grupo";
    b.addEventListener("click", function () {
      if (result.discarded[tagName]) {
        delete result.discarded[tagName];
        b.classList.remove("r34g-chip-off");
      } else {
        result.discarded[tagName] = 1;
        b.classList.add("r34g-chip-off");
      }
      if (opts.onToggle) opts.onToggle();
    });
    b.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      moveChip(result, tagName, opts.host, opts.onToggle);
    });
    return b;
  }

  var MOVE_ORDER = ["shared", "discarded"];

  function moveChip(result, tagName, host, onToggle) {
    var groups = MOVE_ORDER.slice();
    result.characters.forEach(function (c) {
      groups.unshift(c.tag);
    });
    var cur = groupOf(result, tagName);
    var idx = groups.indexOf(cur);
    var next = groups[(idx + 1) % groups.length];
    if (next === "discarded") {
      result.discarded[tagName] = 1;
    } else {
      delete result.discarded[tagName];
    }
    if (next === "shared" || next === "discarded") {
      if (next === "shared") result.byTag[tagName] = "shared";
      result.characters.forEach(function (c) {
        c.tags = c.tags.filter(function (n) {
          return n !== tagName;
        });
      });
    } else {
      result.byTag[tagName] = next;
      result.characters.forEach(function (c) {
        c.tags = c.tags.filter(function (n) {
          return n !== tagName;
        });
      });
      var target = result.characters.filter(function (c) {
        return c.tag === next;
      })[0];
      if (target) target.tags.push(tagName);
    }
    var label = next === "discarded" ? "descartadas" : next === "shared" ? "compartidas" : next;
    util.toast("\u00ab" + tagName + "\u00bb movida a " + label);
    if (host) renderInto(host, result);
    else if (onToggle) onToggle();
  }

  function syncView(host, result) {
    buildOutput(result);
    if (!host) return;
    var ta = host.querySelector(".r34g-tp-output");
    if (ta) ta.value = result.output;
    var counter = host.querySelector(".r34g-tp-count");
    if (counter) {
      counter.textContent =
        result.tags.length +
        " etiquetas \u00b7 " +
        result.characters.length +
        " personajes \u00b7 " +
        result.redundant.length +
        " redundantes \u00b7 " +
        (result.related ? result.related.length : 0) +
        " relacionados";
    }
  }

  function groupBox(result, key, title, note) {
    var box = util.el("div", "r34g-tp-group");
    box.dataset.group = key;
    var head = util.el("div", "r34g-tp-group-head");
    head.appendChild(util.el("b", null, title));
    if (note) head.appendChild(util.el("span", "r34g-note", note));
    box.appendChild(head);
    var chips = util.el("div", "r34g-chips");
    box.appendChild(chips);
    return { box: box, chips: chips };
  }

  function renderInto(host, result) {
    host.innerHTML = "";
    host.dataset.r34gResult = "1";

    if (!result.tags.length) {
      host.appendChild(util.el("p", "r34g-hint", "No se encontraron etiquetas en este post."));
      return;
    }

    var head = util.el("div", "r34g-tp-head");
    head.appendChild(util.el("b", null, "Etiquetas por personaje"));
    var counter = util.el("span", "r34g-tp-count r34g-note");
    head.appendChild(counter);
    var btns = util.el("span", "r34g-mini-row");
    var copyBtn = util.el("button", "r34g-mini", "Copiar");
    copyBtn.type = "button";
    copyBtn.title = "Copia la lista final de etiquetas";
    copyBtn.addEventListener("click", function () {
      util.copy(buildOutput(result));
    });
    var searchBtn = util.el("button", "r34g-mini", "Buscar en rule34");
    searchBtn.type = "button";
    searchBtn.addEventListener("click", function () {
      var q = buildOutput(result).split(" ").filter(Boolean).join("+");
      location.href = "index.php?page=post&s=list&tags=" + encodeURIComponent(q);
    });
    var favBtn = util.el("button", "r34g-mini", "A etiquetas favoritas");
    favBtn.type = "button";
    favBtn.title = "A\u00f1ade estos tags al editor de etiquetas favoritas de la herramienta";
    favBtn.addEventListener("click", function () {
      var ta = document.getElementById("ibenhancer-favorite-tags-textarea");
      if (!ta) {
        util.toast("No se encontr\u00f3 el editor de etiquetas favoritas");
        return;
      }
      var cur = (ta.value || "").trim();
      ta.value = cur ? cur + " " + buildOutput(result) : buildOutput(result);
      util.toast("Etiquetas a\u00f1adidas al editor; pulsa Guardar all\u00ed");
    });
    btns.appendChild(copyBtn);
    btns.appendChild(searchBtn);
    btns.appendChild(favBtn);
    head.appendChild(btns);
    host.appendChild(head);

    var body = util.el("div", "r34g-tp-body");
    body.id = "r34g-tp-body";

    var sharedBox = groupBox(result, "shared", "Compartidas / escena", "Valen para todos los personajes o para la escena.");
    var charBoxes = result.characters.map(function (c) {
      var note = (c.copyright ? c.copyright.replace(/_/g, " ") : "sin serie") + (c.count ? " \u00b7 " + util.pretty(c.count) + " posts" : "");
      var gb = groupBox(result, c.tag, "Personaje: " + c.name, note);
      return { c: c, box: gb.box, chips: gb.chips };
    });
    var artistBox = result.artists.length ? groupBox(result, "artists", "Artista", "") : null;
    var seriesBox = result.copyrights.length ? groupBox(result, "copyright", "Series", "") : null;
    var metaBox = groupBox(result, "meta", "Medio y metadatos", "Describen el formato, no la escena.");
    var redBox = result.redundant.length ? groupBox(result, "redundant", "Redundantes", "Se descartan por defecto si otra etiqueta con m\u00e1s posts ya las cubre.") : null;
    var relBox = result.related && result.related.length ? groupBox(result, "related", "Relacionados", "Se solapan entre s\u00ed (una es m\u00e1s general). Decide t\u00fa cu\u00e1l sobra.") : null;

    charBoxes.forEach(function (cb) {
      body.appendChild(cb.box);
    });
    if (artistBox) body.appendChild(artistBox.box);
    if (seriesBox) body.appendChild(seriesBox.box);
    body.appendChild(sharedBox.box);
    body.appendChild(metaBox.box);
    if (redBox) body.appendChild(redBox.box);
    if (relBox) body.appendChild(relBox.box);

    var redIndex = {};
    result.redundant.forEach(function (item) {
      redIndex[item.tag.name] = item;
    });

    var sync = function () {
      syncView(host, result);
    };
    var placed = {};
    function place(name, target, opts) {
      if (placed[name] || !target) return;
      placed[name] = 1;
      opts = opts || {};
      opts.host = host;
      opts.onToggle = sync;
      var item = redIndex[name];
      if (item && item.kept && target !== redBox.chips && redBox) {
        target = redBox.chips;
        opts.reason = item.reason + " -> se queda " + item.kept.name;
      }
      target.appendChild(chip(result, name, opts));
    }

    result.characters.forEach(function (c, i) {
      c.tags.forEach(function (n) {
        place(n, charBoxes[i].chips);
      });
    });
    result.artists.forEach(function (a) {
      place(a.name, artistBox ? artistBox.chips : sharedBox.chips);
    });
    result.shared.forEach(function (n) {
      var g = groupOf(result, n);
      if (g === "meta") place(n, metaBox.chips);
      else place(n, sharedBox.chips);
    });
    result.tags.forEach(function (t) {
      if (t.role === "character") {
        var owner = charBoxes.filter(function (cb) {
          return cb.c.tag === t.name;
        })[0];
        place(t.name, owner ? owner.chips : sharedBox.chips);
        return;
      }
      if (t.role === "copyright") {
        place(t.name, seriesBox ? seriesBox.chips : sharedBox.chips);
        return;
      }
      if (result.redundant.length) {
        var item = redIndex[t.name];
        if (item && item.kept) {
          place(t.name, redBox.chips, { reason: item.reason + " -> se queda " + item.kept.name });
        }
      }
    });

    host.appendChild(body);

    if (relBox && result.related && result.related.length) {
      var seenPair = {};
      var rows = [];
      result.related.forEach(function (item) {
        var key = item.tag.name + "|" + item.kept.name;
        if (seenPair[key]) return;
        seenPair[key] = 1;
        var line = util.el("div", "r34g-rel");
        line.appendChild(
          util.el("span", "r34g-rel-text", item.tag.name.replace(/_/g, " ") + "  \u2194  " + item.kept.name.replace(/_/g, " "))
        );
        var b = util.el("button", "r34g-mini", "Excluir " + item.tag.name.replace(/_/g, " "));
        b.type = "button";
        b.title = "Quita esta etiqueta del resultado";
        b.addEventListener("click", function () {
          result.discarded[item.tag.name] = 1;
          renderInto(host, result);
        });
        line.appendChild(b);
        rows.push(line);
      });
      var limit = 6;
      rows.forEach(function (line, i) {
        if (i >= limit) line.hidden = true;
        relBox.box.appendChild(line);
      });
      if (rows.length > limit) {
        var more = util.el("button", "r34g-mini", "Ver los " + (rows.length - limit) + " restantes");
        more.type = "button";
        more.addEventListener("click", function () {
          var showing = !rows[limit].hidden;
          rows.forEach(function (line, i) {
            if (i >= limit) line.hidden = showing;
          });
          more.textContent = showing ? "Ver los " + (rows.length - limit) + " restantes" : "Ver menos";
        });
        relBox.box.appendChild(more);
      }
    }

    var out = util.el("div", "r34g-tp-outputwrap");
    var ta = util.el("textarea", "r34g-tp-output");
    ta.readOnly = true;
    ta.rows = 3;
    ta.addEventListener("focus", function () {
      ta.select();
    });
    out.appendChild(ta);
    host.appendChild(out);

    var hint = util.el("p", "r34g-hint");
    hint.textContent =
      "Clic en una etiqueta para incluirla o quitarla del resultado. Clic derecho para moverla de grupo (personaje -> compartida -> descartada).";
    host.appendChild(hint);

    syncView(host, result);
  }

  function run(host, options) {
    options = options || {};
    var list = options.tags || parse();
    if (!list.length) {
      if (host) {
        host.hidden = false;
        host.innerHTML = "";
        host.appendChild(util.el("p", "r34g-hint", "Abre un post (vista individual) para analizar sus etiquetas."));
      }
      return null;
    }
    var result = analyze(list);
    var pageHost = host || document.getElementById("r34g-tp-body");
    if (pageHost) renderInto(pageHost, result);
    R.lastAnalysis = result;
    if (options.ai) refineWithAI(result, pageHost, options);
    else if (!options.tags) enrich(result, pageHost);
    return result;
  }

  function extractJSON(text) {
    if (!text) return null;
    var t = String(text).replace(/```json/gi, "```").replace(/```/g, "");
    var start = t.indexOf("{");
    var end = t.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) return null;
    var slice = t.slice(start, end + 1);
    try {
      return JSON.parse(slice);
    } catch (e) {
      try {
        return JSON.parse(slice.replace(/,\s*([}\]])/g, "$1"));
      } catch (e2) {
        return null;
      }
    }
  }

  function aiMessages(result) {
    var lines = result.tags
      .slice()
      .sort(function (a, b) {
        return b.count - a.count;
      })
      .map(function (t) {
        return "- " + t.name + " [" + t.role + ", " + t.count + " posts]";
      });
    var chars = result.characters.map(function (c) {
      return "- " + c.tag + (c.copyright ? " (" + c.copyright + ")" : "");
    });
    var user = [
      "Etiquetas del post (nombre [tipo, posts totales de esa etiqueta]):",
      lines.join("\n"),
      "",
      "Personajes detectados:",
      chars.length ? chars.join("\n") : "- (ninguno)",
      "",
      "Devuelve el JSON."
    ].join("\n");
    return [
      { role: "system", content: ai.config.instruction || AI_DEFAULT_INSTRUCTION },
      { role: "user", content: user }
    ];
  }

  function applyAI(result, data, host) {
    if (!data || typeof data !== "object") return false;
    var known = {};
    result.tags.forEach(function (t) {
      known[t.name] = 1;
    });
    var moved = 0;
    if (Array.isArray(data.characters)) {
      data.characters.forEach(function (entry) {
        var target = result.characters.filter(function (c) {
          return c.tag === entry.tag || c.name === norm(entry.tag || "");
        })[0];
        if (!target) return;
        (entry.tags || []).forEach(function (raw) {
          var name = String(raw || "").replace(/\s+/g, "_");
          if (!known[name]) return;
          result.characters.forEach(function (c) {
            c.tags = c.tags.filter(function (n) {
              return n !== name;
            });
          });
          result.shared = result.shared.filter(function (n) {
            return n !== name;
          });
          delete result.discarded[name];
          target.tags.push(name);
          result.byTag[name] = target.tag;
          moved++;
        });
      });
    }
    if (Array.isArray(data.shared)) {
      data.shared.forEach(function (raw) {
        var name = String(raw || "").replace(/\s+/g, "_");
        if (!known[name]) return;
        if (result.byTag[name] === "meta") return;
        result.characters.forEach(function (c) {
          c.tags = c.tags.filter(function (n) {
            return n !== name;
          });
        });
        delete result.discarded[name];
        if (result.shared.indexOf(name) === -1) result.shared.push(name);
        result.byTag[name] = "shared";
        moved++;
      });
    }
    if (Array.isArray(data.discard)) {
      data.discard.forEach(function (entry) {
        var name = typeof entry === "string" ? entry : entry && entry.tag;
        if (!name) return;
        name = String(name).replace(/\s+/g, "_");
        if (!known[name]) return;
        result.discarded[name] = 1;
        var kept = typeof entry === "object" && entry ? entry.kept : "";
        result.redundant.push({
          tag: result.tags.filter(function (t) {
            return t.name === name;
          })[0] || { name: name },
          kept: kept ? { name: String(kept).replace(/\s+/g, "_") } : { name: "?" },
          reason: "Descartada por la IA"
        });
        moved++;
      });
    }
    if (host) renderInto(host, result);
    if (data.notas) util.toast(String(data.notas).slice(0, 140), 4200);
    return moved > 0;
  }

  function refineWithAI(result, host, options) {
    if (!host) return;
    var cacheKey = aiCacheId();
    var cached = options && options.force ? null : aiCacheGet(cacheKey);
    if (cached) {
      applyAI(result, cached, host);
      buildOutput(result);
      util.toast("IA: usando el an\u00e1lisis ya guardado de este post");
      return;
    }
    var status = util.el("div", "r34g-tp-status");
    status.appendChild(util.el("span", "r34g-spinner"));
    status.appendChild(util.el("span", null, "Consultando a la IA\u2026"));
    host.appendChild(status);
    ai.request(aiMessages(result)).then(
      function (text) {
        status.remove();
        var data = extractJSON(text);
        if (!data) {
          util.toast("La IA no devolvi\u00f3 un JSON v\u00e1lido");
          return;
        }
        aiCachePut(cacheKey, data);
        applyAI(result, data, host);
        buildOutput(result);
        util.toast("An\u00e1lisis de IA aplicado");
      },
      function (err) {
        status.remove();
        util.toast("La IA fall\u00f3: " + (err && err.message ? err.message : err), 4000);
      }
    );
  }

  function openPanel(aiWanted) {
    var panel = document.getElementById("r34g-tags-panel");
    if (!panel) return;
    panel.hidden = false;
    document.documentElement.classList.add("r34g-tags-open");
    if (aiWanted) run(null, { ai: true });
  }

  function buildPagePanel() {
    if (!document.getElementById("tag-sidebar")) return;
    if (document.getElementById("r34g-tags-panel")) return;
    var host = util.el("div");
    host.id = "r34g-tags-panel";
    host.hidden = !R.settings.tAuto;

    var body = util.el("div");
    body.id = "r34g-tp-page";

    function show(ai, force) {
      host.hidden = false;
      if (force || !body.dataset.r34gResult || ai) run(body, ai ? { ai: true } : undefined);
    }

    var bar = util.el("div", "r34g-tp-launch");
    var toggle = util.el("button", "r34g-tp-toggle");
    toggle.type = "button";
    toggle.appendChild(util.icon("tag"));
    toggle.appendChild(util.el("span", null, "Etiquetas por personaje"));
    toggle.title = "Analiza y reparte las etiquetas de este post entre sus personajes";
    toggle.addEventListener("click", function () {
      show(false, false);
    });
    var runBtn = util.el("button", "r34g-mini", "Analizar");
    runBtn.type = "button";
    runBtn.addEventListener("click", function () {
      show(false, true);
    });
    var aiBtn = util.el("button", "r34g-mini", "Analizar con IA");
    aiBtn.type = "button";
    aiBtn.title = "Env\u00eda las etiquetas a la IA configurada en Ajustes \u2192 Etiquetas";
    aiBtn.addEventListener("click", function () {
      show(true, true);
    });
    bar.appendChild(toggle);
    bar.appendChild(runBtn);
    bar.appendChild(aiBtn);
    host.appendChild(bar);
    host.appendChild(body);

    var anchor = document.querySelector("#post-view .image-sublinks") || document.querySelector("#post-view h4");
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(host, anchor);
    else document.getElementById("content").appendChild(host);
    if (R.settings.tAuto) setTimeout(function () {
      // con la cach\u00e9 por post, repetir un post no gasta peticiones: solo los nuevos
      show(!!R.settings.tAutoAI);
    }, 600);
    return host;
  }

  function buildPanel(panel) {
    panel.appendChild(
      util.el(
        "p",
        "r34g-hint",
        "Esta sección reparte las etiquetas de un post entre sus personajes, detecta etiquetas redundantes y te deja ajustar el resultado antes de copiarlo o buscarlo en rule34."
      )
    );

    var group = ui.section(panel, "An\u00e1lisis de este post");
    ui.button({
      section: group,
      title: "Lee las etiquetas del panel lateral del post y las clasifica",
      label: "Analizar",
      onClick: function () {
        var host = document.getElementById("r34g-tp-page");
        if (!host) {
          util.toast("Abre un post para analizar sus etiquetas");
          return;
        }
        var wrap = document.getElementById("r34g-tags-panel");
        if (wrap) wrap.hidden = false;
        run(host);
      }
    });
    ui.button({
      section: group,
      title: "Usa el motor de IA configurado abajo para repartir las etiquetas",
      label: "Analizar con IA",
      onClick: function () {
        var host = document.getElementById("r34g-tp-page");
        var wrap = document.getElementById("r34g-tags-panel");
        if (!host) {
          util.toast("Abre un post para analizar sus etiquetas");
          return;
        }
        if (wrap) wrap.hidden = false;
        run(host, { ai: true });
      }
    });
    ui.toggle({ section: group, key: "tAuto", title: "Analizar autom\u00e1ticamente al abrir un post" });
    ui.toggle({
      section: group,
      key: "tAutoAI",
      title: "Usar la IA en ese an\u00e1lisis autom\u00e1tico",
      note: "Solo gasta una petici\u00f3n la primera vez que ves cada post: el resultado de la IA queda guardado por post."
    });

    var rules = ui.section(panel, "Reglas del an\u00e1lisis");
    ui.seg({
      section: rules,
      key: "tRed",
      title: "Etiquetas redundantes",
      note: "Cu\u00e1l de las dos se conserva cuando una ya cubre a la otra.",
      options: [
        { label: "Mayor cantidad", value: "count", title: "Se queda la etiqueta con m\u00e1s posts (la que «ya funciona»)" },
        { label: "M\u00e1s espec\u00edfica", value: "specific", title: "Se queda la etiqueta m\u00e1s concreta" },
        { label: "No tocar", value: "off" }
      ]
    });
    ui.toggle({ section: rules, key: "tAlias", title: "Detectar sin\u00f3nimos", note: "big breasts / large breasts, creampie / cum inside, etc." });
    ui.toggle({ section: rules, key: "tShared", title: "Incluir las etiquetas de escena en el resultado", note: "Si lo desactivas, solo se copian las etiquetas por personaje." });

    var engine = ui.section(
      panel,
      "Motor de IA",
      "La clasificaci\u00f3n base es local y no necesita internet. La IA es opcional y sirve para repartir mejor las etiquetas entre personajes. Si el proveedor te deja sin cuota, el an\u00e1lisis local sigue funcionando igual."
    );
    ui.seg({
      section: engine,
      key: "tEngine",
      title: "Modo",
      options: [
        { label: "Solo local", value: "local" },
        { label: "IA externa", value: "ai" }
      ]
    });
    ui.select({
      section: engine,
      title: "Proveedor",
      note: "Rellena la direcci\u00f3n y el modelo de golpe. Groq, Gemini y OpenRouter tienen nivel gratuito: pide la clave gratis en su web y p\u00e9gala abajo. Pollinations no pide clave pero tiene cola y devuelve l\u00edmites.",
      options: AI_PROVIDERS.map(function (p) {
        return { label: p.label, value: p.value };
      }),
      get: function () {
        return ai.config.provider;
      },
      set: function (v) {
        ai.applyProvider(v);
      }
    });
    if (ai.config.bridge.indexOf("userscript-maker") !== -1) {
      ai.config.bridge = R.settings.tBridge || ai.config.bridge;
      ai.save();
    }
    ui.text({
      section: engine,
      title: "Generador de Perchance",
      note: "Solo para el proveedor \u00abIA de Perchance\u00bb: la direcci\u00f3n de este generador (el que compila el script). Si lo guardas con otro nombre, actual\u00edzala aqu\u00ed.",
      mono: true,
      placeholder: "https://perchance.org/tu-generador",
      get: function () {
        return ai.config.bridge;
      },
      set: function (v) {
        ai.config.bridge = String(v).trim();
        ai.save();
      },
      event: "change"
    });
    ui.text({
      section: engine,
      title: "Direcci\u00f3n del servicio",
      note: "Cualquier API compatible con OpenAI (chat/completions).",
      placeholder: "https://text.pollinations.ai/openai",
      mono: true,
      get: function () {
        return ai.config.endpoint;
      },
      set: function (v) {
        ai.config.endpoint = v;
        ai.save();
      },
      event: "change"
    });
    ui.text({
      section: engine,
      title: "Modelo",
      placeholder: "openai",
      get: function () {
        return ai.config.model;
      },
      set: function (v) {
        ai.config.model = v;
        ai.save();
      },
      event: "change"
    });
    ui.text({
      section: engine,
      title: "Clave de API",
      note: "Opcional. Se guarda solo en este navegador (localStorage).",
      password: true,
      get: function () {
        return ai.config.key;
      },
      set: function (v) {
        ai.config.key = v;
        ai.save();
      },
      event: "change"
    });
    ui.textarea({
      section: engine,
      title: "Instrucci\u00f3n para la IA",
      note: "D\u00e9jalo vac\u00edo para usar la instrucci\u00f3n recomendada. Debe pedir un JSON con characters/shared/discard.",
      rows: 6,
      get: function () {
        return ai.config.instruction === AI_DEFAULT_INSTRUCTION ? "" : ai.config.instruction;
      },
      set: function (v) {
        ai.config.instruction = v.trim() || AI_DEFAULT_INSTRUCTION;
        ai.save();
      },
      event: "change",
      buttons: [
        {
          label: "Probar conexi\u00f3n",
          onClick: function () {
            util.toast("Probando\u2026", 1200);
            ai.request([{ role: "user", content: "Responde solo con la palabra OK" }]).then(
              function (t) {
                util.toast("Respuesta: " + String(t).slice(0, 60));
              },
              function (e) {
                util.toast("Error: " + (e && e.message ? e.message : e), 4000);
              }
            );
          }
        }
      ]
    });

    var account = ui.section(
      panel,
      "Cuenta de rule34 (API)",
      "Opcional. Con tu user_id y tu api_key la secci\u00f3n puede leer la lista de etiquetas del post directamente de la API (con el tipo correcto) y consultar el contador real de cualquier etiqueta, incluso de las que no salen en el panel lateral. La clave se guarda solo en este navegador y **nunca** se incluye en el script compilado."
    );
    ui.text({
      section: account,
      title: "user_id",
      note: "El n\u00famero de tu cuenta. Est\u00e1 junto a la clave, en rule34.xxx \u2192 My Account \u2192 Options.",
      placeholder: "123456",
      mono: true,
      get: function () {
        return R.settings.apiUser;
      },
      set: function (v) {
        R.set("apiUser", String(v).trim());
      },
      event: "input"
    });
    ui.text({
      section: account,
      title: "api_key",
      note: "Solo se guarda en la cach\u00e9 de este navegador. No la pegues en el c\u00f3digo ni la compartas.",
      password: true,
      get: function () {
        return R.settings.apiKey;
      },
      set: function (v) {
        R.set("apiKey", String(v).trim());
      },
      event: "input"
    });
    var cacheNote = util.el("span", "r34g-note");
    ui.button({
      section: engine,
      title: "El an\u00e1lisis de IA se guarda por post para no gastar cuota al repetir",
      label: "Borrar resultados de IA guardados",
      extra: cacheNote,
      onClick: function () {
        R.ai.cacheClear();
        syncCache();
        util.toast("Resultados de IA borrados");
      }
    });
    function syncCache() {
      var n = R.ai.cacheSize();
      cacheNote.textContent = n ? (n + (n === 1 ? " post guardado" : " posts guardados")) : "vac\u00edo";
    }
    syncCache();

    var probeOut = util.el("div", "r34g-probe");
    ui.button({
      section: account,
      title: "Comprueba el autocompletado (no necesita clave) y la API con tu cuenta",
      label: "Probar conexi\u00f3n",
      onClick: function () {
        probeOut.textContent = "Probando\u2026";
        R.api.probe().then(function (out) {
          probeOut.innerHTML = "";
          out.items.forEach(function (item) {
            var line = util.el("div", "r34g-probe-line");
            line.appendChild(util.el("b", null, (item.ok ? "\u2713" : "\u2717") + " "));
            line.appendChild(util.el("span", null, item.label + ": " + item.detail));
            line.classList.toggle("r34g-probe-bad", !item.ok);
            probeOut.appendChild(line);
          });
        });
      }
    });
    account.appendChild(probeOut);
  }

  // Completa el an\u00e1lisis con la API de rule34 (solo si hay cuenta configurada).
  function enrich(result, host) {
    if (!R.api || !R.api.hasKey()) return;
    var id = util.currentPostId ? util.currentPostId() : "";
    if (!id) return;
    R.api.postTags(id).then(function (list) {
      if (!list || !list.length || R.lastAnalysis !== result) return;
      var known = {};
      result.tags.forEach(function (t) {
        known[t.name.toLowerCase()] = t;
      });
      var added = 0;
      list.forEach(function (item) {
        var key = String(item.name).toLowerCase();
        var tag = known[key];
        if (tag) {
          if (item.type && !tag.type) {
            tag.type = item.type;
            tag.role = roleOf(tag);
          }
          return;
        }
        var fresh = { name: item.name.replace(/\s+/g, "_"), label: norm(item.name), type: item.type || "", count: 0 };
        fresh.role = roleOf(fresh);
        result.tags.push(fresh);
        known[key] = fresh;
        added++;
      });
      if (!added) return;
      var rebuilt = analyze(result.tags);
      rebuilt.apiAdded = added;
      R.lastAnalysis = rebuilt;
      var pageHost = host || document.getElementById("r34g-tp-body");
      if (pageHost) renderInto(pageHost, rebuilt);
      util.toast("La API a\u00f1adi\u00f3 " + added + " etiqueta" + (added === 1 ? "" : "s") + " que faltaban", 2500);
    });
  }

  R.panel({
    key: "tags",
    label: "Etiquetas",
    build: buildPanel
  });

  R.tags = {
    parse: parse,
    analyze: analyze,
    run: run,
    renderInto: renderInto,
    buildPagePanel: buildPagePanel,
    applyAI: applyAI,
    aiMessages: aiMessages,
    extractJSON: extractJSON,
    tagIndex: function (result) {
      return result;
    }
  };

  R.onReady(function () {
    buildPagePanel();
  });
})();

(function () {
  "use strict";
  var R = window.__r34g;
  if (!R || R.downloads) return;
  R.downloads = {};
  var util = R.util;
  var ui = R.ui;

  var HIST_KEY = "r34g.dlh.v1";
  var HIST_MAX = 20000;
  var DIR_DB = "r34g-dir";
  var DIR_STORE = "handles";
  var DIR_KEY = "downloads";
  var QUEUE_ID = "r34g-dlq";
  var QSAVE_KEY = "r34g.dlq.v1";
  var QSAVE_MAX = 300;
  var SEL_KEY = "r34g.dlsel.v1";
  var SEL_KEY2 = "r34g.dlsel.v2";
  var sel = { on: false, ids: [], meta: {}, panel: false };

  function testHook(name) {
    var test = R.downloads.test;
    return test && typeof test[name] === "function" ? test[name] : null;
  }

  function gmXhr() {
    var xhr = testHook("xhr");
    if (xhr) return xhr;
    try {
      if (typeof GM_xmlhttpRequest === "function") return GM_xmlhttpRequest;
    } catch (e) {}
    try {
      if (typeof window !== "undefined" && typeof window.GM_xmlhttpRequest === "function") return window.GM_xmlhttpRequest;
    } catch (e) {}
    return null;
  }

  function pageWin() {
    try {
      if (typeof unsafeWindow !== "undefined" && unsafeWindow) return unsafeWindow;
    } catch (e) {}
    return window;
  }

  function sleep(ms) {
    return new Promise(function (r) {
      setTimeout(r, ms);
    });
  }

  function hist() {
    return R.downloads.hist;
  }

  var history = {
    map: {},
    dirty: false,
    timer: 0,
    load: function () {
      try {
        var raw = localStorage.getItem(HIST_KEY);
        var data = raw ? JSON.parse(raw) : null;
        this.map = data && data.v && typeof data.v === "object" ? data.v : {};
      } catch (e) {
        this.map = {};
      }
      return this;
    },
    has: function (id) {
      return id ? Object.prototype.hasOwnProperty.call(this.map, String(id)) : false;
    },
    get: function (id) {
      return id ? this.map[String(id)] || null : null;
    },
    add: function (id, name) {
      id = id == null ? "" : String(id);
      if (!id) return false;
      this.map[id] = { t: Date.now(), n: name || "" };
      this.dirty = true;
      this.schedule();
      return true;
    },
    remove: function (id) {
      if (this.map[String(id)]) {
        delete this.map[String(id)];
        this.dirty = true;
        this.schedule();
      }
    },
    clear: function () {
      this.map = {};
      this.dirty = true;
      this.flush();
    },
    size: function () {
      return Object.keys(this.map).length;
    },
    list: function () {
      var self = this;
      return Object.keys(this.map)
        .map(function (k) {
          return { id: k, t: self.map[k].t || 0, n: self.map[k].n || "" };
        })
        .sort(function (a, b) {
          return b.t - a.t;
        });
    },
    schedule: function () {
      var self = this;
      if (this.timer) return;
      this.timer = setTimeout(function () {
        self.timer = 0;
        self.flush();
      }, 1200);
    },
    flush: function () {
      if (!this.dirty) return;
      this.dirty = false;
      var keys = Object.keys(this.map);
      if (keys.length > HIST_MAX) {
        var map = this.map;
        keys.sort(function (a, b) {
          return (map[a].t || 0) - (map[b].t || 0);
        });
        keys.slice(0, keys.length - HIST_MAX).forEach(function (k) {
          delete map[k];
        });
      }
      try {
        localStorage.setItem(HIST_KEY, JSON.stringify({ v: this.map }));
      } catch (e) {}
    }
  };
  history.load();
  R.downloads.hist = history;

  window.addEventListener("pagehide", function () {
    history.flush();
  });

  function tidy(name) {
    return String(name == null ? "" : name)
      .replace(/[\\/:*?"<>|]+/g, "_")
      .replace(/[\u0000-\u001f]+/g, "_")
      .replace(/_{2,}/g, "_")
      .replace(/\s{2,}/g, " ")
      .replace(/^[._\s-]+|[._\s-]+$/g, "")
      .slice(0, 140);
  }

  function tokenValue(key, meta, ext) {
    var m = meta || {};
    var join = function (list) {
      return (list || []).map(function (s) {
        return tidy(s).replace(/\s+/g, "_");
      }).join(" ");
    };
    switch (String(key || "").toLowerCase()) {
      case "id":
        return m.id || "";
      case "artist":
        return join(m.artist);
      case "character":
        return join(m.character);
      case "copyright":
        return join(m.copyright);
      case "general":
        return join((m.general || []).slice(0, 6));
      case "tags":
        return join((m.tags || []).slice(0, 8));
      case "rating":
        return m.rating || "";
      case "score":
        return m.score || "";
      case "ext":
        return ext || m.ext || "jpg";
      case "kind":
        return m.kind || "image";
      case "site":
        return m.site || "";
      default:
        return "";
    }
  }

  function applyTemplate(tpl, meta, ext) {
    return String(tpl == null ? "" : tpl).replace(/\{(\w+)\}/g, function (m, key) {
      return tidy(tokenValue(key, meta, ext));
    });
  }

  function buildPath(meta, ext) {
    var e = ext || (meta && meta.ext) || "jpg";
    var file = applyTemplate(R.settings.dlFile || "{id}", meta, e);
    file = file.replace(/\.(jpe?g|png|gif|webp|mp4|webm|avif)$/i, "");
    if (!file) file = String((meta && meta.id) || "rule34");
    file = (tidy(file) || String((meta && meta.id) || "rule34")).replace(/\s+/g, "_");
    var folder = applyTemplate(R.settings.dlFolder || "", meta, e);
    folder = folder
      .split("/")
      .map(function (s) {
        return tidy(s).replace(/\s+/g, "_");
      })
      .filter(function (s) {
        return s && s !== "." && s !== "..";
      })
      .join("/");
    return { file: file + "." + e, folder: folder, path: (folder ? folder + "/" : "") + file + "." + e };
  }

  function fileNameFromUrl(url) {
    try {
      var u = new URL(url, location.href);
      var m = /\/([^/?#]+)$/.exec(u.pathname);
      return m ? decodeURIComponent(m[1]) : "";
    } catch (e) {
      return "";
    }
  }

  function extFromUrl(url) {
    var m = /\.([a-z0-9]{2,5})(?:[?#]|$)/i.exec(fileNameFromUrl(url) || "");
    return m ? m[1].toLowerCase() : "";
  }

  var VIDEO_EXT = /^(mp4|webm|mov|mkv|m4v)$/i;

  function isVideo(url, meta) {
    var e = extFromUrl(url);
    if (VIDEO_EXT.test(e)) return true;
    if (meta && meta.kind) return meta.kind === "video";
    return false;
  }

  function mediaUrlFromDoc(doc) {
    var v = doc.querySelector("#gelcomVideoPlayer, #gelcomVideoContainer video, video#image");
    if (v) {
      var src = v.getAttribute("src") || v.currentSrc || "";
      if (!src) {
        var s = v.querySelector("source[src]");
        if (s) src = s.getAttribute("src") || "";
      }
      if (!src) {
        var link = doc.querySelector("#gelcomVideoContainer a[href$='.mp4'], #gelcomVideoContainer a[href$='.webm']");
        if (link) src = link.getAttribute("href") || "";
      }
      if (src) return src;
    }
    var im = doc.querySelector("img#image, #image");
    if (im && im.getAttribute && im.getAttribute("src")) return im.getAttribute("src");
    var og = doc.querySelector('meta[property="og:image"]');
    if (og) {
      var c = og.getAttribute("content") || "";
      if (c && !/logo|favicon|r34chibi/i.test(c)) return c;
    }
    return "";
  }

  function metaFromDoc(doc, id) {
    var meta = {
      id: String(id || currentId() || ""),
      url: "",
      ext: "",
      kind: "",
      artist: [],
      character: [],
      copyright: [],
      general: [],
      tags: [],
      rating: "",
      score: "",
      site: (function () {
        try {
          return location.hostname;
        } catch (e) {
          return "";
        }
      })()
    };
    var url = mediaUrlFromDoc(doc);
    if (url) {
      meta.url = url;
      meta.ext = extFromUrl(url) || (isVideo(url) ? "mp4" : "jpg");
      meta.kind = isVideo(url) ? "video" : "image";
    }
    var sc = doc.querySelector(".score-info, #score, .score");
    if (sc) meta.score = (String(sc.textContent || "").match(/-?\d+/) || [""])[0];
    var side = doc.querySelector("#tag-sidebar");
    if (side) {
      Array.prototype.forEach.call(side.querySelectorAll("li"), function (li) {
        var cls = li.className || "";
        var m = /tag-type-([a-z]+)/.exec(cls);
        var name = "";
        var a = li.querySelector("a[href*='tags=']");
        if (a) {
          var mm = /[?&]tags=([^&]+)/.exec(a.getAttribute("href") || "");
          if (mm) {
            try {
              name = decodeURIComponent(mm[1].replace(/\+/g, " "));
            } catch (e) {}
          }
        }
        if (!name) return;
        meta.tags.push(name);
        var t = m ? m[1] : "";
        if (t === "artist") meta.artist.push(name);
        else if (t === "character") meta.character.push(name);
        else if (t === "copyright") meta.copyright.push(name);
        else if (t === "general") meta.general.push(name);
        else if (t === "metadata" || /^rating[:_ ]/i.test(name)) meta.rating = name.replace(/^rating[:_ ]+\s*/i, "");
      });
    }
    return meta;
  }

  function currentId() {
    if (R.downloads.currentId) return String(R.downloads.currentId() || "");
    return util.currentPostId();
  }

  function postUrl(id) {
    if (R.downloads.postUrl) return R.downloads.postUrl(id);
    return location.origin + "/index.php?page=post&s=view&id=" + encodeURIComponent(id);
  }

  function fetchText(url) {
    var x = gmXhr();
    if (!x) {
      return fetch(url, { credentials: "omit" }).then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      });
    }
    return new Promise(function (resolve, reject) {
      x({
        method: "GET",
        url: url,
        timeout: 45000,
        onload: function (r) {
          if (r.status >= 200 && r.status < 300) resolve(r.responseText);
          else reject(new Error("HTTP " + r.status));
        },
        onerror: function () {
          reject(new Error("no se pudo cargar la p\u00e1gina"));
        },
        ontimeout: function () {
          reject(new Error("se agot\u00f3 el tiempo"));
        }
      });
    });
  }

  function fetchDoc(url) {
    return fetchText(url).then(function (text) {
      return new DOMParser().parseFromString(text, "text/html");
    });
  }

  function fetchBlob(url, onProgress, item) {
    var x = gmXhr();
    if (!x) {
      return fetch(url, { credentials: "omit", mode: "cors" }).then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.blob();
      });
    }
    return new Promise(function (resolve, reject) {
      var req = x({
        method: "GET",
        url: url,
        responseType: "blob",
        timeout: 180000,
        onprogress: function (e) {
          if (onProgress && e && e.lengthComputable && e.total) onProgress(e.loaded / e.total);
        },
        onload: function (r) {
          if (r.status >= 200 && r.status < 300 && r.response) resolve(r.response);
          else reject(new Error("HTTP " + r.status));
        },
        onerror: function () {
          reject(new Error("no se pudo leer el archivo"));
        },
        ontimeout: function () {
          reject(new Error("se agot\u00f3 el tiempo"));
        }
      });
      if (req && item) item.abort = function () {
        try {
          if (req.abort) req.abort();
        } catch (e) {}
      };
    });
  }

  var dbPromise = null;
  function db() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve, reject) {
      try {
        var req = indexedDB.open(DIR_DB, 1);
        req.onupgradeneeded = function () {
          try {
            if (!req.result.objectStoreNames.contains(DIR_STORE)) req.result.createObjectStore(DIR_STORE);
          } catch (e) {}
        };
        req.onsuccess = function () {
          resolve(req.result);
        };
        req.onerror = function () {
          reject(req.error || new Error("indexedDB"));
        };
      } catch (e) {
        reject(e);
      }
    });
    return dbPromise;
  }

  function idbPut(key, value) {
    return db().then(function (d) {
      return new Promise(function (res, rej) {
        var tx = d.transaction(DIR_STORE, "readwrite");
        tx.objectStore(DIR_STORE).put(value, key);
        tx.oncomplete = function () {
          res(true);
        };
        tx.onerror = function () {
          rej(tx.error);
        };
      });
    });
  }

  function idbGet(key) {
    return db().then(function (d) {
      return new Promise(function (res, rej) {
        var tx = d.transaction(DIR_STORE, "readonly");
        var r = tx.objectStore(DIR_STORE).get(key);
        r.onsuccess = function () {
          res(r.result || null);
        };
        r.onerror = function () {
          rej(r.error);
        };
      });
    });
  }

  function idbDel(key) {
    return db().then(function (d) {
      return new Promise(function (res, rej) {
        var tx = d.transaction(DIR_STORE, "readwrite");
        tx.objectStore(DIR_STORE).delete(key);
        tx.oncomplete = function () {
          res(true);
        };
        tx.onerror = function () {
          rej(tx.error);
        };
      });
    });
  }

  var dirHandle = null;

  function dirName() {
    return dirHandle ? dirHandle.name || "(carpeta)" : "";
  }

  function loadDir() {
    return idbGet(DIR_KEY).then(
      function (h) {
        if (h && h.getFileHandle) dirHandle = h;
        return dirHandle;
      },
      function () {
        return null;
      }
    );
  }

  function dirAvailable() {
    var w = pageWin();
    return !!(w && w.showDirectoryPicker && dirHandle);
  }

  function chooseDir() {
    var w = pageWin();
    if (!w || !w.showDirectoryPicker) {
      return Promise.reject(new Error("este navegador no sabe elegir carpeta (Chrome y Edge s\u00ed)"));
    }
    return w
      .showDirectoryPicker({ id: "r34g-downloads", mode: "readwrite" })
      .then(function (h) {
        dirHandle = h;
        return idbPut(DIR_KEY, h).catch(function () {});
      })
      .then(function () {
        R.downloads.syncDirState();
        util.toast("Carpeta de descargas: " + dirName());
        return dirHandle;
      });
  }

  function forgetDir() {
    dirHandle = null;
    R.downloads.syncDirState();
    return idbDel(DIR_KEY).catch(function () {});
  }

  function ensureDirPermission() {
    if (!dirHandle) return Promise.resolve(false);
    var opts = { mode: "readwrite" };
    var q = dirHandle.queryPermission ? dirHandle.queryPermission(opts) : Promise.resolve("granted");
    return Promise.resolve(q).then(function (p) {
      if (p === "granted") return true;
      if (!dirHandle.requestPermission) return false;
      return Promise.resolve(dirHandle.requestPermission(opts)).then(function (r) {
        return r === "granted";
      });
    });
  }

  function withExt(name, ext) {
    if (/\.[a-z0-9]{2,5}$/i.test(name)) return name;
    return name + "." + ext;
  }

  function nextFree(dir, name, ext) {
    var stem = name.replace(/\.[a-z0-9]{2,5}$/i, "");
    var i = 1;
    var probe = function (n) {
      return dir.getFileHandle(n).then(
        function () {
          i++;
          if (i > 60) return n;
          return probe(stem + " (" + i + ")" + "." + ext);
        },
        function () {
          return n;
        }
      );
    };
    return probe(name);
  }

  function writeToDir(dir, blob, file, ext, parts) {
    var conflict = R.settings.dlConflict || "uniquify";
    var name = withExt(file, ext);
    var target = dir;
    parts = parts || [];
    var step = function (i) {
      if (i >= parts.length) return Promise.resolve(target);
      return target.getDirectoryHandle(parts[i], { create: true }).then(function (d) {
        target = d;
        return step(i + 1);
      });
    };
    return step(0).then(function (d) {
      if (conflict === "skip") {
        return d.getFileHandle(name).then(
          function () {
            return { skipped: true, name: name };
          },
          function () {
            return d.getFileHandle(name, { create: true }).then(function (fh) {
              return fh.createWritable().then(function (w) {
                return w.write(blob).then(function () {
                  return w.close();
                });
              }).then(function () {
                return { name: name };
              });
            });
          }
        );
      }
      if (conflict === "uniquify") {
        return nextFree(d, name, ext).then(function (free) {
          return d.getFileHandle(free, { create: true }).then(function (fh) {
            return fh.createWritable().then(function (w) {
              return w.write(blob).then(function () {
                return w.close();
              });
            });
          }).then(function () {
            return { name: free };
          });
        });
      }
      return d.getFileHandle(name, { create: true }).then(function (fh) {
        return fh.createWritable().then(function (w) {
          return w.write(blob).then(function () {
            return w.close();
          });
        });
      }).then(function () {
        return { name: name };
      });
    });
  }

  function anchorSave(blob, name) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 60000);
    return Promise.resolve({ name: name, flat: true });
  }

  function saveBlob(blob, path, ext) {
    var hook = testHook("save");
    if (hook) return Promise.resolve(hook(blob, path, ext));
    if (dirHandle) {
      return writeToDir(dirHandle, blob, path.file, ext, path.folder ? path.folder.split("/") : []);
    }
    return anchorSave(blob, path.file);
  }

  var queue = { items: [], active: 0, stopped: false, seq: 0 };

  function ensureWidget() {
    var w = document.getElementById(QUEUE_ID);
    if (w) return w;
    w = util.el("div", "r34g-dlq");
    w.id = QUEUE_ID;
    w.appendChild(util.el("div", "r34g-dlq-head"));
    var head = w.querySelector(".r34g-dlq-head");
    head.appendChild(util.el("b", null, "Descargas"));
    var count = util.el("span", "r34g-dlq-count");
    count.id = "r34g-dlq-count";
    head.appendChild(count);
    var retry = util.el("button", "r34g-mini", "Reintentar");
    retry.type = "button";
    retry.id = "r34g-dlq-retry";
    retry.hidden = true;
    retry.title = "Vuelve a intentar las descargas que fallaron";
    retry.addEventListener("click", function () {
      retryFailed();
    });
    head.appendChild(retry);
    var cancel = util.el("button", "r34g-mini", "Cancelar");
    cancel.type = "button";
    cancel.id = "r34g-dlq-cancel";
    cancel.addEventListener("click", function () {
      queue.stopped = true;
      queue.items.forEach(function (it) {
        if (it.state === "wait") it.state = "cancel";
      });
      if (zipJob) {
        try {
          zipJob.abort();
        } catch (e) {}
      }
      if (running) {
        try {
          running.abort();
        } catch (e) {}
      }
      renderQueue();
      util.toast("Descargas canceladas");
    });
    head.appendChild(cancel);
    var close = util.el("button", "r34g-mini", "Cerrar");
    close.type = "button";
    close.id = "r34g-dlq-close";
    close.addEventListener("click", function () {
      var w2 = document.getElementById(QUEUE_ID);
      if (w2) w2.remove();
      var pending = queue.items.some(function (it) {
        return it.state === "wait" || it.state === "hold" || it.state === "error";
      });
      if (pending) util.toast("Lo que queda pendiente sigue guardado: al recargar la p\u00e1gina podr\u00e1s continuar", 4000);
    });
    head.appendChild(close);
    var restore = util.el("div", "r34g-dlq-restore");
    restore.id = "r34g-dlq-restore";
    restore.hidden = true;
    restore.appendChild(util.el("span", "r34g-dlq-restore-txt"));
    var resBtn = util.el("button", "r34g-mini", "Continuar");
    resBtn.type = "button";
    resBtn.id = "r34g-dlq-resume";
    resBtn.addEventListener("click", function () {
      if (!resumeQueue()) retryFailed();
    });
    restore.appendChild(resBtn);
    var disBtn = util.el("button", "r34g-mini", "Descartar");
    disBtn.type = "button";
    disBtn.id = "r34g-dlq-discard";
    disBtn.addEventListener("click", function () {
      discardQueue();
    });
    restore.appendChild(disBtn);
    w.appendChild(restore);
    w.appendChild(util.el("div", "r34g-dlq-list"));
    document.body.appendChild(w);
    return w;
  }

  function syncItem(item) {
    queueSave();
    if (!item.el) return;
    var nameEl = item.el.querySelector(".r34g-dlq-name");
    if (nameEl && item.label && nameEl.textContent !== item.label) nameEl.textContent = item.label;
    item.el.querySelector(".r34g-dlq-state").textContent = item.stateText || stateLabel(item);
    var bar = item.el.querySelector(".r34g-dlq-bar > i");
    if (bar) bar.style.width = Math.round((item.progress || 0) * 100) + "%";
    item.el.dataset.state = item.state;
  }

  function stateLabel(item) {
    switch (item.state) {
      case "wait":
        return "en cola";
      case "hold":
        return "en espera (de la sesi\u00f3n anterior)";
      case "resolve":
        return "leyendo el post\u2026";
      case "run":
        return (item.zip ? "preparando el .zip " : "descargando ") + Math.round((item.progress || 0) * 100) + "%";
      case "save":
        return "guardando\u2026";
      case "done":
        return "guardado: " + (item.fileName || "");
      case "skip":
        return "ya lo ten\u00edas";
      case "open":
        return "abierto en otra pesta\u00f1a";
      case "error":
        return "error: " + (item.error || "");
      case "cancel":
        return "cancelado";
      default:
        return item.state;
    }
  }

  function renderQueue() {
    var w = ensureWidget();
    var list = w.querySelector(".r34g-dlq-list");
    var count = w.querySelector(".r34g-dlq-count");
    var pending = queue.items.filter(function (it) {
      return it.state === "wait" || it.state === "resolve" || it.state === "run" || it.state === "save";
    }).length;
    count.textContent = pending ? "(" + pending + " en curso)" : "(" + queue.items.length + ")";
    var held = 0;
    var failed = 0;
    queue.items.forEach(function (it) {
      if (it.state === "hold") held++;
      else if (isRetryable(it)) failed++;
    });
    var banner = w.querySelector("#r34g-dlq-restore");
    if (banner) {
      banner.hidden = !held && !failed;
      var txt = banner.querySelector(".r34g-dlq-restore-txt");
      if (txt) {
        if (held && failed) {
          txt.textContent =
            "Quedaron " + held + (held === 1 ? " descarga" : " descargas") + " de la sesi\u00f3n anterior y " + failed + (failed === 1 ? " fall\u00f3" : " fallaron");
        } else if (held) {
          txt.textContent =
            held === 1
              ? "Qued\u00f3 1 descarga de la sesi\u00f3n anterior"
              : "Quedaron " + held + " descargas de la sesi\u00f3n anterior";
        } else {
          txt.textContent = failed === 1 ? "Fall\u00f3 1 descarga" : "Fallaron " + failed + " descargas";
        }
      }
      var resBtn = banner.querySelector("#r34g-dlq-resume");
      if (resBtn) resBtn.textContent = held ? "Continuar" : "Reintentar";
    }
    var retryBtn = w.querySelector("#r34g-dlq-retry");
    if (retryBtn) {
      retryBtn.hidden = !failed;
      retryBtn.textContent = failed ? "Reintentar (" + failed + ")" : "Reintentar";
    }
    var keep = {};
    queue.items.slice(-40).forEach(function (it) {
      keep[it.id] = 1;
    });
    Array.prototype.slice.call(list.children).forEach(function (n) {
      if (!keep[n.dataset.id]) n.remove();
    });
    queue.items.slice(-40).forEach(function (it) {
      if (!it.el) {
        var row = util.el("div", "r34g-dlq-item");
        row.dataset.id = String(it.id);
        row.appendChild(util.el("span", "r34g-dlq-name", it.label || ("post " + it.pid)));
        var track = util.el("span", "r34g-dlq-bar");
        track.appendChild(util.el("i"));
        row.appendChild(track);
        row.appendChild(util.el("span", "r34g-dlq-state"));
        it.el = row;
      }
      list.appendChild(it.el);
      syncItem(it);
    });
    if (!queue.items.length) w.remove();
  }

  var running = null;

  function pump() {
    var max = Math.max(1, Math.min(6, util.num(R.settings.dlQueue) || 3));
    while (!queue.stopped && queue.active < max) {
      var next = null;
      for (var i = 0; i < queue.items.length; i++) {
        if (queue.items[i].state === "wait") {
          next = queue.items[i];
          break;
        }
      }
      if (!next) break;
      next.state = "resolve";
      queue.active++;
      syncItem(next);
      runItem(next);
    }
    renderQueue();
  }

  function enqueue(pid, meta, single) {
    var item = { id: ++queue.seq, pid: String(pid || (meta && meta.id) || ""), meta: meta || null, state: "wait", progress: 0, single: !!single };
    item.label = item.pid ? "post " + item.pid : "descarga";
    queue.stopped = false;
    queue.items.push(item);
    ensureWidget();
    renderQueue();
    pump();
    return item;
  }

  function hasRunning() {
    return queue.items.some(function (it) {
      return it.state === "resolve" || it.state === "run" || it.state === "save";
    });
  }

  // ---- Cola guardada: continuar un lote despues de recargar la pagina ----
  // Solo se guardan las descargas que aun no han terminado (pendientes o fallidas), con el id del
  // post: los datos del nombre se vuelven a leer del post al continuar, asi que la plantilla sale
  // igual que la primera vez y el almacenamiento no se llena con las etiquetas de 300 posts.

  var qsaveTimer = 0;

  function queueSaveNow() {
    qsaveTimer = 0;
    var out = [];
    queue.items.forEach(function (it) {
      if (it.zip) return;
      if (it.state === "done" || it.state === "skip" || it.state === "open" || it.state === "cancel") return;
      var pid = String(it.pid || (it.meta && it.meta.id) || "");
      if (!pid) return;
      out.push({
        pid: pid,
        label: it.label || "",
        single: !!it.single,
        state: it.state === "error" ? "error" : "hold",
        error: it.state === "error" ? String(it.error || "") : ""
      });
    });
    out = out.slice(-QSAVE_MAX);
    try {
      if (!out.length) localStorage.removeItem(QSAVE_KEY);
      else localStorage.setItem(QSAVE_KEY, JSON.stringify({ v: 1, ts: Date.now(), items: out }));
    } catch (e) {}
  }

  function queueSave() {
    if (qsaveTimer) clearTimeout(qsaveTimer);
    qsaveTimer = setTimeout(queueSaveNow, 500);
  }

  function queueLoad() {
    try {
      var data = JSON.parse(localStorage.getItem(QSAVE_KEY) || "null");
      if (!data || !data.v || !Array.isArray(data.items)) return [];
      return data.items.filter(function (it) {
        return it && it.pid;
      });
    } catch (e) {
      return [];
    }
  }

  function restoreQueue() {
    var saved = queueLoad();
    if (!saved.length) return 0;
    var added = 0;
    saved.forEach(function (s) {
      var already = queue.items.some(function (it) {
        return it.pid === String(s.pid);
      });
      if (already) return;
      var failed = s.state === "error";
      queue.items.push({
        id: ++queue.seq,
        pid: String(s.pid),
        meta: null,
        state: failed ? "error" : "hold",
        progress: 0,
        single: !!s.single,
        label: s.label || "post " + s.pid,
        error: failed ? s.error || "" : ""
      });
      added++;
    });
    if (!added) return 0;
    ensureWidget();
    renderQueue();
    return added;
  }

  function countState(state) {
    return queue.items.filter(function (it) {
      return it.state === state;
    }).length;
  }

  // Estados que se pueden volver a intentar: los que fallaron, y los que acabaron abriéndose en
  // otra pestaña porque no se pudo leer el archivo (que en la práctica es el mismo caso).
  function isRetryable(it) {
    return it.state === "error" || it.state === "open";
  }

  function countRetryable() {
    return queue.items.filter(function (it) {
      return isRetryable(it);
    }).length;
  }

  function resumeQueue() {
    var n = 0;
    queue.items.forEach(function (it) {
      if (it.state === "hold") {
        it.state = "wait";
        it.progress = 0;
        n++;
      }
    });
    if (!n) return 0;
    queue.stopped = false;
    ensureWidget();
    renderQueue();
    pump();
    util.toast("Continuando " + n + (n === 1 ? " descarga pendiente" : " descargas pendientes"));
    return n;
  }

  function discardQueue() {
    var held = countState("hold");
    var failed = countState("error");
    queue.items = queue.items.filter(function (it) {
      return it.state !== "hold" && it.state !== "error";
    });
    queueSaveNow();
    renderQueue();
    if (held || failed) util.toast("Cola pendiente descartada");
    return held + failed;
  }

  function retryFailed() {
    var n = 0;
    queue.items.forEach(function (it) {
      if (isRetryable(it)) {
        it.state = "wait";
        it.error = "";
        it.progress = 0;
        n++;
      }
    });
    if (!n) return 0;
    queue.stopped = false;
    ensureWidget();
    renderQueue();
    pump();
    util.toast("Reintentando " + n + (n === 1 ? " descarga" : " descargas"));
    return n;
  }

  function queueFlush() {
    if (qsaveTimer) {
      clearTimeout(qsaveTimer);
      qsaveTimer = 0;
      queueSaveNow();
    }
  }

  try {
    window.addEventListener("pagehide", queueFlush);
    window.addEventListener("beforeunload", queueFlush);
  } catch (e) {}

  function runItem(item) {
    var finish = function () {
      queue.active = Math.max(0, queue.active - 1);
      syncItem(item);
      renderQueue();
      if (!hasRunning()) queue.stopped = false;
      pump();
    };
    var meta = item.meta;
    var resolveStep = meta && meta.url ? Promise.resolve(meta) : resolveMeta(item.pid, item);
    resolveStep
      .then(function (m) {
        if (!m || !m.url) throw new Error("el post no tiene archivo");
        item.meta = m;
        if (R.settings.dlSkip && hist().has(m.id)) {
          item.state = "skip";
          item.progress = 1;
          return null;
        }
        item.state = "run";
        syncItem(item);
        running = item;
        return fetchBlob(m.url, function (p) {
          item.progress = p;
          syncItem(item);
        }, item).then(function (blob) {
          running = null;
          item.state = "save";
          syncItem(item);
          var path = buildPath(m, m.ext);
          return saveBlob(blob, path, m.ext).then(function (res) {
            item.fileName = (path.folder ? path.folder + "/" : "") + (res && res.name ? res.name : path.file);
            if (res && res.skipped) {
              item.state = "skip";
            } else {
              item.state = "done";
              item.progress = 1;
              hist().add(m.id, item.fileName);
              refreshBadges();
            }
            util.toast("Guardado: " + item.fileName, 3200);
            return null;
          });
        });
      })
      .catch(function (e) {
        running = null;
        if (R.settings.dlOpen && item.single && item.meta && item.meta.url) {
          item.state = "open";
          try {
            window.open(item.meta.url, "_blank", "noopener");
          } catch (e2) {}
          util.toast("No se pudo leer el archivo (" + (e && e.message) + "): lo abro en una pesta\u00f1a para que lo guardes t\u00fa", 5200);
        } else {
          item.state = "error";
          item.error = (e && e.message) || String(e);
          util.toast("Descarga fallida en el post " + item.pid + ": " + item.error, 4200);
        }
      })
      .then(finish, finish);
  }

  function resolveMeta(pid, item) {
    var current = currentId();
    if (current && String(current) === String(pid)) {
      return Promise.resolve(metaFromDoc(document, pid));
    }
    if (item) item.state = "resolve";
    return fetchDoc(postUrl(pid)).then(function (doc) {
      return metaFromDoc(doc, pid);
    });
  }

  function downloadPost(pid, opts) {
    opts = opts || {};
    if (!pid) return null;
    if (R.settings.dlSkip && hist().has(pid)) {
      util.toast("El post " + pid + " ya est\u00e1 en tu historial de descargas", 3000);
      return null;
    }
    return enqueue(pid, opts.meta || null, opts.single !== false);
  }

  function downloadNow(pid, btn) {
    ensureDirPermission();
    var item = downloadPost(pid, { single: true });
    if (btn && item) {
      btn.classList.add("r34g-busy");
      var timer = setInterval(function () {
        if (item.state === "done" || item.state === "error" || item.state === "skip" || item.state === "open" || item.state === "cancel") {
          clearInterval(timer);
          btn.classList.remove("r34g-busy");
        }
      }, 400);
    }
  }

  function batchUrl(tags, pid) {
    if (typeof R.downloads.listUrl === "function") return R.downloads.listUrl(tags, pid);
    var base = location.origin + "/index.php?page=post&s=list";
    return base + "&tags=" + encodeURIComponent(tags || "all") + "&pid=" + (pid || 0);
  }

  function queryTags() {
    if (typeof R.downloads.tags === "function") return String(R.downloads.tags());
    try {
      return new URLSearchParams(location.search).get("tags") || "all";
    } catch (e) {
      return "all";
    }
  }

  function isListPage() {
    if (typeof R.downloads.isList === "function") return !!R.downloads.isList();
    try {
      var p = new URLSearchParams(location.search);
      return (p.get("page") || "") === "post" && (p.get("s") || "") === "list";
    } catch (e) {
      return false;
    }
  }

  function collectIds(doc) {
    var out = [];
    Array.prototype.forEach.call(doc.querySelectorAll(".thumb > a, .image-list a[href*='id=']"), function (a) {
      var id = util.postIdFromHref(a.getAttribute("href"));
      if (id) out.push(id);
    });
    return out;
  }

  function collectBatch(pages, status) {
    var tags = queryTags();
    var ids = [];
    var page = 0;
    var step = function () {
      if (page >= pages) return Promise.resolve();
      status("Leyendo la p\u00e1gina " + (page + 1) + " de " + pages + "\u2026");
      return fetchDoc(batchUrl(tags, page * 42))
        .then(function (doc) {
          collectIds(doc).forEach(function (id) {
            if (ids.indexOf(id) === -1) ids.push(id);
          });
          page++;
          return sleep(500).then(step);
        })
        .catch(function (e) {
          status("Error al leer la lista: " + e.message);
          throw e;
        });
    };
    return step().then(function () {
      return ids;
    });
  }

  function runBatch(pages, skipSaved, status) {
    return collectBatch(pages, status).then(function (ids) {
      var fresh = ids.filter(function (id) {
        return !(skipSaved && hist().has(id));
      });
      status(fresh.length + " posts en cola (" + ids.length + " encontrados)");
      ensureDirPermission();
      fresh.forEach(function (id) {
        enqueue(id, null, false);
      });
      return fresh.length;
    });
  }

  function selLoad() {
    try {
      var raw = sessionStorage.getItem(SEL_KEY2);
      if (raw) {
        var data = JSON.parse(raw);
        if (data && data.ids && data.ids.length) {
          sel.ids = data.ids.map(String);
          sel.meta = data.meta && typeof data.meta === "object" ? data.meta : {};
        }
        return;
      }
      // formato antiguo (0.6.0 y anteriores): solo una lista de ids
      var old = sessionStorage.getItem(SEL_KEY);
      if (!old) return;
      var arr = JSON.parse(old);
      if (arr && arr.length) sel.ids = arr.map(String);
    } catch (e) {}
  }

  function selSave() {
    try {
      sessionStorage.setItem(SEL_KEY2, JSON.stringify({ ids: sel.ids, meta: sel.meta }));
      sessionStorage.removeItem(SEL_KEY);
    } catch (e) {}
  }

  function selHas(id) {
    return !!id && sel.ids.indexOf(String(id)) !== -1;
  }

  function selPageIds() {
    var out = [];
    Array.prototype.forEach.call(document.querySelectorAll(".image-list .thumb"), function (thumb) {
      var link = thumb.querySelector("a") || thumb;
      var id = util.postIdFromHref(link.getAttribute ? link.getAttribute("href") : "");
      if (id && out.indexOf(id) === -1) out.push(id);
    });
    return out;
  }

  // Guarda una miniatura y unas etiquetas por cada post marcado, para poder enseñar la lista
  // completa de marcados (incluidos los de otras páginas, que ya no están en el DOM).
  function selGrabMeta(id) {
    var out = null;
    Array.prototype.forEach.call(document.querySelectorAll(".image-list .thumb"), function (thumb) {
      if (out) return;
      var link = thumb.querySelector("a") || thumb;
      if (util.postIdFromHref(link.getAttribute ? link.getAttribute("href") : "") !== id) return;
      var img = thumb.querySelector("img");
      out = {
        src: img ? img.getAttribute("src") || "" : "",
        alt: img ? (img.getAttribute("alt") || "").trim() : "",
        href: link.getAttribute ? link.getAttribute("href") || "" : ""
      };
    });
    return out;
  }

  function selToggle(id) {
    id = String(id || "");
    if (!id) return;
    if (!sel.on) selSetMode(true);
    var i = sel.ids.indexOf(id);
    if (i === -1) {
      sel.ids.push(id);
      if (!sel.meta[id]) {
        var m = selGrabMeta(id);
        if (m) sel.meta[id] = m;
      }
    } else {
      sel.ids.splice(i, 1);
      delete sel.meta[id];
    }
    selSave();
    selRender();
  }

  function selDrop(id) {
    id = String(id || "");
    var i = sel.ids.indexOf(id);
    if (i === -1) return;
    sel.ids.splice(i, 1);
    delete sel.meta[id];
    selSave();
    selRender();
  }

  function selAllPage() {
    selPageIds().forEach(function (id) {
      if (sel.ids.indexOf(id) === -1) sel.ids.push(id);
    });
    selSave();
    selRender();
  }

  function selClear() {
    sel.ids = [];
    sel.meta = {};
    sel.panel = false;
    selSave();
    selRender();
  }

  function selKey(e) {
    if (e.key !== "Escape") return;
    var m = document.getElementById("r34g-modal");
    if (m && m.classList.contains("r34g-open")) return;
    if (sel.panel) {
      sel.panel = false;
      buildSelPanel();
      return;
    }
    selSetMode(false);
  }

  // Esc tiene que funcionar mientras haya modo selección O la lista abierta (se puede abrir la
  // lista desde la barra sin estar en modo selección).
  function selBindKeys() {
    document.removeEventListener("keydown", selKey, true);
    if (sel.on || sel.panel) document.addEventListener("keydown", selKey, true);
  }

  function selSetMode(on) {
    sel.on = !!on;
    if (!sel.on) sel.panel = false;
    if (document.body) document.body.classList.toggle("r34g-selecting", sel.on);
    if (sel.on) decorateAll(document);
    var bar = document.getElementById("r34g-dl-batch");
    if (bar) bar.remove();
    buildBatchBar();
    selRender();
  }

  function downloadSelected(zip) {
    var ids = sel.ids.slice();
    if (!ids.length) {
      util.toast("No hay nada seleccionado");
      return;
    }
    var skipped = 0;
    var fresh = ids.filter(function (id) {
      if (R.settings.dlSkip && hist().has(id)) {
        skipped++;
        return false;
      }
      return true;
    });
    if (zip) {
      if (!fresh.length) {
        util.toast(skipped ? "Los " + skipped + " seleccionados ya estaban en el historial" : "No hay nada seleccionado");
        return;
      }
      var job = runZip(fresh, "rule34-seleccion", false);
      selClear();
      // el .zip ya avisa por su cuenta si falla; esto evita que el error quede suelto en la consola
      if (job && job.catch) job.catch(function () {});
      return;
    }
    ensureDirPermission();
    fresh.forEach(function (id) {
      enqueue(id, null, false);
    });
    if (fresh.length) {
      util.toast(fresh.length + " post" + (fresh.length === 1 ? "" : "s") + " en cola" + (skipped ? " \u00b7 " + skipped + " omitido" + (skipped === 1 ? "" : "s") + " por historial" : ""));
    } else if (skipped) {
      util.toast("Los " + skipped + " seleccionados ya estaban en el historial");
    }
    selClear();
  }

  function selRender() {
    var n = sel.ids.length;
    Array.prototype.forEach.call(document.querySelectorAll(".r34g-sel-box"), function (box) {
      var on = selHas(box.getAttribute("data-id"));
      box.classList.toggle("r34g-on", on);
      var thumb = box.closest ? box.closest(".thumb") : null;
      if (thumb) thumb.classList.toggle("r34g-picked", on);
    });
    var bar = document.getElementById("r34g-dl-batch");
    if (bar) {
      var tog = bar.querySelector("#r34g-dl-selbtn");
      if (tog) {
        tog.classList.toggle("r34g-on", sel.on);
        var lbl = tog.querySelector("span");
        if (lbl) lbl.textContent = sel.on ? " Salir de selecci\u00f3n" : " Seleccionar";
      }
      var all = bar.querySelector("#r34g-dl-selall");
      var none = bar.querySelector("#r34g-dl-selnone");
      if (all) all.hidden = !sel.on;
      if (none) none.hidden = !sel.on;
      var note = bar.querySelector(".r34g-sel-note");
      if (note) {
        note.hidden = !n;
        note.textContent = n + " seleccionado" + (n === 1 ? "" : "s") + " \u00b7 ver lista";
      }
      var selGo = bar.querySelector("#r34g-dl-batch-selgo");
      if (selGo) {
        selGo.hidden = !n;
        var selGoLbl = selGo.querySelector("span");
        if (selGoLbl) selGoLbl.textContent = n === 1 ? " Descargar la marcada" : " Descargar las " + n + " marcadas";
      }
    }
    buildSelPill();
    buildSelPanel();
    selBindKeys();
  }

  function buildSelPill() {
    var pill = document.getElementById("r34g-dl-selpill");
    if (!sel.on || !isListPage() || !R.settings.dlOn) {
      if (pill) pill.remove();
      return;
    }
    if (!pill) {
      pill = util.el("div", "r34g-dl-selpill");
      pill.id = "r34g-dl-selpill";
      document.body.appendChild(pill);
    }
    while (pill.firstChild) pill.removeChild(pill.firstChild);
    var n = sel.ids.length;
    var info = util.el("button", "r34g-selpill-info");
    info.type = "button";
    info.title = "Ver la lista de posts seleccionados (incluidos los de otras p\u00e1ginas)";
    info.appendChild(util.el("b", null, String(n)));
    info.appendChild(document.createTextNode(" seleccionado" + (n === 1 ? "" : "s") + " \u00b7 ver"));
    info.addEventListener("click", function () {
      sel.panel = !sel.panel;
      buildSelPanel();
    });
    pill.appendChild(info);
    var go = util.el("button", "r34g-btn");
    go.type = "button";
    go.id = "r34g-dl-selgo";
    go.disabled = !n;
    if (n) go.classList.add("r34g-on");
    go.title = "Descarga los posts marcados (respeta \u00abomitir ya descargados\u00bb)";
    go.appendChild(util.icon("dl"));
    go.appendChild(document.createTextNode(" Descargar" + (n ? " " + n : "")));
    go.addEventListener("click", function () {
      downloadSelected(false);
    });
    pill.appendChild(go);
    var zip = util.el("button", "r34g-btn");
    zip.type = "button";
    zip.id = "r34g-dl-selzip";
    zip.disabled = !n;
    zip.title = "Descargar los posts marcados dentro de un solo .zip";
    zip.appendChild(document.createTextNode("ZIP"));
    zip.addEventListener("click", function () {
      downloadSelected(true);
    });
    pill.appendChild(zip);
    var all = util.el("button", "r34g-btn", "Todas");
    all.type = "button";
    all.title = "Marcar todos los posts de esta p\u00e1gina";
    all.addEventListener("click", selAllPage);
    pill.appendChild(all);
    var none = util.el("button", "r34g-btn", "Ninguna");
    none.type = "button";
    none.title = "Vaciar la selecci\u00f3n";
    none.addEventListener("click", selClear);
    pill.appendChild(none);
    var exit = util.el("button", "r34g-btn r34g-selpill-x", "\u2715");
    exit.type = "button";
    exit.title = "Salir del modo selecci\u00f3n (Esc)";
    exit.addEventListener("click", function () {
      selSetMode(false);
    });
    pill.appendChild(exit);
  }

  // Lista de lo marcado, para que nunca haya dudas de qué se va a descargar: enseña cada post
  // (miniatura + id + etiquetas), separa los de esta página de los de otras, y deja quitar
  // cualquiera o vaciarlo todo. Se abre desde el contador de la barra de abajo.
  function buildSelPanel() {
    var panel = document.getElementById("r34g-dl-selpanel");
    var n = sel.ids.length;
    if (!sel.panel || !n || !R.settings.dlOn || !isListPage()) {
      if (panel) panel.remove();
      return;
    }
    if (!panel) {
      panel = util.el("div", "r34g-dl-selpanel");
      panel.id = "r34g-dl-selpanel";
      document.body.appendChild(panel);
    }
    while (panel.firstChild) panel.removeChild(panel.firstChild);
    var here = selPageIds();
    var onHere = sel.ids.filter(function (id) {
      return here.indexOf(id) !== -1;
    }).length;
    var head = util.el("div", "r34g-dlsp-head");
    head.appendChild(util.el("b", null, "Seleccionados (" + n + ")"));
    head.appendChild(util.el("span", "r34g-dlsp-count", onHere + " en esta p\u00e1gina \u00b7 " + (n - onHere) + " de otras"));
    var clear = util.el("button", "r34g-mini", "Vaciar");
    clear.type = "button";
    clear.title = "Quitar todas las marcas";
    clear.addEventListener("click", selClear);
    head.appendChild(clear);
    var close = util.el("button", "r34g-mini", "\u2715");
    close.type = "button";
    close.title = "Cerrar la lista (Esc)";
    close.addEventListener("click", function () {
      sel.panel = false;
      buildSelPanel();
    });
    head.appendChild(close);
    panel.appendChild(head);
    var list = util.el("div", "r34g-dlsp-list");
    var ordered = here.filter(function (id) {
      return sel.ids.indexOf(id) !== -1;
    });
    sel.ids.forEach(function (id) {
      if (ordered.indexOf(id) === -1) ordered.push(id);
    });
    ordered.forEach(function (id) {
      var meta = sel.meta[id] || {};
      var row = util.el("div", "r34g-dlsp-item");
      row.dataset.id = id;
      row.title = meta.alt || "";
      if (here.indexOf(id) === -1) row.classList.add("r34g-dlsp-other");
      if (meta.src) {
        var img = util.el("img", "r34g-dlsp-thumb");
        img.setAttribute("src", meta.src);
        img.setAttribute("alt", "");
        img.setAttribute("loading", "lazy");
        row.appendChild(img);
      } else {
        row.appendChild(util.el("span", "r34g-dlsp-thumb r34g-dlsp-nothumb"));
      }
      var info = util.el("span", "r34g-dlsp-info");
      info.appendChild(util.el("b", null, "#" + id));
      var alt = (meta.alt || "").trim();
      info.appendChild(util.el("span", "r34g-dlsp-tags", alt ? " " + alt.slice(0, 110) : " (otra p\u00e1gina)"));
      row.appendChild(info);
      var drop = util.el("button", "r34g-mini r34g-dlsp-x", "\u2715");
      drop.type = "button";
      drop.title = "Quitar de la selecci\u00f3n";
      drop.addEventListener("click", function () {
        selDrop(id);
      });
      row.appendChild(drop);
      list.appendChild(row);
    });
    panel.appendChild(list);
    var foot = util.el("div", "r34g-dlsp-foot");
    var go = util.el("button", "r34g-btn r34g-on");
    go.type = "button";
    go.appendChild(util.icon("dl"));
    go.appendChild(document.createTextNode(" Descargar " + n));
    go.addEventListener("click", function () {
      downloadSelected(false);
    });
    foot.appendChild(go);
    var zip = util.el("button", "r34g-btn", "ZIP " + n);
    zip.type = "button";
    zip.title = "Descargar los seleccionados dentro de un solo .zip";
    zip.addEventListener("click", function () {
      downloadSelected(true);
    });
    foot.appendChild(zip);
    panel.appendChild(foot);
    selBindKeys();
  }

  // ---- .zip ----
  // rule34 sirve imágenes y vídeos ya comprimidos, así que el .zip se arma con el método «store»
  // (sin recomprimir): pesa casi lo mismo que los archivos sueltos y no gasta CPU. Se escribe al
  // vuelo, en trozos, para no llenar la memoria: si hay carpeta elegida va directo al disco.

  var CRC_TABLE = (function () {
    var t = new Uint32Array(256);
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })();

  function crc32(bytes) {
    var c = 0xffffffff;
    for (var i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  }

  var utf8 = (function () {
    var enc = typeof TextEncoder !== "undefined" ? new TextEncoder() : null;
    return function (text) {
      if (enc) return enc.encode(text);
      var out = [];
      for (var i = 0; i < text.length; i++) {
        var c = text.charCodeAt(i);
        if (c < 128) out.push(c);
        else if (c < 2048) out.push(192 | (c >> 6), 128 | (c & 63));
        else out.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63));
      }
      return new Uint8Array(out);
    };
  })();

  function dosStamp(d) {
    return {
      time: ((d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1)) & 0xffff,
      date: (((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()) & 0xffff
    };
  }

  function localHeader(nameBytes, size, crc, stamp) {
    var buf = new Uint8Array(30 + nameBytes.length);
    var dv = new DataView(buf.buffer);
    dv.setUint32(0, 0x04034b50, true);
    dv.setUint16(4, 20, true);
    dv.setUint16(6, 0x0800, true);
    dv.setUint16(8, 0, true);
    dv.setUint16(10, stamp.time, true);
    dv.setUint16(12, stamp.date, true);
    dv.setUint32(14, crc, true);
    dv.setUint32(18, size, true);
    dv.setUint32(22, size, true);
    dv.setUint16(26, nameBytes.length, true);
    dv.setUint16(28, 0, true);
    buf.set(nameBytes, 30);
    return buf;
  }

  function centralHeader(e) {
    var buf = new Uint8Array(46 + e.name.length);
    var dv = new DataView(buf.buffer);
    dv.setUint32(0, 0x02014b50, true);
    dv.setUint16(4, 20, true);
    dv.setUint16(6, 20, true);
    dv.setUint16(8, 0x0800, true);
    dv.setUint16(10, 0, true);
    dv.setUint16(12, e.stamp.time, true);
    dv.setUint16(14, e.stamp.date, true);
    dv.setUint32(16, e.crc, true);
    dv.setUint32(20, e.size, true);
    dv.setUint32(24, e.size, true);
    dv.setUint16(28, e.name.length, true);
    dv.setUint16(30, 0, true);
    dv.setUint16(32, 0, true);
    dv.setUint16(34, 0, true);
    dv.setUint16(36, 0, true);
    dv.setUint32(38, 0, true);
    dv.setUint32(42, e.offset, true);
    buf.set(e.name, 46);
    return buf;
  }

  function endRecord(count, cdSize, cdOffset) {
    var buf = new Uint8Array(22);
    var dv = new DataView(buf.buffer);
    dv.setUint32(0, 0x06054b50, true);
    dv.setUint16(4, 0, true);
    dv.setUint16(6, 0, true);
    dv.setUint16(8, count, true);
    dv.setUint16(10, count, true);
    dv.setUint32(12, cdSize, true);
    dv.setUint32(16, cdOffset, true);
    dv.setUint16(20, 0, true);
    return buf;
  }

  function human(bytes) {
    if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + " GB";
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + " MB";
    if (bytes >= 1024) return Math.round(bytes / 1024) + " KB";
    return bytes + " B";
  }

  function zipFileName(prefix, count) {
    var t = tidy(prefix || "rule34");
    if (t.length > 48) t = t.slice(0, 48).replace(/[ _-]+$/, "");
    var d = new Date();
    var pad = function (n) {
      return (n < 10 ? "0" : "") + n;
    };
    return (t || "rule34") + "-" + count + "posts-" + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "-" + pad(d.getHours()) + pad(d.getMinutes()) + ".zip";
  }

  var zipJob = null;
  var zipAbortCurrent = null;

  function zipBusy() {
    return !!zipJob;
  }

  function runZip(ids, prefix, skipSaved, onStatus) {
    if (zipJob) {
      util.toast("Ya se est\u00e1 creando un .zip: espera a que acabe o canc\u00e9lalo", 3400);
      return Promise.reject(new Error("ya hay un .zip en curso"));
    }
    ids = (ids || []).map(String).filter(Boolean);
    var total = ids.length;
    if (!total) {
      util.toast("No hay nada que empaquetar");
      return Promise.reject(new Error("nada seleccionado"));
    }
    var notify = function (text) {
      if (typeof onStatus === "function") onStatus(text);
    };
    var item = { id: ++queue.seq, pid: "", zip: true, state: "run", progress: 0, label: "lote .zip (0/" + total + ")" };
    queue.items.push(item);
    ensureWidget();
    renderQueue();

    var status = { cancelled: false, failed: [], added: [], bytes: 0, offset: 0, skipped: 0, packed: 0 };
    var entries = [];
    var chunks = [];
    var names = {};
    var writer = null;
    var mode = "";
    var diskName = "";
    var finalName = zipFileName(prefix, total);
    var stamp = dosStamp(new Date());

    zipJob = {
      abort: function () {
        status.cancelled = true;
        if (zipAbortCurrent) {
          try {
            zipAbortCurrent();
          } catch (e) {}
        }
      }
    };

    function uniqueName(name) {
      var key = name.toLowerCase();
      if (!names[key]) {
        names[key] = 1;
        return name;
      }
      var m = /^(.*?)(\.[a-z0-9]{1,6})?$/i.exec(name);
      var stem = m[1];
      var ext = m[2] || "";
      var i = 2;
      var cand = "";
      do {
        cand = stem + " (" + i + ")" + ext;
        i++;
      } while (names[cand.toLowerCase()] && i < 500);
      names[cand.toLowerCase()] = 1;
      return cand;
    }

    function writeChunk(chunk) {
      if (!writer) return Promise.resolve();
      return Promise.resolve(writer.write(chunk));
    }

    function addEntry(name, bytes, blob, crc, aux) {
      var nameBytes = utf8(name);
      var head = localHeader(nameBytes, bytes, crc, stamp);
      if (status.offset + head.length + bytes > 0xffffffff) {
        return Promise.reject(new Error("el .zip se pasar\u00eda de 4 GB: divide el lote en varios"));
      }
      entries.push({ name: nameBytes, size: bytes, crc: crc, offset: status.offset, stamp: stamp });
      status.offset += head.length + bytes;
      status.bytes += bytes;
      if (!aux) status.packed++;
      return writeChunk(head).then(function () {
        return writeChunk(blob);
      });
    }

    function memoryWriter() {
      mode = "memory";
      writer = {
        write: function (chunk) {
          chunks.push(chunk);
          return Promise.resolve();
        },
        close: function () {
          var blob = new Blob(chunks, { type: "application/zip" });
          chunks = [];
          return anchorSave(blob, finalName);
        },
        abort: function () {
          chunks = [];
        }
      };
    }

    function setUp() {
      var hook = testHook("zip");
      if (hook) {
        mode = "prueba";
        writer = {
          write: function (chunk) {
            hook(chunk);
            return Promise.resolve();
          },
          close: function () {
            return Promise.resolve({ name: finalName });
          },
          abort: function () {}
        };
        return Promise.resolve();
      }
      var dirHook = testHook("dir");
      var testDir = dirHook ? dirHook() : null;
      var ready = testDir ? Promise.resolve(true) : dirHandle ? ensureDirPermission() : Promise.resolve(false);
      return ready.then(function (ok) {
        var dir = testDir || (ok ? dirHandle : null);
        if (!dir) {
          memoryWriter();
          return null;
        }
        var pick = R.settings.dlConflict === "overwrite" ? Promise.resolve(finalName) : nextFree(dir, finalName, "zip");
        return pick
          .then(function (name) {
            diskName = name;
            finalName = name;
            return dir.getFileHandle(name, { create: true });
          })
          .then(function (fh) {
            return fh.createWritable();
          })
          .then(function (w) {
            mode = "disk";
            writer = {
              write: function (chunk) {
                return w.write(chunk);
              },
              close: function () {
                return w.close();
              },
              abort: function () {
                try {
                  var p = w.abort();
                  if (p && p.catch) p.catch(function () {});
                } catch (e) {}
              }
            };
          });
      });
    }

    function step(i) {
      if (status.cancelled) return Promise.reject(new Error("cancelado"));
      if (i >= total) return Promise.resolve();
      var pid = ids[i];
      if (skipSaved && hist().has(pid)) {
        status.skipped++;
        status.packed += 0;
        item.label = "lote .zip \u00b7 omitido " + pid;
        syncItem(item);
        return step(i + 1);
      }
      item.label = "lote .zip (" + (i + 1) + "/" + total + ")";
      item.progress = i / total;
      syncItem(item);
      var holder = {};
      zipAbortCurrent = function () {
        if (holder.abort) holder.abort();
      };
      return resolveMeta(pid, null)
        .then(function (m) {
          if (!m || !m.url) throw new Error("el post no tiene archivo");
          if (!m.id) m.id = pid;
          return fetchBlob(m.url, function (p) {
            item.progress = (i + p) / total;
            syncItem(item);
          }, holder).then(function (blob) {
            return blob.arrayBuffer().then(function (buf) {
              return { m: m, blob: blob, u8: new Uint8Array(buf) };
            });
          });
        })
        .then(function (res) {
          zipAbortCurrent = null;
          if (status.cancelled) throw new Error("cancelado");
          if (mode === "memory" && status.bytes > 1610612736) {
            throw new Error("el lote es muy grande para guardarlo en memoria: elige una carpeta de descargas");
          }
          var path = buildPath(res.m, res.m.ext);
          var name = uniqueName((path.folder ? path.folder + "/" : "") + path.file);
          var crc = crc32(res.u8);
          var size = res.blob.size;
          res.u8 = null;
          return addEntry(name, size, res.blob, crc).then(function () {
            status.added.push({ id: res.m.id, name: name });
            item.progress = (i + 1) / total;
            item.label = "lote .zip (" + (i + 1) + "/" + total + ") \u00b7 " + human(status.bytes);
            syncItem(item);
            notify((i + 1) + " de " + total + " \u00b7 " + human(status.bytes));
            return step(i + 1);
          });
        })
        .catch(function (e) {
          zipAbortCurrent = null;
          if (status.cancelled || (e && e.message === "cancelado")) throw e;
          status.failed.push({ id: pid, reason: (e && e.message) || String(e) });
          item.label = "lote .zip (" + (i + 1) + "/" + total + ") \u00b7 fall\u00f3 " + pid;
          syncItem(item);
          return step(i + 1);
        });
    }

    function close() {
      if (status.cancelled) return Promise.reject(new Error("cancelado"));
      if (!entries.length) return Promise.reject(new Error("no se pudo a\u00f1adir ning\u00fan archivo"));
      var chain = Promise.resolve();
      if (status.failed.length) {
        var txt =
          "Estos posts no se pudieron incluir en el .zip:\n\n" +
          status.failed
            .map(function (f) {
              return f.id + "  " + f.reason;
            })
            .join("\n") +
          "\n\n" +
          new Date().toISOString() +
          "\n";
        var tb = utf8(txt);
        chain = addEntry("errores.txt", tb.length, tb, crc32(tb), true);
      }
      return chain.then(function () {
        var cdSize = entries.reduce(function (a, e) {
          return a + 46 + e.name.length;
        }, 0);
        var cdOffset = status.offset;
        var w = Promise.resolve();
        entries.forEach(function (e) {
          w = w.then(function () {
            return writeChunk(centralHeader(e));
          });
        });
        return w
          .then(function () {
            return writeChunk(endRecord(entries.length, cdSize, cdOffset));
          })
          .then(function () {
            return writer.close();
          })
          .then(function (res) {
            return { saved: (res && res.name) || finalName, mode: mode };
          });
      });
    }

    var report = function (text) {
      item.label = text;
      syncItem(item);
      renderQueue();
    };

    return setUp()
      .then(function () {
        return step(0);
      })
      .then(function () {
        notify("Cerrando el .zip\u2026");
        return close();
      })
      .then(function (res) {
        status.added.forEach(function (a) {
          hist().add(a.id, a.name);
        });
        refreshBadges();
        item.state = "done";
        item.progress = 1;
        item.fileName = res.saved;
        report("lote .zip \u00b7 " + status.packed + " archivos \u00b7 " + human(status.bytes));
        zipJob = null;
        zipAbortCurrent = null;
        var extra = (status.skipped ? " \u00b7 " + status.skipped + " omitidos" : "") + (status.failed.length ? " \u00b7 " + status.failed.length + " fallos (errores.txt dentro)" : "");
        util.toast("Guardado " + res.saved + " \u00b7 " + status.packed + " archivos \u00b7 " + human(status.bytes) + extra, 6000);
        notify("Guardado: " + res.saved);
        return { name: res.saved, mode: res.mode, count: status.packed, bytes: status.bytes, skipped: status.skipped, failed: status.failed, ids: status.added.map(function (a) { return a.id; }) };
      })
      .catch(function (e) {
        zipJob = null;
        zipAbortCurrent = null;
        if (writer && writer.abort) {
          try {
            writer.abort();
          } catch (ev) {}
        }
        var cancelled = status.cancelled || (e && e.message === "cancelado");
        item.state = cancelled ? "cancel" : "error";
        item.progress = 1;
        report("lote .zip " + (cancelled ? "cancelado" : "fall\u00f3"));
        if (cancelled) util.toast("Creaci\u00f3n del .zip cancelada");
        else util.toast("No se pudo crear el .zip: " + ((e && e.message) || e), 5000);
        notify("Error: " + ((e && e.message) || e));
        throw cancelled ? new Error("cancelado") : e;
      });
  }

  function buildDlButton(thumb) {
    var link = thumb.querySelector("a") || thumb;
    var id = util.postIdFromHref(link.getAttribute ? link.getAttribute("href") : "");
    if (!id) return;
    var btn = util.el("button", "r34g-dl-btn");
    btn.type = "button";
    btn.title = "Descargar el original (post " + id + ")";
    btn.appendChild(util.icon("dl"));
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      downloadNow(id, btn);
    });
    var link = thumb.querySelector("a") || thumb;
    link.appendChild(btn);
  }

  function selBox(thumb) {
    var link = thumb.querySelector("a") || thumb;
    var id = util.postIdFromHref(link.getAttribute ? link.getAttribute("href") : "");
    if (!id) return;
    var box = thumb.querySelector(".r34g-sel-box");
    if (!box) {
      box = util.el("button", "r34g-sel-box");
      box.type = "button";
      box.title = "Marcar para descargar en bloque";
      box.setAttribute("aria-label", "Marcar este post");
      box.appendChild(util.icon("check"));
      box.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        selToggle(box.getAttribute("data-id"));
      });
      (thumb.querySelector("a") || thumb).appendChild(box);
    }
    box.setAttribute("data-id", id);
  }

  function downloadBadge(thumb) {
    var link = thumb.querySelector("a") || thumb;
    var id = util.postIdFromHref(link.getAttribute ? link.getAttribute("href") : "");
    var badge = thumb.querySelector(".r34g-dl-badge");
    var has = !!(R.settings.dlOn && id && hist().has(id));
    thumb.classList.toggle("r34g-downloaded", has);
    if (!has) {
      if (badge) badge.remove();
      return;
    }
    if (!badge) {
      badge = util.el("span", "r34g-dl-badge");
      badge.title = "Ya descargado en este navegador";
      badge.appendChild(util.icon("check"));
      link.appendChild(badge);
    }
  }

  function decorateThumb(thumb) {
    if (!thumb || !thumb.querySelector) return;
    if (R.settings.dlOn) {
      if (!thumb.querySelector(".r34g-dl-btn")) buildDlButton(thumb);
      selBox(thumb);
    } else {
      var box = thumb.querySelector(".r34g-sel-box");
      if (box) box.remove();
      var gone = thumb.querySelector(".r34g-dl-btn");
      if (gone) gone.remove();
    }
    downloadBadge(thumb);
  }

  function decorateAll(root) {
    var scope = root && root.querySelectorAll ? root : document;
    if (scope.classList && scope.classList.contains("thumb")) {
      decorateThumb(scope);
      return;
    }
    Array.prototype.forEach.call(scope.querySelectorAll(".image-list .thumb"), decorateThumb);
  }

  function refreshBadges() {
    decorateAll(document);
  }

  R.downloads.refreshBadges = refreshBadges;

  function watchGallery() {
    decorateAll(document);
    var list = document.querySelector(".image-list");
    if (!list || list.dataset.r34gDlWatch) return;
    list.dataset.r34gDlWatch = "1";
    var mo = new MutationObserver(function (records) {
      records.forEach(function (r) {
        Array.prototype.forEach.call(r.addedNodes, function (n) {
          if (n.nodeType === 1) decorateAll(n);
        });
      });
    });
    mo.observe(list, { childList: true, subtree: true });
  }

  function watchSelectClicks() {
    var list = document.querySelector(".image-list");
    if (!list || list.dataset.r34gSelWatch) return;
    list.dataset.r34gSelWatch = "1";
    list.addEventListener(
      "click",
      function (e) {
        if (!sel.on || !e.target || !e.target.closest) return;
        if (e.target.closest(".r34g-sel-box") || e.target.closest(".r34g-dl-btn")) return;
        var thumb = e.target.closest(".thumb");
        if (!thumb) return;
        var link = thumb.querySelector("a") || thumb;
        var id = util.postIdFromHref(link.getAttribute ? link.getAttribute("href") : "");
        if (!id) return;
        e.preventDefault();
        e.stopPropagation();
        selToggle(id);
      },
      true
    );
  }

  function buildPostBar() {
    var existing = document.getElementById("r34g-dl-bar");
    var id = currentId();
    if (!id || !R.settings.dlPost || !mediaUrlFromDoc(document)) {
      if (existing) existing.remove();
      return;
    }
    if (existing) return;
    var host = document.querySelector("#gelcomVideoContainer") || (document.querySelector("#image") || {}).parentElement;
    if (!host) return;
    var bar = util.el("div", "r34g-dl-bar");
    bar.id = "r34g-dl-bar";
    var go = util.el("button", "r34g-btn r34g-on");
    go.type = "button";
    go.id = "r34g-dl-go";
    go.appendChild(util.icon("dl"));
    go.appendChild(document.createTextNode(" Descargar original"));
    go.addEventListener("click", function () {
      downloadNow(id, go);
    });
    bar.appendChild(go);
    var copy = util.el("button", "r34g-btn");
    copy.type = "button";
    copy.appendChild(util.icon("copy"));
    copy.appendChild(document.createTextNode(" Copiar URL"));
    copy.addEventListener("click", function () {
      var m = metaFromDoc(document, id);
      util.copy(m.url || location.href);
    });
    bar.appendChild(copy);
    var name = util.el("span", "r34g-dl-name");
    bar.appendChild(name);
    var meta = metaFromDoc(document, id);
    var p = buildPath(meta, meta.ext);
    name.textContent = p.path;
    host.insertBefore(bar, host.firstChild);
  }

  function buildBatchBar() {
    var existing = document.getElementById("r34g-dl-batch");
    if (!isListPage() || !R.settings.dlOn) {
      if (existing) existing.remove();
      return;
    }
    if (existing) return;
    var list = document.querySelector(".image-list");
    if (!list || !list.parentNode) return;
    var bar = util.el("div", "r34g-dl-batch");
    bar.id = "r34g-dl-batch";
    var btn = util.el("button", "r34g-btn");
    btn.type = "button";
    btn.appendChild(util.icon("dl"));
    btn.appendChild(document.createTextNode(" Descargar esta b\u00fasqueda"));
    btn.addEventListener("click", function () {
      openBatchDialog();
    });
    bar.appendChild(btn);
    // atajo visible solo cuando hay marcas: descarga JUSTO lo marcado, sin tocar la búsqueda
    var selGo = util.el("button", "r34g-btn r34g-selgo");
    selGo.type = "button";
    selGo.id = "r34g-dl-batch-selgo";
    selGo.title = "Descarga solo los posts que has marcado a mano (los de esta p\u00e1gina y los de otras)";
    selGo.hidden = true;
    selGo.appendChild(util.icon("dl"));
    selGo.appendChild(util.el("span", null, ""));
    selGo.addEventListener("click", function () {
      downloadSelected(false);
    });
    bar.appendChild(selGo);
    var selBtn = util.el("button", "r34g-btn");
    selBtn.type = "button";
    selBtn.id = "r34g-dl-selbtn";
    selBtn.title = "Marcar posts a mano y descargarlos todos de golpe (la selecci\u00f3n se mantiene al pasar de p\u00e1gina)";
    selBtn.appendChild(util.icon("check"));
    selBtn.appendChild(util.el("span", null, " Seleccionar"));
    selBtn.addEventListener("click", function () {
      selSetMode(!sel.on);
    });
    bar.appendChild(selBtn);
    var allBtn = util.el("button", "r34g-btn", "Todas");
    allBtn.type = "button";
    allBtn.id = "r34g-dl-selall";
    allBtn.title = "Marcar todos los posts de esta p\u00e1gina";
    allBtn.hidden = true;
    allBtn.addEventListener("click", selAllPage);
    bar.appendChild(allBtn);
    var noneBtn = util.el("button", "r34g-btn", "Ninguna");
    noneBtn.type = "button";
    noneBtn.id = "r34g-dl-selnone";
    noneBtn.title = "Vaciar la selecci\u00f3n";
    noneBtn.hidden = true;
    noneBtn.addEventListener("click", selClear);
    bar.appendChild(noneBtn);
    var selNote = util.el("button", "r34g-sel-note");
    selNote.type = "button";
    selNote.hidden = true;
    selNote.title = "Ver la lista de posts seleccionados (incluidos los de otras p\u00e1ginas)";
    selNote.addEventListener("click", function () {
      sel.panel = !sel.panel;
      buildSelPanel();
    });
    bar.appendChild(selNote);
    bar.appendChild(util.el("span", "r34g-note", "etiquetas: " + queryTags()));
    list.parentNode.insertBefore(bar, list);
    selRender();
  }

  function closeBatchDialog() {
    var d = document.getElementById("r34g-dl-dlg");
    if (d) d.remove();
  }

  function openBatchDialog() {
    closeBatchDialog();
    var d = util.el("div", "r34g-dlg");
    d.id = "r34g-dl-dlg";
    var box = util.el("div", "r34g-dlg-box");
    box.appendChild(util.el("h5", null, "Descargar esta b\u00fasqueda"));
    var marked = sel.ids.length;
    if (marked) {
      var box2 = util.el("div", "r34g-dlg-sel");
      box2.appendChild(util.el("b", null, "Tienes " + marked + " post" + (marked === 1 ? "" : "s") + " seleccionado" + (marked === 1 ? "" : "s") + " a mano."));
      var acts = util.el("div", "r34g-dlg-actions");
      var goSel = util.el("button", "r34g-btn r34g-on");
      goSel.type = "button";
      goSel.appendChild(util.icon("dl"));
      goSel.appendChild(document.createTextNode(marked === 1 ? " Descargar la marcada" : " Descargar las " + marked + " marcadas"));
      goSel.addEventListener("click", function () {
        closeBatchDialog();
        downloadSelected(false);
      });
      acts.appendChild(goSel);
      var zipSel = util.el("button", "r34g-btn", "ZIP de " + marked);
      zipSel.type = "button";
      zipSel.title = "Descargar los seleccionados dentro de un solo .zip";
      zipSel.addEventListener("click", function () {
        closeBatchDialog();
        downloadSelected(true);
      });
      acts.appendChild(zipSel);
      var listSel = util.el("button", "r34g-btn", "Ver la lista");
      listSel.type = "button";
      listSel.addEventListener("click", function () {
        closeBatchDialog();
        sel.panel = true;
        buildSelPanel();
      });
      acts.appendChild(listSel);
      box2.appendChild(acts);
      box2.appendChild(util.el("p", "r34g-hint", "Si pulsas \u00abEmpezar\u00bb abajo, en cambio, se descarga TODA la b\u00fasqueda por p\u00e1ginas (no solo lo que has marcado)."));
      box.appendChild(box2);
    }
    box.appendChild(util.el("p", "r34g-hint", "Recorrer la b\u00fasqueda: se visitan las p\u00e1ginas de la b\u00fasqueda actual (rule34 sirve 42 posts por p\u00e1gina) y se descargan una a una, respetando el l\u00edmite de descargas simult\u00e1neas."));
    if (!marked) {
      box.appendChild(util.el("p", "r34g-hint", "\u00bfQuieres posts concretos? Pulsa \u00abSeleccionar\u00bb en la barra de arriba, marca las miniaturas que quieras (tambi\u00e9n desde otras p\u00e1ginas) y desc\u00e1rgalas de golpe con el bot\u00f3n que aparece entonces al lado."));
    }
    var rowPages = util.el("label", "r34g-dlg-row");
    rowPages.appendChild(util.el("span", null, "P\u00e1ginas"));
    var pages = util.el("input", "r34g-num");
    pages.type = "number";
    pages.min = "1";
    pages.max = "50";
    pages.value = R.settings.dlPages || "1";
    rowPages.appendChild(pages);
    box.appendChild(rowPages);
    // cuántas descargas salen de aquí, en grande y actualizado al momento: nada de sorpresas
    var estimate = util.el("p", "r34g-dlg-est");
    var syncEstimate = function () {
      var p = Math.max(1, Math.min(50, util.num(pages.value) || 1));
      estimate.textContent = "Son unas " + p * 42 + " descargas (" + p + " p\u00e1gina" + (p === 1 ? "" : "s") + " \u00d7 42)" + (marked ? ", no los " + marked + " seleccionados" : "") + ".";
    };
    syncEstimate();
    pages.addEventListener("input", syncEstimate);
    pages.addEventListener("change", syncEstimate);
    box.appendChild(estimate);
    var rowSkip = util.el("label", "r34g-dlg-row");
    var skip = util.el("input");
    skip.type = "checkbox";
    skip.checked = !!R.settings.dlSkip;
    rowSkip.appendChild(skip);
    rowSkip.appendChild(util.el("span", null, "Omitir los que ya est\u00e1n en el historial"));
    box.appendChild(rowSkip);
    var rowZip = util.el("label", "r34g-dlg-row");
    var zip = util.el("input");
    zip.type = "checkbox";
    zip.id = "r34g-dlg-zip";
    zip.checked = !!R.settings.dlZip;
    rowZip.appendChild(zip);
    rowZip.appendChild(util.el("span", null, "Guardar todo en un solo .zip"));
    box.appendChild(rowZip);
    var status = util.el("div", "r34g-dlg-status");
    box.appendChild(status);
    var actions = util.el("div", "r34g-dlg-actions");
    var first = util.el("button", "r34g-btn r34g-on", "Empezar");
    first.type = "button";
    var off = util.el("button", "r34g-btn", "Cancelar");
    off.type = "button";
    off.addEventListener("click", closeBatchDialog);
    first.addEventListener("click", function () {
      R.set("dlPages", pages.value);
      R.set("dlSkip", skip.checked);
      R.set("dlZip", zip.checked);
      var n = Math.max(1, Math.min(50, util.num(pages.value) || 1));
      first.disabled = true;
      first.textContent = "Trabajando\u2026";
      var setStatus = function (text) {
        status.textContent = text;
      };
      var work;
      if (zip.checked) {
        work = collectBatch(n, setStatus).then(function (ids) {
          var fresh = ids.filter(function (id) {
            return !(skip.checked && hist().has(id));
          });
          if (!fresh.length) throw new Error("no hay nada nuevo que descargar");
          setStatus(fresh.length + " archivos en cola para el .zip\u2026");
          return runZip(fresh, "rule34-" + queryTags(), false, setStatus);
        });
      } else {
        work = runBatch(n, skip.checked, setStatus);
      }
      work.then(
        function (res) {
          if (zip.checked) {
            first.textContent = "Guardado: " + res.count + " archivos \u00b7 " + human(res.bytes);
            setTimeout(closeBatchDialog, 2600);
          } else {
            first.textContent = res ? res + " en cola" : "nada que descargar";
            setTimeout(closeBatchDialog, 1400);
          }
        },
        function (e) {
          first.disabled = false;
          first.textContent = "Reintentar";
          if (e && e.message) status.textContent = e.message;
        }
      );
    });
    actions.appendChild(first);
    actions.appendChild(off);
    box.appendChild(actions);
    d.appendChild(box);
    d.addEventListener("mousedown", function (e) {
      if (e.target === d) closeBatchDialog();
    });
    document.body.appendChild(d);
  }

  function demoMeta() {
    return {
      id: "5959725",
      url: "https://wimg.rule34.xxx//images/5231/4d9c78fd1d104abd4721cc356a72d497.jpeg",
      ext: "jpeg",
      kind: "image",
      artist: ["artist_name"],
      character: ["raven_(dc)", "scarlet_witch"],
      copyright: ["dc_comics"],
      general: ["1girl", "monster", "tentacles"],
      tags: ["dc_comics", "raven_(dc)", "scarlet_witch", "artist_name", "1girl"],
      rating: "questionable",
      score: "42",
      site: "rule34.xxx"
    };
  }

  function previewName() {
    var p = buildPath(demoMeta(), "jpeg");
    return p.path;
  }

  function syncDirState() {
    var el = document.getElementById("r34g-dl-dir-state");
    if (!el) return;
    el.textContent = dirHandle ? "carpeta: " + dirName() : "sin carpeta elegida (se guarda en Descargas, sin subcarpetas)";
  }

  R.downloads.syncDirState = syncDirState;

  function buildPanel(panel) {
    var s1 = ui.section(panel, "Botones", "D\u00f3nde aparece el bot\u00f3n de descarga");
    ui.toggle({
      section: s1,
      title: "Bot\u00f3n en cada miniatura",
      note: "descarga directa desde la galer\u00eda",
      key: "dlOn",
      onChange: function () {
        refreshBadges();
        watchGallery();
      }
    });
    ui.toggle({
      section: s1,
      title: "Bot\u00f3n en el post",
      note: "en la p\u00e1gina de un post, sobre el archivo",
      key: "dlPost"
    });
    ui.toggle({
      section: s1,
      title: "Abrir en una pesta\u00f1a si no se puede leer el archivo",
      note: "plan B: el navegador bloquea el archivo y lo abrimos para que lo guardes t\u00fa",
      key: "dlOpen"
    });

    var s2 = ui.section(panel, "Nombre y carpeta", "Etiquetas disponibles: {id} {artist} {character} {copyright} {tags} {general} {rating} {score} {ext} {kind} {site}");
    ui.text({
      section: s2,
      title: "Nombre del archivo",
      note: "por defecto {id}_{artist}_{character}",
      key: "dlFile",
      mono: true,
      placeholder: "{id}_{artist}_{character}"
    });
    ui.text({
      section: s2,
      title: "Carpeta",
      note: "subcarpetas dentro de la carpeta elegida, p. ej. rule34/{artist}",
      key: "dlFolder",
      mono: true,
      placeholder: "rule34/{artist}"
    });
    ui.seg({
      section: s2,
      title: "Si el archivo ya existe",
      options: [
        { label: "A\u00f1adir (2)", value: "uniquify", title: "no pisa nada: guarda una copia con (2), (3)\u2026" },
        { label: "Sobrescribir", value: "overwrite" },
        { label: "Omitir", value: "skip" }
      ],
      key: "dlConflict"
    });
    var s3 = ui.section(panel, "Carpeta de destino", "Chrome y Edge permiten elegir una carpeta real (con subcarpetas). Sin carpeta, se guarda en la carpeta de descargas con el nombre de la plantilla.");
    var state = util.el("p", "r34g-hint");
    state.id = "r34g-dl-dir-state";
    s3.appendChild(state);
    ui.button({
      section: s3,
      title: "Carpeta",
      label: "Elegir carpeta\u2026",
      onClick: function () {
        chooseDir().catch(function (e) {
          util.toast("No se eligi\u00f3 carpeta: " + e.message, 3600);
        });
      }
    });
    ui.button({
      section: s3,
      title: "Olvidar la carpeta elegida",
      label: "Olvidar carpeta",
      onClick: function () {
        forgetDir().then(function () {
          util.toast("Carpeta olvidada");
        });
      }
    });

    var s4 = ui.section(panel, "Descargas a la vez", "Cu\u00e1ntos archivos se piden en paralelo (menos es m\u00e1s amable con el sitio)");
    ui.number({
      section: s4,
      title: "Simult\u00e1neas",
      key: "dlQueue",
      min: 1,
      max: 6,
      suffix: "a la vez"
    });

    var s5 = ui.section(panel, "B\u00fasquedas", "Descargar todos los resultados de una b\u00fasqueda, por p\u00e1ginas");
    ui.number({
      section: s5,
      title: "P\u00e1ginas por defecto",
      note: "en el di\u00e1logo puedes cambiarlo",
      key: "dlPages",
      min: 1,
      max: 50
    });
    ui.toggle({
      section: s5,
      title: "Omitir los ya descargados",
      note: "usa el historial de descargas",
      key: "dlSkip"
    });
    ui.toggle({
      section: s5,
      title: "Guardar los lotes en un .zip",
      note: "un solo archivo con todos los originales dentro (sin recomprimir: pesa casi lo mismo). En el di\u00e1logo puedes cambiarlo para ese lote.",
      key: "dlZip"
    });
    var batchBtn = ui.button({
      section: s5,
      title: "Descargar esta b\u00fasqueda",
      label: isListPage() ? "Descargar esta b\u00fasqueda\u2026" : "No est\u00e1s en una lista de resultados",
      onClick: function () {
        if (isListPage()) openBatchDialog();
        else util.toast("Abre una b\u00fasqueda o una etiqueta para descargar sus resultados", 3600);
      }
    });
    var refreshBatchLabel = function () {
      batchBtn.textContent = isListPage() ? "Descargar esta b\u00fasqueda\u2026" : "No est\u00e1s en una lista de resultados";
    };
    R.controls.push(refreshBatchLabel);
    var selHint = util.el("p", "r34g-hint");
    s5.appendChild(selHint);
    var selBtn = ui.button({
      section: s5,
      title: "Marcar miniaturas a mano y descargarlas en bloque (la selecci\u00f3n se mantiene al cambiar de p\u00e1gina)",
      label: "Seleccionar miniaturas\u2026",
      onClick: function () {
        if (!isListPage()) {
          util.toast("Abre una b\u00fasqueda o una etiqueta para marcar sus miniaturas", 3600);
          return;
        }
        selSetMode(!sel.on);
        if (R.closeModal) R.closeModal();
        util.toast(sel.on ? "Marca las miniaturas que quieras descargar" : "Modo selecci\u00f3n cerrado");
      }
    });
    var refreshSelHint = function () {
      selHint.textContent = sel.on
        ? "Modo selecci\u00f3n activo: " + sel.ids.length + " marcado" + (sel.ids.length === 1 ? "" : "s") + ". Pulsa la barra de abajo a la derecha para descargarlos."
        : "Adem\u00e1s de b\u00fasquedas enteras, puedes marcar miniaturas a mano (tambi\u00e9n desde varias p\u00e1ginas) y descargarlas todas de golpe.";
      selBtn.textContent = isListPage() ? (sel.on ? "Salir del modo selecci\u00f3n" : "Seleccionar miniaturas\u2026") : "No est\u00e1s en una lista de resultados";
    };
    refreshSelHint();
    R.controls.push(refreshSelHint);

    var s6 = ui.section(panel, "Historial de descargas", "Se guarda en este navegador; sirve para marcar lo ya descargado y para omitirlo");
    var info = util.el("p", "r34g-hint");
    s6.appendChild(info);
    var refreshInfo = function () {
      info.textContent = history.size() + " posts descargados";
    };
    refreshInfo();
    R.controls.push(refreshInfo);
    ui.button({
      section: s6,
      title: "Borrar el historial de descargas",
      label: "Vaciar historial",
      onClick: function () {
        history.clear();
        refreshBadges();
        refreshInfo();
        util.toast("Historial de descargas vaciado");
      }
    });
    ui.button({
      section: s6,
      title: "Exportar el historial a CSV",
      label: "Exportar CSV",
      onClick: function () {
        var rows = [["id", "fecha", "archivo"]];
        history.list().forEach(function (it) {
          rows.push([it.id, new Date(it.t).toISOString(), (it.n || "").replace(/"/g, "'")]);
        });
        var csv = rows
          .map(function (r) {
            return r
              .map(function (c) {
                return /[",;]/.test(c) ? '"' + c + '"' : c;
              })
              .join(",");
          })
          .join("\n");
        util.download("descargas-rule34.csv", csv, "text/csv");
      }
    });
    var prev = util.el("p", "r34g-hint r34g-mono");
    prev.textContent = "ejemplo: " + previewName();
    s6.appendChild(prev);

    var s7 = ui.section(panel, "Convivencia con otros scripts", "Si tienes instalado un descargador de terceros para este sitio, los dos pelean por las mismas miniaturas y el mismo archivo");
    ui.seg({
      section: s7,
      title: "Si detecto Pixiv Downloader",
      options: [
        { label: "Avisarme", value: "ask", title: "muestra el aviso con opciones" },
        { label: "Avisar y ocultar sus botones", value: "neutralize", title: "quita sus botones y arregla lo que toca de la p\u00e1gina, en cada visita" },
        { label: "Callar", value: "off" }
      ],
      key: "pdlAction"
    });
    var conflictState = util.el("p", "r34g-hint");
    conflictState.id = "r34g-conflict-state";
    s7.appendChild(conflictState);
    ui.button({
      section: s7,
      title: "Volver a comprobar si hay scripts en conflicto",
      label: "Revisar ahora",
      onClick: function () {
        if (R.conflicts) R.conflicts.check(true);
      }
    });
  }

  R.panel({
    key: "downloads",
    label: "Descargas",
    build: buildPanel
  });

  function rebuild() {
    watchGallery();
    watchSelectClicks();
    buildPostBar();
    buildBatchBar();
    decorateAll(document);
    selRender();
    syncDirState();
    if (R.refreshControls) R.refreshControls();
  }

  R.downloads.rebuild = rebuild;

  R.onReady(function () {
    loadDir();
    selLoad();
    restoreQueue();
    watchGallery();
    watchSelectClicks();
    buildPostBar();
    buildBatchBar();
    syncDirState();
    if (R.settings.dlPost) {
      var tries = 0;
      var poll = setInterval(function () {
        tries++;
        buildPostBar();
        if (document.getElementById("r34g-dl-bar") || tries > 20) clearInterval(poll);
      }, 600);
    }
    R.onChange(function (key) {
      if (key === "dlOn") {
        decorateAll(document);
        buildBatchBar();
        if (!R.settings.dlOn && sel.on) selSetMode(false);
      }
      if (key === "dlPost") buildPostBar();
    });
  });

  R.downloads.api = {
    enqueue: enqueue,
    downloadPost: downloadPost,
    resolveMeta: resolveMeta,
    metaFromDoc: metaFromDoc,
    buildPath: buildPath,
    previewName: previewName,
    chooseDir: chooseDir,
    forgetDir: forgetDir,
    ensureDirPermission: ensureDirPermission,
    dirName: dirName,
    runBatch: runBatch,
    collectBatch: collectBatch,
    runZip: runZip,
    zipBusy: zipBusy,
    queue: queue,
    queueSave: queueSaveNow,
    queueLoad: queueLoad,
    resumeQueue: resumeQueue,
    discardQueue: discardQueue,
    retryFailed: retryFailed,
    select: {
      state: sel,
      ids: function () {
        return sel.ids.slice();
      },
      mode: selSetMode,
      toggle: selToggle,
      drop: selDrop,
      all: selAllPage,
      clear: selClear,
      download: downloadSelected,
      panel: function (open) {
        sel.panel = open == null ? !sel.panel : !!open;
        buildSelPanel();
      }
    }
  };
})();

// Vista rápida: abre la imagen o el vídeo encima de la galería, sin ir a la página del post.
// Pensada para mirar en serie: ←/→ (o J/K) para pasar, D para descargar, M para marcar, O para
// abrir el post en una pestaña, Esc para cerrar. La URL del archivo grande (no la miniatura) se
// pide a la misma maquinaria de descargas que ya sabe leer la página de un post, y se guarda en
// memoria mientras dure la visita para no pedirla dos veces.
(function () {
  "use strict";
  var R = window.__r34g;
  if (!R || R.lightbox) return;
  R.lightbox = {};

  var util = R.util;

  var THUMB_SEL = ".image-list .thumb";

  var lb = { open: false, i: 0, list: [], meta: {}, el: null, video: null, token: 0 };

  function on() {
    return !!R.settings.lb;
  }

  function isListPage() {
    if (typeof R.downloads.isList === "function") return !!R.downloads.isList();
    try {
      var p = new URLSearchParams(location.search);
      return (p.get("page") || "") === "post" && (p.get("s") || "") === "list";
    } catch (e) {
      return false;
    }
  }

  function selecting() {
    var api = R.downloads.api;
    return !!(api && api.select && api.select.state.on);
  }

  function thumbInfo(thumb) {
    var link = thumb.querySelector("a") || thumb;
    var href = link.getAttribute ? link.getAttribute("href") || "" : "";
    var id = util.postIdFromHref(href);
    if (!id) return null;
    var img = thumb.querySelector("img");
    return {
      id: id,
      href: href,
      src: img ? img.getAttribute("src") || "" : "",
      alt: img ? (img.getAttribute("alt") || "").trim() : ""
    };
  }

  function pageList() {
    var out = [];
    Array.prototype.forEach.call(document.querySelectorAll(THUMB_SEL), function (thumb) {
      var info = thumbInfo(thumb);
      if (!info) return;
      var dup = false;
      for (var i = 0; i < out.length; i++) {
        if (out[i].id === info.id) dup = true;
      }
      if (!dup) out.push(info);
    });
    return out;
  }

  function downloaded(id) {
    return !!(R.downloads && R.downloads.hist && R.downloads.hist.has(id));
  }

  function marked(id) {
    var api = R.downloads.api;
    return !!(api && api.select && api.select.state.ids.indexOf(String(id)) !== -1);
  }

  // ---- resolución del archivo grande -------------------------------------------------------------

  function resolve(id) {
    if (lb.meta[id]) return Promise.resolve(lb.meta[id]);
    if (!R.downloads || !R.downloads.api || !R.downloads.api.resolveMeta) return Promise.reject(new Error("el m\u00f3dulo de descargas no est\u00e1 disponible"));
    return Promise.resolve(R.downloads.api.resolveMeta(id, null)).then(function (m) {
      if (!m || !m.url) throw new Error("el post no tiene archivo legible");
      lb.meta[id] = m;
      return m;
    });
  }

  // ---- interfaz ---------------------------------------------------------------------------------

  function build() {
    if (lb.el) return lb.el;
    var box = util.el("div", "r34g-lb");
    box.id = "r34g-lb";

    var top = util.el("div", "r34g-lb-top");
    var pos = util.el("span", "r34g-lb-pos");
    top.appendChild(pos);
    var idEl = util.el("span", "r34g-lb-id");
    top.appendChild(idEl);
    var seen = util.el("span", "r34g-lb-seen");
    top.appendChild(seen);
    var tags = util.el("span", "r34g-lb-tags");
    top.appendChild(tags);
    top.appendChild(util.el("span", "r34g-lb-gap"));

    var sound = util.el("button", "r34g-btn r34g-lb-sound");
    sound.type = "button";
    sound.title = "Activar o silenciar el sonido (solo v\u00eddeos)";
    sound.addEventListener("click", function () {
      if (!lb.video) return;
      lb.video.muted = !lb.video.muted;
      if (!lb.video.muted) {
        var p = lb.video.play();
        if (p && p.catch) p.catch(function () {});
      }
      syncSound();
    });
    top.appendChild(sound);

    var dl = util.el("button", "r34g-btn r34g-lb-dl");
    dl.type = "button";
    dl.title = "Descargar este post con tu plantilla de nombre y carpeta (D)";
    dl.appendChild(util.icon("dl"));
    dl.appendChild(document.createTextNode(" Descargar"));
    dl.addEventListener("click", function () {
      doDownload();
    });
    top.appendChild(dl);

    var pick = util.el("button", "r34g-btn r34g-lb-pick");
    pick.type = "button";
    pick.title = "Marcar para descargar en bloque (M)";
    pick.appendChild(util.icon("check"));
    pick.appendChild(util.el("span", null, " Marcar"));
    pick.addEventListener("click", function () {
      doMark();
    });
    top.appendChild(pick);

    var open = util.el("a", "r34g-btn r34g-lb-open");
    open.target = "_blank";
    open.rel = "noopener";
    open.title = "Abrir la p\u00e1gina del post en una pesta\u00f1a nueva (O)";
    open.appendChild(document.createTextNode("Abrir el post"));
    top.appendChild(open);

    var x = util.el("button", "r34g-btn r34g-lb-x", "\u2715");
    x.type = "button";
    x.title = "Cerrar la vista r\u00e1pida (Esc)";
    x.addEventListener("click", function () {
      close();
    });
    top.appendChild(x);
    box.appendChild(top);

    var stage = util.el("div", "r34g-lb-stage");
    var prev = util.el("button", "r34g-lb-nav r34g-lb-prev", "\u2039");
    prev.type = "button";
    prev.title = "Anterior (flecha izquierda)";
    prev.addEventListener("click", function () {
      step(-1);
    });
    var next = util.el("button", "r34g-lb-nav r34g-lb-next", "\u203a");
    next.type = "button";
    next.title = "Siguiente (flecha derecha)";
    next.addEventListener("click", function () {
      step(1);
    });
    var media = util.el("div", "r34g-lb-media");
    media.addEventListener("click", function (e) {
      if (e.target === prev || e.target === next) return;
      if (!media.querySelector(".r34g-lb-img")) return;
      stage.classList.toggle("r34g-lb-zoom");
    });
    stage.appendChild(prev);
    stage.appendChild(media);
    stage.appendChild(next);
    box.appendChild(stage);

    var foot = util.el("div", "r34g-lb-foot");
    box.appendChild(foot);

    box.addEventListener("mousedown", function (e) {
      if (e.target === box) close();
    });
    lb.el = box;
    return box;
  }

  function part(name) {
    var box = build();
    return box.querySelector(name);
  }

  function syncSound() {
    var btn = part(".r34g-lb-sound");
    if (!btn) return;
    var v = lb.video;
    while (btn.firstChild) btn.removeChild(btn.firstChild);
    btn.hidden = !v;
    if (!v) return;
    btn.appendChild(util.icon(v.muted ? "mute" : "volume"));
    btn.appendChild(document.createTextNode(v.muted ? " Sonido" : " Silenciar"));
  }

  function syncButtons() {
    var id = lb.list[lb.i] && lb.list[lb.i].id;
    if (!id) return;
    var dl = part(".r34g-lb-dl");
    if (dl) {
      var had = downloaded(id);
      dl.disabled = !!had;
      dl.title = had
        ? "Ya est\u00e1 en tu historial de descargas (\u00abomitir los ya descargados\u00bb sigue mandando)"
        : "Descargar este post con tu plantilla de nombre y carpeta (D)";
    }
    var pick = part(".r34g-lb-pick");
    if (pick) {
      var isOn = marked(id);
      pick.classList.toggle("r34g-on", isOn);
      var label = pick.querySelector("span");
      if (label) label.textContent = isOn ? " Marcada" : " Marcar";
    }
    var open = part(".r34g-lb-open");
    var info = lb.list[lb.i];
    if (open && info) open.href = info.href || location.href;
    var s = part(".r34g-lb-seen");
    if (s) {
      s.hidden = !downloaded(id);
      s.textContent = "\u2714 ya lo ten\u00edas";
    }
  }

  function clearMedia() {
    var media = part(".r34g-lb-media");
    if (!media) return;
    if (lb.video) {
      try {
        lb.video.pause();
        lb.video.removeAttribute("src");
        lb.video.load();
      } catch (e) {}
      lb.video = null;
    }
    while (media.firstChild) media.removeChild(media.firstChild);
    syncSound();
  }

  function note(text, cls) {
    var media = part(".r34g-lb-media");
    if (!media) return null;
    var n = util.el("div", "r34g-lb-note" + (cls ? " " + cls : ""));
    n.appendChild(util.el("span", null, text));
    media.appendChild(n);
    return n;
  }

  function spinner(text) {
    var n = note(text || "Leyendo el post\u2026");
    if (!n) return;
    n.appendChild(util.el("span", "r34g-spinner"));
  }

  function render(info, m) {
    var stage = part(".r34g-lb-stage");
    var media = part(".r34g-lb-media");
    if (!media) return;
    stage.classList.remove("r34g-lb-zoom");
    if (lb.video) {
      try {
        lb.video.pause();
      } catch (e) {}
      lb.video = null;
    }
    while (media.firstChild) media.removeChild(media.firstChild);

    var isVideo = m.kind === "video" || /\.(mp4|webm)(\?|$)/i.test(m.url || "");
    var node;
    if (isVideo) {
      node = util.el("video", "r34g-lb-video");
      node.controls = true;
      node.autoplay = true;
      node.loop = true;
      node.muted = true;
      node.playsInline = true;
      node.preload = "auto";
      node.setAttribute("src", m.url);
      lb.video = node;
      // si el CDN no deja verlo aquí, al menos que se pueda abrir el post sin salir de la vista
      node.addEventListener("error", function () {
        if (lb.video !== node) return;
        note("No se pudo cargar aqu\u00ed: \u00e1brelo con el bot\u00f3n \u00abAbrir el post\u00bb", "r34g-lb-bad");
      });
      var p = node.play();
      if (p && p.catch) p.catch(function () {});
    } else {
      node = util.el("img", "r34g-lb-img");
      // primero la miniatura (ya está en caché, se ve al instante) y después el original
      if (info && info.src) node.setAttribute("src", info.src);
      var full = new Image();
      full.onload = function () {
        if (lb.list[lb.i] && lb.list[lb.i].id === info.id) node.setAttribute("src", m.url);
      };
      full.src = m.url;
      node.alt = (m.tags || []).slice(0, 6).join(" ");
      node.title = "Clic para acercar o alejar";
    }
    media.appendChild(node);
    syncSound();
  }

  function renderTags(m) {
    var tags = part(".r34g-lb-tags");
    if (!tags) return;
    var list = (m && m.tags && m.tags.length ? m.tags : (m && m.general) || []).slice(0, 9);
    tags.textContent = list.join(" ") + (m && m.tags && m.tags.length > 9 ? " \u2026" : "");
  }

  function hint(m) {
    var foot = part(".r34g-lb-foot");
    if (!foot) return;
    while (foot.firstChild) foot.removeChild(foot.firstChild);
    if (m) {
      var left = util.el("span", "r34g-lb-file");
      left.textContent = (m.artist && m.artist.length ? m.artist[0] + " \u00b7 " : "") + (m.ext ? "." + m.ext : "");
      foot.appendChild(left);
    }
    var keys = util.el("span", "r34g-lb-keys", "\u2190 \u2192 pasar \u00b7 D descargar \u00b7 M marcar \u00b7 O abrir \u00b7 Esc cerrar");
    foot.appendChild(keys);
  }

  function show(i) {
    if (!lb.open || !lb.list.length) return;
    var n = lb.list.length;
    lb.i = ((i % n) + n) % n;
    var info = lb.list[lb.i];
    var id = info.id;
    var pos = part(".r34g-lb-pos");
    if (pos) pos.textContent = lb.i + 1 + " / " + n;
    var idEl = part(".r34g-lb-id");
    if (idEl) idEl.textContent = "#" + id;
    if (R.settings.seen && R.seen) {
      R.seen.add(id);
      if (R.refreshSeenBadges) R.refreshSeenBadges();
    }
    syncButtons();
    hint(null);
    clearMedia();
    var mine = ++lb.token;
    var known = lb.meta[id];
    if (known) {
      renderTags(known);
      render(info, known);
      hint(known);
      prefetch();
      return;
    }
    // mientras se lee el post enseñamos ya la miniatura, para no mirar una pantalla vacía
    var stage = part(".r34g-lb-stage");
    var media = part(".r34g-lb-media");
    if (stage && media && info.src && !/\.(mp4|webm)/i.test(info.src)) {
      var quick = util.el("img", "r34g-lb-img r34g-lb-quick");
      quick.setAttribute("src", info.src);
      media.appendChild(quick);
    }
    spinner("Leyendo el post " + id + "\u2026");
    resolve(id).then(
      function (m) {
        if (mine !== lb.token || !lb.open) return;
        renderTags(m);
        render(info, m);
        hint(m);
        syncButtons();
        prefetch();
      },
      function (e) {
        if (mine !== lb.token || !lb.open) return;
        clearMedia();
        note("No se pudo leer el post: " + ((e && e.message) || e), "r34g-lb-bad");
        var again = util.el("button", "r34g-btn r34g-on", "Reintentar");
        again.type = "button";
        again.addEventListener("click", function () {
          show(lb.i);
        });
        var media2 = part(".r34g-lb-media");
        if (media2) media2.appendChild(again);
      }
    );
  }

  // adelanta la lectura (y la descarga de fondo, si es imagen) de los vecinos
  function prefetch() {
    [lb.i - 1, lb.i + 1].forEach(function (k) {
      var n = lb.list.length;
      if (n < 2) return;
      var info = lb.list[((k % n) + n) % n];
      if (!info || lb.meta[info.id]) return;
      resolve(info.id).then(function (m) {
        if (m.kind === "video") return;
        var pre = new Image();
        pre.src = m.url;
      }, function () {});
    });
  }

  function step(dir) {
    show(lb.i + dir);
  }

  function doDownload() {
    var info = lb.list[lb.i];
    if (!info || !R.downloads.api || !R.downloads.api.downloadPost) return;
    var m = lb.meta[info.id];
    if (!m) {
      util.toast("Todav\u00eda estoy leyendo ese post: prueba en un segundo");
      return;
    }
    var item = R.downloads.api.downloadPost(info.id, { meta: m, single: true });
    if (item) syncButtons();
  }

  function doMark() {
    var api = R.downloads.api;
    var info = lb.list[lb.i];
    if (!info || !api || !api.select) return;
    api.select.toggle(info.id);
    syncButtons();
  }

  function open() {
    if (!on() || lb.open || !isListPage() || selecting()) return false;
    var list = pageList();
    if (!list.length) return false;
    lb.list = list;
    lb.open = true;
    var el = build();
    document.body.appendChild(el);
    document.body.classList.add("r34g-lb-open");
    lb.i = 0;
    show(0);
    document.addEventListener("keydown", onKey, true);
    return true;
  }

  function openAt(id) {
    var list = pageList();
    var idx = 0;
    list.forEach(function (x, i) {
      if (String(x.id) === String(id)) idx = i;
    });
    lb.list = list;
    if (!lb.list.length) return false;
    if (!open()) {
      // si ya estaba abierta, solo saltamos a ese post
      if (lb.open) show(idx);
      return lb.open;
    }
    if (idx) show(idx);
    return true;
  }

  function close() {
    if (!lb.open) return;
    lb.open = false;
    lb.token++;
    document.removeEventListener("keydown", onKey, true);
    clearMedia();
    if (lb.el && lb.el.parentNode) lb.el.parentNode.removeChild(lb.el);
    document.body.classList.remove("r34g-lb-open");
  }

  function onKey(e) {
    if (!lb.open) return;
    var t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    var modal = document.getElementById("r34g-modal");
    if (modal && modal.classList.contains("r34g-open")) return;
    var k = e.key;
    if (k === "Escape") {
      close();
    } else if (k === "ArrowRight" || k === "j" || k === "J" || k === "PageDown") {
      step(1);
    } else if (k === "ArrowLeft" || k === "k" || k === "K" || k === "PageUp") {
      step(-1);
    } else if (k === "d" || k === "D") {
      doDownload();
    } else if (k === "m" || k === "M") {
      doMark();
    } else if (k === "o" || k === "O") {
      var info = lb.list[lb.i];
      if (info) window.open(info.href, "_blank", "noopener");
    } else if (k === " ") {
      if (!lb.video) return;
      if (lb.video.paused) {
        var p = lb.video.play();
        if (p && p.catch) p.catch(function () {});
      } else {
        lb.video.pause();
      }
    } else {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
  }

  // ---- enganche con la galería ------------------------------------------------------------------

  function hook() {
    var list = document.querySelector(".image-list");
    if (!list || list.dataset.r34gLbWatch) return;
    list.dataset.r34gLbWatch = "1";
    list.addEventListener(
      "click",
      function (e) {
        if (!on() || lb.open || selecting()) return;
        if (e.defaultPrevented) return;
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        var t = e.target;
        if (!t || !t.closest) return;
        if (t.closest(".r34g-dl-btn") || t.closest(".r34g-sel-box") || t.closest(".r34g-dl-badge")) return;
        var thumb = t.closest(THUMB_SEL);
        if (!thumb) return;
        var info = thumbInfo(thumb);
        if (!info) return;
        lb.list = pageList();
        var idx = 0;
        lb.list.forEach(function (x, i) {
          if (x.id === info.id) idx = i;
        });
        e.preventDefault();
        openAt(info.id);
      },
      true
    );
  }

  R.lightbox.open = open;
  R.lightbox.openAt = openAt;
  R.lightbox.close = close;
  R.lightbox.next = function () {
    step(1);
  };
  R.lightbox.prev = function () {
    step(-1);
  };
  R.lightbox.state = lb;
  R.lightbox.hook = hook;

  R.onReady(function () {
    if (!on()) return;
    hook();
  });

  if (R.changeHooks) {
    R.changeHooks.push(function () {
      if (on()) hook();
      else close();
    });
  }
})();

(function () {
  "use strict";
  var R = window.__r34g;
  if (!R || R.conflicts) return;
  R.conflicts = {};
  var util = R.util;

  var PDL_TAGS = [
    "pdl-app",
    "pdl-button",
    "pdl-artwork-button",
    "pdl-danbooru-pool-button",
    "pdl-unlisted-artwork-toolbar",
    "pdl-tag-list-button",
    "pdl-artwork-tag"
  ];
  var PDL_KEYS = [
    "pdl-download-setting",
    "pdl-button-position",
    "pdl-batch-downloader",
    "pdl-convert-setting",
    "pdl-backup-setting",
    "pdl-client-state",
    "pdl-auth-state",
    "pdl-site-state"
  ];
  var PDL_SELECTOR = "pdl-app, pdl-button, pdl-artwork-button, pdl-danbooru-pool-button, pdl-unlisted-artwork-toolbar, pdl-tag-list-button, pdl-artwork-tag, .pdl-wrapper";
  var NOTICE_KEY = "r34g.pdl.v1";
  var WARN_ID = "r34g-warn";

  function readNotice() {
    try {
      var raw = localStorage.getItem(NOTICE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeNotice(data) {
    try {
      localStorage.setItem(NOTICE_KEY, JSON.stringify(data || {}));
    } catch (e) {}
  }

  function detectPdl() {
    var markers = [];
    try {
      if (typeof customElements !== "undefined" && customElements.get) {
        PDL_TAGS.forEach(function (tag) {
          if (customElements.get(tag)) markers.push("<" + tag + ">");
        });
      }
    } catch (e) {}
    try {
      if (window._pdlShadowStyle) markers.push("window._pdlShadowStyle");
    } catch (e) {}
    try {
      if (window.__svelte && window.__svelte.v && window.__svelte.v.has && window.__svelte.v.has("5")) markers.push("window.__svelte=5");
    } catch (e) {}
    PDL_KEYS.forEach(function (key) {
      try {
        if (localStorage.getItem(key) != null) markers.push("localStorage." + key);
      } catch (e) {}
    });
    try {
      var node = document.querySelector(PDL_SELECTOR);
      if (node) markers.push("nodo " + node.tagName.toLowerCase());
    } catch (e) {}
    return { pdl: markers.length > 0, markers: markers };
  }

  function pageLinks(markers) {
    return markers.length ? "Se\u00f1ales detectadas: " + markers.join(" \u00b7 ") : "Sin se\u00f1ales por ahora.";
  }

  function stripPdl() {
    var removed = 0;
    try {
      Array.prototype.forEach.call(document.querySelectorAll(".pdl-wrapper"), function (w) {
        while (w.firstChild) w.parentNode.insertBefore(w.firstChild, w);
        w.remove();
        removed++;
      });
    } catch (e) {}
    var wrapperOnly = function (node, media) {
      var hasPdl = false;
      for (var i = 0; node.children && i < node.children.length; i++) {
        var c = node.children[i];
        var tag = String(c.tagName || "");
        if (c === media) continue;
        if (tag.indexOf("PDL-") === 0) {
          hasPdl = true;
          continue;
        }
        if (c.id === "r34g-dl-bar" || c.className === "r34g-dl-bar") continue;
        return false;
      }
      return hasPdl;
    };
    ["#image", "#main_image", "#gelcomVideoContainer"].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (!el) return;
      try {
        if (el.style && el.style.fontSize === "0px") el.style.fontSize = "";
      } catch (e) {}
      var guard = 0;
      while (el.parentElement && guard++ < 4) {
        var p = el.parentElement;
        if (p === document.body || !p.children) break;
        if (!wrapperOnly(p, el)) break;
        if (p.querySelectorAll("img, video").length > 1) break;
        while (p.firstChild) p.parentNode.insertBefore(p.firstChild, p);
        p.remove();
        removed++;
      }
    });
    var touched = [];
    try {
      Array.prototype.forEach.call(document.querySelectorAll(PDL_SELECTOR), function (n) {
        if (n.parentElement) touched.push(n.parentElement);
        n.remove();
        removed++;
      });
    } catch (e) {}
    touched.forEach(function (p) {
      try {
        if (!p.style) return;
        if (p.style.height === "inherit" || (p.tagName === "A" && p.style.height === "auto")) p.style.height = "";
        if (p.style.alignSelf === "center") p.style.alignSelf = "";
        if (p.style.width === "auto") p.style.width = "";
        if (p.style.fontSize === "0px") p.style.fontSize = "";
        if (p.style.position === "relative" && (p.tagName === "A" || !p.id)) p.style.position = "";
      } catch (e) {}
    });
    return removed;
  }

  var neutralizeTimer = 0;

  function neutralizing() {
    return (R.settings.pdlAction || "ask") === "neutralize";
  }

  function keepClean() {
    if (!neutralizing()) return;
    stripPdl();
  }

  function startNeutralize() {
    keepClean();
    if (neutralizeTimer) return;
    neutralizeTimer = setInterval(keepClean, 2000);
  }

  function stopNeutralize() {
    if (neutralizeTimer) clearInterval(neutralizeTimer);
    neutralizeTimer = 0;
  }

  function closeWarn() {
    var w = document.getElementById(WARN_ID);
    if (w) w.remove();
  }

  function warn(o) {
    closeWarn();
    var d = util.el("div", "r34g-dlg r34g-dlg-warn");
    d.id = WARN_ID;
    var box = util.el("div", "r34g-dlg-box r34g-dlg-wide");
    var head = util.el("div", "r34g-dlg-head");
    head.appendChild(util.el("b", null, o.title));
    var x = util.el("button", "r34g-close", "\u00d7");
    x.type = "button";
    x.title = "Cerrar";
    x.addEventListener("click", o.onClose || closeWarn);
    head.appendChild(x);
    box.appendChild(head);
    (o.lines || []).forEach(function (line) {
      box.appendChild(util.el("p", null, line));
    });
    if (o.note) box.appendChild(util.el("p", "r34g-hint", o.note));
    if (o.tags && o.tags.length) {
      var ul = util.el("ul", "r34g-notes");
      o.tags.forEach(function (t) {
        ul.appendChild(util.el("li", null, t));
      });
      box.appendChild(ul);
    }
    var actions = util.el("div", "r34g-dlg-actions");
    (o.actions || []).forEach(function (a) {
      var b = util.el("button", "r34g-btn " + (a.cls || ""), a.label);
      b.type = "button";
      if (a.title) b.title = a.title;
      b.addEventListener("click", function () {
        a.onClick();
      });
      actions.appendChild(b);
    });
    box.appendChild(actions);
    d.appendChild(box);
    d.addEventListener("mousedown", function (e) {
      if (e.target === d) (o.onClose || closeWarn)();
    });
    document.body.appendChild(d);
    return d;
  }

  function pdlWarning(force) {
    var info = detectPdl();
    var sig = info.markers.join("|");
    var notice = readNotice();
    if (!force && notice && notice.muted) return;
    warn({
      title: "Hay otro descargador instalado",
      lines: [
        "Pixiv Downloader (de ruaruarua) tambi\u00e9n act\u00faa en este sitio y hace lo mismo que esta suite: pone su propio bot\u00f3n en cada miniatura y, en la p\u00e1gina de un post, envuelve el archivo en un contenedor para colocar su bot\u00f3n encima.",
        "No se lleva bien con nosotros: los dos tocamos las mismas miniaturas y el mismo archivo, y su bot\u00f3n de descarga (por defecto en la esquina inferior izquierda de cada miniatura) se suma al nuestro, y adem\u00e1s reescribe el estilo del enlace de la miniatura. Pueden aparecer botones dobles, saltos de la imagen o el v\u00eddeo mal encuadrado. Desde aqu\u00ed no puedo desinstalarlo (es otro script, con su propio gestor), pero s\u00ed puedo apartar su interfaz en esta p\u00e1gina."
      ],
      note: "Si quieres quitarlo del todo: en Tampermonkey \u2192 Panel de control, busca \u00abPixiv Downloader\u00bb y pulsa Eliminar. La p\u00e1gina del script es sleazyfork.org/scripts/432150.",
      tags: [pageLinks(info.markers)],
      actions: [
        {
          label: "Ocultar sus botones en esta p\u00e1gina",
          cls: "r34g-on",
          title: "solo ahora; en la pr\u00f3xima visita te vuelvo a preguntar",
          onClick: function () {
            startNeutralize();
            util.toast("Pixiv Downloader: he ocultado sus botones", 3800);
            closeWarn();
          }
        },
        {
          label: "Ocultarlos siempre",
          title: "sin volver a preguntar (Ajustes \u2192 Descargas)",
          onClick: function () {
            R.set("pdlAction", "neutralize");
            startNeutralize();
            writeNotice({ sig: sig, muted: true, at: Date.now(), action: "neutralize" });
            closeWarn();
          }
        },
        {
          label: "No molestar m\u00e1s",
          title: "lo dejo en paz y no vuelvo a avisar",
          onClick: function () {
            R.set("pdlAction", "off");
            writeNotice({ sig: sig, muted: true, at: Date.now(), action: "off" });
            closeWarn();
          }
        }
      ],
      onClose: function () {
        closeWarn();
      }
    });
  }

  function dupWarning() {
    var dup = R.dupOf;
    if (!dup) return;
    R.dupOf = null;
    warn({
      title: "Tienes dos copias de esta suite",
      lines: [
        "Se han cargado dos versiones del script a la vez: la que est\u00e1 funcionando es la " + (dup.running || "?") + " y adem\u00e1s hay instalada la " + (dup.extra || "?") + ".",
        "Solo una hace el trabajo (la otra se aparta sola), pero conviene dejar una: en Tampermonkey \u2192 Panel de control, busca las dos entradas de este script y elimina la que no uses (la antigua)."
      ],
      actions: [
        {
          label: "Entendido",
          cls: "r34g-on",
          onClick: function () {
            closeWarn();
          }
        }
      ],
      onClose: function () {
        closeWarn();
      }
    });
  }

  function syncState() {
    var el = document.getElementById("r34g-conflict-state");
    if (!el) return;
    var info = detectPdl();
    if (R.dupOf) {
      el.textContent = "Dos copias de la suite cargadas a la vez (se recomienda desinstalar la antigua).";
      return;
    }
    if (!info.pdl) {
      el.textContent = "Sin scripts en conflicto.";
      return;
    }
    el.textContent = "Pixiv Downloader detectado: " + info.markers.join(" \u00b7 ");
  }

  R.conflicts.syncState = syncState;

  function check(force) {
    syncState();
    var action = R.settings.pdlAction || "ask";
    var info = detectPdl();
    var notice = readNotice();
    var sig = info.markers.join("|");
    var muted = !!(notice && notice.muted && notice.sig === sig);
    if (action === "neutralize") {
      startNeutralize();
      if (force) util.toast("Pixiv Downloader: quitando sus botones", 2600);
    } else {
      stopNeutralize();
    }
    if (R.dupOf) dupWarning();
    if (!info.pdl) {
      if (force) util.toast("No he visto scripts en conflicto", 2400);
      return { pdl: false, markers: [] };
    }
    if (action === "off") return info;
    if (!force && muted) return info;
    pdlWarning(force);
    return info;
  }

  R.conflicts.check = check;
  R.conflicts.detect = detectPdl;
  R.conflicts.strip = stripPdl;
  R.conflicts.warn = warn;
  R.conflicts.start = startNeutralize;

  R.onChange(function (key) {
    if (key === "pdlAction") check(true);
  });

  R.onReady(function () {
    var found = detectPdl().pdl;
    var tries = 0;
    check(false);
    var timer = setInterval(function () {
      tries++;
      if (!found && detectPdl().pdl) {
        found = true;
        check(false);
      }
      if (R.dupOf) dupWarning();
      if ((found && tries > 3) || tries > 24) {
        clearInterval(timer);
        syncState();
      }
    }, 5000);
  });
})();

(function () {
  "use strict";
  var R = window.__r34g;
  if (!R || R.boot) return;
  R.boot = true;
  var util = R.util;
  var ui = R.ui;

  var NOTES = [
    ["0.8.0", [
      "La cola de descargas ya no se pierde: si cierras la pesta\u00f1a (o pasas a otra p\u00e1gina del sitio) con un lote a medias, al volver la cola aparece con el aviso \u00abQuedaron N descargas de la sesi\u00f3n anterior\u00bb y dos botones, Continuar y Descartar. Se retoman los mismos posts y cada uno sale con tu nombre y tu carpeta de siempre.",
      "Las que fallan se pueden reintentar sin volver a buscarlas: en la cabecera de la cola sale el bot\u00f3n Reintentar (N) en cuanto hay alg\u00fan error, y pone en marcha solo esas. Al lado de cada una se lee el motivo por el que fall\u00f3.",
      "Si cierras la cola con algo pendiente, te avisa de que queda guardado y de que al recargar la p\u00e1gina podr\u00e1s continuar."
    ]],
    ["0.7.1", [
      "Vista r\u00e1pida: pulsar una miniatura ya no te lleva a la p\u00e1gina del post. Se abre encima de la galer\u00eda la imagen (o el v\u00eddeo, con sonido opcional) a tama\u00f1o completo, y se pasa de un post a otro con las flechas \u2190 \u2192 (o J y K) sin perder el sitio. Clic en la imagen para acercarla a tama\u00f1o real y alejarla otra vez.",
      "Desde la propia vista r\u00e1pida: D descarga ese post con tu plantilla de nombre y carpeta, M lo marca para el lote (se puede ir marcando mientras miras), O abre el post en una pesta\u00f1a y Esc cierra. Arriba se ve el n\u00famero de post, sus etiquetas y si ya lo ten\u00edas en el historial.",
      "Carga c\u00f3moda: se ense\u00f1a la miniatura al instante mientras se lee el post, y los vecinos se van preparando por delante, as\u00ed que pasar de uno a otro es casi instant\u00e1neo. Se enciende y se apaga en Ajustes \u2192 Galer\u00eda \u2192 \u00abVista r\u00e1pida\u00bb, y con Ctrl (o el bot\u00f3n central) sigues abriendo el post en otra pesta\u00f1a como siempre."
    ]],
    ["0.6.1", [
      "Arreglo de la selecci\u00f3n: ahora el contador canta lo que hay y ense\u00f1a la lista. Pulsa el contador (en la barra de abajo o en la barra de arriba, \u00abN seleccionados \u00b7 ver lista\u00bb) y se abre una lista con la miniatura, el id y las etiquetas de cada post marcado, separando los de esta p\u00e1gina de los de otras p\u00e1ginas. Desde ah\u00ed puedes quitar uno a uno o vaciarlo todo, y descargar o hacer el .zip sin salir de la lista.",
      "Ya no se confunde con el lote: en la barra de arriba aparece un bot\u00f3n nuevo \u00abDescargar las N marcadas\u00bb en cuanto marcas algo (solo sale si hay marcas, y baja solo lo marcado). El di\u00e1logo de la b\u00fasqueda avisa en su cabecera de cu\u00e1ntos tienes marcados y te deja descargarlos desde ah\u00ed en un clic.",
      "Y \u00abDescargar esta b\u00fasqueda\u00bb dice antes de empezar cu\u00e1ntas descargas van a salir (\u00abSon unas 126 descargas (3 p\u00e1ginas \u00d7 42)\u00bb, actualiz\u00e1ndose al cambiar las p\u00e1ginas) y ahora empieza en 1 p\u00e1gina en vez de 3, que era de donde sal\u00edan los 126 sin querer."
    ]],
    ["0.6.0", [
      "Lotes en un solo .zip: la barra de selecci\u00f3n tiene ahora un bot\u00f3n \u00abZIP\u00bb y el di\u00e1logo de \u00abDescargar esta b\u00fasqueda\u00bb una casilla \u00abGuardar todo en un solo .zip\u00bb. Dentro del .zip se respeta tu plantilla de nombre y carpeta (por ejemplo rule34/artista/archivo.jpg), as\u00ed que sale ordenado igual que las descargas sueltas.",
      "El .zip se arma sin recomprimir (m\u00e9todo \u00abstore\u00bb): las im\u00e1genes y los v\u00eddeos de rule34 ya vienen comprimidos, as\u00ed que pesa pr\u00e1cticamente lo mismo y no gasta CPU. Se escribe en trozos: si tienes carpeta elegida va directo al disco, y si no se guarda como archivo normal al terminar.",
      "Si alg\u00fan post falla, el .zip se guarda igual con el resto y dentro aparece un errores.txt con los ids y el motivo. Los archivos que entran en el .zip tambi\u00e9n se marcan como descargados en el historial, y la fila del lote en la cola muestra el progreso y se puede cancelar (se descarta el .zip a medias)."
    ]],
    ["0.5.0", [
      "Galer\u00eda escalable: las miniaturas ya no se estiran al ancho de la p\u00e1gina. Ahora eliges el tama\u00f1o m\u00e1ximo en p\u00edxeles (por defecto 200) y la suite calcula sola las columnas que caben, as\u00ed que en pantallas grandes salen muchas m\u00e1s por fila y se ven igual de n\u00edtidas.",
      "Control r\u00e1pido: barra \u00abMiniaturas\u00bb encima de la cuadr\u00edcula con deslizador, botones \u2212 y +, \u00abNatural\u00bb (250 px, el tama\u00f1o original de rule34), \u00abCompacto\u00bb (130 px) y el valor real que est\u00e1n midiendo. Se puede ocultar en Ajustes \u2192 Galer\u00eda.",
      "Atajo: Alt + rueda del rat\u00f3n sobre la galer\u00eda para reducir o agrandar al momento. En Ajustes \u2192 Galer\u00eda est\u00e1 tambi\u00e9n el n\u00famero exacto y preajustes, y la opci\u00f3n \u00abColumnas\u00bb pasa a \u00abAuto\u00bb (fijar un n\u00famero sigue funcionando)."
    ]],
    ["0.4.0", [
      "Selecci\u00f3n manual de miniaturas: en las p\u00e1ginas de lista aparece \u00abSeleccionar\u00bb al lado de \u00abDescargar esta b\u00fasqueda\u00bb. Con el modo activo, cada miniatura ense\u00f1a una casilla arriba a la izquierda (tambi\u00e9n puedes pulsar la miniatura entera) y abajo a la derecha sale una barra con el contador, \u00abDescargar\u00bb, \u00abTodas\u00bb y \u00abNinguna\u00bb.",
      "La selecci\u00f3n se mantiene al cambiar de p\u00e1gina dentro de la misma pesta\u00f1a, as\u00ed que puedes ir marcando en varias p\u00e1ginas y lanzarlo todo al final. Esc sale del modo selecci\u00f3n sin borrar lo marcado.",
      "\u00abDescargar\u00bb respeta la opci\u00f3n \u00abomitir los que ya est\u00e1n en el historial\u00bb de la pesta\u00f1a Descargas y avisa de cu\u00e1ntos se han omitido."
    ]],
    ["0.3.0", [
      "Nueva pesta\u00f1a Descargas: bot\u00f3n de descarga en cada miniatura y sobre el archivo del post, con nombre y carpeta propios ({id}_{artist}_{character} dentro de rule34/{artist}, todo configurable), elecci\u00f3n de carpeta real en Chrome y Edge, cola con progreso y l\u00edmite de descargas a la vez, historial de descargas (marca lo que ya has bajado y puede omitirlo) y descarga de una b\u00fasqueda entera por p\u00e1ginas.",
      "Nuevo aviso de \u00abotro descargador instalado\u00bb: si tienes Pixiv Downloader (el descargador multibooru que tambi\u00e9n act\u00faa en rule34.xxx) la suite lo detecta y te ofrece ocultar sus botones en esta p\u00e1gina, ocultarlos siempre o no volver a avisar. Desde aqu\u00ed no se puede desinstalar, pero s\u00ed apartar su interfaz para que los dos no peleen por las mismas miniaturas y el mismo archivo. Tambi\u00e9n avisa si tienes dos copias de esta misma suite cargadas a la vez.",
      "Para guardar los originales con tu nombre y tu carpeta, el script ahora pide permiso de descarga (GM_xmlhttpRequest): es la \u00fanica forma de leer un archivo que vive en otro dominio del sitio. Si tu gestor de userscripts no lo permite, la descarga abre el original en una pesta\u00f1a y lo guardas t\u00fa."
    ]],
    ["0.2.9", [
      "Nuevo interruptor en el laboratorio: Proyecto \u2192 \u00abpuente de IA de Perchance en el .user.js\u00bb. Si lo desmarcas, el script se compila SIN el puente (ni iframe, ni postMessage, ni la direcci\u00f3n del generador): queda solo el proveedor gratuito de reserva. As\u00ed puedes repartir una copia del userscript sin regalar la idea.",
      "Con el interruptor quitado, el .user.js tambi\u00e9n se compila sin el historial de versiones, que explicaba el m\u00e9todo."
    ]],
    ["0.2.8", [
      "Si la IA de Perchance no responde (por ejemplo porque has puesto el generador en privado, lo has renombrado o lo has borrado), el an\u00e1lisis sigue funcionando: reintenta solo con Pollinations, que es gratis y no pide clave. Antes se quedaba esperando y fallaba.",
      "El motor de IA queda en dos capas: la elegida en Ajustes \u2192 Etiquetas y, solo para el caso de Perchance, esa red de seguridad."
    ]],
    ["0.2.7", [
      "Bot\u00f3n flotante \u00ab\u26a1 Ajustes\u00bb abajo a la derecha, siempre visible: desde ah\u00ed se abre el panel completo (clave de rule34, motor de IA, cuadr\u00edcula, v\u00eddeos, etiquetas). Ya no hace falta encontrar el enlace en la barra de navegaci\u00f3n.",
      "El enlace \u00abAjustes\u00bb de la barra ahora se inserta aunque rule34 tarde en pintarla (antes pod\u00eda quedarse sin aparecer).",
      "El bot\u00f3n flotante se puede ocultar en Ajustes \u2192 Galer\u00eda \u2192 Panel lateral y navegaci\u00f3n."
    ]],
    ["0.2.6", [
      "El puente de la IA de Perchance ya apunta al nombre actual del generador (userscript-maker), as\u00ed que la opci\u00f3n \u00abIA de Perchance (gratis, sin clave)\u00bb funciona: el script abre tu generador en un iframe invisible y \u00e9l hace la consulta al modelo. Necesita que el generador est\u00e9 guardado y p\u00fablico (lo est\u00e1).",
      "El receptor del puente acepta ahora mensajes de rule34.xxx y del propio generador, para poder probarlo tambi\u00e9n desde el editor."
    ]],
    ["0.2.5", [
      "El script ya se instala y actualiza solo: la cabecera apunta a tu repositorio de GitHub (@downloadURL y @updateURL). Sube ah\u00ed el rule34-gallery-suite.user.js y Tampermonkey lo instalar\u00e1 desde esa URL; cuando subas una versi\u00f3n con el n\u00famero m\u00e1s alto, se actualiza sin tocar nada.",
      "Nueva opci\u00f3n para dejarlo autom\u00e1tico: \u00abUsar la IA en ese an\u00e1lisis autom\u00e1tico\u00bb, junto a \u00abAnalizar autom\u00e1ticamente al abrir un post\u00bb. Como el resultado de la IA se guarda por post, solo gasta una petici\u00f3n la primera vez que ves cada post.",
      "Recuerda: las claves (rule34 y de la IA) se guardan solo en tu navegador y nunca van al script ni al repositorio, que son p\u00fablicos."
    ]],
    ["0.2.4", [
      "Nuevo proveedor \u00abIA de Perchance\u00bb: sin clave y sin cuota de terceros. El script abre este generador en un iframe oculto (#r34g-ai, que all\u00ed solo carga el receptor) y le pide el an\u00e1lisis por postMessage; la respuesta la genera el plugin de IA de Perchance. Requiere que el generador est\u00e9 guardado, y si lo renombras hay que actualizar la direcci\u00f3n en Ajustes \u2192 Etiquetas (al compilar se rellena sola con el nombre actual).",
      "Comprobado que Groq, Google Gemini y OpenRouter permiten llamadas desde el navegador (CORS), as\u00ed que sus niveles gratuitos funcionan directamente desde el userscript."
    ]],
    ["0.2.3", [
      "La IA deja de depender de una sola direcci\u00f3n: en Ajustes \u2192 Etiquetas hay un desplegable de proveedores (Groq, Google Gemini y OpenRouter tienen nivel gratuito con clave gratis; Pollinations sigue estando para no usar clave; tambi\u00e9n OpenAI, Mistral y Ollama local). Al elegir uno se rellenan la direcci\u00f3n y el modelo.",
      "Los errores de la IA ahora se explican: l\u00edmite alcanzado (\u00abusa el an\u00e1lisis local o cambia de proveedor\u00bb), clave rechazada o problema de conexi\u00f3n, en vez de un HTTP 429 a secas.",
      "El resultado de la IA se guarda por post (30 d\u00edas, 300 posts): volver a analizar el mismo post no gasta otra petici\u00f3n. Hay un bot\u00f3n para borrar esos resultados guardados."
    ]],
    ["0.2.2", [
      "Nueva integraci\u00f3n con la API de rule34: con tu user_id y tu api_key (Ajustes \u2192 Etiquetas \u2192 Cuenta de rule34) el an\u00e1lisis lee las etiquetas del post directamente de la API, con su tipo correcto, y a\u00f1ade las que falten en el panel lateral. La clave se guarda solo en tu navegador y nunca entra en el script.",
      "El buscador de etiquetas del panel lateral ahora sugiere etiquetas reales mientras escribes, con su n\u00famero de posts (endpoint p\u00fablico de autocompletado, no necesita clave). Un clic busca esa etiqueta.",
      "Bot\u00f3n \u00abProbar conexi\u00f3n\u00bb para comprobar el autocompletado y la API con tu cuenta."
    ]],
    ["0.2.1", [
      "Las tarjetas de la galer\u00eda son cuadradas (1:1) de serie: se ve m\u00e1s galer\u00eda por fila y la miniatura rellena el cuadro. Sigue pudiendo elegirse 4:5, 3:4 o el tama\u00f1o original en Galer\u00eda.",
      "El laboratorio ya usa una copia local del CSS del sitio (src/fixture-site.css), as\u00ed que las p\u00e1ginas de prueba se ven como en rule34 y no sin estilos."
    ]],
    ["0.2.0", [
      "Cuadr\u00edcula fijada a 5 columnas de serie (ajustable de 3 a 7 en Galer\u00eda).",
      "La pesta\u00f1a del ensamblador ahora se llama Mejoras, con todo en espa\u00f1ol, buscador de opciones, exportar/importar ajustes y vuelta a los valores de f\u00e1brica.",
      "Nueva secci\u00f3n V\u00eddeos: encuadre, ancho, fondo con desenfoque del p\u00f3ster, modo cine, barra de controles propia (salto, velocidad, bucle, fotograma, PiP, pantalla completa) y atajos de teclado, independiente del reproductor de rule34.",
      "Nueva secci\u00f3n Etiquetas: reparte las etiquetas entre los personajes del post, detecta redundantes seg\u00fan el n\u00famero de posts, evita sin\u00f3nimos y permite ajustar, copiar o buscar el resultado. La IA es opcional.",
      "\u00cdcono de \u00abya visto\u00bb en las miniaturas, con historial privado en la cach\u00e9 de este navegador."
    ]],
    ["0.1.0", [
      "Integraci\u00f3n del ensamblador de la web como panel nativo (pesta\u00f1as, interruptores, etiquetas favoritas en el panel lateral).",
      "Galer\u00eda reconstruida como cuadr\u00edcula con tarjetas uniformes, insignias de tipo y chip de puntuaci\u00f3n.",
      "Panel de etiquetas fijo con filtro instant\u00e1neo, paginaci\u00f3n coherente y limpieza de huecos de publicidad vac\u00edos."
    ]]
  ];

  function buildPanel(panel) {
    panel.appendChild(
      util.el(
        "p",
        "r34g-hint",
        "Versi\u00f3n " + R.VERSION + " \u00b7 Pensada y probada solo para PC (navegador de escritorio con Tampermonkey)."
      )
    );
    NOTES.forEach(function (entry) {
      var block = ui.section(panel, "Versi\u00f3n " + entry[0]);
      var ul = util.el("ul", "r34g-notes");
      entry[1].forEach(function (line) {
        ul.appendChild(util.el("li", null, line));
      });
      block.appendChild(ul);
    });
    var enh = ui.section(panel, "Ensamblador integrado");
    enh.appendChild(util.el("p", "r34g-hint", "Historial del ensamblador original:"));
  }

  R.panel({
    key: "changelog",
    label: "Novedades",
    build: buildPanel
  });

  util.onReady(function () {
    R.applySettings();
    R.readyFns.forEach(function (fn) {
      try {
        fn();
      } catch (e) {
        if (window.console && console.error) console.error("[r34g] " + e.message, e);
      }
    });
  });
})();

