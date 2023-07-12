import { useEffect, useState } from "react";
import {
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiArrowUpSLine,
} from "react-icons/ri";
import { useParams } from "react-router-dom";

export default function BasicInfo() {
  const [show, setShow] = useState(true);
  const { projectId } = useParams();
  const [name,setName] = useState();
  const [JobDescription,setJobDescription] = useState();
  const [visaToggle,setVisaToggle] = useState(false);
  const [edocToggle,setEdocToggle] = useState(false);
  const [visaCostAmount,setVisaCostAmount] = useState();
  const [edocAmount,setEdocAmount] = useState();


  const basicInfos = {
    name,
    description: JobDescription,
    project_id: projectId,
    ...(visaToggle
      ? {
          visa_cost_commission: 'YES',
          visa_cost_commission_value: visaCostAmount,
        }
      : { visa_cost_commission: 'NO' }),
    ...(edocToggle
      ? {
          edoc: 'YES',
          edoc_value: edocAmount,
        }
      : { edoc: 'NO' })
  };
  
  useEffect(()=>{
    console.log(basicInfos)
  },[basicInfos]);

  return (
    <div className=" w-full flex flex-wrap md:flex-nowrap">
      <div className="max-w-sm w-full flex gap-3 items-center h-fit">
        <button
          className="p-1 rounded-md ring-1 ring-slate-200"
          onClick={() => setShow((p) => !p)}
        >
          {show ? (
            <RiArrowDownSLine size={"1.4rem"} />
          ) : (
            <RiArrowRightSLine size={"1.4rem"} />
          )}
        </button>
        <div>
          <h2 className="font-semibold">Basic Info</h2>
          <p>Enter basic details here</p>
        </div>
      </div>
      <div
        className={` w-full px-4 rounded-md transition-all overflow-hidden ${
          show ? "h-auto py-4 ring-1 ring-slate-200 " : "h-0"
        }`}
      >
        <div className="form-control w-full ">
          <label className="label">
            <span className="label-text">Job name</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full "
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />
        </div>
        <div className="form-control w-full ">
          <label className="label">
            <span className="label-text">Your Description</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-24"
            placeholder="Description"
            value={JobDescription}
            onChange={(e)=>setJobDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="form-control mt-5 max-w-sm">
          <label className="label flex-wrap cursor-pointer justify-start gap-4">
            <input
              type="checkbox"
              className="toggle toggle-error"
              defaultChecked={visaToggle}
              onChange={()=>setVisaToggle(!visaToggle)}
            />
            <div>
              <h3 className="label-text font-semibold">
                Visa cost / commission in SR
              </h3>
              <p className="label-text">Lorem ipsum dolor sit.</p>
            </div>
          </label>
        </div>
        {
          visaToggle &&
          <div className="form-control w-full ">
            <label className="label">
              <span className="label-text">Visa Cost Amount</span>
            </label>
            <input type="text" placeholder="Type here"
              className="input input-bordered w-full "
              value={visaCostAmount}
              onChange={(e)=>setVisaCostAmount(e.target.value)}
            />
          </div>

        }
        <div className="form-control  max-w-sm">
          <label className="label flex-wrap cursor-pointer justify-start gap-4">
            <input
              type="checkbox"
              className="toggle toggle-error"
              defaultChecked={edocToggle}
              onChange={()=>setEdocToggle(!edocToggle)}
            />
            <div>
              <h3 className="label-text font-semibold">EDOC</h3>
              <p className="label-text">Lorem ipsum dolor sit.</p>
            </div>
          </label>
        </div>
        {
          edocToggle &&
          <div className="form-control w-full ">
            <label className="label">
              <span className="label-text">Edoc Cost Amount</span>
            </label>
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered w-full "
              value={edocAmount}
              onChange={(e)=>setEdocAmount(e.target.value)}
            />
          </div>

        }
      </div>
    </div>
  );
}
