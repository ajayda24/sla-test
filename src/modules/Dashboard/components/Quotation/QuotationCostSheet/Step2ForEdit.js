import { axios } from "../../../../../Global";
import React, { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { HiArrowLongRight } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import { BiLeftArrow } from "react-icons/bi";

import { useDispatch } from "react-redux";
import { setAppError } from "../../../../../store/userSlice";
import { printValidationError } from "../../../../../utils/functions";

export default function QuotationCostSheetStep2ForEdit({
  costSheetId,
  costSheetState,
  quotationId,
  updateCostSheetForm,
  quotationType,
  quotationDetails,
}) {
  const [submitLoading, setSubmitLoading] = useState(false);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const costSheetStateArray = [
    quotationType === "Cost Plus" ? "onetime_cost" : "monthly_cost",
    costSheetState.salaryAllowance || "monthly_cost",
    costSheetState.slaFees || "monthly_cost",
  ];

  const [nations, setNations] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [state, setState] = useState([]);

  const [currentCostSheet, setCurrentCostSheet] = useState({});

  const [formDataLoading, setFormDataLoading] = useState(false);

  const submitForm = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    console.log(costSheetId);
    console.log("step 2 - submit");
    try {
      const response = await axios.put(
        `/dashboard/quotation-cost-sheet/${costSheetId}`,
        { ...currentCostSheet },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setSubmitLoading(false);
        dispatch(
          setAppError({
            msg: "Successfully edited.",
            color: "success",
          })
        );
        updateCostSheetForm((p) => ({
          open: false,
          method: "View",
        }));
      }
    } catch (error) {
      setSubmitLoading(false);
      printValidationError(error, "quotation");
      dispatch(
        setAppError({
          msg: error.message,
        })
      );
    }
  };

  useEffect(() => {
    setFormDataLoading(true);
    axios
      .get("/dashboard/quotation-cost-sheet-input-value", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFormDataLoading(false);

        const result = res.data.data;
        for (let i = 0; i < result.job_possition.length; i++) {
          const position = result.job_possition[i]?.name || "";
          const job_position_id = result.job_possition[i]?.id;

          jobs.push({ id: job_position_id, name: position });
        }
        for (let j = 0; j < result.nationality.length; j++) {
          const nationality = result.nationality[j]?.name || "";
          const nationality_id = result.nationality[j]?.id;
          nations.push({ id: nationality_id, name: nationality });
        }
        if (jobs.length > result.job_possition.length) {
          jobs.length = result.job_possition.length;
        }
        if (nations.length > result.nationality.length) {
          nations.length = result.nationality.length;
        }
      })
      .catch((err) => {
        setFormDataLoading(false);

        console.log(err);
        dispatch(
          setAppError({
            msg: err.message,
          })
        );
      });
  }, []);

  useEffect(() => {
    axios
      .get(`/dashboard/quotation-cost-sheet/${quotationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const result = res.data.data;
        setCurrentCostSheet(
          result.quotation_cost_sheet.find((r) => r.id === costSheetId)
        );
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          setAppError({
            msg: err.message,
          })
        );
      });

    axios
      .get("/dashboard/quotation-cost-sheet-input-value", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const result = res.data.data;
        const newState = [];
        for (let i = 0; i < 1; i++) {
          const position = result.job_possition[i]?.name || "";
          const nationality = result.nationality[i]?.name || "";
          const job_position_id = result.job_possition[i]?.id;
          const nationality_id = result.nationality[i]?.id;
          const rateCategory = [];
          for (let j = 0; j < result.rate_category.length; j++) {
            const rateCategoryContent = {
              name: result.rate_category[j].name,
              items: JSON.parse(
                JSON.stringify(result.rate_category[j].rate_category_item)
              ),
            };
            rateCategory.push(rateCategoryContent);
          }
          const stateObject = {
            position,
            job_position_id,
            nationality_id,
            nationality,
            quantity: "",
            rateCategory,
          };

          newState.push(stateObject);
        }
        setState(newState);
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          setAppError({
            msg: err.message,
          })
        );
      });
  }, []);

  const selectChangeHandler = (field, value) => {
    if (field === "position") {
      currentCostSheet.job_position_id = jobs.find((n) => n.name === value)?.id;
    }
    if (field === "nationality") {
      currentCostSheet.nationality_id = nations.find(
        (n) => n.name === value
      )?.id;
    }

    setCurrentCostSheet(currentCostSheet);
  };

  const valueChangeHandler = (key, value, field) => {
    currentCostSheet[key] = value;
    if (field === "basic") {
      currentCostSheet.gosi = Math.round((currentCostSheet.basic * 2) / 100);
      currentCostSheet.vacation_salary_two_years = Math.round(
        (currentCostSheet.basic / 30) * (21 / 12)
      );
      currentCostSheet.end_of_service = Math.round(
        (currentCostSheet.basic / 30) * (15 / 12)
      );
    }
    // setIsShow((p) => ({ ...p, show: false }));
    // setTimeout(() => {
    //   setIsShow((p) => ({ ...p, show: true }));
    // }, 0);
    setCurrentCostSheet(currentCostSheet);
  };

  const [isShow, setIsShow] = useState({ show: false, id: "" });

  return (
    <center>
      {!formDataLoading ? (
        <div className="max-w-lg lg:max-w-5xl w-full bg-white dark:bg-dark rounded-md  p-5 flex flex-col  items-start justify-center">
          <h2 className="text-2xl self-center font-bold mb-10">
            Quotation Cost Sheet
          </h2>
          <div className="text-sm  mx-auto">
            <div className="text-left">
              <p>
                <b> Quotation No.</b>: {quotationDetails?.number}
              </p>
              <p>
                <b>Quotation Name</b> : {quotationDetails?.name}
              </p>
              <p>
                <b>Quotation Type</b> : {quotationDetails?.type}
              </p>
              <p>
                <b>Client Name</b> : {quotationDetails?.clientName}
              </p>
            </div>
          </div>
          <form
            method="POST"
            onSubmit={(event) => submitForm(event)}
            className="w-full  flex flex-col items-center justify-center"
          >
            {state.map((data, index) => (
              <React.Fragment key={index}>
                <div
                  className="w-full shadow-md p-5 m-5"
                  id={`quotation-id-${index}`}
                >
                  <div className="flex flex-col p-2 gap-1 w-full max-w-md">
                    <label
                      htmlFor={`addOrEdit-position`}
                      className="text-xs text-left mt-3"
                    >
                      Select Position
                    </label>
                    <select
                      name="Position"
                      id={`addOrEdit-position`}
                      required
                      className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs"
                      // value={data.position || ""}
                      defaultValue={
                        currentCostSheet?.job_position?.name || null
                      }
                      onChange={(e) =>
                        selectChangeHandler("position", e.target.value)
                      }
                    >
                      <option value="" selected disabled hidden>
                        Select an Option
                      </option>
                      {jobs.map((job) => (
                        <option key={job.id} value={job.name}>
                          {job.name}
                        </option>
                      ))}
                    </select>
                    <label
                      htmlFor={`addOrEdit-position`}
                      className="text-xs text-left mt-3"
                    >
                      Nationality
                    </label>
                    <select
                      name="nationality"
                      id={`addOrEdit-nationality`}
                      required
                      className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs"
                      defaultValue={currentCostSheet?.nationality?.name || null}
                      onChange={(e) =>
                        selectChangeHandler("nationality", e.target.value)
                      }
                    >
                      <option value="" selected disabled hidden>
                        Select an Option
                      </option>

                      {nations.map((nation) => (
                        <option key={nation.id} value={nation.name}>
                          {nation.name}
                        </option>
                      ))}
                    </select>
                    <label
                      htmlFor={`addOrEdit-position`}
                      className="text-xs text-left mt-3"
                    >
                      Gender
                    </label>
                    <select
                      name="gender"
                      id={`addOrEdit-gender`}
                      required
                      className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs"
                      // value={data.nationality}
                      defaultValue={currentCostSheet?.gender || null}
                      onChange={(e) => {
                        const errorElem =
                          document.getElementById(`quotation-gender`);
                        errorElem.style.display = "none";
                        valueChangeHandler("gender", e.target.value);
                      }}
                    >
                      <option value="" selected disabled hidden>
                        Select an Option
                      </option>

                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    <label
                      htmlFor={`addOrEdit-position`}
                      className="text-xs text-left mt-3"
                    >
                      Quantity
                    </label>

                    <input
                      type="text"
                      name="Quantity"
                      id={`addOrEdit-Quantity`}
                      required
                      className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs"
                      defaultValue={currentCostSheet?.quantity}
                      onChange={(e) =>
                        valueChangeHandler("quantity", e.target.value)
                      }
                    />
                    <p
                      id={`quotation-position`}
                      className="hidden w-full h-5 bg-red/5 text-red text-xs"
                    ></p>
                    <p
                      id={`quotation-nationality`}
                      className="hidden w-full h-5 bg-red/5 text-red text-xs"
                    ></p>
                    <p
                      id={`quotation-gender`}
                      className="hidden w-full h-5 bg-red/5 text-red text-xs"
                    ></p>
                    <p
                      id={`quotation-quantity`}
                      className="hidden w-full h-5 bg-red/5 text-red text-xs"
                    ></p>
                    <div className="requirements"></div>
                  </div>
                  <h3 className="font-semibold self-start text-center mt-6 m-1 my-3">
                    Rate Category Cost Details{" "}
                  </h3>
                  {data.rateCategory.map((rateCat, ind) => {
                    return (
                      ind === 1 &&
                      rateCat.items.map((item, i) => {
                        if (
                          item.name === "BASIC" ||
                          item.name === "FOOD" ||
                          item.name === "ALLOWANCE" ||
                          item.name === "OVERTIME"
                        ) {
                          return (
                            <div key={i} className="flex flex-wrap w-full">
                              <div className="w-full flex justify-center">
                                <div
                                  title={item.name}
                                  className="flex flex-col  p-2 gap-1 max-w-xs w-full"
                                >
                                  <label
                                    htmlFor={`addOrEdit-name`}
                                    className="text-xs text-left mt-3"
                                  >
                                    Name
                                  </label>
                                  <input
                                    type="text"
                                    name="Name"
                                    id="name"
                                    placeholder="Enter name"
                                    required
                                    className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs"
                                    defaultValue={item.name || ""}
                                    disabled
                                  />
                                </div>
                                <div
                                  title={`Value of ${item.name}`}
                                  className="flex flex-col  p-2 gap-1 max-w-xs w-full"
                                >
                                  <label
                                    htmlFor={`addOrEdit-Value`}
                                    className="text-xs text-left mt-3"
                                  >
                                    Value
                                  </label>
                                  <input
                                    type="number"
                                    name="Value"
                                    id="Value"
                                    placeholder="Enter a value"
                                    // required
                                    className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs"
                                    defaultValue={
                                      currentCostSheet[item.column_name]
                                    }
                                    onChange={(e) => {
                                      const errorElem = document.getElementById(
                                        `quotation-${item.column_name}`
                                      );
                                      errorElem.style.display = "none";
                                      valueChangeHandler(
                                        item.column_name,
                                        e.target.value,
                                        item.column_name
                                      );
                                    }}
                                  />

                                  <p
                                    id={`quotation-${item.column_name}`}
                                    className="hidden w-full h-5 bg-red/5 text-red text-xs"
                                  ></p>
                                </div>
                              </div>
                            </div>
                          );
                        } else return null;
                      })
                    );
                  })}
                  {data.rateCategory.map((rateCat, ind) => {
                    let total = 0;
                    return (
                      <React.Fragment key={ind}>
                        <div>
                          <div
                            className="flex max-w-lg justify-between items-center mt-10 m-1 my-1"
                            onClick={() =>
                              setIsShow((p) => ({
                                show:
                                  p.show && p.id === `${index}-${ind}`
                                    ? false
                                    : true,
                                id: `${index}-${ind}`,
                              }))
                            }
                          >
                            <h2 className="  text-slate-500">
                              {getAlpha(ind)}. {rateCat.name}(
                              {getSectName(costSheetStateArray[ind])})
                            </h2>
                            <h2>
                              <BiLeftArrow
                                className={
                                  isShow.show && isShow.id === `${index}-${ind}`
                                    ? "-rotate-90"
                                    : "rotate-0"
                                }
                              />
                            </h2>
                          </div>
                          {isShow.show && isShow.id === `${index}-${ind}` && (
                            <div className="flex flex-wrap justify-center">
                              {rateCat.items.map((item, i) => {
                                if (
                                  item.name === "BASIC" ||
                                  item.name === "FOOD" ||
                                  item.name === "ALLOWANCE" ||
                                  item.name === "OVERTIME"
                                ) {
                                  return null;
                                } else
                                  return (
                                    <div
                                      key={i}
                                      className="flex flex-wrap w-full"
                                    >
                                      <div className="w-full flex justify-center">
                                        <div
                                          title={item.name}
                                          className="flex flex-col  p-2 gap-1 max-w-xs w-full"
                                        >
                                          <label
                                            htmlFor={`addOrEdit-name`}
                                            className="text-xs text-left mt-3"
                                          >
                                            Name
                                          </label>
                                          <input
                                            type="text"
                                            name="Name"
                                            id="name"
                                            placeholder="Enter name"
                                            required
                                            className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs"
                                            defaultValue={item.name || ""}
                                            disabled
                                          />

                                          <div className="requirements"></div>
                                        </div>
                                        <div
                                          title={`Value of ${item.name}`}
                                          className="flex flex-col  p-2 gap-1 max-w-xs w-full"
                                        >
                                          <label
                                            htmlFor={`addOrEdit-Value`}
                                            className="text-xs text-left mt-3"
                                          >
                                            Value
                                          </label>
                                          <input
                                            type="number"
                                            name="Value"
                                            id="Value"
                                            placeholder="Enter a value"
                                            // required
                                            className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs"
                                            defaultValue={
                                              currentCostSheet[item.column_name]
                                            }
                                            onChange={(e) => {
                                              const errorElem =
                                                document.getElementById(
                                                  `quotation-${item.column_name}`
                                                );
                                              errorElem.style.display = "none";
                                              valueChangeHandler(
                                                item.column_name,
                                                e.target.value
                                              );
                                            }}
                                          />

                                          <p
                                            id={`quotation-${item.column_name}`}
                                            className="hidden w-full h-5 bg-red/5 text-red text-xs"
                                          ></p>
                                        </div>
                                      </div>
                                      {/* <div className="flex flex-col  p-2 gap-1  w-full max-w-lg mx-auto">
                                <label
                                  htmlFor={`addOrEdit-short_description`}
                                  className="text-xs text-left mt-3"
                                >
                                  Short Description
                                </label>
                                <input
                                  type="text"
                                  name="short_description"
                                  id="short_description"
                                  placeholder="..."
                                  // required
                                  className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs"
                                  defaultValue={
                                    currentCostSheet[
                                      `${item.column_name}_short_description`
                                    ]
                                  }
                                  onChange={(e) => {
                                    const errorElem = document.getElementById(
                                      `quotation-${item.column_name}`
                                    );
                                    errorElem.style.display = "none";
                                    valueChangeHandler(
                                      `${item.column_name}_short_description`,
                                      e.target.value
                                    );
                                  }}
                                />

                                <p
                                  id={`quotation-${item.column_name}`}
                                  className="hidden w-full h-5 bg-red/5 text-red text-xs"
                                ></p>
                              </div> */}
                                    </div>
                                  );
                              })}
                            </div>
                          )}

                          {/* <h2 className=" m-1 my-2 text-xs text-slate-500">
                        *Total {rateCat.name} (
                        {getSectName(costSheetStateArray[ind])}) - {total}
                      </h2> */}
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </React.Fragment>
            ))}
            <div className="p-2  w-full max-w-md flex gap-3">
              <button
                className="bg-black dark:bg-red w-full text-xs text-white rounded-md py-2 flex justify-center items-center gap-2"
                type="submit"
                disabled={submitLoading}
              >
                <p>Submit</p>
                {submitLoading ? (
                  <CgSpinner className="animate-spin" />
                ) : (
                  <HiArrowLongRight size={"1.2rem"} />
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex justify-center items-center gap-3">
          <p>Loading</p>
          <CgSpinner className="animate-spin" />
        </div>
      )}
    </center>
  );
}

const getAlpha = (num) => {
  return String.fromCharCode(num + "A".charCodeAt(0));
};

const getSectName = (type) => {
  if (type === "monthly" || type === "monthly_cost") return "Monthly";
  if (type === "onetime" || type === "onetime_cost") return "One-time";
};
