const CONFIG_MENSAJE = {
  para: "Para: Mi Milu",
  titulo: "Feliz 21 de septiembre",
  mensaje:
    "Hola mi Milulinda, feliz dia de las flores amarillas, a pesar de no estar junto a ti o no poder darte tu ramo de flores, te dedico esta pagina, para que asi aun tengas tus flores amarillas Milu, tal vez este año no puedo darte el ramo de flores amarillas, pero para el otro año, estoy seguro que podré, te amo Mi, siempre te voy a amar, espero te guste este detalle, te amo.",
  firma: "— Con todo mi amor",
};

/* Mensajes de cada etapa del crecimiento (apartado 1) */
const MENSAJES_ETAPA = [
  "🌱 Preparando la tierra…",
  "🌿 Los tallos están creciendo…",
  "🌼 Los botones están por abrir…",
  "💛 ¡Floreció! Feliz 21 de septiembre 🌼",
];

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
const estadoFloracion = document.getElementById("estado-floracion");
const pasos = document.querySelectorAll("#pasos .paso");

// Posición de cada flor: desplazamiento horizontal (% del ancho),
// alto del tallo, tamaño de la flor y retraso de aparición.
// Usamos % para que encaje en móvil y en PC sin desbordarse.
const DISENO_RAMO = [
  { x: -27, alto: 215, tam: 72, delay: 1.6, hojas: true },
  { x: -18, alto: 250, tam: 84, delay: 1.9, hojas: true },
  { x: -9, alto: 275, tam: 92, delay: 2.2, hojas: false },
  { x: 0, alto: 295, tam: 104, delay: 2.5, hojas: true },
  { x: 9, alto: 275, tam: 92, delay: 2.2, hojas: false },
  { x: 18, alto: 250, tam: 84, delay: 1.9, hojas: true },
  { x: 27, alto: 215, tam: 72, delay: 1.6, hojas: true },
];

function crearFlorAmarilla(tam, delay) {
  const flor = document.createElement("div");
  flor.className = "flor boton"; // empieza como botón cerrado
  flor.style.width = tam + "px";
  flor.style.height = tam + "px";
  flor.style.animationDelay = delay + "s";

  const NUM_PETALOS = 12;
  for (let i = 0; i < NUM_PETALOS; i++) {
    const pet = document.createElement("div");
    pet.className = "petalo";
    pet.style.transform = `translateX(-50%) rotate(${(360 / NUM_PETALOS) * i}deg)`;
    flor.appendChild(pet);
  }

  const centro = document.createElement("div");
  centro.className = "centro";
  centro.style.width = tam * 0.34 + "px";
  centro.style.height = tam * 0.34 + "px";
  flor.appendChild(centro);

  // A los 0.7s de aparecer, el botón "se abre" (pétalos más brillantes)
  setTimeout(() => flor.classList.remove("boton"), (delay + 0.9) * 1000);
  return flor;
}

function factorEscala(contenedor) {
  // En pantallas angostas reducimos proporcionalmente tallos y flores
  // para que el ramo siempre encaje dentro de la escena.
  const w = (contenedor && contenedor.clientWidth) || 440;
  if (w >= 400) return 1;
  return Math.max(0.68, w / 400);
}

function construirRamoPrincipal() {
  ramoPrincipal.innerHTML = "";
  marcarPaso(0);
  estadoFloracion.textContent = MENSAJES_ETAPA[0];
  const esc = factorEscala(ramoPrincipal);

  // Etapa 1: tallos (0.4s)
  setTimeout(() => {
    marcarPaso(1);
    estadoFloracion.textContent = MENSAJES_ETAPA[1];

    DISENO_RAMO.forEach((f) => {
      const grupo = document.createElement("div");
      grupo.className = "tallo-grupo";
      grupo.style.left = `calc(50% + ${f.x}% - 3px)`;
      grupo.style.transform = "translateX(-50%)";

      const tallo = document.createElement("div");
      tallo.className = "tallo";
      tallo.style.height = Math.round(f.alto * esc) + "px";
      tallo.style.animationDelay = "0s";
      grupo.appendChild(tallo);

      if (f.hojas) {
        const hojaI = document.createElement("div");
        hojaI.className = "hoja izq";
        hojaI.style.bottom = Math.round(f.alto * esc * 0.3) + "px";
        hojaI.style.animationDelay = "0.7s";
        const hojaD = document.createElement("div");
        hojaD.className = "hoja der";
        hojaD.style.bottom = Math.round(f.alto * esc * 0.45) + "px";
        hojaD.style.animationDelay = "0.9s";
        // Hijas del tallo (7px): así nacen pegadas a él y no flotan
        tallo.appendChild(hojaI);
        tallo.appendChild(hojaD);
      }
      ramoPrincipal.appendChild(grupo);
    });
  }, 500);

  // Etapa 2: botones / flores (aparecen con su propio delay)
  setTimeout(() => {
    marcarPaso(2);
    estadoFloracion.textContent = MENSAJES_ETAPA[2];

    const grupos = ramoPrincipal.querySelectorAll(".tallo-grupo");
    grupos.forEach((grupo, i) => {
      const f = DISENO_RAMO[i];
      const flor = crearFlorAmarilla(Math.round(f.tam * esc), f.delay);
      // La flor va arriba del tallo
      flor.style.marginBottom = "-8px";
      grupo.prepend(flor);
    });
  }, 1300);

  // Etapa 3: papel + lazo + mensaje final
  setTimeout(() => {
    const papel = document.createElement("div");
    papel.className = "papel";
    papel.style.animationDelay = "3.4s";
    ramoPrincipal.appendChild(papel);

    const lazo = document.createElement("div");
    lazo.className = "lazo";
    lazo.textContent = "🎀";
    lazo.style.animationDelay = "3.7s";
    ramoPrincipal.appendChild(lazo);
  }, 1400);

  setTimeout(() => {
    marcarPaso(3);
    estadoFloracion.textContent = MENSAJES_ETAPA[3];
  }, 4200);
}

function marcarPaso(n) {
  pasos.forEach((p) => {
    const i = Number(p.dataset.paso);
    p.classList.toggle("activo", i === n);
    p.classList.toggle("completado", i < n);
  });
}

/* ==========================================================
   3. APARTADO 2 — RAMO DE TULIPANES (también creado con JS)
   ========================================================== */
const ramoTulipanes = document.getElementById("ramo-tulipanes");

const DISENO_TULIPANES = [
  { x: -24, alto: 200, tam: 62 },
  { x: -14, alto: 235, tam: 72 },
  { x: -5, alto: 260, tam: 80 },
  { x: 5, alto: 260, tam: 80 },
  { x: 14, alto: 235, tam: 72 },
  { x: 24, alto: 200, tam: 62 },
];

function crearTulipan(tam, delay) {
  const t = document.createElement("div");
  t.className = "tulipan";
  t.style.width = tam + "px";
  t.style.height = tam * 1.25 + "px";
  t.style.animationDelay = delay + "s";

  ["izq", "centro-t", "der"].forEach((cls) => {
    const p = document.createElement("div");
    p.className = "petalo-t " + cls;
    t.appendChild(p);
  });
  return t;
}

function construirTulipanes() {
  ramoTulipanes.innerHTML = "";
  const esc = factorEscala(ramoTulipanes);
  DISENO_TULIPANES.forEach((f, i) => {
    const grupo = document.createElement("div");
    grupo.className = "tulipan-grupo";
    grupo.style.left = `calc(50% + ${f.x}% - 3px)`;
    grupo.style.transform = "translateX(-50%)";

    const delay = 0.15 * i;
    const tulipan = crearTulipan(Math.round(f.tam * esc), delay);
    tulipan.style.marginBottom = "-6px";
    grupo.appendChild(tulipan);

    const tallo = document.createElement("div");
    tallo.className = "tallo";
    tallo.style.height = Math.round(f.alto * esc) + "px";
    tallo.style.animationDelay = delay + "s";
    grupo.appendChild(tallo);

    const hoja = document.createElement("div");
    hoja.className = "hoja " + (i % 2 === 0 ? "izq" : "der");
    hoja.style.bottom = Math.round(f.alto * esc * 0.35) + "px";
    hoja.style.animationDelay = delay + 0.5 + "s";
    // Hija del tallo: nace pegada a él
    tallo.appendChild(hoja);

    ramoTulipanes.appendChild(grupo);
  });

  const papel = document.createElement("div");
  papel.className = "papel";
  ramoTulipanes.appendChild(papel);

  const lazo = document.createElement("div");
  lazo.className = "lazo";
  lazo.textContent = "🎀";
  ramoTulipanes.appendChild(lazo);
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
function alternarSobre() {
  sobre.classList.toggle("abierto");
  const abierto = sobre.classList.contains("abierto");
  document.getElementById("btn-sobre").textContent = abierto
    ? "💌 Cerrar carta"
    : "💌 Abrir / Cerrar carta";
}

// Efecto máquina de escribir para el mensaje
let escribiendo = false;
function efectoEscribir() {
  if (escribiendo) return;
  escribiendo = true;
  if (!sobre.classList.contains("abierto")) alternarSobre();
  const el = document.getElementById("mensaje-texto");
  const textoCompleto = CONFIG_MENSAJE.mensaje;
  el.textContent = "";
  let i = 0;
  const intervalo = setInterval(() => {
    el.textContent = textoCompleto.slice(0, ++i);
    if (i >= textoCompleto.length) {
      clearInterval(intervalo);
      escribiendo = false;
    }
  }, 28);
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
document.getElementById("btn-petales").addEventListener("click", (e) => {
  petalosActivos = !petalosActivos;
  e.target.textContent = petalosActivos ? "Pétalos: ON" : "Pétalos: OFF";
  crearPetalesFondo();
});
document.getElementById("btn-tulipanes").addEventListener("click", construirTulipanes);
document.getElementById("btn-sobre").addEventListener("click", alternarSobre);
document.getElementById("btn-escribir").addEventListener("click", efectoEscribir);
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
