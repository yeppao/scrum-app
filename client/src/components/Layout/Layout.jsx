import React, { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Toast } from 'primereact/toast';
import { AppContext } from '@context/AppContext';
import { RoomContext } from '@context/RoomContext';
import { SocketContext } from '@context/SocketContext';
import { UsersContext } from '@context/UsersContext';
import UsersList from '@components/UsersList';
import PageHeader from '@components/Layout/PageHeader';
import Stepper from '@components/Layout/Stepper';
import _ from 'lodash';


const Layout = ({ children }) => {
  const { toast, currentUser, setCurrentUser, setSelectedRoom, roomsMessages, setRoomsMessages, step } = useContext(AppContext);
  const { rooms, setRooms } = useContext(RoomContext);
  const { setSelectedGroup, setGroups } = useContext(UsersContext);
  const navigate = useNavigate();
  const { socket, peerServer } = useContext(SocketContext);

  const logout = () => {
    setCurrentUser({});
    setSelectedRoom('');
    navigate('/');
  }

  window.onpopstate = e => logout();
  //Checks to see if there's a user present
  useEffect(() => {
    if (!currentUser.displayName) return navigate('/')
  }, [navigate, currentUser]);

  useEffect(() => {
    peerServer.on('open', (id) => {
      setCurrentUser({ ...currentUser, peerId: id });
    });
  }, [peerServer, currentUser, setCurrentUser]);

  useEffect(() => {
    if (socket) {
      socket.off('groupInit');
      socket.on('groupInit', groupData => {
        console.log(groupData);
        setSelectedGroup(groupData);
        setGroups(prev => {
          const groups = _.remove(prev, (group) => group.id === groupData.id);
          groups.push(groupData);

          return groups;
        })
        // navigate(`/group/${groupData.group}`)
      });

      socket.off('groupDestroyed');
      socket.on('groupDestroyed', group => {
        setGroups(prev => _.remove(prev, storedGroup => storedGroup === group));
      })

      socket.off('message');
      socket.on('message', msgData => {
        if (msgData.roomId) {
          if (!roomsMessages[msgData.roomId]) roomsMessages[msgData.roomId] = [];
          roomsMessages[msgData.roomId].push({ user: msgData.user, text: msgData.text });
        }
        setRoomsMessages({...roomsMessages});
      });
    }
  }, [socket, roomsMessages, setRoomsMessages, setSelectedGroup, setGroups]);

  useEffect(() => {
    socket.on('notification', notif => {
      toast.current.show({severity:'success', summary: notif.description, detail:'Message Content', life: 3000});
    });
  }, [socket]);

  useEffect(() => {
    socket.off('newRoom');
    socket.on('newRoom', roomData => {

      if (!rooms[roomData.roomId]) rooms[roomData.roomId] = { participants: roomData.participants };
      setRooms({...rooms});
      if (socket.id === roomData.creator) setSelectedRoom(roomData.roomId);
    });
  }, [socket, rooms, setSelectedRoom, setRooms]);

  useEffect(() => {
    if (socket) {
      socket.io.on('error', (error) => {
        console.log('err', error);
      });
      socket.io.on('reconnect', (attempt) => {
        console.log('err reco', attempt);
      });
      socket.io.on('ping', () => {
        console.log('oping');
      });
      socket.emit('hello');
    }
  }, [socket]);

  const items = [
    { label: 'Daily' },
    { label: 'Sprint' },
    { label: 'Planning' }
  ];

  return (
    <div>
      <div
        style={{
          overflow: 'auto',
          height: '400px',
          position: 'absolute',
          zIndex: 1,
          top: 40,
          right: 40
        }}
      >
        <div className="logo" />
        <div>
          Logged In as: {currentUser.displayName}
        </div>
        <UsersList />
      </div>
      <div className="site-layout">
        <div style={{ position: 'absolute', zIndex: 1, width: '80%', top: 20, left: 20 }}>
          <div className="logo" />
          <Menubar model={items}/>
        </div>
        <div style={{ overflow: 'initial' }}>
          <div className="site-layout-background" style={{ padding: 24 }}>
            <PageHeader />
            {children}
          </div>
        </div>
        <Toast ref={toast} />
      </div>

    </div>
  );
}

export default Layout;
