/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        'sharpie': ['Permanent Marker', 'cursive'],
        'hand': ['Patrick Hand', 'cursive'],
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