// =====================================================================
// contenidos.js — Catálogo Académico Oficial · Equipo ZENITH
// Asignaturas de Nivel Superior para Aprende UTN
// =====================================================================

export const cursos = [
  // -------------------------------------------------------------------
  // 1. FUNDAMENTOS DE DESARROLLO WEB
  // -------------------------------------------------------------------
  {
    id: "curso-html-css-js",
    titulo: "Fundamentos de Desarrollo Web",
    icono: "🌐",
    resumen: "Aprende los pilares fundamentales de la web moderna: maquetación semántica con HTML5, diseño responsivo con CSS3 y programación dinámica con JavaScript ES6+.",
    lecciones: [
      {
        titulo: "Lección 1: Estructura y Semántica con HTML5",
        texto: `HTML (HyperText Markup Language) es el lenguaje estándar para estructurar el contenido de internet. No es un lenguaje de programación, sino de marcado.

Etiquetas Semánticas de HTML5:
  • <header>: Encabezado de la página o de una sección
  • <nav>: Bloque de navegación que contiene enlaces principales
  • <main>: Contenido principal y único del documento
  • <section> y <article>: Agrupaciones temáticas de contenido
  • <footer>: Pie de página con créditos, enlaces legales y contacto

Buenas Prácticas de Accesibilidad y SEO:
  1. Usar siempre el atributo alt en imágenes (<img src="..." alt="descripción">).
  2. Mantener una jerarquía estricta de encabezados (un solo <h1> por página, seguido de <h2> y <h3>).
  3. Declarar el viewport (<meta name="viewport" content="width=device-width, initial-scale=1">) para dispositivos móviles.`
      },
      {
        titulo: "Lección 2: Estilos Modernos con CSS3 y Flexbox",
        texto: `CSS (Cascading Style Sheets) controla la presentación visual, tipografías, colores y layouts de la página web.

El Modelo de Caja (Box Model):
Cada elemento se compone de:
  1. Content: El contenido textual o multimedia.
  2. Padding: Espacio interno entre el contenido y el borde.
  3. Border: Línea perimetral visible alrededor del padding.
  4. Margin: Espacio externo que separa el elemento de sus vecinos.

Flexbox (Flexible Box Layout):
Es el estándar para alinear elementos en una dimensión (fila o columna):
  • display: flex; activa el contenedor flexible.
  • justify-content: alinea en el eje principal (center, space-between, space-around).
  • align-items: alinea en el eje transversal (center, stretch, flex-start).
  • flex-wrap: wrap; permite que los elementos salten a la siguiente línea en pantallas pequeñas.`
      },
      {
        titulo: "Lección 3: Dinamismo con JavaScript ES6+ y DOM",
        texto: `JavaScript es el lenguaje de programación nativo de los navegadores. Permite convertir documentos estáticos en aplicaciones web interactivas.

Manipulación del DOM (Document Object Model):
  • document.querySelector('.clase') y document.getElementById('id'): Selección de nodos.
  • element.addEventListener('click', handler): Escucha reactiva de eventos del usuario.
  • element.classList.toggle('activo'): Modificación dinámica de estilos.

Características Modernas de ES6+:
  • Declaración de variables inmutables con const y mutables con let (evitar var).
  • Funciones flecha: const sumar = (a, b) => a + b;
  • Desestructuración de objetos: const { nombre, edad } = usuario;
  • Promesas y async/await para manejar peticiones asíncronas con la API Fetch.`
      }
    ],
    quiz: [
      {
        pregunta: "¿Cuál es el propósito de las etiquetas semánticas en HTML5 como <nav> o <article>?",
        opciones: [
          "Compilar el código en lenguaje binario",
          "Dar significado estructural al contenido para accesibilidad y motores de búsqueda",
          "Aumentar automáticamente la velocidad de la memoria RAM del servidor"
        ],
        correcta: 1
      },
      {
        pregunta: "¿Qué propiedad de Flexbox alinea los elementos a lo largo del eje principal?",
        opciones: ["justify-content", "align-items", "flex-direction"],
        correcta: 0
      },
      {
        pregunta: "¿Qué diferencia existe entre let y const en JavaScript moderno?",
        opciones: [
          "let solo almacena texto y const solo números",
          "const no permite reasignar el valor de la variable mientras que let sí",
          "const se borra automáticamente al cerrar la pestaña y let no"
        ],
        correcta: 1
      },
      {
        pregunta: "¿Qué propiedad del Box Model representa el espacio INTERNO entre el contenido y el borde?",
        opciones: ["margin", "outline", "padding"],
        correcta: 2
      },
      {
        pregunta: "¿Qué método se utiliza para escuchar de forma segura los clics del usuario en un botón?",
        opciones: ["button.addEventListener('click', fn)", "button.listenClick(fn)", "button.runOnClick()"],
        correcta: 0
      }
    ]
  },

  // -------------------------------------------------------------------
  // 2. APLICACIONES WEB PROGRESIVAS (PWA)
  // -------------------------------------------------------------------
  {
    id: "curso-pwa",
    titulo: "Aplicaciones Web Progresivas (PWA)",
    icono: "⚡",
    resumen: "Domina la tecnología que une lo mejor de la web y las aplicaciones móviles nativas: Service Workers, Web App Manifest, almacenamiento en caché y modo offline.",
    lecciones: [
      {
        titulo: "Lección 1: ¿Qué es una PWA y cuáles son sus Pilares?",
        texto: `Una Progressive Web App (PWA) es una aplicación web construida con estándares web que ofrece una experiencia de usuario idéntica a una aplicación nativa instalable.

Los Tres Requisitos Fundamentales:
  1. HTTPS Obligatorio: Garantiza seguridad, cifrado e integridad de las peticiones. Los Service Workers solo funcionan bajo HTTPS (o localhost en desarrollo).
  2. Web App Manifest (manifest.json): Archivo declarativo en formato JSON con nombre, colores institucionales, orientación e íconos en resoluciones 192x192 y 512x512.
  3. Service Worker: Script que corre en segundo plano en un hilo independiente, interceptando peticiones de red y gestionando el almacenamiento en caché local.

Ventajas frente a Apps Nativas:
  • Instalación inmediata sin descargas pesadas desde Play Store o App Store.
  • Actualizaciones instantáneas sin requerir aprobación de tiendas.
  • Ahorro drástico de almacenamiento en el dispositivo del usuario.`
      },
      {
        titulo: "Lección 2: Ciclo de Vida del Service Worker y Caché",
        texto: `El Service Worker no tiene acceso directo al DOM de la página; se comunica mediante mensajes y escucha eventos del sistema.

Ciclo de Vida:
  1. Registro (Registration): Se invoca desde la página con navigator.serviceWorker.register('service-worker.js').
  2. Instalación (Install): El evento 'install' se dispara una sola vez. Es el momento perfecto para pre-cachear el App Shell (archivos HTML, CSS, JS e íconos).
  3. Activación (Activate): Se ejecuta cuando una nueva versión toma control; ideal para borrar cachés obsoletos.
  4. Peticiones (Fetch): Intercepta cualquier llamada de red saliente desde la aplicación.`
      },
      {
        titulo: "Lección 3: Estrategias de Caché y Auditoría Lighthouse",
        texto: `Elegir la estrategia adecuada depende del tipo de contenido:

Estrategias de Almacenamiento:
  • Cache-First (Caché primero): Busca en caché; si no está, va a la red. Ideal para assets estáticos (fuentes, logos, CSS).
  • Network-First (Red primero): Intenta traer datos frescos de internet; si no hay conexión, usa la copia local guardada.
  • Stale-While-Revalidate: Devuelve inmediatamente la versión en caché para velocidad instantánea, mientras descarga en segundo plano la versión fresca.

Herramienta Lighthouse (Chrome DevTools):
Permite auditar el cumplimiento de los estándares PWA:
  ✓ Instalabilidad confirmada
  ✓ Respuesta 200 OK en modo sin conexión (Offline)
  ✓ Tiempos de carga óptimos (First Contentful Paint < 1.8s)`
      }
    ],
    quiz: [
      {
        pregunta: "¿Por qué el protocolo HTTPS es obligatorio para el funcionamiento de una PWA?",
        opciones: [
          "Para comprimir los archivos de video automáticamente",
          "Por seguridad, ya que los Service Workers interceptan peticiones de red y podrían ser vulnerables a ataques Man-in-the-Middle",
          "Para que el celular no consuma batería"
        ],
        correcta: 1
      },
      {
        pregunta: "¿Cuál es la función principal del archivo manifest.json?",
        opciones: [
          "Indicar al navegador metadatos de instalación: nombre, colores, modo de visualización e íconos",
          "Conectar directamente con la base de datos MySQL",
          "Traducir los textos de la página a otros idiomas"
        ],
        correcta: 0
      },
      {
        pregunta: "¿Qué evento del Service Worker es el idóneo para precachear los recursos base (App Shell)?",
        opciones: ["fetch", "install", "push"],
        correcta: 1
      },
      {
        pregunta: "¿En qué consiste la estrategia 'Stale-While-Revalidate'?",
        opciones: [
          "Borra todos los datos del usuario al cerrar el navegador",
          "Responde al instante con la caché existente y actualiza en segundo plano desde la red",
          "Bloquea la página si no hay conexión a internet"
        ],
        correcta: 1
      },
      {
        pregunta: "¿Qué herramienta integrada en Chrome DevTools evalúa los criterios de calidad y PWA?",
        opciones: ["Lighthouse", "Memory Profiler", "Security Tab"],
        correcta: 0
      }
    ]
  },

  // -------------------------------------------------------------------
  // 3. CONTROL DE VERSIONES CON GIT Y GITHUB
  // -------------------------------------------------------------------
  {
    id: "curso-git-github",
    titulo: "Control de Versiones con Git y GitHub",
    icono: "🐙",
    resumen: "Aprende el estándar de la industria para trabajar en equipo: flujo de trabajo con ramas, commits profesionales, resolución de conflictos y colaboración remota en GitHub.",
    lecciones: [
      {
        titulo: "Lección 1: Fundamentos de Git y los Tres Estados",
        texto: `Git es un sistema de control de versiones distribuido creado por Linus Torvalds. Permite registrar el historial de cambios de un proyecto sin sobrescribir el trabajo de otros.

Los Tres Estados de Git:
  1. Working Directory (Área de trabajo): Archivos modificados en tu editor local aún no rastreados.
  2. Staging Area (Área de preparación): Archivos marcados con git add para ser incluidos en el próximo punto de guardado.
  3. Git Directory / Repository (.git): Cambios confirmados permanentemente en la base de datos local con git commit.

Comandos Iniciales Esenciales:
  • git init: Inicializa un nuevo repositorio local.
  • git status: Muestra el estado actual de los archivos.
  • git add .: Agrega todos los cambios al staging area.
  • git commit -m "feat: login con firebase": Registra el cambio con un mensaje descriptivo.`
      },
      {
        titulo: "Lección 2: Ramas (Branches) y Fusión (Merge)",
        texto: `Las ramas permiten desarrollar nuevas funcionalidades, corregir bugs o experimentar de forma aislada sin afectar la versión estable de producción (main o master).

Comandos Clave de Ramas:
  • git branch <nombre>: Crea una nueva rama.
  • git checkout -b feature/login (o git switch -c): Crea y se cambia a la rama en un solo paso.
  • git branch: Lista todas las ramas locales existentes.

Fusión y Conflictos:
Para integrar cambios a la rama principal:
  1. Cambiar a main: git checkout main
  2. Fusionar la rama: git merge feature/login
Si dos personas modificaron las mismas líneas en el mismo archivo, Git genera un Conflicto de Fusión que debe resolverse manualmente antes de completar el commit.`
      },
      {
        titulo: "Lección 3: Repositorios Remotos y Trabajo en GitHub",
        texto: `GitHub es una plataforma en la nube que hospeda repositorios de Git y facilita la colaboración en equipos de desarrollo profesionales.

Flujo de Colaboración Remota:
  • git remote add origin <url>: Vincula tu repositorio local con el repositorio en la nube.
  • git push -u origin main: Envía tus commits locales al servidor remoto.
  • git pull origin main: Descarga e integra los cambios que tus compañeros subieron.

Pull Requests (PR) y Code Review:
Un Pull Request es una solicitud para revisar y fusionar código. Permite a los líderes técnicos y compañeros auditar el código, dejar comentarios y aprobar los cambios antes de desplegarlos a producción.`
      }
    ],
    quiz: [
      {
        pregunta: "¿Qué comando coloca los archivos modificados en el Staging Area de Git?",
        opciones: ["git commit", "git add", "git push"],
        correcta: 1
      },
      {
        pregunta: "¿Para qué sirve crear ramas (branches) en un proyecto de software?",
        opciones: [
          "Para aislar nuevas funcionalidades y correcciones sin poner en riesgo el código principal estable",
          "Para duplicar el espacio en disco duro del servidor",
          "Para comprimir archivos en formato .zip"
        ],
        correcta: 0
      },
      {
        pregunta: "¿Qué ocurre cuando dos desarrolladores modifican la misma línea de un archivo en ramas distintas?",
        opciones: [
          "Git borra automáticamente el archivo para evitar errores",
          "Se produce un conflicto de fusión (merge conflict) que debe resolverse manualmente",
          "El sistema operativo apaga la computadora"
        ],
        correcta: 1
      },
      {
        pregunta: "¿Qué comando descarga los cambios remotos y los fusiona en tu rama local actual?",
        opciones: ["git pull", "git fetch --dry-run", "git clone --force"],
        correcta: 0
      },
      {
        pregunta: "¿Cuál es la función principal de un Pull Request en GitHub?",
        opciones: [
          "Solicitar la revisión y aprobación de código antes de incorporarlo a la rama principal",
          "Pagar la suscripción mensual de GitHub",
          "Descargar la versión beta de Visual Studio Code"
        ],
        correcta: 0
      }
    ]
  },

  // -------------------------------------------------------------------
  // 4. BASES DE DATOS RELACIONALES Y NOSQL
  // -------------------------------------------------------------------
  {
    id: "curso-bases-datos",
    titulo: "Bases de Datos Relacionales y NoSQL",
    icono: "🗄️",
    resumen: "Comprende el modelado de datos para sistemas empresariales: tablas y consultas SQL, integridad referencial, bases de datos no relacionales basadas en documentos y Firebase Firestore.",
    lecciones: [
      {
        titulo: "Lección 1: Modelo Relacional y Consultas SQL",
        texto: `Las bases de datos relacionales organizan la información en tablas compuestas por filas (registros) y columnas (campos o atributos).

Conceptos Fundamentales:
  • Clave Primaria (Primary Key - PK): Identificador único e irrepetible de cada fila.
  • Clave Foránea (Foreign Key - FK): Campo que establece una relación con la clave primaria de otra tabla.
  • Integridad Referencial: Garantiza que no existan relaciones hacia registros inexistentes.

Sintaxis SQL (Structured Query Language):
  • SELECT nombre, correo FROM estudiantes WHERE activo = 1;
  • INSERT INTO cursos (titulo, creditos) VALUES ('PWA', 5);
  • UPDATE estudiantes SET nombre = 'Carlos' WHERE id = 12;
  • DELETE FROM logs WHERE fecha < '2026-01-01';`
      },
      {
        titulo: "Lección 2: Relaciones, JOINs y Normalización",
        texto: `Para evitar duplicidad y anomalías de actualización, las bases de datos relacionales se normalizan (1FN, 2FN, 3FN).

Tipos de Relaciones:
  • Uno a Uno (1:1): Un estudiante tiene un único expediente médico.
  • Uno a Muchos (1:N): Un profesor imparte varios cursos.
  • Muchos a Muchos (N:M): Muchos alumnos se inscriben a muchas materias (requiere tabla intermedia).

Cláusula JOIN:
Permite combinar datos de dos o más tablas relacionadas:
  SELECT e.nombre, c.titulo 
  FROM estudiantes e
  INNER JOIN inscripciones i ON e.id = i.estudiante_id
  INNER JOIN cursos c ON i.curso_id = c.id;`
      },
      {
        titulo: "Lección 3: Paradigma NoSQL y Cloud Firestore",
        texto: `Las bases de datos NoSQL surgieron para atender necesidades de alta escalabilidad horizontal, esquemas dinámicos y gran volumen de datos no estructurados.

Tipos de Bases de Datos NoSQL:
  • Documentales (Document Stores): Guardan datos en formato JSON/BSON (MongoDB, Cloud Firestore).
  • Clave-Valor (Key-Value): Altísima velocidad de lectura (Redis).
  • Columnares (Column-Family): Análisis masivo de datos (Apache Cassandra).

Cloud Firestore (Firebase):
Base de datos NoSQL en tiempo real basada en Colecciones y Documentos:
  • Una Colección es un grupo de Documentos (ejemplo: colección 'usuarios').
  • Un Documento contiene pares clave-valor y puede contener subcolecciones.
  • Ofrece sincronización automática offline en dispositivos móviles y web.`
      }
    ],
    quiz: [
      {
        pregunta: "¿Qué campo garantiza la identidad única de cada registro en una tabla relacional?",
        opciones: ["Clave Foránea (FK)", "Clave Primaria (PK)", "Índice Temporal"],
        correcta: 1
      },
      {
        pregunta: "¿Qué comando SQL se utiliza para recuperar datos filtrados de una base de datos?",
        opciones: ["SELECT ... FROM ... WHERE", "GET ... IN ... FILTER", "EXTRACT ... AT ... COND"],
        correcta: 0
      },
      {
        pregunta: "¿Qué tipo de JOIN devuelve únicamente los registros que coinciden en ambas tablas?",
        opciones: ["FULL OUTER JOIN", "CROSS JOIN", "INNER JOIN"],
        correcta: 2
      },
      {
        pregunta: "¿Cómo organiza los datos una base de datos documental NoSQL como Firebase Firestore?",
        opciones: [
          "En Colecciones que contienen Documentos en formato tipo JSON",
          "En cintas magnéticas de solo lectura",
          "En hojas de cálculo sin claves ni tipos"
        ],
        correcta: 0
      },
      {
        pregunta: "¿Cuál es el principal beneficio de normalizar una base de datos relacional?",
        opciones: [
          "Aumentar el uso de disco duro innecesariamente",
          "Evitar la redundancia de datos y prevenir anomalías de inserción y borrado",
          "Eliminar la necesidad de usar contraseñas"
        ],
        correcta: 1
      }
    ]
  },

  // -------------------------------------------------------------------
  // 5. ARQUITECTURA DE APLICACIONES WEB
  // -------------------------------------------------------------------
  {
    id: "curso-app-web",
    titulo: "Arquitectura de Aplicaciones Web",
    icono: "⚙️",
    resumen: "Entiende cómo se diseñan aplicaciones escalables: separación Frontend-Backend, APIs RESTful, autenticación con JWT/OAuth, microservicios y despliegue en la nube.",
    lecciones: [
      {
        titulo: "Lección 1: Modelo Cliente-Servidor y Protocolo HTTP",
        texto: `Toda aplicación web se basa en la comunicación entre dos extremos independientes: el Cliente (Frontend) y el Servidor (Backend).

El Protocolo HTTP/HTTPS:
Protocolo sin estado (stateless) basado en peticiones (Requests) y respuestas (Responses).
  • Métodos HTTP Estándar:
    - GET: Solicitar lectura de información.
    - POST: Crear un nuevo recurso.
    - PUT / PATCH: Actualizar un recurso existente de forma total o parcial.
    - DELETE: Eliminar un recurso.

Códigos de Estado HTTP Esenciales:
  • 200 OK / 201 Created: Éxito en la operación.
  • 400 Bad Request: Error en los parámetros enviados por el cliente.
  • 401 Unauthorized / 403 Forbidden: Sin credenciales o permisos suficientes.
  • 404 Not Found: El recurso solicitado no existe.
  • 500 Internal Server Error: Fallo no controlado en el servidor.`
      },
      {
        titulo: "Lección 2: APIs RESTful y Formato JSON",
        texto: `REST (Representational State Transfer) es el estilo arquitectónico estándar para diseñar servicios web desacoplados.

Principios de una API REST:
  1. Uso de URIs orientadas a recursos sustantivos: /api/v1/estudiantes (no /api/obtenerEstudiantes).
  2. Uso estricto de métodos HTTP para las acciones (GET para listar, POST para guardar).
  3. Formato JSON (JavaScript Object Notation): Estándar ligero y legible para intercambio de datos.

Ejemplo de flujo:
El frontend envía una petición POST /api/usuarios con un cuerpo JSON conteniendo nombre y correo; el backend valida los datos, guarda en base de datos y responde con status 201 y el objeto creado con su ID.`
      },
      {
        titulo: "Lección 3: Seguridad, Autenticación y Despliegue Cloud",
        texto: `En aplicaciones modernas desacopladas, el servidor no almacena sesiones en memoria; utiliza mecanismos de autenticación basados en tokens.

Mecanismos de Autenticación:
  • JWT (JSON Web Tokens): Token firmado criptográficamente que contiene claims del usuario (id, rol, expiración).
  • OAuth 2.0: Estándar para inicio de sesión federado (Iniciar sesión con Google, GitHub, etc.).

Hosting y Computación en la Nube:
  • Servidores Tradicionales (VPS): Requieren configuración de Linux, Nginx y mantenimiento manual.
  • Serverless / Hosting Estático (Firebase Hosting, Netlify, Vercel): Despliegues automáticos distribuidos en una red CDN global con HTTPS garantizado.`
      }
    ],
    quiz: [
      {
        pregunta: "¿Qué método HTTP debe utilizarse para crear un nuevo recurso según los estándares REST?",
        opciones: ["GET", "POST", "FETCH"],
        correcta: 1
      },
      {
        pregunta: "¿Qué código de estado HTTP indica que el recurso solicitado no fue encontrado en el servidor?",
        opciones: ["200 OK", "500 Error", "404 Not Found"],
        correcta: 2
      },
      {
        pregunta: "¿Cuál es la principal ventaja de utilizar tokens JWT para autenticación?",
        opciones: [
          "Es una solución stateless (sin estado en servidor) que permite escalar horizontalmente sin compartir sesiones en memoria",
          "Convierte el código PHP en JavaScript automáticamente",
          "Impide que el usuario necesite contraseña"
        ],
        correcta: 0
      },
      {
        pregunta: "¿Por qué se utiliza JSON como formato estándar en las APIs modernas?",
        opciones: [
          "Porque es ligero, fácil de parsear en cualquier lenguaje y nativo en JavaScript",
          "Porque solo funciona en computadoras con Windows",
          "Porque cifra los datos sin necesidad de HTTPS"
        ],
        correcta: 0
      },
      {
        pregunta: "¿Qué componente de red global entrega los archivos estáticos desde el servidor más cercano al usuario?",
        opciones: ["CDN (Content Delivery Network)", "Cable coaxial", "Protocolo FTP"],
        correcta: 0
      }
    ]
  },

  // -------------------------------------------------------------------
  // 6. DESARROLLO DE APLICACIONES MÓVILES
  // -------------------------------------------------------------------
  {
    id: "curso-dev-movil",
    titulo: "Desarrollo de Aplicaciones Móviles",
    icono: "📱",
    resumen: "Conoce el ecosistema móvil: desarrollo nativo para Android (Kotlin) e iOS (Swift) frente a frameworks multiplataforma como React Native y Flutter.",
    lecciones: [
      {
        titulo: "Lección 1: Ecosistema Móvil y Enfoques de Desarrollo",
        texto: `El desarrollo de software móvil presenta retos únicos: recursos de batería limitados, variabilidad de tamaños de pantalla, conectividad intermitente y sensores de hardware.

Tres Enfoques de Desarrollo:
  1. Nativo: Código escrito en el lenguaje y SDK oficial de cada plataforma (Kotlin/Java en Android Studio, Swift en Xcode). Máximo rendimiento y acceso inmediato a nuevas APIs.
  2. Multiplataforma (Cross-Platform): Una única base de código que compila a código nativo en iOS y Android (React Native con JavaScript/TypeScript, Flutter con Dart).
  3. Web / PWA: Aplicación web responsiva instalable que aprovecha el motor del navegador.`
      },
      {
        titulo: "Lección 2: Ciclo de Vida de una App y Sensores",
        texto: `A diferencia de una computadora de escritorio donde múltiples ventanas coexisten, en el móvil el sistema operativo suspende o destruye apps en segundo plano para ahorrar energía.

Estados del Ciclo de Vida (Lifecycle):
  • Foreground (Primer plano): La app está visible e interactuando con el usuario.
  • Background (Segundo plano): El usuario cambió de app; las tareas pesadas deben pausarse.
  • Suspended / Destroyed: El sistema libera la memoria RAM si necesita recursos para una llamada o app activa.

Acceso a Hardware Móvil:
Las apps móviles pueden solicitar permisos de usuario para utilizar:
  • Geolocalización (GPS)
  • Cámara y Galería de Fotos
  • Notificaciones Push
  • Acelerómetro y Giroscopio`
      },
      {
        titulo: "Lección 3: Publicación y Optimización en Tiendas",
        texto: `Publicar una aplicación en Google Play Store o Apple App Store requiere cumplir con rigurosas políticas de calidad y seguridad.

Proceso de Distribución:
  1. Compilación del binario de producción (AAB para Android, IPA para iOS).
  2. Firma criptográfica con llave privada de desarrollador.
  3. Pruebas de Beta Cerrada / Abierta (TestFlight en iOS, Google Play Internal Testing).
  4. Optimización de Ficha (ASO - App Store Optimization): Capturas atractivas, descripción concisa y políticas de privacidad transparentes.`
      }
    ],
    quiz: [
      {
        pregunta: "¿Cuál es el lenguaje oficial y recomendado actualmente por Google para desarrollo Android nativo?",
        opciones: ["Kotlin", "Ruby", "Visual Basic"],
        correcta: 0
      },
      {
        pregunta: "¿Qué ventaja principal ofrece un framework multiplataforma como Flutter o React Native?",
        opciones: [
          "Permite mantener una única base de código para publicar en iOS y Android, reduciendo costos y tiempos",
          "Elimina la necesidad de diseñar interfaces",
          "Hace que la app no requiera internet nunca"
        ],
        correcta: 0
      },
      {
        pregunta: "¿Por qué el sistema operativo móvil suspende las aplicaciones que pasan a segundo plano?",
        opciones: [
          "Para optimizar el uso de memoria RAM y conservar la duración de la batería",
          "Porque ocurrió un virus en el sistema",
          "Para obligar al usuario a ver anuncios"
        ],
        correcta: 0
      },
      {
        pregunta: "¿Qué formato de empaquetado de aplicación moderno exige Google Play Store para subir nuevas apps?",
        opciones: ["Android App Bundle (.aab)", "Archivo ejecutable .exe", "Documento .pdf"],
        correcta: 0
      },
      {
        pregunta: "¿Qué mecanismo permite a una app móvil alertar al usuario incluso cuando la aplicación está completamente cerrada?",
        opciones: ["Notificaciones Push", "Alertas de CSS", "Cookies del navegador"],
        correcta: 0
      }
    ]
  },

  // -------------------------------------------------------------------
  // 7. DESARROLLO FRONTEND CON REACT
  // -------------------------------------------------------------------
  {
    id: "curso-react",
    titulo: "Desarrollo Frontend con React",
    icono: "⚛️",
    resumen: "Construye interfaces de usuario reactivas y componentes reutilizables con la librería líder de la industria: JSX, Hooks (useState, useEffect), Virtual DOM y Single Page Applications.",
    lecciones: [
      {
        titulo: "Lección 1: ¿Qué es React y el Virtual DOM?",
        texto: `React es una biblioteca de JavaScript declarativa y basada en componentes, creada por Meta para construir interfaces de usuario interactivas y escalables.

El Problema del DOM Tradicional:
Manipular el DOM real del navegador con JavaScript puro es una operación computacionalmente costosa y lenta cuando se realizan cientos de cambios por segundo.

La Solución: El Virtual DOM:
  1. React crea una copia ligera del DOM en memoria (Virtual DOM).
  2. Cuando el estado de la aplicación cambia, genera un nuevo árbol virtual.
  3. Mediante un algoritmo de reconciliación (Diffing), calcula la diferencia exacta entre ambos árboles.
  4. Solo aplica en el DOM real los nodos que verdaderamente cambiaron, logrando un rendimiento ultrasónico.`
      },
      {
        titulo: "Lección 2: Componentes, JSX y Props",
        texto: `En React, la interfaz se divide en piezas independientes y reutilizables llamadas Componentes.

Sintaxis JSX (JavaScript XML):
Extensión de sintaxis que permite escribir estructuras similares a HTML directamente dentro de funciones JavaScript:
  function TarjetaCurso({ titulo, lecciones }) {
    return (
      <div className="card">
        <h3>{titulo}</h3>
        <p>Total de lecciones: {lecciones}</p>
      </div>
    );
  }

Props (Propiedades):
Son argumentos que se pasan de componentes padres a hijos. Son estrictamente inmutables (de solo lectura).`
      },
      {
        titulo: "Lección 3: Hooks Esenciales: useState y useEffect",
        texto: `Los Hooks son funciones especiales introducidas en React 16.8 que permiten utilizar el estado y ciclo de vida en componentes funcionales sin usar clases.

Hook useState:
Permite almacenar y reaccionar a cambios de datos dentro del componente:
  const [contador, setContador] = useState(0);
  // Al invocar setContador(1), React vuelve a renderizar el componente.

Hook useEffect:
Gestiona efectos secundarios (Side Effects) como peticiones HTTP, suscripciones a eventos o manipulación manual del DOM:
  useEffect(() => {
    fetch('/api/cursos')
      .then(res => res.json())
      .then(data => setCursos(data));
  }, []); // El array vacío [] indica que se ejecuta solo al montar el componente.`
      }
    ],
    quiz: [
      {
        pregunta: "¿Qué es el Virtual DOM en React?",
        opciones: [
          "Un monitor de realidad virtual para programar",
          "Una representación ligera del DOM real en memoria utilizada para optimizar los cambios en la interfaz",
          "Una base de datos en la nube de Meta"
        ],
        correcta: 1
      },
      {
        pregunta: "¿Qué es JSX en el ecosistema de React?",
        opciones: [
          "Un compilador de base de datos SQL",
          "Una extensión de sintaxis que permite escribir elementos similares a HTML dentro de JavaScript",
          "Un protocolo de internet que reemplaza a HTTP"
        ],
        correcta: 1
      },
      {
        pregunta: "¿Cómo se pasan datos desde un componente padre hacia un componente hijo en React?",
        opciones: ["A través de Props (propiedades)", "Mediante variables globales en CSS", "Descargando un archivo .txt"],
        correcta: 0
      },
      {
        pregunta: "¿Qué Hook de React se utiliza para crear y actualizar variables de estado reactivas?",
        opciones: ["useState", "useDatabase", "useCompile"],
        correcta: 0
      },
      {
        pregunta: "¿Qué indica un arreglo de dependencias vacío [] como segundo argumento en useEffect?",
        opciones: [
          "Que el efecto se ejecutará únicamente una vez al montarse el componente",
          "Que el componente tiene un error de sintaxis",
          "Que el componente no se mostrará en pantalla"
        ],
        correcta: 0
      }
    ]
  },

  // -------------------------------------------------------------------
  // 8. CREACIÓN Y DESARROLLO DE VIDEOJUEGOS
  // -------------------------------------------------------------------
  {
    id: "curso-videojuegos",
    titulo: "Creación y Desarrollo de Videojuegos",
    icono: "🎮",
    resumen: "Adéntrate en la industria de los videojuegos: arquitectura del Game Loop, motores de desarrollo (Unity, Godot), física 2D/3D, colisiones y diseño de mecánicas de juego.",
    lecciones: [
      {
        titulo: "Lección 1: Arquitectura de un Motor y el Game Loop",
        texto: `A diferencia de una página web que espera eventos pasivos del usuario, un videojuego es una simulación en tiempo real continua.

El Bucle de Juego (Game Loop):
Se ejecuta entre 60 y 144 veces por segundo (FPS) en un ciclo infinito de tres fases:
  1. Process Input: Lee el estado del teclado, gamepad, ratón o pantalla táctil.
  2. Update Game State: Actualiza la posición de los personajes, inteligencia artificial, físicas y tiempo transcurrido (Delta Time).
  3. Render: Dibuja la escena resultante en la pantalla mediante la tarjeta gráfica (GPU).

Delta Time (Time.deltaTime):
Representa los segundos transcurridos entre el fotograma actual y el anterior. Multiplicar la velocidad por delta time asegura que el juego corra a la misma velocidad en una computadora potente que en una modesta.`
      },
      {
        titulo: "Lección 2: Física, Colisiones y Sistemas de Coordenadas",
        texto: `Para que un mundo virtual se sienta creíble, los motores de videojuegos incorporan motores de física (Physics Engines) integrados.

Conceptos Clave de Física:
  • RigidBody (Cuerpo Rígido): Componente que añade masa, gravedad, velocidad y fricción a un objeto virtual.
  • Colliders (Colisionadores): Formas geométricas invisibles (cajas, esferas, cápsulas) que detectan choques entre objetos.
  • Triggers (Disparadores): Colisionadores que no bloquean el paso físico pero detectan cuando un jugador entra a una zona (ejemplo: recoger una moneda o activar una trampa).

Detección de Colisiones:
El motor emite eventos como onCollisionEnter (choque físico con rebote) o onTriggerEnter (detección de zona).`
      },
      {
        titulo: "Lección 3: Motores Modernos: Unity, Godot y Diseño de Juego",
        texto: `Hoy en día los desarrolladores no programan motores desde cero; aprovechan motores consolidados de la industria:

Principales Motores de Desarrollo:
  • Godot Engine: Motor de código abierto, ligero, con excelente soporte para 2D y 3D utilizando GDScript y C#.
  • Unity: El motor más popular para juegos móviles y multiplataforma en C#.
  • Unreal Engine: Estándar para gráficos de alta fidelidad AAA con C++ y Blueprints.

Diseño de Mecánicas (Game Design):
  • Core Gameplay Loop: La acción repetitiva básica y divertida del jugador (ejemplo: apuntar, disparar, saquear).
  • Curva de Dificultad: Balance entre frustración y aburrimiento para mantener al jugador en estado de flujo (Flow).`
      }
    ],
    quiz: [
      {
        pregunta: "¿Cuáles son las tres etapas fundamentales del Bucle de Juego (Game Loop)?",
        opciones: [
          "Procesar Entrada (Input), Actualizar Estado (Update) y Dibujar en Pantalla (Render)",
          "Compilar, Imprimir y Apagar",
          "Crear Cuenta, Pagar Licencia y Reiniciar"
        ],
        correcta: 0
      },
      {
        pregunta: "¿Por qué es crucial multiplicar el movimiento por 'Delta Time' en los videojuegos?",
        opciones: [
          "Para que los personajes se muevan a la misma velocidad independientemente de los fotogramas por segundo (FPS) de la máquina",
          "Para aumentar la resolución gráfica de las texturas",
          "Para que el juego suene con mayor volumen"
        ],
        correcta: 0
      },
      {
        pregunta: "¿Qué componente de física dota a un objeto virtual de masa, gravedad y fuerzas?",
        opciones: ["RigidBody", "MeshRenderer", "CanvasScaler"],
        correcta: 0
      },
      {
        pregunta: "¿Qué diferencia a un Trigger de un Collider físico normal?",
        opciones: [
          "Un Trigger detecta el cruce de un objeto sin frenarlo físicamente, ideal para recoger ítems o activar eventos",
          "El Trigger solo funciona en juegos de terror",
          "El Collider siempre apaga el juego"
        ],
        correcta: 0
      },
      {
        pregunta: "¿Qué motor de videojuegos moderno es completamente libre, de código abierto y utiliza GDScript?",
        opciones: ["Godot Engine", "Adobe Flash", "Microsoft Word"],
        correcta: 0
      }
    ]
  }
];
