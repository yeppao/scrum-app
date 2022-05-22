import React, { useState, useCallback } from 'react';
import Peer from 'peerjs';
import io from 'socket.io-client';
import { useEffect } from 'react/cjs/react.development';

export const SocketContext = React.createContext();

const peerServer = new Peer(undefined, {
  host: window.location.hostname,
  path: '/',
  port: '3003',
  debug: 3,
});

const getUserStream = async (constraints = { audio: true, video: true }) => {
  const stream = await navigator.mediaDevices.getUserMedia(constraints);

  return stream;
}

export const SocketProvider = ({ children }) => {
  const [streams, setStreams] = useState([]);
  const socket = io(`ws://${window.location.hostname}:3002`, { transports: ['websocket', 'polling'] });

  const receiveStream = useCallback(stream => {
    setStreams(prev => {
      return (prev.filter(val => stream.id === val.id).length === 0) ?
        [...prev, stream] : prev;
    });
  }, [setStreams]);

  const callPeer = useCallback(async (peerId) => {
    const stream = await getUserStream();
    receiveStream(stream);
    const call = peerServer.call(peerId, stream);
    call.on('stream', (remoteStream) => receiveStream(remoteStream));
  }, [receiveStream]);

  useEffect(() => {
    peerServer.on('call', async call => {
      const userStream = await getUserStream();
      receiveStream(userStream);
      call.answer(userStream);
      call.on('stream', stream => receiveStream(stream));
    });
  }, [receiveStream]);

  return (
      <SocketContext.Provider value={{ socket, peerServer, streams, setStreams, callPeer }}>
          {children}
      </SocketContext.Provider>
  )
}
