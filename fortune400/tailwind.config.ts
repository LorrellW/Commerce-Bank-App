import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#3B49A4",
        secondary: "#DCE7F2",
        secondary2: "#83B9FF",
        darkText: "#4D4D4D",
        lightText:"#717171",
        

      },
    },
  },
  plugins: [],
} satisfies Config;
