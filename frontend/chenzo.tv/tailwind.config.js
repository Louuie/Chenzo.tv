module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
],
  theme: {
    extend: {
      animation: {
        fade: 'fadeOut 5s ease-in-out'
      },
      keyframes: theme => ({
        fadeOut: {
          '100%': { opacity: theme('colors.gray.100') },
          '0%': { opacity: theme('colors.transparent') }
        }
      })
    },
    fontSize: {
      'xs': '.75rem',
      'sm': '.875rem',
      'tiny': '.875rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
    }
  },
  plugins: [],
}
