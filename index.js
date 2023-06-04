const puppeteer = require('puppeteer');

const run = async () => {
    const browser = await puppeteer.launch({
        executablePath:
            "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        headless: false,
        defaultViewport: { width: 1366, height: 768 },
    });

    const page = await browser.newPage()
    
    await page.goto("https://google.com")

    await browser.close()
}

run()