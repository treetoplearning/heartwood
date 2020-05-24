import React, { useState, useEffect, useContext } from "react"
import { navigate } from "gatsby"
import { Link } from "@reach/router"
import firebase from "firebase/app"

import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons"
import {
  auth,
  signInWithGoogle,
  signInWithGitHub,
  generateUserDocument,
} from "../firebase/firebase"

import {
  HeartwoodStateContext,
  HeartwoodDispatchContext,
} from "../state/HeartwoodContextProvider"

library.add(faGoogle, faGithub)

const SignUp = () => {
  const state = useContext(HeartwoodStateContext)
  const dispatch = useContext(HeartwoodDispatchContext)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [error, setError] = useState(null)

  // generate a new document for a new user
  const createUserWithEmailAndPasswordHandler = async (
    event,
    email,
    password
  ) => {
    event.preventDefault()
    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      )

      // manage the data to save to the documents
      const photoURL =
        "https://arbordayblog.org/wp-content/uploads/2018/06/oak-tree-sunset-iStock-477164218.jpg"
      const splitNames = displayName.split(" ")
      const firstName = splitNames[0]
      const lastName = String(splitNames.slice(1, splitNames.length)).replace(
        /,/g,
        " "
      )

      // to add more fields just input them into the genUserDoc object parameter.
      generateUserDocument(user, {
        displayName,
        photoURL,
        firstName,
        lastName,
      })

      // update the user that will be stored in state
      user
        .updateProfile({
          displayName,
          photoURL,
        })
        .then((res) => {
          console.log(res, user)
          dispatch({ type: "LOGIN", user })
          navigate("/")
        })
    } catch (error) {
      setError("Error signing up with email and password")
    }
  }

  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget
    if (name === "userEmail") {
      setEmail(value)
    } else if (name === "userPassword") {
      setPassword(value)
    } else if (name === "displayName") {
      setDisplayName(value)
    }
  }

  useEffect(() => {
    firebase
      .auth()
      .getRedirectResult()
      .then((result) => {
        if (result.user) {
          console.log("logged in user is", firebase.auth().currentUser)

          // reference to logged in user
          const { currentUser } = firebase.auth()

          // manage the user information from the provider log-in
          const { displayName } = currentUser
          const splitNames = currentUser.displayName.split(" ")
          console.log("split names is", splitNames)
          const firstName = splitNames[0]
          console.log("first name is", firstName)

          const lastName = String(
            splitNames.slice(1, splitNames.length)
          ).replace(/,/g, " ")

          // create a document in the database with all the provider information
          generateUserDocument(currentUser, {
            displayName,
            firstName,
            lastName,
          })

          // update the user that will be stored in state
          currentUser
            .updateProfile({
              firstName,
              lastname: lastName,
            })
            .then((res) => {
              dispatch({ type: "LOGIN", user: result.user })
              navigate("/")
            })
        }
      })
  }, [])

  return (
    <div className="w-screen h-screen overflow-visible bg-base">
      <div className="pt-24 font-mono">
        <div className="w-11/12 px-6 py-8 mx-auto bg-white rounded rounded-xl lg:w-1/2 md:w-3/4 md:px-12">
          <h1 className="pt-4 mb-2 text-3xl font-bold text-center">Sign Up</h1>
          {error !== null && (
            <div className="w-full py-4 mb-3 text-center text-white bg-red-600 rounded-lg">
              {error}
            </div>
          )}
          <form className="" required>
            <label htmlFor="displayName" className="block">
              Full Name:
            </label>
            <input
              type="text"
              className="w-full p-1 my-1 "
              name="displayName"
              value={displayName}
              placeholder="E.g: Treetop Learner"
              id="displayName"
              onChange={(event) => onChangeHandler(event)}
            />
            <label htmlFor="userEmail" className="block">
              Email:
            </label>
            <input
              type="email"
              className="w-full p-1 my-1"
              name="userEmail"
              value={email}
              placeholder="E.g: treetoplearner@gmail.com"
              id="userEmail"
              onChange={(event) => onChangeHandler(event)}
            />
            <label htmlFor="userPassword" className="block">
              Password:
            </label>
            <input
              type="password"
              className="w-full p-1 mt-1 mb-3"
              name="userPassword"
              value={password}
              placeholder="Your Password"
              id="userPassword"
              onChange={(event) => onChangeHandler(event)}
            />
            <button
              className="w-full py-2 text-white duration-100 ease-in-out rounded-md bg-base hover:bg-green-700 focus:shadow-outline-indigo"
              onClick={(event) => {
                createUserWithEmailAndPasswordHandler(event, email, password)
              }}
            >
              Sign up
            </button>
          </form>
          <p className="my-3 text-center">or</p>
          <button
            type="button"
            className="relative flex items-center w-full py-2 text-white transition duration-100 ease-in-out bg-blue-500 rounded-md focus:shadow-outline-red hover:bg-blue-600"
            onClick={() => signInWithGoogle()}
          >
            <FontAwesomeIcon
              icon={faGoogle}
              className="absolute left-0 ml-3 text-lg align-baseline"
            />
            <p className="w-full"> Sign up with Google </p>
          </button>
          <button
            className="relative flex items-center w-full py-2 mt-2 text-white transition duration-100 ease-in-out bg-black rounded-md focus:shadow-outline-red hover:bg-gray-800"
            onClick={() => signInWithGitHub()}
          >
            <FontAwesomeIcon
              icon={faGithub}
              className="absolute left-0 ml-3 text-lg align-baseline"
            />
            <p className="w-full"> Sign up with GitHub </p>
          </button>
          <p className="my-3 text-center">
            Already have an account?{" "}
            <Link to="signin" className="text-blue-500 hover:text-blue-600">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
export default SignUp
