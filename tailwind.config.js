/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "gradient-start": "#6366f1",
        "gradient-mid": "#8b5cf6",
        "gradient-end": "#d946ef",
        "dark-bg": "#121212",
        "dark-surface": "#1e1e1e",
        "dark-card": "#242424",
        "dark-border": "#333333",
        "dark-text": "#e0e0e0",
        "dark-muted": "#888888",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-diagonal":
          "linear-gradient(to right bottom, var(--tw-gradient-stops))",
        "gradient-shine":
          "linear-gradient(45deg, rgba(255,255,255,0) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 55%, rgba(255,255,255,0) 100%)",
      },
      animation: {
        shine: "shine 1.5s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 3s ease-in-out infinite",
        gradient: "gradient 8s linear infinite",
      },
      keyframes: {
        shine: {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
    },
  },
  plugins: [],
};
