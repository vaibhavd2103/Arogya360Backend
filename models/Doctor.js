const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
	name: String,
	email: {
		unique: true,
		type: String,
	},
	password: String,
	avatar_url: String,
	dob: String,
	country: String,
	state: String,
	city: String,
	qualification: String,
	specialty: String,
	mci_number: Number,
	gender: String,
	mobile: String,
	userType: String,
});

const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
