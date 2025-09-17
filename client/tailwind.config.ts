import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";
import typography from "@tailwindcss/typography";

type ThemeGetter = (path: string, defaultValue?: any) => string | number | undefined;

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        jsyellow: "#1560bd",
        jsblack: "#1C1C1C",
      },
      boxShadow: {
        jsshadow: "0px 18px 18px rgba(140, 140, 140, 0.09)",
      },
      dropShadow: {
        jsshadow: ["0 18px 18px rgba(140, 140, 140, 0.09)"],
      },

      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.5rem",
          md: "2rem",
          lg: "2.5rem",
          xl: "3rem",
          "2xl": "4rem",
          "3xl": "6rem",
          "4xl": "8rem",
        },
        screens: {
          sm: "100%",
          md: "100%",
          lg: "1240px",
          xl: "1440px",
          "2xl": "1720px",  
          "3xl": "2100px",   
          "4xl": "2560px",   
          "5xl": "3200px",  
        },
      },

      maxWidth: {
        "3xl": "1920px",
        "4xl": "2560px",
        "5xl": "3200px",
      },

      typography: (theme: ThemeGetter) => ({
        DEFAULT: {
          css: {
            fontSize: theme("fontSize.base"),
            "@screen xl": {
              fontSize: theme("fontSize.lg"),
            },
            "@screen 2xl": {
              fontSize: theme("fontSize.xl"),
            },
            "@screen 4xl": {
              fontSize: theme("fontSize.2xl"),
            },
          },
        },
      }),

      animation: {
        "fade-up": "fadeUp 0.5s ease-out forwards",
        fadeIn: "fadeIn 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(1rem)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      scale: {
        "102": "1.02",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui(), typography()],
};

export default config;
