"use client";

import React from "react";
import "../styles/deletepopup.css";

const DeletePopup = ({ selectedMessageId, handleDeleteMessage, setShowDeletePopup }) => {
  return (
    <div className="delete-popup-overlay">
      <div className="delete-popup animated-popup">
        <div className="popup-content">
          <p>Are you sure you want to delete?</p>
          <div className="popup-buttons">
            <button
              className="btn delete"
              onClick={() => handleDeleteMessage(selectedMessageId)}
            >
              Delete
            </button>
            <button
              className="btn cancel"
              onClick={() => setShowDeletePopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
