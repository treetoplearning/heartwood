import firebase from "gatsby-plugin-firebase"

import { signUpComplete } from "../utils/utils"

let auth, firestore

if (typeof window !== `undefined`) {
  auth = firebase.auth()
  firestore = firebase.firestore()
}

export { auth, firestore }

const googleProvider = new firebase.auth.GoogleAuthProvider()
const githubProvider = new firebase.auth.GithubAuthProvider()

// add scopes to the githubProvider for account creation
githubProvider.addScope("repo")
githubProvider.addScope("user")

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

export const prepareUserInformation = async (user) => {

  console.log('in prepare')

  // link the user to their saved preferencs in firestore
  const res = await getUserDocument(user.uid)
  console.log('res is', res)
  if (signUpComplete(res)) {
    
    // the account already exists (sign in)
    console.log("top")

    // update the user that will be stored in state
    const returningUser = {
      ...user,
      firstName: res.firstName,
      lastName: res.lastName,
      userName: res.userName,
      dateOfBirth: res.dateOfBirth,
      email: res.email
    }

    return returningUser

  } else {

    console.log("bot")
    
    // the account does not exist (sign up)

    let displayName = ""
    let firstName = ""
    let lastName = ""

    // only parse for first/last names if sign-in provider
    if (user.displayName != null) {
      const splitNames = user.displayName.split(" ")
      firstName = splitNames[0]
      lastName = String(splitNames.slice(1, splitNames.length)).replace(/,/g, " ")
    }

    // generate a document with blanks to be filled
    await generateUserDocument(user, {
      userName: "",
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: "",
      email: user.email
    })

    const editedUser = { ...user, firstName: firstName, lastName: lastName, userName: "", dateOfBirth: "", email: user.email}

    return editedUser
  }
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

export const signOut = () => {
  auth.signOut().then(function () {
      console.log("Signed Out")
    },
    function (error) {
      console.error("Sign Out Error", error)
    })
}

// determine how users will sign in with each platform

export const signInWithGoogle = () => {
  auth.signInWithRedirect(googleProvider)
}

export const signInWithGitHub = () => {
  auth.signInWithRedirect(githubProvider)
}
