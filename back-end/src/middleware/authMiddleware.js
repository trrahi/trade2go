const jwt = require("jsonwebtoken")
const getTokenFrom = require("../utils/getToken.js") // getTokenFrom-funktio utils-kansiosta

const authMiddleware = (req, res, next) => {
    const token = getTokenFrom(req)

    if (!token) {
        return res.status(401).json({ error: "Token puuttuu tai on virheellinen" })
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        req.userId = decodedToken.id // Asetetaan käyttäjän ID request-olioon
        next() // Jatketaan seuraavaan middlewareen tai reittiin
    } catch (error) {
        return res.status(401).json({ error: "Token virheellinen tai vanhentunut" })
    }
}

module.exports = authMiddleware
