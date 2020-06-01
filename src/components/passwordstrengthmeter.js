import React, { useEffect, useRef } from "react"
import zxcvbn from "zxcvbn"
import "../styles/passwordstrengthmeter.css"

function PasswordStrengthMeter({ password, onStrengthUpdate }) {

  const score = useRef(0)

  // check if password meets strength requirement and then tell parent
  const onStrengthUpdateHandler = (input) => {
    
    // stop the firing where a different input error causes the score to be reset to 0 on render
    if (input !== 0) {
      return onStrengthUpdate(createPasswordLabel(input))
    }
  }

  // convert the password strength to an informative label
  const createPasswordLabel = (input) => {
    switch (input) {
      case 0:
        return "Weak"
      case 1:
        return "Weak"
      case 2:
        return "Fair"
      case 3:
        return "Good"
      case 4:
        return "Strong"
      default:
        return "Weak"
    }
  }

  useEffect(() => {
    score.current = zxcvbn(password).score
    onStrengthUpdateHandler(score.current)
  }, [password])

  return (

    <div className="flex flex-col w-full mb-3">
      <progress
        className={`w-full rounded-lg password-strength-meter-progress strength-${createPasswordLabel(score.current)}`}
        value={score.current}
        max="4"
      />
      {password && (
        <div className="mt-1">
          <label>
            <strong>Password strength: </strong> {createPasswordLabel(score.current)}
          </label>
        </div>
      )}
    </div>
  )
}

export default PasswordStrengthMeter
