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

  const [form, setForm] = useState({ date: "", time: "13:30" })

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
          <form className="flex flex-col items-center justify-between pt-8 mb-10 sm:flex-row">
            <div className="mb-5 text-center">
              <label htmlFor="lessonDate" className="mr-2 font-semibold text-center">
                Lesson Date:
              </label>
              <input
                required
                type="date"
                className="w-auto px-5 py-2 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                name="lessonDate"
                value={form.date}
                onChange={(event) => setForm({ ...form, date: event.value })}
                id="lessonData"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="lessonTime" className="mr-2 font-semibold text-center ">
                Lesson Time:
              </label>
              <input
                required
                readOnly
                type="time"
                className="w-auto px-5 py-2 leading-tight text-center border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                name="lessonTime"
                value={form.time}
                id="lessonTime"
              />
            </div>

            <div>
              <input
                required
                type="submit"
                className="w-auto px-5 py-2 leading-tight text-white transition duration-200 ease-in-out bg-gray-600 border-gray-600 rounded shadow appearance-none hover:opacity-75 focus:outline-none focus:shadow-outline"
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
