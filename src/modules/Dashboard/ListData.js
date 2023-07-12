import React from "react";
import { getFlag, getFormattedDate } from "../../utils/functions";
import { CgSpinner } from "react-icons/cg";
import { useSelector } from "react-redux";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";

export default function ListData({
  list = [],
  editData,
  deleteData,
  loading,
  column = 5,
  titles = [],
  tags = [],
}) {
  const { dashboardPage } = useSelector((state) => state.user);
  return (
    <div className="p-5">
      <div
        className={`grid justify-items-center ${
          column === 5 ? "grid-cols-table-5" : "grid-cols-table-6"
        } auto-cols-min gap-5 p-6 bg-white w-full overflow-x-scroll lg:overflow-auto items-baseline max-w-lg sm:max-w-sm md:max-w-prose lg:max-w-none rounded-md `}
      >
        {titles.map((t, index) => (
          <p key={index} className="font-semibold uppercase">
            {t}
          </p>
        ))}
        {list.map((l, index) => (
          <React.Fragment key={index}>
            <p>{Number(index) + 1}</p>
            {dashboardPage === "Client" ? (
              <div className="flex items-center gap-2">
                {/* <img
                  src="https://slgportal2023.s3.eu-north-1.amazonaws.com/sla/user/profile_image/amalrag-modifieduserProfileeoxu.png"
                  alt="User logo"
                  className="w-7 h-7 rounded-full"
                /> */}
                <div>
                  <p>{l.name}</p>
                  <p className="text-slate-600">{l.email}</p>
                </div>
              </div>
            ) : dashboardPage === "Nationality" ? (
              <img
                src={getFlag(l.country_code)}
                alt="Flag"
                width={50}
                className="self-center"
              />
            ) : (
              dashboardPage === "Rate Category" && <p></p>
            )}
            <p>{dashboardPage === "Client" ? l.mobile : l.name}</p>

            <p>
              {dashboardPage === "Client"
                ? getFormattedDate(l.created_at)
                : l.country_code}
            </p>

            {dashboardPage === "Nationality" && <p>{l.mobile_code}</p>}

            <div className="flex gap-3 min-w-fit ">
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
              <button
                className="p-1 px-2 rounded-md ring-1 ring-red text-white bg-red"
                onClick={() => deleteData(l.id)}
                disabled={loading.delete}
              >
                {loading.delete && loading.loadingId === l.id ? (
                  <CgSpinner className="animate-spin mx-auto" />
                ) : (
                  <MdDeleteOutline size={"1.4rem"} />
                )}
              </button>
            </div>
            <hr
              className={`border-[1.5px] border-slate-100  w-full ${
                column === 5 ? "col-span-5" : "col-span-6"
              } `}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
