'use client'
import React, { useEffect, useState } from 'react';
import { getSocket } from '../utils/socket';
// import { getSocket } from '@/utils/socket';

export default function GroupChatBox({ group, onClose }) {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const socket = getSocket();

  useEffect(() => {
    socket.emit('join_room', group._id);

    socket.on('group_message', (msg) => {
      if (msg.room === group._id) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => {
      socket.off('group_message');
    };
  }, [group]);

  const sendMessage = () => {
    if (content.trim()) {
      socket.emit('group_message', {
        roomId: group._id,
        content,
        type: 'text',
      });
      setContent('');
    }
  };

  return (
    <div className="fixed bottom-0 right-0 bg-white border p-4 w-96 shadow-lg">
      <h4>{group.name}</h4>
      <div className="h-60 overflow-y-auto">
        {messages.map(msg => (
          <div key={msg._id}>{msg.content}</div>
        ))}
      </div>
      <input value={content} onChange={e => setContent(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
