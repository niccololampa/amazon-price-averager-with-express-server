import React from "react"
import "./App.css"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Amazon Price Averager</h1>
        <label>
          Item Name:
          <input type="text" name="item" />
        </label>
        <button type="button">Get Average</button>
      </header>
    </div>
  )
}

export default App
