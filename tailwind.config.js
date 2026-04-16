/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#C8A97E",
        "gold-dark": "#9a7a55",
        "bg-dark": "#0d0b08",
        "bg-panel": "#161310",
        "bg-card": "#1f1a14",
      },
      fontFamily: {
        arabic: ["Amiri", "serif"],
        english: ["Cormorant Garamond", "serif"],
      },
    },
  },
  plugins: [],
};
