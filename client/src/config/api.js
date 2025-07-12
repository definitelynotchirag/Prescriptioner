// API Configuration
const getApiBaseUrl = () => {
    // If environment variable is set, use it
    if (process.env.REACT_APP_API_BASE_URL) {
        return process.env.REACT_APP_API_BASE_URL;
    }

    // Auto-detect based on current hostname
    if (typeof window !== "undefined") {
        const hostname = window.location.hostname;

        if (hostname === "prescriptioner.onrender.com") {
            return "https://prescriptioner.onrender.com";
        }

        if (hostname === "prescriptioner.chiragx.me") {
            return "https://prescriptioner.onrender.com"; // Your backend is still on Render
        }

        if (hostname === "localhost" || hostname === "127.0.0.1") {
            return "http://localhost:3001";
        }
    }

    // Fallback
    return "http://localhost:3001";
};

const API_BASE_URL = getApiBaseUrl();

console.log("API_BASE_URL:", API_BASE_URL); // For debugging

export { API_BASE_URL };
