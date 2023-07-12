import React, { useEffect, useState } from "react";
import QuotationCostSheetStep1 from "./Step1";
import QuotationCostSheetStep2 from "./Step2ForCreate";
import { useLocation } from "react-router-dom";
import QuotationCostSheetStep2ForEdit from "./Step2ForEdit";
import axios from "../../../../../Global/axios";
import { useDispatch } from "react-redux";
import { setAppError } from "../../../../../store/userSlice";

export default function CostSheetSteps({
  costSheetForm,
  updateCostSheetForm,
  govtFee,
  salaryAllowance,
  slaFees,
  quotationType,
}) {
  const dispatch = useDispatch();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [list, setList] = useState([]);
  let quotationDetails = {
    number: list?.quotation?.quotation_number,
    name: list?.quotation?.name,
    type: list?.quotation_type,
    clientName: list?.client,
  };
  if (costSheetForm.method === "Create") {
    quotationDetails = {
      number: list?.quotation_number,
      name: list?.name,
      type: list?.quotation_type?.name,
      clientName: list?.client?.name,
    };
  }
  const [costSheetState, setCostSheetState] = useState({
    // currentStep:
    //   costSheetForm.method === "Edit"
    //     ? 2
    //     : costSheetForm.method === "Create" && 1,
    currentStep: 2,
    govtFee:
      quotationDetails.type === "Cost Plus" ? "onetime_cost" : "monthly_cost",
    salaryAllowance: salaryAllowance || "monthly_cost",
    slaFees: slaFees || "monthly_cost",
  });
  const currentQuotationId =
    location.state?.quotationId || location.pathname.split("/")[3];

  const step1SubmitHandler = (govtFee, salaryAllowance, slaFees) => {
    setCostSheetState((p) => ({
      ...p,
      currentStep: 2,
      govtFee,
      salaryAllowance,
      slaFees,
    }));
  };

  useEffect(() => {
    if (costSheetForm.method === "Edit") {
      axios
        .get(`/dashboard/quotation-cost-sheet/${currentQuotationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setList(res.data.data);
          setCostSheetState((p) => ({
            ...p,
            govtFee:
              res.data.data?.quotation_type === "Cost Plus"
                ? "onetime_cost"
                : "monthly_cost",
          }));
        })
        .catch((err) => {
          if (err.response?.data?.message) {
            dispatch(
              setAppError({
                msg: err.response?.data?.message,
              })
            );
          }
        });
    } else if (costSheetForm.method === "Create") {
      axios
        .get(`/dashboard/quotation/${location?.state?.quotationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setList(res.data.data);
          setCostSheetState((p) => ({
            ...p,
            govtFee:
              res.data.data?.quotation_type?.name === "Cost Plus"
                ? "onetime_cost"
                : "monthly_cost",
          }));
        })
        .catch((err) => {
          if (err.response?.data?.message) {
            dispatch(
              setAppError({
                msg: err.response?.data?.message,
              })
            );
          }
        });
    }
  }, []);

  return (
    <>
      {/* {costSheetState.currentStep === 1 &&
        costSheetForm.method === "Create" && (
          <QuotationCostSheetStep1
            step1SubmitHandler={step1SubmitHandler}
            quotationType={quotationType}
          />
        )} */}
      {costSheetState.currentStep === 2 && costSheetForm.method === "Edit" && (
        <QuotationCostSheetStep2ForEdit
          costSheetState={costSheetState}
          costSheetId={costSheetForm.costSheetId}
          quotationId={location.pathname.split("/")[3]}
          updateCostSheetForm={updateCostSheetForm}
          quotationDetails={quotationDetails}
          quotationType={quotationDetails.type}
        />
      )}
      {costSheetState.currentStep === 2 &&
        costSheetForm.method === "Create" && (
          <QuotationCostSheetStep2
            costSheetState={costSheetState}
            costSheetId={costSheetForm.costSheetId}
            quotationId={location.pathname.split("/")[3]}
            updateCostSheetForm={updateCostSheetForm}
            quotationType={quotationType}
            quotationDetails={quotationDetails}
          />
        )}
    </>
  );
}
