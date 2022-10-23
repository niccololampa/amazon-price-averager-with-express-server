import { fetchItemPrices, computeAveragePrice } from './helper'

const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config()
const app = express()
const port = process.env.PORT

app.use(cors())

app.get('/amazon-average', async (req: any, res: any) => {
    let pages: number = Number(req.query.pages) || 1
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
