const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
	itemName: { type: String, required: true },
	itemDesc: { type: String, required: true },
	imgUrl: { type: String, required: false },
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
});

itemSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
