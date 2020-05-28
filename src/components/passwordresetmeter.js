import React, {useEffect} from 'react'
// import './PasswordStrengthMeter.css'

function PasswordStrengthMeter({password}) {

    useEffect(() => {
        require('zxcvbn')

    }, [])

    const testedResult = zxcvbn(password)
    
    return (
        <div className="mb-3">
        
        <label
        
        >
        {password}
        </label>
      </div>
    )
}

export default PasswordStrengthMeter
