import React from "react";
import Terminal from "terminal-in-react";

const Term = () => {
  
  const showMsg = () => "Hello World";
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
      }}
    >
      <Terminal
        hideTopBar={true}
        allowTabs={false}
        color="white"
        backgroundColor="black"
        barColor="black"
        commands={{
          "open-google": () =>
            window.open("https://www.google.com/", "_blank"),
          showmsg: showMsg,
          popup: () => alert("Terminal in React"),
        }}
        descriptions={{
          "open-google": "opens google.com",
          showmsg: "shows a message",
          alert: "alert",
          popup: "alert",
        }}
      />
    </div>
  );
};

export default Term;
