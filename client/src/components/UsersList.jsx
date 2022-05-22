import React, { useContext, useCallback, useEffect } from 'react';
import { Menubar } from 'primereact/menubar';
import { UsersContext } from '@context/UsersContext';
import { AppContext } from '@context/AppContext';
import { SocketContext } from '@context/SocketContext';
import { RoomContext } from '@context/RoomContext';
import { UserOutlined, ProfileTwoTone } from '@ant-design/icons';
import _ from 'lodash';
import { Link } from 'react-router-dom';

// const avatar = 'https://joeschmoe.io/api/v1/random';

const UsersList = () => {
  const { users, groups } = useContext(UsersContext);
  const { currentUser, setSelectedRoom } = useContext(AppContext);
  const { rooms } = useContext(RoomContext);
  const { socket } = useContext(SocketContext);
  let items;
  useEffect(() => {
    items = [
      {
          label: 'Groups',
          items: groups.map(group => ({ label: `Group ${group.id}`, icon: 'pi pi-users', command: () => console.log('yeah') }))
      },
      {
        label: 'Users',
        items: users.filter(user => user.displayName !== currentUser.displayName).map((user, i) => ({ label: user.displayName, icon: 'pi pi-user', command: () => selectRoomWithUser(user) }))
      },
    ];
  })

  const selectRoom = (roomId) => {
    setSelectedRoom(roomId);
  }

  const retrieveRoomIdWithParticipants = useCallback((participants) => {
    for (const roomId in rooms) {
      if (!_.isEqual(rooms[roomId].participants ?? [], participants)) continue;
      return roomId;
    }

    return null;
  }, [rooms]);

  const selectRoomWithUser = useCallback((user) => {
    const participants = [socket.id, user.id];
    const roomId = retrieveRoomIdWithParticipants(participants);
    (!roomId) ? socket.emit('createRoom', { participants })
      : setSelectedRoom(roomId);
    socket.emit('join-room', { roomId, participantId: socket.id });
  }, [socket, retrieveRoomIdWithParticipants, setSelectedRoom]);

  return (
    <Menubar model={items} />
  );
};

export default UsersList;
