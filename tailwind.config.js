/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'safe-b': 'env(safe-area-inset-bottom)',
        'safe-t': 'env(safe-area-inset-top)',
      },
      minHeight: {
        tap: '48px',
      },
      colors: {
        // Background & Surfaces (Jet Black)
        jet: {
          bg: '#050505',
          card: '#121212',
          surface: '#181818',
          border: '#242424',
          subtle: '#2E2E2E',
        },
        // Primary Brand & Accents (Cerulean Blue)
        cerulean: {
          DEFAULT: '#007BA7',
          hover: '#005C8A',
          light: '#0095CC',
          dark: '#004A70',
          subtle: 'rgba(0, 123, 167, 0.15)',
        },
        // Vibrant Highlights & Errors (Neon Rose)
        neonRose: {
          DEFAULT: '#FF007F',
          hover: '#D6006B',
          light: '#FF3399',
          dark: '#B30059',
          subtle: 'rgba(255, 0, 127, 0.15)',
        },
        brand: {
          DEFAULT: '#007BA7',
          hover: '#005C8A',
          accent: '#FF007F',
          accentHover: '#D6006B',
        },
      },
      boxShadow: {
        soft: '0 1px 3px 0 rgba(0, 0, 0, 0.6)',
        lifted: '0 4px 18px -2px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.06)',
        cerulean: '0 0 20px -2px rgba(0, 123, 167, 0.45)',
        neonRose: '0 0 20px -2px rgba(255, 0, 127, 0.45)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'flip-in': {
          '0%': { opacity: '0', transform: 'rotateY(40deg) scale(0.96)' },
          '100%': { opacity: '1', transform: 'rotateY(0) scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'flip-in': 'flip-in 0.4s ease-out both',
      },
    },
  },
  plugins: [],
};
