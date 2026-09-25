// ==UserScript==
// @name         emochi.com
// @version      0.9.22
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
  var css = "/* =============================================================================================\n   emochi.com — el CSS del panel de roles (🎭). Todo vive bajo #em-root, así que no toca nada de la\n   web: ni sus clases, ni su Tailwind, ni su Chakra. El único cuidado es que su reset global\n   (`* { margin: 0; padding: 0; font: inherit }`) no se coma lo nuestro, así que aquí se declara\n   todo lo que hace falta, sin dar por hecho nada.\n   ============================================================================================= */\n#em-root {\n  --em-bg: #141416;\n  --em-bg2: #1d1d21;\n  --em-bg3: #26262c;\n  --em-line: #34343c;\n  --em-text: #f2f2f5;\n  --em-dim: #b8b8c4;\n  --em-accent: #f7c948;\n  --em-accent-ink: #241c03;\n  --em-bad: #ff6b6b;\n  --em-good: #5ad18a;\n  --em-radius: 14px;\n  color: var(--em-text);\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif;\n  font-size: 14px;\n  line-height: 1.45;\n  text-align: left;\n  box-sizing: border-box;\n}\n#em-root *,\n#em-root *::before,\n#em-root *::after {\n  box-sizing: border-box;\n  font-family: inherit;\n}\n\n/* --- el botón flotante (abajo a la izquierda: abajo a la derecha está su asistente) --------- */\n#em-fab {\n  position: fixed;\n  left: 18px;\n  bottom: 18px;\n  z-index: 2147483000;\n  width: 52px;\n  height: 52px;\n  border: 1px solid var(--em-line);\n  border-radius: 50%;\n  background: var(--em-bg);\n  color: var(--em-text);\n  font-size: 24px;\n  line-height: 1;\n  cursor: pointer;\n  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);\n  transition: transform 0.15s ease, box-shadow 0.15s ease;\n}\n#em-fab:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.55);\n}\n#em-fab[aria-expanded=\"true\"] {\n  background: var(--em-accent);\n  color: var(--em-accent-ink);\n  border-color: var(--em-accent);\n}\n\n/* --- el panel ------------------------------------------------------------------------------- */\n#em-panel {\n  position: fixed;\n  left: 18px;\n  top: 18px;\n  bottom: 84px;\n  z-index: 2147483000;\n  width: 400px;\n  max-width: calc(100vw - 36px);\n  display: flex;\n  flex-direction: column;\n  background: var(--em-bg);\n  border: 1px solid var(--em-line);\n  border-radius: var(--em-radius);\n  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);\n  overflow: hidden;\n}\n#em-panel[hidden] {\n  display: none;\n}\n#em-fab,\n#em-panel,\n#em-panel * {\n  text-align: left;\n}\n#em-panel img {\n  max-width: 100%;\n}\n\n.em-head {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 12px 14px;\n  background: var(--em-bg2);\n  border-bottom: 1px solid var(--em-line);\n}\n.em-title {\n  font-size: 15px;\n  font-weight: 700;\n}\n.em-count {\n  font-size: 12px;\n  color: var(--em-dim);\n}\n.em-grow {\n  flex: 1 1 auto;\n}\n.em-icon {\n  background: transparent;\n  border: 0;\n  color: var(--em-dim);\n  font-size: 15px;\n  padding: 4px 6px;\n  border-radius: 8px;\n  cursor: pointer;\n}\n.em-icon:hover {\n  background: var(--em-bg3);\n  color: var(--em-text);\n}\n\n.em-body {\n  flex: 1 1 auto;\n  overflow-y: auto;\n  padding: 12px;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.em-foot {\n  padding: 10px 12px;\n  border-top: 1px solid var(--em-line);\n  background: var(--em-bg2);\n  display: flex;\n  gap: 8px;\n}\n\n.em-msg {\n  margin: 10px 12px 0;\n  padding: 8px 10px;\n  border-radius: 10px;\n  background: rgba(90, 209, 138, 0.12);\n  border: 1px solid rgba(90, 209, 138, 0.35);\n  font-size: 13px;\n}\n.em-msg-bad {\n  background: rgba(255, 107, 107, 0.12);\n  border-color: rgba(255, 107, 107, 0.4);\n}\n\n.em-note {\n  background: var(--em-bg2);\n  border: 1px solid var(--em-line);\n  border-radius: 12px;\n  padding: 12px;\n  color: var(--em-dim);\n  font-size: 13px;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  align-items: flex-start;\n}\n.em-note-bad {\n  border-color: rgba(255, 107, 107, 0.4);\n  color: #ffd9d9;\n}\n.em-note-small {\n  padding: 8px 10px;\n  font-size: 12px;\n}\n\n/* --- el bot en el que estás ----------------------------------------------------------------- */\n.em-bot {\n  background: var(--em-bg2);\n  border: 1px solid var(--em-line);\n  border-radius: 12px;\n  padding: 10px 12px;\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.em-bot-title {\n  font-size: 13px;\n  color: var(--em-dim);\n}\n.em-bot-title b {\n  color: var(--em-text);\n}\n.em-bot-note {\n  font-size: 12px;\n  color: var(--em-dim);\n}\n\n/* --- las tarjetas de rol -------------------------------------------------------------------- */\n.em-card {\n  background: var(--em-bg2);\n  border: 1px solid var(--em-line);\n  border-radius: 12px;\n  padding: 10px 12px;\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.em-card-primary {\n  border-color: rgba(247, 201, 72, 0.55);\n  box-shadow: inset 3px 0 0 var(--em-accent);\n}\n.em-card-top {\n  display: flex;\n  gap: 10px;\n  align-items: center;\n}\n.em-avatar {\n  width: 42px;\n  height: 42px;\n  border-radius: 50%;\n  object-fit: cover;\n  flex: 0 0 auto;\n  background: var(--em-bg3);\n}\n.em-avatar-empty {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: 700;\n  color: var(--em-dim);\n}\n.em-card-head {\n  min-width: 0;\n}\n.em-name {\n  font-weight: 700;\n  font-size: 15px;\n}\n.em-meta {\n  font-size: 12px;\n  color: var(--em-dim);\n}\n.em-story {\n  font-size: 13px;\n  color: #e4e4ea;\n  margin: 0;\n  white-space: pre-wrap;\n}\n.em-chips {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n}\n.em-chip {\n  font-size: 11px;\n  padding: 2px 8px;\n  border-radius: 999px;\n  background: #2f2f36;\n  color: #cfcfd8;\n  border: 1px solid #43434d;\n}\n\n/* --- botones e inputs ----------------------------------------------------------------------- */\n.em-acts {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n}\n.em-acts-end {\n  justify-content: flex-end;\n  margin-top: 4px;\n}\n/* Los botones del formulario y del selector van pegados abajo, siempre a la vista. */\n.em-acts-sticky {\n  position: sticky;\n  bottom: 0;\n  z-index: 2;\n  margin-top: 8px;\n  padding: 8px 0 2px;\n  background: var(--em-bg);\n  border-top: 1px solid var(--em-line);\n}\n.em-btn {\n  font-size: 12.5px;\n  padding: 6px 10px;\n  border-radius: 9px;\n  border: 1px solid var(--em-line);\n  background: var(--em-bg3);\n  color: var(--em-text);\n  cursor: pointer;\n}\n.em-btn:hover {\n  border-color: #4a4a55;\n}\n.em-btn:disabled {\n  opacity: 0.55;\n  cursor: default;\n}\n.em-btn-main {\n  background: var(--em-accent);\n  border-color: var(--em-accent);\n  color: var(--em-accent-ink);\n  font-weight: 600;\n}\n.em-btn-bad {\n  color: #ffc9c9;\n  border-color: rgba(255, 107, 107, 0.35);\n}\n.em-btn-on {\n  background: rgba(90, 209, 138, 0.16);\n  border-color: rgba(90, 209, 138, 0.5);\n  color: #c9f5dc;\n}\n\n.em-form {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.em-row {\n  display: flex;\n  gap: 10px;\n}\n.em-row > * {\n  flex: 1 1 0;\n  min-width: 0;\n}\n.em-field {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.em-field-label {\n  font-size: 12px;\n  color: var(--em-dim);\n}\n.em-field small {\n  font-size: 11px;\n  color: var(--em-dim);\n}\n.em-input {\n  width: 100%;\n  background: var(--em-bg3);\n  color: var(--em-text);\n  border: 1px solid var(--em-line);\n  border-radius: 9px;\n  padding: 7px 9px;\n  font-size: 13px;\n  resize: vertical;\n}\n.em-input:focus {\n  outline: none;\n  border-color: var(--em-accent);\n}\n.em-input::placeholder {\n  color: #74747f;\n}\n\n/* --- el formulario del rol (igual que su editor: contadores, géneros, etiquetas) ------------- */\n.em-req {\n  color: #ff8f6b;\n  font-style: normal;\n  margin-left: 3px;\n}\n.em-counted {\n  display: flex;\n  align-items: flex-start;\n  gap: 6px;\n}\n.em-counted > .em-input {\n  flex: 1 1 auto;\n  min-width: 0;\n}\n.em-count-num {\n  font-size: 11px;\n  color: var(--em-dim);\n  padding-top: 8px;\n  font-variant-numeric: tabular-nums;\n  white-space: nowrap;\n}\n.em-count-on {\n  color: var(--em-accent);\n}\n.em-hint {\n  font-size: 11.5px;\n  color: #8f8f9c;\n}\n.em-tip {\n  font-size: 11.5px;\n  color: #8f8f9c;\n  border-top: 1px dashed var(--em-line);\n  padding-top: 8px;\n}\n.em-radios {\n  display: flex;\n  gap: 6px;\n  flex-wrap: wrap;\n}\n.em-radio {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12.5px;\n  padding: 6px 12px 6px 6px;\n  border-radius: 999px;\n  border: 1px solid var(--em-line);\n  background: var(--em-bg3);\n  color: var(--em-text);\n  cursor: pointer;\n}\n.em-radio:hover {\n  border-color: #4a4a55;\n}\n.em-radio-dot {\n  width: 18px;\n  height: 18px;\n  border-radius: 50%;\n  border: 1px solid var(--em-line);\n  background: var(--em-bg);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 11px;\n  font-style: normal;\n  color: var(--em-accent-ink);\n}\n.em-radio-on {\n  border-color: var(--em-accent);\n  background: rgba(247, 201, 72, 0.12);\n}\n.em-radio-on .em-radio-dot {\n  background: var(--em-accent);\n  border-color: var(--em-accent);\n}\n.em-avatar-wrap {\n  display: flex;\n  gap: 10px;\n  align-items: flex-start;\n}\n.em-avatar-big {\n  width: 72px;\n  height: 72px;\n  border-radius: 12px;\n  object-fit: cover;\n  flex: 0 0 auto;\n  background: var(--em-bg3);\n  font-size: 26px;\n}\n.em-avatar-fields {\n  flex: 1 1 auto;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  align-items: flex-start;\n}\n.em-btn-mini {\n  font-size: 11.5px;\n  padding: 4px 8px;\n}\n.em-chip-del {\n  background: transparent;\n  border: 0;\n  color: inherit;\n  font: inherit;\n  cursor: pointer;\n  padding: 0 0 0 6px;\n  opacity: 0.75;\n}\n.em-chip-del:hover {\n  opacity: 1;\n}\n\n/* --- el selector de etiquetas --------------------------------------------------------------- */\n.em-picker {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.em-tag-list {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.em-tag-group {\n  font-size: 12px;\n  color: var(--em-accent);\n  margin-top: 2px;\n}\n.em-tag-grid {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 6px;\n}\n.em-tag {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 4px;\n  font-size: 11.5px;\n  padding: 6px 8px;\n  border-radius: 9px;\n  border: 1px solid var(--em-line);\n  background: var(--em-bg3);\n  color: var(--em-text);\n  cursor: pointer;\n  text-align: left;\n  min-width: 0;\n}\n.em-tag span {\n  overflow-wrap: anywhere;\n  line-height: 1.25;\n}\n.em-tag:hover {\n  border-color: #4a4a55;\n}\n.em-tag-mark {\n  font-style: normal;\n  color: var(--em-dim);\n  flex: 0 0 auto;\n}\n.em-tag-on {\n  background: rgba(247, 201, 72, 0.16);\n  border-color: var(--em-accent);\n  color: #fff;\n}\n.em-tag-on .em-tag-mark {\n  color: var(--em-accent);\n}\n.em-tag-full {\n  border-color: var(--em-bad);\n  color: #ffd9d9;\n}\n\n.em-spin {\n  width: 12px;\n  height: 12px;\n  border-radius: 50%;\n  border: 2px solid var(--em-line);\n  border-top-color: var(--em-accent);\n  display: inline-block;\n  animation: em-spin 0.8s linear infinite;\n}\n@keyframes em-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@media (max-width: 520px) {\n  #em-panel {\n    left: 8px;\n    right: 8px;\n    width: auto;\n    max-width: none;\n    top: 8px;\n    bottom: 76px;\n  }\n  #em-fab {\n    left: 12px;\n    bottom: 12px;\n  }\n}\n\n/* =============================================================================================\n   🎲 la partida (rpg.js): pestañas, ficha de estadísticas, acciones y registro\n   ============================================================================================= */\n\n.em-tabs {\n  display: flex;\n  gap: 6px;\n  padding: 8px 10px 0;\n  background: var(--em-bg2);\n}\n.em-tab {\n  flex: 1 1 0;\n  padding: 7px 8px;\n  border: 1px solid var(--em-line);\n  border-bottom: 0;\n  border-radius: 10px 10px 0 0;\n  background: var(--em-bg3);\n  color: var(--em-dim);\n  font-size: 12px;\n  font-weight: 600;\n  cursor: pointer;\n}\n.em-tab:hover {\n  color: var(--em-text);\n}\n.em-tab-on {\n  background: var(--em-bg);\n  color: var(--em-text);\n  border-color: var(--em-line);\n}\n.em-tabs + .em-head {\n  border-top: 0;\n}\n\n.em-rpg-host {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  min-width: 0;\n  max-width: 100%;\n}\n.em-rpg {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  min-width: 0;\n  max-width: 100%;\n}\n.em-h {\n  margin: 4px 0 0;\n  font-size: 12px;\n  font-weight: 700;\n  color: var(--em-dim);\n  text-transform: uppercase;\n  letter-spacing: 0.03em;\n}\n.em-rpg-head {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n.em-rpg-bot {\n  font-size: 15px;\n  font-weight: 700;\n}\n.em-rpg-note {\n  font-size: 11px;\n  color: var(--em-dim);\n}\n.em-rpg-msg {\n  padding: 8px 10px;\n  border-radius: 10px;\n  background: rgba(90, 209, 138, 0.12);\n  border: 1px solid rgba(90, 209, 138, 0.35);\n  font-size: 12px;\n}\n.em-rpg-msg-bad {\n  background: rgba(255, 107, 107, 0.12);\n  border-color: rgba(255, 107, 107, 0.4);\n}\n.em-rpg-msg .em-hint {\n  display: block;\n  margin-top: 4px;\n}\n\n.em-ficha {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  padding: 10px;\n  border: 1px solid var(--em-line);\n  border-radius: 12px;\n  background: var(--em-bg2);\n}\n.em-stat {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 12px;\n}\n.em-stat-ico {\n  width: 16px;\n  text-align: center;\n}\n.em-stat-name {\n  flex: 0 0 96px;\n  color: var(--em-dim);\n}\n.em-bar {\n  position: relative;\n  flex: 1 1 auto;\n  min-width: 0;\n  height: 9px;\n  border-radius: 999px;\n  background: #0d0d10;\n  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.07);\n  overflow: hidden;\n}\n.em-bar-fill {\n  display: block;\n  height: 100%;\n  min-width: 2px;\n  border-radius: 999px;\n  background: linear-gradient(90deg, #f7c948, #ff8fb1);\n  box-shadow: 0 0 8px rgba(247, 201, 72, 0.35);\n}\n.em-stat-num {\n  flex: 0 0 30px;\n  text-align: right;\n  font-variant-numeric: tabular-nums;\n}\n.em-etapa {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-top: 2px;\n  padding-top: 8px;\n  border-top: 1px dashed var(--em-line);\n}\n.em-etapa-badge {\n  padding: 3px 9px;\n  border-radius: 999px;\n  background: var(--em-accent);\n  color: var(--em-accent-ink);\n  font-size: 11px;\n  font-weight: 700;\n}\n.em-etapa-tip {\n  font-size: 11px;\n  color: var(--em-dim);\n}\n\n.em-roll {\n  padding: 8px 10px;\n  border-radius: 10px;\n  border: 1px solid var(--em-line);\n  background: var(--em-bg2);\n  font-size: 12px;\n}\n.em-roll-crítico {\n  border-color: rgba(90, 209, 138, 0.55);\n  background: rgba(90, 209, 138, 0.12);\n}\n.em-roll-pifia {\n  border-color: rgba(255, 107, 107, 0.5);\n  background: rgba(255, 107, 107, 0.12);\n}\n.em-roll b {\n  margin-right: 6px;\n}\n\n.em-accs {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 6px;\n  min-width: 0;\n}\n.em-acc {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: 6px;\n  min-width: 0;\n  padding: 8px 9px;\n  border: 1px solid #3d3d46;\n  border-radius: 10px;\n  background: var(--em-bg3);\n  color: var(--em-text);\n  font-size: 12px;\n  text-align: left;\n  cursor: pointer;\n  transition: transform 0.12s ease, border-color 0.12s ease, background 0.12s ease;\n}\n.em-acc:hover {\n  background: #2f2f36;\n  border-color: var(--em-accent);\n  transform: translateY(-1px);\n}\n.em-acc-ico {\n  font-size: 15px;\n}\n.em-acc-name {\n  flex: 1 1 auto;\n  min-width: 0;\n  font-weight: 600;\n}\n.em-acc-meta {\n  flex: 0 0 100%;\n  margin-left: 0;\n  font-size: 10px;\n  color: var(--em-dim);\n  white-space: normal;\n}\n.em-acc-lock {\n  opacity: 0.62;\n}\n.em-acc-lock .em-acc-meta::after {\n  content: \" ⚠\";\n}\n\n.em-mem {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 6px;\n  font-size: 11px;\n  color: var(--em-dim);\n}\n.em-mem-state {\n  padding: 2px 7px;\n  border-radius: 999px;\n  border: 1px solid var(--em-line);\n}\n.em-mem-len {\n  font-variant-numeric: tabular-nums;\n}\n.em-mem-over {\n  color: var(--em-bad);\n  font-weight: 700;\n}\n.em-toggles {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n}\n.em-toggle {\n  padding: 6px 9px;\n  border: 1px solid var(--em-line);\n  border-radius: 999px;\n  background: var(--em-bg2);\n  color: var(--em-dim);\n  font-size: 11px;\n  cursor: pointer;\n}\n.em-toggle-on {\n  color: var(--em-text);\n  border-color: var(--em-accent);\n  background: rgba(247, 201, 72, 0.14);\n}\n.em-det {\n  border: 1px solid var(--em-line);\n  border-radius: 10px;\n  background: var(--em-bg2);\n  padding: 8px 10px;\n  font-size: 12px;\n}\n.em-det summary {\n  cursor: pointer;\n  color: var(--em-dim);\n}\n.em-pre {\n  margin: 8px 0 0;\n  max-height: 220px;\n  overflow: auto;\n  padding: 8px;\n  border-radius: 8px;\n  background: #0f0f11;\n  color: #d8d8e0;\n  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;\n  font-size: 11px;\n  line-height: 1.4;\n  white-space: pre-wrap;\n  word-break: break-word;\n}\n.em-log {\n  display: flex;\n  flex-direction: column;\n  gap: 5px;\n}\n.em-log-item {\n  display: flex;\n  gap: 7px;\n  align-items: flex-start;\n  font-size: 11px;\n  color: var(--em-dim);\n  border-left: 2px solid var(--em-line);\n  padding-left: 7px;\n}\n.em-log-ico {\n  flex: 0 0 auto;\n}\n.em-log-txt {\n  flex: 1 1 auto;\n}\n\n@media (max-width: 430px) {\n  .em-accs {\n    grid-template-columns: 1fr;\n  }\n  .em-stat-name {\n    flex: 0 0 76px;\n  }\n}\n";
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
   emochi.com — la capa de juego (🎲): estadísticas de relación, tiradas y acciones.

   Idea: el bot no sabe nada de números, así que se le da un reglamento (que se escribe en SU
   MEMORIA, que es lo único que el modelo lee desde el primer mensaje) y se le pide una sola cosa:
   que al final de cada respuesta escriba una línea de marcador, por ejemplo

       [RPG afecto+2 confianza0 deseo+1 tension+2 etapa=Cercanía]

   Nosotros llevamos la cuenta de verdad (los números viven aquí, en el navegador, por bot): se
   leen esos deltas -recortados a lo que el reglamento permite-, se aplican, y la memoria del bot
   se reescribe con el estado nuevo. El jugador, por su parte, tira el dado con los botones de
   acciones: la tirada se manda al chat dentro del mensaje, así que el bot narra el resultado.

   Nada de esto toca la partida del sitio: es una capa nuestra encima.
   ============================================================================================= */
(function () {
  "use strict";
  var EM = window.emochiLab;
  if (!EM) return;

  var el = EM.el;
  var KEY = "emochi-lab:rpg:v1";
  var LIMITE = 2000;      // tope prudente del bloque que se escribe en la memoria; se avisa si se pasa
  var TICK = 6000;        // cada cuánto se mira el chat si el modo "leer solo" está encendido

  // --- el juego ---------------------------------------------------------------------------------
  var ETAPAS = ["Desconocidos", "Conocidos", "Amistad", "Cercanía", "Tensión", "Amantes"];
  var ETAPA_TIP = {
    "Desconocidos": "frío y cortés, con distancia",
    "Conocidos": "amable, de cosas normales",
    "Amistad": "cálido, con bromas y confianza",
    "Cercanía": "cariñoso y coqueto, busca el contacto",
    "Tensión": "provocador: se acerca y se aleja, te deja con ganas",
    "Amantes": "íntimo; el deseo ya no se esconde"
  };
  var STATS = [
    { id: "afecto", label: "Afecto", icon: "💗" },
    { id: "confianza", label: "Confianza", icon: "🤝" },
    { id: "deseo", label: "Deseo (lujuria)", icon: "🔥" },
    { id: "tension", label: "Tensión", icon: "⚡" }
  ];
  // Cada acción: con qué estadística se tira, su dificultad, lo que mueve si sale bien (`gain`) o
  // si sale mal (`miss`), la etapa mínima razonable (`min`: tirar antes de tiempo cuesta -3) y el
  // texto que se manda al chat. `{u}` es el jugador.
  var ACCIONES = [
    { id: "charla", name: "Charlar", icon: "💬", stat: "afecto", dc: 8,
      gain: { afecto: 1 }, miss: {},
      text: "*{u} le busca la conversación y le pregunta por su día.*",
      hint: "narra cómo reacciona y qué contesta" },
    { id: "broma", name: "Bromear", icon: "😄", stat: "afecto", dc: 10,
      gain: { afecto: 2, confianza: 1 }, miss: { afecto: -1 },
      text: "*{u} suelta una broma y se queda mirando para ver si le hace gracia.*",
      hint: "narra si le hace gracia de verdad o le sienta mal" },
    { id: "escucha", name: "Interesarse", icon: "👂", stat: "confianza", dc: 9,
      gain: { confianza: 2, afecto: 1 }, miss: { confianza: -1 },
      text: "*{u} le pregunta en serio cómo está y le escucha sin prisa.*",
      hint: "narra qué le cuenta (o si se cierra en banda)" },
    { id: "ayuda", name: "Ayudar", icon: "🛠", stat: "confianza", dc: 11,
      gain: { confianza: 2, afecto: 1 }, miss: { confianza: -1 },
      text: "*{u} se ofrece a echarle una mano con lo que le preocupa.*",
      hint: "narra si acepta la ayuda y cómo se siente al respecto" },
    { id: "detalle", name: "Detalle", icon: "🎁", stat: "afecto", dc: 10,
      gain: { afecto: 2, deseo: 1 }, miss: {},
      text: "*{u} le trae un detalle pequeño, algo que mencionó de pasada.*",
      hint: "narra su sorpresa y lo que significa para él/ella" },
    { id: "roce", name: "Acercarse", icon: "🫱", stat: "deseo", dc: 12, min: 3,
      gain: { deseo: 2, tension: 1 }, miss: { tension: 1 },
      text: "*{u} se acerca, le roza el brazo y sostiene la mirada un segundo de más.*",
      hint: "narra el cosquilleo (o el rechazo) del contacto" },
    { id: "coqueteo", name: "Coquetear", icon: "😏", stat: "deseo", dc: 13, min: 2,
      gain: { deseo: 2, tension: 2, afecto: 1 }, miss: { tension: -1 },
      text: "*{u} le mira de arriba abajo y le suelta algo con doble sentido.*",
      hint: "narra si entra al trapo o le quita hierro al asunto" },
    { id: "provocar", name: "Provocar", icon: "🔺", stat: "tension", dc: 14, min: 3,
      gain: { tension: 3, deseo: 1 }, miss: { tension: 1, deseo: -1 },
      text: "*{u} juega a acercarse y alejarse, dejándole con las ganas.*",
      hint: "narra su nerviosismo y cómo lo disimula" },
    { id: "beso", name: "Besar", icon: "💋", stat: "deseo", dc: 15, min: 3,
      gain: { deseo: 3, tension: 2, afecto: 1 }, miss: { deseo: -1, tension: 1 },
      text: "*{u} le coge la cara con las dos manos y le besa.*",
      hint: "narra el beso con detalle y lo que pasa por su cabeza después" },
    { id: "confesar", name: "Confesar", icon: "💗", stat: "afecto", dc: 16, min: 3,
      gain: { afecto: 4, confianza: 2 }, miss: { afecto: -1, confianza: -1 },
      text: "*{u} respira hondo y le dice lo que siente, sin adornos.*",
      hint: "narra su reacción: sorpresa, ternura o huida" },
    { id: "intimar", name: "Escena íntima", icon: "🍓", stat: "deseo", dc: 17, min: 4,
      gain: { deseo: 4, tension: 3, afecto: 2, confianza: 1 }, miss: { tension: -2, deseo: -1 },
      text: "*{u} apaga las luces y tira de él/ella hacia la cama.*",
      hint: "narra la escena con el nivel de detalle que tengas permitido" },
    { id: "dormir", name: "Dormir juntos", icon: "🌙", stat: "confianza", dc: 14, min: 4,
      gain: { confianza: 3, afecto: 2, tension: -2 }, miss: {},
      text: "*{u} se tumba a su lado y se queda dormido con la cabeza en su hombro.*",
      hint: "narra la calma que queda después" }
  ];

  var FLAGS_POR_DEFECTO = {
    lujuria: true,     // el deseo cuenta en las tiradas (si se apaga, -2 a las de deseo)
    explicito: false,  // el reglamento pide escenas íntimas detalladas
    compacto: false,   // memoria corta (solo estado), para planes con poco espacio
    resumen: true,     // añade los últimos sucesos a la memoria (continuidad)
    autoenviar: true,  // además de escribir la acción en el chat, pulsa enviar
    autoleer: false    // mira el chat cada pocos segundos y aplica lo que ponga el bot
  };

  // --- estado -----------------------------------------------------------------------------------
  var store = { v: 1, bots: {} };
  var state = { sheet: null, msg: null, busy: false, roll: null, raw: "", visible: false, auto: false, jugador: "" };
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
      v: 1,
      promptId: promptId || "",
      bot: nombre || "",
      player: "",
      stats: stats,
      etapa: 0,
      turnos: 0,
      vinculo: 0,
      flags: flags,
      log: log,
      memoria: { original: null, campo: "", texto: "", at: 0, error: "" },
      visto: ""
    };
  }
  // La ficha del bot en el que estamos. Se guarda por `promptId`, que es lo que identifica al bot.
  function ficha() {
    var id = (EM.bot && EM.bot.promptId) || "";
    if (!id) return state.sheet || null;
    var s = store.bots[id];
    if (!s) {
      s = nuevaFicha(id, EM.bot.title || "");
      store.bots[id] = s;
      guardar();
    }
    if (!s.stats) s.stats = {};
    STATS.forEach(function (st) { if (typeof s.stats[st.id] !== "number") s.stats[st.id] = 0; });
    if (!s.flags) s.flags = Object.assign({}, FLAGS_POR_DEFECTO);
    if (!s.log) s.log = [];
    if (!s.memoria) s.memoria = { original: null, campo: "", texto: "", at: 0, error: "" };
    if (EM.bot.title) s.bot = EM.bot.title;
    return s;
  }
  function conFicha(fn) {
    var s = ficha();
    if (!s || !s.promptId) return null;
    return fn(s);
  }
  function apuntar(s, kind, text, extra) {
    s.log.unshift({ at: Date.now(), kind: kind, text: text, extra: extra || null });
    if (s.log.length > 120) s.log.length = 120;
  }

  // --- las cuentas ------------------------------------------------------------------------------
  function recorta(n) { return Math.max(-5, Math.min(5, n | 0)); }
  function entreCeroCien(n) { return Math.max(0, Math.min(100, n | 0)); }
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
  // La tirada: 1d20 + modificador. 20 natural es crítico (dobla lo bueno) y 1 es pifia.
  function modificador(s, a) {
    var v = s.stats[a.stat] || 0;
    var m = Math.floor(v / 10) - 3;                    // 0 → -3 … 50 → +2 … 100 → +7
    m += Math.max(0, s.etapa - 2);                     // una relación ya hecha ayuda
    if (a.min != null && s.etapa < a.min) m -= 3;      // forzar antes de tiempo cuesta
    if (a.stat === "deseo" && !s.flags.lujuria) m -= 2;
    return m;
  }
  function escala(obj, mul) {
    var out = {};
    Object.keys(obj || {}).forEach(function (k) {
      var v = recorta(Math.round((obj[k] || 0) * mul));
      if (v) out[k] = v;
    });
    return out;
  }
  function tirada(s, a) {
    var d = 1 + Math.floor(Math.random() * 20);
    var mod = modificador(s, a);
    var total = d + mod;
    var t = { id: a.id, name: a.name, d: d, mod: mod, total: total, dc: a.dc, kind: "fallo", cambios: {} };
    if (d === 20) {
      t.kind = "crítico";
      t.cambios = escala(a.gain, 2);
      t.cambios.confianza = recorta((t.cambios.confianza || 0) + 1);
    } else if (d === 1) {
      t.kind = "pifia";
      t.cambios = escala(a.miss, 2);
      if (!Object.keys(t.cambios).length) t.cambios = { tension: 1, afecto: -1 };
    } else if (total >= a.dc) {
      t.kind = "éxito";
      t.cambios = escala(a.gain, 1);
    } else {
      t.kind = "fallo";
      t.cambios = escala(a.miss, 1);
    }
    return t;
  }
  // Aplica deltas a la ficha y devuelve lo que de verdad ha cambiado (con topes).
  function aplicar(s, deltas, motivo) {
    var hechos = {};
    Object.keys(deltas || {}).forEach(function (k) {
      if (typeof s.stats[k] !== "number") return;
      var antes = s.stats[k];
      var despues = entreCeroCien(antes + recorta(deltas[k]));
      if (despues !== antes) hechos[k] = despues - antes;
      s.stats[k] = despues;
      s.vinculo += Math.max(0, despues - antes);
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
  function resumen(cambios) {
    return Object.keys(cambios).map(function (k) {
      if (k === "etapa") return "etapa → " + cambios[k];
      var v = cambios[k];
      return etiqueta(k) + " " + (v > 0 ? "+" : "") + v;
    }).join(" · ");
  }
  function etiqueta(k) {
    var st = null;
    STATS.forEach(function (x) { if (x.id === k) st = x; });
    return st ? st.label : k;
  }
  function nombreEtapa(s) { return ETAPAS[Math.max(0, Math.min(ETAPAS.length - 1, s.etapa))]; }
  function jugador(s) {
    return (s && s.player) || (state.jugador || "") || "el jugador";
  }

  // --- lo que se le escribe al bot (reglamento + estado) ----------------------------------------
  function estadoLinea(s) {
    return "[Partida · afecto " + s.stats.afecto + "/100 · confianza " + s.stats.confianza +
      "/100 · deseo " + s.stats.deseo + "/100 · tensión " + s.stats.tension + "/100 · etapa " +
      nombreEtapa(s) + " · " + s.turnos + " turnos]";
  }
  function ultimos(s, n) {
    var out = [];
    s.log.forEach(function (e) {
      if (out.length >= n) return;
      if (e.kind === "suceso" || e.kind === "tirada") out.push(e.text);
    });
    return out.join(" · ").slice(0, 320);
  }
  function reglas(s) {
    var lista = ETAPAS.join(", ");
    return [
      "[SISTEMA DE PARTIDA — esto es para ti; nunca lo menciones ni lo cites]",
      "Esta conversación lleva un juego de rol con un marcador invisible. Cuatro valores de 0 a 100:",
      "· afecto: cuánto te gusta " + jugador(s) + " · confianza: cuánto te fías de él/ella",
      "· deseo: cuánto te atrae ahora mismo (lujuria) · tensión: la carga que hay en el aire",
      "Etapa de la relación: " + nombreEtapa(s) + " → te comportas " + (ETAPA_TIP[nombreEtapa(s)] || "") + ".",
      "Al FINAL de CADA respuesta añade una sola línea, exactamente con este formato:",
      "[RPG afecto+2 confianza0 deseo+1 tension+2 etapa=Cercanía]",
      "· deltas entre -3 y +3 según lo que acaba de pasar; pon 0 (o quita el campo) si no cambia nada.",
      "· escribe etapa= solo si la relación cambia de etapa (" + lista + ").",
      "· no expliques esa línea, no la comentes y no la trates como parte de la historia.",
      "Si el mensaje de " + jugador(s) + " trae una línea [Partida · … · tirada … · ÉXITO/FALLO/CRÍTICO/PIFIA],",
      "narra la escena según ese resultado: un fallo no rompe la historia, la complica.",
      s.flags.explicito
        ? "El contenido adulto está permitido: cuando el deseo y la tensión estén altos, describe la escena íntima con detalle y sin cortarte."
        : "Las escenas íntimas se insinúan: sin descripción explícita.",
      "No decidas por " + jugador(s) + " ni escribas sus actos, pensamientos o diálogos: solo los tuyos."
    ].join("\n");
  }
  function reglasCortas(s) {
    return "[PARTIDA · marcador invisible · no lo menciones] afecto " + s.stats.afecto +
      " · confianza " + s.stats.confianza + " · deseo " + s.stats.deseo + " · tensión " + s.stats.tension +
      " · etapa " + nombreEtapa(s) + ". Al final de CADA respuesta añade una línea" +
      " [RPG afecto+2 confianza0 deseo+1 tension+2 etapa=Cercanía] con deltas de -3 a +3 (0 si no cambia);" +
      " etapa solo si cambia (" + ETAPAS.join(", ") + "). No la comentes. Comportamiento según la etapa: " +
      (ETAPA_TIP[nombreEtapa(s)] || "") + ".";
  }
  function memoriaTexto(s) {
    var out = estadoLinea(s) + "\n" + (s.flags.compacto ? reglasCortas(s) : reglas(s));
    if (s.flags.resumen) {
      var u = ultimos(s, 3);
      if (u) out += "\nÚltimos sucesos: " + u;
    }
    return out;
  }
  function textoAccion(s, a, t) {
    var cuerpo = a.text.replace(/\{u\}/g, jugador(s));
    var marca = "[Partida · " + a.name + " · tirada " + t.d + (t.mod >= 0 ? "+" : "") + t.mod +
      " = " + t.total + " vs " + t.dc + " · " + t.kind.toUpperCase();
    var mov = resumen(t.cambios);
    if (mov) marca += " · " + mov;
    marca += " — " + (a.hint || "narra la respuesta") + "]";
    return cuerpo + "\n" + marca;
  }

  // --- leer la línea del marcador que escribe el bot ---------------------------------------------
  function sinAcentos(t) {
    return String(t || "").toLowerCase()
      .replace(/[áàäâ]/g, "a").replace(/[éèëê]/g, "e").replace(/[íìïî]/g, "i")
      .replace(/[óòöô]/g, "o").replace(/[úùüû]/g, "u").replace(/ñ/g, "n");
  }
  function extraerTag(texto) {
    var m = /\[\s*RPG\b([^\]]*)\]/i.exec(String(texto || ""));
    if (!m) return null;
    var cuerpo = m[1];
    var plano = sinAcentos(cuerpo);
    var d = {};
    ["afecto", "confianza", "deseo", "tension", "tensión"].forEach(function (k) {
      var clave = sinAcentos(k);
      var re = new RegExp(clave + "\\s*[:=]?\\s*([+-]?\\d+)", "g");
      var r = re.exec(plano);
      if (r) d[k === "tensión" ? "tension" : k] = recorta(parseInt(r[1], 10) || 0);
    });
    var e = /etapa\s*[:=]?\s*([a-z]+)/.exec(plano);
    var etapa = "";
    if (e) {
      ETAPAS.forEach(function (nombre) {
        if (sinAcentos(nombre) === e[1]) etapa = nombre;
        else if (sinAcentos(nombre).slice(0, 4) === e[1].slice(0, 4) && !etapa) etapa = nombre;
      });
    }
    return { raw: m[0], d: d, etapa: etapa };
  }
  // Aplica la línea del bot (lo que él propone, recortado por el reglamento).
  function aplicarTag(s, tag) {
    if (!tag) return null;
    var deltas = tag.d || {};
    // la tensión se enfría sola si el bot no la movió
    if (!deltas.tension) deltas.tension = -1;
    var hechos = aplicar(s, deltas, null);
    s.turnos++;
    if (tag.etapa) {
      var idx = ETAPAS.indexOf(tag.etapa);
      if (idx > s.etapa) {
        s.etapa = idx;
        hechos.etapa = ETAPAS[idx];
      }
    }
    var mov = resumen(hechos);
    apuntar(s, "suceso", (mov ? mov + " — " : "") + "el bot marcó " + (tag.raw || "").slice(0, 60), { tag: tag.raw });
    guardar();
    return hechos;
  }

  // --- hablar con la página: escribir la acción en su caja de texto ------------------------------
  // La caja del chat no lleva id ni clase estable, así que se busca por forma: el campo de texto
  // visible más grande que esté más abajo de la pantalla (su chat la tiene abajo). Si no aparece,
  // se copia al portapapeles y se avisa: nunca se pierde la tirada.
  function cajaDeTexto() {
    var cands = [];
    var nodos = document.querySelectorAll("textarea, input[type=text], [contenteditable='true']");
    var alto = window.innerHeight || 0;
    Array.prototype.forEach.call(nodos, function (n) {
      if (n.id === "em-root" || n.closest("#em-root")) return;
      if (n.disabled || n.readOnly) return;
      var r = n.getBoundingClientRect();
      if (r.width < 70 || r.height < 14) return;
      var st = getComputedStyle(n);
      if (st.visibility === "hidden" || st.display === "none" || st.opacity === "0") return;
      cands.push({ n: n, area: r.width * r.height, abajo: r.bottom > alto * 0.55 ? 1 : 0, bottom: r.bottom });
    });
    if (!cands.length) return null;
    // su chat tiene la caja abajo: se prefiere lo que esté en la mitad de abajo, y de eso lo más
    // grande (y si hay empate, lo más bajo). Así no se coge un buscador de la cabecera.
    cands.sort(function (a, b) {
      return (b.abajo - a.abajo) || (b.area - a.area) || (b.bottom - a.bottom);
    });
    return cands[0].n;
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
    // atraparla, o el rechazo se escapa como error de la página (y nos lo apunta el motor).
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
  function mandarAlChat(texto) {
    var caja = cajaDeTexto();
    if (!caja) {
      var copiado = alPortapapeles(texto);
      return { ok: false, why: copiado ? "no encontré la caja del chat; te lo he copiado al portapapeles para que lo pegues" : "no encontré la caja del chat" };
    }
    escribirEn(caja, texto);
    if (!state.sheet || !state.sheet.flags.autoenviar) return { ok: true, why: "escrito en el chat (pulsa enviar tú)" };
    var via = pulsarEnviar(caja);
    return { ok: true, why: via ? "enviado al chat (" + via + ")" : "escrito, pero no encontré cómo enviarlo" };
  }

  // --- leer el marcador del bot sin tocar la pantalla -------------------------------------------
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
    if (!s || !s.promptId) return Promise.resolve({ ok: false, why: "todavía no sé con qué bot juegas" });
    if (cola) return Promise.resolve({ ok: false, why: "ya estaba leyendo" });
    cola = true;
    return EM.api.historial(s.promptId)
      .catch(function () { return EM.api.historialV1(s.promptId); })
      .catch(function () { return EM.api.ultimaConversacion(s.promptId); })
      .then(function (res) {
        cola = false;
        state.raw = JSON.stringify(res).slice(0, 6000);
        var msgs = sacarMensajes(res);
        var elegido = null;
        for (var i = msgs.length - 1; i >= 0; i--) {
          var m = msgs[i];
          var txt = String((m && (m.content || m.displayContent)) || "");
          if (/\[\s*RPG/i.test(txt)) {
            elegido = { m: m, i: i, txt: txt, tag: extraerTag(txt) };
            break;
          }
        }
        if (!elegido) {
          return { ok: false, why: "no he visto ninguna línea [RPG …] en los últimos " + msgs.length + " mensajes", n: msgs.length };
        }
        var clave = String(elegido.m.id || "") + "@" + elegido.i;
        if (clave === s.visto) return { ok: false, why: "sin novedades desde la última vez", n: msgs.length };
        s.visto = clave;
        var hechos = aplicarTag(s, elegido.tag);
        render();
        return { ok: true, cambios: hechos, tag: elegido.tag.raw, n: msgs.length };
      })
      .catch(function (e) {
        cola = false;
        return { ok: false, why: "no pude leer el historial: " + (e && e.message) };
      });
  }

  // --- escribir el reglamento en la memoria del bot ----------------------------------------------
  // Se guarda antes lo que había (para poder devolverlo) y se prueba el campo `memory`; si el
  // servidor contesta que no, se prueban otros nombres. Lo que conteste se enseña tal cual: sin
  // sesión no se puede probar, así que el panel no se lo inventa.
  var CAMPOS = ["memory", "content", "text", "memoryText", "remark"];
  function probarCampos(s, texto, i, errores) {
    i = i || 0;
    errores = errores || [];
    if (i >= CAMPOS.length) {
      return Promise.resolve({ ok: false, why: "el servidor no aceptó ninguno de estos campos: " + CAMPOS.join(", "), errores: errores });
    }
    return EM.api.ponMemoriaDeBot(s.promptId, CAMPOS[i], texto).then(function (res) {
      s.memoria.campo = CAMPOS[i];
      s.memoria.texto = texto;
      s.memoria.at = Date.now();
      s.memoria.error = "";
      apuntar(s, "memoria", "reglamento escrito en la memoria de " + (s.bot || "el bot") + " (" + texto.length + " caracteres, campo `" + CAMPOS[i] + "`)");
      guardar();
      render();
      return { ok: true, campo: CAMPOS[i], res: res, length: texto.length };
    }).catch(function (e) {
      var msg = (e && e.message) || "";
      // sin sesión no tiene sentido probar más nombres de campo: el problema no es el nombre
      if (/sin sesi[oó]n|\(401\)|\(403\)/.test(msg)) {
        return { ok: false, why: "necesitas entrar en emochi.com con tu cuenta: sin sesión no puedo tocar la memoria del bot", sesion: true, errores: errores };
      }
      errores.push(CAMPOS[i] + " → " + msg);
      return probarCampos(s, texto, i + 1, errores);
    });
  }
  function inyectar() {
    var s = ficha();
    if (!s || !s.promptId) return Promise.resolve({ ok: false, why: "todavía no sé con qué bot juegas" });
    var texto = memoriaTexto(s);
    if (texto.length > LIMITE) {
      return Promise.resolve({ ok: false, why: "el bloque ocupa " + texto.length + " caracteres y el tope que me he puesto es " + LIMITE + ": prueba «memoria corta»", length: texto.length });
    }
    state.busy = true;
    render();
    return EM.api.memoriaDeBot(s.promptId).then(function (res) {
      if (s.memoria.original == null) {
        var previo = textoDeMemoria(res);
        s.memoria.original = previo == null ? "" : previo;
        guardar();
      }
      return probarCampos(s, texto, 0);
    }).catch(function (e) {
      var msg = (e && e.message) || "";
      if (/sin sesi[oó]n|\(401\)|\(403\)/.test(msg)) {
        return { ok: false, why: "necesitas entrar en emochi.com con tu cuenta: sin sesión no puedo ni leer ni escribir la memoria del bot", sesion: true };
      }
      // si no se puede ni leer, se intenta escribir igual (a lo mejor solo falla la lectura)
      return probarCampos(s, texto, 0).then(function (r) {
        if (r.ok) return r;
        return { ok: false, why: "leer la memoria falló (" + msg + ") y escribir tampoco: " + r.why, errores: r.errores };
      });
    }).then(function (r) {
      state.busy = false;
      aviso(r.ok ? "🧠 Reglamento dentro (campo `" + r.campo + "`, " + r.length + " caracteres)." : "No pude inyectar: " + r.why, !r.ok, r.errores);
      render();
      return r;
    });
  }
  function quitar() {
    var s = ficha();
    if (!s || !s.promptId) return Promise.resolve({ ok: false, why: "todavía no sé con qué bot juegas" });
    if (s.memoria.original == null) return Promise.resolve({ ok: false, why: "no guardé la memoria que había antes: mírala y quítala a mano" });
    state.busy = true;
    render();
    return EM.api.ponMemoriaDeBot(s.promptId, s.memoria.campo || "memory", s.memoria.original).then(function () {
      s.memoria.texto = "";
      s.memoria.at = 0;
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

  // --- la partida: tirar una acción ---------------------------------------------------------------
  function hacerAccion(a) {
    var s = ficha();
    if (!s || !s.promptId) {
      aviso("Abre el chat de un bot y espera un segundo: necesito su id para apuntar la partida.", true);
      render();
      return null;
    }
    var t = tirada(s, a);
    var antes = { etapa: s.etapa };
    aplicar(s, t.cambios, null);
    if (s.etapa !== antes.etapa) t.cambios.etapa = ETAPAS[s.etapa];
    apuntar(s, "tirada", "🎲 " + a.name + " · " + t.d + (t.mod >= 0 ? "+" : "") + t.mod + " = " + t.total +
      " vs " + t.dc + " · " + t.kind + (resumen(t.cambios) ? " · " + resumen(t.cambios) : ""), { accion: a.id });
    guardar();
    state.roll = t;
    var texto = textoAccion(s, a, t);
    var r = mandarAlChat(texto);
    aviso((t.kind === "crítico" ? "✨ " : t.kind === "pifia" ? "💥 " : "🎲 ") + a.name + ": " +
      t.d + (t.mod >= 0 ? "+" : "") + t.mod + " = " + t.total + " vs " + t.dc + " · " + t.kind.toUpperCase() +
      (resumen(t.cambios) ? " — " + resumen(t.cambios) : "") + (r && r.why ? " · " + r.why : ""), !r || !r.ok);
    render();
    return t;
  }
  function aviso(text, bad, extra) {
    state.msg = { text: text, bad: !!bad, extra: extra || null };
  }
  // Plan B para inyectar: si su memoria no deja escribir (planes, permisos, campos distintos), el
  // reglamento se deja escrito en la caja del chat para mandarlo como primer mensaje de la charla.
  function ponerEnElChat() {
    var s = ficha();
    if (!s || !s.promptId) {
      aviso("Abre el chat de un bot y espera un segundo: necesito su id.", true);
      render();
      return { ok: false, why: "sin bot" };
    }
    var texto = memoriaTexto(s);
    var caja = cajaDeTexto();
    if (!caja) {
      var copiado = alPortapapeles(texto);
      aviso(copiado ? "No encontré la caja del chat: te lo he copiado al portapapeles; pégalo como primer mensaje." : "No encontré la caja del chat.", true);
      render();
      return { ok: false, why: "sin caja" };
    }
    escribirEn(caja, texto);
    apuntar(s, "memoria", "reglamento puesto en la caja del chat para mandarlo como primer mensaje");
    guardar();
    aviso("✍ Reglamento escrito en el chat: mándalo como primer mensaje. (Quedará en el historial; si puedes, mejor inyéctalo en su memoria.)", false);
    render();
    return { ok: true };
  }

  // --- la interfaz -------------------------------------------------------------------------------
  function btn(text, cls, onclick, extra) {
    return el("button", Object.assign({ type: "button", class: cls || "em-btn", text: text, onclick: onclick }, extra || {}));
  }
  function barra(id) {
    var s = state.sheet;
    var v = s ? s.stats[id] || 0 : 0;
    var st = null;
    STATS.forEach(function (x) { if (x.id === id) st = x; });
    return el("div", { class: "em-stat" }, [
      el("span", { class: "em-stat-ico", text: (st && st.icon) || "" }),
      el("span", { class: "em-stat-name", text: (st && st.label) || id }),
      el("span", { class: "em-bar" }, [el("i", { class: "em-bar-fill", style: { width: Math.max(0, Math.min(100, v)) + "%" } })]),
      el("b", { class: "em-stat-num", text: String(v) })
    ]);
  }
  function accionBtn(a) {
    var s = state.sheet;
    var mod = s ? modificador(s, a) : 0;
    var bloqueada = !!(a.min != null && s && s.etapa < a.min);
    return el("button", {
      type: "button",
      class: "em-acc" + (bloqueada ? " em-acc-lock" : ""),
      title: etiqueta(a.stat) + " · dificultad " + a.dc + (bloqueada ? " · antes de tiempo cuesta -3" : ""),
      onclick: function () { hacerAccion(a); }
    }, [
      el("span", { class: "em-acc-ico", text: a.icon }),
      el("span", { class: "em-acc-name", text: a.name }),
      el("span", { class: "em-acc-meta", text: etiqueta(a.stat).split(" ")[0] + " " + (mod >= 0 ? "+" : "") + mod + " · DC " + a.dc })
    ]);
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
  function vista() {
    var out = el("div", { class: "em-rpg" });
    var s = state.sheet;
    if (!s || !s.promptId) {
      out.appendChild(el("div", { class: "em-note em-note-bad" }, [
        el("p", { text: "Todavía no sé con qué bot juegas." }),
        el("small", { class: "em-hint", text: "Abre el chat de un personaje (o manda un mensaje) y en un segundo lo sabré: su app manda su id en sus peticiones y yo lo copio." })
      ]));
      return out;
    }
    // quién juega
    out.appendChild(el("div", { class: "em-rpg-head" }, [
      el("span", { class: "em-rpg-bot", text: s.bot || "este bot" }),
      el("span", { class: "em-rpg-note", text: (s.player ? "tú: " + s.player : "tú: el jugador") + " · " + s.turnos + " turnos · " + s.vinculo + " de vínculo" })
    ]));
    // el marcador
    var ficha6 = el("div", { class: "em-ficha" });
    STATS.forEach(function (st) { ficha6.appendChild(barra(st.id)); });
    ficha6.appendChild(el("div", { class: "em-etapa" }, [
      el("span", { class: "em-etapa-badge", text: nombreEtapa(s) }),
      el("span", { class: "em-etapa-tip", text: ETAPA_TIP[nombreEtapa(s)] || "" })
    ]));
    out.appendChild(ficha6);
    // la tirada de antes
    if (state.roll) {
      var t = state.roll;
      out.appendChild(el("div", { class: "em-roll em-roll-" + t.kind }, [
        el("b", { text: "🎲 " + t.name + ": " + t.d + (t.mod >= 0 ? "+" : "") + t.mod + " = " + t.total }),
        el("span", { text: " vs " + t.dc + " · " + t.kind.toUpperCase() + (resumen(t.cambios) ? " — " + resumen(t.cambios) : "") })
      ]));
    }
    if (state.msg) {
      var caja = el("div", { class: "em-rpg-msg" + (state.msg.bad ? " em-rpg-msg-bad" : "") });
      caja.appendChild(el("span", { text: state.msg.text }));
      if (state.msg.extra && state.msg.extra.length) {
        caja.appendChild(el("details", { class: "em-det" }, [
          el("summary", { text: "Lo que ha contestado el servidor" }),
          el("pre", { class: "em-pre", text: state.msg.extra.join("\n") })
        ]));
      }
      out.appendChild(caja);
    }
    // las acciones
    out.appendChild(el("h4", { class: "em-h", text: "Acciones — tira el dado y se lo manda al chat" }));
    var rej = el("div", { class: "em-accs" });
    ACCIONES.forEach(function (a) { rej.appendChild(accionBtn(a)); });
    out.appendChild(rej);
    // la memoria
    out.appendChild(el("h4", { class: "em-h", text: "El reglamento dentro del bot" }));
    var txt = memoriaTexto(s);
    var dentro = !!s.memoria.texto;
    out.appendChild(el("div", { class: "em-mem" }, [
      el("span", { class: "em-mem-state", text: dentro ? (s.memoria.campo === "memory" ? "🧠 inyectado" : "🧠 inyectado (campo `" + s.memoria.campo + "`)") : "sin inyectar" }),
      el("span", { class: "em-mem-len" + (txt.length > LIMITE ? " em-mem-over" : ""), text: txt.length + " caracteres" })
    ]));
    out.appendChild(el("div", { class: "em-hint", text: "Se escribe en la memoria del bot: lo lee en todos los mensajes, también en el primero." }));
    var acts = el("div", { class: "em-acts" }, [
      btn(state.busy ? "…" : "🧠 Inyectar en el bot", "em-btn em-btn-main", function () { inyectar(); }, { disabled: state.busy }),
      btn("🧹 Devolver su memoria", "em-btn", function () { quitar(); }, { disabled: state.busy }),
      btn("✍ Poner en el chat", "em-btn", function () { ponerEnElChat(); }, { title: "Si su memoria no deja escribir: deja el reglamento en la caja del chat para que lo mandes como primer mensaje" }),
      btn("📖 Leer del chat", "em-btn", function () {
        aviso("Leyendo el chat…", false);
        render();
        leer().then(function (r) {
          aviso(r.ok ? "📖 Aplicado: " + (resumen(r.cambios) || "nada que cambiar") + " (línea del bot: " + r.tag + ")" : "📖 " + r.why, !r.ok);
          render();
        });
      }),
      btn("♻ Reiniciar partida", "em-btn em-btn-bad", function () {
        var f = ficha();
        if (!f) return;
        f.stats = { afecto: 0, confianza: 0, deseo: 0, tension: 0 };
        f.etapa = 0;
        f.turnos = 0;
        f.vinculo = 0;
        f.log = [];
        f.visto = "";
        state.roll = null;
        apuntar(f, "nota", "partida reiniciada a cero");
        guardar();
        aviso("♻ Partida a cero.", false);
        render();
      })
    ]);
    out.appendChild(acts);
    // ajustes
    out.appendChild(el("h4", { class: "em-h", text: "Ajustes de la partida" }));
    out.appendChild(el("div", { class: "em-toggles" }, [
      interruptor("lujuria", "🔥 lujuria", "El deseo cuenta en las tiradas; si lo apagas, cuesta -2"),
      interruptor("explicito", "🍓 explícito", "El reglamento pide escenas íntimas con detalle"),
      interruptor("compacto", "📏 memoria corta", "Solo el estado y cuatro reglas (para memorias pequeñas)"),
      interruptor("resumen", "📜 continuidad", "Añade los últimos sucesos a la memoria"),
      interruptor("autoenviar", "✍ enviar solo", "Pulsa enviar por ti; apágalo si prefieres revisarlo antes"),
      interruptor("autoleer", "🔁 leer solo", "Mira el chat cada pocos segundos y aplica la línea del bot")
    ]));
    // lo que se le escribe, a la vista
    out.appendChild(el("details", { class: "em-det" }, [
      el("summary", { text: "Ver exactamente lo que se le escribe al bot" }),
      el("pre", { class: "em-pre", text: txt })
    ]));
    out.appendChild(el("details", { class: "em-det" }, [
      el("summary", { text: "¿Cómo funciona esto?" }),
      el("div", {
        class: "em-hint",
        html: "El bot no sabe nada de números: se le escribe un reglamento en <b>su memoria</b> (lo lee en todos los mensajes, desde el primero) y se le pide que cierre cada respuesta con una línea de marcador, por ejemplo <code>[RPG afecto+2 deseo+1]</code>. La cuenta de verdad la lleva el panel, por bot: lee esa línea, la recorta a lo que permite el reglamento (deltas de -3 a +3) y reescribe su memoria con el estado nuevo. Al pulsar una acción se tira 1d20 + lo que hayas ganado: 20 natural es crítico (dobla lo bueno), 1 es pifia (dobla lo malo), y la tirada va dentro del mensaje para que el bot narre el resultado."
      })
    ]));
    if (state.raw) {
      out.appendChild(el("details", { class: "em-det" }, [
        el("summary", { text: "Ver lo último que contestó su API" }),
        el("pre", { class: "em-pre", text: state.raw })
      ]));
    }
    // el registro
    out.appendChild(el("h4", { class: "em-h", text: "Registro" }));
    var log = el("div", { class: "em-log" });
    if (!s.log.length) log.appendChild(el("div", { class: "em-hint", text: "Nada todavía. Tira una acción o inyecta el reglamento." }));
    s.log.slice(0, 16).forEach(function (e) {
      log.appendChild(el("div", { class: "em-log-item" }, [
        el("span", { class: "em-log-ico", text: e.kind === "tirada" ? "🎲" : e.kind === "suceso" ? "📈" : e.kind === "memoria" ? "🧠" : "•" }),
        el("span", { class: "em-log-txt", text: e.text })
      ]));
    });
    out.appendChild(log);
    return out;
  }
  function render() {
    state.sheet = ficha();
    var host = state.host;
    if (!host) return;
    EM.clear(host);
    host.appendChild(vista());
  }

  // --- enganche con el resto del panel ------------------------------------------------------------
  EM.rpg = {
    render: function (host) {
      state.host = host;
      state.visible = true;
      state.sheet = ficha();
      render();
      return true;
    },
    setVisible: function (v) { state.visible = !!v; },
    // para probar desde la consola / el laboratorio
    ficha: ficha,
    acciones: ACCIONES,
    etapas: ETAPAS,
    stats: STATS,
    tirada: function (id) {
      var s = ficha();
      var a = null;
      ACCIONES.forEach(function (x) { if (x.id === id) a = x; });
      if (!s || !a) return null;
      return tirada(s, a);
    },
    hacerAccion: function (id) {
      var a = null;
      ACCIONES.forEach(function (x) { if (x.id === id) a = x; });
      return a ? hacerAccion(a) : null;
    },
    extraerTag: extraerTag,
    reglas: reglas,
    reglasCortas: reglasCortas,
    memoriaTexto: memoriaTexto,
    textoAccion: textoAccion,
    etapaQue: etapaQue,
    aplicar: aplicar,
    aplicarTag: aplicarTag,
    inyectar: inyectar,
    quitar: quitar,
    ponerEnElChat: ponerEnElChat,
    leer: leer,
    tokens: tokens,
    estado: function () { return state.sheet; },
    log: function () { return state.sheet ? state.sheet.log.slice() : []; }
  };

  cargar();
  // el nombre del jugador (su rol principal) para que los mensajes no digan "el jugador"
  function buscarJugador() {
    return EM.api.personas().then(function (res) {
      var lista = [];
      sacarLista(res, lista);
      var elegido = null;
      lista.forEach(function (p) {
        if (!elegido && p && (p.isPrimary || p.personaEnabled) && p.name) elegido = p;
      });
      if (elegido) {
        state.jugador = elegido.name;
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
    if (state.visible) render();
  });
  setInterval(function () {
    if (!state.visible) return;
    var s = ficha();
    if (!s || !s.promptId || !s.flags.autoleer) return;
    leer().then(function (r) {
      if (r.ok) {
        aviso("📖 Aplicado: " + (resumen(r.cambios) || "nada que cambiar"), false);
        render();
      }
    });
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
    tab: "roles",     // roles | rpg (las dos caras del panel)
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

  var root, fab, panel, bodyEl, statusEl, msgEl, titleEl, footEl, tabsEl, tabRolesEl, tabRpgEl;

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
    if (state.tab === "rpg") {
      titleEl.textContent = "Juego de rol";
      statusEl.textContent = "";
      msgEl.hidden = true;
      if (footEl) footEl.hidden = true;
      var keepScroll = bodyEl.scrollTop;
      EM.clear(bodyEl);
      if (!EM.rpg) {
        bodyEl.appendChild(el("div", { class: "em-note em-note-bad", text: "La capa de juego no se ha cargado (falta rpg.js en el manifest)." }));
      } else {
        var host = el("div", { class: "em-rpg-host" });
        bodyEl.appendChild(host);
        EM.rpg.render(host);
        bodyEl.scrollTop = keepScroll;
      }
      return;
    }
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
    if (state.tab === "rpg") {
      if (EM.rpg) EM.rpg.setVisible(true);
      render();
      return;
    }
    if (state.list === null) load();
    else render();
  }
  function closePanel() {
    state.open = false;
    panel.hidden = true;
    fab.setAttribute("aria-expanded", "false");
    if (EM.rpg) EM.rpg.setVisible(false);
  }
  // Dos pestañas: los roles (🎭) y la partida (🎲). La segunda vive en rpg.js.
  function setTab(t) {
    state.tab = t === "rpg" ? "rpg" : "roles";
    if (tabRolesEl) tabRolesEl.className = "em-tab" + (state.tab === "roles" ? " em-tab-on" : "");
    if (tabRpgEl) tabRpgEl.className = "em-tab" + (state.tab === "rpg" ? " em-tab-on" : "");
    if (EM.rpg) EM.rpg.setVisible(state.tab === "rpg" && state.open);
    render();
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
    return attach();
  }

  function mount() {
    if (root) return;
    root = el("div", { id: "em-root" });

    fab = el("button", {
      id: "em-fab",
      type: "button",
      title: "Roles y juego de rol — emochi",
      "aria-label": "Mi panel",
      "aria-expanded": "false",
      onclick: function () { state.open ? closePanel() : openPanel(); }
    }, [el("span", { text: "🎭" })]);

    var head = el("header", { class: "em-head" });
    // Las dos caras del panel: los roles (🎭) y la partida (🎲).
    tabsEl = el("div", { class: "em-tabs" });
    tabRolesEl = el("button", { type: "button", class: "em-tab em-tab-on", text: "🎭 Roles", onclick: function () { setTab("roles"); } });
    tabRpgEl = el("button", { type: "button", class: "em-tab", text: "🎲 Juego", title: "Estadísticas, tiradas y acciones", onclick: function () { setTab("rpg"); } });
    tabsEl.appendChild(tabRolesEl);
    tabsEl.appendChild(tabRpgEl);
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

    panel = el("aside", { id: "em-panel", hidden: true, "aria-label": "Mis roles" }, [tabsEl, head, msgEl, bodyEl, footEl]);
    root.appendChild(fab);
    root.appendChild(panel);
    EM.whenBody(function () {
      attach();
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

