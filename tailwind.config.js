/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF8C42',
          'light-blue': '#6FC2E4',
          'dark': '#1A1A1A',
          'light': '#6B7280',
          'navy': '#0F172A',
          'white': '#FFFFFF',
        },
      },
    },
  },
  plugins: [],
};