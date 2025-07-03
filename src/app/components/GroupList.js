'use client';
import '../styles/grouplist.css';
import React, { useEffect, useRef, useState } from 'react';
import { getGroups, deleteGroup, updateGroupName } from '../api/groupApi';  // Assuming deleteGroup is implemented in your API
import { FaTrash, FaEdit } from 'react-icons/fa';
import { ToastContainer, toast } from "react-toastify";
import DeletePopup from './DeletePopup';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function GroupList({ onGroupSelect }) {
    const [groups, setGroups] = useState([]);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState(null);
    const MySwal = withReactContent(Swal);

    useEffect(() => {
        const loadGroups = async () => {
            const res = await getGroups();
            setGroups(res);
        };
        loadGroups();
    }, []);

    // This is used to show the confirmation popup
    const handleDeleteGroup = (groupId) => {
        setGroupToDelete(groupId);
        setShowDeletePopup(true);  // Show the confirmation popup
    };

    // Confirm deletion of the group
    const confirmDelete = async () => {
        try {
            await deleteGroup(groupToDelete,toast); // Make API call to delete the group
            setGroups(groups.filter(group => group._id !== groupToDelete)); // Remove the group from the list
            setShowDeletePopup(false); // Hide the popup
        } catch (error) {
            console.error('Error deleting group', error);
        }
    };


    const handleEditGroup = async (groupId) => {
        const { value: newName } = await MySwal.fire({
            title: 'Edit Group Name',
            input: 'text',
            inputLabel: 'New group name',
            inputPlaceholder: 'Enter new group name',
            showCancelButton: true,
            confirmButtonText: 'Update',
            cancelButtonText: 'Cancel',
            inputValidator: (value) => {
                if (!value) {
                    return 'Group name cannot be empty';
                }
            },
        });
    
        if (!newName) return;
    
        const updatedGroup = await updateGroupName(groupId, newName, toast);
    
        if (updatedGroup) {
            setGroups(prev =>
                prev.map(g => (g._id === groupId ? { ...g, name: updatedGroup.name } : g))
            );
            MySwal.fire('Updated!', 'Group name has been updated.', 'success');
        }
    };

    return (
        <div className="group-list-container">
            <h2>Groups</h2>
            <ul className="group-list">
                {groups.map(group => (
                    <li key={group._id} className="group-item">
                        <div className="group-name">{group.name}</div>
                        <div className="group-actions">
                            <button className="select-button" onClick={() => onGroupSelect(group)}>Chat</button>
                            <button className="edit-button" onClick={() => handleEditGroup(group._id)}>
                                <FaEdit className="edit-icon" />
                            </button>
                            <button className="delete-button" onClick={() => handleDeleteGroup(group._id)}>
                                <FaTrash className="delete-icon" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {showDeletePopup && (
                    <DeletePopup
                        selectedMessageId={groupToDelete}
                        handleDeleteMessage={confirmDelete}
                        setShowDeletePopup={setShowDeletePopup}
                    />

                )}
            <ToastContainer />
        </div>
    );
}
