import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

const FormPage = ({ currentUser }) => {
  const { id } = useParams(); // ID from the URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemName: '',
    price: '',
    quantity: '',
    size: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      console.error('User not logged in.');
      return;
    }

    try {
      // Store the form data in Firestore under the specified path
      const userDocRef = doc(db, 'users', currentUser, 'Menu', id);
      
      // You may need to handle file uploads separately
      // Here, we're assuming you handle image uploads elsewhere and store the URL in `formData.image`
      
      await setDoc(userDocRef, {
        itemName: formData.itemName,
        price: formData.price,
        quantity: formData.quantity,
        size: formData.size,
        image: formData.image ? formData.image.name : null, // Store image name or URL if uploaded
      });

      console.log('Form data saved successfully');
      navigate('/'); // Redirect after saving data
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };

  return (
    <div>
      <h1>Form for Item {id}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Item Name:
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Quantity:
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Size of Box:
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Image Upload:
          <input
            type="file"
            name="image"
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FormPage;
