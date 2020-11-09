import React, { useContext, useEffect, useState } from "react"
import useInterval from "../hooks/useInterval"

import { Link } from "gatsby"
import { HeartwoodStateContext } from "../state/HeartwoodContextProvider"
import { isLoggedIn, signUpComplete, getEndpointPrefix } from "../utils/utils"
import gear from "../assets/gear.svg"

import Navbar from "../components/navbar"
import CollectInfo from "../components/collectinfo"
import LoadingAnimation from "../components/loadinganimation"

import { format, differenceInMinutes } from "date-fns"

const IndexPage = () => {
  const state = useContext(HeartwoodStateContext)
  const [form, setForm] = useState({startTime: "",
    stopTime: "",
    showMeetingButton: null,
    lessonDescription: "",
    isLoading: true})

  const setMeetingButton = () => {
    const currentTime = new Date()
    // Check if the current time is within five minutes either way of the next lesson's time
    if (differenceInMinutes(form.startTime, currentTime) <= 5 && differenceInMinutes(currentTime, form.stopTime) <= 5) {
      setForm({ ...form, showMeetingButton: true })
    } else {
      setForm({ ...form, showMeetingButton: false })
    }
  }

  useEffect(() => {
    if (state.user) {
      // catch the case of a first time user login
      if (!signUpComplete(state.user)) {
        setForm({ ...form, isLoading: false })
        return
      }

      const endpoint = getEndpointPrefix() + "/getNextMeeting"
      fetch(endpoint, {method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: state.user.uid })})
        .then((res) => res.json())
        .then((res) => {
          if (res.startTime === -1 && res.stopTime === -1) {
            // catch case where there is not a next meeting
            setForm({...form,
              lessonDescription: "You do not have any upcoming lessons scheduled",
              showMeetingButton: false})
          } else {
            // otherwise handle the case where a next meeting exists
            const formattedStartTime = new Date(res.startTime.dateTime)
            const formattedStopTime = new Date(res.stopTime.dateTime)
            const lessonDescription = format(formattedStartTime,
              "'Your next lesson is on: ' EEEE, LLLL do, y 'at' h:mm a '(PST)'")
            setForm({...form,
              startTime: formattedStartTime,
              stopTime: formattedStopTime,
              lessonDescription: lessonDescription})
          }
        })
        .catch((res) => {
          console.error("unable to get next meeting")
        })
    }
  }, [state.user])

  useEffect(() => {
    if (form.lessonDescription !== "DEFAULT" && signUpComplete(state.user)) {
      setMeetingButton()
    }
  }, [form.lessonDescription])

  useEffect(() => {
    if (signUpComplete(state.user)) {
      setForm({ ...form, isLoading: false })
    }
  }, [form.showMeetingButton])

  return (
    <div className="flex flex-col w-full h-auto min-h-screen pb-20 font-mono bg-base">
      {signUpComplete(state.user) && <Navbar />}

      {form.isLoading && (
        <div className="flex self-center justify-center w-screen h-screen ">
          {" "}
          <LoadingAnimation data={gear} />
        </div>
      )}

      {!form.isLoading && signUpComplete(state.user) ? (
        <>
          <div className="flex flex-col">
            <div>
              <p className="mt-10 text-xl text-center text-white"> {form.lessonDescription}</p>
            </div>
            {form.showMeetingButton && (
              <Link
                to="learn"
                state={{ showPage: true }}
                className="self-center w-3/4 px-4 py-2 mt-10 text-2xl text-center text-black bg-white md:w-2/3 rounded-xl "
              >
                {" "}
                Head to your lesson{" "}
              </Link>
            )}
          </div>
        </>
      ) : (
        isLoggedIn(state.user) && (
          <div className="pb-10">
            {" "}
            <CollectInfo />
          </div>
        )
      )}
    </div>
  )
}

export default IndexPage
