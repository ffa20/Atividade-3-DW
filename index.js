const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const {response} = require("express");

const app = express()

const newspapers = [
    {
        name: 'record',
        address: 'https://www.record.pt/modalidades/basquetebol',
        base: 'https://www.record.pt'
    },
    {
        name: 'ojogo',
        address: 'https://www.ojogo.pt/modalidades/basquetebol.html',
        base: 'https://www.ojogo.pt'
    },
    {
        name: 'zerozero',
        address: 'https://www.zerozero.pt/home.php?gmod=10',
        base: 'https://www.zerozero.pt/'
    },
    {
        name: 'tsf',
        address: 'https://www.tsf.pt/tag/basquetebol.html',
        base:'https://www.tsf.pt'
    },
    {
        name: 'tribunaexpresso',
        address: 'https://tribunaexpresso.pt/nba',
        base: 'https://tribunaexpresso.pt'
    }
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Neemias Queta")',html).each(function(){
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
        })
})

app.get('/', (req, res) => {
    res.json('Benvindo à minha API de notícias sobre Neemias Queta')
})

app.get('/noticias', (req,res) => {
            res.json(articles)
 })

app.get('/noticias/:newspaperId', async (req, res) => {
    const newspaperId = req.params.newspaperId
    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const sArticles = []

            $('a:contains("Neemias Queta")',html).each(function(){
                const title = $(this).text()
                const url = $(this).attr('href')

                sArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(sArticles)
        }).catch(err => console.log(err))

})

app.listen(PORT, () => console.log(`Servidor a corre no porto ${PORT}`))