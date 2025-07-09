import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

const GoogleAuthSignup = ({ setUser }) => {
    const [gmail, setGmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const navigate = useNavigate();

    // Initialize Google OAuth
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, []);

    const handleGoogleSignup = () => {
        setIsGoogleLoading(true);

        // Create OAuth2 flow with calendar permissions
        const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
        const params = new URLSearchParams({
            client_id: "495171980207-d5n0p7v6ubb315cssm8d93pm31i3pqoi.apps.googleusercontent.com",
            redirect_uri: "https://prescriptioner.chiragx.me/oauth2callback",
            response_type: "code",
            scope: ["openid", "email", "profile", "https://www.googleapis.com/auth/calendar"].join(" "),
            access_type: "offline",
            prompt: "consent",
            state: "signup", // Indicate this is a signup flow
        });

        window.location.href = `${oauth2Endpoint}?${params.toString()}`;
    };

    const handleRegularSignup = async e => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/api/rootuser/signup`, { gmail, phone, password });
            navigate("/login");
        } catch (err) {
            setError("Signup failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-[#00030b] text-yellow-500">
            {/* Left Column */}
            <div className="lg:w-1/2 flex flex-col justify-center items-center bg-gray-900/80 p-8 border-b-2 border-gray-800 lg:border-b-0 lg:border-r-2">
                {/* Prescriptioner Name/Logo */}
                <div className="mb-10 flex flex-col items-center">
                    {/* <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <svg className="w-10 h-10 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                    </div> */}
                    <h1 className="text-5xl font-extrabold text-yellow-400 tracking-wide mb-2">Prescriptioner</h1>
                    <p className="text-gray-400 text-base text-center max-w-xs">
                        Your all-in-one medication and reminder platform
                    </p>
                </div>
                {/* Google Signup Includes */}
                <div className="mb-8 w-full max-w-md">
                    <div className="p-4 bg-blue-900/20 border border-blue-600/30 rounded-xl backdrop-blur-sm">
                        <div className="flex items-start space-x-3">
                            <svg
                                className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div className="text-sm text-blue-300">
                                <p className="font-medium mb-2">Google Sign-up includes:</p>
                                <ul className="space-y-1">
                                    <li className="flex items-center space-x-2">
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                        <span>Automatic account creation</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                        <span>Calendar access for reminders</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                        <span>Secure authentication</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Manual Signup Limitation */}
                <div className="w-full max-w-md">
                    <div className="p-4 bg-orange-900/20 border border-orange-600/30 rounded-xl backdrop-blur-sm">
                        <div className="flex items-start space-x-3">
                            <svg
                                className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div className="text-sm text-orange-300">
                                <p className="font-medium">Manual signup limitation:</p>
                                <p className="mt-1">
                                    Regular signup won't include automatic calendar integration. You'll need to connect
                                    your calendar manually later.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Right Column */}
            <div className="lg:w-1/2 flex items-center justify-center p-4">
                <div className="bg-gray-800/60 backdrop-blur-lg border border-gray-700/50 p-8 rounded-2xl shadow-2xl max-w-md w-full">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-yellow-400 mb-2">Create Account</h1>
                        <p className="text-gray-400 text-sm">Join Prescriptioner to manage your medications</p>
                    </div>

                    {error && (
                        <div className="bg-red-900/20 border border-red-600/30 text-red-300 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    {/* Google OAuth Section */}
                    <div className="mb-8">
                        <button
                            onClick={handleGoogleSignup}
                            disabled={isGoogleLoading}
                            className="w-full bg-white/95 hover:bg-white text-gray-800 font-semibold py-4 px-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        >
                            {isGoogleLoading ? (
                                <div className="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    <span>Sign up with Google</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center mb-8">
                        <div className="flex-1 border-t border-gray-700/50"></div>
                        <div className="px-4 text-gray-500 text-sm font-medium">or create manually</div>
                        <div className="flex-1 border-t border-gray-700/50"></div>
                    </div>

                    {/* Regular Signup Form */}
                    <form onSubmit={handleRegularSignup} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={gmail}
                                onChange={e => setGmail(e.target.value)}
                                required
                                className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-yellow-400 placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200 backdrop-blur-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Phone Number</label>
                            <input
                                type="text"
                                placeholder="Enter your phone number"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                required
                                className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-yellow-400 placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200 backdrop-blur-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">Password</label>
                            <input
                                type="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-yellow-400 placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200 backdrop-blur-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Create Account
                        </button>
                    </form>

                    {/* Link to Login */}
                    <div className="text-center mt-8 pt-6 border-t border-gray-700/50">
                        <p className="text-gray-400">
                            Already have an account?{" "}
                            <button
                                onClick={() => navigate("/login")}
                                className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
                            >
                                Sign in here
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoogleAuthSignup;
