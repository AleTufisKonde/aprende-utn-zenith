import { auth } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { traducir } from "./errores.js";

const msg = document.getElementById("mensaje");

document.getElementById("formRegistro").addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "";
  msg.style.color = "#b00020";

  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const clave  = document.getElementById("clave").value;
  const clave2 = document.getElementById("clave2").value;

  if (clave !== clave2) {
    msg.textContent = "Las contraseñas no coinciden.";
    return;
  }
  try {
    const cred = await createUserWithEmailAndPassword(auth, correo, clave);
    await updateProfile(cred.user, { displayName: nombre });
    location.href = "app.html";
  } catch (err) {
    msg.textContent = traducir(err.code);
  }
});
