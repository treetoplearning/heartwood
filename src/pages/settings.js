import React, { useLayoutEffect, useState, useContext, useEffect } from "react"
import Navbar from "../components/navbar"
import { navigate } from "gatsby"

import { HeartwoodStateContext, HeartwoodDispatchContext } from "../state/HeartwoodContextProvider"
import { isLoggedIn } from "../utils/utils"
import { firestore } from "../firebase/firebase"

export default () => {
  const dispatch = useContext(HeartwoodDispatchContext)
  const state = useContext(HeartwoodStateContext)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [userName, setUserName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState(null)
  const [message, setMessage] = useState(null)

  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget

    if (name === "userFirstName") {
      setFirstName(value)
    } else if (name === "userLastName") {
      setLastName(value)
    } else if (name === "userName") {
      setUserName(value)
    } else if (name === "dateOfBirth") {
      setDateOfBirth(value)
    }
  }

  // Read all inputs and update the user in session state and in the firestore
  const updateProfile = () => {
    // update the information in firestore
    try {
      firestore.collection("users").doc(state.user.uid).update({
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        dateOfBirth: dateOfBirth,
      })

      // update the user that will be stored in state then save the user
      const updatedUser = {
        ...state.user,
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        dateOfBirth: dateOfBirth,
      }

      dispatch({ type: "UPDATE", user: updatedUser })

      // If successful tell the user
      setMessage("Your preferences have been updated")
    } catch (error) {
      setMessage(error)
      console.log(error)
    }

    // Hide the successfully sent notification after 3 seconds
    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }

  useEffect(() => {
    if (isLoggedIn(state.user)) {
      // On load, set all the inputs to the user's current preferences

      setFirstName(state.user.firstName)
      setLastName(state.user.lastName)
      setUserName(state.user.userName)
      setDateOfBirth(state.user.dateOfBirth)
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
              {message && (
                <div className="w-full py-4 mb-3 text-center text-white bg-red-600 rounded-lg">
                  {message}
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
                <label htmlFor="userName" className="block">
                  Username:
                </label>

                <input
                  type="text"
                  className="w-full p-1 my-1 border rounded-md"
                  name="userName"
                  id="userName"
                  value={userName}
                  onChange={(event) => onChangeHandler(event)}
                />

                <label htmlFor="dateOfBirth" className="block">
                  Date of birth:
                </label>

                <input
                  type="date"
                  className="w-full p-1 mt-1 mb-10 border rounded-md"
                  name="dateOfBirth"
                  id="dateOfBirth"
                  value={dateOfBirth}
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
