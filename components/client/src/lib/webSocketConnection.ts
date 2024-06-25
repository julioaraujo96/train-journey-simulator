import ioClient from 'socket.io-client';

const ENDPOINT = import.meta.env.VITE_SERVER_URL;

const socket = ioClient(ENDPOINT, {
  path: '/api/',
  transports: ['websocket'],
});

export const io = socket;
