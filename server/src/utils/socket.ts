import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { addUser, getUsers, getUser, deleteUser } from '@@repositories/users';
import { defaultRoomName } from '@@repositories/rooms';
import { createRoom, getRoom } from '@@repositories/rooms';
import User from '@@models/User';
import Group from '@@models/Group';

const initSocketIo = (server) => {
    const io = new Server(server);
    // Handle user connection
    io.on('connection', (socket) => {
      let user: User;
      socket.on('work', async () => {
        const groups = await Group.findAll();
        for (const group of groups) {
          console.log('gpid', group.id);
          const roomKey = `group-${group.id}`;
          // socket.
          const users = await group.$get('users');
          const issues = await group.$get('issues');
          for (const user of users) {
            const curUser = user.get({ plain: true });
            curUser.id === socket.id ? socket.join(roomKey) : io.in(curUser.id).socketsJoin(roomKey);
          }
          const socks = await io.fetchSockets();
          socks.forEach(sock => console.log('sock rooms', sock.rooms));
          io.to(roomKey).emit('groupInit', { ...group.get({ plain: true }), issues, users });
        }
      });

      socket.on('login', async (clientUserData, callback) => {
        try {
          const userData = {
            id: socket.id,
            ...clientUserData
          }
          user = await addUser(userData);
        } catch (error) {
          return callback(error);
        }

        socket.join(defaultRoomName);
        io.to(socket.id).emit('login', { roomId: defaultRoomName });
        socket.in(defaultRoomName)
          .emit('notification', { title: 'Someone\'s here', description: `${user.name} just entered the room` });
        io.in(defaultRoomName)
          .emit('users', await getUsers());
        callback();
      });

      socket.on('createRoom', ({ participants }) => {
        const roomId = uuidv4();
        socket.join(roomId);
        for (const participant of participants) {
          io.to(participant).socketsJoin(roomId);
        }
        createRoom(roomId, socket.id, participants);
        io.in(roomId)
          .emit('newRoom', { roomId, creator: socket.id, participants });
      });

      socket.on('sendMessage', async ({ roomId, message }) => {
        const user = await getUser(socket.id);
        const room = await getRoom(roomId);
        const roomData = { room, user, text: message };
        io.in(roomId)
          .emit('message', roomData);
      });

      socket.on('resetGroups', async () => {
        const groups = await Group.findAll();

        for (const group of groups) {
          await group.destroy();
          console.log('group destroyed', group);
          io.in('default').emit('groupDestroyed', group.get({ plain: true }));
        }
      });

      socket.on('disconnect', async () => {
        console.log('User disconnected');

        const user = await deleteUser(socket.id);
        if (user) {
          io.in(defaultRoomName)
            .emit('notification', { title: 'Someone just left', description: `${user.name} just left the room` });
          io.in(defaultRoomName)
            .emit('users', await getUsers());
        }
      });
    });
  }

  export default initSocketIo;
