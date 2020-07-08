import React, { useState, useContext, useEffect } from "react"
import { Calendar } from "@fullcalendar/core"
import dayGridPlugin from "@fullcalendar/daygrid"
import googleCalendarPlugin from "@fullcalendar/google-calendar"
import interactionPlugin from "@fullcalendar/interaction"
import { format } from "date-fns"

import Navbar from "../components/navbar"
import LoadingAnimation from "../components/loadinganimation"
import Message from "../components/message"

import { HeartwoodStateContext } from "../state/HeartwoodContextProvider"

import gear from "../assets/gear.svg"

import "../styles/fullcalendar.css"

const Schedule = () => {
  const state = useContext(HeartwoodStateContext)

  const [form, setForm] = useState({message: { text: "", type: "" },
    isLoading: true,
    maxBooked: false,
    targetLessonId: ""})

  // take an input event and book that lesson to the user in state
  const bookLesson = (lessonInfo) => {
    fetch("http://localhost:5000/bookLesson", {method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({uid: state.user.uid,
        lessonId: lessonInfo.id,
        email: state.user.email,
        firstName: state.user.firstName,
        lastName: state.user.lastName})})
      .then((res) => res.json())
      .then((res) => {
        if (res.message === "maxBooked") {
          setForm({...form,
            maxBooked: true,
            isLoading: false,
            message: {text:
                "You have already booked a lesson, if you would like to change your lesson please email treetoplearningorg@gmail.com",
              type: "success"}})
        } else {
          setForm({ ...form, isLoading: false, maxBooked: true, message: { text: "Your booking was successful", type: "success" } })
        }
      })
      .catch((err) =>
        setForm({...form,
          isLoading: false,
          message: { text: "There was an error in booking your lesson", type: "error" }}))
  }

  const confirmLesson = () => {
    bookLesson({ id: form.targetLessonId })
  }

  const cancelLesson = () => {
    setForm({ ...form, message: { text: "", type: "" } })
  }

  useEffect(() => {
    if (state.user && !form.maxBooked) {
      fetch("http://localhost:5000/getUserEvents", {method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: state.user.uid, firstName: state.user.firstName, lastName: state.user.lastName })})
        .then((res) => res.json())
        .then((res) => {
          setForm({ ...form, isLoading: false })

          let calendarElement = document.getElementById("calendarElement")

          // initialize the Calendar object to be rendered to the DOMs
          let calendar = new Calendar(calendarElement, {plugins: [dayGridPlugin, googleCalendarPlugin, interactionPlugin],
            initialView: "dayGridMonth",

            eventMouseover: function () {},
            eventClick: function (info) {
              // do not allow the booking of a past event
              const currentTime = new Date()
              const eventTime = new Date(info.event.start)

              if (eventTime < currentTime) {
                setForm({...form,
                  isLoading: false,
                  message: { text: "Error in booking lesson - you cannot book a lesson in the past", type: "error" }})

                return
              }

              if (info.event.extendedProps.booked === true) {
                setForm({...form,
                  isLoading: false,
                  message: { text: "Error in booking lesson - this lesson has already been booked", type: "error" }})

                return
              }

              // ensure that the user hasn't already booked their max amount of lessons
              if (form.maxBooked === false) {
                const lessonTime = info.event.start
                const formattedLessonTime = format(lessonTime, "EEEE, LLLL do, y 'at' h:mm a '(PST)'")
                setForm({...form,
                  isLoading: false,
                  targetLessonId: info.event.id,
                  message: { text: "Are you sure you want to book this time: " + formattedLessonTime, type: "confirm" }})
              } else {
                setForm({...form,
                  isLoading: false,
                  targetLessonId: "",
                  message: {text:
                      "You have already booked a lesson, if you would like to change your lesson please email treetoplearningorg@gmail.com",
                    type: "success"}})
              }
            },
            weekends: false,
            header: false,
            events: res.events})
          calendar.render()
        })
        .catch((err) => console.log("error in fetching events", err))
    }
  }, [state.user, form.isLoading])

  return (
    <div className="w-screen min-h-screen bg-base">
      <Navbar />
      {form.isLoading && (
        <div className="flex self-center justify-center w-screen h-screen ">
          {" "}
          <LoadingAnimation data={gear} />
        </div>
      )}
      {!form.isLoading && (
        <div className="py-8 font-mono">
          <div className="w-11/12 px-6 py-8 mx-auto bg-white rounded rounded-xl lg:w-11/12 md:w-3/4 md:px-12">
            <h1 className="pt-4 mb-2 text-3xl font-bold text-center">Schedule</h1>
            <Message
              type={form.message.type}
              text={form.message.text}
              onConfirm={confirmLesson}
              onCancel={cancelLesson}
            />
            <h1 className="w-full py-2 mb-3 text-center ">
              To schedule a lesson: click on an open time slot, and click confirm.
            </h1>
            <div className="w-full pb-8">
              <div id="calendarElement"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Schedule
