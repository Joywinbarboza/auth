import User from "../models/user.model.js";
import bycryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bycryptjs.hashSync(password, 10);

  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res
      .status(201)
      .json({ message: "user created succesffuly", user: newUser });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //if no such user found
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));

    //if wrong password
    const validPassword = await bycryptjs.compare(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "wrong credentials"));

    //if successful login
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    //for the password not to be displayed
    const { password: somehashedpassword, ...rest } = validUser._doc;

    //how long the cookie takes to expire
    const expiryDate = new Date(Date.now() + 3600000);//1 hour

    res
      .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
      .status(200)
      //console the rest except password
      .json({ message: "user logged in succesffuly", user: rest });
    //for message including password
    // .json({ message: "user logged in succesffuly", user: validUser });
  } catch (error) {
    next(error);
  }
};
