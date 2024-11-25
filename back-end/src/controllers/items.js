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
        const items = await Item.find({}).populate("user", { userName: 1, email: 1 }); // Populate userName and email
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: "Error fetching items" });
    }
});


itemsRouter.post("/", async (req, res) => {
	console.log("In itemsRouter");

	const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
	if (!decodedToken.id) {
		return res.status(401).json({ error: "Invalid token" })
	}

	const user = await User.findById(decodedToken.id)
	const { itemName, itemDesc, imgUrl } = req.body

	// Validate required fields
	if (!itemName || !itemDesc || !imgUrl) {
		return res.status(400).json({ error: "All fields are required: itemName, itemDesc, imgUrl." })
	}

	const item = new Item({
		itemName,
		itemDesc,
		imgUrl,
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

// PUT route to update items
itemsRouter.put("/:id", async (req, res) => {
	const id = req.params.id;
	const { itemName, itemDesc, imgUrl } = req.body;

	const updatedItem = { itemName, itemDesc, imgUrl };
	try {
		const result = await Item.findByIdAndUpdate(id, updatedItem, { new: true });
		if (!result) {
			return res.status(404).send("Item not found with the provided ID.");
		}
		res.status(200).json(result);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});


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

module.exports = itemsRouter
