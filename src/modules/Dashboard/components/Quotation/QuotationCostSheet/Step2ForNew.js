import { axios } from "../../../../../Global";
import React, { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { HiArrowLongRight } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";

import { useDispatch } from "react-redux";
import { setAppError } from "../../../../../store/userSlice";
import { redirect, useLocation, useNavigate } from "react-router-dom";
import { printValidationError } from "../../../../../utils/functions";
import { BiLeftArrow } from "react-icons/bi";

export default function QuotationCostSheetStep2ForNew() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [justForStateChange, setJustForStateChange] = useState(true);
  const [submitFormLoading, setSubmitFormLoading] = useState(false);
  const locationState = location.state;
  const costSheetState = locationState?.costSheetState || {};
  const quotationId = locationState?.quotationId || null;
  const quotationDetails = locationState?.quotationDetails || {};
  const [dummyState, setDummyState] = useState([]);
  const [state, setState] = useState([]);

  const [nations, setNations] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [formDataLoading, setFormDataLoading] = useState(false);

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
      .get("/dashboard/quotation-cost-sheet-input-value", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const result = res.data.data;
        const newState = [];
        for (let i = 0; i < 1; i++) {
          const position = "";
          const nationality = "";
          const job_position_id = "";
          const nationality_id = "";
          const rateCategory = [];
          for (let j = 0; j < result.rate_category.length; j++) {
            const items = [];
            for (
              let k = 0;
              k < result.rate_category[j].rate_category_item.length;
              k++
            ) {
              // result.rate_category[j].rate_category_item[k].onetime_cost = "";
              // result.rate_category[j].rate_category_item[k].monthly_cost = "";
            }
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
        setDummyState(JSON.parse(JSON.stringify(newState)));
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

  const token = localStorage.getItem("token");
  const costSheetStateArray = [
    costSheetState.govtFee,
    costSheetState.salaryAllowance,
    costSheetState.slaFees,
  ];

  const submitForm = async (e) => {
    e.preventDefault();

    const updatedCostSheetArray = { quotation_cost_sheet: [] };
    for (let i = 0; i < state.length; i++) {
      const obj = {};
      // obj.gender = "Male";
      for (let j = 0; j < state[i].rateCategory.length; j++) {
        obj.nationality_id = state[i].nationality_id;
        obj.job_position_id = state[i].job_position_id;
        obj.quantity = state[i].quantity;
        obj.gender = state[i].gender;

        for (let k = 0; k < state[i].rateCategory[j].items.length; k++) {
          const key = state[i].rateCategory[j].items[k].column_name;
          const value =
            costSheetStateArray[j] === "monthly_cost"
              ? state[i].rateCategory[j].items[k].monthly_cost
              : state[i].rateCategory[j].items[k].onetime_cost;
          const descriptionKey = `${state[i].rateCategory[j].items[k].column_name}_short_description`;
          const descriptionValue =
            state[i].rateCategory[j].items[k].short_description;

          obj[key] = value;
          obj[descriptionKey] = descriptionValue;
        }
        updatedCostSheetArray.government_fee_type =
          costSheetState?.govtFee?.split("_")[0] || null;
        updatedCostSheetArray.salary_and_allowance_fee_type =
          costSheetState?.salaryAllowance?.split("_")[0] || null;
        updatedCostSheetArray.soundline_fee_type =
          costSheetState?.slaFees?.split("_")[0] || null;
        updatedCostSheetArray.quotation_id = quotationId || "";
      }
      updatedCostSheetArray.quotation_cost_sheet.push(obj);
    }

    try {
      const response = await axios.post(
        "/dashboard/quotation-cost-sheet",
        updatedCostSheetArray,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        console.log(location.state);

        dispatch(
          setAppError({
            msg: "Successfully created.",
            color: "success",
          })
        );
        const quotationId = location.pathname.split("/")[3];
        console.log(quotationId);
        navigate(`/dashboard/quotation/${quotationId}`, {
          state: { quotationId, method: "View" },
        });
      }
    } catch (error) {
      console.log(error);
      printValidationError(error, "quotation");
      dispatch(
        setAppError({
          msg: error.message,
        })
      );
    }
  };

  const addMoreHandler = () => {
    const firstArray = JSON.parse(JSON.stringify(dummyState[0]));
    firstArray.position = "";
    firstArray.nationality = "";
    firstArray.quantity = "";
    firstArray.job_position_id = "";
    firstArray.nationality_id = "";
    setState((p) => [...p, firstArray]);
    setTimeout(() => {
      const addedDiv = document.getElementById(`quotation-id-${state.length}`);
      addedDiv.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const deleteCostSheetHandler = (index) => {
    const spreadData = [...state];
    const existingArray = spreadData.filter((f, i) => i !== index);
    setState(existingArray);
  };

  const selectChangeHandler = (index, field, value) => {
    const spreadData = [...state];
    const changedArray = spreadData.find((a, i) => i === index);
    changedArray[field] = value;
    if (field === "position") {
      changedArray.job_position_id = jobs.find((n) => n.name === value)?.id;
    }
    if (field === "nationality") {
      changedArray.nationality_id = nations.find((n) => n.name === value).id;
    }
    setState(spreadData);
  };

  const valueChangeHandler = (index, ind, i, value, field) => {
    const changedArray = state.find((g, a) => a === index);

    const changedChangedArray = changedArray.rateCategory.find(
      (g, b) => b === ind
    );
    const changedChangedChangedArray = changedChangedArray.items.find(
      (g, c) => c === i
    );

    if (field === "description") {
      changedChangedChangedArray.short_description = value;
    } else if (field === "basic") {
      const equationChangeElements = changedChangedArray.items.filter(
        (e) =>
          e.column_name === "gosi" ||
          e.column_name === "vacation_salary_two_years" ||
          e.column_name === "end_of_service"
      );
      if (costSheetStateArray[ind] === "monthly_cost") {
        equationChangeElements[0].monthly_cost = Math.round((value * 2) / 100);
        equationChangeElements[1].monthly_cost = Math.round(
          (value / 30) * (21 / 12)
        );
        equationChangeElements[2].monthly_cost = Math.round(
          (value / 30) * (15 / 12)
        );
        changedChangedChangedArray.monthly_cost = value;
      } else if (costSheetStateArray[ind] === "onetime_cost") {
        equationChangeElements[0].onetime_cost = Math.round((value * 2) / 100);
        equationChangeElements[1].onetime_cost = Math.round(
          (value / 30) * (21 / 12)
        );
        equationChangeElements[2].onetime_cost = Math.round(
          (value / 30) * (15 / 12)
        );
        changedChangedChangedArray.onetime_cost = value;
      }
      setIsShow((p) => ({ ...p, show: false }));
      setTimeout(() => {
        setIsShow((p) => ({ ...p, show: true }));
      }, 0);
    } else {
      if (costSheetStateArray[ind] === "monthly_cost") {
        changedChangedChangedArray.monthly_cost = value;
      } else if (costSheetStateArray[ind] === "onetime_cost") {
        changedChangedChangedArray.onetime_cost = value;
      }
    }

    setState(state);
  };

  const [isShow, setIsShow] = useState({ show: false, id: "" });

  return (
    <center>
      {!formDataLoading ? (
        <div className="max-w-lg lg:max-w-5xl w-full bg-white dark:bg-dark rounded-md  p-5 flex flex-col  items-start justify-center mt-5">
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
          {/* <div className="flex justify-between w-full">
            <h3 className="text-left rounded-full text-xs text-rose-900 font-bold  bg-rose-100 p-1 px-3">
              Step 2
            </h3>
            <button
              className="p-1 px-2 bg-red rounded-md text-xs text-white"
              onClick={addMoreHandler}
            >
              {" "}
              + Add More
            </button>
          </div> */}

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
                  <div className="flex justify-end items-center gap-3">
                    <h2 className="flex-1">Cost Sheet - {index + 1}</h2>
                    {index !== 0 && (
                      <h2
                        className="flex-2 cursor-pointer"
                        onClick={() => deleteCostSheetHandler(index)}
                      >
                        <MdDelete size={"1.4rem"} className="text-red" />
                      </h2>
                    )}
                  </div>
                  <div className="flex flex-col p-2 gap-1 w-full max-w-md">
                    {/* <h2 className="text-left my-2 text-slate-500"></h2> */}
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
                      value={data.position || ""}
                      defaultValue={data.position || null}
                      onChange={(e) =>
                        selectChangeHandler(index, "position", e.target.value)
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
                      // value={data.nationality}
                      defaultValue={data.nationality || null}
                      onChange={(e) =>
                        selectChangeHandler(
                          index,
                          "nationality",
                          e.target.value
                        )
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
                      defaultValue={data.gender || null}
                      onChange={(e) => {
                        const errorElem =
                          document.getElementById(`quotation-gender`);
                        errorElem.style.display = "none";
                        selectChangeHandler(index, "gender", e.target.value);
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
                      defaultValue={data.quantity}
                      // value={data.quantity || ""}
                      onChange={(e) =>
                        selectChangeHandler(index, "quantity", e.target.value)
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
                                    placeholder="Enter value"
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
                                    required
                                    className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs"
                                    defaultValue={
                                      costSheetStateArray[ind] ===
                                      "monthly_cost"
                                        ? item.monthly_cost
                                        : item.onetime_cost
                                    }
                                    onChange={(e) => {
                                      const errorElem = document.getElementById(
                                        `quotation-${item.column_name}`
                                      );
                                      errorElem.style.display = "none";
                                      valueChangeHandler(
                                        index,
                                        ind,
                                        i,
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
                          <h2 className=" text-slate-500">
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
                                          step={"any"}
                                          name="Value"
                                          id="Value"
                                          placeholder="Enter value"
                                          className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs"
                                          defaultValue={
                                            costSheetStateArray[ind] ===
                                            "monthly_cost"
                                              ? item.monthly_cost
                                              : item.onetime_cost
                                          }
                                          onChange={(e) => {
                                            const errorElem =
                                              document.getElementById(
                                                `quotation-${item.column_name}`
                                              );
                                            errorElem.style.display = "none";
                                            valueChangeHandler(
                                              index,
                                              ind,
                                              i,
                                              e.target.value
                                            );
                                          }}
                                        />
                                        <p className="hidden">
                                          {justForStateChange}
                                        </p>
                                        <p
                                          id={`quotation-${item.column_name}`}
                                          className="hidden w-full h-5 bg-red/5 text-red text-xs"
                                        ></p>
                                      </div>
                                    </div>
                                    {/* <div className="flex flex-col  p-2 gap-1 w-full">
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
                                required
                                className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs"
                                defaultValue={item.short_description}
                                onChange={(e) => {
                                  const errorElem = document.getElementById(
                                    `quotation-${item.column_name}`
                                  );
                                  errorElem.style.display = "none";
                                  valueChangeHandler(
                                    index,
                                    ind,
                                    i,
                                    e.target.value,
                                    "description"
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
                      </React.Fragment>
                    );
                  })}
                  <button
                    className="p-1 px-2 mt-10 bg-red rounded-md text-xs text-white"
                    onClick={addMoreHandler}
                    type="button"
                  >
                    {" "}
                    + Add More
                  </button>
                </div>
              </React.Fragment>
            ))}

            <div className="p-2  w-full max-w-md flex gap-3">
              <button
                className="bg-black dark:bg-red w-full text-xs text-white rounded-md py-2 flex justify-center items-center gap-2"
                type="submit"
                disabled={submitFormLoading}
              >
                <p>Submit</p>
                {submitFormLoading ? (
                  <CgSpinner className="animate-spin" />
                ) : (
                  <HiArrowLongRight size={"1.2rem"} />
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex justify-center items-center gap-3 mt-5">
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
