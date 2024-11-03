// HOITAA KAIKKI localhsot:3003/api/users TULEVAT PYYNNÖT. KÄYTETÄÄN KAYTTÄJIEN HALLINTAAN ESIM: UUDEN KÄYTTÄJNÄN LUOMISEEN TAI KAIKKIEN KÄYTTÄJIEN TIETOJEN HAKEMISEEN.
const bcrypt = require("bcrypt")
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
	const { userName, firstName, lastName, emailAddress, phoneNumber, password } = req.body

	const doesUserExist = await User.findOne({emailAddress: emailAddress})

	if (doesUserExist) {
		return res.status(401).json({error: "Email already in use! 💀"})
	}

	const saltRounds = 10
	const passwordHash = await bcrypt.hash(password, saltRounds)

	const newUser = new User({
		userName,
		firstName,
		lastName,
		emailAddress,
		phoneNumber,
		passwordHash
	})

	const savedUser = await newUser.save()

	res.status(201).json(savedUser)
})

module.exports = usersRouter
