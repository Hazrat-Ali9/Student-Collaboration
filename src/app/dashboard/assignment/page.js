'use client';
import React, { useState, useEffect } from 'react';
import '../../styles/users.css';
import '../../styles/assignment.css';
import axios from 'axios';
import { FaEdit, FaTrash, FaBell } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import moment from 'moment';

const Page = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    title: '',
    dueDate: ''
  });
  const [assignments, setAssignments] = useState([]);
  const [editingId, setEditingId] = useState(null); // for edit tracking
  const [user, setUser] = useState({ name: '' });
  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch assignments from API
  const fetchAssignments = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsed = JSON.parse(userData);
        debugger;
        const res = await axios.post('http://' + process.env.NEXT_PUBLIC_API_URL + ':5000/api/assignments/get', {
          userId: parsed.id
        });
        // const data = await res.json();
        setAssignments(res.data);
      }
    } catch (err) {
      console.error('Error fetching assignments', err);
    }
  };

  const completeAssignment = (assignment) => {
    if (!window.confirm('Are you sure you want to mark this assignment as completed?')) {
      return;
    }
    assignment.completed = true;

    axios
      .put('http://' + process.env.NEXT_PUBLIC_API_URL + ':5000/api/assignments/' + assignment._id, {
        ...assignment
      })
      .then((resp) => {
        if (resp.data.success) {
          toast.success('Assignment completed successfully!');
          fetchAssignments();
        }
      });
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUser({
          name: parsed.name || 'No Name'
        });
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
  }, []);

  // Input change handler
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit new or edited assignment
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingId
      ? `http://${process.env.NEXT_PUBLIC_API_URL}:5000/api/assignments/${editingId}`
      : 'http://' + process.env.NEXT_PUBLIC_API_URL + ':5000/api/assignments';

    const method = editingId ? 'PUT' : 'POST';

    try {
      debugger;

      let user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.id) {
        return alert('Session not found');
      }
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, creator: user.id })
      });

      if (res.ok) {
        fetchAssignments();
        setShowForm(false);
        setFormData({ subject: '', title: '', dueDate: '' });
        setEditingId(null);
      } else {
        alert('Failed to submit assignment.');
      }
    } catch (err) {
      console.error('Submission error:', err);
    }
  };
  let upcomingAssignments = assignments.filter((assignment) => {
    const dueDate = new Date(assignment.dueDate);
    const today = new Date();

    // Set both to midnight (00:00:00) to compare only the date part
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

    return daysDiff >= 0 && daysDiff <= 3; // Include today, tomorrow, and next 2 days
  });

  const getUrgencyClass = (dueDate) => {
    const days = (new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24);
    if (days <= 1) return 'very-urgent';
    if (days <= 2) return 'urgent';
    return 'normal';
  };

  // Delete assignment
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this assignment?')) return;

    try {
      const res = await fetch(`http://${process.env.NEXT_PUBLIC_API_URL}:5000/api/assignments/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        fetchAssignments();
      } else {
        alert('Failed to delete assignment.');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Edit icon click
  const handleEdit = (assignment) => {
    setFormData({
      subject: assignment.subject,
      title: assignment.title,
      dueDate: assignment.dueDate.slice(0, 10) // format for input[type=date]
    });
    setEditingId(assignment._id);
    setShowForm(true);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter assignments whose due date has passed
  assignments.forEach((assignment) => {
    debugger;
    if (!assignment.completed && new Date(assignment.dueDate) < today) {
      assignment.datePassed = true;
    }
  });
  debugger;
  assignments.sort((a, b) => {
    const aDone = !!a.completed || !!a.datePassed;
    const bDone = !!b.completed || !!b.datePassed;

    return aDone === bDone ? 0 : aDone ? 1 : -1;
  });

  return (
    <div
      className="table-container"
      style={{ position: 'relative' }}
    >
      <div className="create-btn-con">
        <div
          onClick={() => setShowNotifications(!showNotifications)}
          className="notification-header"
          style={{ position: 'relative', cursor: 'pointer' }}
        >
          <FaBell
            className="notification-bell"
            title="Show Notifications"
          />

          {upcomingAssignments.length > 0 && (
            <span className="notification-badge">{upcomingAssignments.filter((a) => !a.completed).length}</span>
          )}
        </div>

        {showNotifications && (
          <div className="floating-notification">
            {upcomingAssignments.filter((a) => !a.completed).length > 0 ? (
              upcomingAssignments
                .filter((a) => !a.completed)
                .map((assignment) => (
                  <div
                    key={assignment._id}
                    className={`notification-card ${getUrgencyClass(assignment.dueDate)}`}
                  >
                    <strong>{assignment.subject}</strong> assignment is due on{' '}
                    <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>.
                  </div>
                ))
            ) : (
              <div className="no-notifications">No upcoming assignments 🎉</div>
            )}
          </div>
        )}

        <button
          className="create-button"
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ subject: '', title: '', dueDate: '' });
          }}
        >
          Create
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingId ? 'Edit Assignment' : 'Create Assignment'}</h2>
            <form
              onSubmit={handleSubmit}
              className="assignment-form"
            >
              <label>Subject:</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
              />

              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />

              <label>Due Date:</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={handleInputChange}
                required
              />

              <div className="form-buttons">
                <button
                  type="submit"
                  className="submit-btn"
                >
                  {editingId ? 'Update' : 'Submit'}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ subject: '', title: '', dueDate: '' });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="custom-table">
        <thead>
          <tr>
            <th>Creator</th>
            <th>Subject</th>
            <th>Title</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr
              style={{ backgroundColor: assignment.completed ? '#bbffca' : '' }}
              key={assignment._id}
            >
              <td>{assignment.creator.name}</td>
              <td>{assignment.subject}</td>
              <td>{assignment.title}</td>
              <td>{new Date(assignment.dueDate).toLocaleDateString()}</td>
              <td>
                <FaEdit
                  className="icon edit-icon"
                  title="Edit"
                  onClick={() => handleEdit(assignment)}
                />
                &nbsp;&nbsp;
                <FaTrash
                  className="icon delete-icon"
                  title="Delete"
                  onClick={() => handleDelete(assignment._id)}
                />
                {assignment.datePassed != true && !assignment.completed && (
                  <button
                    className="submit-assignment"
                    onClick={(e) => completeAssignment(assignment)}
                  >
                    Mark Complete
                  </button>
                )}
                {assignment.datePassed && !assignment.completed && <b className="incomplete-assignment">INCOMPLETE</b>}
                {!assignment.datePassed && assignment.completed && <b className="complete-assignment">COMPLETED</b>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default Page;
