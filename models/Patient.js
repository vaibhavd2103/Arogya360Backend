const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const patientSchema = new Schema({
	name: String,
	email: {
		unique: true,
		type: String,
	},
	password: String,
	avatar_url: String,
	dob: String,
	gender: String,
	mobile: String,
	height: String,
	weight: String,
});

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
