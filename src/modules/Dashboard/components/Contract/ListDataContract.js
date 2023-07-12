import React from "react";
import { CgSpinner } from "react-icons/cg";
import { CiEdit, CiViewList } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { checkAccessFn } from "../../../../utils/checkAccess";
import { BiShow } from "react-icons/bi";

export default function ListDataContract({
  list = [],
  editData,
  deleteData,
  loading,
  titles = [],
  contractModalHandler,
}) {
  const dashboardData = useSelector((state) => state.dashboardData);

  const checkAccess = (module, name) => {
    return checkAccessFn(dashboardData, module, name);
  };
  return (
    <>
      <div className="p-5 ">
        <div
          className={`grid justify-items-center grid-cols-table-contract auto-cols-min gap-5 p-6 bg-white   items-baseline w-full min-w-fit  rounded-md `}
        >
          {titles.map((t, index) => (
            <p key={index} className="font-semibold uppercase">
              {t}
            </p>
          ))}
          {list.length <= 0 && (
            <div className="flex justify-center items-center gap-3 mt-5 w-full col-span-12">
              <p>Loading</p>
              <CgSpinner className="animate-spin" />
            </div>
          )}
          {list.map((l, index) => (
            <React.Fragment key={index}>
              <p>{Number(index) + 1}</p>
              <p>{l.contract_id} </p>

              <p>{l.quotation?.name}</p>

              <p>{l.client?.name} </p>
              <p>{l.status} </p>
              <p>{l.company?.name} </p>
              <p>{l.contract_status} </p>
              <p>{l.annexure_status} </p>
              <p>{l.coc_attestation} </p>
              <p>{l.start_date} </p>
              <p>{l.end_date} </p>
              <div className="flex gap-3 min-w-fit ">
                {/* {checkAccess("Contract", "company-edit") ? ( */}
                <Link to={`${l.id}`}>
                  <button className="p-1 px-2 rounded-md ring-1 ring-slate-600">
                    <BiShow size={"1.4rem"} />
                  </button>
                </Link>
              </div>

              <hr className="border-[1.5px] border-slate-100  w-full col-span-12" />
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
