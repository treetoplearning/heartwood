import React, { useEffect } from "react"
import axios from "axios"

const Video = () => {
  const {
    connect,
    createLocalAudioTrack,
    createLocalVideoTrack,
  } = require("twilio-video")

  useEffect(() => {}, [])

  function call() {
    const getParticipantToken = async ({ identity, room }) => {
      // const params = new URLSearchParams();
      const result = await axios({
        method: "POST",
        url: "http://localhost:8080/token",
        data: { identity, room },
      })
      return result
    }

    getParticipantToken({ identity: "Jacob", room: "Treetop-Testing" })
      .then(res => res.data)
      .then(data => {
        connect(data, { name: "Treetop-Testing" }).then(
          room => {
            console.log(`Successfully joined a Room: ${room}`)
            createLocalVideoTrack().then(track => {
              const localMediaContainer = document.getElementById("local-media")
              localMediaContainer.appendChild(track.attach())
            })
            room.on("participantConnected", participant => {
              console.log(`A remote Participant connected: ${participant}`)
            })
          },
          error => {
            console.error(`Unable to connect to Room: ${error.message}`)
          }
        )
      })
  }

  // function generateCameraPreview() {
  //   const { createLocalVideoTrack } = require("twilio-video")

  //   createLocalVideoTrack().then(track => {
  //     const localMediaContainer = document.getElementById("local-media")
  //     localMediaContainer.appendChild(track.attach())
  //   })
  // }

  // need a max height
  return (
    <div id="local-media">
      <button className="w-full bg-white" onClick={() => call()}>
        click me to test
      </button>
    </div>
  )
}

Video.propTypes = {}

export default Video
