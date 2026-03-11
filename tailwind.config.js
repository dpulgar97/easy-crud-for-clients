/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Tu paleta personalizada (escala de azules)
        primary: {
          50: "#edf2fb", // El más claro (fondos)
          100: "#e2eafc",
          200: "#d7e3fc",
          300: "#ccdbfd",
          400: "#c1d3fe",
          500: "#b6ccfe",
          600: "#abc4ff", // El más intenso de tu lista
        },
        // Colores para acciones (suaves)
        success: {
          soft: "#86efac", // Verde suave para guardar/crear
          hover: "#4ade80", // Un poco más oscuro para hover
        },
        danger: {
          soft: "#fca5a5", // Rojo suave para eliminar
          hover: "#f87171", // Un poco más oscuro para hover
        },
      },
    },
  },
  plugins: [],
};
