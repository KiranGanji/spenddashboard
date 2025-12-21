/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        ocean: {
          50: '#eaf2ff',
          100: '#d5e5ff',
          200: '#a7c4ff',
          300: '#78a3ff',
          400: '#4f86f7',
          500: '#2f6ae6',
          600: '#1e52c0',
          700: '#1a4298',
          800: '#193873',
          900: '#172f5e',
        },
        amber: {
          50: '#fff7e6',
          100: '#ffe6b3',
          200: '#ffd280',
          300: '#ffbe4d',
          400: '#ffad26',
          500: '#ff9800',
          600: '#db7a00',
          700: '#b75f00',
          800: '#924900',
          900: '#7a3b00',
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 35px rgba(15, 23, 42, 0.08)',
        inset: 'inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      },
    },
  },
  plugins: [],
}
