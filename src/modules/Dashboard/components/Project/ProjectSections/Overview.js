import React, { useState } from "react";
import sampleUser from "../../../../../assets/default/user.png";
import { BiEdit } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { axios } from "../../../../../Global";
import { setAppError } from "../../../../../store/userSlice";
import { useDispatch } from "react-redux";

export default function Overview({ projectDetails = {}, toggleProjectUpdate }) {
  const [currentStatus, setCurrentStatus] = useState(projectDetails?.status);
  const [projectEdit, setProjectEdit] = useState(false);
  const token = localStorage.getItem("token");
  const [projectName, setProjectName] = useState(projectDetails?.name || "");
  const [projectType, setProjectType] = useState(
    projectDetails?.quotation_type?.name || ""
  );
  const [description, setDescription] = useState(
    projectDetails?.description || "--"
  );
  const [startDate, setStartDate] = useState(projectDetails?.start_date);
  const [endDate, setEndDate] = useState(projectDetails?.end_date);
  const dispatch = useDispatch();
  // To reverse the date
  // ie, yyyy-mm-dd <==> dd-mm-yyyy
  const reverseDate = (date) => {
    if (date) {
      return date.toString().split("-").reverse().join("-");
    } else {
      return "";
    }
  };

  const submitProjectEdit = async () => {
    if (startDate > endDate) {
      dispatch(
        setAppError({
          msg: "Invalid end date.",
        })
      );
      return false;
    }
    try {
      let body = {
        name: projectName,
        description: description,
        start_date: startDate,
        end_date: endDate,
        status: currentStatus,
      };
      console.log(body);
      const response = await axios.put(
        `/dashboard/project/${projectDetails?.id}`,
        body,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
      toggleProjectUpdate();
      dispatch(
        setAppError({
          msg: "Successfully edited.",
          color: "success",
        })
      );
      setProjectEdit(false);
    } catch (error) {
      console.log(error);
      dispatch(
        setAppError({
          msg: error.message,
        })
      );
    }
  };

  const allStatus = [
    "In Progress",
    "Not Started",
    "On hold",
    "Cancelled",
    "Finished",
  ];

  return (
    <>
      <div className="w-full flex flex-wrap gap-3 justify-between items-center p-5 ">
        <div className="flex flex-wrap gap-3 sm:gap-16">
          <h1 className="font-semibold text-xl">Project info </h1>
          <div className="flex gap-4">
            <label>Status: </label>
            {currentStatus !== "" && (
              <select
                className="rounded-full  px-2"
                defaultValue={currentStatus}
                disabled={!projectEdit}
                onChange={(e) => setCurrentStatus(e.target.value)}
                onLoad={(e) => (e.target.value = currentStatus)}
              >
                {allStatus.map((st, i) => (
                  <option
                    key={i}
                    value={st}
                    selected={st === currentStatus ? true : false}
                  >
                    {st}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        <div className="flex gap-3 items-stretch">
          <button
            className={`flex items-center gap-2 ring-slate-400 ring-1 p-2 rounded-md px-4 ${
              projectEdit ? "bg-red text-white" : ""
            }`}
            onClick={() => {
              if (!projectEdit) {
                setProjectEdit((p) => !p);
              } else {
                submitProjectEdit();
              }
            }}
          >
            <p>{!projectEdit ? "Edit" : "Submit"}</p>
          </button>
          <button className="ring-slate-400 ring-1 p-2 rounded-md px-4">
            <BsThreeDotsVertical />
          </button>
        </div>
      </div>

      <div className="p-2 flex flex-wrap lg:flex-nowrap w-full gap-5">
        <div className="flex flex-col gap-7 bg-slate-100  w-full rounded-md p-5 pr-24">
          <div>
            <h6 className="text-xs text-slate-7 00">Project name</h6>
            <input
              type="text"
              className={`!bg-slate-100  font-medium text-base  input input-sm ${
                projectEdit
                  ? "input-bordered border-solid"
                  : "!border-none pl-0"
              } my-1  `}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              disabled={!projectEdit}
            />
          </div>
          <div>
            <h6 className="text-xs text-slate-7 00">Project Type</h6>
            <input
              type="text"
              className={`!bg-slate-100  font-medium text-base  input input-sm ${
                projectEdit
                  ? "input-bordered border-solid"
                  : "!border-none pl-0"
              } my-1  `}
              value={projectDetails?.quotation_type?.name}
              disabled={true}
            />
          </div>
          <div>
            <h6 className="text-xs text-slate-7 00">Project Description</h6>
            <input
              type="text"
              className={`!bg-slate-100  font-medium text-base  input input-sm ${
                projectEdit
                  ? "input-bordered border-solid"
                  : "!border-none pl-0"
              } my-1  `}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!projectEdit}
            />
          </div>
          <div className="flex flex-wrap gap-3 justify-start">
            <div>
              <h6 className="text-xs text-slate-7 00">Start Date</h6>
              <input
                type="date"
                className={`!bg-slate-100  font-medium text-base  input input-sm ${
                  projectEdit
                    ? "input-bordered border-solid"
                    : "!border-none pl-0"
                } my-1  `}
                value={reverseDate(startDate)}
                onChange={(e) => setStartDate(reverseDate(e.target.value))}
                disabled={!projectEdit}
              />
            </div>
            <div>
              <h6 className="text-xs text-slate-7 00">Estimated end date</h6>
              <input
                type="date"
                className={`!bg-slate-100  font-medium text-base  input input-sm ${
                  projectEdit
                    ? "input-bordered border-solid"
                    : "!border-none pl-0"
                } my-1  `}
                value={reverseDate(endDate)}
                min={reverseDate(startDate)}
                onChange={(e) => setEndDate(reverseDate(e.target.value))}
                disabled={!projectEdit}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3 justify-start">
            <div>
              <h6 className="text-xs text-slate-7 00">Quotation Name</h6>
              <input
                type="text"
                className={`!bg-slate-100  font-medium text-base  input input-sm ${
                  projectEdit
                    ? "input-bordered border-solid"
                    : "!border-none pl-0"
                } my-1  `}
                value={projectDetails?.quotation.name}
                disabled={true}
              />
            </div>
            <div>
              <h6 className="text-xs text-slate-7 00">Quotation bo.</h6>
              <input
                type="text"
                className={`!bg-slate-100  font-medium text-base  input input-sm ${
                  projectEdit
                    ? "input-bordered border-solid"
                    : "!border-none pl-0"
                } my-1  `}
                value={projectDetails?.quotation?.quotation_number}
                disabled={true}
              />
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <h6 className="text-xs text-slate-7 00">Client</h6>
              <input
                type="text"
                className={`!bg-slate-100  font-medium text-base  input input-sm ${
                  projectEdit
                    ? "input-bordered border-solid"
                    : "!border-none pl-0"
                } my-1  `}
                value={projectDetails?.client?.name}
                disabled={true}
              />
            </div>
          </div>
        </div>
        {/* <div className="flex flex-col gap-7 divide-y-2 divide-slate-200 bg-slate-100 w-full max-w-md rounded-md p-5 ">
          <div className="flex justify-between items-center ">
            <h2 className="font-medium text-lg ">Recent Activity</h2>
            <BsThreeDotsVertical />
          </div>
          <div className="py-2 flex items-center gap-3">
            <img
              src={sampleUser}
              width={50}
              alt="user"
              className="rounded-full"
            />
            <div>
              <h2 className="font-medium">
                Phoenix Baker <span className="font-normal">Just Now</span>
              </h2>
              <p>Added a file to Marketing site redesign</p>
            </div>
          </div>
          <div className="py-2 flex items-center gap-3">
            <img
              src={sampleUser}
              width={50}
              alt="user"
              className="rounded-full"
            />
            <div>
              <h2 className="font-medium">
                Phoenix Baker <span className="font-normal">Just Now</span>
              </h2>
              <p>Added a file to Marketing site redesign</p>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
}
