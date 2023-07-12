import React, { useEffect, useState } from "react";
import ListData from "../../../ListData";
import AddEditForm from "../../../AddEditForm";
import { axios } from "../../../../../Global";
import { setAppError } from "../../../../../store/userSlice";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ListDataRateCategory from "../ListDataRateCategory";
import usePrompt from "../../../../../utils/usePrompt";
import PromptElement from "../../../PromptElement";
import ListDataRateCategoryItems from "./ListDataRateItem";
import { printValidationError } from "../../../../../utils/functions";

export default function RateCategoryItems() {
  const [showPromptElement, setShowPromptElement] = useState({
    open: false,
    id: null,
  });
  const location = useLocation();
  const categoryItemId = location.pathname.split("/").at(3);
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

  const [rateId, setRateId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [oneTimeCost, setOneTimeCost] = useState("");
  const [monthlyCost, setMonthlyCost] = useState("");
  const [updated, setUpdated] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (location.pathname.split("/").at(-1) === "#edit") {
      setAddOrEdit((p) => ({
        ...p,
        open: true,
        method: "edit",
      }));
    } else {
      setAddOrEdit((p) => ({ ...p, open: false }));
    }
  }, [location.pathname]);

  useEffect(() => {
    axios
      .get(`/dashboard/rate-category`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const allData = res.data.data;
        const particularData = allData.find((a) => a.id == categoryItemId);
        console.log(allData, categoryItemId);
        setClientList(particularData.rate_category_item);
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          setAppError({
            msg: err.message,
          })
        );
      });
  }, [addOrEdit.open, loading.delete]);
  // }, [loading.delete]);

  const submitForm = async (event) => {
    event.preventDefault();
    setSubmitFormLoading(true);
    try {
      let response;
      const body = {
        name,
        short_description: description,
        onetime_cost: oneTimeCost,
        monthly_cost: monthlyCost,
        rate_category_id: categoryItemId,
      };
      if (addOrEdit.method === "edit") {
        console.log("edit person", addOrEdit.editId);
        response = await axios.put(`/dashboard/rate-category-item/${addOrEdit.editId}`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      const data = response.data.data;
      if (data) {
        navigate(`/dashboard/rate-category/${categoryItemId}`);

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
      setSubmitFormLoading(false);
      printValidationError(err, "rateCategory");
      dispatch(
        setAppError({
          msg: err.message,
        })
      );
    }
  };
  const cancelForm = () => {
    navigate(`/dashboard/rate-category/${categoryItemId}`);

    setAddOrEdit((p) => ({ ...p, open: false }));
  };

  const editData = async (id) => {
    navigate(`/dashboard/rate-category/${categoryItemId}/edit/${id}`);

    if (id) {
      setLoading((p) => ({ ...p, edit: true, loadingId: id }));
      try {
        const response = await axios.get(`/dashboard/rate-category-item/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data.data;
        setLoading((p) => ({ ...p, edit: false, loadingId: "" }));
        setAddOrEdit((p) => ({
          ...p,
          open: true,
          method: "edit",
          loadedValues: data,
          editId: id,
        }));
        setName(data.name);
        setDescription(data.short_description);
        setOneTimeCost(data.onetime_cost);
        setMonthlyCost(data.monthly_cost);
      } catch (err) {
        dispatch(
          setAppError({
            msg: err.message,
          })
        );
      }
    }
  };

  return (
    <>
      {addOrEdit.open ? (
        <AddEditForm
          component="rateCategory"
          form={[
            {
              type: "text",
              text: "Name",
              name: "name",
              value: name,
              update: setName,
              disabled: true,
            },
            {
              type: "text",
              text: "Description",
              name: "description",
              value: description,
              update: setDescription,
              columnName: "short_description",
            },
            {
              type: "number",
              text: "One-Time Cost",
              name: "oneTimeCost",
              value: oneTimeCost,
              update: setOneTimeCost,
              columnName: "onetime_cost",
            },
            {
              type: "number",
              text: "Monthly Cost",
              name: "monthlyCost",
              value: monthlyCost,
              update: setMonthlyCost,
              columnName: "monthly_cost",
            },
          ]}
          submitForm={submitForm}
          cancelForm={cancelForm}
          submitFormLoading={submitFormLoading}
          loadedValues={addOrEdit.method === "edit" && addOrEdit.loadedValues}
        />
      ) : (
        <ListDataRateCategoryItems
          list={clientList}
          editData={editData}
          // deleteData={setShowPromptElement}
          loading={loading}
          column={5}
          titles={["SL No.", "Name", "One-time Cost", "Monthly Cost", "Action"]}
        />
      )}
    </>
  );
}
