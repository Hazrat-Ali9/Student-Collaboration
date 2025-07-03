'use client';

import '../styles/chat.css';
import { useEffect, useRef, useState } from 'react';
import { getSocket } from '@/app/utils/socket';
import { FaTimes, FaPaperclip } from 'react-icons/fa';
import axios from 'axios';
import getMessagesApi from '@/app/api/getMessagesApi';
import DeletePopup from './DeletePopup';
import AudioRecorder from './AudioRecorder';
import { IoSend } from 'react-icons/io5';

export default function ChatPopup({ user, onClose, onOpen, userData }) {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);


  const socket = getSocket();
  //   const userData = JSON.parse(localStorage.getItem('user'));
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);


  useEffect(() => {
    socket.auth.token = localStorage.getItem('token');
    socket.connect();

    const fetchMessages = async () => {
      try {

        const response = await getMessagesApi(user._id);
        setMessages(response?.data || []);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    socket.on('private_message', (msg) => {
      const isRelevant =
        (msg.sender === user._id && msg.recipients.includes(userData.id)) ||
        (msg.sender === userData.id && msg.recipients.includes(user._id));
      if (isRelevant) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off('private_message');
    };
  }, [user._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleDeleteMessage = async (messageId) => {
    console.log(messageId, 'Message id..............')
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://${process.env.NEXT_PUBLIC_API_URL}:5000/api/messages/${messageId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Emit to notify others (optional if you want live updates)
      socket.emit('delete_message', { messageId, recipientId: user._id });

      setMessages(prev => prev.filter(msg => msg._id !== messageId));
      setShowDeletePopup(false);
      setSelectedMessageId(null);
    } catch (error) {
      console.error('Delete failed', error);
    }
  };
const handleAudioRecorded = (audioFile) => {
  setFile(audioFile); // this will trigger preview and allow you to send via the send button
};


  useEffect(() => {

onOpen && onOpen()

    socket.on('message_deleted', ({ messageId }) => {
      setMessages(prev => prev.filter(msg => msg._id !== messageId));
    });

    return () => {
      socket.off('message_deleted');
    };
  }, []);


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
        // Reset progress after success
        setUploadProgress(0);
        fileUrl = response.data.fileUrl;
        type = file.type.startsWith('image/')
          ? 'image'
          : file.type.startsWith('audio/')
            ? 'audio'
            : 'file';
      } catch (error) {
        setUploadProgress(0);
        console.error('File upload failed:', error);
        return;
      }
    }

    const msg = {
      recipientId: user._id,
      content: input,
      type,
      fileUrl,
    };

    socket.emit('private_message', msg);

    setMessages((prev = []) => [
      ...prev,
      {
        ...msg,
        sender: userData.id,
        recipients: [user._id],
        createdAt: new Date().toISOString(),
      },
    ]);


    setInput('');
    setFile(null);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="chat-popup">
      <div className="chat-header">
        <span>Chat with {user.name}</span>
        <FaTimes onClick={onClose} style={{ cursor: 'pointer' }} />
      </div>

      <div className="chat-messages">
        {messages && userData && messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message-bubble ${msg.sender === userData.id ? 'sent' : 'received'
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

            <span className="message-time">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>


    {file && (
  <div className="attached-preview">
    {file.type.startsWith('image/') && (
      <div className="preview-item">
        <img
          src={URL.createObjectURL(file)}
          alt="preview"
          className="preview-image"
        />
        <FaTimes
          className="remove-file"
          onClick={() => {
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = null;
          }}
        />
      </div>
    )}

    {file.type.startsWith('video/') && (
      <div className="preview-item">
        <video
          src={URL.createObjectURL(file)}
          controls
          className="file-preview-video"
        />
        <FaTimes
          className="remove-file"
          onClick={() => {
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = null;
          }}
        />
      </div>
    )}

    {file.type.startsWith('audio/') && (
      <div className="preview-item">
        <audio
          controls
          src={URL.createObjectURL(file)}
          className="preview-audio"
        />
        <FaTimes
          className="remove-file"
          onClick={() => {
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = null;
          }}
        />
      </div>
    )}

    {!file.type.startsWith('image/') &&
      !file.type.startsWith('audio/') &&
      !file.type.startsWith('video/') && (
        <div className="preview-item">
          <span className="file-name">{file.name}</span>
          <FaTimes
            className="remove-file"
            onClick={() => {
              setFile(null);
              if (fileInputRef.current) fileInputRef.current.value = null;
            }}
          />
        </div>
      )}
  </div>
)}


      {/* Chat Input Section */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
              <label htmlFor="fileInput">
          <FaPaperclip className="chat-icon" />
        </label>
        <AudioRecorder onAudioRecorded={handleAudioRecorded} />

  
        <input
          type="file"
          id="fileInput"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        {uploadProgress > 0 && (
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
          </div>
        )}
        <button onClick={sendMessage}>
           <IoSend size={15} color="#fff" />
        </button>
      </div>

      {showDeletePopup && (
        <DeletePopup
          selectedMessageId={selectedMessageId}
          handleDeleteMessage={handleDeleteMessage}
          setShowDeletePopup={setShowDeletePopup}
        />

      )}

    </div>
  );
}
