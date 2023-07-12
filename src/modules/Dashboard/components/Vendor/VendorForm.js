import React, { useState } from "react";
import { CgSpinner } from "react-icons/cg";

export default function AddEditForm({
  submitForm,
  submitFormLoading,
  cancelForm,
  loadedValues = {},
  form = [],
  component,
}) {

const [country,setCountry] = useState('');
  return (
    <div className="flex justify-center items-center bg-white dark:bg-dark rounded-md py-5">
      <form
        method="POST"
        onSubmit={(event) => submitForm(event)}
        className="w-full  flex flex-col items-center justify-center"
      >
{form.map((elem, index) => (
  <div
    key={index}
    className={`flex flex-col p-2 gap-1 w-full max-w-md ${
      elem.hidden ? "hidden" : ""
    }`}
  >
    <label htmlFor={`addOrEdit-${elem.name}`} className="text-xs">
      {elem.text}
    </label>
    {elem.type === "select" ? (
      <select
      name={elem.name}
      id={`addOrEdit-${elem.name}`}
      required
      className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs"
      value={elem.value}
      onChange={(e) => {
        const errorElem = document.getElementById(
          `${component}-${elem.columnName}`
        );
        errorElem.style.display = "none";
        elem.update(e.target.value);
      }}
      disabled={elem.disabled ? true : false}
    >
      <option value="">Select a {elem.text}</option>
      {elem.options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
    


    
    ) : (
      <input
        type={elem.type}
        name={elem.name}
        id={`addOrEdit-${elem.name}`}
        placeholder={`Enter ${elem.text}`}
        required
        className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs"
        value={elem.value}
        onChange={(e) => {
          const errorElem = document.getElementById(
            `${component}-${elem.columnName}`
          );
          errorElem.style.display = "none";
          elem.update(e.target.value);
        }}
        disabled={elem.disabled ? true : false}
      />
    )}
    <p
      id={`${component}-${elem.columnName}`}
      className="hidden w-full h-5 bg-red/5 text-red text-xs"
    ></p>
  </div>
))}



        <div className="p-2  w-full max-w-md flex gap-3">
          <button
            className="ring-1 ring-black dark:ring-red w-full text-xs dark:text-white rounded-md py-2 flex justify-center items-center gap-2"
            type="button"
            disabled={submitFormLoading}
            onClick={cancelForm}
          >
            <p>Cancel</p>
          </button>
          <button
            className="bg-black dark:bg-red w-full text-xs text-white rounded-md py-2 flex justify-center items-center gap-2"
            type="submit"
            disabled={submitFormLoading}
          >
            <p>Submit</p>
            {submitFormLoading && <CgSpinner className="animate-spin" />}
          </button>
        </div>
      </form>
    </div>
  );
}