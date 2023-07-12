import { useEffect, useState } from "react";
import { setAppError } from "../store/userSlice";
import axios from "../axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function useCRUD(hello) {
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
  const [authorizedPersonName, setAuthorizedPersonName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");

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
        clientID: clientId,
        name,
        email,
        mobile,
        address,
        authorized_person_name: authorizedPersonName,
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
            color: "bg-green-700",
          })
        );
        setSubmitFormLoading(false);
        setAddOrEdit((p) => ({ ...p, open: false }));
      }
    } catch (err) {
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
    navigate("/dashboard/client#edit");
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
        setAuthorizedPersonName(data.authorized_person_name);
        setName(data.name);
        setEmail(data.email);
        setMobile(data.mobile);
        setAddress(data.address);
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
    setAuthorizedPersonName("");
    setName("");
    setEmail("");
    setMobile("");
    setAddress("");
  };
}
