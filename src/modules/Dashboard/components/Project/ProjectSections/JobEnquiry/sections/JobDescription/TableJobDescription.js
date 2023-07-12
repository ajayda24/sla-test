import React, { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { CiEdit, CiViewList } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAccessFn } from "../../../../../../../../utils/checkAccess";
import { BiShow } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { setAppError } from "../../../../../../../../store/userSlice";




export default function TableJobDescription({
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
  jobRequirements,
  updateJobRequirenments,
  setFormatedJobDescription
}) {

  const dispatch = useDispatch();
  const [jobDescriptions,setJobDescriptions] = useState(jobRequirements);
  const dashboardData = useSelector((state) => state.dashboardData);
  useEffect(()=>{
    setJobDescriptions(jobRequirements)
  },[jobRequirements])
  const checkAccess = (module, name) => {
    return checkAccessFn(dashboardData, module, name);
  };
  const handleDescriptionChange = (index, value) => {
    const updatedDescriptions = [...jobDescriptions];
    updatedDescriptions[index] = value;
    setJobDescriptions(updatedDescriptions);
    updateJobRequirenments(updatedDescriptions);
  };
  useEffect(()=>{
    const JOB_DESCRIPTIONS = jobDescriptions.map(description => ({ description }));
    setFormatedJobDescription(JOB_DESCRIPTIONS)
  },[jobDescriptions])
  const handleDelete = (index) => {
    if(jobDescriptions.length <= 1){
      return dispatch(
        setAppError({
          msg: 'Atleast one job description is needed'
        })
      )
    }
    const updatedJobDescriptions = [...jobDescriptions];
    updatedJobDescriptions.splice(index, 1);
    setJobDescriptions(updatedJobDescriptions);
    updateJobRequirenments(updatedJobDescriptions) //to update the jobdescriptions from parent component
  };
  

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
          {jobDescriptions.length <= 0 && (
            <div className="flex justify-center items-center gap-3 mt-5 w-full col-span-3">
              <p>Loading</p>
              <CgSpinner className="animate-spin" />
            </div>
          )}
         {jobDescriptions.map((desc, index) => (
      <React.Fragment key={index}>
        <p>{Number(index) + 1}</p>

        <input
          className="input input-sm input-bordered w-full "
          type="text"
          value={desc}
          onChange={(e) => handleDescriptionChange(index, e.target.value)}
        />

        <div className="flex gap-3 min-w-fit ">
          <button className="p-1 px-2 rounded-md ring-1 ring-slate-300"  onClick={() => handleDelete(index)}>
            <MdDeleteOutline size={"1.4rem"} />
          </button>
        </div>

        <hr className="border-[1.5px] border-slate-100  w-full col-span-3" />
      </React.Fragment>
        ))}
        </div>
      </div>
    </>
  );
}
