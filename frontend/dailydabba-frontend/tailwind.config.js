/** DailyDabba design tokens. Change colours/shadows HERE and the whole app updates. */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"] },
      colors: {
        surface: "#F5F6F2",                                  // soft off-white page + card colour
        ink: { DEFAULT: "#2F3437", soft: "#667085" },        // dark grey text / muted text
        lime: { 100: "#EAF4C8", 400: "#B6D63A", 500: "#9DBF2B", 600: "#7F9F1F" }, // yellow-green accent
        danger: "#B4432F",                                   // errors only
      },
      boxShadow: {
        neu: "8px 8px 18px rgba(55,65,81,0.12), -8px -8px 18px rgba(255,255,255,0.9)",       // raised card
        "neu-sm": "4px 4px 10px rgba(55,65,81,0.12), -4px -4px 10px rgba(255,255,255,0.9)",   // raised button
        "neu-inset": "inset 4px 4px 10px rgba(55,65,81,0.10), inset -4px -4px 10px rgba(255,255,255,0.9)", // inputs
        "neu-inset-focus": "inset 5px 5px 12px rgba(55,65,81,0.16), inset -5px -5px 12px rgba(255,255,255,0.95)",
        "neu-pressed": "inset 3px 3px 8px rgba(55,65,81,0.16), inset -3px -3px 8px rgba(255,255,255,0.8)",
      },
    },
  },
  plugins: [],
};
