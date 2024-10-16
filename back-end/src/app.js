// Alusta Express() ja node paketit
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const fs = require("fs")
const cors = require("cors")
const path = require("path")
require("dotenv").config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files from the 'front-end/public' folder
app.use(express.static(path.join(__dirname, '../../front-end/public/')));

// console.log(path.join(__dirname, '../../front-end/public'));

// Send the HTML file as a response to the root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));  // Fixing the path issue
});



app.listen(3003, () => {
    console.log(`Sovellus käynnissä portissa 3003`);
});