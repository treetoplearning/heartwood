import React from "react"

export const HeartwoodStateContext = React.createContext()
export const HeartwoodDispatchContext = React.createContext()

const initialState = {
  ideBody: "# code here\nprint(\"Hello Jacob\")",
  termBuff: ""
}

function reducer(state, action) {
  switch (action.type) {
    case "COMPILE":
      action.cb(state.ideBody);
      return {
        ...state
      }
    case "WRITE_IDE": {
      return {
        ...state,
        ideBody: action.body
      }
    }
    default:
      throw new Error("Bad Action Type")
  }
}

const HeartwoodContextProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  return (
    <HeartwoodStateContext.Provider value={state}>
      <HeartwoodDispatchContext.Provider value={dispatch}>
        {children}
      </HeartwoodDispatchContext.Provider>
    </HeartwoodStateContext.Provider>
  )
}

export default HeartwoodContextProvider