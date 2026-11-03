/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F7F6F2',
          100: '#E6EFEA',
          200: '#D6E5E0',
          300: '#C5DBD5',
          400: '#B2D2CA',
          500: '#23856D',
          600: '#1E724F',
          700: '#18593D',
          800: '#0F3A27',
          900: '#172B3A',
        },
        neutral: {
          50: '#F4F5F2',
          100: '#E8E9E5',
          200: '#C5C8C6',
          300: '#A1ADB2',
          400: '#858D91',
          500: '#202B32',
          600: '#111A20',
          700: '#1B272F',
        },
        accent: {
          500: '#56B99A',
        },
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        editorial: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
};
