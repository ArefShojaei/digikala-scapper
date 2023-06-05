const fsPromise = require('fs/promises');

module.exports = async (JSON_URL) => {
    const data = await fsPromise.readFile(JSON_URL, "utf-8");
    const categories = JSON.parse(data);

    const extractData = Object.entries(categories);
    const [optimizedData] = extractData.map((item) => {
        const [categoryName, details] = item;

        const names = Object.keys(details);
        const links = Object.values(details);

        return { categoryName, names, links };
    });

    return optimizedData
}