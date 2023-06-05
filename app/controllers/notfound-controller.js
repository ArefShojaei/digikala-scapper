module.exports = (req, res) => {
    return res.status(404).json({
        status : "Error",
        code : 404,
        message : "Route not found!"
    })
}