const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
	doctorId: String,
	patientId: String,
	appointmentDate: String,
	appointmentTime: String,
	checkByDoctor: Boolean,
	doctorName: String,
	doctorPhoto: String,
	patientName: String,
	patientPhoto: String,
	completed: Boolean,
	// feesPaid: Boolean,
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
