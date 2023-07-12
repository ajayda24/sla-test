import { useEffect, useState } from "react";
import LoginComponent from "../components/Login";
import axios from "../../../axios";
import { useNavigate, useLoaderData } from "react-router-dom";
import { setAppError } from "../../../store/userSlice";
import { useDispatch } from "react-redux";
import { printValidationError } from "../../../utils/functions";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginFormLoading, setLoginFormLoading] = useState(false);

  const loaderData = useLoaderData();

  useEffect(() => {
    if (loaderData?.status === 200) {
      navigate("/dashboard");
    }
  }, []);
  const submitForm = async (event, email, password, remember) => {
    event.preventDefault();
    setLoginFormLoading(true);
    try {
      const response = await axios.post("/login", { email, password });
      console.log(response);
      if (response?.status === 200) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }
      setLoginFormLoading(false);
    } catch (err) {
      setLoginFormLoading(false);
      printValidationError(err, "login");
      dispatch(
        setAppError({
          msg: err.response.data.message,
        })
      );
    }
  };
  return (
    <>
      {loaderData?.status !== 200 && (
        <LoginComponent
          submitForm={submitForm}
          setLoginFormLoading={setLoginFormLoading}
          loginFormLoading={loginFormLoading}
        />
      )}
    </>
  );
}

export async function loader() {
  const token = localStorage.getItem("token");
  if (token) {
    const result = axios.get("/dashboard/data", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result;
  } else {
    // redirect("/login");
    return { status: 401 };
  }
}
