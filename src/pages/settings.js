import React, { useLayoutEffect, useState, useContext, useEffect } from "react"
import Navbar from "../components/navbar"
import { navigate } from "gatsby"

import { HeartwoodStateContext, HeartwoodDispatchContext } from "../state/HeartwoodContextProvider"
import { isLoggedIn } from "../utils/utils"
import { firestore, generateUserDocument } from "../firebase/firebase"

import "../styles/video.css"

export default () => {
  const dispatch = useContext(HeartwoodDispatchContext)
  const state = useContext(HeartwoodStateContext)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [error, setError] = useState(null)

  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget

    if (name === "userFirstName") {
      setFirstName(value)
    } else if (name === "userLastName") {
      setLastName(value)
    } else if (name === "userDisplayName") {
      setDisplayName(value)
      console.log("displayName is", displayName)
    }
  }

  // Read all inputs and update the user in session state and in the firestore
  const updateProfile = () => {
    // update the information in firestore
    try {
      firestore.collection("users").doc(state.user.uid).update({
        firstName: firstName,
        lastName: lastName,
        displayName: displayName,
      })

      // update the user that will be stored in state then save the user
      state.user
        .updateProfile({
          firstName: firstName,
          lastName: lastName,
          displayName: displayName,
        })
        .then((res) => {
          dispatch({ type: "LOGIN", user: state.user })
        })

      // If successful tell the user
      setError("Your preferences have been updated")
    } catch (error) {
      setError(error)
      console.log(error)
    }

    // Hide the successfully sent notification after 3 seconds
    setTimeout(() => {
      setError(null)
    }, 3000)
  }

  useEffect(() => {
    if (isLoggedIn(state.user)) {
      // On load, set all the inputs to the user's current preferences
      generateUserDocument(state.user).then(function (res) {
        setFirstName(res.firstName)
        setLastName(res.lastName)
      })

      setDisplayName(state.user.displayName)
    } else {
      navigate("/signin")
    }
  }, [state.user])

  return (
    <div className="flex flex-col w-full h-screen bg-base">
      {isLoggedIn(state.user) && (
        <>
          <Navbar />
          <div className="pt-24 font-mono">
            <div className="w-11/12 px-6 py-8 mx-auto bg-white rounded-xl md:w-3/4 lg:w-1/2 md:px-12">
              <h1 className="pt-4 mb-2 text-3xl font-bold text-center">Settings</h1>
              {error !== null && error !== "Your preferences have been updated" && (
                <div className="w-full py-4 mb-3 text-center text-white bg-red-600 rounded-lg">
                  {error}
                </div>
              )}
              {error !== null && error === "Your preferences have been updated" && (
                <div className="w-full py-4 mb-3 text-center text-white bg-green-500 rounded-lg">
                  {error}
                </div>
              )}
              <form className="">
                <label htmlFor="userFirstName" className="block">
                  First name:
                </label>
                <input
                  type="text"
                  className="w-full p-1 my-1 border rounded-md"
                  name="userFirstName"
                  id="userFirstName"
                  value={firstName}
                  onChange={(event) => onChangeHandler(event)}
                />
                <label htmlFor="userLastName" className="block">
                  Last name:
                </label>

                <input
                  type="text"
                  className="w-full p-1 my-1 border rounded-md"
                  name="userLastName"
                  id="userLastName"
                  value={lastName}
                  onChange={(event) => onChangeHandler(event)}
                />
                <label htmlFor="userDisplayName" className="block">
                  Display name:
                </label>

                <input
                  type="text"
                  className="w-full p-1 mt-1 mb-10 border rounded-md"
                  name="userDisplayName"
                  id="userDisplayName"
                  value={displayName}
                  onChange={(event) => onChangeHandler(event)}
                />

                <button
                  type="button"
                  className="w-full py-2 text-white transition duration-100 ease-in-out rounded-md bg-base hover:bg-green-700 focus:shadow-outline-indigo"
                  onClick={() => updateProfile()}
                >
                  Update Settings
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
