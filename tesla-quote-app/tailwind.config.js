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
      }
    }
  },
  plugins: []
};
