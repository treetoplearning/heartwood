import React, { useContext } from "react"
import {
  HeartwoodStateContext,
  HeartwoodDispatchContext,
} from "../state/HeartwoodContextProvider"
import { auth } from "../firebase/firebase"
const ProfilePage = () => {
  const state = useContext(HeartwoodStateContext)
  const dispatch = useContext(HeartwoodDispatchContext)

  const { photoURL, displayName, email } = state.user
  return (
    <div className="w-11/12 px-4 py-8 mx-auto md:w-2/4 md:px-8">
      <div className="flex flex-col items-center px-3 py-4 border border-blue-400 md:flex-row md:items-start">
        <div
          style={{
            background: `url(${
              photoURL ||
              "https://res.cloudinary.com/dqcsk8rsc/image/upload/v1577268053/avatar-1-bitmoji_upgwhc.png"
            })  no-repeat center center`,
            backgroundSize: "cover",
            height: "200px",
            width: "200px",
          }}
          className="border border-blue-300"
        ></div>
        <div className="md:pl-4">
          <h2 className="text-2xl font-semibold">{displayName}</h2>
          <h3 className="italic">{email}</h3>
        </div>
      </div>
      <button
        className="w-full py-3 mt-4 text-white bg-red-600"
        onClick={() => {
          auth.signOut()
        }}
      >
        Sign out
      </button>
    </div>
  )
}
export default ProfilePage
