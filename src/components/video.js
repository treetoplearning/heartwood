import React, { useEffect, useState, useContext } from "react"
import axios from "axios"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { library } from "@fortawesome/fontawesome-svg-core"
import { faTv, faMicrophone, faMicrophoneSlash, faPhoneAlt, faPhoneSlash } from "@fortawesome/free-solid-svg-icons"

import { HeartwoodStateContext } from "../state/HeartwoodContextProvider"

import {getEndpointPrefix} from "../utils/utils"

library.add(faMicrophone, faPhoneAlt, faTv, faPhoneSlash, faMicrophoneSlash)

const Video = () => {
  const state = useContext(HeartwoodStateContext)

  const { connect } = require("twilio-video")

  const [room, setRoom] = useState()
  const [onCall, setOnCall] = useState(false)
  const [mute, setMute] = useState(false)

  const endCall = () => {
    setOnCall(false)
    room.disconnect()
  }

  const startCall = () => {
    call()
  }

  const toggleMute = () => {
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
  const muteAudio = () => {
    room.localParticipant.audioTracks.forEach((publication) => {
      publication.track.disable()
    })
  }

  // Unmute all of the local user's tracks.
  const unmuteAudio = () => {
    room.localParticipant.audioTracks.forEach((publication) => {
      publication.track.enable()
    })
  }

  const getParticipantToken = async ({ identity, room, participants }) => {
    // const params = new URLSearchParams();
    const endpoint = getEndpointPrefix() + "/token"
    const result = await axios({method: "POST",
      url: endpoint,
      data: { identity, room, participants }})
    return result
  }

  const call = () => {
    setOnCall(true)
    getParticipantToken({ identity: state.user.uid, room: state.user.uid })
      .then((res) =>
        connect(res.data.accessToken, { name: res.data.roomName, audio: true, video: { width: 640 } }).then((room) => {
            // Store the room for future reference.
            setRoom(room)

            console.log(`Successfully joined a Room: ${room}`)

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
                  document.getElementById("remote-media-div").appendChild(track.attach())
                }
              })

              participant.on("trackSubscribed", (track) => {
                document.getElementById("remote-media-div").appendChild(track.attach())
              })
            })

            room.on("trackUnsubscribed", (track) => {
              track.detach().forEach((element) => element.remove())
            })

            room.on("participantDisconnected", (room) => {
              setOnCall(false)
              document.getElementById("remote-media-div").innerHTML = ""
            })

            // Disconnect user and show local input
            room.on("disconnected", (room) => {
              console.log(`Participant has disconnected.`)

              room.localParticipant.tracks.forEach((publication) => {
                publication.track.disable()
                publication.track.stop()
                publication.track.detach().forEach((element) => element.remove())
                room.localParticipant.unpublishTrack(publication.track)
              })

              document.getElementById("remote-media-div").innerHTML = ""

              console.log("People left in the room are:", room.participants)
            })

            room.participants.forEach((participant) => {
              participant.tracks.forEach((publication) => {
                const track = publication.track
                if (publication.track) {
                  document.getElementById("remote-media-div").appendChild(track.attach())
                }
              })

              participant.on("trackSubscribed", (track) => {
                document.getElementById("remote-media-div").appendChild(track.attach())
              })
            })
          },
          (error) => {
            console.error(`Unable to connect to Room: ${error.message}`)
          }))
      .catch((err) => {
        console.log("There was an error", err)
      })
  }

  useEffect(() => {
    if (state.user) {
      // call()
    }
  }, [state.user])

  return (
    <div className="relative flex flex-col w-full h-full text-md">
      <div className="">
        <div id="remote-media-div" className="z-0"></div>
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
