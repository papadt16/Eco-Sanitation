/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Core brand — deep eco-green, used for primary actions & branding
        brand: {
          50: '#eafaf1',
          100: '#cdf0dd',
          200: '#9ce0bc',
          300: '#63c895',
          400: '#33ac74',
          500: '#18915c',
          600: '#0f744a',
          700: '#0d5c3d',
          800: '#0c4a33',
          900: '#0a3c2b',
          950: '#052117',
        },
        // Industrial slate — chrome, structure, panels
        slate: {
          850: '#172033',
          925: '#0d1420',
        },
        // Semantic telemetry states
        status: {
          normal: '#22c55e',
          warning: '#f59e0b',
          critical: '#ef4444',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        panel: '0 1px 2px 0 rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04)',
        glow: '0 0 24px -6px rgba(24,145,92,0.55)',
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)',
      },
      keyframes: {
        rise: {
          '0%': { height: '0%' },
          '100%': { height: 'var(--fill-height)' },
        },
        pulseRing: {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '0.15', transform: 'scale(1.15)' },
        },
      },
      animation: {
        rise: 'rise 1.1s cubic-bezier(0.22, 1, 0.36, 1)',
        pulseRing: 'pulseRing 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
