// HOITAA KAIKKI localhsot:3003/api/users TULEVAT PYYNNÖT. KÄYTETÄÄN KAYTTÄJIEN HALLINTAAN ESIM: UUDEN KÄYTTÄJNÄN LUOMISEEN TAI KAIKKIEN KÄYTTÄJIEN TIETOJEN HAKEMISEEN.
const bcrypt = require("bcrypt")
const path = require("path")
const usersRouter = require("express").Router()
const User = require("../models/user")

usersRouter.get("/", async (req, res) => {
	const users = await User.find({})
	res.json(users)
})

usersRouter.delete("/", async (req, res) => {
	await User.deleteMany({})
	res.send("Wiped the DB lmao 💀")
})


// TIEDOKSI FRONT-ENDIIN: LÄHETÄKÄÄ POST PYYNTÖ /api/users
usersRouter.post("/", async (req, res) => {
	const { userName, firstName, lastName, email, phoneNumber, password } = req.body
	// console.log("POST req recieved to /api/users");
	// console.log(`This is the email in the req: ${email}`);

	const doesUserExist = await User.findOne({email: email})

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

	res.status(201).json(savedUser)
})

module.exports = usersRouter
