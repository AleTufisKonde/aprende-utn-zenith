export function traducir(codigo) {
  const mensajes = {
    "auth/invalid-credential":      "Correo o contraseña incorrectos.",
    "auth/user-not-found":          "No existe una cuenta con ese correo.",
    "auth/wrong-password":          "Contraseña incorrecta.",
    "auth/email-already-in-use":    "Ese correo ya está registrado.",
    "auth/weak-password":           "La contraseña debe tener al menos 6 caracteres.",
    "auth/invalid-email":           "El correo no es válido.",
    "auth/network-request-failed":  "Sin conexión a internet.",
    "auth/too-many-requests":       "Demasiados intentos. Espera un momento.",
    "auth/operation-not-allowed":   "Inicio de sesión no habilitado. Contacta al administrador.",
    "auth/unauthorized-domain":     "Dominio no autorizado en Firebase. Revisa la configuración."
  };
  return mensajes[codigo] || "Ocurrió un error: " + codigo;
}
