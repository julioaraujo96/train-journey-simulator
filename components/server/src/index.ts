import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { handleNmeaFile } from './nmeaUtils';
import dotenv from 'dotenv';

dotenv.config();
const cors = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:8080'],
  methods: ['GET', 'POST'],
};

const server = createServer();

const io = new Server(server, {
  cors,
  path: process.env.SERVER_PATH || '/api/',
});

let clients = new Map();

io.on('connection', (socket: Socket) => {
  console.log('Client connected', socket.id);
  clients.set(socket.id, socket);
});

io.on('disconnect', (socket: Socket) => {
  clients.delete(socket.id);
});

const args = process.argv.slice(2);
console.log('Options: ', args);

if (args.length < 2) {
  console.log(
    'Usage: npm run start:dev <filePath> <speed> <delay : OPTIONAL(Default: 10)>'
  );
  process.exit(1);
}
const defaultDelay = 10;
const [filePath, speed, delay = defaultDelay] = args;

const nmeaCoordinates = handleNmeaFile(filePath);
let currentIndex = 0;

function startReplay() {
  if (currentIndex < nmeaCoordinates.length) {
    const data = nmeaCoordinates[currentIndex];
    clients.forEach((clientSocket) => {
      clientSocket.emit('trainUpdate', data);
    });
    currentIndex++;
    setTimeout(startReplay, (1 / Number(speed)) * 1000);
  } else {
    currentIndex = 0;
    io.emit('resetPath');
    emitJourney();
    setTimeout(startReplay, (1 / Number(speed)) * 1000);
  }
}

setTimeout(startReplay, Number(delay) * 1000);
setTimeout(emitJourney, Number(delay) * 1000);

function emitJourney() {
  if (nmeaCoordinates.length > 0) {
    io.emit('trainJourney', nmeaCoordinates);
  }
}

const PORT = process.env.SERVER_PORT;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}\n`);
});

// const jsonRPCServer = new JSONRPCServer();

// configJsonRPCServer(io, jsonRPCServer);

// const jsonRpcRequest : JSONRPCRequest = {
//     jsonrpc: '2.0',
//     id: 1,
//     method: 'startReplay',
//     params: {
//     }
// };
