import React, { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { IoMdClose } from "react-icons/io";
import { TiInfoOutline, TiTick } from "react-icons/ti";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { axios } from "../../../../Global";
import { useDispatch } from "react-redux";
import { setAppError } from "../../../../store/userSlice";

export default function ProceedToProject({
  showPromptElement,
  setShowPromptElement,
  contractId,
}) {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [projectDetails, setProjectDetails] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    let startDate;
    let endDate;
    let endDateSplit;
    let startDateSplit;
    let Rearranged_start_date;
    let Rearranged_end_date;
    let Body;

    if (showPromptElement.projectType == "new") {
      if (e.target?.start_date?.value) {
        startDate = e.target?.start_date?.value;
        startDateSplit = startDate?.split("-");
        Rearranged_start_date = `${
          startDateSplit[2]
        }-${startDateSplit[1].padStart(2, "0")}-${startDateSplit[0]}`;
      }

      if (e.target?.end_date?.value) {
        endDate = e.target?.end_date?.value;
        endDateSplit = endDate?.split("-");
        Rearranged_end_date = `${endDateSplit[2]}-${endDateSplit[1].padStart(
          2,
          "0"
        )}-${endDateSplit[0]}`;
      }

      Body = {
        project_name: e.target.project_name.value,
        start_date: Rearranged_start_date ? Rearranged_start_date : "",
        end_date: Rearranged_end_date ? Rearranged_end_date : "",
        project_type: showPromptElement.projectType,
      };
    } else {
      Body = {
        project_id: e.target.project_id.value,
        project_type: showPromptElement.projectType,
      };
    }
    await axios
      .post(
        `https://sla.torcdeveloper.com/api/v1/dashboard/contract-to-project-conversion/${contractId}`,
        Body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          setShowPromptElement((p) => ({ ...p, open: false }));
          dispatch(
            setAppError({
              msg: `Added successfully`,
              color: "bg-green-500",
            })
          );
        } else {
          console.log(res);
        }
      })
      .catch((error) =>
        dispatch(
          setAppError({
            msg: error.message,
          })
        )
      );
  };

  useEffect(() => {
    axios
      .get("https://sla.torcdeveloper.com/api/v1/dashboard/project", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        if (res.status == 200) {
          setProjectDetails(res?.data?.data);
        }
      })
      .catch((error) => {
        setLoading(false);

        console.log(error);
      });
  }, []);

  return (
    <div
      className={`fixed z-50 top-0 left-0 min-w-full min-h-screen bg-black/50  justify-center items-center ${
        showPromptElement.open ? "flex" : "hidden"
      }`}
    >
      <div className="max-w-xl w-full h-auto min-h-[20rem]  rounded-md bg-white/95 flex  flex-col p-4 relative">
        {!loading ? (
          <>
            <div className="flex justify-between items-center w-full">
              <h1 className="text-xl font-semibold">Proceed to Project</h1>
              <h1
                className="text-md font-semibold cursor-pointer"
                onClick={() => {
                  setShowPromptElement((p) => ({ ...p, open: false }));
                }}
              >
                <IoMdClose />
              </h1>
            </div>
            {showPromptElement === "new" && (
              <h2 className="text-sm">
                Create a new project for your contract.
              </h2>
            )}
            {showPromptElement === "old" && (
              <h2 className="text-sm">Add to an existing project.</h2>
            )}
            <form onSubmit={onSubmitHandler}>
              <div className="w-full flex flex-col gap-3 my-5 p-5">
                {showPromptElement.projectType === "new" ? (
                  <>
                    <div className="flex flex-col w-full">
                      <label htmlFor="" className="px-1">
                        Project Name
                      </label>
                      <input
                        type="text"
                        name="project_name"
                        className="input input-sm  input-bordered "
                        placeholder="Enter project name"
                        required
                      />
                    </div>
                    <div className="flex flex-col w-full">
                      <label htmlFor="" className="px-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="start_date"
                        className="input input-sm  input-bordered "
                        placeholder="Enter project start date"
                      />
                    </div>
                    <div className="flex flex-col w-full">
                      <label htmlFor="" className="px-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="end_date"
                        className="input input-sm  input-bordered "
                        placeholder="Enter project end date"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <label htmlFor="" className="px-1">
                      Select Project
                    </label>
                    <select
                      name="project_id"
                      className="input input-sm pr-2 input-bordered "
                      required
                    >
                      <option value="" selected hidden>
                        Select a Project
                      </option>
                      {projectDetails?.map((item, index) => (
                        <option key={index} className="" value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>
              <div className="flex gap-3 min-w-fit m-5 justify-center">
                <button
                  className="p-2 w-full rounded-md ring-1 ring-slate-600"
                  onClick={() => {
                    setShowPromptElement((p) => ({ ...p, open: false }));
                  }}
                >
                  Cancel
                </button>
                <button
                  className="p-2 w-full rounded-md ring-1 ring-red text-white bg-red"
                  type="submit"
                >
                  {loading ? (
                    <CgSpinner className="animate-spin mx-auto" />
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex justify-center items-center gap-3 mt-5 w-full">
            <p>Loading</p>
            <CgSpinner className="animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
