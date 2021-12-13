import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

const nameSpace = io.of('/peerConnection');
nameSpace.on('connection', (socket) => {

  socket.on('main_peer', (id: string) => {
    socket.broadcast.emit('get_main_peer', id);
  });

})

server.listen(process.env.PORT || 3234);
