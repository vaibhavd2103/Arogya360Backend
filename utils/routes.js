// const Todo = require("../models/Todo");
const Patient = require("../models/Patient");
const config = require("./config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Article = require("../models/Article");
const Chatroom = require("../models/Chatroom");
const Message = require("../models/Message");
const Report = require("../models/Report");

function routes(app) {
	// health check api

	app.get("/", (req, res) => {
		res.send(
			`Arogya360 backend server running on http://localhost:${config.port}!`
		);
	});

	// patient signup api

	app.post("/patientSignup", (req, res) => {
		const newPatient = new Patient({
			name: req.body.name,
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password, 10),
			avatar_url: req.body.avatar_url,
			dob: req.body.dob,
			gender: req.body.gender,
			mobile: req.body.mobile,
			userType: "1",
			height: req?.body?.height,
			weight: req?.body?.weight,
		});

		Doctor.findOne({ email: req.body.email }, (err, user) => {
			if (err)
				return res.status(500).json({
					title: "Server error",
				});

			if (user) {
				return res.status(500).json({
					title: "User already registered as a doctor",
				});
			}

			if (!user) {
				newPatient
					.save()
					.then((resp) => {
						return res.status(200).json({
							title: "User registered successfully",
						});
					})
					.catch((err) => {
						if (err) {
							return res.status(400).json({
								title: "Error",
								error: "Email already in use",
							});
						}
					});
			}
		});
	});

	// // google signup api

	// app.post("/googleSignup", (req, res) => {
	// 	const newUser = new User({
	// 		name: req.body.name,
	// 		email: req.body.email,
	// 		avatar_url: req.body.avatar_url,
	// 	});

	// 	newUser.save((err, user) => {
	// 		if (err) {
	// 			return res.status(400).json({
	// 				title: "Error",
	// 				error: "Email already in use",
	// 			});
	// 		}
	// 		return res.status(200).json({
	// 			title: "User registered successfully",
	// 			user: user,
	// 		});
	// 	});
	// });

	// patient login api

	app.post("/login", (req, res) => {
		if (req.body.userType == "1") {
			Patient.findOne({ email: req.body.email }, (err, user) => {
				if (err)
					return res.status(500).json({
						title: "Server error",
					});
				if (!user) {
					return res.status(400).json({
						title: "User not found, try signing up",
						error: "No such user",
					});
				}
				if (!bcrypt.compareSync(req.body.password, user.password)) {
					return res.status(401).json({
						title: "Login failed",
						error: "Invalid username or password",
					});
				}
				// authentication is done provide them a token
				let token = jwt.sign({ userId: user._id }, "secretkey");
				return res.status(200).json({
					title: "Login successful",
					user: user,
					token: token,
				});
			});
		} else {
			Doctor.findOne({ email: req.body.email }, (err, user) => {
				if (err)
					return res.status(500).json({
						title: "Server error",
					});
				if (!user) {
					return res.status(400).json({
						title: "User not found, try signing up",
						error: "No such user",
					});
				}
				if (!bcrypt.compareSync(req.body.password, user.password)) {
					return res.status(401).json({
						title: "Login failed",
						error: "Invalid username or password",
					});
				}
				// authentication is done provide them a token
				let token = jwt.sign({ userId: user._id }, "secretkey");
				return res.status(200).json({
					title: "Login successful",
					user: user,
					token: token,
				});
			});
		}
	});

	// get profile api

	app.get(`/getProfile`, (req, res) => {
		let userId = req.query.userId;
		let userType = req.query.userType;

		if (userType === "1") {
			Patient.findById({ _id: userId }, (err, user) => {
				if (err) {
					res.status(500).json({
						title: "Some internal error",
					});
				}
				res.status(200).json({
					title: "Success",
					user: user,
				});
			});
		} else {
			Doctor.findById({ _id: userId }, (err, user) => {
				if (err) {
					res.status(500).json({
						title: "Some internal error",
					});
				}
				res.status(200).json({
					title: "Success",
					user: user,
				});
			});
		}
	});

	// edit profile api

	app.post(`/editProfile`, (req, res) => {
		let userId = req.body.userId;
		let userType = req.body.userType;

		if (userType == "1") {
			Patient.findByIdAndUpdate(userId, {
				mobile: req.body.mobile,
				avatar_url: req.body.avatar_url,
				height: req.body.height,
				weight: req.body.weight,
				bloodGroup: req.body.bloodGroup,
			})
				.then((data) => {
					console.log(data);
					res.status(200).json({
						title: "User updated successfully",
						response: data,
					});
				})
				.catch((err) => {
					res.status(500).json({
						title: "Some internal error",
					});
				});
		} else {
			Doctor.findByIdAndUpdate(userId, {
				mobile: req.body.mobile,
				avatar_url: req.body.avatar_url,
				country: req.body.country,
				state: req.body.state,
				city: req.body.city,
			})
				.then((data) => {
					console.log(data);
					res.status(200).json({
						title: "User updated successfully",
						response: data,
					});
				})
				.catch((err) => {
					res.status(500).json({
						title: "Some internal error",
					});
				});
		}
	});

	// create article

	app.post(`/createArticle`, (req, res) => {
		const newArticle = new Article({
			doctorId: req.body.doctorId,
			createdAt: req.body.createdAt,
			doctorName: req.body.doctorName,
			doctorPhoto: req.body.doctorPhoto,
			description: req.body.description,
			title: req.body.title,
			qualification: req.body.qualification,
			// doctorDetails: req.body.doctorDetails,
		});
		newArticle
			.save()
			.then((resp) => {
				return res.status(200).json({
					title: "Article posted successfully",
				});
			})
			.catch((err) => {
				if (err) {
					return res.status(400).json({
						title: "Error detected",
						error: "Some error",
					});
				}
			});
	});

	// get allArticles api

	app.get(`/getAllArticles`, (req, res) => {
		Article.find((err, data) => {
			if (err) {
				res.status(500).json({
					title: "Some internal error",
				});
			}
			res.status(200).json({
				title: "Success",
				article: data,
			});
		});
	});

	// create appointment

	app.post(`/bookAppointment`, (req, res) => {
		const newAppointment = new Appointment({
			doctorId: req.body.doctorId,
			patientId: req.body.patientId,
			appointmentDate: req.body.appointmentDate,
			appointmentTime: req.body.appointmentTime,
			// checkByDoctor: false,
		});

		newAppointment
			.save()
			.then((resp) => {
				return res.status(200).json({
					title: "Appointment booked successfully",
				});
			})
			.catch((err) => {
				if (err) {
					return res.status(400).json({
						title: "Error",
						error: "Some error",
					});
				}
			});
	});

	// delete appointment

	app.post(`/deleteAppointment`, (req, res) => {
		Appointment?.findByIdAndDelete(req?.body?.appointmentId).then(() => {
			return res?.status(200).json({
				title: "Appointment deleted successfully",
			});
		});
	});

	// get my appointments api

	app.get(`/getMyAppointments`, (req, res) => {
		let userId = req.query.userId;
		let userType = req.query.userType;

		if (userType == "1") {
			Appointment.aggregate(
				[
					{
						$lookup: {
							from: "doctors", // collection to join
							localField: "doctorId", //field from the input documents
							foreignField: "_id", //field from the documents of the "from" collection
							as: "user", // output array field
						},
					},
					{
						$unwind: "$user",
					},
				],
				function (error, data) {
					return res.json(data);
					//handle error case also
				}
			);
		} else {
			Appointment.aggregate(
				[
					{
						$lookup: {
							from: "patients", // collection to join
							localField: "patientId", //field from the input documents
							foreignField: "_id", //field from the documents of the "from" collection
							as: "user", // output array field
						},
					},
					{
						$unwind: "$user",
					},
				],
				function (error, data) {
					return res.json(data);
					//handle error case also
				}
			);
		}
	});

	// get booked appointments api

	app.get(`/getBookedAppointments`, (req, res) => {
		let userId = req.query.userId;

		Appointment.find({ doctorId: userId }, (err, data) => {
			if (err) {
				res.status(500).json({
					title: "Some internal error",
				});
			}
			res.status(200).json({
				title: "Success",
				data: data,
			});
		});
	});

	// create chatroom api

	app.post(`/createChatRoom`, (req, res) => {
		const newChatRoom = new Chatroom({
			doctorId: req.body.doctorId,
			patientId: req.body.patientId,
			lastMessage: "",
			createdAt: req.body.createdAt,
			unreadMessageCount: 0,
		});

		Chatroom.findOne(
			{ doctorId: req.body.doctorId, patientId: req.body.patientId },
			(err, chatRoom) => {
				if (err) {
					return res.status(400).json({
						title: "Error",
						error: "Some error",
					});
				}
				if (!chatRoom) {
					newChatRoom
						.save()
						.then((resp) => {
							return res.status(200).json({
								title: "Chatroom created successfully",
								data: resp,
							});
						})
						.catch((err) => {
							if (err) {
								return res.status(400).json({
									title: "Error",
									error: "Some error",
								});
							}
						});
				}
				if (chatRoom) {
					return res.status(200).json({
						title: "Chatroom already exists",
						data: chatRoom,
					});
				}
			}
		);
	});

	// get my chatRooms api

	app.get(`/getMyChatRooms`, (req, res) => {
		let userId = req.query.userId;
		let userType = req.query.userType;

		if (userType == "1") {
			Chatroom.aggregate(
				[
					{
						$lookup: {
							from: "doctors", // collection to join
							localField: "doctorId", //field from the input documents
							foreignField: "_id", //field from the documents of the "from" collection
							as: "user", // output array field
						},
					},
					{
						$unwind: "$user",
					},
				],
				function (error, data) {
					return res.json(data);
					//handle error case also
				}
			);
		} else {
			Chatroom.aggregate(
				[
					{
						$lookup: {
							from: "patients", // collection to join
							localField: "patientId", //field from the input documents
							foreignField: "_id", //field from the documents of the "from" collection
							as: "user", // output array field
						},
					},
					{
						$unwind: "$user",
					},
				],
				function (error, data) {
					return res.json(data);
					//handle error case also
				}
			);
		}
	});

	// send message api

	app.post(`/sendMessage`, (req, res) => {
		const newMessage = new Message({
			senderId: req.body.senderId,
			receiverId: req.body.receiverId,
			chatRoomId: req.body.chatRoomId,
			createdAt: req.body.createdAt,
			messageType: req.body.messageType,
			message: req.body.message,
		});

		newMessage
			.save()
			.then((resp) => {
				return res.status(200).json({
					title: "Message send successfully",
					data: resp,
				});
			})
			.catch((err) => {
				if (err) {
					return res.status(400).json({
						title: "Error",
						error: err,
					});
				}
			});
	});

	// get messages api

	app.get(`/getMessages`, (req, res) => {
		let chatRoomId = req.query.chatRoomId;

		Message.find({ chatRoomId: chatRoomId }, (err, data) => {
			if (err) {
				res.status(500).json({
					title: "Some internal error",
				});
			}
			res.status(200).json({
				title: "Success",
				messages: data?.reverse(),
			});
		});
	});

	app.get("/getAllDoctors", (req, res) => {
		Doctor.find((err, data) => {
			if (err) {
				res.status(500).json({
					title: "Some internal error",
				});
			}
			res.status(200).json({
				title: "Success",
				doctors: data,
			});
		});
	});

	// create report api

	app.post("/createReport", (req, res) => {
		const newReport = new Report({
			doctorId: req.body.doctorId,
			patientId: req.body.patientId,
			patientName: req.body.patientName,
			patientAge: req.body.patientAge,
			patientGender: req.body.patientGender,
			patientHeight: req.body.patientHeight,
			patientWeight: req.body.patientWeight,
			medicines: req.body.medicines,
			reasons: req.body.reasons,
			createdAt: req.body.createdAt,
			chatRoomId: req.body.chatRoomId,
			description: req.body.description,
		});

		newReport
			.save()
			.then((resp) => {
				return res.status(200).json({
					title: "Report created successfully",
					data: resp,
				});
			})
			.catch((err) => {
				if (err) {
					return res.status(400).json({
						title: "Error",
						error: "Some error",
					});
				}
			});
	});

	// get my report api

	app.get(`/getMyReport`, (req, res) => {
		let userId = req.query.userId;

		Report.findOne({ patientId: userId }, (err, data) => {
			if (err) {
				res.status(500).json({
					title: "Some internal error",
				});
			}
			res.status(200).json({
				title: "Success",
				data: data,
			});
		});
	});

	// // google login api

	// app.post("/googleLogin", (req, res) => {
	// 	User.findOne({ email: req.body.email }, (err, user) => {
	// 		if (err)
	// 			return res.status(500).json({
	// 				title: "Server error",
	// 			});
	// 		if (!user) {
	// 			return res.status(400).json({
	// 				title: "User not found, try signing up",
	// 				error: "Invalid username or password",
	// 			});
	// 		}
	// 		return res.status(200).json({
	// 			title: "Login successful",
	// 			user: user,
	// 		});
	// 	});
	// });

	// // add todo api

	// app.post("/addTodo", (req, res) => {
	// 	const newTodo = new Todo({
	// 		todo: req.body.todo,
	// 		completed: false,
	// 		created_at: req.body.created_at,
	// 		user_id: req.body.user_id,
	// 	});
	// 	if (req.body.todo === "") {
	// 		res.status(404).json({
	// 			error: "To do cannot be empty",
	// 		});
	// 	} else {
	// 		newTodo.save((err, todo) => {
	// 			if (err) {
	// 				return res.status(400).json({
	// 					title: "Error",
	// 					error: "Todo not created",
	// 				});
	// 			}
	// 			return res.status(200).json({
	// 				title: "Todo added successfully",
	// 				todo: todo,
	// 			});
	// 		});
	// 	}
	// });

	// // complete todo api

	// app.post(`/completeTodo`, (req, res) => {
	// 	let todoId = req.body.todo_id;
	// 	Todo.findByIdAndUpdate(todoId, { completed: true }, (err, todo) => {
	// 		if (err) {
	// 			res.status(500).json({
	// 				title: "Some internal error",
	// 			});
	// 		}
	// 		res.status(200).json({
	// 			title: "Todo updated successfully",
	// 			todo: todo,
	// 		});
	// 	});
	// });

	// // undo todo api

	// app.post(`/undoTodo`, (req, res) => {
	// 	let todoId = req.body.todo_id;
	// 	Todo.findByIdAndUpdate(todoId, { completed: false }, (err, todo) => {
	// 		if (err) {
	// 			res.status(500).json({
	// 				title: "Some internal error",
	// 			});
	// 		}
	// 		res.status(200).json({
	// 			title: "Todo updated successfully",
	// 			todo: todo,
	// 		});
	// 	});
	// });

	// // delete Todo api

	// app.post(`/deleteTodo`, (req, res) => {
	// 	let todoId = req.body.todo_id;
	// 	Todo.findOneAndDelete({ _id: todoId }, (err) => {
	// 		if (err) {
	// 			res.status(500).json({
	// 				title: "Some internal error",
	// 			});
	// 		}
	// 		res.status(200).json({
	// 			title: "Todo deleted successfully",
	// 		});
	// 	});
	// });

	// // edit Todo api

	// app.post(`/editTodo`, (req, res) => {
	// 	let todoId = req.body.todo_id;
	// 	Todo.findByIdAndUpdate(
	// 		todoId,
	// 		{ todo: req.body.todo, created_at: req.body.created_at },
	// 		(err, todo) => {
	// 			if (err) {
	// 				res.status(500).json({
	// 					title: "Some internal error",
	// 				});
	// 			}
	// 			res.status(200).json({
	// 				title: "Todo updated successfully",
	// 				todo: todo,
	// 			});
	// 		}
	// 	);
	// });
}

module.exports = routes;
