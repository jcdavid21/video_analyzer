import React, { useState, useEffect } from 'react';
import { IoHomeOutline } from "react-icons/io5";
import { GoUnlock } from "react-icons/go";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { Link, useLocation } from 'react-router-dom';

export default function Leftbar() {
  const location = useLocation();
  const [active, setActive] = useState("");
  
  // Set active state based on current path
  useEffect(() => {
    const path = location.pathname;
    
    if (path === "/home" || path === "/") {
      setActive("Home");
    } else if (path === "/faqs") {
      setActive("Faqs");
    } else if (path === "/how-it-works") {
      setActive("how-it-works");
    } else if (path === "/recordings") {
      setActive("My Recordings");
    }
  }, [location.pathname]);
  
  // Consistent style for all menu items
  const baseStyle = "flex items-start gap-x-3 mt-6 cursor-pointer px-4 mx-2 py-2 rounded-lg";
  const activeStyle = "bg-blue-100 text-blue-700 font-medium";
  const inactiveStyle = "text-gray-700 hover:bg-slate-100";
  
  // Menu item component for consistent styling
  const MenuItem = ({ to, label, icon, id }) => {
    const isActive = active === id;
    return (
      <Link to={to}>
        <div
          className={`${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}
          onClick={() => setActive(id)}
        >
          {icon}
          <div className={`text-base ${isActive ? "font-medium" : "font-light"}`}>{label}</div>
        </div>
      </Link>
    );
  };

  return (
    <div className="w-64 shadow-md fixed top-20 left-0 bottom-0 pb-6 bg-white">
      <div className="flex justify-between flex-col h-full">
        <div>
          <MenuItem 
            to="/home" 
            label="Home" 
            id="Home"
            icon={<IoHomeOutline size={24} className={active === "Home" ? "text-blue-600" : "text-neutral-500"} />} 
          />
          
          {/* Commented out but with consistent styling if uncommented
          <MenuItem 
            to="/recordings" 
            label="My Recordings" 
            id="My Recordings"
            icon={<GoUnlock size={24} className={active === "My Recordings" ? "text-blue-600" : "text-neutral-500"} />} 
          /> */}
        </div>

        <div>
          <div className="px-4 mx-2 text-sm font-medium text-gray-500 mt-6">OTHER</div>
          
          <MenuItem 
            to="/faqs" 
            label="FAQs" 
            id="Faqs"
            icon={<FaRegCircleQuestion size={24} className={active === "Faqs" ? "text-blue-600" : "text-neutral-500"} />} 
          />
          
          <MenuItem 
            to="/how-it-works" 
            label="How It Works" 
            id="how-it-works"
            icon={<FaRegCircleQuestion size={24} className={active === "how-it-works" ? "text-blue-600" : "text-neutral-500"} />} 
          />
        </div>
      </div>
    </div>
  );
}