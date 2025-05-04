import React, { useState } from 'react';
import { IoHomeOutline } from "react-icons/io5";
import { GoUnlock } from "react-icons/go";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { Link } from 'react-router-dom';

function Leftbar() {
  const [active, setActive] = useState("Home");
  const style = "flex items-start gap-x-3 mt-6 cursor-pointer px-4 mx-2 py-2 rounded-lg text-gray-700"

  return (
    <div className="w-64 shadow-md fixed top-20 left-0 bottom-0 pb-6 bg-white">
      <div className="flex justify-between flex-col h-full">
        <div>
          <Link to="/home">
            <div
              className={`${style} ${active === "Home" ? "bg-slate-300" : "hover:bg-slate-300"}`}
              onClick={() => setActive("Home")}
            >
              <IoHomeOutline size={24} className="text-neutral-500" />
              <div className="text-base font-light">Home</div>
            </div>
          </Link>

          {/* <div
            className={`${style} ${active === "My Recordings" ? "bg-slate-300" : "hover:bg-slate-300"}`}
            onClick={() => setActive("My Recordings")}
          >
            <GoUnlock size={24} className="text-neutral-500" />
            <div className="text-base font-light">My Recordings</div>
          </div> */}
        </div>

        <div className=''>
          <div className='px-4 mx-2'>OTHER</div>
          <Link to="/faqs">
            <div className={`${style} ${active === "Faqs" ? "bg-slate-300" : "hover:bg-slate-300"}`}
              onClick={() => setActive("Faqs")}>

              <FaRegCircleQuestion size={24} className="text-neutral-500" />
              <div className="text-base font-semibold">FAQs</div>
            </div>
          </Link>

          {/* how it works */}
          <Link to="/how-it-works">
            <div className={`${style} ${active === "how-it-works" ? "bg-slate-300" : "hover:bg-slate-300"}`}
              onClick={() => setActive("how-it-works")}>
              <FaRegCircleQuestion size={24} className="text-neutral-500" />
              <div className="text-base font-semibold">How It Works</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Leftbar;
