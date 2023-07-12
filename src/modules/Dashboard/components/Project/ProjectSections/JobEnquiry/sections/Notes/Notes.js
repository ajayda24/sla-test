import {
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiArrowUpSLine,
} from "react-icons/ri";
import TableNotes from "./TableNotes";
import { useState } from "react";

export default function Notes() {
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
          <h2 className="font-semibold">Notes</h2>
          <p>Lorem ipsum dolor sit amet.</p>
        </div>
      </div>
      <div
        className={`w-full min-w-fit px-4 rounded-md transition-all  ${
          show ? "h-auto py-4 ring-1 ring-slate-200 " : "h-0 overflow-hidden"
        }`}
      >
        <div className="flex justify-between p-3">
          <button className="bg-red text-white p-2 rounded-md mt-2 ml-2">
            + Add Another
          </button>
          <div className="flex gap-3 items-center">
            <p>Template : </p>
            <select className="select select-sm select-bordered">
              <option value="Template 1">Template 1</option>
              <option value="Template 2">Template 2</option>
              <option value="Template 3">Template 3</option>
            </select>
          </div>
        </div>
        <TableNotes />
      </div>
    </div>
  );
}
