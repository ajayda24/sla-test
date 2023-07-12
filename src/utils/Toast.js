import React from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { IoCloseOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { setAppError, removeAppError } from "../store/userSlice";

export default function Toast({ msg, id, color = "bg-red" }) {
  const dispatch = useDispatch();
  return (
    <div
      className={`flex gap-3 items-center w-full max-w-lg p-3 py-2 text-white  rounded-lg shadow-lg mb-1 ${
        color === "success" ? "bg-green-700" : color
      }`}
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
        <AiOutlineInfoCircle size={"1.7rem"} />
      </div>
      <div className="ml-3 text-sm font-normal">{msg}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-white text-black hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 h-8 w-8 flex items-center justify-center"
        onClick={() => dispatch(removeAppError(id))}
      >
        <IoCloseOutline size={"1.2rem"} />
      </button>
    </div>
  );
}
