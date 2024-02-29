import { JSONRPCRequest, JSONRPCServer } from "json-rpc-2.0";
import { Server } from "socket.io";

export function configJsonRPCServer(io: Server, jsonRPCServer : JSONRPCServer) {
    jsonRPCServer.addMethod('myMethod', (params) => {
    })
}

export function ReceiveRPCRequest(jsonRPCServer : JSONRPCServer, jsonRpcRequest : JSONRPCRequest){
    jsonRPCServer.receive(jsonRpcRequest).then((jsonRpcResponse) => {
        console.log('Response: ', jsonRpcResponse);
       });
}

