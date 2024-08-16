import './App.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import QRScanner from './qrscanner/QrScanner';
import Login from './Login/login';
import Signup from './Login/Signup';
import Home from './home/Home';
import { useState, useEffect } from 'react';
import { supabase } from './Supabase/supabaseClient';
import Dashboard from './Dashboard/Dashboard';
import ItemDetails from './Dashboard/ItemDetails';
// Component to handle email confirmation
function ConfirmEmail() {
  const navigate = useNavigate();

  useEffect(() => {
    const confirmEmail = async () => {
      const params = new URLSearchParams(window.location.search);
      const tokenHash = params.get('token_hash');
      const type = params.get('type');

      if (tokenHash && type) {
        const { error } = await supabase.auth.api.verifyEmail(tokenHash, type);

        if (error) {
          console.error('Error confirming email:', error.message);
        } else {
          // Check authentication status
          const user = supabase.auth.user();
          if (user) {
            navigate('/home'); // Redirect to the home page after successful confirmation
          } else {
            navigate('/login');
          }
        }
      }
    };

    confirmEmail();
  }, [navigate]);

  return <div>Confirming email...</div>;
}

// Component to handle routes
function RoutesComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Move this inside RoutesComponent
  const [qrCode, setQrCode] = useState("");


  console.log("app.js : ",qrCode);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
    } else {
      console.log('Sign out completed');
      navigate('/login');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error('Error:', error.message);
    } else {
      console.log('User:', data.user);
      navigate('/home'); // Redirect to home page after successful login
    }
  };

  return (
    <Routes>
      <Route path="/" element={<QRScanner qrCode={qrCode} setQrCode={setQrCode} />} />
      <Route
        path="/login"
        element={
          <Login
            handleSubmit={handleSubmit}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            qrCode={qrCode}
            setQrCode={setQrCode}
          />
        }
      />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home handleLogout={handleLogout} />} />
      <Route path="/auth/confirm" element={<ConfirmEmail />} /> {/* Route for email confirmation */}
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path="/item-details/:qrCode/:itemNumber" element={<ItemDetails />} />

    </Routes>
  );
}

function App() {

  return (
    <Router>
      <RoutesComponent />
    </Router>
  );
}

export default App;