import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { doSignInWithGoogle } from '../../../firebase/auth';
import { useAuth } from '../../../contexts/authContext';
import './Login.css'; 
import { Link } from 'react-router-dom';
import { checkUserExists, createUserDocument, createAccountDetails, addQrCodeToFirestore } from '../login/logUsers'; // Adjust the path accordingly

const Login = ({ setCurrentUser, setqrcode }) => {
  const { userLoggedIn } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [redirectPath, setRedirectPath] = useState(null);
  const location = useLocation();
  const qrCode = location.state?.qrCode;

  useEffect(() => {
    setqrcode(qrCode);
  }, [qrCode, setqrcode]);

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
          console.log(email);
          
          const userExists = await checkUserExists(email);

          if (userExists) {
            // If user exists, add the new QR code
            await addQrCodeToFirestore(email, qrCode);
            setRedirectPath('/home');
          } else {
            // Create user document and account details if user doesn't exist
            await createUserDocument(email);
            await createAccountDetails(email);
            await addQrCodeToFirestore(email, qrCode);
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
