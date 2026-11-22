import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Fredoka", "Plus Jakarta Sans", "Poppins", "sans-serif"],
        body: ["Poppins", "Inter", "sans-serif"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // Color palette matching the presentation slide (media_1795370318775_6dbb03a6.jpg)
        // Deep burgundy / maroon primary, warm cream linen background, and soft terracotta accents
        brand: {
          pink: "#7A1D2E", // Signature Deep Burgundy / Wine (Primary Brand & CTA)
          pinkLight: "#FCEEEB", // Soft warm peach/rose icon container
          pinkHover: "#661423", // Darker rich wine hover
          purple: "#8A2232", // Warm rich maroon / secondary
          purpleLight: "#FDF5F2", // Linen / warm cream
          purpleHover: "#6E1826",
          burgundy: "#7A1D2E",
          maroon: "#801D30",
          terracotta: "#C46874",
          cream: "#FAF4F0",
          linen: "#FDF8F5",
          blush: "#FCEEEB",
          cardBorder: "#F2E2DD",
        },
        lofee: {
          bg: "#FAF4F0", // Warm cream linen canvas from slide
          card: "#FFFFFF",
          text: "#361118", // Deep warm espresso burgundy for titles
          muted: "#7A5A62", // Warm muted taupe for secondary text
          border: "#F2E2DD", // Subtle warm rose-sand border
          peach: "#FCEEEB",
          mint: "#EBF5F0",
          yellow: "#FDF4DE",
          sky: "#F4EFEA",
        },
        forest: {
          DEFAULT: "#7A1D2E", // Map tokens to Deep Burgundy
          dark: "#661423",
          light: "#FCEEEB",
          muted: "#7A5A62",
        },
        sage: {
          DEFAULT: "#8A2232", // Map tokens to Warm Maroon
          dark: "#6E1826",
          light: "#FDF5F2",
          soft: "#FAF4F0",
        },
        coral: {
          DEFAULT: "#7A1D2E",
          dark: "#661423",
          light: "#FCEEEB",
        },
        sand: {
          DEFAULT: "#7A5A62",
          light: "#FAF4F0",
          amber: "#FDF4DE",
        },
        pastel: {
          peach: "#FCEEEB",
          peachText: "#7A1D2E",
          blue: "#FDF5F2",
          blueText: "#8A2232",
          purple: "#FAF0ED",
          purpleText: "#7A1D2E",
          mint: "#EBF5F0",
          mintText: "#1F7A65",
          yellow: "#FEF9C3",
          yellowText: "#854D0E",
        },
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(34, 63, 54, 0.06)",
        card: "0 2px 12px -2px rgba(34, 63, 54, 0.05)",
        float: "0 12px 36px -4px rgba(34, 63, 54, 0.16)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
