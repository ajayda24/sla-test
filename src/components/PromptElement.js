import React, { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { TiInfoOutline } from "react-icons/ti";

export default function PromptElement({
  showPromptElement,
  setShowPromptElement,
  deleteHandler,
}) {
  const [loading, setLoading] = useState();
  return (
    <div
      className={`fixed z-50 top-0 left-0 min-w-full min-h-screen bg-black/50  justify-center items-center ${
        showPromptElement ? "flex" : "hidden"
      }`}
    >
      <div className="max-w-sm w-full h-auto  min-h-[14rem] rounded-md bg-white/90 flex justify-center items-center flex-col">
        <TiInfoOutline className="text-center text-red" size={"3rem"} />
        <h2 className="text-2xl p-4 pb-1 text-center">Are you sure ?</h2>
        <p>You won't be able to revert this!</p>
        <div className="flex gap-3 min-w-fit m-5">
          <button
            className="p-1 w-20 rounded-md ring-1 ring-slate-600"
            onClick={() => {
              setShowPromptElement((p) => ({ ...p, open: false }));
            }}
          >
            Cancel
          </button>
          <button
            className="p-1 w-20 rounded-md ring-1 ring-red text-white bg-red"
            onClick={async () => {
              setShowPromptElement((p) => ({ ...p, open: true }));
              setLoading(true);
              await deleteHandler(showPromptElement.id);
              setShowPromptElement((p) => ({ open: false }));
              setLoading(false);
            }}
          >
            {loading ? (
              <CgSpinner className="animate-spin mx-auto" />
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
