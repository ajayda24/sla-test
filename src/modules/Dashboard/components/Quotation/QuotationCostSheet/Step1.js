import React, { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { HiArrowLongRight } from "react-icons/hi2";

export default function QuotationCostSheetStep1({ step1SubmitHandler, quotationType }) {
  const [submitFormLoading, setSubmitFormLoading] = useState(false);

  const [govtFee, setGovtFee] = useState("monthly_cost");

  const [salaryAllowance, setSalaryAllowance] = useState("monthly_cost");
  const [slaFees, setSlaFees] = useState("monthly_cost");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    if (quotationType === "Cost Plus") {
      setGovtFee("onetime_cost");
    }
  }, [quotationType]);

  //call api for loop content

  // const [step1State, setStep1State] = useState({
  //   govtFee: "One-Time",
  //   salaryAllowance: "Monthly",
  //   slaFees: "Monthly",
  // });

  //call in api loads
  // setStep1State(p=>({...p,other data}))

  const submitForm = (event) => {
    event.preventDefault();
    setSubmitFormLoading(true);
    step1SubmitHandler(govtFee, salaryAllowance, slaFees);
    setSubmitFormLoading(false);
  };

  return (
    <center>
      <div className="max-w-lg lg:max-w-2xl w-full bg-white dark:bg-dark rounded-md  p-5 flex flex-col  items-start justify-center">
        <h2 className="text-2xl self-center font-bold mb-10">Quotation Cost Sheet</h2>
        <div className="max-w-md mx-auto w-full flex flex-col">
          <h3 className="text-left rounded-full text-xs text-rose-900 font-bold  bg-rose-100 p-1 px-6 w-fit">Step 1</h3>
          <h3 className="font-semibold text-left  m-1 my-3">Select Rate Category / Fees Cost Type </h3>
        </div>
        {!loading ? (
          <form
            method="POST"
            onSubmit={(event) => submitForm(event)}
            className="w-full  flex flex-col items-center justify-center"
          >
            <div className="flex flex-col p-2 gap-1 w-full max-w-md">
              <h2 className="text-left my-2 text-slate-500">1. Government Fees</h2>
              <label htmlFor={`addOrEdit-govtfee`} className="text-xs text-left">
                Select Cost Type
              </label>

              <select
                name="govtFee"
                id={`addOrEdit-govtFee`}
                required
                className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs"
                value={govtFee}
                onChange={(e) => {
                  const errorElem = document.getElementById(`quotation-government_fee_type`);
                  errorElem.style.display = "none";
                  setGovtFee(e.target.value);
                }}
              >
                <option value="onetime_cost">One-time</option>
                <option value="monthly_cost">Monthly</option>
              </select>
              <p id={`quotation-government_fee_type`} className="hidden w-full h-5 bg-red/5 text-red text-xs"></p>
            </div>
            <div className="flex flex-col p-2 gap-1 w-full max-w-md">
              <h2 className="text-left my-2 text-slate-500">2. Salary and Allowance</h2>
              <label htmlFor={`addOrEdit-govtfee`} className="text-xs text-left">
                Select Cost Type
              </label>

              <select
                name="salaryAllowance"
                id={`addOrEdit-salaryAllowance`}
                required
                className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs"
                value={salaryAllowance}
                onChange={(e) => {
                  const errorElem = document.getElementById(`quotation-salary_and_allowance_fee_type`);
                  errorElem.style.display = "none";
                  setSalaryAllowance(e.target.value);
                }}
              >
                <option value="monthly_cost">Monthly</option>
                <option value="onetime_cost">One-time</option>
              </select>
              <p
                id={`quotation-salary_and_allowance_fee_type`}
                className="hidden w-full h-5 bg-red/5 text-red text-xs"
              ></p>
            </div>
            <div className="flex flex-col p-2 gap-1 w-full max-w-md">
              <h2 className="text-left my-2 text-slate-500">3. SLA Fees</h2>
              <label htmlFor={`addOrEdit-govtfee`} className="text-xs text-left">
                Select Cost Type
              </label>

              <select
                name="slaFees"
                id={`addOrEdit-slaFees`}
                required
                className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs"
                value={slaFees}
                onChange={(e) => {
                  const errorElem = document.getElementById(`quotation-soundline_fee_type`);
                  errorElem.style.display = "none";
                  setSlaFees(e.target.value);
                }}
              >
                <option value="monthly_cost">Monthly</option>
                <option value="onetime_cost">One-time</option>
              </select>
              <p id={`quotation-soundline_fee_type`} className="hidden w-full h-5 bg-red/5 text-red text-xs"></p>
            </div>

            <div className="p-2  w-full max-w-md flex gap-3">
              <button
                className="bg-black dark:bg-red w-full text-xs text-white rounded-md py-2 flex justify-center items-center gap-2"
                type="submit"
                disabled={submitFormLoading}
              >
                <p>Submit</p>
                {submitFormLoading ? <CgSpinner className="animate-spin" /> : <HiArrowLongRight size={"1.2rem"} />}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex justify-center items-center gap-3 mt-5 w-full col-span-7">
            <p>Loading</p>
            <CgSpinner className="animate-spin" />
          </div>
        )}
      </div>
    </center>
  );
}
