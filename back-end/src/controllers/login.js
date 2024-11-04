// HOITAA KAIKKI localhost:3003/api/login TULEVAT PYYNNÖT. KÄYTETÄÄN KUN OLEMASSAOLEVA KÄYTTÄJÄ HOITAA KIRJAUTUMISTAAN SIVULLEj
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const loginRouter = require("express").Router()
const User = require("../models/user")

loginRouter.post("/", async (req, res) => {
	const { email, password } = req.body

	const user = await User.findOne({ email })

	const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)

	if (!(user && passwordCorrect)) {
		return res.status(401).json({
			error: "Käyttäjänimi tai salasana väärä 🛑!"
		})
	}

	const userForToken = {
		username: user.email,
		id: user._id
	}

	const token = jwt.sign(userForToken, process.env.SECRET)

	res.status(200).send({
		token,
		userName: user.userName,
		firstName: user.firstName
	})
})

module.exports = loginRouter
