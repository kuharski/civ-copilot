module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#121212',         // Deep charcoal, but cleaner than pitch black
        surface: '#1f1f25',            // Slightly lifted for modern card contrast
        primary: '#f0b441',            // Vibrant gold with a touch of glow
        secondary: '#5b9bd5',          // Brighter steel blue (modern, accessible)
        accent: '#c87f4f',             // Refined bronze with warmth and clarity
        highlight: '#5fe0dc',          // Aqua-cyan pop (friendly, interactive)
        danger: '#ff5c40',             // Vivid terracotta-red for sharp alerts
        text: '#f5f5f5',               // Pureer light gray-white for better readability
        subtle: '#b0b0b0',             // More visible muted text (accessibility)
        border: '#2f2f2f',             // Soft but modern dividers
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
