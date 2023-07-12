import React, { useEffect, useState } from "react";
import AddEditForm from "../../AddEditForm";
import { axios } from "../../../../Global";
import { setAppError } from "../../../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PromptElement from "../../PromptElement";
import ListDataTermsAndCondition from "./ListDataTermsAndCondition";
import AddEditFormTermsAndCondition from "./AddEditFormTermsAndCondition";
import { printValidationError } from "../../../../utils/functions";
import { checkAccessFn } from "../../../../utils/checkAccess";

export default function TermsAndCondition(props) {
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
  const [clientList, setClientList] = useState([]);
  const [addOrEdit, setAddOrEdit] = useState({
    open: false,
    method: "",
    loadedValues: {},
    editId: "",
  });

  useEffect(() => {
    if (location.pathname.split("/")[3] === "create") {
      setAddOrEdit((p) => ({ ...p, open: true, method: "add" }));
    } else {
      setAddOrEdit((p) => ({ ...p, open: false }));
    }
  }, [location]);

  const [particulars, setParticulars] = useState("");
  const [remarks, setRemarks] = useState("");

  const token = localStorage.getItem("token");
  useEffect(() => {
    axios
      .get("/dashboard/terms-and-condition", {
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
        particulars,
        remarks,
      };
      if (addOrEdit.method === "add") {
        response = await axios.post(`/dashboard/terms-and-condition`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (addOrEdit.method === "edit") {
        response = await axios.put(`/dashboard/terms-and-condition/${addOrEdit.editId}`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      const data = response.data.data;
      if (data) {
        navigate("/dashboard/terms-and-condition");
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
      console.log(err);
      printValidationError(err, "termsAndCondition");
      setSubmitFormLoading(false);
      dispatch(
        setAppError({
          msg: err.message,
        })
      );
    }
  };
  const cancelForm = () => {
    navigate("/dashboard/terms-and-condition");
    setAddOrEdit((p) => ({ ...p, open: false }));
  };
  const editData = async (id) => {
    navigate(`/dashboard/terms-and-condition/edit/${id}`);
    if (id) {
      setLoading((p) => ({ ...p, edit: true, loadingId: id }));
      try {
        const response = await axios.get(`/dashboard/terms-and-condition/${id}`, {
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
        setParticulars(data.particulars);
        setRemarks(data.remarks);
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
    console.log("get here", id);
    if (id) {
      setLoading((p) => ({ ...p, delete: true, loadingId: id }));
      try {
        const response = await axios.delete(`/dashboard/terms-and-condition/${id}`, {
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
        console.log(err);
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
    setRemarks("");
    setParticulars("");
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
            {checkAccess("Quotation", "terms-and-conditions-create") ? (
              <Link to="/dashboard/terms-and-condition/create">
                <button className="p-2 bg-red text-white rounded-md" onClick={addData}>
                  Add New Terms +
                </button>
              </Link>
            ) : (
              <button className="p-2  bg-slate-300 text-white rounded-md"> Add New Terms +</button>
            )}

            <ListDataTermsAndCondition
              list={clientList}
              editData={editData}
              deleteData={setShowPromptElement}
              loading={loading}
              column={4}
              titles={["SL No.", "Particulars", "Remarks", "Action"]}
            />
          </>
        )}
        {addOrEdit.open && (
          <AddEditFormTermsAndCondition
            form={[
              {
                type: "text",
                text: "Particulars",
                name: "particulars",
                value: particulars,
                update: setParticulars,
                columnName: "particulars",
              },
              {
                type: "textarea",
                text: "Remarks",
                name: "remarks",
                value: remarks,
                update: setRemarks,
                columnName: "remarks",
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
