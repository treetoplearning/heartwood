import React, { useEffect } from "react"
import { navigate } from "gatsby"
import { isLoggedIn, getEndpointPrefix } from "../utils/utils"

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

const initialState = { ideBody: '# code here\nprint("Hello Jacob")', termBuff: "", user: null, update: null}

function reducer(state, action) {
  switch (action.type) {
    case "COMPILE":
      action.cb(state.update())
      return { ...state}
    case "WRITE_IDE":
      console.log(action.update)
      return { ...state, update: action.update}
    case "WRITE_TERM":
      return { ...state, termBuff: action.body }
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

  useEffect(() => {
    const fb = require("../firebase/firebase")
    if (getCookie("idt")) {
      // if the user is not currently logged in during a state change, check if they have a cookie
      if (!isLoggedIn(state.user)) {
        const endpoint = getEndpointPrefix() + "/verify"
        fetch(endpoint, {method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idt: getCookie("idt") })})
          .then((res) => res.json())
          .then((res) => {
            fb.prepareUserInformation({ uid: res.uid }).then((res) => {
              fb.auth.currentUser.getIdToken(true).then((idToken) => {
                dispatch({ type: "LOGIN", user: res, idt: idToken })
              })
            })
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        console.log("user is already logged in")
      }
    } else {
      if (!state.user) {
        // catch the case where the user is redirected back to signup from the email verification
        let email = window.localStorage.getItem("emailForSignIn")
        if (!email) {
          navigate("/signin")
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
