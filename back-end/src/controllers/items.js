// HOITAA KAIKKI localhost:3003/api/items REITTIIN TULEVAT PYYNNÖT.
const itemsRouter = require("express").Router()
const jwt = require("jsonwebtoken")
const Item = require("../models/item")
const User = require("../models/user")
const getTokenFrom = require("../utils/getToken")


console.log("Test, delete this console.log");
// itemsRouter.delete("/all", async (req, res) => {
// 	await Item.deleteMany({})
// 	res.send("Wiped the item DB lmao 💀")
// })

itemsRouter.get("/", async (req, res) => {
	const items = await Item.find({}).populate("user", { userName: 1, phoneNumber: 1 })
	// console.log("after GET: items: ", items);
	res.json(items)
})

itemsRouter.post("/", async (req, res) => {
	console.log("In itemsRouter");
	// decodedToken sisältää: kentät username ja id. Token on luotu käyttämällä näitä kenttiä ja .envin SECRET muuttujaa. Token on joka kerta eri, koska siihen lisätään myös luontiajan sisältä iat-kenttä. Se pystytään dekoomaan jwt-kirjastolla.

	const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
	// console.log("dekodaattu token: ", decodedToken)

	if (!decodedToken.id) {
		return res.status(401).json({ error: "Tokeni epävalidi" })
	}

	const user = await User.findById(decodedToken.id)
	// Dekonnstrukroidaan POST- pyynnöstä uuden lisättävän itemin tiedot ja lisätään ne item-modelilla kontstruktoituun item-olioon. itemin lisääjäksi user-kentään lisätään tietokannasta haettu käyttäjä.
	const { itemName, itemDesc } = req.body
	const item = new Item({
		itemName,
		itemDesc,
		user: user._id
	})

	const savedItem = await item.save()
	// Userin (joka on haettu dekoodatulla tokenilla tietokannasta), items-kenttään konkatenoidaan uuden lisätyn itemin id.
	user.items = user.items.concat(savedItem._id)
	await user.save()
	// Palautetaan clientille tallennettu itemi.
	res.status(201).json(savedItem)
})

// DELETE  a item
itemsRouter.delete("/:id", async (req, res) => {
	const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
	const item = await Item.findById(req.params.id)

	if (!item) {
		return res.status(404).json({ error: "itemia ei löytynyt!" })
	}

	if (decodedToken.id == item.user._id) {
		const deleteItem = await Item.findByIdAndDelete(item.id)
		res.sendStatus(204)
	} else {
		res.status(403).json({ error: "Ainoastaan itemin järjestelmään lisännyt voi poistaa itemin!" })
	}

	// console.log("dec", decodedToken);
	// console.log("item", item.user._id);

	// THIS IS TRUE
	// console.log(decodedToken.id == item.user._id);
})

// PUT, päivitä itemin tiedot
itemsRouter.put("/:id", async (req, res) => {
	const id = req.params.id
	const updatedItem = req.body
	const result = await Item.findByIdAndUpdate(id, updatedItem, { new: true })
	if (!result) {
		return res.status(404).send("itemia ei löytynyt tuolla tunnisteella 🗿")
	}
	res.status(200).json(result)
})

module.exports = itemsRouter
