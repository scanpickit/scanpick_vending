import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../Supabase/supabaseClient';

const Verification = () => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(180); // 3 minutes
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    
    if (accessToken) {
      const verifyEmail = async () => {
        const { error } = await supabase.auth.api.updateUserById(accessToken, { email_confirmed_at: new Date() });
        if (!error) {
          setEmailVerified(true);
        }
      };

      verifyEmail();
    }

    // Start a countdown timer
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!emailVerified) {
            alert('Verification failed.');
            navigate('/login');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate, emailVerified]);

  useEffect(() => {
    if (emailVerified) {
      navigate('/home');
    }
  }, [emailVerified, navigate]);

  return (
    <div>
      <h2>Verifying your email...</h2>
      <p>Time remaining: {timer} seconds</p>
    </div>
  );
};

export default Verification;
