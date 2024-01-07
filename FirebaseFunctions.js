// FirebaseFunctions.js
import { database } from './firebase'; // Ensure this path is correct
import { addDoc, collection, doc, serverTimestamp, getDoc } from 'firebase/firestore';

// Save user's profile data
const saveUserProfileData = async (userId, profileData) => {
    try {
        const userDocRef = doc(database, 'users', userId);
        const profileDataRef = collection(userDocRef, 'profileData');
        await addDoc(profileDataRef, {
            ...profileData,
            timestamp: serverTimestamp() // Use serverTimestamp from firestore
        });
        console.log('Profile data saved successfully');
    } catch (error) {
        console.error('Error saving profile data:', error);
    }
};

// Load the latest profile data for a user
const loadUserProfileData = async (userId) => {
    try {
        const userDocRef = doc(database, 'users', userId);
        const profileDataRef = doc(userDocRef, 'profileData');
        const docSnap = await getDoc(profileDataRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            return docSnap.data(); // Returns the latest profile data
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error('Error loading profile data:', error);
        return null;
    }
};

export { saveUserProfileData, loadUserProfileData };
