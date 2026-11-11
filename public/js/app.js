import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut,
  updateProfile,
  updateEmail
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
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
const gridAvataresPreset   = document.getElementById("gridAvataresPreset");
const msgPerfil            = document.getElementById("msgPerfil");

// Elementos del Modal de Cierre de Sesión
const modalCerrarSesion    = document.getElementById("modalCerrarSesion");
const btnCancelarSalir     = document.getElementById("btnCancelarSalir");
const btnConfirmarSalir    = document.getElementById("btnConfirmarSalir");

let cursoSeleccionadoId = null;
let usuarioActual = null;

// =====================================================================
// AVATARES OFICIALES ZENITH (Sincronizan 100% entre PC y Móvil)
// =====================================================================
const AVATARES_PRESET = [
  { id: "zenith-cyber",  nombre: "Cyber Zenith",  url: "https://api.dicebear.com/7.x/bottts/svg?seed=ZenithCyber&backgroundColor=070e1e" },
  { id: "zenith-core",   nombre: "Núcleo Quantum", url: "https://api.dicebear.com/7.x/shapes/svg?seed=ZenithCore&backgroundColor=0a142c" },
  { id: "zenith-falcon", nombre: "Halcón Neón",   url: "https://api.dicebear.com/7.x/identicon/svg?seed=ZenithFalcon&backgroundColor=070e1e" },
  { id: "zenith-dev",    nombre: "Dev Pro",       url: "https://api.dicebear.com/7.x/bottts/svg?seed=ZenithDev&backgroundColor=0284c7" },
  { id: "zenith-astro",  nombre: "Tech Astro",    url: "https://api.dicebear.com/7.x/identicon/svg?seed=ZenithAstro&backgroundColor=00a8ff" },
  { id: "zenith-badge",  nombre: "Escudo Zenith", url: "https://ui-avatars.com/api/?name=Zenith&background=070e1e&color=00a8ff&bold=true" }
];

// =====================================================================
// AUTENTICACIÓN Y SINCRONIZACIÓN EN LA NUBE
// =====================================================================
onAuthStateChanged(auth, async (usuario) => {
  if (!usuario) {
    location.href = "index.html";
    return;
  }

  usuarioActual = usuario;
  refrescarDatosUsuarioUI();
  mostrarCursos();
  inicializarSelectorAvatares();

  // Intentar sincronizar foto desde Cloud Firestore (Cross-device Sync)
  try {
    const docRef = doc(db, "usuarios", usuario.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().photoURL) {
      const nubeFoto = docSnap.data().photoURL;
      localStorage.setItem(`zenith_photo_${usuario.uid}`, nubeFoto);
      refrescarDatosUsuarioUI();
    }
  } catch (err) {
    console.log("[Zenith] Firestore en modo local o sin colecciones aún:", err.message);
  }

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

  // Prioridad de foto: 1. LocalStorage sincronizado, 2. photoURL de Firebase Auth
  const fotoGuardada = localStorage.getItem(`zenith_photo_${usuarioActual.uid}`) || usuarioActual.photoURL;

  if (avatarLetra) {
    if (fotoGuardada) {
      avatarLetra.innerHTML = `<img src="${fotoGuardada}" alt="Avatar">`;
    } else {
      avatarLetra.textContent = nombreMostrar.charAt(0).toUpperCase();
    }
  }

  if (perfilAvatarContenedor) {
    if (fotoGuardada) {
      perfilAvatarContenedor.innerHTML = `<img src="${fotoGuardada}" alt="Avatar">`;
    } else {
      perfilAvatarContenedor.textContent = nombreMostrar.charAt(0).toUpperCase();
    }
  }
}

// =====================================================================
// MODAL DE CIERRE DE SESIÓN PROFESIONAL
// =====================================================================
document.getElementById("salir")?.addEventListener("click", () => {
  modalCerrarSesion?.classList.add("abierto");
});

btnCancelarSalir?.addEventListener("click", () => {
  modalCerrarSesion?.classList.remove("abierto");
});

modalCerrarSesion?.addEventListener("click", (e) => {
  if (e.target === modalCerrarSesion) {
    modalCerrarSesion.classList.remove("abierto");
  }
});

btnConfirmarSalir?.addEventListener("click", async () => {
  btnConfirmarSalir.textContent = "Saliendo...";
  btnConfirmarSalir.disabled = true;
  await signOut(auth);
  location.href = "index.html";
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
// SELECTOR DE AVATARES PREESTABLECIDOS (SYNC NUBE GARANTIZADO)
// =====================================================================
function inicializarSelectorAvatares() {
  if (!gridAvataresPreset) return;
  gridAvataresPreset.innerHTML = "";

  const fotoActual = localStorage.getItem(`zenith_photo_${usuarioActual?.uid}`) || usuarioActual?.photoURL;

  AVATARES_PRESET.forEach((av) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `avatar-preset-btn ${fotoActual === av.url ? "activo" : ""}`;
    btn.title = av.nombre;
    btn.innerHTML = `<img src="${av.url}" alt="${av.nombre}" loading="lazy">`;

    btn.addEventListener("click", async () => {
      document.querySelectorAll(".avatar-preset-btn").forEach(b => b.classList.remove("activo"));
      btn.classList.add("activo");

      msgPerfil.textContent = "Sincronizando avatar en la nube...";
      msgPerfil.style.color = "#00a8ff";

      try {
        // 1. Guardar en Firebase Auth nativo (Sincroniza con cualquier dispositivo)
        await updateProfile(usuarioActual, { photoURL: av.url });
        localStorage.setItem(`zenith_photo_${usuarioActual.uid}`, av.url);

        // 2. Guardar en Firestore si está disponible
        try {
          await setDoc(doc(db, "usuarios", usuarioActual.uid), {
            photoURL: av.url,
            displayName: usuarioActual.displayName || ""
          }, { merge: true });
        } catch (_) {}

        refrescarDatosUsuarioUI();
        msgPerfil.textContent = "✅ ¡Avatar sincronizado con éxito en tu cuenta!";
        msgPerfil.style.color = "#10b981";
      } catch (err) {
        msgPerfil.textContent = "Error guardando avatar: " + err.message;
        msgPerfil.style.color = "#ef4444";
      }
    });

    gridAvataresPreset.appendChild(btn);
  });
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

  refrescarDatosUsuarioUI();
  inicializarSelectorAvatares();
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

// Selección de foto de perfil personalizada (con compresión Canvas para sincronización)
btnDispararFoto?.addEventListener("click", () => inputFotoPerfil?.click());

inputFotoPerfil?.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    alert("Por favor selecciona una imagen menor a 5 MB.");
    return;
  }

  msgPerfil.textContent = "Optimizando y guardando imagen...";
  msgPerfil.style.color = "#00a8ff";

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = async () => {
      // Redimensionar a 128x128 píxeles con compresión JPEG ligera
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext("2d");

      // Centrar y recortar cuadrado
      const minDimension = Math.min(img.width, img.height);
      const sx = (img.width - minDimension) / 2;
      const sy = (img.height - minDimension) / 2;
      ctx.drawImage(img, sx, sy, minDimension, minDimension, 0, 0, 128, 128);

      const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.75);

      // Guardar localmente
      localStorage.setItem(`zenith_photo_${usuarioActual.uid}`, compressedDataUrl);
      refrescarDatosUsuarioUI();

      // Guardar en Cloud Firestore para sincronización entre dispositivos
      try {
        await setDoc(doc(db, "usuarios", usuarioActual.uid), {
          photoURL: compressedDataUrl,
          displayName: usuarioActual.displayName || ""
        }, { merge: true });

        msgPerfil.textContent = "✅ Foto guardada y sincronizada en la nube.";
        msgPerfil.style.color = "#10b981";
      } catch (errCloud) {
        msgPerfil.textContent = "✅ Foto guardada en tu dispositivo actual.";
        msgPerfil.style.color = "#10b981";
      }
    };
    img.src = event.target.result;
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

    // 3. Respaldar en Firestore si está disponible
    try {
      await setDoc(doc(db, "usuarios", usuarioActual.uid), {
        displayName: nuevoNombre,
        email: nuevoCorreo
      }, { merge: true });
    } catch (_) {}

    refrescarDatosUsuarioUI();
    msgPerfil.textContent = "✅ ¡Datos de perfil guardados con éxito!";
    msgPerfil.style.color = "#10b981";

    setTimeout(() => {
      cerrarModalPerfil();
    }, 1200);
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
