import { axios } from "../../../../../Global";
import React, { useState } from "react";
import { AiOutlineCloudDownload } from "react-icons/ai";
import { CgSpinner } from "react-icons/cg";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setAppError } from "../../../../../store/userSlice";
import { AiOutlineFilePdf } from "react-icons/ai";
import { SiMicrosoftexcel } from "react-icons/si";
import { Link } from "react-router-dom";
import { checkAccessFn } from "../../../../../utils/checkAccess";

export default function ListDataCostSheet({
  list = [],
  editData,
  deleteData,
  loading,
  titles = [],
  showCostSheetWindowHandler,
  quotationName,
}) {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [pdfDownloadLoading, setPdfDownloadLoading] = useState({
    state: false,
    btnId: "",
  });
  const [excelDownloadLoading, setExcelDownloadLoading] = useState({
    state: false,
    btnId: "",
  });

  const getPDF = async (id, jobPosition) => {
    try {
      setPdfDownloadLoading({ state: true, btnId: id });
      const response = await axios(`/dashboard/quotation-cost-sheet-pdf/${id}/single`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPdfDownloadLoading({ state: false });
      if (response.status === 200) {
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${quotationName} Quotation Cost Sheet for ${jobPosition}.pdf`);
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
      setPdfDownloadLoading({ state: false });

      dispatch(
        setAppError({
          msg: err.message,
        })
      );
    }
  };
  const getExcel = async (id, jobPosition) => {
    try {
      setExcelDownloadLoading({ state: true, btnId: id });
      const response = await axios(`/dashboard/quotation-cost-sheet-excel/${id}/single`, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExcelDownloadLoading({ state: false });
      if (response.status === 200) {
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${quotationName} Quotation Cost Sheet for ${jobPosition}.xlsx`);
        document.body.appendChild(link);
        link.click();
        dispatch(
          setAppError({
            msg: "Excel Downloaded",
            color: "success",
          })
        );
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (err) {
      setExcelDownloadLoading({ state: false });
      dispatch(
        setAppError({
          msg: err.message,
        })
      );
    }
  };

  const dashboardData = useSelector((state) => state.dashboardData);

  const checkAccess = (module, name) => {
    return checkAccessFn(dashboardData, module, name);
  };
  return (
    <div className="p-5">
      <div
        className={`grid justify-items-center grid-cols-table-5 auto-cols-min gap-5 p-6 bg-white w-full overflow-x-scroll lg:overflow-auto items-baseline max-w-lg sm:max-w-sm md:max-w-prose lg:max-w-none rounded-md `}
      >
        {titles.map((t, index) => (
          <p key={index} className="font-semibold uppercase">
            {t}
          </p>
        ))}
        {list.length <= 0 && (
          <div className="flex justify-center items-center gap-3 mt-5 w-full col-span-5">
            <p>Loading</p>
            <CgSpinner className="animate-spin" />
          </div>
        )}
        {list.map((data, index) => (
          <React.Fragment key={index}>
            <p>#{index + 1}</p>
            <p>{data.job_position.name}</p>

            <p>{data.nationality.name} </p>

            <p>{data.quantity}</p>

            <div className="flex gap-3 min-w-fit ">
              {/* <Link to="#edit"> */}

              {checkAccess("Quotation", "quotation-cost-sheet-edit") ? (
                <button
                  className="p-1 px-2 text-center rounded-md ring-1 ring-slate-600"
                  onClick={() => editData(data.id)}
                >
                  <CiEdit size={"1.4rem"} />
                </button>
              ) : (
                <button className="p-1 px-2 rounded-md ring-1 ring-slate-200">
                  <CiEdit size={"1.4rem"} color="gray" />
                </button>
              )}

              {/* </Link> */}
              {/* <button
                className="p-1 px-2 text-center rounded-md ring-1 ring-slate-600"
                onClick={() => getPDF(data.id, data.job_position.name)}
              >
                {pdfDownloadLoading.state &&
                pdfDownloadLoading.btnId === data.id ? (
                  <CgSpinner className="animate-spin mx-auto" />
                ) : (
                  <AiOutlineFilePdf size={"1.3rem"} />
                )}
              </button> */}
              {/* <button
                className="p-1 px-2 text-center rounded-md ring-1 ring-slate-600"
                onClick={() => getExcel(data.id, data.job_position.name)}
              >
                {excelDownloadLoading.state &&
                excelDownloadLoading.btnId === data.id ? (
                  <CgSpinner className="animate-spin mx-auto" />
                ) : (
                  <SiMicrosoftexcel size={"1.3rem"} />
                )}
              </button> */}

              {checkAccess("Quotation", "quotation-cost-sheet-delete") ? (
                <button
                  className="p-1 px-2 rounded-md ring-1 ring-red text-white text-center bg-red"
                  onClick={() => deleteData((oldState) => ({ open: true, id: data.id }))}
                  disabled={loading.delete}
                >
                  {loading.delete && loading.loadingId === data.id ? (
                    <CgSpinner className="animate-spin mx-auto" />
                  ) : (
                    <MdDeleteOutline size={"1.4rem"} />
                  )}
                </button>
              ) : (
                <button className="p-1 px-2 rounded-md ring-1 ring-slate-200">
                  <MdDeleteOutline size={"1.4rem"} color="gray" />
                </button>
              )}
            </div>
            {/* <hr className="border-[1.5px] border-slate-100  w-full col-span-6" /> */}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
