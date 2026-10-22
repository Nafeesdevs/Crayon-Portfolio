/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FFF7EA',
        cream: '#FBEFD9',
        ink: '#17151C',
        crayon: {
          red: '#FF5A5F',
          yellow: '#FFC93C',
          blue: '#3D7BFF',
          green: '#2EC4B6',
          purple: '#8B5CF6',
          pink: '#FF8FAB',
          orange: '#FF8A3D',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        hand: ['"Caveat"', 'cursive'],
        serif: ['"Instrument Serif"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        sticker: '4px 4px 0 0 #17151C',
        stickerLg: '8px 8px 0 0 #17151C',
        soft: '0 20px 60px -20px rgba(23,21,28,.35)',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        wiggle: { '0%,100%': { transform: 'rotate(-3deg)' }, '50%': { transform: 'rotate(3deg)' } },
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        spinSlow: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        'marquee-fast': 'marquee 18s linear infinite',
        wiggle: 'wiggle 2.5s ease-in-out infinite',
        floaty: 'floaty 5s ease-in-out infinite',
        'spin-slow': 'spinSlow 14s linear infinite',
      },
    },
  },
  plugins: [],
};
