import React, { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { CiEdit, CiViewList } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAccessFn } from "../../../../../../utils/checkAccess";
import { BiDotsVerticalRounded, BiShow } from "react-icons/bi";
import { axios } from "../../../../../../Global";
import { setAppError } from "../../../../../../store/userSlice";
import PromptElement from "../../../../PromptElement";

export default function ListDataProjectJobEnquiry({
  list = [
    { contratcNo: "123456", companyName: "lorem", status: "Draft" },
    { contratcNo: "123456", companyName: "lorem", status: "Pending" },
    { contratcNo: "123456", companyName: "lorem", status: "Draft" },
    { contratcNo: "123456", companyName: "lorem", status: "Pending" },
    { contratcNo: "123456", companyName: "lorem", status: "Approved" },
    { contratcNo: "123456", companyName: "lorem", status: "Regected" },
    { contratcNo: "123456", companyName: "lorem", status: "Draft" },
  ],
  editData,
  deleteData,
  loading,
  titles,
  contractModalHandler,
  vendors,
  filterStatus,
  country,
  searchKeyword,
  jobEnquiries,
}) {
  const { projectId } = useParams();
  const dashboardData = useSelector((state) => state.dashboardData);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [showPromptElement, setShowPromptElement] = useState({
    open: false,
    id: null,
  });
  const checkAccess = (module, name) => {
    return checkAccessFn(dashboardData, module, name);
  };

  const handleDelete = async (vendorId) => {
    try {
      let result = await axios.delete(`/dashboard/project-vendor/${vendorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(
        setAppError({
          msg: "Vendor deleted success",
          color: "success",
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const [jobEnquiryListIsEmpty, setJobEnquiryListIsEmpty] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      if (jobEnquiries.length <= 0) {
        setJobEnquiryListIsEmpty(true);
      } else {
        setJobEnquiryListIsEmpty(false);
      }
    }, 2500);
  }, [jobEnquiries]);

  const downloadFile = async (jobEnquiryId) => {
    console.log(jobEnquiryId);
    try {
      const response = await axios.get(
        `/dashboard/project-job-enquiry-pdf/${jobEnquiryId}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Job Enquiry - ${jobEnquiryId} PDF`);
        document.body.appendChild(link);
        link.click();
        dispatch(
          setAppError({
            msg: "PDF Downloaded",
            color: "success",
          })
        );
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (err) {
      console.log(err);
      dispatch(
        setAppError({
          msg: err.message,
        })
      );
    }
  };

  return (
    <>
      {showPromptElement?.open && (
        <PromptElement
          showPromptElement={showPromptElement}
          setShowPromptElement={setShowPromptElement}
          deleteHandler={handleDelete}
        />
      )}
      <div className="p-5 ">
        <div
          className={`grid justify-items-center grid-cols-table-4 auto-cols-min gap-5 p-6 bg-white   items-baseline w-full min-w-fit  rounded-md `}
        >
          {titles.map((t, index) => (
            <p key={index} className="font-semibold uppercase">
              {t}
            </p>
          ))}
          {jobEnquiries.length <= 0 && (
            <div className="flex justify-center items-center gap-3 mt-5 w-full col-span-4">
              {!jobEnquiryListIsEmpty ? (
                <>
                  <p>Loading</p>
                  <CgSpinner className="animate-spin" />
                </>
              ) : (
                <>
                  <p>No Job Enquiry is added.</p>
                </>
              )}
            </div>
          )}
          {jobEnquiries.map((l, index) => {
            return (
              <React.Fragment key={index}>
                <p>{Number(index) + 1}</p>
                <p>{l.name}</p>
                <p>{!l.description ? "-" : l.description}</p>

                <div className="relative">
                  <button className="rounded-md bg-white p-2 text-sm text-black peer ">
                    <BiDotsVerticalRounded size={"1.4rem"} />
                  </button>
                  <div className="hidden absolute bottom-0 right-7 max-w-xs w-[17rem] h-auto bg-white shadow-xl rounded-lg p-2 dark:bg-dark2 ring-1 ring-slate-400 dark:ring-black peer-hover:block hover:block">
                    {/* <button onClick={""} className="w-full">
                      <p className="bg-white shadow-sm  p-2 w-full mb-1 hover:bg-red rounded-md hover:text-white dark:bg-dark2 dark:hover:bg-red flex items-center gap-3">
                        View
                      </p>
                    </button>
                    <button onClick={""} className="w-full">
                      <p className="bg-white p-2 w-full hover:bg-red rounded-md hover:text-white dark:bg-dark2 dark:hover:bg-red flex items-center gap-3">
                        Delete
                      </p>
                    </button> */}
                    <button
                      onClick={() => downloadFile(l.id)}
                      className="w-full"
                    >
                      <p className="bg-white p-2 w-full hover:bg-red rounded-md hover:text-white dark:bg-dark2 dark:hover:bg-red flex items-center gap-3">
                        Download
                      </p>
                    </button>
                  </div>
                </div>

                <hr className="border-[1.5px] border-slate-100  w-full col-span-4" />
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </>
  );
}
