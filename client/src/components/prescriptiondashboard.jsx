import axios from "axios";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
    ArrowLeft,
    Calendar,
    CalendarCheck,
    CheckCircle,
    FileText,
    ImageIcon,
    Pencil,
    PlusCircle,
    Save,
    Trash2,
    Upload,
    User,
    X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
import { storage } from "../firebaseConfig"; // Import Firebase storage

const PrescriptionDashboard = () => {
    const userId = useParams().id;
    const [user, setUser] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [newPrescription, setNewPrescription] = useState({ title: "", imageUrl: "" });
    const [file, setFile] = useState(null); // New state to hold the image file
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [calendarLoading, setCalendarLoading] = useState({});
    const [calendarStatus, setCalendarStatus] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [imagePreview, setImagePreview] = useState(null);

    const fetchUser = async () => {
        try {
            // const response = await axios.get(`http://localhost:3001/api/users/${userId}`);
            setUser({ name: "u1" });
        } catch (error) {
            setError("Error fetching user");
            console.error("Error fetching user:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPrescriptions = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/users/p/${userId}/prescriptions`);
            // console.log("Prescriptions:", response.data);
            setPrescriptions(response.data);
        } catch (error) {
            console.error("Error fetching prescriptions:", error);
        }
    }, [userId]);

    useEffect(() => {
        fetchUser();
        fetchPrescriptions();
        checkCalendarAuth();
    }, [userId, fetchPrescriptions]);

    const handleInputChange = e => {
        const { name, value } = e.target;
        setNewPrescription(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = e => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        // Create image preview
        if (selectedFile && selectedFile.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = e => setImagePreview(e.target.result);
            reader.readAsDataURL(selectedFile);
        }
    };

    // Drag and drop handlers
    const handleDragEnter = e => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = e => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleDragOver = e => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = e => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            const selectedFile = files[0];
            setFile(selectedFile);

            // Create image preview
            if (selectedFile && selectedFile.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = e => setImagePreview(e.target.result);
                reader.readAsDataURL(selectedFile);
            }
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (!file) {
            console.log("Please select a file");
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        const storageRef = ref(storage, `prescriptions/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            snapshot => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            error => {
                console.error("Error uploading image:", error);
                setIsUploading(false);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                try {
                    const medications = await axios.post(`${API_BASE_URL}/api/extractimg/fetchimage`, {
                        imageUrl: downloadURL,
                        userId: userId,
                        title: newPrescription.title,
                    });

                    // console.log("Prescription processed:", medications.data);

                    // Show success message
                    setSuccessMessage("Prescription uploaded successfully!");

                    // Fetch updated prescriptions to show the new one
                    fetchPrescriptions();

                    // Reset form and close modal after a short delay
                    setTimeout(() => {
                        setNewPrescription({ title: "", imageUrl: "" });
                        setFile(null);
                        setImagePreview(null);
                        setShowAddForm(false);
                        setUploadProgress(0);
                        setSuccessMessage("");
                    }, 1500);
                } catch (error) {
                    console.error("Error adding prescription or medications:", error);
                } finally {
                    setIsUploading(false);
                }
            }
        );
    };

    const handleDelete = async id => {
        try {
            await axios.delete(`${API_BASE_URL}/api/users/${userId}/prescriptions/${id}`);
            setPrescriptions(prescriptions.filter(prescription => prescription.id !== id));
        } catch (error) {
            console.error("Error deleting prescription:", error);
        }
    };

    const handleEdit = id => {
        setEditMode(id);
    };

    const handleSaveEdit = async id => {
        try {
            const prescriptionToUpdate = prescriptions.find(p => p.id === id);
            await axios.put(`${API_BASE_URL}/api/users/${userId}/prescriptions/${id}`, prescriptionToUpdate);
            setEditMode(null);
        } catch (error) {
            console.error("Error updating prescription:", error);
        }
    };

    // Check Google Calendar authentication status
    const checkCalendarAuth = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/calendar/auth-status`);
            setCalendarStatus(response.data.authenticated);
        } catch (error) {
            console.error("Error checking calendar auth:", error);
            setCalendarStatus(false);
        }
    };

    // Create medication reminders for a prescription
    const createMedicationReminders = async prescriptionId => {
        setCalendarLoading(prev => ({ ...prev, [prescriptionId]: true }));

        try {
            const response = await axios.post(`${API_BASE_URL}/api/calendar/create-medication-reminders`, {
                prescriptionId,
                userId,
            });

            alert(`Successfully created reminders for ${response.data.summary.success} medications!`);

            // Update prescription to show it has calendar reminders
            setPrescriptions(prev =>
                prev.map(p => (p._id === prescriptionId ? { ...p, hasCalendarReminders: true } : p))
            );
        } catch (error) {
            console.error("Error creating medication reminders:", error);

            if (error.response?.data?.needsAuth) {
                alert("Google Calendar authentication required. Please authenticate in the Calendar page first.");
            } else {
                alert("Error creating medication reminders: " + (error.response?.data?.error || error.message));
            }
        } finally {
            setCalendarLoading(prev => ({ ...prev, [prescriptionId]: false }));
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-gray-900 p-8 text-yellow-400 text-center">Loading...</div>;
    }

    const handleEditChange = (e, id, field) => {
        const { value } = e.target;
        setPrescriptions(prevPrescriptions =>
            prevPrescriptions.map(prescription =>
                prescription.id === id ? { ...prescription, [field]: value } : prescription
            )
        );
    };

    if (error) {
        return <div className="min-h-screen bg-gray-900 p-8 text-red-400 text-center">{error}</div>;
    }

    if (!user) {
        return <div className="min-h-screen bg-gray-900 p-8 text-yellow-400 text-center">User not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            {/* Back Button */}
            <Link
                to="/dashboard"
                className="inline-flex items-center space-x-2 text-gray-400 hover:text-yellow-400 transition-colors duration-200 mb-6"
            >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Users</span>
            </Link>

            {/* Header */}
            <div className="max-w-7xl mx-auto">
                <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-xl mb-8">
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                                <User className="w-10 h-10 text-gray-900" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-yellow-400">Prescriptions</h1>
                            <p className="text-gray-400 mt-1">Manage and view prescription records</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-sm">
                                {prescriptions.length} {prescriptions.length === 1 ? "prescription" : "prescriptions"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Prescriptions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {prescriptions.map(prescription => (
                        <div
                            key={prescription._id || prescription.id}
                            className="bg-gray-800/60 backdrop-blur-lg rounded-xl border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group"
                        >
                            <div className="p-6">
                                {/* Prescription Header */}
                                <div className="flex justify-between items-start mb-4">
                                    {editMode === prescription.id ? (
                                        <input
                                            type="text"
                                            value={prescription.title}
                                            onChange={e => handleEditChange(e, prescription.id, "title")}
                                            className="bg-gray-700/50 border border-gray-600 text-gray-100 px-3 py-2 rounded-xl flex-1 mr-3 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                                        />
                                    ) : (
                                        <h2 className="text-xl font-semibold text-gray-100 group-hover:text-yellow-400 transition-colors duration-200">
                                            {prescription.title}
                                        </h2>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        {editMode === prescription.id ? (
                                            <button
                                                onClick={() => handleSaveEdit(prescription.id)}
                                                className="p-2 bg-green-500/80 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                                            >
                                                <Save className="h-4 w-4" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleEdit(prescription.id)}
                                                className="p-2 bg-blue-500/80 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(prescription.id)}
                                            className="p-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Prescription Image */}
                                <Link to={`/${userId}/prescriptions/${prescription._id}`} className="block mb-4">
                                    <div className="relative overflow-hidden rounded-xl group/image">
                                        <img
                                            src={prescription.imageUrl}
                                            alt={prescription.title}
                                            className="w-full h-48 object-cover transition-transform duration-300 group-hover/image:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
                                        <div className="absolute top-3 right-3">
                                            <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-2">
                                                <FileText className="w-4 h-4 text-gray-300" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>

                                {/* Calendar Integration Section */}
                                <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4 text-yellow-400" />
                                            <span className="text-sm font-medium text-gray-300">
                                                Calendar Integration
                                            </span>
                                        </div>
                                        {calendarStatus && (
                                            <div className="flex items-center space-x-1">
                                                <CheckCircle className="w-3 h-3 text-green-400" />
                                                <span className="text-xs text-green-400">Connected</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-400">Calendar Reminders</span>
                                        {prescription.hasCalendarReminders ? (
                                            <div className="flex items-center text-green-400 text-sm">
                                                <CalendarCheck className="h-4 w-4 mr-1" />
                                                Active
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => createMedicationReminders(prescription._id)}
                                                disabled={calendarLoading[prescription._id] || calendarStatus === false}
                                                className="flex items-center text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-1 rounded transition-colors"
                                            >
                                                {calendarLoading[prescription._id] ? (
                                                    <>
                                                        <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full mr-1"></div>
                                                        Creating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Calendar className="h-4 w-4 mr-1" />
                                                        Create Reminders
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    {calendarStatus === false && (
                                        <Link
                                            to="/calendar"
                                            className="text-xs text-yellow-400 hover:text-yellow-300 mt-1 block"
                                        >
                                            → Authenticate Google Calendar first
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Floating Action Button */}
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="fixed bottom-8 right-8 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-500/20"
                >
                    <PlusCircle className="h-8 w-8" />
                </button>

                {/* Add Prescription Modal */}
                {showAddForm && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800/95 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-gray-900" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-yellow-400">Add New Prescription</h3>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setNewPrescription({ title: "", imageUrl: "" });
                                        setFile(null);
                                        setImagePreview(null);
                                        setUploadProgress(0);
                                        setIsUploading(false);
                                        setSuccessMessage("");
                                    }}
                                    className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Title Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Prescription Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={newPrescription.title}
                                        onChange={handleInputChange}
                                        placeholder="Enter prescription title..."
                                        required
                                        className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-yellow-400 placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-200"
                                    />
                                </div>

                                {/* File Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Prescription Image
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            required
                                            className="hidden"
                                            id="prescription-file"
                                        />
                                        <label
                                            htmlFor="prescription-file"
                                            onDragEnter={handleDragEnter}
                                            onDragLeave={handleDragLeave}
                                            onDragOver={handleDragOver}
                                            onDrop={handleDrop}
                                            className={`w-full flex items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                                                dragActive
                                                    ? "border-yellow-500 bg-yellow-500/10"
                                                    : file
                                                    ? "border-green-500/50 bg-green-500/5"
                                                    : "border-gray-600/50 bg-gray-700/30 hover:border-yellow-500/50 hover:bg-gray-700/50"
                                            }`}
                                        >
                                            <div className="text-center">
                                                {file ? (
                                                    <div className="space-y-3">
                                                        {imagePreview && (
                                                            <div className="relative mx-auto w-32 h-32 rounded-lg overflow-hidden border border-green-500/30">
                                                                <img
                                                                    src={imagePreview}
                                                                    alt="Preview"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="flex items-center justify-center space-x-3">
                                                            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                                                                <FileText className="w-4 h-4 text-green-400" />
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="text-green-400 font-medium text-sm">
                                                                    {file.name}
                                                                </p>
                                                                <p className="text-gray-400 text-xs">
                                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div className="w-12 h-12 bg-gray-600/50 rounded-xl flex items-center justify-center mx-auto mb-3">
                                                            <ImageIcon className="w-6 h-6 text-gray-400" />
                                                        </div>
                                                        <p className="text-gray-300 font-medium mb-1">
                                                            {dragActive
                                                                ? "Drop image here"
                                                                : "Click to upload or drag & drop"}
                                                        </p>
                                                        <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Upload Progress */}
                                {isUploading && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-300">Uploading...</span>
                                            <span className="text-yellow-400">{Math.round(uploadProgress)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Success Message */}
                                {successMessage && (
                                    <div className="flex items-center space-x-2 p-3 bg-green-900/20 border border-green-600/30 rounded-xl">
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                        <span className="text-green-400 text-sm font-medium">{successMessage}</span>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex space-x-3 pt-4 border-t border-gray-700/50">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddForm(false);
                                            setNewPrescription({ title: "", imageUrl: "" });
                                            setFile(null);
                                            setImagePreview(null);
                                            setUploadProgress(0);
                                            setIsUploading(false);
                                            setSuccessMessage("");
                                        }}
                                        className="flex-1 px-4 py-3 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-xl transition-colors duration-200 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!file || !newPrescription.title.trim() || isUploading}
                                        className="flex-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-900 disabled:text-gray-400 rounded-xl transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                                    >
                                        {isUploading ? (
                                            <>
                                                <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                                                <span>Processing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4" />
                                                <span>Save Prescription</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Calendar Status Banner */}
                {calendarStatus !== null && (
                    <div
                        className={`mb-6 p-4 rounded-lg ${
                            calendarStatus
                                ? "bg-green-900 border border-green-600"
                                : "bg-yellow-900 border border-yellow-600"
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                {calendarStatus ? (
                                    <>
                                        <CalendarCheck className="h-5 w-5 text-green-400 mr-2" />
                                        <span className="text-green-400">Google Calendar Connected</span>
                                    </>
                                ) : (
                                    <>
                                        <Calendar className="h-5 w-5 text-yellow-400 mr-2" />
                                        <span className="text-yellow-400">Google Calendar Not Connected</span>
                                    </>
                                )}
                            </div>
                            {!calendarStatus && (
                                <Link
                                    to="/calendar"
                                    className="bg-yellow-600 hover:bg-yellow-700 text-gray-900 px-4 py-2 rounded text-sm font-medium transition-colors"
                                >
                                    Connect Calendar
                                </Link>
                            )}
                        </div>
                        <p className="text-sm text-gray-300 mt-2">
                            {calendarStatus
                                ? "You can now create automatic medication reminders for your prescriptions."
                                : "Connect your Google Calendar to automatically create medication reminders when processing prescriptions."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrescriptionDashboard;
