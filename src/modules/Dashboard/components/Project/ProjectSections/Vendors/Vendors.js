import React, { useEffect, useState } from "react";
import VendorDetails from "./VendorDetails";
import ListDataProjectVendors from "./ListDataProjectVendors";
import { RiSearch2Line } from "react-icons/ri";
import { axios } from "../../../../../../Global";
import { useParams } from "react-router-dom";
import VendorCreate from "./VendorCreatePopup";
import { useDispatch } from "react-redux";
import { setAppError } from "../../../../../../store/userSlice";

export default function Vendors() {
  const { projectId } = useParams();
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [country, setCountry] = useState("all");
  const [vendorList, setVendorList] = useState([]);
  const [countries, setCountries] = useState([]);

  const [vendorCreateState, setVendorCreateState] = useState({
    open: false,
  });

  const [isDataDeleted, setIsDataDeleted] = useState(false);

  const getProjectVendors = async () => {
    try {
      const { data } = await axios.get(`/dashboard/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let vendors = data?.data?.project?.project_vendor;
      setCountries(data?.data?.country);
      setVendorList(vendors);
    } catch (error) {
      console.log(error);
      dispatch(
        setAppError({
          msg: error.message,
        })
      );
    }
  };
  useEffect(() => {
    getProjectVendors();
  }, [vendorCreateState.open, isDataDeleted]);

  return (
    <>
      {vendorCreateState.open && (
        <VendorCreate
          showPromptElement={vendorCreateState}
          setShowPromptElement={setVendorCreateState}
          projectId={projectId}
        />
      )}
      <div className="w-full flex flex-col gap-2  p-5 ">
        <h2 className="font-medium text-xl">Vendors</h2>
        <p>View the details vendors included in this project.</p>
      </div>
      <div className="flex justify-between flex-wrap  w-full items-center gap-3 p-3 bg-slate-100 rounded-lg">
        <div className="flex flex-wrap items-center gap-3 w-full ">
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Search for contract</span>
            </label>
            <div className="relative">
              <p className="absolute top-1/2 -translate-y-1/2 px-3">
                <RiSearch2Line size={"1.2rem"} />
              </p>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full max-w-xs pl-10"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Country</span>
            </label>
            <select
              className="select select-bordered"
              onChange={(e) => setCountry(e.target.value)}
              value={country}
            >
              <option disabled key={"1"} selected hidden>
                Select Country
              </option>
              <option key={"2"} value={"all"}>
                All
              </option>
              {countries.map((country) => (
                <option key={country} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Status</span>
            </label>
            <select
              className="select select-bordered "
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option key={`1`} disabled selected hidden>
                Select Status
              </option>
              <option key={"2"} value={"all"}>
                All
              </option>
              <option value={"Confirmed"}>Confirmed</option>
              <option value={"Not Confirmed"}>Not Confirmed</option>
            </select>
          </div>
        </div>
        <div className="min-w-fit">
          <button
            className="  p-2 px-4 rounded-md bg-red text-white"
            onClick={() => setVendorCreateState((p) => ({ ...p, open: true }))}
          >
            + Add New
          </button>
        </div>
      </div>
      <ListDataProjectVendors
        titles={["Sl No.", "Vendor Name", "Country", "Status", "Action"]}
        country={country}
        filterStatus={filterStatus}
        vendors={vendorList}
        searchKeyword={searchKeyword}
        setIsDataDeleted={setIsDataDeleted}
      />
    </>
  );
}

const VendorView = () => {
  const allSections = [
    "Vendor Details",
    "Job Enquiry",
    "Job Openings",
    "Interview schedules",
    "Candidates Info",
    "Final Selection",
  ];
  const [currentSection, setCurrentSection] = useState("Vendor Details");
  return (
    <>
      <div className="w-full flex flex-col gap-2  p-5 ">
        <h2 className="font-medium text-xl">Vendors</h2>
        <p>View the details vendors included in this project.</p>
        <div className="w-full rounded-lg  flex flex-wrap gap-4 ">
          {allSections.map((sect) => (
            <button
              className={` font-medium p-1 px- ${
                currentSection === sect
                  ? "border-b-[3px] border-b-red text-red font-semibold"
                  : " text-black"
              } `}
              onClick={() => setCurrentSection(sect)}
            >
              {sect}
            </button>
          ))}
        </div>
      </div>
      {currentSection === "Vendor Details" && <VendorDetails />}
    </>
  );
};
