import { axios } from "../../../../Global";
import React, { useEffect, useState } from "react";
import { AiOutlineFileText } from "react-icons/ai";
import { BiBookmarkAltPlus, BiUserPin } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { IoCopyOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useLoaderData } from "react-router-dom";
import { setAppError } from "../../../../store/userSlice";
import Shimmer from "../../../../utils/Shimmer";

export default function Dashboard() {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const [dashboardData, setDashboardData] = useState({});
  const [dataLoading, setDataLoading] = useState(false);

  const { dashboardPage } = useSelector((state) => state.user);

  useEffect(() => {
    if (dashboardPage === "Dashboard") {
      setDataLoading(true);
      axios
        .get("/dashboard/data", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setDataLoading(false);
          setDashboardData(res.data.data);
        })
        .catch((err) => {
          setDataLoading(false);
          dispatch(
            setAppError({
              msg: err.message,
            })
          );
        });
    }
  }, []);

  return (
    <>
      {dataLoading ? (
        <Shimmer />
      ) : (
        <div className="p-8 flex justify-center flex-wrap gap-10">
          <div className="p-10 flex justify-between items-center gap-6 bg-white dark:bg-dark2 dark:text-white max-w-xs w-full rounded-lg">
            <div className="flex flex-col gap-2">
              <p className="text-gray text-sm">Total Quotations</p>
              <p className="text-4xl font-medium">{dashboardData.total_quotations}</p>
            </div>
            <div className="p-4 dark:text-dark rounded-full bg-pink-300 ">
              <BiBookmarkAltPlus size={"1.5rem"} />
            </div>
          </div>
          <div className="p-10 flex justify-between items-center gap-6 bg-white dark:bg-dark2 dark:text-white max-w-xs w-full rounded-lg">
            <div className="flex flex-col gap-2">
              <p className="text-gray text-sm">Total Contracts</p>
              <p className="text-4xl font-medium">{dashboardData.total_contracts}</p>
            </div>
            <div className="p-4 dark:text-dark rounded-full bg-sky-500 ">
              <AiOutlineFileText size={"1.5rem"} />
            </div>
          </div>
          <div className="p-10 flex justify-between items-center gap-6 bg-white dark:bg-dark2 dark:text-white max-w-xs w-full rounded-lg">
            <div className="flex flex-col gap-2">
              <p className="text-gray text-sm">Total Employees</p>
              <p className="text-4xl font-medium">{dashboardData.total_employees}</p>
            </div>
            <div className="p-4 dark:text-dark rounded-full bg-cyan-400 ">
              <BiUserPin size={"1.5rem"} />
            </div>
          </div>
          <div className="p-10 flex justify-between items-center gap-6 bg-white dark:bg-dark2 dark:text-white max-w-xs w-full rounded-lg">
            <div className="flex flex-col gap-2">
              <p className="text-gray text-sm">Total Projects</p>
              <p className="text-4xl font-medium">{dashboardData.total_projects}</p>
            </div>
            <div className="p-4 dark:text-dark rounded-full bg-orange-400 ">
              <IoCopyOutline size={"1.5rem"} />
            </div>
          </div>
          <div className="p-10 flex justify-between items-center gap-6 bg-white dark:bg-dark2 dark:text-white max-w-xs w-full rounded-lg">
            <div className="flex flex-col gap-2">
              <p className="text-gray text-sm">Total Clients</p>
              <p className="text-4xl font-medium">{dashboardData.total_clients}</p>
            </div>
            <div className="p-4 dark:text-dark rounded-full bg-yellow-300 ">
              <FiUsers size={"1.5rem"} />
            </div>
          </div>
          <div className="p-10 flex justify-between items-center gap-6 bg-white dark:bg-dark2 dark:text-white max-w-xs w-full rounded-lg">
            <div className="flex flex-col gap-2">
              <p className="text-gray text-sm">Total Vendors</p>
              <p className="text-4xl font-medium">{dashboardData.total_vendors}</p>
            </div>
            <div className="p-4 dark:text-dark rounded-full bg-violet-400 ">
              <HiOutlineUserGroup size={"1.5rem"} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
