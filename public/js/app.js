import { auth } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut,
  updateProfile,
  updateEmail
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { cursos } from "./contenidos.js";
import { traducir } from "./errores.js";

// Elementos del DOM
const saludo               = document.getElementById("saludo");
const avatarLetra          = document.getElementById("avatarLetra");
const perfilUsuario        = document.getElementById("perfilUsuario");
const lista                = document.getElementById("listaCursos");
const detalle              = document.getElementById("detalle");
const sidebar              = document.getElementById("sidebar");
const sidebarOverlay       = document.getElementById("sidebarOverlay");
const btnMenuToggle        = document.getElementById("btnMenuToggle");
const btnCerrarSidebar     = document.getElementById("btnCerrarSidebar");
const btnPrimerCurso       = document.getElementById("btnPrimerCurso");
const dotConexion          = document.getElementById("dotConexion");
const textoConexion        = document.getElementById("textoConexion");
const btnAbrirPerfilSidebar= document.getElementById("btnAbrirPerfilSidebar");

// Elementos del Modal de Perfil
const modalPerfil          = document.getElementById("modalPerfil");
const btnCerrarModalPerfil = document.getElementById("btnCerrarModalPerfil");
const formPerfil           = document.getElementById("formPerfil");
const inputPerfilNombre    = document.getElementById("inputPerfilNombre");
const inputPerfilCorreo    = document.getElementById("inputPerfilCorreo");
const txtPerfilUID         = document.getElementById("txtPerfilUID");
const perfilAvatarContenedor= document.getElementById("perfilAvatarContenedor");
const inputFotoPerfil      = document.getElementById("inputFotoPerfil");
const btnDispararFoto      = document.getElementById("btnDispararFoto");
const msgPerfil            = document.getElementById("msgPerfil");

let cursoSeleccionadoId = null;
let usuarioActual = null;

// =====================================================================
// AUTENTICACIÓN Y SEGURIDAD
// =====================================================================
onAuthStateChanged(auth, (usuario) => {
  if (!usuario) {
    location.href = "index.html";
    return;
  }

  usuarioActual = usuario;
  refrescarDatosUsuarioUI();
  mostrarCursos();

  // Si hay botón de bienvenida
  if (btnPrimerCurso && cursos.length > 0) {
    btnPrimerCurso.onclick = () => {
      mostrarCurso(cursos[0]);
      marcarCursoActivo(cursos[0].id);
    };
  }
});

function refrescarDatosUsuarioUI() {
  if (!usuarioActual) return;

  const nombreMostrar = usuarioActual.displayName || usuarioActual.email.split("@")[0];
  saludo.textContent = nombreMostrar;

  // Foto guardada en localStorage o en Firebase photoURL
  const fotoGuardada = localStorage.getItem(`zenith_photo_${usuarioActual.uid}`) || usuarioActual.photoURL;

  if (avatarLetra) {
    if (fotoGuardada) {
      avatarLetra.innerHTML = `<img src="${fotoGuardada}" alt="Avatar">`;
    } else {
      avatarLetra.textContent = nombreMostrar.charAt(0).toUpperCase();
    }
  }
}

document.getElementById("salir").addEventListener("click", async () => {
  if (confirm("¿Deseas cerrar tu sesión?")) {
    await signOut(auth);
    location.href = "index.html";
  }
});

// =====================================================================
// CONTROL DEL MENÚ LATERAL (SIDEBAR RESPONSIVO)
// =====================================================================
function abrirSidebar() {
  sidebar?.classList.add("abierto");
  sidebarOverlay?.classList.add("activo");
}

function cerrarSidebar() {
  sidebar?.classList.remove("abierto");
  sidebarOverlay?.classList.remove("activo");
}

btnMenuToggle?.addEventListener("click", abrirSidebar);
btnCerrarSidebar?.addEventListener("click", cerrarSidebar);
sidebarOverlay?.addEventListener("click", cerrarSidebar);

// =====================================================================
// RENDERIZADO DE CURSOS EN EL SIDEBAR
// =====================================================================
function mostrarCursos() {
  if (!lista) return;
  lista.innerHTML = "";

  const iconosPorDefecto = ["🌐", "📱", "⚙️", "💾", "🔒"];

  cursos.forEach((c, index) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `curso-item-btn ${cursoSeleccionadoId === c.id ? "activo" : ""}`;
    btn.id = `btnCurso_${c.id}`;

    const icono = c.icono || iconosPorDefecto[index % iconosPorDefecto.length];
    const totalLecciones = c.lecciones ? c.lecciones.length : 0;

    btn.innerHTML = `
      <span class="curso-item-icono">${icono}</span>
      <div class="curso-item-textos">
        <div class="curso-item-titulo">${c.titulo}</div>
        <div class="curso-item-meta">${totalLecciones} lecciones + Examen</div>
      </div>
      <span class="curso-item-flecha">›</span>
    `;

    btn.addEventListener("click", () => {
      marcarCursoActivo(c.id);
      mostrarCurso(c);
      if (window.innerWidth < 860) {
        cerrarSidebar();
      }
    });

    li.appendChild(btn);
    lista.appendChild(li);
  });
}

function marcarCursoActivo(id) {
  cursoSeleccionadoId = id;
  document.querySelectorAll(".curso-item-btn").forEach((btn) => {
    btn.classList.remove("activo");
  });
  const activo = document.getElementById(`btnCurso_${id}`);
  if (activo) activo.classList.add("activo");
}

// =====================================================================
// RENDERIZADO DEL CURSO CON PESTAÑAS (LECCIONES VS EXAMEN FINAL)
// =====================================================================
function mostrarCurso(c) {
  if (!detalle) return;
  detalle.innerHTML = "";

  // 1. Hero Banner del Curso
  const hero = document.createElement("div");
  hero.className = "curso-hero";
  hero.innerHTML = `
    <span class="curso-hero-badge">${c.icono || "📚"} Módulo de Aprendizaje</span>
    <h2>${c.titulo}</h2>
    <p>${c.resumen}</p>
  `;
  detalle.appendChild(hero);

  // 2. Barra de Pestañas (Lecciones vs Examen Final)
  const tabsBar = document.createElement("div");
  tabsBar.className = "curso-tabs-bar";
  tabsBar.innerHTML = `
    <button type="button" class="curso-tab-btn activo" id="tabBtnLecciones">
      <span>📖 Contenido y Lecciones</span>
      <span class="curso-tab-badge">${c.lecciones.length}</span>
    </button>
    <button type="button" class="curso-tab-btn" id="tabBtnExamen">
      <span>📝 Examen Final</span>
      <span class="curso-tab-badge">${c.quiz.length} preguntas</span>
    </button>
  `;
  detalle.appendChild(tabsBar);

  // 3. Panel de Lecciones
  const panelLecciones = document.createElement("div");
  panelLecciones.className = "curso-tab-panel activo";
  panelLecciones.id = "panelLecciones";

  const tituloSeccion = document.createElement("h3");
  tituloSeccion.className = "seccion-titulo-lecciones";
  tituloSeccion.innerHTML = `📚 Temario de Estudio`;
  panelLecciones.appendChild(tituloSeccion);

  c.lecciones.forEach((l, index) => {
    const card = document.createElement("article");
    card.className = "leccion-card";

    const header = document.createElement("div");
    header.className = "leccion-header";

    const numero = document.createElement("div");
    numero.className = "leccion-numero";
    numero.textContent = index + 1;

    const titulo = document.createElement("h3");
    titulo.textContent = l.titulo;

    header.append(numero, titulo);

    const texto = document.createElement("p");
    texto.className = "leccion-texto";
    texto.textContent = l.texto;

    card.append(header, texto);
    panelLecciones.appendChild(card);
  });

  // Banner al final de las lecciones para pasar al examen
  const bannerExamen = document.createElement("div");
  bannerExamen.className = "banner-ir-examen";
  bannerExamen.innerHTML = `
    <h4>¿Listo para evaluar tus conocimientos?</h4>
    <p>Has revisado las lecciones de este módulo. Pasa al examen final para obtener tu calificación.</p>
    <button type="button" class="btn-pasar-examen" id="btnIrExamen">
      Comenzar Examen Final ➔
    </button>
  `;
  panelLecciones.appendChild(bannerExamen);
  detalle.appendChild(panelLecciones);

  // 4. Panel del Examen Final (Quiz)
  const panelExamen = document.createElement("div");
  panelExamen.className = "curso-tab-panel";
  panelExamen.id = "panelExamen";
  renderizarQuizEnPanel(c, panelExamen);
  detalle.appendChild(panelExamen);

  // Lógica de cambio de pestañas
  const tabBtnLecciones = document.getElementById("tabBtnLecciones");
  const tabBtnExamen    = document.getElementById("tabBtnExamen");
  const btnIrExamen     = document.getElementById("btnIrExamen");

  function activarPestana(esExamen) {
    if (esExamen) {
      tabBtnLecciones?.classList.remove("activo");
      tabBtnExamen?.classList.add("activo");
      panelLecciones?.classList.remove("activo");
      panelExamen?.classList.add("activo");
    } else {
      tabBtnExamen?.classList.remove("activo");
      tabBtnLecciones?.classList.add("activo");
      panelExamen?.classList.remove("activo");
      panelLecciones?.classList.add("activo");
    }
    window.scrollTo({ top: hero.offsetTop, behavior: "smooth" });
  }

  tabBtnLecciones?.addEventListener("click", () => activarPestana(false));
  tabBtnExamen?.addEventListener("click", () => activarPestana(true));
  btnIrExamen?.addEventListener("click", () => activarPestana(true));

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// =====================================================================
// RENDERIZADO DEL QUIZ EN SU PANEL RESPECTIVO
// =====================================================================
function renderizarQuizEnPanel(c, contenedor) {
  const quizSection = document.createElement("section");
  quizSection.className = "quiz-seccion";

  quizSection.innerHTML = `
    <div class="quiz-header">
      <h3>📝 Examen Final: ${c.titulo}</h3>
      <p class="quiz-instruccion">Responde las siguientes ${c.quiz.length} preguntas de opción múltiple. Calificación mínima para aprobar: 60%.</p>
    </div>
  `;

  c.quiz.forEach((q, i) => {
    const pCard = document.createElement("div");
    pCard.className = "pregunta-card";

    const tituloPregunta = document.createElement("div");
    tituloPregunta.className = "pregunta-titulo";
    tituloPregunta.textContent = `${i + 1}. ${q.pregunta}`;
    pCard.appendChild(tituloPregunta);

    const opcionesGrid = document.createElement("div");
    opcionesGrid.className = "opciones-grid";

    q.opciones.forEach((op, j) => {
      const label = document.createElement("label");
      label.className = "opcion-label";

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = `quiz_q_${i}`;
      radio.value = j;

      const spanTexto = document.createElement("span");
      spanTexto.textContent = op;

      label.append(radio, spanTexto);
      opcionesGrid.appendChild(label);
    });

    pCard.appendChild(opcionesGrid);
    quizSection.appendChild(pCard);
  });

  const acciones = document.createElement("div");
  acciones.className = "quiz-acciones";

  const btnCalificar = document.createElement("button");
  btnCalificar.type = "button";
  btnCalificar.className = "btn-calificar";
  btnCalificar.innerHTML = `<span>Enviar y Calificar Examen</span> <span>📊</span>`;

  const resultadoBox = document.createElement("div");
  resultadoBox.className = "resultado-box";
  resultadoBox.setAttribute("role", "status");

  btnCalificar.addEventListener("click", () => {
    let aciertos = 0;
    let sinResponder = false;

    c.quiz.forEach((q, i) => {
      const seleccionado = document.querySelector(`input[name="quiz_q_${i}"]:checked`);
      if (!seleccionado) {
        sinResponder = true;
        return;
      }
      if (Number(seleccionado.value) === q.correcta) {
        aciertos++;
      }
    });

    if (sinResponder) {
      resultadoBox.className = "resultado-box alerta";
      resultadoBox.textContent = "⚠️ Por favor contesta todas las preguntas antes de enviar tu examen.";
      resultadoBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
      return;
    }

    const total = c.quiz.length;
    const porcentaje = Math.round((aciertos / total) * 100);
    const aprobado = porcentaje >= 60;

    if (aprobado) {
      resultadoBox.className = "resultado-box aprobado";
      resultadoBox.innerHTML = `
        🎉 <strong>¡Felicidades! Aprobaste el Examen Final.</strong><br>
        Obtuviste <strong>${aciertos} de ${total}</strong> respuestas correctas (${porcentaje}%).
      `;
    } else {
      resultadoBox.className = "resultado-box reprobado";
      resultadoBox.innerHTML = `
        📚 <strong>Calificación: ${aciertos} de ${total} correctas (${porcentaje}%).</strong><br>
        No alcanzaste el mínimo requerido (60%). Regresa a la pestaña de Lecciones para repasar e intenta de nuevo.
      `;
    }

    resultadoBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  acciones.append(btnCalificar, resultadoBox);
  quizSection.appendChild(acciones);
  contenedor.appendChild(quizSection);
}

// =====================================================================
// MODAL DE PERFIL DE USUARIO (DATOS, FOTO Y CORREO)
// =====================================================================
function abrirModalPerfil() {
  if (!modalPerfil || !usuarioActual) return;

  const nombreMostrar = usuarioActual.displayName || usuarioActual.email.split("@")[0];
  inputPerfilNombre.value = nombreMostrar;
  inputPerfilCorreo.value = usuarioActual.email || "";
  txtPerfilUID.textContent = usuarioActual.uid || "N/A";
  msgPerfil.textContent = "";

  // Foto
  const fotoGuardada = localStorage.getItem(`zenith_photo_${usuarioActual.uid}`) || usuarioActual.photoURL;
  if (perfilAvatarContenedor) {
    if (fotoGuardada) {
      perfilAvatarContenedor.innerHTML = `<img src="${fotoGuardada}" alt="Foto de perfil">`;
    } else {
      perfilAvatarContenedor.textContent = nombreMostrar.charAt(0).toUpperCase();
    }
  }

  modalPerfil.classList.add("abierto");
}

function cerrarModalPerfil() {
  modalPerfil?.classList.remove("abierto");
}

perfilUsuario?.addEventListener("click", abrirModalPerfil);
btnAbrirPerfilSidebar?.addEventListener("click", () => {
  abrirModalPerfil();
  if (window.innerWidth < 860) cerrarSidebar();
});
btnCerrarModalPerfil?.addEventListener("click", cerrarModalPerfil);
modalPerfil?.addEventListener("click", (e) => {
  if (e.target === modalPerfil) cerrarModalPerfil();
});

// Selección de foto de perfil
btnDispararFoto?.addEventListener("click", () => inputFotoPerfil?.click());

inputFotoPerfil?.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    alert("Por favor selecciona una imagen menor a 2 MB.");
    return;
  }

  const reader = new FileReader();
  reader.onload = async (event) => {
    const dataUrl = event.target.result;
    if (perfilAvatarContenedor) {
      perfilAvatarContenedor.innerHTML = `<img src="${dataUrl}" alt="Foto de perfil">`;
    }

    // Guardar foto localmente y en Firebase
    try {
      localStorage.setItem(`zenith_photo_${usuarioActual.uid}`, dataUrl);
      await updateProfile(usuarioActual, { photoURL: dataUrl });
      refrescarDatosUsuarioUI();
      msgPerfil.textContent = "✅ Foto de perfil actualizada correctamente.";
      msgPerfil.style.color = "#10b981";
    } catch (err) {
      console.warn("Error guardando photoURL en Firebase:", err);
    }
  };
  reader.readAsDataURL(file);
});

// Guardar cambios en el formulario de perfil
formPerfil?.addEventListener("submit", async (e) => {
  e.preventDefault();
  msgPerfil.textContent = "Guardando cambios...";
  msgPerfil.style.color = "#00a8ff";

  const nuevoNombre = inputPerfilNombre.value.trim();
  const nuevoCorreo = inputPerfilCorreo.value.trim();

  try {
    // 1. Actualizar Nombre
    if (nuevoNombre && nuevoNombre !== usuarioActual.displayName) {
      await updateProfile(usuarioActual, { displayName: nuevoNombre });
    }

    // 2. Actualizar Correo (si cambió)
    if (nuevoCorreo && nuevoCorreo !== usuarioActual.email) {
      await updateEmail(usuarioActual, nuevoCorreo);
    }

    refrescarDatosUsuarioUI();
    msgPerfil.textContent = "✅ ¡Datos de perfil guardados con éxito!";
    msgPerfil.style.color = "#10b981";

    setTimeout(() => {
      cerrarModalPerfil();
    }, 1500);
  } catch (err) {
    msgPerfil.textContent = traducir(err.code);
    msgPerfil.style.color = "#ef4444";
  }
});

// =====================================================================
// ESTADO DE CONEXIÓN A INTERNET (ONLINE / OFFLINE)
// =====================================================================
function actualizarEstadoRed() {
  if (navigator.onLine) {
    if (dotConexion) dotConexion.className = "dot-status";
    if (textoConexion) textoConexion.textContent = "Conectado a la red";
  } else {
    if (dotConexion) dotConexion.className = "dot-status offline";
    if (textoConexion) textoConexion.textContent = "Modo sin conexión (Offline)";
  }
}

window.addEventListener("online", actualizarEstadoRed);
window.addEventListener("offline", actualizarEstadoRed);
actualizarEstadoRed();
