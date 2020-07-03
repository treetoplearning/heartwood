import React, { useContext, useEffect } from "react"
import Navbar from "../components/navbar"
import IDE from "../components/ide"
import Term from "../components/term"
import Video from "../components/video"
import { navigate } from "gatsby"
import { HeartwoodStateContext, HeartwoodDispatchContext } from "../state/HeartwoodContextProvider"
import { isLoggedIn } from "../utils/utils"

import "../styles/video.css"

const Learn = ({location}) => {
  const state = useContext(HeartwoodStateContext)
  const dispatch = useContext(HeartwoodDispatchContext)

  const { showPage } = location.state || false

  return (
    <div className="flex flex-col w-full h-screen bg-base">
      {showPage ?  (
        <>
          <Navbar />
          <div className="flex flex-row items-center justify-center w-full h-full ">
            <div className="flex flex-row w-full px-10">
              <div className="flex flex-col w-1/4">
                <div className="m-3 bg-black rounded-lg">
                  <div className="relative rounded-lg pb-3/4">
                    <div className="absolute object-cover w-full h-full">
                      <Video className="rounded-lg" />
                    </div>
                  </div>
                </div>
                <div className="h-full m-3 bg-blue-300 rounded-lg"></div>
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
          </div>
        </>
      ) : navigate("/")}
    </div>
  )
}

export default Learn