/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        polar: {
          950: '#04070D',
          900: '#070D18',
          850: '#0B1424',
          800: '#0F1C33',
          700: '#172B4D',
          600: '#233F6E',
          ice: '#00F0FF',
          iceHover: '#38BDF8',
          aurora: '#10B981',
          violet: '#A855F7',
          amber: '#F59E0B',
          coral: '#F43F5E',
        },
        glacier: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E3A8A',
          900: '#0F172A',
          950: '#0B1320',
        }
      },
      fontFamily: {
        navbar: ['Urbanist', 'system-ui', 'sans-serif'],
        heading: ['Urbanist', 'sans-serif'],
        display: ['Syne', 'Urbanist', 'sans-serif'],
        body: ['Urbanist', 'sans-serif'],
        sans: ['Urbanist', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'aurora': 'aurora 10s ease infinite alternate',
      },
      keyframes: {
        aurora: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        }
      }
    },
  },
  plugins: [],
};
