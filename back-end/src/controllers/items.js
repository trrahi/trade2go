// HOITAA KAIKKI localhost:3003/api/items REITTIIN TULEVAT PYYNNÖT.
const itemsRouter = require("express").Router()
const jwt = require("jsonwebtoken")
const Item = require("../models/item")
const User = require("../models/user")
const getTokenFrom = require("../utils/getToken")

itemsRouter.get("/", async (req, res) => {
	const items = await Blog.find({}).populate("user", { userName: 1, firstName: 1 })
	// console.log("after GET: items: ", items);
	res.json(items)
})

itemsRouter.post("/", async (req, res) => {
	// decodedToken sisältää: kentät username ja id. Token on luotu käyttämällä näitä kenttiä ja .envin SECRET muuttujaa. Token on joka kerta eri, koska siihen lisätään myös luontiajan sisältä iat-kenttä. Se pystytään dekoomaan jwt-kirjastolla.

	const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
	// console.log("dekodaattu token: ", decodedToken)

	if (!decodedToken.id) {
		return res.status(401).json({ error: "Tokeni epävalidi" })
	}

	const user = await User.findById(decodedToken.id)
	// Dekonnstrukroidaan POST- pyynnöstä uuden lisättävän blogin tiedot ja lisätään ne Blog-modelilla kontstruktoituun item-olioon. Blogin lisääjäksi user-kentään lisätään tietokannasta haettu käyttäjä.
	const { itemName, itemDesc } = req.body
	const item = new Item({
		itemName,
		itemDesct,
		user: user._id
	})

	const savedItem = await item.save()
	// Userin (joka on haettu dekoodatulla tokenilla tietokannasta), items-kenttään konkatenoidaan uuden lisätyn blogin id.
	user.items = user.items.concat(savedItem._id)
	await user.save()
	// Palautetaan clientille tallennettu blogi.
	res.status(201).json(savedItem)
})

// DELETE  a item
itemsRouter.delete("/:id", async (req, res) => {
	const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
	const item = await Blog.findById(req.params.id)

	if (!item) {
		return res.status(404).json({ error: "Blogia ei löytynyt!" })
	}

	if (decodedToken.id == item.user._id) {
		const deleteItem = await Item.findByIdAndDelete(item.id)
		res.sendStatus(204)
	} else {
		res.status(403).json({ error: "Ainoastaan blogin järjestelmään lisännyt voi poistaa blogin!" })
	}

	// console.log("dec", decodedToken);
	// console.log("item", item.user._id);

	// THIS IS TRUE
	// console.log(decodedToken.id == item.user._id);
})

// PUT, päivitä blogin tiedot
itemsRouter.put("/:id", async (req, res) => {
	const id = req.params.id
	const updatedItem = req.body
	const result = await Blog.findByIdAndUpdate(id, updatedItem, { new: true })
	if (!result) {
		return res.status(404).send("Blogia ei löytynyt tuolla tunnisteella 🗿")
	}
	res.status(200).json(result)
})

module.exports = itemsRouter
