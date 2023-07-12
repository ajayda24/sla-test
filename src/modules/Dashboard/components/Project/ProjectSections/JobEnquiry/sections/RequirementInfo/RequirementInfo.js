import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import TableRequirementInfo from "./TableRequirementInfo";

import {
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiArrowUpSLine,
} from "react-icons/ri";
import { axios } from "../../../../../../../../Global";

export default function RequirementInfo() {
  const token = localStorage.getItem("token")
   const { projectId } = useParams();
  const [show, setShow] = useState(false);
  const [jobEnquiryDetails, setJobEnquiryDetails] = useState([])
  const [costsheet, setCostSheet] = useState([])
  const [jobPosition,setJobposition] =useState([])
  const [addAnotherRow,setAddAnotherRow] = useState(false)

  const fetchJobEnquiry = async () => {
    try {
     const response = await axios.get(
      `https://sla.torcdeveloper.com/api/v1/dashboard/project-job-enquiry-input-value/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
     })
      const data = response?.data?.data
      setJobEnquiryDetails(data)
      setCostSheet(data.cost_sheet);
      setJobposition(data.job_position);
    } catch(error) {
      console.log(error)
   }
  }
  
  useEffect(() => {
    fetchJobEnquiry()
  }, [])
  
  const addHandler = () => {
    
   
  }





  return (
    <div className=" w-full flex flex-wrap gap-4 ">
      <div className="max-w-sm w-full flex gap-3 items-center h-fit">
        <button
          className="p-1 rounded-md ring-1 ring-slate-200"
          onClick={() => setShow((p) => !p)}
        >
          {show ? (
            <RiArrowDownSLine size={"1.4rem"} />
          ) : (
            <RiArrowRightSLine size={"1.4rem"} />
          )}
        </button>
        <div>
          <h2 className="font-semibold">Requirement Info</h2>
          <p>Lorem ipsum dolor sit amet.</p>
        </div>
      </div>
      <div
        className={`w-full  px-4 overflow-hidden ml-auto rounded-md transition-all  ${
          show
            ? "h-auto py-4 ring-1 ring-slate-200 "
            : "h-0 overflow-hidden"
        }`}
      >
        <button
          onClick={() => {
            const newCostSheet = {
              id: Math.random(),
              quantity: "3",
              description: null,
              basic: "153",
              food: "190",
              job_position_id: 1,
              job_position: {
                id: 1,
                name: "ELECTRICIAN",
                short_description: "Senior",
              },
            };
              
       const currentCostSheet = [...costsheet];
       currentCostSheet.push(newCostSheet);
       setCostSheet(currentCostSheet);
     
          }}
          className="bg-red text-white p-2 rounded-md mt-2 ml-2"
        >
          + Add Another
        </button>
        <TableRequirementInfo
          costsheet={costsheet}
          setCostSheet={setCostSheet}
          jobPosition={jobPosition}
        />
      </div>
    </div>
  );
}
