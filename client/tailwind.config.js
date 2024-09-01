module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], 
  theme: {
    extend: {
      colors: {
        white: "#fff",
        black: "#000",
        darkslategray: {
          100: "#424242",
          200: "#333",
        },
        lightgray: "#ccc",
      },
      spacing: {},
      fontFamily: {
        "space-grotesk": "'Space Grotesk'",
      },
    },
    fontSize: {
      base: "16px",
      sm: "14px",
      inherit: "inherit",
    },
    screens: {
      mq975: {
        raw: "screen and (max-width: 975px)",
      },
      mq950: {
        raw: "screen and (max-width: 950px)",
      },
      mq450: {
        raw: "screen and (max-width: 450px)",
      },
    },
  },
};
