const http = require("http");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
// const nodemailer = require("nodemailer");
const config = require("./utils/config");
const mongoose = require("mongoose");
const routes = require("./utils/routes");
const { Server } = require("socket.io");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const server = http.createServer(app);

// multer
var fs = require("fs");
const path = require("path");
var multer = require("multer");
const Image = require("./models/Image");

var storage = multer.diskStorage({
	destination: "uploads",
	filename: (req, file, cb) => {
		cb(null, file.originalName + "-" + Date.now());
	},
});

var upload = multer({ storage: storage }); // upload images

app.post("/uploadImage", upload.single("image"), (req, res) => {
	console.log("--------------->>>>>>>>>>>>", req.file);
	const newImage = new Image({
		name: req.body.name,
		desc: req.body.desc,
		img: {
			data: req.file.filename.toString("base64"),
			contentType: "image/png",
		},
	});

	newImage.save().then((err, item) => {
		if (err) {
			console.log(err);
		}
		// item.save();
		// res.redirect("/");
		res.status(200).json({ image: item });
	});
});

const connectMongo = async () => {
	try {
		await mongoose.set("strictQuery", false);
		await mongoose.connect(config.dbUrl);
		console.log("MongoDB connected successfully");
	} catch (error) {
		console.log("Error in connection to DB", error);
	}
};

const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST", "DELETE"],
	},
});

io.on("connection", (socket) => {
	console.log("User connected : ", socket.id);

	socket.emit("connected", "User online");

	socket.on("join_room", (data) => {
		socket.join(data);
		console.log(
			`User with ID : ${socket.id} joined the room with ID : ${data}`
		);
	});

	socket.on("send_message", (message) => {
		console.log("received message : ", message);
		// io.emit("receive_message", message);
		io.to(message?.chatRoomId).emit("receive_message", message);
		// socket.to(message?.roomId).emit("receive_message", message);
	});

	socket.on("disconnect", () => {
		console.log(`User disconnected ${socket.id}`);
	});
});

server.listen(process.env.PORT || config.port, async () => {
	console.log(
		`Server running on port ${config.port} (i.e) http://localhost:${config.port}`
	);
	await connectMongo();
	await routes(app);
});

module.exports = app;
