/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'nunito': ['Nunito', 'sans-serif'],
      },
      colors: {
        'custom-gray': '#636b6f',
      },
      screens: {
        'xs': {'max': '640px'},
        'xxs': {'max': '480px'},
        'xxxs': {'max': '375px'},
      },
    },
  },
  plugins: [],
}