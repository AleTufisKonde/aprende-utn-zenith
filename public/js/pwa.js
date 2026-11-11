// =====================================================================
// pwa.js — Service Worker y Experiencia de Instalación PWA (Equipo ZENITH)
// =====================================================================

// 1. Registro del Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .then((reg) => {
        console.log("[PWA-Zenith] Service Worker activo y registrado. Scope:", reg.scope);
      })
      .catch((err) => {
        console.error("[PWA-Zenith] Error registrando el Service Worker:", err);
      });
  });
}

// 2. Control de Instalación PWA
let eventoInstalacion = null;

const bannerFlotante     = document.getElementById("bannerInstalar");
const btnInstalarHeader  = document.getElementById("btnInstalarHeader");
const btnToastInstalar   = document.getElementById("btnToastInstalar");
const btnToastDescartar  = document.getElementById("btnToastDescartar");
const modalInstalacion   = document.getElementById("modalInstalacion");
const btnCerrarModal     = document.getElementById("btnCerrarModal");

// Detectar si la app ya está corriendo instalada (standalone)
const estaEnStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;

if (estaEnStandalone) {
  // Si ya está instalada, ocultamos los botones de instalación
  if (btnInstalarHeader) btnInstalarHeader.style.display = "none";
  if (bannerFlotante) {
    bannerFlotante.hidden = true;
    bannerFlotante.classList.add("oculto");
    bannerFlotante.style.display = "none";
  }
}

// Capturar el evento nativo del navegador para instalación
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  eventoInstalacion = e;

  // Mostrar el botón en el header si no está instalada
  if (btnInstalarHeader && !estaEnStandalone) {
    btnInstalarHeader.style.display = "inline-flex";
  }

  // Mostrar el banner flotante si el usuario no lo descartó en esta sesión
  const descartado = sessionStorage.getItem("pwa_toast_descartado");
  if (bannerFlotante && !descartado && !estaEnStandalone) {
    bannerFlotante.hidden = false;
    bannerFlotante.classList.remove("oculto");
    bannerFlotante.style.display = "flex";
  }
});

// Función para cerrar definitivamente la notificación flotante
window.cerrarBannerInstalar = function () {
  if (bannerFlotante) {
    bannerFlotante.hidden = true;
    bannerFlotante.classList.add("oculto");
    bannerFlotante.style.display = "none";
  }
  sessionStorage.setItem("pwa_toast_descartado", "true");
};

// Función central para ejecutar la instalación o abrir el modal de ayuda
window.abrirInstalacion = function () {
  // Al tocar instalar, cerramos la notificación flotante
  window.cerrarBannerInstalar();

  if (eventoInstalacion) {
    // Si el navegador soporta el diálogo nativo
    eventoInstalacion.prompt();
    eventoInstalacion.userChoice.then((choiceResult) => {
      console.log("[PWA-Zenith] Decisión del usuario:", choiceResult.outcome);
      eventoInstalacion = null;
    });
  } else {
    // Si no está disponible el prompt nativo (iOS, Desktop o navegador sin soporte directo)
    // abrimos el modal interactivo con instrucciones paso a paso
    abrirModalInstalacion();
  }
};

window.cerrarModalInstalacion = function () {
  if (modalInstalacion) modalInstalacion.classList.remove("abierto");
};

function abrirModalInstalacion() {
  if (modalInstalacion) modalInstalacion.classList.add("abierto");
}

// Event Listeners seguros
btnInstalarHeader?.addEventListener("click", () => window.abrirInstalacion());
btnToastInstalar?.addEventListener("click", () => window.abrirInstalacion());
btnToastDescartar?.addEventListener("click", () => window.cerrarBannerInstalar());

btnCerrarModal?.addEventListener("click", window.cerrarModalInstalacion);
modalInstalacion?.addEventListener("click", (e) => {
  if (e.target === modalInstalacion) {
    window.cerrarModalInstalacion();
  }
});

// Cuando la app termina de instalarse con éxito
window.addEventListener("appinstalled", () => {
  console.log("[PWA-Zenith] ¡Aplicación instalada con éxito!");
  window.cerrarBannerInstalar();
  if (btnInstalarHeader) btnInstalarHeader.style.display = "none";
  eventoInstalacion = null;
});
