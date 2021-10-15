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
        1: "#1C1D20",
        2: "#2A2B2E",
        3: "#42454A",
        4: "#5F626A",
        5: "#878B96",
      },
      primary: {
        1: "#2E233C",
        2: "#402E57",
        3: "#553B76",
        4: "#754BAB",
        5: "#8547D3",
      },
      success: {
        1: "#25463A",
        2: "#37755F",
        3: "#42A582",
        4: "#4DCA9E",
        5: "#50D7A7",
      },
      danger: {
        1: "#462529",
        2: "#683038",
        3: "#96404C",
        4: "#CA4356",
        5: "#EB445C",
      },
    },
    extend: {
      height: {
        modal: "560px",
      },
      width: {
        modal: "700px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
