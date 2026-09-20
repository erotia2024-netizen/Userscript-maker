// ==UserScript==
// @name         Rule34 Gallery Suite
// @namespace    https://github.com/erotia2024-netizen/Userscript-maker
// @version      0.2.8
// @description  Reconstruye rule34.xxx para PC: cuadricula de 5 columnas (tarjetas cuadradas) con icono de "ya visto", seccion de videos con barra de controles propia, analizador de etiquetas por personaje (con IA opcional) y panel "Mejoras" con todas las opciones del ensamblador, en espanol.
// @author       rule34-gallery-suite
// @homepageURL  https://github.com/erotia2024-netizen/Userscript-maker
// @supportURL   https://github.com/erotia2024-netizen/Userscript-maker/issues
// @downloadURL  https://raw.githubusercontent.com/erotia2024-netizen/Userscript-maker/main/rule34-gallery-suite.user.js
// @updateURL    https://raw.githubusercontent.com/erotia2024-netizen/Userscript-maker/main/rule34-gallery-suite.user.js
// @match        *://rule34.xxx/*
// @match        *://www.rule34.xxx/*
// @run-at       document-end
// @noframes
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  var css = "html {\n  --r34g-cols: 5;\n  --r34g-aspect: 1 / 1;\n  --r34g-gap: 12px;\n  --r34g-radius: 8px;\n  --r34g-card: #232a23;\n  --r34g-card-hover: #2a322a;\n  --r34g-line: #3d473d;\n  --r34g-accent: var(--c-link-soft, #93b393);\n  --r34g-bg: var(--c-bg, #303a30);\n  --r34g-bg-alt: var(--c-bg-alt, #293129);\n  --r34g-bg-deep: var(--c-bg-deep, #303030);\n  --r34g-text: var(--c-text, #c0c0c0);\n  --r34g-text-soft: var(--c-text-soft, #878787);\n  --r34g-link: var(--c-link, #b0e0b0);\n  --r34g-shadow: 0 18px 48px rgba(0, 0, 0, .55);\n  --r34g-vwidth: 1000px;\n  --r34g-z: 2147482000;\n}\n\nhtml[data-r34g-cols=\"3\"] { --r34g-cols: 3; }\nhtml[data-r34g-cols=\"4\"] { --r34g-cols: 4; }\nhtml[data-r34g-cols=\"5\"] { --r34g-cols: 5; }\nhtml[data-r34g-cols=\"6\"] { --r34g-cols: 6; }\nhtml[data-r34g-cols=\"7\"] { --r34g-cols: 7; }\nhtml[data-r34g-aspect=\"1\"] { --r34g-aspect: 1 / 1; }\nhtml[data-r34g-aspect=\"4/5\"] { --r34g-aspect: 4 / 5; }\nhtml[data-r34g-aspect=\"3x4\"] { --r34g-aspect: 3 / 4; }\nhtml[data-r34g-aspect=\"auto\"] { --r34g-aspect: auto; }\nhtml[data-r34g-aspect=\"auto\"] { --r34g-fit: contain; }\nhtml[data-r34g-fit=\"contain\"] { --r34g-fit: contain; }\nhtml[data-r34g-fit=\"cover\"] { --r34g-fit: cover; }\nhtml[data-r34g-hover=\"off\"] .image-list .thumb img.preview { transform: none !important; }\n\n#r34g-nav-item a {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  cursor: pointer;\n}\n\n#r34g-nav-item a b {\n  font-weight: normal;\n  font-size: 1.15em;\n  line-height: 1;\n}\n\n#r34g-nav-item a:hover {\n  color: var(--c-link, #b0e0b0) !important;\n}\n\n#r34g-nav-item a svg {\n  width: 14px;\n  height: 14px;\n}\n\n#r34g-nav-item.r34g-active a {\n  color: var(--c-link, #b0e0b0) !important;\n  text-shadow: 0 0 0 currentColor;\n}\n\nhtml body #r34g-modal .r34g-title svg {\n  width: 15px;\n  height: 15px;\n}\n\nhtml body #post-list > .content,\nhtml body .image-list {\n  min-width: 0;\n}\n\nhtml body #post-list > .content {\n  flex: 1 1 auto !important;\n  width: auto !important;\n  max-width: none !important;\n}\n\nhtml body .image-list {\n  display: grid !important;\n  grid-template-columns: repeat(var(--r34g-cols), minmax(0, 1fr)) !important;\n  gap: var(--r34g-gap) !important;\n  align-items: start !important;\n  align-content: start !important;\n  justify-content: stretch !important;\n  width: 100% !important;\n  margin: 0 !important;\n  padding: 0 !important;\n}\n\nhtml body .image-list > .thumb {\n  position: relative !important;\n  display: block !important;\n  width: auto !important;\n  height: auto !important;\n  min-width: 0 !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  border-radius: var(--r34g-radius) !important;\n  background: var(--r34g-card);\n  overflow: hidden;\n  box-shadow: 0 1px 0 rgba(255, 255, 255, .04) inset, 0 2px 10px rgba(0, 0, 0, .28);\n  transition: background .18s ease, box-shadow .18s ease, transform .18s ease;\n}\n\nhtml body .image-list > .thumb::before {\n  content: \"\";\n  display: block;\n  padding-top: 0;\n}\n\nhtml body .image-list > .thumb > a {\n  position: relative !important;\n  display: block !important;\n  width: 100% !important;\n  height: 100% !important;\n  aspect-ratio: var(--r34g-aspect) !important;\n  text-align: center !important;\n  overflow: hidden;\n  border-radius: var(--r34g-radius) !important;\n  background: linear-gradient(160deg, rgba(255, 255, 255, .03), rgba(0, 0, 0, .25));\n  outline: 1px solid rgba(255, 255, 255, .05);\n  outline-offset: -1px;\n}\n\nhtml body .image-list > .thumb:hover {\n  background: var(--r34g-card-hover);\n  transform: translateY(-2px);\n  box-shadow: 0 6px 20px rgba(0, 0, 0, .45);\n}\n\nhtml body .image-list > .thumb:hover > a {\n  outline-color: rgba(147, 179, 147, .6);\n}\n\nhtml body .image-list > .thumb:hover img.preview,\nhtml body .image-list > .thumb:hover img.r34g-ready {\n  filter: brightness(1.06) saturate(1.04);\n}\n\nhtml body .image-list > .thumb > a::after {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  background: linear-gradient(to top, rgba(0, 0, 0, .78) 0%, rgba(0, 0, 0, .32) 32%, rgba(0, 0, 0, 0) 62%);\n  opacity: 0;\n  transition: opacity .2s ease;\n  pointer-events: none;\n}\n\nhtml body .image-list > .thumb:hover > a::after {\n  opacity: 1;\n}\n\nhtml body .image-list > .thumb img.preview,\nhtml body .image-list > .thumb img,\nhtml body .image-list > .thumb video {\n  display: block !important;\n  width: 100% !important;\n  height: 100% !important;\n  max-width: none !important;\n  max-height: none !important;\n  margin: 0 !important;\n  object-fit: var(--r34g-fit, cover) !important;\n  object-position: center 22%;\n  border: 0 !important;\n  box-sizing: border-box !important;\n  opacity: 0;\n  transition: opacity .35s ease, transform .3s ease, filter .3s ease;\n}\n\nhtml body .image-list > .thumb img.r34g-ready {\n  opacity: 1;\n}\n\nhtml body .image-list > .thumb:hover img.preview,\nhtml body .image-list > .thumb:hover img.r34g-ready {\n  transform: scale(1.045);\n}\n\nhtml body .image-list > .thumb img.webm-thumb {\n  border: 0 !important;\n  outline: 0 !important;\n}\n\nhtml body .image-list > .thumb > a > .score-info {\n  position: absolute !important;\n  right: 7px !important;\n  bottom: 7px !important;\n  z-index: 3;\n  display: inline-flex !important;\n  align-items: center;\n  gap: 4px;\n  margin: 0 !important;\n  padding: 2px 7px !important;\n  border-radius: 999px !important;\n  background: rgba(0, 0, 0, .62) !important;\n  border: 1px solid rgba(255, 255, 255, .12);\n  border-left-width: 3px;\n  color: #e8e8e8 !important;\n  font-size: 11px !important;\n  line-height: 1.45 !important;\n  letter-spacing: .2px;\n  text-align: center !important;\n  backdrop-filter: blur(3px);\n  transition: background .2s ease, transform .2s ease, border-color .2s ease;\n}\n\nhtml body .image-list > .thumb:hover > a > .score-info {\n  background: rgba(0, 0, 0, .85) !important;\n  transform: translateY(-1px);\n}\n\nhtml body .image-list > .thumb > a > .score-info.low {\n  border-left-color: #d9534f !important;\n}\n\nhtml body .image-list > .thumb > a > .score-info.medium {\n  border-left-color: #f0ad4e !important;\n}\n\nhtml body .image-list > .thumb > a > .score-info.high {\n  border-left-color: #5cb85c !important;\n}\n\nhtml[data-r34g-score=\"off\"] .image-list .thumb > a > .score-info {\n  display: none !important;\n}\n\nhtml body .image-list .thumb .r34g-badges {\n  position: absolute;\n  top: 7px;\n  left: 7px;\n  z-index: 3;\n  display: flex;\n  gap: 5px;\n  opacity: .92;\n  transition: opacity .2s ease;\n}\n\nhtml body .image-list .thumb:hover .r34g-badges {\n  opacity: 1;\n}\n\nhtml body .image-list .thumb .r34g-badge {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 20px;\n  height: 20px;\n  padding: 0 5px;\n  border-radius: 6px;\n  background: rgba(0, 0, 0, .68);\n  border: 1px solid rgba(255, 255, 255, .14);\n  color: #f2f2f2;\n  font-size: 10px;\n  font-weight: bold;\n  letter-spacing: .3px;\n  line-height: 1;\n  backdrop-filter: blur(3px);\n}\n\nhtml body .image-list .thumb .r34g-badge.r34g-video {\n  color: #8fd0ff;\n  border-color: rgba(143, 208, 255, .4);\n}\n\nhtml body .image-list .thumb .r34g-badge.r34g-gif {\n  color: #ffd479;\n  border-color: rgba(255, 212, 121, .4);\n}\n\nhtml body .image-list .thumb .r34g-badge.r34g-sound {\n  color: #a9f0a9;\n  border-color: rgba(169, 240, 169, .4);\n}\n\nhtml[data-r34g-badges=\"off\"] .image-list .thumb .r34g-badges {\n  display: none !important;\n}\n\nhtml body .image-list .thumb .r34g-meta {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 2;\n  padding: 22px 8px 7px;\n  text-align: left;\n  font-size: 10px;\n  color: #d8d8d8;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, .9);\n  opacity: 0;\n  transform: translateY(4px);\n  transition: opacity .2s ease, transform .2s ease;\n  pointer-events: none;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n\nhtml body .image-list .thumb:hover .r34g-meta {\n  opacity: 1;\n  transform: none;\n}\n\nhtml body .image-list .thumb .r34g-meta .r34g-taglist {\n  display: block;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  color: #cfd8cf;\n}\n\nhtml body .image-list > .thumb.r34g-hidden-by-filter {\n  display: none !important;\n}\n\nhtml body .r34g-ad-hidden {\n  display: none !important;\n}\n\nhtml.r34g-drawer-open {\n  overflow: hidden;\n}\n\nhtml body .sidebar {\n  align-self: flex-start;\n  max-height: calc(100vh - 12px);\n  position: sticky;\n  top: 8px;\n  overflow-y: auto;\n  overflow-x: hidden;\n  padding: 0 10px 14px 0;\n  scrollbar-width: thin;\n  scrollbar-color: #4b564b rgba(0, 0, 0, .25);\n  z-index: 4;\n}\n\nhtml body #r34g-drawer-head {\n  display: none;\n  align-items: center;\n  gap: 8px;\n  margin: 0 0 8px;\n  padding-bottom: 7px;\n  border-bottom: 1px solid var(--r34g-line);\n}\n\nhtml body #r34g-drawer-head h5 {\n  flex: 1;\n  margin: 0 !important;\n  color: var(--r34g-link);\n  font-family: Tahoma, verdana, sans-serif;\n  font-size: 12.5px;\n  letter-spacing: .06em;\n  text-transform: uppercase;\n}\n\nhtml body #r34g-drawer-close {\n  width: 30px;\n  height: 30px;\n  padding: 0;\n  border: 1px solid var(--c-bg-highlight, #505a50);\n  border-radius: 7px;\n  background: #333d33;\n  color: var(--r34g-text) !important;\n  font-size: 16px;\n  line-height: 1;\n  cursor: pointer;\n}\n\nhtml body #r34g-drawer-close:hover {\n  border-color: var(--r34g-accent);\n  color: #eafaea !important;\n}\n\nhtml body .tag-search input[type=\"text\"],\nhtml body .tag-search input[type=\"search\"] {\n  width: 100% !important;\n  box-sizing: border-box !important;\n  padding: 4px 7px !important;\n  border: 1px solid var(--c-bg-highlight, #505a50) !important;\n  border-radius: 5px !important;\n  background: var(--r34g-bg-deep) !important;\n  color: var(--r34g-text) !important;\n  font-family: verdana, sans-serif !important;\n  font-size: 12px !important;\n  outline: none;\n}\n\nhtml body .tag-search input[type=\"text\"]:focus,\nhtml body .tag-search input[type=\"search\"]:focus {\n  border-color: var(--r34g-accent) !important;\n}\n\nhtml body .tag-search input[type=\"submit\"] {\n  margin-top: 5px;\n  padding: 4px 12px !important;\n  border: 1px solid var(--c-bg-highlight, #505a50) !important;\n  border-radius: 5px !important;\n  background: #333d33 !important;\n  color: var(--r34g-link) !important;\n  font-family: verdana, sans-serif !important;\n  font-size: 12px !important;\n  cursor: pointer;\n}\n\nhtml body .tag-search input[type=\"submit\"]:hover {\n  border-color: var(--r34g-accent) !important;\n  color: #eafaea !important;\n}\n\nhtml body .sidebar small {\n  display: block;\n  margin-top: 4px;\n  color: var(--r34g-text-soft);\n  font-size: 10.5px;\n}\n\nhtml[data-r34g-sticky=\"off\"] body .sidebar {\n  position: static;\n  max-height: none;\n  overflow: visible;\n}\n\nhtml body .sidebar::-webkit-scrollbar {\n  width: 9px;\n}\n\nhtml body .sidebar::-webkit-scrollbar-thumb {\n  background: #4b564b;\n  border-radius: 6px;\n}\n\nhtml body .sidebar::-webkit-scrollbar-track {\n  background: rgba(0, 0, 0, .2);\n}\n\nhtml body .tag-search h5,\nhtml body #r34g-sidebar-tags-title {\n  margin: 0 0 6px !important;\n  font-family: Tahoma, verdana, sans-serif;\n  font-size: 12px !important;\n  letter-spacing: .08em;\n  text-transform: uppercase;\n  color: var(--r34g-text-soft) !important;\n  border-bottom: 1px solid var(--r34g-line);\n  padding-bottom: 5px;\n}\n\nhtml body #r34g-tag-filter {\n  width: 100% !important;\n  box-sizing: border-box !important;\n  margin: 0 0 7px !important;\n  padding: 4px 6px !important;\n  background: var(--r34g-bg-deep) !important;\n  color: var(--r34g-text) !important;\n  border: 1px solid var(--c-bg-highlight, #505a50) !important;\n  border-radius: 4px !important;\n  font-family: verdana, sans-serif !important;\n  font-size: 11px !important;\n  outline: none;\n}\n\nhtml body #r34g-tag-filter:focus {\n  border-color: var(--r34g-accent) !important;\n}\n\nhtml body #r34g-tag-filter::placeholder {\n  color: #6f7a6f;\n}\n\nhtml[data-r34g-filter=\"off\"] body #r34g-tag-filter {\n  display: none !important;\n}\n\nhtml body .sidebar ul {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n\nhtml body .sidebar li {\n  padding: 1px 0 !important;\n  line-height: 1.45;\n}\n\nhtml body .sidebar li a {\n  font-size: 13px !important;\n  line-height: 1.5;\n  color: var(--c-link-metadata, #90d9ed);\n}\n\nhtml body .sidebar li a:hover {\n  text-decoration: underline;\n  color: #d9f4ff;\n}\n\nhtml body .sidebar li {\n  display: flex !important;\n  align-items: flex-start;\n  gap: 6px;\n  padding: 1px 2px !important;\n  line-height: 1.5;\n  border-radius: 4px;\n  transition: background .12s ease;\n}\n\nhtml body .sidebar li > a {\n  flex: 1 1 auto;\n  min-width: 0;\n  overflow-wrap: anywhere;\n}\n\nhtml body .sidebar .tag-count {\n  flex: 0 0 auto;\n  min-width: 46px;\n  text-align: right;\n  color: var(--r34g-text-soft) !important;\n  font-size: 10.5px !important;\n  line-height: 1.85;\n  padding-left: 6px;\n}\n\nhtml body .sidebar li > a[href^=\"https://rule34.xxx/\"],\nhtml body .sidebar li > a[href*=\"page=wiki\"] {\n  order: 3;\n  flex: 0 0 auto;\n  width: 0;\n  overflow: hidden;\n  opacity: 0;\n  padding-left: 3px;\n  color: var(--r34g-text-soft) !important;\n  font-size: 11px !important;\n  line-height: 1.9;\n  text-decoration: none;\n  transition: width .15s ease, opacity .15s ease;\n}\n\nhtml body .sidebar li:hover > a[href^=\"https://rule34.xxx/\"],\nhtml body .sidebar li:hover > a[href*=\"page=wiki\"] {\n  width: 13px;\n  opacity: 1;\n  text-align: center;\n}\n\nhtml body .sidebar li > a[href*=\"page=post\"] {\n  order: 1;\n}\n\nhtml body .sidebar li > .tag-count {\n  order: 2;\n}\n\nhtml body .sidebar li:hover {\n  background: rgba(255, 255, 255, .045);\n}\n\nhtml body .sidebar .tag-type-general a { color: var(--c-link-metadata, #90d9ed); }\nhtml body .sidebar .tag-type-artist a { color: var(--c-link-artist, #f0a0a0); }\nhtml body .sidebar .tag-type-character a { color: var(--c-link-character, #f0f0a0); }\nhtml body .sidebar .tag-type-copyright a { color: var(--c-link-copyright, #f0a0f0); }\n\nhtml body .sidebar .tag-count {\n  color: var(--r34g-text-soft) !important;\n  font-size: 10.5px !important;\n  padding-left: 3px;\n}\n\nhtml body .sidebar li.r34g-tag-hidden {\n  display: none !important;\n}\n\nhtml body #r34g-sidebar-section {\n  border-top: 1px solid var(--r34g-line);\n  margin-top: 10px;\n  padding-top: 9px;\n}\n\nhtml body #r34g-sidebar-toggle {\n  display: none;\n  position: fixed;\n  left: 12px;\n  bottom: 14px;\n  z-index: calc(var(--r34g-z) - 5);\n  align-items: center;\n  gap: 6px;\n  padding: 8px 12px;\n  border: 1px solid var(--c-bg-highlight, #505a50);\n  border-radius: 999px;\n  background: var(--r34g-bg-alt);\n  color: var(--r34g-link) !important;\n  font-family: verdana, sans-serif;\n  font-size: 12px;\n  cursor: pointer;\n  box-shadow: 0 6px 18px rgba(0, 0, 0, .5);\n}\n\nhtml body #r34g-sidebar-toggle:hover {\n  border-color: var(--r34g-accent);\n  color: #dff0df !important;\n}\n\nhtml body #r34g-drawer-backdrop {\n  display: none;\n  position: fixed;\n  inset: 0;\n  z-index: calc(var(--r34g-z) - 6);\n  background: rgba(0, 0, 0, .6);\n}\n\nhtml body #r34g-to-top {\n  position: fixed;\n  right: 12px;\n  bottom: 14px;\n  z-index: calc(var(--r34g-z) - 5);\n  width: 38px;\n  height: 38px;\n  padding: 0;\n  border: 1px solid var(--c-bg-highlight, #505a50);\n  border-radius: 50%;\n  background: var(--r34g-bg-alt);\n  color: var(--r34g-link) !important;\n  font-size: 15px;\n  cursor: pointer;\n  opacity: 0;\n  pointer-events: none;\n  transition: opacity .25s ease, border-color .2s ease;\n  box-shadow: 0 6px 18px rgba(0, 0, 0, .5);\n}\n\nhtml body #r34g-to-top.r34g-visible {\n  opacity: .92;\n  pointer-events: auto;\n}\n\nhtml body #r34g-to-top:hover {\n  border-color: var(--r34g-accent);\n}\n\nhtml body #paginator {\n  margin-top: 14px !important;\n}\n\nhtml body #paginator .pagination {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: center;\n  gap: 4px;\n  row-gap: 6px;\n  padding: 7px 8px;\n  background: var(--r34g-bg-alt);\n  border: 1px solid var(--r34g-line);\n  border-radius: var(--r34g-radius);\n}\n\nhtml body #paginator #manualpage {\n  display: inline-flex !important;\n  align-items: center;\n  gap: 4px;\n  margin-left: 6px;\n  padding-left: 8px;\n  border-left: 1px solid var(--r34g-line);\n}\n\nhtml body #paginator #manualpage input[type=\"text\"] {\n  width: 62px !important;\n  height: 28px;\n  box-sizing: border-box;\n  padding: 0 7px !important;\n  border: 1px solid var(--c-bg-highlight, #505a50) !important;\n  border-radius: 6px !important;\n  background: var(--r34g-bg-deep) !important;\n  color: var(--r34g-text) !important;\n  font-family: verdana, sans-serif !important;\n  font-size: 12px !important;\n  outline: none;\n}\n\nhtml body #paginator #manualpage input[type=\"text\"]:focus {\n  border-color: var(--r34g-accent) !important;\n}\n\nhtml body #paginator #manualpage input[type=\"text\"]::placeholder {\n  color: #6f7a6f;\n}\n\nhtml body #paginator #manualpage input[type=\"submit\"] {\n  height: 28px;\n  padding: 0 10px !important;\n  border: 1px solid var(--c-bg-highlight, #505a50) !important;\n  border-radius: 6px !important;\n  background: #333d33;\n  color: var(--r34g-link) !important;\n  font-family: verdana, sans-serif !important;\n  font-size: 12px !important;\n  cursor: pointer;\n}\n\nhtml body #paginator #manualpage input[type=\"submit\"]:hover {\n  border-color: var(--r34g-accent) !important;\n  color: #eafaea !important;\n}\n\nhtml body #paginator .pagination a,\nhtml body #paginator .pagination b,\nhtml body #paginator .pagination span {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 30px;\n  height: 28px;\n  padding: 0 9px !important;\n  border: 1px solid transparent;\n  border-radius: 6px;\n  color: var(--r34g-link) !important;\n  font-size: 12.5px !important;\n  line-height: 1 !important;\n  transition: background .15s ease, color .15s ease, border-color .15s ease, transform .15s ease;\n}\n\nhtml body #paginator .pagination a:hover {\n  background: var(--c-bg-highlight, #505a50);\n  border-color: rgba(147, 179, 147, .55);\n  color: #eafaea !important;\n  transform: translateY(-1px);\n}\n\nhtml body #paginator .pagination b {\n  background: var(--r34g-accent);\n  border-color: rgba(255, 255, 255, .25);\n  color: var(--r34g-bg) !important;\n  font-weight: bold;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, .35);\n}\n\nhtml body #paginator .pagination a.arrow,\nhtml body #paginator .pagination a[alt] {\n  color: var(--r34g-text-soft) !important;\n}\n\nhtml body #paginator .pagination a.arrow:hover,\nhtml body #paginator .pagination a[alt]:hover {\n  color: #eafaea !important;\n}\n\nhtml body .image-list + br,\nhtml body #post-list > br {\n  display: none;\n}\n\nhtml body #r34g-modal {\n  position: fixed;\n  inset: 0;\n  z-index: var(--r34g-z);\n  display: none;\n  align-items: center;\n  justify-content: center;\n  padding: 24px 16px;\n  background: rgba(0, 0, 0, .66);\n  backdrop-filter: blur(2px);\n  font-family: verdana, sans-serif;\n  text-align: left;\n  color-scheme: dark;\n}\n\nhtml body #r34g-modal.r34g-open {\n  display: flex;\n}\n\nhtml body #r34g-modal .r34g-dialog {\n  display: flex;\n  flex-direction: column;\n  width: min(880px, 100%);\n  max-height: min(84vh, 780px);\n  background: var(--r34g-bg-alt);\n  border: 1px solid var(--c-bg-highlight, #505a50);\n  border-radius: 10px;\n  box-shadow: var(--r34g-shadow);\n  color: var(--r34g-text);\n  font-size: 12.8px;\n  overflow: hidden;\n}\n\nhtml body #r34g-modal .r34g-head {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  padding: 10px 14px 0;\n  border-bottom: 1px solid var(--r34g-line);\n  background: linear-gradient(#2d362d, var(--r34g-bg-alt));\n}\n\nhtml body #r34g-modal .r34g-title {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding-bottom: 9px;\n  color: var(--r34g-link);\n  font-family: Tahoma, verdana, sans-serif;\n  font-size: 13px;\n  font-weight: bold;\n  letter-spacing: .06em;\n  text-transform: uppercase;\n  white-space: nowrap;\n}\n\nhtml body #r34g-modal .r34g-tabs {\n  display: flex;\n  align-items: flex-end;\n  gap: 4px;\n  flex: 1;\n  overflow-x: auto;\n  scrollbar-width: none;\n}\n\nhtml body #r34g-modal .r34g-tabs::-webkit-scrollbar {\n  display: none;\n}\n\nhtml body #r34g-modal .r34g-tab {\n  padding: 7px 13px;\n  border: 1px solid transparent;\n  border-bottom: 0;\n  border-radius: 7px 7px 0 0;\n  background: transparent;\n  color: var(--r34g-link) !important;\n  font-family: verdana, sans-serif;\n  font-size: 12px;\n  white-space: nowrap;\n  cursor: pointer;\n  position: relative;\n  bottom: -1px;\n}\n\nhtml body #r34g-modal .r34g-tab:hover {\n  background: rgba(255, 255, 255, .045);\n  color: #dff0df !important;\n}\n\nhtml body #r34g-modal .r34g-tab.r34g-tab-active {\n  background: var(--r34g-bg);\n  border-color: var(--r34g-line);\n  border-bottom: 1px solid var(--r34g-bg);\n  color: #ffffff !important;\n}\n\nhtml body #r34g-modal .r34g-tab-short {\n  display: none;\n}\n\nhtml body #r34g-modal .r34g-close {\n  width: 30px;\n  height: 30px;\n  margin-bottom: 8px;\n  padding: 0;\n  border: 1px solid transparent;\n  border-radius: 6px;\n  background: transparent;\n  color: var(--r34g-text-soft) !important;\n  font-size: 17px;\n  line-height: 1;\n  cursor: pointer;\n}\n\nhtml body #r34g-modal .r34g-close:hover {\n  background: rgba(217, 83, 79, .16);\n  border-color: rgba(217, 83, 79, .5);\n  color: #ff9a96 !important;\n}\n\nhtml body #r34g-modal .r34g-body {\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  padding: 14px 16px;\n  background: var(--r34g-bg);\n  scrollbar-width: thin;\n  scrollbar-color: #4b564b rgba(0, 0, 0, .25);\n}\n\nhtml body #r34g-modal .r34g-body::-webkit-scrollbar {\n  width: 10px;\n}\n\nhtml body #r34g-modal .r34g-body::-webkit-scrollbar-thumb {\n  background: #4b564b;\n  border-radius: 6px;\n}\n\nhtml body #r34g-modal .r34g-panel {\n  display: none;\n}\n\nhtml body #r34g-modal .r34g-panel.r34g-panel-active {\n  display: block;\n}\n\nhtml body #r34g-modal .r34g-foot {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 14px;\n  border-top: 1px solid var(--r34g-line);\n  background: var(--r34g-bg-alt);\n}\n\nhtml body #r34g-modal .r34g-foot .r34g-spacer {\n  flex: 1;\n}\n\nhtml body #r34g-modal .r34g-foot button,\nhtml body #r34g-modal .r34g-btn {\n  padding: 6px 14px;\n  border: 1px solid var(--c-bg-highlight, #505a50);\n  border-radius: 6px;\n  background: #333d33;\n  color: var(--r34g-text) !important;\n  font-family: verdana, sans-serif;\n  font-size: 12px;\n  cursor: pointer;\n  transition: background .15s ease, border-color .15s ease, color .15s ease;\n}\n\nhtml body #r34g-modal .r34g-foot button:hover,\nhtml body #r34g-modal .r34g-btn:hover {\n  border-color: var(--r34g-accent);\n  color: #eafaea !important;\n}\n\nhtml body #r34g-modal #ibenhancerSettingsSave {\n  background: var(--r34g-accent);\n  border-color: var(--r34g-accent);\n  color: var(--r34g-bg) !important;\n  font-weight: bold;\n}\n\nhtml body #r34g-modal #ibenhancerSettingsSave:hover {\n  background: var(--c-link, #b0e0b0);\n  color: #22301f !important;\n}\n\nhtml body #r34g-modal .r34g-section {\n  margin: 0 0 16px;\n}\n\nhtml body #r34g-modal .r34g-section > h6 {\n  margin: 0 0 4px;\n  padding-bottom: 5px;\n  border-bottom: 1px solid var(--r34g-line);\n  color: var(--r34g-link);\n  font-family: Tahoma, verdana, sans-serif;\n  font-size: 11.5px;\n  font-weight: bold;\n  letter-spacing: .09em;\n  text-transform: uppercase;\n}\n\nhtml body #r34g-modal .r34g-hint {\n  margin: 2px 0 8px;\n  color: var(--r34g-text-soft);\n  font-size: 11px;\n  line-height: 1.5;\n}\n\nhtml body #r34g-modal .r34g-row {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  min-height: 30px;\n  padding: 3px 2px;\n  border-bottom: 1px dashed rgba(255, 255, 255, .055);\n}\n\nhtml body #r34g-modal .r34g-row:last-child {\n  border-bottom: 0;\n}\n\nhtml body #r34g-modal .r34g-row > .r34g-label {\n  flex: 1;\n  min-width: 0;\n  line-height: 1.45;\n  color: var(--r34g-text);\n}\n\nhtml body #r34g-modal .r34g-row > .r34g-value {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  flex: 0 0 auto;\n}\n\nhtml body #r34g-modal .r34g-row > .r34g-value label {\n  display: inline-flex !important;\n  align-items: center;\n  gap: 6px;\n}\n\nhtml.r34g-modal-open {\n  overflow: hidden !important;\n}\n\nhtml body #r34g-modal .r34g-row .r34g-note {\n  display: block;\n  color: var(--r34g-text-soft);\n  font-size: 10.5px;\n}\n\nhtml body #r34g-modal .r34g-seg {\n  display: inline-flex;\n  gap: 3px;\n  padding: 2px;\n  border: 1px solid var(--r34g-line);\n  border-radius: 7px;\n  background: var(--r34g-bg-deep);\n}\n\nhtml body #r34g-modal .r34g-seg button {\n  padding: 4px 10px;\n  border: 0;\n  border-radius: 5px;\n  background: transparent;\n  color: var(--r34g-text-soft) !important;\n  font-family: verdana, sans-serif;\n  font-size: 11.5px;\n  cursor: pointer;\n}\n\nhtml body #r34g-modal .r34g-seg button:hover {\n  color: #eafaea !important;\n}\n\nhtml body #r34g-modal .r34g-seg button.r34g-on {\n  background: var(--r34g-accent);\n  color: #22301f !important;\n  font-weight: bold;\n}\n\nhtml body .r34g-switch {\n  position: relative;\n  display: inline-block;\n  flex: 0 0 auto;\n  width: 40px;\n  height: 20px;\n  vertical-align: middle;\n}\n\nhtml body .r34g-switch > input {\n  position: absolute;\n  inset: 0;\n  width: 100% !important;\n  height: 100% !important;\n  margin: 0 !important;\n  opacity: 0 !important;\n  cursor: pointer;\n  z-index: 2;\n}\n\nhtml body .r34g-switch > .r34g-slider {\n  position: absolute;\n  inset: 0;\n  border: 1px solid var(--r34g-line);\n  border-radius: 999px;\n  background: #3b453b;\n  transition: background .2s ease, border-color .2s ease;\n}\n\nhtml body .r34g-switch > .r34g-slider::before {\n  content: \"\";\n  position: absolute;\n  top: 2px;\n  left: 2px;\n  width: 14px;\n  height: 14px;\n  border-radius: 50%;\n  background: #c9cfc9;\n  transition: transform .2s ease, background .2s ease;\n}\n\nhtml body .r34g-switch > input:checked + .r34g-slider {\n  background: var(--r34g-accent);\n  border-color: var(--r34g-accent);\n}\n\nhtml body .r34g-switch > input:checked + .r34g-slider::before {\n  transform: translateX(20px);\n  background: #f4fff4;\n}\n\nhtml body .r34g-switch > input:focus-visible + .r34g-slider {\n  box-shadow: 0 0 0 2px rgba(147, 179, 147, .45);\n}\n\nhtml body #r34g-modal #ibenhancerSettings-options {\n  overflow: visible !important;\n  width: auto !important;\n  height: auto !important;\n}\n\nhtml body #r34g-modal #ibenhancerSettings-options > .r34g-moved,\nhtml body #r34g-modal #ibenhancerSettings-options > br {\n  display: none !important;\n}\n\nhtml body #r34g-modal #ibenhancerSettings-options label {\n  white-space: normal !important;\n  display: flex !important;\n  align-items: center;\n  gap: 10px;\n  width: 100%;\n  line-height: 1.45;\n}\n\nhtml body #r34g-modal #ibenhancerSettings input[type=\"checkbox\"] {\n  flex: 0 0 auto;\n  margin: 0 !important;\n  width: auto !important;\n}\n\nhtml body #r34g-modal #ibenhancerSettings input[type=\"number\"],\nhtml body #r34g-modal #ibenhancerSettings select {\n  margin: 0 !important;\n  padding: 3px 5px !important;\n  border: 1px solid var(--c-bg-highlight, #505a50) !important;\n  border-radius: 5px !important;\n  background: var(--r34g-bg-deep) !important;\n  color: var(--r34g-text) !important;\n  font-family: verdana, sans-serif !important;\n  font-size: 11.5px !important;\n}\n\nhtml body #r34g-modal #ibenhancerSettings button {\n  padding: 4px 9px !important;\n  margin: 0 !important;\n  border: 1px solid var(--c-bg-highlight, #505a50) !important;\n  border-radius: 5px !important;\n  background: #333d33 !important;\n  color: var(--r34g-text) !important;\n  font-family: verdana, sans-serif !important;\n  font-size: 11.5px !important;\n  cursor: pointer;\n}\n\nhtml body #r34g-modal #ibenhancerSettings button:hover {\n  border-color: var(--r34g-accent) !important;\n  color: #eafaea !important;\n}\n\nhtml body #r34g-modal #ibenhancerSettings .tooltip-140 {\n  position: relative;\n}\n\nhtml body #r34g-modal #r34g-icon-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(168px, 1fr));\n  gap: 1px 14px;\n  margin-top: 6px;\n  padding: 8px 10px;\n  border: 1px solid var(--r34g-line);\n  border-radius: 7px;\n  background: rgba(0, 0, 0, .16);\n}\n\nhtml body #r34g-modal #r34g-icon-grid label {\n  display: flex !important;\n  align-items: center;\n  gap: 8px;\n  padding: 1px 0;\n  font-size: 11.5px !important;\n}\n\nhtml body #r34g-modal #r34g-icon-grid .r34g-icon-text {\n  flex: 1;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\nhtml body #r34g-modal #r34g-icon-grid .r34g-switch {\n  width: 34px;\n  height: 17px;\n}\n\nhtml body #r34g-modal #r34g-icon-grid .r34g-switch > .r34g-slider::before {\n  width: 11px;\n  height: 11px;\n}\n\nhtml body #r34g-modal #r34g-icon-grid .r34g-switch > input:checked + .r34g-slider::before {\n  transform: translateX(17px);\n}\n\nhtml body #r34g-modal #r34g-actions-row {\n  gap: 6px;\n}\n\nhtml body #r34g-modal #ibenhancer-favorite-tags,\nhtml body #r34g-modal #ibenhancer-changelog {\n  background: transparent !important;\n  border: 0 !important;\n  padding: 0 !important;\n  width: auto !important;\n  color: var(--r34g-text) !important;\n  font-family: verdana, sans-serif !important;\n  font-size: 12.8px !important;\n}\n\nhtml body #r34g-modal #ibenhancer-favorite-tags *,\nhtml body #r34g-modal #ibenhancer-changelog * {\n  color: var(--r34g-text) !important;\n  font-size: 12px !important;\n}\n\nhtml body #r34g-modal #ibenhancer-changelog-updates > div,\nhtml body #r34g-modal #ibenhancer-changelog > div {\n  border-bottom: 1px dashed rgba(255, 255, 255, .07);\n  padding: 5px 0;\n  line-height: 1.5;\n}\n\nhtml body #r34g-modal #ibenhancer-changelog > div:first-child,\nhtml body #r34g-modal #ibenhancer-changelog > a {\n  color: var(--r34g-link) !important;\n  font-weight: bold;\n}\n\nhtml body #r34g-sidebar-favs {\n  margin-top: 10px;\n  padding-top: 9px;\n  border-top: 1px solid var(--r34g-line);\n}\n\nhtml body #ibenhancer {\n  display: block;\n}\n\nhtml.r34g-integrated body #ibenhancer {\n  display: none !important;\n}\n\nhtml body #ibenhancerSettings-blocker {\n  display: none !important;\n}\n\nhtml.r34g-integrated body #ibenhancerSettings.show {\n  display: none !important;\n}\n\n@media (max-width: 900px) {\n  html body #r34g-sidebar-toggle {\n    display: inline-flex;\n  }\n\n  html body #r34g-drawer-head {\n    display: flex;\n  }\n\n  html {\n    --r34g-gap: 10px;\n  }\n\n  html body .sidebar {\n    position: fixed !important;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    width: min(320px, 88vw) !important;\n    min-width: 0 !important;\n    max-width: none !important;\n    max-height: none !important;\n    padding: 12px 12px 24px;\n    background: var(--r34g-bg-alt);\n    border-right: 1px solid var(--c-bg-highlight, #505a50);\n    box-shadow: 12px 0 32px rgba(0, 0, 0, .5);\n    transform: translateX(-102%);\n    transition: transform .24s ease;\n    z-index: calc(var(--r34g-z) - 4);\n    overflow-y: auto;\n  }\n\n  html.r34g-drawer-open body .sidebar {\n    transform: none;\n  }\n\n  html.r34g-drawer-open body #r34g-drawer-backdrop {\n    display: block;\n  }\n\n  html body #post-list > .content {\n    flex: 1 1 100% !important;\n    margin: 0 !important;\n  }\n}\n\n@media (max-width: 620px) {\n  html body #r34g-modal .r34g-head {\n    flex-wrap: wrap;\n    gap: 6px 10px;\n    padding: 9px 12px 0;\n  }\n\n  html body #r34g-modal .r34g-title {\n    padding-bottom: 0;\n  }\n\n  html body #r34g-modal .r34g-tabs {\n    order: 3;\n    flex: 1 1 100%;\n    flex-wrap: wrap;\n    overflow-x: visible;\n    gap: 4px 6px;\n    padding-bottom: 0;\n  }\n\n  html body #r34g-modal .r34g-tab {\n    padding: 6px 10px;\n    font-size: 11.5px;\n  }\n\n  html body #r34g-modal .r34g-tab-long {\n    display: none;\n  }\n\n  html body #r34g-modal .r34g-tab-short {\n    display: inline;\n  }\n\n  html body #r34g-modal .r34g-close {\n    margin-left: auto;\n    margin-bottom: 0;\n  }\n\n  html body #r34g-modal .r34g-body {\n    padding: 12px 12px;\n  }\n\n  html body #r34g-modal .r34g-row {\n    flex-wrap: wrap;\n    row-gap: 4px;\n    padding: 5px 2px;\n  }\n\n  html body #r34g-modal .r34g-row > .r34g-seg {\n    flex: 1 1 100%;\n    justify-content: space-between;\n  }\n\n  html body #r34g-modal .r34g-foot {\n    flex-wrap: wrap;\n    gap: 6px;\n  }\n\n  html body #r34g-modal .r34g-foot #r34g-reset {\n    flex: 1 1 100%;\n    text-align: center;\n  }\n\n  html body #r34g-modal .r34g-foot .r34g-spacer {\n    display: none;\n  }\n\n  html body #r34g-modal #r34g-icon-grid {\n    grid-template-columns: 1fr;\n  }\n\n  html body #r34g-modal .r34g-dialog {\n    max-height: 90vh;\n  }\n  html {\n    --r34g-gap: 8px;\n    --r34g-radius: 6px;\n  }\n\n  html[data-r34g-cols] {\n    --r34g-cols: 3;\n  }\n\n  html body #post-list {\n    padding: 0 8px !important;\n  }\n\n  html body #paginator .pagination {\n    gap: 3px;\n    padding: 6px;\n  }\n\n  html body #paginator .pagination a,\n  html body #paginator .pagination b,\n  html body #paginator .pagination span {\n    min-width: 24px;\n    height: 24px;\n    padding: 0 6px !important;\n  }\n\n  html body #r34g-modal .r34g-dialog {\n    max-height: 90vh;\n  }\n\n  html body #r34g-modal .r34g-title span.r34g-title-text {\n    display: none;\n  }\n}\n\nhtml body .image-list .thumb .r34g-seen-badge {\n  position: absolute;\n  top: 7px;\n  right: 7px;\n  z-index: 4;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 24px;\n  height: 24px;\n  border-radius: 50%;\n  background: rgba(6, 12, 6, .74);\n  border: 1px solid rgba(147, 179, 147, .55);\n  color: #d9f4d9;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, .5);\n}\n\nhtml body .image-list .thumb .r34g-seen-badge svg {\n  width: 15px;\n  height: 15px;\n}\n\nhtml body .image-list .thumb.r34g-seen > a::before {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n  pointer-events: none;\n  box-shadow: inset 0 0 0 2px rgba(147, 179, 147, .5);\n  border-radius: var(--r34g-radius);\n}\n\nhtml[data-r34g-seen=\"off\"] body .image-list .thumb .r34g-seen-badge {\n  display: none !important;\n}\n\nhtml[data-r34g-seendim=\"on\"] body .image-list .thumb.r34g-seen img {\n  filter: grayscale(.5) brightness(.6) !important;\n}\n\nhtml[data-r34g-seendim=\"on\"] body .image-list .thumb.r34g-seen:hover img {\n  filter: grayscale(.15) brightness(.92) !important;\n}\n\nhtml body #r34g-toasts {\n  position: fixed;\n  left: 50%;\n  bottom: 22px;\n  transform: translateX(-50%);\n  z-index: 2147482100;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  align-items: center;\n  pointer-events: none;\n}\n\nhtml body .r34g-toast {\n  max-width: 460px;\n  padding: 8px 14px;\n  border: 1px solid var(--c-bg-highlight, #505a50);\n  border-radius: 7px;\n  background: rgba(24, 32, 24, .96);\n  color: #d8e6d8;\n  font: 12px/1.45 verdana, sans-serif;\n  box-shadow: 0 10px 30px rgba(0, 0, 0, .6);\n  transition: opacity .28s ease, transform .28s ease;\n}\n\nhtml body .r34g-toast.r34g-toast-out {\n  opacity: 0;\n  transform: translateY(6px);\n}\n\nhtml body .r34g-search {\n  margin: 0 0 12px;\n}\n\nhtml body .r34g-search input {\n  width: 100%;\n  box-sizing: border-box;\n  padding: 6px 9px;\n  border: 1px solid var(--r34g-line);\n  border-radius: 6px;\n  background: var(--r34g-bg-deep);\n  color: var(--r34g-text);\n  font: 12px verdana, sans-serif;\n  outline: none;\n}\n\nhtml body .r34g-search input:focus {\n  border-color: var(--r34g-accent);\n}\n\nhtml body #r34g-modal .r34g-mini,\nhtml body #r34g-tags-panel .r34g-mini {\n  padding: 4px 10px;\n  border: 1px solid var(--r34g-line);\n  border-radius: 6px;\n  background: #333d33;\n  color: var(--r34g-link) !important;\n  font: 11.5px verdana, sans-serif;\n  cursor: pointer;\n}\n\nhtml body #r34g-modal .r34g-mini:hover,\nhtml body #r34g-tags-panel .r34g-mini:hover {\n  border-color: var(--r34g-accent);\n  color: #eafaea !important;\n}\n\nhtml body .r34g-mini-row {\n  display: inline-flex;\n  gap: 6px;\n  flex-wrap: wrap;\n  align-items: center;\n}\n\nhtml body #r34g-modal .r34g-num,\nhtml body #r34g-modal .r34g-text,\nhtml body #r34g-modal .r34g-select,\nhtml body #r34g-modal .r34g-textarea {\n  box-sizing: border-box;\n  padding: 3px 6px;\n  border: 1px solid var(--r34g-line);\n  border-radius: 5px;\n  background: var(--r34g-bg-deep);\n  color: var(--r34g-text);\n  font: 11.5px verdana, sans-serif;\n  outline: none;\n}\n\nhtml body #r34g-modal .r34g-num:focus,\nhtml body #r34g-modal .r34g-text:focus,\nhtml body #r34g-modal .r34g-select:focus,\nhtml body #r34g-modal .r34g-textarea:focus {\n  border-color: var(--r34g-accent);\n}\n\nhtml body #r34g-modal .r34g-text {\n  width: 100%;\n  min-width: 180px;\n}\n\nhtml body #r34g-modal .r34g-textarea {\n  width: 100%;\n  min-height: 66px;\n  resize: vertical;\n  line-height: 1.45;\n}\n\nhtml body #r34g-modal .r34g-mono {\n  font-family: monospace, monospace;\n}\n\nhtml body #r34g-modal .r34g-value-wide {\n  flex: 0 1 56%;\n  max-width: 56%;\n}\n\nhtml body #r34g-modal .r34g-stack {\n  display: block;\n}\n\nhtml body #r34g-modal .r34g-row.r34g-filtered-out,\nhtml body #r34g-modal #r34g-icon-grid label.r34g-filtered-out,\nhtml body #r34g-modal .r34g-section.r34g-filtered-out {\n  display: none !important;\n}\n\nhtml body #r34g-modal .r34g-section.r34g-collapsed {\n  display: none !important;\n}\n\nhtml body #r34g-modal .r34g-enh-sticky {\n  position: sticky;\n  top: -14px;\n  z-index: 3;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n  margin: -14px -16px 14px;\n  padding: 10px 16px;\n  background: var(--r34g-bg-alt);\n  border-bottom: 1px solid var(--r34g-line);\n}\n\nhtml body #r34g-modal .r34g-enh-sticky .r34g-note {\n  flex: 1 1 220px;\n}\n\nhtml body #r34g-modal .r34g-notes {\n  margin: 4px 0 0;\n  padding-left: 18px;\n  color: var(--r34g-text);\n  font-size: 12px;\n  line-height: 1.6;\n}\n\nhtml body #r34g-modal .r34g-notes li {\n  margin-bottom: 3px;\n}\n\nhtml body #r34g-modal .r34g-panel-actions {\n  display: inline-flex;\n  gap: 6px;\n  align-items: center;\n}\n\nhtml body .r34g-vhost {\n  flex: 1 1 auto !important;\n  width: auto !important;\n  min-width: 0 !important;\n  max-width: none !important;\n}\n\nhtml body #gelcomVideoContainer,\nhtml body .r34g-vwrap {\n  position: relative !important;\n  width: 100% !important;\n  max-width: var(--r34g-vwidth) !important;\n  margin: 0 auto !important;\n  background: #000;\n  overflow: hidden;\n}\n\nhtml[data-r34g-vbg=\"ninguno\"] body #gelcomVideoContainer,\nhtml[data-r34g-vbg=\"ninguno\"] body .r34g-vwrap {\n  background: transparent;\n}\n\nhtml[data-r34g-vradius=\"on\"] body #gelcomVideoContainer,\nhtml[data-r34g-vradius=\"on\"] body .r34g-vwrap {\n  border-radius: 10px;\n}\n\nhtml[data-r34g-vshadow=\"on\"] body #gelcomVideoContainer,\nhtml[data-r34g-vshadow=\"on\"] body .r34g-vwrap {\n  box-shadow: 0 14px 40px rgba(0, 0, 0, .55);\n}\n\nhtml[data-r34g-vcinema=\"on\"] body::before {\n  content: \"\";\n  position: fixed;\n  inset: 0;\n  z-index: 60;\n  background: rgba(0, 0, 0, .84);\n}\n\nhtml[data-r34g-vcinema=\"on\"] body #gelcomVideoContainer,\nhtml[data-r34g-vcinema=\"on\"] body .r34g-vwrap {\n  z-index: 61 !important;\n}\n\nhtml body .r34g-vwrap .r34g-vbackdrop {\n  position: absolute;\n  inset: -30px;\n  z-index: 0;\n  background-size: cover;\n  background-position: center;\n  filter: blur(26px) brightness(.45) saturate(1.25);\n  opacity: .9;\n  pointer-events: none;\n}\n\nhtml body .r34g-vwrap video,\nhtml body #gelcomVideoPlayer {\n  position: relative;\n  z-index: 1;\n  display: block !important;\n  width: 100% !important;\n  height: auto !important;\n  max-height: 84vh !important;\n  margin: 0 auto !important;\n  background: #000;\n  object-fit: contain;\n}\n\nhtml[data-r34g-vfit=\"cover\"] body .r34g-vwrap video {\n  object-fit: cover !important;\n}\n\nhtml[data-r34g-vfit=\"contain\"] body .r34g-vwrap video {\n  object-fit: contain !important;\n}\n\nhtml body .r34g-vbar {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 6;\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n  padding: 26px 10px 7px;\n  background: linear-gradient(to top, rgba(0, 0, 0, .88) 0%, rgba(0, 0, 0, .5) 55%, rgba(0, 0, 0, 0) 100%);\n  color: #ececec;\n  font-family: verdana, sans-serif;\n  transition: opacity .25s ease;\n}\n\nhtml body .r34g-vbar.r34g-idle {\n  opacity: 0;\n}\n\nhtml body .r34g-vbar:hover {\n  opacity: 1 !important;\n}\n\nhtml body .r34g-vbar-top {\n  display: flex;\n  align-items: center;\n}\n\nhtml body .r34g-vbar input[type=\"range\"] {\n  width: 100%;\n  height: 16px;\n  margin: 0;\n  padding: 0;\n  accent-color: var(--r34g-accent);\n  cursor: pointer;\n  background: transparent;\n}\n\nhtml body .r34g-vbar .r34g-vvolume {\n  width: 74px;\n}\n\nhtml body .r34g-vbar-bottom {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n\nhtml body .r34g-vbar .r34g-vgrow {\n  flex: 1;\n}\n\nhtml body .r34g-vbar-main {\n  display: flex;\n  align-items: center;\n  gap: 3px;\n}\n\nhtml body .r34g-vbar .r34g-vbtn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 28px;\n  height: 28px;\n  padding: 0;\n  border: 1px solid transparent;\n  border-radius: 6px;\n  background: transparent;\n  color: #e4e4e4 !important;\n  font: bold 11.5px/1 verdana, sans-serif;\n  cursor: pointer;\n  transition: background .15s ease, border-color .15s ease, color .15s ease;\n}\n\nhtml body .r34g-vbar .r34g-vbtn svg {\n  width: 16px;\n  height: 16px;\n}\n\nhtml body .r34g-vbar .r34g-vbtn:hover {\n  background: rgba(255, 255, 255, .12);\n  border-color: rgba(147, 179, 147, .55);\n  color: #fff !important;\n}\n\nhtml body .r34g-vbar .r34g-vbtn.r34g-on {\n  color: var(--r34g-accent) !important;\n  border-color: rgba(147, 179, 147, .55);\n}\n\nhtml body .r34g-vbar .r34g-vspeed {\n  width: auto;\n  min-width: 42px;\n  padding: 0 7px;\n}\n\nhtml body .r34g-vbar .r34g-vtime {\n  font-size: 11.5px;\n  line-height: 1;\n  min-width: 96px;\n  color: #dcdcdc;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, .8);\n}\n\nhtml body .r34g-vbar .r34g-vvol {\n  display: flex;\n  align-items: center;\n  gap: 2px;\n}\n\nhtml.r34g-vbar-on .fluid_controls_container,\nhtml.r34g-vbar-on .fluid_video_wrapper > .fluid_controls_container,\nhtml.r34g-vbar-on .fluid_control_video,\nhtml.r34g-vbar-on .video-js .vjs-control-bar {\n  display: none !important;\n}\n\nhtml.r34g-vbar-on .fluid_video_wrapper .fluid_control_play_button,\nhtml.r34g-vbar-on .fluid_video_wrapper .fluid_control_duration,\nhtml.r34g-vbar-on .fluid_video_wrapper .fluid_control_theatre,\nhtml.r34g-vbar-on .fluid_video_wrapper .fluid_control_playback_rate,\nhtml.r34g-vbar-on .fluid_video_wrapper .fluid_control_fullscreen,\nhtml.r34g-vbar-on .fluid_video_wrapper .fluid_control_video_volume,\nhtml.r34g-vbar-on .fluid_video_wrapper .fluid_control_download,\nhtml.r34g-vbar-on .fluid_video_wrapper .fluid_control_card,\nhtml.r34g-vbar-on .fluid_video_wrapper .fluid_control_vast_skip {\n  display: none !important;\n}\n\nhtml body #r34g-tags-panel {\n  box-sizing: border-box;\n  max-width: var(--r34g-vwidth);\n  margin: 14px auto;\n  padding: 10px 12px;\n  background: var(--r34g-bg-alt);\n  border: 1px solid var(--r34g-line);\n  border-radius: 10px;\n  color: var(--r34g-text);\n  font-family: verdana, sans-serif;\n  font-size: 12px;\n  text-align: left;\n}\n\nhtml body #r34g-tags-panel .r34g-tp-launch {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n\nhtml body #r34g-tags-panel .r34g-tp-toggle {\n  flex: 1 1 220px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 8px;\n  padding: 2px 0;\n  border: 0;\n  background: transparent;\n  color: var(--r34g-link) !important;\n  font: bold 13px verdana, sans-serif;\n  cursor: pointer;\n}\n\nhtml body #r34g-tags-panel .r34g-tp-toggle svg {\n  width: 16px;\n  height: 16px;\n}\n\nhtml body #r34g-tags-panel .r34g-tp-head {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  flex-wrap: wrap;\n  margin: 8px 0;\n  padding-bottom: 7px;\n  border-bottom: 1px solid var(--r34g-line);\n}\n\nhtml body #r34g-tags-panel .r34g-tp-head b {\n  color: var(--r34g-link);\n  font-family: Tahoma, verdana, sans-serif;\n  font-size: 12px;\n  letter-spacing: .06em;\n  text-transform: uppercase;\n}\n\nhtml body #r34g-tags-panel .r34g-tp-count {\n  flex: 1;\n}\n\nhtml body #r34g-tags-panel .r34g-tp-group {\n  margin-bottom: 9px;\n}\n\nhtml body #r34g-tags-panel .r34g-tp-group-head {\n  display: flex;\n  align-items: baseline;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n\nhtml body #r34g-tags-panel .r34g-tp-group-head b {\n  color: #dff0df;\n  font-size: 12px;\n}\n\nhtml body #r34g-tags-panel .r34g-chips {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 5px;\n  margin-top: 5px;\n  min-width: 0;\n}\n\nhtml body .r34g-chip {\n  display: inline-flex;\n  align-items: center;\n  gap: 5px;\n  max-width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n  padding: 3px 9px;\n  border: 1px solid var(--r34g-line);\n  border-radius: 999px;\n  background: var(--r34g-bg-deep);\n  color: var(--r34g-text) !important;\n  font: 11.5px/1.4 verdana, sans-serif;\n  cursor: pointer;\n  transition: border-color .15s ease, opacity .15s ease, background .15s ease;\n}\n\nhtml body .r34g-chip .r34g-chip-name {\n  overflow-wrap: anywhere;\n}\n\nhtml body .r34g-chip:hover {\n  border-color: var(--r34g-accent);\n  background: #364236;\n}\n\nhtml body .r34g-chip.r34g-chip-off {\n  opacity: .66;\n  border-color: rgba(217, 83, 79, .55);\n}\n\nhtml body .r34g-chip.r34g-chip-off .r34g-chip-name {\n  text-decoration: line-through;\n  color: #ffb3ae;\n}\n\nhtml body .r34g-chip .r34g-chip-count {\n  color: var(--r34g-text-soft);\n  font-size: 9.5px;\n}\n\nhtml body #r34g-tags-panel .r34g-tp-outputwrap {\n  margin: 10px 0 0;\n}\n\nhtml body #r34g-tags-panel .r34g-tp-output {\n  width: 100%;\n  box-sizing: border-box;\n  min-height: 58px;\n  padding: 7px 9px;\n  border: 1px solid var(--r34g-line);\n  border-radius: 6px;\n  background: var(--r34g-bg-deep);\n  color: #cfe8cf;\n  font: 12px/1.5 monospace, monospace;\n  resize: vertical;\n}\n\nhtml body #r34g-tags-panel .r34g-hint,\nhtml body .r34g-hint {\n  color: var(--r34g-text-soft);\n}\n\nhtml body #r34g-tags-panel .r34g-tp-status {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-top: 8px;\n  color: var(--r34g-text-soft);\n  font-size: 11.5px;\n}\n\nhtml body .r34g-spinner {\n  width: 14px;\n  height: 14px;\n  border: 2px solid rgba(255, 255, 255, .25);\n  border-top-color: var(--r34g-accent);\n  border-radius: 50%;\n  animation: r34g-spin .8s linear infinite;\n}\n\nhtml body #r34g-tags-panel .r34g-rel {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: wrap;\n  padding: 3px 0;\n  border-bottom: 1px dashed rgba(255, 255, 255, .06);\n}\n\nhtml body #r34g-tags-panel .r34g-rel:last-child {\n  border-bottom: 0;\n}\n\nhtml body #r34g-tags-panel .r34g-rel-text {\n  flex: 1 1 240px;\n  color: #cfd8cf;\n  font-size: 11.5px;\n}\n\n@keyframes r34g-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n\n/* API de rule34: diagnóstico en Ajustes → Etiquetas */\n.r34g-probe {\n  margin: 8px 0 0;\n  padding: 8px 10px;\n  background: rgba(0, 0, 0, .18);\n  border: 1px solid var(--r34g-line);\n  border-radius: 6px;\n  color: var(--r34g-text-soft);\n  font-size: 11.5px;\n  text-align: left;\n}\n\n.r34g-probe:empty {\n  display: none;\n}\n\n.r34g-probe-line + .r34g-probe-line {\n  margin-top: 4px;\n}\n\n.r34g-probe-line b {\n  color: var(--r34g-accent);\n}\n\n.r34g-probe-bad b {\n  color: #d98b7f;\n}\n\n/* Sugerencias de etiquetas (API) bajo el buscador del panel lateral */\nhtml body #r34g-tag-filter + .r34g-suggest {\n  display: block;\n}\n\nhtml body .r34g-suggest {\n  position: relative;\n  z-index: 30;\n  margin: 4px 0 6px;\n  max-height: 224px;\n  overflow-y: auto;\n  background: var(--r34g-bg-deep);\n  border: 1px solid var(--r34g-line);\n  border-radius: 6px;\n  box-shadow: 0 10px 26px rgba(0, 0, 0, .45);\n  text-align: left;\n}\n\nhtml body .r34g-suggest[hidden] {\n  display: none !important;\n}\n\nhtml body .r34g-suggest-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  width: 100%;\n  padding: 4px 8px;\n  border: 0;\n  border-bottom: 1px solid rgba(255, 255, 255, .04);\n  background: transparent;\n  color: var(--r34g-text);\n  font: 11.5px verdana, sans-serif;\n  text-align: left;\n  cursor: pointer;\n}\n\nhtml body .r34g-suggest-row:last-child {\n  border-bottom: 0;\n}\n\nhtml body .r34g-suggest-row:hover {\n  background: var(--r34g-card-hover);\n  color: #eaf6ea;\n}\n\nhtml body .r34g-suggest-name {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\nhtml body .r34g-suggest-count {\n  flex: 0 0 auto;\n  color: var(--r34g-text-soft);\n  font-size: 10.5px;\n}\n\n/* ---- Botón flotante de Ajustes: siempre accesible (clave de rule34, IA, opciones) ---- */\nhtml body #r34g-fab {\n  position: fixed !important;\n  right: 18px !important;\n  bottom: 18px !important;\n  z-index: calc(var(--r34g-z) - 4) !important;\n  display: inline-flex !important;\n  align-items: center;\n  gap: 7px;\n  margin: 0 !important;\n  padding: 9px 14px 9px 12px !important;\n  border: 1px solid var(--r34g-accent) !important;\n  border-radius: 999px !important;\n  background: linear-gradient(#3a463a, #2c362c) !important;\n  color: var(--r34g-link) !important;\n  font: bold 12.5px verdana, sans-serif !important;\n  cursor: pointer;\n  box-shadow: 0 8px 22px rgba(0, 0, 0, .5);\n  opacity: .92;\n  transition: opacity .15s, transform .15s;\n}\nhtml body #r34g-fab:hover {\n  opacity: 1;\n  transform: translateY(-1px);\n}\nhtml body #r34g-fab svg {\n  width: 14px;\n  height: 14px;\n  fill: currentColor;\n}\nhtml[data-r34g-fab=\"off\"] #r34g-fab {\n  display: none !important;\n}\nhtml.r34g-modal-open #r34g-fab {\n  display: none !important;\n}\n";
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

  R.VERSION = "0.2.8";
  R.NAME = "Rule34 Gallery Suite";

  var SETTINGS_KEY = "r34g.settings.v2";
  var SEEN_KEY = "r34g.seen.v1";
  var SEEN_LIMIT = 20000;

  R.DEFAULTS = {
    cols: "5",
    aspect: "1",
    fit: "cover",
    score: true,
    badges: true,
    hover: true,
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
  var settings = Object.assign({}, R.DEFAULTS, stored);
  R.settings = settings;
  writeJSON(SETTINGS_KEY, settings);

  R.saveSettings = function () {
    writeJSON(SETTINGS_KEY, settings);
  };

  R.applySettings = function () {
    var h = document.documentElement;
    h.setAttribute("data-r34g-cols", String(settings.cols));
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
    bolt: "M11 2 4 14h6l-1 8 7-12h-6z"
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
    var ORDER = ["gallery", "video", "tags", "enhancer", "changelog"];
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
    var grid = ui.section(panel, "Cuadr\u00edcula", "Cinco columnas con tarjetas cuadradas por defecto: lo que importa es ver la galer\u00eda, no la imagen completa. Cambia los valores si quieres otra cosa.");
    ui.seg({
      section: grid,
      key: "cols",
      title: "Columnas",
      note: "N\u00famero de miniaturas por fila.",
      options: [
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "5", value: "5" },
        { label: "6", value: "6" },
        { label: "7", value: "7" }
      ]
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

  // Proveedor de emergencia si el puente de Perchance no está disponible (generador privado,
  // renombrado o borrado): Pollinations, gratis y sin clave.
  var FALLBACK = { endpoint: "https://text.pollinations.ai/openai", model: "openai", key: "" };

  ai.request = function (messages) {
    if (typeof window.__r34gAIHook === "function") return Promise.resolve(window.__r34gAIHook(messages));
    var cfg = ai.config;
    if (cfg.provider === "perchance") {
      return bridgeAsk(messages).catch(function (err) {
        util.toast(
          "La IA de Perchance no respondi\u00f3 (" + ((err && err.message) || err) + "). Sigo con Pollinations, que no necesita clave."
        );
        return directAsk(FALLBACK, messages);
      });
    }
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
  if (!R || R.boot) return;
  R.boot = true;
  var util = R.util;
  var ui = R.ui;

  var NOTES = [
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

