import React, { useState, useContext, useEffect } from "react"
import { Calendar } from "@fullcalendar/core"
import dayGridPlugin from "@fullcalendar/daygrid"
import googleCalendarPlugin from "@fullcalendar/google-calendar"
import interactionPlugin from "@fullcalendar/interaction"

import Navbar from "../components/navbar"
import LoadingAnimation from "../components/loadinganimation"

import { HeartwoodStateContext } from "../state/HeartwoodContextProvider"

import gear from "../assets/gear.svg"

const Schedule = () => {
  const state = useContext(HeartwoodStateContext)

  const [form, setForm] = useState({ message: { text: "", type: "" }, isLoading: true })

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
        setForm({ ...form, isLoading: false })
      })
      .catch(() =>
        setForm({...form,
          isLoading: false,
          message: { text: "There was an error in booking your lesson", type: "error" }}))
  }

  useEffect(() => {
    if (state.user) {
      fetch("http://localhost:5000/getUserEvents", {method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: state.user.uid })})
        .then((res) => res.json())
        .then((res) => {
          setForm({ ...form, isLoading: false })

          let calendarElement = document.getElementById("calendarElement")

          // initialize the Calendar object to be rendered to the DOMs
          let calendar = new Calendar(calendarElement, {plugins: [dayGridPlugin, googleCalendarPlugin, interactionPlugin],
            initialView: "dayGridMonth",
            dateClick: function () {
              setForm({ ...form, isLoading: false })
            },
            eventMouseover: function () {},
            eventClick: function (info) {
              // ensure that the event is not already booked before booking the lesson
              if (info.event.extendedProps.booked === false) {
                setForm({ ...form, isLoading: true })
                bookLesson({ id: info.event.id })
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
              <div className="w-full py-4 mb-3 text-center text-white bg-red-600 rounded-lg">{form.message.text}</div>
            )}
            {form.message.type === "success" && (
              <div className="w-full py-4 mb-3 text-center text-white rounded-lg bg-base">{form.message.text}</div>
            )}
            <h1 className="w-full py-2 mb-3 text-center ">
              To schedule a lesson: click on an open time slot, and click confirm.
            </h1>
            <div className="pb-8">
              <div id="calendarElement"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Schedule
