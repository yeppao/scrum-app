import express, { json } from 'express';
import http from 'http';
import cors from 'cors';
import { PeerServer } from 'peer';
import initSequelize from '@@config/sequelize';
import routes from '@@routes/routes';
import initSocketIo from '@@utils/socket';

async function scrumApp() {
  const app = express();
  const port = process.env.PORT || 9000;
  const server = http.createServer(app);
  const peerServer = PeerServer({
    port: 9001,
    path: '/'
  });
  const rooms = [];
  const sequelize = await initSequelize();
  // const retrieveCurrentUserRooms = userId => rooms.filter((key, room) => room.participants.includes(userId));
  // const retrievePrivateRoom = (participants) => rooms.filter((key, room) => isEqual(room.participants, participants));

  app.use(cors());
  app.use(json({ limit: '10mb' }));
  app.use(routes);
  initSocketIo(server);

  //start our server
  server.listen(port, () => {
    console.log(`Server started on port ${port} :)`);
  });

}

scrumApp();
