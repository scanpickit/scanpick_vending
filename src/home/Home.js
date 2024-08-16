import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../Supabase/supabaseClient';
import '../index.css'

const Home = ({handleLogout}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    state: '',
    longitude: '',
    latitude: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Fetch the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
  
    if (userError) {
      console.error('Error fetching user:', userError.message);
      return;
    }
  
    if (!user) {
      console.error('User is not authenticated');
      return;
    }
  
    const userEmail = user.email;
  
    // Insert data into the table
    const { data, error } = await supabase
      .from('user_details')
      .insert([
        {
          user_id: user.id,  // User ID from Supabase auth
          name: formData.name,
          city: formData.city,
          state: formData.state,
          longitude: parseFloat(formData.longitude),
          latitude: parseFloat(formData.latitude),
          email: userEmail // Add email to the data
        }
      ]);
  
    if (error) {
      console.error('Error inserting data:', error.message);
      alert('Data insertion failed');
    } else {
      console.log('Data inserted:', data);
      navigate('/dashboard'); // Redirect to /dashboard on successful data insertion
    }
  };
  
  

  return (
    <div className="home-container">
      <h2>Home</h2>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="state">State:</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="longitude">Longitude:</label>
          <input
            type="number"
            step="any"
            id="longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="latitude">Latitude:</label>
          <input
            type="number"
            step="any"
            id="latitude"
            name="latitude"
            value={formData.latitude}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
  
};

export default Home;
