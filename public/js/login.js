import { auth } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { traducir } from "./errores.js";

const msg = document.getElementById("mensaje");

// Modal de Recuperación
const modalRecuperar          = document.getElementById("modalRecuperar");
const btnCerrarModalRecuperar = document.getElementById("btnCerrarModalRecuperar");
const formRecuperar           = document.getElementById("formRecuperar");
const correoRecuperar         = document.getElementById("correoRecuperar");
const msgRecuperar            = document.getElementById("msgRecuperar");
const previewCorreoZenith     = document.getElementById("previewCorreoZenith");
const btnEnviarRecuperar      = document.getElementById("btnEnviarRecuperar");

// Si ya hay sesión iniciada, pasar directo a la app
onAuthStateChanged(auth, (usuario) => {
  if (usuario) location.href = "app.html";
});

document.getElementById("formLogin").addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "";
  const correo = document.getElementById("correo").value.trim();
  const clave  = document.getElementById("clave").value;
  try {
    await signInWithEmailAndPassword(auth, correo, clave);
    location.href = "app.html";
  } catch (err) {
    msg.textContent = traducir(err.code);
  }
});

// Abrir modal de recuperación
document.getElementById("olvide").addEventListener("click", (e) => {
  e.preventDefault();
  const correoActual = document.getElementById("correo").value.trim();
  if (correoRecuperar && correoActual) {
    correoRecuperar.value = correoActual;
  }
  if (msgRecuperar) msgRecuperar.textContent = "";
  if (previewCorreoZenith) previewCorreoZenith.hidden = true;
  modalRecuperar?.classList.add("abierto");
});

function cerrarModalRecuperar() {
  modalRecuperar?.classList.remove("abierto");
}

btnCerrarModalRecuperar?.addEventListener("click", cerrarModalRecuperar);
modalRecuperar?.addEventListener("click", (e) => {
  if (e.target === modalRecuperar) cerrarModalRecuperar();
});

// Procesar envío de recuperación de contraseña con Firebase
formRecuperar?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const correo = correoRecuperar.value.trim();
  if (!correo) return;

  msgRecuperar.textContent = "Enviando correo oficial de recuperación...";
  msgRecuperar.style.color = "#00a8ff";
  btnEnviarRecuperar.disabled = true;

  try {
    await sendPasswordResetEmail(auth, correo);
    msgRecuperar.textContent = "✅ Correo enviado con éxito por el Equipo ZENITH.";
    msgRecuperar.style.color = "#10b981";

    // Mostrar la vista previa oficial con el logo y branding
    if (previewCorreoZenith) {
      previewCorreoZenith.hidden = false;
    }
  } catch (err) {
    msgRecuperar.textContent = traducir(err.code);
    msgRecuperar.style.color = "#ef4444";
  } finally {
    btnEnviarRecuperar.disabled = false;
  }
});
