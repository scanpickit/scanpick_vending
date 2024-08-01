import { sendEmailVerification, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from "firebase/auth";
import { auth, db } from "./firebase";
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';

// Function to sign in with Google
export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        return result; // Return the result of the sign-in
    } catch (error) {
        console.error("Error signing in with Google:", error);
        throw error;
    }
};

// Function to sign out
export const doSignOut = () => {
    return firebaseSignOut(auth);
};

// Function to send email verification
export const doSendEmailVerification = () => {
    if (auth.currentUser) {
        return sendEmailVerification(auth.currentUser, {
            url: `${window.location.origin}/home`,
        });
    } else {
        throw new Error("No user is currently signed in.");
    }
};


