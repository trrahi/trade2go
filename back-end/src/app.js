// Alusta Express() ja node paketit
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const path = require("path")
require("dotenv").config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Ympäristömuuttujat .env:istä
const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI


// Determines a directory where static files can be served from
app.use(express.static(path.join(__dirname, "../../front-end/public/")))

// ROUTES FOR get REQUESTS
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../../front-end/public/index.html"))
})

app.get("/login", (req, res) => {
	res.sendFile(path.join(__dirname, "../../front-end/public/login.html"))
})
app.get("/register", (req, res) => {
	res.sendFile(path.join(__dirname, "../../front-end/public/register.html"))
})



// Sisäiset moduulit
const usersRouter = require("./controllers/user")


// Middleware käyttöön
app.use("/api/users", usersRouter)






// Yhdistä Mongooseen
mongoose.set("strictQuery", false)

mongoose.connect(MONGODB_URI).then(() => {
	console.log("connected to MongoDB 🫶")
})

app.listen(PORT, () => {
    console.log(`Sovellus käynnissä portissa ${PORT}`);
});
