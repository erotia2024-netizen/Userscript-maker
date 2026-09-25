// ==UserScript==
// @name         emochi.com
// @version      0.9.44
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
  var css = "/* =============================================================================================\n   emochi.com — el CSS del panel de roles (🎭). Todo vive bajo #em-root, así que no toca nada de la\n   web: ni sus clases, ni su Tailwind, ni su Chakra. El único cuidado es que su reset global\n   (`* { margin: 0; padding: 0; font: inherit }`) no se coma lo nuestro, así que aquí se declara\n   todo lo que hace falta, sin dar por hecho nada.\n   ============================================================================================= */\n#em-root {\n  --em-bg: #141416;\n  --em-bg2: #1d1d21;\n  --em-bg3: #26262c;\n  --em-line: #34343c;\n  --em-text: #f2f2f5;\n  --em-dim: #b8b8c4;\n  --em-accent: #f7c948;\n  --em-accent-ink: #241c03;\n  --em-bad: #ff6b6b;\n  --em-good: #5ad18a;\n  --em-radius: 14px;\n  color: var(--em-text);\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif;\n  font-size: 14px;\n  line-height: 1.45;\n  text-align: left;\n  box-sizing: border-box;\n}\n#em-root *,\n#em-root *::before,\n#em-root *::after {\n  box-sizing: border-box;\n  font-family: inherit;\n}\n\n/* --- el botón flotante (abajo a la izquierda: abajo a la derecha está su asistente) --------- */\n#em-fab {\n  position: fixed;\n  left: 18px;\n  bottom: 18px;\n  z-index: 2147483000;\n  width: 52px;\n  height: 52px;\n  border: 1px solid var(--em-line);\n  border-radius: 50%;\n  background: var(--em-bg);\n  color: var(--em-text);\n  font-size: 24px;\n  line-height: 1;\n  cursor: pointer;\n  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);\n  transition: transform 0.15s ease, box-shadow 0.15s ease;\n}\n#em-fab:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.55);\n}\n#em-fab[aria-expanded=\"true\"] {\n  background: var(--em-accent);\n  color: var(--em-accent-ink);\n  border-color: var(--em-accent);\n}\n\n/* --- el panel ------------------------------------------------------------------------------- */\n#em-panel {\n  position: fixed;\n  left: 18px;\n  top: 18px;\n  bottom: 84px;\n  z-index: 2147483000;\n  width: 400px;\n  max-width: calc(100vw - 36px);\n  display: flex;\n  flex-direction: column;\n  background: var(--em-bg);\n  border: 1px solid var(--em-line);\n  border-radius: var(--em-radius);\n  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);\n  overflow: hidden;\n}\n#em-panel[hidden] {\n  display: none;\n}\n#em-fab,\n#em-panel,\n#em-panel *,\n#em-dock,\n#em-dock * {\n  text-align: left;\n}\n#em-panel img {\n  max-width: 100%;\n}\n\n#em-root .em-head {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 12px 14px;\n  background: var(--em-bg2);\n  border-bottom: 1px solid var(--em-line);\n}\n#em-root .em-title {\n  font-size: 15px;\n  font-weight: 700;\n}\n#em-root .em-count {\n  font-size: 12px;\n  color: var(--em-dim);\n}\n#em-root .em-grow {\n  flex: 1 1 auto;\n}\n#em-root .em-icon {\n  background: transparent;\n  border: 0;\n  color: var(--em-dim);\n  font-size: 15px;\n  padding: 4px 6px;\n  border-radius: 8px;\n  cursor: pointer;\n}\n#em-root .em-icon:hover {\n  background: var(--em-bg3);\n  color: var(--em-text);\n}\n\n#em-root .em-body {\n  flex: 1 1 auto;\n  overflow-y: auto;\n  padding: 12px;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n#em-root .em-foot {\n  padding: 10px 12px;\n  border-top: 1px solid var(--em-line);\n  background: var(--em-bg2);\n  display: flex;\n  gap: 8px;\n}\n\n#em-root .em-msg {\n  margin: 10px 12px 0;\n  padding: 8px 10px;\n  border-radius: 10px;\n  background: rgba(90, 209, 138, 0.12);\n  border: 1px solid rgba(90, 209, 138, 0.35);\n  font-size: 13px;\n}\n#em-root .em-msg-bad {\n  background: rgba(255, 107, 107, 0.12);\n  border-color: rgba(255, 107, 107, 0.4);\n}\n\n#em-root .em-note {\n  background: var(--em-bg2);\n  border: 1px solid var(--em-line);\n  border-radius: 12px;\n  padding: 12px;\n  color: var(--em-dim);\n  font-size: 13px;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  align-items: flex-start;\n}\n#em-root .em-note-bad {\n  border-color: rgba(255, 107, 107, 0.4);\n  color: #ffd9d9;\n}\n#em-root .em-note-small {\n  padding: 8px 10px;\n  font-size: 12px;\n}\n\n/* --- el bot en el que estás ----------------------------------------------------------------- */\n#em-root .em-bot {\n  background: var(--em-bg2);\n  border: 1px solid var(--em-line);\n  border-radius: 12px;\n  padding: 10px 12px;\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n#em-root .em-bot-title {\n  font-size: 13px;\n  color: var(--em-dim);\n}\n#em-root .em-bot-title b {\n  color: var(--em-text);\n}\n#em-root .em-bot-note {\n  font-size: 12px;\n  color: var(--em-dim);\n}\n\n/* --- las tarjetas de rol -------------------------------------------------------------------- */\n#em-root .em-card {\n  background: var(--em-bg2);\n  border: 1px solid var(--em-line);\n  border-radius: 12px;\n  padding: 10px 12px;\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n#em-root .em-card-primary {\n  border-color: rgba(247, 201, 72, 0.55);\n  box-shadow: inset 3px 0 0 var(--em-accent);\n}\n#em-root .em-card-top {\n  display: flex;\n  gap: 10px;\n  align-items: center;\n}\n#em-root .em-avatar {\n  width: 42px;\n  height: 42px;\n  border-radius: 50%;\n  object-fit: cover;\n  flex: 0 0 auto;\n  background: var(--em-bg3);\n}\n#em-root .em-avatar-empty {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: 700;\n  color: var(--em-dim);\n}\n#em-root .em-card-head {\n  min-width: 0;\n}\n#em-root .em-name {\n  font-weight: 700;\n  font-size: 15px;\n}\n#em-root .em-meta {\n  font-size: 12px;\n  color: var(--em-dim);\n}\n#em-root .em-story {\n  font-size: 13px;\n  color: #e4e4ea;\n  margin: 0;\n  white-space: pre-wrap;\n}\n#em-root .em-chips {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n}\n#em-root .em-chip {\n  font-size: 11px;\n  padding: 2px 8px;\n  border-radius: 999px;\n  background: #2f2f36;\n  color: #cfcfd8;\n  border: 1px solid #43434d;\n}\n\n/* --- botones e inputs ----------------------------------------------------------------------- */\n#em-root .em-acts {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n}\n#em-root .em-acts-end {\n  justify-content: flex-end;\n  margin-top: 4px;\n}\n/* Los botones del formulario y del selector van pegados abajo, siempre a la vista. */\n#em-root .em-acts-sticky {\n  position: sticky;\n  bottom: 0;\n  z-index: 2;\n  margin-top: 8px;\n  padding: 8px 0 2px;\n  background: var(--em-bg);\n  border-top: 1px solid var(--em-line);\n}\n#em-root .em-btn {\n  font-size: 12.5px;\n  padding: 6px 10px;\n  border-radius: 9px;\n  border: 1px solid var(--em-line);\n  background: var(--em-bg3);\n  color: var(--em-text);\n  cursor: pointer;\n}\n#em-root .em-btn:hover {\n  border-color: #4a4a55;\n}\n#em-root .em-btn:disabled {\n  opacity: 0.55;\n  cursor: default;\n}\n#em-root .em-btn-main {\n  background: var(--em-accent);\n  border-color: var(--em-accent);\n  color: var(--em-accent-ink);\n  font-weight: 600;\n}\n#em-root .em-btn-bad {\n  color: #ffc9c9;\n  border-color: rgba(255, 107, 107, 0.35);\n}\n#em-root .em-btn-on {\n  background: rgba(90, 209, 138, 0.16);\n  border-color: rgba(90, 209, 138, 0.5);\n  color: #c9f5dc;\n}\n\n#em-root .em-form {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n#em-root .em-row {\n  display: flex;\n  gap: 10px;\n}\n#em-root .em-row > * {\n  flex: 1 1 0;\n  min-width: 0;\n}\n#em-root .em-field {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n#em-root .em-field-label {\n  font-size: 12px;\n  color: var(--em-dim);\n}\n#em-root .em-field small {\n  font-size: 11px;\n  color: var(--em-dim);\n}\n#em-root .em-input {\n  width: 100%;\n  background: var(--em-bg3);\n  color: var(--em-text);\n  border: 1px solid var(--em-line);\n  border-radius: 9px;\n  padding: 7px 9px;\n  font-size: 13px;\n  resize: vertical;\n}\n#em-root .em-input:focus {\n  outline: none;\n  border-color: var(--em-accent);\n}\n#em-root .em-input::placeholder {\n  color: #74747f;\n}\n\n/* --- el formulario del rol (igual que su editor: contadores, géneros, etiquetas) ------------- */\n#em-root .em-req {\n  color: #ff8f6b;\n  font-style: normal;\n  margin-left: 3px;\n}\n#em-root .em-counted {\n  display: flex;\n  align-items: flex-start;\n  gap: 6px;\n}\n#em-root .em-counted > .em-input {\n  flex: 1 1 auto;\n  min-width: 0;\n}\n#em-root .em-count-num {\n  font-size: 11px;\n  color: var(--em-dim);\n  padding-top: 8px;\n  font-variant-numeric: tabular-nums;\n  white-space: nowrap;\n}\n#em-root .em-count-on {\n  color: var(--em-accent);\n}\n#em-root .em-hint {\n  font-size: 11.5px;\n  color: #8f8f9c;\n}\n#em-root .em-tip {\n  font-size: 11.5px;\n  color: #8f8f9c;\n  border-top: 1px dashed var(--em-line);\n  padding-top: 8px;\n}\n#em-root .em-radios {\n  display: flex;\n  gap: 6px;\n  flex-wrap: wrap;\n}\n#em-root .em-radio {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12.5px;\n  padding: 6px 12px 6px 6px;\n  border-radius: 999px;\n  border: 1px solid var(--em-line);\n  background: var(--em-bg3);\n  color: var(--em-text);\n  cursor: pointer;\n}\n#em-root .em-radio:hover {\n  border-color: #4a4a55;\n}\n#em-root .em-radio-dot {\n  width: 18px;\n  height: 18px;\n  border-radius: 50%;\n  border: 1px solid var(--em-line);\n  background: var(--em-bg);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 11px;\n  font-style: normal;\n  color: var(--em-accent-ink);\n}\n#em-root .em-radio-on {\n  border-color: var(--em-accent);\n  background: rgba(247, 201, 72, 0.12);\n}\n#em-root .em-radio-on .em-radio-dot {\n  background: var(--em-accent);\n  border-color: var(--em-accent);\n}\n#em-root .em-avatar-wrap {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n}\n#em-root .em-avatar-big {\n  width: 72px;\n  height: 72px;\n  border-radius: 12px;\n  object-fit: cover;\n  flex: 0 0 auto;\n  background: var(--em-bg3);\n  font-size: 26px;\n}\n#em-root .em-avatar-fields {\n  flex: 1 1 auto;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  align-items: flex-start;\n}\n#em-root .em-btn-mini {\n  font-size: 11.5px;\n  padding: 4px 8px;\n}\n#em-root .em-chip-del {\n  background: transparent;\n  border: 0;\n  color: inherit;\n  font: inherit;\n  cursor: pointer;\n  padding: 0 0 0 6px;\n  opacity: 0.75;\n}\n#em-root .em-chip-del:hover {\n  opacity: 1;\n}\n\n/* --- el selector de etiquetas --------------------------------------------------------------- */\n#em-root .em-picker {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n#em-root .em-tag-list {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n#em-root .em-tag-group {\n  font-size: 12px;\n  color: var(--em-accent);\n  margin-top: 2px;\n}\n#em-root .em-tag-grid {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 6px;\n}\n#em-root .em-tag {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 4px;\n  font-size: 11.5px;\n  padding: 6px 8px;\n  border-radius: 9px;\n  border: 1px solid var(--em-line);\n  background: var(--em-bg3);\n  color: var(--em-text);\n  cursor: pointer;\n  text-align: left;\n  min-width: 0;\n}\n#em-root .em-tag span {\n  overflow-wrap: anywhere;\n  line-height: 1.25;\n}\n#em-root .em-tag:hover {\n  border-color: #4a4a55;\n}\n#em-root .em-tag-mark {\n  font-style: normal;\n  color: var(--em-dim);\n  flex: 0 0 auto;\n}\n#em-root .em-tag-on {\n  background: rgba(247, 201, 72, 0.16);\n  border-color: var(--em-accent);\n  color: #fff;\n}\n#em-root .em-tag-on .em-tag-mark {\n  color: var(--em-accent);\n}\n#em-root .em-tag-full {\n  border-color: var(--em-bad);\n  color: #ffd9d9;\n}\n\n#em-root .em-spin {\n  width: 12px;\n  height: 12px;\n  border-radius: 50%;\n  border: 2px solid var(--em-line);\n  border-top-color: var(--em-accent);\n  display: inline-block;\n  animation: em-spin 0.8s linear infinite;\n}\n@keyframes em-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@media (max-width: 520px) {\n  #em-panel {\n    left: 8px;\n    right: 8px;\n    width: auto;\n    max-width: none;\n    top: 8px;\n    bottom: 76px;\n  }\n  #em-fab {\n    left: 12px;\n    bottom: 12px;\n  }\n}\n\n/* =============================================================================================\n   💗 la partida (rpg.js): la ficha de estadísticas, la etapa y el registro (los dados se fueron)\n   ============================================================================================= */\n\n#em-root .em-rpg-msg {\n  padding: 8px 10px;\n  border-radius: 10px;\n  background: rgba(90, 209, 138, 0.12);\n  border: 1px solid rgba(90, 209, 138, 0.35);\n  font-size: 12px;\n}\n#em-root .em-rpg-msg-bad {\n  background: rgba(255, 107, 107, 0.12);\n  border-color: rgba(255, 107, 107, 0.4);\n}\n#em-root .em-rpg-msg .em-hint {\n  display: block;\n  margin-top: 4px;\n}\n\n#em-root .em-ficha {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  padding: 10px;\n  border: 1px solid var(--em-line);\n  border-radius: 12px;\n  background: var(--em-bg2);\n}\n#em-root .em-stat {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 12px;\n}\n#em-root .em-stat-ico {\n  width: 16px;\n  text-align: center;\n}\n#em-root .em-stat-name {\n  flex: 0 0 96px;\n  color: var(--em-dim);\n}\n#em-root .em-bar {\n  position: relative;\n  flex: 1 1 auto;\n  min-width: 0;\n  height: 9px;\n  border-radius: 999px;\n  background: #0d0d10;\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.07);\n  overflow: hidden;\n}\n#em-root .em-bar-fill {\n  display: block;\n  height: 100%;\n  min-width: 2px;\n  border-radius: 999px;\n  background: linear-gradient(90deg, #f7c948, #ff8fb1);\n  box-shadow: 0 0 8px rgba(247, 201, 72, 0.35);\n}\n#em-root .em-stat-num {\n  flex: 0 0 30px;\n  text-align: right;\n  font-variant-numeric: tabular-nums;\n}\n#em-root .em-etapa {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-top: 2px;\n  padding-top: 8px;\n  border-top: 1px dashed var(--em-line);\n}\n#em-root .em-etapa-badge {\n  padding: 3px 9px;\n  border-radius: 999px;\n  background: var(--em-accent);\n  color: var(--em-accent-ink);\n  font-size: 11px;\n  font-weight: 700;\n}\n#em-root .em-etapa-tip {\n  font-size: 11px;\n  color: var(--em-dim);\n}\n\n#em-root .em-mem {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 6px;\n  font-size: 11px;\n  color: var(--em-dim);\n}\n#em-root .em-mem-state {\n  padding: 2px 7px;\n  border-radius: 999px;\n  border: 1px solid var(--em-line);\n}\n#em-root .em-mem-len {\n  font-variant-numeric: tabular-nums;\n}\n#em-root .em-mem-over {\n  color: var(--em-bad);\n  font-weight: 700;\n}\n#em-root .em-toggles {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n}\n#em-root .em-toggle {\n  padding: 6px 9px;\n  border: 1px solid var(--em-line);\n  border-radius: 999px;\n  background: var(--em-bg2);\n  color: var(--em-dim);\n  font-size: 11px;\n  cursor: pointer;\n}\n#em-root .em-toggle-on {\n  color: var(--em-text);\n  border-color: var(--em-accent);\n  background: rgba(247, 201, 72, 0.14);\n}\n#em-root .em-det {\n  border: 1px solid var(--em-line);\n  border-radius: 10px;\n  background: var(--em-bg2);\n  padding: 8px 10px;\n  font-size: 12px;\n}\n#em-root .em-det summary {\n  cursor: pointer;\n  color: var(--em-dim);\n}\n#em-root .em-pre {\n  margin: 8px 0 0;\n  max-height: 220px;\n  overflow: auto;\n  padding: 8px;\n  border-radius: 8px;\n  background: #0f0f11;\n  color: #d8d8e0;\n  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;\n  font-size: 11px;\n  line-height: 1.4;\n  white-space: pre-wrap;\n  word-break: break-word;\n}\n#em-root .em-log {\n  display: flex;\n  flex-direction: column;\n  gap: 5px;\n}\n#em-root .em-log-item {\n  display: flex;\n  gap: 7px;\n  align-items: flex-start;\n  font-size: 11px;\n  color: var(--em-dim);\n  border-left: 2px solid var(--em-line);\n  padding-left: 7px;\n}\n#em-root .em-log-ico {\n  flex: 0 0 auto;\n}\n#em-root .em-log-txt {\n  flex: 1 1 auto;\n}\n\n@media (max-width: 430px) {\n  #em-root .em-stat-name {\n    flex: 0 0 76px;\n  }\n}\n\n/* =============================================================================================\n   💗 la ficha de la partida (rpg.js): va pegada al lado IZQUIERDO de la columna del chat.\n   Es `position: fixed` (lo clava rpg.js), y se pliega con la flechita: plegada queda una tira\n   de 34 px con el corazón y la etapa. Todo dentro de #em-root, así que no toca nada de la web.\n   ============================================================================================= */\n#em-dock {\n  position: fixed;\n  left: 8px;\n  top: 72px;\n  width: 250px;\n  display: flex;\n  flex-direction: column;\n  background: var(--em-bg);\n  border: 1px solid var(--em-line);\n  border-radius: 12px;\n  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.5);\n  overflow: hidden;\n  color: var(--em-text);\n}\n#em-dock[hidden] {\n  display: none !important;\n}\n#em-root .em-dock-in {\n  display: flex;\n  flex-direction: column;\n  min-height: 0;\n  max-height: inherit;\n}\n#em-root .em-dock-min .em-dock-in {\n  height: 100%;\n}\n#em-root .em-dock-head {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  padding: 7px 8px;\n  background: var(--em-bg2);\n  border-bottom: 1px solid var(--em-line);\n}\n#em-root .em-dock-id {\n  flex: 1 1 auto;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 1px;\n}\n#em-root .em-dock-bot {\n  font-size: 12.5px;\n  font-weight: 700;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n#em-root .em-dock-note {\n  font-size: 10.5px;\n  color: var(--em-dim);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n#em-root .em-dock-fold {\n  font-size: 12px !important;\n  padding: 2px 5px !important;\n}\n#em-root .em-dock-body {\n  flex: 1 1 auto;\n  min-height: 0;\n  overflow-y: auto;\n  padding: 9px;\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n#em-root .em-dock-last {\n  display: flex;\n  flex-direction: column;\n  gap: 1px;\n  padding: 6px 8px;\n  border-radius: 9px;\n  border: 1px solid rgba(247, 201, 72, 0.4);\n  background: rgba(247, 201, 72, 0.1);\n  font-size: 11px;\n}\n#em-root .em-dock-last b {\n  font-size: 11.5px;\n}\n#em-root .em-dock-last span {\n  color: var(--em-dim);\n}\n#em-root .em-acts-dock {\n  gap: 4px;\n}\n#em-root .em-acts-dock .em-btn-mini {\n  flex: 1 1 auto;\n}\n#em-root .em-btn-mini {\n  font-size: 11.5px;\n  padding: 5px 8px;\n}\n#em-root .em-ficha-dock {\n  padding: 8px;\n  gap: 5px;\n}\n#em-root .em-ficha-dock .em-stat-name {\n  flex: 0 0 62px;\n  font-size: 11px;\n}\n#em-root .em-ficha-dock .em-stat {\n  gap: 6px;\n  font-size: 11px;\n}\n#em-root .em-ficha-dock .em-stat-num {\n  flex: 0 0 26px;\n}\n#em-root .em-stat-bump .em-bar-fill {\n  animation: em-bump 0.9s ease-out;\n}\n#em-root .em-stat-bump .em-stat-num {\n  color: var(--em-accent);\n}\n@keyframes em-bump {\n  0% { filter: brightness(2.2); }\n  100% { filter: none; }\n}\n#em-root .em-pal-edit {\n  width: 100%;\n  margin-top: 6px;\n  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;\n  font-size: 10.5px;\n  line-height: 1.45;\n  white-space: pre;\n  overflow: auto;\n}\n#em-root .em-pal-out {\n  margin-top: 4px;\n  color: var(--em-accent);\n}\n#em-root .em-dock-min .em-dock-head {\n  padding: 5px 4px;\n  justify-content: center;\n}\n#em-root .em-dock-min .em-dock-id,\n#em-root .em-dock-min .em-dock-head .em-icon:last-child {\n  display: none;\n}\n#em-root .em-dock-mini {\n  flex: 1 1 auto;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 0 10px;\n  cursor: pointer;\n  min-height: 120px;\n}\n#em-root .em-dock-mini-ico {\n  font-size: 15px;\n}\n#em-root .em-dock-mini-txt {\n  writing-mode: vertical-rl;\n  font-size: 10.5px;\n  color: var(--em-dim);\n  letter-spacing: 0.02em;\n  white-space: nowrap;\n}\n/* Cuando el hueco entre su barra lateral y el chat es justo, la ficha se estrecha: fuera los\n   nombres de las barras (los iconos ya dicen cuál es cuál) y los botones, algo más juntos. */\n#em-root .em-dock-narrow .em-stat-name {\n  display: none;\n}\n#em-root .em-dock-narrow .em-stat-ico {\n  width: 14px;\n}\n#em-root .em-dock-narrow .em-btn-mini {\n  font-size: 11px;\n  padding: 5px 6px;\n}\n#em-root .em-dock-narrow .em-ficha-dock {\n  padding: 7px 6px;\n}\n#em-root .em-dock-narrow .em-etapa-tip {\n  display: none;\n}\n";
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
   emochi.com — las etiquetas de la persona ("MI ROL").

   La lista es la DE ELLOS, sacada de sus dos endpoints públicos: `explore/all/tags` (los 68
   nombres y sus cuatro grupos) y `config/creator/tags` (las traducciones, aquí el español).
   `core.js` la vuelve a pedir cuando hace falta y, si la red falla, tira de esta copia: por eso
   el panel funciona igual aunque su API no conteste.

   Generado el 2026-09-25 (68 etiquetas). No editar a mano: se regenera desde la API.
   ============================================================================================= */
(function () {
  "use strict";

  window.emochiLabTags = {
    max: 5, // su editor no deja marcar más de cinco: "Confirmar (3/5)"
    groups: {
      theme: "Tema",
      personality: "Personalidad",
      relationship: "Relación",
      identity: "Identidad",
    },
    labels: [
      ["theme", "Romance", "Romance"],
      ["theme", "Drama", "Drama"],
      ["theme", "Bl", "BL"],
      ["theme", "Comedy", "Comedia"],
      ["theme", "Slice of life", "Vida cotidiana"],
      ["theme", "Dark romance", "Romance oscuro"],
      ["theme", "School", "Escuela"],
      ["theme", "Coming of age", "Mayoría de edad"],
      ["theme", "Forced marriage", "Matrimonio forzado"],
      ["theme", "Family", "Familia"],
      ["theme", "Conflict", "Conflicto"],
      ["theme", "Fantasy", "Fantasía"],
      ["theme", "Supernatural", "Sobrenatural"],
      ["theme", "Friendship", "Amistad"],
      ["theme", "Adventure", "Aventura"],
      ["theme", "Horror", "Terror"],
      ["theme", "Crime", "Delito"],
      ["personality", "Possessive", "Posesivo"],
      ["personality", "Loyal", "Leal"],
      ["personality", "Playful", "Juguetón"],
      ["personality", "Protective", "Protector"],
      ["personality", "Flirty", "Coqueto"],
      ["personality", "Emotional", "Emocional"],
      ["personality", "Secretive", "Reservado"],
      ["personality", "Teasing", "Broma"],
      ["personality", "Arrogant", "Arrogante"],
      ["personality", "Affectionate", "Cariñoso"],
      ["personality", "Kind", "Amable"],
      ["personality", "Gentle", "Gentil"],
      ["personality", "Dominant", "Dominante"],
      ["personality", "Violent", "Violento"],
      ["personality", "Strong-willed", "De voluntad fuerte"],
      ["personality", "Manipulative", "Manipulador"],
      ["personality", "Jealous", "Celoso"],
      ["personality", "Shy", "Tímido"],
      ["personality", "Introverted", "Introvertido"],
      ["personality", "Seductive", "Seductor"],
      ["personality", "Hostile", "Hostil"],
      ["relationship", "Love interest", "Interés amoroso"],
      ["relationship", "Spouse", "Cónyuge"],
      ["relationship", "Potential love interest", "Amor Potencial"],
      ["relationship", "Friend", "Amigo"],
      ["relationship", "Stranger", "Extraño"],
      ["relationship", "Boyfriend", "Novio"],
      ["relationship", "Romantic partner", "Pareja Romántica"],
      ["relationship", "Enemy", "Enemigo"],
      ["relationship", "Forbidden love interest", "Amor prohibido"],
      ["relationship", "Obsessive lover", "Amante Obsesivo"],
      ["relationship", "Classmate", "Compañero de clase"],
      ["relationship", "Protector", "Protector"],
      ["relationship", "Captor", "Capturador"],
      ["relationship", "Roommate", "Compañero de cuarto"],
      ["relationship", "Rival", "Rival"],
      ["relationship", "Sibling", "Hermano/a"],
      ["identity", "Student", "Alumno"],
      ["identity", "Youngadult", "JovenAdulto"],
      ["identity", "Husband", "Esposo"],
      ["identity", "Mafia", "Mafia"],
      ["identity", "Wealthy", "Adinerado"],
      ["identity", "Ceo", "Director ejecutivo"],
      ["identity", "Aristocrat", "Aristócrata"],
      ["identity", "Teenager", "Adolescente"],
      ["identity", "Criminal", "Criminal"],
      ["identity", "Hero", "Héroe"],
      ["identity", "Parent", "Padre/madre"],
      ["identity", "Adult", "Adulto"],
      ["identity", "Worker", "Obrero"],
      ["identity", "Leader", "Líder"]
    ]
  };
})();

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
      .catch(function () {
        // Un fallo de red aquí es lo mismo que no tener sesión: no se puede hablar con el sitio.
        return { status: 0, ok: false };
      })
      .then(function (r) {
        if (!r.ok) {
          // 401/403/404 = no hay sesión (caducada, o no estamos en emochi.com, como en el
          // laboratorio). 0 = ni se pudo hablar con el sitio: para el caso, lo mismo.
          if (r.status === 401 || r.status === 403 || r.status === 404 || r.status === 0) return null;
          throw new Error("el sitio respondió " + r.status + " al pedir la sesión");
        }
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
          var common = {
            "x-flow-device-id": deviceId(),
            "x-flow-platform-os": "web",
            "x-flow-language": navigator.language || "es",
            "x-flow-timezone-offset": String(new Date().getTimezoneOffset())
          };
          if (opts.anonymous) {
            authoriz = deviceId();
            return { headers: Object.assign({ Authorization: "Bearer " + authoriz }, common) };
          }
          return fetchToken(tries > 1).then(function (t) {
            if (!t) {
              var e = new Error("sin sesión");
              e.code = "no-session";
              throw e;
            }
            authoriz = "Bearer " + t;
            return { headers: Object.assign({ Authorization: authoriz }, common) };
          });
        })
        .then(function (base) {
          var headers = base.headers;
          Object.keys(headers).forEach(function (k) {
            if (headers[k] === "" || headers[k] == null) delete headers[k];
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

  // --- las etiquetas de "MI ROL" ----------------------------------------------------------------
  // Son las de ellos, y las sirven en dos endpoints públicos: `explore/all/tags` (los 68 nombres,
  // repartidos en cuatro grupos) y `config/creator/tags` (sus traducciones; aquí interesa el
  // español). Se piden una vez y se guardan una semana. Si la red falla -o su CORS, que en la
  // vista previa del laboratorio no está- se usa la copia de `tags.js`, que es exactamente la
  // misma lista: así el formulario de etiquetas nunca se queda en blanco.
  var TAGS_KEY = "emochi-lab:tags:v1";
  var TAGS_TTL = 7 * 24 * 60 * 60 * 1000;
  var tagsMem = null;

  function embeddedTags() {
    var t = window.emochiLabTags || {};
    return {
      max: t.max || 5,
      groups: t.groups || {},
      labels: (t.labels || []).map(function (r) {
        return { group: r[0], name: r[1], label: r[2] };
      })
    };
  }
  function cachedTags() {
    try {
      var box = JSON.parse(localStorage.getItem(TAGS_KEY) || "null");
      if (box && box.labels && box.labels.length && Date.now() - (box.at || 0) < TAGS_TTL) {
        return { max: box.max || 5, groups: box.groups || {}, labels: box.labels };
      }
    } catch (e) {}
    return null;
  }
  function plainGet(path) {
    return fetch(BACKEND + path, {
      headers: { Accept: "application/json", "x-flow-language": navigator.language || "es" },
      credentials: "omit"
    }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    });
  }
  function fetchTags() {
    return Promise.all([plainGet("/explore/all/tags"), plainGet("/config/creator/tags")]).then(function (r) {
      var all = r[0] || {};
      var es = {};
      (r[1] || []).forEach(function (t) {
        var tr = t.translation || {};
        es[t.name] = tr.es_ES || tr.es || t.name;
      });
      var base = embeddedTags();
      var labels = [];
      Object.keys(all).forEach(function (g) {
        var box = all[g] || {};
        (box.items || []).forEach(function (it) {
          if (!it || !it.name) return;
          labels.push({ group: g, name: it.originalName || it.name, label: es[it.name] || es[it.originalName] || it.name });
        });
      });
      if (!labels.length) throw new Error("sin etiquetas");
      var out = { max: base.max, groups: base.groups, labels: labels };
      tagsMem = out;
      try {
        localStorage.setItem(TAGS_KEY, JSON.stringify({ at: Date.now(), max: out.max, groups: out.groups, labels: out.labels }));
      } catch (e) {}
      return out;
    });
  }
  EM.tags = {
    // lo que se puede pintar ya, sin esperar a la red
    now: function () {
      return tagsMem || cachedTags() || embeddedTags();
    },
    load: function (force) {
      if (tagsMem && !force) return Promise.resolve(tagsMem);
      var c = cachedTags();
      if (c && !force) {
        tagsMem = c;
        fetchTags().catch(function () {}); // y de fondo se refresca
        return Promise.resolve(c);
      }
      return fetchTags().catch(function (e) {
        EM.log("etiquetas: tiro de la copia de tags.js (" + e.message + ")");
        tagsMem = embeddedTags();
        return tagsMem;
      });
    },
    // el nombre que se enseña de una etiqueta (la API guarda el suyo, en inglés)
    labelOf: function (name) {
      var list = EM.tags.now().labels;
      var m = list.filter(function (l) { return l.name === name || l.label === name; })[0];
      return m ? m.label : name;
    }
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
    },
    // las etiquetas de "MI ROL" (68, en cuatro grupos, traducidas al español)
    tags: function (force) {
      return EM.tags.load(force);
    },

    // --- lo que hace falta para la capa de juego (rpg.js) -----------------------------------
    // La MEMORIA del bot: es el único sitio del que tenemos constancia donde se puede escribir
    // algo que el modelo lee en *todos* los mensajes (desde el primero). El cuerpo del POST no lo
    // hemos podido ver (su ventana de memoria vive en un trozo de su web que no se descarga sin
    // sesión), así que se manda `memory` y, si el servidor se queja, rpg.js prueba otros nombres.
    memoriaDeBot: function (promptId) {
      return EM.get("/user/prompt/memory", { query: { promptId: String(promptId) } });
    },
    ponMemoriaDeBot: function (promptId, campo, texto) {
      var body = { promptId: String(promptId) };
      body[campo || "memory"] = texto;
      return EM.post("/user/prompt/memory", body);
    },
    // cuánto ocupa la memoria (su web lo cuenta en "tokens"; sirve para no pasarse)
    memoriaTokens: function (promptId, conversationId) {
      return EM.get("/conversation/memory/tokens", {
        query: { promptId: String(promptId), conversationId: String(conversationId || "") }
      });
    },
    // el historial del bot (para leer lo que ha contestado sin tocar la pantalla)
    historial: function (promptId) {
      return EM.get("/conversation/prompt-history-v2", { query: { promptId: String(promptId) } });
    },
    historialV1: function (promptId) {
      return EM.get("/conversation/prompt-history", { query: { promptId: String(promptId) } });
    },
    ultimaConversacion: function (promptId) {
      return EM.get("/conversation/latest", { query: { promptId: String(promptId) } });
    },
    // la ficha pública del personaje (título, intro, etc.)
    personaje: function (promptId) {
      return EM.get("/prompt/" + encodeURIComponent(promptId));
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
   emochi.com — la ficha de la partida (💗): la relación con el bot medida por PALABRAS CLAVE.

   La idea, en una frase: **no hace falta pedirle nada al modelo**. Todo lo que el bot necesita
   saber es cómo de cerca está la relación, y eso se puede medir aquí, en el navegador, mirando lo
   que escribe el jugador. Así que:

     · el JUGADOR escribe en el chat (`*beso en los labios*`, `"te quiero"`, un pensamiento suelto…)
     · esta ficha lee ese mensaje, busca las palabras clave de su tabla y mueve las barras
     · y al bot solo se le deja una nota corta en SU MEMORIA (la única cosa que el modelo lee en
       todos los mensajes, desde el primero): cuatro números, la etapa y en qué tono tiene que
       actuar. Sin dados, sin marcadores que el bot tenga que escribir, sin pedirle nada.

   La ficha vive pegada al lado IZQUIERDO de la columna del chat (a la derecha está la suya), se
   pliega con una flechita y todo el estado es por bot. Nada de esto toca la partida del sitio: es
   una capa nuestra encima.

   OJO — el tope de su servidor: la memoria del bot solo acepta 300 caracteres (su propio error lo
   dice: "Memory input is too long, max length is 300"), así que la nota se arma por piezas y se
   va recortando sola. Lo que se cae por el camino se recupera con «✍ Poner en el chat».
   ============================================================================================= */
(function () {
  "use strict";
  var EM = window.emochiLab;
  if (!EM) return;

  var el = EM.el;

  var KEY = "emochi-lab:rpg:v1";          // las fichas (una por bot)
  var PAL_KEY = "emochi-lab:palabras:v1"; // la tabla de palabras clave, si la has editado
  var CLAVE_LOCAL = "__local__";          // la ficha de cuando todavía no sé con qué bot juegas
  var LIMITE_MEM = 300;                   // lo que deja SU servidor en la memoria del bot
  var LIMITE_CHAT = 2000;                 // el tope que me pongo para el texto que va con ✍
  var TICK = 1500;                        // cada cuánto se recoloca la ficha (es barato)
  var DECAIMIENTO = 0.5;                  // la tensión se enfría sola si no la alimentas
  var TOPE_MOV = 10;                      // ningún mensaje mueve una barra más de esto
  var ANCHO = 250;                        // el ancho de la ficha (plegada son 34)
  var ANCHO_GRANDE = 400;                 // y el ancho cuando la estiras (⤢) para editar cómodo
  var MAX_LOG = 120;

  // --- las etapas y las barras ------------------------------------------------------------------
  var ETAPAS = ["Desconocidos", "Conocidos", "Amistad", "Cercanía", "Tensión", "Amantes"];
  var ETAPA_TIP = {
    "Desconocidos": "frío y cortés, con distancia",
    "Conocidos": "amable, de cosas normales",
    "Amistad": "cálido, con bromas y confianza",
    "Cercanía": "cariñoso y coqueto, busca el contacto",
    "Tensión": "provocador: se acerca y se aleja, te deja con ganas",
    "Amantes": "íntimo; el deseo ya no se esconde"
  };
  // La misma idea, en tres palabras: es lo que cabe en la memoria del bot.
  var TIP_CORTO = {
    "Desconocidos": "frío y cortés",
    "Conocidos": "amable",
    "Amistad": "cálido",
    "Cercanía": "cariñoso y coqueto",
    "Tensión": "esquivo y provocador",
    "Amantes": "apasionado, sin freno"
  };
  var STATS = [
    { id: "afecto", label: "Afecto", icon: "💗" },
    { id: "confianza", label: "Confianza", icon: "🤝" },
    { id: "deseo", label: "Deseo", icon: "🔥" },
    { id: "tension", label: "Tensión", icon: "⚡" }
  ];
  var MOV_ALIAS = { lujuria: "deseo", deseo: "deseo", afecto: "afecto", cariño: "afecto", confianza: "confianza", tension: "tension", tensión: "tension" };

  // --- la tabla de palabras clave ----------------------------------------------------------------
  // Una entrada por línea, en un formato que se lee y se edita a mano (esto es lo que sale en el
  // editor de la ficha):
  //
  //     nombre : palabras : movimientos
  //
  //   · `palabras`: grupos separados por `|` (basta con que cuadre UNO).
  //      Dentro de un grupo, las palabras van con `+` (tienen que estar TODAS, en cualquier orden).
  //      Dentro de una palabra, las alternativas van con `/` (vale cualquiera de ellas).
  //   · `movimientos`: `estadística cuánto`, separados por comas. Admite decimales y negativos.
  //
  // Gana la entrada MÁS ESPECÍFICA (la que pide más palabras) y solo cuenta UNA por mensaje. Y el
  // número se ajusta por dónde está la frase: dentro de `*…*` (acción) o `"…"` (lo que dices)
  // cuenta entero; en texto llano (pensamiento o narración) cuenta la mitad; y dentro de `( … )`
  // (OOC: hablas tú, no el personaje) no cuenta nada.
  var TABLA_TEXTO = [
    "# Una entrada por línea:  nombre : palabras : movimientos",
    "#   palabras → grupos con |  ·  todas las palabras del grupo con +  ·  alternativas con /",
    "#   movimientos → afecto / confianza / deseo / tension y cuánto (admite 2.5 y negativos)",
    "# Si dos entradas cuadran en el mismo mensaje y piden lo mismo, gana la de más arriba:",
    "# por eso las cosas concretas van primero y las genéricas (Beso, Caricia, Tocar) al final.",
    "",
    "Beso con lengua : lengua+beso/besar/besito | frances | morreo : deseo 5, afecto 1, tension 2",
    "Beso en los labios : labio + beso/besar/besito : deseo 2, afecto 1",
    "Beso en el cuello : cuello + beso/besar/besito : deseo 2, tension 1",
    "Beso en la mejilla : mejilla/cachete + beso/besar/besito : deseo 1, afecto 1.5",
    "Lamer la aureola : aureola + lamer/chupar/lengua : deseo 1, tension 1",
    "Lamer el pezón : pezon/teton + lamer/chupar : deseo 2, tension 1",
    "Caricia en la mejilla : mejilla/cachete + acariciar/caricia/roce : deseo 2.5, afecto 1",
    "Desnudar : desnudar/desnuda/desnudo | quitar/quito/quita+ropa : deseo 3, tension 2",
    "Pechos : pecho/pechos/senos/tetas/busto : deseo 2, tension 1",
    "Culo : culo/nalgas/trasero : deseo 2, tension 1",
    "Muslos : muslo/muslos/pierna/piernas : deseo 1.5",
    "Gemir : gemir/gemido/gemidos : deseo 2, tension 1",
    "Dormir juntos : cama + dormir/duerme/duermo/durmiendo | abrazo + dormir/duerme/duermo : afecto 2, confianza 1, deseo 1",
    "Coger de la mano : mano + coger/tomar/agarrar/sujetar : afecto 1.5, confianza 1",
    "Abrazo : abrazo/abrazar : afecto 1.5, confianza 0.5",
    "Te quiero : te+quiero | te+amo | te+adoro | enamorad : afecto 3, confianza 1",
    "Me encantas : encantas/gustas : afecto 1.5, tension 0.5",
    "Halago : guapa/guapo/hermosa/hermoso/preciosa/precioso/bella/bello/linda/lindo : afecto 1, tension 0.5",
    "Celos : celos/celosa/celoso : tension 2, confianza -1",
    "Disculpa : perdon/perdona/disculpa/siento : afecto 0.5, confianza 1, tension -1",
    "Gracias : gracias : afecto 0.5, confianza 0.5",
    "Preguntar por él : como+estas | que+tal : afecto 0.5, confianza 1",
    "Insulto : idiota/imbecil/estupida/estupido/tonta/tonto/gilipollas : afecto -2, confianza -1, tension 1.5",
    "Adiós : adios | me+voy | hasta+luego : afecto -0.5, tension 1",
    "Tocar : tocar/toco/toca/tocando : deseo 0.5, tension 0.5",
    "Caricia : acariciar/caricia/rozar/rozo/roce/roces : deseo 1, tension 1",
    "Beso : beso/besar/besito/muac : deseo 1, afecto 0.5"
  ].join("\n");

  var FLAGS_POR_DEFECTO = {
    medir: true,       // mover las barras con lo que escribes en el chat
    memAut: true,      // refrescar la memoria del bot sola cuando cambia la etapa
    explicito: false,  // la nota pide escenas íntimas con detalle
    larga: true,       // prueba antes el bloque completo, por si su plan deja más de 300
    autoenviar: true,  // (✍) pulsa enviar por ti
    aceroReinicia: false // (💗 A cero) reiniciar también el chat, con su botón «Reiniciar»
  };

  // --- estado -----------------------------------------------------------------------------------
  var store = { v: 1, bots: {} };
  var state = {
    sheet: null,
    host: null,
    dock: null,
    visible: false,
    forzado: false,
    panelAbierto: false,
    colapsado: false,
    aMano: false,      // ¿el jugador ha plegado/desplegado a mano? (entonces no se toca solo)
    ancho: ANCHO,
    anchoPuesto: ANCHO,
    seccion: "",       // qué <details> está abierto (para no perderlo al repintar)
    msg: null,
    busy: false,
    ultimo: null,      // el último movimiento medido
    brinco: {},        // barras que acaban de moverse (para el destello)
    prueba: "",        // el texto de la cajita de pruebas
    edicion: null,     // el borrador de la tabla mientras la editas
    vigilando: false,  // esperando a que salga su botón de «Reiniciar»
    raw: ""            // lo último que contestó su API
  };
  var cola = false;

  function cargar() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || "null");
      if (raw && raw.bots) store = raw;
      if (!store.bots) store.bots = {};
    } catch (e) {
      store = { v: 1, bots: {} };
    }
  }
  function guardar() {
    try {
      localStorage.setItem(KEY, JSON.stringify(store));
    } catch (e) {}
  }
  function nuevaFicha(promptId, nombre) {
    var flags = {};
    Object.keys(FLAGS_POR_DEFECTO).forEach(function (k) { flags[k] = FLAGS_POR_DEFECTO[k]; });
    var stats = {};
    var log = [];
    return {
      v: 2,
      promptId: promptId || "",
      bot: nombre || "",
      player: "",
      stats: stats,
      etapa: 0,
      turnos: 0,
      vinculo: 0,
      flags: flags,
      log: log,
      vistos: [],
      memoria: { original: null, campo: "", texto: "", at: 0, error: "", tope: 0, rico: 0, etapa: -1, turno: 0 },
      visto: ""
    };
  }
  // La ficha del bot en el que estamos (por `promptId`, que es lo que identifica al bot). Si
  // todavía no lo sé, se trabaja sobre una ficha local: así la ficha funciona igual (y se puede
  // probar) desde el primer segundo.
  function ficha() {
    var id = (EM.bot && EM.bot.promptId) || CLAVE_LOCAL;
    var s = store.bots[id];
    if (!s) {
      s = nuevaFicha(EM.bot && EM.bot.promptId ? id : "", EM.bot.title || "");
      store.bots[id] = s;
      guardar();
    }
    if (!s.stats) s.stats = {};
    STATS.forEach(function (st) { if (typeof s.stats[st.id] !== "number") s.stats[st.id] = 0; });
    if (!s.flags) s.flags = Object.assign({}, FLAGS_POR_DEFECTO);
    Object.keys(FLAGS_POR_DEFECTO).forEach(function (k) { if (typeof s.flags[k] !== "boolean") s.flags[k] = FLAGS_POR_DEFECTO[k]; });
    if (!s.log) s.log = [];
    if (!s.vistos) s.vistos = [];
    if (!s.memoria) s.memoria = { original: null, campo: "", texto: "", at: 0, error: "", tope: 0, rico: 0, etapa: -1, turno: 0 };
    if (typeof s.memoria.tope !== "number") s.memoria.tope = 0;
    if (typeof s.memoria.rico !== "number") s.memoria.rico = 0;
    if (typeof s.memoria.etapa !== "number") s.memoria.etapa = -1;
    if (typeof s.memoria.turno !== "number") s.memoria.turno = 0;
    if (!s.memoria.tope && store.tope) s.memoria.tope = store.tope;
    if (EM.bot && EM.bot.title) s.bot = EM.bot.title;
    return s;
  }
  function apuntar(s, kind, text, extra) {
    s.log.unshift({ at: Date.now(), kind: kind, text: text, extra: extra || null });
    if (s.log.length > MAX_LOG) s.log.length = MAX_LOG;
  }
  function aviso(text, bad, extra) {
    state.msg = text ? { text: text, bad: !!bad, extra: extra || null } : null;
    if (state.dock) {
      clearTimeout(aviso._t);
      if (text && !bad) {
        aviso._t = setTimeout(function () {
          if (state.msg && state.msg.text === text) {
            state.msg = null;
            render();
          }
        }, 6000);
      }
    }
  }

  // --- números -----------------------------------------------------------------------------------
  function red1(n) { return Math.round((n || 0) * 10) / 10; }
  function fmt(n) { var v = red1(n); return v % 1 === 0 ? String(v) : v.toFixed(1); }
  function entreCeroCien(n) { return red1(Math.max(0, Math.min(100, n))); }
  function tope(n, max) { return Math.max(-max, Math.min(max, n)); }
  // La etapa sale de la media de afecto/confianza y del deseo. Nunca se retrocede por su cuenta.
  function etapaQue(stats) {
    var v = (stats.afecto + stats.confianza) / 2;
    var d = stats.deseo;
    var e = 0;
    if (v >= 8) e = 1;
    if (v >= 20) e = 2;
    if (v >= 35) e = 3;
    if (v >= 45 && d >= 40) e = 4;
    if (v >= 60 && d >= 60) e = 5;
    return e;
  }
  function nombreEtapa(s) { return ETAPAS[Math.max(0, Math.min(ETAPAS.length - 1, s.etapa))]; }
  function etiqueta(k) {
    var st = null;
    STATS.forEach(function (x) { if (x.id === k) st = x; });
    return st ? st.label : k;
  }
  function resumen(cambios) {
    return Object.keys(cambios || {}).map(function (k) {
      if (k === "etapa") return "etapa → " + cambios[k];
      var v = cambios[k];
      return etiqueta(k) + " " + (v > 0 ? "+" : "") + fmt(v);
    }).join(" · ");
  }
  function jugador(s) { return (s && s.player) || "el jugador"; }
  // Aplica deltas a la ficha y devuelve lo que de verdad ha cambiado (con topes).
  function aplicar(s, deltas, motivo) {
    var hechos = {};
    Object.keys(deltas || {}).forEach(function (k) {
      if (typeof s.stats[k] !== "number") return;
      var antes = s.stats[k];
      var nuevo = entreCeroCien(antes + tope(deltas[k], TOPE_MOV));
      if (nuevo !== antes) {
        hechos[k] = red1(nuevo - antes);
        state.brinco[k] = Date.now() + 900;
      }
      s.stats[k] = nuevo;
      s.vinculo = red1(s.vinculo + Math.max(0, nuevo - antes));
    });
    var antesEtapa = s.etapa;
    s.etapa = Math.max(s.etapa, etapaQue(s.stats));
    if (s.etapa !== antesEtapa) hechos.etapa = ETAPAS[s.etapa];
    if (motivo) {
      var txt = resumen(hechos);
      if (txt) apuntar(s, motivo, txt);
    }
    guardar();
    return hechos;
  }

  // --- el motor de palabras clave ----------------------------------------------------------------
  var ACENTOS = { "á": "a", "à": "a", "ä": "a", "â": "a", "ã": "a", "é": "e", "è": "e", "ë": "e", "ê": "e", "í": "i", "ì": "i", "ï": "i", "î": "i", "ó": "o", "ò": "o", "ö": "o", "ô": "o", "õ": "o", "ú": "u", "ù": "u", "ü": "u", "û": "u", "ñ": "n", "ç": "c" };
  function norm(t) {
    var s = String(t == null ? "" : t).toLowerCase();
    var out = "";
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      out += ACENTOS[c] || c;
    }
    return out;
  }
  // La raíz de una palabra: quita terminaciones (plurales, gerundios, participios, diminutivos) y
  // la vocal final. Así `beso`, `besos`, `besar` y `besito` caen todos en `bes`. Cada corte se hace
  // solo si aún queda palabra detrás: si no, `quito` se quedaría en `qu` (por el `-ito`).
  function clave(w) {
    w = norm(w).replace(/[^a-z0-9]/g, "");
    function corta(re, min) {
      var t = w.replace(re, "");
      if (t.length >= (min || 4)) w = t;
    }
    corta(/(andose|iendose|ando|iendo)$/, 4);
    corta(/(ados|adas|idos|idas|ado|ada|ido|ida)$/, 4);
    corta(/(arse|erse|irme|arte|arlo|arla|arme|arnos|arlos|arlas)$/, 4);
    corta(/(ar|er|ir)$/, 3);
    corta(/(itos|itas|ito|ita|icos|icas|ico|ica)$/, 4);
    corta(/(ones|os|as|es|s)$/, 3);
    if (w.length > 3 && /[aeo]$/.test(w)) w = w.slice(0, -1);
    return w;
  }
  // ¿Son la misma palabra? Iguales, o una es el principio de la otra. El «principio» solo vale a
  // partir de seis letras: con raíces cortas se colarían parecidos que no tienen nada que ver
  // (`gracias` y `gracioso` caen las dos en `graci…`).
  function mismaPalabra(a, b) {
    if (!a || !b) return false;
    if (a === b) return true;
    if (Math.min(a.length, b.length) < 6) return false;
    var n = 0;
    while (n < a.length && n < b.length && a.charAt(n) === b.charAt(n)) n++;
    return n >= 6 && n >= Math.min(a.length, b.length) - 2 && Math.abs(a.length - b.length) <= 6;
  }
  // Trocea el mensaje conservando la posición de cada letra, para saber después si una palabra cae
  // dentro de `*…*` (acción), de `"…"` (lo que dices), de `( … )` (OOC) o en texto llano.
  function analizar(texto) {
    var s = String(texto == null ? "" : texto);
    var tipo = new Array(s.length);
    var modo = "llano";
    var ooc = 0;
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      if (c === "(") { tipo[i] = "ooc"; ooc++; continue; }
      if (c === ")") { tipo[i] = "ooc"; ooc = Math.max(0, ooc - 1); continue; }
      if (ooc > 0) { tipo[i] = "ooc"; continue; }
      if (c === "*") { tipo[i] = "signo"; modo = modo === "accion" ? "llano" : "accion"; continue; }
      if (c === '"') { tipo[i] = "signo"; modo = modo === "dicho" ? "llano" : "dicho"; continue; }
      tipo[i] = modo;
    }
    var plano = norm(s).replace(/[^a-z0-9]/g, " ");
    var tokens = [];
    var re = /[a-z0-9]{2,}/g;
    var m;
    while ((m = re.exec(plano))) {
      var t = tipo[m.index] || "llano";
      tokens.push({
        w: m[0],
        clave: clave(m[0]),
        pos: m.index,
        tipo: t,
        peso: t === "ooc" ? 0 : (t === "llano" ? 0.5 : 1)
      });
    }
    return { texto: s, tokens: tokens };
  }
  // Busca una alternativa (`beso`) entre los tokens que cuentan (los de OOC no).
  function busca(tokens, alt) {
    var c = clave(alt);
    for (var i = 0; i < tokens.length; i++) {
      var t = tokens[i];
      if (!t.peso) continue;
      if (t.clave === c || mismaPalabra(t.clave, c)) return t;
    }
    return null;
  }
  // ¿Cuadra esta entrada? Devuelve su mejor grupo (el de más palabras) o null.
  function cuadra(entrada, tokens) {
    var mejor = null;
    (entrada.grupos || []).forEach(function (grupo) {
      var total = 0;
      var peso = 1;
      for (var i = 0; i < grupo.length; i++) {
        var hit = null;
        for (var j = 0; j < grupo[i].length && !hit; j++) hit = busca(tokens, grupo[i][j]);
        if (!hit) return;
        if (i === 0) peso = hit.peso;
        total++;
      }
      if (!mejor || total > mejor.slots) mejor = { slots: total, peso: peso };
    });
    return mejor;
  }
  // Lo que mide un mensaje: la entrada que gana (la más específica), con cuánto y con qué peso.
  function medir(texto) {
    var an = analizar(texto);
    if (!an.tokens.length) return { vacio: true, mov: {} };
    var mejor = null;
    tabla().forEach(function (e) {
      var r = cuadra(e, an.tokens);
      if (r && (!mejor || r.slots > mejor.slots)) mejor = { entrada: e, slots: r.slots, peso: r.peso };
    });
    if (!mejor) return { mov: {}, an: an };
    var mov = {};
    Object.keys(mejor.entrada.mov).forEach(function (k) {
      var v = red1(mejor.entrada.mov[k] * mejor.peso);
      if (v) mov[k] = v;
    });
    return { entrada: mejor.entrada, slots: mejor.slots, peso: mejor.peso, mov: mov, an: an };
  }
  function probar(texto) {
    var r = medir(texto);
    if (r.entrada) {
      return "«" + r.entrada.nombre + "» · " + (resumen(r.mov) || "nada") + " · " +
        (r.peso === 1 ? "cuenta entero (acción o diálogo)" : "cuenta la mitad (pensamiento)");
    }
    if (r.vacio || !String(texto || "").trim()) return "escribe una frase…";
    return "ninguna palabra clave conocida";
  }

  // --- la tabla: texto <-> entradas --------------------------------------------------------------
  function deTexto(txt) {
    var out = [];
    String(txt || "").split(/\r?\n/).forEach(function (linea, idx) {
      var l = linea.replace(/^\s+|\s+$/g, "");
      if (!l || l.charAt(0) === "#") return;
      var partes = l.split(":");
      if (partes.length < 2) return;
      var nombre = partes[0].replace(/^\s+|\s+$/g, "");
      var palabras = partes[1];
      var movs = partes.slice(2).join(":");
      var grupos = [];
      palabras.split("|").forEach(function (g) {
        var slots = [];
        g.split("+").forEach(function (sl) {
          var alts = sl.split("/").map(function (a) { return norm(a).replace(/[^a-z0-9]/g, ""); }).filter(Boolean);
          if (alts.length) slots.push(alts);
        });
        if (slots.length) grupos.push(slots);
      });
      var mov = {};
      movs.split(",").forEach(function (m) {
        var r = /^\s*([a-z]+)\s*([+-]?\d+(?:\.\d+)?)\s*$/.exec(norm(m));
        if (!r) return;
        var stat = MOV_ALIAS[r[1]];
        if (!stat) return;
        var v = parseFloat(r[2]);
        if (v) mov[stat] = red1((mov[stat] || 0) + v);
      });
      if (!nombre || !grupos.length || !Object.keys(mov).length) return;
      out.push({ id: "e" + idx, nombre: nombre, grupos: grupos, mov: mov });
    });
    return out;
  }
  function aTexto(tabla) {
    return (tabla || []).map(function (e) {
      var palabras = e.grupos.map(function (g) {
        return g.map(function (sl) { return sl.join("/"); }).join("+");
      }).join(" | ");
      var movs = Object.keys(e.mov).map(function (k) { return k + " " + fmt(e.mov[k]); }).join(", ");
      return e.nombre + " : " + palabras + " : " + movs;
    }).join("\n");
  }
  var tablaCache = null;
  function tabla() {
    if (!tablaCache) {
      var guardada = null;
      try { guardada = localStorage.getItem(PAL_KEY); } catch (e) {}
      tablaCache = deTexto(guardada != null && guardada !== "" ? guardada : TABLA_TEXTO);
      if (!tablaCache.length) tablaCache = deTexto(TABLA_TEXTO);
    }
    return tablaCache;
  }
  function tablaTexto() {
    var guardada = null;
    try { guardada = localStorage.getItem(PAL_KEY); } catch (e) {}
    return guardada != null && guardada !== "" ? guardada : TABLA_TEXTO;
  }
  function setTablaTexto(txt) {
    try { localStorage.setItem(PAL_KEY, String(txt || "")); } catch (e) {}
    tablaCache = null;
  }
  function resetTabla() {
    try { localStorage.removeItem(PAL_KEY); } catch (e) {}
    tablaCache = null;
  }
  function esTablaBase() {
    try { return localStorage.getItem(PAL_KEY) == null; } catch (e) { return true; }
  }

  // --- medir lo que escribe el jugador ------------------------------------------------------------
  function huella(t) { return norm(t).replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "").slice(0, 140); }
  function yaVisto(s, h) {
    if (s.vistos.indexOf(h) >= 0) return true;
    s.vistos.unshift(h);
    if (s.vistos.length > 30) s.vistos.length = 30;
    return false;
  }
  // Procesa un mensaje del jugador: mide, aplica y apunta. Devuelve lo que ha pasado (para el
  // registro y para la ficha).
  function procesar(texto, opts) {
    opts = opts || {};
    var s = ficha();
    if (!s) return null;
    var txt = String(texto == null ? "" : texto);
    var h = huella(txt);
    if (!h) return null;
    if (opts.dedup !== false && yaVisto(s, h)) return { repetido: true, mov: {} };
    var r = medir(txt);
    s.turnos++;
    var hechos = {};
    if (r.entrada && Object.keys(r.mov).length) {
      hechos = aplicar(s, r.mov, null);
      state.ultimo = { nombre: r.entrada.nombre, mov: r.mov, peso: r.peso, at: Date.now() };
      apuntar(s, "palabra", "💗 " + r.entrada.nombre + " — " + resumen(r.mov) +
        (r.peso < 1 ? " (un pensamiento: cuenta la mitad)" : "") +
        (opts.fuente ? " · " + opts.fuente : ""));
    } else if (r.mov && Object.keys(r.mov).length) {
      hechos = aplicar(s, r.mov, null);
      state.ultimo = { nombre: r.entrada ? r.entrada.nombre : "lo que has escrito", mov: r.mov, peso: r.peso || 1, at: Date.now() };
    }
    // la tensión se enfría sola: lo que no se alimenta, se apaga
    if (!r.mov || !r.mov.tension) {
      var antes = s.stats.tension;
      s.stats.tension = entreCeroCien(antes - DECAIMIENTO);
    }
    var antesEtapa = s.etapa;
    s.etapa = Math.max(s.etapa, etapaQue(s.stats));
    if (s.etapa !== antesEtapa) hechos.etapa = ETAPAS[s.etapa];
    guardar();
    if (hechos.etapa) {
      apuntar(s, "etapa", "✨ La relación pasa a «" + hechos.etapa + "»");
      if (s.flags.memAut) refrescarMemoria(s);
    }
    if (s.flags.memAut && !hechos.etapa && s.memoria.texto && s.turnos - (s.memoria.turno || 0) >= 15) refrescarMemoria(s);
    return { entrada: r.entrada, mov: r.mov, hechos: hechos, peso: r.peso, slots: r.slots };
  }

  // --- el enganche con la caja del chat -----------------------------------------------------------
  // La caja del chat no lleva id ni clase estable, así que se busca por forma: el campo de texto
  // visible más grande que esté más abajo de la pantalla (su chat la tiene abajo).
  function cajaDeTexto() {
    var cands = [];
    var nodos = document.querySelectorAll("textarea, input[type=text], [contenteditable='true']");
    var alto = window.innerHeight || 0;
    Array.prototype.forEach.call(nodos, function (n) {
      if (n.closest && n.closest("#em-root")) return;
      if (n.disabled || n.readOnly) return;
      var r = n.getBoundingClientRect();
      if (r.width < 70 || r.height < 14) return;
      var st = getComputedStyle(n);
      if (st.visibility === "hidden" || st.display === "none" || st.opacity === "0") return;
      cands.push({ n: n, area: r.width * r.height, abajo: r.bottom > alto * 0.55 ? 1 : 0, bottom: r.bottom });
    });
    if (!cands.length) return null;
    cands.sort(function (a, b) {
      return (b.abajo - a.abajo) || (b.area - a.area) || (b.bottom - a.bottom);
    });
    return cands[0].n;
  }
  function valorDe(n) {
    if (!n) return "";
    if (n.tagName === "TEXTAREA" || n.tagName === "INPUT") return n.value || "";
    return n.textContent || "";
  }
  function escribirEn(n, texto) {
    n.focus();
    if (n.tagName === "TEXTAREA" || n.tagName === "INPUT") {
      n.value = texto;
    } else {
      try {
        n.textContent = "";
        var sel = window.getSelection();
        var rango = document.createRange();
        rango.selectNodeContents(n);
        rango.collapse(false);
        sel.removeAllRanges();
        sel.addRange(rango);
        document.execCommand("insertText", false, texto);
      } catch (e) {
        n.textContent = texto;
      }
    }
    ["input", "change", "keyup"].forEach(function (ev) {
      try { n.dispatchEvent(new Event(ev, { bubbles: true })); } catch (e) {}
    });
  }
  function pulsarEnviar(n) {
    var form = n.closest ? n.closest("form") : null;
    if (form) {
      if (typeof form.requestSubmit === "function") {
        try { form.requestSubmit(); return "form"; } catch (e) {}
      }
      var b = form.querySelector("button[type=submit]:not([disabled])") ||
        form.querySelector("button:not([disabled])");
      if (b) { b.click(); return "botón del formulario"; }
    }
    var cont = n.parentElement;
    for (var salto = 0; cont && salto < 4; salto++, cont = cont.parentElement) {
      var bots = cont.querySelectorAll("button:not([disabled])");
      for (var i = bots.length - 1; i >= 0; i--) {
        var b2 = bots[i];
        var r = b2.getBoundingClientRect();
        if (r.width < 10 || r.height < 10) continue;
        var pista = ((b2.getAttribute("aria-label") || "") + " " + (b2.title || "") + " " + (b2.className || "")).toLowerCase();
        if (/send|enviar|submit/.test(pista) || b2.querySelector("svg")) {
          b2.click();
          return "botón de enviar";
        }
      }
    }
    try {
      ["keydown", "keypress", "keyup"].forEach(function (tipo) {
        n.dispatchEvent(new KeyboardEvent(tipo, { key: "Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true }));
      });
      return "Enter";
    } catch (e) {
      return "";
    }
  }
  function alPortapapeles(texto) {
    // `writeText` devuelve una promesa que se rechaza si la pestaña no tiene el foco: hay que
    // atraparla, o el rechazo se escapa como error de la página.
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          var p = navigator.clipboard.writeText(texto);
          if (p && p.catch) p.catch(function () {});
          if (!document.hasFocus || document.hasFocus()) return true;
        } catch (e) {}
      }
    } catch (e) {}
    try {
      var t = document.createElement("textarea");
      t.value = texto;
      t.style.position = "fixed";
      t.style.left = "-9999px";
      (document.body || document.documentElement).appendChild(t);
      t.select();
      var ok = document.execCommand("copy");
      t.remove();
      return !!ok;
    } catch (e) {
      return false;
    }
  }
  // Al enviar, se mide lo que iba en la caja. Se engancha UNA vez a la página entera (en captura,
  // así da igual cómo sea su formulario) y se compara el objetivo con la caja del chat.
  var ultimoEnvio = { txt: "", at: 0 };
  function capturar(txt, fuente) {
    var t = String(txt || "").trim();
    if (!t) return null;
    if (ultimoEnvio.txt === t && Date.now() - ultimoEnvio.at < 5000) return null;
    ultimoEnvio.txt = t;
    ultimoEnvio.at = Date.now();
    return procesar(t, { fuente: fuente || "del chat" });
  }
  function alTeclear(e) {
    if (e.key !== "Enter" || e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return;
    var s = ficha();
    if (!s || !s.flags.medir) return;
    var caja = cajaDeTexto();
    if (!caja) return;
    if (!(e.target === caja || (caja.contains && caja.contains(e.target)))) return;
    var txt = valorDe(caja);
    if (!txt.trim()) return;
    setTimeout(function () {
      var r = capturar(txt, "del chat");
      if (r && !r.repetido) gancho();
    }, 0);
  }
  // Un clic: si es el botón de enviar del chat Y la caja se queda vacía justo después, es que el
  // mensaje ha salido de verdad — así no cuenta un clic en cualquier cosa.
  function pareceEnviar(b) {
    var pista = ((b.getAttribute && b.getAttribute("aria-label")) || "") + " " + (b.title || "") + " " + (b.textContent || "");
    if (/send|enviar|mandar|➤|➜|➢|▶|✈|plane/i.test(pista)) return true;
    return !!(b.querySelector && b.querySelector("svg") && (b.textContent || "").trim().length < 12);
  }
  function alClicar(e) {
    var s = ficha();
    if (!s || !s.flags.medir) return;
    var b = e.target && e.target.closest ? e.target.closest("button, [role='button']") : null;
    if (!b || (b.closest && b.closest("#em-root"))) return;
    if (esBotonReiniciar(b)) return;   // su «Reiniciar» no manda ningún mensaje
    var caja = cajaDeTexto();
    if (!caja) return;
    var suyo = caja.closest ? caja.closest("form") : null;
    if (!(suyo && b.closest("form") === suyo) && !pareceEnviar(b)) return;
    var txt = valorDe(caja);
    if (!txt.trim()) return;
    setTimeout(function () {
      if (valorDe(caja).trim()) return;   // sigue ahí: no se ha enviado nada
      var r = capturar(txt, "del chat");
      if (r && !r.repetido) gancho();
    }, 350);
  }
  // --- reiniciar su chat --------------------------------------------------------------------------
  // El botón de reiniciar de su chat no lleva id ni clase estable (sus clases son utilidades de
  // Tailwind y cambian), pero sí `aria-label="Reiniciar"` y un <span> con ese texto. Eso es lo que
  // no cambia, así que se busca por ahí primero: manda el `aria-label`. El texto solo vale como
  // último recurso y con la forma de su botón (con svg), para no pulsar el «Reiniciar» de un
  // formulario cualquiera.
  function ariaReiniciar(b) {
    if (!b || !b.getAttribute) return false;
    var pista = ((b.getAttribute("aria-label") || "") + " " + (b.getAttribute("title") || "")).replace(/\s+/g, " ").trim();
    return /^(reiniciar|restart)\b/i.test(pista);
  }
  function textoReiniciar(b) {
    if (!b || !b.getAttribute) return false;
    if ((b.getAttribute("aria-label") || "").trim()) return false;   // eso ya lo mira ariaReiniciar
    var txt = (b.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
    if (!/^(reiniciar|restart|nueva conversaci[oó]n|empezar de nuevo)\b/.test(txt)) return false;
    return !!b.querySelector("svg");   // la forma de su tarjeta de reiniciar
  }
  function esBotonReiniciar(b) { return ariaReiniciar(b) || textoReiniciar(b); }
  function seVe(n) {
    if (!n) return false;
    var r = n.getBoundingClientRect();
    if (r.width < 6 || r.height < 6) return false;
    var st = getComputedStyle(n);
    return st.visibility !== "hidden" && st.display !== "none" && st.opacity !== "0";
  }
  // Orden: primero el suyo de verdad. Su tarjeta lleva el aria-label («Reiniciar»), un <span> con
  // ese texto, un svg grande y los ids de la propia tarjeta (`restart-card_svg__…`), así que se
  // puntúan esas señales y se pulsa la que más tiene: los visibles, y a igualdad, el aria-label.
  function botonesReiniciar() {
    var nodos = document.querySelectorAll("button, [role='button']");
    var lista = [];
    Array.prototype.forEach.call(nodos, function (n) {
      if (n.closest && n.closest("#em-root")) return;
      var aria = ariaReiniciar(n), txt = textoReiniciar(n);
      if (!aria && !txt) return;
      var r = n.getBoundingClientRect();
      var html = n.innerHTML || "";
      var puntos = 0;
      if (/restart-card/i.test(html)) puntos += 8;      // los ids de su propia tarjeta
      if (aria) puntos += 4;
      if (seVe(n)) puntos += 2;
      if (r.height >= 56 && r.width >= 56) puntos += 1;  // su tarjeta es alta, no un botoncito
      if (txt) puntos += 1;
      lista.push({ n: n, puntos: puntos, orden: lista.length });
    });
    lista.sort(function (a, b) { return (b.puntos - a.puntos) || (a.orden - b.orden); });
    return lista.map(function (x) { return x.n; });
  }
  function botonReiniciar() { return botonesReiniciar()[0] || null; }
  // A veces su tarjeta no está montada hasta que se abre su menú (React la quita del DOM). Para eso
  // está la vigilancia: se le dice que abra el menú, y en cuanto la tarjeta aparezca **visible**, se
  // pulsa sola (o se rinde a los 20 s sin tocar nada). Volver a pulsar «♻» cancela la espera.
  var relojReinicio = null;
  function pararVigilancia(motivo) {
    if (!relojReinicio) return false;
    clearInterval(relojReinicio);
    relojReinicio = null;
    state.vigilando = false;
    if (motivo) aviso(motivo, false);
    render();
    return true;
  }
  function vigilarReiniciar(ms) {
    pararVigilancia("");
    var fin = Date.now() + (ms || 20000);
    state.vigilando = true;
    var s = ficha();
    if (s) { apuntar(s, "nota", "esperando su menú de «Reiniciar»"); guardar(); }
    aviso("♻ Abre su menú de «Reiniciar» y lo pulso yo en cuanto salga (20 s). Vuelve a pulsar «♻» para que no espere más.", false);
    render();
    relojReinicio = setInterval(function () {
      var bots = botonesReiniciar();
      var b = bots[0];
      if (b && seVe(b)) {
        clearInterval(relojReinicio);
        relojReinicio = null;
        state.vigilando = false;
        pulsarReiniciar({ confirmar: false, vigilado: true });
      } else if (Date.now() > fin) {
        clearInterval(relojReinicio);
        relojReinicio = null;
        state.vigilando = false;
        aviso("♻ No ha salido su «Reiniciar» y ya no espero: no he tocado nada.", true);
        render();
      }
    }, 300);
    return { ok: false, why: "esperando", vigilando: true };
  }
  function reiniciarChat() {
    if (relojReinicio) {
      pararVigilancia("♻ Ya no espero: dime otra vez si lo quieres.");
      return { ok: false, why: "cancelado por el usuario" };
    }
    var s = ficha();
    if (!window.confirm("¿Reiniciar el chat con " + ((s && s.bot) || "el bot") + "?\n\nSe borra su conversación (la ficha 💗 y las barras no se tocan).")) {
      return { ok: false, why: "cancelado" };
    }
    return reiniciarSinPreguntar();
  }
  // Ya confirmado por quien llama: se pulsa si está, y si su menú todavía no lo ha montado, se espera.
  function reiniciarSinPreguntar() {
    var b = botonReiniciar();
    if (b) return pulsarReiniciar({ confirmar: false });
    return vigilarReiniciar(20000);
  }
  // Pulsa su botón de «Reiniciar». Si está escondido dentro de un menú suyo se pulsa igual (su
  // React tiene el manejador puesto); si no está en la página (menú sin montar), se dice claro.
  function pulsarReiniciar(opts) {
    var o = opts || {};
    var s = ficha();
    var bots = botonesReiniciar();
    var b = bots[0] || null;
    if (!b) {
      aviso("♻ Todavía no veo su botón de «Reiniciar»: abre el menú del chat donde esté y vuelve a pulsar «♻ Reiniciar el chat».", true);
      render();
      return { ok: false, why: "sin botón" };
    }
    var oculto = !seVe(b);
    if (o.confirmar !== false) {
      var texto = "¿Reiniciar el chat con " + ((s && s.bot) || "el bot") + "?\n\nSe borra su conversación (la ficha 💗 y las barras no se tocan).";
      if (oculto) texto += "\n\n(Ahora mismo su botón está oculto: lo pulso igual.)";
      if (!window.confirm(texto)) return { ok: false, why: "cancelado" };
    }
    try {
      b.click();
    } catch (e) {
      aviso("♻ No he podido pulsarlo: " + (e && e.message), true);
      render();
      return { ok: false, why: "error" };
    }
    if (s) {
      apuntar(s, "nota", "chat reiniciado" + (oculto ? " (su botón estaba oculto)" : ""));
      guardar();
    }
    aviso(oculto
      ? "♻ He pulsado su «Reiniciar» (estaba oculto, dentro de un menú suyo). Si el chat no se ha vaciado, ábreme ese menú y dale otra vez."
      : "♻ Chat reiniciado: con este bot se empieza de cero." + (bots.length > 1 ? " (Había " + bots.length + " botones así y he pulsado el primero.)" : ""), false);
    render();
    return { ok: true, oculto: oculto, n: bots.length };
  }

  function gancho() {
    aviso("", false);
    render();
    colocar();
  }
  function ganchos() {
    document.addEventListener("keydown", alTeclear, true);
    document.addEventListener("click", alClicar, true);
  }

  // --- leer el chat de la pantalla (lo que de verdad hay) -----------------------------------------
  // Su chat pinta cada mensaje en una fila que se distingue por `justify-end` (tú) o `justify-start`
  // (el bot), y cada fila trae su menú «⋯» — `button[data-part="trigger"][data-scope="menu"]` —, que
  // sirve de ancla (hay uno por mensaje). La burbuja es el `div` con `border-radius` en línea.
  // Y se reconstruyen los asteriscos que su markdown se ha comido (`<em>` → *así*, `<strong>` →
  // **así**): es justo lo que distingue una acción (cuenta entero) de un pensamiento (la mitad).
  function textoDeBurbuja(el) {
    if (!el) return "";
    var out = "";
    var anda = function (n) {
      if (n.nodeType === 3) { out += n.nodeValue; return; }
      if (n.nodeType !== 1) return;
      var t = n.tagName;
      if (t === "BR") { out += " "; return; }
      var marca = t === "EM" || t === "I" ? "*"
        : t === "STRONG" || t === "B" ? "**"
        : t === "CODE" ? "`"
        : t === "DEL" || t === "S" ? "~~" : "";
      if (marca) out += marca;
      Array.prototype.forEach.call(n.childNodes, anda);
      if (marca) out += marca;
    };
    anda(el);
    return out.replace(/\s+/g, " ").trim();
  }
  function claseDe(n) { return (n && typeof n.className === "string") ? n.className : ""; }
  // La fila del mensaje. Ojo: la barrita del menú también lleva `justify-center`, así que la fila de
  // verdad es la que va con `justify-end`/`justify-start` **y** `w-full` (como la suya).
  function filaDeMensaje(nodo) {
    var n = nodo, otra = null;
    for (var i = 0; n && i < 9; i++, n = n.parentElement) {
      var c = claseDe(n);
      if (!/justify-(end|start)\b/.test(c)) continue;
      if (/\bw-full\b/.test(c)) return n;
      if (!otra) otra = n;
    }
    return otra;
  }
  // La burbuja: de las cajas con esquinas redondeadas de la fila, la que más texto tenga.
  function burbujaDe(fila) {
    var divs = fila.querySelectorAll('[style*="border-radius"], [style*="borderRadius"]');
    var mejor = null, largo = 0;
    Array.prototype.forEach.call(divs, function (d) {
      var t = textoDeBurbuja(d);
      if (t.length > largo) { largo = t.length; mejor = d; }
    });
    return (mejor && largo > 0) ? mejor : fila;
  }
  // Los mensajes que hay ahora mismo en el chat, de arriba abajo.
  function mensajesDeLaPantalla() {
    var filas = [], vistos = [], i;
    var guarda = function (n) {
      if (!n || n.closest("#em-root")) return;
      if (vistos.indexOf(n) !== -1) return;
      vistos.push(n);
      filas.push(n);
    };
    var anclas = document.querySelectorAll("button[data-part='trigger'], button[data-scope='menu']");
    Array.prototype.forEach.call(anclas, function (b) { guarda(filaDeMensaje(b)); });
    if (!filas.length) {
      // por si su menú cambiara de forma: cualquier burbuja con texto que esté en una fila alineada
      var cajas = document.querySelectorAll('[style*="border-radius"], [style*="borderRadius"]');
      Array.prototype.forEach.call(cajas, function (d) { if (textoDeBurbuja(d)) guarda(filaDeMensaje(d)); });
    }
    for (i = 0; i < filas.length; i++) {
      filas[i].__emArriba = filas[i].getBoundingClientRect().top;   // el orden del DOM no vale con su virtualización
    }
    filas.sort(function (a, b) { return a.__emArriba - b.__emArriba; });
    return filas.map(function (f) {
      return { yo: /justify-end/.test(claseDe(f)), txt: textoDeBurbuja(burbujaDe(f)), fila: f };
    });
  }
  // Mide una lista de mensajes del jugador ([{txt}]) y devuelve el resumen de siempre.
  function medirLista(s, lista, fuente, leidos) {
    var nuevos = 0, movidos = {};
    lista.slice(-24).forEach(function (m) {
      var txt = String((m && m.txt) || "").trim();
      if (!txt) return;
      var h = huella(txt);
      if (!h || yaVisto(s, h)) return;
      var r = medir(txt);
      s.turnos++;
      if (r.entrada && Object.keys(r.mov).length) {
        var hechos = aplicar(s, r.mov, null);
        Object.keys(hechos).forEach(function (k) { movidos[k] = red1((movidos[k] || 0) + hechos[k]); });
        apuntar(s, "palabra", "💗 " + r.entrada.nombre + " — " + resumen(r.mov) + " · " + fuente);
      }
      nuevos++;
    });
    if (!nuevos) return { ok: false, why: "sin mensajes nuevos tuyos", n: 0, vistos: leidos };
    var antesEtapa = s.etapa;
    s.etapa = Math.max(s.etapa, etapaQue(s.stats));
    if (s.etapa !== antesEtapa) {
      movidos.etapa = ETAPAS[s.etapa];
      apuntar(s, "etapa", "✨ La relación pasa a «" + ETAPAS[s.etapa] + "»");
      if (s.flags.memAut) refrescarMemoria(s);
    }
    guardar();
    render();
    return { ok: true, n: nuevos, cambios: movidos, vistos: leidos };
  }

  // --- leer el chat por su API (red de seguridad, si en pantalla no hay nada) ---------------------
  // Se busca en el JSON del historial cualquier lista de mensajes (objetos con `role` y `content`),
  // porque la forma exacta de la respuesta no la conocemos: así da igual cómo venga envuelto.
  function sacarMensajes(obj, out, hondo) {
    out = out || [];
    hondo = hondo || 0;
    if (!obj || typeof obj !== "object" || hondo > 7 || out.length > 400) return out;
    if (Array.isArray(obj)) {
      var parece = obj.length && obj.every(function (x) {
        return x && typeof x === "object" && ("content" in x) && ("role" in x);
      });
      if (parece) {
        Array.prototype.push.apply(out, obj);
        return out;
      }
      obj.forEach(function (x) { sacarMensajes(x, out, hondo + 1); });
      return out;
    }
    Object.keys(obj).forEach(function (k) { sacarMensajes(obj[k], out, hondo + 1); });
    return out;
  }
  function leer() {
    var s = ficha();
    if (!s) return Promise.resolve({ ok: false, why: "abre el chat de un bot y espera un segundo" });
    // 1) lo que hay en pantalla: es lo que ves, y siempre está
    var filas = mensajesDeLaPantalla();
    var mios = filas.filter(function (m) { return m.yo && m.txt; });
    if (mios.length) return Promise.resolve(medirLista(s, mios, "de la pantalla", filas.length));
    if (!s.promptId) {
      return Promise.resolve({
        ok: false,
        why: filas.length ? "no veo mensajes tuyos en el chat" : "no veo el chat: abre la conversación con el bot"
      });
    }
    // 2) su API, de reserva
    if (cola) return Promise.resolve({ ok: false, why: "ya estaba leyendo" });
    cola = true;
    return EM.api.historial(s.promptId)
      .catch(function () { return EM.api.historialV1(s.promptId); })
      .catch(function () { return EM.api.ultimaConversacion(s.promptId); })
      .then(function (res) {
        cola = false;
        state.raw = JSON.stringify(res).slice(0, 6000);
        var msgs = sacarMensajes(res);
        var suyos = msgs.filter(function (m) {
          return /user|human/i.test(String((m && m.role) || ""));
        }).map(function (m) {
          var t = String((m && (m.content || m.displayContent)) || "");
          if (/<[a-z][\s\S]*>/i.test(t)) {          // si viene en HTML, se le devuelven los asteriscos
            var caja = document.createElement("div");
            caja.innerHTML = t;
            t = textoDeBurbuja(caja);
          }
          return { txt: t };
        });
        if (!suyos.length) {
          return { ok: false, why: "no veo tus mensajes ni en el chat ni en el historial (" + msgs.length + " mensajes leídos de su API)" };
        }
        return medirLista(s, suyos, "del historial", msgs.length);
      })
      .catch(function (e) {
        cola = false;
        return { ok: false, why: "no pude leer el historial: " + (e && e.message) };
      });
  }

  // --- la nota que se le deja al bot en SU memoria ------------------------------------------------
  // Nada de marcadores: una nota OOC entre paréntesis con el estado, la etapa y el tono. Es lo
  // único que el modelo lee en *todos* los mensajes, así que aquí va lo que de verdad importa.
  function estadoLinea(s) {
    var st = s.stats;
    return "(OOC · partida de rol) afecto " + fmt(st.afecto) + "/100 · confianza " + fmt(st.confianza) +
      "/100 · deseo " + fmt(st.deseo) + "/100 · tensión " + fmt(st.tension) + "/100 · etapa " +
      nombreEtapa(s) + " · " + s.turnos + " mensajes";
  }
  function reglas(s) {
    var jug = jugador(s);
    var lista = ETAPAS.join(" → ");
    return [
      "(Nota OOC — esto es para ti: no lo menciones, no lo cites y no lo trates como parte de la historia.)",
      "Esta conversación lleva una partida de rol de amor/odio. Cuatro valores de 0 a 100:",
      "· afecto: cuánto te gusta " + jug + " · confianza: cuánto te fías de él/ella",
      "· deseo: cuánto te atrae ahora mismo · tensión: la carga que hay en el aire.",
      "Ahora mismo: afecto " + fmt(s.stats.afecto) + ", confianza " + fmt(s.stats.confianza) + ", deseo " +
        fmt(s.stats.deseo) + ", tensión " + fmt(s.stats.tension) + ". Etapa: " + nombreEtapa(s) + ".",
      "Escribe SIEMPRE en ese tono: " + (ETAPA_TIP[nombreEtapa(s)] || "") + ".",
      "La etapa sube sola cuando la relación madura (" + lista + "); cuando suba, cambia el tono poco a poco.",
      s.flags.explicito
        ? "El contenido adulto está permitido: cuando el deseo y la tensión estén altos, describe la escena íntima con detalle y sin cortarte."
        : "Las escenas íntimas se insinúan: sin descripción explícita.",
      "No decidas por " + jug + " ni escribas sus actos, pensamientos o diálogos: solo los tuyos."
    ].join("\n");
  }
  // El texto completo (el que se manda al chat con ✍, que no tiene tope) y el reducido.
  function memoriaTexto(s) {
    return estadoLinea(s) + "\n" + reglas(s);
  }
  // La nota que cabe en la memoria del bot: se arma por piezas y se van cayendo las menos
  // importantes hasta que cabe. El estado y el tono nunca se caen.
  function minimo(s, topeMax) {
    topeMax = topeMax || LIMITE_MEM;
    var st = s.stats;
    var cab = "(Nota OOC, no la menciones: partida · afecto " + fmt(st.afecto) + " · confianza " +
      fmt(st.confianza) + " · deseo " + fmt(st.deseo) + " · tensión " + fmt(st.tension) +
      " · etapa " + nombreEtapa(s) + ".";
    var nucleo = " Tu tono: " + (TIP_CORTO[nombreEtapa(s)] || ETAPA_TIP[nombreEtapa(s)] || "") + ".)";
    var extras = [
      { p: 1, t: " No decidas por " + jugador(s) + "." },
      { p: 2, t: " Íntimas: " + (s.flags.explicito ? "explícitas" : "solo insinuadas") + "." },
      { p: 3, t: " Etapas: " + ETAPAS.join("→") + "." }
    ].sort(function (a, b) { return a.p - b.p; });
    var usados = extras.slice();
    function largo() {
      var t = cab + nucleo;
      usados.forEach(function (e) { t += e.t; });
      return t.length;
    }
    while (usados.length && largo() > topeMax) usados.pop();
    var out = cab + nucleo;
    usados.forEach(function (e) { out += e.t; });
    return out.length > topeMax ? recortaA(out, topeMax) : out;
  }
  function recortaA(t, topeMax) {
    t = String(t || "");
    if (!topeMax || t.length <= topeMax) return t;
    var corte = t.slice(0, topeMax - 1);
    var esp = corte.lastIndexOf(" ");
    if (esp > topeMax * 0.6) corte = corte.slice(0, esp);
    return corte.replace(/[\s,;·:]+$/, "") + "…";
  }
  // Los textos que se intentan, de más rico a más corto. Si ya sabemos su tope, no se prueba lo
  // que no cabe (y así no se le manda al servidor una petición condenada).
  function candidatos(s) {
    var real = s.memoria.tope || 0;
    var corto = minimo(s, real || LIMITE_MEM);
    var probarLargo = real ? real > LIMITE_MEM : (s.memoria.rico > LIMITE_MEM || s.flags.larga);
    var out = [];
    if (probarLargo && (!real || memoriaTexto(s).length <= real)) out.push(memoriaTexto(s));
    out.push(corto);
    return out.filter(function (t, i) { return out.indexOf(t) === i; });
  }
  function memoriaBot(s) { return candidatos(s)[0]; }
  function esGrande(s) { return (s.memoria.tope || s.memoria.rico || 0) > LIMITE_MEM; }

  // --- escribir en la memoria del bot -------------------------------------------------------------
  // Se guarda antes lo que había (para poder devolverlo) y se prueba el campo `memory` (el suyo:
  // su error de validación pedía `memory` por su nombre); si el servidor contesta que ese campo no
  // existe, se prueban otros nombres. Si contesta que el texto es largo, se APRENDE el tope (viene
  // en su propio mensaje: "max length is 300") y se reintenta más corto.
  var CAMPOS = ["memory", "content", "text", "memoryText", "remark"];
  function topeDelError(msg) {
    var m = /max(?:imum)?\s*length\s*is\s*(\d+)/i.exec(String(msg || ""));
    return m ? parseInt(m[1], 10) : 0;
  }
  function escribir(s, texto, i, errores) {
    i = i || 0;
    errores = errores || [];
    if (i >= CAMPOS.length) {
      return Promise.resolve({ ok: false, why: "el servidor no aceptó ninguno de estos campos: " + CAMPOS.join(", "), errores: errores });
    }
    return EM.api.ponMemoriaDeBot(s.promptId, CAMPOS[i], texto).then(function (res) {
      s.memoria.campo = CAMPOS[i];
      s.memoria.texto = texto;
      s.memoria.at = Date.now();
      s.memoria.etapa = s.etapa;
      s.memoria.turno = s.turnos;
      s.memoria.error = "";
      apuntar(s, "memoria", "nota escrita en la memoria de " + (s.bot || "el bot") + " (" + texto.length + " caracteres, campo `" + CAMPOS[i] + "`)");
      guardar();
      render();
      return { ok: true, campo: CAMPOS[i], res: res, length: texto.length };
    }).catch(function (e) {
      var msg = (e && e.message) || "";
      if (/sin sesi[oó]n|\(401\)|\(403\)/.test(msg)) {
        return { ok: false, why: "necesitas entrar en emochi.com con tu cuenta: sin sesión no puedo tocar la memoria del bot", sesion: true, errores: errores };
      }
      var topeAprendido = topeDelError(msg);
      if (topeAprendido) return { ok: false, largo: true, tope: topeAprendido, why: msg, errores: errores };
      errores.push(CAMPOS[i] + " → " + msg);
      return escribir(s, texto, i + 1, errores);
    });
  }
  function escribirConAjuste(s) {
    var cands = candidatos(s);
    var errores = [];
    var bajo = false;
    function intento(i) {
      if (i >= cands.length) {
        return Promise.resolve({ ok: false, why: "ni la versión corta cabe en la memoria de este bot", errores: errores });
      }
      var texto = cands[i];
      return escribir(s, texto, 0, errores).then(function (r) {
        if (r.ok) {
          r.ajustado = bajo;
          if (r.length > (s.memoria.rico || 0)) { s.memoria.rico = r.length; guardar(); }
          return r;
        }
        if (r.largo && !bajo) {
          bajo = true;
          s.memoria.tope = r.tope || LIMITE_MEM;
          store.tope = s.memoria.tope;   // el tope es de su cuenta: vale para todos sus bots
          guardar();
          var cabe = cands.slice(i + 1).filter(function (t) { return t.length <= s.memoria.tope; });
          if (!cabe.length) cabe = [minimo(s, s.memoria.tope)];
          cands = cabe;
          return intento(0);
        }
        return r;
      });
    }
    return intento(0);
  }
  function inyectar() {
    var s = ficha();
    if (!s || !s.promptId) {
      aviso("Abre el chat de un bot (o mándale un mensaje) y en un segundo sabré cuál es: entonces podré escribir en su memoria.", true);
      render();
      return Promise.resolve({ ok: false, why: "todavía no sé con qué bot juegas" });
    }
    state.busy = true;
    render();
    return EM.api.memoriaDeBot(s.promptId).then(function (res) {
      if (s.memoria.original == null) {
        var previo = textoDeMemoria(res);
        s.memoria.original = previo == null ? "" : previo;
        guardar();
      }
      return escribirConAjuste(s);
    }).catch(function (e) {
      var msg = (e && e.message) || "";
      if (/sin sesi[oó]n|\(401\)|\(403\)/.test(msg)) {
        return { ok: false, why: "necesitas entrar en emochi.com con tu cuenta: sin sesión no puedo ni leer ni escribir la memoria del bot", sesion: true };
      }
      return escribirConAjuste(s).then(function (r) {
        if (r.ok) return r;
        return { ok: false, why: "leer la memoria falló (" + msg + ") y escribir tampoco: " + r.why, errores: r.errores };
      });
    }).then(function (r) {
      state.busy = false;
      aviso(r.ok
        ? "🧠 Nota dentro de su memoria (campo `" + r.campo + "`, " + r.length + " caracteres" +
          (r.ajustado ? " · versión reducida: su servidor deja " + (s.memoria.tope || LIMITE_MEM) + ", así que lo demás va con ✍" : "") + ")."
        : "No pude inyectar: " + r.why, !r.ok, r.errores);
      render();
      return r;
    });
  }
  // Refresco silencioso (el que se hace solo cuando cambia la etapa): no toca el aviso.
  function refrescarMemoria(s) {
    if (!s || !s.promptId || state.busy) return;
    state.busy = true;
    EM.api.memoriaDeBot(s.promptId).then(function (res) {
      if (s.memoria.original == null) s.memoria.original = textoDeMemoria(res) || "";
      return escribirConAjuste(s);
    }).catch(function () {
      return null;
    }).then(function (r) {
      state.busy = false;
      if (r && r.ok) {
        aviso("🔄 La nota del bot se ha puesto al día sola (" + r.length + " caracteres).", false);
      }
      render();
    });
  }
  function quitar() {
    var s = ficha();
    if (!s || !s.promptId) {
      aviso("Abre el chat de un bot y espera un segundo: necesito saber cuál es para devolverle su memoria.", true);
      render();
      return Promise.resolve({ ok: false, why: "todavía no sé con qué bot juegas" });
    }
    if (s.memoria.original == null) return Promise.resolve({ ok: false, why: "no guardé la memoria que había antes: mírala y quítala a mano" });
    state.busy = true;
    render();
    return EM.api.ponMemoriaDeBot(s.promptId, s.memoria.campo || "memory", s.memoria.original).then(function () {
      s.memoria.texto = "";
      s.memoria.at = 0;
      s.memoria.etapa = -1;
      apuntar(s, "memoria", "memoria del bot devuelta a como estaba");
      guardar();
      state.busy = false;
      aviso("🧹 Memoria devuelta a como estaba.", false);
      render();
      return { ok: true };
    }).catch(function (e) {
      state.busy = false;
      aviso("No pude devolverla: " + (e && e.message), true);
      render();
      return { ok: false, why: e && e.message };
    });
  }
  function textoDeMemoria(res) {
    if (res == null) return "";
    if (typeof res === "string") return res;
    var encontrado = null;
    ["memory", "content", "text", "memoryText", "remark"].forEach(function (k) {
      if (encontrado == null && typeof res[k] === "string") encontrado = res[k];
    });
    if (encontrado == null && res.data != null) encontrado = textoDeMemoria(res.data);
    return encontrado == null ? "" : encontrado;
  }
  function tokens() {
    var s = ficha();
    if (!s || !s.promptId) return Promise.resolve(null);
    return EM.api.memoriaTokens(s.promptId, "").catch(function () { return null; });
  }
  // Plan B: el texto completo se deja escrito en la caja del chat, para mandarlo como primer
  // mensaje (esa nota no tiene el tope de 300).
  function ponerEnElChat() {
    var s = ficha();
    if (!s) {
      aviso("Abre el chat de un bot y espera un segundo.", true);
      render();
      return { ok: false, why: "sin bot" };
    }
    var texto = recortaA(memoriaTexto(s), LIMITE_CHAT);
    var caja = cajaDeTexto();
    if (!caja) {
      var copiado = alPortapapeles(texto);
      aviso(copiado ? "No encontré la caja del chat: te lo he copiado al portapapeles; pégalo como primer mensaje." : "No encontré la caja del chat.", true);
      render();
      return { ok: false, why: "sin caja" };
    }
    escribirEn(caja, texto);
    if (s.flags.autoenviar) pulsarEnviar(caja);
    apuntar(s, "memoria", "nota completa puesta en la caja del chat");
    guardar();
    aviso("✍ Nota completa en el chat. (Quedará en el historial; si puedes, mejor inyéctala en su memoria.)", false);
    render();
    return { ok: true };
  }

  // --- dónde vive la ficha: pegada a la izquierda de la columna del chat --------------------------
  // La columna del chat se saca de la caja de texto (que ya sabemos encontrar): se sube por sus
  // antepasados hasta dar con el que es de verdad más alto que ella. Así no hace falta conocer
  // ninguna clase de su web. Se guarda un segundo de memoria, que esto se repite a menudo.
  var colCache = { at: 0, col: null };
  function columnaChat(fresco) {
    if (fresco) colCache.at = 0;
    if (Date.now() - colCache.at < 1000) return colCache.col;
    colCache.at = Date.now();
    colCache.col = calcularColumna();
    return colCache.col;
  }
  function calcularColumna() {
    var caja = cajaDeTexto();
    if (!caja) return null;
    var rc = caja.getBoundingClientRect();
    if (rc.width < 80) return null;
    var vw = window.innerWidth || 1200;
    var n = caja.parentElement;
    for (var i = 0; n && n !== document.body && i < 10; i++, n = n.parentElement) {
      var r = n.getBoundingClientRect();
      if (r.height > rc.height + 120 && r.width < vw * 0.94 && r.width >= rc.width) {
        return { left: r.left, right: r.right, top: r.top, bottom: Math.max(rc.bottom, r.bottom - 8), caja: caja };
      }
    }
    // sin columna clara: se toma la caja y se sube un trecho hacia arriba (queda bien igual)
    return { left: rc.left, right: rc.right, top: Math.max(8, rc.top - 340), bottom: rc.bottom, caja: caja };
  }
  // Coloca la ficha: a la izquierda de la columna del chat, con su misma altura, y si no hay sitio
  // (o no encuentro el chat) se queda a la izquierda de la pantalla. Es `position: fixed`, así que
  // no depende de dónde nos cuelgue su React.
  function colocar(fresco) {
    var d = state.dock;
    if (!d) return;
    var vw = window.innerWidth || 1200;
    var vh = window.innerHeight || 800;
    // En pantalla estrecha no hay sitio para la ficha entera: se queda plegada (y quien la quiera
    // abrir, la abre: en cuanto la toca a mano, manda su gusto).
    if (!state.aMano) {
      var quieroPlegada = vw < 760;
      if (quieroPlegada !== state.colapsado) {
        state.colapsado = quieroPlegada;
        render();
      }
    }
    var col = columnaChat(!!fresco);
    var left, top, alto;
    if (col) {
      // La barra lateral de su web ocupa el borde izquierdo: si entre ella y la columna del chat
      // hay sitio, la ficha va ahí (que es donde el jugador la espera); si no lo hay, se pone al
      // borde de la pantalla, por encima de la barra (y se puede plegar para verla).
      var limite = Math.max(8, barraIzquierda(col.left) + 8);
      var libre = Math.round(col.left - 12 - limite);
      var ancho;
      if (state.colapsado) {
        ancho = 34;
        left = Math.max(limite, col.left - 12 - ancho);
      } else if (libre >= 138) {
        ancho = Math.min(state.ancho || ANCHO, libre);
        left = Math.round(col.left - 12 - ancho);
      } else {
        ancho = Math.min(state.ancho || ANCHO, Math.max(140, Math.round(col.left - 20)));
        left = 8;
      }
      if (!state.colapsado) state.anchoPuesto = ancho;
      top = Math.round(Math.max(8, col.top));
      alto = Math.round(Math.min(vh - top - 16, Math.max(240, col.bottom - top)));
      if (left < 110) alto = Math.min(alto, vh - top - 92);   // no pisar el botón flotante
      alto = Math.max(160, alto);
      d.style.width = ancho + "px";
    } else {
      left = 8;
      top = 72;
      alto = Math.max(160, Math.round(Math.min(vh - 168, 460)));
      d.style.width = (state.colapsado ? 34 : (state.ancho || ANCHO)) + "px";
    }
    d.style.left = left + "px";
    d.style.top = top + "px";
    d.style.height = alto + "px";
    d.style.maxHeight = alto + "px";
  }
  // Hasta dónde llega la barra lateral de su web (si es que hay una): un elemento pegado al borde
  // izquierdo, de casi toda la altura de la pantalla y estrecho.
  function barraIzquierda(limite) {
    var mejor = 0;
    var vh = window.innerHeight || 0;
    var vw = window.innerWidth || 1200;
    var nodos = document.querySelectorAll("aside, nav, [class*='sidebar'], [class*='Sidebar']");
    for (var i = 0; i < nodos.length && i < 40; i++) {
      var n = nodos[i];
      if (n.closest && n.closest("#em-root")) continue;
      var st = getComputedStyle(n);
      if (st.position !== "fixed" && st.position !== "absolute" && st.position !== "sticky") continue;
      if (st.visibility === "hidden" || st.display === "none") continue;
      var r = n.getBoundingClientRect();
      if (r.width < 20 || r.width > vw * 0.45) continue;
      if (r.height < vh * 0.7) continue;
      if (r.left > limite) continue;
      if (r.right > mejor) mejor = r.right;
    }
    return mejor;
  }

  // --- la interfaz de la ficha --------------------------------------------------------------------
  function btn(text, cls, onclick, extra) {
    return el("button", Object.assign({ type: "button", class: cls || "em-btn", text: text, onclick: onclick }, extra || {}));
  }
  function barra(id) {
    var s = state.sheet;
    var st = null;
    STATS.forEach(function (x) { if (x.id === id) st = x; });
    var v = s ? s.stats[id] || 0 : 0;
    var brinco = state.brinco[id] && state.brinco[id] > Date.now();
    var fila = el("div", { class: "em-stat" + (brinco ? " em-stat-bump" : "") }, [
      el("span", { class: "em-stat-ico", text: (st && st.icon) || "" }),
      el("span", { class: "em-stat-name", text: (st && st.label) || id }),
      el("span", { class: "em-bar" }, [el("i", { class: "em-bar-fill", style: { width: Math.max(0, Math.min(100, v)) + "%" } })]),
      el("b", { class: "em-stat-num", text: fmt(v) })
    ]);
    return fila;
  }
  function interruptor(id, text, titulo) {
    var s = state.sheet;
    var on = !!(s && s.flags[id]);
    return btn((on ? "✓ " : "· ") + text, "em-toggle" + (on ? " em-toggle-on" : ""), function () {
      var f = ficha();
      if (!f) return;
      f.flags[id] = !f.flags[id];
      guardar();
      render();
    }, { title: titulo || text });
  }
  function details(titulo, abierto) {
    var d = el("details", { class: "em-det" });
    if (abierto) d.setAttribute("open", "");
    d.appendChild(el("summary", { text: titulo }));
    return d;
  }
  // Un bloque plegable que recuerda si estaba abierto: al abrirlo se pinta su contenido y al
  // cerrarlo se quita (así el textarea de las palabras no se queda por medio).
  function plegable(titulo, clave) {
    var d = details(titulo, state.seccion === clave);
    d.addEventListener("toggle", function () {
      var nuevo = d.open ? clave : "";
      if (nuevo !== state.seccion) {
        state.seccion = nuevo;
        render();
      }
    });
    return d;
  }

  function vista() {
    var out = el("div", { class: "em-dock-in" });
    var s = state.sheet;

    // cabecera: plegar, el bot, y atajos
    out.appendChild(el("div", { class: "em-dock-head" }, [
      btn(state.colapsado ? "▶" : "◀", "em-icon em-dock-fold", function () {
        state.colapsado = !state.colapsado;
        state.aMano = true;
        render();
        colocar();
      }, { title: state.colapsado ? "Desplegar la ficha" : "Plegar la ficha" }),
      el("div", { class: "em-dock-id" }, [
        el("b", { class: "em-dock-bot", text: (s && s.bot) || (EM.bot.uri ? EM.bot.uri : "la partida") }),
        el("span", { class: "em-dock-note", text: s ? (nombreEtapa(s) + " · " + s.turnos + " mensajes") : "…" })
      ]),
      btn("🎭", "em-icon", function () { if (EM.panel) EM.panel.open(); }, { title: "Abrir el panel de roles" })
    ]));

    if (state.colapsado) {
      out.appendChild(el("div", { class: "em-dock-mini", onclick: function () { state.colapsado = false; state.aMano = true; render(); colocar(); } }, [
        el("span", { class: "em-dock-mini-ico", text: "💗" }),
        el("span", { class: "em-dock-mini-txt", text: s ? nombreEtapa(s) : "partida" })
      ]));
      return out;
    }

    var cuerpo = el("div", { class: "em-dock-body" });

    if (!s) {
      cuerpo.appendChild(el("div", { class: "em-note em-note-small", text: "Todavía no sé con qué bot juegas." }));
      out.appendChild(cuerpo);
      return out;
    }

    // las barras
    var ficha6 = el("div", { class: "em-ficha em-ficha-dock" });
    STATS.forEach(function (st) { ficha6.appendChild(barra(st.id)); });
    ficha6.appendChild(el("div", { class: "em-etapa" }, [
      el("span", { class: "em-etapa-badge", text: nombreEtapa(s) }),
      el("span", { class: "em-etapa-tip", text: ETAPA_TIP[nombreEtapa(s)] || "" })
    ]));
    cuerpo.appendChild(ficha6);

    // lo último que ha movido
    if (state.ultimo && Date.now() - state.ultimo.at < 120000) {
      cuerpo.appendChild(el("div", { class: "em-dock-last" }, [
        el("b", { text: state.ultimo.nombre }),
        el("span", { text: resumen(state.ultimo.mov) })
      ]));
    }

    // aviso
    if (state.msg && state.msg.text) {
      var caja = el("div", { class: "em-rpg-msg" + (state.msg.bad ? " em-rpg-msg-bad" : "") });
      caja.appendChild(el("span", { text: state.msg.text }));
      if (state.msg.extra && state.msg.extra.length) {
        caja.appendChild(el("details", { class: "em-det" }, [
          el("summary", { text: "Lo que ha contestado el servidor" }),
          el("pre", { class: "em-pre", text: state.msg.extra.join("\n") })
        ]));
      }
      cuerpo.appendChild(caja);
    }

    // los botones de la partida
    cuerpo.appendChild(el("div", { class: "em-acts em-acts-dock" }, [
      btn(state.busy ? "…" : (s.memoria.texto && s.memoria.etapa === s.etapa ? "🧠 Al día" : "🧠 Poner en su memoria"),
        "em-btn em-btn-main em-btn-mini", function () { inyectar(); }, { disabled: state.busy, title: "Escribe la nota en la memoria del bot (lo único que lee en todos los mensajes)" }),
      btn("📖 Leer del chat", "em-btn em-btn-mini", function () {
        aviso("Leyendo los mensajes del chat…", false);
        render();
        leer().then(function (r) {
          aviso(r.ok ? "📖 Medidos " + r.n + " mensajes: " + (resumen(r.cambios) || "nada que cambiar") : "📖 " + r.why, !r.ok);
          render();
        });
      }, { title: "Mira los mensajes que hay ahora mismo en el chat y mide los que se le hayan escapado al enganche" }),
      btn("⤢", "em-btn em-btn-mini", function () {
        state.ancho = state.ancho === ANCHO ? ANCHO_GRANDE : ANCHO;
        render();
        colocar();
      }, { title: "Estirar la ficha (para editar cómodo)" })
    ]));

    // la tabla de palabras clave
    var pal = plegable("🔑 Palabras clave (" + tabla().length + ")", "palabras");
    if (state.seccion === "palabras") {
      var ta = el("textarea", { class: "em-input em-pal-edit", rows: 14, spellcheck: "false" });
      ta.value = state.edicion != null ? state.edicion : tablaTexto();
      ta.addEventListener("input", function () { state.edicion = ta.value; });
      pal.appendChild(el("div", { class: "em-hint", text: "Una línea por entrada:  nombre : palabras : movimientos ·  los grupos van con |, las palabras de un grupo con +, las alternativas con /, y lo que mueve con «deseo 2, afecto 1»." }));
      pal.appendChild(ta);
      pal.appendChild(el("div", { class: "em-acts" }, [
        btn("💾 Guardar", "em-btn em-btn-main em-btn-mini", function () {
          var t = state.edicion != null ? state.edicion : tablaTexto();
          if (!deTexto(t).length) {
            aviso("Eso no tiene ni una entrada que se pueda leer: revisa el formato.", true);
            render();
            return;
          }
          setTablaTexto(t);
          state.edicion = null;
          aviso("🔑 Tabla guardada (" + tabla().length + " entradas).", false);
          render();
        }),
        btn("↩ Tabla base", "em-btn em-btn-mini", function () {
          resetTabla();
          state.edicion = null;
          aviso("🔑 Vuelta a la tabla de serie.", false);
          render();
        }, { disabled: esTablaBase() })
      ]));
      var prueba = el("input", { class: "em-input", type: "text", placeholder: "Prueba: «le doy un beso con lengua»" });
      prueba.value = state.prueba || "";
      var salida = el("div", { class: "em-hint em-pal-out", text: probar(state.prueba || "") });
      prueba.addEventListener("input", function () {
        state.prueba = prueba.value;
        salida.textContent = probar(prueba.value);
      });
      pal.appendChild(el("div", { class: "em-field" }, [prueba, salida]));
    }
    cuerpo.appendChild(pal);

    // la nota que se le deja al bot
    var mem = plegable("🧠 Lo que recibe el bot", "memoria");
    var txt = esGrande(s) ? memoriaBot(s) : minimo(s, s.memoria.tope || LIMITE_MEM);
    var txtChat = recortaA(memoriaTexto(s), LIMITE_CHAT);
    var topeMax = s.memoria.tope || LIMITE_MEM;
    var dentro = !!s.memoria.texto;
    mem.appendChild(el("div", { class: "em-mem" }, [
      el("span", { class: "em-mem-state", text: dentro ? "🧠 inyectada" : "sin inyectar" }),
      el("span", { class: "em-mem-len" + (txt.length > topeMax ? " em-mem-over" : ""), text: esGrande(s) ? txt.length + " caracteres · caben" : txt.length + " / " + topeMax + " caracteres" })
    ]));
    mem.appendChild(el("div", { class: "em-hint", text: "Su servidor deja " + topeMax + " caracteres en la memoria del bot: ahí va la nota reducida (estado + tono). Con ✍ se manda la completa al chat, que sí cabe entera." }));
    if (dentro && (s.memoria.etapa !== s.etapa || s.memoria.texto !== txt)) {
      mem.appendChild(el("div", { class: "em-hint", text: "⚠ Dentro está el estado de cuando la inyectaste: pulsa «🧠 Poner en su memoria» para ponerlo al día." }));
    }
    mem.appendChild(el("pre", { class: "em-pre", text: txt }));
    mem.appendChild(el("details", { class: "em-det" }, [
      el("summary", { text: "La nota completa (" + txtChat.length + " caracteres, la de ✍)" }),
      el("pre", { class: "em-pre", text: txtChat })
    ]));
    mem.appendChild(el("div", { class: "em-acts" }, [
      btn("✍ Al chat", "em-btn em-btn-mini", function () { ponerEnElChat(); }, { title: "Deja la nota completa en la caja del chat, para mandarla como primer mensaje" }),
      btn("🧹 Devolver la suya", "em-btn em-btn-mini em-btn-bad", function () { quitar(); }, { disabled: state.busy || s.memoria.original == null })
    ]));
    cuerpo.appendChild(mem);

    // ajustes
    var aj = plegable("⚙ Ajustes", "ajustes");
    aj.appendChild(el("div", { class: "em-toggles" }, [
      interruptor("medir", "💗 medir lo que escribo", "Mueve las barras leyendo las palabras clave de tus mensajes"),
      interruptor("memAut", "🔄 memoria sola", "Pone al día la nota del bot cuando la relación cambia de etapa"),
      interruptor("explicito", "🍓 explícito", "La nota pide escenas íntimas con detalle"),
      interruptor("larga", "📚 nota larga", "Prueba antes la nota completa, por si tu plan deja más de 300 caracteres"),
      interruptor("autoenviar", "✍ enviar solo", "Al usar ✍, pulsa enviar por ti"),
      interruptor("aceroReinicia", "♻ A cero reinicia su chat", "Al pulsar «💗 A cero», pulsa también el botón «Reiniciar» del chat (borra la conversación del bot)")
    ]));
    aj.appendChild(el("div", { class: "em-acts" }, [
      btn("💗 A cero", "em-btn em-btn-mini em-btn-bad", function () {
        var f = ficha();
        if (!f) return;
        var conChat = !!f.flags.aceroReinicia;
        if (!window.confirm("¿Empezar la partida de cero con este bot? (las barras y la ficha)" +
          (conChat ? "\n\nY se reinicia también su chat: se borra la conversación del bot." : "\n\n(El chat no se toca: para eso, «♻ Reiniciar el chat».)"))) return;
        f.stats = { afecto: 0, confianza: 0, deseo: 0, tension: 0 };
        f.etapa = 0;
        f.turnos = 0;
        f.vinculo = 0;
        f.log = [];
        f.vistos = [];
        state.ultimo = null;
        apuntar(f, "nota", "partida reiniciada a cero");
        guardar();
        aviso("💗 Partida a cero.", false);
        render();
        if (conChat) reiniciarSinPreguntar();
      }),
      btn(state.vigilando ? "♻ esperando…" : "♻ Reiniciar el chat", "em-btn em-btn-mini em-btn-bad", function () { reiniciarChat(); }, { title: "Pulsa el botón «Reiniciar» de su chat: borra la conversación del bot (la ficha 💗 no se toca). Si su menú no está abierto, espera a que salga." })
    ]));
    cuerpo.appendChild(aj);

    // el registro
    var reg = plegable("📜 Registro (" + s.log.length + ")", "registro");
    var log = el("div", { class: "em-log" });
    if (!s.log.length) log.appendChild(el("div", { class: "em-hint", text: "Nada todavía. Escribe en el chat y mira cómo se mueven las barras." }));
    s.log.slice(0, 24).forEach(function (e) {
      log.appendChild(el("div", { class: "em-log-item" }, [
        el("span", { class: "em-log-ico", text: e.kind === "palabra" ? "💗" : e.kind === "etapa" ? "✨" : e.kind === "memoria" ? "🧠" : "•" }),
        el("span", { class: "em-log-txt", text: e.text })
      ]));
    });
    reg.appendChild(log);
    cuerpo.appendChild(reg);

    out.appendChild(cuerpo);
    return out;
  }

  function render() {
    state.sheet = ficha();
    var d = state.dock;
    if (!d) return;
    var cuerpo = d.querySelector(".em-dock-body");
    var scroll = cuerpo ? cuerpo.scrollTop : 0;
    d.className = "em-dock" + (state.colapsado ? " em-dock-min" : (state.anchoPuesto < 190 ? " em-dock-narrow" : ""));
    EM.clear(d);
    d.appendChild(vista());
    var nuevo = d.querySelector(".em-dock-body");
    if (nuevo) nuevo.scrollTop = scroll;
  }

  // --- montar y seguir la ficha -------------------------------------------------------------------
  function raiz() { return document.getElementById("em-root"); }
  function colgar() {
    var r = raiz();
    if (!r || !state.dock) return false;
    if (state.dock.parentNode !== r) r.appendChild(state.dock);
    return true;
  }
  function clavado() {
    var d = state.dock;
    if (!d) return;
    d.style.setProperty("position", "fixed", "important");
    d.style.setProperty("z-index", "2147483646", "important");
  }
  function montar(rootEl) {
    if (state.dock && state.dock.parentNode) {
      clavado();
      return true;
    }
    var d = el("div", { id: "em-dock", class: "em-dock", hidden: true, "aria-label": "Ficha de la partida" });
    state.dock = d;
    clavado();
    if (rootEl) rootEl.appendChild(d);
    else colgar();
    ganchos();
    setTimeout(function () { auto(true); render(); colocar(); }, 300);
    return true;
  }
  function keep() {
    if (!state.dock) return false;
    clavado();
    if (!colgar()) return false;
    colocar();
    return true;
  }
  // La ficha sale sola cuando estás en el chat de un bot (o si me lo piden a mano).
  function auto(silencioso) {
    var deberia = state.forzado || !!EM.bot.uri || !!cajaDeTexto();
    if (deberia !== state.visible) {
      state.visible = deberia;
      if (!silencioso) render();
    }
    var visible = state.visible && !state.panelAbierto;
    if (state.dock) state.dock.hidden = !visible;
    return visible;
  }
  function mostrar(v) {
    state.forzado = !!v;
    state.visible = !!v;
    if (!v) state.panelAbierto = false;
    auto(true);
    render();
    colocar(true);
    return state.visible;
  }
  function panelAbierto(v) {
    state.panelAbierto = !!v;
    auto(true);
    colocar();
  }
  function plegada() { return state.colapsado; }

  EM.rpg = {
    montar: montar,
    keep: keep,
    render: render,
    colocar: colocar,
    mostrar: mostrar,
    forzar: mostrar,
    auto: auto,
    panelAbierto: panelAbierto,
    raiz: raiz,
    // el motor, para probarlo desde la consola o desde el banco de pruebas
    ficha: ficha,
    stats: STATS,
    etapas: ETAPAS,
    etapaQue: etapaQue,
    aplicar: aplicar,
    medir: medir,
    probar: probar,
    analizar: analizar,
    procesar: procesar,
    tabla: tabla,
    tablaTexto: tablaTexto,
    setTablaTexto: setTablaTexto,
    resetTabla: resetTabla,
    deTexto: deTexto,
    aTexto: aTexto,
    clave: clave,
    // la nota del bot
    minimo: minimo,
    esGrande: esGrande,
    memoriaTexto: memoriaTexto,
    memoriaBot: memoriaBot,
    candidatos: candidatos,
    recortaA: recortaA,
    LIMITE_MEM: LIMITE_MEM,
    LIMITE_CHAT: LIMITE_CHAT,
    inyectar: inyectar,
    quitar: quitar,
    ponerEnElChat: ponerEnElChat,
    leer: leer,
    tokens: tokens,
    // las piezas del sitio
    cajaDeTexto: cajaDeTexto,
    columnaChat: columnaChat,
    capturar: capturar,
    mensajesDeLaPantalla: mensajesDeLaPantalla,
    textoDeBurbuja: textoDeBurbuja,
    medirLista: medirLista,
    botonesReiniciar: botonesReiniciar,
    botonReiniciar: botonReiniciar,
    esBotonReiniciar: esBotonReiniciar,
    pulsarReiniciar: pulsarReiniciar,
    reiniciarChat: reiniciarChat,
    reiniciarSinPreguntar: reiniciarSinPreguntar,
    vigilarReiniciar: vigilarReiniciar,
    pararVigilancia: pararVigilancia,
    estado: function () { return state; },
    log: function () { return state.sheet ? state.sheet.log.slice() : []; }
  };

  cargar();

  // El nombre del jugador (su rol principal) para que la nota no diga "el jugador".
  function buscarJugador() {
    return EM.api.personas().then(function (res) {
      var lista = [];
      sacarLista(res, lista);
      var elegido = null;
      lista.forEach(function (p) {
        if (!elegido && p && (p.isPrimary || p.personaEnabled) && p.name) elegido = p;
      });
      if (elegido) {
        Object.keys(store.bots).forEach(function (k) {
          if (!store.bots[k].player) store.bots[k].player = elegido.name;
        });
        guardar();
      }
    }).catch(function () {});
  }
  function sacarLista(obj, out) {
    if (!obj || typeof obj !== "object") return out;
    if (Array.isArray(obj)) {
      if (obj.length && obj.every(function (x) { return x && typeof x === "object" && ("personaId" in x); })) {
        Array.prototype.push.apply(out, obj);
        return out;
      }
      obj.forEach(function (x) { sacarLista(x, out); });
      return out;
    }
    Object.keys(obj).forEach(function (k) { sacarLista(obj[k], out); });
    return out;
  }

  EM.onBot.push(function () {
    state.sheet = ficha();
    auto(true);
    if (state.dock) {
      render();
      colocar();
    }
  });
  setInterval(function () {
    if (!state.dock) return;
    auto(true);
    colocar();
  }, TICK);

  try { buscarJugador(); } catch (e) {}
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
  // Los mismos tres que pone su editor (y los mismos valores que guarda su API).
  var GENDERS = [
    ["Male", "Masculino"],
    ["Female", "Femenino"],
    ["Other", "Otro"]
  ];
  // Los topes de su formulario, copiados de su editor: el nombre 40, la descripción de la persona
  // 3000, y apariencia/gustos/disgustos 100. Las etiquetas: cinco como mucho.
  var LIMITS = { name: 40, backgroundStory: 3000, appearance: 100, likes: 100, dislikes: 100 };

  var state = {
    open: false,
    view: "list",     // list | form | tags
    list: null,       // null = cargando
    draft: null,      // la ficha que se está editando
    isNew: false,
    botRole: "",      // personaId del rol elegido para el bot actual
    busy: false,
    msg: null,        // { text, bad }
    error: "",
    tagDraft: null,   // las etiquetas que estás marcando en el selector (hasta que confirmes)
    tagQuery: ""      // el filtro del selector
  };

  var root, fab, panel, bodyEl, statusEl, msgEl, titleEl, footEl;

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
    nombres: ["Vera", "Nadia", "Iris", "Selene", "Marta", "Ariadna", "Noa", "Ámbar", "Zoe", "Lía", "Rune", "Kael", "Dorian", "Silas", "Tobías", "Bruno"],
    apellidos: ["Kessler", "Vane", "Moreau", "Ibarra", "Ferrán", "Serra", "Aldana", "Kovács", "Duskwood", "Blackwood", "Navarro", "Okonkwo"],
    arquetipo: ["detective cansado", "vampira médica", "piloto de carga", "hechicera exiliada", "capitana pirata", "cazador de monstruos", "profesora severa", "ladrón de guante blanco", "guardaespaldas leal", "periodista metomentodo", "ingeniera de la estación orbital", "monja rebelde"],
    rasgo: ["fría por fuera y protectora por dentro", "habla poco y mira mucho", "sarcástica hasta que duele", "demasiado educada para ser sincera", "impulsiva y luego arrepentida", "cuida a los demás y se olvida de sí misma", "siempre está en otra parte con la cabeza", "rivaliza por deporte"],
    secreto: ["debe dinero a la persona equivocada", "es la única superviviente de algo que no cuenta", "cambió su nombre hace años", "tiene un hermano del que nadie sabe nada", "firma sus obras con otro nombre", "guarda una carta que nunca envió", "una vez dejó morir a alguien y no lo confesó"],
    gustos: ["el café solo y a deshoras", "la lluvia en las ventanas", "los libros con anotaciones ajenas", "las motos viejas", "las partidas de cartas por dinero", "dormir hasta tarde", "las tormentas"],
    disgustos: ["esperar", "la gente que presume", "los ruidos de boca", "que le den órdenes", "los ascensores", "el calor", "mentir sin motivo"]
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
  // Las etiquetas de las ideas salen de la lista DE ELLOS (las mismas del selector), no de una
  // inventada: lo que rellenes vale tal cual y no hay que corregirlo antes de guardar.
  function ideaTags(n) {
    var all = EM.tags.now().labels;
    if (!all.length) return [];
    return pickSome(all.map(function (l) { return l.name; }), n);
  }
  // Rellena solo los campos que estén vacíos: las ideas son para arrancar, no para pisar lo tuyo.
  function fillIdeas() {
    var d = state.draft;
    var arq = pick(IDEAS.arquetipo);
    if (!d.name.trim()) d.name = pick(IDEAS.nombres) + " " + pick(IDEAS.apellidos);
    if (!d.backgroundStory.trim()) {
      d.backgroundStory = "Es " + arq + ", " + pick(IDEAS.rasgo) + ". Nadie sabe que " + pick(IDEAS.secreto) + ".";
    }
    if (!d.appearance.trim()) d.appearance = "De pie firme y mirada de cansancio contenido; ropa práctica, marcada por el uso.";
    if (!d.likes.trim()) d.likes = ideaList(IDEAS.gustos, 3);
    if (!d.dislikes.trim()) d.dislikes = ideaList(IDEAS.disgustos, 3);
    if (!d.label.length) d.label = ideaTags(3);
    if (!d.gender) d.gender = pick(["Male", "Female", "Other"]);
    if (!(d.age > 0)) d.age = 19 + Math.floor(Math.random() * 27);
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
    // Se corta a los topes de su formulario y se exige lo que su web exige (nombre, género y
    // descripción): así lo que se manda pasa su validación a la primera.
    d.name = String(d.name || "").trim().slice(0, LIMITS.name);
    d.backgroundStory = String(d.backgroundStory || "").trim().slice(0, LIMITS.backgroundStory);
    d.appearance = String(d.appearance || "").slice(0, LIMITS.appearance);
    d.likes = String(d.likes || "").slice(0, LIMITS.likes);
    d.dislikes = String(d.dislikes || "").slice(0, LIMITS.dislikes);
    d.label = (d.label || []).slice(0, EM.tags.now().max || 5);
    if (!d.name) {
      say("Ponle un nombre: en su editor es obligatorio.", true);
      return;
    }
    if (!d.gender) {
      say("Elige el género: en su editor es obligatorio.", true);
      return;
    }
    if (!d.backgroundStory) {
      say("Escribe la descripción de la persona: en su editor es obligatoria.", true);
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
        say(
          e && e.code === "no-session"
            ? "No se pudo guardar: sin sesión. Entra en emochi.com con tu cuenta y vuelve a intentarlo."
            : "No se pudo guardar: " + e.message,
          true
        );
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
  // El nombre de una etiqueta tal como lo enseña su web (la API guarda el inglés)
  function tagLabel(name) {
    return EM.tags.labelOf(name);
  }
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

  // --- el formulario, calcado del suyo ---------------------------------------------------------
  // Su editor ("Editar personalidad") tiene estos campos, estos topes y estos contadores: nombre 40,
  // género en tres botones, la descripción de la persona 3000, edad, apariencia / gustos / disgustos
  // 100 y etiquetas (cinco). Aquí se replica tal cual para que no haya que aprenderse dos sitios.
  function labelSpan(text, required) {
    var s = el("span", { class: "em-field-label" });
    s.appendChild(el("span", { text: text }));
    if (required) s.appendChild(el("i", { class: "em-req", text: "*", title: "Obligatorio" }));
    return s;
  }
  function fieldBox(labelNode, node, hint) {
    return el("div", { class: "em-field" }, [labelNode, node, hint ? el("small", { text: hint }) : null]);
  }
  // Un campo con su contador, como los suyos: al llegar al tope ya no deja escribir más.
  function counted(opts) {
    var key = opts.key;
    var max = opts.max;
    var node = opts.multiline
      ? el("textarea", { class: "em-input", rows: opts.rows || 3 })
      : el("input", { class: "em-input", type: opts.type || "text" });
    node.placeholder = opts.placeholder || "";
    node.value = state.draft[key] == null ? "" : String(state.draft[key]);
    var num = el("span", { class: "em-count-num" });
    function sync() {
      if (max && node.value.length > max) node.value = node.value.slice(0, max);
      state.draft[key] = node.value;
      num.textContent = node.value.length + (max ? "/" + max : "");
      num.className = "em-count-num" + (max && node.value.length >= max ? " em-count-on" : "");
      saveDraft();
    }
    node.addEventListener("input", sync);
    sync();
    return fieldBox(labelSpan(opts.label, opts.required), el("div", { class: "em-counted" }, [node, num]), opts.hint);
  }
  function numberField() {
    var d = state.draft;
    var node = el("input", { class: "em-input", type: "number", min: "1", max: "200" });
    node.placeholder = "Ej. 27";
    node.value = d.age == null || d.age === "" ? "" : String(d.age);
    node.addEventListener("input", function () {
      var n = parseInt(node.value, 10);
      d.age = isNaN(n) ? null : n;
      saveDraft();
    });
    return fieldBox(labelSpan("Edad", false), node, "Solo el número: la IA lo usa para tratarte como toca.");
  }
  function genderField() {
    var d = state.draft;
    var box = el("div", { class: "em-radios" });
    GENDERS.forEach(function (g) {
      var on = (d.gender || "") === g[0];
      var b = el("button", { class: "em-radio" + (on ? " em-radio-on" : ""), type: "button" }, [
        el("i", { class: "em-radio-dot", text: on ? "✓" : "" }),
        el("span", { text: g[1] })
      ]);
      b.addEventListener("click", function () {
        d.gender = g[0];
        saveDraft();
        render();
      });
      box.appendChild(b);
    });
    return fieldBox(labelSpan("Género", true), box);
  }
  function avatarBox() {
    var d = state.draft;
    var wrap = el("div", { class: "em-avatar-wrap" });
    var img = d.imageURL
      ? el("img", { class: "em-avatar-big", alt: "", src: d.imageURL })
      : el("span", { class: "em-avatar-big em-avatar-empty", text: (d.name || "?").trim().charAt(0).toUpperCase() || "?" });
    wrap.appendChild(img);
    var right = el("div", { class: "em-avatar-fields" });
    var node = el("input", { class: "em-input", type: "url", placeholder: "Pega la dirección de una imagen" });
    node.value = d.imageURL || "";
    node.addEventListener("input", function () {
      d.imageURL = node.value.trim();
      saveDraft();
      if (img.tagName === "IMG") img.src = d.imageURL;
    });
    node.addEventListener("change", render);
    right.appendChild(node);
    right.appendChild(el("div", { class: "em-hint", text: "Su web la sube y la recorta; aquí vale con pegar la dirección." }));
    if (d.imageURL) {
      right.appendChild(el("button", { class: "em-btn em-btn-mini", type: "button", text: "Quitar foto", onclick: function () { d.imageURL = ""; saveDraft(); render(); } }));
    }
    wrap.appendChild(right);
    return fieldBox(labelSpan("Foto", false), wrap);
  }
  function chipsOf(names, removable) {
    var box = el("div", { class: "em-chips" });
    (names || []).forEach(function (name) {
      var chip = el("span", { class: "em-chip", title: name }, [el("span", { text: tagLabel(name) })]);
      if (removable) {
        chip.appendChild(el("button", {
          class: "em-chip-del", type: "button", title: "Quitar", text: "✕",
          onclick: function () {
            state.draft.label = state.draft.label.filter(function (n) { return n !== name; });
            saveDraft();
            render();
          }
        }));
      }
      box.appendChild(chip);
    });
    return box;
  }
  function tagsField() {
    var d = state.draft;
    var max = EM.tags.now().max || 5;
    var head = labelSpan("Etiquetas", false);
    head.appendChild(el("span", { class: "em-count-num", text: " " + d.label.length + "/" + max }));
    var box = el("div", { class: "em-field" }, [head]);
    box.appendChild(d.label.length ? chipsOf(d.label, true) : el("div", { class: "em-hint", text: "Ninguna todavía." }));
    box.appendChild(el("button", { class: "em-btn", type: "button", text: "Elegir etiquetas ›", onclick: openTags }));
    return box;
  }
  function renderForm() {
    var d = state.draft;
    var out = el("div", { class: "em-form" });

    out.appendChild(avatarBox());
    out.appendChild(counted({ key: "name", label: "Nombre", required: true, max: LIMITS.name, placeholder: "Como quieres que te llamen" }));
    out.appendChild(genderField());
    out.appendChild(counted({
      key: "backgroundStory", label: "Descripción de la persona", required: true, max: LIMITS.backgroundStory,
      multiline: true, rows: 8, placeholder: "Quién eres, de dónde vienes, qué te trajo hasta aquí…",
      hint: "Es lo que la IA lee para recordarte: cuanto más concreto, mejor te trata."
    }));
    out.appendChild(numberField());
    out.appendChild(counted({ key: "appearance", label: "Apariencia", max: LIMITS.appearance, multiline: true, rows: 2, placeholder: "Cómo te ve el bot cuando te describe" }));
    out.appendChild(counted({ key: "likes", label: "Me gusta", max: LIMITS.likes, multiline: true, rows: 2, placeholder: "Cosas que te gustan" }));
    out.appendChild(counted({ key: "dislikes", label: "Disgustos", max: LIMITS.dislikes, multiline: true, rows: 2, placeholder: "Cosas que no soportas" }));
    out.appendChild(tagsField());
    out.appendChild(el("small", { class: "em-tip", text: "Los campos con * son obligatorios en su web: sin ellos no deja guardar." }));

    var acts = el("div", { class: "em-acts em-acts-end em-acts-sticky" });
    if (EM.prefs.ideas) acts.appendChild(el("button", { class: "em-btn", text: "🎲 Ideas", title: "Rellena los huecos con una sugerencia", onclick: fillIdeas }));
    acts.appendChild(el("button", { class: "em-btn", text: "Reiniciar", title: "Vaciar el formulario", onclick: resetForm }));
    acts.appendChild(el("button", { class: "em-btn", text: "Cancelar", onclick: function () { state.view = "list"; render(); } }));
    acts.appendChild(el("button", { class: "em-btn em-btn-main", text: state.isNew ? "Crear rol" : "Guardar", disabled: state.busy, onclick: save }));
    out.appendChild(acts);
    return out;
  }

  // --- el selector de etiquetas (como su ventana: las 68, agrupadas, y cinco como mucho) --------
  function openTags() {
    state.tagDraft = (state.draft.label || []).slice();
    state.tagQuery = "";
    state.view = "tags";
    render();
    EM.tags.load().then(function () {
      if (state.view === "tags") render();
    }).catch(function () {});
  }
  function renderTags() {
    var t = EM.tags.now();
    var max = t.max || 5;
    var chosen = state.tagDraft || (state.tagDraft = []);
    var out = el("div", { class: "em-picker" });

    var search = el("input", { class: "em-input", type: "search", placeholder: "Buscar etiqueta…" });
    search.value = state.tagQuery || "";
    out.appendChild(search);
    out.appendChild(el("div", { class: "em-hint", text: "Las suyas, con el nombre que usa su web. Se pueden marcar " + max + "." }));

    var list = el("div", { class: "em-tag-list" });
    var groups = [];
    Object.keys(t.groups).forEach(function (g) {
      var items = t.labels.filter(function (l) { return l.group === g; });
      if (!items.length) return;
      var head = el("div", { class: "em-tag-group", text: t.groups[g] });
      var grid = el("div", { class: "em-tag-grid" });
      var rows = [];
      items.forEach(function (l) {
        var on = chosen.indexOf(l.name) >= 0;
        var b = el("button", { class: "em-tag" + (on ? " em-tag-on" : ""), type: "button", "data-em-tag": l.name }, [
          el("span", { text: l.label }),
          el("i", { class: "em-tag-mark", text: on ? "✕" : "+" })
        ]);
        b.addEventListener("click", function () {
          var i = chosen.indexOf(l.name);
          if (i >= 0) chosen.splice(i, 1);
          else if (chosen.length >= max) { blink(b); return; }
          else chosen.push(l.name);
          paint(b, chosen.indexOf(l.name) >= 0);
          paintCount();
        });
        rows.push({ node: b, hay: (l.label + " " + l.name).toLowerCase() });
        grid.appendChild(b);
      });
      list.appendChild(head);
      list.appendChild(grid);
      groups.push({ head: head, rows: rows });
    });
    out.appendChild(list);

    var confirm = el("button", { class: "em-btn em-btn-main", type: "button" });
    function paintCount() {
      confirm.textContent = "Confirmar (" + chosen.length + "/" + max + ")";
      confirm.disabled = chosen.length === 0;
    }
    function paint(b, on) {
      b.className = "em-tag" + (on ? " em-tag-on" : "");
      if (b.lastChild) b.lastChild.textContent = on ? "✕" : "+";
    }
    function blink(b) {
      b.className = "em-tag em-tag-full";
      setTimeout(function () { b.className = "em-tag" + (chosen.indexOf(b.dataset.emTag) >= 0 ? " em-tag-on" : ""); }, 400);
    }
    function applyFilter() {
      var q = (search.value || "").trim().toLowerCase();
      state.tagQuery = search.value;
      groups.forEach(function (g) {
        var any = false;
        g.rows.forEach(function (r) {
          var hit = !q || r.hay.indexOf(q) >= 0;
          r.node.hidden = !hit;
          if (hit) any = true;
        });
        g.head.hidden = !any;
      });
    }
    search.addEventListener("input", applyFilter);
    confirm.addEventListener("click", function () {
      state.draft.label = chosen.slice(0, max);
      saveDraft();
      state.view = "form";
      render();
    });
    out.appendChild(el("div", { class: "em-acts em-acts-end em-acts-sticky" }, [
      el("button", { class: "em-btn", type: "button", text: "Cancelar", onclick: function () { state.view = "form"; render(); } }),
      confirm
    ]));
    paintCount();
    applyFilter();
    return out;
  }
  function resetForm() {
    if (!window.confirm("¿Vaciar el formulario? Se pierde lo que no hayas guardado.")) return;
    dropDraft(state.draft.personaId);
    if (state.isNew) {
      newPersona();
      return;
    }
    var p = personaOf(state.draft.personaId);
    if (p) editPersona(p);
    else {
      state.view = "list";
      render();
    }
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
        labels.slice(0, 8).forEach(function (t) { chips.appendChild(el("span", { class: "em-chip", title: t, text: tagLabel(t) })); });
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
    titleEl.textContent =
      state.view === "tags" ? "Etiquetas" :
      state.view === "form" ? (state.isNew ? "Nuevo rol" : "Editar rol") : "Mis roles";
    statusEl.textContent = state.busy ? "…" : state.list ? state.list.length + "" : "";
    msgEl.hidden = !state.msg;
    msgEl.textContent = state.msg ? state.msg.text : "";
    msgEl.className = "em-msg" + (state.msg && state.msg.bad ? " em-msg-bad" : "");
    if (footEl) footEl.hidden = state.view !== "list"; // el formulario lleva sus botones pegados abajo
    EM.clear(bodyEl);
    bodyEl.appendChild(state.view === "tags" ? renderTags() : state.view === "form" ? renderForm() : renderList());
    bodyEl.scrollTop = 0;
  }

  function openPanel() {
    state.open = true;
    panel.hidden = false;
    fab.setAttribute("aria-expanded", "true");
    if (EM.rpg) EM.rpg.panelAbierto(true);   // la ficha de la partida se aparta mientras el panel manda
    if (state.list === null) load();
    else render();
  }
  function closePanel() {
    state.open = false;
    panel.hidden = true;
    fab.setAttribute("aria-expanded", "false");
    if (EM.rpg) EM.rpg.panelAbierto(false);
  }

  // Dónde se planta el panel. **Fuera de <body>**, colgado de <html>: su web es una SPA de React
  // que al terminar de arrancar reordena/repinta el cuerpo entero (y a veces lo deja con transform,
  // que rompe `position: fixed`), y ahí dentro nuestro panel desaparecía en cuanto cargaba del todo.
  // Colgado de <html> no lo toca nadie, y además, al ir **después** de <body> en el orden del
  // documento, con el mismo z-index ganamos nosotros si su web monta algo a pantalla completa.
  function hostNode() {
    return document.documentElement || document.body;
  }
  // Los dos elementos van fijos y por encima de todo: se declara aquí con `!important` porque es
  // justo lo que su web podría pisar con su propio CSS o con un portal suyo a pantalla completa.
  function pinStyles() {
    [fab, panel].forEach(function (n) {
      if (!n) return;
      n.style.setProperty("position", "fixed", "important");
      n.style.setProperty("z-index", "2147483647", "important");
    });
  }
  var lastHost = null;
  function attach() {
    var h = hostNode();
    if (!h) return false;
    if (root.parentNode !== h) h.appendChild(root);
    if (lastHost !== h) {
      lastHost = h;
      pinStyles();
    }
    return true;
  }
  // Vigilante: si la web nos quita del documento (o cambia el <body> de sitio), se vuelve a plantar.
  function keep() {
    if (!root) return false;
    var ok = attach();
    if (EM.rpg) EM.rpg.keep();
    return ok;
  }

  function mount() {
    if (root) return;
    root = el("div", { id: "em-root" });

    fab = el("button", {
      id: "em-fab",
      type: "button",
      title: "Roles y partida — emochi",
      "aria-label": "Mi panel",
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

    footEl = el("footer", { class: "em-foot" });
    footEl.appendChild(el("button", { class: "em-btn em-btn-main", text: "＋ Nuevo rol", onclick: newPersona }));
    footEl.appendChild(el("button", {
      class: "em-btn",
      text: "💗 Ficha de la partida",
      title: "Enseñar u ocultar la ficha de la partida al lado del chat",
      onclick: function () {
        if (!EM.rpg) return;
        var on = !(EM.rpg.estado().visible);
        EM.rpg.mostrar(on);
        state.open = false;
        closePanel();
      }
    }));

    panel = el("aside", { id: "em-panel", hidden: true, "aria-label": "Mis roles" }, [head, msgEl, bodyEl, footEl]);
    root.appendChild(fab);
    root.appendChild(panel);
    EM.whenBody(function () {
      attach();
      render();
      if (EM.rpg) EM.rpg.montar(root);
    });

    EM.onBot.push(function () {
      if (state.view === "list") {
        refreshBotRole().then(render);
      }
    });
  }

  EM.panel = {
    mount: mount,
    keep: keep,
    open: openPanel,
    close: closePanel,
    toggle: function () { state.open ? closePanel() : openPanel(); },
    reload: load,
    render: render,
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
      siguirPlanta();
      // Una SPA cambia de pantalla sin avisar: se vigila la dirección (y el título, que es lo que
      // trae el nombre del personaje) para saber si hemos entrado o salido de un chat.
      var last = location.href;
      var lastTitle = document.title;
      setInterval(function () {
        EM.panel.keep();
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

  // Su web (una SPA de React) al terminar de arrancar repinta el documento: mientras carga conviene
  // mirar si nos ha quitado de en medio, y volver a plantar el panel si hace falta. Se vigilan los
  // hijos de <html> (ahí vive el panel), que es barato: son poquísimos cambios. Y si su web se pone
  // a pantalla completa, el panel se cuela dentro de lo que esté a pantalla completa para seguir viéndose.
  function siguirPlanta() {
    var mo = new MutationObserver(function () {
      EM.panel.keep();
    });
    function mirar() {
      try {
        mo.observe(document.documentElement, { childList: true });
      } catch (e) {}
    }
    if (document.documentElement) mirar();
    else document.addEventListener("readystatechange", function h() {
      if (!document.documentElement) return;
      document.removeEventListener("readystatechange", h);
      mirar();
    });
    document.addEventListener("fullscreenchange", function () {
      var fe = document.fullscreenElement || document.webkitFullscreenElement;
      var root = document.getElementById("em-root");
      if (fe && root && root.parentNode !== fe) fe.appendChild(root);
      else EM.panel.keep();
    });
  }

  EM.whenBody(start);
})();

