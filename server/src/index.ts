import { createServer } from 'http';
import { JSONRPCRequest, JSONRPCServer } from 'json-rpc-2.0';
import { Server, Socket } from 'socket.io';
import { configJsonRPCServer } from './jsonRPCServer';

const server = createServer();
const io = new Server(server);
const jsonRPCServer = new JSONRPCServer();

configJsonRPCServer(io, jsonRPCServer);

let clients : string[]  = [];

io.on('connection', (socket : Socket) => {
    console.log('Client connected', socket.id);
    clients.push(socket.id);
})

io.on('disconnect', (socket : Socket) => {
    clients = clients.filter(clientId => clientId !== socket.id);
});

const args = process.argv.slice(2);
console.log(args);

if (args.length < 2) {
    console.log("Usage: npm run start:dev <filePath> <speedFactor> <delay : OPTIONAL>");
    process.exit(1);
} 
    const defaultDelay = 10;
    const [filePath, speed, delay = defaultDelay] = args;

    // const jsonRpcRequest : JSONRPCRequest = {
    //     jsonrpc: '2.0',
    //     id: 1,
    //     method: 'startReplay',
    //     params: {
    //     }
    // };


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}\n`);
});