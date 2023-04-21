/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      sans: ['poppins', 'sans-serif'],
    },
    extend: {
      zIndex: {
        '10': '10',
      },
      inset : {
        '12%' : '12%',
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: false,
  },
}
