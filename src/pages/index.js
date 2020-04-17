import React from "react"

import Navbar from "../components/navbar"
import IDE from "../components/ide"
import Term from "../components/term"

export default () => {
  return (
    <div>
      <div className="flex flex-col w-full h-screen bg-base">
        <Navbar />
        <div className="flex flex-row items-center justify-center w-full h-full ">
          <div className="flex flex-row w-full px-32">
            <div className="flex flex-col w-1/4">
              <div className="h-32 m-3 bg-red-300 rounded-lg"></div>
              <div className="h-64 m-3 bg-blue-300 rounded-lg"></div>
            </div>
            <div className="flex flex-col w-3/4">
              <div className="h-64 m-3 overflow-scroll bg-green-200 rounded-lg">
                <IDE />
              </div>
              <div className="inline-block h-32 m-3 overflow-x-hidden align-top bg-yellow-200 rounded-lg">
                <Term />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
