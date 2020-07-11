import React, {useEffect, useRef } from 'react'

function useInterval(callback, delay) {
  const savedCallback = useRef()
  let firstTime = true

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (!firstTime)
        savedCallback.current()
        firstTime = false
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

export default useInterval