import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        deep: "#1a2010",
        forest: "#3a4a22",
        olive: "#4d5c2a",
        sage: "#7E8B78",
        mist: "#AFAB86",
        eucalyptus: "#97A284",
        stone: "#ABAC96",
        gold: "#B28E5E",
        "pale-gold": "#E7E0B4",
        cream: "#f0ede4",
        parchment: "#e8e3d8",
        "off-white": "#fafaf7",
      },
      fontFamily: {
        serif: ["Lorestta", "Georgia", "serif"],
        sans: ["Elms Sans", "system-ui", "sans-serif"],
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "fade-up": "fadeUp 0.6s ease forwards",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
