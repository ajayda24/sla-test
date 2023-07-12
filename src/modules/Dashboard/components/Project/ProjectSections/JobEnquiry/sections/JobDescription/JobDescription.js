import {
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiArrowUpSLine,
} from "react-icons/ri";
import TableJobDescription from "./TableJobDescription";
import { useState } from "react";

export default function JobDescription() {
  const [show, setShow] = useState(false);
  const [formatedJobDescription,setFormatedJobDescription] = useState([]);
  const [jobRequirements, setJobRequirnments] = useState([
    "Furniture Carpenter - Wood/ Chair/ Bed/ Paneling and Ceiling. Basic knowledge and experience are also ok.",
    "Gypsum Worker - Tapping/ Joining etc.",
    "Wall Painter – Wall Painting",
    "Candidates should have 02-04 years of experience in the respective field.",
    "Candidates should be physically fit & strong.",
    "Candidates will be fully responsible for his nature of work.",
    "Candidate’s age should be less than 35 years.",
    "Candidates should complete all the task assigned by the Supervisor/ Company.",
    "Candidates can be made to work anywhere in the Kingdom as per company Requirement.",
  ]);

  const updateJobRequirenments = (jr) => {
    setJobRequirnments(jr);
  };
  return (
    <div className="flex flex-wrap gap-4 ">
      <div className="max-w-sm min-w-max w-full flex gap-3 items-center h-fit">
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
          <h2 className="font-semibold">Job Description</h2>
          <p>Lorem ipsum dolor sit amet.</p>
        </div>
      </div>
      <div
        className={`w-full min-w-fit px-4 rounded-md transition-all  ${
          show ? "h-auto py-4 ring-1 ring-slate-200 " : "h-0 overflow-hidden"
        }`}
      >
        <button
          className="bg-red text-white p-2 rounded-md mt-2 ml-2"
          onClick={() => {
            setJobRequirnments((prev) => [...prev, ""]);
          }}
        >
          + Add Another
        </button>
        <TableJobDescription
          jobRequirements={jobRequirements}
          updateJobRequirenments={updateJobRequirenments}
          setFormatedJobDescription={setFormatedJobDescription}
        />
      </div>
    </div>
  );
}
