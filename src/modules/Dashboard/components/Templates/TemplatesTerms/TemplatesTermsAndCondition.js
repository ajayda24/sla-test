import React, { useEffect, useState } from "react";
import { axios } from "../../../../../Global";
import { setAppError } from "../../../../../store/userSlice";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PromptElement from "../../../PromptElement";
import ListDataTermsAndCondition from "../../TermsAndCondition/ListDataTermsAndCondition";
import AddEditFormTermsAndCondition from "../../TermsAndCondition/AddEditFormTermsAndCondition";
import { printValidationError } from "../../../../../utils/functions";

export default function TemplatesTermsAndCondition(props) {
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
    if (location.pathname.split("/")[5] === "create") {
      setAddOrEdit((p) => ({ ...p, open: true, method: "add" }));
    } else {
      setAddOrEdit((p) => ({ ...p, open: false }));
    }
  }, [location]);

  const [particulars, setParticulars] = useState("");
  const [remarks, setRemarks] = useState("");

  const token = localStorage.getItem("token");
  const termsId = location.pathname.split("/").at(3);

  useEffect(() => {
    axios
      .get(`/dashboard/terms_templates-list/${termsId}`, {
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
        remark: remarks,
        template_terms_and_condition_id: termsId,
      };
      console.log(body);
      if (addOrEdit.method === "add") {
        response = await axios.post(`/dashboard/terms_templates`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (addOrEdit.method === "edit") {
        console.log(addOrEdit);
        response = await axios.put(
          `/dashboard/terms_templates/${addOrEdit.editId}`,
          { particulars, remark: remarks },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      const data = response.data.data;
      if (data) {
        navigate(`/dashboard/templates/${termsId}/terms`);
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
    navigate(`/dashboard/quotation/${termsId}/terms`);

    setAddOrEdit((p) => ({ ...p, open: false }));
  };
  const editData = async (id) => {
    navigate(`/dashboard/templates/${termsId}/terms/edit/${id}`);

    if (id) {
      setLoading((p) => ({ ...p, edit: true, loadingId: id }));
      try {
        const response = await axios.get(`/dashboard/terms_templates/${id}`, {
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
        setRemarks(data.remark);
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
        const response = await axios.delete(
          `/dashboard/terms_templates/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
            <Link to={`/dashboard/templates/${termsId}/terms/create`}>
              <button
                className="p-2 bg-red text-white rounded-md"
                onClick={addData}
              >
                Add New Terms +
              </button>
            </Link>
            <ListDataTermsAndCondition
              list={clientList}
              editData={editData}
              deleteData={setShowPromptElement}
              loading={loading}
              column={4}
              titles={["SL No.", "Particulars", "Remarks", "Action"]}
              component="quotation-terms"
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
