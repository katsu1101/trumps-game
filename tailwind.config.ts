// tailwind.config.ts
export default {
  theme: {
    extend: {
      gridTemplateColumns: {
        13: 'repeat(13, minmax(0, 1fr))',
      },
    },
  },
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
};
