import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import QRScanner from './component/qrscanner/QrScanner';
import Login from './component/auth/login/Login';
import Register from './component/auth/register/register';
import Home from './component/home/home';
import TablePage from './component/Menu/Menu';
import FormPage from './component/Menu/FormPage';

const App = () => {
  const [currentUser, setCurrentUser] = useState('');
  const [qrcode, setqrcode] = useState('');
  console.log("current user app.js", currentUser);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<QRScanner />} />
        <Route path="/login" element={<Login setCurrentUser={setCurrentUser} setqrcode={setqrcode} />} />
        <Route path="/register" element={<Register currentUser={currentUser} qrcode={qrcode} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/menu" element={<TablePage />} />
        <Route path="/form/:id" element={<FormPage currentUser={currentUser} />} />
      </Routes>
    </Router>
  );
};

export default App;
