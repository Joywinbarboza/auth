import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      console.log(result);

      const googleSignInData = {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      };

      axios
        .post("http://localhost:3000/api/auth/google", googleSignInData)
        .then((response) => {
          // Handle response data as needed
          console.log("Response:", response.data);
          dispatch(signInSuccess(response.data));
          //   setLoading(false);
          navigate("/");
        })
        .catch((response) => {
          // Handle error
          console.log("Response:", response.response.data);
          //   setLoading(false);
          //   setError(true);
        });
    } catch (error) {
      console.log("couldn't login with Google", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95"
    >
      Continue with google
    </button>
  );
}

export default OAuth;
