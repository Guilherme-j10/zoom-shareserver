import express from 'express';
import cors from 'cors';
import https from 'https';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { ExpressPeerServer } from 'peer';
import { v4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const app = express();
const SSL_server = https.createServer({
  key: fs.readFileSync(path.resolve(__dirname, '..', '..', '..', '..', '..',  'etc', 'letsencrypt', 'live', 'zoombk.cloudcall.tec.br', 'privkey.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '..', '..', '..', '..', '..',  'etc', 'letsencrypt', 'live', 'zoombk.cloudcall.tec.br', 'cert.pem')),
}, app);
const server = createServer(app);
const io = new Server(server);  

const peerServer = ExpressPeerServer(SSL_server, {
  path: '/peerAplication',
  generateClientId: () => v4()
});

app.use(cors());
app.use('/', peerServer);
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

let main_id = '';

const nameSpace = io.of('/peerConnection');
nameSpace.on('connection', (socket) => {

  socket.on('main_peer', (id: string) => {
    main_id = id;
    socket.broadcast.emit('get_main_peer', id);
  });

  socket.on('peer_main', () => {
    socket.broadcast.emit('get_main_peer', main_id);
  })

})

io.listen(3223);
SSL_server.listen(process.env.PORT || 3234);
