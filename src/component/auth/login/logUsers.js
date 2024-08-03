import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';

// Function to create a user document in the 'users' collection
export const createUserDocument = async (email) => {
  const userDocRef = doc(db, 'users', email);
  try {
    await setDoc(userDocRef, { email });
    console.log('User document created in Firestore:', email);
  } catch (error) {
    console.error('Error creating user document in Firestore:', error);
  }
};

// Function to create 'Account' collection and 'Details' document
export const createAccountDetails = async (email) => {
  const detailsDocRef = doc(db, 'users', email, 'Account', 'Details');
  try {
    await setDoc(detailsDocRef, {}); // Initialize with empty or default data
    console.log('Account and Details document created in Firestore for:', email);
  } catch (error) {
    console.error('Error creating Account and Details document in Firestore:', error);
  }
};

// Function to check if a user exists in the 'users' collection
export const checkUserExists = async (email) => {
  const userDocRef = doc(db, 'users', email);
  try {
    const docSnapshot = await getDoc(userDocRef);
    return docSnapshot.exists();
  } catch (error) {
    console.error('Error checking user existence:', error);
    return false;
  }
};

// Function to add or update QR codes in Firestore
export const addQrCodeToFirestore = async (email, qrCode) => {
  const userDocRef = doc(db, 'users', email, 'Account', 'Details');
  try {
    const userSnapshot = await getDoc(userDocRef);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      const qrFields = Object.keys(userData).filter(key => key.startsWith('qr'));
      
      // Check if the new QR code already exists
      const qrCodeExists = qrFields.some(key => userData[key] === qrCode);
      if (qrCodeExists) {
        console.log('QR code already exists.');
        return;
      }
      
      // Determine the next QR field
      const nextFieldIndex = qrFields.length + 1;
      const nextFieldName = `qr${nextFieldIndex}`;
      
      await updateDoc(userDocRef, { [nextFieldName]: qrCode });
      console.log(`Added ${nextFieldName} to Firestore.`);
    } else {
      throw new Error('User does not exist.');
    }
  } catch (error) {
    console.error('Error adding QR code to Firestore:', error);
  }
};
