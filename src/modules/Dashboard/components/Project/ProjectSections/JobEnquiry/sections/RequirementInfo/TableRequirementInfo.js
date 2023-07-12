import React, { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { CiEdit, CiViewList } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { checkAccessFn } from "../../../../../../../../utils/checkAccess";
import { BiShow } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";

export default function TableRequirementInfo({
  costsheet,
  setCostSheet,
  jobPosition,
  contractModalHandler,
}) {
  const dashboardData = useSelector((state) => state.dashboardData);
  const [RequirementInfoData,setRequirementInfoData] = useState()

  const  titles = [
    "Sl No.",
    "Category",
    "Quantity",
    "Description",
    "Basic",
    "Food",
    "Job Enquiry Quantity",
    "Salary",
    "",
  ]

  const updateDescription = (index, value) => {
    const updateDesc = [...costsheet]
    updateDesc[index].description = value;
    setCostSheet(updateDesc);
  }

  const updateCategory = (index, value) => {
    const updateCtgry = [...costsheet];
    updateCtgry[index].job_position.name = value;
    setCostSheet(updateCtgry);
   };
  
  const updateBasic = (index, value) => {
    const updatedBasic = [...costsheet];
    updatedBasic[index].description = value;
    setCostSheet(updatedBasic);
   };
  
  const updateFood = (index, value) => {
    const updatedFood = [...costsheet];
    updatedFood[index].description = value;
    setCostSheet(updatedFood);
  }
  
  const updateJobQuantity = (index, value) => {
    const updatedJobQuatity = [...costsheet];
    updatedJobQuatity[index].description = value;
    setCostSheet(updatedJobQuatity)
  }

  useEffect(() => {
   setRequirementInfoData(costsheet)
  }, costsheet)

  const DeleteHandler = (id,postion) => {
    if (costsheet.length > 1) {
      const remainingObj = costsheet.filter(
        (item) => item.id != id && postion != item.job_position.name
      );
      setCostSheet(remainingObj);
    }
  }
  
  console.log(RequirementInfoData, "RequirementInfoData");
   
  return (
    <>
      <div className="p-5 ">
        <div
          className={`grid justify-items-center items-center overflow-x-scroll  gap-5 p-6 bg-white  w-full min-w-full rounded-md `}
        >
          {titles.map((t, index) => (
            <p key={index} className="font-semibold uppercase">
              {t}
            </p>
          ))}
          {costsheet?.length <= 0 && (
            <div className="flex justify-center items-center gap-3 mt-5 w-full col-span-9">
              <p>Loading</p>
              <CgSpinner className="animate-spin" />
            </div>
          )}
          {costsheet?.map((l, index) => (
            <React.Fragment key={index}>
              <p>{Number(index) + 1}</p>
              <select
                defaultValue={costsheet[0]?.job_position?.name}
                name="category"
                className="p-2 rounded-lg border-slate-300 bg-white border hover:outline-none focus:outline-none"
                onChange={(e) => {
                  updateCategory(index, e.target.value);
                }}
              >
                {jobPosition?.map((item, index) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
              <p>{l.quantity}</p>
              <input
                className="input input-bordered input-sm"
                type="text"
                value={l.description}
                onChange={(e) => updateDescription(index, e.target.value)}
              />
              <input
                className="input input-sm input-bordered w-full "
                type="text"
                value={l.basic}
                onChange={(e) => updateBasic(index, e.target.value)}
              />
              <input
                className="input input-sm input-bordered w-full "
                type="text"
                value={l.food}
                onChange={(e) => updateFood(index, e.target.value)}
              />
              <input
                className="input input-sm input-bordered w-full "
                type="text"
                value={l.quantity}
                onChange={(e) => updateJobQuantity(index, e.target.value)}
              />

              <div className="w-40 text-center">
                <p>
                  {l.basic} + {l.food}
                </p>
              </div>

              <button
                onClick={() =>
                  DeleteHandler(l.id, l.job_position.name)
                }
                className="py-1 px-2 border rounded-lg border-slate-300 drop-shadow "
              >
                <MdDeleteOutline className="text-xl" color="bg-red-500" />
              </button>
              <hr className="border-[1.5px] border-slate-100  w-full col-span-9" />
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
 