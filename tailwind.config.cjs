/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./frontend/index.html",
        "./frontend/src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        borderWidth: {
            DEFAULT: "thin",
            0: "0",
            2: "2px",
            3: "medium",
            4: "4px",
            6: "6px",
            8: "8px",
        },
        extend: {},
    },
    plugins: [],
};
