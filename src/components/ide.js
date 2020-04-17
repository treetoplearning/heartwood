import React from 'react';
import { UnControlled as CodeMirror } from "react-codemirror2";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useEffect, useState, useCallback } from "react";

const IDE = () => {
 // const [socketUrl, setSocketUrl] = useState("ws://localhost:8080");
  const [ideVal, setIdeVal] = useState("print '2'");
 // const [sendMessage, lastMessage, readyState, getWebSocket] = useWebSocket(
 //   socketUrl
  //);
  //const handleClickSendMessage = useCallback((val) => sendMessage(val), []);

  const log = (x) => console.log(x);

  function outf(text) {
    setIdeVal(ideVal + text);
  }

  return (
    <div className="">
      <div>
        <CodeMirror
          value={ideVal}
          editorDidMount={(editor) => editor.setSize("100%", "16rem")}
          options={{
            mode: "xml",
            theme: "material",
            lineNumbers: true,
          }}
          onChange={(editor, data, value) => {
            setIdeVal(value);
            console.log(ideVal);
          }}
        />
      </div>
    </div>
  );
};

IDE.propTypes = {};

export default IDE;