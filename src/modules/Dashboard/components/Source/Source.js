import React, { useEffect, useState } from "react";
import ListData from "../../ListData";
import AddEditForm from "../../AddEditForm";
import { axios } from "../../../../Global";
import { setAppError } from "../../../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ListDataClient from "./ListDataSource";
// import useCRUD from "../../../hooks/useCRUD";
import PromptElement from "../../PromptElement";
import { printValidationError } from "../../../../utils/functions";
import { checkAccessFn } from "../../../../utils/checkAccess";

export default function Source(props) {
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
  const [sourceList, setSourceList] = useState([]);
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

  const [sourceId, setSourceId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("")

  const token = localStorage.getItem("token");
  useEffect(() => {
    axios
      .get("/dashboard/source", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setSourceList(res.data.data);
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
        description
      };
      if (addOrEdit.method === "add") {
        response = await axios.post(`/dashboard/source`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (addOrEdit.method === "edit") {
        response = await axios.put(
          `/dashboard/source/${addOrEdit.editId}`,
          body,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      const data = response.data.data;
      if (data) {
        navigate("/dashboard/source");
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
    navigate("/dashboard/source");
    setAddOrEdit((p) => ({ ...p, open: false }));
  };
  const editData = async (id) => {
    navigate(`/dashboard/source/edit/${id}`);
    if (id) {
      setLoading((p) => ({ ...p, edit: true, loadingId: id }));
      try {
        const response = await axios.get(`/dashboard/source/${id}`, {
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
        setSourceId(data.id);
        setName(data.name);
        setDescription(data.description)
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
        const response = await axios.delete(`/dashboard/source/${id}`, {
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
    setSourceId("");
    setName("");
    setDescription("")
  };

  const dashboardData = useSelector((state) => state.dashboardData);

  // const checkAccess = (module, name) => {
  //   return checkAccessFn(dashboardData, module, name);
  // };

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
            {/* {checkAccess("Client", "client-create") ? (
              <Link to="/dashboard/source/create">
                <button
                  className="p-2 bg-red text-white rounded-md"
                  onClick={addData}
                >
                  Add New Source +
                </button>
              </Link>
            ) : (
              <button className="p-2  bg-slate-300 text-white rounded-md">
                {" "}
                Add New Source +
              </button>
            )} */}
            <Link to="/dashboard/source/create">
              <button
                className="p-2 bg-red text-white rounded-md"
                onClick={addData}
              >
                Add New Source +
              </button>
            </Link>

            <ListDataClient
              list={sourceList}
              editData={editData}
              deleteData={setShowPromptElement}
              loading={loading}
              column={5}
              titles={["SL No.", "Name", "Description", "Action"]}
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
                type: "text",
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
