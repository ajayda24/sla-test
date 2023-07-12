import React from "react";
import ListDataProjectContract from "../Contract/ListDataProjectContract";

import { RiSearch2Line } from "react-icons/ri";

export default function ProjectClient() {
  return (
    <>
      <div className="flex flex-col p-5 gap-3 justify-between">
        <h2 className="text-xl font-semibold">Client Info</h2>
        <p>View the details contracts included in this project.</p>
      </div>
      <div className="flex justify-between flex-wrap xl:flex-nowrap w-full items-center gap-3 p-3 bg-slate-100 rounded-lg">
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
              />
            </div>
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Country</span>
            </label>
            <select className="select select-bordered ">
              <option disabled selected hidden>
                Select Country
              </option>
              <option>ABC</option>
              <option>ABC</option>
              <option>ABC</option>
            </select>
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">State</span>
            </label>
            <select className="select select-bordered ">
              <option disabled selected hidden>
                Select State
              </option>
              <option>ABC</option>
              <option>ABC</option>
              <option>ABC</option>
            </select>
          </div>
        </div>
        <div className="min-w-fit">
          <button className="  p-2 px-4 rounded-md bg-red text-white">
            + Add New
          </button>
        </div>
      </div>
      <ListDataProjectContract />
    </>
  );
}
