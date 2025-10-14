// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'ui-sans-serif', 'system-ui'],
        serif: ['Playfair Display', 'ui-serif', 'Georgia'],
        poppins: ['Poppins', 'sans-serif'],
      },
       fontSize: {
        '32': '100px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
   
  ],
};
