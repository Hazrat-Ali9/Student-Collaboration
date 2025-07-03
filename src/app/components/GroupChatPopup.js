'use client';

import '../styles/chat.css';
import { useEffect, useRef, useState } from 'react';
import { getSocket } from '@/app/utils/socket';
import { FaTimes, FaPaperclip } from 'react-icons/fa';
import axios from 'axios';
import DeletePopup from './DeletePopup';
import { ToastContainer, toast } from "react-toastify";
import AudioRecorder from './AudioRecorder';
import { IoSend } from 'react-icons/io5';

export default function GroupChatPopup({ group, onClose, userData }) {
    const [messages, setMessages] = useState([]);  // state to store messages
    const [input, setInput] = useState('');
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const messagesEndRef = useRef(null);
    const [selectedMessageId, setSelectedMessageId] = useState(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const fileInputRef = useRef(null);

    const socket = getSocket();

    // Function to fetch messages from the backend API
    const fetchMessages = async () => {
        try {
            const response = await axios.get(`http://${process.env.NEXT_PUBLIC_API_URL}:5000/api/groups/${group._id}/messages`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setMessages(response.data);  // Update messages state with fetched data
        } catch (error) {
            console.error('Failed to fetch group messages:', error);
        }
    };
    const handleAudioRecorded = (audioFile) => {
        setFile(audioFile); // this will trigger preview and allow you to send via the send button
    };
    const handleDeleteMessage = async (messageId) => {
        try {
            console.log('groupId:', group._id, 'messageId:', messageId);

            await axios.delete(`http://${process.env.NEXT_PUBLIC_API_URL}:5000/api/groups/${group._id}/messages/${messageId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            // Optimistically update UI
            setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
            setShowDeletePopup(false);
            setSelectedMessageId(null);
        } catch (err) {
            console.error('Failed to delete message:', err);
            toast.success(`Error: ${err.message}`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });
        }
    };

    useEffect(() => {
        // Connect to socket and join the group room
        socket.auth.token = localStorage.getItem('token');
        socket.connect();

        socket.emit('join_room', group._id);

        // Fetch messages when the component loads or group changes
        fetchMessages();

        socket.on('group_message', (msg) => {
            if (msg.room === group._id) {
                debugger
                // Make sure new messages are appended and not replacing existing ones
                setMessages((prev) => [...prev, msg]);
            }
        });

        return () => {
            socket.emit('leave_room', group._id);
            socket.off('group_message');
        };
    }, [group._id]);

    useEffect(() => {
        // Scroll to the latest message
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() && !file) return;

        let fileUrl = '';
        let type = 'text';

        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.post('http://'+process.env.NEXT_PUBLIC_API_URL+':5000/api/chat/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percent);
                    },
                });
                fileUrl = response.data.fileUrl;
                type = file.type.startsWith('image/')
                    ? 'image'
                    : file.type.startsWith('audio/')
                        ? 'audio'
                        : 'file';
            } catch (error) {
                console.error('File upload failed:', error);
                return;
            }
        }

        const msg = {
            roomId: group._id,
            content: input,
            type,
            fileUrl,
            sender: userData.id,
        };

        socket.emit('group_message', msg);

        setInput('');
        setFile(null);
        setUploadProgress(0);
    };


    return (
        <div className="chat-popup">
            <div className="chat-header">
                <span>Group: {group.name}</span>
                <FaTimes onClick={onClose} style={{ cursor: 'pointer' }} />
            </div>

            <div className="chat-messages">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`message-bubble ${((msg.sender && typeof msg.sender === 'object' ? msg.sender._id : msg.sender) === userData.id)
                            ? 'sent'
                            : 'received'
                            }`}

                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                setSelectedMessageId(msg._id);
                                setShowDeletePopup(true);
                            }
                        }}
                    >
                        <div className="sender-name">
                            {msg.sender && typeof msg.sender === 'object'
                                ? msg.sender.name
                                : msg.sender === userData.id
                                    ? userData.name
                                    : 'Unknown'}
                        </div>


                        {msg.type === 'text' && <p>{msg.content}</p>}
                        {msg.type === 'image' && <img src={msg.fileUrl} alt="attachment" className="chat-image" />}
                        {msg.type === 'audio' && <audio controls src={msg.fileUrl} className="chat-audio" />}
                        {msg.type === 'file' && (() => {
                            const fileExtension = msg.fileUrl.split('.').pop().toLowerCase();

                            if (['mp4', 'webm', 'ogg'].includes(fileExtension)) {
                                return <video controls src={msg.fileUrl} className="chat-video" />;
                            }

                            if (['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'pdf'].includes(fileExtension)) {
                                return (
                                    <a
                                        href={msg.fileUrl}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="chat-file-download"
                                    >
                                        📄 Download File
                                    </a>

                                );
                            }

                            // Default to download
                            return (
                                <a href={msg.fileUrl} download className="chat-file">
                                    Download File
                                </a>
                            );
                        })()}

                        <span className="message-time">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                        {/* {msg.sender === userData.id && (
                            <button
                                className="delete-btn"
                                onClick={() => handleDeleteMessage(msg._id)}
                            >
                                🗑️
                            </button>
                        )} */}
                    </div>
                ))}
                <div ref={messagesEndRef} />

            </div>
            {file && (
                <div className="attached-preview">
                    {file.type.startsWith('image/') && (
                        <img src={URL.createObjectURL(file)} alt="Preview" className="file-preview-image" />
                    )}
                    {file.type.startsWith('video/') && (
                        <video src={URL.createObjectURL(file)} controls className="file-preview-video" />
                    )}
                    {file.type.startsWith('audio/') && (
                        <audio src={URL.createObjectURL(file)} controls className="file-preview-audio" />
                    )}
                    {!file.type.startsWith('image/') && !file.type.startsWith('video/') && !file.type.startsWith('audio/') && (
                        <p className="file-preview-name">{file.name}</p>
                    )}

                    <FaTimes className="file-preview-close" onClick={() => {
                        setFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = null;
                    }} />
                </div>
            )}

            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <label htmlFor="groupFileInput">
                    <FaPaperclip className="chat-icon" />
                </label>
                <AudioRecorder onAudioRecorded={handleAudioRecorded} />

                <input
                    type="file"
                    id="groupFileInput"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => setFile(e.target.files[0])}
                />


                {uploadProgress > 0 && (
                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                )}
                <button onClick={sendMessage}>
                    <IoSend size={15} color="#fff" />
                </button>
                {showDeletePopup && (
                    <DeletePopup
                        selectedMessageId={selectedMessageId}
                        handleDeleteMessage={handleDeleteMessage}
                        setShowDeletePopup={setShowDeletePopup}
                    />

                )}
            </div>
            <ToastContainer />
        </div>
    );
}
