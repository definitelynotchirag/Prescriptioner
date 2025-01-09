// src/components/MedicationForm.js
import React, { useState } from 'react';

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
            const response = await fetch('http://localhost:3001/medications', {
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
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Medication Name"
                className="border p-2 rounded w-full mb-2"
                required
            />
            <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                placeholder="Dosage"
                className="border p-2 rounded w-full mb-2"
                required
            />
            <input
                type="text"
                name="method"
                value={formData.method}
                onChange={handleChange}
                placeholder="Method"
                className="border p-2 rounded w-full mb-2"
                required
            />
            <input
                type="text"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                placeholder="Frequency"
                className="border p-2 rounded w-full mb-2"
                required
            />
            <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="border p-2 rounded w-full mb-2"
                required
            />
            <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="border p-2 rounded w-full mb-2"
                required
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Medication</button>
        </form>
    );
};

export default MedicationForm;
