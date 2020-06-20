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
import {auth,
  signInWithGoogle,
  signInWithGitHub,
  prepareUserInformation,
  getCurrentUser,
  verifyEmail} from "../firebase/firebase"

import { HeartwoodStateContext, HeartwoodDispatchContext } from "../state/HeartwoodContextProvider"

library.add(faGoogle, faGithub)
config.autoAddCss = false

const SignUp = () => {
  const state = useContext(HeartwoodStateContext)
  const dispatch = useContext(HeartwoodDispatchContext)

  const [form, setForm] = useState({email: "",
    password: "",
    message: { text: "", type: "" },
    passwordStrong: false,
    isLoading: true,
    onVerifyLink: false})

  // generate a new document for a new user
  const createUserWithEmailAndPasswordHandler = async (event, email, password) => {
    // if the user has attempted every input

    setForm({ ...form, isLoading: true })
    event.preventDefault()
    try {
      const { user } = await auth.createUserWithEmailAndPassword(email, password)
      verifyEmail(form.email, "signup")
      setForm({ ...form, message: { text: "Please check your email to complete your signup", type: "success" } })
    } catch (error) {
      setForm({ ...form, isLoading: false })

      // handle and display the various errors to the user
      if (error.code === "auth/account-exists-with-different-credential") {
        setForm({ ...form, message: { text: "An account already exists under that email address", type: "error" } })
      } else if (error.code === "auth/email-already-in-use") {
        setForm({ ...form, message: { text: "Email address is already in use by another account", type: "error" } })
      } else if (error.code === "auth/invalid-email") {
        setForm({ ...form, message: { text: "Email address is badly formatted", type: "error" } })
      } else {
        setForm({ ...form, message: { text: error.message, type: "error" } })
      }
    }
  }

  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget
    if (name === "userEmail") {
      setForm({ ...form, email: value })
    } else if (name === "userPassword") {
      setForm({ ...form, password: value })
    }
  }

  const checkStrong = (input) => {
    if (input === "Strong") {
      setForm({ ...form, passwordStrong: true })
      return
    }
    setForm({ ...form, passwordStrong: false })
  }

  // checks that all user inputs are not empty
  const validateInputs = () => {
    if (!form.passwordStrong) {
      setForm({ ...form, message: { text: "Please select a more complex password", type: "error" } })
      return false
    }
    if (form.email === "" || form.password === "") {
      setForm({ ...form, message: { text: "Error signing up with email and password", type: "error" } })
      return false
    }
    return true
  }

  const submitForm = (event) => {
    event.preventDefault()
    if (validateInputs()) {
      createUserWithEmailAndPasswordHandler(event, form.email, form.password)
    }
  }

  // the provider sign-in
  useEffect(() => {

    // The user will either sign-in with email-link or with provider. Check each conditionally.

    // Confirm the link is a sign-in with email link.
    if (auth.isSignInWithEmailLink(window.location.href)) {
      setForm({ ...form, onVerifyLink: true })
      console.log("setting onVerifyLink")

      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      let email = window.localStorage.getItem("emailForSignIn")
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt("Please provide your email for confirmation")
      }
      // The client SDK will parse the code from the link for you.
      auth
        .signInWithEmailLink(email, window.location.href)
        .then((result) => {
          // Clear email from storage.
          window.localStorage.removeItem("emailForSignIn")

      

          prepareUserInformation(result.user).then((res) => {
            getCurrentUser()
              .getIdToken()
              .then((idToken) => {
                console.log('success getting id token')
                dispatch({ type: "LOGIN", user: res, idt: idToken })
                navigate("/")
              })
          })
        })
        .catch((error) => {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
          console.log('error signing in with emailLink', error)
        })
    } else {
      auth
        .getRedirectResult()
        .then((result) => {
          if (result.user) {
            prepareUserInformation(result.user).then((res) => {
              getCurrentUser()
                .getIdToken()
                .then((idToken) => {
                  dispatch({ type: "LOGIN", user: res, idt: idToken })
                  navigate("/")
                })
            })
          } else {
            // only get rid of the spinner if a provider AND a verify email link sign-in are not being attempted
            if (!form.onVerifyLink) {
              console.log("setting isLoading to false")
              setForm({ ...form, isLoading: false })
            }
          }
        })
        .catch((error) => {
          setForm({ ...form, isLoading: false })
          if (error.code === "auth/account-exists-with-different-credential") {
            setForm({ ...form, message: { text: "An account already exists under that email address", type: "error" } })
          }
        })
    }
  }, [])

  return (
    <div className="w-screen min-h-screen pb-20 bg-base">
      {form.isLoading && (
        <div className="flex self-center justify-center w-screen h-auto min-h-screen ">
          {" "}
          <object color="white" type="image/svg+xml" data={gear}>
            svg-animation
          </object>{" "}
        </div>
      )}
      {!form.isLoading && (
        <div className="pt-24 font-mono">
          <div className="w-11/12 px-6 py-8 mx-auto bg-white rounded rounded-xl lg:w-1/2 md:w-3/4 md:px-12">
            <h1 className="pt-4 mb-2 text-3xl font-bold text-center">Sign Up</h1>
            {form.message.type === "error" && (
              <div className="w-full py-4 mb-3 text-center text-white bg-red-600 rounded-lg">{form.message.text}</div>
            )}
            {form.message.type === "success" && (
              <div className="w-full py-4 mb-3 text-center text-white rounded-lg bg-base">{form.message.text}</div>
            )}
            <form className="">
              <div className="mb-4">
                <label htmlFor="userEmail" className="block mb-1 font-semibold">
                  Email:
                </label>
                <input
                  required
                  type="email"
                  className="w-full px-3 py-2 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  name="userEmail"
                  value={form.email}
                  placeholder="treetoplearner@gmail.com"
                  id="userEmail"
                  onChange={(event) => onChangeHandler(event)}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="userPassword" className="block mb-1 font-semibold">
                  Password:
                </label>
                <input
                  required
                  type="password"
                  className="w-full px-3 py-2 mb-3 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  name="userPassword"
                  value={form.password}
                  placeholder="****************"
                  id="userPassword"
                  onChange={(event) => onChangeHandler(event)}
                />
                <PasswordStrengthMeter onStrengthUpdate={checkStrong} password={form.password} />
              </div>
              <button
                type="submit"
                className="w-full py-2 text-white duration-100 ease-in-out rounded-md bg-base hover:bg-green-700 focus:shadow-outline-indigo"
                onClick={(event) => submitForm(event)}
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
              <FontAwesomeIcon icon={faGoogle} className="absolute left-0 ml-3 text-lg align-baseline" />
              <p className="w-full"> Sign up with Google </p>
            </button>
            <button
              className="relative flex items-center w-full py-2 mt-2 text-white transition duration-100 ease-in-out bg-black rounded-md focus:shadow-outline-red hover:bg-gray-800"
              onClick={() => signInWithGitHub()}
            >
              <FontAwesomeIcon icon={faGithub} className="absolute left-0 ml-3 text-lg align-baseline" />
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
