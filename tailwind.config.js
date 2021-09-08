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
      'dark-gray': '#303136',
      'vdark-gray': '#2a2b2f'
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
  plugins: [],
}
