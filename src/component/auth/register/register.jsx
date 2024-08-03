import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { doSignOut } from '../../../firebase/auth';

const Register = ({ currentUser, qrcode }) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = currentUser; 
    console.log("register page current user", currentUser);
    console.log("register page email", email);

    try {
      // Save user details and QR code data to Firestore
      await updateDoc(doc(db, 'users', email, 'Account', 'Details'), {
        name,
        city,
        state,
        
      });
      console.log('User data saved successfully');
      navigate('/home'); // Redirect to home or another page after registration
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await doSignOut(); // Call the sign-out function
      navigate('/'); // Redirect to the login page after sign-out
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            City:
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </label>
          <label>
            State:
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </label>
          <button type="submit">Submit</button>
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
