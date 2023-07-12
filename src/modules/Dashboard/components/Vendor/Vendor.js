import React, { useEffect, useState } from "react";
import ListData from "../../ListData";
import VendorAddEditForm from "./VendorForm";
import { axios } from "../../../../Global";
import { setAppError } from "../../../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ListDataVendor from "./ListDataVendor";
// import useCRUD from "../../../hooks/useCRUD";
import PromptElement from "../../PromptElement";
import { printValidationError } from "../../../../utils/functions";
import { checkAccessFn } from "../../../../utils/checkAccess";


export default function Vendor(props) {
  const [showPromptElement, setShowPromptElement] = useState({
    open: false,
    id: null,
  });
  // const crud = useCRUD({ states: [{ value: clientId, update: setClientId }] });
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [submitFormLoading, setSubmitFormLoading] = useState(false);
  const [nationalities,setNationalities] = useState([]);
  const [loading, setLoading] = useState({
    edit: false,
    delete: false,
    listData: false,
    loadingId: "",
  });
  // const [clientList, setClientList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
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

  // const [clientId, setClientId] = useState("");
  const [name, setName] = useState("");
  const [authorizedName, setAuthorizedName] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");

  const token = localStorage.getItem("token");
  useEffect(() => {
    axios
      .get("/dashboard/vendor", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setVendorList(res.data.data.vendor);
        setNationalities(res.data?.data?.nationality)
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
        authorized_person_name: authorizedName,
        address,
        email,
        mobile,
        nationality_id: country
      };
      if (addOrEdit.method === "add") {
        response = await axios.post(`/dashboard/vendor`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });

      } else if (addOrEdit.method === "edit") {
        response = await axios.put(
          `/dashboard/vendor/${addOrEdit.editId}`,
          body,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      const data = response?.data?.data;
      if (data) {
        navigate("/dashboard/vendor");
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
      printValidationError(err, "vendor");
      setSubmitFormLoading(false);
      dispatch(
        setAppError({
          msg: err?.message,
        })
      );
    }
  };

  const cancelForm = () => {
    navigate("/dashboard/vendor");
    setAddOrEdit((p) => ({ ...p, open: false }));
  };
  const editData = async (id) => {
    navigate(`/dashboard/vendor/edit/${id}`);
    if (id) {
      setLoading((p) => ({ ...p, edit: true, loadingId: id }));
      try {
        const response = await axios.get(`/dashboard/vendor/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data.data.vendor;
        setLoading((p) => ({ ...p, edit: false, loadingId: "" }));
        setAddOrEdit((p) => ({
          ...p,
          open: true,
          method: "edit",
          // loadedValues: data,
          editId: id,
        }));
        setName(data.name);
        setEmail(data.email);
        setMobile(data.mobile);
        setAddress(data.address);
        setAuthorizedName(data.authorized_person_name);
        setCountry(data.nationality?.name)
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
        const response = await axios.delete(`/dashboard/vendor/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response?.status === 200) {
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
    setName("");
    setAuthorizedName("");
    setAddress("");
    setEmail("");
    setMobile("");  
    setCountry("");
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
              <Link to="/dashboard/vendor/create">
                <button
                  className="p-2 bg-red text-white rounded-md"
                  onClick={addData}
                >
                  Add New Vendor +
                </button>
              </Link>
            ) : (
              <button className="p-2  bg-slate-300 text-white rounded-md">
                {" "}
                Add New Vendor +
              </button>
            )}

            <ListDataVendor
              list={vendorList}
              editData={editData}
              deleteData={setShowPromptElement}
              loading={loading}
              column={5}
              titles={[
                "SL No.",
                "Name",
                "Autorized Name",
                "Vendor Id",
                "Address",
                "Email",
                "Mobile",
                "Country",
                "Action"
              ]}
            />
          </>
        )}
        {addOrEdit.open && (
          <VendorAddEditForm
            component="vendor"
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
                text: "Authorized Name",
                name: "authorizedName",
                value: authorizedName,
                update: setAuthorizedName,
                columnName: "authorizedName"
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
                type: "select",
                text: "Country",
                name: "country",
                value: country,
                update: setCountry,
                columnName: "country",
                options: nationalities,
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
