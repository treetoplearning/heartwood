import React, { useContext, useEffect, useState } from "react"
import useInterval from "../hooks/useInterval"

import { Link } from "gatsby"
import { HeartwoodStateContext } from "../state/HeartwoodContextProvider"
import { isLoggedIn, signUpComplete } from "../utils/utils"
import gear from "../assets/gear.svg"

import Navbar from "../components/navbar"
import CollectInfo from "../components/collectinfo"

import { format, differenceInMinutes } from "date-fns"

const IndexPage = () => {
  const state = useContext(HeartwoodStateContext)
  const [form, setForm] = useState({ startTime: "", stopTime: "", showMeetingButton: false, lessonDescription: "", isLoading: true})

  // every second check
  useInterval(() => {
    const currentTime = new Date()
    console.log('form is', form)
    // Check if the current time is within five minutes either way of the next lesson's time
    if (differenceInMinutes(form.startTime, currentTime) <= 5 && differenceInMinutes(currentTime, form.stopTime) <= 5) {
      setForm({ ...form, isLoading: false, showMeetingButton: true })
    } 
    
  }, 1000)

  useEffect(() => {
    if (state.user) {
      fetch("http://localhost:5000/getNextMeeting", {method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: state.user.uid })})
        .then((res) => res.json())
        .then((res) => {

          if (res.startTime === -1 && res.stopTime === -1) {
            // catch case where there is not a next meeting
            setForm({...form,
              isLoading: false,
              lessonDescription: "You do not have any upcoming lessons scheduled"})
          } else {
            // otherwise handle the case where a next meeting exists
            const formattedStartTime = new Date(res.startTime.dateTime)
            const formattedStopTime = new Date(res.stopTime.dateTime)

            const lessonDescription = format(formattedStartTime,
              "'Your next lesson is on: ' EEEE, LLLL do, y 'at' h:mm a '(PST)'")
            setForm({...form,
              isLoading: false,
              startTime: formattedStartTime,
              stopTime: formattedStopTime,
              lessonDescription: lessonDescription})
          }
          
        })
    }
  }, [state.user, form.lessonDescription])

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
