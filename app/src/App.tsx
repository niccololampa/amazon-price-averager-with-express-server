import React, { useState } from "react"
import axios from "axios"
import "./App.css"

type GetAverageResponse = {
  data: number
}

function App() {
  const [item, setItem] = useState("")
  const [pages, setPages] = useState("1")
  const [requesting, setRequesting] = useState(false)
  const [average, setAverage] = useState(0)

  const handleItemInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setItem(e.currentTarget.value)
  }

  const handlePagesInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const pages = e.currentTarget.value
    setPages(pages)
  }

  const handleSubmit = (): void => {
    if (!pages) {
      return
    }
    getAverage()
  }

  const getAverage = async () => {
    try {
      setRequesting(true)
      const { data } = await axios.get<GetAverageResponse>(
        `http://localhost:8000/amazon-average?item=${item}&pages=${pages}`,
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
      <h1>Amazon Price Averager</h1>
      <label>
        Item Name:
        <input type="text" name="item" onChange={handleItemInput} />
      </label>
      <label>
        Pages:
        <input type="text" name="item" onChange={handlePagesInput} value={pages} />
      </label>
      <button type="button" onClick={handleSubmit} disabled={requesting || !item || !Number(pages)}>
        Get Average
      </button>

      {average ? (
        <div>
          <div>Average price of {item}:</div>
          <div className="average-price">${average}</div>
        </div>
      ) : (
        ""
      )}
    </div>
  )
}

export default App
