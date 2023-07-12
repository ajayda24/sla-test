import React from "react";
import { getFormattedDate } from "../../../../utils/functions";
import { CgSpinner } from "react-icons/cg";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function ListDataRateCategory({
  list = [],
  editData,
  showCategoryItems,
  deleteData,
  loading,
  column = 5,
  titles = [],
}) {
  return (
    <div className="p-5">
      <div
        className={`grid justify-items-center grid-cols-table-4  auto-cols-min gap-5 p-6 bg-white w-full overflow-x-scroll lg:overflow-auto items-baseline max-w-lg sm:max-w-sm md:max-w-prose lg:max-w-none rounded-md `}
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
            <p>{l.name}</p>

            <p>{String(l.short_description).split("/").join(" / ")}</p>

            <Link to={`${l.id}`}>
              <button
                className="p-1 w-20 rounded-md ring-1 ring-slate-600"
                onClick={() => showCategoryItems(l.id)}
                disabled={loading.edit}
              >
                View
              </button>
            </Link>
            {/* <div className="flex gap-3 min-w-fit ">
              <button
                className="p-1 w-20 rounded-md ring-1 ring-slate-600"
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
                className="p-1 w-20 rounded-md ring-1 ring-red text-white bg-red"
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
            </div> */}
            <hr
              className={`border-[1.5px] border-slate-100  w-full ${
                column === 5 ? "col-span-5" : column === 4 ? "col-span-4" : "col-span-6"
              } `}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
