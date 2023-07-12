import React, { useEffect, useState } from "react";
import ListData from "../../ListData";
import AddEditForm from "../../AddEditForm";
import { axios } from "../../../../Global";
import { setAppError } from "../../../../store/userSlice";
import { useDispatch } from "react-redux";
import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import ListDataTemplates from "./ListDataTemplates";
import usePrompt from "../../../../utils/usePrompt";
import PromptElement from "../../PromptElement";
import { printValidationError } from "../../../../utils/functions";
import TemplatesTermsAndCondition from "./TemplatesTerms/TemplatesTermsAndCondition";
import TemplatesNotes from "./TemplatesNotes/TemplatesNotes";

export default function Templates() {
  const [showPromptElement, setShowPromptElement] = useState({
    open: false,
    id: null,
  });
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
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

  const [templatesTable, setTemplatesTable] = useState({
    templateId: "",
    open: false,
    type: "",
  });

  useEffect(() => {
    if (location.pathname.split("/")[3] === "create") {
      setAddOrEdit((p) => ({ ...p, open: true, method: "add" }));
    } else if (location.pathname.split("/")[3] === "edit") {
      setAddOrEdit((p) => ({ ...p, open: true, method: "edit" }));
    } else {
      setAddOrEdit((p) => ({ ...p, open: false }));
    }
  }, [location]);
  useEffect(() => {
    if (params.templateId) {
      setTemplatesTable((p) => ({
        ...p,
        open: true,
        templateId: params.templateId,
      }));
    } else {
      setTemplatesTable((p) => ({
        open: false,
      }));
    }
  }, [location]);

  const [rateId, setRateId] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [updated, setUpdated] = useState("");

  const token = localStorage.getItem("token");
  useEffect(() => {
    axios
      .get("/dashboard/terms_notes_templates", {
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
        type: type,
      };
      console.log(body);
      if (addOrEdit.method === "add") {
        response = await axios.post(`/dashboard/terms_notes_templates`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response);
      } else if (addOrEdit.method === "edit") {
        console.log("edit person", addOrEdit.editId);
        response = await axios.put(`/dashboard/terms_notes_templates/${addOrEdit.editId}`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      const data = response.data.data;
      if (data) {
        navigate("/dashboard/templates");

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
      printValidationError(err, "templates");
      setSubmitFormLoading(false);
      dispatch(
        setAppError({
          msg: err.message,
        })
      );
    }
  };
  const cancelForm = () => {
    navigate("/dashboard/templates");

    setAddOrEdit((p) => ({ ...p, open: false }));
  };
  const editData = async (id) => {
    navigate(`/dashboard/templates/edit-templates/${id}`);

    if (id) {
      setLoading((p) => ({ ...p, edit: true, loadingId: id }));
      try {
        const response = await axios.get(`/dashboard/terms_notes_templates/${id}`, {
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
        setName(data.name);
        setType(data.type);
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
        const response = await axios.delete(`/dashboard/terms_notes_templates/${id}`, {
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
    setName("");
    setType("");
  };

  // const [setShowPromptElement, PromptElement] = usePrompt(deleteData);

  const showTemplateItems = (id, item) => {
    setTemplatesTable({ open: true, templateId: id, item: item });
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
      {templatesTable.open ? (
        <>
          <Outlet />
        </>
      ) : (
        <div className="p-2  sm:p-5">
          {!addOrEdit.open && (
            <>
              <Link to="/dashboard/templates/create">
                <button className="p-2 bg-red text-white rounded-md" onClick={addData}>
                  Create New Template +
                </button>
              </Link>
              <ListDataTemplates
                list={clientList}
                editData={editData}
                deleteData={setShowPromptElement}
                loading={loading}
                column={4}
                showTemplateItems={showTemplateItems}
                titles={["SL No.", "Name", "Type", "Template Items", "Action"]}
              />
            </>
          )}
          {addOrEdit.open && (
            <AddEditForm
              component="templates"
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
                  type: "text",
                  text: "Type",
                  name: "type",
                  value: type,
                  update: setType,
                  columnName: "short_description",
                },
              ]}
              submitForm={submitForm}
              cancelForm={cancelForm}
              submitFormLoading={submitFormLoading}
              loadedValues={addOrEdit.method === "edit" && addOrEdit.loadedValues}
            />
          )}
        </div>
      )}
    </>
  );
}
