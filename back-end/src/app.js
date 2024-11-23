// Alusta Express() ja node paketit
const express = require("express")
const app = express()
const cors = require('cors')
app.use(cors())
const mongoose = require("mongoose")
const path = require("path")
const authMiddleware = require("./middleware/authMiddleware.js")
require("dotenv").config()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Ympäristömuuttujat .env:istä
const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT

mongoose.set("strictQuery", false)
// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB 🫶")
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error.message)
    })


// Determines a directory where static files can be served from
app.use(express.static(path.join(__dirname, "../../front-end/public/")))

// Define routes for GET requests
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../front-end/public/index.html"))
})

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../../front-end/public/login.html"))
})

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../../front-end/public/register.html"))
})

app.get("/dashboard", authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, "../../front-end/public/itembox.html"))
})

// Sisäiset moduulit
const usersRouter = require("./controllers/user")
const loginRouter = require("./controllers/login")
const itemsRouter = require("./controllers/items")
//
// Middleware käyttöön
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)
app.use("/api/items", itemsRouter)

// Aloitus
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
