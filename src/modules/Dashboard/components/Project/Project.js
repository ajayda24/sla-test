import React, { useEffect, useState } from "react";
import { axios } from "../../../../Global";
import Overview from "./ProjectSections/Overview";
import Contract from "./ProjectSections/Contract/Contract";
import JobEnquiry from "./ProjectSections/JobEnquiry/JobEnquiry";
import Vendors from "./ProjectSections/Vendors/Vendors";
import ListDataProject from "./ListDataProject";
import { useParams } from "react-router-dom";
import ProjectQuotationCostSheet from "./ProjectSections/ProjectQuotationCostSheet/ProjectQuotatationCostSheet";
import ProjectClient from "./ProjectSections/Client/Client";
import ProjectCompany from "./ProjectSections/Company/Company";
import ProjectNotes from "./ProjectSections/Notes/Notes";
import { setAppError } from "../../../../store/userSlice";
import { useDispatch } from "react-redux";
import { CgSpinner } from "react-icons/cg";

export default function Project() {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const [projectList, setProjectList] = useState([]);

  useEffect(() => {
    axios
      .get(`/dashboard/project`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data.data;
        setProjectList(data);
      })
      .catch((err) => {
        dispatch(
          setAppError({
            msg: err.message,
          })
        );
      });
  }, []);

  return (
    <div className="px-6 bg-slate-100 min-w-fit">
      {projectId && <ProjectView projectId={projectId} />}
      {!projectId && (
        <ListDataProject
          titles={[
            "Sl No.",
            "Project Id",
            "Project Name",
            "Type",
            "Client",
            "Quotation Name",
            "Quotation Id",
            "Status",
            "Action",
          ]}
          list={projectList}
        />
      )}
    </div>
  );
}

function ProjectView({ projectId }) {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const allSections = [
    "Overview",
    "Contract",
    "Vendors",
    "Job Enquiry",
    "Quotation Costsheet",
    "Client",
    "Company",
    "Notes",
    "More",
  ];
  const [currentSection, setCurrentSection] = useState("Overview");

  const [projectDetails, setProjectDetails] = useState({});

  const [loading, setLoading] = useState(true);

  // To rerender the component when the project is updated
  const [projectUpdated, setProjectUpdated] = useState(false);
  const toggleProjectUpdate = () => setProjectUpdated(!projectUpdated);

  useEffect(() => {
    axios
      .get(`/dashboard/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setLoading(false);
        const data = res.data.data;
        setProjectDetails(data);
      })
      .catch((err) => {
        setLoading(false);
        dispatch(
          setAppError({
            msg: err.message,
          })
        );
      });
  }, [projectUpdated]);

  return (
    <>
      <div className="w-full rounded-lg bg-slate-100 p-2 flex flex-wrap gap-2 px-6">
        {allSections.map((sect) => (
          <button
            className={` rounded-md p-2 px- ${
              currentSection === sect
                ? "bg-red text-white"
                : "bg-transparent text-black"
            } `}
            onClick={() => setCurrentSection(sect)}
          >
            {sect}
          </button>
        ))}
      </div>
      {loading && (
        <div className="flex justify-center items-center gap-3">
          <p>Loading</p>
          <CgSpinner className="animate-spin" />
        </div>
      )}
      {currentSection === "Overview" && !loading && (
        <Overview
          projectDetails={projectDetails?.project}
          toggleProjectUpdate={toggleProjectUpdate}
        />
      )}
      {currentSection === "Contract" && !loading && (
        <Contract projectContract={projectDetails?.project?.project_contract} />
      )}
      {currentSection === "Vendors" && !loading && (
        <Vendors projectId={projectId} />
      )}
      {currentSection === "Job Enquiry" && !loading && (
        <JobEnquiry projectDetails={projectDetails?.project} />
      )}
      {currentSection === "Quotation Costsheet" && (
        <ProjectQuotationCostSheet />
      )}
      {currentSection === "Client" && <ProjectClient />}
      {currentSection === "Company" && <ProjectCompany />}
      {currentSection === "Notes" && <ProjectNotes />}
    </>
  );
}
