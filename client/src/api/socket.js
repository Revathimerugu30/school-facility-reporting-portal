import { io } from 'socket.io-client';

let socket;

export const getSocket = () => {
  if (!socket) {
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');
    socket = io(baseUrl, {
      transports: ['websocket'],
    });
  }
  return socket;
};
