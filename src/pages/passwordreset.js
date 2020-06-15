import React, { useState } from "react"
import { Link } from "@reach/router"

import { auth } from "../firebase/firebase"

const PasswordReset = () => {
  const [form, setForm] = useState({ email: "", message: { text: "", status: "" } })

  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget
    if (name === "userEmail") {
      setForm({ ...form, email: value })
    }
  }

  const sendResetEmail = (event) => {
    setForm({ ...form, error: null })
    event.preventDefault()
    auth
      .sendPasswordResetEmail(form.email)
      .then(() => {
        // notify user of successfully sent
        setForm({ ...form, message: { text: "Password reset instructions have been emailed", type: "success" } })

        // hide the successfully sent notification after 4 seconds
        setTimeout(() => {
          setForm({ ...form, message: { text: "", type: "" } })
        }, 4000)
      })
      .catch((error) => {
        console.log(error)
        if (error.code === "auth/invalid-email") {
          setForm({ ...form, message: { text: "Email address is badly formatted", type: "error" } })
        } else if (error.code === "auth/user-not-found") {
          setForm({ ...form, message: { text: "Email address is not in use", type: "error" } })
        } else {
          setForm({ ...form, message: { text: "Error resetting password", type: "error" } })
        }
      })
  }

  return (
    <div className="w-screen h-screen bg-base">
      <div className="pt-24 font-mono">
        <div className="w-11/12 px-6 py-8 mx-auto bg-white rounded-xl md:w-1/2 md:px-12 ">
          <h1 className="pt-4 text-3xl font-bold text-center">Reset your Password</h1>
          <div className="w-full pt-2 pb-4 rounded-xl">
            <form action="">
              {form.message.type === "error" && (
                <div className="w-full py-4 mb-3 text-center text-white bg-red-600 rounded-lg">{form.message.text}</div>
              )}
              {form.message.type === "success" && (
                <div className="w-full py-4 mb-3 text-center text-white rounded-lg bg-base">{form.message.text}</div>
              )}
              <label htmlFor="userEmail" className="block w-full">
                Email:
              </label>
              <input
                type="email"
                name="userEmail"
                id="userEmail"
                value={form.email}
                placeholder="treetoplearner@gmail.com"
                onChange={onChangeHandler}
                className="w-full px-1 py-2 mb-3"
              />
              <button
                className="w-full py-2 text-white duration-100 ease-in-out bg-blue-500 rounded-lg hover:bg-blue-400"
                onClick={(event) => {
                  sendResetEmail(event)
                }}
              >
                Send me a reset link
              </button>
            </form>
            <Link to="signin" className="block my-2 text-center text-blue-700 hover:text-blue-800">
              &larr; back to sign in page
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
export default PasswordReset
