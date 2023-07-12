import { axios } from "../../../../Global";
import React, { useState } from "react";
import { AiOutlineCloudUpload, AiOutlineEdit } from "react-icons/ai";
import { HiOutlineTrash } from "react-icons/hi";
import { useLoaderData, useNavigate } from "react-router-dom";
import { setAppError } from "../../../../store/userSlice";
import { useDispatch } from "react-redux";
import { CgSpinner } from "react-icons/cg";

export default function Profile() {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loaderData = useLoaderData();
  console.log(loaderData);
  // const user = {};
  // const user_detail = {};
  const user = loaderData?.data?.data?.user;
  const user_detail = user?.user_detail;
  console.log(user);
  const [editProfileForm, setEditProfileForm] = useState({
    submitted: false,
    loading: false,
  });
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user_detail.mobile);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [editFields, setEditFields] = useState({
    email: false,
    password: false,
    name: false,
    phone: false,
    imageEdited: false,
  });

  const [imageUrl, setImageUrl] = useState({
    url: user_detail.profile_image_path,
    file: "",
  });

  const editProfile = async (event) => {
    setEditProfileForm((p) => ({ ...p, loading: true }));

    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("mobile", phone);
    if (editFields.password) formData.append("password", password);
    if (editFields.imageEdited) formData.append("profile_image", imageUrl.file);
    try {
      const response = await axios.post("/dashboard/profile_update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        setEditProfileForm((p) => ({ ...p, submitted: true, loading: false }));
        navigate("/dashboard");
        window.location.reload();
        dispatch(
          setAppError({
            msg: response.data.message,
            color: "success",
          })
        );
      }
    } catch (err) {
      console.log(err);
      dispatch(
        setAppError({
          msg: err.response.data.message,
        })
      );
    }
  };

  return (
    <div className="p-3 md:p-16 ">
      <h2 className="text-3xl font-bold">My Profile</h2>
      <p className="my-2 text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </p>
      <div className="flex flex-wrap justify-center sm:justify-start my-8 gap-7 items-center">
        <img src={imageUrl.url} alt="User" className="w-44 h-44 rounded-full" />
        <div className="flex flex-col gap-3">
          <button
            className="p-3 sm:px-7 bg-red text-white rounded-md flex items-center gap-2"
            onClick={() => {
              document.getElementById("profile-photo").click();
            }}
          >
            <input
              type="file"
              id="profile-photo"
              name="profile-photo"
              className="hidden"
              accept="image/png, image/jpg, image/jpeg"
              onChange={(e) => {
                setEditFields((p) => ({ ...p, imageEdited: true }));
                setImageUrl({
                  url: e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : user_detail.profile_image_path,
                  file: e.target.files[0],
                });
              }}
            />
            <AiOutlineCloudUpload /> Upload New
          </button>
          <button className="p-3 sm:px-7 rounded-md ring-1 ring-slate-400 flex gap-2 items-center">
            <HiOutlineTrash /> Delete Photo
          </button>
        </div>
      </div>
      {/* <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
        The resolution should be minimum 72 ppi and dimensions should be 256p x
        256p
      </p> */}
      <form method="POST" onSubmit={(event) => editProfile(event)} encType="multipart/form-data">
        <div className="flex flex-col p-2 gap-1 w-full max-w-sm mt-5">
          <label htmlFor="profile-name" className="text-sm">
            Name
          </label>
          <div className="relative">
            <input
              type="name"
              name="name"
              id="profile-name"
              placeholder="Enter your name"
              required
              className="w-full border-[1px] border-border dark:bg-dark rounded-md p-2 py-3 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!editFields.name}
            />
            <AiOutlineEdit
              className=" w-4 h-4 absolute top-1/2 transform -translate-y-1/2 right-3 text-dark dark:text-white"
              onClick={() => setEditFields((p) => ({ ...p, name: true }))}
            />
          </div>
          <div className="requirements"></div>
        </div>
        <div className="flex flex-col p-2 gap-1 w-full max-w-sm ">
          <label htmlFor="profile-mobile" className="text-sm">
            Mobile Number
          </label>
          <div className="relative">
            <input
              type="tel"
              name="mobile"
              id="profile-mobile"
              placeholder="Enter your Mobile Number"
              required
              className="w-full border-[1px] border-border dark:bg-dark rounded-md p-2 py-3 text-sm"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!editFields.phone}
            />

            <AiOutlineEdit
              className=" w-4 h-4 absolute top-1/2 transform -translate-y-1/2 right-3 text-dark dark:text-white"
              onClick={() => setEditFields((p) => ({ ...p, phone: true }))}
            />
          </div>
          <div className="requirements"></div>
        </div>
        <div className="flex flex-col p-2 gap-1 w-full max-w-sm ">
          <label htmlFor="profile-email" className="text-sm">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              id="profile-email"
              placeholder="Enter your Email"
              required
              className="w-full border-[1px] border-border dark:bg-dark rounded-md p-2 py-3 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!editFields.email}
            />
            <AiOutlineEdit
              className=" w-4 h-4 absolute top-1/2 transform -translate-y-1/2 right-3 text-dark dark:text-white"
              onClick={() => setEditFields((p) => ({ ...p, email: true }))}
            />
          </div>

          <div className="requirements"></div>
        </div>
        <div className="flex flex-col p-2 gap-1 w-full max-w-sm ">
          <label htmlFor="profile-password" className="text-sm">
            Password
          </label>
          <div className="relative">
            <input
              type={editFields.password ? "text" : "password"}
              name="password"
              id="profile-password"
              placeholder="********"
              required
              className="w-full border-[1px] border-border dark:bg-dark rounded-md p-2 py-3 text-sm "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!editFields.password}
            />
            <AiOutlineEdit
              className=" w-4 h-4 absolute top-1/2 transform -translate-y-1/2 right-3 text-dark dark:text-white"
              onClick={() => setEditFields((p) => ({ ...p, password: true }))}
            />
          </div>

          <div className="requirements"></div>
        </div>
        <div className="max-w-sm  w-full p-2">
          <button
            className="w-full rounded-md bg-dark dark:bg-red text-white p-3 flex gap-3 items-center justify-center"
            type="submit"
            disabled={editProfileForm.loading}
          >
            Save Changes {editProfileForm.loading && <CgSpinner className="animate-spin" />}
          </button>
        </div>
      </form>
    </div>
  );
}
