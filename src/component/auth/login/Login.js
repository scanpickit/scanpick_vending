import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { doSignInWithGoogle } from '../../../firebase/auth';
import { useAuth } from '../../../contexts/authContext';
import './Login.css'; 
import { Link } from 'react-router-dom';
import { checkUserExists, addUserToFirestore } from '../login/logUsers';

const Login = ({ setCurrentUser,setqrcode }) => {
  const { userLoggedIn } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [redirectPath, setRedirectPath] = useState(null);
  const location = useLocation();
  const qrCode = location.state?.qrCode;

  setqrcode(qrCode);

  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        const result = await doSignInWithGoogle();
        const user = result.user;

        if (user) {
          const email = user.email;
          setCurrentUser(email); 
          console.log(email)
          const userExists = await checkUserExists(email);

          if (userExists) {
            setRedirectPath('/home');
          } else {
            // Add user to Firestore if they don't exist
            await addUserToFirestore(email);
            setRedirectPath('/register');
          }
        } else {
          setErrorMessage('Sign in failed. Please try again.');
        }
      } catch (err) {
        setErrorMessage('Sign in failed. Please try again.');
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  // Redirect based on redirectPath
  if (userLoggedIn) {
    console.log(userLoggedIn)
    if (redirectPath) {
      return <Navigate to={redirectPath} />;
    }
  }

  return (
    <div className="login-container">
      <div className="login-box"> 
        <h2>Sign In</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button 
          className="google-signin-button"
          onClick={onGoogleSignIn}
          disabled={isSigningIn}
        >
          {isSigningIn ? 'Signing In...' : 'Sign In with Google'}
        </button>
        <div className="link-container">
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
