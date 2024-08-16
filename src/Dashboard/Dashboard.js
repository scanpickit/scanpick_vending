import React, { useEffect, useState } from 'react';
import { supabase } from '../Supabase/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [qrCodes, setQrCodes] = useState([]);
  const [selectedQrCode, setSelectedQrCode] = useState(null);

  useEffect(() => {
    const fetchQrCodes = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error fetching user:', userError.message);
        return;
      }

      if (user) {
        const { data, error } = await supabase
          .from('user_qrcodes')
          .select('qr_code')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching QR codes:', error.message);
        } else {
          setQrCodes(data);
        }
      }
    };

    fetchQrCodes();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
    } else {
      console.log('Sign out completed');
      navigate('/login');
    }
  };

  const handleQrCodeChange = (event) => {
    setSelectedQrCode(event.target.value);
  };

  const handleNumberClick = (itemNumber) => {
    if (selectedQrCode) {
      navigate(`/item-details/${selectedQrCode}/${itemNumber}`);
    }
  };
  

  const numbers = Array.from({ length: 13 }, (_, i) => i + 1);

  return (
    <div>
      <h1>Dashboard</h1>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <div>
        <h2>Select QR Code</h2>
        <select onChange={handleQrCodeChange} value={selectedQrCode}>
          <option value="">Select QR Code</option>
          {qrCodes.map((item) => (
            <option key={item.qr_code} value={item.qr_code}>
              {item.qr_code}
            </option>
          ))}
        </select>
      </div>
      {selectedQrCode && (
        <div>
          <h2>Item Numbers</h2>
          <table>
            <tbody>
              <tr>
                {numbers.slice(0, 7).map((number) => (
                  <td
                    key={number}
                    onClick={() => handleNumberClick(number)}
                    style={{ cursor: 'pointer', padding: '10px', border: '1px solid #ccc' }}
                  >
                    {number}
                  </td>
                ))}
              </tr>
              <tr>
                {numbers.slice(7).map((number) => (
                  <td
                    key={number}
                    onClick={() => handleNumberClick(number)}
                    style={{ cursor: 'pointer', padding: '10px', border: '1px solid #ccc' }}
                  >
                    {number}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;