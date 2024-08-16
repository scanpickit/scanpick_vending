import React, { useState, useEffect } from 'react';
import '../index.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../Supabase/supabaseClient';

const Login = ({ email, setEmail, password, setPassword, qrCode, setQrCode }) => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Retrieve QR code from location state if it exists
    if (location.state && location.state.qrCode) {
      setQrCode(location.state.qrCode);
    }
  }, [location.state, setQrCode]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Sign in the user
    const { data: userData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (signInError) {
      setError(signInError.message);
      return;
    }

    const userId = userData.user.id;

    // Check if the user exists in user_details
    const { data: userDetails, error: userDetailsError } = await supabase
      .from('user_details')
      .select('id')
      .eq('user_id', userId);

    if (userDetailsError) {
      console.error('Error checking user details:', userDetailsError.message);
      setError('Error checking user details.');
      return;
    }

    if (!userDetails || userDetails.length === 0) {
      // User does not exist in user_details, redirect to Home page
      navigate('/home');
      return;
    }

    // Check if the QR code exists in user_qrcodes
    const { data: qrCodes, error: qrCodeError } = await supabase
      .from('user_qrcodes')
      .select('qr_code')
      .eq('user_id', userId)
      .eq('qr_code', qrCode);

    if (qrCodeError) {
      console.error('Error checking QR codes:', qrCodeError.message);
      setError('Error checking QR codes.');
      return;
    }

    if (qrCodes && qrCodes.length > 0) {
      // QR code exists, redirect to Dashboard
      navigate('/dashboard');
    } else {
      // QR code does not exist, add it to the table
      const { error: insertError } = await supabase
        .from('user_qrcodes')
        .insert([
          {
            user_id: userId,
            qr_code: qrCode
          }
        ]);

      if (insertError) {
        console.error('Error inserting QR code:', insertError.message);
        setError('Data insertion failed.');
      } else {
        console.log('QR code inserted:', qrCode);
        navigate('/dashboard');
      }
    }
  };

  return (
    <main>
      <div className="login-container">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Login</button>
          <p className="signup-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default Login;
