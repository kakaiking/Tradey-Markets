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
                sans: ['var(--font-figtree)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                display: ['var(--font-syne)', 'ui-sans-serif', 'sans-serif'],
                reading: ['var(--font-source-serif)', 'ui-serif', 'Georgia', 'serif'],
                mono: ['var(--font-ibm-plex-mono)', 'ui-monospace', 'monospace'],
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
                    50: '#fff9e6',
                    100: '#fff0b8',
                    200: '#ffe680',
                    300: '#f5d24a',
                    400: '#f5c518',
                    500: '#e0b000',
                    600: '#b38c00',
                    700: '#866900',
                    800: '#594600',
                    900: '#2c2300',
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
