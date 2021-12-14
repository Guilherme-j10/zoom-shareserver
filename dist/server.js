"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const peer_1 = require("peer");
const uuid_1 = require("uuid");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server);
const peerServer = (0, peer_1.ExpressPeerServer)(server, {
    path: '/peerAplication',
    generateClientId: () => (0, uuid_1.v4)()
});
app.use((0, cors_1.default)());
app.use('/', peerServer);
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
const nameSpace = io.of('/peerConnection');
nameSpace.on('connection', (socket) => {
    socket.on('main_peer', (id) => {
        socket.broadcast.emit('get_main_peer', id);
    });
});
server.listen(process.env.PORT || 3234);
