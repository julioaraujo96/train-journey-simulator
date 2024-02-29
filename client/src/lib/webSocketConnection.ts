import ioClient from 'socket.io-client'; 

const ENDPOINT = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

const socket = ioClient(ENDPOINT);

export const io = socket;