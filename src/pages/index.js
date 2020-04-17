import React, { useState, useEffect } from "react"

import Navbar from "../components/navbar"
import IDE from "../components/ide"
import Term from "../components/term"

export default () => {
  const [py, setPy] = useState();
  useEffect(() => {
    const pyodideWorker = new Worker('./pyodide/webworker.js');
    pyodideWorker.onerror = (e) => {
      console.log(`Error in pyodideWorker at ${e.filename}, Line: ${e.lineno}, ${e.message}`)
    }

    pyodideWorker.onmessage = (e) => {
      const { results, error } = e.data
      if (results) {
        console.log('pyodideWorker return results: ', results);
        setPy(results);
      } else if (error) {
        console.log('pyodideWorker error: ', error)
      }
    }
    setPy(pyodideWorker);
  }, []);

  const compile = () => {
    py.postMessage({ python: "print(4)" })
  }

  //MyWorker.postMessage({ python: "print(3)"});
  return (
    <div>
      <div className="flex flex-col w-full h-screen bg-base">
        <Navbar />
        <div className="flex flex-row items-center justify-center w-full h-full ">
          <div className="flex flex-row w-full px-16">
            <div className="flex flex-col w-1/4">
              <div className="h-32 m-3 bg-red-300 rounded-lg"></div>
              <div className="h-64 m-3 bg-blue-300 rounded-lg">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-2 py-2 px-4 rounded" onClick={compile}>
                  [Debug] Compile Python
                </button>
              </div>
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
