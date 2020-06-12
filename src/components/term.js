import React, { useState, useEffect, useContext } from "react"
import "xterm/css/xterm.css"
import skulpt from "skulpt"
import { HeartwoodStateContext, HeartwoodDispatchContext } from "../state/HeartwoodContextProvider"

const Term = ({ termId }) => {
  const [id] = useState(termId)
  // const [py, setPy] = useState();

  const state = useContext(HeartwoodStateContext)
  const dispatch = useContext(HeartwoodDispatchContext)

  useEffect(() => {
    // XTERM
    const xt = require("xterm")
    const xtf = require("xterm-addon-fit")
    const term = new xt.Terminal({ cursorBlink: true, fontSize: "12" })
    const terminalContainer = document.getElementById(id)
    const fitAddon = new xtf.FitAddon()
    term.loadAddon(fitAddon)
    term.open(terminalContainer)
    term.write("\r\n")
    term.write("$ ")
    term.prompt = () => {
      term.write("\r\n")
      term.write("$ ")
    }
    let buffer = ""
    term.onKey((e) => {
      const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey
      if (e.domEvent.keyCode === 13) {
        if (buffer === "python3 file.py") {
          dispatch({ type: "COMPILE", cb: compile })
          buffer = ""
        } else {
          buffer = ""
          term.prompt()
        }
      } else if (e.domEvent.keyCode === 8) {
        // Do not delete the prompt
        if (term._core.buffer.x > 2) {
          term.write("\b \b")
          buffer = buffer.substring(0, buffer.length - 1)
        }
      } else if (printable) {
        buffer += e.key
        console.log(buffer)
        term.write(e.key)
      }
    })
    fitAddon.fit()

    // SKULPT
    function outf(text) {
      // hack to get around double outf() call
      // TODO: FIX THIS HACK, figure out why outf is called twice
      if (text.trim().length > 0) {
        term.write("\r\n")
        term.write(text)
        term.write("\r\n$ ")
      }
    }
    function builtinRead(x) {
      if (skulpt.builtinFiles === undefined || skulpt.builtinFiles.files[x] === undefined)
        throw `File not found: '${x}'`
      return skulpt.builtinFiles.files[x]
    }

    const compile = (body) => {
      skulpt.pre = "output"
      skulpt.configure({ output: outf, read: builtinRead })
      ;(skulpt.TurtleGraphics || (skulpt.TurtleGraphics = {})).target = "mycanvas"
      const myPromise = skulpt.misceval.asyncToPromise(function () {
        return skulpt.importMainWithBody("<stdin>", false, body, true)
      })
      myPromise.then(
        function (mod) {
          console.log("success")
        },
        function (err) {
          console.log(err.toString())
        }
      )
    }
  }, [])

  useEffect(() => {
    // console.log("da state changed to: ", state);
  }, [state])

  return <div id={id} />
}

export default Term
