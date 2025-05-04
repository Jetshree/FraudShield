/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6EBF5',
          100: '#C4D1E7',
          200: '#9DB3D9',
          300: '#7595CB',
          400: '#4E77BD',
          500: '#2659AF',
          600: '#0A2463', // main primary
          700: '#081D50',
          800: '#06163D',
          900: '#04102A',
        },
        secondary: {
          50: '#E8F9FA',
          100: '#C5F0F2',
          200: '#9EE7EA',
          300: '#77DEE2',
          400: '#50D5DA',
          500: '#29CCD2',
          600: '#22A8AD',
          700: '#1A8489',
          800: '#136064',
          900: '#0B3C40',
        },
        alert: {
          50: '#FCEBEC',
          100: '#F8CDD0',
          200: '#F1A8AE',
          300: '#EB838B',
          400: '#E55E69',
          500: '#E84855', // main alert
          600: '#BA3A44',
          700: '#8B2B33',
          800: '#5D1D22',
          900: '#2E0E11',
        },
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Lexend', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        dropdown: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}