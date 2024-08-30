import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { FaThLarge, FaUsers } from 'react-icons/fa'; // Import the icon
import { BsUpcScan } from "react-icons/bs";
import { RiFolderUserFill } from "react-icons/ri";
import { FaMoneyBills } from "react-icons/fa6";
import { CgLogOut } from "react-icons/cg";

const Sidebar = () => {
    const [activeLink, setActiveLink] = useState(0);
    const handleLinkClick = (index) =>{
        setActiveLink(index)
    }

    function logout() {
        // Remove the token from local storage
        localStorage.removeItem("jwtToken");
      
        // Optionally, you can also remove the token from session storage if it's stored there
        // sessionStorage.removeItem("jwtToken");
      
        // Redirect to login or home page
        window.location.href = "/";
    }

    const SIDEBAR_LINKS = [
        { id: 1, path: "/home", name: "Dashboard", icon: FaThLarge },
        { id: 2, path: "/home/scan", name: "Scan", icon: BsUpcScan },
        { id: 3, path: "/home/dataPembelian", name: "DataPembelian", icon: FaUsers},
        { id: 4, path: "/home/dataPelanggan" , name: "DataPelanggan", icon: RiFolderUserFill },
        { id: 5, path: "/home/keuangan", name: "Keuangan", icon: FaMoneyBills }
    ];

    return (
        <div className="w-16 md:w-56 fixed left-0 top-0 z-10 h-screen boder-r pt-5 px-4 bg-white">
            {/* logo */}
                <div className="mb-8">
                    <img src="/logo.svg" alt="logo" className="w-12 hidden md:flex" />
                </div>
            {/* logo */}

            {/* navigation links */}
            <div className='mt-6'>
            <p className='uppercase text-[13px] mb-2'>Main Menu</p>
            <ul className='space-y-5'>
                {SIDEBAR_LINKS.map((link, index) => (
                    <li key={index} className={`font-medium rounded-md py-2 px-5 hover:bg-gray-100 hover:text-[#00AA13] ${activeLink === index ? "bg-[#00AA13] text-white" : ""}`}>
                        <Link to={link.path} className='flex justify-center md:justify-start items-center md:space-x-3' onClick={()=>handleLinkClick(index)}>
                            <span>{<link.icon />}</span>
                            <span className={`text-sm hidden md:flex ${activeLink === index ? "text-white" : "text-gray-500"}`}>{link.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
            </div>

            {/* navigation links */}

            <button type="submit" onClick={logout}> 
            <div className="w-full absolute bottom-5 left-0 px-4 py-2 cursor-pointer text-center">
                <p className="flex items-center space-x-2 text-xs text-white py-3 px-5 bg-[#00AA13] rounded-md">
                <CgLogOut/>
                <span className="hidden md:flex">Logout</span>
                </p>
            </div>
            </button>
            
        </div>
    );
};

export default Sidebar;
