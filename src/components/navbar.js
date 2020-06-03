import React, { useState, useEffect, useContext } from "react"
import { Link } from "gatsby"

import { navigate } from "gatsby"

import { signOut } from "../firebase/firebase"

import { HeartwoodStateContext, HeartwoodDispatchContext } from "../state/HeartwoodContextProvider"

import logo from "../assets/logo.svg"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen(!isOpen)

  const state = useContext(HeartwoodStateContext)
  const dispatch = useContext(HeartwoodDispatchContext)

  const [photoUrl, setPhotoUrl] = useState("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80")
  const [userName, setUserName] = useState("Treetop Guest")

  function logOutAndClearState() {
    signOut()
    dispatch({ type: "LOGOUT" })
  }

  useEffect(() => {
    // only add user preferences if the user has logged in
    if (state.user && state.user.userName) {
      setPhotoUrl(state.user.photoURL)
      setUserName(state.user.userName)
    }
  }, [state])

  return (
    <nav className="bg-transparent">
      <div className="px-2 mx-auto font-mono max-w-7xl sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* <!-- Mobile menu button--> */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 text-gray-400 transition duration-150 ease-in-out rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white"
            >
              {/* <!-- Icon when menu is closed. -->
          <!-- Menu open: "hidden", Menu closed: "block" --> */}
              <svg className="block w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* <!-- Icon when menu is open. -->
          <!-- Menu open: "block", Menu closed: "hidden" --> */}
              <svg className="hidden w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-center flex-1 sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0">
              <Link to="/">
                <img
                  className="block w-auto h-8 p-1 bg-white rounded-full lg:hidden"
                  src={logo}
                  alt=""
                />
              </Link>
              <Link to="/">
                <img
                  className="hidden w-auto h-8 p-1 bg-white rounded-full lg:block"
                  src={logo}
                  alt=""
                />
              </Link>
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex" />
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <p className="hidden px-4 text-sm text-white sm:block ">
              {" "}
              Welcome back, {state.user ? state.user.userName : userName}{" "}
            </p>
            <button
              type="button"
              className="p-1 text-gray-400 transition duration-150 ease-in-out border-2 border-transparent rounded-full hover:text-white focus:outline-none focus:text-white focus:bg-gray-700"
              onClick={() => console.log(state)}
            >
              <svg className="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            {/* <!-- Profile dropdown --> */}
            <div className="relative ml-3">
              <div>
                <button
                  className="flex text-sm transition duration-150 ease-in-out border-2 border-transparent rounded-full focus:outline-none focus:border-white"
                  onClick={toggle}
                >
                  <img className="w-8 h-8 bg-white rounded-full" src={photoUrl} alt="" />
                </button>
              </div>
              {/* <!--
            Profile dropdown panel, show/hide based on dropdown state.

            Entering: "transition ease-out duration-100"
              From: "transform opacity-0 scale-95"
              To: "transform opacity-100 scale-100"
            Leaving: "transition ease-in duration-75"
              From: "transform opacity-100 scale-100"
              To: "transform opacity-0 scale-95"
          --> */}
              <div
                className={`${
                  isOpen ? "block" : "hidden"
                } origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg`}
              >
                <div className="py-1 bg-white rounded-md shadow-xs">
                  <Link
                    to="learn"
                    className="block px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="settings"
                    className="block px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                  >
                    Settings
                  </Link>
                  <Link
                    to=""
                    className="block px-4 py-2 text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                    onClick={() => logOutAndClearState()}
                  >
                    Sign out
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden sm:hidden">
        <div className="px-2 pt-2 pb-3">
          <Link
            to="/"
            className="block px-3 py-2 text-base font-medium text-white transition duration-150 ease-in-out bg-gray-900 rounded-md focus:outline-none focus:text-white focus:bg-gray-700"
          >
            Dashboard
          </Link>
          <Link
            to="/"
            className="block px-3 py-2 mt-1 text-base font-medium text-gray-300 transition duration-150 ease-in-out rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
          >
            Team
          </Link>
          <Link
            to="/"
            className="block px-3 py-2 mt-1 text-base font-medium text-gray-300 transition duration-150 ease-in-out rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
          >
            Projects
          </Link>
          <Link
            to="/"
            className="block px-3 py-2 mt-1 text-base font-medium text-gray-300 transition duration-150 ease-in-out rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700"
          >
            Calendar
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
