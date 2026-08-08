/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Work Sans", "sans-serif"]
      },
      colors: {
        paper: "#FDFBF7",
        surface: "#F5F2EB",
        ink: "#1C201F",
        muted: "#5C605E",
        green: "#2C4C3B",
        "green-dark": "#1E3629",
        gold: "#8C5A15",
        line: "#E8E3D9"
      },
      boxShadow: {
        editorial: "0 4px 20px rgba(44,76,59,0.08)"
      }
    }
  },
  plugins: []
};
