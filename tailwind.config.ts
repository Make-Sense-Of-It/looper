/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
        background: "var(--background)",
        foreground: "var(--foreground)",
        bronze: {
          1: "var(--bronze-1)",
          2: "var(--bronze-2)",
          3: "var(--bronze-3)",
          4: "var(--bronze-4)",
          5: "var(--bronze-5)",
          6: "var(--bronze-6)",
          7: "var(--bronze-7)",
          8: "var(--bronze-8)",
          9: "var(--bronze-9)",
          10: "var(--bronze-10)",
          11: "var(--bronze-11)",
          12: "var(--bronze-12)",
        },
        gray: {
          1: "var(--mauve-1)",
          2: "var(--mauve-2)",
          3: "var(--mauve-3)",
          4: "var(--mauve-4)",
          5: "var(--mauve-5)",
          6: "var(--mauve-6)",
          7: "var(--mauve-7)",
          8: "var(--mauve-8)",
          9: "var(--mauve-9)",
          10: "var(--mauve-10)",
          11: "var(--mauve-11)",
          12: "var(--mauve-12)",
        },
      },
      typography: (theme: (arg0: string) => any) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.700"),
            p: {
              marginTop: "0em",
              fontSize: "1.1em",
              lineHeight: "1.6em",
            },
            h1: {
              color: theme("colors.gray.900"),
              fontWeight: "200",
              marginBottom: "0.1em",
              fontSize: "2.2em",
            },
            h2: {
              color: theme("colors.gray.900"),
              marginBottom: "0.1em",
            },
            h3: {
              color: theme("colors.gray.900"),
              marginBottom: "0.1em",
            },
            h4: {
              color: theme("colors.gray.900"),
              marginBottom: "0.1em",
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
