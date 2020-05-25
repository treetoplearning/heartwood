import firebase from "gatsby-plugin-firebase"
import "firebase/auth"
import "firebase/firestore"

const googleProvider = new firebase.auth.GoogleAuthProvider()
const githubProvider = new firebase.auth.GithubAuthProvider()

// add scopes to the githubProvider for account creation
githubProvider.addScope("repo")
githubProvider.addScope("user")

googleProvider.setCustomParameters({
  login_hint: "user@example.com",
})

export const generateUserDocument = async (user, additionalData) => {
  if (!user) return

  // get a reference to the user's document in the collection
  const userRef = firestore.doc(`users/${user.uid}`)
  const snapshot = await userRef.get()

  // if there is data then get it, otherwise write new data
  if (!snapshot.exists) {
    var { email, displayName, photoURL } = user
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        ...additionalData,
      })
    } catch (error) {
      console.error("Error creating user document", error)
    }
  }
  return getUserDocument(user.uid)
}

// access a Treetop account that has already been created
const getUserDocument = async (uid) => {
  if (!uid) return null
  try {
    const userDocument = await firestore.doc(`users/${uid}`).get()
    return {
      uid,
      ...userDocument.data(),
    }
  } catch (error) {
    console.error("Error fetching user", error)
  }
}

let firebaseAuth = ''
let firestoreAuth = ''

// link to remote firebase application
if (typeof window !== `undefined`) {
  let firebaseAuth = firebase.auth()
  let firestoreAuth = firebase.firestore()
}

export const auth = firebaseAuth
export const firestore = firestoreAuth

export const signOut = () => {
  firebase
    .auth()
    .signOut()
    .then(
      function () {
        console.log("Signed Out")
      },
      function (error) {
        console.error("Sign Out Error", error)
      }
    )
}

// determine how users will sign in with each platform

export const signInWithGoogle = () => {
  auth.signInWithRedirect(googleProvider)
}

export const signInWithGitHub = () => {
  auth.signInWithRedirect(githubProvider)
}
