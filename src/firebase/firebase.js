import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const googleProvider = new firebase.auth.GoogleAuthProvider();
const githubProvider = new firebase.auth.GithubAuthProvider();

// add scopes to the githubProvider for account creation
githubProvider.addScope('repo');
githubProvider.addScope('user');

googleProvider.setCustomParameters({
  'login_hint': 'user@example.com'
});

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
    var { email, displayName, photoURL } = user;
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

// access a Treetop account that has already been created
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

export const signOut = () => {

    firebase.auth().signOut().then(function() {
      console.log('Signed Out');
    }, function(error) {
      console.error('Sign Out Error', error);
    });
    
  
}

// determine how users will sign in with each platform

export const signInWithGoogle = () => {
    auth.signInWithRedirect(googleProvider)
};

export const signInWithGitHub = () => {
    auth.signInWithRedirect(githubProvider);
};