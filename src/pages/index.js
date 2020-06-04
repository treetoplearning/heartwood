import React, { useContext, useEffect } from "react"
import Navbar from "../components/navbar"
import { navigate, Link } from "gatsby"
import { HeartwoodStateContext, HeartwoodDispatchContext } from "../state/HeartwoodContextProvider"
import { isLoggedIn, signUpComplete } from "../utils/utils"

import CollectInfo from "../components/collectinfo"

const IndexPage = () => {
  const state = useContext(HeartwoodStateContext)
  const dispatch = useContext(HeartwoodDispatchContext)

  useEffect(() => {
    if (isLoggedIn(state.user)) {
      console.log(state.user)
    } else {
      navigate("/signin")
    }
  }, [state.user])

  return (
    <div className="flex flex-col w-full h-auto h-screen pb-40 bg-base">
      {signUpComplete(state.user) ? (
        <>
          <Navbar />
          <Link to="learn" className="w-full font-mono text-3xl text-center text-white underline">
            
            {" "}
            Head to your lesson{" "}
          </Link>
        </>
      ) : (
        <CollectInfo />
      )}
    </div>
  )
}

export default IndexPage
