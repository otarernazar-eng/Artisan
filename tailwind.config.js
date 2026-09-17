/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        surface: '#111111',
        'surface-elevated': '#1C1C1E',
        primary: '#FFFFFF',
        'primary-hover': '#E5E5EA',
        secondary: '#333333',
        'text-primary': '#FFFFFF',
        'text-secondary': '#86868B',
        border: '#333336',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"Segoe UI"', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
