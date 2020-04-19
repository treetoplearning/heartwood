import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/navbar";
import IDE from "../components/ide";
import Term from "../components/term";
import { HeartwoodStateContext, HeartwoodDispatchContext } from "../state/HeartwoodContextProvider";

export default () => {
  const state = useContext(HeartwoodStateContext);
  const dispatch = useContext(HeartwoodDispatchContext)

  return (
    <div className="flex flex-col w-full h-screen bg-base">
      <Navbar />
      <div className="flex flex-row items-center justify-center w-full h-full ">
        <div className="flex flex-row w-full px-16">
          <div className="flex flex-col w-1/4">
            <div className="h-32 m-3 bg-red-300 rounded-lg"></div>
            <div className="h-64 m-3 bg-blue-300 rounded-lg">
              <button className={(true ? "bg-green-500 hover:bg-green-700 " : "bg-green-100 hover:bg-green-300 ") + "text-white font-bold m-2 py-2 px-4 rounded"} onClick={() => dispatch({ type: "REQUEST_COMPILE" })}>
                Test Redux
              </button>
            </div>
          </div>
          <div className="flex flex-col w-3/4">
            <div className="h-64 m-3 overflow-scroll bg-green-200 rounded-lg">
              <IDE />
            </div>
            <div className="h-32 m-3 overflow-x-hidden bg-yellow-200 rounded-lg">
              <Term termId="term" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}