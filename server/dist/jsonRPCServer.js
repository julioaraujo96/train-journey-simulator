"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiveRPCRequest = exports.configJsonRPCServer = void 0;
function configJsonRPCServer(io, jsonRPCServer) {
    jsonRPCServer.addMethod('myMethod', (params) => {
    });
}
exports.configJsonRPCServer = configJsonRPCServer;
function ReceiveRPCRequest(jsonRPCServer, jsonRpcRequest) {
    jsonRPCServer.receive(jsonRpcRequest).then((jsonRpcResponse) => {
        console.log('Response: ', jsonRpcResponse);
    });
}
exports.ReceiveRPCRequest = ReceiveRPCRequest;
