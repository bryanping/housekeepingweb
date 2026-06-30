import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
  50:  'hsl(25, 76%, 97%)',
  100: 'hsl(25, 76%, 92%)',
  200: 'hsl(25, 76%, 82%)',
  300: 'hsl(25, 76%, 68%)',
  400: '#8b4513',
  500: 'hsl(25, 76%, 38%)',
  600: 'hsl(25, 76%, 30%)',
  700: 'hsl(25, 76%, 22%)',
  800: 'hsl(25, 76%, 14%)',
  900: 'hsl(25, 76%, 8%)',
}
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
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
      }
    },
  },
  plugins: [],
}
export default config
