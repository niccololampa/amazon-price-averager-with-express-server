import React, { useState } from "react"
import axios from "axios"
import "./App.css"

type GetAverageResponse = {
  data: number
}

function App() {
  const [item, setItem] = useState("")
  const [requesting, setRequesting] = useState(false)
  const [average, setAverage] = useState(0)

  const handleItemInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setItem(e.currentTarget.value)
  }

  const handleSubmit = (): void => {
    getAverage()
  }

  const getAverage = async () => {
    try {
      setRequesting(true)
      const { data, status } = await axios.get<GetAverageResponse>(
        `http://localhost:8000/amazon-average?item=${item}`,
      )

      setAverage(data.data)
      setRequesting(false)
    } catch (error) {
      setRequesting(false)
      if (axios.isAxiosError(error)) {
        console.log("error message: ", error.message)
      } else {
        console.log("unexpected error: ", error)
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Amazon Price Averager</h1>
        <label>
          Item Name:
          <input type="text" name="item" onChange={handleItemInput} />
        </label>
        <button type="button" onClick={handleSubmit} disabled={requesting}>
          Get Average
        </button>
        <div className="average-price">{average ? average : ""}</div>
      </header>
    </div>
  )
}

export default App
