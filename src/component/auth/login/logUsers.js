import { collection, doc, getDoc, setDoc } from 'firebase/firestore'; // Import all necessary functions
import { db } from '../../../firebase/firebase'; // Correct import path

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

// Function to add a new user to Firestore
export const addUserToFirestore = async (email) => {
  const usersCollection = collection(db, 'users');
  const userDocRef = doc(usersCollection, email);
  try {
    await setDoc(userDocRef, { email });
    console.log('User added to Firestore:', email);
  } catch (error) {
    console.error('Error adding user to Firestore:', error);
  }
};
