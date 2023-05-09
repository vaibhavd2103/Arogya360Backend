const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema({
	doctorId: {
		type: Schema.Types.ObjectId,
		ref: "Doctor",
	},
	createdAt: String,

	likes: Array,
	likeCount: Number,
	savePost: Array,
	description: String,
	title: String,
	image: String,
});

const Article = mongoose.model("Article", articleSchema);
module.exports = Article;
