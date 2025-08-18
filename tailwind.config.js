/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        vintageCream: "#f5f1e9",
        vintageBrown: "#8b5e3c",
        vintageGreen: "#7b9e89",
      },
      fontFamily: {
        serifVintage: ['"Dancing Script"', 'Noto Sans', 'system-ui', 'sans-serif'],
        //slogan: ["Lora", "cursive"],
        //serifVintage: ["Lora", "sans-serif"],  // fallback vintage
        //serifVintage: ["Georgia", "serif"],  // fallback vintage
      },
    },
  },
  plugins: [],
}
