import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
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
    },
  },
  plugins: [],
}
export default config
