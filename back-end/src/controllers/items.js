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
    try {
		console.log("GEt req to api/items");
        const items = await Item.find({}).populate("user", { userName: 1, email: 1 }); // Populate userName and email
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: "Virhe esineiden hakemisessa" });
    }
});


itemsRouter.post("/", async (req, res) => {
	console.log("In itemsRouter");
	// decodedToken sisältää: kentät username ja id. Token on luotu käyttämällä näitä kenttiä ja .envin SECRET muuttujaa. Token on joka kerta eri, koska siihen lisätään myös luontiajan sisältä iat-kenttä. Se pystytään dekoomaan jwt-kirjastolla.

	const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
	// console.log("dekodaattu token: ", decodedToken)
	if (!decodedToken.id) {
		return res.status(401).json({ error: "Virheellinen token" })
	}

	const user = await User.findById(decodedToken.id)
	// Dekonnstrukroidaan POST- pyynnöstä uuden lisättävän itemin tiedot ja lisätään ne item-modelilla kontstruktoituun item-olioon. itemin lisääjäksi user-kentään lisätään tietokannasta haettu käyttäjä.
	const { itemName, itemDesc, imgUrl } = req.body

	// Varmista, että pakolliset kentät on täytetty
	if (!itemName || !itemDesc) { // imgUrl on nyt valinnainen
		return res.status(400).json({ error: "Sekä itemName että itemDesc ovat pakollisia." })
	}

	// Luo item-objekti imgUrl:n kanssa tai ilman sitä
	const item = new Item({
		itemName,
		itemDesc,
		imgUrl, // imgUrl voi olla määrittelemätön, jos sitä ei anneta
		user: user._id
	})

	try {
		const savedItem = await item.save()
		user.items = user.items.concat(savedItem._id)
		await user.save()

		res.status(201).json(savedItem)
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
})

// PUT reitti esineiden päivittämiseksi
itemsRouter.put("/:id", async (req, res) => {
	const id = req.params.id;
	const { itemName, itemDesc, imgUrl } = req.body;

	const updatedItem = { itemName, itemDesc, imgUrl };
	try {
		const result = await Item.findByIdAndUpdate(id, updatedItem, { new: true });
		if (!result) {
			return res.status(404).send("Esinettä ei löytynyt annetulla ID:llä.");
		}
		res.status(200).json(result);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// DELETE  esineen poistaminen
itemsRouter.delete("/:id", async (req, res) => {
	const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
	const item = await Item.findById(req.params.id)

	if (!item) {
		return res.status(404).json({ error: "Esinettä ei löytynyt!" })
	}

	if (decodedToken.id == item.user._id) {
		const deleteItem = await Item.findByIdAndDelete(item.id)
		res.sendStatus(204)
	} else {
		res.status(403).json({ error: "Ainoastaan esineen lisännyt käyttäjä voi poistaa sen!" })
	}

	// console.log("dec", decodedToken);
	// console.log("item", item.user._id);

	// THIS IS TRUE
	// console.log(decodedToken.id == item.user._id);
})

module.exports = itemsRouter
