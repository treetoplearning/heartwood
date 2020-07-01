import React, { useState, useContext, useEffect } from "react"

import { HeartwoodStateContext, HeartwoodDispatchContext } from "../state/HeartwoodContextProvider"
import { isLoggedIn } from "../utils/utils"
import { firestore } from "../firebase/firebase"

const CollectInfo = () => {
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
    } catch (error) {
      setForm({ ...form, message: { text: error, type: "error" } })
    }

    // Hide the successfully sent notification after 3 seconds
    setTimeout(() => {
      setForm({ ...form, message: null })
      setForm({ ...form, message: { text: "", type: "" } })
    }, 3000)
  }

  const validateInputs = () => {
    if (form.firstName === "" || form.lastName === "" || form.userName === "" || form.dateOfBirth === "") {
      setForm({ ...form, message: { text: "Please fill out all required fields", type: "error" } })
      return false
    }
    return true
  }

  const submitForm = (event) => {
    if (validateInputs()) {
      updateProfile()
    }
  }

  useEffect(() => {
    if (isLoggedIn(state.user)) {
      // On load, set all the inputs to the user's current preferences
      setForm({...form,
        firstName: state.user.firstName,
        lastName: state.user.lastName,
        userName: state.user.userName,
        dateOfBirth: state.user.dateOfBirth})
    }
  }, [state.user])

  return (
    <div className="flex flex-col w-auto h-auto bg-base">
      <div className="pt-24 font-mono">
        <div className="w-11/12 px-6 py-8 mx-auto bg-white rounded-xl md:w-3/4 lg:w-1/2 md:px-12">
          <h1 className="pt-4 mb-2 text-3xl font-bold text-center">Additional Information</h1>
          {form.message.type === "error" && (
            <div className="w-full px-2 py-4 mb-3 text-center text-white break-words bg-red-600 rounded-lg">{form.message.text}</div>
          )}
          {form.message.type === "success" && (
            <div className="w-full px-2 py-4 mb-3 text-center text-white break-words rounded-lg bg-base">{form.message.text}</div>
          )}
          <h1 className="w-full py-2 mb-3 text-center ">
            Welcome to Treetop Learning! Before continuing we need a little bit more information...
          </h1>

          <form className="">
            <div className="mb-4">
              <label htmlFor="userFirstName" className="block mb-1 font-semibold">
                First name:
              </label>
              <input
                required
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
                required
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
                required
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
              type="submit"
              className="w-full py-2 text-white transition duration-100 ease-in-out rounded-md bg-base hover:bg-green-700 focus:shadow-outline-indigo"
              onClick={(event) => submitForm(event)}
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CollectInfo
