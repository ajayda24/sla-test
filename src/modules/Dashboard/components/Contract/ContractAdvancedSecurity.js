import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { axios } from "../../../../Global";
import { setAppError } from "../../../../store/userSlice";
import { BiEdit, BiHide, BiShow } from "react-icons/bi";

export default function ContractAdvancedSecurityTable({
  contractDetails,
  contractId,
  updateComponent,
}) {
  console.log(contractDetails.quotation_type_id);

  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const [editField, setEditField] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [show, setShow] = useState(false);
  const [initiateTriggered, setInitiateTriggered] = useState(
    !!contractDetails.advance_security_deposit?.contract_id
  );
  const [advance_security_deposit, setAdvanceSecurityDeposit] = useState(
    contractDetails.advance_security_deposit
  );
  console.log(advance_security_deposit);

  const [arr, setArr] = useState([
    {
      title: "Visa Cost Amount",
      value: advance_security_deposit?.visa_cost_amount || "",
      editable: false,
      paragraph: true,
      get show() {
        if (contractDetails.quotation_type_id === 1) {
          return true;
        } else {
          return false;
        }
      },
    },
    {
      title: "Visa Cost Status",
      value: advance_security_deposit?.visa_cost_status || "",
      editable: true,
      options: ["Collected", "Not Collected", "Approved with due date", "NA"],
      get show() {
        if (contractDetails.quotation_type_id === 1) {
          return true;
        } else {
          return false;
        }
      },
    },
    {
      title: "Visa Cost Recieved Amount",
      value: advance_security_deposit?.visa_cost_received_amount || "",
      editable: true,
      type: "number",
      get show() {
        if (
          arr.find((e) => e.title === "Visa Cost Status")?.value ===
            "Collected" &&
          contractDetails?.quotation_type_id === 1
        ) {
          return true;
        } else {
          return false;
        }
      },
    },
    {
      title: "Visa Cost Due Date",
      value: advance_security_deposit.visa_cost_due_date || "",
      editable: true,
      type: "date",
      get show() {
        if (
          arr.find((e) => e.title === "Visa Cost Status")?.value ===
            "Approved with due date" &&
          contractDetails.quotation_type_id === 1
        ) {
          return true;
        } else {
          return false;
        }
      },
    },
    {
      title: "Security Deposit Amount",
      value: advance_security_deposit.security_deposit_amount || "",
      editable: false,
      paragraph: true,
      show: true,
    },
    {
      title: "Security Deposit Status",
      value: advance_security_deposit.security_deposit_status || "",
      editable: true,
      options: ["Collected", "Not Collected", "Approved with due date", "NA"],
      show: true,
    },
    {
      title: "Security Deposit Recieved Amount",
      value: advance_security_deposit.security_deposit_received_amount || "",
      editable: true,
      type: "number",
      get show() {
        if (
          arr.find((e) => e.title === "Security Deposit Status")?.value ===
          "Collected"
        ) {
          return true;
        } else {
          return false;
        }
      },
    },
    {
      title: "Security Deposit Due Date",
      value: advance_security_deposit.security_deposit_due_date || "",
      editable: true,
      type: "date",
      get show() {
        if (
          arr.find((e) => e.title === "Security Deposit Status")?.value ===
          "Approved with due date"
        ) {
          return true;
        } else {
          return false;
        }
      },
    },
  ]);

  useEffect(() => {
    axios
      .get(`/dashboard/contract-advance-security/${contractId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setLoaded(true);
        setInitiateTriggered(true);
        setAdvanceSecurityDeposit(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        // dispatch(
        //   setAppError({
        //     msg: err.message,
        //   })
        // );
      });
  }, [initiateTriggered]);

  const formatDate = (date) => {
    return String(date).split("-").reverse().join("-");
  };
  const initiateHandler = () => {
    axios
      .get(
        `/dashboard/contract-gr-finance-task/advance_security/${contractId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setInitiateTriggered(true);
        dispatch(
          setAppError({
            msg: "Successfully Initiated.",
            color: "success",
          })
        );
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          setAppError({
            msg: err.message,
          })
        );
      });
  };

  const submitHandler = async () => {
    let body = {
      visa_cost_status: arr.find((e) => e.title === "Visa Cost Status").value,
      security_deposit_status: arr.find(
        (e) => e.title === "Security Deposit Status"
      ).value,
    };

    if (arr.find((e) => e.title === "Visa Cost Status").value === "Collected") {
      body = {
        ...body,
        visa_cost_received_amount: arr.find(
          (e) => e.title === "Visa Cost Recieved Amount"
        ).value,
      };
    }
    if (
      arr.find((e) => e.title === "Security Deposit Status").value ===
      "Collected"
    ) {
      body = {
        ...body,
        security_deposit_received_amount: arr.find(
          (e) => e.title === "Security Deposit Recieved Amount"
        ).value,
      };
    }
    if (
      arr.find((e) => e.title === "Visa Cost Status").value ===
      "Approved with due date"
    ) {
      body = {
        ...body,
        visa_cost_due_date: arr.find((e) => e.title === "Visa Cost Due Date")
          .value,
      };
    }
    if (
      arr.find((e) => e.title === "Security Deposit Status").value ===
      "Approved with due date"
    ) {
      body = {
        ...body,
        security_deposit_due_date: arr.find(
          (e) => e.title === "Security Deposit Due Date"
        ).value,
      };
    }
    console.log(body);
    try {
      const response = await axios.put(
        `https://sla.torcdeveloper.com/api/v1/dashboard/contract-advance-security/${advance_security_deposit.id}`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(response);
      if (response.status === 200) {
        setEditField(false);
        updateComponent((p) => !p);
        dispatch(
          setAppError({
            msg: "Successfully edited.",
            color: "success",
          })
        );
      }
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) {
        if (err.response?.data?.validation_error) {
          for (let i in err.response?.data?.validation_error) {
            dispatch(
              setAppError({
                msg: err.response?.data?.validation_error[i],
              })
            );
          }
        }
      }
      dispatch(
        setAppError({
          msg: err.message,
        })
      );
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <h1 className="text-md font-semibold my-2">Advance / Security</h1>

        {initiateTriggered ? (
          <button
            className=" text-sm rounded-md p-2 px-5 flex gap-3 justify-start items-center"
            onClick={() => setShow((p) => !p)}
          >
            {show ? <BiHide size={"1.2rem"} /> : <BiShow size={"1.2rem"} />}
          </button>
        ) : (
          <button
            className="bg-red text-white text-sm rounded-md p-2 px-5 flex gap-3 justify-start items-center"
            onClick={initiateHandler}
          >
            Initiate
          </button>
        )}
      </div>
      <div
        className={`bg-slate-50 shadow-md rounded-lg  p-5 px-2 flex flex-col items-center transition-all  ${
          show ? "overflow-auto py-5 h-auto my-4" : "overflow-hidden py-0 h-0"
        } `}
      >
        {!editField && (
          <div className="flex gap-3 justify-end w-full">
            <button
              className="bg-blue p-2 w-24 text-white rounded-md flex gap-3 justify-center items-center"
              onClick={() => setEditField((p) => !p)}
            >
              Edit
              <BiEdit size={"1.3rem"} />
            </button>
          </div>
        )}
        <div className="flex flex-col justify-center items-center w-full gap-10 ">
          {arr.map((elem, i) => {
            // console.log(elem);
            return (
              <div
                key={i}
                className={`p-3  flex-col gap-2 w-full max-w-lg ${
                  elem?.show ? "flex" : "hidden"
                }`}
              >
                <h2 className="font-semibold">{elem.title}</h2>
                {elem.type ? (
                  <input
                    type={elem.type}
                    value={
                      elem?.type === "date"
                        ? formatDate(elem.value)
                        : elem?.value
                    }
                    className="input input-sm pl-1 input-bordered"
                    disabled={elem.editable ? !editField : true}
                    onChange={(e) =>
                      setArr((p) => {
                        const changedValue = p.find(
                          (e) => e.title === elem.title
                        );
                        if (elem.type === "date") {
                          changedValue.value = formatDate(e.target.value);
                          changedValue.changed = true;
                        } else if (elem.type === "number") {
                          changedValue.value = e.target.value;
                        }
                        const changedValueIndex = p.findIndex(
                          (e) => e.title === elem.title
                        );
                        const nonChangedValue = p.filter(
                          (e) => e.title !== elem.title
                        );
                        nonChangedValue.splice(
                          changedValueIndex,
                          0,
                          changedValue
                        );

                        return nonChangedValue;
                      })
                    }
                  />
                ) : elem.paragraph ? (
                  <p>{elem.value}</p>
                ) : (
                  <select
                    type="text"
                    defaultValue={`${elem.value}` || "--"}
                    className="select select-sm pl-1 select-bordered"
                    disabled={!editField}
                    onChange={(e) =>
                      setArr((p) => {
                        const changedValue = p.find(
                          (e) => e.title === elem.title
                        );
                        changedValue.value = e.target.value;

                        const changedValueIndex = p.findIndex(
                          (e) => e.title === elem.title
                        );
                        const nonChangedValue = p.filter(
                          (e) => e.title !== elem.title
                        );
                        nonChangedValue.splice(
                          changedValueIndex,
                          0,
                          changedValue
                        );

                        return nonChangedValue;
                      })
                    }
                  >
                    {!elem?.type && elem.options?.includes(elem.value) ? (
                      elem.options?.map((o, i) => (
                        <option
                          key={i}
                          value={o}
                          selected={elem?.value === o ? "selected" : ""}
                        >
                          {o}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value={""}>Select a value</option>
                        {elem.options?.map((o, i) => (
                          <option key={i} value={o}>
                            {o}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                )}
              </div>
            );
            // } else return "";
          })}
        </div>
        {editField && (
          <button
            className="bg-red rounded-md p-2 max-w-sm w-full m-3 text-white "
            onClick={submitHandler}
          >
            Submit
          </button>
        )}
      </div>
    </>
  );
}
