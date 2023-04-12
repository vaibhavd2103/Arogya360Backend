const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema({
	doctorId: String,
	createdAt: String,
	doctorName: String,
	doctorPhoto: String,
	doctorSpecialty: String,
	//   likes: Array,
	//   likeCount: Number,
	//   savePost: Array,
	description: String,
	title: String,
	image: String,
	// doctorDetails: {
	//   type: mongoose.Types.ObjectId,
	//   ref: "Doctor",
	// },
});

const Article = mongoose.model("Article", articleSchema);
module.exports = Article;
