/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAF6EF",
        "paper-dark": "#F0E9DC",
        ink: "#1C2B39",
        "ink-light": "#4A5B6B",
        rust: "#C4573B",
        "rust-light": "#F3DED6",
        moss: "#3B7A57",
        "moss-light": "#DCE9E0",
        gold: "#E8B23D",
        line: "#D8CFBE",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        mono: ["Space Mono", "monospace"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};