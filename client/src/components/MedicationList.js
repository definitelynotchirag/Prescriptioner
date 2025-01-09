// src/components/MedicationList.js
import React, { useEffect, useState } from 'react';

const MedicationList = () => {
    const [medications, setMedications] = useState([]);

    const fetchMedications = async () => {
        try {
            const response = await fetch('http://localhost:3001/medications');
            if (response.ok) {
                const data = await response.json();
                setMedications(data);
            } else {
                console.error('Failed to fetch medications');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchMedications();
    }, []);

    return (
        <div>
            <h2 className="text-xl mb-2">Medication List</h2>
            <ul>
                {medications.map((med) => (
                    <li key={med._id} className="border p-2 mb-2 rounded">
                        <p><strong>Name:</strong> {med.name}</p>
                        <p><strong>Dosage:</strong> {med.dosage}</p>
                        <p><strong>Method:</strong> {med.method}</p>
                        <p><strong>Frequency:</strong> {med.frequency}</p>
                        <p><strong>Start Date:</strong> {new Date(med.startDate).toLocaleDateString()}</p>
                        <p><strong>End Date:</strong> {new Date(med.endDate).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MedicationList;
