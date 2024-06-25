"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const nmeaUtils_1 = require("./nmeaUtils");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors = {
    origin: ((_a = process.env.CORS_ORIGIN) === null || _a === void 0 ? void 0 : _a.split(',')) || 'http://localhost:5173',
    methods: ["GET", "POST"],
};
const server = (0, http_1.createServer)();
const io = new socket_io_1.Server(server, {
    cors
});
let clients = new Map();
io.on('connection', (socket) => {
    console.log('Client connected', socket.id);
    clients.set(socket.id, socket);
});
io.on('disconnect', (socket) => {
    clients.delete(socket.id);
});
const args = process.argv.slice(2);
console.log('Options: ', args);
if (args.length < 2) {
    console.log("Usage: npm run start:dev <filePath> <speed> <delay : OPTIONAL(Default: 10)>");
    process.exit(1);
}
const defaultDelay = 10;
const [filePath, speed, delay = defaultDelay] = args;
const nmeaCoordinates = (0, nmeaUtils_1.handleNmeaFile)(filePath);
let currentIndex = 0;
function startReplay() {
    if (currentIndex < nmeaCoordinates.length) {
        const data = nmeaCoordinates[currentIndex];
        clients.forEach(clientSocket => {
            clientSocket.emit('trainUpdate', data);
        });
        currentIndex++;
        setTimeout(startReplay, (1 / Number(speed)) * 1000);
    }
    else {
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
const PORT = process.env.PORT || 3000;
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
