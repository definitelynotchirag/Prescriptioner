// src/components/MedicationList.js
import { AlertCircle, Calendar, CheckCircle2, Clock, MoreVertical, Pill } from "lucide-react";
import { useEffect, useState } from "react";

const MedicationList = () => {
    const [medications, setMedications] = useState([]);

    const fetchMedications = async () => {
        try {
            const response = await fetch("http://localhost:3001/medications");
            if (response.ok) {
                const data = await response.json();
                setMedications(data);
            } else {
                console.error("Failed to fetch medications");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchMedications();
    }, []);

    const isActiveMedication = endDate => {
        return new Date(endDate) >= new Date();
    };

    const getDaysRemaining = endDate => {
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-500 rounded-lg">
                        <Pill className="w-6 h-6 text-gray-900" />
                    </div>
                    <h2 className="text-2xl font-bold text-yellow-400">Current Medications</h2>
                </div>
                <span className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-sm">
                    {medications.length} {medications.length === 1 ? "medication" : "medications"}
                </span>
            </div>

            {medications.length === 0 ? (
                <div className="text-center py-12">
                    <div className="bg-gray-700/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Pill className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-lg">No medications added yet</p>
                    <p className="text-gray-500 text-sm mt-2">Add your first medication to get started</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {medications.map(med => {
                        const isActive = isActiveMedication(med.endDate);
                        const daysRemaining = getDaysRemaining(med.endDate);

                        return (
                            <div
                                key={med._id}
                                className="bg-gray-700/40 backdrop-blur-sm rounded-xl p-5 border border-gray-600/50 hover:border-gray-500/50 transition-all duration-200 group"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        {/* Medication Name & Status */}
                                        <div className="flex items-center space-x-3 mb-3">
                                            <h3 className="text-xl font-semibold text-gray-100">{med.name}</h3>
                                            <div
                                                className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                                                    isActive
                                                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                                                }`}
                                            >
                                                {isActive ? (
                                                    <CheckCircle2 className="w-3 h-3" />
                                                ) : (
                                                    <AlertCircle className="w-3 h-3" />
                                                )}
                                                <span>{isActive ? "Active" : "Expired"}</span>
                                            </div>
                                        </div>

                                        {/* Medication Details Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-2 text-gray-300">
                                                    <Pill className="w-4 h-4 text-yellow-400" />
                                                    <span className="text-sm font-medium text-gray-400">Dosage:</span>
                                                    <span className="text-sm">{med.dosage}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-gray-300">
                                                    <Clock className="w-4 h-4 text-yellow-400" />
                                                    <span className="text-sm font-medium text-gray-400">
                                                        Frequency:
                                                    </span>
                                                    <span className="text-sm">{med.frequency}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-2 text-gray-300">
                                                    <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                                                        <span className="text-xs text-gray-900 font-bold">M</span>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-400">Method:</span>
                                                    <span className="text-sm capitalize">{med.method}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-gray-300">
                                                    <Calendar className="w-4 h-4 text-yellow-400" />
                                                    <span className="text-sm font-medium text-gray-400">Duration:</span>
                                                    <span className="text-sm">
                                                        {new Date(med.startDate).toLocaleDateString()} -{" "}
                                                        {new Date(med.endDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Days Remaining */}
                                        {isActive && (
                                            <div
                                                className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${
                                                    daysRemaining <= 7
                                                        ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                                                        : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                                }`}
                                            >
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    {daysRemaining > 0
                                                        ? `${daysRemaining} ${
                                                              daysRemaining === 1 ? "day" : "days"
                                                          } remaining`
                                                        : "Ends today"}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Menu */}
                                    <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-600/50 rounded-lg transition-colors duration-200 opacity-0 group-hover:opacity-100">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MedicationList;
