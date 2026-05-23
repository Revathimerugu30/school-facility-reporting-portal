import { io } from 'socket.io-client';

let socket;

export const getSocket = () => {
  if (!socket) {
    const baseUrl = (import.meta.env.VITE_API_URL || 'https://school-facility-reporting-portal.onrender.com').replace(/\/api\/?$/, '');
    socket = io(baseUrl, {
      transports: ['websocket'],
    });
  }
  return socket;
};
