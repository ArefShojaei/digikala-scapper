const path = require('path');
const fsPromise = require('fs/promises');

module.exports = async (req, res) => {
    try {
        // split url with '/' for handling params like */api/category/{ categoryName }/{ name }
        const [, category, name] = req.url.split("/")

        // get JSON file content
        const response = await fsPromise.readFile(path.join(__dirname, `../data/${category}/${name}.json`), "utf-8")
        
        // parse the JSON file content
        const products = JSON.parse(response)
    

        return res.status(200).json(products)
    } catch (err) {
        return res.status(500).json({
            status : "Error",
            code : 500,
            message : "Request is failed!"
        })
    }
}