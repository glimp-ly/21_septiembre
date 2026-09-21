const CONFIG_MENSAJE = {
  para: "Para: Mi Milu",
  titulo: "Feliz 21 de septiembre",
  mensaje:
    "Hola mi Milulinda, feliz dia de las flores amarillas, a pesar de no estar junto a ti o no poder darte tu ramo de flores, te dedico esta pagina, para que asi aun tengas tus flores amarillas Milu, tal vez este año no puedo darte el ramo de flores amarillas, pero para el otro año, estoy seguro que podré, te amo Mi, siempre te voy a amar, espero te guste este detalle, te amo.",
  firma: "— Con todo mi amor",
};

/* ==========================================================
   1. PÉTALOS FLOTANTES DE FONDO
   ========================================================== */
let petalosActivos = true;

function crearPetalesFondo() {
  const cont = document.getElementById("petalos-fondo");
  cont.innerHTML = "";
  if (!petalosActivos) return;
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

/* ==========================================================
   2. APARTADO 1 — RAMO PRINCIPAL QUE CRECE
   Todo el ramo se crea con JS: tallos, hojas, pétalos,
   centro, papel y lazo. Nada está escrito en el HTML.
   ========================================================== */
const ramoPrincipal = document.getElementById("ramo-principal");

// Ramos generados como SVG envuelto (modelos base en flores.js,
// adaptados de ~/flores-amarillas/js/bouquets.js). Semilla
// aleatoria en cada construcción para variar levemente el ramo.
function semilla() {
  return (Math.random() * 1e9) | 0;
}

function construirRamoPrincipal() {
  ramoPrincipal.innerHTML = Flores.makeRamo(
    Array.from({ length: 7 }, () => ({ kind: "sunflower", pal: "girasol" })),
    { seed: semilla(), badge: "💛 21 Sept 💛" }
  );
}

/* ==========================================================
   3. APARTADO 2 — RAMO DE TULIPANES (también creado con JS)
   ========================================================== */
const ramoTulipanes = document.getElementById("ramo-tulipanes");

function construirTulipanes() {
  ramoTulipanes.innerHTML = Flores.makeRamo(
    Array.from({ length: 6 }, () => ({ kind: "tulip", pal: "tulipan" })),
    { seed: semilla(), badge: "❤️ 21 Sept ❤️" }
  );
}

/* ==========================================================
   4. APARTADO 3 — MENSAJE / CARTA
   El texto sale de CONFIG_MENSAJE (arriba del todo).
   ========================================================== */
function aplicarMensaje() {
  document.getElementById("mensaje-para").textContent = CONFIG_MENSAJE.para;
  document.getElementById("mensaje-titulo").textContent = CONFIG_MENSAJE.titulo;
  document.getElementById("mensaje-texto").textContent = CONFIG_MENSAJE.mensaje;
  document.getElementById("mensaje-firma").textContent = CONFIG_MENSAJE.firma;
}

const sobre = document.getElementById("sobre");

// Máquina de escribir: cada vez que se abre la carta empieza desde el inicio
let intervaloEscribir = null;
function efectoEscribir() {
  const el = document.getElementById("mensaje-texto");
  const textoCompleto = CONFIG_MENSAJE.mensaje;
  clearInterval(intervaloEscribir);
  el.textContent = "";
  let i = 0;
  intervaloEscribir = setInterval(() => {
    el.textContent = textoCompleto.slice(0, ++i);
    if (i >= textoCompleto.length) clearInterval(intervaloEscribir);
  }, 28);
}

function alternarSobre() {
  sobre.classList.toggle("abierto");
  const abierto = sobre.classList.contains("abierto");
  document.getElementById("btn-sobre").textContent = abierto
    ? "💌 Cerrar carta"
    : "💌 Abrir / Cerrar carta";
  if (abierto) {
    efectoEscribir();
  } else {
    clearInterval(intervaloEscribir);
    document.getElementById("mensaje-texto").textContent = CONFIG_MENSAJE.mensaje;
  }
}

/* ==========================================================
   5. NAVEGACIÓN ACTIVA + BOTONES + ARRANQUE
   ========================================================== */
function initNavActiva() {
  const links = document.querySelectorAll(".nav-link");
  const secciones = ["inicio", "tulipanes", "mensaje"].map((id) =>
    document.getElementById(id)
  );
  const obs = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((l) =>
            l.classList.toggle("active", l.dataset.seccion === e.target.id)
          );
        }
      });
    },
    { threshold: 0.35 }
  );
  secciones.forEach((s) => s && obs.observe(s));
}

document.getElementById("btn-reflorecer").addEventListener("click", construirRamoPrincipal);
document.getElementById("btn-tulipanes").addEventListener("click", construirTulipanes);
document.getElementById("btn-sobre").addEventListener("click", alternarSobre);
sobre.addEventListener("click", alternarSobre);
sobre.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    alternarSobre();
  }
});

// Arranque
aplicarMensaje();
crearPetalesFondo();
construirRamoPrincipal();
construirTulipanes();
initNavActiva();

// Re-escalar ramos si la ventana cambia mucho de tamaño (ej. rotar el móvil)
let ultimaAnchura = window.innerWidth;
let temporizadorResize = null;
window.addEventListener("resize", () => {
  clearTimeout(temporizadorResize);
  temporizadorResize = setTimeout(() => {
    if (Math.abs(window.innerWidth - ultimaAnchura) > 120) {
      ultimaAnchura = window.innerWidth;
      construirRamoPrincipal();
      construirTulipanes();
    }
  }, 300);
});
