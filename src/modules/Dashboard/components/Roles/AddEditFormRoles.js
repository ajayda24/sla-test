import React, { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { axios } from "../../../../Global";
import { setAppError } from "../../../../store/userSlice";

export default function AddEditForm({
  submitForm,
  submitFormLoading,
  cancelForm,
  loadedValues = {},
  form = [],
  component,
  getPermissionList,
}) {
  const dispatch = useDispatch();

  const [selectPermissions, setSelectPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const permissionLists = useSelector(
    (state) => state.roleManagement.permissionLists
  );

  async function getselectedPermissions(id) {
    setLoading(true);
    try {
      if (id) {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/dashboard/roles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSelectedPermissions(response?.data?.data?.role?.permissions);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);

      dispatch(
        setAppError({
          msg: error.message,
        })
      );
    }
  }

  useEffect(() => {
    if (permissionLists.length <= 0) {
      dispatch(getPermissionList());
    }
    if (loadedValues?.method === "edit") {
      getselectedPermissions(loadedValues.editId);
    }
  }, [dispatch, loadedValues, getPermissionList, permissionLists.length]);

  const rolesSelectorHandler = (e) => {
    if (selectPermissions.includes(e.target.value)) {
      setSelectPermissions((p) => p.filter((r) => r !== e.target.value));
    } else {
      setSelectPermissions((p) => [...p, e.target.value]);
    }
  };

  return (
    <div className="flex justify-center items-center bg-white dark:bg-dark rounded-md py-5">
      {loading ? (
        <div className="flex justify-center items-center gap-3 mt-5 w-full col-span-4">
          <p>Loading</p>
          <CgSpinner className="animate-spin" />
        </div>
      ) : (
        <form
          method="POST"
          onSubmit={(event) => submitForm(event, selectPermissions)}
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
              {permissionLists.map((role, i) => {
                return (
                  <div key={i} className="form-control w-full max-w-md">
                    <label className="label cursor-pointer">
                      <span className="label-text">{role.name}</span>
                      <input
                        type="checkbox"
                        className="toggle"
                        // checked={selectedPermissions.some(
                        //   (obj) => obj.id === role.id
                        // )}
                        defaultChecked={selectedPermissions.some(
                          (obj) => obj.id === role.id
                        )}
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
      )}
    </div>
  );
}
