import { useEffect, useState } from "react";
import { useNavigate, useRouteError } from "react-router-dom";
import { setAppError, setPage } from "../store/userSlice";
import { useDispatch } from "react-redux";
import ErrorSideBar from "./ErrorSideBar";
import ErrorMain from "./ErrorMain";

export default function Error() {
  const [navbarOpen, setNavbarOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useRouteError();
  // console.log(error);
  useEffect(() => {
    if (error.status === 404) {
      console.log("get here");
      navigate("/dashboard");
      dispatch(
        setAppError({
          msg: error.statusText,
        })
      );
      dispatch(setPage("Dashboard"));
    } else if (error.status === 403) {
      navigate("/login");
      dispatch(
        setAppError({
          msg: "You are not authorized!",
        })
      );
    } else if (error.status === 401) {
      dispatch(
        setAppError({
          msg: "Please login with your credentials.",
        })
      );
      localStorage.removeItem("token");
      navigate("/login");
    } else if (error.response.status === 401) {
      dispatch(
        setAppError({
          msg: error.response.data.message,
        })
      );
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      dispatch(
        setAppError({
          msg: error?.response?.data?.message || "Something went wrong!",
        })
      );
    }
  }, []);
  return (
    <div className="flex w-full relative">
      <ErrorSideBar navbarOpen={navbarOpen} setNavbarOpen={setNavbarOpen} />
      <div
        className={`w-full ${
          navbarOpen && " h-96 overflow-y-hidden sm:h-auto sm:overflow-auto"
        }`}
      >
        <ErrorMain navbarOpen={navbarOpen} setNavbarOpen={setNavbarOpen} />
      </div>
    </div>
  );
}
