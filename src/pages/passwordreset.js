import React, { useState } from "react";
import { Link } from "@reach/router";

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
    event.preventDefault();
  };
  return (
    <div className="mt-8">
      <h1 className="mb-3 text-xl font-bold text-center">
        Reset your Password
      </h1>
      <div className="w-11/12 px-4 py-8 mx-auto border border-blue-300 rounded md:w-2/4 md:px-8">
        <form action="">
          {emailHasBeenSent && (
            <div className="w-full py-3 mb-3 text-center text-white bg-green-400">
              An email has been sent to you!
            </div>
          )}
          {error !== null && (
            <div className="w-full py-3 mb-3 text-center text-white bg-red-600">
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
            className="w-full py-3 text-white bg-blue-400"
          >
            Send me a reset link
          </button>
        </form>
        <Link
         to ="/"
          className="block my-2 text-center text-blue-700 hover:text-blue-800"
        >
          &larr; back to sign in page
        </Link>
      </div>
    </div>
  );
};
export default PasswordReset;