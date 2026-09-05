/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mali: {
          green: '#1B6E3F',
          yellow: '#FCD116',
          red: '#E53935',
          copper: '#CC5500',
          beige: '#F5F0E1',
          text: '#333333',
        },
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#1B6E3F',
          600: '#165a35',
          700: '#11462c',
          900: '#0a2e1a',
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'Open Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Open Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
