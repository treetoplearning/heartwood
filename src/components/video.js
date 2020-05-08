import React, { useEffect, useState } from "react"
import axios from "axios"

const Video = () => {
  const { connect, createLocalVideoTrack } = require("twilio-video")

  useEffect(() => {}, [])
  const [test, setTest] = useState(true)
  const [local, setLocal] = useState(true)

  function work() {
    setTest(false)
    call()
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
      .then(data => {
        connect(data, { name: "Treetop-Testing" }).then(
          room => {
            console.log(`Successfully joined a Room: ${room}`)

            createLocalVideoTrack().then(track => {
              const localMediaContainer = document.getElementById("local-media")
              localMediaContainer.appendChild(track.attach())
            })

            room.participants.forEach(participant => {
              console.log(
                `Participant "${participant.identity}" is connected to the Room`
              )
            })

            // Attach the Participant's Media to a <div> element.
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
                document
                  .getElementById("remote-media-div")
                  .appendChild(track.attach())
              })
            })

            room.participants.forEach(participant => {
              participant.tracks.forEach(publication => {
                const track = publication.track
                if (publication.track) {
                  document.getElementById('remote-media-div').appendChild(track.attach());
                }
              });
            
             participant.on('trackSubscribed', track => {
                document.getElementById('remote-media-div').appendChild(track.attach());
                setLocal(false)
              });
            });
            
          },
          error => {
            console.error(`Unable to connect to Room: ${error.message}`)
          }
        )
      })
  }

  return (
    <>
      {test && (
        <button className="z-10 w-full bg-white" onClick={() => work()}>
          click me to test
        </button>
      )}
     
      <div id="remote-media-div" className="z-0"></div>

      {local && 
      <div id="local-media" className="z-0"></div>
}
    </>
  )
}

Video.propTypes = {}

export default Video
