import { fetchItemPrices, computeAveragePrice } from "./helper"
import express, { Request, Response } from "express"
import * as dotenv from "dotenv"
import cors from "cors"

dotenv.config()
const app = express()
const port = process.env.PORT

app.use(cors())

app.get("/amazon-average", async (req: Request, res: Response) => {
    const pages: number = Number(req.query.pages) || 1
    let allPrices: number[] = []

    if (!req.query.item) {
        return
    }

    // will go through all pages defined by user.
    for (let i = 1; i <= pages; i++) {
        const pagePrices = await fetchItemPrices(req.query.item.toString(), i)
        allPrices = allPrices.concat(pagePrices)
    }

    const averagePrice = computeAveragePrice(allPrices)
    res.send({ data: averagePrice.toFixed(2) })
})

app.listen(port, () => {
    console.log(`Amazon average price server listening on port ${port}`)
})
