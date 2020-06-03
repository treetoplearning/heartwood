import React, { useContext, useEffect } from "react"
import Navbar from "../components/navbar"
import { navigate, Link } from "gatsby"
import { HeartwoodStateContext, HeartwoodDispatchContext } from "../state/HeartwoodContextProvider"
import { isLoggedIn } from "../utils/utils"

const IndexPage = () => {
  const state = useContext(HeartwoodStateContext)
  const dispatch = useContext(HeartwoodDispatchContext)

  useEffect(() => {
    if (isLoggedIn(state.user)) {
      const { photoURL, displayName, email } = state.user
    } else {
      navigate("/signin")
    }
  }, [state.user])

  return (
    <div className="flex flex-col w-full h-auto h-screen pb-40 bg-base">
      {isLoggedIn(state.user) && (
        <>
          <Navbar />
          <Link to="learn" className="mx-32 font-mono text-3xl text-white underline"> Head to your lesson </Link>
        </>
      )}
      {isLoggedIn(state.user) && console.log("firstName is", state.firstName)}
    </div>
  )
}

export default IndexPage
