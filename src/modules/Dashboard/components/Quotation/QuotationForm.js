import { axios } from "../../../../Global";
import React, { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { HiArrowLongRight } from "react-icons/hi2";

export default function QuotationForm({ submitForm, submitFormLoading, loadedValues, editing }) {
  const [loading, setLoading] = useState(true);

  const statusOptions = [
    { id: 1, name: "Draft" },
    { id: 2, name: "Pending" },
    { id: 3, name: "Approved" },
    { id: 4, name: "Rejected" },
  ];
  const [date, setDate] = useState({
    transformed: "",
    original: "",
  });
  const [status, setStatus] = useState();
  const [clientOptions, setClientOptions] = useState([]);
  const [quotationTypeOptions, setQuotationTypeOptions] = useState([]);
  const [client, setClient] = useState();
  const [quotType, setQuotType] = useState();
  const [companyOptions, setCompanyOptions] = useState([]);
  const [company, setCompany] = useState([]);
  const [sectorOptions, setSectorOptions] = useState([]);
  const [sector, setSector] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [source, setSource] = useState([]);
  const [name, setName] = useState(loadedValues.name || "");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (loadedValues) {
      setName(loadedValues.name);
      setClient(loadedValues.client_id);
      setCompany(loadedValues.company_id);
      setSector(loadedValues.sector_id);
      setSource(loadedValues.source_id);
      setQuotType(loadedValues.quotation_type_id);
      setDate((p) => ({
        ...p,
        original: loadedValues?.approved_date?.split("-").reverse().join("-") || "",
      }));
    }
  }, [loadedValues, clientOptions, quotationTypeOptions,companyOptions,sourceOptions,sectorOptions]);
  useEffect(() => {
    axios
      .get(`/dashboard/quotation-input-value`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setLoading(false);
        if (res.data?.data) {
          setClientOptions(res.data.data.client);
          setCompanyOptions(res.data.data.company);
          setSourceOptions(res.data.data.source);
          setSectorOptions(res.data.data.sector);
          setQuotationTypeOptions(res.data.data.quotation_type);
        }
      })
      .catch((err) => {});
  }, []);

  return (
    <div className="flex flex-col justify-center items-center bg-white dark:bg-dark rounded-md py-5">
      <h2 className="text-xl font-semibold">Quotation Form</h2>
      {!loading ? (
        <form
          method="POST"
          onSubmit={(event) => submitForm(event, client, company, sector,source,quotType, name, status, date, editing)}
          className="w-full  flex flex-col items-center justify-center"
        >
          <div className="flex flex-col p-2 gap-1 w-full max-w-md">
            <label htmlFor={`addOrEdit-name`} className="text-xs ">
              Name
            </label>
            <input
              type="text"
              name="name"
              id={`addOrEdit-name`}
              required
              className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs"
              value={name}
              onChange={(e) => {
                const errorElem = document.getElementById(`quotation-name`);
                errorElem.style.display = "none";
                setName(e.target.value);
              }}
              placeholder="Enter a name"
            />
            <p id={`quotation-name`} className="hidden w-full h-5 bg-red/5 text-red text-xs"></p>
          </div>
          <div className="flex flex-col p-2 gap-1 w-full max-w-md">
            <label htmlFor={`addOrEdit-`} className="text-xs ">
              Select Client
            </label>

            <select
              name="client"
              id={`addOrEdit-client`}
              required
              className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs"
              value={client}
              defaultValue={loadedValues.client_id}
              onChange={(e) => {
                const errorElem = document.getElementById(`quotation-client_id`);
                errorElem.style.display = "none";
                setClient(e.target.value);
              }}
            >
              {loadedValues.client_id ? (
                <option value="" hidden disabled>
                  Select a client
                </option>
              ) : (
                <option value="" selected hidden disabled>
                  Select a client
                </option>
              )}
              {clientOptions.map((cl) => (
                <option key={cl.id} value={cl.id} id={`client-${cl.id}`}>
                  {cl.name}
                </option>
              ))}
            </select>
            <p id={`quotation-client_id`} className="hidden w-full h-5 bg-red/5 text-red text-xs"></p>
          </div>
          <div className="flex flex-col p-2 gap-1 w-full max-w-md">
            <label htmlFor={`addOrEdit-`} className="text-xs ">
              Select Company
            </label>

            <select
              name="company"
              id={`addOrEdit-company`}
              
              className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs"
              value={company}
              defaultValue={loadedValues.company_id}
              onChange={(e) => {
                const errorElem = document.getElementById(`quotation-company_id`);
                errorElem.style.display = "none";
                setCompany(e.target.value);
              }}
            >
              {loadedValues.company_id ? (
                <option value="" hidden disabled>
                  Select a Company
                </option>
              ) : (
                <option value="" selected hidden disabled>
                  Select a Company
                </option>
              )}
              {companyOptions.map((com) => (
                <option key={com.id} value={com.id} id={`company-${com.id}`}>
                  {com.name}
                </option>
              ))}
            </select>
            <p id={`quotation-company_id`} className="hidden w-full h-5 bg-red/5 text-red text-xs"></p>
          </div>
          <div className="flex flex-col p-2 gap-1 w-full max-w-md">
            <label htmlFor={`addOrEdit-`} className="text-xs ">
              Select Source
            </label>

            <select
              name="source"
              id={`addOrEdit-source`}
              
              className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs"
              value={source}
              defaultValue={loadedValues.source_id}
              onChange={(e) => {
                const errorElem = document.getElementById(`quotation-source_id`);
                errorElem.style.display = "none";
                setSource(e.target.value);
              }}
            >
              {loadedValues.source_id ? (
                <option value="" hidden disabled>
                  Select a Source
                </option>
              ) : (
                <option value="" selected hidden disabled>
                  Select a Source
                </option>
              )}
              {sourceOptions.map((sou) => (
                <option key={sou.id} value={sou.id} id={`source-${sou.id}`}>
                  {sou.name}
                </option>
              ))}
            </select>
            <p id={`quotation-source_id`} className="hidden w-full h-5 bg-red/5 text-red text-xs"></p>
          </div>
          <div className="flex flex-col p-2 gap-1 w-full max-w-md">
            <label htmlFor={`addOrEdit-`} className="text-xs ">
              Select Sector
            </label>

            <select
              name="sector"
              id={`addOrEdit-sector`}
              
              className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs"
              value={sector}
              defaultValue={loadedValues.sector_id}
              onChange={(e) => {
                const errorElem = document.getElementById(`quotation-sector_id`);
                errorElem.style.display = "none";
                setSector(e.target.value);
              }}
            >
              {loadedValues.sector_id ? (
                <option value="" hidden disabled>
                  Select a Sector
                </option>
              ) : (
                <option value="" selected hidden disabled>
                  Select a Sector
                </option>
              )}
              {sectorOptions.map((sec) => (
                <option key={sec.id} value={sec.id} id={`sector-${sec.id}`}>
                  {sec.name}
                </option>
              ))}
            </select>
            <p id={`quotation-sector_id`} className="hidden w-full h-5 bg-red/5 text-red text-xs"></p>
          </div>
          <div className="flex flex-col p-2 gap-1 w-full max-w-md">
            <label htmlFor={`addOrEdit-quotType`} className="text-xs ">
              Select Quotation Type
            </label>

            <select
              name="quotType"
              id={`addOrEdit-quotType`}
              required
              className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs"
              value={quotType}
              defaultValue={loadedValues.quotation_type_id}
              onChange={(e) => {
                const errorElem = document.getElementById(`quotation-quotation_type_id`);
                errorElem.style.display = "none";
                setQuotType(e.target.value);
              }}
            >
              {loadedValues.quotation_type_id ? (
                <option value="" hidden disabled>
                  Select Quotation Type
                </option>
              ) : (
                <option value="" selected hidden disabled>
                  Select Quotation Type
                </option>
              )}
              {quotationTypeOptions.map((cl) => (
                <option key={cl.id} value={cl.id} id={`quotType-${cl.id}`}>
                  {cl.name}
                </option>
              ))}
            </select>
            <p id={`quotation-quotation_type_id`} className="hidden w-full h-5 bg-red/5 text-red text-xs"></p>
          </div>
          {editing && (
            <div className="flex flex-col p-2 gap-1 w-full max-w-md">
              <label htmlFor={`addOrEdit-quotType`} className="text-xs ">
                Select Status
              </label>

              <select
                name="quotType"
                id={`addOrEdit-quotType`}
                required
                className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs"
                value={status}
                defaultValue={loadedValues.status}
                onChange={(e) => {
                  const errorElem = document.getElementById(`quotation-status`);
                  errorElem.style.display = "none";
                  setStatus(e.target.value);
                }}
              >
                <option value="" hidden disabled>
                  Select Status
                </option>
                {statusOptions.map((cl) => (
                  <option key={cl.id} value={cl.name} id={`quotType-${cl.id}`}>
                    {cl.name}
                  </option>
                ))}
              </select>
              <p id={`quotation-status`} className="hidden w-full h-5 bg-red/5 text-red text-xs"></p>
            </div>
          )}
          {editing && (
            <div className="flex flex-col p-2 gap-1 w-full max-w-md">
              <label htmlFor={`addOrEdit-date`} className="text-xs ">
                Approved Date
              </label>
              <input
                type="date"
                name="date"
                id={`addOrEdit-date`}
                // required
                className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs"
                value={date.original}
                onChange={(e) => {
                  const errorElem = document.getElementById(`quotation-approved_date`);
                  errorElem.style.display = "none";
                  const ddmmyyyy = new Date(e.target.value).toJSON().slice(0, 10).split("-").reverse().join("-");
                  setDate({ transformed: ddmmyyyy, original: e.target.value });
                }}
              />
              <p id={`quotation-approved_date`} className="hidden w-full h-5 bg-red/5 text-red text-xs"></p>
            </div>
          )}

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
  );
}
