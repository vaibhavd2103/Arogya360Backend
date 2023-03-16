// const Todo = require("../models/Todo");
const Patient = require("../models/Patient");
const config = require("./config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

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

	// doctor signup api

	app.post("/doctorSignup", (req, res) => {
		const newDoctor = new Doctor({
			name: req.body.name,
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password, 10),
			avatar_url: req.body.avatar_url,
			dob: req.body.dob,
			gender: req.body.gender,
			mobile: req.body.mobile,
			country: req.body.country,
			state: req.body.state,
			city: req.body.city,
			qualification: req.body.qualification,
			specialty: req.body.specialty,
			mci_number: req.body.mci_number,
			userType: "2",
		});

		Patient.findOne({ email: req.body.email }, (err, user) => {
			if (err)
				return res.status(500).json({
					title: "Server error",
				});

			if (user) {
				return res.status(500).json({
					title: "User already registered as a patient",
				});
			}

			if (!user) {
				newDoctor
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

	// edit Todo api

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

	// get my appointments api

	app.get(`/getMyAppointments`, (req, res) => {
		let userId = req.query.userId;
		let userType = req.query.userType;

		if (userType == "1") {
			Appointment.find({ patientId: userId }, (err, data) => {
				if (err) {
					res.status(500).json({
						title: "Some internal error",
					});
				}
				res.status(200).json({
					title: "Success",
					appointments: data?.reverse(),
				});
			});
		} else {
			Appointment.find({ doctorId: userId }, (err, data) => {
				if (err) {
					res.status(500).json({
						title: "Some internal error",
					});
				}
				res.status(200).json({
					title: "Success",
					appointments: data?.reverse(),
				});
			});
		}
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
