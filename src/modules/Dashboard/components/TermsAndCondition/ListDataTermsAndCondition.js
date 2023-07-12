import React, { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { CiEdit } from "react-icons/ci";
import {
  MdDeleteOutline,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { sliceWords } from "../../../../utils/functions";
import { useSelector } from "react-redux";
import { checkAccessFn } from "../../../../utils/checkAccess";

export default function ListDataTermsAndCondition({
  list = [],
  editData,
  deleteData,
  loading,
  titles = [],
  component,
}) {
  const dashboardData = useSelector((state) => state.dashboardData);

  const checkAccess = (module, name) => {
    return checkAccessFn(dashboardData, module, name);
  };
  const [totalPages, setTotalPages] = useState(0);
  const [searching, setSearching] = useState(false);
  const paginationObject = {
    current: 1,
    count: 3,
    end() {
      return this.count * this.current;
    },
    start() {
      return this.end() - this.count;
    },
  };
  const [currentList, setCurrentList] = useState([]);
  const [pagination, setPagination] = useState(paginationObject);
  const searchHandler = (value) => {
    if (value.length > 0) {
      setSearching(true);
      const searchResults = list.filter((e) => String(e.particulars).toLowerCase().includes(value));
      setCurrentList(searchResults);
    } else {
      setSearching(false);
      console.log("get here", pagination.start(), pagination.end());
      setCurrentList([]);
      for (let i = pagination.start(); i < pagination.end(); i++) {
        if (i >= list.length) {
          break;
        }
        setCurrentList((p) => [...p, list[i]]);
      }
    }
  };
  useEffect(() => {
    if (list.length > 0) {
      setTotalPages(Math.ceil(list.length / pagination.count));
      for (let i = pagination.start(); i < pagination.end(); i++) {
        if (i >= list.length) {
          break;
        }
        setCurrentList((p) => [...p, list[i]]);
      }
    }
    return () => {
      setCurrentList([]);
    };
  }, [list, pagination.current]);
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
        {currentList.length <= 0 && list.length > 0 && (
          <div className="flex justify-center items-center gap-3 mt-5 w-full col-span-4">
            <p>No Data Found </p>
          </div>
        )}

        {currentList.map((l, index) => (
          <React.Fragment key={index}>
            <p>{searching ? index + 1 : pagination.start() + index + 1}</p>

            <p>{l.particulars}</p>
            <p>{component === "quotation-terms" ? sliceWords(l.remark) : sliceWords(l.remarks)}</p>

            <div className="flex gap-3 min-w-fit ">
              {checkAccess("Quotation", "terms-and-conditions-edit") ? (
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

              {checkAccess("Quotation", "terms-and-conditions-delete") ? (
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
            <hr className={`border-[1.5px] border-slate-100  w-full col-span-4 `} />
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between items-start m-2">
        <input
          type="search"
          className="p-2 rounded-md ring-1 ring-blue shadow-md focus:outline-none text-sm"
          placeholder="Enter to search"
          onChange={(e) => searchHandler(e.target.value)}
        />
        <div className="flex flex-col items-center">
          <div className="flex gap-3 justify-center items-center bg-white  p-1 text-center  rounded-md mb-1  shadow-md">
            <button
              className="p-2 hover:bg-blue/90 hover:text-white rounded-md"
              onClick={() => setPagination((p) => ({ ...p, current: 1 }))}
            >
              <MdKeyboardDoubleArrowLeft />
            </button>
            <button
              className="p-2 hover:bg-blue/90 hover:text-white rounded-md"
              onClick={() => pagination.current > 1 && setPagination((p) => ({ ...p, current: p.current - 1 }))}
            >
              <MdKeyboardArrowLeft />
            </button>
            <button className="p-2 px-4 text-xs bg-blue/90 text-white rounded-md">{pagination.current}</button>
            <button
              className="p-2 hover:bg-blue/90 hover:text-white rounded-md border-l-0"
              onClick={() =>
                pagination.current < totalPages && setPagination((p) => ({ ...p, current: p.current + 1 }))
              }
            >
              <MdKeyboardArrowRight />
            </button>
            <button
              className="p-2 hover:bg-blue/90 hover:text-white rounded-md"
              onClick={() => setPagination((p) => ({ ...p, current: totalPages }))}
            >
              <MdKeyboardDoubleArrowRight />
            </button>
          </div>
          <p className="text-sm">
            Showing page {pagination.current} of {totalPages}
          </p>
        </div>
      </div>
    </div>
  );
}
