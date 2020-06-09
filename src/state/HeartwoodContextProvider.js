import React, { useEffect } from "react"
import { navigate } from "gatsby"
import { isLoggedIn } from '../utils/utils'
import firebase from "gatsby-plugin-firebase"
import axios from "axios"


export const HeartwoodStateContext = React.createContext()
export const HeartwoodDispatchContext = React.createContext()

const setCookie = (name, value, days) => {
  var expires = ""
  if (days) {
    var date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    expires = "; expires=" + date.toUTCString()
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/"
}

const getCookie = (name) => {
  var nameEQ = name + "="
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

const initialState = {
  ideBody: '# code here\nprint("Hello Jacob")',
  termBuff: "",
  user: null,
}

function reducer(state, action) {
  switch (action.type) {
    case "COMPILE":
      action.cb(state.ideBody)
      return {
        ...state,
      }
    case "WRITE_IDE":
      return {
        ...state,
        ideBody: action.body,
      }
    case "LOGIN":
      setCookie('idt', action.idt, 1)
      return {
        ...state,
        user: action.user,
      }
      case "UPDATE":
        return {
          ...state,
          user: action.user,
          firstName: action.firstName,
          lastName: action.lastName,
          userName: action.userName,
          dateOfBirth: action.dateOfBirth
        }
    case "LOGOUT":
      setCookie('idt', "", -1)
      console.log('the cookie after LOGOUT IS', getCookie('idt'))
      return {
        ...state,
        user: null,
      }

    default:
      throw new Error("Bad Action Type")
  }
}

const HeartwoodContextProvider = ({ children }) => {

  const [state, dispatch] = React.useReducer(reducer, initialState)

  useEffect( () => {
    const fb = require('../firebase/firebase')
    if (getCookie('idt')) {
      // if the user is not currently logged in during a state change, check if they have a cookie
      if (!isLoggedIn(state.user)) {
        console.log('we are fetching w jwt', getCookie('idt'))
        fetch("https://10.0.1.26:8080/verify", { method: 'POST', headers: { 'Content-Type': "application/json", }, body: JSON.stringify({'idt': getCookie('idt')})})
        .then(res => res.json())
        .then(res => {
          console.log('the response from phloem is', res)
          fb.prepareUserInformation({uid: res.uid}).then(function(res) {
            console.log("the created user is", res)
            fb.auth.currentUser.getIdToken().then(idToken => {
              dispatch({ type: "LOGIN", user: res, idt: idToken})
            })
          })
        })
        
      } else {
        console.log('MARK: WE ARE LOGGED IN ALREADY')
      }
      // dispatch({ type: "LOGIN", user: returningUser})
    } else {
      navigate("/signin")
    }
  }, [state.user])

  return (
    <HeartwoodStateContext.Provider value={state}>
      <HeartwoodDispatchContext.Provider value={dispatch}>
        {children}
      </HeartwoodDispatchContext.Provider>
    </HeartwoodStateContext.Provider>
  )
}

export default HeartwoodContextProvider
