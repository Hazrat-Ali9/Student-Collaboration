"use client";

import "../styles/sidebar.css";
import Link from "next/link";
import Image from "next/image";
import { logo } from "../utils/images"; 
import { FaSignOutAlt,FaUser,FaUsers, FaUserPlus,FaTachometerAlt,FaAddressCard } from 'react-icons/fa';  
import { BiInfoCircle } from 'react-icons/bi';
import { FiMail } from 'react-icons/fi';
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import AuthContext from "@/redux/auth-contex";
import logoutApi from "../api/logoutApi";

export default function Sidebar() {

  const authCtx = useContext(AuthContext);
    const router = useRouter();

    const handleLogout = () => {
   
      logoutApi(authCtx,router,toast,setTimeout)
    };
  

  return (
    <aside className="sidebar">
      <div className="logo_row">
        <Image src={logo} alt="Logo" className="logo_image"  />
        <p className="logo_text">
          Student <br /> Collaboration
        </p>
      </div>

      <nav>
        <ul>
          <li>
            <Link style={{display:'flex', alignItems:'center',gap:'10px'}} href="/dashboard" className="nav-link">
            <FaTachometerAlt  size={22} />
              <p>Dashboard</p>
            </Link>
          </li>
          <li>
            <Link style={{display:'flex', alignItems:'center',gap:'10px'}} href="/dashboard/users" className="nav-link">
            <FaUser size={22} />
              <p>Users</p>
            </Link>
          </li>
          {/* <li>
            <Link style={{display:'flex', alignItems:'center',gap:'10px'}} href="/dashboard/add-user" className="nav-link">
            <FaUserPlus  size={22} />
              <p>Add User</p>
            </Link>
          </li> */}
          <li>
            <Link style={{display:'flex', alignItems:'center',gap:'10px'}} href="/dashboard/user-details" className="nav-link">
            <FaAddressCard   size={22} />
              <p>Profile</p>
            </Link>
          </li>
          <li>
            <Link style={{display:'flex', alignItems:'center',gap:'10px'}} href="/dashboard/group-chat" className="nav-link">
            <FaUsers size={22} />
              <p>Group Chat</p>
            </Link>
          </li>
          <li>
            <Link style={{display:'flex', alignItems:'center',gap:'10px'}} href="/dashboard/assignment" className="nav-link">
            <BiInfoCircle size={22} />
              <p>Assignments</p>
            </Link>
          </li>
          <li>
            <Link style={{display:'flex', alignItems:'center',gap:'10px'}} href="/dashboard/contact-us" className="nav-link">
            <FiMail size={22} />
              <p>Contact Us</p>
            </Link>
          </li>
          <li style={{position:'absolute', bottom: '40px',width:'200px', cursor:'pointer'}} onClick={handleLogout}>
            <a style={{display:'flex', alignItems:'center',gap:'10px'}} className="nav-link">
            <FaSignOutAlt size={22} />
              <p>Logout</p>
            </a>
          </li>  
         
        </ul>
      </nav>
    </aside>
  );
}
