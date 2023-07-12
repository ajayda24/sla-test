import React, { useEffect, useState } from "react";
import { axios } from "../../../../../Global";
import { setAppError } from "../../../../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import PromptElement from "../../../PromptElement";
import ListDataCostSheet from "./ListDataCostSheet";
import CostSheetSteps from "../QuotationCostSheet/CostSheetSteps";
import { CgSpinner } from "react-icons/cg";
import { CiEdit } from "react-icons/ci";
import { AiOutlineFilePdf } from "react-icons/ai";
import { SiMicrosoftexcel } from "react-icons/si";
import { printValidationError } from "../../../../../utils/functions";
import { checkAccessFn } from "../../../../../utils/checkAccess";

export default function QuotationCostSheet() {
  const [showPromptElement, setShowPromptElement] = useState({
    open: false,
    id: null,
  });
  const token = localStorage.getItem("token");

  const dashboardData = useSelector((state) => state.dashboardData);

  const checkAccess = (module, name) => {
    return checkAccessFn(dashboardData, module, name);
  };

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState({
    edit: false,
    delete: false,
    listData: false,
    loadingId: "",
  });
  const [list, setList] = useState([]);

  const [costSheetForm, setCostSheetForm] = useState({
    open: false,
    quotationId: null,
    costSheetId: null,
    method: null,
  });

  const [quotationType, setQuotationType] = useState("");

  const currentQuotationId =
    location.state?.quotationId || location.pathname.split("/")[3];
  const currentMethod = location.state?.method || "View";

  useEffect(() => {
    if (currentMethod === "View") {
      axios
        .get(`/dashboard/quotation-cost-sheet/${currentQuotationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setList(res.data.data);
          if (costSheetForm.method !== "Edit") {
            setCostSheetForm((p) => ({ ...p, open: false }));
          }
        })
        .catch((err) => {
          console.log(err);
          navigate("/dashboard/quotation");
          // dispatch(
          //   setAppError({
          //     msg: err.message,
          //   })
          // );
          if (err.response?.data?.message) {
            dispatch(
              setAppError({
                msg: err.response?.data?.message,
              })
            );
          }
        });
    } else if (currentMethod === "Create") {
      setCostSheetForm((p) => ({
        ...p,
        quotationId: currentQuotationId,
        open: true,
        method: "Create",
      }));
      axios
        .get(`/dashboard/quotation/${currentQuotationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const quotDetails = res.data.data;
          setQuotationType(quotDetails?.quotation_type?.name || "");
        })
        .catch((err) => {
          console.log(err);
          dispatch(
            setAppError({
              msg: err.message,
            })
          );
        });
    }
  }, [loading.delete, location.pathname, currentMethod, costSheetForm.method]);

  const editData = async (costSheetId) => {
    navigate(`/dashboard/quotation/${currentQuotationId}/edit/${costSheetId}`);
    if (costSheetId) {
      setCostSheetForm((p) => ({
        ...p,
        costSheetId: costSheetId,
        method: "Edit",
        open: true,
      }));
    }
  };
  const deleteData = async (id) => {
    if (id) {
      setLoading((p) => ({ ...p, delete: true, loadingId: id }));
      try {
        const response = await axios.delete(
          `/dashboard/quotation-cost-sheet/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status === 200) {
          setLoading((p) => ({ ...p, delete: false, loadingId: "" }));
          dispatch(
            setAppError({
              msg: response.data.message,
              color: "success",
            })
          );
        }
      } catch (err) {
        setLoading((p) => ({ ...p, delete: false }));
        console.log(err);
        dispatch(
          setAppError({
            msg: err.message,
          })
        );
        if (err?.response?.status === 403) {
          if (err?.response?.data?.message) {
            dispatch(
              setAppError({
                msg: err?.response?.data.message,
              })
            );
          }
        }
      }
    }
  };

  const [pdfDownloadLoading, setPdfDownloadLoading] = useState({
    state: true,
    item: "",
  });

  const [createNewSection, setCreateNewSection] = useState(false);
  useEffect(() => {
    if (location.pathname.split("/").at(-1) === "create") {
      setCreateNewSection(true);
    }
    if (location.pathname.split("/").at(-1) === "terms") {
      setCreateNewSection(true);
    }
    if (location.pathname.split("/").at(-1) === "notes") {
      setCreateNewSection(true);
    }
  }, [location]);

  const getPDFOrExcel = async (id, fileType) => {
    try {
      setPdfDownloadLoading({ state: true, item: fileType });
      const response = await axios(
        fileType === "pdf"
          ? `/dashboard/quotation-cost-sheet-pdf/${id}/full`
          : `/dashboard/quotation-cost-sheet-excel/${id}/full`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPdfDownloadLoading({ state: false });
      if (response.status === 200) {
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          fileType === "pdf"
            ? `${list?.quotation?.name} Quotation Cost Sheet.pdf`
            : `${list?.quotation?.name} Quotation Cost Sheet.xlsx`
        );
        document.body.appendChild(link);
        link.click();
        dispatch(
          setAppError({
            msg: fileType === "pdf" ? "PDF Downloaded" : "Excel Downloaded",
            color: "success",
          })
        );
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (err) {
      setPdfDownloadLoading({ state: false });
      console.log(err);
      dispatch(
        setAppError({
          msg: err.message,
        })
      );
    }
  };

  useEffect(() => {
    if (
      !["create", "terms", "notes"].includes(
        location.pathname.split("/").at(-1)
      )
    ) {
      setCreateNewSection(false);
    }
    if (!["edit"].includes(location.pathname.split("/").at(-2))) {
      setCostSheetForm((p) => ({ ...p, open: false }));
    }
    if (!costSheetForm.open) {
      if (["edit"].includes(location.pathname.split("/").at(-2))) {
        navigate(`/dashboard/quotation/${currentQuotationId}`);
      }
    }
  }, [location]);

  return (
    <>
      {showPromptElement.open && (
        <PromptElement
          showPromptElement={showPromptElement}
          setShowPromptElement={setShowPromptElement}
          deleteHandler={deleteData}
        />
      )}
      {!createNewSection ? (
        <div className="p-2  sm:p-5">
          {!costSheetForm.open && (
            <>
              <CostSheetStep1Field
                govtFee={list?.quotation_rate_category?.government_fee_type}
                salaryAllowance={
                  list?.quotation_rate_category?.salary_and_allowance_fee_type
                }
                slaFees={list?.quotation_rate_category?.soundline_fee_type}
                quotationId={currentQuotationId}
                quotationDetails={{
                  number: list?.quotation?.quotation_number,
                  name: list?.quotation?.name,
                  type: list?.quotation_type,
                  clientName: list?.client,
                }}
              />
              <div className="flex flex-wrap items-stretch text-xs-ultra sm:text-xs justify-between px-6 gap-3 mt-10">
                <div className="flex gap-3">
                  {checkAccess("Quotation", "quotation-cost-sheet-create") ? (
                    <Link
                      to={`create`}
                      state={{
                        costSheetState: {
                          govtFee:
                            list?.quotation_type === "Cost Plus"
                              ? "onetime_cost"
                              : "monthly_cost",
                          salaryAllowance: "monthly_cost",
                          slaFees: "monthly_cost",
                        },
                        quotationId: currentQuotationId,
                        quotationDetails: {
                          number: list?.quotation?.quotation_number,
                          name: list?.quotation?.name,
                          type: list?.quotation_type,
                          clientName: list?.client,
                        },
                      }}
                    >
                      <button className="p-2 bg-red text-white rounded-md ">
                        <p className="flex gap-3 items-center">Create New</p>
                      </button>
                    </Link>
                  ) : (
                    <button className="p-2  bg-slate-300 text-white rounded-md">
                      Create New
                    </button>
                  )}
                  {checkAccess("Quotation", "note-list") ? (
                    <Link to={`notes`}>
                      <button className="p-2 bg-blue text-white rounded-md ">
                        <p className="flex gap-3 items-center">Notes</p>
                      </button>
                    </Link>
                  ) : (
                    <button className="p-2  bg-slate-300 text-white rounded-md">
                      Notes
                    </button>
                  )}

                  {checkAccess("Quotation", "terms-and-conditions-list") ? (
                    <Link to={`terms`}>
                      <button className="p-2 bg-blue text-white rounded-md ">
                        <p className="flex gap-3 items-center">
                          Terms and Condition
                        </p>
                      </button>
                    </Link>
                  ) : (
                    <button className="p-2  bg-slate-300 text-white rounded-md">
                      Terms and Condition
                    </button>
                  )}
                </div>
                <div className="flex gap-3">
                  {/* <button
                    className="p-2 bg-blue text-white rounded-md ">
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
                  </button> */}
                  <button
                    className="p-2 bg-blue text-white rounded-md "
                    onClick={() => getPDFOrExcel(currentQuotationId, "pdf")}
                  >
                    <p className="flex gap-3 items-center">
                      Download PDF
                      {pdfDownloadLoading.state &&
                      pdfDownloadLoading.item === "pdf" ? (
                        <CgSpinner className="animate-spin mx-auto" />
                      ) : (
                        <AiOutlineFilePdf />
                      )}
                    </p>
                  </button>
                  <button
                    className="p-2 bg-blue text-white rounded-md "
                    onClick={() => getPDFOrExcel(currentQuotationId, "excel")}
                  >
                    <p className="flex gap-3 items-center">
                      Download Excel
                      {pdfDownloadLoading.state &&
                      pdfDownloadLoading.item === "excel" ? (
                        <CgSpinner className="animate-spin mx-auto" />
                      ) : (
                        <AiOutlineFilePdf />
                      )}
                    </p>
                  </button>
                </div>
              </div>
              <ListDataCostSheet
                list={list?.quotation_cost_sheet || []}
                editData={editData}
                deleteData={setShowPromptElement}
                loading={loading}
                titles={[
                  "Sl No.",
                  "Job Position",
                  "Nationality",
                  "Quantity",
                  "Action",
                ]}
                quotationName={list?.quotation?.name}
              />
            </>
          )}
          {costSheetForm.open && (
            <CostSheetSteps
              govtFee={list?.quotation_rate_category?.government_fee_type}
              salaryAllowance={
                list?.quotation_rate_category?.salary_and_allowance_fee_type
              }
              slaFees={list?.quotation_rate_category?.soundline_fee_type}
              costSheetForm={costSheetForm}
              updateCostSheetForm={setCostSheetForm}
              quotationType={quotationType}
              quotationDetails={{
                number: list?.quotation?.quotation_number,
                name: list?.quotation?.name,
                type: list?.quotation_type,
                clientName: list?.client,
              }}
            />
          )}
        </div>
      ) : (
        <>
          <Outlet />
        </>
      )}
    </>
  );
}

/// Step 1 Field Component

const CostSheetStep1Field = (props) => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [editing, setEditing] = useState({
    govtFee: false,
    salaryAllowance: false,
    slaFees: false,
    someEdited: false,
  });
  const [submitFormLoading, setSubmitFormLoading] = useState(false);

  const [govtFee, setGovtFee] = useState(props?.govtFee);
  const [salaryAllowance, setSalaryAllowance] = useState(
    props?.salaryAllowance
  );
  const [slaFees, setSlaFees] = useState(props?.slaFees);

  useEffect(() => {
    setGovtFee(props.govtFee);
    setSalaryAllowance(props.salaryAllowance);
    setSlaFees(props.slaFees);
  }, [props]);

  const submitForm = async (event) => {
    event.preventDefault();
    setSubmitFormLoading(true);
    try {
      const response = await axios.put(
        `/dashboard/quotation-rate-category-update/${props.quotationId}`,
        {
          government_fee_type: govtFee,
          salary_and_allowance_fee_type: salaryAllowance,
          soundline_fee_type: slaFees,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        dispatch(
          setAppError({
            msg: "Successfully edited.",
            color: "success",
          })
        );
      }
      setSubmitFormLoading(false);
    } catch (error) {
      setSubmitFormLoading(false);
      printValidationError(error, "quotation");
      console.log(error);
      dispatch(
        setAppError({
          msg: error.message,
        })
      );
    }
  };

  const editField = (field) => {
    setEditing((p) => ({ ...p, someEdited: true }));
    if (field === "govtFee") {
      setEditing((p) => ({ ...p, govtFee: true }));
    }
    if (field === "salaryAllowance") {
      setEditing((p) => ({ ...p, salaryAllowance: true }));
    }
    if (field === "slaFees") {
      setEditing((p) => ({ ...p, slaFees: true }));
    }
  };

  return (
    <center>
      <div
        className={`max-w-lg lg:max-w-2xl w-full bg-white dark:bg-dark rounded-md  p-5 flex flex-col  items-start justify-center`}
      >
        <div className="text-sm  mx-auto">
          <div className="text-left">
            <p>
              <b> Quotation No.</b>: {props?.quotationDetails?.number}
            </p>
            <p>
              <b>Quotation Name</b> : {props?.quotationDetails?.name}
            </p>
            <p>
              <b>Quotation Type</b> : {props?.quotationDetails?.type}
            </p>
            <p>
              <b>Client Name</b> : {props?.quotationDetails?.clientName}
            </p>
          </div>
        </div>
        {/* <form
          method="POST"
          onSubmit={(event) => submitForm(event)}
          className="w-full  flex flex-col items-center justify-center"
        >
          <div className="flex flex-col p-2 gap-1 w-full max-w-md">
            <label htmlFor={`addOrEdit-govtfee`} className="text-xs text-left">
              Government Fees
            </label>

            <div className="flex gap-3 justify-center items-center w-full ">
              <select
                name="govtFee"
                id={`addOrEdit-govtFee`}
                required
                className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs w-full"
                value={govtFee}
                onChange={(e) => setGovtFee(e.target.value)}
                disabled={!editing.govtFee}
              >
                <option value="onetime">One-time</option>
                <option value="monthly">Monthly</option>
              </select>
              <CiEdit size={"1.3rem"} onClick={() => editField("govtFee")} />
            </div>
          </div>
          <div className="flex flex-col p-2 gap-1 w-full max-w-md">
            <label htmlFor={`addOrEdit-govtfee`} className="text-xs text-left">
              Salary and Allowance
            </label>
            <div className="flex gap-3 justify-center items-center w-full ">
              <select
                name="salaryAllowance"
                id={`addOrEdit-salaryAllowance`}
                required
                className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs w-full"
                value={salaryAllowance}
                onChange={(e) => setSalaryAllowance(e.target.value)}
                disabled={!editing.salaryAllowance}
              >
                <option value="onetime">One-time</option>
                <option value="monthly">Monthly</option>
              </select>
              <CiEdit size={"1.3rem"} onClick={() => editField("salaryAllowance")} />
            </div>
          </div>
          <div className="flex flex-col p-2 gap-1 w-full max-w-md">
            <label htmlFor={`addOrEdit-govtfee`} className="text-xs text-left">
              SLA Fees
            </label>
            <div className="flex gap-3 justify-center items-center w-full ">
              <select
                name="slaFees"
                id={`addOrEdit-slaFees`}
                required
                className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs w-full"
                value={slaFees}
                onChange={(e) => setSlaFees(e.target.value)}
                disabled={!editing.slaFees}
              >
                <option value="onetime">One-time</option>
                <option value="monthly">Monthly</option>
              </select>
              <CiEdit size={"1.3rem"} onClick={() => editField("slaFees")} />
            </div>
          </div>

          <div className={`p-2  w-full max-w-md  gap-3 ${editing.someEdited ? "flex" : "hidden"}`}>
            <button
              className="bg-black dark:bg-red w-full text-xs text-white rounded-md py-2 flex justify-center items-center gap-2"
              type="submit"
              disabled={submitFormLoading}
            >
              <p>Update</p>
              {submitFormLoading && <CgSpinner className="animate-spin" />}
            </button>
            <CiEdit size={"1.3rem"} className="invisible" />
          </div>
        </form> */}
      </div>
    </center>
  );
};
