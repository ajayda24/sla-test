import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import BasicInfo from "./sections/BasicInfo/BasicInfo";
import RequirementInfo from "./sections/RequirementInfo/RequirementInfo";
import JobDescription from "./sections/JobDescription/JobDescription";
import ModeOfRequirement from "./sections/ModeOfRequirement/ModeOfRequirement";
import Terms from "./sections/Terms/Terms";
import Notes from "./sections/Notes/Notes";
import ListDataProjectJobEnquiry from "./ListDataProjectJobEnquiry";
import { setAppError } from "../../../../../../store/userSlice";
import { useDispatch } from "react-redux";
import { axios } from "../../../../../../Global";
import { useParams } from "react-router-dom";


export default function JobEnquiry({ projectDetails }) {
  const [jobEnquiryDetails, setJobEnquiryDetails] = useState(false);
  const [jobEnquiries,setJobEnquiries] = useState([]);

  const { projectId } = useParams();
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const getProjectVendors = async () => {
    try {
      const { data } = await axios.get(`/dashboard/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobEnquiries(data?.data?.project?.project_job_enquiry);
    } catch (error) {
      dispatch(
        setAppError({
          msg: error.message,
        })
      );
    }
  };
  useEffect(() => {
    getProjectVendors();
  }, []);


  return (
    <>
      {!jobEnquiryDetails ? (
        <div className="w-full flex flex-wrap gap-4 justify-between items-center p-5 ">
          <div className="flex gap-16">
            <h1 className="font-semibold text-xl">Job Enquiry</h1>
          </div>
          <div className="flex justify-between flex-wrap  w-full items-center gap-3 p-3 bg-slate-100 rounded-lg">
            <div className="min-w-fit">
              <button
                className="  p-2 px-4 rounded-md bg-red text-white"
                onClick={() => setJobEnquiryDetails(true)}
              >
                + Add New
              </button>
            </div>
          </div>
          <ListDataProjectJobEnquiry
            titles={["Sl No.", "Job Enquiry Name", "Description", ""]}
            jobEnquiries={jobEnquiries}
          />
        </div>
      ) : (
        <JobEnquiryView />
      )}
    </>
  );
}

const JobEnquiryView = () => {
  return (
    <>
      <div className="w-full flex flex-wrap gap-4 justify-between items-center p-5 ">
        <div className="flex gap-16">
          <h1 className="font-semibold text-xl">Job Enquiry Creation</h1>
        </div>
      </div>
      <div className="max-w-fit  w-full flex flex-col gap-7">
        <BasicInfo />
        <RequirementInfo />
        <JobDescription />
        <ModeOfRequirement />
        <Terms />
        <Notes />
      </div>
      <div className="w-full p-4 mt-6 flex justify-end gap-4">
        <button className="p-2 px-6 ring-1 ring-slate-200 rounded-md">
          Cancel
        </button>
        <button className="p-2 px-6 ring-1 ring-slate-200 rounded-md bg-red text-white">
          Submit
        </button>
      </div>
    </>
  );
};
