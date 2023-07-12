import React from "react";
import { FiBell } from "react-icons/fi";
import { BiLogOutCircle } from "react-icons/bi";
import { AiOutlineUser } from "react-icons/ai";
import { CgMoveLeft } from "react-icons/cg";

import hr_text_white from "../assets/branding/hr-text-white1.png";
import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../store/userSlice";
import Dashboard from "../modules/Dashboard/components/Dashboard/Dashboard";
import { Outlet } from "react-router-dom";

export default function ErrorMain({ navbarOpen, setNavbarOpen }) {
  // const loaderData = useLoaderData();
  let user = {},
    user_detail = {},
    imageUrl;
  // if (!blockData) {
  //   user = loaderData.data.data.user;
  //   user_detail = user.user_detail;
  //   imageUrl = user_detail.profile_image_path;
  // }

  const dispatch = useDispatch();
  const { dashboardPage } = useSelector((state) => state.user);
  return (
    <div className={`${navbarOpen && ""}  min-h-screen h-auto w-full bg-slate-100 dark:bg-dark dark:text-white`}>
      <div className="bg-indigo dark:bg-dark text-white w-full flex justify-between items-center p-2 sm:hidden">
        <img src={hr_text_white} alt="logo" width={100} />
        <CgMoveLeft size={"1.5rem"} className="mr-4 sm:pointer-events-none" onClick={() => setNavbarOpen((p) => !p)} />
      </div>
      <div className="w-full bg-white dark:bg-dark2 p-5  justify-between items-center hidden sm:flex">
        <p className="font-bold">{dashboardPage}</p>
        <div className="flex gap-6 items-center relative">
          <FiBell size={"1.2rem"} />
          <div className="peer">
            <img src={imageUrl} alt="user" className="w-7 h-7 rounded-full  mx-5" />
          </div>
          <div className="hidden absolute top-7 right-5 max-w-xs w-[17rem] h-auto bg-white shadow-md rounded-lg p-2 dark:bg-dark2 ring-1 ring-slate-400 dark:ring-black peer-hover:block hover:block">
            <p
              className="bg-white shadow-sm  p-2 w-full mb-1 hover:bg-red rounded-md hover:text-white dark:bg-dark2 dark:hover:bg-red flex items-center gap-3"
              onClick={() => dispatch(setPage("Edit Profile"))}
            >
              <AiOutlineUser /> {user.name}
            </p>
            <p className="bg-white p-2 w-full hover:bg-red rounded-md hover:text-white dark:bg-dark2 dark:hover:bg-red flex items-center gap-3">
              <BiLogOutCircle /> Sign Out
            </p>
          </div>
        </div>
      </div>
      <p className="p-1 px-2 sm:hidden">{dashboardPage}</p>
      {/* {dashboardPage === "Dashboard" && <Dashboard />} */}
      {/* {dashboardPage === "Edit Profile" && <Profile />}
      {dashboardPage === "Employee" && <Employee />} */}
      <Outlet />
    </div>
  );
}
