import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture:{
      type: String,
      default: "https://imgs.search.brave.com/1c0576Y5CnaGr_yREU1RpuJT-Wybaiq5uLXHL4CUCUk/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9jZG4t/aWNvbnMtcG5nLmZy/ZWVwaWsuY29tLzI1/Ni8xMjIyNS8xMjIy/NTc3My5wbmc"
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
