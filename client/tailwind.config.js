/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#b50063",
                secondary: "#10a56d",
            },

            fontSize: {
                md: "17px",
            },

            fontFamily: {
                "li-ador": ["var(--font-li-ador-regular)", "sans-serif"],
                "li-ador-bold": ["var(--font-li-ador-bold)", "sans-serif"],
                "li-ador-light": ["var(--font-li-ador-light)", "sans-serif"],
                "li-ador-extra-light": [
                    "var(--font-li-ador-extra-light)",
                    "sans-serif",
                ],
                "li-ador-semibold": [
                    "var(--font-li-ador-semibold)",
                    "sans-serif",
                ],
                "li-ador-bold-italic": [
                    "var(--font-li-ador-bold-italic)",
                    "sans-serif",
                ],
                "li-ador-extra-light-italic": [
                    "var(--font-li-ador-extra-light-italic)",
                    "sans-serif",
                ],
                "li-ador-light-italic": [
                    "var(--font-li-ador-light-italic)",
                    "sans-serif",
                ],
                "li-ador-regular-italic": [
                    "var(--font-li-ador-regular-italic)",
                    "sans-serif",
                ],
                "li-ador-semibold-italic": [
                    "var(--font-li-ador-semibold-italic)",
                    "sans-serif",
                ],
            },
        },
    },
    plugins: [],
};
