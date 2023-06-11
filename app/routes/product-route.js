const { Router } = require("express");
const router = Router()
const path = require("path");
const extractJSON = require('@utils/extractCategoriesJSON-util');
const productController = require('@controllers/product-controller');

const initializeRoutes = async() => {
    // get JSON config details
    const extractedCategoriesJSON = await extractJSON(path.join(__dirname, "../../categories.config.json"))

    for(const currentCategory of extractedCategoriesJSON) {
        const { categoryName, names } = currentCategory

        names.forEach(name => {
            // initialize route by the config like categoryName and name 

            /**
             ** For Example : /api/category/{dynamic_categoryName}/{dynamic_name} 
            */

            router.get(`/${categoryName}/${name}`, productController)
        })
    }
}

// run for initializing all routes of the config
initializeRoutes()

module.exports = router