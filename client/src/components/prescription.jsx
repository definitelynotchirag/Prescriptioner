import axios from "axios";
import { ArrowLeft, Edit2, PlusCircle, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

const PrescriptionPage = () => {
    const { userId, prescriptionId } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [prescriptionmed, setPrescriptionmed] = useState([]);
    const [prescription, setPrescription] = useState({
        doctorName: "Mr. Prajwal",
        doctorLicense: "Maharashtra Medical Council",
        patientName: "Pratik patil",
        patientAge: 24,
        patientGender: "Male",
        diagnosis: "Fever",
        date: "21-10-2024",
        medicines: [{ name: "", dosage: { morning: 0, afternoon: 0, evening: 0, night: 0 }, timing: "", duration: "" }],
    });

    useEffect(() => {
        fetchPrescription();
    }, [prescriptionId]);

    const fetchPrescription = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/users/p/${userId}/prescriptions`);
            const response2 = await axios.get(
                `${API_BASE_URL}/api/medicines/${
                    response.data.filter(prescription => prescription._id == prescriptionId)[0]._id
                }`
            );
            // console.log("gggggggggggg", response.data.filter(prescription => prescription._id == prescriptionId)[0]);
            setPrescriptionmed(response2.data);
            // console.log(
            //     "Prescriptions:",
            //     response.data.filter(prescription => prescription._id == prescriptionId)[0]._id
            // );
            setPrescription(response.data.filter(prescription => prescription._id == prescriptionId)[0]);
        } catch (error) {
            console.error("Error fetching prescription:", error);
        }
    };

    const handleInputChange = e => {
        const { name, value } = e.target;
        setPrescription(prev => ({ ...prev, [name]: value }));
    };

    const handleMedicineChange = (index, field, value) => {
        setPrescription(prev => ({
            ...prev,
            medicines: prev.medicines.map((med, i) => (i === index ? { ...med, [field]: value } : med)),
        }));
    };

    const handleDosageChange = (index, time, value) => {
        setPrescription(prev => ({
            ...prev,
            medicines: prev.medicines.map((med, i) =>
                i === index
                    ? {
                          ...med,
                          dosage: { ...med.dosage, [time]: parseFloat(value) },
                      }
                    : med
            ),
        }));
    };

    const addMedicine = () => {
        const newMedicine = {
            name: "",
            dosage: { morning: 0, afternoon: 0, evening: 0, night: 0 },
            timing: "",
            duration: "",
        };
        setPrescription(prev => ({
            ...prev,
            medicines: [...prev.medicines, newMedicine],
        }));
    };

    const deleteMedicine = index => {
        setPrescription(prev => ({
            ...prev,
            medicines: prev.medicines.filter((_, i) => i !== index),
        }));
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {
        try {
            await axios.put(`${API_BASE_URL}/api/prescriptions/${prescriptionId}`, prescription);
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving prescription:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <Link
                to={`/${userId}`}
                className="inline-flex items-center space-x-2 text-gray-400 hover:text-yellow-400 transition-colors duration-200 mb-6"
            >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
            </Link>
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Prescription Details</h2>
                            <button
                                onClick={isEditing ? handleSave : toggleEdit}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {isEditing ? (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save
                                    </>
                                ) : (
                                    <>
                                        <Edit2 className="h-4 w-4 mr-2" />
                                        Edit
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Prescription Details */}
                        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8 mb-8">
                            {[
                                "doctorName",
                                "doctorLicense",
                                "patientName",
                                "patientAge",
                                "patientGender",
                                "diagnosis",
                            ].map(field => (
                                <div key={field}>
                                    <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                                        {field.charAt(0).toUpperCase() +
                                            field
                                                .slice(1)
                                                .replace(/([A-Z])/g, " $1")
                                                .trim()}
                                    </label>
                                    <input
                                        type={field === "date" ? "date" : "text"}
                                        name={field}
                                        id={field}
                                        value={prescription[field] || "-"}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className={`mt-1 block w-full rounded-md shadow-sm 
                    ${
                        isEditing
                            ? "focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                            : "bg-gray-100 border-transparent"
                    } sm:text-sm`}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Medicines */}
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Medicines</h3>
                        <div className="space-y-4">
                            {prescriptionmed.map((medicine, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-md">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2">
                                        <div>
                                            <label
                                                htmlFor={`medicine-name-${index}`}
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                id={`medicine-name-${index}`}
                                                value={medicine.name}
                                                onChange={e => handleMedicineChange(index, "name", e.target.value)}
                                                readOnly={!isEditing}
                                                className={`mt-1 block w-full rounded-md shadow-sm ${
                                                    isEditing ? "border-gray-300" : "bg-gray-100 border-transparent"
                                                } sm:text-sm`}
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor={`medicine-timing-${index}`}
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Timing
                                            </label>
                                            <input
                                                type="text"
                                                id={`medicine-timing-${index}`}
                                                value={medicine.timing}
                                                onChange={e => handleMedicineChange(index, "timing", e.target.value)}
                                                readOnly={!isEditing}
                                                className={`mt-1 block w-full rounded-md shadow-sm ${
                                                    isEditing ? "border-gray-300" : "bg-gray-100 border-transparent"
                                                } sm:text-sm`}
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor={`medicine-duration-${index}`}
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Duration (days)
                                            </label>
                                            <input
                                                type="text"
                                                id={`medicine-duration-${index}`}
                                                value={medicine.duration}
                                                onChange={e => handleMedicineChange(index, "duration", e.target.value)}
                                                readOnly={!isEditing}
                                                className={`mt-1 block w-full rounded-md shadow-sm ${
                                                    isEditing ? "border-gray-300" : "bg-gray-100 border-transparent"
                                                } sm:text-sm`}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {["morning", "afternoon", "evening", "night"].map(time => (
                                            <div key={time}>
                                                <label
                                                    htmlFor={`medicine-${time}-${index}`}
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    {time.charAt(0).toUpperCase() + time.slice(1)}
                                                </label>
                                                <input
                                                    type="number"
                                                    id={`medicine-${time}-${index}`}
                                                    value={medicine.dosage[time]}
                                                    onChange={e => handleDosageChange(index, time, e.target.value)}
                                                    readOnly={!isEditing}
                                                    step="0.5"
                                                    min="0"
                                                    className={`mt-1 block w-full rounded-md shadow-sm ${
                                                        isEditing ? "border-gray-300" : "bg-gray-100 border-transparent"
                                                    } sm:text-sm`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    {isEditing && (
                                        <button
                                            onClick={() => deleteMedicine(index)}
                                            className="mt-2 inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Delete
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {isEditing && (
                            <button
                                onClick={addMedicine}
                                className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add Medicine
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionPage;
