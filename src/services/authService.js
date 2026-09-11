import { auth } from "../firebase/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    updateProfile,
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

// --------------------------------
// Sign up with email & password
// --------------------------------
export const signUp = async (fullName, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // attach the user's name to their auth profile
    if (fullName) {
        await updateProfile(userCredential.user, { displayName: fullName });
    }

    return userCredential.user;
};

// --------------------------------
// Log in with email & password
// --------------------------------
export const logIn = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

// --------------------------------
// Log in with Google
// --------------------------------
export const logInWithGoogle = async () => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    return userCredential.user;
};

// --------------------------------
// Log out
// --------------------------------
export const logOut = async () => {
    await signOut(auth);
};

// --------------------------------
// Subscribe to auth state changes
// Calls callback(user) whenever login state changes (login, logout, refresh)
// Returns an unsubscribe function
// --------------------------------
export const subscribeToAuthChanges = (callback) => {
    return onAuthStateChanged(auth, callback);
};