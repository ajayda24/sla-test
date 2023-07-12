import React, { useEffect, useState } from "react";
import { CgMoveLeft } from "react-icons/cg";
import hr_text_white from "../assets/branding/hr-text-white1.png";
import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../store/userSlice";

import {
  BiHomeSmile,
  BiBookmarkAltPlus,
  BiUserPin,
  BiTask,
} from "react-icons/bi";
import {
  AiOutlineFileText,
  AiOutlineCreditCard,
  AiOutlineDollarCircle,
  AiOutlineSetting,
  AiOutlineRead,
} from "react-icons/ai";
import { IoCopyOutline, IoWalletOutline } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { TbUserCircle } from "react-icons/tb";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { TiDocumentAdd } from "react-icons/ti";
import { BsCheckSquare, BsBuildings } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function ErrorSideBar({ navbarOpen, setNavbarOpen }) {
  const dispatch = useDispatch();
  // const loaderData = useLoaderData();
  let user = {},
    user_detail = {},
    imageUrl;

  const { dashboardPage } = useSelector((state) => state.user);
  useEffect(() => {
    setNavbarOpen(false);
  }, [dashboardPage]);
  return (
    <div
      className={` top-16 sm:top-auto ${
        navbarOpen ? "w-full" : "w-0"
      } sm:w-full z-10 absolute sm:max-w-xs sm:block sm:relative  sm:z-auto transition-all  ease-in-out overflow-hidden bg-blue dark:bg-dark2 `}
    >
      <div className="bg-indigo dark:bg-dark text-white w-full sm:flex justify-between items-center p-2 hidden">
        <img src={hr_text_white} alt="logo" width={100} />
        <CgMoveLeft
          size={"1.5rem"}
          className="mr-4 sm:pointer-events-none "
          onClick={() => setNavbarOpen((p) => !p)}
        />
      </div>
      <div
        className="flex gap-3 items-center sm:hidden text-sm text-white p-4 "
        onClick={() => dispatch(setPage("Edit Profile"))}
      >
        <img src={imageUrl} alt="user" className="w-7 h-7 rounded-full" />
        <div>
          <p>{user?.name}</p>
          <p className="text-gray">{user?.email}</p>
        </div>
      </div>
      <div className="min-h-screen h-auto bg-blue dark:bg-dark2 w-full p-4 sm:pt-6">
        <div className="  text-white  text-sm  flex flex-col gap-1 items-center ">
          <SideBarItem title="Dashboard" Icon={BiHomeSmile}></SideBarItem>
          <SideBarItem
            title="Quotation"
            Icon={BiBookmarkAltPlus}
            isChildren
            childTitle={["Create Quotation", "View Quotation"]}
          >
            <SideBarItem
              showTitle="View"
              title="View Quotation"
              Icon={AiOutlineRead}
              child
            />
            <SideBarItem
              showTitle="Create"
              title="Create Quotation"
              Icon={TiDocumentAdd}
              child
            />
          </SideBarItem>
          <SideBarItem
            title="Contract"
            Icon={AiOutlineFileText}
            isChildren
            childTitle={["Create Contract"]}
          >
            <SideBarItem
              showTitle="Create"
              title="Create Contract"
              Icon={TiDocumentAdd}
              child
            />
          </SideBarItem>
          <SideBarItem title="Employee" Icon={BiUserPin} />
          <SideBarItem title="Project" Icon={IoCopyOutline} />
          <SideBarItem title="Client" Icon={FiUsers} />
          <SideBarItem title="Vendor" Icon={HiOutlineUserGroup} />
          <SideBarItem title="Visa" Icon={AiOutlineCreditCard} />
          <SideBarItem title="Rate Category" Icon={IoWalletOutline} />
          <SideBarItem title="Task" Icon={BiTask} />
          <SideBarItem title="Finance" Icon={AiOutlineDollarCircle} />
        </div>
        <p className="text-gray text-xs mt-6 mb-4">USER</p>
        <div className="  text-white text-sm  flex flex-col gap-1 items-center ">
          <SideBarItem title="Users List" Icon={TbUserCircle} />
          <SideBarItem title="Roles and Permission" Icon={BsCheckSquare} />
        </div>
        <p className="text-gray text-xs mt-6 mb-4">SETTINGS</p>
        <div className="  text-white text-sm  flex flex-col gap-1 items-center ">
          <SideBarItem title="Company Settings" Icon={BsBuildings} />
          <SideBarItem title="Settings" Icon={AiOutlineSetting} />
        </div>
      </div>
    </div>
  );
}

const SideBarItem = ({
  title,
  Icon,
  children,
  child,
  isChildren,
  childTitle = [],
  showTitle,
}) => {
  const dispatch = useDispatch();
  const { dashboardPage } = useSelector((state) => state.user);

  const [dropDownOpen, setDropDownOpen] = useState(false);
  function clickSideBarItem(title, child) {
    if (!isChildren) {
      dispatch(setPage(title));
    }
    if (!child) {
      setDropDownOpen((p) => !p);
    }
  }
  // useEffect(() => {
  //   if (dashboardPage !== title && !childTitle.includes(dashboardPage)) {
  //     setDropDownOpen(false);
  //   }
  // }, [dashboardPage]);
  return (
    <>
      {isChildren ? (
        <div
          className={`${
            dashboardPage === title && "bg-red"
          } transition-all ease-in-out rounded-md w-full  cursor-pointer flex items-center gap-2 p-2  justify-between hover:bg-red`}
          onClick={() => clickSideBarItem(title, child, dropDownOpen)}
        >
          <div className="flex gap-2 items-center ">
            <Icon /> {child ? showTitle : title}
          </div>

          {isChildren &&
            (dropDownOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />)}
        </div>
      ) : (
        <Link
          to={
            title === "Dashboard"
              ? `/dashboard`
              : `/dashboard/${String(title).toLowerCase().split(" ").join("-")}`
          }
          className="w-full"
        >
          <div
            className={`${
              dashboardPage === title && "bg-red"
            } transition-all ease-in-out rounded-md w-full  cursor-pointer flex items-center gap-2 p-2  justify-between hover:bg-red`}
            onClick={() => clickSideBarItem(title, child, dropDownOpen)}
          >
            <div className="flex gap-2 items-center ">
              <Icon /> {child ? showTitle : title}
            </div>

            {isChildren &&
              (dropDownOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />)}
          </div>
        </Link>
      )}
      {isChildren && (
        <div
          className={`${
            dropDownOpen ? "  mb-4 h-auto pl-6" : "p-0 h-0"
          }  w-full  overflow-hidden`}
        >
          {children}
        </div>
      )}
    </>
  );
};
