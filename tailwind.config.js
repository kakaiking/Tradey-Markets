/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/lib/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-space-grotesk)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                display: ['var(--font-space-grotesk)', 'ui-sans-serif', 'sans-serif'],
                reading: ['var(--font-dm-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
            },
            colors: {
                paper: 'var(--paper)',
                ink: 'var(--ink)',
                raised: 'var(--raised)',
                line: 'var(--line)',
                sunken: 'var(--sunken)',
                highlighter: 'var(--highlighter)',
                chalk: 'var(--chalk)',
                pencil: 'var(--pencil)',
                muted: 'var(--muted)',
                brand: {
                    50: '#eaf5fd',
                    100: '#d2ebfa',
                    200: '#a6d6f4',
                    300: '#6bb8e8',
                    400: '#2f9ef0',
                    500: '#0581d5',
                    600: '#0469ad',
                    700: '#035388',
                    800: '#033a5e',
                    900: '#02253d',
                },
                surface: {
                    900: 'var(--paper)',
                    800: 'var(--sunken)',
                    700: 'var(--raised)',
                    600: 'var(--line)',
                    500: 'var(--line)',
                    400: 'var(--muted)',
                    300: 'var(--muted)',
                    200: 'var(--ink)',
                    100: 'var(--ink)',
                },
            },
            borderRadius: {
                '4xl': '2rem',
            },
        },
    },
    plugins: [],
};
