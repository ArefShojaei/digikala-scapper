const path = require("path");
const scapper = require('@app/scapper-handler');
const extractJSON = require('@utils/extractCategoriesJSON-util');

module.exports = async () => {
    // get JSON config file content
    const extractedCategoriesJSON = await extractJSON(path.join(__dirname, "../categories.config.json"))

    // loop to the JSON file
    for (const currentCategory of extractedCategoriesJSON ) {
        // extract currentCategory data like this
        const { categoryName, names, links } = currentCategory

        // set the data for scapper handler function as an object
        await scapper({
            categoryName,
            links,
            names
        })
    } 
}