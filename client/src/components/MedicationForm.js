// src/components/MedicationForm.js
import React, { useState } from 'react';
import { PlusCircle, Calendar, Clock, Pill, Stethoscope } from 'lucide-react';
import { API_BASE_URL } from "../config/api";

const MedicationForm = ({ onMedicationAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        dosage: '',
        method: '',
        frequency: '',
        startDate: '',
        endDate: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/medications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const data = await response.json();
                onMedicationAdded(data.medication);
                setFormData({
                    name: '',
                    dosage: '',
                    method: '',
                    frequency: '',
                    startDate: '',
                    endDate: ''
                });
                
            } else {
                console.error('Failed to create medication reminder');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div className="bg-[#00030b] backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-xl">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-yellow-500 rounded-lg">
                    <PlusCircle className="w-6 h-6 text-gray-900" />
                </div>
                <h2 className="text-2xl font-bold text-yellow-400">
                    Add New Medication
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Medication Name */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Pill className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Medication Name"
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all duration-200"
                        required
                    />
                </div>

                {/* Dosage */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Stethoscope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        name="dosage"
                        value={formData.dosage}
                        onChange={handleChange}
                        placeholder="Dosage (e.g., 500mg)"
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all duration-200"
                        required
                    />
                </div>

                {/* Method */}
                <div>
                    <select
                        name="method"
                        value={formData.method}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-100 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all duration-200"
                        required
                    >
                        <option value="" className="text-gray-400">Select Method</option>
                        <option value="oral">Oral</option>
                        <option value="injection">Injection</option>
                        <option value="topical">Topical</option>
                        <option value="inhaler">Inhaler</option>
                        <option value="drops">Drops</option>
                    </select>
                </div>

                {/* Frequency */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleChange}
                        placeholder="Frequency (e.g., 3 times daily)"
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all duration-200"
                        required
                    />
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-100 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all duration-200"
                            required
                        />
                        <label className="absolute -top-2 left-3 px-1 bg-gray-800 text-xs text-gray-400">Start Date</label>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-100 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all duration-200"
                            required
                        />
                        <label className="absolute -top-2 left-3 px-1 bg-gray-800 text-xs text-gray-400">End Date</label>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-xl hover:bg-yellow-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                    <PlusCircle className="w-5 h-5" />
                    <span>Add Medication</span>
                </button>
            </form>
        </div>
)};

export default MedicationForm;
