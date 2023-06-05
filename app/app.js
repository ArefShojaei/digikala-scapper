const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("@routes/product-route");
const notFoundRoute = require('@controllers/notfound-controller');
const scapper = require('@app/scapper-runner');
const { APP_PORT } = process.env

module.exports = () => {
    // run scapper
    const timer = 60000 * 60 * 24 // 24 hours | 1 day
    setTimeout(() => {
        scapper()
    }, timer)

    // handle CORS 
    app.use(cors());

    // initialize routes
    app.use("/api/category", routes);
    app.use(notFoundRoute)

    // launch the app
    app.listen(APP_PORT)
};
