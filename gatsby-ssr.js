import React from "react"
import HeartwoodContextProvider from "./src/state/HeartwoodContextProvider"

import "firebase/auth"
import "firebase/firestore"
import "firebase/functions"
import "firebase/database"


export const wrapRootElement = ({ element }) => {
  return <HeartwoodContextProvider>{element}</HeartwoodContextProvider>
}
