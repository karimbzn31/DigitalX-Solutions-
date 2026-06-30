import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#06040D",
        surface: "#110D1F",
        "surface-soft": "#181230",
        violet: "#7C5CFF",
        magenta: "#C45CFF",
        rose: "#FF6FB8",
        "cyan-soft": "#5CC9FF",
        "star-white": "#F4F1FA",
        mist: "#9C93B8",
        accent: "#7C5CFF",
        "accent-2": "#C45CFF",
        background: "#06040D",
        foreground: "#F4F1FA",
        subtle: "#9C93B8",
        muted: "rgba(124, 92, 255, 0.08)",
        border: "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.75rem",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        "drift": "drift 20s ease-in-out infinite",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(30px, -20px)" },
        },
      },
      backgroundImage: {
        "nebula-gradient": "linear-gradient(135deg, #7C5CFF 0%, #C45CFF 50%, #FF6FB8 100%)",
        "nebula-glow": "radial-gradient(ellipse at center, rgba(124,92,255,0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        "nebula": "0 20px 60px rgba(124,92,255,0.15)",
        "nebula-glow": "0 0 40px rgba(124,92,255,0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
