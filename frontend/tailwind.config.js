// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["'Nunito'", "sans-serif"],
      },
      animation: {
        bounceSlow: 'bounce 2.5s infinite',
      },
    },
  },
  plugins: [],
};
