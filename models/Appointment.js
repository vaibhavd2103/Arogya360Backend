const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
	doctorDetail: {
		type: Schema.Types.ObjectId,
		ref: "Doctor",
	},
	patientDetail: {
		type: Schema.Types.ObjectId,
		ref: "Patient",
	},
	doctorId: {
		type: Schema.Types.ObjectId,
		ref: "Doctor",
	},
	patientId: {
		type: Schema.Types.ObjectId,
		ref: "Patient",
	},
	appointmentDate: String,
	appointmentTime: String,
	checkByDoctor: Boolean,
	completed: Boolean,
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
