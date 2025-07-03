'use client';

import React, { useState, useEffect, useMemo } from 'react';
import '../../styles/userdetail.css';
import Image from 'next/image';
import { emptyUser } from '@/app/utils/images';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FiDownload, FiEdit } from 'react-icons/fi';
import Model from '@/app/components/Model';
import getUsersApi from '@/app/api/getUserApi';
import { useSelector, useDispatch } from 'react-redux';
import { RxCross2 } from 'react-icons/rx';
import { clearViewData, setEdit } from '@/redux/features/dashboardSlice';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';

const Page = () => {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState('');
  const [currentRole, setCurrentRole] = useState(null);
  const [displayedUser, setDisplayedUser] = useState(null);
  const viewData = useSelector((state) => state.dashboard.view);
  const [isDisabled, setIsDisabled] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleClearView = () => {
    dispatch(clearViewData()); // You'll need to create this action in your slice
  };

  debugger;
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = JSON.parse(localStorage.getItem('user'));
      setCurrentRole(userData);
    }

    getUsersApi({ setUsers });
  }, []);

  const currentUserData = useMemo(() => {
    if (!Array.isArray(users) || !currentRole) return null;
    return users.find((user) => user.email === currentRole.email);
  }, [users, currentRole]);

  console.log('View data', viewData);
  useEffect(() => {
    if (viewData?.length > 0) {
      setDisplayedUser(viewData[0]);
    } else {
      setDisplayedUser(currentUserData);
    }
  }, [viewData, currentUserData]);

  const handleViewClick = () => {
    dispatch(setEdit(displayedUser));
    router.push('/dashboard/add-user');
  };

  return (
    <div
      className="user-details-con"
      style={{ position: 'relative' }}
    >
      <div className="main-row">
        {/* <div>
          <Image src={emptyUser} height={220} width={220} alt='User' className="floating-img" />
        </div> */}
        <div style={{ width: '100%' }}>
          <div className="upper-detail-row">
            <div>
              <p className="user-name">{displayedUser?.name ? displayedUser?.name : 'NA'}</p>
              <p className="user-desig">{displayedUser?.department ? displayedUser?.department : 'NA'}</p>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <FaMapMarkerAlt style={{ marginRight: '8px', color: 'gray' }} />
                <span className="user-address">{displayedUser?.address ? displayedUser?.address : 'NA'}</span>
              </div>
            </div>
            <div className="button-group">
              <button
                className="download-btn"
                onClick={() => setShowModal(true)}
              >
                <FiDownload /> Download
              </button>

              <div
                onClick={handleViewClick}
                style={{
                  cursor: currentRole?.role === 'user' || isDisabled ? 'not-allowed' : 'pointer'
                }}
              >
                <button
                  className="edit-btn"
                  disabled={isDisabled} // Disable the button temporarily
                >
                  <FiEdit /> Edit User
                </button>
              </div>
            </div>
          </div>

          <div className="line"></div>

          <div>
            <p className="general-info">General info</p>
            <div className="general-info-flex">
              <div style={{ display: 'flex', gap: '50px' }}>
                <div>
                  <p>Department:</p>
                  <p>CNIC:</p>
                  <p>Created At:</p>
                </div>

                <div>
                  <p>{displayedUser?.department ? displayedUser?.department : 'NA'}</p>
                  <p>{displayedUser?.cnic ? displayedUser?.cnic : 'NA'}</p>
                  <p>{displayedUser?.createdAt ? displayedUser?.createdAt.slice(0, 10) : 'NA'}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '50px' }}>
                <div>
                  <p>Email:</p>
                  <p>Phone:</p>
                  <p>DOB:</p>
                </div>

                <div>
                  <p>{displayedUser?.email}</p>
                  <p>{displayedUser?.phone}</p>
                  <p>{displayedUser?.dob?.slice(0, 10)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <Model
          setShowModal={setShowModal}
          userData={displayedUser}
        />
      )}

      {viewData?.length > 0 && (
        <button
          className="close-view-btn"
          onClick={handleClearView}
          title="Clear view mode"
        >
          <RxCross2 size={22} />
        </button>
      )}
      <ToastContainer />
    </div>
  );
};

export default Page;
