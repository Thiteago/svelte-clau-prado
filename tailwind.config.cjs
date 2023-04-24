/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl' : '1280px',
      '2xl' : '1536px',
      '3xl' : '1920px',
      '4xl' : '2560px',
    },
    fontFamily: {
      sans: ['poppins', 'sans-serif'],
    },
    extend: {
      inset : {
        '12%' : '12%',
      },
      gap: {
        '0.5' : '0.125rem',
      },

    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: false,
  },
}
