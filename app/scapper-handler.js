const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fsPromise = require('fs/promises');
const fs = require('fs');
const path = require('path');

module.exports = async ({ categoryName, links, names }) => {
    // setup
    const browser = await puppeteer.launch({
         executablePath:
            "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
//         headless: true,
        defaultViewport: { width: 1366, height: 768 },
    });

    // declare an index variable as key for getting names in targetNames Array
    let index = 0

    // handle links as a Link for every tab of the browser step by step
    for(const link of links) {
        // create new Tab
        const page = await browser.newPage()
        
        await page.setDefaultNavigationTimeout(0);

        // navigate to a website
        await page.goto(link)

        // after navigated to the website , wait for "20 seconds"
        await page.waitForTimeout(10000)

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
                }, 3000);
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

        // create Folder and checking for existing
        const isExistFolder = fs.existsSync(path.join(__dirname, `./data/${categoryName}`))
        console.log(isExistFolder);

        if(!isExistFolder) {
            await fsPromise.mkdir(path.join(__dirname, `./data/${categoryName}/`))
        }
        
        // create JSON file for importing and saving the data to this file
        await fsPromise.writeFile(path.join(__dirname, `./data/${categoryName}/${names[index]}.json`), JSON.stringify(products), "utf-8") 

        // increment index variable
        index++

        // close the tab
        await page.close()
    }

    // close the browser and exiting from run function
    await browser.close()
}
