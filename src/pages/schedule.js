import React, { useState, useContext, useEffect } from "react"
import Navbar from "../components/navbar"

import { HeartwoodStateContext, HeartwoodDispatchContext } from "../state/HeartwoodContextProvider"
import { firestore } from "../firebase/firebase"

const Schedule = () => {
  const dispatch = useContext(HeartwoodDispatchContext)
  const state = useContext(HeartwoodStateContext)

  return (
    <div className="w-screen min-h-screen bg-base">
      <Navbar />
      <div className="pt-8 font-mono"></div>
    </div>
  )
}

export default Schedule
