import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './animations/**/*.{ts,tsx}',
    './store/**/*.{ts,tsx}',
    './services/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#0a0a0a',
        surface: '#121212',
        ivory: '#f4f0e8',
        stone: '#a39a8d',
        accent: '#cab79d',
        line: 'rgba(255,255,255,0.08)'
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)']
      },
      boxShadow: {
        soft: '0 30px 90px rgba(0, 0, 0, 0.22)'
      },
      backgroundImage: {
        glow: 'radial-gradient(circle at top, rgba(202, 183, 157, 0.16), transparent 45%)'
      },
      letterSpacing: {
        editorial: '0.22em'
      },
      animation: {
        shimmer: 'shimmer 1.75s linear infinite'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      }
    }
  },
  plugins: []
};

export default config;