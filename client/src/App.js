import axios from "axios";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "./config/api";
import GoogleAuthLogin from "../src/components/GoogleAuthLogin";
import GoogleAuthSignup from "../src/components/GoogleAuthSignup";
import GoogleOAuthCallback from "../src/components/GoogleOAuthCallback";
import LandingPage from "../src/components/landingPage";
import Login from "../src/components/login";
import Signup from "../src/components/signup";
import Calendar from "./components/Calendar"; // New import
import UserDashboard from "./components/dashboard";
import PrescriptionPage from "./components/prescription"; // New import
import PrescriptionDashboard from "./components/prescriptiondashboard";
import "./styles.css";

// Define public routes that don't require authentication
const publicRoutes = ['/', '/login', '/signup', '/oauth2callback', '/login-manual', '/signup-manual'];

const App = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState({});

    useEffect(() => {
        const autoLogin = async () => {
            try {
                const token = localStorage.getItem("token");
                
                // Skip authentication check for public routes
                if (publicRoutes.includes(location.pathname)) {
                    // Still try to auto-login if token exists, but don't redirect if it fails
                    if (token) {
                        try {
                            const response = await axios.post(`${API_BASE_URL}/api/rootuser/autoLogin`, { token });
                            if (response.data.success) {
                                setUser(response.data.data);
                            }
                        } catch (error) {
                            console.log("Auto-login failed on public route, continuing...");
                        }
                    }
                    return;
                }

                if (!token) {
                    console.log("token not found");
                    navigate("/login");
                    return;
                }

                console.log("dchirag", token);

                const response = await axios.post(`${API_BASE_URL}/api/rootuser/autoLogin`, { token });

                if (response.data.success) {
                    // localStorage.setItem("user", JSON.stringify(response.data.data));
                    setUser(response.data.data, "dsfdsfds");
                } else {
                    navigate("/login");
                }
            } catch (error) {
                console.error("Axios request error in app.js:", error);
                navigate("/login");
            }
        };

        autoLogin();
    }, [navigate, location.pathname]);

    return (
        <div className="font-bricolage">
            <Routes>
                <Route path="/" element={<LandingPage user={user} setUser={setUser} />} />
                <Route path="/dashboard" element={<UserDashboard user={user} />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/:id" element={<PrescriptionDashboard user={user} />} />
                <Route path="/:username/:prescriptionTitle" element={<PrescriptionPage users={user} />} />

                {/* Enhanced Google OAuth Login/Signup */}
                <Route path="/login" element={<GoogleAuthLogin user={user} setUser={setUser} />} />
                <Route path="/signup" element={<GoogleAuthSignup user={user} setUser={setUser} />} />

                {/* Google OAuth Callback */}
                <Route path="/oauth2callback" element={<GoogleOAuthCallback setUser={setUser} />} />

                {/* Legacy routes for manual authentication */}
                <Route path="/login-manual" element={<Login user={user} setUser={setUser} />} />
                <Route path="/signup-manual" element={<Signup user={user} />} />

                <Route path="/:userId/prescriptions/:prescriptionId" element={<PrescriptionPage user={user} />} />
            </Routes>
        </div>
    );
};

export default App;
