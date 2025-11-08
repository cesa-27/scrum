/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
,
  ],
  theme: {
    extend: {
      colors: {
        // Fondos
        'page-bg': '#F8FAFC', // Fondo muy claro de la página
        'card-bg': '#FFFFFF', // Fondo de las tarjetas

        // Grises para texto y bordes
        'text-header-dark': '#1A202C', // Títulos principales (Bienvenido)
        'text-title': '#2D3748', // Títulos de sección (Tu progreso, Actividad)
        'text-body': '#4A5568', // Texto principal (descripciones, valores pequeños)
        'text-meta': '#718096', // Texto de metadatos (fechas, ejes de gráfico)
        'border-light': '#E2E8F0', // Bordes de tarjetas y cuadrículas de gráfico
        
        // Colores de acento y sus fondos muy claros
        'accent-blue': '#3B82F6', // Azul para progreso general, línea de gráfico
        'accent-blue-soft': '#EBF5FF', // Fondo suave para ícono azul
        'accent-green': '#48BB78', // Verde para promedio quizzes, barras de gráfico
        'accent-green-soft': '#E6FFFA', // Fondo suave para ícono verde
        'accent-orange': '#ED8936', // Naranja para tiempo de estudio
        'accent-orange-soft': '#FFF1E5', // Fondo suave para ícono naranja
        'accent-purple': '#9F7AEA', // Púrpura para medallas
        'accent-purple-soft': '#F0EAFB', // Fondo suave para ícono púrpura
      },
      boxShadow: {
        // Sombra de tarjeta muy sutil y específica de la imagen
        'card-subtle': '0px 1px 2px rgba(0, 0, 0, 0.05), 0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
      },
      fontFamily: {
        // La imagen usa una fuente sans-serif limpia y moderna, como Inter o Open Sans.
        // Si no tienes una fuente específica configurada, la sans-serif de Tailwind funciona bien.
        // Para ser 100% idéntico, deberías integrar una fuente como 'Inter' desde Google Fonts.
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      }
    },
  },
  plugins: [],
}