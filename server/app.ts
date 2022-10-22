const express = require('express')
const cors = require('cors')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()
const port = 8000

app.use(cors())

const fetchItemPrices = async (item: string, page: number) => {
    try {
        const response = await axios.get(
            `https://amazon.com/s?k=${item}&ref=nb_sb_noss&page=${page}`
        )

        const html = response.data
        const $ = cheerio.load(html)
        const prices: number[] = []

        $(
            'div.sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.sg-col.sg-col-4-of-20'
        ).each((_idx: number, el: any) => {
            const element = $(el)
            const price = element.find('span.a-price > span.a-offscreen').text()
            // regex to get the price.
            if (price) {
                prices.push(parseFloat(price.match(/(?<=\$)[\d.]+/)[0]))
            }
        })

        return prices
    } catch (error) {
        throw error
    }
}

const asc = (arr: number[]) => arr.sort((a: number, b: number) => a - b)

// function to compute quartile to aid in removing outlier prices (too high/low)
const quartile = (arr: number[], q: number) => {
    const sorted = asc(arr)
    const pos = (sorted.length - 1) * q
    const base = Math.floor(pos)
    const rest = pos - base
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base])
    } else {
        return sorted[base]
    }
}

// code to compute average without outliers values.
const computeAveragePrice = (prices: number[]) => {
    const Q1 = quartile(prices, 0.25)
    const Q3 = quartile(prices, 0.75)
    const IQR = Q3 - Q1

    let notOutlierPrices: number[] = []

    prices.forEach((itemPrice) => {
        // will not add prices which are outliers
        if (itemPrice > Q3 + 1.5 * IQR || itemPrice < Q1 - 1.5 * IQR) {
            return
        } else {
            notOutlierPrices.push(itemPrice)
        }
    })

    return notOutlierPrices.reduce((a, b) => a + b, 0) / notOutlierPrices.length
}

app.get('/amazon-average', async (req: any, res: any) => {
    let pages = 2
    let allPrices: number[] = []

    if (!req.query.item) {
        return
    }

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
