const path = require('path');
const fsPromise = require('fs/promises');

module.exports = async (req, res) => {
    try {
        const [, category, name] = req.url.split("/")

        const response = await fsPromise.readFile(path.join(__dirname, `../data/${category}/${name}.json`), "utf-8")
        
        const products = JSON.parse(response)
    
        return res.json(products)
    } catch (err) {
        return res.status(500).json({
            status : "Error",
            code : 500,
            message : "Request is failed!"
        })
    }
}