import React, { useEffect, useRef, useContext } from "react"
import firebase from "gatsby-plugin-firebase"
import { HeartwoodStateContext, HeartwoodDispatchContext } from "../state/HeartwoodContextProvider"
import "../styles/ide.css"

import {getEndpointPrefix} from "../utils/utils"


const IDE = () => {
  const editorRef = useRef(null)

  const state = useContext(HeartwoodStateContext)
  const dispatch = useContext(HeartwoodDispatchContext)

  // Helper to get hash from end of URL or generate a random one
  const getExampleRef = () => {
    let ref = firebase.database().ref()
    let hash = window.location.hash.replace(/#/g, "")

    if (hash) {
      ref = ref.child(hash)
    } else {
      // generate unique location based on the 
      const endpoint = getEndpointPrefix() + "/getIDEToken"
      fetch(endpoint, {method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: state.user.uid})})
          .then((res) => res.json())
          .then(res => {
            ref = res.IDEToken
            console.log('ref is', ref) // generate unique location.
          })
          .catch(err => {
            console.log("error in retrieving IDEToken", err)
          })
    }

    return ref
  }

  useEffect(() => {
    const CodeMirror = require("codemirror")
    require("codemirror/mode/python/python")

    // get Firepad reference for realtimeDB creation and session access
    const firepadRef = getExampleRef()

    // initialize codeMirror instance to pass into Firepad
    const codeMirror = CodeMirror(editorRef.current, {lineWrapping: true,
      lineNumbers: true,
      theme: "material",
      mode: "python"})

    window.CodeMirror = CodeMirror
    const Firepad = require("firepad")

    // initialize Firepad instance under the firepadRef realtimeDB address, and navigate to that address
    const firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {richTextToolbar: false,
      richTextShortcuts: false,
      defaultText:
        '// Python Editing with Firepad!\nfunction go() {\n  var message = "Hello, world.";\n  console.log(message);\n}'})
  }, [])

  return (
    <>
      <div id="firepad-container" ref={editorRef}></div>
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
