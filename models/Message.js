const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
	senderId: String,
	receiverId: String,
	chatRoomId: {
		type: Schema.Types.ObjectId,
		ref: "Chatroom",
	},
	createdAt: String,
	messageType: Number,
	message: String,
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
