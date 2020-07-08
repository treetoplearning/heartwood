import React, { useState, useContext, useEffect } from "react"

import Navbar from "../components/navbar"
import Message from "../components/message"

import { HeartwoodStateContext, HeartwoodDispatchContext } from "../state/HeartwoodContextProvider"
import { isLoggedIn } from "../utils/utils"
import { firestore } from "../firebase/firebase"

const Settings = () => {
  const dispatch = useContext(HeartwoodDispatchContext)
  const state = useContext(HeartwoodStateContext)

  const [form, setForm] = useState({firstName: "",
    lastName: "",
    userName: "",
    dateOfBirth: "",
    message: { text: "", type: "" }})

  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget

    if (name === "userFirstName") {
      setForm({ ...form, firstName: value })
    } else if (name === "userLastName") {
      setForm({ ...form, lastName: value })
    } else if (name === "userName") {
      setForm({ ...form, userName: value })
    } else if (name === "dateOfBirth") {
      setForm({ ...form, dateOfBirth: value })
    }
  }

  // Read all inputs and update the user in session state and in the firestore
  const updateProfile = () => {
    // update the information in firestore
    try {
      firestore
        .collection("users")
        .doc(state.user.uid)
        .update({firstName: form.firstName,
          lastName: form.lastName,
          userName: form.userName,
          dateOfBirth: form.dateOfBirth})

      // update the user that will be stored in state then save the user
      const updatedUser = {...state.user,
        firstName: form.firstName,
        lastName: form.lastName,
        userName: form.userName,
        dateOfBirth: form.dateOfBirth}

      dispatch({ type: "UPDATE", user: updatedUser })

      // If successful tell the user
      setForm({ ...form, message: { text: "Your preferences have been updated", type: "success" } })
    } catch (error) {
      setForm({ ...form, message: { text: "An error occured when updating preferences", type: "error" } })
    }

    // Hide the successfully sent notification after 3 seconds
    setTimeout(() => {
      setForm({ ...form, message: { text: "", type: "" } })
    }, 3000)
  }

  useEffect(() => {
    if (isLoggedIn(state.user)) {
      // On load, set all the inputs to the user's current preferences
      setForm({...form,
        firstName: state.user.firstName,
        lastName: state.user.lastName,
        userName: state.user.userName,
        dateOfBirth: state.user.dateOfBirth})
    } else {
      console.log("not logged in")
    }
  }, [state.user])

  return (
    <div className="w-screen min-h-screen bg-base">
      <Navbar />
      <div className="pt-8 font-mono">
        <div className="w-11/12 px-6 py-8 mx-auto bg-white rounded-xl md:w-3/4 lg:w-1/2 md:px-12">
          <h1 className="pt-4 mb-2 text-3xl font-bold text-center">Settings</h1>
          <Message
              type={form.message.type}
              text={form.message.text}
            />

          <form className="">
            <div className="mb-4">
              <label htmlFor="userFirstName" className="block mb-1 font-bold">
                First name:
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                name="userFirstName"
                id="userFirstName"
                value={form.firstName}
                onChange={(event) => onChangeHandler(event)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="userLastName" className="block mb-1 font-semibold">
                Last name:
              </label>

              <input
                type="text"
                className="w-full px-3 py-2 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                name="userLastName"
                id="userLastName"
                value={form.lastName}
                onChange={(event) => onChangeHandler(event)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="userName" className="block mb-1 font-semibold">
                Username:
              </label>

              <input
                type="text"
                className="w-full px-3 py-2 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                name="userName"
                id="userName"
                value={form.userName}
                onChange={(event) => onChangeHandler(event)}
              />
            </div>

            <div className="mb-10">
              <label htmlFor="dateOfBirth" className="block mb-1 font-semibold">
                Date of birth:
              </label>

              <input
                required
                type="date"
                className="w-full px-3 py-2 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                name="dateOfBirth"
                id="dateOfBirth"
                value={form.dateOfBirth}
                onChange={(event) => onChangeHandler(event)}
              />
            </div>

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
    </div>
  )
}

export default Settings
