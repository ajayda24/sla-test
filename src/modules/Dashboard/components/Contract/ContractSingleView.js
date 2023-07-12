import React, { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { axios } from "../../../../Global";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAppError } from "../../../../store/userSlice";
import { BiDotsVerticalRounded, BiEdit, BiHide, BiShow } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import ContractCostSheetEdit from "./ContractCostSheetEdit";
import ContractFileUpload from "./ContractFileUpload";
import ContractAdvancedSecurityTable from "./ContractAdvancedSecurity";
import ProceedToProject from "./ProceedToProjectPopup";

export default function ContractSingleView() {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { contractId } = useParams();
  const [contractDetails, setContractDetails] = useState({});
  const [updateComponent, setUpdateComponent] = useState(false);
 
  

  const [contractCostSheetState, setContractCostSheetState] = useState({
    open: false,
    costSheetId: "",
  });
  const [contractFileUploadState, setContractFileUploadState] = useState({
    open: false,
    contractId: contractId,
  });
  const [proceedToProjectState, setProceedToProjectState] = useState({
    open: false,
    projectType: "",
  });

  const proceedToProjectHandler = (contractId) => {
    setProceedToProjectState((p) => ({
      ...p,
      open: true,
    }));
  };
  const contractCostSheetModalHandler = (costSheetId) => {
    const currentCostSheet = contractDetails.contract_cost_sheet.find(
      (e) => e.id === costSheetId
    );
    setContractCostSheetState((p) => ({
      ...p,
      open: true,
      costSheetId: costSheetId,
      currentCostSheet: currentCostSheet,
    }));
  };

  

  useEffect(() => {
    axios
      .get(
        `https://sla.torcdeveloper.com/api/v1/dashboard/contract/${contractId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        console.log(res.data);
        if (res.data.data) {
          setContractDetails(res.data.data);
          setLoading(false);
        } else {
          throw new Error("Data not found.");
        }
      })
      .catch((err) => {
        dispatch(
          setAppError({
            msg: err.message,
          })
        );
        navigate("/dashboard/contract");
        setLoading(false);
      });
  }, [updateComponent,proceedToProjectState]);

  const downloadFile = async (type) => {
    try {
      const response = await axios.get(
        `/dashboard/contract-file-download/${type}/${contractId}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${type} PDF`);
        document.body.appendChild(link);
        link.click();
        dispatch(
          setAppError({
            msg: "PDF Downloaded",
            color: "success",
          })
        );
      } else {
        throw new Error("Something went wrong!");
      }
    } catch (err) {
      console.log(err);
      dispatch(
        setAppError({
          msg: err.message,
        })
      );
    }
  };

  
  return (
    <>
      {proceedToProjectState.open && (
        <ProceedToProject
          showPromptElement={proceedToProjectState}
          setShowPromptElement={setProceedToProjectState}
          setProceedToProjectState={setProceedToProjectState}
          proceedToProjectHandler={proceedToProjectHandler}
          contractId={contractId}
        />
      )}
      {contractCostSheetState.open && (
        <ContractCostSheetEdit
          showPromptElement={contractCostSheetState}
          setShowPromptElement={setContractCostSheetState}
          updateComponent={setUpdateComponent}
        />
      )}
      {contractFileUploadState.open && (
        <ContractFileUpload
          showPromptElement={contractFileUploadState}
          setShowPromptElement={setContractFileUploadState}
          updateComponent={setUpdateComponent}
        />
      )}
      {!loading ? (
        <div className="p-5">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-semibold text-lg">
                Contract - {contractDetails.contract_id}
              </h1>
              <h2 className="text-sm">
                View details of the contract, get confirmation and then proceed
                to project.
              </h2>
            </div>
            <div className="flex justify-center items-center gap-2">
              <div className="min-w-fit">
                {contractDetails?.project_contract == null ? (
                  <button className="rounded-md bg-red p-2 min-w-fit text-sm text-white peer">
                    Proceed to Project
                  </button>
                ) : (
                  <Link
                    to={`/dashboard/project/${contractDetails?.project_contract?.project_id}`}
                  >
                    <button className="rounded-md bg-red p-2 min-w-fit text-sm text-white">
                      View Project
                    </button>
                  </Link>
                )}
                <div className="hidden absolute top-32 right-5 max-w-xs w-[17rem] h-auto bg-white shadow-md rounded-lg p-2 dark:bg-dark2 ring-1 ring-slate-400 dark:ring-black peer-hover:block hover:block">
                  <button
                    onClick={() =>
                      setProceedToProjectState((p) => ({
                        ...p,
                        open: true,
                        projectType: "new",
                      }))
                    }
                    className="w-full"
                  >
                    <p className="bg-white shadow-sm  p-2 w-full mb-1 hover:bg-red rounded-md hover:text-white dark:bg-dark2 dark:hover:bg-red flex items-center gap-3">
                      Create new Project
                    </p>
                  </button>
                  <button
                    onClick={() =>
                      setProceedToProjectState((p) => ({
                        ...p,
                        open: true,
                        contractId: "",
                        projectType: "old",
                      }))
                    }
                    className="w-full"
                  >
                    <p className="bg-white p-2 w-full hover:bg-red rounded-md hover:text-white dark:bg-dark2 dark:hover:bg-red flex items-center gap-3">
                      Add to existing Project
                    </p>
                  </button>
                </div>
              </div>

              <div className="w-full">
                <button className="rounded-md bg-white p-2 text-sm text-black peer ">
                  <BiDotsVerticalRounded size={"1.4rem"} />
                </button>
                <div className="hidden absolute top-32 right-5 max-w-xs w-[17rem] h-auto bg-white shadow-md rounded-lg p-2 dark:bg-dark2 ring-1 ring-slate-400 dark:ring-black peer-hover:block hover:block">
                  <button
                    onClick={() => downloadFile("contract")}
                    className="w-full"
                  >
                    <p className="bg-white shadow-sm  p-2 w-full mb-1 hover:bg-red rounded-md hover:text-white dark:bg-dark2 dark:hover:bg-red flex items-center gap-3">
                      Download Contract
                    </p>
                  </button>
                  <button
                    onClick={() => downloadFile("annexure")}
                    className="w-full"
                  >
                    <p className="bg-white p-2 w-full hover:bg-red rounded-md hover:text-white dark:bg-dark2 dark:hover:bg-red flex items-center gap-3">
                      Download Annexure
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <ContractViewFirstTable
            contractDetails={contractDetails}
            contractId={contractId}
            updateComponent={setUpdateComponent}
          />

          <h1 className="text-lg font-semibold mt-6">More Details</h1>
          <div className="p-2">
            <ContractCompanyDetailsTable contractDetails={contractDetails} />
          </div>
          <div className="p-2">
            <ContractClientDetailsTable contractDetails={contractDetails} />
          </div>
          <div className="p-2">
            <ContractFilesTable
              contractDetails={contractDetails}
              updateComponent={setUpdateComponent}
              setContractFileUploadState={setContractFileUploadState}
            />
          </div>
          <div className="p-2">
            <ContractAdvancedSecurityTable
              contractDetails={contractDetails}
              updateComponent={setUpdateComponent}
              contractId={contractId}
            />
          </div>
          <div className="p-2">
            <ContractCostSheetTable
              contractDetails={contractDetails}
              contractCostSheetModalHandler={contractCostSheetModalHandler}
              updateComponent={setUpdateComponent}
            />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center gap-3 mt-5 w-full ">
          <p>Loading</p>
          <CgSpinner className="animate-spin" />
        </div>
      )}
    </>
  );
}

const ContractViewFirstTable = ({
  contractDetails,
  contractId,
  updateComponent,
}) => {
  const dispatch = useDispatch();
  const [arr, setArr] = useState([
    {
      title: "Status",
      value: contractDetails.status,
      editable: true,
      options: ["Active", "Inactive"],
    },
    {
      title: "Quotation Type",
      value: contractDetails.quotation_type?.name,
      editable: false,
      type: "text",
    },
    {
      title: "Quotation Name",
      value: contractDetails.quotation?.name,
      editable: false,
      type: "text",
    },
    {
      title: "Source",
      value: contractDetails.source?.name,
      editable: false,
      type: "text",
    },
    {
      title: "Sector",
      value: contractDetails.sector?.name,
      editable: false,
      type: "text",
    },
    {
      title: "Start Date",
      value: contractDetails.start_date,
      editable: true,
      type: "date",
      changed: false,
    },
    {
      title: "End Date",
      value: contractDetails.end_date,
      editable: true,
      type: "date",
      changed: false,
    },
    {
      title: "Contract Status",
      value: contractDetails.contract_status,
      editable: true,
      options: [
        "SIGNED",
        "NOT SIGNED",
        "UNDER PROCESS",
        "SENT TO CLIENT",
        "AWAITING CONFIRMATION",
      ],
    },
    {
      title: "Annexure Status",
      value: contractDetails.annexure_status,
      editable: true,
      options: [
        "SIGNED",
        "NOT SIGNED",
        "UNDER PROCESS",
        "SENT TO CLIENT",
        "AWAITING CONFIRMATION",
      ],
    },
    {
      title: "Original Received",
      value: contractDetails.orginal_received,
      editable: true,
      options: ["YES", "NO"],
    },
    {
      title: "COC Attestation",
      value: contractDetails.coc_attestation,
      editable: true,
      options: ["YES", "NO", "FIRST PARTY DONE", "BOTH PARTIES DONE", "NA"],
    },
    {
      title: "Visa Cost Received",
      value: contractDetails.visa_cost_received,
      editable: true,
      options: ["YES", "NO", "NA"],
    },
    {
      title: "Man Power",
      value: contractDetails.manpower,
      editable: true,
      options: ["Active", "Inactive"],
    },
    {
      title: "Security Deposit Received",
      value: contractDetails.security_deposit_received,
      editable: true,
      options: ["YES", "NO", "NA"],
    },
    {
      title: "Term",
      value: contractDetails.term,
      editable: true,
      type: "text",
    },
    {
      title: "Remark",
      value: contractDetails.remark,
      editable: true,
      type: "text",
    },
  ]);
  const formatDate = (date) => {
    return String(date).split("-").reverse().join("-");
  };

  const [editField, setEditField] = useState(false);
  const token = localStorage.getItem("token");

  const submitHandler = async () => {
    console.log(arr.find((e) => e.title === "Start Date"));
    const body = {
      status: arr.find((e) => e.title === "Status")?.value,
      remark: arr.find((e) => e.title === "Remark")?.value,
      term: arr.find((e) => e.title === "Term")?.value,
      start_date: arr.find((e) => e.title === "Start Date").value,
      end_date: arr.find((e) => e.title === "End Date").value,
      contract_status: arr.find((e) => e.title === "Contract Status").value,
      annexure_status: arr.find((e) => e.title === "Annexure Status").value,
      orginal_received: arr.find((e) => e.title === "Original Received").value,
      coc_attestation: arr.find((e) => e.title === "COC Attestation").value,
      visa_cost_received: arr.find((e) => e.title === "Visa Cost Received")
        .value,
      manpower: arr.find((e) => e.title === "Man Power").value,
      security_deposit_received: arr.find(
        (e) => e.title === "Security Deposit Received"
      ).value,
    };
    console.log(body);
    try {
      const response = await axios.put(
        `https://sla.torcdeveloper.com/api/v1/dashboard/contract/${contractId}`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setEditField(false);
        updateComponent((p) => !p);
        dispatch(
          setAppError({
            msg: "Successfully edited.",
            color: "success",
          })
        );
      }
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) {
        if (err.response?.data?.validation_error) {
          for (let i in err.response?.data?.validation_error) {
            dispatch(
              setAppError({
                msg: err.response?.data?.validation_error[i],
              })
            );
          }
        }
      }
      dispatch(
        setAppError({
          msg: err.message,
        })
      );
    }
  };

  return (
    <div className="bg-slate-50 shadow-md rounded-lg my-4 p-5 px-2 flex flex-col items-center">
      {!editField && (
        <div className="flex gap-3 justify-end w-full">
          <button
            className="bg-blue p-2 w-24 text-white rounded-md flex gap-3 justify-center items-center"
            onClick={() => setEditField((p) => !p)}
          >
            Edit
            <BiEdit size={"1.3rem"} />
          </button>
        </div>
      )}
      <div className="flex flex-wrap gap-10 ">
        {arr.map((elem, i) => (
          <div key={i} className="p-3 flex flex-col gap-2">
            <h2 className="font-semibold">{elem.title}</h2>
            {elem.type ? (
              <input
                type={elem.type}
                value={
                  elem.type === "date" ? formatDate(elem.value) : elem.value
                }
                className="input input-sm pl-1 input-bordered"
                disabled={elem.editable ? !editField : true}
                onChange={(e) =>
                  setArr((p) => {
                    const changedValue = p.find((e) => e.title === elem.title);
                    if (elem.type === "date") {
                      changedValue.value = formatDate(e.target.value);
                      changedValue.changed = true;
                    } else if (elem.type === "text") {
                      changedValue.value = e.target.value;
                    }
                    const changedValueIndex = p.findIndex(
                      (e) => e.title === elem.title
                    );
                    const nonChangedValue = p.filter(
                      (e) => e.title !== elem.title
                    );
                    nonChangedValue.splice(changedValueIndex, 0, changedValue);

                    return nonChangedValue;
                  })
                }
              />
            ) : (
              <select
                type="text"
                defaultValue={`${elem.value}` || "--"}
                className="select select-sm pl-1 select-bordered"
                disabled={!editField}
                onChange={(e) =>
                  setArr((p) => {
                    const changedValue = p.find((e) => e.title === elem.title);
                    changedValue.value = e.target.value;

                    const changedValueIndex = p.findIndex(
                      (e) => e.title === elem.title
                    );
                    const nonChangedValue = p.filter(
                      (e) => e.title !== elem.title
                    );
                    nonChangedValue.splice(changedValueIndex, 0, changedValue);

                    return nonChangedValue;
                  })
                }
              >
                {!elem.type &&
                  elem?.options?.map((o, i) => (
                    <option
                      key={i}
                      value={o}
                      selected={elem.value === o ? "selected" : ""}
                    >
                      {o}
                    </option>
                  ))}
              </select>
            )}
          </div>
        ))}
      </div>
      {editField && (
        <button
          className="bg-red rounded-md p-2 max-w-sm w-full m-3 text-white "
          onClick={submitHandler}
        >
          Submit
        </button>
      )}
    </div>
  );
};

const ContractCompanyDetailsTable = ({ contractDetails }) => {
  const [show, setShow] = useState(false);
  return (
    <>
      <div className="flex items-center gap-2">
        <h1 className="text-md font-semibold my-2">Company Details</h1>
        <button
          className=" text-sm rounded-md p-2 px-5 flex gap-3 justify-start items-center"
          onClick={() => setShow((p) => !p)}
        >
          {show ? <BiHide size={"1.2rem"} /> : <BiShow size={"1.2rem"} />}
        </button>
      </div>
      <div
        className={`flex flex-wrap gap-10 bg-slate-50 shadow-md rounded-lg px-1 transition-all  ${
          show ? "overflow-auto py-5 h-auto my-4" : "overflow-hidden py-0 h-0"
        } `}
      >
        {[
          {
            title: "Company ID",
            value: contractDetails.company_id,
          },
          {
            title: "Name",
            value: contractDetails.company?.name,
          },
          {
            title: "Logo",
            value: contractDetails.company?.logo,
            image: true,
          },
          {
            title: "Email",
            value: contractDetails.company?.email,
          },
          {
            title: "Mobile",
            value: contractDetails.company?.mobile,
          },
          {
            title: "Address",
            value: contractDetails.company?.address,
          },
          {
            title: "Sponsor ID",
            value: contractDetails.company?.sponsor_id,
          },
          {
            title: "Sponsor Name",
            value: contractDetails.company?.sponsor_name,
          },
          {
            title: "Authorized Accounts Representative Contact",
            value:
              contractDetails.company
                ?.authorized_accounts_representative_contact,
          },
          {
            title: "Authorized Accounts Representative Designation",
            value:
              contractDetails.company
                ?.authorized_accounts_representative_designation,
          },
          {
            title: "Authorized Accounts Representative Email",
            value:
              contractDetails.company?.authorized_accounts_representative_email,
          },
          {
            title: "Authorized Accounts Representative Name",
            value:
              contractDetails.company?.authorized_accounts_representative_name,
          },
          {
            title: "Authorized Person Contact",
            value: contractDetails.company?.authorized_person_contact,
          },
          {
            title: "Authorized Person Designation",
            value: contractDetails.company?.authorized_person_designation,
          },
          {
            title: "Authorized Person Email",
            value: contractDetails.company?.authorized_person_email,
          },
          {
            title: "Authorized Person Name",
            value: contractDetails.company?.authorized_person_name,
          },
          {
            title: "Authorized Project Representative Contact",
            value:
              contractDetails.company
                ?.authorized_project_representative_contact,
          },
          {
            title: "Authorized Project Representative Designation",
            value:
              contractDetails.company
                ?.authorized_project_representative_designation,
          },
          {
            title: "Authorized Project Representative Email",
            value:
              contractDetails.company?.authorized_project_representative_email,
          },
          {
            title: "Authorized Project Representative Name",
            value:
              contractDetails.company?.authorized_project_representative_name,
          },
          {
            title: "Bank Account Number",
            value: contractDetails.company?.bank_account_number,
          },
          {
            title: "Bank Branch",
            value: contractDetails.company?.bank_branch,
          },
          {
            title: "Bank Iban",
            value: contractDetails.company?.bank_iban,
          },
          {
            title: "Bank Name",
            value: contractDetails.company?.bank_name,
          },
          {
            title: "Bank Type",
            value: contractDetails.company?.bank_type,
          },
          {
            title: "Beneficiary Bank",
            value: contractDetails.company?.beneficiary_bank,
          },
        ].map((elem, i) => (
          <div key={i} className="p-3 flex flex-col gap-2">
            <h2 className="font-semibold">{elem.title}</h2>
            {elem.image ? (
              <img src={`${elem.value}`} alt={elem.title} width={"100px"} />
            ) : (
              <p>{elem.value || "--"}</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
const ContractClientDetailsTable = ({ contractDetails }) => {
  const [show, setShow] = useState(false);
  return (
    <>
      <div className="flex items-center gap-2">
        <h1 className="text-md font-semibold my-2">Client Details</h1>
        <button
          className=" text-sm rounded-md p-2 px-5 flex gap-3 justify-start items-center"
          onClick={() => setShow((p) => !p)}
        >
          {show ? <BiHide size={"1.2rem"} /> : <BiShow size={"1.2rem"} />}
        </button>
      </div>
      <div
        className={`flex flex-wrap gap-10 bg-slate-50 shadow-md rounded-lg px-1 transition-all  ${
          show ? "overflow-auto py-5 h-auto my-4" : "overflow-hidden py-0 h-0"
        } `}
      >
        {[
          {
            title: "Client ID",
            value: contractDetails.client_id,
          },
          {
            title: "Name",
            value: contractDetails.client?.name,
          },
          {
            title: "Logo",
            value: contractDetails.client?.logo,
            image: true,
          },
          {
            title: "Email",
            value: contractDetails.client?.email,
          },
          {
            title: "Mobile",
            value: contractDetails.client?.mobile,
          },
          {
            title: "Address",
            value: contractDetails.client?.address,
          },
          {
            title: "Head Office Location",
            value: contractDetails.client?.head_office_location,
          },
          {
            title: "Sponsor ID",
            value: contractDetails.client?.sponsor_id,
          },
          {
            title: "Sponsor Name",
            value: contractDetails.client?.sponsor_name,
          },
          {
            title: "Authorized Accounts Representative Contact",
            value:
              contractDetails.client
                ?.authorized_accounts_representative_contact,
          },
          {
            title: "Authorized Accounts Representative Designation",
            value:
              contractDetails.client
                ?.authorized_accounts_representative_designation,
          },
          {
            title: "Authorized Accounts Representative Email",
            value:
              contractDetails.client?.authorized_accounts_representative_email,
          },
          {
            title: "Authorized Accounts Representative Name",
            value:
              contractDetails.client?.authorized_accounts_representative_name,
          },
          {
            title: "Authorized Person Contact",
            value: contractDetails.client?.authorized_person_contact,
          },
          {
            title: "Authorized Person Designation",
            value: contractDetails.client?.authorized_person_designation,
          },
          {
            title: "Authorized Person Email",
            value: contractDetails.client?.authorized_person_email,
          },
          {
            title: "Authorized Person Name",
            value: contractDetails.client?.authorized_person_name,
          },
          {
            title: "Authorized Project Representative Contact",
            value:
              contractDetails.client?.authorized_project_representative_contact,
          },
          {
            title: "Authorized Project Representative Designation",
            value:
              contractDetails.client
                ?.authorized_project_representative_designation,
          },
          {
            title: "Authorized Project Representative Email",
            value:
              contractDetails.client?.authorized_project_representative_email,
          },
          {
            title: "Authorized Project Representative Name",
            value:
              contractDetails.client?.authorized_project_representative_name,
          },
          {
            title: "Bank Account Number",
            value: contractDetails.client?.bank_account_number,
          },
          {
            title: "Bank Branch",
            value: contractDetails.client?.bank_branch,
          },
          {
            title: "Bank Iban",
            value: contractDetails.client?.bank_iban,
          },
          {
            title: "Bank Name",
            value: contractDetails.client?.bank_name,
          },
          {
            title: "Bank Type",
            value: contractDetails.client?.bank_type,
          },
          {
            title: "Beneficiary Bank",
            value: contractDetails.client?.beneficiary_bank,
          },
        ].map((elem, i) => (
          <div key={i} className="p-3 flex flex-col gap-2">
            <h2 className="font-semibold">{elem.title}</h2>
            {elem.image ? (
              <img src={`${elem.value}`} alt={elem.title} width={"100px"} />
            ) : (
              <p>{elem.value || "--"}</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

const ContractFilesTable = ({
  contractDetails,
  setContractFileUploadState,
}) => {
  const [show, setShow] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState("Contract File");
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);

  useEffect(() => {
    if (contractDetails.contract_file?.length > 0) {
      const files = contractDetails.contract_file?.filter(
        (f) => f.type === selectedFileType
      );
      setFilteredFiles(files);
    }
  }, [selectedFileType, contractDetails]);

  return (
    <>
      <div className="flex items-center gap-2">
        <h1 className="text-md font-semibold my-2">Files</h1>
        <button
          className=" text-sm rounded-md p-2 px-5 flex gap-3 justify-start items-center"
          onClick={() => setShow((p) => !p)}
        >
          {show ? <BiHide size={"1.2rem"} /> : <BiShow size={"1.2rem"} />}
        </button>
      </div>
      <div
        className={` bg-slate-50 shadow-md rounded-lg px-1 transition-all w-full min-w-full  ${
          show ? "py-5 h-auto my-4" : "overflow-hidden py-0 h-0"
        } `}
      >
        <div className="flex flex-wrap  min-w-full w-full gap-1 items-center bg-slate-200 p-2 rounded-md">
          {[
            "Contract File",
            "COC File",
            "Other",
            "Annexure File",
            "Security Deposit File",
            "VISA Cost File",
          ].map((e, i) => (
            <button
              key={i}
              className={`p-2 rounded-md  ${
                selectedFileType === e
                  ? "bg-red text-white"
                  : "bg-white text-black"
              }`}
              onClick={() => {
                setFilesLoading(true);
                setSelectedFileType(e);
                setTimeout(() => {
                  setFilesLoading(false);
                }, 500);
              }}
            >
              {e}
            </button>
          ))}
        </div>
        <div className="flex justify-end p-3">
          <button
            className="p-2 rounded-md bg-red text-white my-2 self-end"
            onClick={() =>
              setContractFileUploadState((p) => ({ ...p, open: true }))
            }
          >
            Upload File
          </button>
        </div>
        <div
          className={`grid justify-items-center grid-cols-table-5 auto-cols-min gap-5 p-6 bg-white   items-baseline w-full overflow-x-scroll lg:overflow-auto  rounded-md `}
        >
          {["Sl No.", "File Name", "File Type", "Description", "Action"].map(
            (t, index) => (
              <p key={index} className="font-semibold uppercase">
                {t}
              </p>
            )
          )}
          {filesLoading && (
            <div className="flex justify-center items-center gap-3 mt-5 w-full col-span-5">
              <p>Loading</p>
              <CgSpinner className="animate-spin" />
            </div>
          )}
          {filteredFiles?.map((l, index) => (
            <React.Fragment key={index}>
              {!filesLoading && (
                <>
                  <p>{Number(index) + 1}</p>
                  <p>{l.file_name} </p>

                  <p>{l.type}</p>
                  <p>{l.description}</p>
                  <div className="flex gap-3 min-w-fit ">
                    {/* {checkAccess("Contract", "company-edit") ? ( */}
                    <a
                      href={l.file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="p-1 px-2 rounded-md ring-1 ">
                        <BiShow size={"1.4rem"} />
                      </button>
                    </a>
                    <button className="p-1 px-2 rounded-md ring-1 bg-red text-white ">
                      <MdDeleteOutline size={"1.4rem"} />
                    </button>
                  </div>
                </>
              )}

              <hr className="border-[1.5px] border-slate-100  w-full col-span-5" />
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

const ContractCostSheetTable = ({
  contractDetails,
  contractCostSheetModalHandler,
}) => {
  const [show, setShow] = useState(false);

  const list = contractDetails?.contract_cost_sheet || [];
  const titles = [
    "Sl No.",
    "Job Position",
    "Nationality",
    "Quantity",
    "VISA Fee",
    "Basic & Food",
    "Action",
  ];

  return (
    <>
      <div className="flex items-center gap-2">
        <h1 className="text-md font-semibold my-2">Cost Sheet</h1>
        <button
          className=" text-sm rounded-md p-2 px-5 flex gap-3 justify-start items-center"
          onClick={() => setShow((p) => !p)}
        >
          {show ? <BiHide size={"1.2rem"} /> : <BiShow size={"1.2rem"} />}
        </button>
      </div>
      <div
        className={` bg-slate-50 shadow-md rounded-lg px-1 transition-all w-full min-w-full  ${
          show ? "py-5 h-auto my-4" : "overflow-hidden py-0 h-0"
        } `}
      >
        <div
          className={`grid justify-items-center grid-cols-table-7 auto-cols-min gap-5 p-6 bg-white w-full overflow-x-scroll lg:overflow-auto items-baseline max-w-lg sm:max-w-sm md:max-w-prose lg:max-w-none rounded-md `}
        >
          {titles.map((t, index) => (
            <p key={index} className="font-semibold uppercase">
              {t}
            </p>
          ))}
          {list.length <= 0 && (
            <div className="flex justify-center items-center gap-3 mt-5 w-full col-span-7">
              <p>Loading</p>
              <CgSpinner className="animate-spin" />
            </div>
          )}
          {list.map((data, index) => (
            <React.Fragment key={index}>
              <p>#{index + 1}</p>
              <p>{data.job_position?.name}</p>

              <p>{data.nationality?.name} </p>

              <p>{data.quantity}</p>
              <p>{data.visa_fee}</p>
              <p>{Number(data.food) + Number(data.basic)}</p>

              <div className="flex gap-3 min-w-fit ">
                <button
                  className="p-1 px-2 rounded-md ring-1 ring-slate-300"
                  onClick={() => contractCostSheetModalHandler(data.id)}
                >
                  <CiEdit size={"1.4rem"} color="black" />
                </button>
              </div>
              <hr className="border-[1.5px] border-slate-100  w-full col-span-7" />
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};
