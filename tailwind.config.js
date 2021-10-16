const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ["Barlow", ...defaultTheme.fontFamily.sans],
    },
    colors: {
      white: "#fff",
      black: "#000",
      gray: {
        DEFAULT: "#2D2D2F",
        50: "#B6B6B9",
        100: "#A7A7AA",
        200: "#87878C",
        300: "#69696E",
        400: "#4B4B4E",
        500: "#2D2D2F",
        600: "#262627",
        700: "#1E1E1F",
        800: "#171718",
        900: "#0F0F10",
      },
      primary: {
        DEFAULT: "#754BAB",
        50: "#EDE7F4",
        100: "#E0D5ED",
        200: "#C5B2DD",
        300: "#AA8ECE",
        400: "#8F6BBE",
        500: "#754BAB",
        600: "#5D3B88",
        700: "#442C64",
        800: "#2C1C41",
        900: "#140D1D",
      },
      success: {
        DEFAULT: "#4DCA9E",
        50: "#FEFFFE",
        100: "#EAF9F4",
        200: "#C3EDDE",
        300: "#9CE1C9",
        400: "#74D6B3",
        500: "#4DCA9E",
        600: "#34B084",
        700: "#298867",
        800: "#1D6149",
        900: "#113A2C",
      },
      danger: {
        DEFAULT: "#CA4356",
        50: "#FCF6F7",
        100: "#F7E2E5",
        200: "#ECBAC1",
        300: "#E0939E",
        400: "#D56B7A",
        500: "#CA4356",
        600: "#AA3041",
        700: "#822532",
        800: "#5A1A23",
        900: "#330E13",
      },
    },
    extend: {
      height: {
        modal: "600px",
      },
      width: {
        modal: "800px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
