/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        'sharpie': ['Permanent Marker', 'cursive'],
        'hand': ['Patrick Hand', 'cursive'],
      },
      colors: {
        'soft-white': '#f8f9fa',
        'warm-white': '#f5f5f5',
        'soft-gray': '#e9ecef',
        'medium-gray': '#6c757d',
        'dark-gray': '#495057',
        'soft-black': '#1a1a1a',
        'warm-black': '#2d2d2d',
        'accent-blue': '#4a9eff',
        'accent-purple': '#8b5cf6',
        'soft-bg': 'rgba(255, 255, 255, 0.05)',
        'medium-bg': 'rgba(255, 255, 255, 0.08)',
        'soft-border': 'rgba(255, 255, 255, 0.15)',
        'medium-border': 'rgba(255, 255, 255, 0.25)',
      },
      letterSpacing: {
        'wide': '0.05em',
        'wider': '0.1em',
        'widest': '0.15em',
      },
      keyframes: {
        wiggle: {
          '0%': { transform: 'rotate(-0.4deg) scale(1.002)' },
          '100%': { transform: 'rotate(0.4deg) scale(0.998)' },
        },
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite alternate',
      }
    }
  },
  plugins: []
}