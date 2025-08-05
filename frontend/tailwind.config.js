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
        'spin-fast': 'spin 0.3s linear infinite',
        'dice-bounce': 'dice-bounce 0.5s ease',
      },
      keyframes: {
        'dice-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
