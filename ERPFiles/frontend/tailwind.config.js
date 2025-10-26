// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#2563EB',
        'light-gray': '#F3F4F6',
        'medium-gray': '#E5E7EB',
        'dark-text': '#1F2937',
        'secondary-text': '#6B7280',
      }
    },
  },
  plugins: [],
}