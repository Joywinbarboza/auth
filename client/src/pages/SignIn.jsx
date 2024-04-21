import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../utils/utils.js";
import OAuth from "../components/OAuth.jsx";

function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(signInStart());

    // setError(false);
    // setLoading(true);

    axios
      .post("/api/auth/signin", formData,{
        withCredentials: true,
      })
      .then((response) => {
        // Handle response data as needed
        console.log("Response:", response.data);
        // setLoading(false);
        dispatch(signInSuccess(response.data));
        navigate("/");
      })
      .catch((response) => {
        // Handle error
        console.log("Response:", response.response.data);
        // setLoading(false);
        // setError(true);
        dispatch(signInFailure(response.response.data));
      });
  };

  // console.log(loading);
  return (
    <>
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl text-center font-semibold my-7">Sign in</h1>
        <form className="flex flex-col gap-4 p-3" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            id="email"
            className="bg-slate-100 p-3 rounded-lg"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            className="bg-slate-100 p-3 rounded-lg"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
          <OAuth/>
        </form>
        <div className="flex gap-2 mt-5">
          <p>dont have an account?</p>
          <Link to="/sign-up">
            <span className="text-blue-500">Sign up</span>
          </Link>
        </div>
        <p className="text-red-700 mt-5">
          {error
            ? capitalizeFirstLetter(error.message || "Something went wrong")
            : " "}
        </p>
      </div>
    </>
  );
}

export default SignIn;
