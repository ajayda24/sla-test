import React, { useEffect, useState } from "react";
import { axios } from "../../../../Global";
import { setAppError } from "../../../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PromptElement from "../../PromptElement";
// import QuotationForm from "./QuotationForm";
import ListDataQuotation from "./ListDataContract";
import { printValidationError } from "../../../../utils/functions";
import { checkAccessFn } from "../../../../utils/checkAccess";
// import ContractModalElement from "./ContractModalElement";

export default function Contract() {
  const [showPromptElement, setShowPromptElement] = useState({
    open: false,
    id: null,
  });
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
  const [contractList, setContractList] = useState([]);
  const [addOrEdit, setAddOrEdit] = useState({
    open: false,
    method: "",
    loadedValues: {},
    editId: "",
  });

  const [contractState, setContractState] = useState({
    currentStep: 1,
    totalStep: 2,
    open: false,
    quotationId: "",
  });

  useEffect(() => {
    if (location.pathname.split("/")[3] === "create") {
      setAddOrEdit((p) => ({ ...p, open: true, method: "add" }));
      setCostSheetForm((p) => ({ ...p, open: false }));
    } else {
      setAddOrEdit((p) => ({ ...p, open: false }));
      setCostSheetForm((p) => ({ ...p, open: false }));
    }
  }, [location]);

  const token = localStorage.getItem("token");
  useEffect(() => {
    axios
      .get("/dashboard/contract", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setContractList(res.data.data);
      })
      .catch((err) => {
        dispatch(
          setAppError({
            msg: err.message,
          })
        );
      });
  }, [addOrEdit.open, loading.delete, contractState.open]);

  const submitForm = async (
    event,
    client,
    quotType,
    name,
    status,
    date,
    editing
  ) => {
    event.preventDefault();
    setSubmitFormLoading(true);
    try {
      let response;
      const body = {
        name,
        client_id: client,
        quotation_type_id: quotType,
      };
      if (addOrEdit.method === "add") {
        response = await axios.post(`/dashboard/quotation`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (addOrEdit.method === "edit") {
        response = await axios.put(
          `/dashboard/quotation/${addOrEdit.editId}`,
          { ...body, status: status, approved_date: date.transformed },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      const data = response.data.data;
      if (data) {
        navigate("/dashboard/quotation");

        dispatch(
          setAppError({
            msg: response.data.message,
            color: "bg-green-700",
          })
        );
        setSubmitFormLoading(false);
        setAddOrEdit((p) => ({ ...p, open: false }));
      }
    } catch (err) {
      printValidationError(err, "quotation");
      setSubmitFormLoading(false);

      dispatch(
        setAppError({
          msg: err.message,
        })
      );
    }
  };
  const cancelForm = () => {
    navigate("/dashboard/quotation");

    setAddOrEdit((p) => ({ ...p, open: false }));
  };
  const editData = async (id) => {
    navigate(`/dashboard/quotation/edit-quotation/${id}`);

    if (id) {
      setLoading((p) => ({ ...p, edit: true, loadingId: id }));
      try {
        const response = await axios.get(`/dashboard/quotation/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data.data;
        setLoading((p) => ({ ...p, edit: false, loadingId: "" }));
        setAddOrEdit((p) => ({
          ...p,
          open: true,
          method: "edit",
          loadedValues: data,
          editId: id,
        }));
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
        const response = await axios.delete(`/dashboard/quotation/${id}`, {
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
        setLoading((p) => ({ ...p, delete: false }));
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

  const addData = () => {
    setAddOrEdit((p) => ({ ...p, open: true, method: "add" }));

    // setClient("");
    // setQuotType("");
    // setDate("");
  };

  const [costSheetForm, setCostSheetForm] = useState({
    open: false,
    quotationId: null,
    method: null,
  });
  const showCostSheetWindowHandler = (id, method) => {
    setCostSheetForm((p) => ({
      ...p,
      open: true,
      quotationId: id,
      method: method,
    }));
  };

  const dashboardData = useSelector((state) => state.dashboardData);

  const checkAccess = (module, name) => {
    return checkAccessFn(dashboardData, module, name);
  };

  const contractModalHandler = (quotationId) => {
    setContractState((p) => ({
      ...p,
      open: true,
      currentStep: 1,
      quotationId: quotationId,
    }));
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
      {/* {contractState.open && (
        <ContractModalElement
          showPromptElement={contractState}
          setShowPromptElement={setContractState}
          contractModalHandler={contractModalHandler}
        />
      )} */}

      <div className="p-2  sm:p-5 ">
        {!addOrEdit.open && !costSheetForm.open && (
          <>
            {/* {checkAccess("Quotation", "quotation-create") ? (
              <Link to="/dashboard/quotation/create">
                <button
                  className="p-2 bg-red text-white rounded-md"
                  onClick={addData}
                >
                  Add New Quotation +
                </button>
              </Link>
            ) : (
              <button className="p-2  bg-slate-300 text-white rounded-md">
                {" "}
                Add New Quotation +
              </button>
            )} */}

            <ListDataQuotation
              list={contractList}
              editData={editData}
              deleteData={setShowPromptElement}
              loading={loading}
              titles={[
                "SL No.",
                "Contract. no.",
                "Quotation",
                "Client",
                "Status",
                "Company",
                "Contract Status",
                "Annexure Status",
                "COC Attestation",
                "Start Date",
                "End Date",
                "Action",
              ]}
              showCostSheetWindowHandler={showCostSheetWindowHandler}
              contractModalHandler={contractModalHandler}
            />
          </>
        )}
        {/* {addOrEdit.open && (
          <QuotationForm
            submitForm={submitForm}
            cancelForm={cancelForm}
            submitFormLoading={submitFormLoading}
            loadedValues={addOrEdit.method === "edit" && addOrEdit.loadedValues}
            editing={addOrEdit.method === "edit"}
          />
        )} */}
      </div>
    </>
  );
}
