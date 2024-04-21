import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import axios from "axios";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOut,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
function Profile() {
  const [image, setImage] = useState(null);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [uploaded, setUploaded] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const navigate = useNavigate();
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);
  const { loading, error } = useSelector((state) => state.user);

  const axios_cookies = axios.create({
    withCredentials: true,
  });

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  useEffect(() => {
    if (imagePercent === 100 && !imageError) {
      const timer = setTimeout(() => {
        setUploaded(true);
        console.log(uploaded);
      }, 2000); // 2000 milliseconds delay
      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [imagePercent, imageError]);

  const handleFileUpload = async (image) => {
    console.log(image);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    // const fileName = new Date().getTime();
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(progress);
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, profilePicture: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(updateUserStart());
    axios_cookies
      .post(
        `/api/user/update/${currentUser.currentUser.user._id}`,
        formData
      )
      .then((response) => {
        // Handle response data as needed
        console.log("Response:", response.data);
        setUpdateSuccess(true);
        dispatch(updateUserSuccess(response.data));
      })
      .catch((error) => {
        // Handle error
        console.log("Error:", error);
        setUpdateSuccess(false);
        dispatch(updateUserFailure(error.response));
      });
  };

  const handleDeleteAccount = async () => {
    dispatch(deleteUserStart());
    axios_cookies
      .post(
        `/api/user/delete/${currentUser.currentUser.user._id}`
      )
      .then((response) => {
        // Handle response data as needed
        console.log("Response:", response.data);
        // setUpdateSuccess(true);
        dispatch(deleteUserSuccess());
        navigate("/");
      })
      .catch((error) => {
        // Handle error
        console.log("Error:", error);
        // setUpdateSuccess(false);
        dispatch(deleteUserFailure(error.response));
      });
  };

  const handleSignOut = async () => {
    // dispatch(deleteUserStart());
    axios_cookies
      .get(`/api/auth/signout`)
      .then((response) => {
        // Handle response data as needed
        console.log("Response:", response.data);
        // setUpdateSuccess(true);
        dispatch(signOut());
        navigate("/sign-in");
      })
      .catch((error) => {
        // Handle error
        console.log("Error:", error);
      });
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <img
          className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2"
          src={
            formData.profilePicture ||
            currentUser.currentUser.user.profilePicture
          }
          alt="profile picture"
          onClick={() => {
            fileRef.current.click();
            setImageError(false);
            setImagePercent(0);
          }}
        />
        <div className="text-sm text-center font-bold">
          {imageError ? (
            <span className="text-red-500">
              Error uploading image or is above 2MB
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <div className="mb-6 h-1 w-full bg-neutral-200 dark:bg-neutral-600 h-3 rounded-full">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${imagePercent}%` }}
              ></div>
            </div>
          ) : uploaded ? (
            <span className="text-green-500">Image Uploaded</span>
          ) : null}
        </div>

        <input
          type="text"
          id="username"
          placeholder="username"
          className="bg-slate-100 rounded-lg p-3"
          defaultValue={currentUser.currentUser.user.username}
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          className="bg-slate-100 rounded-lg p-3"
          defaultValue={currentUser.currentUser.user.email}
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          placeholder="Pasword"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
        />
        <button
          onClick={handleSubmit}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-70"
          disabled={loading}
        >
          {loading ? "Loading..." : "UPDATE"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteAccount}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <p className="text-red-700 m-5">{error && "Something went wrong!"}</p>
      <p className="text-green-700 m-5">
        {updateSuccess && "Updated successfully"}
      </p>
    </div>
  );
}

export default Profile;
