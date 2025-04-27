import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx,scss}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx,scss}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx,scss}",
    "./src/utils/**/*.{js,ts,jsx,tsx,mdx,scss}",
    "./src/constants/**/*.{js,ts,jsx,tsx,mdx,scss}",
    "./src/providers/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      colors: {
        primaryExtra: '#EDF6F0',
        primaryLight: '#2CA67B',
        primary: '#248462',
        primaryDark: '#1C644A',
        customBlue: {
          50: '#ebf5ff',
          100: '#e1effe',
          200: '#c3ddfd',
          300: '#a4cafe',
          400: '#76a9fa',
          500: '#3f83f8',
          600: '#1c64f2',
          700: '#1a56db',
          800: '#1e429f',
          900: '#282732',
        },
        red: '#E13D4D',
        dark: '#000',
        custom_gray: '#EFEFF2',
      },
      borderRadius: {
        custom_md: '24px',
      },
      fontWeight: {
        thin: '200',
        light: '300',
        regular: '400',
        regmed: '500',
        medium: '600',
        semi: '700',
        bold: '800',
        black: '900',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        mainLabelAnimation: {
          '0%': { opacity: '0', transform: 'scale(1) translateY(-70vh)' },
          '50%': { opacity: '0', transform: 'scale(1) translateY(5vh)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        mainDescriptionAnimation: {
          '0%': { opacity: '0' },
          '40%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        leftSvgAnimation: {
          '0%': { opacity: '0.7', transform: 'scale(0) translateX(-500%)' },
          '70%': { transform: 'scale(1)' },
          '100%': { opacity: '1', transform: 'scale(1) translateX(0)' },
        },
        rightSvgAnimation: {
          '0%': { opacity: '0.7', transform: 'scale(0) translateX(500%)' },
          '70%': { transform: 'scale(1)' },
          '100%': { opacity: '1', transform: 'scale(1) translateX(0)' },
        },
        starAnimation: {
          '0%': { opacity: '0.7', transform: 'scale(0)' },
          '50%': { transform: 'scale(0)' },
          '70%': { transform: 'scale(1.5)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        opacityAnimation: {
          '0%': { opacity: '0', transform: 'scale(0)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'main-label': 'mainLabelAnimation 0.5s ease-in-out',
        'main-description': 'mainDescriptionAnimation 1s ease-in-out',
        'left-svg': 'leftSvgAnimation 1s ease-in-out',
        'right-svg': 'rightSvgAnimation 1s ease-in-out',
        'star': 'starAnimation 1.5s ease-in-out',
        'opacity': 'opacityAnimation 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
};

export default config;