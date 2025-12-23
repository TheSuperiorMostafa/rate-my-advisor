import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#5B2D8B", // Plum
          dark: "#4A2375", // Primary hover
          light: "#F5F0FF", // Primary soft background
        },
        accent: {
          DEFAULT: "#A78BFA", // Lavender
          dark: "#8B5CF6", // Accent hover
        },
        success: {
          DEFAULT: "#16A34A",
        },
        warning: {
          DEFAULT: "#F59E0B",
        },
        danger: {
          DEFAULT: "#DC2626",
        },
        purple: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#5B2D8B", // Primary
          800: "#4A2375", // Primary hover
          900: "#581c87",
        },
        violet: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa", // Accent
          500: "#8b5cf6", // Accent hover
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
