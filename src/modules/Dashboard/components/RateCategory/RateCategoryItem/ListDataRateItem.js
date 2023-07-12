import React from "react";
import { CgSpinner } from "react-icons/cg";
import { useSelector } from "react-redux";
import { CiEdit } from "react-icons/ci";

export default function ListDataRateCategoryItems({
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
        className={`grid justify-items-center grid-cols-table-5  auto-cols-min gap-5 p-6 bg-white w-full overflow-x-scroll lg:overflow-auto items-baseline max-w-lg sm:max-w-sm md:max-w-prose lg:max-w-none rounded-md `}
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
        {list.map((l, index) => (
          <React.Fragment key={index}>
            <p>{Number(index) + 1}</p>
            <p>{l.name}</p>

            <p>{l.onetime_cost}</p>
            <p>{l.monthly_cost}</p>

            <button
              className="p-1 px-2 rounded-md ring-1 ring-slate-600"
              onClick={() => editData(l.id)}
              disabled={loading.edit}
            >
              <CiEdit size={"1.4rem"} />
            </button>

            <hr
              className={`border-[1.5px] border-slate-100  w-full ${
                column === 5
                  ? "col-span-5"
                  : column === 4
                  ? "col-span-4"
                  : "col-span-6"
              } `}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
