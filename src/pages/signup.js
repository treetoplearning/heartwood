import React, { useState, useEffect, useContext } from "react"
import { navigate } from "gatsby"
import { Link } from "@reach/router"

import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"

import gear from "../assets/gear.svg"
import PasswordStrengthMeter from "../components/passwordstrengthmeter"

import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons"
import {
  auth,
  signInWithGoogle,
  signInWithGitHub,
  generateUserDocument,
} from "../firebase/firebase"

import { HeartwoodStateContext, HeartwoodDispatchContext } from "../state/HeartwoodContextProvider"

library.add(faGoogle, faGithub)
config.autoAddCss = false

const SignUp = () => {
  const state = useContext(HeartwoodStateContext)
  const dispatch = useContext(HeartwoodDispatchContext)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [error, setError] = useState(null)
  const [passwordStrong, setPasswordStrong] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // checks that all user inputs are not empty
  const validateInputs = () => {
    if (!passwordStrong) {
      setError("Please select a more complex password")
      return false
    }

    if (email === "" || password === "" || displayName === "") {
      setError("Error signing up with email and password")
      return false
    }

    return true
  }

  // generate a new document for a new user
  const createUserWithEmailAndPasswordHandler = async (event, email, password) => {
    // if the user has attempted every input

    setIsLoading(true)
    event.preventDefault()
    try {
      const { user } = await auth.createUserWithEmailAndPassword(email, password)

      // manage the data to save to the documents
      const photoURL =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAA1BMVEX///+nxBvIAAAAR0lEQVR4nO3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPBgxUwAAU+n3sIAAAAASUVORK5CYII="
      const splitNames = displayName.split(" ")
      const firstName = splitNames[0]
      const lastName = String(splitNames.slice(1, splitNames.length)).replace(/,/g, " ")

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
          dispatch({ type: "LOGIN", user })

          navigate("/")
        })
    } catch (error) {
      setIsLoading(false)

      // handle and display the various errors to the user
      if (error.code === "auth/account-exists-with-different-credential") {
        setError("An account already exists under that email address")
        console.error("An account already exists under that email address", error)
      } else if (error.code === "auth/email-already-in-use") {
        setError("Email address is already in use by another account")
     
      } else if (error.code === "auth/invalid-email") {
        setError("Email address is badly formatted")
     
      } else {
        setError(error.message)
    
      }
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

  const checkStrong = (input) => {
    if (input === "Strong") {
      setPasswordStrong(true)
      return
    }
    setPasswordStrong(false)
  }

  useEffect(() => {
    auth
      .getRedirectResult()
      .then((result) => {
        if (result.user && result.user.displayName) {
          const splitNames = result.user.displayName.split(" ")
          const firstName = splitNames[0]
          const lastName = String(splitNames.slice(1, splitNames.length)).replace(/,/g, " ")

          // create a document in the database with all the provider information
          generateUserDocument(result.user, {
            displayName,
            firstName,
            lastName,
          })

          // update the user that will be stored in state
          result.user
            .updateProfile({
              firstName: firstName,
              lastName: lastName,
            })
            .then((res) => {
              dispatch({ type: "LOGIN", user: result.user })
              navigate("/")
            })
        }
      })
      .catch((error) => {
        setIsLoading(false)
        if (error.code === "auth/account-exists-with-different-credential") {
          setError("An account already exists under that email address")
          console.error("Account already exists under email address", error)
        }
      })
  }, [])

  return (
    <div className="w-screen min-h-screen pb-20 bg-base">
      {isLoading && (
        <div className="flex self-center justify-center w-screen h-auto min-h-screen ">
          {" "}
          <object color="white" type="image/svg+xml" data={gear}>
            svg-animation
          </object>{" "}
        </div>
      )}
      {!isLoading && (
        <div className="pt-24 font-mono">
          <div className="w-11/12 px-6 py-8 mx-auto bg-white rounded rounded-xl lg:w-1/2 md:w-3/4 md:px-12">
            <h1 className="pt-4 mb-2 text-3xl font-bold text-center">Sign Up</h1>
            {error !== null && (
              <div className="w-full py-4 mb-3 text-center text-white bg-red-600 rounded-lg">
                {error}
              </div>
            )}
            <form className="">
              <label htmlFor="displayName" className="block">
                Full Name:
              </label>
              <input
                required
                type="text"
                className="w-full p-1 my-1 border rounded-md"
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
                required
                type="email"
                className="w-full p-1 my-1 border rounded-md"
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
                required
                type="password"
                className="w-full p-1 mt-1 mb-3 border rounded-md"
                name="userPassword"
                value={password}
                placeholder="Your Password"
                id="userPassword"
                onChange={(event) => onChangeHandler(event)}
              />
              <PasswordStrengthMeter onStrengthUpdate={checkStrong} password={password} />
              <button
                type="button"
                className="w-full py-2 text-white duration-100 ease-in-out rounded-md bg-base hover:bg-green-700 focus:shadow-outline-indigo"
                onClick={(event) => {
                  validateInputs()
                    ? createUserWithEmailAndPasswordHandler(event, email, password)
                    : console.log("NOT calling createUser")
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
      )}
    </div>
  )
}
export default SignUp
