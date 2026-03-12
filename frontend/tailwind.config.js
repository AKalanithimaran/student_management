/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        primary: '#2563EB',
        primaryHover: '#1D4ED8',
        secondary: '#0EA5E9',
        surface: '#F1F5F9',
        card: '#FFFFFF',
        border: '#CBD5E1',
        text: '#1E293B',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#DC2626'
      },
      boxShadow: {
        soft: '0 14px 32px -18px rgba(15, 23, 42, 0.35)',
        card: '0 12px 28px -20px rgba(15, 23, 42, 0.35)'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
