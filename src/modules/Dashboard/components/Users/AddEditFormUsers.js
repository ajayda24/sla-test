import React, { useState } from "react";
import { CgSpinner } from "react-icons/cg";

export default function AddEditForm({
  submitForm,
  submitFormLoading,
  cancelForm,
  loadedValues = {},
  form = [],
  component,
  roles,
}) {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const rolesSelectorHandler = (e) => {
    if (selectedRoles.includes(e.target.value)) {
      console.log(e.target.value);
      setSelectedRoles((p) => p.filter((r) => r !== e.target.value));
    } else {
      setSelectedRoles((p) => [...p, e.target.value]);
    }
  };
  return (
    <div className="flex justify-center items-center bg-white dark:bg-dark rounded-md py-5">
      <form
        method="POST"
        onSubmit={(event) => submitForm(event, selectedRoles)}
        className="w-full  flex flex-col items-center justify-center"
      >
        {form.map((elem, index) => (
          <div
            key={index}
            className={`flex flex-col p-2 gap-1 w-full max-w-md ${
              elem.hidden ? "hidden" : ""
            }`}
          >
            <label htmlFor={`addOrEdit-${elem.name}`} className="text-xs ">
              {elem.text}
            </label>
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
            <p
              id={`${component}-${elem.columnName}`}
              className="hidden w-full h-5 bg-red/5 text-red text-xs"
            ></p>
          </div>
        ))}

        <div className="w-full max-w-md m-3">
          <p className="text-left w-full max-w-md p-2">Select Roles</p>
          <div className="flex flex-col w-full max-w-md p-2">
            {roles.map((role, i) => {
              return (
                <div key={i} className="form-control w-full max-w-md">
                  <label className="label cursor-pointer">
                    <span className="label-text">{role.name}</span>
                    <input
                      type="checkbox"
                      className="toggle"
                      name={role.name}
                      id={`addOrEdit-${role.name}`}
                      value={role.id}
                      onChange={(e) => rolesSelectorHandler(e)}
                    />
                  </label>
                </div>
              );
            })}
          </div>
          <p
            id={`${component}-roles`}
            className="hidden w-full h-5 bg-red/5 text-red text-xs  max-w-md p-2"
          ></p>
        </div>

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
