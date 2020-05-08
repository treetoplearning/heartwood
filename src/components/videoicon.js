import React from "react"

import "../styles/global.css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const VideoIcon = (props) => {
  return (
    <>
      <button className="w-8 p-1 mx-2 bg-gray-600 rounded-full opacity-75" onClick= { () =>
            props.action()
          }>
        <FontAwesomeIcon className="text-white" icon={props.icon}></FontAwesomeIcon>
      </button>
    </>
  )
}

export default VideoIcon
