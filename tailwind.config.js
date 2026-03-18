/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8'
        },
        secondary: {
          500: '#10B981',
          600: '#059669'
        },
        accent: {
          500: '#F59E0B',
          600: '#D97706'
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#6366F1'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
