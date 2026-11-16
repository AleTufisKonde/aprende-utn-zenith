import { auth, db, storage } from "./firebase-config.js";
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
import {
  ref as sRef,
  uploadString,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";
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
const inputFotoUrl         = document.getElementById("inputFotoUrl");
const btnGuardarFotoUrl    = document.getElementById("btnGuardarFotoUrl");
const gridAvataresPreset   = document.getElementById("gridAvataresPreset");
const msgPerfil            = document.getElementById("msgPerfil");

// Elementos del Modal de Cierre de Sesión
const modalCerrarSesion    = document.getElementById("modalCerrarSesion");
const btnCancelarSalir     = document.getElementById("btnCancelarSalir");
const btnConfirmarSalir    = document.getElementById("btnConfirmarSalir");

let cursoSeleccionadoId = null;
let usuarioActual = null;
let fotoEnEdicion = null;

// =====================================================================
// AVATARES OFICIALES ZENITH (Sincronizan 100% entre PC y Móvil)
// =====================================================================
const AVATARES_PRESET = [
  { id: "zenith-cyber",   nombre: "Cyber Zenith",  url: "https://api.dicebear.com/7.x/bottts/svg?seed=ZenithCyber&backgroundColor=070e1e" },
  { id: "zenith-core",    nombre: "Núcleo Quantum", url: "https://api.dicebear.com/7.x/shapes/svg?seed=ZenithCore&backgroundColor=0a142c" },
  { id: "zenith-falcon",  nombre: "Halcón Neón",   url: "https://api.dicebear.com/7.x/identicon/svg?seed=ZenithFalcon&backgroundColor=070e1e" },
  { id: "zenith-dev",     nombre: "Dev Pro",       url: "https://api.dicebear.com/7.x/bottts/svg?seed=ZenithDev&backgroundColor=0284c7" },
  { id: "zenith-astro",   nombre: "Tech Astro",    url: "https://api.dicebear.com/7.x/identicon/svg?seed=ZenithAstro&backgroundColor=00a8ff" },
  { id: "zenith-badge",   nombre: "Escudo Zenith", url: "https://ui-avatars.com/api/?name=Zenith&background=070e1e&color=00a8ff&bold=true" },
  { id: "zenith-matrix",  nombre: "Matrix Code",   url: "https://api.dicebear.com/7.x/shapes/svg?seed=MatrixZenith&backgroundColor=024870" },
  { id: "zenith-robot",   nombre: "AI Vanguard",   url: "https://api.dicebear.com/7.x/bottts/svg?seed=Vanguard&backgroundColor=0369a1" },
  { id: "zenith-utn",     nombre: "Orgullo UTN",   url: "https://ui-avatars.com/api/?name=UTN&background=0284c7&color=ffffff&bold=true" },
  { id: "zenith-titan",   nombre: "Titán Tech",    url: "https://api.dicebear.com/7.x/identicon/svg?seed=TitanTech&backgroundColor=0d1b3e" }
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

  // 1. Forzar refresco del perfil desde los servidores de Google Firebase
  try {
    await usuario.reload();
    usuarioActual = auth.currentUser;
  } catch (_) {}

  // 2. Si Firebase Auth ya tiene photoURL sincronizada en la nube, actualizar localStorage
  if (usuarioActual.photoURL) {
    localStorage.setItem(`zenith_photo_${usuarioActual.uid}`, usuarioActual.photoURL);
  }

  // 3. Consultar Cloud Firestore con timeout de seguridad (para no bloquear si no está habilitado)
  try {
    const docRef = doc(db, "usuarios", usuarioActual.uid);
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 1500));
    const docSnap = await Promise.race([getDoc(docRef), timeoutPromise]);
    if (docSnap && docSnap.exists && docSnap.exists() && docSnap.data().photoURL) {
      const nubeFoto = docSnap.data().photoURL;
      localStorage.setItem(`zenith_custom_photo_${usuarioActual.uid}`, nubeFoto);
      localStorage.setItem(`zenith_photo_${usuarioActual.uid}`, nubeFoto);
      // Si la foto en Firestore es una URL HTTP y Firebase Auth no la tiene, sincronizar Auth:
      if (nubeFoto.startsWith("http") && usuarioActual.photoURL !== nubeFoto) {
        updateProfile(usuarioActual, { photoURL: nubeFoto }).catch(() => {});
      }
      refrescarDatosUsuarioUI(nubeFoto);
    }
  } catch (_) {
    // Si Firestore no responde o no está inicializado, continuamos normalmente con Firebase Auth y LocalStorage
  }

  refrescarDatosUsuarioUI();
  mostrarCursos();
  inicializarSelectorAvatares();

  // Si hay botón de bienvenida
  if (btnPrimerCurso && cursos.length > 0) {
    btnPrimerCurso.onclick = () => {
      mostrarCurso(cursos[0]);
      marcarCursoActivo(cursos[0].id);
    };
  }
});

function refrescarDatosUsuarioUI(fotoParam) {
  if (!usuarioActual) return;

  const nombreMostrar = usuarioActual.displayName || usuarioActual.email.split("@")[0];
  if (saludo) saludo.textContent = nombreMostrar;

  // Prioridad:
  // 1. Foto explícita pasada por argumento
  // 2. Foto en edición activa
  // 3. Foto personalizada guardada en este dispositivo
  // 4. photoURL oficial en Firebase Auth
  // 5. LocalStorage general del dispositivo
  const fotoEfectiva = fotoParam ||
                       fotoEnEdicion ||
                       localStorage.getItem(`zenith_custom_photo_${usuarioActual.uid}`) ||
                       usuarioActual.photoURL ||
                       localStorage.getItem(`zenith_photo_${usuarioActual.uid}`);
  const inicial = (usuarioActual.displayName || usuarioActual.email || "Z").charAt(0).toUpperCase();

  if (avatarLetra) {
    if (fotoEfectiva) {
      avatarLetra.innerHTML = `<img src="${fotoEfectiva}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;">`;
    } else {
      avatarLetra.textContent = inicial;
    }
  }

  if (perfilAvatarContenedor) {
    if (fotoEfectiva) {
      perfilAvatarContenedor.innerHTML = `<img src="${fotoEfectiva}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;">`;
    } else {
      perfilAvatarContenedor.textContent = inicial;
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

      // Guardar avatar activo
      fotoEnEdicion = av.url;
      localStorage.setItem(`zenith_custom_photo_${usuarioActual.uid}`, av.url);
      localStorage.setItem(`zenith_photo_${usuarioActual.uid}`, av.url);

      // Refrescar inmediatamente la interfaz con el nuevo avatar
      refrescarDatosUsuarioUI(av.url);

      try {
        // 1. Guardar en Firebase Auth nativo (Sincroniza con cualquier dispositivo vía Google)
        await updateProfile(usuarioActual, { photoURL: av.url });

        // 2. Guardar en Firestore en segundo plano (sin await que bloquee la UI)
        setDoc(doc(db, "usuarios", usuarioActual.uid), {
          photoURL: av.url,
          displayName: usuarioActual.displayName || ""
        }, { merge: true }).catch(() => {});

        msgPerfil.textContent = "✅ ¡Avatar seleccionado y sincronizado!";
        msgPerfil.style.color = "#10b981";
      } catch (err) {
        msgPerfil.textContent = "Error guardando avatar: " + (traducir(err.code) || err.message);
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

// Guardar foto mediante URL directa (compatible 100% con Firebase Auth en la nube)
btnGuardarFotoUrl?.addEventListener("click", async () => {
  const urlDirecta = inputFotoUrl?.value.trim();
  if (!urlDirecta || (!urlDirecta.startsWith("http://") && !urlDirecta.startsWith("https://"))) {
    msgPerfil.textContent = "Por favor ingresa un enlace válido (que comience con https://)";
    msgPerfil.style.color = "#ef4444";
    return;
  }

  msgPerfil.textContent = "Sincronizando foto en tu cuenta...";
  msgPerfil.style.color = "#00a8ff";

  fotoEnEdicion = urlDirecta;
  localStorage.setItem(`zenith_custom_photo_${usuarioActual.uid}`, urlDirecta);
  localStorage.setItem(`zenith_photo_${usuarioActual.uid}`, urlDirecta);

  refrescarDatosUsuarioUI(urlDirecta);

  try {
    await updateProfile(usuarioActual, { photoURL: urlDirecta });

    // Guardar en Firestore en segundo plano (sin await que bloquee la UI)
    setDoc(doc(db, "usuarios", usuarioActual.uid), {
      photoURL: urlDirecta,
      displayName: usuarioActual.displayName || ""
    }, { merge: true }).catch(() => {});

    msgPerfil.textContent = "✅ ¡Foto sincronizada en la nube con éxito!";
    msgPerfil.style.color = "#10b981";
    if (inputFotoUrl) inputFotoUrl.value = "";
  } catch (err) {
    msgPerfil.textContent = "Error al sincronizar foto: " + (traducir(err.code) || err.message);
    msgPerfil.style.color = "#ef4444";
  }
});

// Selección de foto de perfil personalizada (con compresión y subida a la nube)
btnDispararFoto?.addEventListener("click", () => inputFotoPerfil?.click());

inputFotoPerfil?.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 8 * 1024 * 1024) {
    alert("Por favor selecciona una imagen menor a 8 MB.");
    return;
  }

  msgPerfil.textContent = "Optimizando y procesando imagen...";
  msgPerfil.style.color = "#00a8ff";

  const reader = new FileReader();
  reader.onerror = () => {
    msgPerfil.textContent = "Error al leer el archivo de imagen.";
    msgPerfil.style.color = "#ef4444";
  };
  reader.onload = (event) => {
    const img = new Image();
    img.onerror = () => {
      msgPerfil.textContent = "El archivo seleccionado no es una imagen válida.";
      msgPerfil.style.color = "#ef4444";
    };
    img.onload = async () => {
      try {
        // Redimensionar a 160x160 px con compresión JPEG ligera
        const canvas = document.createElement("canvas");
        canvas.width = 160;
        canvas.height = 160;
        const ctx = canvas.getContext("2d");

        // Centrar y recortar cuadrado
        const minDimension = Math.min(img.width, img.height);
        const sx = (img.width - minDimension) / 2;
        const sy = (img.height - minDimension) / 2;
        ctx.drawImage(img, sx, sy, minDimension, minDimension, 0, 0, 160, 160);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.82);

        // 1. Mostrar de inmediato localmente y marcar como foto activa
        fotoEnEdicion = compressedDataUrl;
        localStorage.setItem(`zenith_custom_photo_${usuarioActual.uid}`, compressedDataUrl);
        localStorage.setItem(`zenith_photo_${usuarioActual.uid}`, compressedDataUrl);
        refrescarDatosUsuarioUI(compressedDataUrl);

        // 2. Intentar subir a Firebase Storage nativo de Google si está activo
        try {
          const storageRef = sRef(storage, `avatares/${usuarioActual.uid}.jpg`);
          uploadString(storageRef, compressedDataUrl, 'data_url')
            .then(snap => getDownloadURL(snap.ref))
            .then(dlUrl => {
              fotoEnEdicion = dlUrl;
              updateProfile(usuarioActual, { photoURL: dlUrl }).catch(() => {});
              localStorage.setItem(`zenith_photo_${usuarioActual.uid}`, dlUrl);
              setDoc(doc(db, "usuarios", usuarioActual.uid), {
                photoURL: dlUrl,
                displayName: usuarioActual.displayName || ""
              }, { merge: true }).catch(() => {});
            })
            .catch(errS => console.log("[Zenith] Storage omitido:", errS.message));
        } catch (_) {}

        // 3. Intentar subir a servicio hosting libre con timeout estricto de 3.5 segundos
        let urlPublica = null;
        try {
          const controller = new AbortController();
          const tid = setTimeout(() => controller.abort(), 3500);
          const base64Pure = compressedDataUrl.replace(/^data:image\/\w+;base64,/, "");
          const fd = new FormData();
          fd.append("image", base64Pure);
          const resp = await fetch("https://api.imgbb.com/1/upload?key=2d92c735d481215b02664d93540e527f", {
            method: "POST",
            body: fd,
            signal: controller.signal
          });
          clearTimeout(tid);
          if (resp.ok) {
            const json = await resp.json();
            if (json && json.success && json.data && json.data.url) {
              urlPublica = json.data.url;
              fotoEnEdicion = urlPublica;
              await updateProfile(usuarioActual, { photoURL: urlPublica }).catch(() => {});
              localStorage.setItem(`zenith_photo_${usuarioActual.uid}`, urlPublica);
            }
          }
        } catch (_) {}

        const fotoFinal = urlPublica || compressedDataUrl;

        // Guardar en Cloud Firestore en segundo plano (sin await que bloquee la UI)
        setDoc(doc(db, "usuarios", usuarioActual.uid), {
          photoURL: fotoFinal,
          displayName: usuarioActual.displayName || ""
        }, { merge: true }).catch(() => {});

        msgPerfil.textContent = "✅ ¡Foto seleccionada y lista! Haz clic en 'Guardar cambios de perfil' abajo para confirmar.";
        msgPerfil.style.color = "#10b981";
      } catch (errProceso) {
        console.error("[Zenith] Error procesando imagen:", errProceso);
        msgPerfil.textContent = "Error al procesar la foto: " + errProceso.message;
        msgPerfil.style.color = "#ef4444";
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
    const perfilUpdates = {};
    if (nuevoNombre && nuevoNombre !== usuarioActual.displayName) {
      perfilUpdates.displayName = nuevoNombre;
    }
    if (fotoEnEdicion && fotoEnEdicion.startsWith("http")) {
      perfilUpdates.photoURL = fotoEnEdicion;
    }

    if (Object.keys(perfilUpdates).length > 0) {
      await updateProfile(usuarioActual, perfilUpdates);
    }

    // Actualizar Correo (si cambió)
    if (nuevoCorreo && nuevoCorreo !== usuarioActual.email) {
      try {
        await updateEmail(usuarioActual, nuevoCorreo);
      } catch (errEmail) {
        if (errEmail.code === "auth/requires-recent-login") {
          msgPerfil.textContent = "⚠️ Para cambiar tu correo, por seguridad debes cerrar sesión y volver a entrar.";
          msgPerfil.style.color = "#f59e0b";
          return;
        }
        throw errEmail;
      }
    }

    // Respaldar en Firestore en segundo plano (SIN await que bloquee la UI)
    const datosFirestore = {
      displayName: nuevoNombre,
      email: nuevoCorreo
    };
    if (fotoEnEdicion) {
      datosFirestore.photoURL = fotoEnEdicion;
    }
    setDoc(doc(db, "usuarios", usuarioActual.uid), datosFirestore, { merge: true }).catch(() => {});

    // Refrescar inmediatamente la interfaz con la foto seleccionada
    refrescarDatosUsuarioUI(fotoEnEdicion);

    msgPerfil.textContent = "✅ ¡Datos de perfil y foto guardados con éxito!";
    msgPerfil.style.color = "#10b981";

    setTimeout(() => {
      cerrarModalPerfil();
    }, 1200);
  } catch (err) {
    console.error("[Zenith] Error al guardar perfil:", err);
    msgPerfil.textContent = traducir(err.code) || ("Error al guardar: " + err.message);
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
