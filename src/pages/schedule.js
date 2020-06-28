import React, { useState, useContext, useEffect } from "react"
import { Calendar } from "@fullcalendar/core"
import dayGridPlugin from "@fullcalendar/daygrid"
import googleCalendarPlugin from "@fullcalendar/google-calendar"
import interactionPlugin from "@fullcalendar/interaction"

import Navbar from "../components/navbar"

import { HeartwoodStateContext, HeartwoodDispatchContext } from "../state/HeartwoodContextProvider"
import { firestore } from "../firebase/firebase"

const Schedule = () => {
  const dispatch = useContext(HeartwoodDispatchContext)
  const state = useContext(HeartwoodStateContext)

  const [form, setForm] = useState({ date: "", time: "13:30", message: { text: "", type: "" } })

  const scheduleMeeting = (event) => {
    event.preventDefault()
    if (validateInputs()) {
      fetch("http://localhost:5000/schedulemeeting", {method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({email: state.user.email,
          date: form.date,
          time: form.time,
          uid: state.user.uid,
          firstName: state.user.firstName,
          lastName: state.user.lastName})})
        .then((res) => {
          setForm({ ...form, message: { text: "Scheduling request was recieved", type: "success" } })
        })
        .catch((err) => {
          setForm({ ...form, message: { text: err, type: "error" } })
          console.log(err)
        })

      console.log("schedule the meeting")
    } else {
      console.log("inputs are not valid")
    }
  }

  const validateInputs = () => {
    if (form.email === "" || form.time === "") {
      return false
    }
    return true
  }

  useEffect(() => {
    fetch("http://localhost:5000/schedulesetup", { method: "GET" })
      .then((res) => res.json())
      .then((res) => {
        let calendarElement = document.getElementById("calendarElement")

        let calendar = new Calendar(calendarElement, {plugins: [dayGridPlugin, googleCalendarPlugin, interactionPlugin],
          initialView: "dayGridMonth",
          dateClick: function (info) {
            setForm({ ...form, date: info.dateStr })
          },
          weekends: false,
          selectable: true,
          googleCalendarApiKey: res.api_key,
          events: { googleCalendarId: res.calendar_id }})

        calendar.render()
      })
  }, [])

  return (
    <div className="w-screen min-h-screen bg-base">
      <Navbar />
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
            To schedule a lesson: select a date and time, then click submit.
          </h1>
          <form
            className="flex flex-col items-center justify-between pt-8 mb-10 lg:flex-row"
            onSubmit={(event) => scheduleMeeting(event)}
          >
            <div className="pb-5 text-center">
              <label htmlFor="lessonDate" className="mr-2 font-semibold text-center">
                Lesson Date:
              </label>
              <input
                required
                type="date"
                className="w-auto px-4 py-2 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                name="lessonDate"
                value={form.date}
                onChange={(event) => setForm({ ...form, date: event.target.value })}
                id="lessonData"
              />
            </div>
            <div className="pb-5 text-center">
              <label htmlFor="lessonTime" className="mr-2 font-semibold text-center ">
                Lesson Time:
              </label>
              <input
                required
                readOnly
                type="time"
                className="w-auto px-4 py-2 leading-tight text-center border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                name="lessonTime"
                value={form.time}
                id="lessonTime"
              />
            </div>

            <div className="pb-5 text-center">
              <input
                required
                type="submit"
                className="w-auto px-4 py-2 leading-tight text-white transition duration-100 ease-in-out bg-gray-600 border-gray-600 rounded shadow appearance-none hover:opacity-75 focus:outline-none focus:shadow-outline"
                value="Submit"
              />
            </div>
          </form>
          <div className="pb-8">
            <div id="calendarElement"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Schedule
