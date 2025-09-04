/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(220, 20%, 10%)',
        accent: 'hsl(180, 70%, 50%)',
        primary: 'hsl(220, 85%, 45%)',
        surface: 'hsl(220, 20%, 15%)',
      },
      borderRadius: {
        'lg': '20px',
        'md': '12px',
        'sm': '6px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
      },
      boxShadow: {
        'card': '0px 4px 16px hsla(220, 20%, 10%, 0.2)',
        'hover': '0px 8px 24px hsla(180, 70%, 50%, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'scale-in': 'scaleIn 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}