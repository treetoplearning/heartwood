import React, { useEffect, useRef, useContext, useState } from "react"
import firebase from "gatsby-plugin-firebase"
import { HeartwoodStateContext, HeartwoodDispatchContext } from "../state/HeartwoodContextProvider"
import "../styles/ide.css"

import { getEndpointPrefix } from "../utils/utils"

const IDE = () => {
  const editorRef = useRef(null)

  const state = useContext(HeartwoodStateContext)
  const dispatch = useContext(HeartwoodDispatchContext)

  const getLessonID = async () => {
    const endpoint = getEndpointPrefix() + "/getIDEToken"
    return fetch(endpoint, {method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: state.user.uid })})
      .then((res) => res.json())
      .then((res) => {
        let id = res.IDEToken
        return id
      })
      .catch((err) => {
        console.log("error in retrieving IDEToken", err)
      })  
  }

  // Create the lesson reference by searching the databse for the lessonID
  const getLessonRef = () => {
    let ref = firebase.database().ref()

    // Need to get the results of getLessonID here and store then in a variable
    return getLessonID().then(res => ref.child(res))
  }

   // when ready to compile, get the contents of the IDE
   const getIDEInput = () => {
    const firepadText = document.getElementById("firepad-container").innerText
    return firepadText
  }

  useEffect(() => {
    if (state.user) {
      const CodeMirror = require("codemirror")
      require("codemirror/mode/python/python")

      // get Firepad reference for realtimeDB creation and session access
      const firepadRef = getLessonRef()

      firepadRef.then(res => {

      // initialize codeMirror instance to pass into Firepad
      const codeMirror = CodeMirror(editorRef.current, {scrollbarStyle: "null", lineNumbers: true, lineWrapping: true, theme: "material", mode: "python" })

      window.CodeMirror = CodeMirror
      const Firepad = require("firepad")

      // initialize Firepad instance under the firepadRef realtimeDB address, and navigate to that address
      const firepad = Firepad.fromCodeMirror(res, codeMirror, {richTextToolbar: false,
        richTextShortcuts: false,
        defaultText:
          '# Welcome to your lesson, write some code below then enter "python3 file.py" in the terminal to compile'})
        
      dispatch({ type: "WRITE_IDE", update: getIDEInput})
      })
        
    }
  }, [state.user])
  return (
    <>
      <div className="mt-2" id="firepad-container" ref={editorRef}></div>
    </>
  )
}

IDE.propTypes = {}

export default IDE

/* <CodeMirror
        value={state.ideBody}
        editorDidMount={(editor) => editor.setSize("100%", "16rem")}
        options={{ mode: "python", theme: "material", lineNumbers: true }}
        onChange={(editor, data, value) => {
          dispatch({ type: "WRITE_IDE", body: value })
        }}
      /> */
