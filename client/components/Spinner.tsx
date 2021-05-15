import React from "react"

interface SpinnerProps {
  center: Boolean
  large?: Boolean
}

const Spinner: React.FC<SpinnerProps> = ({ center, large }) => {
  return (
    <div
      className={`${center ? "text-center" : ""}`}
      style={{ padding: "3rem 0" }}
    >
      <div
        className="spinner-border"
        role="status"
        style={large && { width: "3rem", height: "3rem" }}
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}

export default Spinner
