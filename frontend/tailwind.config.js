/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        med: {
          primary: "var(--primary)",
          accent: "var(--accent)",
          text: "var(--text)",
          muted: "var(--muted)",
          card: "var(--card)",
          card2: "var(--card2)",
          border: "var(--border)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Poppins", "Inter", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        med: "8px",
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
