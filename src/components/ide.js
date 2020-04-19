import React from 'react';
import { UnControlled as CodeMirror } from "react-codemirror2";
//import useWebSocket, { ReadyState } from "react-use-websocket";
//import { useEffect, useState, useCallback, useContext } from "react";
import { useContext } from "react";
import { HeartwoodStateContext, HeartwoodDispatchContext } from "../state/HeartwoodContextProvider";

const IDE = () => {
 // const [socketUrl, setSocketUrl] = useState("ws://localhost:8080");
 // const [sendMessage, lastMessage, readyState, getWebSocket] = useWebSocket(
 //   socketUrl
  //);
  //const handleClickSendMessage = useCallback((val) => sendMessage(val), []);
  const state = useContext(HeartwoodStateContext);
  const dispatch = useContext(HeartwoodDispatchContext);

  const log = (x) => console.log(x);

  return (
    <div className="">
      <div>
        <CodeMirror
          value={state.ideBody}
          editorDidMount={(editor) => editor.setSize("100%", "16rem")}
          options={{
            mode: "xml",
            theme: "material",
            lineNumbers: true,
          }}
          onChange={(editor, data, value) => {
            dispatch({type: "WRITE_IDE", body: value})
          }}
        />
      </div>
    </div>
  );
};

IDE.propTypes = {};

export default IDE;