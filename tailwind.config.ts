import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#F3F0E8',
          surface: '#FFFFFF',
          elevated: '#FAF8F5',
          recessed: '#EDE9E0',
          tinted: '#E8EBE2',
        },
        green: {
          50: '#E8EBE2',
          100: '#C5CCBA',
          200: '#A8B596',
          300: '#8A9A74',
          400: '#7A8E66',
          500: '#5E7048',
          600: '#4A5A3A',
          700: '#3A4830',
          800: '#2C3A2A',
          900: '#222E20',
        },
        water: {
          50: '#E3EEE8',
          300: '#8DBBA8',
          500: '#4A8B6E',
          700: '#2E6B50',
        },
        earth: {
          50: '#F3EDE5',
          300: '#C8B89E',
          500: '#8A7558',
          700: '#6B5A42',
        },
        rust: {
          50: '#F5E8E0',
          500: '#C4704A',
          700: '#8B4A2E',
        },
        danger: {
          DEFAULT: '#B5403A',
          light: '#F8ECEA',
        },
        whatsapp: '#25D366',
      },
      fontFamily: {
        display: ['"Averia Serif Libre"', 'Georgia', 'serif'],
        sans: ['Karla', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      fontSize: {
        display: ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        h1: ['1.5rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '700' }],
        h2: ['1.25rem', { lineHeight: '1.3', fontWeight: '400' }],
        h3: ['1.0625rem', { lineHeight: '1.4', fontWeight: '600' }],
        body: ['0.9375rem', { lineHeight: '1.6' }],
        sm: ['0.8125rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        xs: ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.02em' }],
        label: ['0.75rem', { lineHeight: '1.3', letterSpacing: '0.04em', fontWeight: '500' }],
      },
      boxShadow: {
        card: '0 1px 3px rgba(44,58,42,0.08)',
        float: '0 2px 8px rgba(44,58,42,0.08)',
        overlay: '0 4px 16px rgba(44,58,42,0.12)',
      },
    },
  },
  plugins: [],
}

export default config
