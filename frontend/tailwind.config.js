/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060A13',
          900: '#0B1120',
          850: '#0F172A',
          800: '#15213D',
          700: '#1E2F54',
          600: '#2C4375',
        },
        brand: {
          teal: '#06b6d4',
          emerald: '#10b981',
          cyan: '#22d3ee',
        }
      }
    },
  },
  plugins: [],
}
