import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { navigate } from "@reach/router"

const provider = new firebase.auth.GoogleAuthProvider();

var firebaseConfig = {
    apiKey: "AIzaSyAa6IFn725sIJVVVk-4-XJL84DNZcTTpjE",
    authDomain: "treetop-learning-1589657684780.firebaseapp.com",
    databaseURL: "https://treetop-learning-1589657684780.firebaseio.com",
    projectId: "treetop-learning-1589657684780",
    storageBucket: "treetop-learning-1589657684780.appspot.com",
    messagingSenderId: "668994241265",
    appId: "1:668994241265:web:c48ca701a737cd8098df50",
    measurementId: "G-47T19JXV8Y"
  };

firebase.initializeApp(firebaseConfig);


// link to remote firebase application
export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const generateUserDocument = async (user, additionalData) => {
  if (!user) return;

  // get a reference to the user's document in the collection
  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();

  // if there is data then get it, otherwise write new data
  if (!snapshot.exists) {
    const { email, displayName, photoURL } = user;
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        ...additionalData
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return getUserDocument(user.uid);
};

const getUserDocument = async uid => {
  if (!uid) return null;
  try {
    const userDocument = await firestore.doc(`users/${uid}`).get();
    return {
      uid,
      ...userDocument.data()
    };
  } catch (error) {
    console.error("Error fetching user", error);
  }
};

// determine how users will sign in
export const signInWithGoogle = () => {
    
    auth.signInWithRedirect(provider)
  };

