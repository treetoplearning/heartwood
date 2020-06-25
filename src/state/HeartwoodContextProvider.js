import React, { useEffect } from "react"
import { navigate } from "gatsby"
import { isLoggedIn, signUpComplete } from "../utils/utils"
import firebase from "gatsby-plugin-firebase"
import axios from "axios"

export const HeartwoodStateContext = React.createContext()
export const HeartwoodDispatchContext = React.createContext()

const setCookie = (name, value, days) => {
  var expires = ""
  if (days) {
    var date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = "; expires=" + date.toUTCString()
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/"
}

const getCookie = (name) => {
  var nameEQ = name + "="
  var ca = document.cookie.split(";")
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) === " ") c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

const initialState = { ideBody: '# code here\nprint("Hello Jacob")', termBuff: "", user: null }

function reducer(state, action) {
  switch (action.type) {
    case "COMPILE":
      action.cb(state.ideBody)
      return { ...state }
    case "WRITE_IDE":
      return { ...state, ideBody: action.body }
    case "LOGIN":
      // signin cookie is only set when signup is complete
      setCookie("idt", action.idt, 2)
      return { ...state, user: action.user }
    case "UPDATE":
      return { ...state, user: action.user }
    case "LOGOUT":
      setCookie("idt", "", -1)
      return { ...state, user: null }
    default:
      throw new Error("Bad Action Type")
  }
}

const HeartwoodContextProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('user is signed in')
    } else {
      console.log('user is NOT signed in')
    }
  })
  

  useEffect(() => {
    const fb = require("../firebase/firebase")
    if (getCookie("idt")) {

      console.log("cookie exists", getCookie("idt"))
      // if the user is not currently logged in during a state change, check if they have a cookie
      if (!isLoggedIn(state.user)) {
        // https://10.0.1.26:8080/verify
        fetch("http://localhost:5000/verify", {method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idt: getCookie("idt") })})
          .then((res) => res.json())
          .then((res) => {
           
            fb.prepareUserInformation({ uid: res.uid }).then((res) => {
              console.log('the res is', res)
              console.log('fb auth is', fb.auth)
              fb.auth.currentUser.getIdToken().then((idToken) => {
                dispatch({ type: "LOGIN", user: res, idt: idToken })
                console.log('dispatching')
              })
            })
          })
          .catch((err) => {console.log(err)})
      }
    } else {
      if (!state.user) {

        // catch the case where the user is redirected back to signup from the email verification
        let email = window.localStorage.getItem("emailForSignIn")
        if (!email) {
          navigate("/signin")
        } else {
          console.log('staying here')
        }
      }
    }
  }, [state.user])

  return (
    <HeartwoodStateContext.Provider value={state}>
      <HeartwoodDispatchContext.Provider value={dispatch}>{children}</HeartwoodDispatchContext.Provider>
    </HeartwoodStateContext.Provider>
  )
}

export default HeartwoodContextProvider
