const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const run = async () => {
    const browser = await puppeteer.launch({
        executablePath:
            "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        headless: false,
        defaultViewport: { width: 1366, height: 768 },
    });

    const page = await browser.newPage()
    
    await page.goto("https://www.digikala.com/search/category-mobile-phone/apple/")

    await page.waitForTimeout(10000) // wait for "10 seconds"

    // communicating with DOM
    await page.evaluate(() => {
        return new Promise((resolve, reject) => {
            const scrollInterval = setInterval(() => {
                const scroll_height = document.body.scrollHeight
                const scroll_y = window.scrollY

                scroll_y += 800;
                window.scroll(0, scroll_y);
    
                if (scroll_y > scroll_height) {
                    clearInterval(scrollInterval);
                    resolve()
                }
            }, 4000);
        })
    })

    const html = await page.content()

    await browser.close()
}

run()