import React, { useState } from "react";
import { CgSpinner } from "react-icons/cg";

export default function AddEditFormNationality({
  submitForm,
  submitFormLoading,
  cancelForm,
  loadedValues = {},
  form = [],
}) {
  const [flag, setFlag] = useState("");

  return (
    <div className="flex justify-center items-center bg-white dark:bg-dark rounded-md py-5">
      <form
        method="POST"
        onSubmit={(event) => submitForm(event, flag)}
        className="w-full  flex flex-col items-center justify-center"
      >
        {form.map((elem, index) => (
          <div key={index} className="flex flex-col p-2 gap-1 w-full max-w-md">
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
                  `nationality-${elem.columnName}`
                );
                errorElem.style.display = "none";
                elem.update(e.target.value);
              }}
            />

            <p
              id={`nationality-${elem.columnName}`}
              className="hidden w-full h-5 bg-red/5 text-red text-xs"
            ></p>
          </div>
        ))}
        <div className="flex flex-col p-2 gap-1 w-full max-w-md">
          <label htmlFor={`addOrEdit-file`} className="text-xs ">
            Flag icon
          </label>
          <input
            type="file"
            name="file"
            id={`addOrEdit-file`}
            // required
            className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs"
            accept="image/png, image/jpg, image/jpeg"
            onChange={(e) => {
              const errorElem = document.getElementById(
                "nationality-flag_icon"
              );
              errorElem.style.display = "none";
              setFlag(e.target.files[0]);
            }}
          />

          <p
            id={`nationality-flag_icon`}
            className="hidden w-full h-5 bg-red/5 text-red text-xs"
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
