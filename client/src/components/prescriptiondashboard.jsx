import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Pencil, Trash2, PlusCircle, ArrowLeft, User, X, Save } from 'lucide-react';
import axios from 'axios';
import { storage } from '../firebaseConfig'; // Import Firebase storage
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const PrescriptionDashboard = () => {
  const userId = useParams().id;
  const [user, setUser] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [newPrescription, setNewPrescription] = useState({ title: '', imageUrl: '' });
  const [file, setFile] = useState(null); // New state to hold the image file
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser();
    fetchPrescriptions();
  }, [userId]);

  const fetchUser = async () => {
    try {
      // const response = await axios.get(`http://localhost:3001/api/users/${userId}`);
      setUser({name : "u1"});
    } catch (error) {
      setError('Error fetching user');
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/users/p/${userId}/prescriptions`);
      console.log('Prescriptions:', response.data);
      setPrescriptions(response.data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPrescription((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Set the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
        console.log('Please select a file');
        return;
    }

    const storageRef = ref(storage, `prescriptions/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
        'state_changed',
        (snapshot) => {
            // Progress can be tracked here if needed
        },
        (error) => {
            console.error('Error uploading image:', error);
        },
        async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            try {
              const medications = await axios.post('http://localhost:3001/api/extractimg/fetchimage', { imageUrl : downloadURL });
              
                const response = await axios.post(`http://localhost:3001/api/users/p/${userId}/newPrescription`, {
                    title: newPrescription.title,
                    imageUrl: downloadURL, 
                    ...medications.data.data// Use the Firebase URL here
                });

                console.log('New prescription added:',{
                  title: newPrescription.title,
                  imageUrl: downloadURL, 
                  ...medications.data.data// Use the Firebase URL here
            });

                // Now send the medications data to the backend
                console.log('xxxxxxxxxxxxxx', medications  );
                const medicationResponse = await axios.post(`http://localhost:3001/api/medicines/${response.data._id}`, 
                    medications.data.data ,
                    userId
                );

                // console.log('New medications added:', medicationResponse.data);
                setPrescriptions((prev) => [...prev, response.data]);
                setNewPrescription({ title: '', imageUrl: '' });
                setFile(null); // Clear the file input after submission
                setShowAddForm(false);
            } catch (error) {
                console.error('Error adding prescription or medications:', error);
            }
        }
    );
};

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/users/${userId}/prescriptions/${id}`);
      setPrescriptions(prescriptions.filter((prescription) => prescription.id !== id));
    } catch (error) {
      console.error('Error deleting prescription:', error);
    }
  };

  const handleEdit = (id) => {
    setEditMode(id);
  };

  const handleSaveEdit = async (id) => {
    try {
      const prescriptionToUpdate = prescriptions.find((p) => p.id === id);
      await axios.put(`http://localhost:3001/api/users/${userId}/prescriptions/${id}`, prescriptionToUpdate);
      setEditMode(null);
    } catch (error) {
      console.error('Error updating prescription:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8 text-yellow-400 text-center">
        Loading...
      </div>
    );
  }

  const handleEditChange = (e, id, field) => {
    const { value } = e.target;
    setPrescriptions((prevPrescriptions) =>
      prevPrescriptions.map((prescription) =>
        prescription.id === id ? { ...prescription, [field]: value } : prescription
      )
    );
  };

  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-8 text-red-400 text-center">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 p-8 text-yellow-400 text-center">
        User not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <Link to="/" className="text-yellow-400 flex items-center mb-4 hover:text-yellow-300">
        <ArrowLeft className="mr-2" /> Back to Users
      </Link>
      <div className="flex items-center justify-center mb-8">
        <div className="relative w-24 h-24 mr-4">
          <img
            src={user.imageUrl}
            alt={user.name}
            className="w-full h-full rounded-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center">
            <User className="h-12 w-12 text-white opacity-75" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-yellow-400">
          {user.name}'s Prescriptions
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {prescriptions.map((prescription) => (
          <Link to={`/${userId}/prescriptions/${prescription._id}`} key={prescription.id}>
          <div key={prescription.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                {editMode === prescription.id ? (
                  <input
                    type="text"
                    value={prescription.title}
                    onChange={(e) => handleEditChange(e, prescription.id, 'title')}
                    className="bg-gray-700 text-yellow-400 px-2 py-1 rounded w-2/3"
                  />
                ) : (
                  <h2 className="text-xl font-semibold text-yellow-400">{prescription.title}</h2>
                )}
                <div className="flex space-x-2">
                  {editMode === prescription.id ? (
                    <button
                      onClick={() => handleSaveEdit(prescription.id)}
                      className="text-green-500 hover:text-green-400"
                    >
                      <Save className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(prescription.id)}
                      className="text-yellow-400 hover:text-yellow-300"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(prescription.id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <img
                src={prescription.imageUrl}
                alt={prescription.title}
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
          </div>
           </Link>
        ))}
      </div>
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="fixed bottom-8 right-8 bg-yellow-400 text-gray-900 rounded-full p-4 shadow-lg hover:bg-yellow-300 focus:outline-none"
      >
        {showAddForm ? <X className="h-8 w-8" /> : <PlusCircle className="h-8 w-8" />}
      </button>
      {showAddForm && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-8 shadow-lg">
          <h3 className="text-xl text-yellow-400 mb-4">Add New Prescription</h3>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input
              type="text"
              name="title"
              value={newPrescription.title}
              onChange={handleInputChange}
              placeholder="Prescription Title"
              className="bg-gray-700 text-yellow-400 px-4 py-2 rounded"
            />
            <input
              type="file"
              onChange={handleFileChange}
              className="bg-gray-700 text-yellow-400 px-4 py-2 rounded"
            />
            <button
              type="submit"
              className="bg-yellow-400 text-gray-900 px-4 py-2 rounded hover:bg-yellow-300"
            >
              Save Prescription
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PrescriptionDashboard;
