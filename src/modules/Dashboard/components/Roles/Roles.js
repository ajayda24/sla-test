import React, { useEffect, useState } from "react";
import AddEditForm from "./AddEditFormRoles";
import { axios } from "../../../../Global";
import { setAppError } from "../../../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ListDataRoles from "./ListDataRoles";
// import useCRUD from "../../../hooks/useCRUD";
import PromptElement from "../../PromptElement";
import { printValidationError } from "../../../../utils/functions";
import { getRoleList, getPermissionList } from "../../../../store/Api";

export default function Roles(props) {
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
    if (location.pathname.split("/")[3] == "create") {
      setAddOrEdit((p) => ({ ...p, open: true }));
    } else if (location.pathname.split("/")[3] === "edit") {
      setAddOrEdit((p) => ({ ...p, open: true }));
    } else {
      setAddOrEdit((p) => ({ ...p, open: false }));
    }
  }, [location]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [permissions, setPermissions] = useState([]);

  const token = localStorage.getItem("token");

  const roleLists = useSelector((state) => state.roleManagement.lists);

  useEffect(() => {
    if (roleLists.length <= 0) {
      dispatch(getRoleList());
    }
    // axios
    //   .get("/dashboard/user", {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //   .then((res) => {
    //     setClientList(res.data.data);
    //   })
    //   .catch((err) => {
    //     dispatch(
    //       setAppError({
    //         msg: err.message,
    //       })
    //     );
    //   });
    // axios
    //   .get("/dashboard/roles", {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //   .then((res) => {
    //     setPermissions(res.data.data);
    //   })
    //   .catch((err) => {
    //     dispatch(
    //       setAppError({
    //         msg: err.message,
    //       })
    //     );
    //   });
  }, []);

  const submitForm = async (event, selectPermissions = []) => {
    event.preventDefault();
    setSubmitFormLoading(true);
    try {
      let response;
      const body = {
        name,
        permission: selectPermissions,
      };
      if (addOrEdit.method === "add") {
        response = await axios.post(`/dashboard/roles`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (addOrEdit.method === "edit") {
        response = await axios.put(
          `/dashboard/roles/${addOrEdit.editId}`,
          body,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      const data = response.data.data;
      if (data) {
        navigate("/dashboard/roles-and-permission");
        dispatch(
          setAppError({
            msg: response.data.message,
            color: "success",
          })
        );
        dispatch(getRoleList());
        setSubmitFormLoading(false);
        setAddOrEdit((p) => ({ ...p, open: false }));
      }
    } catch (err) {
      console.log(err);
      printValidationError(err, "roles-and-permission");
      setSubmitFormLoading(false);
      dispatch(
        setAppError({
          msg: err.message,
        })
      );
    }
  };
  const cancelForm = () => {
    navigate("/dashboard/roles-and-permission");
    setAddOrEdit((p) => ({ ...p, open: false }));
  };
  const editData = async (id) => {
    navigate(`/dashboard/roles-and-permission/edit/${id}`);
    if (id) {
      setLoading((p) => ({ ...p, edit: true, loadingId: id }));
      try {
        setLoading((p) => ({ ...p, edit: false, loadingId: "" }));
        setAddOrEdit((p) => ({
          ...p,
          open: true,
          method: "edit",
          // loadedValues: data,
          editId: id,
        }));
        const roleName = roleLists.find((object) => object.id === id);
        if (roleName?.name) {
          setName(roleName.name);
        }
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
        const response = await axios.delete(`/dashboard/roles/${id}`, {
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
        console.log(err);
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
    setName("");
    setEmail("");
    setPassword("");
    setMobile("");
    setAddress("");
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
            <Link to="/dashboard/roles-and-permission/create">
              <button
                className="p-2 bg-red text-white rounded-md"
                onClick={addData}
              >
                Add New Role +
              </button>
            </Link>
            <ListDataRoles
              list={roleLists}
              editData={editData}
              deleteData={setShowPromptElement}
              loading={loading}
              column={5}
              titles={["SL No.", "Name", "Action"]}
            />
          </>
        )}
        {addOrEdit.open && (
          <AddEditForm
            component="roles-and-permission"
            form={[
              {
                type: "text",
                text: "Name",
                name: "name",
                value: name,
                update: setName,
                columnName: "name",
              },
            ]}
            getPermissionList={getPermissionList}
            submitForm={submitForm}
            cancelForm={cancelForm}
            submitFormLoading={submitFormLoading}
            loadedValues={addOrEdit.method === "edit" && addOrEdit}
          />
        )}
      </div>
    </>
  );
}
