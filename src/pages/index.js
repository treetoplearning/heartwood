import React, { useContext } from "react";
import Navbar from "../components/navbar";
import IDE from "../components/ide";
import Term from "../components/term";
import Video from "../components/video";
import { HeartwoodDispatchContext } from "../state/HeartwoodContextProvider";

export default () => {
  const dispatch = useContext(HeartwoodDispatchContext)

  return (
    <div className="flex flex-col w-full h-screen bg-base">
      <Navbar />
      <div className="flex flex-row items-center justify-center w-full h-full ">
        <div className="flex flex-row w-full px-10">
          <div className="flex flex-col w-1/4">
            <div className="self-center h-48 m-3 bg-red-300 rounded-lg">
              
              {/* <img src="data:image/png;base64,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"/> */}
              {/* <Video/> */}
            </div>
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
            <div className="h-48 m-3 overflow-x-hidden bg-black rounded-lg">
              <Term termId="term" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}