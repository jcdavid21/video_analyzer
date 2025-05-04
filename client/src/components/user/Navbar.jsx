import React, { useState, useEffect } from 'react';
import logo from '../../assets/logo.svg';
import { FaRegUserCircle } from "react-icons/fa";

function Navbar({user}) {
    const [showDropdown, setShowDropdown] = useState(false);


    const handleLogout = () => {
        localStorage.removeItem('acc_id');
        window.location.href = '/';
    };

    return (
        <div className="fixed top-0 left-0 right-0 h-20 bg-white shadow-md flex items-center justify-between px-10 z-10">
            {/* Logo */}
            <div className="h-12">
                <img src={logo} alt="Logo" className="h-full" />
            </div>

            {/* User & Icon */}
            <div className="flex gap-4 items-center font-light text-sm">
                {user && <h1>{user.acc_email}</h1>}

                {/* User Icon with Hover Dropdown */}
                <div
                    className="relative"
                    onMouseEnter={() => setShowDropdown(true)}
                    onMouseLeave={() => setShowDropdown(false)}
                >
                    <FaRegUserCircle className="text-2xl cursor-pointer" />
                    
                    {/* Logout Dropdown */}
                    {showDropdown && (
                        <div className="absolute right-0 -mt-1 w-40 bg-white shadow-md rounded-md p-2">
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
                                onClick={handleLogout} // Fixed the logout function call
                            >
                                Log Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Navbar;
