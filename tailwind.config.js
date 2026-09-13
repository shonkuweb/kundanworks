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
          50: '#FAF8F5',
          100: '#F4ECE4',
          200: '#EAE0D4',
          300: '#DAC6B4',
          400: '#C5A68F',
          500: '#A77D5E', // primary warm terracotta / bronze
          600: '#926749',
          700: '#754E35',
          800: '#5F3F2C',
          900: '#4D3325',
          dark: '#1C1917',
          charcoal: '#282422',
          cream: '#F7F3EE',
          sand: '#EDE5DB',
          accent: '#A7734D',
          gold: '#C29864',
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
