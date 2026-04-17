/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff006e',
        'primary-dark': '#c7004a',
        secondary: '#00d9ff',
        accent: '#05ffa1',
        dark: '#0f1419',
        darker: '#0a0d11',
        surface: '#1a1f2e',
        'surface-light': '#252d3d',
        border: '#3a4454',
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s infinite',
        'pulse-warning': 'pulse-warning 1s infinite',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        'pulse-warning': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
      },
    },
  },
  plugins: [],
}

