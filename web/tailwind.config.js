/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          50: '#edf5ee',
          100: '#c4dfc8',
          200: '#8cbf96',
          300: '#5a9e68',
          400: '#3a7a47',
          500: '#2e6038',
          600: '#265030',
          700: '#1f4028',
          800: '#1a3423',
          900: '#122318',
          950: '#0a1a0e',
        },
        cream: {
          100: '#faf8f2',
          200: '#f2ede0',
          300: '#e5dcc8',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(10, 26, 14, 0.08), 0 1px 3px rgba(10, 26, 14, 0.06)',
        'card-hover': '0 8px 32px rgba(10, 26, 14, 0.14), 0 2px 8px rgba(10, 26, 14, 0.08)',
        modal: '0 24px 64px rgba(10, 26, 14, 0.22)',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        xl: '24px',
      },
      animation: {
        fadeUp: 'fadeUp 0.5s ease-out forwards',
        shimmer: 'shimmer 2s infinite linear',
        spin: 'spin 1s linear infinite',
        leafSway: 'leafSway 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          'from': { opacity: '0', transform: 'translateY(16px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        leafSway: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
      },
    },
  },
  plugins: [],
}
