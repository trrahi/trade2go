const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
	userName: String,
	firstName: String,
	lastName: String,
	emailAddress: String,
	phoneNumber: String,
	passwordHash: String,
	items: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Item"
		}
	]
})

userSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
		delete returnedObject.phoneNumber
		delete returnedObject.passwordHash
	}
})

const User = mongoose.model("User", userSchema)

module.exports = User
