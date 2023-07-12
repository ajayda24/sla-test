import React, { useEffect, useState } from "react";
import AddEditFormNotes from "../../../Notes/AddEditFormNotes";
import { axios } from "../../../../../../Global";
import { setAppError } from "../../../../../../store/userSlice";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PromptElement from "../../../../PromptElement";
import ListDataNotes from "../../../Notes/ListDataNotes";
import { printValidationError } from "../../../../../../utils/functions";

export default function QuotationCostNotes(props) {
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

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("token");
  const quotationCostSheetId = location.pathname.split("/").at(3);
  console.log(quotationCostSheetId);
  useEffect(() => {
    axios
      .get(`/dashboard/note-quotation-list/${quotationCostSheetId}`, {
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
        description,
        quotation_id: quotationCostSheetId,
      };
      if (addOrEdit.method === "add") {
        response = await axios.post(`/dashboard/note-quotation`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (addOrEdit.method === "edit") {
        response = await axios.put(
          `/dashboard/note-quotation/${addOrEdit.editId}`,
          { name, description },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      const data = response.data.data;
      if (data) {
        navigate(`/dashboard/quotation/${quotationCostSheetId}/notes`);
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
      printValidationError(err, "notes");
      setSubmitFormLoading(false);
      dispatch(
        setAppError({
          msg: err.message,
        })
      );
    }
  };

  const cancelForm = () => {
    navigate(`/dashboard/quotation/${quotationCostSheetId}/notes`);

    setAddOrEdit((p) => ({ ...p, open: false }));
  };

  const editData = async (id) => {
    navigate(`/dashboard/quotation/${quotationCostSheetId}/notes#edit-${id}`);

    if (id) {
      setLoading((p) => ({ ...p, edit: true, loadingId: id }));
      try {
        const response = await axios.get(`/dashboard/note-quotation/${id}`, {
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
        setDescription(data.description);
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
        const response = await axios.delete(`/dashboard/note-quotation/${id}`, {
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
    setName("");
    setDescription("");
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
            <Link to={`/dashboard/quotation/${quotationCostSheetId}/notes/create`}>
              <button className="p-2 bg-red text-white rounded-md" onClick={addData}>
                Add New Note +
              </button>
            </Link>
            <ListDataNotes
              list={clientList}
              editData={editData}
              deleteData={setShowPromptElement}
              loading={loading}
              column={4}
              titles={["SL No.", "Name", "Description", "Action"]}
            />
          </>
        )}
        {addOrEdit.open && (
          <AddEditFormNotes
            component="notes"
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
                type: "textarea",
                text: "Description",
                name: "description",
                value: description,
                update: setDescription,
                columnName: "description",
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
