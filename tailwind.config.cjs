/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      sans: ['poppins', 'sans-serif'],
    },
    extend: {
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
