module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dracula: {
          bg: "#282a36",
          fg: "#f8f8f2",
          comment: "#6272a4",
          cyan: "#8be9fd",
          green: "#50fa7b",
          orange: "#ffb86c",
          pink: "#ff79c6",
          purple: "#bd93f9",
          red: "#ff5555",
          yellow: "#f1fa8c",
        },
        monokai: {
          bg: "#272822",
          fg: "#f8f8f2",
          comment: "#75715e",
          cyan: "#66d9ef",
          green: "#a6e22e",
          orange: "#fd971f",
          pink: "#f92672",
          purple: "#ae81ff",
          red: "#f92672",
          yellow: "#e6db74",
        },
        "vscode-bg": "#000000", // Pure black for body background
        vscode: { // New VSCode specific palette
          bg: "#1e1e1e", // Editor background color (slightly off-black)
          fg: "#d4d4d4", // Editor foreground color
          keyword: "#569cd6", // Keywords (blue)
          string: "#ce9178", // Strings (orange)
          number: "#b5cea8", // Numbers (light green)
          comment: "#6a9955", // Comments (greenish gray)
          variable: "#9cdcfe", // Variables (light blue)
          function: "#dcdcaa", // Functions (yellowish)
        },
      },
      fontFamily: {
        mono: ["Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};
