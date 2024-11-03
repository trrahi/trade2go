// HOITAA KAIKKI localhsot:3003/api/users TULEVAT PYYNNÖT. KÄYTETÄÄN KAYTTÄJIEN HALLINTAAN ESIM: UUDEN KÄYTTÄJNÄN LUOMISEEN TAI KAIKKIEN KÄYTTÄJIEN TIETOJEN HAKEMISEEN.
const bcrypt = require("bcrypt")
const path = require("path")
const usersRouter = require("express").Router()
const User = require("../models/user")
const Item = require("../models/item")

usersRouter.get("/", async (req, res) => {
	const users = await User.find({})
	res.json(users)
})

// usersRouter.delete("/", async (req, res) => {
// 	await User.deleteMany({})
// 	res.send("cool!")
// })


// TIEDOKSI FRONT-ENDIIN: LÄHETÄKÄÄ POST PYYNTÖ /api/users
usersRouter.post("/", async (req, res) => {
	console.log("request got");
	const { userName, firstName, lastName, email, phoneNumber, password } = req.body

	const doesUserExist = await User.findOne({emailAddress: email})

	if (doesUserExist) {
		return res.status(401).json({error: "Email already in use! 💀"})
	}

	const saltRounds = 10
	const passwordHash = await bcrypt.hash(password, saltRounds)

	const newUser = new User({
		userName,
		firstName,
		lastName,
		email,
		phoneNumber,
		passwordHash
	})

	const savedUser = await newUser.save()

	res.status(201).sendFile(path.join(__dirname, "../../../front-end/public/login.html"))
})

module.exports = usersRouter
