module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#0f0f0f',          // Dark, modern base
        surface: '#1c1c1e',             // Elevated UI panels
        primary: '#d3a04d',             // Golden empire tone (Civ-inspired)
        secondary: '#476072',           // Steel blue (UI-friendly + tactical)
        accent: '#9c6644',              // Bronze (historic tone)
        highlight: '#4da8a9',           // Cyan green (modern interactive hint)
        danger: '#a64b2a',              // Terracotta red for alerts
        text: '#e2e2e2',                // Clean readable light text
        subtle: '#999999',              // Muted text/icons
        border: '#2a2a2a',              // Divider lines
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
