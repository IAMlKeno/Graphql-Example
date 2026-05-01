import React from "react";

export default function ReactVersion() {
  return (
    <>
      <div style={{margin: "auto", border: "1px solid darkblue", textAlign: "center"}} >
        <em>React Version: {React.version}</em>
      </div>
    </>
  )
}