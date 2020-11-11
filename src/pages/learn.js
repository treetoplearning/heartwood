import React, { useContext, useEffect, useState } from "react"
import Navbar from "../components/navbar"
import IDE from "../components/ide"
import Term from "../components/term"
import Video from "../components/video"
import { HeartwoodStateContext } from "../state/HeartwoodContextProvider"

import {signUpComplete} from "../utils/utils"

import "../styles/video.css"

const Learn = ({ location }) => {
  const state = useContext(HeartwoodStateContext)

  const [showPage, setShowPage] = useState(false)

  useEffect(() => {
    if (state.user) {
    const gatsby = require("gatsby")
    console.log("location is", location.state)
    if (true) {
      setShowPage(true)
    } else {
      gatsby.navigate("/")
    }
    
    }
  }, [state.user])

  return (
    <div className="flex flex-col w-full h-screen bg-base">
      {(showPage && signUpComplete(state.user)) && (
        <>
          <Navbar />
          <div className="flex flex-row items-center justify-center w-full h-full ">
            <div className="flex flex-row w-full px-10">
              <div className="flex flex-col w-1/4 min-w-xs">
                <div className="m-3 bg-black rounded-lg ">
                  <div className="relative rounded-lg pb-3/4">
                    <div className="absolute object-cover w-full h-full">
                      <Video className="rounded-lg" />
                    </div>
                  </div>
                </div>
                <div className="flex-grow h-48 m-3 overflow-y-scroll bg-orange-200 rounded-lg -mb-200 ">
                <p className="m-5 "> {state.user.nextLessonInfo} </p>
                </div>
              </div>
              <div className="flex flex-col w-3/4">
                <div className="h-64 m-3 overflow-scroll rounded-lg bg-ideBase">
                  <IDE />
                </div>
                <div className="h-48 px-4 m-3 overflow-x-hidden bg-black rounded-lg">
                  <Term termId="term" />
                </div>
              </div>
            </div>
            <div className="h-full m-3 bg-blue-300 rounded-lg"></div>
          </div>
        </>
      )}
    </div>
  )
}

export default Learn
