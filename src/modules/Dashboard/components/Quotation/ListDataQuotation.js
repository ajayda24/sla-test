import React from "react";
import { getFlag, getFormattedDate } from "../../../../utils/functions";
import { CgSpinner } from "react-icons/cg";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { checkAccessFn } from "../../../../utils/checkAccess";

export default function ListDataQuotation({
  list = [],
  editData,
  deleteData,
  loading,
  column = 5,
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
          className={`grid justify-items-center grid-cols-table-quotation auto-cols-min gap-5 p-6 bg-white   items-baseline w-fit  rounded-md `}
        >
          {titles.map((t, index) => (
            <p key={index} className="font-semibold uppercase">
              {t}
            </p>
          ))}
          {list.length <= 0 && (
            <div className="flex justify-center items-center gap-3 mt-5 w-full col-span-10">
              <p>Loading</p>
              <CgSpinner className="animate-spin" />
            </div>
          )}
          {list.map((l, index) => (
            <React.Fragment key={index}>
              <p>{Number(index) + 1}</p>
              <p>{l.quotation_number} </p>

              <p>{l.name}</p>

              <p>{l.client.name} </p>
              <p>{l.quotation_type.name} </p>

              <p>{l.status}</p>

              {checkAccess("Quotation", "quotation-cost-sheet-list") &&
              l.quotation_cost_sheet.length > 0 ? (
                <Link
                  to={`/dashboard/quotation/${l.id}`}
                  state={{
                    quotationId: l.id,
                    method: "View",
                  }}
                >
                  <button className="p-1 w-20 rounded-md ring-1 ring-slate-600">
                    View
                  </button>
                </Link>
              ) : checkAccess("Quotation", "quotation-cost-sheet-create") &&
                l.quotation_cost_sheet.length <= 0 ? (
                <Link
                  to={`/dashboard/quotation/${l.id}`}
                  state={{
                    quotationId: l.id,
                    method: "Create",
                  }}
                >
                  <button className="p-1 w-20 rounded-md ring-1 ring-slate-600">
                    Create
                  </button>
                </Link>
              ) : (
                <p>--</p>
              )}

              <div>
                {l?.contract?.length > 0 ? (
                  <Link to={`/dashboard/contract/${l.contract[0].id}`}>
                    <button
                      className="p-2 w-fit rounded-md ring-1 ring-slate-600"
                      onClick={() => contractModalHandler(l.id)}
                    >
                      View Contract
                    </button>
                  </Link>
                ) : l?.status === "Approved" ? (
                  <button
                    className="p-2 w-fit rounded-md ring-1 ring-slate-600"
                    onClick={() => contractModalHandler(l.id)}
                  >
                    Create Contract
                  </button>
                ) : (
                  "--"
                )}
              </div>
              <p>{String(l.created_at).split("T")[0]}</p>

              <div className="flex gap-3 min-w-fit ">
                {checkAccess("Quotation", "quotation-edit") ? (
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
                  <p>--</p>
                )}
                {checkAccess("Quotation", "quotation-delete") ? (
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
                  <p>--</p>
                )}
              </div>
              <hr className="border-[1.5px] border-slate-100  w-full col-span-10" />
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
