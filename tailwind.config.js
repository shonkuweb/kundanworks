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
          50: '#FDF2F4',   // Very soft blush/rose tint
          100: '#FCE4E8',  // Light blush rose
          200: '#F9CCD4',  // Delicate rose
          300: '#F2A3B2',  // Rose petal
          400: '#DF5E79',  // Vibrant rose
          500: '#9B1B30',  // PRIMARY: Royal Crimson from the Radha Sang hero banner
          600: '#831427',  // Deep crimson hover
          700: '#6B0E1E',  // Luxury wine title color
          800: '#520916',  // Dark espresso wine
          900: '#38050E',  // Deep midnight wine
          gold: '#C5A059', // Antique warm gold from hero banner florals
          goldLight: '#E8CA8A',
          goldDark: '#967434',
          cream: '#FAF8F5',
          sand: '#F3ECE3',
          dark: '#221215',
          charcoal: '#1A0D10',
          accent: '#9B1B30',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        script: ['"Caveat"', '"Dancing Script"', 'cursive'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(155, 27, 48, 0.08)',
        'card': '0 8px 30px -4px rgba(34, 18, 21, 0.10)',
        'nav': '0 -4px 25px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
