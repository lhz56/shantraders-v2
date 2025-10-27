/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      colors: {
        brand: {
          50: "#edf7ff",
          100: "#d7ebff",
          200: "#b9dbff",
          300: "#8fc2ff",
          400: "#64a5ff",
          500: "#3a87ff",
          600: "#1c67f1",
          700: "#134fd0",
          800: "#1241a4",
          900: "#122f74",
        },
      },
      boxShadow: {
        card: "0 18px 40px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
