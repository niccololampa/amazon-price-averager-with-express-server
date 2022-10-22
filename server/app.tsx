const express = require('express')
const cors = require('cors')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()
const port = 8000

app.use(cors())

const fetchItemPrices = async (item, page) => {
    try {
        const response = await axios.get(
            `https://amazon.com/s?k=${item}&ref=nb_sb_noss&page=${page}`
        )

        // const response = await axios.get(`https://www.amazon.com/s?crid=36QNR0DBY6M7J&k=${item}&ref=glow_cls&refresh=1&sprefix=s%2Caps%2C309`);

        const html = response.data

        const $ = cheerio.load(html)

        const prices = []

        $(
            'div.sg-col-4-of-12.s-result-item.s-asin.sg-col-4-of-16.sg-col.sg-col-4-of-20'
        ).each((_idx, el) => {
            const element = $(el)
            const price = element.find('span.a-price > span.a-offscreen').text()

            if (price) {
                // prices.push(price.match(/\$[\d.]+/))
                prices.push(parseFloat(price.match(/(?<=\$)[\d.]+/)[0]))
            }

            // const priceWhole = price.find('span.a-price-whole').text()
            // const priceFraction = price.find('span.a-price-fraction').text()

            //prices.push(`${priceWhole}${priceFraction}`)
        })

        console.log(prices)

        return prices
    } catch (error) {
        throw error
    }
}

const asc = (arr) => arr.sort((a, b) => a - b)

const quartile = (arr, q) => {
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

const computeAveragePrice = (prices) => {
    // let sortPrice = (arr) => prices.sort((a,b)=> a-b);
    const Q1 = quartile(prices, 0.25)
    const Q3 = quartile(prices, 0.75)
    const IQR = Q3 - Q1

    let notOutlierPrices = []

    prices.forEach((number) => {
        if (number > Q3 + 1.5 * IQR || number < Q1 - 1.5 * IQR) {
            console.log(`${number} is outlier`)
        } else {
            notOutlierPrices.push(number)
        }
    })

    console.log(notOutlierPrices)

    console.log('working till here')

    return notOutlierPrices.reduce((a, b) => a + b, 0) / notOutlierPrices.length

    // console.log(prices)
}

app.get('/amazon-average', async (req, res) => {
    let pages = 5
    console.log(req.query.item)
    let allPrices = []

    for (let i = 1; i <= pages; i++) {
        console.log(i)
        const pagePrices = await fetchItemPrices(req.query.item, i)
        allPrices = allPrices.concat(pagePrices)
    }

    console.log(allPrices)

    const averagePrice = computeAveragePrice(allPrices)
    res.send({ data: averagePrice.toFixed(2) })
})

app.listen(port, () => {
    console.log(`Amazon average server listening on port ${port}`)
})
