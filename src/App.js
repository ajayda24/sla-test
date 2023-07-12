import { useEffect, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginPage as Login, loader as authLoader } from "./modules/Auth";
// import Dashboard from "./pages/dashboard";

// import { loader as authLoader } from "./modules/Auth/Pages/login";
import { loader as dashboardLoader } from "./modules/Dashboard/Pages/dashboard";
import Error from "./utils/Error";
import Toast from "./utils/Toast";
import { useDispatch, useSelector } from "react-redux";
import { removeAppError } from "./store/userSlice";

import {
  Client,
  Company,
  Dashboard,
  JobPosition,
  Notes,
  Profile,
  Nationality,
  Quotation,
  RateCategory,
  QuotationCostSheet,
  QuotationCostSheetStep2ForNew,
  TermsAndCondition,
  QuotationCostTermsAndCondition,
  QuotationCostNotes,
  Users,
  Roles,
  Templates,
  TemplatesTermsAndCondition,
  TemplatesNotes,
  Contract,
  ContractSingleView,
  Project,
  Sector,
  Source,
  Vendor,
} from "./modules/Dashboard";

import "./utils/language";

// import Profile from "./components/Dashboard/Profile/Profile";
// import Client from "./components/Dashboard/Client/Client";
// import Nationality from "./components/Dashboard/Nationality/Nationality";
// import RateCategory from "./components/Dashboard/RateCategory/RateCategory";

// import QuotationCostSheet from "./components/Dashboard/Quotation/QuotationCostSheet/QuotationCostSheet";
// import QuotationCostSheetStep2ForNew from "./components/Dashboard/Quotation/QuotationCostSheet/Step2ForNew";
// import Notes from "./components/Dashboard/Notes/Notes";
// import Company from "./components/Dashboard/Company/Company";
// import TermsAndCondition from "./components/Dashboard/TermsAndCondition/TermsAndCondition";
// import JobPosition from "./components/Dashboard/JobPosition/JobPosition";
// import QuotationCostTermsAndCondition from "./components/Dashboard/Quotation/QuotationCostSheet/QuotationCostTerms/QuotationCostTermsAndCondition";
// import QuotationCostNotes from "./components/Dashboard/Quotation/QuotationCostSheet/QuotationCostNotes/QuotationCostNotes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    loader: authLoader,
    errorElement: <Error />,
  },
  {
    path: "/login",
    element: <Login />,
    loader: authLoader,
    errorElement: <Error />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    loader: dashboardLoader,
    errorElement: <Error />,
    children: [
      {
        path: "edit-profile",
        element: <Profile />,
        loader: dashboardLoader,
      },
      {
        path: "client",
        element: <Client />,
        children: [
          {
            path: "create",
            element: <Client />,
          },
          {
            path: "edit/:id",
            element: <Client />,
          },
        ],
      },
      {
        path: "nationality",
        element: <Nationality />,
        children: [
          {
            path: "create",
            element: <Nationality />,
          },
          {
            path: "edit/:id",
            element: <Nationality />,
          },
        ],
      },
      {
        path: "rate-category",
        element: <RateCategory />,
        children: [
          {
            path: "create",
            element: <RateCategory />,
          },
        ],
      },
      {
        path: "rate-category/:categoryId",
        element: <RateCategory />,
      },
      {
        path: "rate-category/:categoryId/edit/:id",
        element: <RateCategory />,
      },

      {
        path: "quotation",
        element: <Quotation />,
        children: [
          { path: "create", element: <Quotation /> },
          { path: "view", element: <Quotation /> },
          { path: "edit-quotation/:id", element: <Quotation /> },
        ],
      },
      {
        path: "quotation/:quotationId",
        element: <QuotationCostSheet />,
        children: [
          { path: "create", element: <QuotationCostSheetStep2ForNew /> },
          { path: "edit/:id", element: <QuotationCostSheet /> },
          {
            path: "terms",
            element: <QuotationCostTermsAndCondition />,
            children: [
              { path: "create", element: <QuotationCostTermsAndCondition /> },
            ],
          },
          {
            path: "notes",
            element: <QuotationCostNotes />,
            children: [{ path: "create", element: <QuotationCostNotes /> }],
          },
        ],
      },
      {
        path: "notes",
        element: <Notes />,
        children: [
          { path: "create", element: <Notes /> },
          { path: "edit-notes/:id", element: <Notes /> },
        ],
      },
      {
        path: "company",
        element: <Company />,
        children: [
          { path: "create", element: <Company /> },
          { path: "edit-company/:id", element: <Company /> },
        ],
      },
      {
        path: "job-position",
        element: <JobPosition />,
        children: [
          { path: "create", element: <JobPosition /> },
          { path: "edit/:id", element: <JobPosition /> },
        ],
      },
      {
        path: "terms-and-condition",
        element: <TermsAndCondition />,
        children: [
          { path: "create", element: <TermsAndCondition /> },
          { path: "edit/:id", element: <TermsAndCondition /> },
        ],
      },
      {
        path: "users",
        element: <Users />,
        children: [
          { path: "create", element: <Users /> },
          { path: "edit/:id", element: <Users /> },
        ],
      },
      {
        path: "roles-and-permission",
        element: <Roles />,
        children: [
          { path: "create", element: <Roles /> },
          { path: "edit/:id", element: <Roles /> },
        ],
      },
      {
        path: "templates",
        element: <Templates />,
        children: [
          { path: "create", element: <Templates /> },
          { path: "view", element: <Templates /> },
          { path: "edit-templates/:id", element: <Templates /> },
        ],
      },
      {
        path: "templates/:templateId",
        element: <Templates />,
        children: [
          {
            path: "terms",
            element: <TemplatesTermsAndCondition />,
            children: [
              { path: "create", element: <TemplatesTermsAndCondition /> },
              { path: "edit/:id", element: <TemplatesTermsAndCondition /> },
            ],
          },
          {
            path: "notes",
            element: <TemplatesNotes />,
            children: [{ path: "create", element: <TemplatesNotes /> }],
          },
        ],
      },
      {
        path: "contract",
        element: <Contract />,
        children: [
          { path: "create", element: <Contract /> },
          { path: "view", element: <Contract /> },
          { path: "edit-contract/:id", element: <Contract /> },
        ],
      },
      {
        path: "contract/:contractId",
        element: <ContractSingleView />,
      },
      {
        path: "project",
        element: <Project />,
        children: [
          { path: "create", element: <Project /> },
          { path: "view", element: <Project /> },
          { path: "edit-contract/:id", element: <Project /> },
        ],
      },
      {
        path: "project/:projectId",
        element: <Project />,
      },
      {
        path: "source",
        element: <Source />,
        children: [
          {
            path: "create",
            element: <Source />,
          },
          {
            path: "edit/:id",
            element: <Source />,
          },
        ],
      },
      {
        path: "sector",
        element: <Sector />,
        children: [
          {
            path: "create",
            element: <Sector />,
          },
          {
            path: "edit/:id",
            element: <Sector />,
          },
        ],
      },
      {
        path: "vendor",
        element: <Vendor />,
        children: [
          {
            path: "create",
            element: <Vendor />,
          },
          {
            path: "edit/:id",
            element: <Vendor />,
          },
        ],
      },
    ],
  },
]);

function App() {
  const { appErrors } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    for (let i = 0; i < appErrors.length; i++) {
      setTimeout(() => {
        dispatch(removeAppError(appErrors[i].id));
      }, 4000);
    }
  }, [appErrors]);

  useEffect(() => {
    document.addEventListener("wheel", function (event) {
      if (document.activeElement.type === "number") {
        document.activeElement.blur();
      }
    });
  }, []);
  return (
    <div className="relative">
      <Suspense fallback={null}>
        <RouterProvider router={router} />
        <div className="fixed max-w-sm w-full top-3 left-1/2 transform -translate-x-1/2 sm:right-5 sm:left-auto sm:transform-none">
          {appErrors.map(({ msg, id, color }, i) => (
            <Toast key={id} msg={msg} id={id} color={color} />
          ))}
        </div>
      </Suspense>
    </div>
  );
}

export default App;
