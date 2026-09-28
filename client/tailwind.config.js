/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            boxShadow: {
                soft: '0 12px 32px rgba(0, 0, 0, 0.28)',
            },
        },
    },
    plugins: [],
}
