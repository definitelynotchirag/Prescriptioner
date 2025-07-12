import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

const GoogleAuthLogin = ({ setUser, user }) => {
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

        script.onload = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id:
                        process.env.REACT_APP_GOOGLE_CLIENT_ID ||
                        "495171980207-d5n0p7v6ubb315cssm8d93pm31i3pqoi.apps.googleusercontent.com",
                    callback: handleGoogleCallback,
                    scope: "openid email profile https://www.googleapis.com/auth/calendar",
                });
            }
        };

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const handleGoogleCallback = async response => {
        try {
            setIsGoogleLoading(true);
            setError("");

            // Send the credential to your backend
            const result = await axios.post(`${API_BASE_URL}/api/auth/google-login`, {
                credential: response.credential,
            });

            localStorage.setItem("token", result.data.token);
            setUser(result.data.user);

            // Navigate to dashboard
            navigate("/dashboard");
        } catch (err) {
            console.error("Google login error:", err);
            setError("Google login failed. Please try again.");
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        if (window.google) {
            setIsGoogleLoading(true);

            // Create OAuth2 flow with calendar permissions
            const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
            const redirectUri = window.location.origin + "/oauth2callback";
            
            const params = new URLSearchParams({
                client_id: "495171980207-d5n0p7v6ubb315cssm8d93pm31i3pqoi.apps.googleusercontent.com",
                redirect_uri: redirectUri,
                response_type: "code",
                scope: ["openid", "email", "profile", "https://www.googleapis.com/auth/calendar"].join(" "),
                access_type: "offline",
                prompt: "consent",
                state: "login", // Indicate this is a login flow
            });

            window.location.href = `${oauth2Endpoint}?${params.toString()}`;
        } else {
            setError("Google OAuth not loaded. Please refresh and try again.");
        }
    };

    const handleRegularLogin = async e => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/api/rootuser/login`, { gmail, phone, password });
            localStorage.setItem("token", response.data.token);
            setUser(response.data.user);
            navigate("/dashboard");
        } catch (err) {
            setError("Login failed. Please check your credentials.");
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
                            <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99z" />
                        </svg>
                    </div> */}
                    <h1 className="text-5xl font-extrabold text-yellow-400 tracking-wide mb-2"><a href="/">Prescriptioner</a></h1>
                    <p className="text-gray-400 text-base text-center max-w-xs">
                        Your all-in-one medication and reminder platform
                    </p>
                </div>
                {/* Google Login Info */}
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
                                <p className="font-medium mb-2">Google Login includes:</p>
                                <ul className="space-y-1">
                                    <li className="flex items-center space-x-2">
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                        <span>One-click secure sign in</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                        <span>Calendar access for reminders</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                        <span>Automatic medication reminders</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Calendar Integration Note */}
                <div className="w-full max-w-md">
                    <div className="p-4 bg-green-900/20 border border-green-600/30 rounded-xl backdrop-blur-sm">
                        <div className="flex items-start space-x-3">
                            <svg
                                className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-7V7a1 1 0 112 0v4a1 1 0 01-2 0zm1 4a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div className="text-sm text-green-300">
                                <p className="font-medium">Calendar integration:</p>
                                <p className="mt-1">
                                    Google login automatically connects your calendar for medication reminders.
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
                        <h1 className="text-3xl font-bold text-yellow-400 mb-2">Welcome Back</h1>
                        <p className="text-gray-400 text-sm">Sign in to continue to Prescriptioner</p>
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
                            onClick={handleGoogleLogin}
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
                                    <span>Continue with Google</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center mb-8">
                        <div className="flex-1 border-t border-gray-700/50"></div>
                        <div className="px-4 text-gray-500 text-sm font-medium">or continue with email</div>
                        <div className="flex-1 border-t border-gray-700/50"></div>
                    </div>

                    {/* Regular Login Form */}
                    <form onSubmit={handleRegularLogin} className="space-y-5">
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
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-yellow-400 placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200 backdrop-blur-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-yellow-500 text-gray-900 font-semibold py-4 rounded-xl hover:bg-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Link to Signup */}
                    <div className="text-center mt-8 pt-6 border-t border-gray-700/50">
                        <p className="text-gray-400">
                            Don't have an account?{" "}
                            <button
                                onClick={() => navigate("/signup")}
                                className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
                            >
                                Sign up here
                            </button>
                        </p>
                    </div>

                    {/* Demo Credentials */}
                    <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                        <div className="text-yellow-500 font-medium mb-2">Here for Demo?</div>
                        <div className="grid grid-cols-[100px_auto] gap-1 text-sm text-gray-300">
                            <div>Email:</div>
                            <div>chiragdave1888@gmail.com</div>
                            <div>Password:</div>
                            <div>chirag123</div>
                            <div>Phone:</div>
                            <div>9876543210</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoogleAuthLogin;
