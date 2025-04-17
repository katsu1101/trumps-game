// tailwind.config.ts
const config = {
  theme: {
    extend: {
      gridTemplateColumns: {
        13: 'repeat(13, minmax(0, 1fr))',
      },
      screens: {
        'portrait': { 'raw': '(orientation: portrait)' },
        'landscape': { 'raw': '(orientation: landscape)' },
      },
    },
  },
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
};

export default config;
