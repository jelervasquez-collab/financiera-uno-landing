# Financiera Uno — Landing page

Landing page de una sola página con un único objetivo: que el visitante **agende una reunión**.
HTML, CSS y JavaScript puros, sin dependencias ni build.

## Estructura

```
index.html          Toda la página (header, hero, beneficios, proceso, formulario, footer)
css/styles.css      Estilos y variables de marca
js/main.js          Validación del formulario y estado de éxito
.claude/launch.json Config del servidor local de previsualización
```

## Cómo verla

Abrí `index.html` con doble clic, o levantá un servidor local:

```bash
python -m http.server 5500
```

Luego entrá a http://localhost:5500

## Personalización rápida

**Colores y marca** — variables al inicio de `css/styles.css`:

| Variable | Uso |
|---|---|
| `--ink` | Azul profundo: textos y sección oscura |
| `--accent` | Verde institucional: botones y detalles |
| `--muted` | Texto secundario |
| `--line` | Bordes y separadores |

**Textos** — todo el contenido está en `index.html`, dividido por comentarios de sección.

**Datos de contacto** — correo y teléfono en el `<footer>` de `index.html`.

## Conectar el formulario

Hoy el envío está **simulado**: valida los campos, imprime los datos en la consola y muestra
la pantalla de confirmación. Para conectarlo de verdad, reemplazá el bloque marcado con
`AQUÍ SE CONECTA EL BACKEND` en `js/main.js` por una llamada real, por ejemplo:

```js
fetch("https://api.financierauno.com/reuniones", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(datos)
})
  .then(function (r) { if (!r.ok) throw new Error("Error"); mostrarExito(datos); })
  .catch(function () { alert("No pudimos enviar tu solicitud. Intentá de nuevo."); });
```

Alternativas sin backend propio: Formspree, Basin, Google Forms o embeber Calendly
directamente en la sección `#agendar`.

## Detalles incluidos

- Validación en el cliente con mensajes en español y foco en el primer campo con error.
- La fecha preferida no admite días anteriores a mañana (`input.min` calculado en JS).
- Diseño responsive (escritorio, tablet y móvil) y navegación por teclado con foco visible.
- Respeta `prefers-reduced-motion`.
- El año del pie de página se actualiza solo.

> Los datos de la sección de respaldos (+15 años, +3.500 clientes, entidad regulada) son de
> ejemplo. Reemplazalos por cifras reales antes de publicar.
