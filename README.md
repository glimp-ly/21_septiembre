# 🌼 Flores Amarillas — 21 de Septiembre

Página interactiva en HTML + CSS + JS. Todo centrado y responsive (móvil, tablet y PC).

## Archivos
- `index.html` → estructura y 3 apartados
- `styles.css` → todo el diseño
- `script.js` → los ramos se crean con JS

## Los 3 apartados
1. **🌻 Ramo (`#inicio`)** — homepage. El ramo se construye solo con JS por etapas:
   Semilla → Tallos → Botones → Floración. Incluye barra de progreso y botón
   "Ver florecer de nuevo".
2. **🌷 Tulipanes (`#tulipanes`)** — ramo de tulipanes amarillos también generado
   con JS + botón "Generar otro ramo".
3. **💌 Mensaje (`#mensaje`)** — sobre que se abre/cierra + carta con efecto
   máquina de escribir.

## Cómo ver la página
Doble clic en `index.html`, o sírvela local:
```bash
cd flor_amarilla
python3 -m http.server 8000
# abre http://localhost:8000
```

## ✏️ Cómo poner tu mensaje
Abre `script.js` y edita esto (está al inicio, muy visible):

```js
const CONFIG_MENSAJE = {
  para: "Para: ...",
  titulo: "Feliz 21 de septiembre 🌼",
  mensaje: "Escribe aquí tu mensaje largo...",
  firma: "— Con amor...",
};
```

Guarda y recarga. El sobre, la carta y el efecto de escritura usarán tu texto
automáticamente. También puedes editar el HTML dentro de `#carta` si prefieres.

## Responsive
- Contenedores centrados con `max-width: 1020px`
- Ramo usa posiciones en `%` + factor de escala en móvil
- Media query a 640px: tarjetas en 1 columna, botones a ancho completo
- `prefers-reduced-motion` respetado
