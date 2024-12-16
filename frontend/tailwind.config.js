/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'canal-blue': '#2463EB',
        'major-blue': '#2463EB',
        'minor-white': '#FFFFFF',
        'minor-gray': '#9BA3AF',
        'component-navy': '#1F2937',
        'component-navy-hover': '#374151',
        'component-gray': '#9BA3AF'
      },
      fontFamily: {
        ubuntu: ['Ubuntu', 'sans-serif'],
      },
    },
  },
  plugins: [],
}