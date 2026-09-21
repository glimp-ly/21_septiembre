# Flores Amarillas — 21 de Septiembre

Página interactiva en HTML + CSS + JS. Todo centrado y responsive (móvil, tablet y PC).

## Archivos
- `index.html` → estructura y apartados
- `styles.css` → todo el diseño
- `script.js` → lógica de la página principal
- `flores.js` → modelos SVG de flores y ramos envueltos
- `juego.html` / `juego.css` / `juego.js` → minijuego del campo de flores

## Los apartados (index)
1. **Ramo (`#inicio`)** — homepage. El ramo se genera como SVG envuelto con JS + botón "Ver de nuevo".
2. **Tulipanes (`#tulipanes`)** — ramo de tulipanes rojos generado con JS + botón "Generar otro ramo".
3. **Mensaje (`#mensaje`)** — sobre que se abre/cierra + carta con efecto máquina de escribir automático al abrir.

## Minijuego (`juego.html`)
Campo de 12 flores (girasoles, tulipanes, rosas y lirios morados). Toca una flor para sumarla a tu ramo; quítala del ramo y vuelve a su parcela. Con "Obtener ramo" se genera tu ramo envuelto. El estado se guarda en `localStorage`.

## Cómo ver la página
Doble clic en `index.html`, o sírvela local:
```bash
cd flor_amarilla
python3 -m http.server 8000
# abre http://localhost:8000
```

## Cómo poner tu mensaje
Abre `script.js` y edita esto (está al inicio, muy visible):

```js
const CONFIG_MENSAJE = {
  para: "Para: ...",
  titulo: "Feliz 21 de septiembre",
  mensaje: "Escribe aquí tu mensaje largo...",
  firma: "— Con amor...",
};
```

Guarda y recarga. El sobre y la carta usarán tu texto automáticamente. También puedes editar el HTML dentro de `#carta` si prefieres.

## Responsive
- Contenedores centrados con `max-width: 1020px`
- Ramos en SVG que escalan solos en móvil y PC
- Media query a 640px: botones a ancho completo
- `prefers-reduced-motion` respetado
