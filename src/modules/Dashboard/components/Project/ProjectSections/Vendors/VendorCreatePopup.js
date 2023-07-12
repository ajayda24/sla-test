import React, { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { IoMdClose } from "react-icons/io";
import { TiInfoOutline, TiTick } from "react-icons/ti";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { axios } from "../../../../../../Global";
import { useDispatch } from "react-redux";
import { setAppError } from "../../../../../../store/userSlice";

export default function VendorCreate({
  showPromptElement,
  setShowPromptElement,
  projectId,
}) {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [projectDetails, setProjectDetails] = useState([]);
  const [Countries, SetCountries] = useState([]);
  const [Vendors, setVendors] = useState([]);
  const [ProjectVendors, setProjectVendors] = useState([]);

  useEffect(() => {
    axios
      .get(`/dashboard/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setLoading(false);
        const data = res.data.data;
        setProjectDetails(data);
        setProjectVendors(data?.project?.project_vendor);
        SetCountries(data?.country);
        setVendors(data?.vendor);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        dispatch(
          setAppError({
            msg: err.message,
          })
        );
      });
  }, []);

  // let filteredArray;
  // let newArray;
  const [newArray, setNewArray] = useState([]);
  const [filteredArray, setFilteredArray] = useState([]);

  const [initialArrayChanged, setInitialArrayChanged] = useState(false);

  useEffect(() => {
    const projectVendorsId = ProjectVendors.map((item) => item.vendor_id);
    if (ProjectVendors) {
      setNewArray(
        Vendors.filter((item) => {
          return !projectVendorsId.includes(item.id);
        })
      );
      setInitialArrayChanged((p) => !p);
    } else {
      setNewArray(Vendors);
      setInitialArrayChanged((p) => !p);
    }

    setFilteredArray([...newArray]);
  }, [ProjectVendors, Vendors]);
  const [mappingArray, setmappingArray] = useState(newArray);

  useEffect(() => {
    setmappingArray(newArray);
  }, [initialArrayChanged]);

  const CountryHandler = (e) => {
    if (e.target.value != "All") {
      setmappingArray(
        filteredArray.filter((item) => item.nationality_id == e.target.value)
      );
    } else {
      setmappingArray(newArray);
    }

    console.log(mappingArray);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const Body = {
      project_id: projectId.toString(),
      vendor_id: e.target.vendor_id.value,
    };
    console.log(Body);

    axios
      .post(
        "https://sla.torcdeveloper.com/api/v1/dashboard/project-vendor",
        Body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          setShowPromptElement((p) => ({ ...p, open: false }));
          dispatch(
            setAppError({
              msg: "Data Submitted",
              color: "bg-green-700",
            })
          );
        }
      })
      .catch((error) => {
        dispatch(
          setAppError({
            msg: error.message,
          })
        );
      });
  };

  return (
    <div
      className={`fixed z-50 top-0 left-0 min-w-full min-h-screen bg-black/50  justify-center items-center ${
        showPromptElement.open ? "flex" : "hidden"
      }`}
    >
      <div className="max-w-xl w-full h-auto min-h-[20rem]  rounded-md bg-white/95 flex  flex-col p-4 relative">
        {!loading ? (
          <>
            <div className="flex justify-between items-center w-full">
              <h1 className="text-xl font-semibold">Create Vendor</h1>
              <h1
                className="text-md font-semibold cursor-pointer"
                onClick={() => {
                  setShowPromptElement((p) => ({ ...p, open: false }));
                }}
              >
                <IoMdClose />
              </h1>
            </div>
            <h2 className="text-sm">Create a new vendor for your project.</h2>
            <form onSubmit={onSubmitHandler}>
              <div className="w-full flex flex-col gap-1 mt-5 p-5 py-2">
                <label htmlFor="" className="px-1">
                  Select Country
                </label>
                <select
                  name="country"
                  className="input input-sm pr-2 input-bordered "
                  onChange={CountryHandler}
                  required
                >
                  <option value="All" selected>
                    All
                  </option>
                  {Countries &&
                    Countries.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="w-full flex flex-col gap-1  p-5 py-2">
                <label htmlFor="" className="px-1">
                  Select Vendor
                </label>
                {console.log(mappingArray)}
                <select
                  name="vendor_id"
                  className="input input-sm pr-2 input-bordered "
                  required
                >
                  <option value="" selected hidden>
                    Select Vendor
                  </option>
                  {mappingArray &&
                    mappingArray.map((item) => (
                      <option key={item.id} value={`${item.id}`}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex gap-3 min-w-fit m-5 justify-center">
                <button
                  className="p-2 w-full rounded-md ring-1 ring-slate-600"
                  onClick={() => {
                    setShowPromptElement((p) => ({ ...p, open: false }));
                  }}
                >
                  Cancel
                </button>
                <button
                  className="p-2 w-full rounded-md ring-1 ring-red text-white bg-red"
                  type="submit"
                >
                  {loading ? (
                    <CgSpinner className="animate-spin mx-auto" />
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex justify-center items-center gap-3 mt-5 w-full">
            <p>Loading</p>
            <CgSpinner className="animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
