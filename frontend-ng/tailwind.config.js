/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,scss}'],
  theme: {
    extend: {
      colors: {
        brand: {
          accent: '#C2C85B',
          'accent-light': '#D4DA6F',
          'accent-dark': '#A8AE48',
          dark: '#080808',
          surface: '#0F0F0F',
          card: '#161616',
          border: '#1E1E1E',
          'border-light': '#2C2C2C',
          muted: '#5A5A5A',
          light: '#F0EFE8',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        relicta: ['Relicta Light', 'Relicta', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Relicta Light', 'Cormorant Garamond', 'Georgia', 'serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'slide-in-left': 'slideInLeft 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'line-grow': 'lineGrow 1.2s ease forwards',
        'text-reveal': 'textReveal 0.9s cubic-bezier(0.16,1,0.3,1) forwards',
        'blur-in': 'blurIn 0.7s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(194, 200, 91, 0.15)' },
          '50%': { boxShadow: '0 0 50px rgba(194, 200, 91, 0.35)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        lineGrow: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        textReveal: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blurIn: {
          '0%': { opacity: '0', filter: 'blur(10px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glow: '0 0 40px rgba(194, 200, 91, 0.3)',
        'glow-sm': '0 0 20px rgba(194, 200, 91, 0.18)',
        'glow-lg': '0 0 80px rgba(194, 200, 91, 0.2)',
        card: '0 4px 32px rgba(0, 0, 0, 0.6)',
        'card-hover': '0 12px 60px rgba(0, 0, 0, 0.8)',
        inner: 'inset 0 1px 0 rgba(255,255,255,0.04)',
      },
      letterSpacing: {
        widest2: '0.25em',
        widest3: '0.35em',
      },
    },
  },
  plugins: [],
}


