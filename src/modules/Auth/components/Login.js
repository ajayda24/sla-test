import React, { useState } from "react";
import { HiArrowLongRight } from "react-icons/hi2";
import { BiHide } from "react-icons/bi";
import { BiShow } from "react-icons/bi";

import hr_text_black from "../../../assets/branding/hr-text-black.png";
import hr_text_white from "../../../assets/branding/hr-text-white.png";
import { CgSpinner } from "react-icons/cg";

export default function Login({ submitForm, loginFormLoading }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  return (
    <div className="min-w-full min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md p-6 text-black  dark:text-white">
        <center>
          <img src={hr_text_black} alt="logo" width={250} className="dark:hidden" />
          <img src={hr_text_white} alt="logo" width={250} className=" hidden dark:block" />
        </center>
        <form method="POST" onSubmit={(event) => submitForm(event, email, password, remember)}>
          <div className="flex flex-col p-2 gap-1 w-full ">
            <label htmlFor="loginPage-email" className="text-xs" translate="yes">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="loginPage-email"
              placeholder="Enter your email"
              required
              className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs"
              value={email}
              onChange={(e) => {
                const errorElem = document.getElementById(`login-email`);
                errorElem.style.display = "none";
                setEmail(e.target.value);
              }}
            />

            <p id={`login-email`} className="hidden w-full h-5 bg-red/5 text-red text-xs"></p>
          </div>
          <div className="flex flex-col p-2 gap-1 w-full ">
            <label htmlFor="loginPage-password" className="text-xs">
              Password
            </label>
            <div className="w-full relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="loginPage-password"
                placeholder="Enter your password"
                required
                className="border-[1px] border-border dark:bg-dark rounded-md p-1 py-2 text-xs w-full"
                value={password}
                onChange={(e) => {
                  const errorElem = document.getElementById(`login-password`);
                  errorElem.style.display = "none";
                  setPassword(e.target.value);
                }}
              />
              {showPassword && (
                <BiShow
                  className=" w-4 h-4 absolute top-1/2 transform -translate-y-1/2 right-3 text-dark"
                  onClick={() => setShowPassword(false)}
                />
              )}
              {!showPassword && (
                <BiHide
                  className=" w-4 h-4 absolute top-1/2 transform -translate-y-1/2 right-3 text-dark"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>

            <p id={`login-password`} className="hidden w-full h-5 bg-red/5 text-red text-xs"></p>
          </div>
          {/* <div className=" p-2  w-full ">
            <label
              htmlFor="login-remember"
              className="text-xs flex gap-2 items-center"
            >
              <input
                type="checkbox"
                name="remember"
                id="login-remember"
                className="w-4 h-4 p-1 py-2 rounded-full text-gray-200 bg-gray-200 accent-black dark:bg-dark dark:accent-white"
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="text-xs"> Remember me</span>
            </label>
          </div> */}
          <div className="p-2  w-full ">
            <button
              className="bg-black dark:bg-red w-full text-xs text-white rounded-md py-2 flex justify-center items-center gap-2"
              type="submit"
              disabled={loginFormLoading}
            >
              <p>Login</p>
              {loginFormLoading ? <CgSpinner className="animate-spin" /> : <HiArrowLongRight size={"1.2rem"} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
