"use client"

import '../styles/dashboard.css';
import Image from "next/image";
import { blue, red } from '../utils/images';
import getUsersApi from '../api/getUserApi';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import sendMagicLinkApi from '../api/sendMagicLinkApi';
import UserGrowthChart from '../components/UserGrowthChart';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [animateSend, setAnimateSend] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const userData = JSON.parse(localStorage.getItem('user'));

  const handleSendLink = async () => {
    if (isButtonDisabled) return;
    
    setIsButtonDisabled(true);
    if (email) {
      await sendMagicLinkApi(email, toast, setEmail,setAnimateSend);
    } else {
      toast.error(`Enter valid email`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
    setTimeout(() => {
      setIsButtonDisabled(false); // Re-enable button after 5s
    }, 4000);
    setTimeout(() => setAnimateSend(false), 1500);
  };

  useEffect(() => {
    getUsersApi({ setUsers });
    // console.log(users,'Users..............')
  }, []);
  // Extract unique departments
const departments = new Set(users.map(user => user.department));


  return (
    <div className='dashboard-con'>
      <p className='welcome-text'>Welcome</p>
      <p className='user-name'>{userData.name ? userData.name : ''}</p>

      <div className='users-row'>
        <div className='user-depart-row'>
          <div className='user-con'>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Image src={red} alt="Red" className="" />
              <p className='no-user'>No of Users</p>
            </div>
            <p className='no-user-val'>{users.length}</p>
          </div>
          <div className='user-con'>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Image src={blue} alt="Red" className="" />
              <p className='no-depart'>Departments</p>
            </div>
            <p className='no-user-val'>{departments.size}</p>
          </div>
        </div>
        <div className='add-user-con'>
          <div className='add-user-div'>
            <p className='add-user-text'>Add New Users</p>
            <p className='send-email-text'>Add an Email & send the magic link to users.</p>
            <div style={{ display: 'flex', alignItems: 'center' }}>

            </div>
            <div style={{ position: 'relative' }} className="email-form-group">
              <input
                type="email"
                className="email-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Handle email input
              />
              <button style={{ opacity: isButtonDisabled ? 0.5 : 1, cursor: isButtonDisabled ? 'not-allowed' : 'pointer' }} className="send-link-btn" onClick={handleSendLink}>
                Send Link <span style={{ marginLeft: '5px' }}>✉️</span>
              </button>
              {animateSend && (
                <div className="fly-up-animation">📤</div>
              )}

            </div>
          </div>
        </div>

      </div>
      <ToastContainer />
      <div style={{ margin:'50px 0px 50px 50px', width: '90%' }}>
        <UserGrowthChart users={users} />
      </div>
    </div>
  );
}