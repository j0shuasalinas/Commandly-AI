/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dfe9ff',
          200: '#c6d7ff',
          300: '#9eb9ff',
          400: '#6d91ff',
          500: '#4a6fff',
          600: '#3453f4',
          700: '#2d43e0',
          800: '#2a39b5',
          900: '#29358f',
        },
        accent: {
          100: '#f2ebff',
          200: '#e5d6ff',
          300: '#d1b2ff',
          400: '#b787ff',
          500: '#9b5cff',
        },
        ink: '#081120',
      },
      boxShadow: {
        glow: '0 20px 60px rgba(74, 111, 255, 0.18)',
        card: '0 16px 40px rgba(15, 23, 42, 0.08)',
        darkcard: '0 18px 48px rgba(2, 6, 23, 0.45)',
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at top left, rgba(74,111,255,0.18), transparent 30%), radial-gradient(circle at top right, rgba(155,92,255,0.16), transparent 24%), linear-gradient(to bottom right, rgba(255,255,255,0.96), rgba(244,247,255,0.92))',
        'hero-grid-dark':
          'radial-gradient(circle at top left, rgba(74,111,255,0.22), transparent 28%), radial-gradient(circle at top right, rgba(155,92,255,0.18), transparent 24%), linear-gradient(to bottom right, rgba(5,10,20,0.96), rgba(11,18,32,0.94))',
      },
    },
  },
  plugins: [],
}
