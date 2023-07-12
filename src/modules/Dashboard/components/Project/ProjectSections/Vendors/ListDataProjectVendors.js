import React, { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { CiEdit, CiViewList } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAccessFn } from "../../../../../../utils/checkAccess";
import { BiShow } from "react-icons/bi";
import { axios } from "../../../../../../Global";
import { setAppError } from "../../../../../../store/userSlice";
import PromptElement from "../../../../PromptElement";

export default function ListDataProjectVendors({
  list = [
    { contratcNo: "123456", companyName: "lorem", status: "Draft" },
    { contratcNo: "123456", companyName: "lorem", status: "Pending" },
    { contratcNo: "123456", companyName: "lorem", status: "Draft" },
    { contratcNo: "123456", companyName: "lorem", status: "Pending" },
    { contratcNo: "123456", companyName: "lorem", status: "Approved" },
    { contratcNo: "123456", companyName: "lorem", status: "Regected" },
    { contratcNo: "123456", companyName: "lorem", status: "Draft" },
  ],
  editData,
  deleteData,
  loading,
  titles,
  contractModalHandler,
  vendors,
  filterStatus,
  country,
  searchKeyword,
  setIsDataDeleted,
}) {
  const { projectId } = useParams();
  const dashboardData = useSelector((state) => state.dashboardData);
  const token = localStorage.getItem("token");
  const [vendorList, setVendorList] = useState(vendors);
  const [vendorListIsEmpty, setVendorListIsEmpty] = useState(false);
  const dispatch = useDispatch();
  const [showPromptElement, setShowPromptElement] = useState({
    open: false,
    id: null,
  });
  const checkAccess = (module, name) => {
    return checkAccessFn(dashboardData, module, name);
  };

  const handleDelete = async (vendorId) => {
    try {
      let result = await axios.delete(`/dashboard/project-vendor/${vendorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(
        setAppError({
          msg: "Vendor deleted success",
          color: "success",
        })
      );
      setIsDataDeleted((p) => !p);
    } catch (error) {
      console.log(error);
      dispatch(
        setAppError({
          msg: error.message,
        })
      );
      setIsDataDeleted((p) => !p);
    }
  };

  const updateStatus = async (vendorId, status) => {
    const body = { status };
    try {
      let result = await axios.put(
        `/dashboard/project-vendor/${vendorId}`,
        body,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(
        setAppError({
          msg: "Status updated",
          color: "success",
        })
      );
    } catch (error) {
      dispatch(
        setAppError({
          msg: "Couldn't update status.",
        })
      );
    }
  };

  useEffect(() => {
    setVendorList(vendors);
    setTimeout(() => {
      if (vendorList.length <= 0) {
        setVendorListIsEmpty(true);
      } else {
        setVendorListIsEmpty(false);
      }
    }, 2500);
  }, [vendors]);
  return (
    <>
      {showPromptElement?.open && (
        <PromptElement
          showPromptElement={showPromptElement}
          setShowPromptElement={setShowPromptElement}
          deleteHandler={handleDelete}
        />
      )}
      <div className="p-5 ">
        <div
          className={`grid justify-items-center grid-cols-table-5 auto-cols-min gap-5 p-6 bg-white   items-baseline w-full min-w-fit  rounded-md `}
        >
          {titles.map((t, index) => (
            <p key={index} className="font-semibold uppercase">
              {t}
            </p>
          ))}
          {vendorList.length <= 0 && (
            <div className="flex justify-center items-center gap-3 mt-5 w-full col-span-5">
              {!vendorListIsEmpty ? (
                <>
                  <p>Loading</p>
                  <CgSpinner className="animate-spin" />
                </>
              ) : (
                <>
                  <p>No Vendors is added.</p>
                </>
              )}
            </div>
          )}
          {vendorList.map((l, index) => {
            // console.log('fl,ls => ',filterStatus,l.status)
            // console.log('c,lc => ',country,l.vendor.nationality.name)
            const shouldRender =
              (filterStatus === "all" || l.status === filterStatus) &&
              (country === "all" || l.vendor.nationality.name === country) &&
              (searchKeyword === "" || l.vendor.name.includes(searchKeyword));

            if (shouldRender) {
              return (
                <React.Fragment key={index}>
                  <p>{Number(index) + 1}</p>
                  <p>{l.vendor.name}</p>
                  <p>{l.vendor.nationality.name} </p>

                  <div className="form-control w-full max-w-xs">
                    <select
                      className="select select-bordered "
                      onChange={(e) => updateStatus(l.id, e.target.value)}
                    >
                      <option disabled selected hidden>
                        Select Status
                      </option>
                      <option
                        value={"Confirmed"}
                        selected={l.status === "Confirmed"}
                      >
                        Confirmed
                      </option>
                      <option
                        value={"Not Confirmed"}
                        selected={l.status === "Not Confirmed"}
                      >
                        Not Confirmed
                      </option>
                    </select>
                  </div>
                  <div className="flex gap-3 min-w-fit ">
                    <button className="p-1 px-2 rounded-md ring-1 ring-slate-300">
                      <BiShow size={"1.4rem"} />
                    </button>

                    <button
                      className="p-1 px-2 rounded-md ring-1 ring-slate-300"
                      onClick={() =>
                        setShowPromptElement({ open: true, id: l.id })
                      }
                    >
                      <MdDeleteOutline size={"1.4rem"} />
                    </button>
                  </div>

                  <hr className="border-[1.5px] border-slate-100  w-full col-span-5" />
                </React.Fragment>
              );
            }

            return null;
          })}
        </div>
      </div>
    </>
  );
}
