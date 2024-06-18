import ioClient from 'socket.io-client';

const ENDPOINT = import.meta.env.VITE_SERVER_URL;

const socket = ioClient(ENDPOINT, { path: '/api/' });

export const io = socket;
