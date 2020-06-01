import React, { useEffect, useState } from "react"
import axios from "axios"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { library } from "@fortawesome/fontawesome-svg-core"
import {
  faTv,
  faMicrophone,
  faMicrophoneSlash,
  faPhoneAlt,
  faPhoneSlash,
} from "@fortawesome/free-solid-svg-icons"

library.add(faMicrophone, faPhoneAlt, faTv, faPhoneSlash, faMicrophoneSlash)

const Video = () => {
  const { connect, createLocalVideoTrack } = require("twilio-video")

  useEffect(() => {}, [])

  const [local, setLocal] = useState(true)
  const [remote, setRemote] = useState(true)
  const [room, setRoom] = useState()
  const [onCall, setOnCall] = useState(false)
  const [mute, setMute] = useState(false)

  function startCall() {
    setOnCall(true)
    call()
  }

  function endCall() {
    setOnCall(false)
    room.disconnect()
  }

  function toggleMute() {
    if (room) {
      if (mute === false) {
        muteAudio()
      } else {
        unmuteAudio()
      }
      setMute(!mute)
    }
  }

  // Mute all of the local user's tracks.
  function muteAudio() {
    room.localParticipant.audioTracks.forEach((publication) => {
      publication.track.disable()
    })
  }

  // Unmute all of the local user's tracks.
  function unmuteAudio() {
    room.localParticipant.audioTracks.forEach((publication) => {
      publication.track.enable()
    })
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
      .then((res) => res.data)
      .then((data) =>
        connect(data, { name: "Treetop-Testing" }).then(
          (room) => {
            // Store the room for future reference.
            setRoom(room)

            console.log(`Successfully joined a Room: ${room}`)

            // Set up local media
            createLocalVideoTrack().then((track) => {
              setLocal(true)
              setRemote(false)
              const localMediaContainer = document.getElementById("local-media")
              localMediaContainer.appendChild(track.attach())
              console.log("People left in the room are:", room.participants)
            })

            // Log new participants
            room.participants.forEach((participant) => {
              console.log(`Participant "${participant.identity}" has connected to the Room`)
            })

            // Share all participants media with each other
            room.on("participantConnected", (participant) => {
              console.log(`Participant "${participant.identity}" connected`)

              participant.tracks.forEach((publication) => {
                if (publication.isSubscribed) {
                  const track = publication.track
                  setLocal(false)
                  document.getElementById("remote-media-div").appendChild(track.attach())
                }
              })

              participant.on("trackSubscribed", (track) => {
                setLocal(false)
                setRemote(true)
                document.getElementById("remote-media-div").appendChild(track.attach())
              })
            })

            // Disconnect user and show local input
            room.on("disconnected", (room) => {
              console.log(`Participant has disconnected.`)

              console.log("People left in the room are:", room.participants)

              room.participants.forEach((participant) => {
                participant.tracks.forEach((publication) => {
                  const track = publication.track
                  if (publication.track && participant !== room.localParticipant) {
                    console.log("hello")
                    document.getElementById("local-media").removeChild(track)
                    document.getElementById("remote-media-div").removeChild(track)
                  }
                })
              })

              // Detach the local media elements
              room.localParticipant.tracks.forEach((publication) => {
                const attachedElements = publication.track.detach()
                attachedElements.forEach((element) => element.remove())
              })

              console.log("People left in the room are:", room.participants)
              if (room.participants.size === 0) {
                setLocal(false)
              } else {
                setLocal(true)
              }
              setRemote(false)
            })

            room.participants.forEach((participant) => {
              participant.tracks.forEach((publication) => {
                const track = publication.track
                if (publication.track) {
                  document.getElementById("remote-media-div").appendChild(track.attach())
                }
              })

              participant.on("trackSubscribed", (track) => {
                setLocal(false)
                setRemote(true)
                document.getElementById("remote-media-div").appendChild(track.attach())
              })
            })
          },
          (error) => {
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
        {!mute && (
          <button
            className="invisible w-8 p-1 mx-2 text-white transition bg-gray-600 rounded-full opacity-75 duration-400 hover:opacity-100 md:visible"
            onClick={() => toggleMute()}
          >
            <FontAwesomeIcon icon={faMicrophone}></FontAwesomeIcon>
          </button>
        )}
        {mute && (
          <button
            className="invisible w-8 p-1 mx-2 text-white transition bg-gray-600 rounded-full opacity-75 duration-400 hover:opacity-100 md:visible"
            onClick={() => toggleMute()}
          >
            <FontAwesomeIcon icon={faMicrophoneSlash}></FontAwesomeIcon>
          </button>
        )}

        {!onCall && (
          <button
            className="invisible w-8 p-1 mx-2 text-white transition bg-green-600 rounded-full opacity-75 duration-400 hover:opacity-100 md:visible"
            onClick={() => startCall()}
          >
            <FontAwesomeIcon icon={faPhoneAlt}></FontAwesomeIcon>
          </button>
        )}
        {onCall && (
          <button
            className="invisible w-8 p-1 mx-2 text-white transition bg-red-600 rounded-full opacity-75 duration-400 hover:opacity-100 md:visible"
            onClick={() => endCall()}
          >
            <FontAwesomeIcon icon={faPhoneSlash}></FontAwesomeIcon>
          </button>
        )}

        <button className="invisible w-8 p-1 mx-2 text-white transition bg-gray-600 rounded-full opacity-75 duration-400 hover:opacity-100 md:visible">
          <FontAwesomeIcon icon={faTv}></FontAwesomeIcon>
        </button>
      </div>
    </div>
  )
}

Video.propTypes = {}

export default Video
