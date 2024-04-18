const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	auth: {
		user: process.env.USERNAME_EMAIL,
		pass: process.env.PASSWORD_EMAIL,
	},
});

const handleSendMail = async (email) => {
	try {
		await transporter.sendMail(email);

		return "OK";
	} catch (error) {
		return error;
	}
};

const checkEmailExists = asyncHandler(async (req, res) => {
	const { email } = req.body;
	const existingUser = await UserModel.findOne({ email });
	if (!existingUser) {
		return res.status(200).json({ message: "Email không tồn tại" });
	}
	if (existingUser) {
		return res.status(200).json({ message: "Email đã tồn tại" });
	}
});

const verification = asyncHandler(async (req, res) => {
	const { email } = req.body;

	const verificationCode = Math.round(1000 + Math.random() * 9000);

	try {
		const data = {
			from: `"Support Zelo Appplication" <${process.env.USERNAME_EMAIL}>`,
			to: email,
			subject: "Verification email code",
			text: "Your code to verification email",
			html: `<h1>${verificationCode}</h1>`,
		};

		await handleSendMail(data);

		res.status(200).json({
			message: "Send verification code successfully!!!",
			data: {
				code: verificationCode,
			},
		});
	} catch (error) {
		res.status(401);
		throw new Error("Can not send email");
	}
});

const getJsonWebToken = (email, id) => {
	const payload = {
		email,
		id,
	};
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const register = asyncHandler(async (req, res) => {
	const { fullname, email, password, photoUrl, dateOfBirth, gender } = req.body;

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	const newUser = new UserModel({
		fullname,
		email,
		photoUrl,
		dateOfBirth,
		gender,
		password: hashedPassword,
	});

	await newUser.save();
	res.status(200).json({
		message: "Đăng ký thành công",
		data: {
			id: newUser._id,
			fullname: newUser.fullname,
			email: newUser.email,
			photoUrl: newUser.photoUrl,
			gender: newUser.gender,
			dateOfBirth: newUser.dateOfBirth,
			accesstoken: getJsonWebToken(newUser.fullname,newUser.gender, newUser.dateOfBirth, newUser.email,newUser. photoUrl, newUser._id),
		},
	});
});

const login = asyncHandler(async (req, res) => {
	const {  email, password } = req.body;

	const existingUser = await UserModel.findOne({ email });

	if (!existingUser) {
		res.status(403);
		throw new Error("User not found!!!");
	}

	const isMatchPassword = await bcrypt.compare(password, existingUser.password);

	if (!isMatchPassword) {
		res.status(401);
		throw new Error("Email or Password is not correct!");
	}

	res.status(200).json({
		message: "Login successfully",
		data: {
			id: existingUser._id,
			email: existingUser.email,
			fullname: existingUser.fullname,
			photoUrl: existingUser.photoUrl,
			gender: existingUser.gender,
			dateOfBirth: existingUser.dateOfBirth,
			accesstoken: await getJsonWebToken(
				existingUser.email,
				existingUser._id,
				existingUser.fullname,
				existingUser.photoUrl, existingUser.gender, existingUser.dateOfBirth,

			),
		},
	});
});

const updatePassword = async (email, password) => {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	const res = await UserModel.findOneAndUpdate(
		{ email },
		{
			password: hashedPassword,
		}
	).exec();
	return res;
};

const passwordRetrieval = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(200).json({
			message: "Missing email or password",
		});
	}
	const updatedUser = await updatePassword(email, password);
	if (!updatedUser) {
		return res.status(200).json({
			message: "User not found",
		});
	}
	res.status(200).json({
		message: "Password updated successfully",
		data: {
			id: updatedUser._id,
			email: updatedUser.email,
			fullname: updatedUser.fullname,
			photoUrl: updatedUser.photoUrl,
			gender: updatedUser.gender,
			dateOfBirth: updatedUser.dateOfBirth,
			accesstoken: await getJsonWebToken(
				email,
				updatedUser._id,
				updatedUser.fullname,
				updatedUser.photoUrl,
				updatedUser.gender,
				updatedUser.dateOfBirth
			),
		},
	});
};

//change password	
const updatePasswordWhenLogin = async (req, res) => {
	const { email, password } = req.body;
	const existingUser = await UserModel
		.findOne({ email });
	if (!existingUser) {
		return res.status(401).json({ message: "Email không tồn tại" });
	}
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	const updatedUser = await UserModel.findOneAndUpdate(
		{ email },
		{
			password: hashedPassword,
		}
	).exec();
	if (!updatedUser) {
		return res.status(200).json({
			message: "User not found",
		});
	}
	res.status(200).json({
		message: "Password updated successfully",
		data: {
			id: updatedUser._id,
			email: updatedUser.email,
			fullname: updatedUser.fullname,
			photoUrl: updatedUser.photoUrl,
			accesstoken: await getJsonWebToken(
				email,
				updatedUser._id,
				updatedUser.fullname,
				updatedUser.photoUrl
			),
		},
	});
}


module.exports = {
	register,
	login,
	verification,
	passwordRetrieval,
	checkEmailExists,
	updatePasswordWhenLogin,
};