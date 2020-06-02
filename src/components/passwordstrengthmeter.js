import React, { useEffect, useRef } from "react"
import zxcvbn from "zxcvbn"
import "../styles/passwordstrengthmeter.css"

function PasswordStrengthMeter({ password, onStrengthUpdate }) {

  const score = useRef(0)

  // check if password meets strength requirement and then tell parent
  const onStrengthUpdateHandler = (input) => {
    
    // stop the firing where a different input error causes the score to be reset to 0 on render
      return onStrengthUpdate(createPasswordLabel(input))
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
    onStrengthUpdateHandler(score.current)
    if (password === "") {
      score.current = 0
    } else {
      score.current = zxcvbn(password).score 
    }
 
  }, [password])

  return (

    <div className="flex flex-col w-full mb-3">
      <progress
        className={`w-full rounded-lg focus:rounded-lg password-strength-meter-progress strength-${createPasswordLabel(score.current)}`}
        value={score.current}
        default={0}
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
