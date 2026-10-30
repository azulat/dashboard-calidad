/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pareto: {
          navy: '#0B1B3D',
          navyLight: '#0F2042',
          navyMuted: '#1E325C',
          gold: '#C6922A',
          goldLight: '#D4A038',
          goldPale: '#FBF6EC',
          surface: '#F8FAFC',
        }
      },
      fontFamily: {
        serif: ['"Libre Baskerville"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'executive': '0 4px 20px -2px rgba(11, 27, 61, 0.05), 0 1px 3px 0 rgba(11, 27, 61, 0.03)',
        'navy-glow': '0 10px 30px -5px rgba(11, 27, 61, 0.25)',
      }
    },
  },
  plugins: [],
};
