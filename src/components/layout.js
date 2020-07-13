import React from "react"

import Navbar from "../components/navbar.js"

export default function Layout({ children, pageContext }) {

  return (
    <>
      <Navbar />

      {children}
   
    </>
  )
}
