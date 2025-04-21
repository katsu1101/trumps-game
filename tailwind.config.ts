// tailwind.config.ts
const config = {
  theme: {
    extend: {
      gridTemplateColumns: {
        13: 'repeat(13, minmax(0, 1fr))',
      },
      screens: {
        'portrait': {'raw': '(orientation: portrait)'},
        'landscape': {'raw': '(orientation: landscape)'},
      },
      keyframes: {
        'fade-in': {
          '0%': {opacity: 0},
          '100%': {opacity: 1},
        },
      },
      animation: {
        'fade-in': 'fade-in 1s ease-out forwards',
      },
    },
  },
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
};

export default config;
