import React, { useEffect, useState } from "react";
import ListData from "../../ListData";
import AddEditForm from "../../AddEditForm";
import { axios } from "../../../../Global";
import { setAppError } from "../../../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ListDataClient from "./ListDataClient";
// import useCRUD from "../../../hooks/useCRUD";
import PromptElement from "../../PromptElement";
import { printValidationError } from "../../../../utils/functions";
import { checkAccessFn } from "../../../../utils/checkAccess";

export default function Client(props) {
  const [showPromptElement, setShowPromptElement] = useState({
    open: false,
    id: null,
  });
  // const crud = useCRUD({ states: [{ value: clientId, update: setClientId }] });
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [submitFormLoading, setSubmitFormLoading] = useState(false);
  const [loading, setLoading] = useState({
    edit: false,
    delete: false,
    listData: false,
    loadingId: "",
  });
  const [clientList, setClientList] = useState([]);
  const [addOrEdit, setAddOrEdit] = useState({
    open: false,
    method: "",
    loadedValues: {},
    editId: "",
  });

  useEffect(() => {
    if (location.pathname.split("/")[3] === "create") {
      setAddOrEdit((p) => ({ ...p, open: true }));
    } else {
      setAddOrEdit((p) => ({ ...p, open: false }));
    }
  }, [location]);

  const [clientId, setClientId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [authorizedPersonName, setAuthorizedPersonName] = useState("");
  const [headOfficeLocation, setHeadOfficeLocation] = useState("");
  const [companyRegistration, setCompanyRegistration] = useState("");
  const [laborLicenseNumber, setLaborLicenseNumber] = useState("");
  const [sponsorName, setSponsorName] = useState("");
  const [sponsorId, setSponsorId] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [authorizedPersonDesignation, setAuthorizedPersonDesignation] = useState("");
  const [authorizedPersonContact, setAuthorizedPersonContact] = useState("");
  const [authorizedPersonEmail, setAuthorizedPersonEmail] = useState("");
  const [authorizedProjectRepresentativeName, setAuthorizedProjectRepresentativeName] = useState("");
  const [authorizedProjectRepresentativeDesignation, setAuthorizedProjectRepresentativeDesignation] = useState("");
  const [authorizedProjectRepresentativeContact, setAuthorizedProjectRepresentativeContact] = useState("");
  const [authorizedProjectRepresentativeEmail, setAuthorizedProjectRepresentativeEmail] = useState("");
  const [authorizedAccountsRepresentativeName, setAuthorizedAccountsRepresentativeName] = useState("");
  const [authorizedAccountsRepresentativeDesignation, setAuthorizedAccountsRepresentativeDesignation] = useState("");
  const [authorizedAccountsRepresentativeContact, setAuthorizedAccountsRepresentativeContact] = useState("");
  const [authorizedAccountsRepresentativeEmail, setAuthorizedAccountsRepresentativeEmail] = useState("");
  const [beneficiaryBank, setBeneficiaryBank] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankBranch, setBankBranch] = useState("");
  const [bankType, setBankType] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankIban, setBankIban] = useState("");

  const token = localStorage.getItem("token");
  useEffect(() => {
    axios
      .get("/dashboard/client", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setClientList(res.data.data);
      })
      .catch((err) => {
        dispatch(
          setAppError({
            msg: err.message,
          })
        );
      });
  }, [addOrEdit.open, loading.delete]);

  const submitForm = async (event) => {
    event.preventDefault();
    setSubmitFormLoading(true);
    try {
      let response;
      const body = {
        name,
        email,
        mobile,
        address,
        head_office_location: headOfficeLocation,
        company_registration: companyRegistration,
        labor_license_number: laborLicenseNumber,
        sponsor_name: sponsorName,
        sponsor_id: sponsorId,
        vat_number: vatNumber,
        authorized_person_name: authorizedPersonName,
        authorized_person_designation: authorizedPersonDesignation,
        authorized_person_contact: authorizedPersonContact,
        authorized_person_email: authorizedPersonEmail,
        authorized_project_representative_name: authorizedProjectRepresentativeName,
        authorized_project_representative_designation: authorizedProjectRepresentativeDesignation,
        authorized_project_representative_contact: authorizedProjectRepresentativeContact,
        authorized_project_representative_email: authorizedProjectRepresentativeEmail,
        authorized_accounts_representative_name: authorizedAccountsRepresentativeName,
        authorized_accounts_representative_designation: authorizedAccountsRepresentativeDesignation,
        authorized_accounts_representative_contact: authorizedAccountsRepresentativeContact,
        authorized_accounts_representative_email: authorizedAccountsRepresentativeEmail,
        beneficiary_bank: beneficiaryBank,
        bank_name: bankName,
        bank_branch: bankBranch,
        bank_type: bankType,
        bank_account_number: bankAccountNumber,
        bank_iban: bankIban,
      };
      if (addOrEdit.method === "add") {
        response = await axios.post(`/dashboard/client`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (addOrEdit.method === "edit") {
        response = await axios.put(`/dashboard/client/${addOrEdit.editId}`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      const data = response.data.data;
      if (data) {
        navigate("/dashboard/client");
        dispatch(
          setAppError({
            msg: response.data.message,
            color: "success",
          })
        );
        setSubmitFormLoading(false);
        setAddOrEdit((p) => ({ ...p, open: false }));
      }
    } catch (err) {
      printValidationError(err, "client");
      setSubmitFormLoading(false);
      dispatch(
        setAppError({
          msg: err.message,
        })
      );
    }
  };
  const cancelForm = () => {
    navigate("/dashboard/client");
    setAddOrEdit((p) => ({ ...p, open: false }));
  };
  const editData = async (id) => {
    navigate(`/dashboard/client/edit/${id}`);
    if (id) {
      setLoading((p) => ({ ...p, edit: true, loadingId: id }));
      try {
        const response = await axios.get(`/dashboard/client/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data.data;
        setLoading((p) => ({ ...p, edit: false, loadingId: "" }));
        setAddOrEdit((p) => ({
          ...p,
          open: true,
          method: "edit",
          // loadedValues: data,
          editId: id,
        }));
        setClientId(data.clientID);
        setName(data.name);
        setEmail(data.email);
        setMobile(data.mobile);
        setAddress(data.address);
        setHeadOfficeLocation(data.head_office_location);
        setCompanyRegistration(data.company_registration);
        setLaborLicenseNumber(data.labor_license_number);
        setSponsorName(data.sponsor_name);
        setSponsorId(data.sponsor_id);
        setVatNumber(data.vat_number);
        setAuthorizedPersonName(data.authorized_person_name);
        setAuthorizedPersonDesignation(data.authorized_person_designation);
        setAuthorizedPersonContact(data.authorized_person_contact);
        setAuthorizedPersonEmail(data.authorized_person_email);
        setAuthorizedProjectRepresentativeName(data.authorized_project_representative_name);
        setAuthorizedProjectRepresentativeDesignation(data.authorized_project_representative_designation);
        setAuthorizedProjectRepresentativeContact(data.authorized_project_representative_contact);
        setAuthorizedProjectRepresentativeEmail(data.authorized_project_representative_email);
        setAuthorizedAccountsRepresentativeName(data.authorized_accounts_representative_name);
        setAuthorizedAccountsRepresentativeDesignation(data.authorized_accounts_representative_designation);
        setAuthorizedAccountsRepresentativeContact(data.authorized_accounts_representative_contact);
        setAuthorizedAccountsRepresentativeEmail(data.authorized_accounts_representative_email);
        setBeneficiaryBank(data.beneficiary_bank);
        setBankName(data.bank_name);
        setBankBranch(data.bank_branch);
        setBankType(data.bank_type);
        setBankAccountNumber(data.bank_account_number);
        setBankIban(data.bank_iban);
      } catch (err) {
        dispatch(
          setAppError({
            msg: err.message,
          })
        );
      }
    }
  };
  const deleteData = async (id) => {
    if (id) {
      setLoading((p) => ({ ...p, delete: true, loadingId: id }));
      try {
        const response = await axios.delete(`/dashboard/client/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setLoading((p) => ({ ...p, delete: false, loadingId: "" }));
          dispatch(
            setAppError({
              msg: response.data.message,
              color: "bg-green-700",
            })
          );
        }
      } catch (err) {
        if (err?.response?.status === 403) {
          if (err?.response?.data?.message) {
            dispatch(
              setAppError({
                msg: err?.response?.data.message,
              })
            );
          }
        }
        setLoading((p) => ({ ...p, delete: false }));

        dispatch(
          setAppError({
            msg: err.message,
          })
        );
      }
    }
  };

  const addData = () => {
    setAddOrEdit((p) => ({ ...p, open: true, method: "add" }));
    setClientId("");
    setName("");
    setEmail("");
    setMobile("");
    setAddress("");
    setHeadOfficeLocation("");
    setCompanyRegistration("");
    setLaborLicenseNumber("");
    setSponsorName("");
    setSponsorId("");
    setVatNumber("");
    setAuthorizedPersonName("");
    setAuthorizedPersonDesignation("");
    setAuthorizedPersonContact("");
    setAuthorizedPersonEmail("");
    setAuthorizedProjectRepresentativeName("");
    setAuthorizedProjectRepresentativeDesignation("");
    setAuthorizedProjectRepresentativeContact("");
    setAuthorizedProjectRepresentativeEmail("");
    setAuthorizedAccountsRepresentativeName("");
    setAuthorizedAccountsRepresentativeDesignation("");
    setAuthorizedAccountsRepresentativeContact("");
    setAuthorizedAccountsRepresentativeEmail("");
    setBeneficiaryBank("");
    setBankName("");
    setBankBranch("");
    setBankType("");
    setBankAccountNumber("");
    setBankIban("");
  };

  const dashboardData = useSelector((state) => state.dashboardData);

  const checkAccess = (module, name) => {
    return checkAccessFn(dashboardData, module, name);
  };

  return (
    <>
      {showPromptElement.open && (
        <PromptElement
          showPromptElement={showPromptElement}
          setShowPromptElement={setShowPromptElement}
          deleteHandler={deleteData}
        />
      )}
      <div className={`p-2  sm:p-5 `}>
        {!addOrEdit.open && (
          <>
            {checkAccess("Client", "client-create") ? (
              <Link to="/dashboard/client/create">
                <button className="p-2 bg-red text-white rounded-md" onClick={addData}>
                  Add New Client +
                </button>
              </Link>
            ) : (
              <button className="p-2  bg-slate-300 text-white rounded-md"> Add New Client +</button>
            )}

            <ListDataClient
              list={clientList}
              editData={editData}
              deleteData={setShowPromptElement}
              loading={loading}
              column={5}
              titles={["SL No.", "Client Id", "Name", "Autorized Name", "Phone", "Action"]}
            />
          </>
        )}
        {addOrEdit.open && (
          <AddEditForm
            component="client"
            form={[
              {
                type: "text",
                text: "Name",
                name: "name",
                value: name,
                update: setName,
                columnName: "name",
              },
              {
                type: "email",
                text: "Email",
                name: "email",
                value: email,
                update: setEmail,
                columnName: "email",
              },
              {
                type: "tel",
                text: "Mobile No.",
                name: "mobile",
                value: mobile,
                update: setMobile,
                columnName: "mobile",
              },
              {
                type: "text",
                text: "Address",
                name: "address",
                value: address,
                update: setAddress,
                columnName: "address",
              },
              {
                type: "text",
                text: " Head Office Location",
                name: headOfficeLocation,
                value: headOfficeLocation,
                update: setHeadOfficeLocation,
                columnName: "head_office_location",
              },
              {
                type: "text",
                text: " Company Registration",
                name: companyRegistration,
                value: companyRegistration,
                update: setCompanyRegistration,
                columnName: "company_registration",
              },
              {
                type: "text",
                text: " Labor License Number",
                name: laborLicenseNumber,
                value: laborLicenseNumber,
                update: setLaborLicenseNumber,
                columnName: "labor_license_number",
              },
              {
                type: "text",
                text: " Sponsor Name",
                name: sponsorName,
                value: sponsorName,
                update: setSponsorName,
                columnName: "sponsor_name",
              },
              {
                type: "text",
                text: " Sponsor Id",
                name: sponsorId,
                value: sponsorId,
                update: setSponsorId,
                columnName: "sponsor_id",
              },
              {
                type: "text",
                text: " Vat Number",
                name: vatNumber,
                value: vatNumber,
                update: setVatNumber,
                columnName: "vat_number",
              },
              {
                type: "text",
                text: " Authorized Person Name",
                name: authorizedPersonName,
                value: authorizedPersonName,
                update: setAuthorizedPersonName,
                columnName: "authorized_person_name",
              },
              {
                type: "text",
                text: " Authorized Person Designation",
                name: authorizedPersonDesignation,
                value: authorizedPersonDesignation,
                update: setAuthorizedPersonDesignation,
                columnName: "authorized_person_designation",
              },
              {
                type: "text",
                text: " Authorized Person Contact",
                name: authorizedPersonContact,
                value: authorizedPersonContact,
                update: setAuthorizedPersonContact,
                columnName: "authorized_person_contact",
              },
              {
                type: "text",
                text: " Authorized Person Email",
                name: authorizedPersonEmail,
                value: authorizedPersonEmail,
                update: setAuthorizedPersonEmail,
                columnName: "authorized_person_email",
              },
              {
                type: "text",
                text: " Authorized Project Representative Name",
                name: authorizedProjectRepresentativeName,
                value: authorizedProjectRepresentativeName,
                update: setAuthorizedProjectRepresentativeName,
                columnName: "authorized_project_representative_name",
              },
              {
                type: "text",
                text: " Authorized Project Representative Designation",
                name: authorizedProjectRepresentativeDesignation,
                value: authorizedProjectRepresentativeDesignation,
                update: setAuthorizedProjectRepresentativeDesignation,
                columnName: "authorized_project_representative_designation",
              },
              {
                type: "text",
                text: " Authorized Project Representative Contact",
                name: authorizedProjectRepresentativeContact,
                value: authorizedProjectRepresentativeContact,
                update: setAuthorizedProjectRepresentativeContact,
                columnName: "authorized_project_representative_contact",
              },
              {
                type: "text",
                text: " Authorized Project Representative Email",
                name: authorizedProjectRepresentativeEmail,
                value: authorizedProjectRepresentativeEmail,
                update: setAuthorizedProjectRepresentativeEmail,
                columnName: "authorized_project_representative_email",
              },
              {
                type: "text",
                text: " Authorized Accounts Representative Name",
                name: authorizedAccountsRepresentativeName,
                value: authorizedAccountsRepresentativeName,
                update: setAuthorizedAccountsRepresentativeName,
                columnName: "authorized_accounts_representative_name",
              },
              {
                type: "text",
                text: " Authorized Accounts Representative Designation",
                name: authorizedAccountsRepresentativeDesignation,
                value: authorizedAccountsRepresentativeDesignation,
                update: setAuthorizedAccountsRepresentativeDesignation,
                columnName: "authorized_accounts_representative_designation",
              },
              {
                type: "text",
                text: " Authorized Accounts Representative Contact",
                name: authorizedAccountsRepresentativeContact,
                value: authorizedAccountsRepresentativeContact,
                update: setAuthorizedAccountsRepresentativeContact,
                columnName: "authorized_accounts_representative_contact",
              },
              {
                type: "text",
                text: " Authorized Accounts Representative Email",
                name: authorizedAccountsRepresentativeEmail,
                value: authorizedAccountsRepresentativeEmail,
                update: setAuthorizedAccountsRepresentativeEmail,
                columnName: "authorized_accounts_representative_email",
              },
              {
                type: "text",
                text: " Beneficiary Bank",
                name: beneficiaryBank,
                value: beneficiaryBank,
                update: setBeneficiaryBank,
                columnName: "beneficiary_bank",
              },
              {
                type: "text",
                text: " Bank Name",
                name: bankName,
                value: bankName,
                update: setBankName,
                columnName: "bank_name",
              },
              {
                type: "text",
                text: " Bank Branch",
                name: bankBranch,
                value: bankBranch,
                update: setBankBranch,
                columnName: "bank_branch",
              },
              {
                type: "text",
                text: " Bank Type",
                name: bankType,
                value: bankType,
                update: setBankType,
                columnName: "bank_type",
              },
              {
                type: "text",
                text: " Bank Account Number",
                name: bankAccountNumber,
                value: bankAccountNumber,
                update: setBankAccountNumber,
                columnName: "bank_account_number",
              },
              {
                type: "text",
                text: " Bank Iban",
                name: bankIban,
                value: bankIban,
                update: setBankIban,
                columnName: "bank_iban",
              },
            ]}
            submitForm={submitForm}
            cancelForm={cancelForm}
            submitFormLoading={submitFormLoading}
            loadedValues={addOrEdit.method === "edit" && addOrEdit.loadedValues}
          />
        )}
      </div>
    </>
  );
}
