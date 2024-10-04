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

      // TODO: figure out better color pallette
      colors: {
        primary: colors.teal, // brand color (key visual)
        secondary: colors.zinc, // muted? for secondary
        tertiary: colors.green, // is it?
      },

      aspectRatio: {
        thumbnail: "1.5", // height : width ratio
      },
    },
  },
  plugins: [],
};
