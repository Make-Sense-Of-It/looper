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
      },
      typography: (theme: (arg0: string) => any) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            p: {
              marginTop: '0em',
              fontSize: '1.1em',
              lineHeight: '1.6em'
            },
            h1: {
              color: theme('colors.gray.900'),
              fontWeight: '200',
              marginBottom: '0.1em',
              fontSize: '2.2em'
            },
            h2: {
              color: theme('colors.gray.900'),
              marginBottom: '0.1em',
            },
            h3: {
              color: theme('colors.gray.900'),
              marginBottom: '0.1em',
            },
            h4: {
              color: theme('colors.gray.900'),
              marginBottom: '0.1em',
            }
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
