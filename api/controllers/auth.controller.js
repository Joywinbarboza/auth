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

    res
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365 * 7,
      })
      .status(200)
      //console the rest except password
      .json({ message: "user logged in succesffuly", user: rest });
    //for message including password
    // .json({ message: "user logged in succesffuly", user: validUser });
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: somehashedpassword, ...rest } = user._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 365 * 7,
        })
        .status(200)
        .json({ message: "user logged in succesffuly", user });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bycryptjs.hashSync(generatedPassword, 10);

      console.log(req.body.name);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8),
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.photo,
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

      const { password: hashedPassword2, ...rest } = newUser._doc;

      res
        .cookie("access_token", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 365 * 7,
        })
        .status(200)
        .json({ message: "user logged in succesffuly", user: rest });
    }
  } catch (error) {
    next(error);
  }
};
