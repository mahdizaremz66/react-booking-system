/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        iran: ["IRANSansXFaNum", "Vazirmatn", "Tahoma", "Arial", "sans-serif"]
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
}

