/* ==========================================================
   MINIJUEGO — Campo de flores
   Elige flores del campo, ármalas en tu ramo y genera
   tu ramo final. El estado se guarda (campo ⇄ ramo).
   ========================================================== */

const TIPOS = {
  girasol: { nombre: "Girasol" },
  tulipan: { nombre: "Tulipán" },
  rosa: { nombre: "Rosa" },
  lirio: { nombre: "Lirio del valle" },
};

// 12 parcelas: 3 de cada tipo, mezcladas
const CAMPO = [
  "girasol", "rosa", "tulipan",
  "lirio", "tulipan", "girasol",
  "lirio", "rosa", "rosa",
  "lirio", "girasol", "tulipan",
];

const CLAVE = "campoFloresV1";

/* ---------- Flores (modelos de flores.js) ---------- */
const KIND_DE_TIPO = { girasol: "sunflower", tulipan: "tulip", rosa: "rose", lirio: "lily" };
const PAL_DE_TIPO = { girasol: "girasol", tulipan: "tulipan", rosa: "rosa", lirio: "lirio" };

function svgDe(tipo) {
  return Flores.makeFlor(KIND_DE_TIPO[tipo] || "sunflower", PAL_DE_TIPO[tipo] || "girasol");
}

/* ---------- Estado (campo ⇄ ramo) ---------- */

function estadoInicial() {
  const u = {};
  CAMPO.forEach((_, i) => { u["f" + i] = "campo"; });
  return { u, orden: [], color: null };
}

let estado = cargar();

function cargar() {
  try {
    const g = JSON.parse(localStorage.getItem(CLAVE));
    if (g && g.u && Array.isArray(g.orden)) {
      // Solo acepta ids conocidos para no romper con datos viejos
      const ids = new Set(CAMPO.map((_, i) => "f" + i));
      if (Object.keys(g.u).every((k) => ids.has(k)) && g.orden.every((k) => ids.has(k))) return g;
    }
  } catch (_) { /* almacenamiento no disponible: se juega en memoria */ }
  return estadoInicial();
}

function guardar() {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
  } catch (_) { /* sin almacenamiento: el juego sigue en memoria */ }
}

/* ---------- Campo ---------- */

const campoEl = document.getElementById("campo");

function renderCampo(naceId) {
  campoEl.innerHTML = "";
  let disponibles = 0;
  CAMPO.forEach((tipo, i) => {
    const id = "f" + i;
    if (estado.u[id] === "campo") {
      disponibles++;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "parcela" + (id === naceId ? " nace" : "");
      b.dataset.id = id;
      b.setAttribute("aria-label", `Elegir ${TIPOS[tipo].nombre}`);
      b.innerHTML = `<span class="planta"><span class="flor-campo">${svgDe(tipo)}</span><span class="tallo-campo"></span></span><span class="tierra"></span>`;
      b.addEventListener("click", () => arrancar(id, b));
      campoEl.appendChild(b);
    } else {
      const d = document.createElement("div");
      d.className = "parcela vacia";
      d.dataset.id = id;
      d.setAttribute("aria-label", "Parcela vacía");
      d.innerHTML = `<span class="brote" aria-hidden="true"></span><span class="tierra"></span>`;
      campoEl.appendChild(d);
    }
  });
  document.getElementById("contador-campo").textContent =
    `${disponibles} ${disponibles === 1 ? "disponible" : "disponibles"}`;
}

function arrancar(id, btn) {
  btn.disabled = true;
  btn.classList.add("arrancada");
  setTimeout(() => {
    estado.u[id] = "ramo";
    estado.orden.push(id);
    guardar();
    renderCampo();
    renderRamo();
  }, 280);
}

/* ---------- Ramo (carrito de flores) ---------- */

function renderRamo() {
  const lista = document.getElementById("lista-ramo");
  lista.innerHTML = "";
  estado.orden.forEach((id) => {
    const tipo = CAMPO[Number(id.slice(1))];
    const li = document.createElement("li");
    li.className = "item-ramo";
    li.innerHTML = `<span class="mini" aria-hidden="true">${svgDe(tipo)}</span>`
      + `<span class="nombre">${TIPOS[tipo].nombre}</span>`
      + `<button type="button" class="quitar" aria-label="Devolver ${TIPOS[tipo].nombre} al campo">✕</button>`;
    li.querySelector(".quitar").addEventListener("click", () => devolver(id));
    lista.appendChild(li);
  });
  const n = estado.orden.length;
  document.getElementById("contador-ramo").textContent = `${n} ${n === 1 ? "flor" : "flores"}`;
  document.getElementById("vacio-ramo").hidden = n !== 0;
  document.getElementById("btn-obtener").disabled = n === 0;
}

function devolver(id) {
  estado.orden = estado.orden.filter((x) => x !== id);
  estado.u[id] = "campo";
  guardar();
  renderCampo(id); // la flor regresa a su parcela con animación de nacer
  renderRamo();
}

/* ---------- Generar el ramo con lo elegido ---------- */

function obtenerRamo(scroll) {
  const cont = document.getElementById("flores-elegidas");
  const n = estado.orden.length;
  if (n === 0) return;
  // Si se eligió un color, todo el ramo se tiñe de ese color
  const palFija = estado.color && Flores.COLOR_PALS ? Flores.COLOR_PALS[estado.color] : null;
  const items = estado.orden.map((id) => {
    const tipo = CAMPO[Number(id.slice(1))];
    return { kind: KIND_DE_TIPO[tipo], pal: palFija || PAL_DE_TIPO[tipo] };
  });
  // Ramo envuelto (mismo modelo que el index): sin maceta, sin desbordes
  cont.innerHTML = Flores.makeRamo(items, { seed: (Date.now() % 1e9) | 0, badge: "💐 Mi ramo 💐" });
  const res = document.getElementById("resultado");
  res.hidden = false;
  marcarColor();
  if (scroll !== false) res.scrollIntoView({ behavior: "smooth", block: "start" });
}

function marcarColor() {
  document.querySelectorAll(".color-btn").forEach((b) =>
    b.classList.toggle(
      "activo",
      (b.dataset.color === "original" && !estado.color) || b.dataset.color === estado.color
    )
  );
}

/* ---------- Lluvia de pétalos (igual que el index) ---------- */

function crearPetalesFondo() {
  const cont = document.getElementById("petalos-fondo");
  if (!cont) return;
  cont.innerHTML = "";
  for (let i = 0; i < 22; i++) {
    const p = document.createElement("div");
    p.className = "petalo-fondo";
    const size = 10 + Math.random() * 14;
    p.style.width = size + "px";
    p.style.height = size * 1.25 + "px";
    p.style.left = Math.random() * 100 + "vw";
    p.style.animationDuration = 6 + Math.random() * 8 + "s";
    p.style.animationDelay = -(Math.random() * 10) + "s";
    p.style.opacity = 0.35 + Math.random() * 0.45;
    cont.appendChild(p);
  }
}

/* ---------- Arranque ---------- */

document.getElementById("btn-obtener").addEventListener("click", obtenerRamo);
document.querySelectorAll(".color-btn").forEach((b) =>
  b.addEventListener("click", () => {
    estado.color = b.dataset.color === "original" ? null : b.dataset.color;
    guardar();
    if (estado.orden.length) obtenerRamo(false);
    else marcarColor();
  })
);
document.getElementById("btn-reiniciar").addEventListener("click", () => {
  estado = estadoInicial();
  guardar();
  document.getElementById("resultado").hidden = true;
  renderCampo();
  renderRamo();
});

renderCampo();
renderRamo();
crearPetalesFondo();
