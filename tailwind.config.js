module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    backgroundColor: theme => ({
      ...theme('colors'),
      'primary': '#37393e',
      'secondary': '#313338',
      'third': '#232427',
      'button': '#576aea',
      'vlight-gray': '#4F555C',
      'light-gray': '#36393F',
      'dark-gray': '#303136',
      'vdark-gray': '#2a2b2f',
      'vvdark-gray': '#202225',
     }),
     borderColor: theme => ({
      ...theme('colors'),
      'primary': '#37393e'
     }),
     fontFamily: {
      'sans': ['"Helvetica"', 'sans-serif']
     },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
