import React, { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { CiEdit, CiViewList } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAccessFn } from "../../../../../../utils/checkAccess";
import { BiDotsVerticalRounded, BiShow } from "react-icons/bi";
import { setAppError } from "../../../../../../store/userSlice";
import { axios } from "../../../../../../Global";

export default function ListDataProjectContract({
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
}) {
  const { projectId } = useParams();
  console.log("pid", projectId);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const [contractList, setContractList] = useState([]);
  const dashboardData = useSelector((state) => state.dashboardData);

  useEffect(() => {
    getProjectContract();
  }, []);

  const getProjectContract = async () => {
    try {
      const { data } = await axios.get(`/dashboard/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let projectContract = data?.data?.project?.project_contract;
      setContractList(projectContract);
    } catch (error) {
      console.log(error);
    }
  };

  const checkAccess = (module, name) => {
    return checkAccessFn(dashboardData, module, name);
  };

  const downloadFile = async (type, contractId) => {
    try {
      const response = await axios.get(
        `/dashboard/contract-file-download/${type}/${contractId}`,
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
        link.setAttribute("download", `${type} PDF`);
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
      dispatch(
        setAppError({
          msg: err.message,
        })
      );
    }
  };

  return (
    <>
      <div className="p-5 ">
        <div
          className={`grid justify-items-center grid-cols-table-6 auto-cols-min gap-5 p-6 bg-white   items-baseline w-full min-w-fit  rounded-md `}
        >
          {titles.map((t, index) => (
            <p key={index} className="font-semibold uppercase">
              {t}
            </p>
          ))}
          {contractList.length <= 0 && (
            <div className="flex justify-center items-center gap-3 mt-5 w-full col-span-6">
              <p>Loading</p>
              <CgSpinner className="animate-spin" />
            </div>
          )}
          {contractList.map((contract, index) => (
            <React.Fragment key={index}>
              <p>{Number(index) + 1}</p>
              <p>{contract?.contract?.contract_id} </p>
              <p>{contract?.contract?.name}</p>

              <p
                className={` px-3 ring-2 rounded-full ${
                  contract?.contract?.status === "Active"
                    ? "ring-success text-success"
                    : contract?.contract?.status === "Regected"
                    ? "ring-error text-error"
                    : contract?.contract?.status === "Pending"
                    ? "ring-info text-info"
                    : "ring-blue text-blue"
                }`}
              >
                {contract?.contract?.status}{" "}
              </p>
              <p>{contract?.contract?.company?.name}</p>

              <div className="relative">
                <button className="rounded-md bg-white p-2 text-sm text-black peer ">
                  <BiDotsVerticalRounded size={"1.4rem"} />
                </button>
                <div className="hidden absolute bottom-0 right-7 max-w-xs w-[17rem] h-auto bg-white shadow-xl rounded-lg p-2 dark:bg-dark2 ring-1 ring-slate-400 dark:ring-black peer-hover:block hover:block">
                  <Link to={`/dashboard/contract/${contract?.contract?.id}`}>
                    <button className="w-full">
                      <p className="bg-white shadow-sm  p-2 w-full mb-1 hover:bg-red rounded-md hover:text-white dark:bg-dark2 dark:hover:bg-red flex items-center gap-3">
                        View
                      </p>
                    </button>
                  </Link>
                  <button
                    onClick={() =>
                      downloadFile("contract", contract?.contract?.id)
                    }
                    className="w-full"
                  >
                    <p className="bg-white shadow-sm  p-2 w-full mb-1 hover:bg-red rounded-md hover:text-white dark:bg-dark2 dark:hover:bg-red flex items-center gap-3">
                      Download Contract
                    </p>
                  </button>
                  <button
                    onClick={() =>
                      downloadFile("annexure", contract?.contract?.id)
                    }
                    className="w-full"
                  >
                    <p className="bg-white p-2 w-full hover:bg-red rounded-md hover:text-white dark:bg-dark2 dark:hover:bg-red flex items-center gap-3">
                      Download Annexure
                    </p>
                  </button>
                </div>
              </div>

              <hr className="border-[1.5px] border-slate-100  w-full col-span-6" />
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
