import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

const Message = ({ type, text, onConfirm, onCancel}) => {
  return (
    <>
      {type === "error" && (
        <p className="w-full px-3 py-4 mb-3 text-center text-white break-words bg-red-600 rounded-lg">{text}  </p>
      )}
      {type === "success" && (
        <p className="w-full px-3 py-4 mb-3 text-center text-white break-words rounded-lg bg-base">{text} </p>
      )}
      {type === "confirm" && (
        <div className="flex flex-col justify-center w-full px-3 py-4 mb-3 text-center text-white break-words rounded-lg bg-base">
          <p> {text}? </p> <br />
          <div className="self-center mt-10 sm:self-end ">
                <button
                  onClick={() =>
                    // setForm({ ...form, message: { text: "", type: "" }, isLoading: false, bookingConfirmed: false })
                    onCancel()
                  }
                  className="w-auto px-8 py-1 leading-tight text-black transition duration-100 ease-in-out bg-white rounded-lg shadow appearance-none md:inline-block hover:opacity-75 focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <br className="block sm:hidden"/>
                
                <button
                  onClick={() =>
                    // setForm({ ...form, message: { text: "", type: "" }, isLoading: false, bookingConfirmed: true })
                    onConfirm()

                  }
                  className="w-auto px-8 py-1 mt-4 font-bold leading-tight text-black transition duration-100 ease-in-out bg-white rounded-lg shadow appearance-none sm:ml-4 md:inline-block hover:opacity-75 focus:outline-none focus:shadow-outline"
                >
                  Confirm
                </button>
              </div>
        </div>
      )}
    </>
  )
}

Message.propTypes = {type: PropTypes.string,
  text: PropTypes.string, onConfrim: PropTypes.func}

Message.defaultProps = {type: "",
    text: ""}

export default Message
