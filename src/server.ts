import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { ExpressPeerServer } from 'peer';
import { v4 } from 'uuid';

const app = express();
const server = createServer(app);
const io = new Server(server);

const peerServer = ExpressPeerServer(server, {
  path: '/peerAplication',
  generateClientId: () => v4()
});

app.use(cors());
app.use('/', peerServer);
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

const nameSpace = io.of('/peerConnection');
nameSpace.on('connection', (socket) => {

  socket.on('main_peer', (id: string) => {
    socket.broadcast.emit('get_main_peer', id);
  });
})

io.listen(3223);
server.listen(process.env.PORT || 3234);
