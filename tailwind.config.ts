import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 80px rgba(56, 189, 248, 0.20)"
      }
    }
  },
  plugins: []
};

export default config;
