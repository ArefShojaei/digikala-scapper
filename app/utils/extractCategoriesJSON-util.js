const fsPromise = require('fs/promises');

module.exports = async (JSON_URL) => {
    // get JSON file content
    const data = await fsPromise.readFile(JSON_URL, "utf-8");
    
    // parse the JSON file content
    const categories = JSON.parse(data);

    // extract and customize the JSON file
    const extractedJSONData = Object.keys(categories).map(categoryName => {
        // get currentCategoryName
        const currentCategory = categories[categoryName]
        
        // get list of category links
        const links = Object.values(currentCategory)
        
        // get list of category names like /api/category/mobile/{name} (apple | ...)
        const names = Object.keys(currentCategory)


        return { categoryName, names, links }
    })


    return extractedJSONData
}