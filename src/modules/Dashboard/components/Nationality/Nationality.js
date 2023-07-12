import React, { useEffect, useState } from "react";
import ListData from "../../ListData";
import AddEditForm from "../../AddEditForm";
import { axios } from "../../../../Global";
import { setAppError } from "../../../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ListDataNationality from "./ListDataNationality";
import PromptElement from "../../PromptElement";
import AddEditFormNationality from "./AddEditFormNationality";
import { printValidationError } from "../../../../utils/functions";
import { checkAccessFn } from "../../../../utils/checkAccess";

export default function Nationality() {
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

  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [mobileCode, setMobileCode] = useState("");

  const token = localStorage.getItem("token");
  useEffect(() => {
    axios
      .get("/dashboard/nationality", {
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

  const submitForm = async (event, flag) => {
    event.preventDefault();
    setSubmitFormLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("country_code", countryCode);
    formData.append("mobile_code", mobileCode);
    if (flag) {
      formData.append("flag_icon", flag);
    }
    try {
      let response;
      if (addOrEdit.method === "add") {
        response = await axios.post(`/dashboard/nationality`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else if (addOrEdit.method === "edit") {
        response = await axios.post(`/dashboard/nationality/${addOrEdit.editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      const data = response.data.data;
      if (data) {
        navigate("/dashboard/nationality");

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
      // console.log(err);

      setSubmitFormLoading(false);
      printValidationError(err, "nationality");
      dispatch(
        setAppError({
          msg: err.message,
        })
      );
    }
  };
  const cancelForm = () => {
    navigate("/dashboard/nationality");

    setAddOrEdit((p) => ({ ...p, open: false }));
  };
  const editData = async (id) => {
    navigate(`/dashboard/nationality/edit/${id}`);

    if (id) {
      setLoading((p) => ({ ...p, edit: true, loadingId: id }));
      try {
        const response = await axios.get(`/dashboard/nationality/${id}`, {
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
        setCountryCode(data.country_code);
        setMobileCode(data.mobile_code);
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
        const response = await axios.delete(`/dashboard/nationality/${id}`, {
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
    setCountryCode("");
    setMobileCode("");
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
      <div className="p-2  sm:p-5">
        {!addOrEdit.open && (
          <>
            {checkAccess("Nationality", "nationality-create") ? (
              <Link to="/dashboard/nationality/create">
                <button className="p-2 bg-red text-white rounded-md" onClick={addData}>
                  Add New Nationality +
                </button>
              </Link>
            ) : (
              <button className="p-2  bg-slate-300 text-white rounded-md"> Add New Nationality +</button>
            )}

            <ListDataNationality
              list={clientList}
              editData={editData}
              deleteData={setShowPromptElement}
              loading={loading}
              titles={["SL No.", "Flag", "Nationality", "Country Code", "Mobile Code", "Action"]}
            />
          </>
        )}
        {addOrEdit.open && (
          <AddEditFormNationality
            component="nationality"
            form={[
              {
                type: "text",
                text: "Name",
                name: "name",
                columnName: "name",
                value: name,
                update: setName,
              },
              {
                type: "text",
                text: "Country Code",
                name: "countryCode",
                columnName: "country_code",

                value: countryCode,
                update: setCountryCode,
              },
              {
                type: "text",
                text: "Mobile Code",
                name: "mobileCode",
                columnName: "mobile_code",

                value: mobileCode,
                update: setMobileCode,
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
