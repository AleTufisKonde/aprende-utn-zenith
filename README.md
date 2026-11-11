# ⚡ Aprende UTN — Plataforma Educativa PWA
### Desarrollado por el **Equipo ZENITH**
> **Proyecto Final · Aplicaciones Web Progresivas (PWA)**  
> Universidad Tecnológica de Nezahualcóyotl (UTN) · Nivel Superior  
> Docente: M. en C.E Marco Antonio Llinas Perez

---

## 📖 Descripción del Proyecto
**Aprende UTN** es una Aplicación Web Progresiva (PWA) de nivel superior diseñada con arquitectura moderna, mobile-first y soporte 100% offline. Permite a los estudiantes universitarios registrarse, gestionar su perfil con foto personalizada, estudiar asignaturas técnicas organizadas por pestañas y presentar evaluaciones interactivas con calificación instantánea.

---

## ✨ Características Principales
- 🔐 **Autenticación en la Nube:** Inicio de sesión, registro y recuperación de contraseña oficial mediante **Firebase Authentication**.
- 📚 **Catálogo de 8 Cursos Técnicos:**
  1. 🌐 Fundamentos de Desarrollo Web (HTML5, CSS3, JS ES6+)
  2. ⚡ Aplicaciones Web Progresivas (PWA)
  3. 🐙 Control de Versiones con Git y GitHub
  4. 🗄️ Bases de Datos Relacionales y NoSQL
  5. ⚙️ Arquitectura de Aplicaciones Web
  6. 📱 Desarrollo de Aplicaciones Móviles
  7. ⚛️ Desarrollo Frontend con React
  8. 🎮 Creación y Desarrollo de Videojuegos
- 📑 **Navegación por Pestañas:** Separación clara entre *Contenido de Estudio / Lecciones* y el *Examen Final Calificado*.
- 👤 **Gestión de Perfil:** El alumno puede subir foto de perfil, modificar su nombre, ver su matrícula/UID y correo.
- 📲 **Instalabilidad PWA:** Soporte completo de instalación en Android, iOS y Desktop con Web App Manifest y modal guiado.
- 📶 **Modo Offline Resiliente:** Service Worker con estrategia de caché y pantalla de contingencia `offline.html`.

---

## 📁 Estructura del Repositorio
```
aprende-utn/
├── public/                 # Archivos servidos en producción
│   ├── index.html          # Login y recuperación de contraseña
│   ├── registro.html       # Registro de nuevos estudiantes
│   ├── app.html            # Dashboard principal, cursos y exámenes
│   ├── offline.html        # Pantalla sin conexión
│   ├── manifest.json       # Manifiesto PWA de instalación
│   ├── service-worker.js   # Service Worker (Caché v5)
│   ├── css/
│   │   └── estilos.css     # Paleta Cyber Cyan & Midnight Navy
│   ├── js/
│   │   ├── firebase-config.js  # Configuración Firebase
│   │   ├── errores.js          # Traductor de códigos de error
│   │   ├── login.js            # Lógica de acceso y recuperación
│   │   ├── registro.js         # Lógica de registro
│   │   ├── app.js              # Lógica del dashboard y perfil
│   │   ├── contenidos.js       # Base de contenidos y exámenes
│   │   └── pwa.js              # Registro SW y banner de instalación
│   └── icons/
│       ├── logo-zenith.png     # Logotipo oficial
│       ├── favicon.png         # Favicon
│       ├── icon-192.png        # Icono PWA móvil
│       └── icon-512.png        # Icono PWA alta resolución
├── vercel.json             # Configuración de despliegue en Vercel
├── firebase.json           # Configuración para Firebase Hosting
└── .firebaserc             # Proyecto Firebase asociado
```

---

## 🚀 Despliegue en Vercel
Este proyecto está optimizado para desplegarse en **Vercel** en un clic gracias a `vercel.json`:
1. Importa este repositorio en [Vercel](https://vercel.com).
2. Vercel detectará la carpeta `public/` automáticamente como directorio de salida.
3. Haz clic en **Deploy**.
4. **Importante:** Agrega el dominio generado (`tu-app.vercel.app`) en **Firebase Console > Authentication > Configuración > Dominios autorizados**.

---

## ⚖️ Derechos y Licencia
© 2026 **Equipo ZENITH** · Todos los derechos reservados.  
Diseñado y programado para la Universidad Tecnológica de Nezahualcóyotl (UTN).
