// utils/socket.js
import { io } from 'socket.io-client';

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io('http://'+process.env.NEXT_PUBLIC_API_URL+':5000', {
      auth: {
        token: localStorage.getItem('token') || '',
      },
    });
  }
  return socket;
};

export const resetSocket = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  };
  