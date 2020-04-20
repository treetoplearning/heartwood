import React from "react"

const Video = () => {
  const { connect } = require("twilio-video")

  function call() {
    connect("$TOKEN", { name: "Treetop Learning" }).then(
      room => {
        console.log(`Successfully joined a Room: ${room}`)
        room.on("participantConnected", participant => {
          console.log(`A remote Participant connected: ${participant}`)
        })
      },
      error => {
        console.error(`Unable to connect to Room: ${error.message}`)
      }
    )
  }

  function generateCameraPreview() {
    const { createLocalVideoTrack } = require("twilio-video")

    createLocalVideoTrack().then(track => {
      const localMediaContainer = document.getElementById("local-media")
      localMediaContainer.appendChild(track.attach())
    })
  }

  return (
    <div>
      <button className="w-full bg-white" onClick={() => call()}>
        click me to test
      </button>
      <div className="w-full h-full bg-red">
       
      </div>
    </div>
  )
}

Video.propTypes = {}

export default Video

