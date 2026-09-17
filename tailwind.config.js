/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#11A0AB', // primary vibrant turquoise from logo
          600: '#0E848D', // hover & focused turquoise
          700: '#0B6A71',
          800: '#085157',
          900: '#053A3E',
          pink: '#FD9AA7', // sweet blush pink from logo bird & scissors
          rose: '#F43F5E', // deeper rose accent
          blush: '#FFF1F2', // soft pastel pink background
          dark: '#18181B',
          charcoal: '#1C1E21',
          cream: '#FAFCFD',
          sand: '#E6F4F6',
          accent: '#11A0AB',
          gold: '#FD9AA7',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        script: ['"Caveat"', '"Dancing Script"', 'cursive'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(95, 63, 44, 0.08)',
        'card': '0 8px 30px -4px rgba(40, 36, 34, 0.12)',
        'nav': '0 -4px 25px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
