// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        bounceSlow: 'bounce 2.5s infinite',
      },
    },
  },
  plugins: [],
};