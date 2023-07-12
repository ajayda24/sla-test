import React, { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { HiArrowLongRight } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { axios } from "../../../../Global";
import { useDispatch } from "react-redux";
import { setAppError } from "../../../../store/userSlice";

export default function ContractFileUpload({
  showPromptElement,
  setShowPromptElement,
  updateComponent,
}) {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileDescription, setFileDescription] = useState("");
  const [file, setFile] = useState();
  const [fileType, setFileType] = useState("");
  const fileTypes = [
    "Contract File",
    "COC File",
    "Other",
    "Annexure File",
    "Security Deposit File",
    "VISA Cost File",
  ];

  const submitHandler = async (e, fileData) => {
    e.preventDefault();

    try {
      console.log(fileName, fileDescription, fileData, fileType);
      const formData = new FormData();
      formData.append("file_name", fileName);
      formData.append("type", fileType);
      formData.append("description", fileDescription);
      if (fileData) {
        formData.append("file", fileData);

        const response = await axios.post(
          `/dashboard/contract/file-upload/${showPromptElement.contractId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 200) {
          setShowPromptElement((p) => ({ ...p, open: false }));
          updateComponent((p) => !p);
          setLoading(false);
          dispatch(
            setAppError({
              msg: "Successfully uploaded.",
              color: "success",
            })
          );
        }
      }
    } catch (err) {
      setShowPromptElement((p) => ({ ...p, open: false }));
      updateComponent((p) => !p);

      setLoading(false);

      console.log(err);
      dispatch(
        setAppError({
          msg: err.message,
        })
      );
      if (err.response?.data?.message) {
        dispatch(
          setAppError({
            msg: err.response?.data?.message,
          })
        );
      }
    }
  };
  return (
    <div
      className={`fixed z-50 top-0 left-0 min-w-full min-h-screen py-10 bg-black/50  justify-center items-center ${
        showPromptElement.open ? "flex" : "hidden"
      }`}
    >
      <div className="max-w-xl w-full h-[90vh]  rounded-md bg-white/95 flex  flex-col p-4 relative overflow-y-scroll">
        <center>
          <div className="max-w-lg lg:max-w-5xl w-full bg-white dark:bg-dark rounded-md  p-5 flex flex-col  items-start justify-center">
            <div className="flex justify-between items-center w-full mb-10">
              <h2 className="text-2xl  font-bold ">File Upload</h2>
              <IoMdClose
                size={"1.4rem"}
                onClick={() => {
                  setShowPromptElement((p) => ({ ...p, open: false }));
                }}
                className="cursor-pointer"
              />
            </div>
            <form onSubmit={(e) => submitHandler(e, file)} className="w-full">
              <div className="w-full flex flex-col justify-center items-center ">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">File Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full "
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-control w-full ">
                  <label className="label">
                    <span className="label-text">File Description</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full "
                    value={fileDescription}
                    onChange={(e) => setFileDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="form-control w-full ">
                  <label className="label">
                    <span className="label-text">Select File Type</span>
                  </label>
                  <select
                    className="select select-bordered"
                    onChange={(e) => setFileType(e.target.value)}
                    required
                  >
                    <option value={""} disabled selected hidden>
                      Select File Type
                    </option>
                    {fileTypes.map((type, i) => (
                      <option key={i} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control w-full ">
                  <label className="label">
                    <span className="label-text">Upload File</span>
                  </label>
                  <input
                    type="file"
                    className="file-input file-input-bordered w-full "
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                    accept="image/*, application/doc, application/docx, application/pdf, application/xls, application/xlsx"
                  />
                </div>
                <button
                  type="submit"
                  className="p-2 bg-red text-white rounded-md w-full max-w-sm m-2 my-4 flex gap-3 justify-center"
                >
                  {" "}
                  <p>Submit</p>
                  {loading ? (
                    <CgSpinner className="animate-spin" />
                  ) : (
                    <HiArrowLongRight size={"1.2rem"} />
                  )}
                </button>
              </div>
            </form>
          </div>
        </center>
      </div>
    </div>
  );
}
