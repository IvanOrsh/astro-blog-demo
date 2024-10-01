import defaultTheme from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Cabin", ...defaultTheme.fontFamily.sans],
      },

      colors: {
        primary: colors.teal, // brand color (key visual)
        secondary: colors.zinc, // muted? for secondary
      },
    },
  },
  plugins: [],
};
