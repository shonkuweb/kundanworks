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
          50: '#FDF5F6',   // Soft blush/rose silk tint
          100: '#FBE8EC',  // Light rose petal
          200: '#F6CCD5',  // Delicate rose highlight
          300: '#EC9FB0',  // Rose petal
          400: '#D4526F',  // Vibrant rose/berry
          500: '#7A112A',  // PRIMARY: Royal Velvet Maroon from the Pooja Lace Hub hero banner
          600: '#640B20',  // Deep burgundy hover
          700: '#4F0718',  // Luxury wine title color
          800: '#390410',  // Dark espresso wine
          900: '#1C0207',  // Deep midnight velvet
          gold: '#D4AF37', // Antique 24k Royal Gold from hero banner lettering
          goldLight: '#F5E096',
          goldDark: '#9E7719',
          cream: '#FAF7F2',
          sand: '#F3EBE0',
          dark: '#18060B',  // Deep Velvet Obsidian for Admin Header
          charcoal: '#120407',
          accent: '#7A112A',
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
