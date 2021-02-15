const fs = require('fs')
const puppeteer = require('puppeteer')
let link = 'https://zorbasmedia.ru/'

const parseZorba = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 100,
      devtools: true,
    })
    const page = await browser.newPage()
    await page.setViewport({ width: 500, height: 1200 })
    await page.goto(link, { waitUntil: 'domcontentloaded' })

    await page.waitForSelector('div.col-12.col-lg-9.news-main-sub')

    const html = await page.evaluate(async () => {
      let res = []
      const container = await document.querySelectorAll(
        'div.front-page-news-block > a'
      )
      let topNews = document.querySelector(
        '#front-page-sub-wrap > div:nth-child(1) > div.col-12'
      )
      let title = topNews.querySelector(
        'h3.col-12.item-title.d-none.d-lg-block'
      ).innerText
      let preview = topNews.querySelector('span.badonkatrunc-wrapper').innerText
      let time = topNews.querySelector('span.item-date').innerText
      let link = topNews.querySelector('a').href
      let img
      try {
        img = topNews
          .querySelector('span.item-thumbnail > img')
          .getAttribute('src')
      } catch (e) {
        img = null
      }
      res.push({
        title,
        preview,
        link,
        time,
        img,
      })

      container.forEach((elem) => {
        let title = elem.querySelector('h3.col-12.item-title').innerText
        let preview = elem.querySelector('div.item-excerpt').innerText
        let time = elem.querySelector('span.item-date').innerText
        let link = elem.href
        let img
        try {
          img = elem
            .querySelector('div.item-thumbnail-inner.lazy-load-imgs > img')
            .getAttribute('src')
        } catch (e) {
          img = null
        }

        res.push({
          title,
          preview,
          link,
          time,
          img,
        })
      })
      console.log(res)

      return res
    })
    fs.writeFile('zorbasmedia.json', JSON.stringify(html), (e) => {
      if (e) throw e
      console.log('Новости загружены!')
    })
    await browser.close()
  } catch (e) {
    console.log(e)
  }
}

parseZorba()
