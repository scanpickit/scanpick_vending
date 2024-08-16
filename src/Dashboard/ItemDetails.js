import React, { useEffect, useState } from 'react';
import { supabase } from '../Supabase/supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';
import { uploadFile } from './fileupload'; // Import the correct function

const ItemDetails = () => {
  const { qrCode, itemNumber } = useParams();
  const navigate = useNavigate();
  const [itemDetails, setItemDetails] = useState({
    item_number: itemNumber,
    qr_code: qrCode,
    item_name: '',
    item_price: '',
    box_size: '',
    heating_time_seconds: '',
    image_url: '' // This will be updated with the file URL
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      const { data, error } = await supabase
        .from('item_details')
        .select('*')
        .eq('qr_code', qrCode)
        .eq('item_number', itemNumber)
        .single();

      if (error) {
        console.error('Error fetching item details:', error.message);
      } else {
        setItemDetails(data || {
          item_number: itemNumber,
          qr_code: qrCode,
          item_name: '',
          item_price: '',
          box_size: '',
          heating_time_seconds: '',
          image_url: ''
        });
      }
      setIsLoading(false);
    };

    fetchItemDetails();
  }, [qrCode, itemNumber]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setItemDetails((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let imageUrl = itemDetails.image_url; // Preserve the existing image URL if no new file

      if (file) {
        // Upload the new file and get the URL
        imageUrl = await uploadFile(file);
      }

      // Update the item details with the new image URL
      const updatedItemDetails = { ...itemDetails, image_url: imageUrl };

      const { error } = await supabase
        .from('item_details')
        .upsert(updatedItemDetails, { onConflict: ['qr_code', 'item_number'] });

      if (error) {
        throw error;
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating item details:', error.message);
    }
  };

  return (
    <div>
      <h1>Item Details</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Item Number:
            <input
              type="number"
              name="item_number"
              value={itemDetails.item_number}
              onChange={handleChange}
              readOnly
            />
          </label>
          <br />
          <label>
            Item Name:
            <input
              type="text"
              name="item_name"
              value={itemDetails.item_name}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Item Price:
            <input
              type="number"
              name="item_price"
              value={itemDetails.item_price}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Box Size:
            <input
              type="text"
              name="box_size"
              value={itemDetails.box_size}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Heating Time (seconds):
            <input
              type="number"
              name="heating_time_seconds"
              value={itemDetails.heating_time_seconds}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Image URL:
            <input
              type="file"
              name="image_url"
              onChange={handleFileChange}
            />
          </label>
          <br />
          <button type="submit">Save</button>
        </form>
      )}
    </div>
  );
};

export default ItemDetails;
