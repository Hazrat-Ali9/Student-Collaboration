import '../styles/confirm.css';

export default function ConfirmModal({ show, onClose, onConfirm }) {
    if (!show) return null;
  
    return (
      <div className="overlay">
        <div className="modal">
          <h3>Are you sure you want to delete this user?</h3>
          <div className="buttons">
            <button onClick={onConfirm} className="confirm">Yes, Delete</button>
            <button onClick={onClose} className="cancel">Cancel</button>
          </div>
        </div>
      </div>
    );
  }
