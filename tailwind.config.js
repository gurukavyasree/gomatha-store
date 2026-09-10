/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          800: '#7B1113',
          900: '#580A0B',
        },
        gold: {
          500: '#D4AF37',
          600: '#AA820A',
        },
      },
    },
  },
  plugins: [],
};
