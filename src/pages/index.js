import React, { useContext, useEffect } from "react"
import Navbar from "../components/navbar"
import { Link } from "gatsby"
import { HeartwoodStateContext, HeartwoodDispatchContext } from "../state/HeartwoodContextProvider"
import { isLoggedIn, signUpComplete } from "../utils/utils"

import CollectInfo from "../components/collectinfo"

const IndexPage = () => {
  const state = useContext(HeartwoodStateContext)
  const dispatch = useContext(HeartwoodDispatchContext)

  useEffect(() => {
    if (state.user) {
    fetch("http://localhost:5000/getNextMeeting", {method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ uid: state.user.uid})})
        .then((res) => res.json())
        .then((res) => console.log(res))
    }
  }, [state.user])

  return (
    <div className="flex flex-col w-full h-auto h-screen pb-40 font-mono bg-base">
      {signUpComplete(state.user) ? (
        <>
          <Navbar />

          <Link to="learn" className="text-3xl text-center text-white underline ">
            {" "}
            Head to your lesson{" "}
          </Link>
          <div>
            <p className="text-2xl text-center text-white"> Your next lesson is on </p>
          </div>
        </>
      ) : (
        isLoggedIn(state.user) && <CollectInfo />
      )}
    </div>
  )
}

export default IndexPage
