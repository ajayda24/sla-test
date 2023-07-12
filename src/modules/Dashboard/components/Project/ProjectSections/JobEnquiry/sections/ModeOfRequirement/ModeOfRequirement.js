import {
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiArrowUpSLine,
} from "react-icons/ri";
import TableModeOfRequirement from "./TableModeOfRequirement";
import { useEffect, useState } from "react";

export default function ModeOfRequirement() {
  const [tableModeOfRequirementData, setTableModeOfRequirementData] = useState([
    { description: "description one" },
    { description: "description two" },
    { description: "description three" },
    { description: "description four" },
  ]);
  const [show, setShow] = useState(false);
 
  

  return (
    <div className="flex flex-wrap  gap-4 ">
      <div className="max-w-sm min-w-max  w-full flex gap-3 items-center h-fit">
        <button
          className="p-1 rounded-md ring-1 ring-slate-200"
          onClick={() => setShow((p) => !p)}
        >
          {show ? (
            <RiArrowDownSLine size={"1.4rem"} />
          ) : (
            <RiArrowRightSLine size={"1.4rem"} />
          )}
        </button>
        <div>
          <h2 className="font-semibold">Mode of requirement</h2>
          <p>Lorem ipsum dolor sit amet.</p>
        </div>
      </div>
      <div
        className={`w-full min-w-fit px-4 rounded-md transition-all  ${
          show ? "h-auto py-4 ring-1 ring-slate-200 " : "h-0 overflow-hidden"
        }`}
      >
        <button
          onClick={() => {
            const newRow = { description: "description one" };
           
              const CurrentTableModeOfRequirementData = [
                ...tableModeOfRequirementData,
              ];
              CurrentTableModeOfRequirementData.push(newRow);
              setTableModeOfRequirementData(CurrentTableModeOfRequirementData);
          }}
          className="bg-red text-white p-2 rounded-md mt-2 ml-2"
        >
          + Add Another
        </button>
        <TableModeOfRequirement
          tableModeOfRequirementData={tableModeOfRequirementData}
          setTableModeOfRequirementData={setTableModeOfRequirementData}
        />
      </div>
    </div>
  );
}
