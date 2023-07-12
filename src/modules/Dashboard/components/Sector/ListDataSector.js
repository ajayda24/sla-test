import React from "react";
import { getFlag, getFormattedDate } from "../../../../utils/functions";
import { CgSpinner } from "react-icons/cg";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import { checkAccessFn } from "../../../../utils/checkAccess";

export default function ListDataSector({
  list = [],
  editData,
  deleteData,
  loading,
  titles = [],
}) {
  const dashboardData = useSelector((state) => state.dashboardData);
  const checkAccess = (module, name) => {
    return checkAccessFn(dashboardData, module, name);
  };
  return (
    <div className="p-5">
      <div
        className={`grid justify-items-center grid-cols-table-4 auto-cols-min gap-5 p-6 bg-white w-full overflow-x-scroll lg:overflow-auto items-baseline max-w-lg sm:max-w-sm md:max-w-prose lg:max-w-none rounded-md `}
      >
        {titles.map((t, index) => (
          <p key={index} className="font-semibold uppercase">
            {t}
          </p>
        ))}
        {list.length <= 0 && (
          <div className="flex justify-center items-center gap-3 mt-5 w-full col-span-4">
            <p>Loading</p>
            <CgSpinner className="animate-spin" />
          </div>
        )}
        {list.map((l, index) => (
          <React.Fragment key={index}>
            <p>{Number(index) + 1}</p>
            <div className="flex items-center gap-2">
              {/* <img
                  src="https://slgportal2023.s3.eu-north-1.amazonaws.com/sla/user/profile_image/amalrag-modifieduserProfileeoxu.png"
                  alt="User logo"
                  className="w-7 h-7 rounded-full"
                /> */}
              <div>
                <p>{l.name}</p>
              </div>
            </div>
            <p>{l.description}</p>

            <div className="flex gap-3 min-w-fit ">
              {checkAccess("Client", "client-edit") ? (
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
                <button className="p-1 px-2 rounded-md ring-1 ring-slate-200">
                  <CiEdit size={"1.4rem"} color="gray" />
                </button>
              )}

              {checkAccess("Client", "client-delete") ? (
                <button
                  className="p-1 px-2 rounded-md ring-1 ring-red text-white bg-red"
                  onClick={() =>
                    deleteData((oldState) => ({ open: true, id: l.id }))
                  }
                  disabled={loading.delete}
                >
                  {loading.delete && loading.loadingId === l.id ? (
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
            <hr
              className={`border-[1.5px] border-slate-100  w-full col-span-4 `}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
