import React, { useState, useEffect, useContext, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import "../css/global.css";
import "xterm/css/xterm.css";
import { HeartwoodStateContext, HeartwoodDispatchContext } from "../state/HeartwoodContextProvider";

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

const Term = ({ termId, requestCompile }) => {
  const [id, setId] = useState(termId);
  const [py, setPy] = useState(pyodideWorker);

  const state = useContext(HeartwoodStateContext);
  const dispatch = useContext(HeartwoodDispatchContext);

  const term = new Terminal({ cursorBlink: true });

  useEffect(() => {
    // PYODIDE
  
    // XTERM
    const terminalContainer = document.getElementById(id);
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalContainer);
    term.write('$ ');
    term.prompt = () => {
      term.write('\r\n$ ');
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
        if (term._core.buffer.x > 2) {
          term.write('\b \b');
          buffer = buffer.substring(buffer.length - 1);
        }
      } else if (printable) {
        buffer += e.key;
        term.write(e.key);
      }
    });
    fitAddon.fit();
  }, []);

  useEffect(() => {
    //console.log("da state changed to: ", state); 
  }, [state]);

  const compile = (body) => {
    py.postMessage({ python: body})
  }

  return (
    <div id={id} state={state}></div>
  )
}

export default Term;