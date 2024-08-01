import React from 'react';
import { doSignOut } from '../../firebase/auth';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await doSignOut(); // Call the sign-out function
      navigate('/'); // Redirect to the login page after sign-out
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="home-container">
      <h1>Home</h1>
      <button className="logout-button" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
};

export default Home;
