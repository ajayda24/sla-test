/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontSize: {
        "xs-ultra": "0.54rem",
      },
      maxWidth: {
        "xs-ultra": "14rem",
        xs: "17rem",
      },
      gridTemplateColumns: {
        "table-3": "minmax(50px, 60px) minmax(200px, 1fr) minmax(100px, 1fr)  ",
        "table-4":
          "minmax(50px, 60px) minmax(200px, 1fr) minmax(250px, 1fr) minmax(150px, 1fr) ",
        "table-5":
          "minmax(50px, 60px) minmax(200px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(180px, 1fr)",
        "table-6":
          "minmax(50px, 60px) minmax(50px, 100px) minmax(200px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(100px, 1fr)",
        "table-7":
          "minmax(50px, 60px) minmax(150px, 1fr) minmax(150px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(150px, 1fr) minmax(180px, 1fr)",
        "table-8":
          "minmax(50px, 60px) minmax(150px, 1fr) minmax(150px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(180px, 1fr)",
        "table-9":
          "minmax(50px, 60px) minmax(150px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(100px, 1fr) minmax(150px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr) minmax(50px, 1fr)",
        "table-project":
          "minmax(50px, 60px) minmax(150px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(50px, 1fr)",
        "table-company":
          "minmax(20px, 60px) minmax(100px, 150px) minmax(50px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr) minmax(180px, 1fr)",
        "table-quotation":
          "minmax(50px, 60px) minmax(100px, 1fr) minmax(200px, 1fr) minmax(110px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(100px, 1fr)",
        "table-contract":
          "minmax(50px, 60px) minmax(100px, 1fr) minmax(200px, 1fr) minmax(110px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) minmax(100px, 1fr)",
      },
      transitionProperty: {
        height: "height",
        width: "width",
      },
      colors: {
        black: "#231F20",
        dark: "#1A1B1E",
        dark2: "#2E3033",
        border: "#555555",
        red: "#CF2623",
        blue: "#272835",
        indigo: "#1E1F2C",
        gray: "#8B909A",
      },
    },
  },
  plugins: [require("daisyui")],

  // daisyUI config (optional)
  daisyui: {
    themes: [
      {
        default: {
          primary: "#570df8",
          secondary: "#f000b8",
          accent: "#1dcdbc",
          neutral: "#2b3440",
          "base-100": "#ffffff",
          info: "#3abff8",
          success: "#36d399",
          warning: "#fbbd23",
          error: "#CF2623",
        },
      },
    ],
  },
};
