// FirebaseFunctions.js
import { database } from './firebase'; // Ensure this path is correct
import { addDoc, collection, doc, serverTimestamp, getDoc } from 'firebase/firestore';

// Gemmer brugerens profildata i databasen (Firestore)
const saveUserProfileData = async (userId, profileData) => {
    try {
        // Opretter en reference til brugerens dokument og profildatakollektion
        const userDocRef = doc(database, 'users', userId);
        const profileDataRef = collection(userDocRef, 'profileData');

        // Tilføjer profildata til databasen med et timestamp
        await addDoc(profileDataRef, {
            ...profileData,
            timestamp: serverTimestamp() // Bruger serverTimestamp() til at sikre at timestamp er ens på alle enheder
        });
        console.log('Profile data saved successfully');
    } catch (error) {
        console.error('Error saving profile data:', error);
    }
};

// Indlæser de seneste profildata fra databasen (Firestore)
const loadUserProfileData = async (userId) => {
    try {

        // Opretter referencer til brugerens dokument og profildata
        const userDocRef = doc(database, 'users', userId);
        const profileDataRef = doc(userDocRef, 'profileData');
        const docSnap = await getDoc(profileDataRef);

        // Tjekker om dokumentet eksisterer og returnerer profildata
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            return docSnap.data(); // Retunerer de nyeste profildata
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


