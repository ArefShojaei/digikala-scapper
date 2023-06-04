const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs/promises');
const path = require('path');

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

    // communicate with DOM
    await page.evaluate(() => {
        return new Promise((resolve, reject) => {
            const scrollInterval = setInterval(() => {
                let scroll_height = document.body.scrollHeight
                let scroll_y = window.scrollY

                scroll_y += 800;
                window.scroll(0, scroll_y);
    
                if (scroll_y > scroll_height) {
                    clearInterval(scrollInterval);
                    resolve()
                }
            }, 4000);
        })
    })

    // get HTML
    const html = await page.content()

    // parse the template as HTML
    const $ = cheerio.load(html)

    // declare products Array for adding new product to this Array
    const products = []

    // select product element of the HTML
    $("div > div[data-product-index]").each((index, element) => {
        // find and select anchor element
        const product = $(element).find("a");

        // get values of the product like :
        /*
            * ID
            * link
            * image
            * name
            * price
            * rate
            * freeSend
            * status
        */
        const [title, lastnumber] = product.find("div[data-ab-id]").parent().text().trim().split(".")
        const firstNumber = title.slice(-1)
        const numberIndex = title.indexOf(firstNumber)

        const productRate = `${firstNumber}${lastnumber === undefined ? '' : '.' + lastnumber}`
        let [productSend, productPrice] = product.find("div span").text().trim().split("ارسال رایگان")
        productSend = "ارسال رایگان"
        
        // save the product in products Array for a new data
        products.push({
            id: product.parent().attr("data-product-index"),
            link: "https://www.digikala.com" + product.attr("href"),
            image: product.find("picture img").attr("src"),
            name: product.find("h3").text().trim(),
            price: productPrice,
            rate : productRate,
            freeSend: productSend ? true : false,
            status : title.slice(0, numberIndex).length >= 7 ? title.slice(0, numberIndex) : '' ,
        });
    });


    // create JSON file for importing the data
    await fs.writeFile(path.join(__dirname, "./data/products.json"), JSON.stringify(products), "utf-8") 

    // close the browser and exiting from run function
    await browser.close()
}

run()