/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Color de acento principal (inspirado en la referencia)
        accent: {
          DEFAULT: "#0077b6", // Tu azul principal
          hover: "#023e8a",
          light: "#e0f2fe", // Fondo muy suave para estados activos
        },
        // Fondos neutros
        background: {
          main: "#f8f9fa", // Gris muy claro para el fondo general
          card: "#ffffff", // Blanco puro para tarjetas y sidebar
        },
        // Texto
        text: {
          primary: "#1e293b", // Gris oscuro para títulos
          secondary: "#64748b", // Gris medio para descripciones
          muted: "#94a3b8", // Gris claro para placeholders
        },
        // Acciones (solo los necesarios)
        success: "#22c55e",
        danger: "#ef4444",
      },
      boxShadow: {
        soft: "0 1px 3px rgba(0,0,0,0.05)",
        card: "0 1px 3px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
