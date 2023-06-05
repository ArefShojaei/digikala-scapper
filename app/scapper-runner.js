const path = require("path");
const scapper = require('@app/scapper-handler');
const extractJSON = require('@utils/extractJSON-util');

module.exports = async () => {
    // extract categories JSON data
    const jsonFileDetails = await extractJSON(path.join(__dirname, "../categories.config.json"))
    
    // get categoryName , links and names data from JSON file
    const { categoryName, links, names } = jsonFileDetails;

    // run scapper function and give the data as an object
    scapper({
        categoryName,
        links,
        names,
    });
}