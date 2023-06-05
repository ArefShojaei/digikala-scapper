const { Router } = require("express");
const router = Router()
const path = require("path");
const extractJSON = require('../utils/extractJSON-util');
const productController = require('@controllers/product-controller');

const initializeRoutes = async() => {
    const jsonFileDetails = await extractJSON(path.join(__dirname, "../../categories.config.json"))
    const { categoryName, names } = jsonFileDetails;

    // console.log(categoryName, names);

    for(const name of names) {
        router.get(`/${categoryName}/${name}`, productController)
    }
}

initializeRoutes()

module.exports = router