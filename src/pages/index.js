import React, { useContext, useEffect } from "react"
import Navbar from "../components/navbar"
import { navigate } from "gatsby"

import { auth } from "../firebase/firebase"

import {
  HeartwoodStateContext,
  HeartwoodDispatchContext,
} from "../state/HeartwoodContextProvider"


const IndexPage = () => {
  const state = useContext(HeartwoodStateContext)
  const dispatch = useContext(HeartwoodDispatchContext)

  useEffect(() => {
    
    if (state.user !== null) {
      
      const { photoURL, displayName, email } = state.user
    } else {
      navigate("/signin")
    }

  }, [[], state.user])

  return (
    <div className="flex flex-col w-full h-auto h-screen pb-40 bg-base">
      <Navbar />

    
      {state.user ? console.log("user is valid") : console.log("user is null")}
    </div>
  )
}

export default IndexPage
