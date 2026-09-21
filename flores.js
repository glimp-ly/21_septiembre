/* ==========================================================
   FLORES — modelos SVG de flores y ramos envueltos.
   Base: proyecto ~/flores-amarillas/js/bouquets.js
   (ramo completo en un SVG: tallos curvos convergentes,
   hojas, papel de regalo y lazo; flores con pétalos
   curvos y degradados). Adaptado a la paleta rosa/roja.
   ========================================================== */
(function (root) {
  "use strict";

  let uid = 0;

  /* Aleatorio con semilla (para variar un poco cada ramo) */
  function mulberry(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const PALETAS = {
    girasol: { main: "#ffc400", light: "#ffe680", deep: "#c88a0c", centro: "#8a5f00" },
    tulipan: { main: "#e63956", light: "#ff8fa3", deep: "#8f0f2e" },
    rosa: { main: "#f0506e", light: "#ffb3c2", deep: "#8f0f2e" },
    lirio: { main: "#a678f0", light: "#e3ccff", deep: "#5b21b6" },
  };

  /* Paletas monocromáticas para teñir el ramo generado de un solo color */
  const COLOR_PALS = {
    rojo: { main: "#e63956", light: "#ff8fa3", deep: "#8f0f2e", centro: "#5c1a2a" },
    rosa: { main: "#f7b8c8", light: "#ffe3ec", deep: "#c2436b", centro: "#8f2c4e" },
    morado: { main: "#a678f0", light: "#e3ccff", deep: "#5b21b6", centro: "#3d1476" },
    amarillo: { main: "#ffc400", light: "#ffe680", deep: "#c88a0c", centro: "#8a5f00" },
  };

  function gradDefs(u, pal) {
    return `<defs>`
      + `<linearGradient id="${u}p" x1="0" y1="0" x2="0" y2="1">`
      + `<stop offset="0" stop-color="${pal.light}"/><stop offset="1" stop-color="${pal.main}"/></linearGradient>`
      + `<radialGradient id="${u}c" cx="0.5" cy="0.45" r="0.65">`
      + `<stop offset="0" stop-color="${pal.light}"/><stop offset="1" stop-color="${pal.main}"/></radialGradient>`
      + `</defs>`;
  }

  /* --- Girasol: doble corona de pétalos + centro texturado --- */
  function girasol(pal, u) {
    let atras = "", frente = "";
    for (let i = 0; i < 12; i++) {
      atras += `<ellipse cx="0" cy="-19" rx="7.5" ry="17" fill="url(#${u}p)" stroke="${pal.deep}" stroke-width="0.8" transform="rotate(${i * 30})"/>`;
      frente += `<ellipse cx="0" cy="-14" rx="6" ry="12" fill="${pal.light}" opacity="0.95" transform="rotate(${i * 30 + 15})"/>`;
    }
    let puntos = "";
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      puntos += `<circle cx="${(Math.cos(a) * 6.5).toFixed(1)}" cy="${(Math.sin(a) * 6.5).toFixed(1)}" r="1.5" fill="#5c3d00"/>`;
    }
    return `${atras}${frente}`
      + `<circle r="10.5" fill="${pal.centro}" stroke="#5c3d00" stroke-width="1.2"/>${puntos}`;
  }

  /* --- Tulipán: copa de 3 pétalos visibles con corona --- */
  function tulipan(pal, u) {
    return `<path d="M-16,-6 C-19,13 -10,25 0,25 C10,25 19,13 16,-6 L8,-19 L0,-7 L-8,-19 Z" fill="url(#${u}p)" stroke="${pal.deep}" stroke-width="1.2"/>`
      + `<path d="M-8,-19 L0,-7 L8,-19 C6,3 3,15 0,25 C-3,15 -6,3 -8,-19 Z" fill="${pal.light}" opacity="0.8"/>`
      + `<path d="M-16,-6 C-19,13 -10,25 0,25" fill="none" stroke="${pal.deep}" stroke-width="1.2" opacity="0.55"/>`
      + `<path d="M16,-6 C19,13 10,25 0,25" fill="none" stroke="${pal.deep}" stroke-width="1.2" opacity="0.55"/>`;
  }

  /* --- Rosa: capas en espiral --- */
  function rosa(pal, u) {
    let fuera = "", dentro = "";
    for (let i = 0; i < 6; i++) {
      fuera += `<ellipse cx="0" cy="-12" rx="9.5" ry="13" fill="${i % 2 ? `url(#${u}p)` : pal.light}" stroke="${pal.deep}" stroke-width="0.9" transform="rotate(${i * 60})"/>`;
    }
    for (let i = 0; i < 5; i++) {
      dentro += `<ellipse cx="0" cy="-6.5" rx="5.5" ry="8" fill="${pal.main}" opacity="0.92" transform="rotate(${i * 72 + 36})"/>`;
    }
    return `${fuera}${dentro}`
      + `<circle r="9" fill="url(#${u}c)" stroke="${pal.deep}" stroke-width="1"/>`
      + `<path d="M0,0 m-4.5,0 a4.5,4.5 0 1,1 9,0 a7,7 0 1,1 -14,0 a9.5,9.5 0 1,1 19,0" fill="none" stroke="${pal.deep}" stroke-width="1.5" stroke-linecap="round"/>`;
  }

  /* --- Lirio morado: vara arqueada con campanillas + hojas anchas --- */
  function lirio(pal, u) {
    const campana = (x, y, giro, s) =>
      `<g transform="translate(${x} ${y}) rotate(${giro}) scale(${s})">`
      + `<line x1="0" y1="-4" x2="0" y2="0" stroke="${"#5b21b6"}" stroke-width="1.4"/>`
      + `<path d="M0 0 C-8 2 -10 11 -6.5 17.5 L6.5 17.5 C10 11 8 2 0 0 Z" fill="url(#${u}c)" stroke="${pal.deep}" stroke-width="1.4"/>`
      + `<circle cx="0" cy="19.5" r="2" fill="#ffe680"/></g>`;
    return `<path d="M-4 40 Q-16 30 -22 12 Q-8 20 -2 38 Z" fill="#3e9e4f" stroke="#2a7a38" stroke-width="1.2"/>`
      + `<path d="M4 40 Q18 30 24 10 Q10 20 2 38 Z" fill="#52b364" stroke="#2a7a38" stroke-width="1.2"/>`
      + `<path d="M0 40 Q-3 8 16 -26" fill="none" stroke="#2a7a38" stroke-width="3" stroke-linecap="round"/>`
      + campana(-1, 12, -12, 1) + campana(2, 0, -6, 0.9) + campana(6, -11, 0, 0.8) + campana(11, -21, 8, 0.68)
      + `<circle cx="16" cy="-27" r="3" fill="${pal.main}" stroke="${pal.deep}" stroke-width="1.2"/>`;
  }

  function florInterior(kind, pal, rnd, u) {
    if (kind === "tulip") return tulipan(pal, u);
    if (kind === "rose") return rosa(pal, u);
    if (kind === "lily") return lirio(pal, u);
    return girasol(pal, u); // 'sunflower'
  }

  const ESCALA = { sunflower: 0.78, tulip: 1, rose: 1, lily: 1 };

  /* Flor suelta (para el campo del minijuego y minis del ramo) */
  function makeFlor(kind, palNro) {
    const u = "f" + (++uid);
    const pal = PALETAS[palNro] || PALETAS.girasol;
    const rnd = mulberry(uid * 31 + 7);
    void rnd;
    return `<svg viewBox="0 0 100 100" role="img" aria-label="${kind}">${gradDefs(u, pal)}`
      + `<g transform="translate(50 54) scale(1.35)">${florInterior(kind, pal, rnd, u)}</g></svg>`;
  }

  /* Ramo envuelto completo: tallos curvos, hojas, papel y lazo.
     items: [{kind:'sunflower'|'tulip'|'rose'|'lily', pal:'girasol'|...}] */
  function makeRamo(items, opts) {
    const o = Object.assign({ seed: 1, badge: "" }, opts || {});
    const rnd = mulberry(o.seed * 97 + 13);
    const n = Math.max(items.length, 1);
    const u = "r" + (++uid);

    let tallos = "", flores = "";
    // Se pintan primero las pequeñas: las más grandes quedan por encima
    const orden = items
      .map((it, i) => ({ it, i }))
      .sort((a, b) => {
        const sa = (0.92 + 0.38 * Math.sin(Math.PI * (n === 1 ? 0.5 : a.i / (n - 1)))) * (ESCALA[a.it.kind] || 1);
        const sb = (0.92 + 0.38 * Math.sin(Math.PI * (n === 1 ? 0.5 : b.i / (n - 1)))) * (ESCALA[b.it.kind] || 1);
        return sa - sb;
      });
    orden.forEach(({ it, i }, k) => {
      const t = n === 1 ? 0.5 : i / (n - 1);
      const x = 58 + 84 * t;
      const y = 124 - 66 * Math.sin(Math.PI * t);
      const s = (0.92 + 0.38 * Math.sin(Math.PI * t)) * (ESCALA[it.kind] || 1);
      const pal = (typeof it.pal === "string" ? PALETAS[it.pal] : it.pal) || PALETAS.girasol;
      const rot = (rnd() * 24 - 12).toFixed(1);
      const mx = ((100 + x) / 2).toFixed(1), my = ((205 + y) / 2 + 8).toFixed(1);
      tallos += `<path d="M100,205 Q${mx},${my} ${x.toFixed(1)},${(y + 12).toFixed(1)}" stroke="#3f8f4a" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      flores += `<g class="fl" style="animation-delay:${(i * 0.15).toFixed(2)}s"><g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot}) scale(${s.toFixed(2)})">${gradDefs(u + i, pal)}${florInterior(it.kind, pal, rnd, u + i)}</g></g>`;
    });

    const hojas = `
      <ellipse cx="62" cy="146" rx="5" ry="17" fill="#4aa055" transform="rotate(-42 62 146)"/>
      <ellipse cx="138" cy="146" rx="5" ry="17" fill="#4aa055" transform="rotate(42 138 146)"/>
      <ellipse cx="82" cy="154" rx="4.5" ry="15" fill="#3f8f4a" transform="rotate(-20 82 154)"/>
      <ellipse cx="118" cy="154" rx="4.5" ry="15" fill="#3f8f4a" transform="rotate(20 118 154)"/>`;

    const papel = `
      <path d="M44,138 L156,138 L110,252 L90,252 Z" fill="#ffe3e6"/>
      <path d="M44,138 L100,186 L90,252 Z" fill="#f4a9bc" opacity="0.9"/>
      <path d="M156,138 L100,186 L110,252 Z" fill="#fff0f3"/>
      <path d="M44,138 L100,186 L156,138" fill="none" stroke="#c2173f" stroke-width="1.2"/>`;

    const lazo = `
      <ellipse cx="86" cy="198" rx="14" ry="7" fill="#e63956" transform="rotate(-22 86 198)"/>
      <ellipse cx="114" cy="198" rx="14" ry="7" fill="#e63956" transform="rotate(22 114 198)"/>
      <path d="M100,202 L88,226 M100,202 L112,226" stroke="#e63956" stroke-width="4" stroke-linecap="round"/>
      <circle cx="100" cy="200" r="5.5" fill="#c2173f"/>`;

    const sello = o.badge
      ? `<rect x="56" y="228" width="88" height="20" rx="10" fill="#ffffff" opacity="0.85"/>`
      + `<text x="100" y="242" text-anchor="middle" font-size="11" font-weight="bold" fill="#8f0f2e" font-family="inherit">${o.badge}</text>`
      : "";

    return `<svg viewBox="0 0 200 260" role="img" aria-label="Ramo de flores">${tallos}${hojas}${flores}${papel}${lazo}${sello}</svg>`;
  }

  const api = { PALETAS, COLOR_PALS, makeFlor, makeRamo };
  if (typeof module !== "undefined" && module.exports) { module.exports = api; }
  else { root.Flores = api; }
})(typeof window !== "undefined" ? window : globalThis);
