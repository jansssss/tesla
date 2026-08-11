/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brandRed: "#e31937",
        // 테슬라 공식 사이트 톤 — 화이트 배경 + 잉크 블랙 + 블루 액센트
        tesla: {
          ink: "#171a20",
          ink70: "#3c414a",
          blue: "#3457dc",
          blueDark: "#2a46b3",
          blueSoft: "#eef2ff",
          mist: "#f4f4f4",
          line: "#e3e5e8"
        }
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
