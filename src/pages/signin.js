import React, { useState } from "react";
import { Link } from "gatsby";
import { signInWithGoogle } from "../firebase/firebase";
import { auth } from "../firebase/firebase";

import { navigate } from "@reach/router"

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  // deal with an already registered user
  const signInWithEmailAndPasswordHandler = (event, email, password) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password).catch((error) => {
      setError("Error signing in with password and email!");
      console.error("Error signing in with password and email", error);
    });
   
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget;

    if (name === "userEmail") {
      setEmail(value);
    } else if (name === "userPassword") {
      setPassword(value);
    }
  };

  return (
    <div className="w-screen h-screen overflow-visible bg-base">
    <div className="pt-24 font-mono">
      <div className="w-11/12 px-4 py-8 mx-auto bg-white rounded-xl md:w-2/4 md:px-12">
        <h1 className="pt-4 mb-2 text-3xl font-bold text-center">Sign in</h1>
        {error !== null && (
          <div className="w-full py-4 mb-3 text-center text-white bg-red-600">
            {error}
          </div>
        )}
        <form className="">
          <label htmlFor="userEmail" className="block">
            Email:
          </label>
          <input
            type="email"
            className="w-full p-1 my-1"
            name="userEmail"
            value={email}
            placeholder="E.g: faruq123@gmail.com"
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
            className="w-full py-2 text-white transition duration-100 ease-in-out rounded-md bg-base hover:bg-green-700 focus:shadow-outline-indigo"
            onClick={(event) => {
              signInWithEmailAndPasswordHandler(event, email, password);
            }}
          >
            Sign in
          </button>
        </form>
        <p className="my-3 text-center">or</p>
        <button
          className="w-full py-2 text-white transition duration-100 ease-in-out bg-blue-500 rounded-md focus:shadow-outline-red hover:bg-blue-600"
          onClick={() => signInWithGoogle()}
        >
          Sign in with Google
        </button>
        <button
          className="w-full py-2 mt-2 text-white transition duration-100 ease-in-out bg-black rounded-md focus:shadow-outline-red hover:bg-gray-800"
          onClick={() => signInWithGoogle() }
        >
          Sign in with GitHub
        </button>
        <p className="my-3 text-center">
          Don't have an account?{" "}
          <Link to="signUp" className="text-blue-500 hover:text-blue-600">
            Sign up here
          </Link>{" "}
          <br />{" "}
          <Link
            to="/passwordreset"
            className="text-blue-500 hover:text-blue-600"
          >
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
    </div>
  );
};
export default SignIn;
