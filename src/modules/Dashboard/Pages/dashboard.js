import { useEffect, useState } from "react";
import { SideBar } from "../../../components";
import Main from "../Main";

import { useNavigate, useLoaderData, useLocation } from "react-router-dom";
import { axios } from "../../../Global";
import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../../../store/userSlice";
import { getDashbaordData } from "../../../store/Api";

const upperCaseWords = (str) =>
  str.replace(/^(.)|\s+(.)/g, (c) => c.toUpperCase());

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const loaderData = useLoaderData();

  const [navbarOpen, setNavbarOpen] = useState(false);

  const dashboardData = useSelector((state) => state.dashboardData);

  useEffect(() => {
    if (location.pathname !== "/dashboard") {
      const currentPage = upperCaseWords(
        String(location.pathname.split("/")[2].split("-").join(" "))
      );
      if (currentPage !== "") {
        dispatch(setPage(currentPage));
      }
    } else {
      dispatch(setPage("Dashboard"));
    }
  }, [location.pathname]);

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      dispatch(getDashbaordData(token));
    } else {
      navigate("/");
    }
  }, []);

  const { dashboardPage } = useSelector((state) => state.user);
  // console.log(dashboardPage);

  // useEffect(() => {
  //   if (loaderData?.status === 200) {
  //     navigate("/dashboard");
  //   } else {
  //     navigate("/login");
  //   }
  // }, []);

  return (
    <>
      {dashboardData.status === true && (
        <div className="flex w-full relative">
          <SideBar navbarOpen={navbarOpen} setNavbarOpen={setNavbarOpen} />
          <div
            className={`w-full ${
              navbarOpen && " h-96 overflow-y-hidden sm:h-auto sm:overflow-auto"
            }`}
          >
            <Main navbarOpen={navbarOpen} setNavbarOpen={setNavbarOpen} />
          </div>
        </div>
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
    throw new Response("Not Authenticated", { status: 401 });
  }
}
