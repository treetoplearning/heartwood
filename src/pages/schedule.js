import React, { useState, useContext, useEffect } from "react"
import { Calendar } from "@fullcalendar/core"
import dayGridPlugin from "@fullcalendar/daygrid"
import googleCalendarPlugin from "@fullcalendar/google-calendar"
import interactionPlugin from "@fullcalendar/interaction"
import { format } from "date-fns"

import Navbar from "../components/navbar"
import LoadingAnimation from "../components/loadinganimation"

import { HeartwoodStateContext } from "../state/HeartwoodContextProvider"

import gear from "../assets/gear.svg"

import "../styles/fullcalendar.css"

const Schedule = () => {
  const state = useContext(HeartwoodStateContext)

  const [form, setForm] = useState({message: { text: "", type: "" },
    isLoading: true,
    maxBooked: false,
    bookingConfirmed: false,
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
          setForm({ ...form, isLoading: false, message: { text: "Your booking was successful", type: "success" } })
          resetMessageAfterDelay(5000)
        }
      })
      .catch((err) =>
        setForm({...form,
          isLoading: false,
          message: { text: "There was an error in booking your lesson", type: "error" }}))

    resetMessageAfterDelay(12000)
  }

  const resetMessageAfterDelay = (delay) => {
    setTimeout(() => {
      setForm({ ...form, isLoading: false, message: { text: "", type: "" } })
    }, delay)
  }

  useEffect(() => {
    if (form.bookingConfirmed === true) {
      setForm({ ...form, isLoading: true })
      bookLesson({ id: form.targetLessonId })
    }
  }, [form.bookingConfirmed])

  useEffect(() => {
    if (state.user ) {
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

                resetMessageAfterDelay(12000)
                return
              }

              if (info.event.extendedProps.booked === true) {
                setForm({ ...form, isLoading: false, message: { text: "Error in booking lesson - this lesson has already been booked", type: "error" } })
                resetMessageAfterDelay(12000)
                return
              }

              // ensure that the event is not already booked before booking the lesson

              // ensure that the user hasn't already booked their max amount of lessons
              if (form.maxBooked === false) {
                const lessonTime = info.event.start
                const formattedLessonTime = format(lessonTime, "EEEE, LLLL do, y 'at' h:mm a '(PST)'")
                setForm({...form,
                  isLoading: false,
                  targetLessonId: info.event.id,
                  bookingConfirmed: false,
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
            {form.message.type === "error" && (
              <div className="w-full px-3 py-4 mb-3 text-center text-white break-words bg-red-600 rounded-lg">
                {form.message.text}
              </div>
            )}
            {form.message.type === "success" && (
              <div className="w-full px-3 py-4 mb-3 text-center text-white break-words rounded-lg bg-base">
                {form.message.text}
              </div>
            )}
            {form.message.type === "confirm" && (
              <div className="w-full px-3 py-4 mb-3 text-center text-white break-words rounded-lg bg-base">
                {form.message.text} <br />
              </div>
            )}
            <h1 className="w-full py-2 mb-3 text-center ">
              To schedule a lesson: click on an open time slot, and click confirm.
            </h1>
            {form.message.type === "confirm" && (
              <div className="flex justify-center mb-4">
                <button
                  onClick={() =>
                    setForm({ ...form, message: { text: "", type: "" }, isLoading: false, bookingConfirmed: false })
                  }
                  className="w-2/5 py-2 mr-4 text-base border rounded-lg md:w-1/3 lg:w-1/4 border-base "
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    setForm({ ...form, message: { text: "", type: "" }, isLoading: false, bookingConfirmed: true })
                  }
                  className="w-2/5 py-2 ml-4 text-white rounded-lg md:w-1/3 lg:w-1/4 bg-base"
                >
                  Confirm
                </button>
              </div>
            )}
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
