import React, { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { CiEdit, CiViewList } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import {  useSelector } from "react-redux";
import { checkAccessFn } from "../../../../../../../../utils/checkAccess";
import { BiShow } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { setAppError } from "../../../../../../../../store/userSlice";

export default function TableModeOfRequirement({
  tableModeOfRequirementData,
  setTableModeOfRequirementData,
  list = [
    { contratcNo: "123456", companyName: "Lorem25", status: "Yes" },
    { contratcNo: "123456", companyName: "lorem", status: "No" },
    { contratcNo: "123456", companyName: "lorem", status: "Yes" },
  ],
  editData,
  deleteData,
  loading,
  titles = ["Sl No.", "Description", "Action"],
  contractModalHandler,
}) {
  const dashboardData = useSelector((state) => state.dashboardData);
  const dispatch = useDispatch()
  
  const DescriptionHandler = (index,value) => {
    const  updatedDescriptions = [...tableModeOfRequirementData];
    updatedDescriptions[index].description = value
    setTableModeOfRequirementData(updatedDescriptions)
  }

  const DeleteHandler = (index,value) => {
    if (tableModeOfRequirementData.length > 1) {
      const updatedDescriptions = tableModeOfRequirementData.filter(
        (item) => item.description != value && item.index != index
      );
      setTableModeOfRequirementData(updatedDescriptions);
    } else {
     dispatch(
       setAppError({
         msg: "You are unable to delete the row as the table must contain at  least one row ",
       })
     );
             
    }
  }

  
  
  return (
    <>
      <div className="p-5 ">
        <div
          className={`grid justify-items-center items-center grid-cols-table-3 auto-cols-min gap-5 p-6 bg-white  w-full min-w-fit  rounded-md `}
        >
          {titles.map((t, index) => (
            <p key={index} className="font-semibold uppercase">
              {t}
            </p>
          ))}
          {list.length <= 0 && (
            <div className="flex justify-center items-center gap-3 mt-5 w-full col-span-3">
              <p>Loading</p>
              <CgSpinner className="animate-spin" />
            </div>
          )}

          {tableModeOfRequirementData?.map((l, index) => (
            <React.Fragment key={index}>
              <p>{Number(index) + 1}</p>

              <input
                className="input input-sm input-bordered w-full "
                type="text"
                onChange={(e) => DescriptionHandler(index, e.target.value)}
                value={l.description}
              />

              {tableModeOfRequirementData.length > 1 &&(
                  <div className="flex gap-3 min-w-fit ">
                    <button
                      onClick={() => DeleteHandler(index, l.description)}
                      className="p-1 px-2 rounded-md ring-1 ring-slate-300"
                    >
                      <MdDeleteOutline size={"1.4rem"} />
                    </button>
                  </div>
                )}

              <hr className="border-[1.5px] border-slate-100  w-full col-span-3" />
            </React.Fragment>
          ))}
          
        </div>
      </div>
    </>
  );
}
