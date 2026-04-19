/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
     fontFamily: {
      display: ['Poppins', 'sans-serif'],
      body: ['Poppins', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: '#111111',
          card:    '#1c1c1c',
          input:   '#1a1a1a',
          hover:   '#222222',
        },
      },
      animation: {
        'fade-in':  'fadeIn 0.4s ease forwards',
        'fade-up':  'fadeUp 0.45s ease forwards',
        'pulse-dot':'pulseDot 1.4s infinite ease-in-out',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' },                              to: { opacity: '1' } },
        fadeUp:  { from: { opacity: '0', transform: 'translateY(14px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseDot:{ '0%,80%,100%': { transform: 'scale(0)' }, '40%': { transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
}
