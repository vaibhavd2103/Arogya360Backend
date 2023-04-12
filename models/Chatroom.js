const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatroomSchema = new Schema({
	doctorId: {
		type: Schema.Types.ObjectId,
		ref: "Doctor",
	},
	patientId: {
		type: Schema.Types.ObjectId,
		ref: "Patient",
	},
	lastMessage: String,
	unreadMessageCount: Number,
	createdAt: String,
});

const Chatroom = mongoose.model("Chatroom", chatroomSchema);
module.exports = Chatroom;
