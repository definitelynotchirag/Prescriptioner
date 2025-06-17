import axios from "axios";
import { Calendar as CalendarIcon, Clock, Plus } from "lucide-react";
import { useEffect, useState } from "react";

const Calendar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authUrl, setAuthUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({
        summary: "",
        description: "",
        startDateTime: "",
        endDateTime: "",
    });

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await axios.get("http://localhost:3001/api/calendar/auth-status");
            setIsAuthenticated(response.data.authenticated);

            if (!response.data.authenticated) {
                getAuthUrl();
            }
        } catch (error) {
            console.error("Error checking auth status:", error);
            setIsAuthenticated(false);
            getAuthUrl();
        } finally {
            setLoading(false);
        }
    };

    const getAuthUrl = async () => {
        try {
            const response = await axios.get("http://localhost:3001/api/calendar/auth-url");
            setAuthUrl(response.data.authUrl);
        } catch (error) {
            console.error("Error getting auth URL:", error);
        }
    };

    const handleAuth = () => {
        if (authUrl) {
            window.open(authUrl, "_blank", "width=500,height=600");
            // Set up a listener for when the user returns
            const checkAuth = setInterval(() => {
                checkAuthStatus().then(() => {
                    if (isAuthenticated) {
                        clearInterval(checkAuth);
                    }
                });
            }, 2000);
        }
    };

    const handleInputChange = e => {
        const { name, value } = e.target;
        setNewEvent(prev => ({ ...prev, [name]: value }));
    };

    const createEvent = async e => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/api/calendar/create-event", newEvent);

            if (response.data.needsAuth) {
                setIsAuthenticated(false);
                getAuthUrl();
                return;
            }

            alert("Event created successfully!");
            setNewEvent({
                summary: "",
                description: "",
                startDateTime: "",
                endDateTime: "",
            });
        } catch (error) {
            console.error("Error creating event:", error);
            if (error.response?.data?.needsAuth) {
                setIsAuthenticated(false);
                getAuthUrl();
            } else {
                alert("Error creating event: " + (error.response?.data?.details || error.message));
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 p-8 text-yellow-400">
                <div className="flex items-center justify-center">
                    <div className="text-center">
                        <Clock className="h-12 w-12 animate-spin mx-auto mb-4" />
                        <p>Loading Calendar...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-8 text-yellow-400">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-8">
                    <CalendarIcon className="h-8 w-8 mr-3" />
                    <h1 className="text-3xl font-bold">Google Calendar Integration</h1>
                </div>

                {!isAuthenticated ? (
                    <div className="bg-gray-800 rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
                        <p className="text-gray-300 mb-4">
                            You need to authenticate with Google Calendar to create medication reminders.
                        </p>
                        <button
                            onClick={handleAuth}
                            className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-md hover:bg-yellow-300 transition-colors"
                        >
                            Authenticate with Google Calendar
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Success Message */}
                        <div className="bg-green-800 rounded-lg p-4">
                            <p className="text-green-200">✅ Successfully authenticated with Google Calendar!</p>
                        </div>

                        {/* Create Event Form */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center">
                                <Plus className="h-5 w-5 mr-2" />
                                Create New Event
                            </h2>
                            <form onSubmit={createEvent} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Event Title</label>
                                    <input
                                        type="text"
                                        name="summary"
                                        value={newEvent.summary}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Take Medicine - Acetaminophen"
                                        className="w-full bg-gray-700 text-yellow-400 px-3 py-2 rounded border border-gray-600 focus:border-yellow-400"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Description (Optional)
                                    </label>
                                    <textarea
                                        name="description"
                                        value={newEvent.description}
                                        onChange={handleInputChange}
                                        placeholder="Additional details about the medication..."
                                        className="w-full bg-gray-700 text-yellow-400 px-3 py-2 rounded border border-gray-600 focus:border-yellow-400"
                                        rows="3"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Start Date & Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="startDateTime"
                                            value={newEvent.startDateTime}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700 text-yellow-400 px-3 py-2 rounded border border-gray-600 focus:border-yellow-400"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            End Date & Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="endDateTime"
                                            value={newEvent.endDateTime}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700 text-yellow-400 px-3 py-2 rounded border border-gray-600 focus:border-yellow-400"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-md hover:bg-yellow-300 transition-colors"
                                >
                                    Create Event
                                </button>
                            </form>
                        </div>

                        {/* Future: Display existing events */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Integration Status</h2>
                            <p className="text-gray-300">
                                Calendar integration is active. You can now create medication reminders that will appear
                                in your Google Calendar.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Calendar;
