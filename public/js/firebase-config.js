import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// Configuración de Firebase para Aprende UTN - Zenith
const firebaseConfig = {
  apiKey: "AIzaSyDvW3QPceCOyWJpKF_HIXsH7TKk674bJC4",
  authDomain: "aprende-utn-zenith.firebaseapp.com",
  projectId: "aprende-utn-zenith",
  storageBucket: "aprende-utn-zenith.firebasestorage.app",
  messagingSenderId: "500653661585",
  appId: "1:500653661585:web:1d48c166922e5435318e30"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
