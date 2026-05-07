/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          primary: '#1351B4',
          secondary: '#071D41',
          accent: '#2670E8',
          success: '#168821',
          warning: '#FFCD07',
          danger: '#E52207',
          neutral: '#F8F8F8',
          text: '#333333'
        },
        score: {
          excelente: '#168821',
          bom: '#2670E8',
          regular: '#FFCD07',
          ruim: '#E52207',
          critico: '#cc0000'
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
