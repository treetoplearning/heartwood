import React, { useState, useEffect, useContext } from 'react';
import "../css/global.css";
import "xterm/css/xterm.css";
import { HeartwoodStateContext, HeartwoodDispatchContext } from "../state/HeartwoodContextProvider";

const Term = ({ termId, requestCompile }) => {
  const [id] = useState(termId);
  //const [py, setPy] = useState();

  const state = useContext(HeartwoodStateContext);
  const dispatch = useContext(HeartwoodDispatchContext);

  useEffect(() => {
    // PYODIDE
    const pyodideWorker = new Worker('./pyodide/webworker.js');
    pyodideWorker.onerror = (e) => {
      console.log(`Error in pyodideWorker at ${e.filename}, Line: ${e.lineno}, ${e.message}`)
    }
    pyodideWorker.onmessage = (e) => {
      const { results, error } = e.data
      if (results) {
        console.log('pyodideWorker return results: ', results);
      } else if (error) {
        console.log('pyodideWorker error: ', error)
      }
    }
    const compile = (body) => {
      pyodideWorker.postMessage({ python: body})
    }
  
    // XTERM
    const xt = require('xterm');
    const xtf = require('xterm-addon-fit');
    const term = new xt.Terminal({ cursorBlink: true, fontSize: "17" });
    const terminalContainer = document.getElementById(id);
    const fitAddon = new xtf.FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalContainer);
    term.write('\r\n ');
    term.write(' $ ');
    term.prompt = () => {
      term.write('\r\n ');
      term.write(' $ ');
    };
    let buffer = ""
    term.onKey(e => {
      const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey;
      if (e.domEvent.keyCode === 13) {
        if (buffer === "python3 file.py") {
          dispatch({ type: "COMPILE", cb: compile});
        }
        buffer = "";
        term.prompt();
      } else if (e.domEvent.keyCode === 8) {
        // Do not delete the prompt
        if (term._core.buffer.x > 3) {
          
            term.write('\b \b');
            buffer = buffer.substring(0, buffer.length - 1)
         
          
        }
      } else if (printable) {
        buffer += e.key;
        console.log(buffer)
        term.write(e.key);
      }
    });
    fitAddon.fit();
  }, []);

  useEffect(() => {
    //console.log("da state changed to: ", state); 
  }, [state]);

  

  return (
    <div id={id}></div>
  )
}

export default Term;