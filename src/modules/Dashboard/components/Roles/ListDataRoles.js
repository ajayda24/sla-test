import React from "react";
import { getFlag, getFormattedDate } from "../../../../utils/functions";
import { CgSpinner } from "react-icons/cg";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";

export default function ListDataUser({ list = [], editData, deleteData, loading, titles = [] }) {
  return (
    <div className="p-5">
      <div
        className={`grid justify-items-center grid-cols-table-3 auto-cols-min gap-5 p-6 bg-white w-full overflow-x-scroll lg:overflow-auto items-baseline max-w-lg sm:max-w-sm md:max-w-prose lg:max-w-none rounded-md `}
      >
        {titles.map((t, index) => (
          <p key={index} className="font-semibold uppercase">
            {t}
          </p>
        ))}
        {list.length <= 0 && (
          <div className="flex justify-center items-center gap-3 mt-5 w-full col-span-3">
            <p>Loading</p>
            <CgSpinner className="animate-spin" />
          </div>
        )}
        {list.map((l, index) => (
          <React.Fragment key={index}>
            <p>{Number(index) + 1}</p>
            <p>{l.name}</p>

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
                onClick={() => deleteData((oldState) => ({ open: true, id: l.id }))}
                disabled={loading.delete}
              >
                {loading.delete && loading.loadingId === l.id ? (
                  <CgSpinner className="animate-spin mx-auto" />
                ) : (
                  <MdDeleteOutline size={"1.4rem"} />
                )}
              </button>
            </div>
            <hr className={`border-[1.5px] border-slate-100  w-full col-span-3 `} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
