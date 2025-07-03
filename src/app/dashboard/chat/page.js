// // chat/page.js
// 'use client';

// import { useEffect, useState } from 'react';
// import { getSocket } from '@/app/utils/socket';

// export default function Chat() {
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState('');
//   const [recipientId, setRecipientId] = useState('');
//   const [roomId, setRoomId] = useState('');
//   const [mode, setMode] = useState('private'); // or 'group'
//   const socket = getSocket();

//   useEffect(() => {
//     // Update auth token on reconnect
//     socket.auth.token = localStorage.getItem('token') || '';
//     socket.connect();

//     socket.on('connect', () => {
//       console.log('✅ Connected to server');
//     });

//     socket.on('private_message', (msg) => {
//       setMessages((prev) => [...prev, { ...msg, scope: 'private' }]);
//     });

//     socket.on('group_message', (msg) => {
//       setMessages((prev) => [...prev, { ...msg, scope: 'group' }]);
//     });

//     socket.on('disconnect', () => {
//       console.log('❌ Disconnected');
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   const sendMessage = () => {
//     if (mode === 'private') {
//       socket.emit('private_message', {
//         recipientId,
//         content: message,
//         type: 'text',
//         fileUrl: '',
//       });
//     } else {
//       socket.emit('join_room', roomId); // join before sending
//       socket.emit('group_message', {
//         roomId,
//         content: message,
//         type: 'text',
//         fileUrl: '',
//       });
//     }
//     setMessage('');
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h1>💬 Real-Time Chat</h1>

//       <div>
//         <label>
//           <input
//             type="radio"
//             checked={mode === 'private'}
//             onChange={() => setMode('private')}
//           />
//           Private
//         </label>
//         <label>
//           <input
//             type="radio"
//             checked={mode === 'group'}
//             onChange={() => setMode('group')}
//           />
//           Group
//         </label>
//       </div>

//       {mode === 'private' ? (
//         <input
//           type="text"
//           placeholder="Recipient User ID"
//           value={recipientId}
//           onChange={(e) => setRecipientId(e.target.value)}
//           style={{ display: 'block', margin: '8px 0' }}
//         />
//       ) : (
//         <input
//           type="text"
//           placeholder="Room ID"
//           value={roomId}
//           onChange={(e) => setRoomId(e.target.value)}
//           style={{ display: 'block', margin: '8px 0' }}
//         />
//       )}

//       <textarea
//         rows={3}
//         placeholder="Type your message..."
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         style={{ display: 'block', marginBottom: 8, width: '100%' }}
//       />

//       <button onClick={sendMessage}>Send</button>

//       <h2 style={{ marginTop: 30 }}>Messages</h2>
//       <ul>
//         {messages.map((m, i) => (
//           <li key={i}>
//             <strong>{m.scope.toUpperCase()}:</strong> {m.content}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
