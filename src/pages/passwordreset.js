import React, { useState } from "react";
import { Link } from "@reach/router";

import { auth } from "../firebase/firebase";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [emailHasBeenSent, setEmailHasBeenSent] = useState(false);
  const [error, setError] = useState(null);

  const onChangeHandler = event => {
    const { name, value } = event.currentTarget;
    if (name === "userEmail") {
      setEmail(value);
    }
  };

  
  const sendResetEmail = event => {
    setError(null)
    event.preventDefault();
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        setEmailHasBeenSent(true);
        setTimeout(() => {setEmailHasBeenSent(false)}, 4000);
      })
      .catch(() => {
        setError("Error resetting password");
      });
  };

  return (
    <div className="w-screen h-screen bg-base">
    <div className="pt-24 font-mono">
    <div className="w-11/12 px-6 py-8 mx-auto bg-white rounded-xl md:w-1/2 md:px-12 ">
      <h1 className="pt-4 mb-2 text-3xl font-bold text-center">
        Reset your Password
      </h1>
      <div className="w-full py-4 rounded-xl">
        <form action="">
          {emailHasBeenSent && (
            <div className="w-full py-3 mb-3 text-center text-white bg-green-500 rounded-lg">
              An email has been sent to you!
            </div>
          )}
          {error !== null && (
            <div className="w-full py-3 mb-3 text-center text-white bg-red-600 rounded-lg">
              {error}
            </div>
          )}
          <label htmlFor="userEmail" className="block w-full">
            Email:
          </label>
          <input
            type="email"
            name="userEmail"
            id="userEmail"
            value={email}
            placeholder="Input your email"
            onChange={onChangeHandler}
            className="w-full px-1 py-2 mb-3"
          />
          <button
            className="w-full py-2 text-white duration-100 ease-in-out bg-blue-500 rounded-lg hover:bg-blue-400"  onClick={event => {
              sendResetEmail(event);
            }}
          >
            Send me a reset link
          </button>
        </form>
        <Link
         to ="signin"
          className="block my-2 text-center text-blue-700 hover:text-blue-800"
        >
          &larr; back to sign in page
        </Link>
      </div>
    </div>
    </div>
    </div>
  );
};
export default PasswordReset;