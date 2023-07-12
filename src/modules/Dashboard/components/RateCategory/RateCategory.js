import React, { useEffect, useState } from "react";
import ListData from "../../ListData";
import AddEditForm from "../../AddEditForm";
import { axios } from "../../../../Global";
import { setAppError } from "../../../../store/userSlice";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ListDataRateCategory from "./ListDataRateCategory";
import usePrompt from "../../../../utils/usePrompt";
import PromptElement from "../../PromptElement";
import RateCategoryItems from "./RateCategoryItem/RateCategoryItem";
import { printValidationError } from "../../../../utils/functions";

export default function RateCategory() {
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

  const [categoryItemsTable, setCategoryItemsTable] = useState({
    categoryId: "",
    open: false,
  });

  // useEffect(() => {
  //   if (location.pathname.split("/")[3] === "create") {
  //     setAddOrEdit((p) => ({ ...p, open: true, method: "add" }));
  //   } else {
  //     setAddOrEdit((p) => ({ ...p, open: false }));
  //   }
  // }, [location]);
  useEffect(() => {
    if (location.pathname.split("/")[3]) {
      setCategoryItemsTable((p) => ({
        ...p,
        open: true,
        categoryId: location.pathname.split("/")[3],
      }));
    } else {
      setCategoryItemsTable((p) => ({
        open: false,
      }));
    }
  }, [location]);

  const [rateId, setRateId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [updated, setUpdated] = useState("");

  const token = localStorage.getItem("token");
  useEffect(() => {
    axios
      .get("/dashboard/rate-category", {
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
        short_description: description,
      };
      if (addOrEdit.method === "add") {
        response = await axios.post(`/dashboard/rate-category`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (addOrEdit.method === "edit") {
        console.log("edit person", addOrEdit.editId);
        response = await axios.put(`/dashboard/rate-category/${addOrEdit.editId}`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      const data = response.data.data;
      if (data) {
        navigate("/dashboard/rate-category");

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
      printValidationError(err, "rateCategory");
      setSubmitFormLoading(false);
      dispatch(
        setAppError({
          msg: err.message,
        })
      );
    }
  };
  const cancelForm = () => {
    navigate("/dashboard/rate-category");

    setAddOrEdit((p) => ({ ...p, open: false }));
  };
  const editData = async (id) => {
    navigate(`/dashboard/rate-category#edit`);

    if (id) {
      setLoading((p) => ({ ...p, edit: true, loadingId: id }));
      try {
        const response = await axios.get(`/dashboard/rate-category/${id}`, {
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
        setDescription(data.short_description);
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
        const response = await axios.delete(`/dashboard/rate-category/${id}`, {
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
    navigate("/dashboard/rate-category");

    setAddOrEdit((p) => ({ ...p, open: true, method: "add" }));
    setName("");
    setDescription("");
  };

  // const [setShowPromptElement, PromptElement] = usePrompt(deleteData);

  const showCategoryItems = (id) => {
    setCategoryItemsTable({ open: true, categoryId: id });
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
      {categoryItemsTable.open ? (
        <RateCategoryItems />
      ) : (
        <div className="p-2  sm:p-5">
          {!addOrEdit.open && (
            <>
              {/* <Link to="/dashboard/rate-category/create">
                <button
                  className="p-2 bg-red text-white rounded-md"
                  onClick={addData}
                >
                  Add New Rate Category +
                </button>
              </Link> */}
              <ListDataRateCategory
                list={clientList}
                editData={editData}
                deleteData={setShowPromptElement}
                loading={loading}
                column={4}
                showCategoryItems={showCategoryItems}
                titles={["SL No.", "Name", "Description", "Rate Category Items"]}
              />
            </>
          )}
          {addOrEdit.open && (
            <AddEditForm
              component="rateCategory"
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
