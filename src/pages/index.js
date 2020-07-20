import React, { useContext, useEffect, useState } from "react"
import useInterval from "../hooks/useInterval"

import { Link } from "gatsby"
import { HeartwoodStateContext } from "../state/HeartwoodContextProvider"
import { isLoggedIn, signUpComplete, getEndpointPrefix } from "../utils/utils"
import gear from "../assets/gear.svg"

import Navbar from "../components/navbar"
import CollectInfo from "../components/collectinfo"
import IDE from "../components/ide"

import { format, differenceInMinutes } from "date-fns"

const IndexPage = () => {
  const state = useContext(HeartwoodStateContext)
  const [form, setForm] = useState({ startTime: "", stopTime: "", showMeetingButton: false, lessonDescription: "", isLoading: true})

  const setMeetingButton = () => {
    const currentTime = new Date()
    // Check if the current time is within five minutes either way of the next lesson's time
    if (differenceInMinutes(form.startTime, currentTime) <= 5 && differenceInMinutes(currentTime, form.stopTime) <= 5) {
      setForm({ ...form, showMeetingButton: true, isLoading: false })
    } else {
      setForm({ ...form, showMeetingButton: false, isLoading: false })
    }
  }
  
  useEffect(() => {
    if (state.user) {
      const endpoint = getEndpointPrefix() + "/getNextMeeting"
      fetch(endpoint, {method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: state.user.uid })})
        .then((res) => res.json())
        .then((res) => {
          console.log("response has arrived", res)
          if (res.startTime === -1 && res.stopTime === -1) {
            // catch case where there is not a next meeting
            setForm({...form, 
              lessonDescription: "You do not have any upcoming lessons scheduled"})
          } else {
            console.log("its a meeting")
            // otherwise handle the case where a next meeting exists
            const formattedStartTime = new Date(res.startTime.dateTime)
            const formattedStopTime = new Date(res.stopTime.dateTime)
            const lessonDescription = format(formattedStartTime,
              "'Your next lesson is on: ' EEEE, LLLL do, y 'at' h:mm a '(PST)'")
            setForm({...form, startTime: formattedStartTime, stopTime: formattedStopTime, lessonDescription: lessonDescription})
            }
        })
        .catch((res) => {
          console.error("unable to get next meeting")
        })
    }
  }, [state.user])

  useEffect(() => {
    if (form.lessonDescription !== 'DEFAULT') {
      setMeetingButton()
    }
  }, [form.lessonDescription])

  return (
    <div className="flex flex-col w-full h-auto h-screen pb-40 font-mono bg-base">
      
       {form.isLoading && (
        <div className="flex self-center justify-center w-screen h-auto min-h-screen ">
          {" "}
          <object color="white" type="image/svg+xml" data={gear}>
            svg-animation
          </object>{" "}
        </div>
      )}
    
      {(!form.isLoading && signUpComplete(state.user)) ? (
       
        <>
          <Navbar />
          

          <div className="flex flex-col">
            <div>
              <p className="mt-10 text-xl text-center text-white"> {form.lessonDescription}</p>
            </div>
            {form.showMeetingButton && (
              <Link
           
                to="learn"
                state={{showPage: true}}
                className="self-center w-1/3 px-4 py-2 mt-10 text-2xl text-center text-black bg-white rounded-xl "
              >
                {" "}
                Head to your lesson{" "}
              </Link>
            )}
          </div>
        </>
      ) : (
        isLoggedIn(state.user) && <CollectInfo />
      )}
      
    </div>
  )
}

export default IndexPage
