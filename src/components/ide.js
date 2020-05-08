import React, { useEffect } from 'react';
import { UnControlled as CodeMirror } from "react-codemirror2";
import { useContext } from "react";
import { HeartwoodStateContext, HeartwoodDispatchContext } from "../state/HeartwoodContextProvider";
import '../styles/ide.css';


const IDE = () => {
 // const [socketUrl, setSocketUrl] = useState("ws://localhost:8080");
 // const [sendMessage, lastMessage, readyState, getWebSocket] = useWebSocket(
 //   socketUrl
  //);
  //const handleClickSendMessage = useCallback((val) => sendMessage(val), []);
  const state = useContext(HeartwoodStateContext);
  const dispatch = useContext(HeartwoodDispatchContext);
  
  useEffect( () => {
    require('codemirror/mode/python/python'); // need to rerender CodeMirror after this to enable syntax highlighting
  }, [])

  return (
    <CodeMirror
      value={state.ideBody}
      
      editorDidMount={(editor) => editor.setSize("100%", "16rem")}
      options={{
        mode: "python",
        theme: "material",
        lineNumbers: true,
      }}
      onChange={(editor, data, value) => {
        dispatch({type: "WRITE_IDE", body: value})
      }}
    />
  );
};

IDE.propTypes = {};

export default IDE;