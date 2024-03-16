import User from "../models/user.model.js";
import bycryptjs from 'bcryptjs'

export const signup = async (req, res, next) => {
    const {username, email, password} = req.body;
    const hashedPassword = bycryptjs.hashSync(password, 10);

    const newUser = new User({username, email, password:hashedPassword});
    try {
        await newUser.save();
        res.status(201).json({"message":"user created succesffuly", "user":newUser});
    } catch (error) {
        // next(error);
        next();
    }
};

