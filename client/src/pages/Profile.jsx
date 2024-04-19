import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
function Profile() {
  const [image, setImage] = useState(null);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const fileRef = useRef(null);
  const currentUser = useSelector((state) => state.user);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

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
          ) : imagePercent === 100 ? (
            <span className="text-green-500">Image Uploaded</span>
          ) : null}
        </div>

        <input
          type="text"
          id="username"
          placeholder="username"
          className="bg-slate-100 rounded-lg p-3"
          defaultValue={currentUser.currentUser.user.username}
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          className="bg-slate-100 rounded-lg p-3"
          defaultValue={currentUser.currentUser.user.email}
        />
        <input
          type="password"
          id="password"
          placeholder="Pasword"
          className="bg-slate-100 rounded-lg p-3"
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          UPDATE
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
}

export default Profile;
