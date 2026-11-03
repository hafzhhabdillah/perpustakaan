/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F5F7F1',
          100: '#E8EEE3',
          200: '#D1DDC9',
          300: '#A9BE9F',
          400: '#789B70',
          500: '#315C46',
          600: '#274C3A',
          700: '#203F32',
          800: '#1B352B',
          900: '#173F35',
        },
        neutral: {
          50: '#FAFBF8',
          100: '#F0F1EC',
          200: '#E3E6DE',
          300: '#C5CBC0',
          400: '#929B91',
          500: '#657064',
          600: '#414B43',
          700: '#29332C',
          800: '#1C261F',
          900: '#121A15',
        },
        accent: { 500: '#A6B98B' },
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
