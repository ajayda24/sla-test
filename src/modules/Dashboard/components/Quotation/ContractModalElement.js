import React, { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { IoMdClose } from "react-icons/io";
import { TiInfoOutline, TiTick } from "react-icons/ti";
import { axios } from "../../../../Global";
import { useDispatch } from "react-redux";
import { setAppError } from "../../../../store/userSlice";

export default function ContractModalElement({
  showPromptElement,
  setShowPromptElement,
  contractModalHandler,
}) {
  const [step1Data, setStep1Data] = useState({
    company: "",
    source: "",
    sector: "",
  });
  return (
    <div
      className={`fixed z-50 top-0 left-0 min-w-full min-h-screen bg-black/50  justify-center items-center ${
        showPromptElement.open ? "flex" : "hidden"
      }`}
    >
      {showPromptElement.currentStep === 1 && !showPromptElement.close && (
        <Step1
          setShowPromptElement={setShowPromptElement}
          setStep1Data={setStep1Data}
          showPromptElement={showPromptElement}
        />
      )}
      {showPromptElement.currentStep === 2 && !showPromptElement.close && (
        <Step2
          showPromptElement={showPromptElement}
          setShowPromptElement={setShowPromptElement}
          step1Data={step1Data}
        />
      )}
      {showPromptElement.currentStep === "success" &&
        !showPromptElement.close && (
          <StepSuccess setShowPromptElement={setShowPromptElement} />
        )}
      {showPromptElement.close && (
        <StepClose setShowPromptElement={setShowPromptElement} />
      )}
    </div>
  );
}

const Step1 = ({
  setShowPromptElement,
  setStep1Data,
  contractModalHandler,
  showPromptElement,
}) => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [companyList, setCompanyList] = useState([]);
  const [sourceList, setSourceList] = useState([]);
  const [sectorList, setSectorList] = useState([]);
  const [quotationDetails, setQuotationDetails] = useState([]);

  useEffect(() => {
    axios
      .get(
        `/dashboard/quotation-to-contract-conversion-inputValue/${showPromptElement.quotationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        const {
          quotation = {},
          company = [],
          sector = [],
          source = [],
        } = res.data.data;
        setQuotationDetails(quotation);
        setCompanyList(company);
        setSectorList(sector);
        setSourceList(source);

        const details = quotation;
        if (details) {
          if (details?.company || details?.source || details?.sector) {
            setStep1Data((p) => ({
              ...p,
              company: details?.company?.id,
              source: details?.source?.id,
              sector: details?.sector?.id,
            }));
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        dispatch(
          setAppError({
            msg: err.message,
          })
        );
      });
  }, []);

  // useEffect(() => {
  //   axios
  //     .get(`/dashboard/quotation/${showPromptElement.quotationId}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     .then((res) => {
  //       setQuotationDetails(res.data.data);
  //       const details = res.data.data;
  //       if (details) {
  //         if (details?.company || details?.source || details?.sector) {
  //           setStep1Data((p) => ({
  //             ...p,
  //             company: details?.company?.id,
  //             source: details?.source?.id,
  //             sector: details?.sector?.id,
  //           }));
  //         }
  //       }
  //     })
  //     .catch((err) => {
  //       dispatch(
  //         setAppError({
  //           msg: err.message,
  //         })
  //       );
  //     });
  //   axios
  //     .get("https://sla.torcdeveloper.com/api/v1/dashboard/company", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     .then((res) => {
  //       setCompanyList(res.data.data);
  //     })
  //     .catch((err) => {
  //       dispatch(
  //         setAppError({
  //           msg: err.message,
  //         })
  //       );
  //     });
  //   axios
  //     .get("https://sla.torcdeveloper.com/api/v1/dashboard/source", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     .then((res) => {
  //       setSourceList(res.data.data);
  //     })
  //     .catch((err) => {
  //       dispatch(
  //         setAppError({
  //           msg: err.message,
  //         })
  //       );
  //     });
  //   axios
  //     .get("https://sla.torcdeveloper.com/api/v1/dashboard/sector", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     .then((res) => {
  //       setLoading(false);
  //       setSectorList(res.data.data);
  //     })
  //     .catch((err) => {
  //       setLoading(false);
  //       dispatch(
  //         setAppError({
  //           msg: err.message,
  //         })
  //       );
  //     });
  // }, []);

  return (
    <div className="max-w-xl w-full h-auto min-h-[20rem]  rounded-md bg-white/95 flex  flex-col p-4 relative">
      {!loading ? (
        <>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-xl font-semibold">Create Contract</h1>
            <h1
              className="text-md font-semibold cursor-pointer"
              onClick={() => {
                setShowPromptElement((p) => ({ ...p, close: true }));
              }}
            >
              <IoMdClose />
            </h1>
          </div>
          <h2 className="text-sm">Create a new contract for your project.</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();

              setShowPromptElement((p) => ({ ...p, currentStep: 2 }));
            }}
          >
            <div className="flex flex-col w-full">
              <label htmlFor="" className="px-1">
                Select company
              </label>
              <select
                name="company"
                className=" w-full my-5 select select-bordered select-md"
                onChange={(e) =>
                  setStep1Data((p) => ({ ...p, company: e.target.value }))
                }
                required
                defaultValue={quotationDetails?.company?.name}
              >
                {quotationDetails.company ? (
                  <>
                    {companyList.map((l, i) => (
                      <option
                        key={i}
                        value={l.id}
                        selected={
                          quotationDetails.company?.name === l.name
                            ? true
                            : false
                        }
                      >
                        {l.name}
                      </option>
                    ))}
                  </>
                ) : (
                  <>
                    <option value="" disabled hidden>
                      Select one company
                    </option>
                    {companyList.map((l, i) => (
                      <option key={i} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
            <div className="flex w-full justify-evenly gap-3">
              <div className="flex flex-col w-full">
                <label htmlFor="" className="px-1">
                  Select source
                </label>
                <select
                  required
                  name="source"
                  className="   select select-bordered select-md"
                  onChange={(e) =>
                    setStep1Data((p) => ({ ...p, source: e.target.value }))
                  }
                  defaultValue={quotationDetails?.source?.name}
                >
                  {quotationDetails.source ? (
                    <>
                      {sourceList.map((l, i) => (
                        <option
                          key={i}
                          value={l.id}
                          selected={
                            quotationDetails.source?.name === l.name
                              ? "selected"
                              : ""
                          }
                        >
                          {l.name}
                        </option>
                      ))}
                    </>
                  ) : (
                    <>
                      <option value="" disabled hidden>
                        Select source
                      </option>
                      {sourceList.map((l, i) => (
                        <option key={i} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
              <div className="w-full flex flex-col">
                <label htmlFor="" className="px-1">
                  Select sector
                </label>

                <select
                  required
                  name="sector"
                  className="  select select-bordered select-md"
                  onChange={(e) =>
                    setStep1Data((p) => ({ ...p, sector: e.target.value }))
                  }
                  defaultValue={quotationDetails?.sector?.name}
                >
                  {quotationDetails.sector ? (
                    <>
                      {sectorList.map((l, i) => (
                        <option
                          key={i}
                          value={l.id}
                          selected={
                            quotationDetails.sector?.name === l.name
                              ? "selected"
                              : ""
                          }
                        >
                          {l.name}
                        </option>
                      ))}
                    </>
                  ) : (
                    <>
                      <option value="" disabled hidden>
                        Select sector
                      </option>
                      {sectorList.map((l, i) => (
                        <option key={i} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="flex gap-3 min-w-fit m-5 justify-center">
              <button
                className="p-2 w-full rounded-md ring-1 ring-slate-600"
                onClick={() => {
                  setShowPromptElement((p) => ({ ...p, close: true }));
                }}
              >
                Cancel
              </button>
              <button
                className="p-2 w-full rounded-md ring-1 ring-red text-white bg-red"
                type="submit"
              >
                {loading ? (
                  <CgSpinner className="animate-spin mx-auto" />
                ) : (
                  "Next"
                )}
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="flex justify-center items-center gap-3 mt-5 w-full">
          <p>Loading</p>
          <CgSpinner className="animate-spin" />
        </div>
      )}
    </div>
  );
};

const Step2 = ({ setShowPromptElement, showPromptElement, step1Data }) => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({});
  const [quotationDetails, setQuotationDetails] = useState({});
  useEffect(() => {
    axios
      .get(
        `https://sla.torcdeveloper.com/api/v1/dashboard/company/${step1Data.company}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        // setLoading(false);
        setCompanyDetails(res.data.data);
      })
      .catch((err) => {
        dispatch(
          setAppError({
            msg: err.message,
          })
        );
      });
    axios
      .get(
        `https://sla.torcdeveloper.com/api/v1/dashboard/quotation/${showPromptElement.quotationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setLoading(false);
        setQuotationDetails(res.data.data);
      })
      .catch((err) => {
        setLoading(false);
        dispatch(
          setAppError({
            msg: err.message,
          })
        );
      });
  }, [step1Data]);

  const [costSheetData, setCostSheetData] = useState([]);
  const [submitData, setSubmitData] = useState({
    source_id: step1Data.source,
    sector_id: step1Data.sector,
    company_id: step1Data.company,
    costsheets: costSheetData,
  });
  useEffect(() => {
    setCostSheetData(quotationDetails.quotation_cost_sheet);
  }, [quotationDetails]);

  const valueChangeHandler = (id, value) => {
    const unchangedArray = costSheetData.filter((s) => s.id !== id);
    const changedArray = costSheetData.find((s) => s.id === id);
    changedArray.quantity = value;
    setCostSheetData([...unchangedArray, changedArray]);
  };
  useEffect(() => {
    setSubmitData({
      source_id: step1Data.source,
      sector_id: step1Data.sector,
      company_id: step1Data.company,
      costsheets: costSheetData,
    });
  }, [costSheetData, step1Data]);

  const submitFormHandler = async () => {
    console.log(submitData);
    try {
      setSubmitLoading(true);
      const response = await axios.post(
        `https://sla.torcdeveloper.com/api/v1/dashboard/quotation-to-contract-conversion/${showPromptElement.quotationId}`,
        submitData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSubmitLoading(false);
      if (response.status === 200) {
        console.log(response.data);
        dispatch(
          setAppError({
            msg: response.data.message,
            color: "bg-green-700",
          })
        );
        setShowPromptElement((p) => ({ ...p, currentStep: "success" }));
      }
    } catch (err) {
      setSubmitLoading(false);
      dispatch(
        setAppError({
          msg: err.message,
        })
      );
    }
  };
  return (
    <div className="max-w-xl w-full h-auto min-h-[20rem]  rounded-md bg-white/95 flex  flex-col p-4 relative">
      {!loading ? (
        <>
          <div className="flex justify-between items-center w-full">
            <h1 className="text-xl font-semibold">Setup Company </h1>
            <h1
              className="text-md font-semibold cursor-pointer"
              onClick={() => {
                setShowPromptElement((p) => ({ ...p, close: true }));
              }}
            >
              <IoMdClose />
            </h1>
          </div>
          <h2 className="text-sm">Input details of your company.</h2>
          <div className="ring-1 ring-slate-200 rounded-md w-full p-3 text-sm flex flex-col gap-5 my-4">
            <div>
              <div className="flex ">
                <h2 className="w-full">Company Name </h2>
                <h2 className="w-full">Company ID </h2>
              </div>
              <div className="flex  text-sm font-semibold">
                <h2 className="w-full">{companyDetails.name}</h2>
                <h2 className="w-full">{companyDetails.company_id}</h2>
              </div>
            </div>
            <div>
              <div className="flex ">
                <h2 className="w-full">Sponsor Name </h2>
                <h2 className="w-full">Sponsor ID </h2>
              </div>
              <div className="flex  text-sm font-semibold">
                <h2 className="w-full">{companyDetails.sponsor_name}</h2>
                <h2 className="w-full">{companyDetails.sponsor_id}</h2>
              </div>
            </div>
          </div>
          <h2 className="font-semibold my-2">Setup Cost Sheet</h2>
          <div className="flex flex-col gap-3 overflow-y-scroll h-56">
            {quotationDetails.quotation_cost_sheet.length > 0 &&
              quotationDetails.quotation_cost_sheet.map((costSheet, i) => (
                <div key={i} className="rounded-md ring-1 ring-slate-200 p-4">
                  <div className="flex w-full justify-evenly gap-3">
                    <div className="flex flex-col w-full">
                      <label htmlFor="" className="px-1 text-xs">
                        Job Position
                      </label>
                      <select
                        name="position"
                        className="my-1 select select-bordered select-sm select-disabled  pointer-events-none"
                        defaultValue={`${costSheet.job_position.name}`}
                      >
                        <option
                          value={costSheet.job_position.name}
                          disabled
                          selected
                          hidden
                        >
                          {costSheet.job_position.name}
                        </option>
                      </select>
                    </div>
                    <div className="w-full flex flex-col">
                      <label htmlFor="" className="px-1 text-xs">
                        Nationality
                      </label>

                      <select
                        name="nationality"
                        className="my-1  select select-bordered select-sm select-disabled  pointer-events-none"
                        defaultValue={`${costSheet.nationality.name}`}
                      >
                        <option
                          value={costSheet.nationality.name}
                          disabled
                          selected
                          hidden
                        >
                          {costSheet.nationality.name}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="flex w-full justify-evenly gap-3 mt-4">
                    <div className="flex flex-col w-full">
                      <label htmlFor="" className="px-1 text-xs">
                        Assigned Quantity
                      </label>
                      <input
                        type="text"
                        className="my-1 input input-bordered input-sm"
                        defaultValue={costSheet.quantity}
                        onChange={(e) =>
                          valueChangeHandler(costSheet.id, e.target.value)
                        }
                      />
                    </div>
                    <div className="w-full flex flex-col">
                      <label htmlFor="" className="px-1 text-xs">
                        Required Quantity
                      </label>

                      <input
                        type="text"
                        className=" my-1 input input-bordered input-sm "
                        disabled
                        defaultValue={costSheet.quantity}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="flex gap-3 min-w-fit mt-5 justify-center">
            <button
              className="p-2 w-full rounded-md ring-1 ring-slate-600"
              onClick={() => {
                setShowPromptElement((p) => ({ ...p, currentStep: 1 }));
              }}
              disabled={submitLoading}
            >
              Previous Step
            </button>
            <button
              className="p-2 w-full rounded-md ring-1 ring-red text-white bg-red"
              onClick={submitFormHandler}
              disabled={submitLoading}
            >
              {submitLoading ? (
                <CgSpinner className="animate-spin mx-auto" />
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center gap-3 mt-5 w-full ">
          <p>Loading</p>
          <CgSpinner className="animate-spin" />
        </div>
      )}
    </div>
  );
};

const StepSuccess = ({ setShowPromptElement }) => {
  return (
    <div className="max-w-md w-full h-auto   rounded-md bg-white/95 flex  flex-col gap-5 p-4 relative">
      <div className="flex justify-end items-center w-full">
        <h1
          className="text-md font-semibold cursor-pointer"
          onClick={() => {
            setShowPromptElement((p) => ({ open: false }));
          }}
        >
          <IoMdClose />
        </h1>
      </div>
      <div className="flex flex-col gap-1 items-center">
        <TiTick
          className="text-center rounded-full text-green-700 ring-2 ring-green-300"
          size={"1rem"}
        />
        <h1 className="text-center font-semibold">
          {" "}
          Contract Created Successfully
        </h1>
        <h2 className="text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, a?
        </h2>
      </div>
      <button
        className="p-2 w-full rounded-md ring-1 ring-red text-white bg-red"
        onClick={async () => {
          setShowPromptElement((p) => ({ open: false }));
        }}
      >
        Okay
      </button>
    </div>
  );
};
const StepClose = ({ setShowPromptElement }) => {
  return (
    <div className="max-w-md w-full h-auto   rounded-md bg-white/95 flex  flex-col p-4 relative items-center">
      <TiInfoOutline className="text-center text-red" size={"3rem"} />
      <h2 className="text-2xl p-4 pb-1 text-center">Are you sure ?</h2>
      <p>You won't be able to revert this!</p>
      <div className="flex gap-3 min-w-fit m-5">
        <button
          className="p-2 w-20 rounded-md ring-1 ring-slate-600"
          onClick={() => {
            setShowPromptElement((p) => ({ ...p, close: false }));
          }}
        >
          Back
        </button>
        <button
          className="p-2 w-20 rounded-md ring-1 ring-red text-white bg-red"
          onClick={async () => {
            setShowPromptElement((p) => ({ open: false }));
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};
