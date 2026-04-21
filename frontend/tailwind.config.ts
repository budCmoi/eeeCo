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
        surface: '#111110',
        ivory: '#f5f5f0',
        stone: '#a39a8d',
        accent: '#cab79d',
        line: 'rgba(255,255,255,0.08)',
        // Nouvelle palette
        green: {
          DEFAULT: '#2d5a27',
          light: '#4a8f42',
          50: 'rgba(45,90,39,0.05)',
          100: 'rgba(45,90,39,0.1)',
          600: '#2d5a27',
          700: '#24471f'
        },
        brown: {
          DEFAULT: '#7a5c3f',
          light: '#a0795a',
          600: '#7a5c3f',
          700: '#614a32'
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)']
      },
      boxShadow: {
        soft: '0 30px 90px rgba(0, 0, 0, 0.22)',
        green: '0 0 24px rgba(45,90,39,0.35), 0 0 8px rgba(74,143,66,0.2)'
      },
      backgroundImage: {
        glow: 'radial-gradient(circle at top, rgba(45,90,39,0.18), transparent 50%)',
        'green-glow': 'radial-gradient(circle at 30% 0%, rgba(45,90,39,0.2), transparent 40%)'
      },
      letterSpacing: {
        editorial: '0.22em'
      },
      animation: {
        shimmer: 'shimmer 1.75s linear infinite',
        fadeIn: 'fadeIn 0.3s ease forwards',
        slideUp: 'slideUp 0.4s cubic-bezier(0.22,1,0.36,1) forwards'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem'
      }
    }
  },
  plugins: []
};

export default config;