import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ksk: {
          gold: "#D4A017",
          brown: "#8B4513",
          earth: "#C19A6B",
          dark: "#1a1a1a",
          cream: "#FFF8E7",
          green: "#2E7D32",
          red: "#C62828",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
export default config
