import React, { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaThLarge, FaUsers, FaUserPlus } from "react-icons/fa";
import { BsUpcScan } from "react-icons/bs";
import { CgLogOut } from "react-icons/cg";
import { RiFolderUserFill } from "react-icons/ri";

const Sidebar = () => {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(
    parseInt(localStorage.getItem("activeLink")) || 0
  );

  const handleLinkClick = (index) => {
    setActiveLink(index);
    localStorage.setItem("activeLink", index);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    localStorage.removeItem("activeLink");
    navigate("/");
  };

  const SIDEBAR_LINKS = [
    { id: 1, path: "/home", name: "Dashboard", icon: FaThLarge },
    { id: 2, path: "/home/scan", name: "Scan", icon: BsUpcScan },
    { id: 3, path: "/home/dataPembelian", name: "Data Pembelian", icon: FaUsers,},
    { id: 4, path: "/home/dataPelanggan", name: "Data Pelanggan", icon: RiFolderUserFill, },
    { id: 5, path: "/home/registrasi", name: "Registrasi", icon: FaUserPlus },
  ];

  return (
    <div className="w-16 md:w-56 fixed left-0 top-0 z-10 h-screen border-r pt-5 px-4 bg-white flex flex-col justify-between">
      <div>
        {/* Logo */}
        <div className="mb-8">
          <img src="/logo.svg" alt="logo" className="w-12 hidden md:flex" />
        </div>

        {/* Navigation Links */}
        <div className="mt-6">
          <p className="uppercase text-[13px] mb-2">Main Menu</p>
          <ul className="space-y-5">
            {SIDEBAR_LINKS.map((link, index) => (
              <li
                key={index}
                className={`font-medium rounded-md py-2 px-5 hover:bg-gray-100 hover:text-[#00AA13] ${
                  activeLink === index ? "bg-[#00AA13] text-white" : ""
                }`}
                onClick={() => handleLinkClick(index)}
              >
                <Link
                  to={link.path}
                  className="flex justify-center md:justify-start items-center md:space-x-3"
                >
                  <span>{<link.icon />}</span>
                  <span
                    className={`text-sm hidden md:flex ${
                      activeLink === index ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {link.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Logout Button */}
      <div className="pb-5">
        <hr className="h-[2px] bg-gray-300 border-0" />
        <button
          onClick={handleLogout}
          className="font-medium flex justify-center md:justify-start items-center md:space-x-3 py-3 lg:px-5 px-2 rounded-md"
        >
          {/* Icon will be shown on all screen sizes */}
          <CgLogOut className="text-xl text-black" />

          {/* Text will only appear on md and larger screens */}
          <span className="text-sm hidden md:flex text-gray-500">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
