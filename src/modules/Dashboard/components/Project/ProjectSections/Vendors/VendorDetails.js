import React, { useState } from "react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";

export default function VendorDetails() {
  const [selectedStatus, setSelectedStatus] = useState("Active");
  const [showMore, setShowMore] = useState(false);
  return (
    <div className="w-full flex flex-col p-5 bg-slate-100">
      <div className="flex gap-16  p-4">
        <h1 className="font-semibold text-xl">Vendor 101 </h1>
        <div className="flex gap-4">
          <label>Status: </label>
          <select
            className={`rounded-full  select select-xs ${
              selectedStatus === "Active"
                ? "select-primary"
                : selectedStatus === "Pending"
                ? "select-warning"
                : "select-error"
            }`}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col items-start gap-3 p-4">
        <div className="flex  flex-wrap w-full min-w-fit">
          <div className="w-full max-w-xs-ultra p-2">
            <h2 className="font-semibold">Vendor Name</h2>
            <p>Lorem ipsum</p>
          </div>
          <div className="w-full max-w-xs-ultra p-2">
            <h2 className="font-semibold">Address</h2>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt
              quas quos sapient.
            </p>
          </div>
          <div className="w-full max-w-xs-ultra p-2">
            <h2 className="font-semibold">Email</h2>
            <p>vendor101@gmail.com</p>
          </div>
          <div className="w-full max-w-xs-ultra p-2">
            <h2 className="font-semibold">Mobile</h2>
            <p>+91 9876543210</p>
          </div>
          <div className="w-full max-w-xs-ultra p-2">
            <h2 className="font-semibold">Country</h2>
            <p>India</p>
          </div>
        </div>
        <div
          className={`w-full transition-all  ${
            showMore ? "h-auto" : "h-0 overflow-hidden"
          }`}
        >
          <div className="flex  flex-wrap w-full min-w-fit">
            <div className="w-full max-w-xs-ultra p-2">
              <h2 className="font-semibold">Lorem, ipsum.</h2>
              <p>Lorem ipsum</p>
            </div>
            <div className="w-full max-w-xs-ultra p-2">
              <h2 className="font-semibold">Lorem, ipsum.</h2>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Incidunt quas quos sapient.
              </p>
            </div>
            <div className="w-full max-w-xs-ultra p-2">
              <h2 className="font-semibold">Lorem, ipsum.</h2>
              <p>vendor101@gmail.com</p>
            </div>
            <div className="w-full max-w-xs-ultra p-2">
              <h2 className="font-semibold">Lorem, ipsum.</h2>
              <p>+91 9876543210</p>
            </div>
            <div className="w-full max-w-xs-ultra p-2">
              <h2 className="font-semibold">Lorem, ipsum.</h2>
              <p>India</p>
            </div>
          </div>
          <div className="flex  flex-wrap w-full ">
            <div className="w-full max-w-xs-ultra p-2">
              <h2 className="font-semibold">Lorem, ipsum.</h2>
              <p>Lorem ipsum</p>
            </div>
            <div className="w-full max-w-xs-ultra p-2">
              <h2 className="font-semibold">Lorem, ipsum.</h2>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Incidunt quas quos sapient.
              </p>
            </div>
            <div className="w-full max-w-xs-ultra p-2">
              <h2 className="font-semibold">Lorem, ipsum.</h2>
              <p>vendor101@gmail.com</p>
            </div>
            <div className="w-full max-w-xs-ultra p-2">
              <h2 className="font-semibold">Lorem, ipsum.</h2>
              <p>+91 9876543210</p>
            </div>
            <div className="w-full max-w-xs-ultra p-2">
              <h2 className="font-semibold">Lorem, ipsum.</h2>
              <p>India</p>
            </div>
          </div>
        </div>
        <button
          className="text-red p-2 mt-5 font-semibold flex gap-3 items-center"
          onClick={() => setShowMore((p) => !p)}
        >
          {showMore ? (
            <RiArrowUpSLine size={"1.4rem"} />
          ) : (
            <RiArrowDownSLine size={"1.4rem"} />
          )}
          {showMore ? "Show Less" : "Show More"}
        </button>
      </div>
    </div>
  );
}
