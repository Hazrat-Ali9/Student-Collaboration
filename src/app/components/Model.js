"use client"

import React, { useRef, useState } from 'react';
import Image from "next/image";
import { emptyUser, logo, QR } from '../utils/images';
import { FaFilePdf } from 'react-icons/fa';
import QRCode from "react-qr-code";




const Model = ({ setShowModal, userData }) => {
    console.log('QRCode:.........................', QRCode);

    const printRef = useRef();
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowModal(false);
        }, 400); // Matches fadeOutScale duration
    };


    const printHandler = () => {
        const printContent = printRef.current.innerHTML;
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(`
          <html>
            <head>
              <title>Print</title>
               <link rel="stylesheet" href="/pdf.css" />
            </head>
            <body>${printContent}</body>
          </html>
        `);
    };
    return (
        <div>
            <div className="modal-overlay" onClick={handleClose}>
                <div
                    className={`modal-content ${isClosing ? 'closing' : ''}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="modal-title">Identity Card</h2>
                    <div className="modal-body" ref={printRef}>
                        <div className='card-row'>
                            <div className='card-front'>
                                <div className='card-holder'></div>
                                <div className='logo-image-div'>
                                    <Image src={logo} alt='logo-image' style={{ background: 'lightgrey', borderRadius: '20px' }} />
                                </div>
                                <div className='profile-image-div'>

                                    <Image src={emptyUser} width={100} height={100} alt='profile' />
                                </div>
                                <div className='name-div'>
                                    <h3>{userData?.name ? userData?.name : 'NA'}</h3>
                                    <p>{userData?.department ? userData?.department : 'NA'}</p>
                                </div>
                                <div className='card-details-row'>
                                    <div className='detail-keys'>

                                        <p>Phone:</p>
                                        <p>CNIC:</p>
                                        <p>DOB:</p>
                                        <p>Department:</p>
                                        <p>Issue Date:</p>
                                        <p>Email:</p>
                                    </div>
                                    <div className='detail-values'>

                                        <p>{userData?.phone ? userData?.phone : 'NA'}</p>
                                        <p>{userData?.cnic ? userData?.cnic : 'NA'}</p>
                                        <p>{userData?.dob ? userData?.dob.slice(0, 10) : 'NA'}</p>
                                        <p>{userData?.department ? userData?.department : 'NA'}</p>
                                        <p>{userData?.createdAt ? userData?.createdAt.slice(0, 10) : 'NA'}</p>
                                        <p>{userData?.email ? userData?.email : 'NA'}</p>

                                    </div>
                                </div>

                            </div>
                            <div className='card-back'>
                                <h3 className='imp-text'>Important</h3>
                                <div className='imp-text-details'>
                                    <p style={{ marginBottom: '10px' }}>1. Every one expected to carry their cards with them while on duty & produce the same on demand.</p>
                                    <p>2. Loss of this card must be reported to the Issuing Authority.</p>
                                </div>
                                <div className='qr-code-div'>
                                    <QRCode
                                        value={
                                            `Student Collaboration:\n` +
                                            `Name: ${userData?.name || 'N/A'}\n` +
                                            `Phone: ${userData?.phone || 'N/A'}\n` +
                                            `CNIC: ${userData?.cnic || 'N/A'}\n` +
                                            `DOB: ${userData?.dob ? userData.dob.slice(0, 10) : 'N/A'}\n` +
                                            `Department: ${userData?.department || 'N/A'}\n` +
                                            `Issue Date: ${userData?.createdAt ? userData.createdAt.slice(0, 10) : 'N/A'}\n` +
                                            `Email: ${userData?.email || 'N/A'}`
                                        }
                                        size={120}
                                    />
                                </div>


                                <div className='found-div'>
                                    <p>If found please return to:</p>
                                    <p>abc block xyz town</p>
                                    <p>Pakistan - 54000</p>


                                </div>
                            </div>

                        </div>
                        <div className='pdf-btn-con'>
                            <button onClick={printHandler} className="download-btn-pdf">
                                <FaFilePdf />
                                Download PDF
                            </button>

                        </div>
                    </div>
                    <button className="close-btn" onClick={handleClose}>❌</button>
                </div>
            </div>
        </div>
    )
}

export default Model