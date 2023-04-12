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

	socket.on("join_room", (roomId) => {
		socket.join(roomId);
		console.log(
			`User with ID : ${socket.id} joined the room with ID : ${roomId}`
		);
	});

	socket.on("send_message", (message) => {
		console.log("received message : ", message);
		socket.emit("receive_message", message);
		// socket.to(message?.roomId).emit("receive_message", message);
	});

	socket.on("disconnect", () => {
		console.log(`User disconnected ${socket.id}`);
	});
});

server.listen(config.port, async () => {
	console.log(
		`Server running on port ${config.port} (i.e) http://localhost:${config.port}`
	);
	await connectMongo();
	await routes(app);
});

module.exports = app;
