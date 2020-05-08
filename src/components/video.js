import React, { useEffect, useState } from "react"
import axios from "axios"

import VideoIcon from "../components/videoicon.js"

import { library } from "@fortawesome/fontawesome-svg-core"
import {
  faTv,
  faMicrophone,
  faPhoneAlt,
  faPhoneSlash,
} from "@fortawesome/free-solid-svg-icons"
library.add(faMicrophone, faPhoneAlt, faTv, faPhoneSlash)

const Video = () => {
  const { connect, createLocalVideoTrack } = require("twilio-video")

  useEffect(() => {
    console.log(onCall)
  }, [onCall])
  const [local, setLocal] = useState(true)
  const [remote, setRemote] = useState(true)
  const [room, setRoom] = useState()
  const [onCall, setOnCall] = useState(false)

  function startCall() {
    setOnCall(true)
    call()
  }

  function endCall() {
    setOnCall(false)
    room.disconnect()
  }

  function call() {
    const getParticipantToken = async ({ identity, room, participants }) => {
      // const params = new URLSearchParams();
      const result = await axios({
        method: "POST",
        url: "https://10.0.1.26:8080/token",
        data: { identity, room, participants },
      })
      return result
    }

    getParticipantToken({ identity: "Jacob", room: "Treetop-Testing" })
      .then(res => res.data)
      .then(data =>
        connect(data, { name: "Treetop-Testing" }).then(
          room => {
            // Store the room for future reference.
            setRoom(room)

            console.log(`Successfully joined a Room: ${room}`)

            // Set up local media
            createLocalVideoTrack().then(track => {
              const localMediaContainer = document.getElementById("local-media")
              localMediaContainer.appendChild(track.attach())
            })

            // Log new participants
            room.participants.forEach(participant => {
              console.log(
                `Participant "${participant.identity}" has connected to the Room`
              )
            })

            // Share all participants media with each other
            room.on("participantConnected", participant => {
              console.log(`Participant "${participant.identity}" connected`)

              participant.tracks.forEach(publication => {
                if (publication.isSubscribed) {
                  const track = publication.track
                  document
                    .getElementById("remote-media-div")
                    .appendChild(track.attach())
                }
              })

              participant.on("trackSubscribed", track => {
                setLocal(false)
                setRemote(true)
                document
                  .getElementById("remote-media-div")
                  .appendChild(track.attach())
              })
            })

            // Disconnect user and show local input
            room.on("disconnected", room => {
              console.log(`Participant has disconnected.`)

              console.log(room.participants)

              // Detach the local media elements
              room.localParticipant.tracks.forEach(publication => {
                const attachedElements = publication.track.detach()
                attachedElements.forEach(element => element.remove())
              })

              setRemote(false)
              setLocal(true)
            })

            room.participants.forEach(participant => {
              participant.tracks.forEach(publication => {
                const track = publication.track
                if (publication.track) {
                  document
                    .getElementById("remote-media-div")
                    .appendChild(track.attach())
                }
              })

              participant.on("trackSubscribed", track => {
                setLocal(false)
                setRemote(true)
                document
                  .getElementById("remote-media-div")
                  .appendChild(track.attach())
              })
            })
          },
          error => {
            console.error(`Unable to connect to Room: ${error.message}`)
          }
        )
      )
  }

  return (
    <div className="relative flex flex-col w-full h-full text-md">
      <div className="">
        {remote && <div id="remote-media-div" className="z-0"></div>}

        {local && <div id="local-media" className="z-0"></div>}
      </div>

      <div className="absolute bottom-0 flex-row self-center mb-4 ">
        <VideoIcon icon={faMicrophone} action={endCall}></VideoIcon>
        {!onCall && (
          <VideoIcon icon={faPhoneAlt} action={startCall}></VideoIcon>
        )}
        {onCall && <VideoIcon icon={faPhoneSlash} action={endCall}></VideoIcon>}
        <VideoIcon icon={faTv} onClick={() => endCall()}></VideoIcon>
      </div>
    </div>
  )
}

Video.propTypes = {}

export default Video
