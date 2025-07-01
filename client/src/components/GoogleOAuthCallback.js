import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

const GoogleOAuthCallback = ({ setUser }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const code = searchParams.get("code");
                const state = searchParams.get("state");
                const error = searchParams.get("error");

                if (error) {
                    throw new Error(`OAuth error: ${error}`);
                }

                if (!code) {
                    throw new Error("No authorization code received");
                }

                // console.log("Processing Google OAuth callback...");
                // console.log("Authorization code:", code);
                // console.log("State:", state);

                // Send the authorization code to your backend
                const response = await axios.post(`${API_BASE_URL}/api/auth/google-callback`, {
                    code,
                    state,
                    redirectUri: "http://prescriptioner.onrender.com/oauth2callback",
                });

                // console.log("Backend response:", response.data);

                // Store the token and user data
                localStorage.setItem("token", response.data.token);

                if (response.data.calendarToken) {
                    localStorage.setItem("calendarToken", response.data.calendarToken);
                }

                setUser(response.data.user);

                // Show success message
                // console.log("Google OAuth successful! Calendar access granted.");

                // Navigate to dashboard
                navigate("/dashboard");
            } catch (err) {
                console.error("OAuth callback error:", err);
                setError(err.response?.data?.error || err.message || "Authentication failed");

                // Redirect to login after a delay
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } finally {
                setLoading(false);
            }
        };

        handleCallback();
    }, [searchParams, navigate, setUser]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-yellow-500 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-12 w-12 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold mb-2">Completing Authentication</h2>
                    <p className="text-gray-400">Setting up your account and calendar access...</p>
                    <div className="mt-6 space-y-2 text-sm text-gray-500">
                        <p>✓ Verifying Google account</p>
                        <p>✓ Setting up calendar permissions</p>
                        <p className="animate-pulse">• Creating your profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 text-yellow-500 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="bg-red-900 border border-red-600 rounded-lg p-6 mb-6">
                        <svg
                            className="w-12 h-12 text-red-400 mx-auto mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                        <h2 className="text-2xl font-bold text-red-300 mb-2">Authentication Failed</h2>
                        <p className="text-red-400 mb-4">{error}</p>
                        <p className="text-gray-400 text-sm">Redirecting to login page...</p>
                    </div>

                    <button
                        onClick={() => navigate("/login")}
                        className="bg-yellow-500 text-black px-6 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-yellow-500 flex items-center justify-center">
            <div className="text-center">
                <div className="bg-green-900 border border-green-600 rounded-lg p-6 mb-6">
                    <svg
                        className="w-12 h-12 text-green-400 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <h2 className="text-2xl font-bold text-green-300 mb-2">Success!</h2>
                    <p className="text-green-400">Authentication completed successfully.</p>
                    <p className="text-gray-400 text-sm mt-2">Redirecting to dashboard...</p>
                </div>
            </div>
        </div>
    );
};

export default GoogleOAuthCallback;
