const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportSchema = new Schema({
	doctorId: {
		type: Schema.Types.ObjectId,
		ref: "Doctor",
	},
	patientId: {
		type: Schema.Types.ObjectId,
		ref: "Patient",
	},
	patientName: String,
	patientAge: String,
	patientGender: String,
	patientHeight: String,
	patientWeight: String,
	medicines: Array,
	reasons: Array,
	description: String,
	createdAt: String,
	chatRoomId: {
		type: Schema.Types.ObjectId,
		ref: "Chatroom",
	},
});

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
