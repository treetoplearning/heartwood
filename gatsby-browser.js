import React from "react"
import HeartwoodContextProvider from "./src/state/HeartwoodContextProvider"

export const wrapRootElement = ({ element }) => {
  return <HeartwoodContextProvider>{element}</HeartwoodContextProvider>
}