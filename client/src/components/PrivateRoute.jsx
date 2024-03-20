import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const currentUser  = useSelector((state) => state.user);

  return currentUser.currentUser ? <Outlet /> : <Navigate to="/sign-in"/>;
}
