/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brandRed: "#e31937"
      },
      fontFamily: {
        sans: ["Noto Sans KR", "Segoe UI", "sans-serif"],
        logo: ["Orbitron", "Noto Sans KR", "sans-serif"]
      },
      boxShadow: {
        'lg': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
      }
    }
  },
  plugins: []
};
