import React from "react";
import { CgSpinner } from "react-icons/cg";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import { checkAccessFn } from "../../../../utils/checkAccess";

export default function ListDataCompany({ list = [], editData, deleteData, loading, titles = [] }) {
  const dashboardData = useSelector((state) => state.dashboardData);

  const checkAccess = (module, name) => {
    return checkAccessFn(dashboardData, module, name);
  };

  return (
    <div className="p-5">
      <div
        className={`grid justify-items-center grid-cols-table-company auto-cols-min gap-5 p-6 bg-white w-full overflow-x-scroll lg:overflow-auto items-baseline max-w-lg sm:max-w-sm md:max-w-prose lg:max-w-none rounded-md `}
      >
        {titles.map((t, index) => (
          <p key={index} className="font-semibold uppercase">
            {t}
          </p>
        ))}
        {list.length <= 0 && (
          <div className="flex justify-center items-center gap-3 mt-5 w-full col-span-6">
            <p>Loading</p>
            <CgSpinner className="animate-spin" />
          </div>
        )}
        {list.map((l, index) => (
          <React.Fragment key={index}>
            <p>{Number(index) + 1}</p>
            <p>{l.company_id}</p>
            <img src={l.logo} alt="Logo" width={50} className="self-center" />
            <div>
              <p>{l.name}</p>
              <p>{l.email}</p>
            </div>
            <p>{l.mobile}</p>

            <div className="flex gap-3 min-w-fit ">
              {checkAccess("Company", "company-edit") ? (
                <button
                  className="p-1 px-2 rounded-md ring-1 ring-slate-600"
                  onClick={() => editData(l.id)}
                  disabled={loading.edit}
                >
                  {loading.edit && loading.loadingId === l.id ? (
                    <CgSpinner className="animate-spin mx-auto" />
                  ) : (
                    <CiEdit size={"1.4rem"} />
                  )}
                </button>
              ) : (
                <p className="p-1 px-2 rounded-md ring-1 ring-slate-300">
                  <CiEdit size={"1.4rem"} color="gray" />
                </p>
              )}

              {checkAccess("Company", "company-delete") ? (
                <button
                  className="p-1 px-2 rounded-md ring-1 ring-red text-white bg-red"
                  onClick={() => deleteData((oldState) => ({ open: true, id: l.id }))}
                  disabled={loading.delete}
                >
                  {loading.delete && loading.loadingId === l.id ? (
                    <CgSpinner className="animate-spin mx-auto" />
                  ) : (
                    <MdDeleteOutline size={"1.4rem"} />
                  )}
                </button>
              ) : (
                <p className="p-1 px-2 rounded-md ring-1 ring-slate-300">
                  <MdDeleteOutline size={"1.4rem"} color="gray" />
                </p>
              )}
            </div>
            <hr className={`border-[1.5px] border-slate-100  w-full col-span-6 `} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
