/* =========================================================
   Financiera Uno — Lógica del formulario de agendamiento
   ========================================================= */
(function () {
  "use strict";

  var form     = document.getElementById("form-agendar");
  var exito    = document.getElementById("form-exito");
  var textoOk  = document.getElementById("success-text");
  var btnNueva = document.getElementById("btn-nueva");
  var inputFecha = document.getElementById("fecha");

  /* Año dinámico en el pie de página */
  var anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();

  /* La fecha preferida no puede ser anterior a mañana */
  if (inputFecha) {
    var manana = new Date();
    manana.setDate(manana.getDate() + 1);
    inputFecha.min = manana.toISOString().split("T")[0];
  }

  if (!form) return;

  /* ---------- Validación ---------- */
  var mensajes = {
    nombre:     "Escribí tu nombre y apellido.",
    email:      "Ingresá un correo electrónico válido.",
    telefono:   "Ingresá un teléfono de contacto válido.",
    interes:    "Elegí el tema de la reunión.",
    fecha:      "Elegí una fecha a partir de mañana.",
    horario:    "Elegí una franja horaria.",
    privacidad: "Necesitamos tu autorización para contactarte."
  };

  function esValido(campo) {
    var v = (campo.value || "").trim();

    switch (campo.id) {
      case "nombre":     return v.length >= 3;
      case "email":      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      case "telefono":   return v.replace(/[^0-9]/g, "").length >= 8;
      case "fecha":      return v !== "" && (!inputFecha.min || v >= inputFecha.min);
      case "privacidad": return campo.checked;
      default:           return v !== "";
    }
  }

  function marcar(campo, valido) {
    var contenedor = campo.closest(".field");
    var aviso = contenedor.querySelector('[data-error-for="' + campo.id + '"]');

    contenedor.classList.toggle("has-error", !valido);
    campo.setAttribute("aria-invalid", valido ? "false" : "true");
    if (aviso) aviso.textContent = valido ? "" : (mensajes[campo.id] || "Revisá este campo.");
  }

  var requeridos = Array.prototype.slice.call(form.querySelectorAll("[required]"));

  /* Se revalida al salir del campo y al corregir uno ya marcado */
  requeridos.forEach(function (campo) {
    campo.addEventListener("blur", function () { marcar(campo, esValido(campo)); });
    campo.addEventListener("input", function () {
      if (campo.closest(".field").classList.contains("has-error")) marcar(campo, esValido(campo));
    });
    campo.addEventListener("change", function () {
      if (campo.closest(".field").classList.contains("has-error")) marcar(campo, esValido(campo));
    });
  });

  /* ---------- Envío ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var primerError = null;

    requeridos.forEach(function (campo) {
      var ok = esValido(campo);
      marcar(campo, ok);
      if (!ok && !primerError) primerError = campo;
    });

    if (primerError) {
      primerError.focus();
      return;
    }

    var datos = Object.fromEntries(new FormData(form).entries());

    /* -----------------------------------------------------------
       AQUÍ SE CONECTA EL BACKEND.
       Reemplazá este bloque por el envío real, por ejemplo:

       fetch("https://api.financierauno.com/reuniones", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(datos)
       })
         .then(function (r) { if (!r.ok) throw new Error("Error"); mostrarExito(datos); })
         .catch(function () { alert("No pudimos enviar tu solicitud. Intentá de nuevo."); });

       Por ahora solo se simula el envío.
    ----------------------------------------------------------- */
    console.log("Solicitud de reunión:", datos);
    mostrarExito(datos);
  });

  function mostrarExito(datos) {
    var fechaTexto = "";

    if (datos.fecha) {
      var partes = datos.fecha.split("-");
      var d = new Date(partes[0], partes[1] - 1, partes[2]);
      fechaTexto = d.toLocaleDateString("es-ES", {
        weekday: "long", day: "numeric", month: "long"
      });
    }

    if (textoOk) {
      textoOk.textContent = fechaTexto
        ? "Gracias, " + datos.nombre.split(" ")[0] + ". Te escribimos a " + datos.email +
          " para confirmar la reunión del " + fechaTexto + "."
        : "Gracias. Un asesor te va a escribir para confirmar el horario.";
    }

    form.hidden = true;
    exito.hidden = false;
    exito.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  if (btnNueva) {
    btnNueva.addEventListener("click", function () {
      form.reset();
      requeridos.forEach(function (campo) {
        campo.closest(".field").classList.remove("has-error");
        campo.removeAttribute("aria-invalid");
      });
      exito.hidden = true;
      form.hidden = false;
      document.getElementById("nombre").focus();
    });
  }
})();
