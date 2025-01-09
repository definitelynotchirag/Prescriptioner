import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserDashboard from './components/dashboard';
import PrescriptionDashboard from './components/prescriptiondashboard';
import PrescriptionPage from './components/prescription';// New import
import MedicationForm from './components/MedicationForm';
import MedicationList from './components/MedicationList';
import LandingPage from '../src/components/landingPage';
import Login from '../src/components/login';
import Signup from '../src/components/signup';  
import './styles.css';
import  { useState , useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";




const App = () => {
  const navigate = useNavigate();
  
  const [user, setUser] = useState({});   

  useEffect(() => { 
    const autoLogin = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("token not");
          navigate("/login"); 
        }

        console.log("dchirag", token);

        const response = await axios.post(
          "http://localhost:3001/api/rootuser/autoLogin",
          {token}
        );

        
        if (response.data.success) {
          
         // localStorage.setItem("user", JSON.stringify(response.data.data));
          setUser(response.data.data, "dsfdsfds");
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Axios request error in app.js:", error);
      }
    };

    autoLogin(); 
  }, []);

  
  

  


  const handleMedicationAdded = (medication) => {
    console.log('Medication added:', medication);
  };

  return (
  
      <Routes>
      <Route path="/" element={<LandingPage user ={user } setUser={setUser} />} />
        <Route path="/dashboard" element={<UserDashboard user={user } />} />
        <Route path="/:id" element={<PrescriptionDashboard user= {user} />} />
        <Route path="/:username/:prescriptionTitle" element={<PrescriptionPage users={user} />} />
        <Route path="/login" element={<Login user={user } setUser = {setUser} />} />
        <Route path="/signup" element={<Signup user={user} />} />
        
        <Route path="/:id" element={<PrescriptionDashboard user={user} />} />
        <Route path="/:userId/prescriptions/:prescriptionId" element={<PrescriptionPage user={user} />} />
      </Routes>
    
  );
};

export default App;
