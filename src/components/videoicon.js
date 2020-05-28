import React from "react"

import PropTypes from "prop-types"


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const VideoIcon = ({ icon, alert, action, onCall }) => {
  return (
    <>
      <button
        className={
          "invisible w-8 p-1 mx-2 bg-gray-600 rounded-full transition duration-400 hover:opacity-100 opacity-75 md:visible " +
          (alert ? (onCall ? "bg-red-600" : "bg-green-600") : "bg-gray-600")
        }
        onClick={() => action()}
      >
        <FontAwesomeIcon className="text-white" icon={icon}></FontAwesomeIcon>
      </button>
    </>
  )
}

VideoIcon.propTypes = {
  alert: PropTypes.bool,
  onCall: PropTypes.bool,
}

export default VideoIcon
