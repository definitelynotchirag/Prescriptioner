module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                bricolage: ["Bricolage Grotesque", "sans-serif"],
                jost: ["Jost", "sans-serif"],
                sans: ["Bricolage Grotesque", "Jost", "sans-serif"],
            },
            colors: {
                primary: {
                    50: "#fffbeb",
                    100: "#fef3c7",
                    200: "#fde68a",
                    300: "#fcd34d",
                    400: "#fbbf24",
                    500: "#f59e0b",
                    600: "#d97706",
                    700: "#b45309",
                    800: "#92400e",
                    900: "#78350f",
                },
                dark: {
                    900: "#0f172a",
                    800: "#1e293b",
                    700: "#334155",
                    600: "#475569",
                    500: "#64748b",
                    400: "#94a3b8",
                    300: "#cbd5e1",
                    200: "#e2e8f0",
                    100: "#f1f5f9",
                    50: "#f8fafc",
                },
                accent: {
                    blue: "#3b82f6",
                    purple: "#8b5cf6",
                    green: "#10b981",
                    red: "#ef4444",
                    orange: "#f97316",
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "hero-pattern":
                    'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1.5"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')',
            },
            animation: {
                "fade-in-up": "fadeInUp 0.6s ease-out",
                "fade-in-down": "fadeInDown 0.6s ease-out",
                "bounce-in": "bounceIn 0.8s ease-out",
                "slide-in-left": "slideInLeft 0.6s ease-out",
                "slide-in-right": "slideInRight 0.6s ease-out",
            },
            keyframes: {
                fadeInUp: {
                    "0%": { opacity: "0", transform: "translateY(30px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                fadeInDown: {
                    "0%": { opacity: "0", transform: "translateY(-30px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                bounceIn: {
                    "0%": { opacity: "0", transform: "scale(0.3)" },
                    "50%": { opacity: "1", transform: "scale(1.05)" },
                    "70%": { transform: "scale(0.9)" },
                    "100%": { opacity: "1", transform: "scale(1)" },
                },
                slideInLeft: {
                    "0%": { opacity: "0", transform: "translateX(-30px)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
                slideInRight: {
                    "0%": { opacity: "0", transform: "translateX(30px)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
            },
        },
    },
    plugins: [],
};
